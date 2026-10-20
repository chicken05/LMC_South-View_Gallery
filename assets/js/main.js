/* ==========================================================================
   South-View · bootstrap
   Wires the content, the story (scroll → year) and the scene (skyline).
   ========================================================================== */
(function (SV) {
  'use strict';

  const U = SV.util;
  const content = window.SOUTHVIEW_CONTENT;
  const storyEl = document.getElementById('story');
  if (!content || !storyEl) {
    if (storyEl) storyEl.textContent = 'Timeline content could not be loaded (content/timeline.js).';
    return;
  }
  document.documentElement.classList.add('js');

  // motion preference: URL ?motion=off|on > saved toggle > OS setting
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  let saved = null;
  try {
    saved = window.localStorage.getItem('sv-motion');
  } catch (e) {
    /* storage blocked (private mode, third-party iframe) */
  }
  let reduced = mq ? mq.matches : false;
  if (saved === 'off') reduced = true;
  if (saved === 'on') reduced = false;
  if (U.query.motion === 'off') reduced = true;
  if (U.query.motion === 'on') reduced = false;
  document.documentElement.classList.toggle('motion-off', reduced);

  const sceneEl = document.getElementById('scene');
  const scene = new SV.Scene(sceneEl, { reduced });
  const story = new SV.Story({ content, root: storyEl, hud: document.getElementById('hud'), scene, reduced });
  story.build();

  // static paper grain over the whole scene
  try {
    const grain = sceneEl.querySelector('.scene__grain');
    if (grain) grain.style.backgroundImage = 'url(' + SV.Tex.noise(160, 5, 0.28, 0.32).toDataURL() + ')';
  } catch (e) {
    /* decorative only */
  }

  const INTRO = reduced ? 0 : 2.4; // seconds for the opening sketch-in
  let introStart = null;
  let last = 0;
  let running = false;

  const frame = (now) => {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    last = now;
    if (introStart == null) introStart = now;
    const intro = INTRO && !introSkipped ? U.clamp((now - introStart) / 1000 / INTRO, 0, 1) : 1;
    const view = story.update(dt);
    scene.setView({ year: view.year, camX: view.camX, intro: U.easeOut(intro) });
    const more = scene.render(dt) || story.settling || intro < 1;
    if (more) window.requestAnimationFrame(frame);
    else running = false;
  };
  const kick = () => {
    if (running) return;
    running = true;
    last = 0;
    window.requestAnimationFrame(frame);
  };

  // skip the intro if the page opens partway down (deep link / reload)
  let introSkipped = false;
  const settle = () => {
    story.measure();
    if (story.applyDeepLink() || (window.scrollY || 0) > 40) introSkipped = true;
  };
  settle();

  window.addEventListener('scroll', kick, { passive: true });
  let rt = null;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      scene.resize();
      story.measure();
      kick();
    }, 120);
  });
  window.addEventListener('load', () => {
    story.measure();
    kick();
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      story.measure();
      scene.flushProps();
      kick();
    });
  }
  document.addEventListener('visibilitychange', kick);

  const setMotion = (off) => {
    reduced = off;
    document.documentElement.classList.toggle('motion-off', off);
    scene.setReducedMotion(off);
    try {
      window.localStorage.setItem('sv-motion', off ? 'off' : 'on');
    } catch (e) {
      /* ignore */
    }
    kick();
  };
  story.onMotionToggle = setMotion;
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', (e) => {
      story.setReducedMotion(e.matches);
      setMotion(e.matches);
    });
  }

  kick();

  // handy for testing and for the team: SV.app.jumpToYear(1958)
  SV.app = {
    scene,
    story,
    jumpToYear: (y) => story.jumpToYear(y),
    state: () => ({ year: story.year, camX: story.cam, pixels: scene.pixels, sprites: scene.sprites.size }),
  };
})(window.SV);
