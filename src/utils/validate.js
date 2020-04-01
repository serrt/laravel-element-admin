/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validatePhone(str) {
  return /(^1\d{10}$)/.test(str)
}

/**
 * @param {string} str
 * @param {Boolean}
 */
export function validateUserName(str) {
  return /^[a-zA-Z0-9_-]{3,16}$/.test(str)
}
