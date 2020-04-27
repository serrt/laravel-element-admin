import { login, logout, getInfo, update } from '@/api/auth'
import { getToken, setToken, removeToken, guard } from '@/utils/auth'
import { Message } from 'element-ui'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    id: '',
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, guard } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, guard }).then(response => {
        if (response.code === 200) {
          const { data } = response
          commit('SET_TOKEN', data.api_token)
          setToken(data.api_token)
          resolve()
        } else {
          Message({
            message: response.message,
            type: 'error',
            duration: 1000
          })
          reject(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar, id } = data
        const permissions = ['guest']
        const roles = data.roles.map(item => {
          return item.name
        })
        if (data.permissions && data.permissions.length) {
          for (let i = 0; i < data.permissions.length > 0; i++) {
            permissions.push(data.permissions[i].name)
          }
        }
        data.permissions = permissions

        commit('SET_NAME', name)
        commit('SET_ID', id)
        commit('SET_AVATAR', avatar || require('@/assets/user.jpg'))
        commit('SET_ROLES', roles)
        commit('SET_PERMISSIONS', permissions)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateInfo({ commit }, data) {
    return new Promise((resolve, reject) => {
      update(data).then(response => {
        if (response.code === 200 && response.data) {
          const { name, avatar } = response.data

          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar || require('@/assets/user.jpg'))
          resolve(data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        guard('')
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

