import { COMING_SOON_SUBTITLE } from "../consts";

export function showComingSoonToast(featureName: string, subtitle?: string) {
  const toastId = `toast-${Math.random().toString(36).slice(2, 11)}`;
  const title = `${featureName} Coming Soon`;
  const description = subtitle || COMING_SOON_SUBTITLE;

  const toastHTML = `
    <div
      id="${toastId}"
      class="toast toast--info"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="toast-content">
        <div class="toast-message">
          <p class="toast-title">${escapeHTML(title)}</p>
          <p class="toast-description">${escapeHTML(description)}</p>
        </div>
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
      </div>
    </div>
  `;

  const toast = document.createElement("div");
  toast.innerHTML = toastHTML;
  const toastElement = toast.firstElementChild as HTMLElement;
  document.body.appendChild(toastElement);

  setTimeout(() => {
    toastElement.classList.add("toast--exiting");
    setTimeout(() => {
      toastElement.remove();
    }, 300);
  }, 4000);
}

function escapeHTML(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
