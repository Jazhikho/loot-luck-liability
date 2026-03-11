import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { DEFAULT_LOCALE, resources, SUPPORTED_LOCALES } from "./resources.js";

let currentLocale = DEFAULT_LOCALE;
const listeners = new Set();

const I18nContext = createContext({
  locale: DEFAULT_LOCALE,
  t,
  getValue: getLocaleValue,
});

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNestedValue(source, key) {
  return key.split(".").reduce((value, part) => (isRecord(value) ? value[part] : undefined), source);
}

function interpolate(value, params) {
  if (typeof value !== "string") return value;
  return value.replace(/\{([^}]+)\}/g, (_, key) => `${params[key] ?? ""}`);
}

export function getLocale() {
  return currentLocale;
}

export function setLocale(localeId) {
  if (!SUPPORTED_LOCALES.includes(localeId)) return currentLocale;
  currentLocale = localeId;
  notify();
  return currentLocale;
}

export function getLocaleValue(key, localeId = currentLocale) {
  const localized = getNestedValue(resources[localeId] || {}, key);
  if (localized !== undefined) return localized;
  return getNestedValue(resources[DEFAULT_LOCALE], key);
}

export function t(key, params = {}, localeId = currentLocale) {
  const value = getLocaleValue(key, localeId);
  if (typeof value !== "string") return key;
  return interpolate(value, params);
}

export function I18nProvider({ children }) {
  const locale = useSyncExternalStore(subscribe, getLocale, getLocale);
  const value = useMemo(
    () => ({
      locale,
      t: (key, params = {}) => t(key, params, locale),
      getValue: (key) => getLocaleValue(key, locale),
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
