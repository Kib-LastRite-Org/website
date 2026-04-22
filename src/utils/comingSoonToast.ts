import { showToast } from "./lastRiteToast";
import { COMING_SOON_SUBTITLE } from "../consts";

export function showComingSoonToast(featureName: string, subtitle?: string) {
  const title = `${featureName} Coming Soon`;
  const description = subtitle || COMING_SOON_SUBTITLE;

  return showToast(title, {
    description,
    type: 'info',
    duration: 4000,
    dismissible: true,
  });
}
