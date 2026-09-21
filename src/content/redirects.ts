import type { Locale } from "@/i18n/config";

/** Central migration map for legacy public routes. */
export const legacyRedirects: Record<string, (locale: Locale) => string> = {
  "/dove-board": () => "/en/our-team",
  "/the-dove-experience": (locale) => `/${locale}/volunteer`,
  "/volunteer-release": (locale) => `/${locale}/volunteer#application`,
  "/grouptravel": (locale) => `/${locale}/travel-with-purpose`,
};
