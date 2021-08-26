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

/**
 * 下载文件, 这只是一个demo
 * 1. 由服务端响应文件下载流
 * 2. 客户端接收文件, 用浏览器的特性自动处理保存文件
 */
export function downloadDemo() {
  return request({
    url: 'admin/user/export',
    method: 'post',
    data: params,
    responseType: 'blob'
  }).then(res => {
    this.exportLoading = false
    var blob = new Blob([res])
    var downloadElement = document.createElement('a')
    var href = window.URL.createObjectURL(blob)
    downloadElement.href = href
    downloadElement.download = '用户数据 ' + this.$moment().format('YYYY-MM-DD') + '.xlsx'
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(href)
  }).catch(error => {
    this.exportLoading = false
    console.log(error)
  })
}
