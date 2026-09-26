/* AGUITECH // TOP v2 — main entry, wires dark modules */
import { bootSequence } from './js/boot.js';
import { initParticles } from './js/particles.js';
import { initCity3D } from './js/three-city.js';
import { initRevealOnScroll } from './js/scroll.js';
import { initMagneticButtons } from './js/magnetic.js';
import { initNavHighlight } from './js/nav.js';
import { initChaosTransition } from './js/chaos.js';
import { initCapabilities } from './js/caps.js';
import { initCtaStars } from './js/cta-stars.js';

const ready = (cb) => {
  if (document.readyState !== 'loading') cb();
  else document.addEventListener('DOMContentLoaded', cb);
};

ready(async () => {
  await bootSequence('#boot', 3200);
  initParticles('#fx-particles');
  initCity3D('#city3d');
  initRevealOnScroll();
  initMagneticButtons();
  initNavHighlight();
  initChaosTransition('#el-problema');
  initCapabilities();
  initCtaStars('#cta-stars');
});
