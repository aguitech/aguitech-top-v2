/* counter — animates numbers on reveal */
export function initCounter(){
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver(entries => {
    for (const e of entries){
      if (!e.isIntersecting) continue;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      if (reduced){
        el.textContent = target;
      } else {
        const dur = 1600;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          // easeOut
          const v = Math.round(target * (1 - Math.pow(1 - t, 3)));
          el.textContent = v;
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        };
        requestAnimationFrame(tick);
      }
      io.unobserve(el);
    }
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}
