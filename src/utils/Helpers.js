/**
 * Pick a random element from an array.
 * @param {unknown[]} a
 * @returns {unknown}
 */
export function pick(a) {
  return a[Math.floor(Math.random() * a.length)];
}

/**
 * Random integer in [a, b] inclusive.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function rand(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

/**
 * Lightweight unique id helper for UI keys and temporary records.
 * @param {string} prefix
 * @returns {string}
 */
export function makeId(prefix = "id") {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000_000)}`;
}

/** LocalStorage wrapper with JSON and safe defaults. */
export const LS = {
  /**
   * @param {string} k
   * @param {unknown} d
   * @returns {unknown}
   */
  get(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch {
      return d;
    }
  },
  /**
   * @param {string} k
   * @param {unknown} v
   */
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
  /**
   * @param {string} k
   */
  del(k) {
    try {
      localStorage.removeItem(k);
    } catch {}
  },
};
