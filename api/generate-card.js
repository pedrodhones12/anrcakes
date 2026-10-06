const MAX_PHOTO=8*1024*1024;
const MAX_TEXT=1800;
const WINDOW_MS=60*60*1000;
const MAX_PER_IP=3;
const hits=new Map();

const clean=(value,max=240)=>String(value||"").trim().slice(0,max);
const json=(res,status,payload)=>res.status(status).setHeader("Content-Type","application/json").json(payload);

function rateLimit(ip){
  const now=Date.now();
  const list=(hits.get(ip)||[]).filter(t=>now-t<WINDOW_MS);
  if(list.length>=MAX_PER_IP)return false;
  list.push(now);hits.set(ip,list);
  if(hits.size>2000){for(const [key,times] of hits){if(!times.some(t=>now-t<WINDOW_MS))hits.delete(key)}}
  return true;
}

function buildPrompt(d){
  if(d.mode==="eu-vou") return "Você é um diretor de arte da Ane Cakes Fair. Crie a BASE VISUAL de uma tag vertical 4:5 para uma pessoa que confirmou presença na 5ª edição do evento. Preserve rigorosamente a identidade da pessoa enviada. Direção: campanha oficial, quente, sofisticada, vinho, dourado e creme, confeitaria e celebração, sem textos, letras, números, logotipos ou marcas d’água. Data: 30 e 31 de janeiro de 2027. Local: Ilhéus, Bahia.";

  const loc=d.visualLocation==="none"?"sem referência geográfica":d.visualLocation==="birth"?d.birthPlace:d.visualLocation==="other"?d.otherLocation:`${d.city} - ${d.state}`;
  const gender=d.gender==="male"?"embaixador":d.gender==="neutral"?"representante":"embaixadora";
  const highlights=d.highlights.length?d.highlights.join(" • "):"sem destaques adicionais";
  return `Você é o diretor de arte oficial da Ane Cakes Fair. A imagem anexada chamada REFERÊNCIA DE LAYOUT é o padrão visual obrigatório para esta geração. Não crie um card genérico e não use o estilo de um retrato corporativo.

REPRODUZA A LINGUAGEM VISUAL DA REFERÊNCIA assets/madija.jpg:
- formato vertical 4:5, aproximadamente 1080 × 1350;
- fundo predominante creme/off-white, delicado, sofisticado e luminoso;
- moldura fina dourada arredondada;
- detalhes botânicos/florais desenhados em linha dourada nos cantos;
- atmosfera editorial de confeitaria, feminina/elegante quando combinar com a pessoa, com acabamento de convite/campanha premium;
- ao fundo, uma paisagem/cidade relacionada a ${loc}, suave e integrada, como na referência;
- a pessoa deve ocupar principalmente a região inferior esquerda, em destaque, com enquadramento de meio corpo ou corpo adequado à foto;
- preserve rigorosamente rosto, cabelo, tom de pele, idade aparente, proporções e identidade da pessoa enviada;
- reserve uma grande área limpa no centro/direita para textos;
- a composição deve parecer uma peça gráfica pronta para receber exatamente a tipografia sobreposta pelo sistema;
- use vinho/bordô para títulos e dourado para linhas, molduras e pequenos detalhes;
- mantenha hierarquia visual semelhante à referência: marca no topo, grande título de embaixadora, nome em destaque na área direita, bloco de localização e informações abaixo, frase em caixa delicada e assinatura do evento no rodapé;
- NÃO gere nenhum texto, letra, número, emoji, logotipo ou marca d’água. O sistema aplicará todo o texto com precisão.
- NÃO copie a pessoa ou o conteúdo específico de Madija; use a referência somente como modelo visual/layout.

Dados para orientar a cena:
Nome: ${d.displayName}
Profissão: ${d.profession}
Cidade/UF: ${d.city} - ${d.state}
Naturalidade: ${d.birthPlace||"não informada"}
História: ${d.story||"não informada"}
Destaques: ${highlights}
Frase: ${d.quote||"Onde a confeitaria vira experiência."}
Evento: Ane Cakes Fair, 30 e 31 de janeiro de 2027
Papel: ${gender}

O resultado precisa ser visualmente muito próximo da referência em estrutura, composição, paleta, elegância e distribuição de espaço, mas com a pessoa enviada e o contexto do novo participante.`;
}

export default async function handler(req,res){
  if(req.method!=="POST")return json(res,405,{error:"Método não permitido."});
  const ip=String(req.headers["x-forwarded-for"]||req.socket?.remoteAddress||"anonymous").split(",")[0].trim();
  if(!rateLimit(ip))return json(res,429,{error:"Limite temporário atingido. Tente novamente em até 1 hora."});
  if(!process.env.OPENAI_API_KEY)return json(res,503,{error:"A integração com a IA ainda não foi configurada no servidor."});
  try{
    const d=req.body||{};
    const photo=String(d.photoDataUrl||"");
    if(!/^data:image\/(jpeg|png|webp);base64,/i.test(photo))return json(res,400,{error:"Foto inválida. Use JPG, PNG ou WEBP."});
    const comma=photo.indexOf(",");
    const binary=Buffer.from(photo.slice(comma+1),"base64");
    if(!binary.length||binary.length>MAX_PHOTO)return json(res,400,{error:"A foto deve ter no máximo 8 MB."});
    const data={
      mode:clean(d.mode,20),
      fullName:clean(d.fullName,160),
      displayName:clean(d.displayName,80),
      profession:clean(d.profession,120),
      city:clean(d.city,100),
      state:clean(d.state,2).toUpperCase(),
      birthPlace:clean(d.birthPlace,120),
      story:clean(d.story,MAX_TEXT),
      highlights:Array.isArray(d.highlights)?d.highlights.slice(0,8).map(x=>clean(x,120)).filter(Boolean):[],
      quote:clean(d.quote,240),
      visualLocation:clean(d.visualLocation,20),
      otherLocation:clean(d.otherLocation,120),
      gender:clean(d.gender,20),
      style:clean(d.style,30)
    };
    if(!data.displayName||!data.profession||!data.city||!data.state)return json(res,400,{error:"Preencha nome, profissão, cidade e estado."});
    const ai=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization:"Bearer "+process.env.OPENAI_API_KEY},
      body:JSON.stringify({
        model:process.env.OPENAI_MODEL||"gpt-6-luna",
        input:[{role:"user",content:[
          {type:"input_text",text:buildPrompt(data)},
          {type:"input_image",image_url:photo,detail:"high"},
          {type:"input_image",image_url:"https://raw.githubusercontent.com/pedrodhones12/anrcakes/main/assets/madija.jpg",detail:"high"}
        ]}],
        tools:[{type:"image_generation",model:process.env.OPENAI_IMAGE_MODEL||"gpt-image-2",quality:"high"}]
      })
    });
    const result=await ai.json();
    if(!ai.ok){
      console.error("OpenAI error",result);
      return json(res,502,{error:"A IA não conseguiu gerar a arte agora. Verifique a configuração da chave da IA."});
    }
    const call=(result.output||[]).find(item=>item.type==="image_generation_call"&&item.result);
    if(!call?.result)return json(res,502,{error:"A IA não retornou uma imagem."});
    return json(res,200,{imageDataUrl:"data:image/png;base64,"+call.result,model:process.env.OPENAI_IMAGE_MODEL||"gpt-image-2"});
  }catch(error){
    console.error(error);
    return json(res,500,{error:"Não foi possível gerar a arte agora. Tente novamente."});
  }
}
