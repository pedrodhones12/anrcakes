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

  // Remove somente o antigo depoimento da página inicial, mantendo todo o restante.
  const quoteStrip = document.querySelector('.quote-strip');
  if (quoteStrip) quoteStrip.remove();

  // Cronômetro profissional e responsivo da página inicial
  const hero = document.querySelector('.hero');
  if (hero && !document.querySelector('.event-countdown')) {
    const countdown = document.createElement('section');
    countdown.className = 'event-countdown';
    countdown.setAttribute('aria-label', 'Contagem regressiva para o Ane Cakes Fair 2026');
    countdown.innerHTML = `
      <div class="countdown-inner">
        <div class="countdown-heading">
          <span class="countdown-kicker">CONTAGEM REGRESSIVA</span>
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
      </div>
    `;

    // Estilos próprios do cronômetro para evitar que regras do mobile da página o quebrem.
    const style = document.createElement('style');
    style.textContent = `
      .event-countdown{display:block;width:100%;background:var(--brown);color:#fff;padding:34px 8vw;box-sizing:border-box}
      .countdown-inner{width:100%;max-width:1200px;margin:0 auto;text-align:center}
      .countdown-heading{margin:0 0 18px}
      .countdown-kicker{display:inline-block;color:#f3d99f;font-size:11px;font-weight:700;letter-spacing:.24em;text-transform:uppercase}
      .countdown-grid{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;}
      .countdown-unit{min-width:100px;display:flex;flex-direction:column;align-items:center;justify-content:center}
      .countdown-unit strong{font-family:"Cormorant Garamond",serif;font-size:54px;line-height:.9;color:#fff;font-weight:600;font-variant-numeric:tabular-nums}
      .countdown-unit span{margin-top:9px;font-size:9px;letter-spacing:.16em;color:#e8d7ca;font-weight:700}
      .countdown-separator{font-family:"Cormorant Garamond",serif;font-size:42px;color:#c69a42;line-height:1;margin-top:-12px}
      @media(max-width:620px){
        .event-countdown{padding:28px 14px}
        .countdown-heading{margin-bottom:16px}
        .countdown-kicker{font-size:9px;letter-spacing:.18em}
        .countdown-grid{gap:3px;flex-wrap:nowrap}
        .countdown-unit{min-width:0;flex:1 1 0}
        .countdown-unit strong{font-size:clamp(31px,9.5vw,43px)}
        .countdown-unit span{font-size:7px;letter-spacing:.08em;margin-top:8px;white-space:nowrap}
        .countdown-separator{font-size:27px;margin-top:-10px;flex:0 0 auto}
      }
      @media(max-width:360px){
        .event-countdown{padding-left:8px;padding-right:8px}
        .countdown-grid{gap:1px}
        .countdown-unit strong{font-size:29px}
        .countdown-unit span{font-size:6px;letter-spacing:.04em}
        .countdown-separator{font-size:23px}
      }
    `;
    document.head.appendChild(style);
    hero.insertAdjacentElement('afterend', countdown);

    const eventDate = new Date('2026-11-30T00:00:00-03:00').getTime();
    const days = document.getElementById('count-days');
    const hours = document.getElementById('count-hours');
    const minutes = document.getElementById('count-minutes');
    const seconds = document.getElementById('count-seconds');

    const updateCountdown = () => {
      const remaining = eventDate - Date.now();
      if (remaining <= 0) {
        days.textContent = hours.textContent = minutes.textContent = seconds.textContent = '00';
        return;
      }
      days.textContent = String(Math.floor(remaining / 86400000)).padStart(2, '0');
      hours.textContent = String(Math.floor((remaining / 3600000) % 24)).padStart(2, '0');
      minutes.textContent = String(Math.floor((remaining / 60000) % 60)).padStart(2, '0');
      seconds.textContent = String(Math.floor((remaining / 1000) % 60)).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.textContent = isOpen ? '×' : '☰';
    });
  }
});