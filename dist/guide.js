(() => {
  const guide = document.querySelector('#cn-guide');
  document.querySelector('#cn-help').addEventListener('click', () => guide.showModal());
  document.querySelector('#cn-close').addEventListener('click', () => guide.close());
  document.querySelector('#cn-home').addEventListener('click', () => window.HaoPhone?.home());
  guide.addEventListener('click', event => {
    if (event.target !== guide) return;
    const bounds = guide.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) guide.close();
  });
})();
