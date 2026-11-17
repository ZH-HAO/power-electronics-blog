const progress = document.querySelector('.reading-progress');
if (progress) {
  const update = () => {
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progress.style.width = (max ? window.scrollY / max * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}
const activityScroll = document.querySelector('.activity-scroll');
if (activityScroll && window.matchMedia('(max-width: 700px)').matches) {
  activityScroll.scrollLeft = activityScroll.scrollWidth;
}

