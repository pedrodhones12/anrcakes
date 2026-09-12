import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const canvas = document.querySelector('#cacaoJourneyCanvas');
const stage = document.querySelector('.journey-stage');
if (!canvas || !stage) throw new Error('Jornada 3D: elementos não encontrados.');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#f7efe4');
scene.fog = new THREE.Fog('#f7efe4', 8, 22);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 1.1, 9.5);

const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const world = new THREE.Group();
world.position.y = -0.45;
scene.add(world);

const ambient = new THREE.HemisphereLight('#fffaf4', '#7b4c39', 2.4);
scene.add(ambient);
const key = new THREE.DirectionalLight('#fff4dc', 4.2);
key.position.set(5, 8, 6);
key.castShadow = true;
scene.add(key);
const rim = new THREE.PointLight('#c69a42', 18, 12);
rim.position.set(-5, 3, 2);
scene.add(rim);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(6.8, 64),
  new THREE.MeshStandardMaterial({color:'#ead8c8', roughness:.92, metalness:0})
);
floor.rotation.x = -Math.PI/2;
floor.position.y = -1.45;
floor.receiveShadow = true;
world.add(floor);

const red = '#9d1026', gold = '#c69a42', brown = '#4d2d1e', cream = '#f7efe4', green = '#718a58';
const groups = [];
const stages = [
  ['01','Fruto','Tudo começa no fruto. O cacau nasce no território e carrega a primeira parte dessa história.'],
  ['02','Produtor','A terra encontra quem cultiva, colhe e transforma cuidado em matéria-prima.'],
  ['03','Processo','Fermentar, secar, selecionar: cada etapa acrescenta valor ao ingrediente.'],
  ['04','Indústria','Tecnologia e conhecimento transformam a amêndoa em novos produtos e possibilidades.'],
  ['05','Chocolate','O cacau ganha outra forma — textura, aroma, sabor e identidade.'],
  ['06','Confeitaria','Chefs e confeiteiros transformam o chocolate em criação, técnica e desejo.'],
  ['07','Experiência','A criação encontra pessoas: provar, aprender, conversar e levar uma memória.'],
  ['08','Território','No fim, a experiência aponta de volta para a origem: conhecer o lugar onde tudo começou.']
];

const mat = (color, rough=.65, metal=0) => new THREE.MeshStandardMaterial({color, roughness:rough, metalness:metal});
function shadow(mesh){mesh.castShadow=true; mesh.receiveShadow=true; return mesh;}
function add(group, mesh, x=0,y=0,z=0){mesh.position.set(x,y,z); group.add(shadow(mesh)); return mesh;}

// 01 — Cacau
{
 const g = new THREE.Group();
 const trunk = add(g,new THREE.CylinderGeometry(.28,.42,3.8,16),0,.35,0); trunk.material=mat('#6b452e');
 for(let i=0;i<6;i++){const leaf=add(g,new THREE.SphereGeometry(.85,16,10), (i%3-1)*.9,2.0+(i%2)*.35,(i%2)*.25-.2); leaf.scale.set(1.5,.55,.8); leaf.material=mat(green);}
 const pod=add(g,new THREE.SphereGeometry(.72,24,16),.45,1.05,.15); pod.scale.set(.65,1.25,.65); pod.material=mat(red,.48);
 for(let i=0;i<3;i++){const ridge=add(g,new THREE.TorusGeometry(.63,.035,8,24),.45,1.05,.15); ridge.rotation.x=Math.PI/2; ridge.rotation.z=(i-1)*.35; ridge.scale.set(1,1.25,1); ridge.material=mat(gold,.45,.1);}
 groups.push(g); world.add(g);
}
// 02 — produtor
{
 const g=new THREE.Group();
 const body=add(g,new THREE.CylinderGeometry(.38,.5,1.35,20),0,.05,0); body.material=mat('#8c5a42');
 const head=add(g,new THREE.SphereGeometry(.38,20,16),0,1.0,0); head.material=mat('#a96f50');
 const hat=add(g,new THREE.CylinderGeometry(.5,.5,.13,20),0,1.35,0); hat.material=mat(gold);
 const field=add(g,new THREE.BoxGeometry(4.8,.15,3),0,-.85,0); field.material=mat('#6f7847');
 for(let i=-2;i<=2;i++){for(let j=-1;j<=1;j++){const s=add(g,new THREE.SphereGeometry(.22,12,8),i*.8,j*.05-.65,(j*.8)); s.scale.y=1.7;s.material=mat(green);}}
 const basket=add(g,new THREE.TorusGeometry(.55,.08,10,24),1.25,-.2,.2); basket.rotation.x=Math.PI/2; basket.material=mat(gold,.4,.2);
 groups.push(g);world.add(g);
}
// 03 — processo
{
 const g=new THREE.Group();
 for(let i=0;i<3;i++){const drum=add(g,new THREE.CylinderGeometry(.65,.65,1.5,24),-1.45+i*1.45,0,0);drum.rotation.z=Math.PI/2;drum.material=mat(i===1?gold:'#9c6b4e',.45,.15);}
 const belt=add(g,new THREE.BoxGeometry(5.2,.18,1.2),0,-.9,0);belt.material=mat(brown);
 for(let i=0;i<8;i++){const bean=add(g,new THREE.SphereGeometry(.16,12,8),-2.1+i*.6,-.68,0);bean.scale.set(1,.55,.7);bean.material=mat('#6a351f');}
 const gear=add(g,new THREE.TorusGeometry(.7,.16,12,24),0,1.0,0);gear.material=mat(gold,.35,.4);
 groups.push(g);world.add(g);
}
// 04 — indústria
{
 const g=new THREE.Group();
 const base=add(g,new THREE.BoxGeometry(5.4,2.5,2.8),0,-.05,0);base.material=mat('#d8c5b5');
 for(let i=0;i<3;i++){const tower=add(g,new THREE.CylinderGeometry(.35,.35,2.2,20),-1.7+i*1.7,2.25,0);tower.material=mat(brown,.5,.2);const cap=add(g,new THREE.CylinderGeometry(.5,.5,.18,20),-1.7+i*1.7,3.35,0);cap.material=mat(gold,.4,.3);}
 const window=add(g,new THREE.BoxGeometry(3.8,.65,.08),0,.4,1.43);window.material=mat('#8b6b5b',.3,.15);
 groups.push(g);world.add(g);
}
// 05 — chocolate
{
 const g=new THREE.Group();
 const bar=add(g,new THREE.BoxGeometry(4.5,.65,2.3),0,0,0);bar.material=mat('#542819',.35,.05);
 for(let x=-1.5;x<=1.5;x+=1){for(let z=-.7;z<=.7;z+=.7){const tile=add(g,new THREE.BoxGeometry(.85,.18,.55),x,.4,z);tile.material=mat('#71371f',.38,.05);}}
 const drip=add(g,new THREE.SphereGeometry(.22,14,10),1.5,-.55,.6);drip.scale.set(1,2.2,1);drip.material=mat('#71371f',.3);
 groups.push(g);world.add(g);
}
// 06 — confeitaria
{
 const g=new THREE.Group();
 for(let i=0;i<3;i++){const cake=add(g,new THREE.CylinderGeometry(1.45-i*.18,1.45-i*.18,.62,48),0,-.45+i*.62,0);cake.material=mat(i===1?'#f1d6c7':cream,.55);}
 const topping=add(g,new THREE.TorusGeometry(.95,.16,14,40),0,1.42,0);topping.material=mat(red,.45);
 for(let i=0;i<6;i++){const berry=add(g,new THREE.SphereGeometry(.12,12,8),Math.cos(i*Math.PI/3)*.85,1.65,Math.sin(i*Math.PI/3)*.85);berry.material=mat(red,.4);}
 const spat=add(g,new THREE.BoxGeometry(.16,2.8,.16),2.1,.5,.4);spat.rotation.z=-.25;spat.material=mat(gold,.3,.6);
 groups.push(g);world.add(g);
}
// 07 — experiência
{
 const g=new THREE.Group();
 const table=add(g,new THREE.BoxGeometry(5.2,.22,2.5),0,-.35,0);table.material=mat(brown);
 for(let i=-1;i<=1;i+=2){for(let z=-.8;z<=.8;z+=1.6){const leg=add(g,new THREE.CylinderGeometry(.1,.1,1.2,12),i*1.9,-.95,z);leg.material=mat(gold,.3,.5);}}
 for(let i=0;i<4;i++){const person=add(g,new THREE.SphereGeometry(.27,16,12),-1.7+i*1.15,.25,(i%2?-.9:.9));person.material=mat(i%2?red:'#8c5a42');const face=add(g,new THREE.SphereGeometry(.19,16,12),-1.7+i*1.15,.72,(i%2?-.9:.9));face.material=mat('#a96f50');}
 const plate=add(g,new THREE.CylinderGeometry(.8,.8,.08,40),0,.02,0);plate.material=mat('#fffaf4',.3);
 groups.push(g);world.add(g);
}
// 08 — território
{
 const g=new THREE.Group();
 const globe=add(g,new THREE.SphereGeometry(1.8,40,28),0,.35,0);globe.material=mat('#718a58',.6);
 const equator=add(g,new THREE.TorusGeometry(1.82,.035,8,64),0,.35,0);equator.rotation.x=Math.PI/2;equator.material=mat(gold,.3,.5);
 const ring=add(g,new THREE.TorusGeometry(2.3,.055,8,64),0,.35,0);ring.rotation.x=.45;ring.rotation.z=.2;ring.material=mat(red,.3,.4);
 const pin=add(g,new THREE.ConeGeometry(.16,.5,18),1.0,2.2,.1);pin.material=mat(red,.4);
 groups.push(g);world.add(g);
}

function setMaterialOpacity(obj, opacity){obj.traverse(o=>{if(o.isMesh){o.material.transparent=true;o.material.opacity=opacity;}});}
groups.forEach(g=>setMaterialOpacity(g,0));

const uiTitle=document.querySelector('.journey-title');
const uiDesc=document.querySelector('.journey-description');
const uiCount=document.querySelector('.journey-counter');
const progress=document.querySelector('.journey-progress-bar');
const dots=[...document.querySelectorAll('.journey-dot')];
let currentIndex=0;

function updateUI(index){
 const s=stages[index];
 uiTitle.textContent=s[1];
 uiDesc.textContent=s[2];
 uiCount.textContent=`${s[0]} / 08 · role para continuar`;
 progress.style.width=`${((index+1)/8)*100}%`;
 dots.forEach((d,i)=>d.classList.toggle('active',i===index));
}

function getProgress(){
 const rect=stage.getBoundingClientRect();
 const viewport=window.innerHeight;
 const total=rect.height+viewport;
 return THREE.MathUtils.clamp((viewport-rect.top)/(total-viewport),0,1);
}

function animateJourney(){
 const p=getProgress();
 const raw=p*7;
 const idx=Math.min(7,Math.floor(raw));
 const local=raw-idx;
 if(idx!==currentIndex){currentIndex=idx;updateUI(idx);}
 groups.forEach((g,i)=>{
   const d=Math.abs(i-raw);
   const op=THREE.MathUtils.clamp(1-d*2.2,0,1);
   g.scale.setScalar(.72+op*.34);
   g.position.x=(i-raw)*.9;
   g.position.y=Math.sin((i-raw)*.7)*.15;
   g.rotation.y += (i===idx?.004:0);
   setMaterialOpacity(g,op);
 });
 camera.position.x=THREE.MathUtils.lerp(camera.position.x,(raw-3.5)*.42,.045);
 camera.position.y=THREE.MathUtils.lerp(camera.position.y,1.0+Math.sin(raw*.65)*.18,.045);
 camera.position.z=THREE.MathUtils.lerp(camera.position.z,8.5-Math.sin(local*Math.PI)*.7,.045);
 camera.lookAt(0,.35,0);
 world.rotation.y=THREE.MathUtils.lerp(world.rotation.y,Math.sin(raw*.25)*.12,.04);
}

function resize(){
 const w=canvas.clientWidth||canvas.parentElement.clientWidth;
 const h=canvas.clientHeight||canvas.parentElement.clientHeight;
 renderer.setSize(w,h,false);
 camera.aspect=w/h;
 camera.updateProjectionMatrix();
}
window.addEventListener('resize',resize);
window.addEventListener('scroll',()=>requestAnimationFrame(animateJourney),{passive:true});
resize();updateUI(0);

function render(){
 requestAnimationFrame(render);
 animateJourney();
 rim.intensity=14+Math.sin(Date.now()*.001)*2;
 renderer.render(scene,camera);
}
render();

const sound=document.querySelector('.journey-sound');
if(sound && 'speechSynthesis' in window){
 sound.addEventListener('click',()=>{
   window.speechSynthesis.cancel();
   const text=stages.map(s=>`${s[1]}. ${s[2]}`).join(' ');
   const utter=new SpeechSynthesisUtterance(text);
   utter.lang='pt-BR'; utter.rate=.92; utter.pitch=1;
   window.speechSynthesis.speak(utter);
 });
}else if(sound){sound.style.display='none';}
