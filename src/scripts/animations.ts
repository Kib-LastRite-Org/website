// ScrollReveal animation: fade up elements on intersection
export function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (prefersReduced) {
    elements.forEach((el) => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

// Counter animation: animate numeric values on intersection
export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const el = entry.target as HTMLElement;
        const target = parseFloat(el.dataset['counter'] ?? '0');
        const suffix = el.dataset['counterSuffix'] ?? '';
        const duration = prefersReduced ? 0 : 1600;

        if (prefersReduced) {
          el.textContent = target + suffix;
          return;
        }

        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = (target * eased).toFixed(
            Number.isInteger(target) ? 0 : 1
          );
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

// Step connector draw-in animation
export function initConnectors() {
  const connectors = document.querySelectorAll('.step-connector');
  if (!connectors.length) return;

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;

        if (prefersReduced) {
          entry.target.classList.add('drawn');
          observer.unobserve(entry.target);
          return;
        }

        setTimeout(() => {
          entry.target.classList.add('drawn');
        }, i * 200);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  connectors.forEach((el) => observer.observe(el));
}

// Initialize all animations
export function initAll() {
  initScrollReveal();
  initCounters();
  initConnectors();
}
