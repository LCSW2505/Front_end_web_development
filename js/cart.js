/*Charan Devaraju
c0943138
Project 2*/

// This function is used to render the shopping cart page with products and quantities
async function renderCartPage()
{
  const products = await fetchProducts(); // used to get products data
  // match the cart items with product details
  const list = CART.items.map(it => 
  {
    const p = products.find(x=>x.id===it.id);
    return {product:p, qty:it.qty};
  });
  const container = document.getElementById('cart-items');
  if(!container) return;
  container.innerHTML=''; // clearthw  previous cart display

  // show the message if cart is empty
  if(list.length===0) 
  { 
    container.appendChild(el('div',{}, 'Cart is empty')); 
    return; 
  }

  // create the  rows for each cart item with quantity input and remove button
  list.forEach(entry=>{
    const row = el('div',{class:'card flex', draggable:true, 'data-id':entry.product.id, style:'justify-content:space-between;align-items:center;'});
    row.appendChild(el('div',{}, 
      el('strong',{}, escapeHTML(entry.product.title)), 
      el('div',{class:'text-muted'}, '$'+entry.product.price.toFixed(2))
    ));
    const controls = el('div',{class:'flex'}, 
      el('input',{type:'number', min:1, value:entry.qty, aria_label:'Quantity', onchange:(e)=>{
        CART.updateQty(entry.product.id, Number(e.target.value)); // update the quantity on change
        CART.save();
        renderCartPage(); // re-renderthe  cart to reflect changes
      }}),
      el('button',{class:'btn ghost small', onclick:()=>{
        CART.remove(entry.product.id); // remove the item from cart
        CART.save();
        renderCartPage(); 
      }}, 'Remove')
    );
    row.appendChild(controls);
    container.appendChild(row);
  });

  // calculate the total price of items in cart
  const total = list.reduce((s,e)=> s + e.qty * e.product.price, 0);
  const tdiv = document.getElementById('cart-total');
  if(tdiv) tdiv.textContent = '$'+ total.toFixed(2); // show the total price

  enableCartDragReorder(); 
}

// enables the drag and drop functionality for cart item reordering
function enableCartDragReorder()
{
  const container = document.getElementById('cart-items');
  if(!container) return;
  let dragged = null;

  container.querySelectorAll('[draggable=true]').forEach(item=>{
    item.addEventListener('dragstart', (e)=> { dragged = item; });
    item.addEventListener('dragover', (e)=> { e.preventDefault(); });
    item.addEventListener('drop', (e)=> {
      e.preventDefault();
      if(dragged && dragged !== item){
        // swap the positions of dragged and dropped items in cart array
        const idA = dragged.dataset.id;
        const idB = item.dataset.id;
        const aIndex = CART.items.findIndex(i=>i.id===idA);
        const bIndex = CART.items.findIndex(i=>i.id===idB);
        if(aIndex>-1 && bIndex>-1){
          const tmp = CART.items[aIndex];
          CART.items[aIndex] = CART.items[bIndex];
          CART.items[bIndex] = tmp;
          CART.save();
          renderCartPage(); // update the UI after reorder
        }
      }
    });
  });
}

// simple CSRF token check, demo purpose only
function checkCSRF(token)
{
  return token === 'demo123';
}

// setup checkout form submission and validation
function setupCheckout()
{
  const form = document.getElementById('checkout-form');
  if(!form) return;

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.querySelector('[name=name]').value.trim();
    const email = form.querySelector('[name=email]').value.trim();
    const addr = form.querySelector('[name=address]').value.trim();
    const date = form.querySelector('[name=delivery]').value;

    if(name.length<3){ flashMessage('Enter full name', 'warn'); return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ flashMessage('Enter valid email', 'warn'); return; }
    if(addr.length<6){ flashMessage('Enter valid address', 'warn'); return; }

    // check the delivery date is not in the past if given
    if(date)
    {
      const d = new Date(date);
      const today = new Date(); today.setHours(0,0,0,0);
      if(d < today){ flashMessage('Delivery date cannot be in the past', 'warn'); return; }
    }

    const token = form.querySelector('[name=csrf]').value;
    if(!checkCSRF(token)){ flashMessage('CSRF token invalid', 'warn'); return; }

    flashMessage('Order placed — demo only', 'success');
    CART.clear(); // clear cart after order
    setTimeout(()=> window.location.href = 'index.html', 800); // redirect to home
  });
}
// Used  when the page loads, render cart if on cart page and set up checkout form if present
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('cart-items')) renderCartPage();
  setupCheckout();
});
