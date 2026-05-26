import razorpay

# This is a skeleton for Razorpay integration.
# When moving to production online, replace with actual API keys from Razorpay Dashboard.
# Since we are building for an online deployment eventually, the setup is ready.

class PaymentGateway:
    def __init__(self, key_id, key_secret):
        self.client = razorpay.Client(auth=(key_id, key_secret))
    
    def create_order(self, amount, currency='INR'):
        """
        Create a new order in Razorpay.
        Amount should be in the smallest currency unit (e.g., paise for INR).
        """
        data = {
            "amount": int(amount * 100), # Convert rupees to paise
            "currency": currency,
            "receipt": "order_rcptid_11"
        }
        try:
            payment = self.client.order.create(data=data)
            return payment
        except Exception as e:
            print(f"Razorpay Order Creation Failed: {e}")
            return None

    def verify_payment(self, razorpay_order_id, razorpay_payment_id, razorpay_signature):
        """
        Verify the payment signature to confirm successful transaction.
        """
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        try:
            self.client.utility.verify_payment_signature(params_dict)
            return True
        except Exception as e:
            print(f"Razorpay Signature Verification Failed: {e}")
            return False
