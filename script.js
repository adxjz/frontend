

console.log('script.js loaded');


const PRODUCTS = [
  { id: '1', title: 'Shoe',    price: 50,    img: 'image/shoe.jpeg' },
  { id: '2', title: 'Shirt',   price: 399,   img: 'image/shirt.jpg' },
  { id: '3', title: 'Speaker', price: 999,   img: 'image/speaker.jpg' },
  { id: '4', title: 'Laptop',  price: 50000, img: 'image/laptop.webp' }
];


// ---------- App state ----------
let CART = {};        // { id: { item: PRODUCT, qty: N } }
let NOTIF_COUNT = 0;

// ---------- Persistence ----------
function saveCart() { localStorage.setItem('cart', JSON.stringify(CART)); }
function loadCart() {
  try {
    const raw = localStorage.getItem('cart');
    CART = raw ? JSON.parse(raw) : {};
  } catch(e) {
    CART = {};
  }
}
loadCart();

// ---------- Helpers ----------
function findProduct(id){ return PRODUCTS.find(p => p.id === String(id)); }
function calcSubtotal(){ return Object.values(CART).reduce((s,c)=> s + c.item.price * c.qty, 0); }

// ---------- UI update helpers ----------
function updateCartBadge(){
  const count = Object.values(CART).reduce((s,c)=> s + c.qty, 0);
  const el = document.getElementById('cartCount');
  if(!el) return;
  if(count > 0) { el.style.display = 'inline-block'; el.textContent = count; }
  else { el.style.display = 'none'; }
}

function updateCartUI(){
  // kept for compatibility with older code that calls updateCartUI()
  updateCartBadge();
}

function updateNotifUI(){
  const n = document.getElementById('notifCount');
  if(!n) return;
  if(NOTIF_COUNT > 0) { n.style.display='inline-block'; n.textContent = NOTIF_COUNT; }
  else n.style.display='none';
}

function showToast(msg, ms = 1400){
  const t = document.getElementById('toast');
  if(!t) { console.log('Toast:', msg); return; }
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(()=> { t.style.display = 'none'; }, ms);
}

// ---------- Cart Panel rendering ----------
function renderCartPanel(){
  const list = document.getElementById('cartItemsList');
  if(!list) return;
  list.innerHTML = '';
  const items = Object.values(CART);
  if(items.length === 0){
    list.innerHTML = '<div style="padding:16px;color:#666">Your cart is empty.</div>';
  } else {
    items.forEach(ci => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${ci.item.img}" alt="${ci.item.title}">
        <div class="ci-info">
          <div style="font-weight:700">${ci.item.title}</div>
          <div style="color:#666">₹ ${ci.item.price} each</div>
          <div class="qty-controls">
            <button data-dec="${ci.item.id}">-</button>
            <div style="min-width:28px;text-align:center">${ci.qty}</div>
            <button data-inc="${ci.item.id}">+</button>
            <button data-rm="${ci.item.id}" style="margin-left:10px;color:#c00;background:transparent;border:none;cursor:pointer">Remove</button>
          </div>
        </div>
      `;
      list.appendChild(div);
    });
  }
  const subtotalEl = document.getElementById('cartSubtotal');
  if(subtotalEl) subtotalEl.textContent = calcSubtotal();
  saveCart();
  updateCartBadge();
}

// ---------- Cart operations ----------
function addToCartById(id, qty=1){
  const p = findProduct(id);
  if(!p) { showToast('Product not found'); return; }
  if(CART[id]) CART[id].qty += qty;
  else CART[id] = { item: p, qty };
  renderCartPanel();
}

function changeQty(id, delta){
  if(!CART[id]) return;
  CART[id].qty += delta;
  if(CART[id].qty <= 0) delete CART[id];
  renderCartPanel();
}

function removeFromCart(id){
  if(CART[id]) delete CART[id];
  renderCartPanel();
}

// ---------- Panel open/close ----------
function openCartPanel(){ 
  const panel = document.getElementById('cartPanel');
  if(!panel) return;
  panel.classList.add('open'); 
  panel.setAttribute('aria-hidden','false'); 
  renderCartPanel();
}
function closeCartPanel(){ 
  const panel = document.getElementById('cartPanel');
  if(!panel) return;
  panel.classList.remove('open'); 
  panel.setAttribute('aria-hidden','true'); 
}

// ---------- Checkout modal ----------
function openCheckoutModal(withCartSnapshot = true){
  const m = document.getElementById('checkoutModal');
  if(!m) return;
  // store snapshot of cart on form if requested
  const form = document.getElementById('checkoutForm');
  if(form && withCartSnapshot) {
    const snapshot = Object.values(CART).map(c => ({ id: c.item.id, title: c.item.title, price: c.item.price, qty: c.qty }));
    form.dataset.cart = JSON.stringify(snapshot);
  }
  m.classList.add('open');
  m.setAttribute('aria-hidden','false');
}
function closeCheckoutModal(){
  const m = document.getElementById('checkoutModal');
  if(!m) return;
  m.classList.remove('open');
  m.setAttribute('aria-hidden','true');
}

// ---------- Global click handler (delegation) ----------
document.addEventListener('click', function(e){
  const el = e.target;

  // Add to cart buttons
  if(el.classList && el.classList.contains('add-cart')){
    const id = el.dataset.id || '1';
    addToCartById(id, 1);
    NOTIF_COUNT += 1;
    updateNotifUI();
    showToast('Added to cart ✔');
    return;
  }

  // Buy now -> open checkout modal (pre-fill product id on form)
  if(el.classList && el.classList.contains('buy-now')){
    const id = el.dataset.id; // only treat elements with a data-id as product "Buy Now"
    if(!id){
      // no data-id -> allow other handlers (e.g., 'checkoutFromCart') to run
    } else {
      const form = document.getElementById('checkoutForm');
      if(form) {
        // attach single-product snapshot if only buying one item (ensure numeric values)
        const prod = findProduct(id);
        form.dataset.cart = JSON.stringify([{ id, title: prod.title, price: Number(prod.price), qty: 1 }]);
      }
      openCheckoutModal(false); // we already attached snapshot on form
      return;
    }
  }

  // open cart panel button(s)
  if(el.id === 'cartOpenBtn' || el.id === 'cartBtn'){
    openCartPanel();
    return;
  }

  // close cart panel
  if(el.id === 'closeCartPanel' || (el.closest && el.closest('.close-panel'))){
    closeCartPanel();
    return;
  }

  // qty inc/dec/remove inside cart panel
  const inc = el.getAttribute && el.getAttribute('data-inc');
  const dec = el.getAttribute && el.getAttribute('data-dec');
  const rm  = el.getAttribute && el.getAttribute('data-rm');
  if(inc){ changeQty(inc, +1); return; }
  if(dec){ changeQty(dec, -1); return; }
  if(rm){ removeFromCart(rm); return; }

  // proceed to checkout from cart panel
  if(el.id === 'checkoutFromCart'){
    // if cart empty -> toast
    const items = Object.values(CART).map(c => ({ id: c.item.id, title: c.item.title, price: Number(c.item.price), qty: Number(c.qty) }));
    if(items.length === 0){ showToast('Cart is empty'); return; }
    // attach snapshot to form and open modal
    const form = document.getElementById('checkoutForm');
    if(form) form.dataset.cart = JSON.stringify(items);
    openCheckoutModal(false);
    return;
  }

  // cart button quick peek
  if(el.id === 'cartBtn'){
    const total = Object.values(CART).reduce((s,c) => s + c.qty, 0);
    if(total === 0) showToast('Cart is empty');
    else showToast(`Cart has ${total} item(s)`);
    return;
  }

  // notif button clears notifications
  if(el.id === 'notifBtn'){
    NOTIF_COUNT = 0;
    updateNotifUI();
    showToast('Notifications cleared');
    return;
  }

  // modal cancel/close in header of modal
  if(el.id === 'cancelCheckout' || el.id === 'closeCheckout'){
    closeCheckoutModal();
    return;
  }
});

// ---------- Checkout form submit handler ----------
(function attachCheckoutHandler(){
  const checkoutForm = document.getElementById('checkoutForm');
  if(!checkoutForm) return;

  checkoutForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    const fd = new FormData(checkoutForm);
    const shipping = Object.fromEntries(fd.entries());

    // determine items snapshot: form.dataset.cart (if set) or current CART
    const snapshot = checkoutForm.dataset.cart ? JSON.parse(checkoutForm.dataset.cart) : Object.values(CART).map(c => ({ id: c.item.id, title: c.item.title, price: c.item.price, qty: c.qty }));
    const total = snapshot.reduce((s,i) => s + i.price * i.qty, 0);

    const order = { items: snapshot, total, shipping, createdAt: new Date().toISOString() };
    // save order and redirect to order.html
    localStorage.setItem('lastOrder', JSON.stringify(order));

    // clear checkout form snapshot and reset inputs to avoid stale data
    if(checkoutForm){ delete checkoutForm.dataset.cart; checkoutForm.reset(); }

    // clear cart and UI
    CART = {}; saveCart(); updateCartBadge(); renderCartPanel();

    // close modal and redirect
    closeCheckoutModal();
    window.location.href = 'order.html';
  });
})();

// ---------- Initial UI setup ----------
renderCartPanel();
updateCartBadge();
updateNotifUI();
