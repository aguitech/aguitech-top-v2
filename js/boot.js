/* boot sequence — type lines, hide */
export async function bootSequence(sel, totalMs = 2800){
  const boot = document.querySelector(sel);
  if (!boot){ return; }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    boot.classList.add('is-done');
    return;
  }
  boot.classList.add('is-running');
  await new Promise(r => setTimeout(r, totalMs));
  boot.classList.remove('is-running');
  boot.classList.add('is-done');
  setTimeout(() => boot.remove(), 800);
}
