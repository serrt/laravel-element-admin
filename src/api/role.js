import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/admin/role',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/admin/role',
    method: 'post',
    data
  })
}

export function show(id, params) {
  return request({
    url: '/admin/role/' + id,
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: '/admin/role/' + data.id,
    method: 'put',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'delete'
  })
}
