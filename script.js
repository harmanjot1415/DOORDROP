// ============ NAVIGATION TOGGLE ============
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}
updateActiveNav();

// ============ SCROLL TO SECTION ============
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
}

// ============ TOAST NOTIFICATION ============
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

// =============================================
//   CART SYSTEM
// =============================================
let cart = {}; // { id: { name, price, icon, qty } }

// Open / Close Sidebar
function openCart() {
    document.getElementById('cartOverlay').classList.add('open');
    document.getElementById('cartSidebar').classList.add('open');
    renderCartSidebar();
}

function closeCart() {
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('cartSidebar').classList.remove('open');
}

// Open / Close Checkout Modal
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

// Close Success Modal
function closeSuccess() {
    document.getElementById('successModalBg').classList.remove('open');
    window.location.href = 'index.html';
}

// ── Helpers ──
function cartTotal() {
    return Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
}
function cartCount() {
    return Object.values(cart).reduce((s, i) => s + i.qty, 0);
}

// ── Update badge in navbar ──
function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const n = cartCount();
    badge.textContent = n;
    badge.classList.remove('pop');
    void badge.offsetWidth;
    if (n > 0) badge.classList.add('pop');
}

// ── Add item (called from product card buttons) ──
function addItem(event, id, name, price, icon) {
    event.stopPropagation();
    if (cart[id]) {
        cart[id].qty += 1;
    } else {
        cart[id] = { name, price, icon, qty: 1 };
    }
    updateBadge();
    showToast(`✅ ${name} added to cart!`);
}

// ── Remove item ──
function removeItem(id) {
    delete cart[id];
    updateBadge();
    renderCartSidebar();
}

// ── Increase quantity ──
function increaseQty(id) {
    if (cart[id]) cart[id].qty += 1;
    updateBadge();
    renderCartSidebar();
}

// ── Decrease quantity ──
function decreaseQty(id) {
    if (cart[id]) {
        if (cart[id].qty > 1) cart[id].qty -= 1;
        else delete cart[id];
    }
    updateBadge();
    renderCartSidebar();
}

// ── Render cart sidebar ──
function renderCartSidebar() {
    const cartList = document.getElementById('cartItemsList');
    const cartCount_el = document.getElementById('cartHeadCount');
    const cartTotal_el = document.getElementById('cartTotalAmt');

    const count = cartCount();
    cartCount_el.textContent = count + ' item' + (count !== 1 ? 's' : '');
    cartTotal_el.textContent = '₹' + cartTotal();

    if (count === 0) {
        cartList.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon">🛒</div>
                <p>Your cart is empty.<br>Start adding snacks!</p>
            </div>
        `;
        return;
    }

    const items = Object.entries(cart)
        .map(([id, item]) => `
            <div class="cart-item">
                <div style="flex:1;">
                    <div class="cart-item-name">${item.icon} ${item.name}</div>
                    <div class="cart-item-price">₹${item.price} × ${item.qty}</div>
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button class="btn-small" onclick="decreaseQty(${id})" style="padding:6px 10px;">−</button>
                    <button class="btn-small" onclick="increaseQty(${id})" style="padding:6px 10px;">+</button>
                    <button class="btn-small" onclick="removeItem(${id})" style="padding:6px 10px;background:#ff6b35;">✕</button>
                </div>
            </div>
        `)
        .join('');

    cartList.innerHTML = items;
}

// ── Render checkout summary ──
function renderCheckoutSummary() {
    const summary = document.getElementById('checkoutSummaryBox');
    const count = cartCount();
    const total = cartTotal();
    const discount = Math.floor(total * 0.10);
    const finalTotal = total - discount;

    const items = Object.entries(cart)
        .map(([id, item]) => `<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
            <span>${item.icon} ${item.name} × ${item.qty}</span>
            <span>₹${item.price * item.qty}</span>
        </div>`)
        .join('');

    summary.innerHTML = `
        <div style="margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #ddd;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
                <span>Subtotal:</span>
                <span>₹${total}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;color:#2e7d32;">
                <span>Discount (10%):</span>
                <span>-₹${discount}</span>
            </div>
            ${total >= 199 ? '<div style="display:flex;justify-content:space-between;font-size:13px;color:#2e7d32;"><span>Delivery:</span><span>FREE</span></div>' : '<div style="display:flex;justify-content:space-between;font-size:13px;"><span>Delivery:</span><span>₹30</span></div>'}
        </div>
        <div style="font-weight:700;font-size:16px;display:flex;justify-content:space-between;">
            <span>Total:</span>
            <span style="color:#ff6b35;">₹${total >= 199 ? finalTotal : finalTotal + 30}</span>
        </div>
    `;
}

// __ Place Order __
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
    
    document.getElementById('co_name').value = '';
    document.getElementById('co_phone').value = '';
    document.getElementById('co_email').value = '';
    document.getElementById('co_hostel').value = '';
    document.getElementById('co_floor').value = '';
    document.getElementById('co_room').value = '';
    document.getElementById('co_payment').value = '';
    document.getElementById('co_promo').value = '';
}

// __ Apply Promo __
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

// __ Subscribe Newsletter __
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail').value.trim();
    if (!email || !email.includes('@')) {
        showToast('❌ Please enter a valid email!');
        return;
    }
    showToast('✅ Subscribed! Check your email for exclusive deals.');
    document.getElementById('newsletterEmail').value = '';
}

// =============================================
//   PRODUCT FILTERING & SEARCH
// =============================================
function filterProducts(category) {
    const cards = document.querySelectorAll('.product-card');
    const btns = document.querySelectorAll('.filter-btn');

    btns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchProducts(query) {
    const cards = document.querySelectorAll('.product-card');
    const q = query.toLowerCase();

    cards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        if (name.includes(q)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function sortProducts(option) {
    const grid = document.querySelector('.products-grid');
    const cards = Array.from(document.querySelectorAll('.product-card'));

    if (option === 'price-low') {
        cards.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
    } else if (option === 'price-high') {
        cards.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
    }

    grid.innerHTML = '';
    cards.forEach(card => grid.appendChild(card));
}

// =============================================
//   ANIMATIONS
// =============================================
function rotateCard(el) {
    el.style.transform = 'rotateY(5deg) rotateX(-5deg)';
}

function resetCard(el) {
    el.style.transform = 'rotateY(0) rotateX(0)';
}

// __ Animate count on stat items __
function animateCount(el) {
    const h3 = el.querySelector('h3');
    const target = parseInt(h3.dataset.count);
    const current = h3;
    let count = 0;
    const increment = Math.ceil(target / 30);
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            current.textContent = target + (isNaN(target) ? '' : '+');
            clearInterval(timer);
        } else {
            current.textContent = count + '+';
        }
    }, 30);
}

// ============ COUNTDOWN TIMER ============
function startCountdown() {
    const updateTimer = () => {
        const now = new Date().getTime();
        const endTime = new Date(now + 24 * 60 * 60 * 1000).getTime();

        const timer = setInterval(() => {
            const timeLeft = endTime - new Date().getTime();
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

            if (timeLeft <= 0) {
                clearInterval(timer);
            }
        }, 1000);
    };
    updateTimer();
}

// Start on page load
document.addEventListener('DOMContentLoaded', () => {
    updateBadge();
    startCountdown();
});

// Close modals on outside click
document.addEventListener('click', (e) => {
    if (e.target.id === 'cartOverlay') closeCart();
    if (e.target.id === 'checkoutModalBg') closeCheckout();
});
