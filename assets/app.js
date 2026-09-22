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
  var fmtDate = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });
  function tick() {
    var now = new Date();
    if (clock) { clock.textContent = fmtTime.format(now); clock.dateTime = now.toISOString(); }
    if (today && !today.dataset.set) { today.textContent = "Edição de " + fmtDate.format(now); today.dateTime = now.toISOString().slice(0, 10); today.dataset.set = "1"; }
  }
  tick();
  setInterval(tick, 15000);

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

  /* ── índice lateral segue a seção visível ── */
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-index]"));
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
        if (d.open) {
          var h = body.offsetHeight;
          running = body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 260, easing: "cubic-bezier(0.2,0.7,0.2,1)" });
          running.onfinish = function () { d.open = false; body.style.height = ""; running = null; };
        } else {
          d.open = true;
          var target = body.offsetHeight;
          running = body.animate([{ height: "0px", opacity: 0 }, { height: target + "px", opacity: 1 }], { duration: 320, easing: "cubic-bezier(0.2,0.7,0.2,1)" });
          running.onfinish = function () { body.style.height = ""; running = null; };
        }
      });
    });
  }
})();
