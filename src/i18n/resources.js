import { SUPPORTED_LOCALES } from "./localeMetadata.js";
import { EN_RESOURCE } from "./resources.en.js";
import { ES_AR_RESOURCE, ES_LA_RESOURCE, ES_RESOURCE } from "./resources.es.js";
import { JA_RESOURCE } from "./resources.ja.js";
import { PT_BR_RESOURCE } from "./resources.pt-br.js";
import { normalizeLocaleStrings } from "./resourceUtils.js";

const rawResources = {
  en: EN_RESOURCE,
  es: ES_RESOURCE,
  "es-LA": ES_LA_RESOURCE,
  "es-AR": ES_AR_RESOURCE,
  "pt-BR": PT_BR_RESOURCE,
  ja: JA_RESOURCE,
  ru: {},
  ko: {},
  "zh-Hans": {},
};

export const resources = normalizeLocaleStrings(
  Object.fromEntries(SUPPORTED_LOCALES.map((localeId) => [localeId, rawResources[localeId] || {}]))
);
