import type { Locale } from "@/i18n/config";
import { storiesEn } from "@/i18n/messages/stories.en";
import { storiesEs } from "@/i18n/messages/stories.es";

export function getStoriesCopy(locale: Locale) {
  return locale === "es" ? storiesEs : storiesEn;
}

export function formatStoryDate(value: string | null, locale: Locale) {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale === "es" ? "es-DO" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
