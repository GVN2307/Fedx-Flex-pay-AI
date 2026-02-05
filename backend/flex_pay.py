import json
import datetime
import os

class FlexPayAI:
    def __init__(self, current_date=None):
        if current_date:
            self.current_date = current_date
        else:
            self.current_date = datetime.date.today()
        
        # Major FedEx Events configuration
        self.major_events = {
            (4, 17): "Founders Day", # April 17th
            (12, 25): "Holiday Season" # Dec 25th
        }

    def calculate_risk_score(self, history, balance):
        """
        Calculates a risk score (0-100) based on payment history and balance.
        """
        score = 50
        
        # History Factor
        if history == 'Good':
            score -= 30
        elif history == 'Fair':
            score += 10
        elif history == 'Poor':
            score += 40
            
        # Balance Factor
        if balance > 1000:
            score += 20
        elif balance > 500:
            score += 10
            
        return max(0, min(100, score))

    def analyze_account(self, account_data):
        """
        Analyzes the account data and generates a communication plan.
        """
        payment_history = account_data.get('payment_history')
        balance = account_data.get('current_balance', 0)
        
        # Risk Model Execution
        risk_score = self.calculate_risk_score(payment_history, balance)
        
        discount_code = None
        new_due_date = None
        message = ""
        
        # Logic 1: Contextual Discounting
        if self.check_eligibility_for_discount(payment_history):
            discount_code = "EARLYBIRD3"
            
        # Logic 2: Anniversary Forgiveness
        is_anniversary_event, event_name = self.check_anniversary_event()
        
        # Generate Tone/Message
        message = self.generate_communication_plan(account_data, discount_code, is_anniversary_event, event_name)

        return {
            "account_id": account_data.get('id'),
            "risk_score": risk_score,
            "message": message,
            "discount_code": discount_code,
            "suggestion": "Pay now to save!" if discount_code else "Please update your payment."
        }

    def check_eligibility_for_discount(self, history):
        """
        If a member has a 'Good' history, offer a 3% early-payment discount.
        """
        return history == 'Good'

    def check_anniversary_event(self):
        """
        Checks if today is a major FedEx event.
        Returns (bool, event_name).
        """
        key = (self.current_date.month, self.current_date.day)
        if key in self.major_events:
            return True, self.major_events[key]
        return False, None

    def generate_communication_plan(self, data, discount_code, is_anniversary, event_name):
        """
        Constructs a professional, empathetic, and brand-aligned message.
        """
        balance = data.get('current_balance')
        due_date = data.get('due_date')
        
        lines = []
        lines.append(f"Dear Member,")
        
        if is_anniversary:
            lines.append(f"Happy {event_name}! In the spirit of celebration, we are waiving any late fees associated with your account today.")
            lines.append(f"We notice a balance of ${balance} was due on {due_date}.")
        else:
            lines.append(f"We noticed that your account has a balance of ${balance} which was due on {due_date}.")
            
        if discount_code:
            lines.append(f"As a valued member with a great history, we'd like to help. Use code '{discount_code}' to receive a 3% discount if you pay within the next 48 hours.")
            lines.append("We appreciate your partnership.")
        else:
            lines.append("We understand that things get busy. Please let us know if you need to arrange a flexible payment schedule.")
            
        lines.append("Sincerely,\nFedEx Flex-Pay Team")
        
        return "\n\n".join(lines)

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(script_dir, 'input_data.json')
    
    if not os.path.exists(input_file):
        print("Error: Input data file not found.")
        return

    with open(input_file, 'r') as f:
        data = json.load(f)

    ai = FlexPayAI() 

    print("--- FedEx Flex-Pay AI Report ---\n")
    for account in data.get('accounts', []):
        plan = ai.analyze_account(account)
        print(f"Account ID: {plan['account_id']}")
        print(f"Suggestion: {plan['suggestion']}")
        if plan['discount_code']:
            print(f"Discount Code: {plan['discount_code']}")
        print("Message Preview:")
        print("-" * 20)
        print(plan['message'])
        print("-" * 20)
        print("\n")

if __name__ == "__main__":
    main()
