document.querySelectorAll('details').forEach((el) => {
  const summary = el.querySelector('summary');
  const container = el.querySelector('.details-container');

  summary.addEventListener('click', (e) => {
    if (el.open) {
      e.preventDefault();
      el.classList.add('closing');
      
      setTimeout(() => {
        el.open = false;
        el.classList.remove('closing');
      }, 400);
    }
  });
});