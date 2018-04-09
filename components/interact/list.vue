<template>
  <div>
    <div class='shade-as-card' id='h-scroller'>
      <li type='filter'><em>页面元素</em></li>
      <div id='scroller'>
        <ul id='inner'>
          <dl v-for='item in coms' :id='item.code' class='blink-theme' @click='detail($event,item)'>
            <dt class="clip" type='square-m'>
              <img :src='item.cover'>
              <icon :name='item.label'></icon>
            </dt>
            <dt class='name'>{{ item.name }}</dt>
          </dl>
        </ul>
      </div>
    </div>
    <h2>窗体类</h2>
    <ul class='flow-up'>
      <dl v-for='item in dlgs' :id='item.code' class='shade-as-card' @click='detail($event,item)'>
        <dt class="clip" type='square-m'>
          <img :src='item.cover'>
          <icon :name='item.label'></icon>
        </dt>
        <dt class='name'>{{ item.name }}</dt>
      </dl>
    </ul>
    <div v-if='isAdmin' class="float shade-as-card theme-mark blink-wave" @click='add'>
      <icon name='plus'></icon>
    </div>
    <anim></anim>
    <interact :init='interact' ref='detail' @close='onclose'></interact>
  </div>
</template>
<style scoped lang='scss'>
.float {
  position: absolute;
  bottom: 1em;
  right: 2em;
  height: 4rem;
  width: 4rem;
  line-height: 4rem;
  text-align: center;
  border-radius: 50%;
  z-index: 500;
}

dl {
  position: relative;
}

.clip {
  border: none;
  box-shadow: none;
}

.clip img {
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease;
  height: 100%;
  width: auto;
  transform: translate(-100%, -50%);
  max-width: inherit;
}

dl[checked=true] img,
dl:hover img {
  visibility: visible;
  opacity: 1;
  transform: translate(0, -50%);
}

dl[checked=true] svg,
dl:hover svg {
  transform: translateX(200%);
}

dl svg {
  position: absolute;
  width: 40%;
  height: 4rem;
  top: 30%;
  left: 30%;
  fill: #bdbdbd;
  transition: all 0.2s ease;
}

dl .name {
  padding: 0.8rem;
  box-sizing: border-box;
  text-align: center;
  line-height: 1em;
}

#scroller {
  position: relative;
  overflow: hidden;
}

#scroller dl {
  flex: 0 0 12rem;
  margin: 0.4rem;
}

dl[long=true] img {
  width: 200%;
  height: auto;
}

.mask>img {
  position: absolute;
  height: 144px;
  width: auto;
  transition: all 0.4s ease;
  z-index: 2;
  box-shadow: 0 3px 12px #9e9e9e;
}

#_dlg {
  overflow-y: scroll;
}

#h-scroller {
  animation: expand 0.5s ease;
}

</style>
<script>
import Scroller from 'Scroller'
import detail from './find.vue'
import anim from './anims.vue'
export default {
  methods: {
    detail(ev, data) {
      this.$router.replace({ path: this.$route.path, query: { code: data.code } })

      let img = this.$pd.find('img', ev.currentTarget)
      img.blur()
      this.interact = data
      this.interact.left = this.$pd.getElementLeft(img)
      this.interact.top = this.$pd.getElementTop(img) - 72

      var mask = this.$pd.toHTML('<div id="_dlg" class="mask" style="background:transparent;z-index:200;"></div>')

      let cimg = img.cloneNode(true)
      cimg.style = "left:" + this.interact.left + 'px;top:' + (this.interact.top - 72) + "px;"

      this.$pd.id('app').appendChild(mask)
      this.$pd.id('_dlg').appendChild(cimg)

      setTimeout(() => cimg.style = 'left:50%;height:auto;width:auto;top:335px;transform:translateX(-50%);', 50)
      setTimeout(() => this.$refs.detail.seen = true, 450)
      setTimeout(() => this.$pd.clean(this.$pd.id('_dlg')), 650)
    },
    add() {
      this.$router.push('/interacts/add')
    },
    onclose(res) {
      this.$router.replace({ path: this.$route.path, query: {} })
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.$pd.id('scroller')) this.scroller = new Scroller('#scroller', {
        scrollX: true,
        scrollY: false,
      })
    }, 800)
    this.$http.post('/api/interact/find').then(res => {
      this.coms = res.body.data.filter(item => { return item.type === 'com' })
      this.$pd.id('inner').style.width = this.coms.length * 12.8 + 'rem'
      this.dlgs = res.body.data.filter(item => { return item.type === 'dialog' })
      let code = this.$route.query.code
      if (!code) return
      let _int = res.body.data.filter(item => { return item.code === code })
      this.interact = _int[0]
      this.$refs.detail.seen = true
      this.$refs.detail.preview = true
    })
  },
  data() {
    return {
      coms: [],
      dlgs: [],
      interact: {},
      isAdmin: sessionStorage.token ? true : false
    }
  },
  components: {
    'interact': detail,
    'anim': anim,
  }
}

</script>
