import { login, logout, getInfo, testLogin } from '@/api/user'// suo bang
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

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
  testLogin({ commit },userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve,reject)=>{
      testLogin(userInfo).then((res)=>{
        const { data } = res
        commit('SET_TOKEN',data.token)
        setToken(data.token)
        resolve()
      }).catch((err)=>{
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
        let t = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM0YzU2NDNjOTg4MGFlMDkwNDRjNDUwOTdlMDViM2MwZDVkNWJjZmFiMDFiNGE4MjNkYjdiZjI1Y2ZjZGVhMGM0OTA4NjdmMWYyOGEzMzg3In0.eyJhdWQiOiIxIiwianRpIjoiMzRjNTY0M2M5ODgwYWUwOTA0NGM0NTA5N2UwNWIzYzBkNWQ1YmNmYWIwMWI0YTgyM2RiN2JmMjVjZmNkZWEwYzQ5MDg2N2YxZjI4YTMzODciLCJpYXQiOjE1NjAzOTAwMzIsIm5iZiI6MTU2MDM5MDAzMiwiZXhwIjoxNTYyOTgyMDMyLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.YfH3km1mQTwaiW_vgG-HUGsBeTOpSX_UXfAIaT0DMJUx8QPQewzBTaL0HGGU7zbZoCMcrNbHxcUp6FK8FunxQt4vVnirS12QJnKh4JqEKklbve6tAWVOoAMzSXVymn2_tYoqzpwA9zg8-TucfeHyW3wc6IymXBPqy-5A6kACyrcs1m5j_hGHL_SHHVvKa6LbDM8S6ZLNw1C3m5jleuJENBGhdHtt-P938wSU02p4xBT397FC9kJ1KlpE4XkfnSfhETVL4j77YTD1euahzH9bf-Gdm1Me8w2f9PqQu_v5nJ9TdXPlCAWhL128eOTrLbYxxvL5O8NBHbxqoKwu6yhgq-R6W12DJwYKpe3yv8NtDZQiyup_BB-mG-S-i3vzg5FGYtbg0MwpAmtR3g83uWJGgUJwbLUTDV6CuTA4i-yjIWFpC-uHS-3P-wu5s-rRCYXr5RY8f7AMzWzOU61zgqre7d1CUAzELsPXvDszNdhp6d1Z4uBs1ZO5N2rtKtj44IesFHYOEH3uIZPDDFE8WQvd4uvbJkIO8XtGgvgns266p2W0n1EqcaUoi9tgQxjSvvniAYPxphMinXLjDI9RRPVYv-bfgk0HG0nU2WImsw7YILfPfUMpfFHuf22FcwnhdE89W2Ra6OEka8ylZ3o8ClM5NTHTKn4PopjIgMs3N8tNhFc'
        localStorage.setItem('suoBang-token',t)
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
