// All content and links work without JS; enhance mobile navigation and the year.
(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-navigation');
  const mobile = window.matchMedia('(max-width: 900px)');
  if (header && toggle && navigation) {
    const setOpen = (open, restoreFocus = false) => {
      navigation.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
      if (restoreFocus) toggle.focus();
    };
    toggle.hidden = false;
    header.classList.add('navigation-enhanced');
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    navigation.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link || !mobile.matches) return;
      setOpen(false);
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) setOpen(false);
    });
    if (mobile.addEventListener) mobile.addEventListener('change', () => setOpen(false));
  }
  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
