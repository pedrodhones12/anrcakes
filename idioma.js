/* Ane Cakes Fair — tradução nativa, sem Google Translate. */
(function(){
  const LANGS=['pt','en','es'];
  const DICT={pt:{language:'Idioma',choose_language:'Escolha o idioma'},en:{language:'Language',choose_language:'Choose a language'},es:{language:'Idioma',choose_language:'Elige un idioma'}};
  function apply(lang){
    if(!LANGS.includes(lang)) lang='pt';
    localStorage.setItem('anecake-language',lang);
    document.documentElement.lang=lang==='pt'?'pt-BR':lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(DICT[lang][key]!==undefined)el.textContent=DICT[lang][key]});
    document.querySelectorAll('.project-language-select').forEach(s=>s.value=lang);
    window.dispatchEvent(new CustomEvent('anecake:language',{detail:{lang}}));
  }
  function boot(){
    const select=document.querySelector('.project-language-select');
    if(!select)return setTimeout(boot,100);
    select.addEventListener('change',()=>apply(select.value));
    apply(localStorage.getItem('anecake-language')||'pt');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.AneCakesLanguage={apply};
})();
