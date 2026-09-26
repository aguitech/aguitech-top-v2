/* Reveal on scroll using IntersectionObserver + GSAP ScrollTrigger
   for smooth scrubbed animations. */

export function initRevealOnScroll(){
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries){
      if (e.isIntersecting){
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  els.forEach(el => io.observe(el));

  // GSAP scroll-trigger animations: process steps, track steps, hero telemetry
  if (window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);

    // process steps stagger in
    gsap.utils.toArray('.step').forEach((el, i) => {
      gsap.from(el, {
        y: 60, opacity: 0, duration: .9, ease: 'power3.out',
        delay: i * .12,
        scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
      });
    });

    // caps-core slowly rotate when in view
    gsap.to('.caps-core-inner', {
      rotation: 360,
      ease: 'none',
      duration: 40,
      scrollTrigger: { trigger: '.caps-board', start: 'top bottom', end: 'bottom top', scrub: true },
    });

    // case-stage parallax
    gsap.from('.ipad', {
      y: 80, rotateX: 8, opacity: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.ipad', start: 'top 80%' },
    });
    gsap.from('.cc', {
      x: 40, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out',
      scrollTrigger: { trigger: '.case-callouts', start: 'top 80%' },
    });

    // diff-h line up
    gsap.from('.diff-h .dh-line', {
      y: 80, opacity: 0, duration: 1, stagger: .15, ease: 'power3.out',
      scrollTrigger: { trigger: '.diff-h', start: 'top 70%' },
    });

    // telemetry cells fade in
    gsap.from('.tlm-cell', {
      y: 20, opacity: 0, duration: .6, stagger: .1, ease: 'power3.out',
      delay: 1.2,
    });
  }
}
