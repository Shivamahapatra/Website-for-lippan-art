import os
import base64
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from models import db, Product, Review, Commission, Order, OrderItem, ContactMessage
from notifications import send_ready_email, send_ready_sms
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

# Fix for Neon Postgres dropping idle connections
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True,
    'pool_recycle': 300,
}

db.init_app(app)

# Razorpay setup
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', 'test_key_id')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', 'test_key_secret')
rzp_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# --- STOREFRONT ROUTES ---

@app.route('/')
def index():
    sort_by = request.args.get('sort', 'newest')
    filter_size = request.args.get('size', '')

    query = Product.query

    if filter_size:
        query = query.filter(Product.sizes.ilike(f'%{filter_size}%'))
        
    if sort_by == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.id.desc())
        
    products = query.all()
    
    # Extract unique sizes for the filter dropdown
    all_products = Product.query.all()
    unique_sizes = set()
    for p in all_products:
        if p.sizes:
            sizes_list = [s.strip() for s in p.sizes.split(',')]
            unique_sizes.update(sizes_list)
            
    return render_template('index.html', products=products, unique_sizes=sorted(list(unique_sizes)), current_sort=sort_by, current_size=filter_size)

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
        
        reference_image_base64 = None
        cloudinary_url = request.form.get('cloudinary_url')
        if cloudinary_url:
            reference_image_base64 = cloudinary_url
        else:
            # Fallback for old forms if any
            image_file = request.files.get('image_file')
            if image_file and image_file.filename:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                mime_type = image_file.content_type or 'image/jpeg'
                reference_image_base64 = f"data:{mime_type};base64,{encoded_string}"
        
        commission = Commission(customer_name=customer_name, email=email, details=details, size_requested=size_requested, reference_image_base64=reference_image_base64)
        db.session.add(commission)
        db.session.commit()
        flash('Your commission request has been received. We will get back to you soon!', 'success')
        return redirect(url_for('commissions'))
    return render_template('commissions.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        contact_msg = ContactMessage(name=name, email=email, message=message)
        db.session.add(contact_msg)
        db.session.commit()
        flash('Your message has been sent successfully!', 'success')
        return redirect(url_for('contact'))
    return render_template('contact.html')

@app.route('/cart', methods=['GET'])
def cart():
    cart_items = session.get('cart', [])
    total = sum(item['price'] * item['quantity'] for item in cart_items)
    return render_template('cart.html', cart_items=cart_items, total=total)

@app.route('/cart/add', methods=['POST'])
def add_to_cart():
    product_id = request.form.get('product_id')
    size = request.form.get('size')
    
    product = Product.query.get_or_404(product_id)
    cart_items = session.get('cart', [])
    
    # Check if already in cart
    found = False
    for item in cart_items:
        if str(item['product_id']) == str(product_id) and item['size'] == size:
            item['quantity'] += 1
            found = True
            break
            
    if not found:
        # Use image_base64 if available, otherwise first image_path
        img = product.image_base64
        if not img:
            img_path = product.image_paths.split(',')[0].strip()
            if img_path.startswith('data:') or img_path.startswith('http'):
                img = img_path
            else:
                img = url_for('static', filename='images/' + img_path)
                
        cart_items.append({
            'product_id': product.id,
            'name': product.name,
            'size': size,
            'price': product.price,
            'quantity': 1,
            'image': img
        })
        
    session['cart'] = cart_items
    flash(f'{product.name} added to your cart!', 'success')
    return redirect(url_for('cart'))

@app.route('/cart/remove/<int:index>', methods=['POST'])
def remove_from_cart(index):
    cart_items = session.get('cart', [])
    if 0 <= index < len(cart_items):
        item = cart_items.pop(index)
        session['cart'] = cart_items
        flash(f"{item['name']} removed from cart.", 'info')
    return redirect(url_for('cart'))

@app.route('/checkout', methods=['GET'])
def checkout():
    cart_items = session.get('cart', [])
    if not cart_items:
        flash('Your cart is empty.', 'error')
        return redirect(url_for('index'))
        
    total = sum(item['price'] * item['quantity'] for item in cart_items)
    return render_template('checkout.html', cart_items=cart_items, total=total, razorpay_key_id=RAZORPAY_KEY_ID)

@app.route('/api/create-order', methods=['POST'])
def create_order():
    cart_items = session.get('cart', [])
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400
        
    total = sum(item['price'] * item['quantity'] for item in cart_items)
    amount_in_paise = int(total * 100)
    
    if amount_in_paise < 100:
        return jsonify({'error': 'Amount too small'}), 400
        
    try:
        order = rzp_client.order.create({
            'amount': amount_in_paise,
            'currency': 'INR',
            'receipt': f'receipt_{uuid.uuid4().hex[:10]}'
        })
        return jsonify({'order_id': order['id'], 'amount': order['amount'], 'currency': order['currency']})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/verify-payment', methods=['POST'])
def verify_payment():
    data = request.json
    razorpay_order_id = data.get('razorpay_order_id')
    razorpay_payment_id = data.get('razorpay_payment_id')
    razorpay_signature = data.get('razorpay_signature')
    
    if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
        return jsonify({'error': 'Missing payment data'}), 400
        
    try:
        rzp_client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })
    except razorpay.errors.SignatureVerificationError:
        return jsonify({'error': 'Signature verification failed'}), 400
        
    cart_items = session.get('cart', [])
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400
        
    total = sum(item['price'] * item['quantity'] for item in cart_items)
    tracking_id = str(uuid.uuid4())[:8].upper()
    
    order = Order(
        customer_name=data.get('customer_name'), 
        email=data.get('email'), 
        phone_number=data.get('phone_number'),
        total_amount=total,
        tracking_id=tracking_id,
        razorpay_order_id=razorpay_order_id,
        razorpay_payment_id=razorpay_payment_id,
        razorpay_signature=razorpay_signature,
        payment_status='Paid'
    )
    db.session.add(order)
    db.session.flush()
    
    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item['product_id'],
            size=item['size'],
            quantity=item['quantity'],
            price=item['price']
        )
        db.session.add(order_item)
        
    db.session.commit()
    
    # Clear the cart after successful order
    session.pop('cart', None)
    
    return jsonify({'success': True, 'tracking_id': tracking_id})

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

@app.route('/admin/inventory/add', methods=['POST'])
def add_inventory():
    if not check_admin(): return redirect(url_for('admin_login'))
    name = request.form.get('name')
    description = request.form.get('description')
    price = request.form.get('price')
    sizes = request.form.get('sizes')
    
    image_paths = "default.jpg"
    image_base64 = None
    cloudinary_url = request.form.get('cloudinary_url')
    if cloudinary_url:
        image_base64 = cloudinary_url
    else:
        # Fallback for old base64
        image_file = request.files.get('image_file')
        if image_file and image_file.filename:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            mime_type = image_file.content_type or 'image/jpeg'
            image_base64 = f"data:{mime_type};base64,{encoded_string}"
        else:
            # Fallback to old text input if they used it
            fallback_path = request.form.get('image_paths')
            if fallback_path:
                image_paths = fallback_path
    
    product = Product(name=name, description=description, price=float(price), sizes=sizes, image_paths=image_paths, image_base64=image_base64)
    db.session.add(product)
    db.session.commit()
    flash('Product added successfully!', 'success')
    return redirect(url_for('admin_inventory'))

@app.route('/admin/inventory/edit/<int:product_id>', methods=['GET', 'POST'])
def edit_inventory(product_id):
    if not check_admin(): return redirect(url_for('admin_login'))
    product = Product.query.get_or_404(product_id)
    if request.method == 'POST':
        product.name = request.form.get('name')
        product.description = request.form.get('description')
        product.price = float(request.form.get('price'))
        product.sizes = request.form.get('sizes')
        
        cloudinary_url = request.form.get('cloudinary_url')
        if cloudinary_url:
            product.image_base64 = cloudinary_url
        else:
            image_file = request.files.get('image_file')
            if image_file and image_file.filename:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                mime_type = image_file.content_type or 'image/jpeg'
                product.image_base64 = f"data:{mime_type};base64,{encoded_string}"
            
        db.session.commit()
        flash('Product updated successfully!', 'success')
        return redirect(url_for('admin_inventory'))
    return render_template('admin_product_edit.html', product=product)

@app.route('/admin/inventory/delete/<int:product_id>', methods=['POST'])
def delete_inventory(product_id):
    if not check_admin(): return redirect(url_for('admin_login'))
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    flash('Product deleted!', 'success')
    return redirect(url_for('admin_inventory'))

@app.route('/admin/contacts')
def admin_contacts():
    if not check_admin(): return redirect(url_for('admin_login'))
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    return render_template('admin_contacts.html', messages=messages)

@app.route('/admin/commissions')
def admin_commissions():
    if not check_admin(): return redirect(url_for('admin_login'))
    commissions = Commission.query.order_by(Commission.created_at.desc()).all()
    return render_template('admin_commissions.html', commissions=commissions)

@app.route('/admin/orders')
def admin_orders():
    if not check_admin(): return redirect(url_for('admin_login'))
    orders = Order.query.order_by(Order.created_at.desc()).all()
    stages = ['Order Received', 'Prepping Board', 'Clay & Mirror Work', 'Drying', 'Ready for Pickup']
    return render_template('admin_orders.html', orders=orders, stages=stages)

@app.route('/admin/orders/advance/<int:order_id>', methods=['POST'])
def advance_order(order_id):
    if not check_admin(): return redirect(url_for('admin_login'))
    order = Order.query.get_or_404(order_id)
    stages = ['Order Received', 'Prepping Board', 'Clay & Mirror Work', 'Drying', 'Ready for Pickup']
    
    current_idx = stages.index(order.status) if order.status in stages else 0
    if current_idx < len(stages) - 1:
        order.status = stages[current_idx + 1]
        db.session.commit()
        flash(f'Order advanced to {order.status}', 'success')
        
        # Trigger notifications if ready
        if order.status == 'Ready for Pickup':
            items_str = ", ".join([f"{item.quantity}x {item.product.name} ({item.size})" for item in order.items])
            send_ready_email(order.email, order.customer_name, items_str)
            send_ready_sms(order.phone_number, order.customer_name)
            
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
