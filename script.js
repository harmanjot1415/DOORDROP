function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

let cart = {};

function openCart() {
    document.getElementById('cartOverlay').classList.add('open');
    document.getElementById('cartSidebar').classList.add('open');
    renderCartSidebar();
}
function closeCart() {
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('cartSidebar').classList.remove('open');
}
function openCheckout() {
    if (Object.keys(cart).length === 0) {
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

function cartTotal() {
    return Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
}
function cartCount() {
    return Object.values(cart).reduce((s, i) => s + i.qty, 0);
}
function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const n = cartCount();
    badge.textContent = n;
    badge.classList.remove('pop');
    void badge.offsetWidth;
    if (n > 0) badge.classList.add('pop');
}

function addItem(event, id, name, price, icon) {
    event.stopPropagation();
    if (cart[id]) cart[id].qty += 1;
    else cart[id] = { name, price, icon, qty: 1 };
    updateBadge();
    showToast(`✅ ${name} added to cart!`);
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
        if (cart[id].qty > 1) cart[id].qty -= 1;
        else delete cart[id];
    }
    updateBadge();
    renderCartSidebar();
}

function renderCartSidebar() {
    const cartList = document.getElementById('cartItemsList');
    const cartCount_el = document.getElementById('cartHeadCount');
    const cartTotal_el = document.getElementById('cartTotalAmt');
    const count = cartCount();

    cartCount_el.textContent = count + ' item' + (count !== 1 ? 's' : '');
    cartTotal_el.textContent = '₹' + cartTotal();

    if (count === 0) {
        cartList.innerHTML = `<div class="cart-empty-state"><div class="cart-empty-icon">🛒</div><p>Your cart is empty.<br>Start adding snacks!</p></div>`;
        return;
    }

    const items = Object.entries(cart).map(([id, item]) => `
        <div class="cart-item">
            <div style="flex:1;">
                <div class="cart-item-name">${item.icon} ${item.name}</div>
                <div class="cart-item-price">₹${item.price} × ${item.qty}</div>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
                <button onclick="decreaseQty(${id})">−</button>
                <button onclick="increaseQty(${id})">+</button>
                <button onclick="removeItem(${id})">✕</button>
            </div>
        </div>`).join('');
    cartList.innerHTML = items;
}

function renderCheckoutSummary() {
    const summary = document.getElementById('checkoutSummaryBox');
    const total = cartTotal();
    const discount = Math.floor(total * 0.10);
    const finalTotal = total - discount;

    summary.innerHTML = `
        <div style="margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #ddd;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
                <span>Subtotal:</span><span>₹${total}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;color:#2e7d32;">
                <span>Discount (10%):</span><span>-₹${discount}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:13px;color:#2e7d32;">
                <span>Delivery:</span><span>${total >= 199 ? 'FREE' : '₹30'}</span>
            </div>
        </div>
        <div style="font-weight:700;font-size:16px;display:flex;justify-content:space-between;">
            <span>Total:</span>
            <span style="color:#ff6b35;">₹${total >= 199 ? finalTotal : finalTotal + 30}</span>
        </div>`;
}

function placeOrder() {
    const name = document.getElementById('co_name').value.trim();
    const phone = document.getElementById('co_phone').value.trim();
    const hostel = document.getElementById('co_hostel').value;
    const floor = document.getElementById('co_floor').value;
    const room = document.getElementById('co_room').value.trim();
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
    const orderId = 'DD' + Math.random().toString(9).substr(2, 6).toUpperCase();
    document.getElementById('successOrderId').textContent = orderId;
    document.getElementById('successDeliveryNote').innerHTML =
        `<strong>Delivery to:</strong> ${hostel}, ${floor} Floor, Room ${room}<br><strong>Contact:</strong> ${phone}`;

    cart = {};
    updateBadge();

    ['co_name','co_phone','co_email','co_hostel','co_floor','co_room','co_payment','co_promo']
        .forEach(id => document.getElementById(id).value = '');
}

document.addEventListener('DOMContentLoaded', updateBadge);
document.addEventListener('click', (e) => {
    if (e.target.id === 'cartOverlay') closeCart();
    if (e.target.id === 'checkoutModalBg') closeCheckout();
});


function applyPromo() {
    const promo = document.getElementById('co_promo').value.toUpperCase();
    if (promo === 'DROP40') {
        showToast('✅ Promo DROP40 applied! 40% discount on first order');
    } else if (promo === '') {
        showToast('⚠️ Please enter a promo code');
    } else {
        showToast('❌ Invalid promo code!');
    }
}
