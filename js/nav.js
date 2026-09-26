/* nav — sticky shadow on scroll */
export function initNav(){
  const top = document.getElementById('topbar');
  if (!top) return;
  const onScroll = () => {
    if (window.scrollY > 30) top.style.boxShadow = '0 4px 24px rgba(0,0,0,0.04)';
    else top.style.boxShadow = 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
