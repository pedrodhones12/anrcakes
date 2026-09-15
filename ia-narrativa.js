const IA_ENDPOINT = 'https://ane-story-engine.base44.app/functions/storyChat';

const knowledge = {
  1: { title: 'Fruto', text: 'Tudo começa no fruto. O cacau nasce no território e carrega a primeira parte dessa história.' },
  2: { title: 'Produtor', text: 'A terra encontra quem cultiva, colhe e transforma cuidado em matéria-prima.' },
  3: { title: 'Processo', text: 'Fermentar, secar e selecionar: cada etapa acrescenta valor ao ingrediente.' },
  4: { title: 'Indústria', text: 'Tecnologia e conhecimento transformam a amêndoa em novos produtos e possibilidades.' },
  5: { title: 'Chocolate', text: 'O cacau ganha outra forma: textura, aroma, sabor e identidade.' },
  6: { title: 'Confeitaria', text: 'Chefs e confeiteiros transformam o chocolate em criação, técnica e desejo.' },
  7: { title: 'Experiência', text: 'A criação encontra pessoas: provar, aprender, conversar e levar uma memória.' },
  8: { title: 'Território', text: 'A experiência aponta de volta para a origem: conhecer o lugar onde aquela história começa.' }
};

function initNarrativa() {
  const chat = document.querySelector('#iaNarrativa');
  if (!chat) { console.warn('IA narrativa: elemento #iaNarrativa não encontrado.'); return; }

  const messages = chat.querySelector('.ia-messages');
  const input = chat.querySelector('.ia-input');
  const send = chat.querySelector('.ia-send');
  const status = chat.querySelector('.ia-status');
  const quickButtons = [...chat.querySelectorAll('[data-question]')];
  const continueButton = chat.querySelector('.ia-continue');

  if (!messages || !input || !send || !status || !continueButton) {
    console.warn('IA narrativa: elementos do chat não encontrados.', { messages: !!messages, input: !!input, send: !!send, status: !!status, continueButton: !!continueButton });
    return;
  }

  let currentStage = 1;
  let busy = false;
  let lastNarrative = '';
  let sessionId = sessionStorage.getItem('aneStorySessionId');
  if (!sessionId) {
    sessionId = `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('aneStorySessionId', sessionId);
  }

  window.addEventListener('ane-stage-change', (e) => {
    currentStage = e.detail.stage + 1;
    const data = knowledge[currentStage];
    chat.querySelector('.ia-context').textContent = `Etapa atual · ${data.title}`;
    status.textContent = 'Sistema pronto para explorar esta etapa.';
  });

  function addMessage(text, role = 'ai') {
    const item = document.createElement('div');
    item.className = `ia-message ${role}`;
    item.textContent = text;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function fallback(question) {
    const data = knowledge[currentStage];
    const q = question.toLowerCase();
    if (q.includes('prod') || q.includes('quem')) {
      return `Na etapa ${data.title}, o foco está nas pessoas que fazem a cadeia acontecer. No contexto da Ane Cakes Fair, a narrativa conecta território, produtores, conhecimento e criação sem inventar nomes ou dados que não estejam na base do projeto.`;
    }
    if (q.includes('chocolate') || q.includes('vira')) {
      return 'O cacau percorre uma cadeia de transformação: fruto, produtor, processo, indústria e chocolate. Depois, a confeitaria transforma esse ingrediente em novas criações e experiências.';
    }
    if (q.includes('valor') || q.includes('negócio')) {
      return 'Valor é construído em várias etapas: qualidade da matéria-prima, conhecimento, transformação, tecnologia, criação, distribuição e experiência. A proposta da feira é tornar essa cadeia visível para o público.';
    }
    if (q.includes('territ')) {
      return 'O território não aparece apenas como cenário. Ele é parte da história: é onde estão a origem, as pessoas, os saberes e as relações que dão sentido ao ingrediente.';
    }
    return `Estamos em “${data.title}”. ${data.text} Pergunte sobre produtores, transformação, chocolate, negócios, experiência ou território para aprofundar a história.`;
  }

  async function ask(question) {
    const clean = question.trim();
    if (!clean || busy) return;
    busy = true;
    addMessage(clean, 'user');
    input.value = '';
    status.textContent = 'Conectando esta pergunta ao motor da história…';
    const typing = addMessage('Analisando a história…', 'ai typing');
    try {
      const response = await fetch(IA_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean, stage: knowledge[currentStage].title, sessionId })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      typing.remove();
      lastNarrative = data.answer || fallback(clean);
      addMessage(lastNarrative, 'ai');
      if (data.sessionId) { sessionId = data.sessionId; sessionStorage.setItem('aneStorySessionId', sessionId); }
      status.textContent = 'Narrativa atualizada pelo Ane Story Engine.';
    } catch (error) {
      console.warn('Ane Story Engine indisponível:', error);
      typing.remove();
      lastNarrative = fallback(clean);
      addMessage(lastNarrative, 'ai');
      status.textContent = 'Motor externo indisponível. Modo local ativado.';
    } finally { busy = false; }
  }

  function continueStory() {
    const next = currentStage >= 8 ? 1 : currentStage + 1;
    window.dispatchEvent(new CustomEvent('ane-goto-stage', { detail: { stage: next - 1 } }));
    setTimeout(() => ask(`Continue a história a partir de ${knowledge[next].title}.`), 350);
  }

  quickButtons.forEach(button => button.addEventListener('click', () => ask(button.dataset.question || 'Conte a história desta etapa.')));
  send.addEventListener('click', () => ask(input.value));
  input.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); ask(input.value); } });
  continueButton.addEventListener('click', continueStory);
  addMessage('Olá. Eu sou a narradora da jornada. Escolha uma pergunta ou escreva o que você quer descobrir sobre esta cadeia.', 'ai');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNarrativa);
} else {
  initNarrativa();
}
