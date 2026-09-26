/* Magnetic button effect — follows cursor */

export function initMagneticButtons(){
  const buttons = document.querySelectorAll('[data-magnetic]');
  buttons.forEach(btn => {
    const strength = .35;
    let raf = null;
    const onMove = (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px) translateY(-2px)`;
      });
    };
    const onLeave = () => {
      btn.style.transform = '';
    };
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
  });
}
