/* ──────────────────────────────────────────────────────────────
   Shared chrome + helpers for hub / submit / vote / board.
   Injects the unified top nav, persists EN/TH across pages, and
   exposes window.KX { toast, bi, esc, pops, onLang }.
   Load order: config.js → db.js → common.js.
   ────────────────────────────────────────────────────────────── */
(function () {
  var saved = localStorage.getItem("kmitl:lang") || "en";
  document.body.dataset.lang = saved;
  var page = document.body.dataset.page || "";

  var NAV = [
    { id: "home",   href: "index.html",  en: "Home",     th: "หน้าหลัก" },
    { id: "learn",  href: "learn.html",  en: "Learn",    th: "เรียน" },
    { id: "lab",    href: "lab.html",    en: "Idea Lab", th: "แล็บไอเดีย" },
    { id: "submit", href: "submit.html", en: "Submit",   th: "ส่งงาน" },
    { id: "vote",   href: "vote.html",   en: "Vote",     th: "โหวต" },
    { id: "board",  href: "board.html",  en: "Board",    th: "บอร์ด" }
  ];

  var mode = (window.DB && window.DB.mode) || "local";
  var live = mode.indexOf("live") === 0;

  var nav = NAV.map(function (n) {
    return '<a href="' + n.href + '"' + (n.id === page ? ' class="on"' : "") +
      '><span class="bi inl"><span class="en">' + n.en + '</span><span class="th">' + n.th + "</span></span></a>";
  }).join("");

  var header = document.createElement("header");
  header.className = "xtop";
  header.innerHTML =
    '<a class="brand" href="index.html"><span class="star">✶</span> KMITL <span class="who">· bootcamp</span></a>' +
    '<nav class="xnav">' + nav + "</nav>" +
    '<div class="spacer"></div>' +
    '<span class="modepill ' + (live ? "live" : "") + '" title="' + mode + '"><span class="dot"></span>' +
      (live ? "LIVE" : "LOCAL") + "</span>" +
    '<div class="lang-toggle">' +
      '<button class="lt' + (saved === "en" ? " active" : "") + '" data-lang="en">EN</button>' +
      '<button class="lt' + (saved === "th" ? " active" : "") + '" data-lang="th"><span class="thai">ไทย</span></button>' +
    "</div>";
  document.body.insertBefore(header, document.body.firstChild);

  var lts = [].slice.call(header.querySelectorAll(".lt"));
  lts.forEach(function (b) {
    b.addEventListener("click", function () {
      var l = b.dataset.lang;
      document.body.dataset.lang = l;
      localStorage.setItem("kmitl:lang", l);
      lts.forEach(function (x) { x.classList.toggle("active", x === b); });
      document.dispatchEvent(new CustomEvent("langchange", { detail: l }));
    });
  });

  function esc(s) { return (s || "").replace(/[&<>"'`]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" })[c]; }); }
  function bi(en, th) { return '<span class="bi inl"><span class="en">' + en + '</span><span class="th">' + th + "</span></span>"; }
  var TH = function () { return document.body.dataset.lang === "th"; };

  var toastEl = null, toastT = null;
  function toast(msg, kind) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.style.borderColor = kind === "bad" ? "var(--rose)" : kind === "good" ? "var(--green)" : "var(--line2)";
    toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }

  function pops(root) {
    var els = [].slice.call((root || document).querySelectorAll(".pop"));
    els.forEach(function (el, i) { el.style.transitionDelay = (i * 0.05) + "s"; setTimeout(function () { el.classList.add("in"); }, 30); });
  }
  function onLang(fn) { document.addEventListener("langchange", function (e) { fn(e.detail); }); }

  window.KX = { esc: esc, bi: bi, TH: TH, toast: toast, pops: pops, onLang: onLang };
  document.addEventListener("DOMContentLoaded", function () { pops(); });
})();
