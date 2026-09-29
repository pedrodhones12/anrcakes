document.addEventListener("DOMContentLoaded",()=>{
const input=document.getElementById("photoInput");
const nameInput=document.getElementById("personName");
const fileName=document.getElementById("fileName");
const canvas=document.getElementById("shareCanvas");
const ctx=canvas.getContext("2d");
const generate=document.getElementById("generateButton");
const placeholder=document.getElementById("previewPlaceholder");
const actions=document.getElementById("resultActions");
const download=document.getElementById("downloadButton");
const share=document.getElementById("shareButton");
let photo=null;

function roundedRect(c,x,y,w,h,r){
c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();
}
function drawCover(img){
const scale=Math.max(1080/img.width,850/img.height);
const w=img.width*scale,h=img.height*scale;
const x=(1080-w)/2,y=(850-h)/2;
ctx.drawImage(img,x,y,w,h);
}
function generateArt(){
if(!photo)return;
ctx.clearRect(0,0,1080,1350);
ctx.fillStyle="#f7efe4";ctx.fillRect(0,0,1080,1350);
drawCover(photo);
ctx.fillStyle="rgba(45,33,28,.28)";ctx.fillRect(0,0,1080,850);
const grad=ctx.createLinearGradient(0,680,0,850);grad.addColorStop(0,"rgba(45,33,28,0)");grad.addColorStop(1,"rgba(45,33,28,.88)");ctx.fillStyle=grad;ctx.fillRect(0,500,1080,350);
ctx.fillStyle="#fffaf4";ctx.fillRect(0,850,1080,500);
ctx.strokeStyle="#c69a42";ctx.lineWidth=3;ctx.strokeRect(32,32,1016,1286);
ctx.strokeStyle="rgba(198,154,66,.55)";ctx.lineWidth=1;ctx.strokeRect(48,48,984,1290-80);
ctx.fillStyle="#c69a42";ctx.font='700 22px "DM Sans"';ctx.textAlign="center";ctx.letterSpacing="4px";ctx.fillText("ANE CAKES FAIR",540,915);
ctx.fillStyle="#9d1026";ctx.font='600 82px "Cormorant Garamond"';ctx.fillText("EU VOU PARA O",540,1010);
ctx.font='700 96px "Cormorant Garamond"';ctx.fillText("ANE CAKES FAIR!",540,1105);
const name=(nameInput.value||"").trim();
if(name){ctx.fillStyle="#59463b";ctx.font='600 28px "DM Sans"';ctx.fillText(name,540,1165)}
ctx.fillStyle="#806d61";ctx.font='500 19px "DM Sans"';ctx.fillText("Ilhéus · Bahia",540,1230);
ctx.fillStyle="#c69a42";ctx.font='700 18px "DM Sans"';ctx.fillText("DA ORIGEM AO DESTINO",540,1268);
ctx.fillStyle="#9d1026";ctx.beginPath();ctx.arc(540,1295,5,0,Math.PI*2);ctx.fill();
placeholder.hidden=true;actions.hidden=false;
}
input.addEventListener("change",()=>{
const file=input.files&&input.files[0];if(!file)return;
fileName.textContent=file.name;generate.disabled=false;
const reader=new FileReader();reader.onload=e=>{const img=new Image();img.onload=()=>{photo=img;generateArt()};img.src=e.target.result};reader.readAsDataURL(file);
});
nameInput.addEventListener("input",()=>{if(photo)generateArt()});
generate.addEventListener("click",generateArt);
download.addEventListener("click",()=>{
const link=document.createElement("a");link.download="eu-vou-ane-cakes-fair.png";link.href=canvas.toDataURL("image/png");link.click();
});
share.addEventListener("click",async()=>{
try{
const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/png"));
const file=new File([blob],"eu-vou-ane-cakes-fair.png",{type:"image/png"});
if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({title:"Eu vou para o Ane Cakes Fair!",text:"Eu vou para o Ane Cakes Fair!",files:[file]});}
else if(navigator.share){await navigator.share({title:"Eu vou para o Ane Cakes Fair!",text:"Eu vou para o Ane Cakes Fair!",url:location.href});}
else{download.click();}
}catch(e){}
});
});