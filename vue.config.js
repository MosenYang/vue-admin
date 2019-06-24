'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '索邦' // 页面头部
const port = 9527

// 所有配置项解释都可以在其中找到 https://cli.vuejs.org/config/
module.exports = {
  /**
   *Vue CLI会假设你的应用是被部署在一个域名的根路径上，例如https://www.my-app.com/。
   *如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。
   * 例如，如果你的应用被部署在https://www.my-app.com/my-app/，设置则publicPath为/my-app/
   * 详细: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',//为 true 时,eslint-loader 会将 lint 错误输出为编译警告
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // 需要移除mock: webpack-dev-server中proxy和after这个Middleware就可以
    proxy: {
      // 改变 xxx-api/login => mock/login
      // 详情: https://cli.vuejs.org/config/#devserver-proxy
      // 详情: https://www.jianshu.com/p/a248b146c55a
      // 详情: https://github.com/chimurai/http-proxy-middleware#proxycontext-config
      [process.env.VUE_APP_BASE_API]: {
        target: `http://127.0.0.1:${port}/mock`,
        changeOrigin: true,
        pathRewrite: {
          // 重写请求，比如我们源访问的是api/old-path，那么请求会被解析为/api/new-path
          ['^' + process.env.VUE_APP_BASE_API]: ' '
        },
        router: {
          // 如果请求主机 == 'dev.localhost:3000',
          // 重写目标服务器 'http://www.example.org' 为 'http://localhost:8000'
        }
      },
      //请求url分三段 域名 +/api + 接口Url
      // 匹配请求地址中包含 '/api' 直接代理到这里
      '/api': {
        target: `https://api.thisyang.online`,//目标服务器
        changeOrigin: true,// 默认false，是否需要改变原始主机头为目标URL
        pathRewrite: {
          // '/api': '' // 没有重复部分,不需要改写
        }
      }
    },
    after: require('./mock/mock-server.js')
  },
  lintOnSave: false,
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // only package third parties that are initially dependent
              },
              elementUI: {
                name: 'chunk-elementUI', // split elementUI into a single package
                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in businessOrderManage to adapt to cnpm
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // can customize your rules
                minChunks: 3, //  minimum common number
                priority: 5,
                reuseExistingChunk: true
              }
            }
          })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
