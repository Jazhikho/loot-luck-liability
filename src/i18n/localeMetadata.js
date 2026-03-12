export const DEFAULT_LOCALE = "en";

export const SURFACED_LOCALES = ["en", "es-LA", "es-AR", "pt-BR", "ja"];
export const PLACEHOLDER_LOCALES = ["ru", "ko", "zh-Hans"];
export const SUPPORTED_LOCALES = ["en", "es", ...SURFACED_LOCALES.filter((locale) => locale !== "en"), ...PLACEHOLDER_LOCALES];

export const LOCALE_PARENTS = {
  "es-LA": "es",
  "es-AR": "es",
};

export const MANUAL_LOCALE_OPTIONS = [
  { id: "en", labelKey: "ui.locale.english" },
  { id: "es-LA", labelKey: "ui.locale.spanishLA" },
  { id: "es-AR", labelKey: "ui.locale.spanishAR" },
  { id: "pt-BR", labelKey: "ui.locale.portugueseBR" },
  { id: "ja", labelKey: "ui.locale.japanese" },
];

export function getLocaleChain(localeId) {
  const chain = [];
  let current = localeId;

  while (current && !chain.includes(current)) {
    chain.push(current);
    current = LOCALE_PARENTS[current];
  }

  if (!chain.includes(DEFAULT_LOCALE)) {
    chain.push(DEFAULT_LOCALE);
  }

  return chain;
}

export function resolveAutoLocale(browserLocale = "") {
  const normalized = browserLocale.toLowerCase();

  if (normalized.startsWith("es-ar")) return "es-AR";
  if (normalized.startsWith("es")) return "es-LA";
  if (normalized.startsWith("pt")) return "pt-BR";
  if (normalized.startsWith("ja")) return "ja";
  return DEFAULT_LOCALE;
}
