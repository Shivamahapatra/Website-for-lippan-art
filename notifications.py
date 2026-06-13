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

def send_receipt_email(customer_email, customer_name, tracking_id, cart_items, total):
    EMAIL_USER = os.getenv('EMAIL_USER')
    EMAIL_PASS = os.getenv('EMAIL_PASS')

    if not EMAIL_USER or not EMAIL_PASS:
        print("--- MOCK RECEIPT EMAIL ---")
        print(f"To: {customer_email}")
        print(f"Subject: Order Confirmation - Her Lippan Art")
        print("--------------------------")
        return False

    msg = EmailMessage()
    msg['Subject'] = 'Order Confirmation - Her Lippan Art'
    msg['From'] = EMAIL_USER
    msg['To'] = customer_email

    items_html = "".join([f"<li>{item['quantity']}x {item['name']} ({item['size']}) - ₹{item['price'] * item['quantity']}</li>" for item in cart_items])
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #e67e22;">Thank You For Your Order!</h2>
        <p>Hi {customer_name},</p>
        <p>We have successfully received your payment of <strong>₹{total}</strong>.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <ul>{items_html}</ul>
            <p style="font-size: 1.2em;"><strong>Total: ₹{total}</strong></p>
        </div>
        
        <p>Your tracking ID is: <strong><span style="font-size: 1.2em; color: #2980b9;">{tracking_id}</span></strong></p>
        <p>We will notify you as soon as your order is ready for pickup.</p>
        <br>
        <p>Best regards,<br>Her Lippan Art</p>
      </body>
    </html>
    """
    
    msg.set_content("Thank you for your order! Please enable HTML to view this receipt.")
    msg.add_alternative(html_content, subtype='html')

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send receipt email: {e}")
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
