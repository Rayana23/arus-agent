from decimal import Decimal
from app.models.schemas import StatementExtraction, ValidationResult


MINOR_UNIT = Decimal("0.01")


def reconcile(statement: StatementExtraction) -> ValidationResult:
    errors: list[str] = []
    required = (statement.institution, statement.currency, statement.statement_start_date, statement.statement_end_date, statement.opening_balance, statement.closing_balance)
    if any(value is None for value in required):
        errors.append("Required statement fields are missing.")
    if statement.statement_start_date and statement.statement_end_date and statement.statement_start_date > statement.statement_end_date:
        errors.append("Statement dates are not in chronological order.")
    ids = [txn.source_identifier for txn in statement.transactions]
    if len(ids) != len(set(ids)):
        errors.append("Duplicate transaction source identifiers were found.")
    if statement.currency and any(txn.currency != statement.currency for txn in statement.transactions):
        errors.append("Transaction currency differs from statement currency.")
    if statement.statement_start_date and statement.statement_end_date and any(not statement.statement_start_date <= txn.date <= statement.statement_end_date for txn in statement.transactions):
        errors.append("A transaction date falls outside the statement period.")
    if statement.opening_balance is None or statement.closing_balance is None:
        return ValidationResult(valid=False, errors=errors)
    credits = sum((t.amount for t in statement.transactions if t.direction == "credit"), Decimal("0"))
    debits = sum((t.amount for t in statement.transactions if t.direction == "debit"), Decimal("0"))
    expected = (statement.opening_balance + credits - debits).quantize(MINOR_UNIT)
    reported = statement.closing_balance.quantize(MINOR_UNIT)
    difference = (expected - reported).copy_abs()
    if difference > MINOR_UNIT:
        errors.append("Opening balance plus credits minus debits does not match the closing balance.")
    return ValidationResult(valid=not errors, expected_closing_balance=expected, reported_closing_balance=reported, difference=difference, errors=errors)
