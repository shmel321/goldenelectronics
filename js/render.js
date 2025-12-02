
(function(){
  const $ = (s,ctx=document)=>ctx.querySelector(s);
  const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));

  function productCard(p){
    return `<article class="card product" data-id="${p.id}" data-brand="${p.brand}" data-category="${p.category}">
      <a href="products/${p.id}.html"><img src="assets/img/${p.img}" alt="Фото товара ${p.title}" class="product__img" loading="lazy"></a>
      <h3 class="product__title"><a href="products/${p.id}.html">${p.title}</a></h3>

      <div class="product__price">${utils.fmtPrice(p.price)}</div>
      <button class="btn btn--primary" data-order data-id="${p.id}">Заказать</button>
    </article>`;
  }

  function bindAddToCart(root=document){
  root.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-order]');
    if(!btn) return;
    e.preventDefault();
    if(window.showOrder) window.showOrder();
  });
}

  function renderGrid(list, rootSel="#list"){
    const root = $(rootSel);
    if(!root) return;
    root.innerHTML = list.map(productCard).join('');
    bindAddToCart(root);
  }

  function initCatalog(){
    const root = document.getElementById('catalog-page');
    if(!root) return;
    const data = window.GE_DATA.products.slice();
    const q = $('#search');
    const minI = $('#min'); const maxI = $('#max');
    const sortSel = $('#sort');
    const brandChecks = $$('#brands input[type=checkbox]');
    const catChecks = $$('#cats input[type=checkbox]');
    const perPage = 12;
    let page = 1;

    function currentList(){
      let list = data.slice();
      const qv = q.value.trim().toLowerCase();
      if(qv) list = list.filter(p=> utils.searchIn(p, qv));
      const min = parseInt(minI.value||0,10);
      const max = parseInt(maxI.value||1e9,10);
      list = list.filter(p=> p.price>=min && p.price<=max);
      const brands = brandChecks.filter(c=>c.checked).map(c=>c.value);
      const cats = catChecks.filter(c=>c.checked).map(c=>c.value);
      if(brands.length) list = list.filter(p=> brands.includes(p.brand));
      if(cats.length) list = list.filter(p=> cats.includes(p.category));
      const sort = sortSel.value;
      list.sort(utils.by[sort] || utils.by.priceAsc);
      return list;
    }

    function draw(){
      const list = currentList();
      const {items, pages} = utils.paginate(list, perPage, page);
      renderGrid(items, '#list');
      const pag = $('#pagination');
      pag.innerHTML = Array.from({length: pages}, (_,i)=>`<button class="page-btn" ${i+1===page?'aria-current="page"':''} data-page="${i+1}">${i+1}</button>`).join('');
    }

    root.addEventListener('input', ()=>{page=1;draw()});
    $('#pagination')?.addEventListener('click', (e)=>{
      const b = e.target.closest('[data-page]'); if(!b) return;
      page = parseInt(b.dataset.page,10); draw();
    });

    draw();
  }

  function initBrand(){
    const root = document.getElementById('brand-page');
    if(!root) return;
    const brand = root.dataset.brand;
    const chips = $$('.chip[data-cat]');
    let active = 'Смартфоны';
    function draw(){
      const list = GE_DATA.products.filter(p=> p.brand===brand && (!active || p.category===active));
      renderGrid(list, '#list');
    }
    chips.forEach(ch=> ch.addEventListener('click', ()=>{
      chips.forEach(c=>c.setAttribute('aria-pressed','false'));
      ch.setAttribute('aria-pressed','true');
      active = ch.dataset.cat;
      draw();
    }));
    if(location.hash.includes(':')){
      const [,cat] = decodeURIComponent(location.hash.slice(1)).split(':');
      if(cat){
        active = cat;
        chips.forEach(c=> c.setAttribute('aria-pressed', c.dataset.cat===cat ? 'true' : 'false'));
      }
    } else {
      chips[0]?.setAttribute('aria-pressed','true');
    }
    draw();
  }

  function initHome(){
    const root = document.getElementById('home-page');
    if(!root) return;
    // Home now without "Лучшие устройства" section or CTA
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initCatalog();
    initBrand();
    initHome();
  });
})();
