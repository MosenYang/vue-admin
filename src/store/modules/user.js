import { login, logout, getInfo, testLogin } from '@/api/user'// suo bang
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { loginT } from '@/api/login'// suo bang

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  //suo bang
  testLogin({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      testLogin(userInfo).then((res) => {
        const { data } = res
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch((err) => {
        reject(err)
      })
    })
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        let data2 = {
          name: 'thisyang',
          password: '123456'
        }
        // 目前登录接口传参需要在body里面,目前登录接口不通
        let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ5YWM4OGEyM2ZhNDUwYzFhMjFlMGY1NGIwNTk2YTFlYWY5OTc5ZDAzYzk5MjBiMThjYzcyY2JjZDIyZjMyOTY3OGY4NTY4Nzk4NWU1MDZkIn0.eyJhdWQiOiIxIiwianRpIjoiZDlhYzg4YTIzZmE0NTBjMWEyMWUwZjU0YjA1OTZhMWVhZjk5NzlkMDNjOTkyMGIxOGNjNzJjYmNkMjJmMzI5Njc4Zjg1Njg3OTg1ZTUwNmQiLCJpYXQiOjE1NjEzNDEzNTgsIm5iZiI6MTU2MTM0MTM1OCwiZXhwIjoxNTY5MTE3MzU4LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.PS68aJs90Hkl5Q25d25dYh6D5MUcb_RBQYdJxDdVR0SkzpZOivR9yG0kFD35sg0nc9tUmVv5ASdg_xugqcetNfv-L2WNcyZANocw18d0y0TmcXButbJ-lC0fCSV13hK-Kcx5qEgqsKTrNO-5XkOLbWkCjR-rvLkz6pFx_-C-GfwbjFq24d_QQnTYngVLKmXNnDJkN9J2qmSlWKWM4R2zpESlT-pZ6cFKYN48TrDGKj_2pt3lHeeOx7p8ZAyGCzsFzgOZWpmHQC8OSWUHZSNVtHtSVoirkfvOIk4_kjNMo-roBMfjur01K4tEozZbNLWiuHnrzApYC0_DxsCCjcvuGfZcKQxxl3sfyWmwEgxIoQWHHPWjSw-621Ucw2SN59F1PJkb6d46MAl7EaNBrdYAG65N2SV3YqtpNqFvP24PFvcW-HPHazAbiIFHabZ_GoLBnZqcjbN5qn16O81OHPlMeU07wLthNq2d69ZFQEwzF-82pfYQWvpHPfxcjTfdSz-UUkK-r06b7aqcKC7mMJoGJQ-9H_l3MyiDohqyKGQJAP8BtJCoiRDwKga1RfI5gfbRDOscroj6SWPHsWEgatsydnL9Y4FVyPiykJDv8cz_JIg8LXNRSmqVjoXtfqFKpi99LHEsVlVU7ZEkx6tXoZ3l7oVLNPovWUgwWHIUT6dGUHw'
        localStorage.setItem('suoBang-token', token)
        loginT(data2).then((res) => {
          if (res) {
            console.log('suoBang接口', res)
          }
        })
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录。')
        }
        const { roles, name, avatar, introduction } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
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
        removeToken()
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
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

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
