/* boot sequence — type lines, hide. Bullet-proof: always hides. */
export function bootSequence(sel, totalMs = 1600){
  const boot = document.querySelector(sel);
  if (!boot) return Promise.resolve();
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    boot.classList.add('is-done');
    setTimeout(() => { if (boot.parentNode) boot.remove(); }, 600);
    return Promise.resolve();
  }
  boot.classList.add('is-running');
  return new Promise((resolve) => {
    // HARD safety: if anything hangs, force close at 2.4s no matter what
    const safety = setTimeout(() => {
      boot.classList.add('is-done');
      setTimeout(() => { if (boot.parentNode) boot.remove(); }, 600);
      resolve();
    }, 2400);
    try {
      setTimeout(() => {
        boot.classList.add('is-done');
        clearTimeout(safety);
        setTimeout(() => { if (boot.parentNode) boot.remove(); }, 600);
        resolve();
      }, totalMs);
    } catch (e) {
      clearTimeout(safety);
      boot.classList.add('is-done');
      resolve();
    }
  });
}
