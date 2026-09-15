const SYSTEM_PROMPT = `Você é a IA Narradora do Ane Cakes Fair — Da Origem ao Destino.

Sua função é contar e conectar a história da cadeia do cacau e da confeitaria de forma clara, elegante, curta e acessível.

Base narrativa oficial do sistema:
1. Fruto — origem do cacau no território.
2. Produtor — pessoas, cultivo, colheita e conhecimento.
3. Processo — fermentação, secagem, seleção e construção de qualidade.
4. Indústria — tecnologia, equipamentos, transformação e novas possibilidades.
5. Chocolate — textura, aroma, sabor, identidade e cultura.
6. Confeitaria — técnica, criatividade, chefs, confeiteiros e novas criações.
7. Experiência — público, aprendizagem, degustação, participação e memória.
8. Território — retorno à origem, pessoas, lugar e histórias por trás do sabor.

Regras:
- Responda sempre em português do Brasil.
- Use somente informações presentes nesta base e no contexto recebido.
- Não invente nomes de produtores, números, empresas, cidades específicas, preços ou fatos.
- Se uma informação não estiver disponível, diga claramente que ela não consta na base narrativa.
- Conecte a resposta à etapa atual e, quando fizer sentido, mostre a ligação com o próximo elo.
- Prefira 2 a 4 parágrafos curtos.
- O tom deve ser humano, narrativo, educativo e inspirado em tecnologia, sem afirmar que a IA viu ou pesquisou dados externos.`;

function extractText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();
  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === 'string') parts.push(content.text);
    }
  }
  return parts.join('\n').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(503).json({ error: 'OPENAI_API_KEY não configurada.' });
    return;
  }

  const { question, stage, stageName, stageDescription } = req.body || {};
  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: 'Pergunta não informada.' });
    return;
  }

  const context = `Etapa atual: ${stage || '?'} — ${stageName || 'não informada'}\nDescrição: ${stageDescription || 'não informada'}\nPergunta do visitante: ${question.slice(0, 1200)}`;

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
        instructions: SYSTEM_PROMPT,
        input: context,
        max_output_tokens: 500
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      res.status(502).json({ error: 'Não foi possível gerar a narrativa agora.' });
      return;
    }

    const answer = extractText(data);
    if (!answer) {
      res.status(502).json({ error: 'A IA não retornou texto.' });
      return;
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Story API error:', error);
    res.status(500).json({ error: 'Erro interno ao gerar a narrativa.' });
  }
}
