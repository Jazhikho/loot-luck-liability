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
