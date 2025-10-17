
(function(){
  // Mark active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    if(a.getAttribute('href') === path) a.classList.add('active');
  });

  // Theme handling
  function isDark(){ return document.documentElement.dataset.theme === 'dark'; }
  function applyTheme(theme){ document.documentElement.dataset.theme = theme; localStorage.setItem('theme', theme); }
  function toggleTheme(){ applyTheme(isDark() ? 'light' : 'dark'); const btn = document.getElementById('themeToggle'); if(btn){ btn.setAttribute('aria-pressed', String(isDark())); } }
  const saved = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);
  const btn = document.getElementById('themeToggle'); if(btn){ btn.addEventListener('click', toggleTheme); btn.setAttribute('aria-pressed', String(isDark())); }

  // Footer year
  const year = document.getElementById('year'); if(year){ year.textContent = new Date().getFullYear(); }

  // Register Service Worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }

  // Optional: PWA install prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(async ()=>{ if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt = null; } }, 800);
  });
})();
