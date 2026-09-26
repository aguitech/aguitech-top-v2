/* ════════════════════════════════════════════════════════════════════
   AGUITECH // DIGITAL ENGINEERING
   main.js — entry, wires modules, no globals
   ════════════════════════════════════════════════════════════════════ */

import { bootSequence } from './boot.js';
import { initParticles } from './particles.js';
import { initCity3D } from './three-city.js';
import { initRevealOnScroll } from './scroll.js';
import { initMagneticButtons } from './magnetic.js';
import { initNavHighlight } from './nav.js';
import { initChaosTransition } from './chaos.js';
import { initCapabilities } from './caps.js';
import { initCtaStars } from './cta-stars.js';

const ready = (cb) => {
  if (document.readyState !== 'loading') cb();
  else document.addEventListener('DOMContentLoaded', cb);
};

ready(async () => {
  // 1. boot screen (must finish first)
  await bootSequence('#boot', 3200);

  // 2. global particle background
  initParticles('#fx-particles');

  // 3. hero 3D city
  initCity3D('#city3d');

  // 4. section reveal on scroll
  initRevealOnScroll();

  // 5. magnetic buttons
  initMagneticButtons();

  // 6. nav active state
  initNavHighlight();

  // 7. chaos → order animation
  initChaosTransition('#problem');

  // 8. capabilities board
  initCapabilities();

  // 9. CTA stars
  initCtaStars('#cta-stars');
});
