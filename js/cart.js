
(function(){
  const $ = (s,ctx=document)=>ctx.querySelector(s);

  function read(){ try{return JSON.parse(localStorage.getItem('ge_cart')||'[]')}catch(e){return []} }
  function write(x){ localStorage.setItem('ge_cart', JSON.stringify(x)); document.getElementById('cartBadge')?.textContent = x.reduce((s,i)=>s+i.qty,0); }

  const api = {
    add(id, qty=1){
      const cart = read();
      const i = cart.find(x=>x.id===id);
      if(i) i.qty += qty; else cart.push({id, qty});
      write(cart);
    },
    update(id, qty){
      let cart = read();
      cart = cart.map(x=> x.id===id? {...x, qty: Math.max(1, qty)} : x);
      write(cart);
    },
    remove(id){
      let cart = read().filter(x=> x.id!==id);
      write(cart);
    },
    clear(){ write([]); }
  };
  window.cartAPI = api;

  function renderCart(){
    const root = document.getElementById('cart-page');
    if(!root) return;
    const cart = read();
    const listEl = document.getElementById('cartList');
    if(cart.length===0){
      listEl.innerHTML = `<p style="opacity:.8">Корзина пуста. Перейдите в <a href="catalog.html">каталог</a>.</p>`;
      document.getElementById('summary').innerHTML='';
      return;
    }
    const items = cart.map(row=>{
      const p = GE_DATA.products.find(pp=>pp.id===row.id);
      return {...row, ...p};
    });
    listEl.innerHTML = items.map(i=>`
      <div class="cart__item">
        <img src="assets/img/${i.img}" alt="" width="100" height="100" style="border-radius:12px;background:#0a0a0a">
        <div>
          <div style="font-weight:700">${i.title}</div>
          <div style="opacity:.7;font-size:14px">${i.brand} • ${i.category}</div>
        </div>
        <div class="qty">
          <button data-dec="${i.id}" aria-label="Уменьшить">-</button>
          <span>${i.qty}</span>
          <button data-inc="${i.id}" aria-label="Увеличить">+</button>
        </div>
        <div style="text-align:right">
          <div>${utils.fmtPrice(i.price*i.qty)}</div>
          <button class="nav__link" data-del="${i.id}" style="padding:6px 10px;margin-top:6px">Удалить</button>
        </div>
      </div>
    `).join('');

    const itemsSum = items.reduce((s,i)=>s+i.price*i.qty,0);
    const delivery = itemsSum>50000?0:500;
    document.getElementById('summary').innerHTML = `
      <div class="summary">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Товары</span><strong>${utils.fmtPrice(itemsSum)}</strong></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Доставка</span><strong>${delivery?utils.fmtPrice(delivery):'Бесплатно'}</strong></div>
        <div style="display:flex;justify-content:space-between;font-size:20px"><span>Итого</span><strong>${utils.fmtPrice(itemsSum+delivery)}</strong></div>
        <button id="checkoutBtn" class="btn btn--primary" style="width:100%;margin-top:12px">Оформить заказ</button>
        <button id="clearBtn" class="btn btn--ghost" style="width:100%;margin-top:8px">Очистить корзину</button>
      </div>
    `;

    listEl.addEventListener('click', (e)=>{
      const idInc = e.target.getAttribute('data-inc');
      const idDec = e.target.getAttribute('data-dec');
      const idDel = e.target.getAttribute('data-del');
      if(idInc){ api.add(idInc,1); renderCart(); }
      if(idDec){ const row = read().find(r=>r.id===idDec); api.update(idDec,(row?.qty||1)-1); renderCart(); }
      if(idDel){ api.remove(idDel); renderCart(); }
    });
    document.getElementById('clearBtn')?.addEventListener('click', ()=>{ api.clear(); renderCart(); });
    document.getElementById('checkoutBtn')?.addEventListener('click', openCheckout);
  }

  function openCheckout(){
    const modal = document.getElementById('checkout');
    modal.classList.add('modal--open');
    modal.setAttribute('aria-modal','true');
    document.getElementById('closeModal').addEventListener('click', ()=> modal.classList.remove('modal--open'));
    document.getElementById('orderForm').addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const digits = phone.replace(/\\D/g,'');
      const phoneOk = digits.length===11 && digits.startsWith('7');
      const emailOk = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
      if(!name){ alert('Введите имя'); return; }
      if(!phoneOk){ alert('Телефон в формате +7XXXXXXXXXX'); return; }
      if(!emailOk){ alert('Некорректный email'); return; }
      alert('Спасибо! Заказ оформлен (демо). Менеджер свяжется с вами.');
      localStorage.removeItem('ge_cart');
      location.href='index.html';
    });
  }

  document.addEventListener('DOMContentLoaded', renderCart);
})();
