(()=>{const S={step:1,total:7,style:"elegante",photo:null,mode:"embaixador"},$=id=>document.getElementById(id),steps=[...document.querySelectorAll(".form-step")];
function boot(){bind();renderStep();updatePreview();updateModeUI();addHighlight();renderLocalGallery();window.addEventListener("beforeunload",()=>localStorage.removeItem("aneCakesCards"));}
function bind(){document.querySelectorAll(".mode-card").forEach(b=>b.onclick=()=>{S.mode=b.dataset.mode;S.step=1;S.total=S.mode==="eu-vou"?2:7;document.querySelectorAll(".mode-card").forEach(x=>x.classList.toggle("selected",x===b));updateModeUI();renderStep();updatePreview()});$("choosePhoto").onclick=()=>$("photo").click();$("euVouChoosePhoto").onclick=()=>$("euVouPhotoInput").click();$("euVouUploadZone").onclick=e=>{if(e.target.tagName!=="BUTTON"&&e.target.id!=="euVouPhotoPreview")$("photo").click()};$("euVouName").oninput=e=>{$("displayName").value=e.target.value;updatePreview()};$("euVouGenerateBtn").onclick=()=>{if(!S.photo)return msg("Envie sua foto para continuar.");if(!$("euVouName").value.trim())return msg("Informe seu nome para continuar.");$("displayName").value=$("euVouName").value.trim();generate(new Event("submit"));};$("uploadZone").onclick=e=>{if(e.target.tagName!=="BUTTON"&&e.target.id!=="photoPreview")$("photo").click()};function handlePhotoChange(e){const f=e.target.files[0];if(!f)return;if(!/^image\/(jpeg|png|webp)$/.test(f.type))return msg("Use JPG, PNG ou WEBP.");if(f.size>8*1024*1024)return msg("A foto deve ter no máximo 8 MB.");S.photo=f;const url=URL.createObjectURL(f);$("photoPreview").src=url;$("photoPreview").classList.remove("hidden");$("photoPlaceholder").classList.add("hidden");$("euVouPhotoPreview").src=url;$("euVouPhotoPreview").classList.remove("hidden");$("euVouPhotoPlaceholder").classList.add("hidden")}$("photo").onchange=handlePhotoChange;$("euVouPhotoInput").onchange=handlePhotoChange;$("story").oninput=e=>$("storyCount").textContent=e.target.value.length;$("addHighlight").onclick=()=>addHighlight();$("visualLocation").onchange=()=>$("otherLocationWrap").classList.toggle("hidden",$("visualLocation").value!=="other");document.querySelectorAll(".style-option").forEach(b=>b.onclick=()=>{document.querySelectorAll(".style-option").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");S.style=b.dataset.style});$("nextBtn").onclick=next;$("backBtn").onclick=back;$("tagForm").onsubmit=e=>{e.preventDefault();generate(e)};$("generateBtn").onclick=e=>{e.preventDefault();generate(e)};$("regenerateBtn").onclick=()=>{$("resultSection").classList.add("hidden");window.scrollTo({top:0,behavior:"smooth"})};["displayName","city","state","gender"].forEach(id=>$(id).addEventListener("input",updatePreview))}
function addHighlight(v=""){const r=document.createElement("div");r.className="highlight-row";r.innerHTML='<input maxlength="120" placeholder="Ex.: Mais de 10 anos de experiência"><button type="button" class="remove-highlight">×</button>';r.querySelector("input").value=v;r.querySelector("button").onclick=()=>r.remove();$("highlights").appendChild(r)}
function updateModeUI(){const eu=S.mode==="eu-vou";document.querySelector(".creator-section").classList.toggle("eu-vou-active",eu);document.body.classList.toggle("eu-vou-mode",eu);$("modeHint").textContent=eu?"Modo EU VOU: coloque sua foto e mostre que você estará na Ane Cakes Fair.":"Modo Embaixador(a): crie uma arte contando sua história.";document.querySelectorAll(".ambassador-only").forEach(el=>el.classList.toggle("hidden",eu));$("generateBtn").textContent=eu?"🎟️ Criar minha tag EU VOU":"✨ Gerar minha arte"}
function next(){if(S.step===1&&!S.photo)return msg("Envie sua foto para continuar.");if(S.step<S.total){S.step++;renderStep()}}
function back(){if(S.step>1){S.step--;renderStep()}}
function renderStep(){steps.forEach((x,i)=>x.classList.toggle("active",i+1===S.step));$("stepNumber").textContent=S.step;const titles=S.mode==="eu-vou"?["Sua foto","Seu nome"]:["Sua foto","Sua identidade","Sua história","Destaques","Frase","Localização","Estilo"];$("stepTitle").textContent=titles[S.step-1];$("progressFill").style.width=S.step/S.total*100+"%";$("backBtn").classList.toggle("hidden",S.step===1);$("nextBtn").classList.toggle("hidden",S.step===S.total);$("generateBtn").classList.toggle("hidden",S.step!==S.total);updatePreview()}
function updatePreview(){const n=$("displayName").value||"Seu nome",c=$("city").value||"Ilhéus",u=$("state").value||"BA",g=$("gender").value;$("pvName").textContent=n;$("pvLocation").textContent=c+" · "+u;$("pvKicker").textContent=g==="male"?"CONHEÇA NOSSO EMBAIXADOR":g==="neutral"?"CONHEÇA NOSSO REPRESENTANTE":"CONHEÇA NOSSA EMBAIXADORA"}
function collect(){const eu=S.mode==="eu-vou";return{mode:S.mode,fullName:$("fullName").value.trim(),displayName:$("displayName").value.trim(),profession:eu?"Participante da Ane Cakes Fair":$("profession").value.trim(),city:$("city").value.trim()||"Ilhéus",state:($("state").value.trim()||"BA").toUpperCase(),birthPlace:$("birthPlace").value.trim(),story:$("story").value.trim(),highlights:[...document.querySelectorAll("#highlights input")].map(x=>x.value.trim()).filter(Boolean),quote:$("quote").value.trim(),visualLocation:$("visualLocation").value,otherLocation:$("otherLocation").value.trim(),gender:$("gender").value,style:S.style}}
function fitText(ctx,text,maxWidth,maxSize,minSize){for(let size=maxSize;size>=minSize;size-=2){ctx.font="700 "+size+"px Arial";if(ctx.measureText(text).width<=maxWidth)return size}return minSize}
function wrap(ctx,text,maxWidth){const words=String(text||"").split(/\s+/),lines=[];let line="";for(const w of words){const t=line?line+" "+w:w;if(ctx.measureText(t).width>maxWidth&&line){lines.push(line);line=w}else line=t}if(line)lines.push(line);return lines}
function loadImage(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src})}
function compressPhoto(file){return new Promise((resolve,reject)=>{const u=URL.createObjectURL(file),i=new Image();i.onload=()=>{const max=1600,r=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=Math.round(i.width*r);c.height=Math.round(i.height*r);c.getContext("2d").drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>{if(!b)return reject(Error("compress"));const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=reject;fr.readAsDataURL(b)},"image/jpeg",.88)};i.onerror=reject;i.src=u})}
function drawText(ctx,d,W,H){
  if(d.mode==="eu-vou")return drawEuVou(ctx,d,W,H);
  const wine="#8f1828", burgundy="#701522", gold="#c79a4b", cream="#f8efe4", ink="#351e18", muted="#654e45";
  ctx.save();

  // Composição editorial oficial: creme, vinho, dourado, moldura fina, foto dominante à esquerda e informação organizada à direita.
  // creme + moldura dourada + hierarquia editorial + pessoa visualmente dominante à esquerda.
  ctx.fillStyle="rgba(250,242,232,.16)";ctx.fillRect(0,0,W,H);

  // Moldura externa dourada.
  ctx.strokeStyle="rgba(190,145,68,.95)";ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(34,34,W-68,H-68,28);ctx.stroke();
  ctx.strokeStyle="rgba(190,145,68,.38)";ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(48,48,W-96,H-96,20);ctx.stroke();

  // Vinheta clara nas áreas destinadas à tipografia, sem esconder a fotografia.
  const topWash=ctx.createLinearGradient(0,0,0,H*.48);
  topWash.addColorStop(0,"rgba(250,242,232,.94)");
  topWash.addColorStop(.72,"rgba(250,242,232,.70)");
  topWash.addColorStop(1,"rgba(250,242,232,0)");
  ctx.fillStyle=topWash;ctx.fillRect(50,50,W-100,H*.46);

  // Marca tipográfica no topo, seguindo a referência.
  ctx.textAlign="center";
  ctx.fillStyle=wine;ctx.font="700 88px Georgia";ctx.fillText("ANE",W/2,145);
  ctx.fillStyle=ink;ctx.font="500 24px Arial";ctx.fillText("CAKES FAIR",W/2,177);
  ctx.strokeStyle=gold;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(W/2-180,194);ctx.lineTo(W/2+180,194);ctx.stroke();
  ctx.fillStyle=wine;ctx.font="600 16px Arial";ctx.fillText("ONDE A CONFEITARIA VIRA EXPERIÊNCIA.",W/2,222);

  const title=d.gender==="male"?"EMBAIXADOR":d.gender==="neutral"?"REPRESENTANTE":"EMBAIXADORA";
  ctx.fillStyle=ink;ctx.font="600 34px Georgia";ctx.fillText("CONHEÇAM MAIS UM"+(d.gender==="male"||d.gender==="neutral"?"":"A"),W/2,285);
  ctx.fillStyle=wine;ctx.font="700 66px Georgia";ctx.fillText(title,W/2,350);
  ctx.strokeStyle=gold;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(190,376);ctx.lineTo(890,376);ctx.stroke();
  ctx.fillStyle=ink;ctx.font="500 25px Arial";ctx.fillText("DA ANE CAKES FAIR",W/2,410);

  // Bloco de informações à direita, como na arte de referência.
  const x=585, max=430;
  ctx.textAlign="left";
  ctx.fillStyle=wine;
  const nameSize=fitText(ctx,d.displayName,max,64,34);ctx.font="700 "+nameSize+"px Georgia";ctx.fillText(d.displayName,x,600);
  ctx.strokeStyle=gold;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,620);ctx.lineTo(x+max,620);ctx.stroke();

  // Pílula de localização.
  const loc="📍 "+(d.city||"Ilhéus")+" - "+(d.state||"BA");
  ctx.fillStyle=burgundy;ctx.beginPath();ctx.roundRect(x,640,max,48,24);ctx.fill();
  ctx.fillStyle="#fff";ctx.font="600 20px Arial";ctx.fillText(loc,x+22,672);

  // História.
  let y=720;
  ctx.fillStyle=wine;ctx.font="700 19px Arial";ctx.fillText("✦ HISTÓRIA QUE INSPIRA",x,y);
  y+=34;ctx.fillStyle=ink;ctx.font="400 18px Arial";
  const story=wrap(ctx,d.story||"Uma trajetória marcada por talento, coragem e transformação.",max-8).slice(0,4);
  story.forEach((l,i)=>ctx.fillText(l,x,y+i*25));y+=Math.max(1,story.length)*25+22;

  // Destaques.
  d.highlights.slice(0,3).forEach((h,i)=>{
    ctx.fillStyle=gold;ctx.font="700 21px Arial";ctx.fillText(["♛","✦","♥"][i],x,y);
    ctx.fillStyle=ink;ctx.font="400 17px Arial";
    const lines=wrap(ctx,h,max-34).slice(0,2);
    lines.forEach((l,k)=>ctx.fillText(l,x+30,y+k*22));
    y+=Math.max(1,lines.length)*22+16;
  });

  // Frase em caixa delicada.
  const quote=d.quote||"Onde a confeitaria vira experiência.";
  const qLines=wrap(ctx,quote,max-42).slice(0,3);
  const qh=86+qLines.length*18;
  ctx.fillStyle="rgba(255,248,240,.90)";ctx.beginPath();ctx.roundRect(x,y,max,qh,18);ctx.fill();
  ctx.strokeStyle=gold;ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle=wine;ctx.font="italic 19px Georgia";
  qLines.forEach((l,i)=>ctx.fillText("“"+l+(i===qLines.length-1?"”":""),x+22,y+34+i*25));
  y+=qh+30;

  // Assinatura oficial.
  ctx.textAlign="center";
  ctx.fillStyle=ink;ctx.font="600 17px Arial";ctx.fillText("EMBAIXADOR(A) OFICIAL DA",W*.74,y);
  ctx.fillStyle=burgundy;ctx.beginPath();ctx.roundRect(W*.58,y+16,W*.32,46,23);ctx.fill();
  ctx.fillStyle="#fff";ctx.font="700 18px Georgia";ctx.fillText("ANE CAKES FAIR",W*.74,y+46);

  // Ornamentação floral linear simplificada nos cantos.
  drawFloralCorner(ctx,72,78,1);
  drawFloralCorner(ctx,W-72,H-82,-1);
  ctx.restore();
}
function drawFloralCorner(ctx,x,y,dir){
  ctx.save();ctx.strokeStyle="rgba(199,154,75,.55)";ctx.lineWidth=2;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+dir*28,y+20,x+dir*44,y+58,x+dir*66,y+78);ctx.stroke();
  for(let i=0;i<4;i++){
    const px=x+dir*(18+i*15),py=y+18+i*18;
    ctx.beginPath();ctx.ellipse(px,py,10,22,dir*.55,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(px+dir*13,py-8,8,17,dir*-.45,0,Math.PI*2);ctx.stroke();
  }
  ctx.beginPath();ctx.arc(x+dir*12,y+10,12,0,Math.PI*2);ctx.stroke();
  ctx.restore();
}
function drawEuVou(ctx,d,W,H){
  const burgundy="#701522",wine="#8f1828",gold="#d4ad67",cream="#f8efe4";
  ctx.save();
  const wash=ctx.createLinearGradient(0,0,0,H);wash.addColorStop(0,"rgba(248,239,228,.05)");wash.addColorStop(.48,"rgba(60,16,24,.18)");wash.addColorStop(1,"rgba(35,10,18,.88)");ctx.fillStyle=wash;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle=gold;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(32,32,W-64,H-64,28);ctx.stroke();
  ctx.strokeStyle="rgba(255,232,190,.45)";ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(48,48,W-96,H-96,22);ctx.stroke();
  ctx.textAlign="center";ctx.fillStyle="#fff";ctx.font="700 28px Arial";ctx.fillText("ANE CAKES FAIR",W/2,88);
  ctx.fillStyle=gold;ctx.font="700 104px Georgia";ctx.fillText("EU VOU!",W/2,205);
  ctx.fillStyle=cream;ctx.font="600 21px Arial";ctx.fillText("5ª EDIÇÃO · ILHÉUS, BAHIA",W/2,245);
  ctx.fillStyle="rgba(50,14,22,.88)";ctx.beginPath();ctx.roundRect(65,H-375,W-130,285,28);ctx.fill();
  ctx.strokeStyle="rgba(212,173,103,.7)";ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle="#fff";ctx.font="700 56px Georgia";ctx.fillText(d.displayName||"Seu nome",W/2,H-278);
  ctx.fillStyle=gold;ctx.font="600 20px Arial";ctx.fillText("EU VOU ESTAR NA ANE CAKES FAIR",W/2,H-232);
  ctx.fillStyle="#fff";ctx.font="500 20px Arial";ctx.fillText("30 E 31 DE JANEIRO DE 2027",W/2,H-185);
  ctx.fillStyle=cream;ctx.font="500 18px Arial";ctx.fillText("Ilhéus · Bahia",W/2,H-145);
  ctx.fillStyle=gold;ctx.font="700 15px Arial";ctx.fillText("CAPACITAÇÃO QUE VIRA PROFISSÃO",W/2,H-98);
  drawFloralCorner(ctx,70,80,1);drawFloralCorner(ctx,W-70,H-90,-1);
  ctx.restore();
}
async function renderFinal(aiUrl,d){const ai=await loadImage(aiUrl),W=1080,H=1350,c=document.createElement("canvas"),ctx=c.getContext("2d");c.width=W;c.height=H;const scale=Math.max(W/ai.width,H/ai.height),w=ai.width*scale,h=ai.height*scale;ctx.drawImage(ai,(W-w)/2,(H-h)/2,w,h);drawText(ctx,d,W,H);return c.toDataURL("image/png")}
async function localFallback(d){
  const u=URL.createObjectURL(S.photo),img=await loadImage(u),W=1080,H=1350,c=document.createElement("canvas"),ctx=c.getContext("2d");
  c.width=W;c.height=H;
  ctx.fillStyle="#f8efe4";ctx.fillRect(0,0,W,H);

  // Composição determinística inspirada na referência: pessoa grande à esquerda,
  // bloco editorial limpo à direita e detalhes vinho/dourados.
  const bg=ctx.createRadialGradient(820,240,20,820,240,620);
  bg.addColorStop(0,"rgba(255,255,255,.65)");bg.addColorStop(1,"rgba(199,154,75,.06)");
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  ctx.save();
  ctx.strokeStyle="#c79a4b";ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(28,28,W-56,H-56,26);ctx.stroke();
  ctx.strokeStyle="rgba(199,154,75,.38)";ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(43,43,W-86,H-86,20);ctx.stroke();
  ctx.restore();

  // Moldura fotográfica vertical/oval, ocupando aproximadamente 48% da largura.
  const cx=315, cy=845, rx=275, ry=500;
  ctx.save();
  ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.clip();
  const scale=Math.max((rx*2)/img.width,(ry*2)/img.height);
  const iw=img.width*scale,ih=img.height*scale;
  ctx.drawImage(img,cx-iw/2,cy-ih/2,iw,ih);
  const shade=ctx.createLinearGradient(0,cy-ry,0,cy+ry);
  shade.addColorStop(0,"rgba(255,255,255,.05)");shade.addColorStop(1,"rgba(70,20,20,.16)");
  ctx.fillStyle=shade;ctx.fillRect(cx-rx,cy-ry,rx*2,ry*2);
  ctx.restore();

  ctx.strokeStyle="#c79a4b";ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(cx,cy,rx+8,ry+8,0,0,Math.PI*2);ctx.stroke();

  drawText(ctx,d,W,H);
  URL.revokeObjectURL(u);return c.toDataURL("image/png")
}
async function generate(e){
  if(e?.preventDefault)e.preventDefault();
  if($("generateBtn").disabled)return;
  if(!S.photo)return msg("Envie sua foto para continuar.");
  const d=collect();
  if(!d.displayName)return msg("Informe o nome que aparecerá no card.");
  if(S.mode==="embaixador"&&!d.profession)return msg("Preencha sua profissão para continuar.");

  $("generateBtn").disabled=true;
  $("generateBtn").textContent="✨ Gerando sua arte...";
  msg("Preparando sua composição no estilo oficial da Ane Cakes Fair...");

  try{
    const photoDataUrl=await compressPhoto(S.photo);
    let aiUrl="";
    let apiUnavailable=false;

    // EU VOU is intentionally generated locally: this makes the simple attendee tag
    // independent of the AI server and guarantees the button works immediately.
    if(S.mode==="eu-vou"){
      const finalUrl=await localFallback(d);
      $("resultImage").src=finalUrl;
      $("downloadBtn").href=finalUrl;
      $("downloadBtn").download="ane-cakes-eu-vou-"+(d.displayName||"participante").replace(/[^a-z0-9]+/gi,"-").toLowerCase()+".png";
      $("resultSection").classList.remove("hidden");
      $("resultSection").scrollIntoView({behavior:"smooth"});
      saveLocal();
      msg("Sua tag EU VOU foi criada com sucesso!","success");
      renderLocalGallery();
      return;
    }

    try{
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),75000);
      const response=await fetch("/api/generate-card",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...d,photoDataUrl}),
        signal:controller.signal
      });
      clearTimeout(timer);

      const payload=await response.json().catch(()=>({}));
      if(response.ok&&payload.imageDataUrl) aiUrl=payload.imageDataUrl;
      else if(response.status===503||response.status===429||response.status===502) apiUnavailable=true;
      else throw new Error(payload.error||"Não foi possível gerar a arte.");
    }catch(apiError){
      console.warn("Gerador de IA indisponível. Ativando composição local:",apiError);
      apiUnavailable=true;
    }

    const finalUrl=aiUrl?await renderFinal(aiUrl,d):await localFallback(d);
    $("resultImage").src=finalUrl;
    $("downloadBtn").href=finalUrl;
    $("downloadBtn").download=(S.mode==="eu-vou"?"ane-cakes-eu-vou-":"ane-cakes-")+(d.displayName||"participante").replace(/[^a-z0-9]+/gi,"-").toLowerCase()+".png";
    $("resultSection").classList.remove("hidden");
    $("resultSection").scrollIntoView({behavior:"smooth"});
    saveLocal();
    msg(apiUnavailable?"Arte criada com a composição oficial, mesmo sem a IA disponível no momento.":"Arte criada com inteligência artificial!","success");
    renderLocalGallery();
  }catch(err){
    console.error(err);
    msg(err?.message||"Não foi possível criar a arte. Tente novamente.");
  }finally{
    $("generateBtn").disabled=false;
    $("generateBtn").textContent=S.mode==="eu-vou"?"🎟️ Criar minha tag EU VOU":"✨ Gerar minha arte";
  }
}
function saveLocal(){localStorage.removeItem("aneCakesCards")}
function renderLocalGallery(){const list=JSON.parse(localStorage.getItem("aneCakesCards")||"[]");$("gallery").innerHTML=list.length?list.map(x=>'<article class="gallery-card"><img src="'+x.image+'" alt="Arte de '+esc(x.name)+'"><div class="gallery-card-body"><strong>'+esc(x.name)+'</strong><small>'+esc(x.style||"")+ " · "+new Date(x.date).toLocaleDateString("pt-BR")+"</small></div></article>").join(""):'<p class="empty-state">Suas artes criadas neste dispositivo aparecerão aqui.</p>'}
function msg(t,c=""){$("formMessage").textContent=t;$("formMessage").className="form-message "+c}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
boot()})();