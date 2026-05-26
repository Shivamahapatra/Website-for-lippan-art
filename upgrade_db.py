from app import db, app
from sqlalchemy import text

with app.app_context():
    try:
        # Try to rename the column (from previous upgrade)
        try:
            db.session.execute(text('ALTER TABLE "order" RENAME COLUMN shipping_address TO phone_number;'))
        except:
            pass # Ignore if already renamed

        # Add Razorpay fields
        try:
            db.session.execute(text('ALTER TABLE "order" ADD COLUMN razorpay_order_id VARCHAR(100);'))
            db.session.execute(text('ALTER TABLE "order" ADD COLUMN razorpay_payment_id VARCHAR(100);'))
            db.session.execute(text('ALTER TABLE "order" ADD COLUMN razorpay_signature VARCHAR(200);'))
            db.session.execute(text('ALTER TABLE "order" ADD COLUMN payment_status VARCHAR(20) DEFAULT \'Pending\';'))
        except:
            pass # Ignore if already added

        # Change image_paths to TEXT for Base64
        try:
            db.session.execute(text('ALTER TABLE product ALTER COLUMN image_paths TYPE TEXT;'))
        except:
            pass # Ignore if already TEXT or on SQLite
            
        db.session.commit()
        print("Successfully upgraded the database schema.")
    except Exception as e:
        db.session.rollback()
        print("Schema upgrade skipped or failed. It might have already been updated. Error:", e)
