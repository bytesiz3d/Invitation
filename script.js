(() => {
  // ── Details population ─────────────────────────────────
  const get = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);

  async function populate() {
    const res = await fetch('details.json');
    const d = await res.json();

    // Text content — any element with data-field="key" or "key.nested"
    document.querySelectorAll('[data-field]').forEach(el => {
      const val = get(d, el.dataset.field);
      if (val != null) el.textContent = val;
    });

    // Href fields — set link targets; warn in console if still null in JSON
    document.querySelectorAll('[data-href]').forEach(el => {
      const val = get(d, el.dataset.href);
      if (val) {
        el.href = val;
      } else {
        el.href = '#';
        el.addEventListener('click', e => {
          e.preventDefault();
          console.warn(`[Invitation] "${el.dataset.href}" is not yet set in details.json`);
        });
      }
    });

    // Page title
    document.title = `${d.partner1} & ${d.partner2} — ${d.date}`;
  }

  populate();

  // ── Carousel ───────────────────────────────────────────
  const SLIDE_DURATION = 6000;
  const slides = [...document.querySelectorAll('.carousel__slide')];
  let current = 0;

  slides.forEach(slide => {
    const url = slide.style.backgroundImage.slice(5, -2);
    new Image().src = url;
  });

  function advance() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }

  setInterval(advance, SLIDE_DURATION);
})();
