


export default [
  {
    url: '/api/login',// 必须和接口api同名
    type: 'post', // 必须和你接口定义的类型一样
    response: (req, res) => {
      return {
        code: 20000,
        data: {
          status: 'success',
          list:[0,1,2,3]
        }
      }
    }
  }
]

