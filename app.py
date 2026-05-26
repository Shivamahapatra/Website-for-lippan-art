import os
from flask import Flask, render_template, request, redirect, url_for, flash, session
from models import db, Product, Review, Commission, Order, OrderItem
import razorpay
import uuid
from dotenv import load_dotenv

load_dotenv() # Load variables from .env if present

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback_development_key_123')

# Database Configuration
database_url = os.getenv('DATABASE_URL', 'sqlite:///lippan_art.db')
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Razorpay setup
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', 'test_key_id')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', 'test_key_secret')
rzp_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# --- STOREFRONT ROUTES ---

@app.route('/')
def index():
    products = Product.query.all()
    return render_template('index.html', products=products)

@app.route('/product/<int:product_id>')
def product(product_id):
    product = Product.query.get_or_404(product_id)
    return render_template('product.html', product=product)

@app.route('/product/<int:product_id>/review', methods=['POST'])
def add_review(product_id):
    reviewer_name = request.form.get('reviewer_name')
    rating = request.form.get('rating')
    text = request.form.get('text')
    
    review = Review(product_id=product_id, reviewer_name=reviewer_name, rating=rating, text=text)
    db.session.add(review)
    db.session.commit()
    flash('Thank you for your review!', 'success')
    return redirect(url_for('product', product_id=product_id))

@app.route('/commissions', methods=['GET', 'POST'])
def commissions():
    if request.method == 'POST':
        customer_name = request.form.get('customer_name')
        email = request.form.get('email')
        details = request.form.get('details')
        size_requested = request.form.get('size_requested')
        
        commission = Commission(customer_name=customer_name, email=email, details=details, size_requested=size_requested)
        db.session.add(commission)
        db.session.commit()
        flash('Your commission request has been received. We will get back to you soon!', 'success')
        return redirect(url_for('commissions'))
    return render_template('commissions.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
    # In a real app, you would have a cart system.
    # Here we are simulating a checkout for a specific product.
    product_id = request.args.get('product_id')
    size = request.args.get('size')
    
    if not product_id:
        return redirect(url_for('index'))
        
    product = Product.query.get_or_404(product_id)
    
    if request.method == 'POST':
        customer_name = request.form.get('customer_name')
        email = request.form.get('email')
        shipping_address = request.form.get('shipping_address')
        
        tracking_id = str(uuid.uuid4())[:8].upper()
        
        order = Order(
            customer_name=customer_name, 
            email=email, 
            shipping_address=shipping_address,
            total_amount=product.price, # simplified
            tracking_id=tracking_id
        )
        db.session.add(order)
        db.session.flush() # to get order.id
        
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            size=size or product.sizes.split(',')[0].strip(),
            quantity=1,
            price=product.price
        )
        db.session.add(order_item)
        db.session.commit()
        
        # In a real app, initialize Razorpay payment here
        # return render_template('payment.html', order=order, key_id=RAZORPAY_KEY_ID)
        flash(f'Order placed successfully! Your tracking ID is {tracking_id}', 'success')
        return redirect(url_for('track_order', tracking_id=tracking_id))
        
    return render_template('checkout.html', product=product, size=size)

@app.route('/track', methods=['GET'])
def track_order():
    tracking_id = request.args.get('tracking_id')
    order = None
    if tracking_id:
        order = Order.query.filter_by(tracking_id=tracking_id).first()
        if not order:
            flash('Invalid Tracking ID.', 'danger')
    return render_template('order_tracking.html', order=order)

# --- ADMIN ROUTES ---

def check_admin():
    if not session.get('admin_logged_in'):
        return False
    return True

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        password = request.form.get('password')
        if password == os.getenv('ADMIN_PASSWORD', 'mom123'): # Configurable admin password
            session['admin_logged_in'] = True
            return redirect(url_for('admin_inventory'))
        flash('Invalid password', 'danger')
    return render_template('admin_login.html')

@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('admin_login'))

@app.route('/admin')
@app.route('/admin/inventory')
def admin_inventory():
    if not check_admin(): return redirect(url_for('admin_login'))
    products = Product.query.all()
    return render_template('admin_inventory.html', products=products)

@app.route('/admin/inventory/update/<int:product_id>', methods=['POST'])
def update_inventory(product_id):
    if not check_admin(): return redirect(url_for('admin_login'))
    product = Product.query.get_or_404(product_id)
    product.price = float(request.form.get('price'))
    db.session.commit()
    flash('Price updated!', 'success')
    return redirect(url_for('admin_inventory'))

@app.route('/admin/commissions')
def admin_commissions():
    if not check_admin(): return redirect(url_for('admin_login'))
    commissions = Commission.query.order_by(Commission.created_at.desc()).all()
    return render_template('admin_commissions.html', commissions=commissions)

@app.route('/admin/orders')
def admin_orders():
    if not check_admin(): return redirect(url_for('admin_login'))
    orders = Order.query.order_by(Order.created_at.desc()).all()
    stages = ['Order Received', 'Prepping Board', 'Clay & Mirror Work', 'Drying', 'Shipped']
    return render_template('admin_orders.html', orders=orders, stages=stages)

@app.route('/admin/orders/advance/<int:order_id>', methods=['POST'])
def advance_order(order_id):
    if not check_admin(): return redirect(url_for('admin_login'))
    order = Order.query.get_or_404(order_id)
    stages = ['Order Received', 'Prepping Board', 'Clay & Mirror Work', 'Drying', 'Shipped']
    
    current_idx = stages.index(order.status) if order.status in stages else 0
    if current_idx < len(stages) - 1:
        order.status = stages[current_idx + 1]
        db.session.commit()
        flash(f'Order advanced to {order.status}', 'success')
    return redirect(url_for('admin_orders'))

# --- SETUP ---

def setup_database():
    with app.app_context():
        db.create_all()
        # Seed some initial data if empty
        if not Product.query.first():
            p1 = Product(name='Traditional Lippan Art Mirror', description='Beautiful hand-crafted mud and mirror work.', price=2500.0, sizes='12x12, 18x18', image_paths='sample1.jpg')
            p2 = Product(name='Geometric Lippan Mandala', description='Modern geometric patterns combined with traditional art.', price=3500.0, sizes='24x24', image_paths='sample2.jpg')
            db.session.add_all([p1, p2])
            db.session.commit()

# Run this via a separate script for Render, not at the module level!
# setup_database()

if __name__ == '__main__':
    app.run(debug=True)
