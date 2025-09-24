export const APP_URL = process.env.APP_URL || "http://localhost:3000";

export function confirmNewsletterUrl(email: string, locale = "de") {
  return `${APP_URL}/${locale}/newsletter/confirm?e=${encodeURIComponent(email)}`;
}
