let cart = {};


function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}


function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    // Count total items in cart
    let total = 0;
    for (let id in cart) {
        total += cart[id].qty;
    }
    badge.textContent = total;
}


function addItem(event, id, name, price, icon) {
    event.stopPropagation(); 

    if (cart[id]) {
        cart[id].qty += 1; 
    } else {
        cart[id] = { name, price, icon, qty: 1 }; 
    }

    updateBadge();
    showToast('✅ ' + name + ' added to cart!');
}


function removeItem(id) {
    delete cart[id];
    updateBadge();
    renderCartSidebar();
}


function increaseQty(id) {
    if (cart[id]) cart[id].qty += 1;
    updateBadge();
    renderCartSidebar();
}

function decreaseQty(id) {
    if (cart[id]) {
        if (cart[id].qty > 1) {
            cart[id].qty -= 1;
        } else {
            delete cart[id];
        }
    }
    updateBadge();
    renderCartSidebar();
}


function cartTotal() {
    let total = 0;
    for (let id in cart) {
        total += cart[id].price * cart[id].qty;
    }
    return total;
}

function cartCount() {
    let count = 0;
    for (let id in cart) {
        count += cart[id].qty;
    }
    return count;
}


function openCart() {
    document.getElementById('cartOverlay').classList.add('open');
    document.getElementById('cartSidebar').classList.add('open');
    renderCartSidebar();
}

function closeCart() {
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('cartSidebar').classList.remove('open');
}


function renderCartSidebar() {
    const cartList   = document.getElementById('cartItemsList');
    const countLabel = document.getElementById('cartHeadCount');
    const totalLabel = document.getElementById('cartTotalAmt');

    const count = cartCount();
    countLabel.textContent = count + ' item' + (count !== 1 ? 's' : '');
    totalLabel.textContent = '₹' + cartTotal();

    if (count === 0) {
        cartList.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon">🛒</div>
                <p>Your cart is empty.<br>Start adding snacks!</p>
            </div>`;
        return;
    }

    let html = '';
    for (let id in cart) {
        const item = cart[id];
        html += `
            <div class="cart-item">
                <div style="flex:1;">
                    <div class="cart-item-name">${item.icon} ${item.name}</div>
                    <div class="cart-item-price">₹${item.price} × ${item.qty}</div>
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button class="btn-small" onclick="decreaseQty(${id})">−</button>
                    <button class="btn-small" onclick="increaseQty(${id})">+</button>
                    <button class="btn-small" onclick="removeItem(${id})" style="background:#ff6b35;">✕</button>
                </div>
            </div>`;
    }
    cartList.innerHTML = html;
}


function openCheckout() {
    if (cartCount() === 0) {
        showToast('🛒 Your cart is empty! Add some products first.');
        return;
    }
    closeCart();
    renderCheckoutSummary();
    document.getElementById('checkoutModalBg').classList.add('open');
}

function closeCheckout() {
    document.getElementById('checkoutModalBg').classList.remove('open');
}


function renderCheckoutSummary() {
    const summary  = document.getElementById('checkoutSummaryBox');
    const total    = cartTotal();
    const discount = Math.floor(total * 0.10); 
    const delivery = total >= 199 ? 0 : 30;   
    const finalTotal = total - discount + delivery;

    summary.innerHTML = `
        <div style="font-size:13px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span>Subtotal:</span><span>₹${total}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;color:#2e7d32;">
                <span>Discount (10%):</span><span>-₹${discount}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
                <span>Delivery:</span>
                <span style="color:#2e7d32;">${delivery === 0 ? 'FREE' : '₹30'}</span>
            </div>
            <div style="font-weight:700;font-size:16px;display:flex;justify-content:space-between;">
                <span>Total:</span>
                <span style="color:#ff6b35;">₹${finalTotal}</span>
            </div>
        </div>`;
}


function placeOrder() {
    const name    = document.getElementById('co_name').value.trim();
    const phone   = document.getElementById('co_phone').value.trim();
    const hostel  = document.getElementById('co_hostel').value;
    const floor   = document.getElementById('co_floor').value;
    const room    = document.getElementById('co_room').value.trim();
    const payment = document.getElementById('co_payment').value;

    if (!name || !phone || !hostel || !floor || !room || !payment) {
        showToast('❌ Please fill all required fields!');
        return;
    }
    if (phone.length !== 10 || isNaN(phone)) {
        showToast('❌ Please enter a valid 10-digit phone number!');
        return;
    }

    closeCheckout();
    document.getElementById('successModalBg').classList.add('open');

    const orderId = 'DD' + Math.floor(Math.random() * 900000 + 100000);
    document.getElementById('successOrderId').textContent = orderId;
    document.getElementById('successDeliveryNote').innerHTML =
        `<strong>Delivery to:</strong> ${hostel}, Floor ${floor}, Room ${room}
         <br><strong>Contact:</strong> ${phone}`;

    cart = {};
    updateBadge();
}


function closeSuccess() {
    document.getElementById('successModalBg').classList.remove('open');
    window.location.href = 'index.html';
}



