import flex_pay
import datetime
import sys

# Redirect stdout to a file for clean reading
with open('anniversary_output.txt', 'w', encoding='utf-8') as f:
    original_stdout = sys.stdout
    sys.stdout = f
    try:
        # Mock date: April 17th
        mock_date = datetime.date(2026, 4, 17)
        ai = flex_pay.FlexPayAI(current_date=mock_date)
        
        # Create a dummy account for testing
        test_account = {
            "id": "TEST_001",
            "member_since": "2020-01-01",
            "current_balance": 100.00,
            "due_date": "2026-04-10",
            "payment_history": "Fair" # Not eligible for discount, so we focus on anniversary
        }
        
        print("--- Testing Anniversary Logic (April 17th) ---")
        plan = ai.analyze_account(test_account)
        print(f"Details for {plan['account_id']}:")
        print(plan['message'])
        
    finally:
        sys.stdout = original_stdout
