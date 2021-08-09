import Cookies from 'js-cookie'

const tokenKey = 'vue_admin_token'
const guardKey = 'vue_admin_guard'

export function getToken() {
  return Cookies.get(tokenKey)
}

export function setToken(token) {
  return Cookies.set(tokenKey, token)
}

export function removeToken() {
  return Cookies.remove(tokenKey)
}

export function guard(name) {
  if (!name) {
    name = Cookies.get(guardKey)
  } else {
    Cookies.set(guardKey, name)
  }
  return name
}
