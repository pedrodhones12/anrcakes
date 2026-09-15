// Ativa a cena 3D somente enquanto o visitante percorre a trilha.
(() => {
  const section = document.querySelector('.cacao-journey-3d');
  const track = document.querySelector('.journey-stage-track');
  const stage = document.querySelector('.journey-stage');
  if (!section || !track || !stage) return;

  const updateVisibility = () => {
    const rect = track.getBoundingClientRect();
    const travel = Math.max(track.offsetHeight - window.innerHeight, 1);
    const active = rect.top <= 0 && rect.top > -travel;
    stage.classList.toggle('is-active', active);
  };

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility, { passive: true });
  window.addEventListener('orientationchange', updateVisibility, { passive: true });
  updateVisibility();
})();
