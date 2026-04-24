import { showToast } from '../utils/lastRiteToast';

export function initLastRiteToastInterceptor() {
  document.querySelectorAll('[data-toast]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const toastAttr = el.getAttribute('data-toast');
      if (toastAttr !== 'false') {
        e.preventDefault();
        const title = el.getAttribute('data-toast-title') || 'Notification';
        const description = el.getAttribute('data-toast-description');
        const type = (el.getAttribute('data-toast-type') || 'info') as 'info' | 'success' | 'warning' | 'error';
        const durationStr = el.getAttribute('data-toast-duration');
        const duration = durationStr ? parseInt(durationStr, 10) : 5000;
        const dismissible = el.getAttribute('data-toast-dismissible') !== 'false';

        showToast(title, {
          ...(description && { description }),
          type,
          duration,
          dismissible,
        });
      }
    });
  });
}
