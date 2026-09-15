import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const canvas = document.getElementById('cacaoJourneyCanvas');
const stage = document.querySelector('.journey-stage');
const track = document.querySelector('.journey-stage-track');
if (!canvas || !stage || !track) throw new Error('Elementos da jornada do cacau não encontrados.');

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
    alpha: true,
    powerPreference: 'high-performance'
  });
} catch (error) {
  canvas.dataset.threeFailed = 'true';
  console.error('A jornada 3D não pôde iniciar:', error);
  throw error;
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0xf7efe4, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(0, 1.1, 9.5);

scene.add(new THREE.HemisphereLight(0xfffaf4, 0x5b3828, 2.5));
const light = new THREE.DirectionalLight(0xfff0d0, 4);
light.position.set(5, 8, 7);
scene.add(light);

const world = new THREE.Group();
world.position.y = -0.45;
scene.add(world);

const colors = {
  red: 0x9d1026,
  gold: 0xc69a42,
  brown: 0x4d2d1e,
  green: 0x718a58,
  cream: 0xf7efe4,
  clay: 0x9c6b4e
};

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

const material = (color, roughness = .55, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });
const groups = [];
const add = (g, mesh, x = 0, y = 0, z = 0) => {
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  g.add(mesh);
  return mesh;
};
const newGroup = () => {
  const g = new THREE.Group();
  g.visible = true;
  groups.push(g);
  world.add(g);
  return g;
};

// 01 — Fruto
{
  const g = newGroup();
  add(g, new THREE.CylinderGeometry(.3, .42, 3.6, 16), 0, .25).material = material(colors.brown);
  for (let i = 0; i < 6; i++) {
    const leaf = add(g, new THREE.SphereGeometry(.8, 16, 12), (i % 3 - 1) * .9, 2 + (i % 2) * .25, (i % 2) * .25);
    leaf.scale.set(1.5, .5, .8);
    leaf.material = material(colors.green);
  }
  const pod = add(g, new THREE.SphereGeometry(.78, 28, 20), .48, 1, .25);
  pod.scale.set(.65, 1.25, .65);
  pod.material = material(colors.red, .42);
}
// 02 — Produtor
{
  const g = newGroup();
  add(g, new THREE.BoxGeometry(4.8, .15, 3), 0, -1).material = material(0x6f7847);
  add(g, new THREE.CylinderGeometry(.38, .5, 1.4, 20), 0, .05).material = material(colors.clay);
  add(g, new THREE.SphereGeometry(.38, 20, 16), 0, 1).material = material(0xa96f50);
  add(g, new THREE.CylinderGeometry(.5, .5, .13, 20), 0, 1.35).material = material(colors.gold);
  for (let i = -2; i <= 2; i++) {
    const p = add(g, new THREE.SphereGeometry(.25, 12, 8), i * .8, -.6);
    p.scale.y = 1.6;
    p.material = material(colors.green);
  }
}
// 03 — Processo
{
  const g = newGroup();
  for (let i = 0; i < 3; i++) {
    const drum = add(g, new THREE.CylinderGeometry(.65, .65, 1.5, 24), -1.45 + i * 1.45, 0);
    drum.rotation.z = Math.PI / 2;
    drum.material = material(i === 1 ? colors.gold : colors.clay);
  }
  add(g, new THREE.BoxGeometry(5.2, .18, 1.2), 0, -.9).material = material(colors.brown);
  for (let i = 0; i < 8; i++) {
    const bean = add(g, new THREE.SphereGeometry(.16, 12, 8), -2.1 + i * .6, -.65);
    bean.scale.set(1, .55, .7);
    bean.material = material(0x6a351f);
  }
}
// 04 — Indústria
{
  const g = newGroup();
  add(g, new THREE.BoxGeometry(5.4, 2.5, 2.8), 0, 0).material = material(0xd8c5b5);
  for (let i = 0; i < 3; i++) add(g, new THREE.CylinderGeometry(.35, .35, 2.2, 20), -1.7 + i * 1.7, 2.25).material = material(colors.brown);
  add(g, new THREE.BoxGeometry(3.8, .65, .08), 0, .4, 1.43).material = material(0x8b6b5b);
}
// 05 — Chocolate
{
  const g = newGroup();
  add(g, new THREE.BoxGeometry(4.5, .65, 2.3), 0, 0).material = material(0x542819);
  for (let x = -1.5; x <= 1.5; x += 1) {
    for (let z = -.7; z <= .7; z += .7) add(g, new THREE.BoxGeometry(.85, .18, .55), x, .4, z).material = material(0x71371f);
  }
}
// 06 — Confeitaria
{
  const g = newGroup();
  for (let i = 0; i < 3; i++) add(g, new THREE.CylinderGeometry(1.45 - i * .18, 1.45 - i * .18, .62, 40), 0, -.45 + i * .62).material = material(i === 1 ? 0xf1d6c7 : colors.cream);
  add(g, new THREE.TorusGeometry(.95, .16, 14, 40), 0, 1.42).material = material(colors.red);
  for (let i = 0; i < 6; i++) add(g, new THREE.SphereGeometry(.12, 12, 8), Math.cos(i * Math.PI / 3) * .85, 1.65, Math.sin(i * Math.PI / 3) * .85).material = material(colors.red);
}
// 07 — Experiência
{
  const g = newGroup();
  add(g, new THREE.BoxGeometry(5.2, .22, 2.5), 0, -.35).material = material(colors.brown);
  for (let i = 0; i < 4; i++) add(g, new THREE.SphereGeometry(.27, 16, 12), -1.7 + i * 1.15, .25, i % 2 ? -.9 : .9).material = material(i % 2 ? colors.red : colors.clay);
  add(g, new THREE.CylinderGeometry(.8, .8, .08, 40), 0, .02).material = material(0xfffaf4);
}
// 08 — Território
{
  const g = newGroup();
  add(g, new THREE.SphereGeometry(1.8, 40, 28), 0, .35).material = material(colors.green);
  const ring = add(g, new THREE.TorusGeometry(2.3, .055, 8, 64), 0, .35);
  ring.rotation.x = .45;
  ring.rotation.z = .2;
  ring.material = material(colors.red, .3, .35);
  add(g, new THREE.ConeGeometry(.16, .5, 18), 1, 2.2, .1).material = material(colors.red);
}

// Rede visual inspirada em IA.
const network = new THREE.Group();
world.add(network);
network.position.set(0, .5, -1.8);
const pointPositions = [];
const pointArray = new Float32Array(42 * 3);
for (let i = 0; i < 42; i++) {
  const a = Math.random() * Math.PI * 2;
  const r = 2.2 + Math.random() * 2.2;
  const p = new THREE.Vector3(Math.cos(a) * r, (Math.random() - .5) * 2.5, Math.sin(a) * r * .45);
  pointPositions.push(p);
  pointArray[i * 3] = p.x;
  pointArray[i * 3 + 1] = p.y;
  pointArray[i * 3 + 2] = p.z;
}
const pointGeometry = new THREE.BufferGeometry();
pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointArray, 3));
network.add(new THREE.Points(pointGeometry, new THREE.PointsMaterial({ color: colors.gold, size: .065, transparent: true, opacity: .6 })));
const edges = [];
for (let i = 0; i < pointPositions.length; i++) {
  for (let j = i + 1; j < pointPositions.length; j++) {
    if (pointPositions[i].distanceTo(pointPositions[j]) < 1.5) edges.push(pointPositions[i].x, pointPositions[i].y, pointPositions[i].z, pointPositions[j].x, pointPositions[j].y, pointPositions[j].z);
  }
}
const edgeGeometry = new THREE.BufferGeometry();
edgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(edges, 3));
network.add(new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: colors.red, transparent: true, opacity: .09 })));

const title = document.querySelector('.journey-title');
const description = document.querySelector('.journey-description');
const counter = document.querySelector('.journey-counter');
const progress = document.querySelector('.journey-progress-bar');
const dots = [...document.querySelectorAll('.journey-dot')];
const insightTitle = document.querySelector('.ai-insight-title');
const insightText = document.querySelector('.ai-insight');
let current = -1;
let targetProgress = 0;
let progressValue = 0;

function getProgress() {
  const rect = track.getBoundingClientRect();
  const trackStart = window.scrollY + rect.top;
  const travel = Math.max(track.offsetHeight - window.innerHeight, 1);
  return THREE.MathUtils.clamp((window.scrollY - trackStart) / travel, 0, 1);
}

function setStage(index) {
  if (index === current) return;
  current = index;
  const data = stages[index];
  if (title) title.textContent = data[1];
  if (description) description.textContent = data[2];
  if (counter) counter.textContent = `${data[0]} / 08 · role para continuar`;
  if (insightTitle) insightTitle.textContent = insights[index][0];
  if (insightText) insightText.textContent = insights[index][1];
  if (progress) progress.style.width = `${((index + 1) / stages.length) * 100}%`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

function update() {
  targetProgress = getProgress();
  progressValue += (targetProgress - progressValue) * .12;
  const raw = progressValue * (stages.length - 1);
  const index = Math.min(stages.length - 1, Math.floor(raw + .00001));
  setStage(index);

  groups.forEach((g, i) => {
    const distance = Math.abs(i - raw);
    const opacity = THREE.MathUtils.clamp(1 - distance * 2.1, 0, 1);
    g.position.x = (i - raw) * .85;
    g.position.y = Math.sin((i - raw) * .7) * .12;
    g.scale.setScalar(.72 + opacity * .34);
    g.traverse(obj => { if (obj.isMesh) obj.material.opacity = opacity; });
    g.rotation.y += i === index ? .006 : .001;
  });

  network.rotation.y += .001;
  camera.position.x += ((raw - 3.5) * .28 - camera.position.x) * .045;
  camera.position.y += (1.15 + Math.sin(raw * .6) * .15 - camera.position.y) * .045;
  camera.lookAt(0, .3, 0);
}

function resize() {
  const width = Math.max(1, stage.clientWidth || window.innerWidth);
  const height = Math.max(1, stage.clientHeight || window.innerHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener('scroll', update, { passive: true });
window.addEventListener('resize', resize, { passive: true });
window.addEventListener('orientationchange', resize, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);

resize();
update();

renderer.setAnimationLoop(() => {
  update();
  renderer.render(scene, camera);
  canvas.dataset.threeReady = 'true';
});

const sound = document.querySelector('.journey-sound');
if (sound && 'speechSynthesis' in window) {
  sound.addEventListener('click', () => {
    speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(stages.map(s => `${s[1]}. ${s[2]}`).join(' '));
    voice.lang = 'pt-BR';
    voice.rate = .92;
    speechSynthesis.speak(voice);
  });
}
