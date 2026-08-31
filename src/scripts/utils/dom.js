/**
 * DOM & Math Utilities
 */

/**
 * Query selector shorthand
 * @param {string} selector
 * @param {HTMLElement|Document} [context=document]
 * @returns {HTMLElement|null}
 */
export const $ = (selector, context = document) => context.querySelector(selector);

/**
 * Query selector all shorthand returning array
 * @param {string} selector
 * @param {HTMLElement|Document} [context=document]
 * @returns {HTMLElement[]}
 */
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

/**
 * Clamps a number between a minimum and maximum value
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (val, min, max) => (val < min ? min : val > max ? max : val);

/**
 * Maps a value from a source range to [0, 1] clamped
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const span = (val, min, max) => clamp((val - min) / (max - min), 0, 1);

/**
 * Debounces a function execution
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (fn, delay = 150) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
