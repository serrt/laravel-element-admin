import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/admin/activity-log',
    method: 'get',
    params: data
  })
}

export function clear() {
  return request({
    url: '/admin/activity-log/clear',
    method: 'post'
  })
}
