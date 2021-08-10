import request from '@/utils/request'
import axios from 'axios'

export function config(data) {
  return request({
    url: 'admin/oss/config',
    method: 'post',
    data
  })
}

export function upload(data) {
  const formData = new FormData()
  formData.append('policy', data.policy)
  formData.append('OSSAccessKeyId', data.accessid)
  formData.append('signature', data.signature)
  formData.append('callback', data.callback)
  formData.append('host', data.host)
  formData.append('path', data.dir)
  formData.append('key', data.key)
  formData.append('file', data.file)
  return axios({
    baseURL: data.host,
    method: 'post',
    url: '',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data: formData
  })
}
