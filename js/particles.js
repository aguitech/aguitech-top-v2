/* global particle field — slow drift, low alpha, GPU-friendly */

export function initParticles(sel){
  const canvas = document.querySelector(sel);
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let w, h, dpr;
  const particles = [];
  const COUNT = () => Math.min(120, Math.floor((w * h) / 14000));

  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles.length = 0;
    for (let i = 0; i < COUNT(); i++){
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + .3,
        vx: (Math.random() - .5) * .2,
        vy: (Math.random() - .5) * .2,
        a: Math.random() * .6 + .1,
        c: ['#00f0ff','#5b6bff','#ff3aa6'][Math.floor(Math.random()*3)],
      });
    }
  };

  let mx = w/2, my = h/2;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) { mx = e.touches[0].clientX; my = e.touches[0].clientY; }
  }, { passive: true });

  resize();
  window.addEventListener('resize', resize);

  let raf;
  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++){
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;

      // mouse parallax
      const dx = p.x - mx, dy = p.y - my;
      const dist = Math.hypot(dx, dy);
      if (dist < 200){
        const f = (200 - dist) / 200;
        p.x += (dx / dist) * f * 1.2;
        p.y += (dy / dist) * f * 1.2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.a;
      ctx.fill();

      // connect nearby
      for (let j = i+1; j < particles.length; j++){
        const q = particles[j];
        const d = Math.hypot(p.x-q.x, p.y-q.y);
        if (d < 140){
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.c;
          ctx.globalAlpha = (140 - d) / 140 * .15;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(tick);
  };

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    tick();
  } else {
    // single frame for reduced motion
    tick();
    cancelAnimationFrame(raf);
  }

  return () => cancelAnimationFrame(raf);
}
