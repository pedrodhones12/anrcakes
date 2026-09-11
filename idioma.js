/* Seletor de idiomas do Ane Cakes Fair — interface própria, sem interface visível do Google */
(function(){
  const boot=()=>{
    const old=document.querySelector('.project-language');
    if(!old) return setTimeout(boot,250);
    old.querySelectorAll('.goog-te-gadget,.goog-te-banner-frame,.goog-logo-link').forEach(el=>el.remove());
    const style=document.createElement('style');
    style.textContent=`
      .project-language{position:relative;display:flex;align-items:center;margin-left:12px;font-family:inherit}
      .project-language-toggle{display:inline-flex!important;align-items:center;gap:7px;border:1px solid rgba(77,45,30,.2)!important;background:rgba(255,250,244,.96)!important;color:var(--brown)!important;border-radius:999px!important;padding:9px 14px!important;font:inherit!important;font-size:11px!important;font-weight:700!important;letter-spacing:.07em!important;cursor:pointer!important;white-space:nowrap;box-shadow:none!important}
      .project-language-toggle:hover{background:#fff!important;transform:translateY(-1px)}
      .project-language-panel{background:var(--paper)!important;border:1px solid var(--line)!important;border-radius:18px!important;box-shadow:0 20px 55px rgba(61,32,20,.16)!important;padding:16px!important;width:245px!important}
      .project-language-panel label{font-size:9px!important;letter-spacing:.16em!important;color:#8a7165!important}
      .project-language-select{appearance:none!important;width:100%!important;background:#fff!important;border:1px solid rgba(77,45,30,.16)!important;border-radius:12px!important;color:var(--brown)!important;padding:12px 36px 12px 13px!important;font:inherit!important;font-size:13px!important;outline:none!important;cursor:pointer!important}
      .project-language-select:focus{border-color:var(--gold)!important;box-shadow:0 0 0 3px rgba(198,154,66,.12)!important}
      .goog-te-banner-frame,.goog-te-banner-frame.skiptranslate,iframe.goog-te-banner-frame,.goog-te-balloon-frame,.goog-te-menu-frame,.goog-tooltip,.goog-tooltip:hover,.goog-text-highlight{display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;width:0!important;pointer-events:none!important}
      body{top:0!important}
      @media(max-width:750px){.project-language{width:100%;margin:10px 0 0}.project-language-toggle{width:100%;justify-content:center}.project-language-panel{position:absolute!important;left:0!important;right:0!important;top:calc(100% + 8px)!important;width:100%!important;box-sizing:border-box!important}}
    `;
    document.head.appendChild(style);
    const removeGoogle=()=>{
      document.querySelectorAll('.goog-te-banner-frame,.goog-te-balloon-frame,.goog-te-menu-frame,.goog-tooltip,.goog-te-gadget').forEach(el=>{if(!el.closest('.project-language-panel'))el.style.display='none'});
      document.querySelectorAll('iframe[title*="Translate"],iframe[src*="translate.google.com"]').forEach(el=>el.style.display='none');
      document.body.style.top='0';
    };
    removeGoogle();
    new MutationObserver(removeGoogle).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
