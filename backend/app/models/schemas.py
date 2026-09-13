from datetime import date
from decimal import Decimal
from enum import StrEnum
from pydantic import BaseModel, ConfigDict, Field, field_validator


class StatementState(StrEnum):
    DISCOVERED = "discovered"
    PROCESSING = "processing"
    NEEDS_PASSWORD = "needs_password"
    NEEDS_REVIEW = "needs_review"
    IMPORTED = "imported"
    UNSUPPORTED = "unsupported"
    FAILED = "failed"


class Direction(StrEnum):
    DEBIT = "debit"
    CREDIT = "credit"


class TransactionExtraction(BaseModel):
    model_config = ConfigDict(extra="forbid")
    source_identifier: str
    date: date
    description: str = Field(min_length=1, max_length=300)
    direction: Direction
    amount: Decimal = Field(gt=0, max_digits=16, decimal_places=2)
    currency: str = Field(pattern=r"^[A-Z]{3}$")
    page_reference: int = Field(ge=1)
    suggested_merchant: str | None = None
    suggested_category: str | None = None
    category_confidence: Decimal | None = Field(default=None, ge=0, le=1)

    @field_validator("amount")
    @classmethod
    def exact_minor_units(cls, value: Decimal) -> Decimal:
        if value.as_tuple().exponent < -2:
            raise ValueError("amount exceeds currency minor-unit precision")
        return value


class StatementExtraction(BaseModel):
    model_config = ConfigDict(extra="forbid")
    institution: str | None = None
    masked_account_identifier: str | None = None
    account_type: str | None = None
    currency: str | None = Field(default=None, pattern=r"^[A-Z]{3}$")
    statement_start_date: date | None = None
    statement_end_date: date | None = None
    opening_balance: Decimal | None = Field(default=None, max_digits=16, decimal_places=2)
    closing_balance: Decimal | None = Field(default=None, max_digits=16, decimal_places=2)
    card_due_amount: Decimal | None = Field(default=None, max_digits=16, decimal_places=2)
    card_due_date: date | None = None
    transactions: list[TransactionExtraction] = Field(default_factory=list)
    extraction_warnings: list[str] = Field(default_factory=list)
    source_pages: list[int] = Field(default_factory=list)


class ValidationResult(BaseModel):
    valid: bool
    expected_closing_balance: Decimal | None = None
    reported_closing_balance: Decimal | None = None
    difference: Decimal | None = None
    errors: list[str] = Field(default_factory=list)


class ProviderHealth(BaseModel):
    provider: str
    configured_model: str
    status: str
    latency_ms: int
    error_type: str | None = None
