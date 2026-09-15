import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const canvas = document.getElementById('cacaoJourneyCanvas');
const stage = document.querySelector('.journey-stage');
const track = document.querySelector('.journey-stage-track');

function fallbackJourney(message = 'Experiência visual carregada') {
  if (!canvas || !stage) return;
  canvas.dataset.threeFailed = 'true';
  canvas.style.background = '#f7efe4';
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const draw = () => {
    const w = Math.max(1, stage.clientWidth || window.innerWidth);
    const h = Math.max(1, stage.clientHeight || window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const raw = track ? Math.max(0, Math.min(1, -track.getBoundingClientRect().top / Math.max(track.offsetHeight - window.innerHeight, 1))) : 0;
    const index = Math.min(7, Math.floor(raw * 8));
    const names = ['Fruto','Produtor','Processo','Indústria','Chocolate','Confeitaria','Experiência','Território'];
    const cx = w * .55, cy = h * .55, s = Math.min(w, h) * .16;
    ctx.fillStyle = '#f7efe4'; ctx.fillRect(0,0,w,h);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-.18);
    ctx.fillStyle = '#9d1026';
    ctx.beginPath(); ctx.ellipse(0,0,s*.62,s*1.05,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#c69a42';
    ctx.beginPath(); ctx.ellipse(-s*.18,-s*.15,s*.13,s*.28,-.35,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*.18,s*.12,s*.13,s*.28,.35,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#4d2d1e'; ctx.lineWidth = Math.max(2,s*.035);
    ctx.beginPath(); ctx.moveTo(0,-s*1.05); ctx.quadraticCurveTo(s*.2,-s*1.25,s*.38,-s*1.02); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#4d2d1e'; ctx.textAlign = 'center';
    ctx.font = `700 ${Math.max(22, Math.min(48, w*.045))}px Georgia`;
    ctx.fillText(names[index], cx, cy + s*1.75);
    ctx.font = `600 ${Math.max(10, Math.min(14, w*.014))}px Arial`;
    ctx.fillStyle = '#806c61'; ctx.fillText(`${String(index+1).padStart(2,'0')} / 08 · role para continuar`, cx, cy + s*2.08);
    canvas.dataset.threeReady = 'true';
  };
  draw();
  window.addEventListener('scroll', draw, {passive:true});
  window.addEventListener('resize', draw, {passive:true});
  window.addEventListener('orientationchange', draw, {passive:true});
}

if (!canvas || !stage || !track) {
  console.error('Elementos da jornada do cacau não encontrados.');
} else {
  canvas.style.display = 'block';
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '1';

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
  } catch (error) {
    console.error('WebGL2 indisponível para a jornada 3D:', error);
    fallbackJourney('Modo visual compatível');
  }

  if (renderer) {
    try {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0xf7efe4, 1);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 1.1, 9.5);
      scene.add(new THREE.HemisphereLight(0xfffaf4, 0x5b3828, 2.5));
      const light = new THREE.DirectionalLight(0xfff0d0, 4);
      light.position.set(5, 8, 7); scene.add(light);
      const world = new THREE.Group(); world.position.y = -.45; scene.add(world);

      const colors = {red:0x9d1026,gold:0xc69a42,brown:0x4d2d1e,green:0x718a58,cream:0xf7efe4,clay:0x9c6b4e};
      const stages = [
        ['01','Fruto','Tudo começa no fruto. O cacau nasce no território e carrega a primeira parte dessa história.'],
        ['02','Produtor','A terra encontra quem cultiva, colhe e transforma cuidado em matéria-prima.'],
        ['03','Processo','Fermentar, secar e selecionar: cada etapa acrescenta valor ao ingrediente.'],
        ['04','Indústria','Tecnologia e conhecimento transformam a amêndoa em novos produtos e possibilidades.'],
        ['05','Chocolate','O cacau ganha outra forma: textura, aroma, sabor e identidade.'],
        ['06','Confeitaria','Chefs e confeiteiros transformam o chocolate em criação, técnica e desejo.'],
        ['07','Experiência','A criação encontra pessoas: provar, aprender, conversar e levar uma memória.'],
        ['08','Território','A experiência aponta de volta para a origem: conhecer o lugar onde tudo começou.']
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
      const material = (color, roughness=.55, metalness=0) => new THREE.MeshStandardMaterial({color,roughness,metalness,transparent:true,opacity:1});
      const groups=[];
      const add=(g,mesh,x=0,y=0,z=0)=>{mesh.position.set(x,y,z);g.add(mesh);return mesh;};
      const newGroup=()=>{const g=new THREE.Group();groups.push(g);world.add(g);return g;};

      {const g=newGroup();add(g,new THREE.CylinderGeometry(.3,.42,3.6,16),0,.25).material=material(colors.brown);for(let i=0;i<6;i++){const leaf=add(g,new THREE.SphereGeometry(.8,16,12),(i%3-1)*.9,2+(i%2)*.25,(i%2)*.25);leaf.scale.set(1.5,.5,.8);leaf.material=material(colors.green);}const pod=add(g,new THREE.SphereGeometry(.78,28,20),.48,1,.25);pod.scale.set(.65,1.25,.65);pod.material=material(colors.red,.42);}
      {const g=newGroup();add(g,new THREE.BoxGeometry(4.8,.15,3),0,-1).material=material(0x6f7847);add(g,new THREE.CylinderGeometry(.38,.5,1.4,20),0,.05).material=material(colors.clay);add(g,new THREE.SphereGeometry(.38,20,16),0,1).material=material(0xa96f50);add(g,new THREE.CylinderGeometry(.5,.5,.13,20),0,1.35).material=material(colors.gold);}
      {const g=newGroup();for(let i=0;i<3;i++){const drum=add(g,new THREE.CylinderGeometry(.65,.65,1.5,24),-1.45+i*1.45,0);drum.rotation.z=Math.PI/2;drum.material=material(i===1?colors.gold:colors.clay);}add(g,new THREE.BoxGeometry(5.2,.18,1.2),0,-.9).material=material(colors.brown);}
      {const g=newGroup();add(g,new THREE.BoxGeometry(5.4,2.5,2.8),0,0).material=material(0xd8c5b5);for(let i=0;i<3;i++)add(g,new THREE.CylinderGeometry(.35,.35,2.2,20),-1.7+i*1.7,2.25).material=material(colors.brown);}
      {const g=newGroup();add(g,new THREE.BoxGeometry(4.5,.65,2.3),0,0).material=material(0x542819);for(let x=-1.5;x<=1.5;x+=1)for(let z=-.7;z<=.7;z+=.7)add(g,new THREE.BoxGeometry(.85,.18,.55),x,.4,z).material=material(0x71371f);}
      {const g=newGroup();for(let i=0;i<3;i++)add(g,new THREE.CylinderGeometry(1.45-i*.18,1.45-i*.18,.62,40),0,-.45+i*.62).material=material(i===1?0xf1d6c7:colors.cream);add(g,new THREE.TorusGeometry(.95,.16,14,40),0,1.42).material=material(colors.red);}
      {const g=newGroup();add(g,new THREE.BoxGeometry(5.2,.22,2.5),0,-.35).material=material(colors.brown);for(let i=0;i<4;i++)add(g,new THREE.SphereGeometry(.27,16,12),-1.7+i*1.15,.25,i%2?-.9:.9).material=material(i%2?colors.red:colors.clay);}
      {const g=newGroup();add(g,new THREE.SphereGeometry(1.8,40,28),0,.35).material=material(colors.green);const ring=add(g,new THREE.TorusGeometry(2.3,.055,8,64),0,.35);ring.rotation.x=.45;ring.rotation.z=.2;ring.material=material(colors.red,.3,.35);}

      const title=document.querySelector('.journey-title'),description=document.querySelector('.journey-description'),counter=document.querySelector('.journey-counter'),progress=document.querySelector('.journey-progress-bar'),dots=[...document.querySelectorAll('.journey-dot')],insightTitle=document.querySelector('.ai-insight-title'),insightText=document.querySelector('.ai-insight');
      let current=-1,targetProgress=0,progressValue=0;
      function getProgress(){const rect=track.getBoundingClientRect();const travel=Math.max(track.offsetHeight-window.innerHeight,1);return THREE.MathUtils.clamp(-rect.top/travel,0,1);}
      function setStage(index){if(index===current)return;current=index;const data=stages[index];if(title)title.textContent=data[1];if(description)description.textContent=data[2];if(counter)counter.textContent=`${data[0]} / 08 · role para continuar`;if(insightTitle)insightTitle.textContent=insights[index][0];if(insightText)insightText.textContent=insights[index][1];if(progress)progress.style.width=`${((index+1)/stages.length)*100}%`;dots.forEach((dot,i)=>dot.classList.toggle('active',i===index));}
      function update(){targetProgress=getProgress();progressValue+=(targetProgress-progressValue)*.16;const raw=progressValue*(stages.length-1);const index=Math.min(stages.length-1,Math.floor(raw+.00001));setStage(index);groups.forEach((g,i)=>{const distance=Math.abs(i-raw),opacity=THREE.MathUtils.clamp(1-distance*2.1,0,1);g.position.x=(i-raw)*.85;g.position.y=Math.sin((i-raw)*.7)*.12;g.scale.setScalar(.72+opacity*.34);g.traverse(obj=>{if(obj.isMesh)obj.material.opacity=opacity;});g.rotation.y+=i===index?.006:.001;});camera.position.x+=((raw-3.5)*.28-camera.position.x)*.045;camera.position.y+=(1.15+Math.sin(raw*.6)*.15-camera.position.y)*.045;camera.lookAt(0,.3,0);}
      function resize(){const width=Math.max(1,stage.clientWidth||window.innerWidth),height=Math.max(1,stage.clientHeight||window.innerHeight);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
      window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',resize,{passive:true});window.addEventListener('orientationchange',resize,{passive:true});if('ResizeObserver'in window)new ResizeObserver(resize).observe(stage);resize();update();
      renderer.setAnimationLoop(()=>{update();renderer.render(scene,camera);canvas.dataset.threeReady='true';});
      const sound=document.querySelector('.journey-sound');if(sound&&'speechSynthesis'in window)sound.addEventListener('click',()=>{speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(stages.map(s=>`${s[1]}. ${s[2]}`).join(' '));voice.lang='pt-BR';voice.rate=.92;speechSynthesis.speak(voice);});
    } catch (error) {
      console.error('Erro na cena 3D do cacau:', error);
      fallbackJourney('Modo visual compatível');
    }
  }
}
