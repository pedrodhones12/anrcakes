document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const update = () => {
    if (nav) nav.style.boxShadow = window.scrollY > 20 ? "0 8px 30px rgba(61,32,20,.08)" : "none";
  };
  update();
  window.addEventListener("scroll", update, {passive:true});
});

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (dropdownToggle) dropdownToggle.textContent = '☰ Evento 2026';

  const hero = document.querySelector('.hero');
  if (hero && !document.querySelector('.event-countdown')) {
    const style = document.createElement('style');
    style.textContent = `
      .event-countdown{position:relative;overflow:hidden;background:var(--brown);color:#fff;padding:72px 22px}
      .event-countdown:before,.event-countdown:after{content:"";position:absolute;border:1px solid rgba(255,255,255,.09);border-radius:50%;pointer-events:none}
      .event-countdown:before{width:430px;height:430px;left:-220px;top:-260px}
      .event-countdown:after{width:520px;height:520px;right:-300px;bottom:-360px}
      .countdown-inner{position:relative;z-index:1;max-width:1120px;margin:auto;text-align:center}
      .countdown-heading{margin-bottom:38px}
      .countdown-kicker{display:inline-block;font-size:10px;letter-spacing:.28em;font-weight:700;color:#e6c47e;margin-bottom:10px}
      .countdown-heading h2{font-family:"Cormorant Garamond",serif;font-size:clamp(38px,5vw,58px);line-height:1;margin:0 0 10px;font-weight:600}
      .countdown-heading h2 em{color:#f3c0bc;font-style:normal}
      .countdown-heading p{margin:0;color:#d9c7bd;font-size:14px}
      .countdown-grid{display:flex;align-items:center;justify-content:center;gap:14px}
      .countdown-unit{min-width:150px;padding:25px 18px 22px;background:rgba(255,250,244,.07);border:1px solid rgba(255,255,255,.15);border-radius:16px;box-shadow:0 15px 35px rgba(0,0,0,.10);backdrop-filter:blur(8px)}
      .countdown-unit strong{display:block;font-family:"Cormorant Garamond",serif;font-size:clamp(50px,6vw,76px);font-weight:600;line-height:.9;color:#f3d99f;letter-spacing:.02em;font-variant-numeric:tabular-nums}
      .countdown-unit span{display:block;margin-top:12px;font-size:9px;letter-spacing:.22em;color:#f0e3dc;font-weight:700}
      .countdown-separator{font-family:"Cormorant Garamond",serif;font-size:48px;color:#c69a42;margin-top:-18px;opacity:.8}
      .countdown-footer{display:flex;justify-content:center;align-items:center;gap:15px;margin-top:28px;font-size:10px;letter-spacing:.18em;color:#eadbd3;font-weight:700}
      .countdown-footer i{width:4px;height:4px;border-radius:50%;background:#c69a42;display:block}
      @media(max-width:720px){
        .event-countdown{padding:55px 18px}
        .countdown-heading{margin-bottom:28px}
        .countdown-grid{gap:5px}
        .countdown-unit{min-width:0;flex:1;padding:18px 5px}
        .countdown-unit strong{font-size:42px}
        .countdown-unit span{font-size:7px;letter-spacing:.12em;margin-top:9px}
        .countdown-separator{font-size:28px}
        .countdown-footer{font-size:8px;letter-spacing:.12em;gap:9px}
      }
      @media(max-width:390px){.countdown-unit strong{font-size:34px}.countdown-separator{font-size:22px}.countdown-footer{flex-direction:column;gap:5px}.countdown-footer i{display:none}}
    `;
    document.head.appendChild(style);

    const countdown = document.createElement('section');
    countdown.className = 'event-countdown';
    countdown.setAttribute('aria-label', 'Contagem regressiva para o Ane Cakes Fair 2026');
    countdown.innerHTML = `
      <div class="countdown-inner">
        <div class="countdown-heading">
          <span class="countdown-kicker">CONTAGEM REGRESSIVA</span>
          <h2>O grande dia está <em>chegando</em></h2>
          <p>Prepare-se para a 5ª edição da Ane Cakes Fair.</p>
        </div>
        <div class="countdown-grid" role="timer" aria-live="polite">
          <div class="countdown-unit"><strong id="count-days">00</strong><span>DIAS</span></div>
          <div class="countdown-separator">:</div>
          <div class="countdown-unit"><strong id="count-hours">00</strong><span>HORAS</span></div>
          <div class="countdown-separator">:</div>
          <div class="countdown-unit"><strong id="count-minutes">00</strong><span>MINUTOS</span></div>
          <div class="countdown-separator">:</div>
          <div class="countdown-unit"><strong id="count-seconds">00</strong><span>SEGUNDOS</span></div>
        </div>
        <div class="countdown-footer"><span>30 NOVEMBRO 2026</span><i></i><span>ILHÉUS · BAHIA</span></div>
      </div>`;
    hero.insertAdjacentElement('afterend', countdown);

    const eventDate = new Date('2026-11-30T00:00:00-03:00').getTime();
    const days = document.getElementById('count-days');
    const hours = document.getElementById('count-hours');
    const minutes = document.getElementById('count-minutes');
    const seconds = document.getElementById('count-seconds');
    const updateCountdown = () => {
      const remaining = eventDate - Date.now();
      if (remaining <= 0) { days.textContent = hours.textContent = minutes.textContent = seconds.textContent = '00'; return; }
      days.textContent = String(Math.floor(remaining / 86400000)).padStart(2, '0');
      hours.textContent = String(Math.floor((remaining / 3600000) % 24)).padStart(2, '0');
      minutes.textContent = String(Math.floor((remaining / 60000) % 60)).padStart(2, '0');
      seconds.textContent = String(Math.floor((remaining / 1000) % 60)).padStart(2, '0');
    };
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', (event) => { event.stopPropagation(); const isOpen = dropdown.classList.toggle('open'); dropdownToggle.setAttribute('aria-expanded', isOpen); });
    document.addEventListener('click', (event) => { if (!dropdown.contains(event.target)) { dropdown.classList.remove('open'); dropdownToggle.setAttribute('aria-expanded', 'false'); } });
  }
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => { const isOpen = mainNav.classList.toggle('open'); mobileToggle.setAttribute('aria-expanded', isOpen); mobileToggle.textContent = isOpen ? '×' : '☰'; });
  }
});