/* Ane Cakes Fair — tradução nativa, sem Google Translate. */
(function(){
  const LANGS=['pt','en','es'];
  let DICT={};
  const originals=new WeakMap();
  const SKIP=new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','OPTION']);
  const normalize=s=>s.replace(/\s+/g,' ').trim();
  const preserve=(original,translated)=>{const lead=(original.match(/^\s*/)||[''])[0],trail=(original.match(/\s*$/)||[''])[0];return lead+translated+trail};
  function collect(){
    const root=document.body;if(!root)return [];
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){if(!n.nodeValue.trim()||SKIP.has(n.parentElement?.tagName)||n.parentElement?.closest('.project-language'))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}});
    const nodes=[];while(walker.nextNode()){const n=walker.currentNode;if(!originals.has(n))originals.set(n,n.nodeValue);nodes.push(n)}return nodes;
  }
  function translateAttributes(lang){
    document.querySelectorAll('[data-i18n-placeholder],[data-i18n-title],[data-i18n-aria-label],[data-i18n-alt]').forEach(el=>{
      [['data-i18n-placeholder','placeholder'],['data-i18n-title','title'],['data-i18n-aria-label','aria-label'],['data-i18n-alt','alt']].forEach(([a,target])=>{const key=el.getAttribute(a);if(key&&DICT[lang]?.[key]!==undefined)el.setAttribute(target,DICT[lang][key])});
    });
  }
  function apply(lang){
    if(!LANGS.includes(lang))lang='pt';
    localStorage.setItem('anecake-language',lang);
    document.documentElement.lang=lang==='pt'?'pt-BR':lang;
    const map=DICT[lang]||{};
    collect().forEach(n=>{const key=normalize(originals.get(n)||'');const translated=map[key];n.nodeValue=translated!==undefined?preserve(originals.get(n),translated):originals.get(n)});
    document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(map[key]!==undefined)el.textContent=map[key]});
    translateAttributes(lang);
    document.querySelectorAll('.project-language-select').forEach(s=>s.value=lang);
    window.dispatchEvent(new CustomEvent('anecake:language',{detail:{lang}}));
  }
  async function load(){try{const r=await fetch('idiomas.json',{cache:'no-store'});DICT=await r.json()}catch(e){DICT={pt:{},en:{},es:{}}}boot()}
  function boot(){const select=document.querySelector('.project-language-select');if(!select)return setTimeout(boot,100);select.addEventListener('change',()=>apply(select.value));apply(localStorage.getItem('anecake-language')||'pt')}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
  window.AneCakesLanguage={apply};
})();
