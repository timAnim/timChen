<style scoped>
section {
  max-width: 70rem;
}

</style>
<template>
  <main>
    <transition name='slide'>
      <article v-show='seen'>
        <header>
          <section>
            <li>
              <button @click='backBtn'>
                <icon name="chevron-down"></icon>
              </button>
              <h1 id='project-name'>{{ proj.name }}</h1>
              <button type='alert' @click='$refs.del.seen=true'>
                <icon name='trash'></icon>
              </button>
              <button type='neg' @click='save'>
                <icon name='save'></icon>
              </button>
            </li>
          </section>
        </header>
        <content id='outer'>
          <section>
            <nav-bar :navs='navs' :cur='cur' @nav='navHdl'></nav-bar>
            <keep-alive>
              <update v-if='cur==="update"' ref='update' :proj='proj'></update>
              <staff v-if='cur==="staff"'></staff>
              <plan v-if='cur==="plan"' :proj='proj'></plan>
            </keep-alive>
          </section>
          <presenter ref='del' type='confirm' title='确认删除项目?' @out='del'></presenter>
        </content>
      </article>
    </transition>
  </main>
</template>
<script>
import updateView from './update.vue'
import planView from './plan.vue'
import staffView from './staff.vue'
import presenter from './../_common/presenter.vue'
export default {
  data() {
    let navs = [{
      id: 'update',
      name: '设置',
    }, {
      id: 'staff',
      name: '人员'
    }, {
      id: 'plan',
      name: '计划'
    }]
    return {
      proj: {},
      seen: false,
      code: this.$route.query.code,
      isAdmin: sessionStorage.token ? true : false,
      cur: this.$route.query.cur || 'update',
      navs: navs,
    }
  },
  methods: {
    backBtn() {
      this.$router.push('/projects')
    },
    updateProj() {
      this.$router.push({ path: '/projects/update', query: { code: this.code } })
    },
    navHdl(cur) {
      this.cur = cur
      this.$router.push({
        path: '/projects/find',
        query: { code: this.code, cur: cur }
      })
    },
    save() {
      this.$refs.update.save()
    },
    del(res) {
      if (!res) return
      this.$http.post('/api/projects/remove', { code: this.proj.code })
        .then(rep => {
          if (!rep.body) return
          this.$pd.toast('删除成功')
          setTimeout(time => {
            this.$router.push('/projects')
          }, 2000)
        });
    }
  },
  updated() {
    document.getElementById('outer').scrollTop = 0
  },
  mounted() {
    this.seen = true
    this.$http.post('/api/projects/find', { code: this.code })
      .then(rep => {
        if (rep.body.code !== 0) return
        this.proj = rep.body.data
      });
  },
  components: {
    'plan': planView,
    'staff': staffView,
    'update': updateView,
    'presenter': presenter,
  }
}

</script>
