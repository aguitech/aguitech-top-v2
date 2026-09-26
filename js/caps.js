/* Capabilities board — extra interactions */
export function initCapabilities(){
  const nodes = document.querySelectorAll('[data-node]');
  if (!nodes.length) return;

  nodes.forEach((n, i) => {
    n.style.opacity = '0';
    n.style.transform = 'translateY(40px)';
    setTimeout(() => {
      n.style.transition = 'opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)';
      n.style.opacity = '1';
      n.style.transform = 'translateY(0)';
      n.style.transitionDelay = `${i * .05}s`;
    }, 100);
  });

  // hover physics: gentle cursor-based tilt
  nodes.forEach(n => {
    const onMove = (e) => {
      const r = n.getBoundingClientRect();
      const cx = e.clientX - (r.left + r.width / 2);
      const cy = e.clientY - (r.top + r.height / 2);
      n.style.transform = `translateY(-3px) scale(1.02) rotateX(${(-cy / r.height) * 4}deg) rotateY(${(cx / r.width) * 4}deg)`;
      n.style.transformStyle = 'preserve-3d';
    };
    const onLeave = () => { n.style.transform = ''; n.style.transformStyle = ''; };
    n.addEventListener('mousemove', onMove);
    n.addEventListener('mouseleave', onLeave);
  });
}
