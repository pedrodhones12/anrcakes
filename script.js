document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const update = () => {
    nav.style.boxShadow = window.scrollY > 20 ? "0 8px 30px rgba(61,32,20,.08)" : "none";
  };
  update();
  window.addEventListener("scroll", update, {passive:true});
});

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  // Substitui a seta pelo ícone padrão de menu, mantendo o dropdown funcionando.
  if (dropdownToggle) {
    dropdownToggle.textContent = '☰ Evento 2026';
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