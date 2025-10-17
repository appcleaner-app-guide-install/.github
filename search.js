
(async function(){
  const input = document.getElementById('searchInput');
  const results = document.getElementById('results');
  if(!input || !results) return;

  let index = [];
  try{
    const res = await fetch('search-index.json', {cache:'no-store'});
    index = await res.json();
  }catch(e){ results.innerHTML = '<p class="notice">Failed to load search index.</p>'; return; }

  function tokenize(q){ return (q.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(w=>w.length>1); }

  function score(doc, terms){
    let s = 0;
    const hay = (doc.title + ' ' + doc.keywords + ' ' + doc.description).toLowerCase();
    for(const t of terms){
      const count = (hay.match(new RegExp('\\b'+t+'\\b','g'))||[]).length;
      s += count ? (3*count) : (hay.includes(t) ? 1 : 0);
    }
    // small boost for shorter URL paths (top-level pages)
    s += Math.max(0, 3 - (doc.url.split('/').length - 1));
    return s;
  }

  function render(docs){
    if(!docs.length){ results.innerHTML = '<p class="notice">No results. Try broader terms.</p>'; return; }
    results.innerHTML = docs.map(d=>`
      <article class="card">
        <h3 style="margin:0;"><a href="${d.url}">${d.title}</a></h3>
        <p style="margin:6px 0 0; color:#94a3b8">${d.description}</p>
        <small class="badge" style="margin-top:8px;display:inline-block">${d.url}</small>
      </article>
    `).join('');
  }

  function onSearch(){
    const q = input.value.trim();
    if(!q){ results.innerHTML=''; return; }
    const terms = tokenize(q);
    const ranked = index
      .map(doc => ({doc, s: score(doc, terms)}))
      .filter(x => x.s > 0)
      .sort((a,b)=>b.s-a.s)
      .slice(0, 20)
      .map(x=>x.doc);
    render(ranked);
  }

  input.addEventListener('input', onSearch);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ onSearch(); } });
})();
