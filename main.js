/* AGUITECH // TOP v2 — defensive main */
import { bootSequence } from './js/boot.js';

const ready = (cb) => {
  if (document.readyState !== 'loading') cb();
  else document.addEventListener('DOMContentLoaded', cb);
};

// Wrap any module init in try/catch so one error doesn't break the rest
const safe = (fn, name = 'module') => {
  try { fn(); } catch (e) { console.warn(`[${name}] failed:`, e); }
};

ready(async () => {
  // 1. Boot (force-hides at 2.4s even if errors)
  await bootSequence('#boot', 1600);

  // 2-9. Lazy import each module so a failing import doesn't block the page
  const modules = [
    ['./js/particles.js',   () => import('./js/particles.js').then(m => m.initParticles('#fx-particles')),    'particles'],
    ['./js/three-city.js',  () => import('./js/three-city.js').then(m => m.initCity3D('#city3d')),            'three-city'],
    ['./js/scroll.js',      () => import('./js/scroll.js').then(m => m.initRevealOnScroll()),                'scroll'],
    ['./js/magnetic.js',    () => import('./js/magnetic.js').then(m => m.initMagneticButtons()),              'magnetic'],
    ['./js/nav.js',         () => import('./js/nav.js').then(m => m.initNavHighlight()),                    'nav'],
    ['./js/chaos.js',       () => import('./js/chaos.js').then(m => m.initChaosTransition('#el-problema')), 'chaos'],
    ['./js/caps.js',        () => import('./js/caps.js').then(m => m.initCapabilities()),                   'caps'],
    ['./js/cta-stars.js',   () => import('./js/cta-stars.js').then(m => m.initCtaStars('#cta-stars')),      'cta-stars'],
  ];

  for (const [, fn, name] of modules) {
    try { await fn(); } catch (e) { console.warn(`[${name}] load failed:`, e); }
  }
});
