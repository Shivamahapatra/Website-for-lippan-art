import os
import smtplib
from email.message import EmailMessage

# To use real SMS, we need the twilio library: pip install twilio
try:
    from twilio.rest import Client
except ImportError:
    Client = None

def send_ready_email(customer_email, customer_name, order_details):
    # Setup your sender email here. Gmail requires an App Password.
    EMAIL_USER = os.getenv('EMAIL_USER')
    EMAIL_PASS = os.getenv('EMAIL_PASS')

    if not EMAIL_USER or not EMAIL_PASS:
        print(f"--- MOCK EMAIL ---")
        print(f"To: {customer_email}")
        print(f"Subject: Your Lippan Art is Ready for Pickup!")
        print(f"Body: Hello {customer_name}, your order is finished and ready for pickup!")
        print(f"------------------")
        return False

    msg = EmailMessage()
    msg.set_content(f"Hello {customer_name},\n\nGreat news! Your Lippan Art order is finished and ready for pickup.\n\nOrder Details:\n{order_details}\n\nPlease reply to this email or contact us to arrange a pickup time.\n\nThank you,\nHer Lippan Art")
    msg['Subject'] = 'Your Lippan Art is Ready for Pickup!'
    msg['From'] = EMAIL_USER
    msg['To'] = customer_email

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def send_ready_sms(customer_phone, customer_name):
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

    if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER]) or not Client:
        print(f"--- MOCK SMS ---")
        print(f"To: {customer_phone}")
        print(f"Message: Hello {customer_name}, your Lippan Art order is ready for pickup! Check your email for details.")
        print(f"----------------")
        return False

    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=f"Hello {customer_name}, your Lippan Art order is ready for pickup! Check your email for details.",
            from_=TWILIO_PHONE_NUMBER,
            to=customer_phone
        )
        return True
    except Exception as e:
        print(f"Failed to send SMS: {e}")
        return False
