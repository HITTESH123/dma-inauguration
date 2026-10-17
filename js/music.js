/* ═══════════════════════════════════════════════════════════
   Background music — loops EVENT.musicFile with gentle fades.
   ═══════════════════════════════════════════════════════════ */
(function () {
  const VOLUME = .75;
  let audioEl = null, playing = false, fadeTimer = null;

  // Volume ramp (iOS ignores .volume, so there the track simply starts/stops)
  function fade(from, to, ms, done) {
    clearInterval(fadeTimer);
    const t0 = performance.now();
    audioEl.volume = from;
    fadeTimer = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      audioEl.volume = from + (to - from) * k;
      if (k === 1) { clearInterval(fadeTimer); done && done(); }
    }, 50);
  }

  window.Music = {
    get playing() { return playing; },
    play() {
      const file = window.EVENT.musicFile;
      if (!file) return;
      playing = true;
      if (!audioEl) { audioEl = new Audio(file); audioEl.loop = true; audioEl.preload = "auto"; }
      fade(0, VOLUME, 2500);
      return audioEl.play().catch(() => {
        playing = false;
        window.dispatchEvent(new Event("music-unavailable"));
      });
    },
    pause() {
      playing = false;
      if (audioEl) fade(audioEl.volume, 0, 600, () => { if (!playing) audioEl.pause(); });
    },
    toggle() { playing ? this.pause() : this.play(); return playing; }
  };
})();
