import request from '@/utils/request'

export function http(url, data, method) {
  return request({ url, method, data })
}

export function get(url, params) {
  return request({ url, method: 'get', params })
}

export function post(url, data) {
  return http(url, data, 'post')
}

export function put(url, data) {
  return http(url, data, 'put')
}

export function destroy(url, data) {
  return http(url, data, 'delete')
}
