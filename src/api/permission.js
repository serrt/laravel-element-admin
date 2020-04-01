import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/admin/permission',
    method: 'get',
    params: data
  })
}

export function tree(data) {
  return request({
    url: '/admin/permission/tree',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/admin/permission',
    method: 'post',
    data
  })
}

export function show(id, params) {
  return request({
    url: '/admin/permission/' + id,
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: '/admin/permission/' + data.id,
    method: 'put',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/admin/permission/' + id,
    method: 'delete'
  })
}
