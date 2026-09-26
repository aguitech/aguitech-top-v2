/* Chaos → Order transition.
   Uses ScrollTrigger to flip the stage from data-mode="chaos" to "order".
   Particles escape outward, then collapse inward to the core. */

export function initChaosTransition(scope){
  const root = typeof scope === 'string' ? document.querySelector(scope) : scope;
  if (!root) return;
  const stage = root.querySelector('.chaos-stage');
  if (!stage) return;

  if (window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top 70%',
        end: '+=600',
        scrub: 1,
      },
    });

    // chaos fade out, order fade in
    tl.to(stage, { attr: { 'data-mode': 'order' } })
      .to('.nodes-chaos .n', { opacity: 0, scale: .5, stagger: .04, ease: 'power2.in' }, 0)
      .to('.lines-chaos', { opacity: 0, duration: .4 }, 0)
      .from('.lines-order path', { strokeDasharray: '0 1000', opacity: 0, stagger: .08 }, .4)
      .to('.glow-chaos', { opacity: 0, duration: .4 }, .4)
      .to('.glow-order', { opacity: 1, duration: .4 }, .8)
      .to('.core-ring', { rotation: 720, ease: 'none' }, 0)
      .to('.core-ring2', { rotation: -720, ease: 'none' }, 0);
  } else {
    // fallback: simple toggle after scroll past 60% of section
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio > .6) stage.setAttribute('data-mode', 'order');
    }, { threshold: [0, .6, 1] });
    io.observe(stage);
  }
}
