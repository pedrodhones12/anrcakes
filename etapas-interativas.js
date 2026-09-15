/* Etapas Interativas — Ane Cakes Fair
   Torna a lista de etapas navegável: chips no topo, painel único,
   barra de progresso e botões anterior/próxima. Sem JS, todas as
   etapas aparecem empilhadas (fallback acessível). */
(function () {
  "use strict";

  function init() {
    var list = document.querySelector(".etapas-list");
    var map = document.querySelector(".etapas-map");
    var bar = document.querySelector(".etapas-progress-bar span");
    var label = document.querySelector(".etapas-progress-label");
    var prevBtn = document.getElementById("stage-prev");
    var nextBtn = document.getElementById("stage-next");
    if (!list || !map || !list.children.length) return;

    var items = Array.prototype.slice.call(list.querySelectorAll(".stage-item"));
    var buttons = Array.prototype.slice.call(map.querySelectorAll("button"));
    var current = 0;

    function show(i) {
      if (!items.length) return;
      i = Math.max(0, Math.min(items.length - 1, i));
      current = i;
      items.forEach(function (item, idx) {
        item.classList.toggle("active", idx === i);
      });
      buttons.forEach(function (btn, idx) {
        btn.classList.toggle("active", idx === i);
        var color = btn.getAttribute("data-color") || "#c69a42";
        btn.style.background = idx === i ? color : "";
      });
      if (bar) {
        var color = items[i].getAttribute("data-color") || "#c69a42";
        bar.style.width = ((i + 1) / items.length) * 100 + "%";
        bar.style.background = color;
      }
      if (label) {
        label.textContent = "Etapa " + (i + 1) + " de " + items.length;
      }
      if (prevBtn) prevBtn.disabled = i === 0;
      if (nextBtn) nextBtn.disabled = i === items.length - 1;
    }

    buttons.forEach(function (btn, idx) {
      btn.addEventListener("click", function () { show(idx); });
    });
    if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });

    list.classList.add("interactive");
    show(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
