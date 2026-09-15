const IA_ENDPOINT = 'https://ane-story-engine.base44.app/functions/storyChat';

const knowledge = {
  1: { title: 'Fruto', text: 'Tudo come\u00e7a no fruto. O cacau nasce no territ\u00f3rio e carrega a primeira parte dessa hist\u00f3ria.' },
  2: { title: 'Produtor', text: 'A terra encontra quem cultiva, colhe e transforma cuidado em mat\u00e9ria-prima.' },
  3: { title: 'Processo', text: 'Fermentar, secar e selecionar: cada etapa acrescenta valor ao ingrediente.' },
  4: { title: 'Ind\u00fastria', text: 'Tecnologia e conhecimento transformam a am\u00eandoa em novos produtos e possibilidades.' },
  5: { title: 'Chocolate', text: 'O cacau ganha outra forma: textura, aroma, sabor e identidade.' },
  6: { title: 'Confeitaria', text: 'Chefs e confeiteiros transformam o chocolate em cria\u00e7\u00e3o, t\u00e9cnica e desejo.' },
  7: { title: 'Experi\u00eancia', text: 'A cria\u00e7\u00e3o encontra pessoas: provar, aprender, conversar e levar uma mem\u00f3ria.' },
  8: { title: 'Territ\u00f3rio', text: 'A experi\u00eancia aponta de volta para a origem: conhecer o lugar onde aquela hist\u00f3ria come\u00e7a.' }
};

const chat = document.querySelector('#iaNarrativa');
if (!chat) throw new Error('Interface da IA narrativa n\u00e3o encontrada.');

const messages = chat.querySelector('.ia-messages');
const input = chat.querySelector('.ia-input');
const send = chat.querySelector('.ia-send');
const status = chat.querySelector('.ia-status');
const quickButtons = [...chat.querySelectorAll('[data-question]')];
const continueButton = chat.querySelector('.ia-continue');
let currentStage = 1;
let busy = false;
let lastNarrative = '';
let sessionId = sessionStorage.getItem('aneStorySessionId');
if (!sessionId) {
  sessionId = \`web-\${Date.now()}-\${Math.random().toString(36).slice(2, 10)}\`;
  sessionStorage.setItem('aneStorySessionId', sessionId);
}

window.addEventListener('ane-stage-change', (e) => {
  currentStage = e.detail.stage + 1;
  const data = knowledge[currentStage];
  chat.querySelector('.ia-context').textContent = \`Etapa atual \u00b7 \${data.title}\`;
  status.textContent = 'Sistema pronto para explorar esta etapa.';
});

function addMessage(text, role = 'ai') {
  const item = document.createElement('div');
  item.className = \`ia-message \${role}\`;
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
  return item;
}

function fallback(question) {
  const data = knowledge[currentStage];
  const q = question.toLowerCase();
  if (q.includes('prod') || q.includes('quem')) {
    return \`Na etapa \${data.title}, o foco est\u00e1 nas pessoas que fazem a cadeia acontecer. No contexto da Ane Cakes Fair, a narrativa conecta territ\u00f3rio, produtores, conhecimento e cria\u00e7\u00e3o sem inventar nomes ou dados que n\u00e3o estejam na base do projeto.\`;
  }
  if (q.includes('chocolate') || q.includes('vira')) {
    return 'O cacau percorre uma cadeia de transforma\u00e7\u00e3o: fruto, produtor, processo, ind\u00fastria e chocolate. Depois, a confeitaria transforma esse ingrediente em novas cria\u00e7\u00f5es e experi\u00eancias.';
  }
  if (q.includes('valor') || q.includes('neg\u00f3cio')) {
    return 'Valor \u00e9 constru\u00eddo em v\u00e1rias etapas: qualidade da mat\u00e9ria-prima, conhecimento, transforma\u00e7\u00e3o, tecnologia, cria\u00e7\u00e3o, distribui\u00e7\u00e3o e experi\u00eancia. A proposta da feira \u00e9 tornar essa cadeia vis\u00edvel para o p\u00fablico.';
  }
  if (q.includes('territ')) {
    return 'O territ\u00f3rio n\u00e3o aparece apenas como cen\u00e1rio. Ele \u00e9 parte da hist\u00f3ria: \u00e9 onde est\u00e3o a origem, as pessoas, os saberes e as rela\u00e7\u00f5es que d\u00e3o sentido ao ingrediente.';
  }
  return \`Estamos em \u201c\${data.title}\u201d. \${data.text} Pergunte sobre produtores, transforma\u00e7\u00e3o, chocolate, neg\u00f3cios, experi\u00eancia ou territ\u00f3rio para aprofundar a hist\u00f3ria.\`;
}

async function ask(question) {
  const clean = question.trim();
  if (!clean || busy) return;
  busy = true;
  addMessage(clean, 'user');
  input.value = '';
  status.textContent = 'Conectando esta pergunta ao motor da hist\u00f3ria\u2026';
  const typing = addMessage('Analisando a hist\u00f3ria\u2026', 'ai typing');
  try {
    const response = await fetch(IA_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: clean, stage: knowledge[currentStage].title, sessionId })
    });
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    const data = await response.json();
    typing.remove();
    lastNarrative = data.answer || fallback(clean);
    addMessage(lastNarrative, 'ai');
    if (data.sessionId) { sessionId = data.sessionId; sessionStorage.setItem('aneStorySessionId', sessionId); }
    status.textContent = 'Narrativa atualizada pelo Ane Story Engine.';
  } catch (error) {
    console.warn('Ane Story Engine indispon\u00edvel:', error);
    typing.remove();
    lastNarrative = fallback(clean);
    addMessage(lastNarrative, 'ai');
    status.textContent = 'Motor externo indispon\u00edvel. Modo local ativado.';
  } finally { busy = false; }
}

function continueStory() {
  const next = currentStage >= 8 ? 1 : currentStage + 1;
  window.dispatchEvent(new CustomEvent('ane-goto-stage', { detail: { stage: next - 1 } }));
  setTimeout(() => ask(\`Continue a hist\u00f3ria a partir de \${knowledge[next].title}.\`), 350);
}

quickButtons.forEach(button => button.addEventListener('click', () => ask(button.dataset.question || 'Conte a hist\u00f3ria desta etapa.')));
send.addEventListener('click', () => ask(input.value));
input.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); ask(input.value); } });
continueButton.addEventListener('click', continueStory);
addMessage('Ol\u00e1. Eu sou a narradora da jornada. Escolha uma pergunta ou escreva o que voc\u00ea quer descobrir sobre esta cadeia.', 'ai');
