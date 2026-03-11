import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { DEFAULT_LOCALE, resources, SUPPORTED_LOCALES } from "./resources.js";

const LOCALE_PREF_KEY = "ll_locale_pref";
const AUTO_MODE = "auto";
const MANUAL_MODE = "manual";

function canUseBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function resolveBrowserLocale() {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const browserLocale = navigator.language || navigator.languages?.[0] || DEFAULT_LOCALE;
  return browserLocale.toLowerCase().startsWith("es") ? "es" : DEFAULT_LOCALE;
}

function readStoredPreference() {
  if (!canUseBrowser()) return { source: AUTO_MODE, locale: resolveBrowserLocale() };

  try {
    const raw = window.localStorage.getItem(LOCALE_PREF_KEY);
    if (!raw) return { source: AUTO_MODE, locale: resolveBrowserLocale() };
    const parsed = JSON.parse(raw);
    if (parsed?.source === MANUAL_MODE && SUPPORTED_LOCALES.includes(parsed.locale)) {
      return { source: MANUAL_MODE, locale: parsed.locale };
    }
    return { source: AUTO_MODE, locale: resolveBrowserLocale() };
  } catch {
    return { source: AUTO_MODE, locale: resolveBrowserLocale() };
  }
}

let localeState = readStoredPreference();
const listeners = new Set();

const I18nContext = createContext({
  locale: localeState.locale,
  localeSource: localeState.source,
  t,
  getValue: getLocaleValue,
  setLocalePreference,
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

function writePreference(nextState) {
  if (!canUseBrowser()) return;
  if (nextState.source === AUTO_MODE) {
    window.localStorage.setItem(LOCALE_PREF_KEY, JSON.stringify({ source: AUTO_MODE }));
    return;
  }
  window.localStorage.setItem(
    LOCALE_PREF_KEY,
    JSON.stringify({ source: MANUAL_MODE, locale: nextState.locale })
  );
}

function applyState(nextState, persist = true) {
  localeState = nextState;
  if (persist) writePreference(nextState);
  notify();
  return localeState.locale;
}

export function getLocale() {
  return localeState.locale;
}

export function getLocaleSource() {
  return localeState.source;
}

export function setLocalePreference(preference) {
  if (preference === AUTO_MODE) {
    return applyState({ source: AUTO_MODE, locale: resolveBrowserLocale() });
  }
  if (!SUPPORTED_LOCALES.includes(preference)) return localeState.locale;
  return applyState({ source: MANUAL_MODE, locale: preference });
}

export function setLocale(localeId) {
  return setLocalePreference(localeId);
}

export function resetLocaleState() {
  if (canUseBrowser()) window.localStorage.removeItem(LOCALE_PREF_KEY);
  localeState = { source: AUTO_MODE, locale: resolveBrowserLocale() };
  notify();
  return localeState.locale;
}

export function getLocaleValue(key, localeId = localeState.locale) {
  const localized = getNestedValue(resources[localeId] || {}, key);
  if (localized !== undefined) return localized;
  return getNestedValue(resources[DEFAULT_LOCALE], key);
}

export function t(key, params = {}, localeId = localeState.locale) {
  const value = getLocaleValue(key, localeId);
  if (typeof value !== "string") return key;
  return interpolate(value, params);
}

export function I18nProvider({ children }) {
  const state = useSyncExternalStore(subscribe, () => localeState, () => localeState);
  const value = useMemo(
    () => ({
      locale: state.locale,
      localeSource: state.source,
      t: (key, params = {}) => t(key, params, state.locale),
      getValue: (key) => getLocaleValue(key, state.locale),
      setLocalePreference,
    }),
    [state]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
