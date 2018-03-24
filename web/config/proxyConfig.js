module.exports = {
 proxy: {
    '/api': {  //将www.exaple.com印射为/api
      target: 'http://111.230.237.156', // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/api': ''  //需要rewrite的,
      }       
    }
 }
}