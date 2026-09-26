/* reveal on scroll */
export function initReveal(){
  const els = document.querySelectorAll('.section-head, .g-card, .srv, .stat, .svc-item, .ai-card, .t3-card, .btl-item, .dsn-block, .post, .cta-final');
  if (!('IntersectionObserver' in window)){
    els.forEach(el => el.style.opacity = 1);
    return;
  }
  const io = new IntersectionObserver(entries => {
    for (const e of entries){
      if (e.isIntersecting){
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)';
    io.observe(el);
  });

  // hero specific (animate hero immediately)
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero-eyebrow, .hero-h .ln, .hero-sub, .hero-ctas, .hero-media').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100 + i * 120);
    });
  });

  document.addEventListener('scroll', () => {
    for (const el of els){
      if (el.classList.contains('is-in')){
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    }
  }, { once: true, passive: true });
}

// Auto-mark elements as in view via the observer
document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.is-in').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
  observer.observe(document.body, { attributes: true, childList: true, subtree: true });
});
