import unittest
import datetime
from flex_pay import FlexPayAI

class TestFlexPayAI(unittest.TestCase):
    def setUp(self):
        # Default setup with a random non-event date
        self.ai = FlexPayAI(current_date=datetime.date(2025, 1, 10))

    def test_discount_eligibility_good(self):
        """Test that 'Good' history qualifies for discount."""
        self.assertTrue(self.ai.check_eligibility_for_discount('Good'))

    def test_discount_eligibility_fair(self):
        """Test that 'Fair' history does not qualify for discount."""
        self.assertFalse(self.ai.check_eligibility_for_discount('Fair'))

    def test_discount_eligibility_poor(self):
        """Test that 'Poor' history does not qualify for discount."""
        self.assertFalse(self.ai.check_eligibility_for_discount('Poor'))

    def test_anniversary_event_true(self):
        """Test that April 17th is identified as Founders Day."""
        ai_anniversary = FlexPayAI(current_date=datetime.date(2026, 4, 17))
        is_event, name = ai_anniversary.check_anniversary_event()
        self.assertTrue(is_event)
        self.assertEqual(name, "Founders Day")

    def test_anniversary_event_false(self):
        """Test that a random date is not an event."""
        is_event, name = self.ai.check_anniversary_event()
        self.assertFalse(is_event)
        self.assertIsNone(name)

    def test_message_generation_discount(self):
        """Test message content when discount is applied."""
        data = {
            "id": "T1",
            "current_balance": 100.0,
            "due_date": "2025-01-01",
            "payment_history": "Good"
        }
        plan = self.ai.analyze_account(data)
        self.assertIn("EARLYBIRD3", plan['message'])
        self.assertIn("3% discount", plan['message'])
        self.assertEqual(plan['discount_code'], "EARLYBIRD3")

    def test_message_generation_no_discount(self):
        """Test message content when no discount is applicable."""
        data = {
            "id": "T2",
            "current_balance": 100.0,
            "due_date": "2025-01-01",
            "payment_history": "Fair"
        }
        plan = self.ai.analyze_account(data)
        self.assertNotIn("EARLYBIRD3", plan['message'])
        self.assertIn("flexible payment schedule", plan['message'])

    def test_message_generation_anniversary(self):
        """Test message content during an anniversary event."""
        ai_anniversary = FlexPayAI(current_date=datetime.date(2026, 4, 17))
        data = {
            "id": "T3",
            "current_balance": 100.0,
            "due_date": "2025-01-01",
            "payment_history": "Fair"
        }
        plan = ai_anniversary.analyze_account(data)
        self.assertIn("Happy Founders Day", plan['message'])
        self.assertIn("waiving any late fees", plan['message'])

if __name__ == '__main__':
    unittest.main()
