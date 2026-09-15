(() => {
  const boot = () => {
    const threeCanvas = document.getElementById('cacaoJourneyCanvas');
    const stage = document.querySelector('.journey-stage');
    if (!threeCanvas || !stage) return;

    const showFallback = () => {
      if (threeCanvas.dataset.threeReady === 'true' || document.getElementById('cacaoJourneyFallback')) return;
      const canvas = document.createElement('canvas');
      canvas.id = 'cacaoJourneyFallback';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none;';
      stage.insertBefore(canvas, stage.firstChild);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw = () => {
        if (threeCanvas.dataset.threeReady === 'true') { canvas.remove(); return; }
        const w = Math.max(1, stage.clientWidth), h = Math.max(1, stage.clientHeight);
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
        const rect = stage.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, -rect.top / Math.max(stage.offsetHeight, window.innerHeight)));
        const raw = p * 7, index = Math.min(7, Math.floor(raw));
        const cx = w * .58, cy = h * .53, scale = Math.min(w,h) / 520;
        ctx.save(); ctx.translate(cx,cy); ctx.scale(scale,scale); ctx.rotate(Math.sin(raw*.35)*.035);

        const glow = ctx.createRadialGradient(0,20,10,0,20,210);
        glow.addColorStop(0,'rgba(198,154,66,.22)'); glow.addColorStop(1,'rgba(198,154,66,0)');
        ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(0,20,210,0,Math.PI*2); ctx.fill();

        for(let i=0;i<24;i++){
          const a=i*.72+raw*.08,r=125+(i%5)*17,x=Math.cos(a)*r,y=Math.sin(a)*r*.55;
          ctx.fillStyle=i%3===0?'rgba(157,16,38,.5)':'rgba(198,154,66,.5)';
          ctx.beginPath();ctx.arc(x,y,3.2,0,Math.PI*2);ctx.fill();
        }
        if(index===0){
          ctx.fillStyle='#6b452e';ctx.fillRect(-10,-100,20,185);ctx.fillStyle='#718a58';
          [[-55,-90],[-5,-125],[48,-85],[-35,-45],[28,-38]].forEach(([x,y],i)=>{ctx.save();ctx.translate(x,y);ctx.rotate((i-2)*.22);ctx.beginPath();ctx.ellipse(0,0,55,20,0,0,Math.PI*2);ctx.fill();ctx.restore();});
          ctx.fillStyle='#9d1026';ctx.beginPath();ctx.ellipse(45,-10,30,58,-.15,0,Math.PI*2);ctx.fill();
        } else {
          const palette=['#9d1026','#c69a42','#4d2d1e','#718a58'];
          ctx.fillStyle=palette[index%palette.length];ctx.shadowColor='rgba(77,45,30,.22)';ctx.shadowBlur=18;
          ctx.beginPath();ctx.roundRect(-105,-55,210,110,22);ctx.fill();ctx.shadowBlur=0;
          ctx.fillStyle='#fffaf4';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 30px Arial';ctx.fillText(String(index+1).padStart(2,'0'),0,-5);ctx.font='500 15px Arial';
          ctx.fillText(['Fruto','Produtor','Processo','Indústria','Chocolate','Confeitaria','Experiência','Território'][index],0,30);
        }
        ctx.restore();
      };
      draw(); window.addEventListener('resize',draw,{passive:true}); window.addEventListener('scroll',draw,{passive:true});
    };

    window.addEventListener('cacao-3d-error', showFallback, {once:true});
    setTimeout(() => { if (threeCanvas.dataset.threeReady !== 'true') showFallback(); }, 1800);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
