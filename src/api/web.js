import request from '@/utils/request'

export function unique(data) {
  return request({
    url: '/admin/unique',
    method: 'post',
    data
  })
}

export function upload(data) {
  return request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/admin/upload',
    method: 'post',
    data
  })
}
