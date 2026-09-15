const canvas = document.getElementById('cacaoJourneyCanvas');
const stage = document.querySelector('.journey-stage');
const track = document.querySelector('.journey-stage-track');

if (canvas && stage && track) {
  const ctx = canvas.getContext('2d');
  const names = ['Fruto','Produtor','Processo','Indústria','Chocolate','Confeitaria','Experiência','Território'];
  const descriptions = [
    'Tudo começa no fruto. O cacau nasce no território e carrega a primeira parte dessa história.',
    'A terra encontra quem cultiva, colhe e transforma cuidado em matéria-prima.',
    'Fermentar, secar e selecionar: cada etapa acrescenta valor ao ingrediente.',
    'Tecnologia e conhecimento transformam a amêndoa em novos produtos e possibilidades.',
    'O cacau ganha outra forma: textura, aroma, sabor e identidade.',
    'Chefs e confeiteiros transformam o chocolate em criação, técnica e desejo.',
    'A criação encontra pessoas: provar, aprender, conversar e levar uma memória.',
    'A experiência aponta de volta para a origem: conhecer o lugar onde tudo começou.'
  ];
  const insights = [
    ['O sistema encontrou a origem.','O fruto é o primeiro ponto da cadeia. Território, pessoas e conhecimento começam a se conectar.'],
    ['Conexão com quem produz.','O produtor é um elo essencial: sem cuidado, conhecimento e território, não existe matéria-prima.'],
    ['Valor sendo construído.','Fermentação, secagem e seleção mostram que transformar também é preservar qualidade e criar valor.'],
    ['Tecnologia entrou na cadeia.','Processos, equipamentos e conhecimento ampliam o potencial do cacau.'],
    ['O ingrediente ganhou identidade.','Chocolate é matéria, técnica e cultura. A jornada reconhece uma nova camada de valor.'],
    ['Criação ativada.','A confeitaria conecta técnica, criatividade e desejo, transformando produto em experiência.'],
    ['Pessoas no centro.','Aprender, provar e participar transforma informação em memória.'],
    ['A jornada retorna ao território.','Conhecer o lugar, as pessoas e as histórias revela novamente a origem.']
  ];
  const title=document.querySelector('.journey-title');
  const description=document.querySelector('.journey-description');
  const counter=document.querySelector('.journey-counter');
  const progress=document.querySelector('.journey-progress-bar');
  const dots=[...document.querySelectorAll('.journey-dot')];
  const insightTitle=document.querySelector('.ai-insight-title');
  const insightText=document.querySelector('.ai-insight');
  const sound=document.querySelector('.journey-sound');
  let w=0,h=0,dpr=1,target=0,current=0,stageIndex=-1,time=0;
  const particles=Array.from({length:75},(_,i)=>({x:Math.random(),y:Math.random(),r:1+Math.random()*2.5,s=.15+Math.random()*.5,p=Math.random()*Math.PI*2}));

  function resize(){
    w=Math.max(1,stage.clientWidth); h=Math.max(1,stage.clientHeight); dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr); canvas.style.width='100%'; canvas.style.height='100%';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function getProgress(){
    const r=track.getBoundingClientRect();
    return Math.max(0,Math.min(1,-r.top/Math.max(track.offsetHeight-window.innerHeight,1)));
  }
  function setStage(i){
    if(i===stageIndex)return; stageIndex=i;
    if(title)title.textContent=names[i];
    if(description)description.textContent=descriptions[i];
    if(counter)counter.textContent=`${String(i+1).padStart(2,'0')} / 08 · role para continuar`;
    if(progress)progress.style.width=`${((i+1)/8)*100}%`;
    if(insightTitle)insightTitle.textContent=insights[i][0];
    if(insightText)insightText.textContent=insights[i][1];
    dots.forEach((d,n)=>d.classList.toggle('active',n===i));
  }
  function drawParticle(p){
    const x=p.x*w, y=(p.y*w*.08 + p.y*h + Math.sin(time*p.s+p.p)*12)%h;
    ctx.beginPath(); ctx.arc(x,y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(198,154,66,${.25+.55*Math.abs(Math.sin(time*p.s+p.p))})`; ctx.shadowBlur=14; ctx.shadowColor='#c69a42'; ctx.fill(); ctx.shadowBlur=0;
  }
  function drawNetwork(){
    const cx=w*.54, cy=h*.54, spread=Math.min(w,h)*.25;
    for(let i=0;i<18;i++){
      const a=time*.12+i*.95, x=cx+Math.cos(a)*spread*(.55+.45*Math.sin(i*2.7+time*.3)), y=cy+Math.sin(a*1.17)*spread*.7;
      ctx.beginPath();ctx.arc(x,y,2.5+Math.sin(time+i)*1.5,0,Math.PI*2);ctx.fillStyle='rgba(157,16,38,.65)';ctx.fill();
      if(i){const pa=a-.95,px=cx+Math.cos(pa)*spread*.8,py=cy+Math.sin(pa*1.17)*spread*.55;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(x,y);ctx.strokeStyle='rgba(198,154,66,.2)';ctx.lineWidth=1;ctx.stroke();}
    }
  }
  function drawCacao(raw){
    const cx=w*.54, cy=h*.56, size=Math.min(w,h)*(.15+.025*Math.sin(time));
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(-.18+.03*Math.sin(time*.5));
    ctx.shadowColor='rgba(157,16,38,.35)';ctx.shadowBlur=35;
    const g=ctx.createRadialGradient(-size*.25,-size*.3,size*.1,0,0,size*1.1);g.addColorStop(0,'#c83a45');g.addColorStop(.55,'#9d1026');g.addColorStop(1,'#541c20');ctx.fillStyle=g;
    ctx.beginPath();ctx.ellipse(0,0,size*.62,size*1.05,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle='rgba(247,239,228,.65)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-size*.9);ctx.quadraticCurveTo(size*.18,-size*1.1,size*.34,-size*.88);ctx.stroke();
    for(let i=-1;i<=1;i+=2){ctx.fillStyle='#c69a42';ctx.beginPath();ctx.ellipse(i*size*.18,-size*.15,size*.11,size*.27,i*.25,0,Math.PI*2);ctx.fill();}
    ctx.restore();
    ctx.font=`700 ${Math.max(28,Math.min(58,w*.055))}px Georgia`;ctx.textAlign='center';ctx.fillStyle='#4d2d1e';ctx.fillText(names[stageIndex<0?0:stageIndex],cx,cy+size*1.65);
    ctx.font=`600 ${Math.max(10,Math.min(14,w*.014))}px Arial`;ctx.fillStyle='#806c61';ctx.fillText('SISTEMA NARRATIVO · EXPERIÊNCIA VISUAL',cx,cy+size*1.95);
  }
  function frame(){
    time+=.016; target=getProgress(); current+=(target-current)*.08;
    const raw=current*7; const i=Math.min(7,Math.floor(raw+.00001)); setStage(i);
    ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#f7efe4');bg.addColorStop(1,'#fffaf4');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    const glow=ctx.createRadialGradient(w*.55,h*.5,5,w*.55,h*.5,Math.min(w,h)*.5);glow.addColorStop(0,'rgba(198,154,66,.18)');glow.addColorStop(.5,'rgba(157,16,38,.05)');glow.addColorStop(1,'transparent');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    particles.forEach(drawParticle); drawNetwork(); drawCacao(raw);
    canvas.dataset.threeReady='true'; requestAnimationFrame(frame);
  }
  resize(); setStage(0); window.addEventListener('resize',resize,{passive:true}); window.addEventListener('orientationchange',resize,{passive:true});
  window.addEventListener('scroll',()=>{target=getProgress()},{passive:true});
  if(sound && 'speechSynthesis' in window) sound.addEventListener('click',()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(names.map((n,i)=>`${n}. ${descriptions[i]}`).join(' '));u.lang='pt-BR';u.rate=.92;speechSynthesis.speak(u);});
  requestAnimationFrame(frame);
} else { console.error('Elementos da jornada do cacau não encontrados.'); }
