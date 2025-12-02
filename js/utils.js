
window.utils = (function(){
  const fmtPrice = (n)=> new Intl.NumberFormat('ru-RU').format(n) + " ₽";
  const searchIn = (item, q)=> item.title.toLowerCase().includes(q.toLowerCase());
  const by = {
    priceAsc:(a,b)=>a.price-b.price,
    priceDesc:(a,b)=>b.price-a.price,
    newest:(a,b)=> (b.id).localeCompare(a.id),
    popular:(a,b)=> (b.popular===a.popular)?0:(b.popular?1:-1),
  };
  function paginate(arr, size=12, page=1){
    const start = (page-1)*size;
    return { items: arr.slice(start, start+size), pages: Math.ceil(arr.length/size) };
  }
  return { fmtPrice, searchIn, by, paginate };
})();
