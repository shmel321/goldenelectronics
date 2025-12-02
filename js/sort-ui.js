
/*! Sorting enhancer: segmented buttons built from existing <select> */
(function(){
  function enhanceSorting(root){
    const candidates = Array.from(root.querySelectorAll('select')).filter(sel=>{
      const n = (sel.getAttribute('name')||'') + ' ' + (sel.id||'') + ' ' + (sel.className||'');
      return /sort|сорт/i.test(n) || /сорт/i.test((sel.closest('label')||{}).textContent||'');
    });
    if(!candidates.length) return;
    const sel = candidates[0];
    const bar = document.createElement('div');
    bar.className = 'sort-bar';
    const box = document.createElement('div');
    box.className = 'sort-native';
    const clone = sel.cloneNode(true);
    box.appendChild(clone);
    sel.replaceWith(bar);
    bar.appendChild(box);

    const seg = document.createElement('div');
    seg.className = 'sort-segment';
    const opts = Array.from(clone.options).map(o=>({value:o.value, label:(o.text||'').trim()})).filter(o=>o.label);
    if(!opts.length) return;
    opts.forEach((o, i)=>{
      const b = document.createElement('button');
      b.type='button'; b.textContent=o.label;
      b.setAttribute('aria-pressed', String(clone.value===o.value || (!clone.value && i===0)));
      b.addEventListener('click', ()=>{
        clone.value = o.value;
        seg.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));
        b.setAttribute('aria-pressed','true');
        clone.dispatchEvent(new Event('change', {bubbles:true}));
      });
      seg.appendChild(b);
    });
    bar.appendChild(seg);
    box.classList.add('is-enhanced');
  }
  document.addEventListener('DOMContentLoaded', function(){
    const isCatalog = /catalog\.html/i.test(location.pathname) ||
                      document.querySelector('.catalog, [data-page="catalog"], .products-grid');
    if(isCatalog) enhanceSorting(document);
  });
})();
