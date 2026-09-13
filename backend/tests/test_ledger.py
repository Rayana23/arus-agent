from decimal import Decimal
from app.ledger.reconcile import reconcile


def test_reconciliation_success(valid_extraction):
    result = reconcile(valid_extraction)
    assert result.valid and result.difference == Decimal("0.00")


def test_reconciliation_failure_is_not_repaired(valid_extraction):
    valid_extraction.closing_balance = Decimal("999.00")
    result = reconcile(valid_extraction)
    assert not result.valid
    assert valid_extraction.closing_balance == Decimal("999.00")


def test_duplicate_and_currency_validation(valid_extraction):
    valid_extraction.transactions[1].source_identifier = "p1-r1"
    valid_extraction.transactions[1].currency = "USD"
    result = reconcile(valid_extraction)
    assert not result.valid
    assert len(result.errors) == 2
