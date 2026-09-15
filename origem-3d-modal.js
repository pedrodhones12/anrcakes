// Modal da jornada 3D — Ane Cakes Fair
// Carrega Three.js do CDN e abre uma experiência 3D imersiva das 8 etapas do cacau.
(function () {
  "use strict";

  var STAGES = [
    { name: "Fruto", desc: "Tudo começa no fruto. O cacau nasce no território e carrega a primeira parte dessa história.", color: 0xc83a45 },
    { name: "Produtor", desc: "A terra encontra quem cultiva, colhe e transforma cuidado em matéria-prima.", color: 0x8b6f47 },
    { name: "Processo", desc: "Fermentar, secar e selecionar: cada etapa acrescenta valor ao ingrediente.", color: 0xb8860b },
    { name: "Indústria", desc: "Tecnologia e conhecimento transformam a amêndoa em novos produtos e possibilidades.", color: 0x6c7a89 },
    { name: "Chocolate", desc: "O cacau ganha outra forma: textura, aroma, sabor e identidade.", color: 0x4d2d1e },
    { name: "Confeitaria", desc: "Chefs e confeiteiros transformam o chocolate em criação, técnica e desejo.", color: 0xd4a574 },
    { name: "Experiência", desc: "A criação encontra pessoas: provar, aprender, conversar e levar uma memória.", color: 0xc69a42 },
    { name: "Território", desc: "A experiência aponta de volta para a origem: conhecer o lugar onde tudo começou.", color: 0x2d5a3d }
  ];

  var TTS_URL = "https://ane-story-engine.base44.app/functions/tts";
  var THREE_URL = "https://unpkg.com/three@0.160.0/build/three.min.js";

  function loadThree() {
    return new Promise(function (resolve, reject) {
      if (window.THREE) return resolve(window.THREE);
      var s = document.createElement("script");
      s.src = THREE_URL;
      s.onload = function () { resolve(window.THREE); };
      s.onerror = function () { reject(new Error("Falha ao carregar Three.js")); };
      document.head.appendChild(s);
    });
  }

  // --- Inject the trigger button into the journey intro ---
  function injectButton() {
    var intro = document.querySelector(".cacao-journey-intro");
    if (!intro) return;
    if (intro.querySelector(".jornada-3d-btn")) return;
    var btn = document.createElement("button");
    btn.className = "jornada-3d-btn";
    btn.type = "button";
    btn.innerHTML = '<span class="j3d-pulse"></span>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>' +
      "Viver a jornada em 3D";
    btn.addEventListener("click", openModal);
    intro.appendChild(btn);
  }

  // --- Modal state ---
  var modal = null, renderer, scene, camera, orb, particles, ring;
  var currentStage = 0, targetColor, displayColor;
  var autoRotate = true, dragRotX = 0, dragRotY = 0;
  var rafId = null, clock;
  var audio = null, narrating = false, narrateBtn = null;

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "jornada-3d-modal";
    modal.innerHTML =
      '<div class="jornada-3d-canvas-wrap"><div class="j3d-loader"><div class="j3d-spinner"></div>Carregando experiência 3D</div></div>' +
      '<div class="j3d-ui">' +
        '<div class="j3d-top">' +
          '<div class="j3d-stage-info">' +
            '<div class="j3d-kicker">Da origem ao destino</div>' +
            '<h2 class="j3d-stage-title"></h2>' +
            '<p class="j3d-stage-desc"></p>' +
          '</div>' +
          '<button class="j3d-close" type="button" aria-label="Fechar">×</button>' +
        '</div>' +
        '<div class="j3d-bottom">' +
          '<div class="j3d-progress-row"></div>' +
          '<div class="j3d-controls">' +
            '<button class="j3d-nav-btn j3d-prev" type="button" aria-label="Etapa anterior">‹</button>' +
            '<span class="j3d-stage-count">01 / 08</span>' +
            '<button class="j3d-nav-btn j3d-next" type="button" aria-label="Próxima etapa">›</button>' +
            '<button class="j3d-narrate" type="button">▶ Ouvir esta etapa</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    // Progress dots
    var row = modal.querySelector(".j3d-progress-row");
    for (var i = 0; i < 8; i++) {
      var dot = document.createElement("span");
      dot.className = "j3d-dot" + (i === 0 ? " active" : "");
      dot.dataset.idx = i;
      dot.addEventListener("click", function () { goToStage(parseInt(this.dataset.idx, 10)); });
      row.appendChild(dot);
    }

    modal.querySelector(".j3d-close").addEventListener("click", closeModal);
    modal.querySelector(".j3d-prev").addEventListener("click", function () { goToStage(currentStage - 1); });
    modal.querySelector(".j3d-next").addEventListener("click", function () { goToStage(currentStage + 1); });
    narrateBtn = modal.querySelector(".j3d-narrate");
    narrateBtn.addEventListener("click", toggleNarration);

    // Keyboard
    document.addEventListener("keydown", onKey);
    // Touch swipe
    var touchX = null;
    modal.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    modal.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = touchX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) goToStage(currentStage + (dx > 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });
  }

  function onKey(e) {
    if (!modal || !modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    else if (e.key === "ArrowRight" || e.key === "ArrowDown") goToStage(currentStage + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") goToStage(currentStage - 1);
  }

  function openModal() {
    if (!modal) buildModal();
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (!renderer) {
      var loader = modal.querySelector(".j3d-loader");
      loadThree().then(function (THREE) {
        initScene(THREE);
        if (loader) loader.classList.add("hidden");
        goToStage(0, true);
        animate();
      }).catch(function () {
        if (loader) loader.innerHTML = "Não foi possível carregar o 3D. Tente novamente.";
      });
    } else {
      goToStage(currentStage, true);
      animate();
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    stopNarration();
  }

  function initScene(THREE) {
    var wrap = modal.querySelector(".jornada-3d-canvas-wrap");
    var w = wrap.clientWidth, h = wrap.clientHeight;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    wrap.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0604, 6, 18);

    camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 6);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    var key = new THREE.PointLight(0xc69a42, 2.2, 20);
    key.position.set(3, 2, 4);
    scene.add(key);
    var rim = new THREE.PointLight(0xc83a45, 1.5, 20);
    rim.position.set(-4, -2, 3);
    scene.add(rim);

    // Central faceted orb (cacao-inspired)
    var geo = new THREE.IcosahedronGeometry(1.5, 1);
    var mat = new THREE.MeshStandardMaterial({
      color: STAGES[0].color, flatShading: true, roughness: 0.45, metalness: 0.3,
      emissive: STAGES[0].color, emissiveIntensity: 0.18
    });
    orb = new THREE.Mesh(geo, mat);
    scene.add(orb);

    // Wireframe overlay for a "narrative mesh" feel
    var wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xc69a42, wireframe: true, transparent: true, opacity: 0.18 }));
    orb.add(wire);

    // Orbiting particle field
    var pCount = 600;
    var pGeo = new THREE.BufferGeometry();
    var pos = new Float32Array(pCount * 3);
    for (var i = 0; i < pCount; i++) {
      var r = 2.5 + Math.random() * 3.5;
      var t = Math.random() * Math.PI * 2;
      var p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(p);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var pMat = new THREE.PointsMaterial({ color: 0xc69a42, size: 0.05, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Orbiting ring
    var ringGeo = new THREE.TorusGeometry(2.6, 0.02, 8, 80);
    ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xc69a42, transparent: true, opacity: 0.35 }));
    ring.rotation.x = Math.PI / 2.4;
    scene.add(ring);

    displayColor = new THREE.Color(STAGES[0].color);
    targetColor = new THREE.Color(STAGES[0].color);
    clock = new THREE.Clock();

    // Drag to rotate
    var dragging = false, lastX = 0, lastY = 0;
    var cv = renderer.domElement;
    cv.style.cursor = "grab";
    cv.addEventListener("pointerdown", function (e) { dragging = true; lastX = e.clientX; lastY = e.clientY; cv.style.cursor = "grabbing"; autoRotate = false; });
    window.addEventListener("pointerup", function () { dragging = false; cv.style.cursor = "grab"; });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      dragRotY += (e.clientX - lastX) * 0.005;
      dragRotX += (e.clientY - lastY) * 0.005;
      lastX = e.clientX; lastY = e.clientY;
    });

    window.addEventListener("resize", onResize);
  }

  function onResize() {
    if (!renderer || !modal.classList.contains("open")) return;
    var wrap = modal.querySelector(".jornada-3d-canvas-wrap");
    var w = wrap.clientWidth, h = wrap.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function goToStage(idx, instant) {
    idx = Math.max(0, Math.min(7, idx));
    currentStage = idx;
    var s = STAGES[idx];
    // UI
    var title = modal.querySelector(".j3d-stage-title");
    var desc = modal.querySelector(".j3d-stage-desc");
    var kicker = modal.querySelector(".j3d-kicker");
    var count = modal.querySelector(".j3d-stage-count");
    title.textContent = s.name;
    desc.textContent = s.desc;
    count.textContent = String(idx + 1).padStart(2, "0") + " / 08";
    // Re-trigger fade animation
    [kicker, title, desc].forEach(function (el) { el.style.animation = "none"; void el.offsetWidth; el.style.animation = ""; });
    // Dots
    var dots = modal.querySelectorAll(".j3d-dot");
    dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
    // Nav buttons
    modal.querySelector(".j3d-prev").disabled = idx === 0;
    modal.querySelector(".j3d-next").disabled = idx === 7;
    // Color transition
    targetColor = new THREE.Color(s.color);
    if (instant && orb) { displayColor.copy(targetColor); orb.material.color.copy(targetColor); orb.material.emissive.copy(targetColor); }
    // Stop narration when changing stage
    stopNarration();
    // Notify the page chat
    window.dispatchEvent(new CustomEvent("ane-stage-change", { detail: { stage: idx } }));
  }

  function animate() {
    rafId = requestAnimationFrame(animate);
    var dt = clock.getDelta();
    var t = clock.elapsedTime;
    // Color lerp
    displayColor.lerp(targetColor, 0.06);
    if (orb) {
      orb.material.color.copy(displayColor);
      orb.material.emissive.copy(displayColor);
      if (autoRotate) { orb.rotation.y += dt * 0.3; orb.rotation.x += dt * 0.12; }
      orb.rotation.y += dragRotY * 0.08; orb.rotation.x += dragRotX * 0.08;
      dragRotY *= 0.92; dragRotX *= 0.92;
      var pulse = 1 + Math.sin(t * 1.5) * 0.04;
      orb.scale.setScalar(pulse);
    }
    if (particles) { particles.rotation.y += dt * 0.05; particles.rotation.x += dt * 0.02; }
    if (ring) { ring.rotation.z += dt * 0.4; }
    renderer.render(scene, camera);
  }

  // --- TTS narration per stage ---
  function toggleNarration() {
    if (narrating) { stopNarration(); return; }
    var s = STAGES[currentStage];
    var text = s.name + ". " + s.desc;
    narrateBtn.classList.add("playing");
    narrateBtn.innerHTML = "⏳ Gerando…";
    narrating = true;
    fetch(TTS_URL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, language_code: "pt", voice: "honey" })
    }).then(function (r) { return r.json(); }).then(function (data) {
      if (!data.success || !data.url) throw new Error("no audio");
      audio = new Audio(data.url);
      narrateBtn.innerHTML = "■ Parar";
      audio.play();
      audio.onended = function () { stopNarration(); };
    }).catch(function () {
      // Browser fallback
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text); u.lang = "pt-BR"; u.rate = 0.92;
        narrateBtn.innerHTML = "■ Parar";
        u.onend = function () { stopNarration(); };
        speechSynthesis.speak(u);
      } else { stopNarration(); }
    });
  }
  function stopNarration() {
    narrating = false;
    if (audio) { audio.pause(); audio.currentTime = 0; audio = null; }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    if (narrateBtn) { narrateBtn.classList.remove("playing"); narrateBtn.innerHTML = "▶ Ouvir esta etapa"; }
  }

  // --- Init ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectButton);
  } else { injectButton(); }
  window.AneJornada3D = { open: openModal, close: closeModal, goToStage: goToStage };
})();
