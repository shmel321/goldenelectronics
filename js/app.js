
(function(){
  const $ = (sel,ctx=document)=>ctx.querySelector(sel);

  function renderHeader(){
    const base = location.pathname.includes('/products/') ? '../' : '';
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
    <div class="container header__row">
      <a class="header__logo" href="${base}index.html" aria-label="Главная"><img src="${base}assets/img/brand-photo.png" alt="Лого" height="50" style="border-radius:8px;object-fit:cover"/></a>
      <nav class="header__nav" aria-label="Основная навигация">
        <a class="nav__link" href="${base}index.html" id="homeLink">Главная</a>
        <a class="nav__link" href="${base}catalog.html">Каталог</a>
        <a class="nav__link" href="${base}about.html">О нас</a>
        <a class="nav__link" href="${base}contacts.html">Контакты</a>
      <a class="nav__link" href="${base}offer.html">Оферта</a></nav>
      <div class="header__actions">
      </div>
    </div>
    <div id="mega" class="mega" role="dialog" aria-modal="false">
      <div class="container mega__grid" id="megaGrid"></div>
    </div>`;
    document.body.prepend(header);
  }

  function renderMegaMenu(){
    const grid = document.getElementById('megaGrid');
    if(!grid) return;
    const brands = window.GE_DATA.brands;
    const cats = window.GE_DATA.categories;
    brands.forEach(b=>{
      const col = document.createElement('div');
      col.className='mega__col';
      col.innerHTML = `<h4 class="mega__title">${b}</h4>` + 
        cats.map(c=>`<a class="mega__item" href="${(['Эпл','Dyson','Samsung','Аксессуары'].includes(b)? (b.toLowerCase()+'.html'):'catalog.html')}#${encodeURIComponent(b)}:${encodeURIComponent(c)}">${c}</a>`).join('');
      grid.appendChild(col);
    });
  }

  function renderFooter(){
    const base = location.pathname.includes('/products/') ? '../' : '';
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="container footer__grid">
        <div>
          <h4>Каталог</h4>
          <ul>
            <li><a href="${base}catalog.html">Эпл</a></li>
            <li><a href="${base}catalog.html">Dyson</a></li>

          </ul>
        </div>
        <div>
          <h4>Покупателям</h4>
          <ul>
            <li><a href="${base}catalog.html">Каталог (общий)</a></li>
            <li><a href="${base}offer.html">Публичная оферта</a></li><li><a href="${base}about.html">О нас</a></li>
            <li><a href="${base}contacts.html">Контакты</a></li>
          </ul>
        </div>
        <div>
          <h4>Контакты</h4>
          <p>+7 (904) 199-66-88<br/>goldenelectronics173@mail.ru</p>

      <div class="chips">
      <a class="chip" href="https://t.me/golden_electronics">Telegram</a>
      <a class="chip" href="https://vk.com/golden_electronics">VK</a>
      <a class="chip" href="https://www.avito.ru/brands/goldenelectronics/">Avito</a>
    </div>

        </div>
      </div>
      <div class="container" style="opacity:.6;margin-top:20px">© Golden Electronics, 2025.</div>
      <button class="to-top" id="toTop" aria-label="Наверх"><img src="${base}assets/icons/arrow-up.png" alt="" width="24" height="24"/></button>
      <div class="toast" id="toast">Товар добавлен в корзину</div>
    `;
    document.body.appendChild(footer);
  // Global order modal
  const modal = document.createElement('div');
  modal.className = 'order-modal'; modal.id = 'orderModal';
  modal.innerHTML = `
    <div class="order-dialog">
      <h3 class="order-title">Заказать:</h3>
      <div class="order-actions">
        <a class="order-link" target="_blank" rel="noopener" href="https://www.avito.ru/brands/goldenelectronics/"> <img src="assets/icons/avito.png" alt="" width="25" height="25"> </span> Avito </a>
        <a class="order-link" target="_blank" rel="noopener" href="https://t.me/golden_electronics"> <img src="assets/icons/telegram.png" alt="" width="25" height="25"> </span> Telegram </a>
        <a class="order-link" target="_blank" rel="noopener" href="https://vk.com/golden_electronics"> <img src="assets/icons/vk.png" alt="" width="25" height="25"> </span> VKontakte </a>
      </div>
      <button class="order-close" id="orderClose">Закрыть</button>
    </div>`;
  document.body.appendChild(modal);
  }

  function activateHeader(){
    const catalogBtn = document.getElementById('catalogBtn');
    const mega = document.getElementById('mega');
    let open = false;
    function setOpen(v){
      open=v;
      mega.classList.toggle('mega--open', open);
      catalogBtn?.setAttribute('aria-expanded', open);
    }
    // Toggle on click (no navigation)
    catalogBtn?.addEventListener('click', (e)=>{ e.preventDefault(); setOpen(!open); });
    // Hover open/close
    catalogBtn?.addEventListener('mouseenter', ()=> setOpen(true));
    mega?.addEventListener('mouseleave', ()=> setOpen(false));

    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') setOpen(false); });
    document.addEventListener('click', (e)=>{
      if(open && !mega.contains(e.target) && e.target!==catalogBtn) setOpen(false);
    });
  }

  function highlightActiveNav(){
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link[href]').forEach(a=>{
      const href = a.getAttribute('href');
      if(href===path) a.setAttribute('aria-current','page');
    });
  }

  function renderBreadcrumbs(){
    const bc = document.createElement('div');
    bc.className = 'breadcrumbs';
    const list = document.createElement('div');
    list.className='container breadcrumbs__list';
    const crumbs = document.body.dataset.breadcrumbs ? document.body.dataset.breadcrumbs.split('|') : ['Главная'];
    crumbs.forEach((c)=>{
      const span = document.createElement('span');
      span.className='breadcrumbs__item';
      span.textContent = c.trim();
      list.appendChild(span);
    });
    bc.appendChild(list);
    const main = document.querySelector('main');
    if(main) document.body.insertBefore(bc, main);
  }

  function updateBadge(){
    try{
      const cart = JSON.parse(localStorage.getItem('ge_cart')||'[]');
      const count = cart.reduce((s,i)=>s+i.qty,0);
      const badge = document.getElementById('cartBadge');
      if(badge) badge.textContent = count;
    }catch(e){}
  }

  function activateScrollTop(){
    const btn = document.getElementById('toTop');
    btn?.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));
  }

  window.showToast = function(msg="Товар добавлен в корзину"){
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.add('toast--show');
    setTimeout(()=>t.classList.remove('toast--show'), 1800);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    renderHeader();
    renderMegaMenu();
    renderFooter();
    renderBreadcrumbs();
    activateHeader();
    highlightActiveNav();
    activateScrollTop();
    updateBadge();
  });
})();

// Order modal logic (links configurable in data.js if present)
(function(){
  function getLinks(){
    try{ return (window.GE_DATA && window.GE_DATA.links) || {}; }catch(e){ return {}; }
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    const modal = document.getElementById('orderModal');
    const closeBtn = document.getElementById('orderClose');
    closeBtn?.addEventListener('click', ()=> modal.classList.remove('order-modal--open'));
    modal?.addEventListener('click', (e)=>{ if(e.target===modal) modal.classList.remove('order-modal--open'); });
    const links = getLinks();
    ['vk','telegram','avito','wb'].forEach(k=>{
      const a = document.querySelector(`.order-link[data-href="${k}"]`);
      if(a && links[k]) a.href = links[k];
      else if(a) a.href = '#';
    });
  });
  window.showOrder = function(){ document.getElementById('orderModal')?.classList.add('order-modal--open'); }
})();
// Fill footer social links from GE_DATA.links
(function(){
  function fillSocialLinks(){
    try{
      const links = (window.GE_DATA && window.GE_DATA.links) || {};
      document.querySelectorAll('.social-btn[data-social]').forEach(a=>{
        const k = a.getAttribute('data-social');
        if(links[k]) a.href = links[k];
      });
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', fillSocialLinks);
})();
// Inline product social links fill
(function(){
  function fillInlineLinks(){
    try{
      const links = (window.GE_DATA && window.GE_DATA.links) || {};
      document.querySelectorAll('[data-social-inline]').forEach(a=>{
        const k = a.getAttribute('data-social-inline');
        if(links[k]) a.href = links[k];
      });
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', fillInlineLinks);
})();
