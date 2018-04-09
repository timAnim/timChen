<style scoped>
.ctrl-bar {
  padding: 0 0.8rem;
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-expand {
  animation: expand 500ms ease;
}

ul>div {
  margin: 0.8rem 0.5%;
}

ul pre {
  margin-right: 0.8rem;
}

.clip {
  border: none;
  background: transparent;
  margin: 1.6rem;
}

ul dl {
  flex: 100%;
  background: white;
  margin: 0.4rem 1.6rem;
}

.date {
  font-size: 1.2rem;
  text-indent: 0.8rem;
}

.date>* {
  margin: 0!important;
}

.date>label {
  text-align: center;
}

.date svg {
  fill: #9e9e9e;
  transform: scale(0.8);
}

#add-btn {
  line-height: 4rem;
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  border: none;
  position: fixed;
  right: 1.8rem;
  bottom: 0.8rem;
}

</style>
<template>
  <section class='outer' v-if='seen'>
    <div>
      <ul id='list'>
        <div @click='projectDetail(item)' v-for='item in projects' :code='item.code' class='blink-theme shade-as-cut'>
          <li class='ctrl-bar ht-compact'>
            {{ item.name }}
          </li>
          <div class='clip'>
            <img :src='item.cover'>
          </div>
          <li class="ht-compact date">
            <em v-if='cur !== "proto"'>{{ item.start }}</em>
            <em v-else @click.stop='download(item)'>
              <icon name='cloud-download'></icon><span>下载</span>
            </em>
            <button type='icon' v-if='isAdmin' @click.stop='config(item.code)'>
              <icon name='ellipsis-v'></icon>
            </button>
          </li>
        </div>
      </ul>
    </div>
    <button v-if='isAdmin&buttonSeen' id='add-btn' type='icon' @click='add' class='shade-as-card in-pop theme-mark'>
      <icon name='plus'></icon>
    </button>
  </section>
</template>
<script>
export default {
  data() {
    return {
      seen: false,
      buttonSeen: false,
      projects: [],
      projectsBak: [],
      cur: this.$route.query.cur || 'proto',
      overArr: [],
      isAdmin: sessionStorage.token ? true : false,
      navs: [{
        id: 'proto',
        name: '原型',
      }, {
        id: 'design',
        name: '设计',
      }, {
        id: 'develop',
        name: '开发',
      }, {
        id: 'product',
        name: '正式',
      }, {
        id: 'material',
        name: '全部',
      }, ]
    }
  },
  methods: {
    getData() {
      this.$http.post('/api/projects/find')
        .then(response => {
          if (response.body.code !== 0) return
          this.projects = response.body.data;
          this.projectsBak = JSON.parse(JSON.stringify(this.projects))
          this.init()
        });
    },
    init() {
      let end = 0,
        start = 0,
        total = 0,
        diff,
        diff_day;
      this.projects.forEach(item => {
        item.cover = item.cover || '/static/img/logistics.png'
        item.start = (new Date(item.start)).Format("yyyy-MM-dd");
        item.start_short = (new Date(item.start)).Format("MM-dd");
        item.end_short = (new Date(end)).Format("MM-dd");
      })
      this.wait(1200)
        .then(seed => this.buttonSeen = true)

      this.nav(this.cur)
    },
    nav(id) {
      this.cur = id
      this.$parent.$refs.head.cur = id
      this.$router.replace({
        path: '/projects',
        query: {
          cur: id
        }
      })

      if (id === 'material'){
        this.projects = this.projectsBak
      }else{
        this.projects = this.projectsBak.filter(item => {
          return item[id]
        })
      }
      
      this.seen = false
      this.buttonSeen = false
      this.wait(50)
        .then(seed => this.seen = true)
      this.wait(350)
        .then(seed => this.buttonSeen = true)
    },
    projectDetail(item) {
      if (this.cur !== 'material') {
        window.location.href = item[this.cur]
      } else {
        if (!this.isAdmin) return this.$pd.toast('请获取管理员权限')
        this.config(item.code)
      }
    },
    config(code) {
      this.$router.push({
        path: '/projects/find',
        query: { code: code }
      })
    },
    add() {
      this.$router.push('/projects/add')
    },
    wait(time) {
      var sync = new Promise((res, rej) => {
        var seed = setTimeout(() => {
          res(seed)
        }, time)
      })
      return sync
    },
    download(item) {
      window.location.href = 'http://10.23.40.194:8080/files/proto/' + item.code + '/' + item.name + '.rp'
    }
  },
  mounted() {
    this.$parent.$refs.head.navs = this.navs
    this.$parent.$refs.head.nav = this.nav
    this.getData()
  },
  updated() {
    this.$parent.$refs.head.navs = this.navs
  }
}

</script>
