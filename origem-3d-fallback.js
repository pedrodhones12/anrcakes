(() => {
  const boot = () => {
    const canvas = document.getElementById('cacaoJourneyCanvas');
    const stage = document.querySelector('.journey-stage');
    if (!canvas || !stage) return;

    const drawFallback = () => {
      if (canvas.dataset.threeReady === 'true') return;
      const w = Math.max(1, canvas.clientWidth || stage.clientWidth || 600);
      const h = Math.max(1, canvas.clientHeight || stage.clientHeight || 690);
      canvas.width = Math.floor(w * Math.min(window.devicePixelRatio || 1, 1.5));
      canvas.height = Math.floor(h * Math.min(window.devicePixelRatio || 1, 1.5));
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const sx = canvas.width / w, sy = canvas.height / h;
      ctx.setTransform(sx, 0, 0, sy, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const scroll = Math.max(0, Math.min(1, (window.scrollY - (window.scrollY + stage.getBoundingClientRect().top)) / Math.max(stage.offsetHeight, window.innerHeight)));
      const raw = scroll * 7;
      const stageIndex = Math.min(7, Math.floor(raw));
      const colors = ['#9d1026','#c69a42','#4d2d1e','#718a58'];
      const cx = w * 0.58;
      const cy = h * 0.53;
      const scale = Math.min(w, h) / 520;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.sin(raw * .35) * .035);
      ctx.scale(scale, scale);

      const glow = ctx.createRadialGradient(0, 20, 10, 0, 20, 210);
      glow.addColorStop(0, 'rgba(198,154,66,.20)');
      glow.addColorStop(1, 'rgba(198,154,66,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(0, 20, 210, 0, Math.PI * 2); ctx.fill();

      // Rede de dados
      for (let i = 0; i < 24; i++) {
        const a = i * .72 + raw * .08;
        const r = 125 + (i % 5) * 17;
        const x = Math.cos(a) * r, y = Math.sin(a) * r * .55;
        ctx.fillStyle = i % 3 === 0 ? 'rgba(157,16,38,.48)' : 'rgba(198,154,66,.45)';
        ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill();
        if (i > 0) {
          const pa = (i - 1) * .72 + raw * .08, pr = 125 + ((i - 1) % 5) * 17;
          ctx.strokeStyle = 'rgba(157,16,38,.10)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(Math.cos(pa)*pr, Math.sin(pa)*pr*.55); ctx.stroke();
        }
      }

      // Forma principal da etapa ativa.
      if (stageIndex === 0) {
        ctx.fillStyle = '#6b452e'; ctx.fillRect(-10, -100, 20, 185);
        ctx.fillStyle = '#718a58';
        [[-55,-90],[-5,-125],[48,-85],[-35,-45],[28,-38]].forEach(([x,y],i)=>{ctx.save();ctx.translate(x,y);ctx.rotate((i-2)*.22);ctx.beginPath();ctx.ellipse(0,0,55,20,0,0,Math.PI*2);ctx.fill();ctx.restore();});
        ctx.fillStyle = '#9d1026'; ctx.beginPath(); ctx.ellipse(45, -10, 30, 58, -.15, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(255,220,190,.55)'; ctx.beginPath(); ctx.ellipse(37,-28,9,25,-.15,0,Math.PI*2); ctx.fill();
      } else {
        const base = colors[stageIndex % colors.length];
        ctx.fillStyle = base;
        ctx.shadowColor = 'rgba(77,45,30,.22)'; ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.roundRect(-105, -55, 210, 110, 22); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fffaf4';
        ctx.font = '600 30px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(String(stageIndex + 1).padStart(2,'0'), 0, -5);
        ctx.font = '500 15px Arial';
        ctx.fillText(['Fruto','Produtor','Processo','Indústria','Chocolate','Confeitaria','Experiência','Território'][stageIndex], 0, 30);
      }
      ctx.restore();
    };

    const hasRenderedThree = () => {
      try {
        if (canvas.width <= 320 || canvas.height <= 160) return false;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return false;
        const data = ctx.getImageData(Math.floor(canvas.width * .2), Math.floor(canvas.height * .2), Math.max(1, Math.floor(canvas.width * .6)), Math.max(1, Math.floor(canvas.height * .6))).data;
        let different = 0;
        for (let i = 0; i < data.length; i += 16) {
          const r=data[i], g=data[i+1], b=data[i+2], a=data[i+3];
          if (a > 20 && (Math.abs(r-247)+Math.abs(g-239)+Math.abs(b-228) > 35)) { different++; if (different > 8) return true; }
        }
      } catch (_) {}
      return false;
    };

    setTimeout(() => {
      if (!hasRenderedThree()) {
        canvas.dataset.threeFallback = 'true';
        drawFallback();
        window.addEventListener('resize', drawFallback, {passive:true});
        window.addEventListener('scroll', drawFallback, {passive:true});
      } else {
        canvas.dataset.threeReady = 'true';
      }
    }, 1400);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
