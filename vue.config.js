const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
    chainWebpack: (config)=>{
        config.resolve.alias
            .set('vue$', 'vue/dist/vue.esm.js')
            .set('@', resolve('src'))
            .set('components', resolve('src/components'))
            .set('views', resolve('src/views'))
            .set('barlist', resolve('src/components/index/barlist'))
            .set('recomment', resolve('src/views/recomment'))
            .set('ranking', resolve('src/views/ranking'))
            .set('search', resolve('src/views/search'))
            .set('gedanlist', resolve('src/views/gedanlist'))
  },
  devServer: {
    proxy: {
      '/api': {
            target: 'https://c.y.qq.com', // 接口的域名
            bypass: function (req, res, proxyOptions) {
              req.headers.referer = 'https://c.y.qq.com/';
              req.headers.host = 'c.y.qq.com';
            },
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
            pathRewrite: {
              '^/api': ''
            }
        },
        '/vkey': {
            target: 'https://u.y.qq.com', // 接口的域名
            bypass: function (req, res, proxyOptions) {
              req.headers.referer = 'https://u.y.qq.com/';
              req.headers.host = 'u.y.qq.com';
            },
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
            pathRewrite: {
              '^/vkey': ''
            }
        }
    }
  }
}