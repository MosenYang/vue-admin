
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}
/**
 * 当你本地模拟了了一些数据，待后端完成接口后，逐步替换掉原先 mock 的接口;
 * 我们以src/api/role.js中的getRoles接口为例。它原本是在mock/role/index.js中 mock 的数据。现在我们需要将它切换为真实后端数据，只要在mock/role/index.js找到对应的路由，
 * 之后将它删除即可。这时候你可以在network中，查看到真实的数据。
 **/
export default [
  // user login
  // {
  //   url: '/user/login',
  //   type: 'post',
  //   response: config => {
  //     const { username } = config.body
  //     const token = tokens[username]
  //
  //     // mock error
  //     if (!token) {
  //       return {
  //         code: 60204,
  //         message: '账户密码不值正确.'
  //       }
  //     }
  //
  //     return {
  //       code: 20000,
  //       data: token
  //     }
  //   }
  // },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
