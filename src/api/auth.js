import request from '@/utils/request'
import { guard } from '@/utils/auth'

export function login(data) {
  const guard = data.guard || 'admin'
  if (guard === 'agent') {
    return request({
      url: '/agent/login',
      method: 'post',
      data: { phone: data.username, password: data.password }
    })
  }
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function update(data) {
  const guardName = guard()
  if (guardName === 'agent') {
    return request({
      url: '/agent/profile',
      method: 'post',
      data
    })
  }
  return request({
    url: '/admin/profile',
    method: 'post',
    data
  })
}

export function getInfo() {
  const guardName = guard()
  if (guardName === 'agent') {
    return request({
      url: '/agent/profile',
      method: 'post'
    })
  }
  return request({
    url: '/admin/profile',
    method: 'get'
  })
}

export function logout() {
  const guardName = guard()
  if (guardName === 'agent') {
    return request({
      url: '/agent/logout',
      method: 'post'
    })
  }
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}
