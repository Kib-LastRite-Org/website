export interface ToastOptions {
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  dismissible?: boolean;
}

export function showToast(title: string, options: ToastOptions = {}) {
  const {
    description,
    type = 'info',
    duration = 5000,
    dismissible = true,
  } = options;

  const toastId = `toast-${Math.random().toString(36).slice(2, 11)}`;

  const toastHTML = `
    <div
      id="${toastId}"
      class="toast toast--${type}"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="toast-content">
        <div class="toast-message">
          <p class="toast-title">${escapeHTML(title)}</p>
          ${description ? `<p class="toast-description">${escapeHTML(description)}</p>` : ''}
        </div>
        ${dismissible ? `
          <button
            class="toast-dismiss"
            aria-label="Dismiss notification"
            onclick="document.getElementById('${toastId}').remove()"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              width="18"
              height="18"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        ` : ''}
      </div>
    </div>
  `;

  const toast = document.createElement('div');
  toast.innerHTML = toastHTML;
  const toastElement = toast.firstElementChild as HTMLElement;
  document.body.appendChild(toastElement);

  if (duration > 0) {
    setTimeout(() => {
      toastElement.classList.add('toast--exiting');
      setTimeout(() => {
        toastElement.remove();
      }, 300);
    }, duration);
  }

  return toastElement;
}

function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
