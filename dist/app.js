const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav-links');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}
const progress = document.querySelector('.reading-progress');
if (progress) {
  const update = () => {
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progress.style.width = (max ? window.scrollY / max * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

