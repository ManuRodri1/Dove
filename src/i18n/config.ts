export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const localeCookie = "dove_locale";
export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "es";
}
const spanishCountries = new Set(["AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "ES", "GQ", "GT", "HN", "MX", "NI", "PA", "PE", "PR", "PY", "SV", "UY", "VE"]);

export function detectLocale(preference?: string, urlLocale?: string, acceptLanguage = "", country = ""): Locale {
  if (isLocale(preference)) return preference;
  if (isLocale(urlLocale)) return urlLocale;
  const languages = acceptLanguage.split(",").map((part, index) => {
    const [tag, ...parameters] = part.trim().toLowerCase().split(";");
    const quality = parameters.find((p) => p.trim().startsWith("q="));
    const q = quality ? Number(quality.trim().slice(2)) : 1;
    return { tag: tag.split("-")[0], q, index };
  }).filter((item) => Number.isFinite(item.q) && item.q > 0 && item.q <= 1)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const language of languages) if (isLocale(language.tag)) return language.tag;
  return spanishCountries.has(country.toUpperCase()) ? "es" : "en";
}
