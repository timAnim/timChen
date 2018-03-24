import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import AddBlog from '@/components/blogs/upadd'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: '首页',
      component: Index
    },
    {
      path: '/blogs/upadd',
      name: '添加文章',
      component: AddBlog
    }
  ]
})
