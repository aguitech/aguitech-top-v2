/* tabs — for sistemas section */
export function initTabs(tabSel, paneSel){
  const tabs = document.querySelectorAll(`${tabSel} .sis-tab`);
  const panes = document.querySelectorAll(paneSel);
  if (!tabs.length || !panes.length) return;
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      const target = t.dataset.tab;
      tabs.forEach(x => x.classList.toggle('is-active', x === t));
      panes.forEach(p => p.classList.toggle('is-active', p.dataset.pane === target));
    });
  });
}
