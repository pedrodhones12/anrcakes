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
  const loc=d.visualLocation==="none"?"sem referência geográfica":d.visualLocation==="birth"?d.birthPlace:d.visualLocation==="other"?d.otherLocation:`${d.city} - ${d.state}`;
  const gender=d.gender==="male"?"embaixador":d.gender==="neutral"?"representante":"embaixadora";
  const highlights=d.highlights.length?d.highlights.join(" • "):"sem destaques adicionais";
  return `Você é um diretor de arte especializado em cards editoriais profissionais. Crie uma imagem vertical de retrato para um card oficial da Ane Cakes Fair, com aparência premium, contemporânea e original.

A pessoa da imagem enviada é a pessoa principal. Preserve sua identidade visual e semelhança: rosto, formato facial, cabelo, tom de pele, idade aparente e proporções. Não substitua a pessoa, não crie outra pessoa e não aplique caricatura. Faça apenas tratamento editorial de iluminação, enquadramento, profundidade, roupa quando necessário e integração com o cenário.

Direção visual:
- estilo: ${d.style};
- localização contextual: ${loc};
- use elementos arquitetônicos, culturais ou ambientais sutis associados ao local, sem inserir símbolos aleatórios;
- composição elegante, sofisticada e adequada para divulgação profissional;
- iluminação de estúdio/editorial;
- fundo com profundidade e áreas visualmente limpas;
- paleta coerente com ${d.style};
- composição vertical, pensando em aproximadamente 4:5;
- NÃO copie a composição ou elementos exclusivos de nenhuma arte de referência;
- NÃO invente logotipos, marcas ou textos ilegíveis.

Informações da pessoa:
Nome: ${d.displayName}
Profissão: ${d.profession}
Cidade/UF: ${d.city} - ${d.state}
Naturalidade: ${d.birthPlace||"não informada"}
História: ${d.story||"não informada"}
Destaques: ${highlights}
Frase: ${d.quote||"Onde a confeitaria vira experiência."}

O texto final do card será aplicado pelo sistema posteriormente. Portanto, concentre-se principalmente em gerar uma imagem visual profissional da pessoa integrada ao cenário. Não coloque textos, letras, números, marcas d'água ou logotipos na imagem.`;
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
          {type:"input_image",image_url:photo,detail:"high"}
        ]}],
        tools:[{type:"image_generation",model:process.env.OPENAI_IMAGE_MODEL||"gpt-image-2",quality:"medium"}]
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
