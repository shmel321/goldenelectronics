
/*! Lightweight product lightbox gallery — no extra markup needed.
    It finds product images in <main> and enables open/prev/next. */
(function(){
  function collectImages(){
    const main = document.querySelector('main') || document.body;
    // likely product photos are in assets/img; skip icons (assets/icons)
    const imgs = Array.from(main.querySelectorAll('img')).filter(im=>{
      const src = (im.getAttribute('src')||'').toLowerCase();
      return src.includes('/assets/img/') || src.includes('../assets/img/');
    });
    return imgs;
  }

  function buildLightbox(urls){
    const wrap = document.createElement('div');
    wrap.className = 'lb';
    wrap.innerHTML = `
      <div class="lb__backdrop" data-close></div>
      <div class="lb__content">
        <button class="lb__close" title="Закрыть" data-close>×</button>
        <button class="lb__nav lb__prev" aria-label="Предыдущее">‹</button>
        <img class="lb__img" alt="Фото товара">
        <button class="lb__nav lb__next" aria-label="Следующее">›</button>
      </div>`;
    document.body.appendChild(wrap);
    const img = wrap.querySelector('.lb__img');
    let i = 0;
    function show(n){
      i = (n + urls.length) % urls.length;
      img.src = urls[i];
    }
    wrap.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-close')) hide();
    });
    wrap.querySelector('.lb__prev').addEventListener('click', ()=>show(i-1));
    wrap.querySelector('.lb__next').addEventListener('click', ()=>show(i+1));
    function showAt(idx){ show(idx); wrap.classList.add('lb--open'); }
    function hide(){ wrap.classList.remove('lb--open'); }
    return { showAt, hide };
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const imgs = collectImages();
    if(!imgs.length) return;
    const urls = imgs.map(im=>im.src);
    const lb = buildLightbox(urls);
    imgs.forEach((im, idx)=>{
      im.style.cursor = 'zoom-in';
      im.addEventListener('click', ()=> lb.showAt(idx));
    });
  });
})();
