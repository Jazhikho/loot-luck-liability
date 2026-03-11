import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./resources.js";

const localeSkeleton = () => ({
  labels: {},
  lootPrefixes: {},
  library: {},
});

export const dialogueResources = Object.fromEntries(SUPPORTED_LOCALES.map((locale) => [locale, localeSkeleton()]));

dialogueResources.en = {
  labels: {
    luckyFindTitle: "Lucky Find!",
  },
  lootPrefixes: {
    road: "Found roadside loot:",
    drop: "Loot dropped:",
    default: "Found loot:",
  },
  library: {},
};

export function getDialogueEntries(localeId, category, tierKey, fallbackLibrary) {
  const localized = dialogueResources[localeId]?.library?.[category]?.[tierKey];
  if (Array.isArray(localized) && localized.length > 0) return localized;

  const english = dialogueResources[DEFAULT_LOCALE]?.library?.[category]?.[tierKey];
  if (Array.isArray(english) && english.length > 0) return english;

  return fallbackLibrary[category][tierKey];
}

export function getNestedDialogueEntries(localeId, category, key, tierKey, fallbackLibrary) {
  const localized = dialogueResources[localeId]?.library?.[category]?.[tierKey]?.[key];
  if (Array.isArray(localized) && localized.length > 0) return localized;

  const english = dialogueResources[DEFAULT_LOCALE]?.library?.[category]?.[tierKey]?.[key];
  if (Array.isArray(english) && english.length > 0) return english;

  return fallbackLibrary[category][tierKey][key];
}

export function getDialogueLabel(localeId, key, fallback) {
  return dialogueResources[localeId]?.labels?.[key] || dialogueResources[DEFAULT_LOCALE]?.labels?.[key] || fallback;
}

export function getLootPrefixLabel(localeId, source, fallback) {
  return (
    dialogueResources[localeId]?.lootPrefixes?.[source] ||
    dialogueResources[DEFAULT_LOCALE]?.lootPrefixes?.[source] ||
    dialogueResources[localeId]?.lootPrefixes?.default ||
    dialogueResources[DEFAULT_LOCALE]?.lootPrefixes?.default ||
    fallback
  );
}
