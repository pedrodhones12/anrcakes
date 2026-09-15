import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const canvas = document.getElementById('cacaoJourneyCanvas');
const stage = document.querySelector('.journey-stage');
if (!canvas || !stage) throw new Error('Elementos da jornada 3D não encontrados.');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#f7efe4');
scene.fog = new THREE.Fog('#f7efe4', 7, 24);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 1.2, 9);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;

scene.add(new THREE.HemisphereLight('#fffaf4', '#6b4635', 2.2));
const light = new THREE.DirectionalLight('#fff4dc', 4);
light.position.set(5, 7, 6);
light.castShadow = true;
scene.add(light);

const world = new THREE.Group();
world.position.y = -0.5;
scene.add(world);

const floor = new THREE.Mesh(new THREE.CircleGeometry(6.5, 48), new THREE.MeshStandardMaterial({ color: '#ead8c8', roughness: 0.9 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.5;
world.add(floor);

const colors = { red: '#9d1026', gold: '#c69a42', brown: '#4d2d1e', green: '#718a58', cream: '#f7efe4' };
const material = (color, roughness = 0.6, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness, transparent: true });
const groups = [];

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

const aiInsights = [
  ['O sistema encontrou a origem.', 'O fruto é o primeiro ponto da cadeia. Território, pessoas e conhecimento começam a se conectar.'],
  ['Conexão com quem produz.', 'O sistema identifica o produtor como elo essencial: sem cuidado, conhecimento e território, não existe matéria-prima.'],
  ['Valor sendo construído.', 'Fermentação, secagem e seleção mostram que transformar também é preservar qualidade e criar valor.'],
  ['Tecnologia entrou na cadeia.', 'A indústria amplia possibilidades: processos, equipamentos e conhecimento transformam o potencial do cacau.'],
  ['O ingrediente ganhou identidade.', 'Chocolate é matéria, técnica e cultura. O sistema reconhece uma nova camada de valor na jornada.'],
  ['Criação ativada.', 'A confeitaria conecta técnica, criatividade e desejo — transformando produto em experiência.'],
  ['Pessoas no centro.', 'Agora a cadeia encontra o público. Aprender, provar e participar transforma informação em memória.'],
  ['A jornada retorna ao território.', 'O destino revela a origem novamente: conhecer o lugar, as pessoas e as histórias por trás do sabor.']
];

function add(g, mesh, x = 0, y = 0, z = 0) {
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  g.add(mesh);
  return mesh;
}
function group() { const g = new THREE.Group(); groups.push(g); world.add(g); return g; }

// 01 Fruto
{
  const g = group();
  add(g, new THREE.CylinderGeometry(.3, .42, 3.6, 16), 0, .3).material = material('#6b452e');
  for (let i = 0; i < 6; i++) { const leaf = add(g, new THREE.SphereGeometry(.8, 14, 10), (i % 3 - 1) * .9, 2 + (i % 2) * .3, (i % 2) * .3); leaf.scale.set(1.5, .5, .8); leaf.material = material(colors.green); }
  const pod = add(g, new THREE.SphereGeometry(.75, 24, 16), .45, 1, .2); pod.scale.set(.65, 1.25, .65); pod.material = material(colors.red, .45);
}
// 02 Produtor
{
  const g = group();
  add(g, new THREE.BoxGeometry(4.8, .15, 3), 0, -1).material = material('#6f7847');
  add(g, new THREE.CylinderGeometry(.38, .5, 1.4, 20), 0, .05).material = material('#8c5a42');
  add(g, new THREE.SphereGeometry(.38, 20, 16), 0, 1).material = material('#a96f50');
  add(g, new THREE.CylinderGeometry(.5, .5, .13, 20), 0, 1.35).material = material(colors.gold);
  for (let i = -2; i <= 2; i++) { const plant = add(g, new THREE.SphereGeometry(.25, 12, 8), i * .8, -.6, 0); plant.scale.y = 1.6; plant.material = material(colors.green); }
}
// 03 Processo
{
  const g = group();
  for (let i = 0; i < 3; i++) { const drum = add(g, new THREE.CylinderGeometry(.65, .65, 1.5, 24), -1.45 + i * 1.45, 0); drum.rotation.z = Math.PI / 2; drum.material = material(i === 1 ? colors.gold : '#9c6b4e', .45, .1); }
  add(g, new THREE.BoxGeometry(5.2, .18, 1.2), 0, -.9).material = material(colors.brown);
  for (let i = 0; i < 8; i++) { const bean = add(g, new THREE.SphereGeometry(.16, 12, 8), -2.1 + i * .6, -.65); bean.scale.set(1, .55, .7); bean.material = material('#6a351f'); }
}
// 04 Indústria
{
  const g = group();
  add(g, new THREE.BoxGeometry(5.4, 2.5, 2.8), 0, 0).material = material('#d8c5b5');
  for (let i = 0; i < 3; i++) add(g, new THREE.CylinderGeometry(.35, .35, 2.2, 20), -1.7 + i * 1.7, 2.25).material = material(colors.brown, .5, .15);
  add(g, new THREE.BoxGeometry(3.8, .65, .08), 0, .4, 1.43).material = material('#8b6b5b', .3);
}
// 05 Chocolate
{
  const g = group();
  add(g, new THREE.BoxGeometry(4.5, .65, 2.3), 0, 0).material = material('#542819', .35);
  for (let x = -1.5; x <= 1.5; x += 1) for (let z = -.7; z <= .7; z += .7) add(g, new THREE.BoxGeometry(.85, .18, .55), x, .4, z).material = material('#71371f', .38);
}
// 06 Confeitaria
{
  const g = group();
  for (let i = 0; i < 3; i++) add(g, new THREE.CylinderGeometry(1.45 - i * .18, 1.45 - i * .18, .62, 40), 0, -.45 + i * .62).material = material(i === 1 ? '#f1d6c7' : colors.cream);
  add(g, new THREE.TorusGeometry(.95, .16, 14, 40), 0, 1.42).material = material(colors.red);
  for (let i = 0; i < 6; i++) add(g, new THREE.SphereGeometry(.12, 12, 8), Math.cos(i * Math.PI / 3) * .85, 1.65, Math.sin(i * Math.PI / 3) * .85).material = material(colors.red);
}
// 07 Experiência
{
  const g = group();
  add(g, new THREE.BoxGeometry(5.2, .22, 2.5), 0, -.35).material = material(colors.brown);
  for (let i = 0; i < 4; i++) add(g, new THREE.SphereGeometry(.27, 16, 12), -1.7 + i * 1.15, .25, i % 2 ? -.9 : .9).material = material(i % 2 ? colors.red : '#8c5a42');
  add(g, new THREE.CylinderGeometry(.8, .8, .08, 40), 0, .02).material = material('#fffaf4', .3);
}
// 08 Território
{
  const g = group();
  add(g, new THREE.SphereGeometry(1.8, 40, 28), 0, .35).material = material(colors.green);
  const ring = add(g, new THREE.TorusGeometry(2.3, .055, 8, 64), 0, .35); ring.rotation.x = .45; ring.rotation.z = .2; ring.material = material(colors.red, .3, .35);
  add(g, new THREE.ConeGeometry(.16, .5, 18), 1, 2.2, .1).material = material(colors.red);
}

function setOpacity(g, opacity) { g.traverse(obj => { if (obj.isMesh) obj.material.opacity = opacity; }); }
groups.forEach(g => setOpacity(g, 0));

// Rede visual inspirada em IA: partículas + conexões que respondem à etapa ativa.
const networkGroup = new THREE.Group();
networkGroup.position.set(0, .5, -1.8);
world.add(networkGroup);
const nodeCount = 46;
const nodePositions = [];
const nodeGeometry = new THREE.BufferGeometry();
const nodeArray = new Float32Array(nodeCount * 3);
for (let i = 0; i < nodeCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 2.2 + Math.random() * 2.4;
  const x = Math.cos(angle) * radius;
  const y = (Math.random() - .5) * 2.6;
  const z = Math.sin(angle) * radius * .45;
  nodePositions.push(new THREE.Vector3(x, y, z));
  nodeArray[i * 3] = x; nodeArray[i * 3 + 1] = y; nodeArray[i * 3 + 2] = z;
}
nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodeArray, 3));
const nodePoints = new THREE.Points(nodeGeometry, new THREE.PointsMaterial({ color: colors.gold, size: .055, transparent: true, opacity: .55, sizeAttenuation: true }));
networkGroup.add(nodePoints);

const edgeArray = [];
for (let i = 0; i < nodeCount; i++) {
  for (let j = i + 1; j < nodeCount; j++) {
    if (nodePositions[i].distanceTo(nodePositions[j]) < 1.55 && Math.random() > .62) {
      edgeArray.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z, nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
    }
  }
}
const edgeGeometry = new THREE.BufferGeometry();
edgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(edgeArray, 3));
const edgeLines = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: colors.red, transparent: true, opacity: .08 }));
networkGroup.add(edgeLines);

const title = document.querySelector('.journey-title');
const description = document.querySelector('.journey-description');
const counter = document.querySelector('.journey-counter');
const progress = document.querySelector('.journey-progress-bar');
const dots = [...document.querySelectorAll('.journey-dot')];
const insightTitle = document.querySelector('.ai-insight-title');
const insightText = document.querySelector('.ai-insight');
let current = -1;
let targetProgress = 0;

function readProgress() {
  const rect = stage.getBoundingClientRect();
  const travel = Math.max(stage.offsetHeight - window.innerHeight, 1);
  targetProgress = THREE.MathUtils.clamp(-rect.top / travel, 0, 1);
}

function updateNarrative(index) {
  const s = stages[index];
  title.style.opacity = '0';
  description.style.opacity = '0';
  if (insightTitle) insightTitle.style.opacity = '0';
  if (insightText) insightText.style.opacity = '0';
  setTimeout(() => {
    title.textContent = s[1];
    description.textContent = s[2];
    counter.textContent = `${s[0]} / 08 · role para continuar`;
    if (insightTitle) insightTitle.textContent = aiInsights[index][0];
    if (insightText) insightText.textContent = aiInsights[index][1];
    title.style.opacity = '1';
    description.style.opacity = '1';
    if (insightTitle) insightTitle.style.opacity = '1';
    if (insightText) insightText.style.opacity = '1';
  }, 120);
}

function update() {
  readProgress();
  const raw = targetProgress * 7;
  const index = Math.min(7, Math.floor(raw));
  if (index !== current) {
    current = index;
    updateNarrative(index);
    progress.style.width = `${((index + 1) / 8) * 100}%`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  groups.forEach((g, i) => {
    const distance = Math.abs(i - raw);
    const opacity = THREE.MathUtils.clamp(1 - distance * 2.4, 0, 1);
    g.position.x = (i - raw) * .9;
    g.position.y = Math.sin((i - raw) * .7) * .12;
    g.scale.setScalar(.72 + opacity * .32);
    setOpacity(g, opacity);
    if (i === index) g.rotation.y += .004;
  });

  // A rede se reorganiza lentamente conforme o visitante avança.
  networkGroup.rotation.y += .0008 + raw * .00008;
  networkGroup.rotation.x = Math.sin(raw * .45) * .035;
  const pulse = .5 + Math.sin(performance.now() * .0024) * .18;
  nodePoints.material.opacity = pulse;
  edgeLines.material.opacity = .035 + pulse * .055;
  nodePoints.scale.setScalar(1 + Math.sin(raw * .8) * .035);

  camera.position.x = THREE.MathUtils.lerp(camera.position.x, (raw - 3.5) * .4, .05);
  camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1 + Math.sin(raw * .6) * .18, .05);
  camera.lookAt(0, .35, 0);
}

function resize() {
  const w = canvas.clientWidth || stage.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || stage.clientHeight || 600;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
window.addEventListener('scroll', update, { passive: true });
resize();
update();

function render() { requestAnimationFrame(render); update(); renderer.render(scene, camera); }
render();

const sound = document.querySelector('.journey-sound');
if (sound && 'speechSynthesis' in window) {
  sound.addEventListener('click', () => {
    speechSynthesis.cancel();
    const text = stages.map(s => `${s[1]}. ${s[2]}`).join(' ');
    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = 'pt-BR';
    voice.rate = .92;
    speechSynthesis.speak(voice);
  });
} else if (sound) sound.style.display = 'none';
