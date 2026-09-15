import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const canvas = document.getElementById('cacaoJourneyCanvas');
const stage = document.querySelector('.journey-stage');
if (!canvas || !stage) throw new Error('Elementos da jornada 3D não encontrados.');

canvas.style.position = 'absolute';
canvas.style.inset = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.display = 'block';
canvas.style.zIndex = '1';

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
} catch (error) {
  canvas.dataset.threeFailed = 'true';
  window.dispatchEvent(new CustomEvent('cacao-3d-error', { detail: error }));
  throw error;
}

const scene = new THREE.Scene();
scene.background = new THREE.Color('#f7efe4');
scene.fog = new THREE.Fog('#f7efe4', 8, 28);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 1.4, 10);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
scene.add(new THREE.HemisphereLight('#fffaf4', '#5b3828', 2.4));
const keyLight = new THREE.DirectionalLight('#fff1d6', 4.2);
keyLight.position.set(5, 8, 7);
keyLight.castShadow = true;
scene.add(keyLight);

const world = new THREE.Group();
world.position.y = -0.4;
scene.add(world);
const floor = new THREE.Mesh(new THREE.CircleGeometry(6.5, 48), new THREE.MeshStandardMaterial({ color: '#ead8c8', roughness: 0.9 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.55;
world.add(floor);

const colors = { red: '#9d1026', gold: '#c69a42', brown: '#4d2d1e', green: '#718a58', cream: '#f7efe4' };
const makeMaterial = (color, roughness = 0.55, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness, transparent: true, opacity: 1 });
const stages = [
  ['01', 'Fruto', 'Tudo começa no fruto. O cacau nasce no território e carrega a primeira parte dessa história.'],
  ['02', 'Produtor', 'A terra encontra quem cultiva, colhe e transforma cuidado em matéria-prima.'],
  ['03', 'Processo', 'Fermentar, secar e selecionar: cada etapa acrescenta valor ao ingrediente.'],
  ['04', 'Indústria', 'Tecnologia e conhecimento transformam a amêndoa em novos produtos e possibilidades.'],
  ['05', 'Chocolate', 'O cacau ganha outra forma: textura, aroma, sabor e identidade.'],
  ['06', 'Confeitaria', 'Chefs e confeiteiros transformam o chocolate em criação, técnica e desejo.'],
  ['07', 'Experiência', 'A criação encontra pessoas: provar, aprender, conversar e levar uma memória.'],
  ['08', 'Território', 'A experiência aponta de volta para a origem: conhecer o lugar onde tudo começou.']
];
const insights = [
  ['O sistema encontrou a origem.', 'O fruto é o primeiro ponto da cadeia. Território, pessoas e conhecimento começam a se conectar.'],
  ['Conexão com quem produz.', 'O produtor é um elo essencial: sem cuidado, conhecimento e território, não existe matéria-prima.'],
  ['Valor sendo construído.', 'Fermentação, secagem e seleção mostram que transformar também é preservar qualidade e criar valor.'],
  ['Tecnologia entrou na cadeia.', 'Processos, equipamentos e conhecimento ampliam o potencial do cacau.'],
  ['O ingrediente ganhou identidade.', 'Chocolate é matéria, técnica e cultura. A jornada reconhece uma nova camada de valor.'],
  ['Criação ativada.', 'A confeitaria conecta técnica, criatividade e desejo, transformando produto em experiência.'],
  ['Pessoas no centro.', 'Aprender, provar e participar transforma informação em memória.'],
  ['A jornada retorna ao território.', 'Conhecer o lugar, as pessoas e as histórias revela novamente a origem.']
];

const groups = [];
const add = (g, mesh, x = 0, y = 0, z = 0) => { mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); return mesh; };
const newGroup = () => { const g = new THREE.Group(); groups.push(g); world.add(g); return g; };

{
  const g = newGroup();
  add(g, new THREE.CylinderGeometry(.3, .42, 3.6, 16), 0, .25).material = makeMaterial('#6b452e');
  for (let i = 0; i < 6; i++) { const leaf = add(g, new THREE.SphereGeometry(.8, 16, 12), (i % 3 - 1) * .9, 2 + (i % 2) * .25, (i % 2) * .25); leaf.scale.set(1.5, .5, .8); leaf.material = makeMaterial(colors.green); }
  const pod = add(g, new THREE.SphereGeometry(.78, 28, 20), .48, 1, .25); pod.scale.set(.65, 1.25, .65); pod.material = makeMaterial(colors.red, .42);
}
{
  const g = newGroup();
  add(g, new THREE.BoxGeometry(4.8, .15, 3), 0, -1).material = makeMaterial('#6f7847');
  add(g, new THREE.CylinderGeometry(.38, .5, 1.4, 20), 0, .05).material = makeMaterial('#8c5a42');
  add(g, new THREE.SphereGeometry(.38, 20, 16), 0, 1).material = makeMaterial('#a96f50');
  add(g, new THREE.CylinderGeometry(.5, .5, .13, 20), 0, 1.35).material = makeMaterial(colors.gold);
  for (let i = -2; i <= 2; i++) { const p = add(g, new THREE.SphereGeometry(.25, 12, 8), i * .8, -.6); p.scale.y = 1.6; p.material = makeMaterial(colors.green); }
}
{
  const g = newGroup();
  for (let i = 0; i < 3; i++) { const drum = add(g, new THREE.CylinderGeometry(.65, .65, 1.5, 24), -1.45 + i * 1.45, 0); drum.rotation.z = Math.PI / 2; drum.material = makeMaterial(i === 1 ? colors.gold : '#9c6b4e', .45, .1); }
  add(g, new THREE.BoxGeometry(5.2, .18, 1.2), 0, -.9).material = makeMaterial(colors.brown);
  for (let i = 0; i < 8; i++) { const b = add(g, new THREE.SphereGeometry(.16, 12, 8), -2.1 + i * .6, -.65); b.scale.set(1, .55, .7); b.material = makeMaterial('#6a351f'); }
}
{
  const g = newGroup();
  add(g, new THREE.BoxGeometry(5.4, 2.5, 2.8), 0, 0).material = makeMaterial('#d8c5b5');
  for (let i = 0; i < 3; i++) add(g, new THREE.CylinderGeometry(.35, .35, 2.2, 20), -1.7 + i * 1.7, 2.25).material = makeMaterial(colors.brown, .5, .15);
  add(g, new THREE.BoxGeometry(3.8, .65, .08), 0, .4, 1.43).material = makeMaterial('#8b6b5b', .3);
}
{
  const g = newGroup();
  add(g, new THREE.BoxGeometry(4.5, .65, 2.3), 0, 0).material = makeMaterial('#542819', .35);
  for (let x = -1.5; x <= 1.5; x += 1) for (let z = -.7; z <= .7; z += .7) add(g, new THREE.BoxGeometry(.85, .18, .55), x, .4, z).material = makeMaterial('#71371f', .38);
}
{
  const g = newGroup();
  for (let i = 0; i < 3; i++) add(g, new THREE.CylinderGeometry(1.45 - i * .18, 1.45 - i * .18, .62, 40), 0, -.45 + i * .62).material = makeMaterial(i === 1 ? '#f1d6c7' : colors.cream);
  add(g, new THREE.TorusGeometry(.95, .16, 14, 40), 0, 1.42).material = makeMaterial(colors.red);
  for (let i = 0; i < 6; i++) add(g, new THREE.SphereGeometry(.12, 12, 8), Math.cos(i * Math.PI / 3) * .85, 1.65, Math.sin(i * Math.PI / 3) * .85).material = makeMaterial(colors.red);
}
{
  const g = newGroup();
  add(g, new THREE.BoxGeometry(5.2, .22, 2.5), 0, -.35).material = makeMaterial(colors.brown);
  for (let i = 0; i < 4; i++) add(g, new THREE.SphereGeometry(.27, 16, 12), -1.7 + i * 1.15, .25, i % 2 ? -.9 : .9).material = makeMaterial(i % 2 ? colors.red : '#8c5a42');
  add(g, new THREE.CylinderGeometry(.8, .8, .08, 40), 0, .02).material = makeMaterial('#fffaf4', .3);
}
{
  const g = newGroup();
  add(g, new THREE.SphereGeometry(1.8, 40, 28), 0, .35).material = makeMaterial(colors.green);
  const ring = add(g, new THREE.TorusGeometry(2.3, .055, 8, 64), 0, .35); ring.rotation.x = .45; ring.rotation.z = .2; ring.material = makeMaterial(colors.red, .3, .35);
  add(g, new THREE.ConeGeometry(.16, .5, 18), 1, 2.2, .1).material = makeMaterial(colors.red);
}

const setOpacity = (g, opacity) => g.traverse(o => { if (o.isMesh) o.material.opacity = opacity; });
groups.forEach(g => setOpacity(g, 0));

const network = new THREE.Group();
network.position.set(0, .5, -1.8);
world.add(network);
const points = [];
const positions = new Float32Array(42 * 3);
for (let i = 0; i < 42; i++) { const a = Math.random() * Math.PI * 2, r = 2.2 + Math.random() * 2.2; const p = new THREE.Vector3(Math.cos(a) * r, (Math.random() - .5) * 2.5, Math.sin(a) * r * .45); points.push(p); positions[i*3]=p.x; positions[i*3+1]=p.y; positions[i*3+2]=p.z; }
const pointGeo = new THREE.BufferGeometry();
pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const pointMat = new THREE.PointsMaterial({ color: colors.gold, size: .065, transparent: true, opacity: .6 });
network.add(new THREE.Points(pointGeo, pointMat));
const edges = [];
for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) if (points[i].distanceTo(points[j]) < 1.5) edges.push(points[i].x,points[i].y,points[i].z,points[j].x,points[j].y,points[j].z);
const edgeGeo = new THREE.BufferGeometry(); edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edges, 3));
network.add(new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: colors.red, transparent: true, opacity: .09 })));

const title = document.querySelector('.journey-title');
const description = document.querySelector('.journey-description');
const counter = document.querySelector('.journey-counter');
const progress = document.querySelector('.journey-progress-bar');
const dots = [...document.querySelectorAll('.journey-dot')];
const insightTitle = document.querySelector('.ai-insight-title');
const insightText = document.querySelector('.ai-insight');
let current = -1;
let progressValue = 0;

function readProgress() {
  const rect = stage.getBoundingClientRect();
  const start = window.scrollY + rect.top;
  const travel = Math.max(stage.offsetHeight, window.innerHeight);
  progressValue = THREE.MathUtils.clamp((window.scrollY - start) / travel, 0, 1);
  if (!Number.isFinite(progressValue)) progressValue = 0;
}
function updateNarrative(index) {
  const s = stages[index];
  if (title) title.textContent = s[1];
  if (description) description.textContent = s[2];
  if (counter) counter.textContent = `${s[0]} / 08 · role para continuar`;
  if (insightTitle) insightTitle.textContent = insights[index][0];
  if (insightText) insightText.textContent = insights[index][1];
}
function update() {
  readProgress();
  const raw = progressValue * 7;
  const index = Math.min(7, Math.floor(raw));
  if (index !== current) {
    current = index;
    updateNarrative(index);
    if (progress) progress.style.width = `${((index + 1) / 8) * 100}%`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }
  groups.forEach((g, i) => {
    const distance = Math.abs(i - raw);
    const opacity = THREE.MathUtils.clamp(1 - distance * 2.4, 0, 1);
    g.position.x = (i - raw) * .9;
    g.position.y = Math.sin((i - raw) * .7) * .12;
    g.scale.setScalar(.72 + opacity * .32);
    setOpacity(g, opacity);
    if (i === index) g.rotation.y += .006;
  });
  network.rotation.y += .001;
  camera.position.x += ((raw - 3.5) * .35 - camera.position.x) * .04;
  camera.position.y += (1.2 + Math.sin(raw * .6) * .15 - camera.position.y) * .04;
  camera.lookAt(0, .3, 0);
}
function resize() {
  const w = Math.max(1, stage.clientWidth || window.innerWidth);
  const h = Math.max(1, stage.clientHeight || 690);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize, { passive: true });
window.addEventListener('orientationchange', resize, { passive: true });
window.addEventListener('scroll', update, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
resize();
update();
function render() { requestAnimationFrame(render); update(); renderer.render(scene, camera); canvas.dataset.threeReady = 'true'; }
render();

const sound = document.querySelector('.journey-sound');
if (sound && 'speechSynthesis' in window) sound.addEventListener('click', () => { speechSynthesis.cancel(); const voice = new SpeechSynthesisUtterance(stages.map(s => `${s[1]}. ${s[2]}`).join(' ')); voice.lang = 'pt-BR'; voice.rate = .92; speechSynthesis.speak(voice); });
