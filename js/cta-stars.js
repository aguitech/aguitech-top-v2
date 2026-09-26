/* Star field for the CTA section */
export function initCtaStars(sel){
  const canvas = document.querySelector(sel);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  const stars = [];
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    w = canvas.width = r.width * dpr;
    h = canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars.length = 0;
    const targetW = r.width, targetH = r.height;
    const count = Math.floor((targetW * targetH) / 5000);
    for (let i = 0; i < count; i++){
      stars.push({
        x: Math.random() * targetW,
        y: Math.random() * targetH,
        r: Math.random() * 1.2 + .2,
        a: Math.random() * .7 + .2,
        s: Math.random() * .7 + .3,
        t: Math.random() * Math.PI * 2,
        c: Math.random() < .6 ? '#00f0ff' : (Math.random() < .7 ? '#ff3aa6' : '#5b6bff'),
      });
    }
  };
  resize();
  window.addEventListener('resize', resize);

  let t0 = performance.now();
  const loop = () => {
    const t = (performance.now() - t0) / 1000;
    ctx.clearRect(0, 0, w/dpr, h/dpr);
    for (const s of stars){
      s.t += .02;
      const alpha = s.a * (.6 + Math.sin(s.t * s.s * 3 + s.t) * .4);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = s.c;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  };
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) loop();
  else {
    // single frame
    loop();
  }
}
