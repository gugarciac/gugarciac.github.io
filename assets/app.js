/* Gustavo Garcia · portfólio
   Três comportamentos, nada mais: relógio de São Paulo, tema claro/escuro,
   índice lateral que acompanha a rolagem. A abertura dos projetos é o
   <details> nativo, com uma animação de altura por cima quando o navegador permite. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── relógio e data no fuso de São Paulo ── */
  var clock = document.getElementById("relogio");
  var today = document.getElementById("data-hoje");
  var fmtTime = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  var hello = document.getElementById("saudacao");
  var fmtHour = new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hourCycle: "h23", timeZone: "America/Sao_Paulo" });
  var fmtDate = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });
  function tick() {
    var now = new Date();
    if (clock) { clock.textContent = fmtTime.format(now); clock.dateTime = now.toISOString(); }
    if (today && !today.dataset.set) { today.textContent = fmtDate.format(now); today.dateTime = now.toISOString().slice(0, 10); today.dataset.set = "1"; }
    if (hello) {
      var h = Number(fmtHour.format(now));
      hello.textContent = h >= 5 && h < 12 ? "bom dia" : h >= 12 && h < 18 ? "boa tarde" : h >= 18 ? "boa noite" : "já passou da hora de dormir";
    }
  }
  tick();
  setInterval(tick, 15000);

  /* ── o marca-texto do título troca de cor a cada clique ── */
  var mark = document.querySelector(".hero h1 mark");
  if (mark) {
    var tints = ["var(--butter)", "var(--mint)", "#c9b8ff", "#ffb3a3"];
    var n = 0;
    mark.title = "clica";
    mark.addEventListener("click", function () {
      n = (n + 1) % tints.length;
      mark.style.setProperty("--hl", tints[n]);
    });
  }

  /* ── tema ── */
  var button = document.getElementById("tema");
  if (button) {
    button.addEventListener("click", function () {
      var dark = root.dataset.theme === "dark" || (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      var next = dark ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("tema", next); } catch (e) {}
    });
  }

  /* ── certificados: a seção só aparece quando houver itens ── */
  var certs = document.querySelectorAll("#certificados .cert");
  if (certs.length) {
    var sec = document.getElementById("certificados");
    var link = document.querySelector("[data-certs-link]");
    var meta = document.getElementById("certificados-meta");
    if (sec) sec.hidden = false;
    if (link) link.hidden = false;
    if (meta) meta.textContent = certs.length + (certs.length === 1 ? " certificado" : " certificados") + " · os mais recentes primeiro";
  }

  /* ── índice lateral segue a seção visível ── */
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-index]:not([hidden])"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) current = e.target.id; });
      links.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + current;
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ── abertura suave dos projetos ── */
  if (!reduceMotion && "animate" in Element.prototype) {
    document.querySelectorAll(".entry details").forEach(function (d) {
      var body = d.querySelector(".entry__body");
      var summary = d.querySelector("summary");
      if (!body || !summary) return;
      var running = null;
      summary.addEventListener("click", function (ev) {
        ev.preventDefault();
        if (running) running.cancel();
        body.style.overflow = "hidden";
        if (d.open) {
          var h = body.offsetHeight;
          running = body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 260, easing: "cubic-bezier(0.2,0.7,0.2,1)" });
          running.onfinish = function () { d.open = false; body.style.height = ""; body.style.overflow = ""; running = null; };
        } else {
          d.open = true;
          var target = body.offsetHeight;
          running = body.animate([{ height: "0px", opacity: 0 }, { height: target + "px", opacity: 1 }], { duration: 320, easing: "cubic-bezier(0.2,0.7,0.2,1)" });
          running.onfinish = function () { body.style.height = ""; body.style.overflow = ""; running = null; };
        }
      });
    });
  }
})();
