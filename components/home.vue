<template>
  <main>
    <transition name='in-left'>
      <aside-bar ref='aside' :asides='asides' v-if='seen'></aside-bar>
    </transition>
    <article>
      <head-bar @asideToggle='toggle' ref='head' @nav='nav'></head-bar>
      <transition name='slide'>
        <content id='outer' v-show='seen'>
          <section>
            <transition name='slide' mode='out-in' duration='100'>
              <router-view></router-view>
            </transition>
          </section>
        </content>
      </transition>
    </article>
  </main>
</template>
<style scoped>
/*#outer {
  overflow-y: scroll;
}*/

section {
  max-width: 100rem;
}

article {
  height: 100%;
}

</style>
<script>
export default {
  methods: {
    toggle(ev) { //只是aside可以用
      this.$refs.aside.toggle()
    },
    nav() {}
  },
  updated(ev) {
    if (this.$refs.aside) {
      this.$refs.aside.update()
      this.$refs.head.setPath()
    }
    this.$pd.id('outer').scrollTop = 0
    if (!this.$refs.head) return
    this.$refs.head.navs = []
  },
  data() {
    var asides = [{
      name: '首页',
      id: '/projects',
      path: '/projects',
      label: 'home',
      seen: true
    }, {
      id: '/home/blog',
      name: '文章',
      label: 'pencil-square',
      seen: true
    }, {
      name: '流程',
      id: '/workflow',
      path: '/workflow',
      label: 'sitemap',
      seen: true
    }, {
      name: '色板管理',
      id: '/home/palettes',
      label: 'paint-brush',
      seen: true
    }, {
      id: '/home/rules',
      name: '设计规范',
      label: 'info-circle',
      seen: true
    }, {
      name: '交互设计',
      id: '/home/interaction',
      label: 'ils',
      seen: true
    }, {
      name: '基础组件',
      id: '/home/library',
      label: 'th-large',
      seen: true
    }, {
      name: '实用工具',
      id: '/home/tools',
      label: 'wrench',
      seen: true
    }, {
      name: '联系我们',
      id: '/home/contact',
      label: 'user-circle',
      seen: true
    }, {
      name: '人员管理',
      id: '/user-list',
      path: '/user-list',
      label: 'users',
      seen: sessionStorage.token ? true : false
    }
    // , {
    //   name: 'Axure培训',
    //   id: '/axure-train',
    //   path: '/axure-train',
    //   label: 'leaf',
    //   seen: true
    // }
    ]
    return {
      asides: asides,
      seen: false,
    }
  },
  mounted() {
    this.seen = true
  },
}

</script>
