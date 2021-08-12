import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/admin/admin-user',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/admin/admin-user',
    method: 'post',
    data
  })
}

export function show(id, params) {
  return request({
    url: '/admin/admin-user/' + id,
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: '/admin/admin-user/' + data.id,
    method: 'put',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/admin/admin-user/' + id,
    method: 'delete'
  })
}
