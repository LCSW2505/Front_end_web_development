/*Charan Devaraju
c0943138
Project 2*/


async function renderProductsPage()
{
  const products = await fetchProducts();
  window.PRODUCTS = products;
  const container = document.getElementById('products-container');
  if(!container) return;
  container.innerHTML = '';
  products.forEach(p=>{
    const card = el('div',{class:'card product', draggable:true, 'data-id':p.id});
    card.appendChild(el('img',{src:p.image || '/assets/placeholder.png', alt: escapeHTML(p.title)}));
    card.appendChild(el('div', {class:'p-title'}, escapeHTML(p.title)));
    card.appendChild(el('div', {class:'p-meta'}, escapeHTML(p.category || 'General')));
    card.appendChild(el('div', {class:'p-price'}, '$' + p.price.toFixed(2)));
    const actions = el('div',{class:'flex'});
    const add = el('button',{class:'btn small', onclick:()=>{ CART.add(p.id,1); CART.save(); flashMessage('Added to cart'); }}, 'Add to cart');
    const view = el('a',{href:`product.html?id=${p.id}`, class:'btn ghost small'}, 'View');
    actions.appendChild(add); actions.appendChild(view);
    card.appendChild(actions);
    container.appendChild(card);
  });
  updateFilters();
  setupProductSearch();
}

function setupProductSearch()
{
  const q = document.getElementById('search-q');
  if(!q) return;
  q.addEventListener('input', debounce(()=> {
    const text = q.value.trim().toLowerCase();
    const results = window.PRODUCTS.filter(p => p.title.toLowerCase().includes(text) || (p.description||'').toLowerCase().includes(text) );
    const container = document.getElementById('products-container');
    container.innerHTML='';
    results.forEach(p=>{
      const card = el('div',{class:'card product', draggable:true, 'data-id':p.id});
      card.appendChild(el('img',{src:p.image || '/assets/placeholder.png', alt: escapeHTML(p.title)}));
      card.appendChild(el('div', {class:'p-title'}, escapeHTML(p.title)));
      card.appendChild(el('div', {class:'p-meta'}, escapeHTML(p.category || 'General')));
      card.appendChild(el('div', {class:'p-price'}, '$' + p.price.toFixed(2)));
      const actions = el('div',{class:'flex'});
      const add = el('button',{class:'btn small', onclick:()=>{ CART.add(p.id,1); CART.save(); flashMessage('Added to cart'); }}, 'Add to cart');
      const view = el('a',{href:`product.html?id=${p.id}`, class:'btn ghost small'}, 'View');
      actions.appendChild(add); actions.appendChild(view);
      card.appendChild(actions);
      container.appendChild(card);
    });
  }, 250));
}

function debounce(fn, wait=200)
{
  let t;
  return function(...args){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), wait); }
}

function updateFilters()
{
  const cats = new Set(window.PRODUCTS.map(p=>p.category));
  const sel = document.getElementById('filter-category');
  if(!sel) return;
  sel.innerHTML = '<option value="">All categories</option>';
  cats.forEach(c=> sel.appendChild(el('option', {value:c}, c)));
  sel.addEventListener('change', ()=>{
    const v = sel.value;
    const container = document.getElementById('products-container');
    container.innerHTML='';
    const list = v ? window.PRODUCTS.filter(p=>p.category===v) : window.PRODUCTS;
    list.forEach(p=>{
      const card = el('div',{class:'card product', draggable:true, 'data-id':p.id});
      card.appendChild(el('img',{src:p.image || '/assets/placeholder.png', alt: escapeHTML(p.title)}));
      card.appendChild(el('div', {class:'p-title'}, escapeHTML(p.title)));
      card.appendChild(el('div', {class:'p-meta'}, escapeHTML(p.category || 'General')));
      card.appendChild(el('div', {class:'p-price'}, '$' + p.price.toFixed(2)));
      const actions = el('div',{class:'flex'});
      const add = el('button',{class:'btn small', onclick:()=>{ CART.add(p.id,1); CART.save(); flashMessage('Added to cart'); }}, 'Add to cart');
      const view = el('a',{href:`product.html?id=${p.id}`, class:'btn ghost small'}, 'View');
      actions.appendChild(add); actions.appendChild(view);
      card.appendChild(actions);
      container.appendChild(card);
    });
  });
}

function setupExport()
{
  const btn = document.getElementById('export-products');
  if(!btn) return;
  btn.addEventListener('click', ()=> exportProductsJSON(window.PRODUCTS || []));
}

async function renderProductDetail()
{
  const query = new URLSearchParams(location.search);
  const id = query.get('id');
  const products = await fetchProducts();
  const p = products.find(x=>x.id===id);
  const container = document.getElementById('product-detail');
  if(!container) return;
  if(!p){ container.innerHTML = '<div class="card">Product not found</div>'; return; }
  container.innerHTML = '';
  const c = el('div',{class:'card'});
  c.appendChild(el('h2',{}, escapeHTML(p.title)));
  c.appendChild(el('img',{src:p.image || '/assets/placeholder.png', alt: p.title, style:'max-width:220px;'}));
  c.appendChild(el('div',{class:'p-meta'}, escapeHTML(p.category)));
  c.appendChild(el('div',{class:'p-price'}, '$'+p.price.toFixed(2)));
  c.appendChild(el('p',{}, escapeHTML(p.description || 'No description')));
  const add = el('button',{class:'btn', onclick:()=>{ CART.add(p.id,1); CART.save(); flashMessage('Added'); }}, 'Add to cart');
  c.appendChild(add);
  container.appendChild(c);
}

document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('products-container')) renderProductsPage();
  if(document.getElementById('product-detail')) renderProductDetail();
  setupExport();
});
