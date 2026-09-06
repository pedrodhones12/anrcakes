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

  // Cronômetro profissional da página inicial
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