import request from '@/utils/request'

export function files(data) {
  return request({
    url: '/admin/media/file',
    method: 'get',
    params: data
  })
}

export function upload(data) {
  return request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/admin/media/file',
    method: 'post',
    data
  })
}

export function deleteFiles(data) {
  return request({
    url: '/admin/media/file',
    method: 'delete',
    data
  })
}

export function addFolder(data) {
  return request({
    url: '/admin/media/folder',
    method: 'post',
    data
  })
}

export function deleteFolder(data) {
  return request({
    url: '/admin/media/folder',
    method: 'delete',
    data
  })
}
