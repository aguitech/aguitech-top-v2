/* mobile menu */
export function initMenu(){
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('is-open');
    menu.setAttribute('aria-hidden', menu.classList.contains('is-open') ? 'false' : 'true');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
}
