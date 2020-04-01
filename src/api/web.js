import request from '@/utils/request'

export function unique(data) {
  return request({
    url: '/admin/unique',
    method: 'post',
    data
  })
}

