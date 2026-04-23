import { showComingSoonToast } from '../utils/comingSoonToast';
import { COMING_SOON_SUBTITLE } from '../consts';

export function initComingSoonInterceptor() {
  document.querySelectorAll('[data-coming-soon="true"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const feature = el.getAttribute('data-feature') || 'Feature';
      const subtitle =
        el.getAttribute('data-feature-subtitle') || COMING_SOON_SUBTITLE;
      showComingSoonToast(feature, subtitle);
    });
  });
}
