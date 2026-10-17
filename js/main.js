(function () {
  const E = window.EVENT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────── Bind config values into the page ───────── */
  $$("[data-bind]").forEach(el => { el.textContent = E[el.dataset.bind] ?? ""; });
  $$('[data-bind-href="tel"]').forEach(el => { el.href = "tel:" + E.phone.replace(/\s/g, ""); });

  const mc = E.musicFile && E.musicCredit;
  if (mc) {
    const credit = $("#musicCredit");
    credit.innerHTML = `Music: <a href="${mc.url}" target="_blank" rel="noopener">“${mc.title}”</a> by ${mc.author}, ` +
      `<a href="${mc.licenseUrl}" target="_blank" rel="noopener">${mc.license}</a>, via ${mc.source}${mc.note ? ` (${mc.note})` : ""}.`;
    credit.hidden = false;
  }

  /* ───────── Event timing (IST) ───────── */
  const startISO = `${E.date}T${E.startTime || "00:00"}:00+05:30`;
  const start = new Date(startISO);
  const endOfDay = new Date(`${E.date}T23:59:59+05:30`);

  /* ───────── Gate ───────── */
  const gate = $("#gate");
  const musicBtn = $("#musicBtn");
  function openGate(withMusic) {
    gate.classList.add("is-open");
    document.body.classList.remove("is-locked");
    musicBtn.hidden = false;
    if (withMusic) { Music.play(); syncMusicBtn(); }
    Petals.burst();
    setTimeout(() => {
      gate.classList.add("is-gone");
      $$(".hero .reveal").forEach((el, i) => setTimeout(() => el.classList.add("is-in"), i * 140));
    }, reduceMotion ? 0 : 1300);
  }
  $("#openBtn").addEventListener("click", () => openGate(true));
  $("#openSilentBtn").addEventListener("click", () => openGate(false));
  // ?nogate skips the opening screen (handy for previews / screenshots)
  if (new URLSearchParams(location.search).has("nogate")) addEventListener("load", () => openGate(false));

  /* ───────── Marigold garland (swags across the top) ───────── */
  (function garland() {
    const host = $(".garland"), ns = "http://www.w3.org/2000/svg";
    function flower(x, y, r, rot) {
      const petals = Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + rot;
        return `<circle cx="${(x + Math.cos(a) * r * .62).toFixed(1)}" cy="${(y + Math.sin(a) * r * .62).toFixed(1)}" r="${(r * .45).toFixed(1)}" fill="${i % 2 ? "#FFB52E" : "#F7A21B"}"/>`;
      }).join("");
      return `<g>${petals}<circle cx="${x}" cy="${y}" r="${r * .55}" fill="#FFC94A"/><circle cx="${x}" cy="${y}" r="${r * .22}" fill="#E07B0A"/></g>`;
    }
    function leaf(x, y, a) {
      return `<ellipse cx="${x}" cy="${y}" rx="7" ry="3" fill="#3F8F4E" transform="rotate(${a} ${x} ${y})"/>`;
    }
    function build() {
      const W = host.clientWidth, H = 96, swag = W < 640 ? 200 : 300;
      const n = Math.max(2, Math.round(W / swag)), sw = W / n;
      let s = "";
      for (let k = 0; k < n; k++) {
        const x0 = k * sw, x1 = x0 + sw, depth = 34;
        const count = Math.round(sw / 15);
        for (let i = 0; i <= count; i++) {
          const t = i / count;
          const x = x0 + (x1 - x0) * t, y = 8 + 4 * depth * t * (1 - t);
          if (i % 3 === 1) s += leaf(x, y + 7, 20 + 40 * (t - .5));
          s += flower(x, y, 8.5, i * .7);
        }
        // hanging tassel at each joint
        for (let j = 1; j <= 3; j++) s += flower(x1, 8 + j * 15, 7.5 - j * .8, j);
      }
      host.innerHTML = `<svg xmlns="${ns}" width="100%" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${s}</svg>`;
    }
    build();
    let rT; addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(build, 150); });
  })();

  function syncMusicBtn() {
    const on = Music.playing;
    musicBtn.setAttribute("aria-pressed", String(on));
    musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
    $(".music__label", musicBtn).textContent = on ? "Playing" : "Music";
  }
  musicBtn.addEventListener("click", () => { Music.toggle(); syncMusicBtn(); });
  // Track missing or unplayable: hide the button rather than show a dead control
  addEventListener("music-unavailable", () => { syncMusicBtn(); musicBtn.hidden = true; });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && Music.playing) { Music.pause(); syncMusicBtn(); musicBtn.dataset.resume = "1"; }
    else if (!document.hidden && musicBtn.dataset.resume) { delete musicBtn.dataset.resume; Music.play(); syncMusicBtn(); }
  });

  /* ───────── Mandala behind the logo ───────── */
  (function drawMandala() {
    const svg = $("#mandala"), ns = "http://www.w3.org/2000/svg";
    const add = (tag, attrs) => { const n = document.createElementNS(ns, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); svg.appendChild(n); return n; };
    const rings = [
      { r: 92, petals: 32, len: 9, w: 4.2, color: "#F6A623" },
      { r: 78, petals: 24, len: 12, w: 5.5, color: "#D2475B" },
      { r: 62, petals: 16, len: 14, w: 7, color: "#F6A623" }
    ];
    rings.forEach(({ r, petals, len, w, color }) => {
      add("circle", { cx: 0, cy: 0, r: r + len / 2 + 2, fill: "none", stroke: color, "stroke-width": .4, opacity: .5 });
      for (let i = 0; i < petals; i++) {
        const a = (i / petals) * 360;
        add("ellipse", { cx: 0, cy: -r, rx: w / 2, ry: len / 2, fill: "none", stroke: color, "stroke-width": .6, opacity: .55, transform: `rotate(${a})` });
      }
    });
    for (let i = 0; i < 48; i++) add("circle", { cx: 0, cy: -99, r: .9, fill: "#D2475B", opacity: .4, transform: `rotate(${i * 7.5})` });
  })();

  /* ───────── Countdown ───────── */
  const cd = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  const cdMsg = $("#countdownMsg"), cdWrap = $("#countdown");
  const pad = n => String(n).padStart(2, "0");
  function tick() {
    const now = Date.now();
    let diff = start - now;
    if (diff <= 0) {
      cdWrap.hidden = true; cdMsg.hidden = false;
      cdMsg.textContent = now <= endOfDay ? "Today is the auspicious day ✦" : "Thank you for blessing our new beginning ✦";
      return;
    }
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5);  diff -= h * 36e5;
    const m = Math.floor(diff / 6e4);   diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    cd.d.textContent = pad(d); cd.h.textContent = pad(h); cd.m.textContent = pad(m); cd.s.textContent = pad(s);
  }
  tick(); setInterval(tick, 1000);

  /* ───────── Programme ───────── */
  $("#timeline").innerHTML = E.programme.map((p, i) => `
    <li class="reveal">
      <span class="tl__dot">${i + 1}</span>
      ${p.time ? `<span class="tl__time">${p.time}</span>` : ""}
      <h4>${p.title}</h4>
      <p>${p.text}</p>
    </li>`).join("");

  /* ───────── Directions & calendar ───────── */
  $("#mapsBtn").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(E.mapsQuery);

  const title = `${E.company} — Inauguration & Pooja`;
  const details = `You are cordially invited to the Inauguration & Pooja Ceremony of the new ${E.company} office.\n${E.website}`;
  const ymd = E.date.replace(/-/g, "");
  const nextDay = new Date(Date.UTC(+E.date.slice(0, 4), +E.date.slice(5, 7) - 1, +E.date.slice(8, 10) + 1))
    .toISOString().slice(0, 10).replace(/-/g, "");
  const utcStamp = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  let calDates, icsDates;
  if (E.startTime) {
    const end = E.endTime ? new Date(`${E.date}T${E.endTime}:00+05:30`) : new Date(start.getTime() + 3 * 36e5);
    calDates = `${utcStamp(start)}/${utcStamp(end)}`;
    icsDates = `DTSTART:${utcStamp(start)}\r\nDTEND:${utcStamp(end)}`;
  } else {
    calDates = `${ymd}/${nextDay}`;
    icsDates = `DTSTART;VALUE=DATE:${ymd}\r\nDTEND;VALUE=DATE:${nextDay}`;
  }
  $("#gcalBtn").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(title) +
    "&dates=" + calDates +
    "&details=" + encodeURIComponent(details) +
    "&location=" + encodeURIComponent(E.venue);

  $("#icsBtn").addEventListener("click", () => {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DMA Technologies//Inauguration//EN", "BEGIN:VEVENT",
      `UID:dma-inauguration-${ymd}@dmatech.in`, `DTSTAMP:${utcStamp(new Date())}`, icsDates,
      `SUMMARY:${title}`, `DESCRIPTION:${details.replace(/\n/g, "\\n")}`, `LOCATION:${E.venue.replace(/,/g, "\\,")}`,
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "DMA_Inauguration.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  /* ───────── Lightbox ───────── */
  const lb = $("#lightbox");
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; };
  $("#cardBtn").addEventListener("click", () => { lb.hidden = false; document.body.style.overflow = "hidden"; $("#lightboxClose").focus(); });
  $("#lightboxClose").addEventListener("click", closeLb);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) closeLb(); });

  /* ───────── Reveal on scroll ───────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting && !en.target.closest(".hero")) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold: .15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el, i) => {
    if (!el.closest(".hero")) el.style.transitionDelay = `${(i % 4) * 90}ms`;
    io.observe(el);
  });
})();

/* ═════════ Falling petals (marigold + lotus) ═════════ */
window.Petals = (function () {
  const cvs = document.getElementById("petals");
  const ctx = cvs.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COLORS = ["#F6A623", "#FFB833", "#E88A0C", "#F07C8E", "#F4A3B1", "#D2475B", "#FFD36B"];
  let W, H, dpr, petals = [], running = false;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cvs.width = innerWidth * dpr; H = cvs.height = innerHeight * dpr;
  }
  addEventListener("resize", resize); resize();

  function make(burst) {
    const s = (Math.random() * 7 + 6) * dpr;
    return {
      x: burst ? W / 2 + (Math.random() - .5) * W * .3 : Math.random() * W,
      y: burst ? H * .45 : -20 * dpr,
      vx: burst ? (Math.random() - .5) * 14 * dpr : (Math.random() - .5) * .6 * dpr,
      vy: burst ? (-Math.random() * 12 - 4) * dpr : (Math.random() * .8 + .6) * dpr,
      s, rot: Math.random() * Math.PI * 2, vr: (Math.random() - .5) * .08,
      flip: Math.random() * Math.PI * 2, vf: Math.random() * .05 + .02,
      sway: Math.random() * Math.PI * 2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      burst
    };
  }

  function draw(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, Math.abs(Math.cos(p.flip)) * .8 + .2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = .85;
    ctx.beginPath();
    ctx.moveTo(0, -p.s);
    ctx.bezierCurveTo(p.s * .8, -p.s * .6, p.s * .6, p.s * .7, 0, p.s);
    ctx.bezierCurveTo(-p.s * .6, p.s * .7, -p.s * .8, -p.s * .6, 0, -p.s);
    ctx.fill();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const target = innerWidth < 640 ? 18 : 34;
    if (petals.filter(p => !p.burst).length < target && Math.random() < .08) petals.push(make(false));
    petals.forEach(p => {
      if (p.burst) { p.vy += .25 * dpr; p.vx *= .985; if (p.vy > 2 * dpr) { p.vy = 2 * dpr; p.burst = false; } }
      p.sway += .02;
      p.x += p.vx + Math.sin(p.sway) * .5 * dpr;
      p.y += p.vy;
      p.rot += p.vr; p.flip += p.vf;
      draw(p);
    });
    petals = petals.filter(p => p.y < H + 30 * dpr);
    requestAnimationFrame(frame);
  }

  return {
    burst() {
      if (reduce) return;
      for (let i = 0; i < 90; i++) petals.push(make(true));
      if (!running) { running = true; requestAnimationFrame(frame); }
    }
  };
})();
