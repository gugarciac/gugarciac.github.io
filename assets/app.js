/* Gustavo Garcia · portfólio
   Relógio de São Paulo, navegação que acompanha a seção visível, abertura
   animada dos projetos e links que abrem um projeto direto na lista. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── relógio no fuso de São Paulo ── */
  var clock = document.getElementById("relogio");
  var fmtTime = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  function tick() {
    if (!clock) return;
    var now = new Date();
    clock.textContent = fmtTime.format(now);
    clock.dateTime = now.toISOString();
  }
  tick();
  setInterval(tick, 15000);

  /* ── certificados: a seção só aparece quando houver itens ── */
  var certs = document.querySelectorAll("#certificados .cert");
  if (certs.length) {
    var sec = document.getElementById("certificados");
    var link = document.querySelector("[data-certs-link]");
    var meta = document.getElementById("certificados-meta");
    if (sec) sec.hidden = false;
    if (link) link.hidden = false;
    if (meta) meta.textContent = certs.length + (certs.length === 1 ? " certificado" : " certificados") + ", do mais recente ao mais antigo.";
  }

  /* ── navegação global marca a seção visível ── */
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-index]:not([hidden])"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) current = e.target.id; });
      links.forEach(function (a) {
        if (a.getAttribute("href") === "#" + current) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ── abertura suave dos projetos ── */
  function animateOpen(d, open) {
    var body = d.querySelector(".entry__body");
    if (!body || reduceMotion || !("animate" in Element.prototype)) { d.open = open; return; }
    if (d._anim) d._anim.cancel();
    body.style.overflow = "hidden";
    if (!open) {
      var h = body.offsetHeight;
      d._anim = body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 300, easing: "cubic-bezier(0.25,0.1,0.25,1)" });
      d._anim.onfinish = function () { d.open = false; body.style.overflow = ""; d._anim = null; };
    } else {
      d.open = true;
      var target = body.offsetHeight;
      d._anim = body.animate([{ height: "0px", opacity: 0 }, { height: target + "px", opacity: 1 }], { duration: 420, easing: "cubic-bezier(0.16,1,0.3,1)" });
      d._anim.onfinish = function () { body.style.overflow = ""; d._anim = null; };
    }
  }
  document.querySelectorAll(".entry details").forEach(function (d) {
    var summary = d.querySelector("summary");
    if (!summary) return;
    summary.addEventListener("click", function (ev) {
      ev.preventDefault();
      animateOpen(d, !d.open);
    });
  });

  /* ── links que abrem um projeto específico ── */
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("[data-open]");
    if (!a) return;
    var art = document.getElementById(a.getAttribute("data-open"));
    var d = art && art.querySelector("details");
    if (!d) return;
    ev.preventDefault();
    if (!d.open) animateOpen(d, true);
    art.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    try { history.replaceState(null, "", "#" + art.id); } catch (e) {}
  });

  /* ── carrossel de destaques ── */
  var scroller = document.querySelector(".hl");
  if (scroller) {
    var cards = Array.prototype.slice.call(scroller.querySelectorAll(".hl__card"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hl__dot"));
    var navs = document.querySelectorAll(".hl__nav");
    var step = function () { return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : scroller.clientWidth; };
    var index = function () { return Math.round(scroller.scrollLeft / step()); };
    var go = function (i) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      scroller.scrollTo({ left: i * step(), behavior: reduceMotion ? "auto" : "smooth" });
    };
    var sync = function () {
      var atStart = scroller.scrollLeft <= 4;
      var atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4;
      var i = atEnd ? cards.length - 1 : index();
      dots.forEach(function (d, k) { if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
      navs.forEach(function (b) {
        var off = Number(b.getAttribute("data-dir")) < 0 ? atStart : atEnd;
        b.setAttribute("aria-disabled", off ? "true" : "false");
      });
    };
    navs.forEach(function (b) { b.addEventListener("click", function () { go(index() + Number(b.getAttribute("data-dir"))); }); });
    dots.forEach(function (d, k) { d.addEventListener("click", function () { go(k); }); });
    var raf = 0;
    scroller.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  }

  /* ── entrada das seções: reserva para navegadores sem animação ligada à rolagem ── */
  var scrollDriven = window.CSS && CSS.supports && CSS.supports("animation-timeline: view()");
  if (!reduceMotion && !scrollDriven && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".section__head, .hl, .hl__controls, .reveal, .entry, .timeline li, .sheet > div, .contact .wrap > *, .cert");
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); seen.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { el.setAttribute("data-reveal", ""); seen.observe(el); });
    document.documentElement.classList.add("io-reveal");
  }

  /* ── endereço com #projeto abre o projeto ── */
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    var det = target && target.querySelector && target.querySelector(".entry details");
    if (!det && target && target.matches && target.matches("details")) det = target;
    if (target && target.classList.contains("entry")) det = target.querySelector("details");
    if (det) det.open = true;
  }
})();
