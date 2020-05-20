import request from '@/utils/request'

export function config(data) {
  return request({
    url: 'api/oss',
    method: 'post',
    baseURL: 'https://pioneer-api.hmily.club',
    data
  })
}

export function upload(data) {
  const file = data.file
  const randomStr = Math.random().toString().substr(2, 4)
  const suffix = file.name.substr(file.name.lastIndexOf('.'))
  const fileName = Date.now() + randomStr + suffix

  const formData = new FormData()
  formData.append('policy', data.policy)
  formData.append('OSSAccessKeyId', data.accessid)
  formData.append('signature', data.signature)
  formData.append('callback', data.callback)
  formData.append('host', data.host)
  formData.append('path', data.dir)
  formData.append('key', data.dir + fileName)
  formData.append('file', file)
  return request({
    baseURL: data.host,
    method: 'post',
    url: '',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data: formData
  })
}
