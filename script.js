

function openCart() {
    document.getElementById('cartOverlay').classList.add('open');
    document.getElementById('cartSidebar').classList.add('open');
    renderCartSidebar();
}

function closeCart() {
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('cartSidebar').classList.remove('open');
}


