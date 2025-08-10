/*Charan Devaraju
c0943138
Project 2*/

function escapeHTML(s)
{
  if(!s) return "";
  return s.replace(/[&<>"'`=\/]/g, function (c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;','=':'&#61;','/':'&#47;'}[c];
  });
}

// async function used  to hash text for passwords or tokens
async function hashText(text)
{
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
}

const SESSION_KEY = "stationery_session";  // key used to store session info in sessionStorage
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes session timeout

// creating aa session object and store it in sessionStorage
function createSession(user)
{
  const token = Math.random().toString(36).slice(2);
  const payload = {user, token, created: Date.now()};
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

// get session from the sessionStorage, return null if it is  expired or invalid
function getSession()
{
  const raw = sessionStorage.getItem(SESSION_KEY);
  if(!raw) return null;
  try{
    const obj = JSON.parse(raw);
    if(Date.now() - obj.created > SESSION_TIMEOUT_MS)
    { 
      sessionStorage.removeItem(SESSION_KEY); 
      return null; 
    }
    return obj;
  }catch(e){ return null; }
}

// redirect the  user to the login page if not logged in
function ensureLoggedIn(redirect='login.html')
{
  if(!getSession())
    {
    window.location.href = redirect;
  }
}

// The cart class to manage cart items in localStorage
class Cart {
  constructor()
  {
    this.key = 'stationery_cart_v1';
    this.load();
    this.autoSaveDebounce = null;
  }
  // load the cart from localStorage or empty array
  load()
  {
    const raw = localStorage.getItem(this.key);
    this.items = raw ? JSON.parse(raw) : [];
  }
  // save the cart items to localStorage and update cart badge
  save()
  {
    localStorage.setItem(this.key, JSON.stringify(this.items));
    updateCartBadge();
  }
  // add the products to cart or update quantity if already there
  add(productId, qty=1)
  {
    const existing = this.items.find(i=>i.id===productId);
    if(existing) existing.qty += qty;
    else this.items.push({id:productId, qty});
    this.scheduleSave();
  }
  // remove product from cart by id
  remove(productId)
  {
    this.items = this.items.filter(i=>i.id!==productId);
    this.scheduleSave();
  }
  // update quantity of a product in cart
  updateQty(productId, qty)
  {
    const it = this.items.find(i=>i.id===productId);
    if(it) it.qty = qty;
    this.scheduleSave();
  }
  // clear allthe   items in cart
  clear(){ this.items=[]; this.save(); }
  // debounce saving to reduce frequent localStorage writes
  scheduleSave()
  {
    if(this.autoSaveDebounce) clearTimeout(this.autoSaveDebounce);
    this.autoSaveDebounce = setTimeout(()=>this.save(), 400);
  }
  // export the cart items as JSON file
  export()
  {
    const blob = new Blob([JSON.stringify(this.items, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); 
    a.href=url; 
    a.download='cart.json'; 
    document.body.appendChild(a); 
    a.click(); 
    a.remove();
  }
}
const CART = new Cart();

// update all the  cart count badges on the page
function updateCartBadge(){
  const el = document.querySelectorAll('.cart-count');
  const count = CART.items.reduce((s,it)=>s+it.qty,0);
  el.forEach(e=> e.textContent = count);
}

// fetch the  product data from JSON file, return empty array on failure
async function fetchProducts(){
  try{
    const r = await fetch('/data/products.json');
    if(!r.ok) throw new Error('products fetch failed');
    const json = await r.json();
    return json;
  }catch(e){
    console.error(e);
    return [];
  }
}

function el(tag, attrs={}, ...children)
{
  const node = document.createElement(tag);
  Object.entries(attrs||{}).forEach(([k,v])=>{
    if(k.startsWith('on') && typeof v === 'function')
      { 
      node.addEventListener(k.substring(2), v); 
    }
    else if(k === 'html') node.innerHTML = v;
    else node.setAttribute(k,v);
  });
  children.flat().forEach(c=> {
    if(typeof c === 'string') node.appendChild(document.createTextNode(c));
    else if(c) node.appendChild(c);
  });
  return node;
}

// setup the drag and drop to add products to cart
function setupDragToCart()
{
  document.addEventListener('dragstart', (e)=>{
    const card = e.target.closest('.product');
    if(!card) return;
    e.dataTransfer.setData('text/plain', card.dataset.id);
    e.dataTransfer.effectAllowed = 'copy';
  });
  const drop = document.getElementById('cart-dropzone');
  if(!drop) return;
  drop.addEventListener('dragover', (e)=> { e.preventDefault(); drop.classList.add('drag-over'); });
  drop.addEventListener('dragleave', ()=> drop.classList.remove('drag-over'));
  drop.addEventListener('drop', (e)=> {
    e.preventDefault(); 
    drop.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    if(id){ 
      CART.add(id,1); 
      CART.save(); 
      flashMessage('Added to cart', 'success'); 
    }
  });
}

// show the temporary toast message on screen
function flashMessage(text, type='info')
{
  const t = el('div',{class:'toast card'}, text);
  t.style.position='fixed'; 
  t.style.right='18px'; 
  t.style.bottom='18px'; 
  t.style.zIndex=9999;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 2400);
}

// export the product data as JSON file
function exportProductsJSON(products)
{
  const blob = new Blob([JSON.stringify(products, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); 
  a.href=url; 
  a.download='products.json'; 
  document.body.appendChild(a); 
  a.click(); 
  a.remove();
}

// CSRF tokenis  generator and checker
function generateCSRF()
{ 
  const token = Math.random().toString(36).slice(2); 
  sessionStorage.setItem('csrf', token); 
  return token; 
}
function checkCSRF(token)
{ 
  return sessionStorage.getItem('csrf') === token; 
}

// initialize the things on page load
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartBadge();
  setupDragToCart();
});
 