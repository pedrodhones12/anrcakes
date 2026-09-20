/* Ane Cakes Fair — botão de idioma flutuante para páginas sem script.js */
(function(){
  if(document.querySelector('.project-language'))return;
  var st=document.createElement('style');
  st.textContent='.project-language{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;align-items:center}'
    +'.project-language-toggle{appearance:none;border:1px solid rgba(77,45,30,.2);background:rgba(255,250,244,.96);color:#4d2d1e;border-radius:999px;padding:9px 14px;font:inherit;font-size:11px;font-weight:700;letter-spacing:.07em;cursor:pointer;white-space:nowrap;box-shadow:0 4px 16px rgba(61,32,20,.14)}'
    +'.project-language-toggle:hover{background:#fff}'
    +'.project-language-panel{position:absolute;right:0;bottom:calc(100% + 10px);width:245px;padding:16px;border:1px solid #e5d5c6;border-radius:18px;background:#faf3ea;box-shadow:0 20px 55px rgba(61,32,20,.16);display:none}'
    +'.project-language-panel.open{display:block}'
    +'.project-language-panel label{display:block;margin-bottom:8px;font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#8a7165}'
    +'.project-language-select{appearance:none;width:100%;border:1px solid rgba(77,45,30,.16);border-radius:12px;background:#fff;color:#4d2d1e;padding:12px;font:inherit;font-size:13px;cursor:pointer}'
    +'@media(max-width:480px){.project-language{right:12px;bottom:12px}.project-language-panel{left:0;right:0;width:auto}}';
  document.head.appendChild(st);
  var language=document.createElement('div');
  language.className='project-language';
  language.innerHTML='<button class="project-language-toggle" type="button" aria-expanded="false" data-i18n="language">\ud83c\udf10 Idioma</button><div class="project-language-panel"><label for="project-language-select" data-i18n="choose_language">Escolha o idioma</label><select id="project-language-select" class="project-language-select"><option value="pt">\ud83c\udde7\ud83c\uddf7 Portugu\u00eas</option><option value="en">\ud83c\uddfa\ud83c\uddf8 English</option><option value="es">\ud83c\uddea\ud83c\uddf8 Espa\u00f1ol</option></select></div>';
  document.body.appendChild(language);
  var toggle=language.querySelector('.project-language-toggle'),panel=language.querySelector('.project-language-panel');
  toggle.onclick=function(e){e.stopPropagation();var o=panel.classList.toggle('open');toggle.setAttribute('aria-expanded',o)};
  document.addEventListener('click',function(e){if(!language.contains(e.target)){panel.classList.remove('open');toggle.setAttribute('aria-expanded','false')}});
  var s=document.createElement('script');s.src='idioma.js';s.defer=true;document.head.appendChild(s);
})();