from app import app, db
from sqlalchemy import text

def upgrade_db():
    with app.app_context():
        print("Starting Database Upgrade V2...")
        
        # 1. Add reference_image_base64 to commission table
        try:
            print("Adding reference_image_base64 column to commission table...")
            db.session.execute(text('ALTER TABLE commission ADD COLUMN reference_image_base64 TEXT;'))
            db.session.commit()
            print("Column added successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"Column might already exist or error occurred: {e}")
            
        print("Upgrade V2 Complete!")

if __name__ == '__main__':
    upgrade_db()
