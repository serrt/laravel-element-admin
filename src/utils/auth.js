import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const guardKey = 'vue_admin_guard_name'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function guard(name) {
  if (!name) {
    name = Cookies.get(guardKey)
  } else {
    Cookies.set(guardKey, name)
  }
  return name
}
