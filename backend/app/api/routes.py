import uuid
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from app.documents.processor import PDFProcessor, PasswordRequired, UnsupportedDocument
from app.ledger.reconcile import reconcile
from app.models.db import AgentRun, SessionLocal, StatementRecord
from app.models.schemas import StatementState
from app.providers.openrouter import OpenRouterClient, ProviderError

router = APIRouter(prefix="/api")
processor = PDFProcessor()


@router.get("/provider/openrouter/health")
async def provider_health():
    return await OpenRouterClient().health()


@router.post("/statements/import")
async def import_statement(pdf: UploadFile = File(...), user_id: str = Form(...), bank_layout: str = Form(...), pdf_password: str = Form(...)):
    content = await pdf.read()
    digest = processor.hash_bytes(content)
    with SessionLocal() as db:
        existing = db.scalar(select(StatementRecord).where(StatementRecord.attachment_sha256 == digest))
        if existing:
            return {"statement_id": existing.id, "state": existing.state, "duplicate": True}
        record = StatementRecord(user_id=user_id, attachment_sha256=digest, bank_layout=bank_layout, state=StatementState.PROCESSING)
        db.add(record); db.commit(); db.refresh(record)
        try:
            pages = processor.extract(content, pdf_password)
            extraction = await OpenRouterClient().extract(pages)
            validation = reconcile(extraction)
            record.model_extraction = extraction.model_dump(mode="json")
            record.accepted_records = extraction.model_dump(mode="json") if validation.valid else None
            record.state = StatementState.IMPORTED if validation.valid else StatementState.NEEDS_REVIEW
            record.safe_error = None if validation.valid else "; ".join(validation.errors)
            db.commit()
            return {"statement_id": record.id, "state": record.state, "duplicate": False, "validation": validation}
        except PasswordRequired as exc:
            record.state = StatementState.NEEDS_PASSWORD; record.safe_error = str(exc); db.commit()
            return {"statement_id": record.id, "state": record.state, "duplicate": False}
        except UnsupportedDocument as exc:
            record.state = StatementState.UNSUPPORTED; record.safe_error = str(exc); db.commit()
            raise HTTPException(422, {"code": exc.code, "message": str(exc)})
        except ProviderError as exc:
            record.state = StatementState.NEEDS_REVIEW; record.safe_error = str(exc); db.commit()
            raise HTTPException(503, {"code": "provider_failed", "message": "Structured extraction needs review."})


@router.post("/sync")
async def sync():
    return {"job_id": f"job_{uuid.uuid4().hex[:12]}", "adapter": "synthetic", "status": "queued"}


@router.get("/jobs/{job_id}")
async def job(job_id: str): return {"job_id": job_id, "status": "completed"}


@router.get("/statements")
async def list_statements():
    with SessionLocal() as db:
        rows = db.scalars(select(StatementRecord).order_by(StatementRecord.created_at.desc())).all()
        return [{"id": row.id, "state": row.state, "bank_layout": row.bank_layout, "created_at": row.created_at} for row in rows]


@router.get("/statements/{statement_id}")
async def statement(statement_id: int):
    with SessionLocal() as db:
        row = db.get(StatementRecord, statement_id)
        if not row: raise HTTPException(404, "Statement not found")
        return {"id": row.id, "state": row.state, "extraction": row.model_extraction, "accepted": row.accepted_records, "corrections": row.user_corrections}


@router.post("/statements/{statement_id}/password")
async def retry_password(statement_id: int): return {"statement_id": statement_id, "state": "processing"}


@router.get("/overview")
async def overview():
    with SessionLocal() as db:
        rows = db.scalars(select(StatementRecord).where(StatementRecord.state == StatementState.IMPORTED)).all()
        return {"verified_statement_count": len(rows), "excluded_invalid_statements": db.query(StatementRecord).count() - len(rows)}


@router.get("/agent-runs/{job_id}")
async def agent_runs(job_id: str):
    with SessionLocal() as db:
        rows = db.scalars(select(AgentRun).where(AgentRun.job_id == job_id)).all()
        return [{"stage": row.stage, "provider": row.provider, "model": row.model, "status": row.status, "duration_ms": row.duration_ms, "record_count": row.record_count, "retry_count": row.retry_count, "timestamp": row.created_at, "redacted_error": row.redacted_error} for row in rows]
