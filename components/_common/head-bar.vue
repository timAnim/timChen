<template>
  <header>
    <section>
      <li>
        <button @click='asideBtn' id='asideBtn'>
          <icon name="bars"></icon>
        </button>
        <h1>{{ title }}</h1>
        <button v-if='token' @click='settingBtn'>
          <div><img :src="portrait"></div>
        </button>
        <button v-else='token' @click='login'>登录</button>
        <button @click='noticeBtn'>
          <icon name='bell'></icon>
        </button>
      </li>
      <nav-bar ref='nav' :navs='navs' :cur='cur' @nav='nav' v-if='navs.length'></nav-bar>
    </section>
    <setting-dlg ref='sDlg' :seen='false'></setting-dlg>
    <notice-dlg ref='nDlg' :seen='false'></notice-dlg>
  </header>
</template>
<style scoped>
img {
  border-radius: 50%;
  width: 2.8rem;
  margin-top: 1rem;
}

button {
  height: 4.8rem;
  line-height: 4.8rem;
  flex: 0 0 4.8rem;
  margin: 0 0 0 0.8rem;
  border-radius: 0;
}

#asideBtn {
  margin: 0 0.8rem 0 0;
}

header h1 {
  font-size: 16px;
  font-weight: 600;
}

header h1 span:last-child em {
  display: none;
}

header button svg {
  fill: #9e9e9e;
}

header button {
  margin: 0;
}

</style>
<script>
import settingDlg from './setting-dlg.vue'
import noticeDlg from './notice-dlg.vue'
export default {
  name: 'head-bar',
  methods: {
    asideBtn() {
      this.$emit('asideToggle')
    },
    noticeBtn() {
      this.$refs.nDlg.seen = true
    },
    settingBtn() {
      this.$refs.sDlg.seen = true
    },
    setPath() {
      // var arr = []
      // this.$route.matched.forEach(item => {
      //   arr.push(item.name)
      // })
      // arr = arr.join(' / ')
      // this.title = arr
      this.title = this.$route.name
    },
    login() {
      this.$router.push('/login')
    },
    nav(id) {
      this.$emit('nav', id)
    }
  },
  data() {
    return {
      title: this.$route.name,
      token: sessionStorage.token,
      // portrait:sessionStorage.portrait||'/static/img/img01.jpg',
      portrait: '/static/img/img01.jpg',
      navs: [],
      cur: '',
    }
  },
  components: {
    'setting-dlg': settingDlg,
    'notice-dlg': noticeDlg
  }
}

</script>
