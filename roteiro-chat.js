(function(){
"use strict";
var API_URL="https://ane-story-engine.base44.app/functions/roteiroChat";
var LOGO_URL="https://anecakefair.com.br/assets/image2.png";
var WHATSAPP_URL="https://api.whatsapp.com/send/?phone=5573991802061&text&type=phone_number&app_absent=0&utm_source=ig";
var INSTAGRAM_URL="https://instagram.com/anecakesfair";
var sessionId=localStorage.getItem("roteiro_chat_session")||"";
var history=[];
var isOpen=false;
var sending=false;

function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function svg(path){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg>';}

function buildWidget(){
  var fab=el("button","roteiro-chat-fab");
  fab.setAttribute("aria-label","Abrir chat do Ane Cakes Fair");
  fab.innerHTML='<span class="roteiro-chat-fab-pulse"></span><span class="roteiro-chat-fab-emoji">👩‍🍳</span><span class="roteiro-chat-fab-label">Ajuda</span>';

  var panel=el("div","roteiro-chat-panel");
  panel.innerHTML=
    '<div class="roteiro-chat-header">'+
      '<img src="'+LOGO_URL+'" alt="Ane Cakes Fair">'+
      '<div class="roteiro-chat-header-text">'+
        '<h3>Ane Cakes Fair</h3>'+
        '<span class="roteiro-chat-header-status">Online · Tire suas dúvidas</span>'+
      '</div>'+
      '<button class="roteiro-chat-close" aria-label="Fechar chat">&times;</button>'+
    '</div>'+
    '<div class="roteiro-chat-messages"></div>'+
    '<div class="roteiro-chat-input-area">'+
      '<div class="roteiro-chat-input-wrap">'+
        '<textarea class="roteiro-chat-input" placeholder="Escreva sua dúvida..." rows="1"></textarea>'+
        '<button class="roteiro-chat-send" aria-label="Enviar">'+svg('<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>')+'</button>'+
      '</div>'+
      '<div class="roteiro-chat-footer-note">Assistente do Ane Cakes Fair · 5ª edição</div>'+
    '</div>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var messagesEl=panel.querySelector(".roteiro-chat-messages");
  var inputEl=panel.querySelector(".roteiro-chat-input");
  var sendBtn=panel.querySelector(".roteiro-chat-send");

  fab.addEventListener("click",function(){if(!isOpen)openPanel();else closePanel();});
  panel.querySelector(".roteiro-chat-close").addEventListener("click",closePanel);

  function openPanel(){isOpen=true;panel.classList.add("open");fab.style.display="none";if(messagesEl.children.length===0){showWelcome();}setTimeout(function(){inputEl.focus();},300);}
  function closePanel(){isOpen=false;panel.classList.remove("open");fab.style.display="flex";}

  sendBtn.addEventListener("click",sendMessage);
  inputEl.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}});
  inputEl.addEventListener("input",function(){inputEl.style.height="auto";inputEl.style.height=Math.min(inputEl.scrollHeight,100)+"px";});

  function showWelcome(){
    addBot("Olá! Sou a assistente do <strong>Ane Cakes Fair</strong> 🧄<br>Posso tirar suas dúvidas sobre o projeto, o evento, a programação, parcerias e como participar. O que você gostaria de saber?");
    var sugg=el("div","roteiro-chat-suggestions");
    ["Quando e onde será o evento?","Como posso ser parceiro ou patrocinador?","Qual a programação dos dois dias?","Como participar da 5ª edição?"].forEach(function(q){
      var b=el("button","roteiro-chat-suggestion",q);
      b.addEventListener("click",function(){inputEl.value=q;sendMessage();});
      sugg.appendChild(b);
    });
    messagesEl.appendChild(sugg);
    scrollDown();
  }

  function addUser(text){var m=el("div","roteiro-chat-msg user");m.textContent=text;messagesEl.appendChild(m);scrollDown();}
  function addBot(html){var m=el("div","roteiro-chat-msg bot");m.innerHTML=html;messagesEl.appendChild(m);scrollDown();return m;}
  function addContact(){var c=el("div","roteiro-chat-contact");c.innerHTML='<a class="wa" href="'+WHATSAPP_URL+'" target="_blank" rel="noopener">💬 WhatsApp</a><a class="ig" href="'+INSTAGRAM_URL+'" target="_blank" rel="noopener">📷 Instagram</a>';messagesEl.appendChild(c);scrollDown();}
  function showTyping(){var t=el("div","roteiro-chat-typing");t.innerHTML="<span></span><span></span><span></span>";t.id="roteiro-typing";messagesEl.appendChild(t);scrollDown();}
  function hideTyping(){var t=document.getElementById("roteiro-typing");if(t)t.remove();}
  function scrollDown(){messagesEl.scrollTop=messagesEl.scrollHeight;}

  function sendMessage(){
    if(sending)return;
    var text=inputEl.value.trim();
    if(!text)return;
    sending=true;sendBtn.disabled=true;
    addUser(text);
    history.push({role:"user",content:text});
    inputEl.value="";inputEl.style.height="auto";
    showTyping();
    fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text,sessionId:sessionId,language:"pt",history:history.slice(-8)})})
      .then(function(r){return r.json();})
      .then(function(data){
        hideTyping();
        var answer=data.answer||"Não consegui processar agora, tente novamente.";
        addBot(answer);
        history.push({role:"assistant",content:answer});
        if(data.suggestContact){addContact();}
        if(data.sessionId){sessionId=data.sessionId;localStorage.setItem("roteiro_chat_session",sessionId);}
      })
      .catch(function(){
        hideTyping();
        addBot("Tive um problema de conexão, mas nossa equipe pode te ajudar! Fale com a gente 👇");
        addContact();
      })
      .finally(function(){sending=false;sendBtn.disabled=false;});
  }
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",buildWidget);}else{buildWidget();}
})();