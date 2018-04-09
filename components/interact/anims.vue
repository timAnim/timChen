<template>
  <div>
    <li type='filter'><em>切换动画</em></li>
    <div class="shade-as-card">
      <ul class='flow-up'>
        <span v-for='{anim,name,seen} in anims' :id='anim'>
          <em @click='trans'>{{ name }}</em>
          <transition :name='anim'>
          <div class='con' v-if='seen' @click='trans'>
            <ol><img src="/static/img/img01.jpg"></ol>
          </div>
          </transition>
        </span>
      </ul>
    </div>
    <li type='filter'><em>强调动画</em></li>
    <div class="shade-as-card" id='mark-anim'>
      <ul>
        <dl class="blink-theme">
          <dt>闪烁</dt>
        </dl>
        <dl class="blink-wave">
          <dt>波纹</dt>
        </dl>
        <dl class="blink-reverse">
          <dt>主题色</dt>
        </dl>
        <dl class="blink-alert">
          <dt>高亮</dt>
        </dl>
      </ul>
    </div>
    <li type='filter'><em>列表闪烁</em></li>
    <div class="shade-as-card" id='list-anim'>
      <ul>
        <dl>
          <ol class="blink-list" @click='list'>
            <li><em>翻转进入</em></li>
            <li><em>翻转进入</em></li>
            <li><em>翻转进入</em></li>
            <li><em>翻转进入</em></li>
            <li><em>翻转进入</em></li>
          </ol>
        </dl>
        <dl>
          <ol class="blink-list-right" @click='list'>
            <li><em>侧滑进入</em></li>
            <li><em>侧滑进入</em></li>
            <li><em>侧滑进入</em></li>
            <li><em>侧滑进入</em></li>
            <li><em>侧滑进入</em></li>
          </ol>
        </dl>
      </ul>
    </div>
    <li type='filter'><em>卡片进入</em>
      <button type='pos' @click='flow'>流动</button>
      <button type='pos' @click='exposure'>曝光</button>
    </li>
    <ul id='card-example'>
      <dl class='shade-as-card' v-for='item in listData'>
        <dt class="clip" style='border:none;'>
          <img src="/static/img/img01.jpg">
        </dt>
        <dd align='center'>卡片</dd>
      </dl>
    </ul>
  </div>
</template>
<style scoped>

#list-anim dl {
  flex-basis: 33%;
}

#list-anim ol {
  width: 100%
}

#switch-anim {
  animation: expand 0.5s ease;
}

.con {
  position: absolute;
  height: 100%;
  width: 100%;
  right: 0;
  bottom: 0;
  background: white;
  overflow: hidden;
  transition: all 0.2s ease;
}

span {
  position: relative;
  background: white;
  overflow: hidden;
}

span>em {
  height: 12rem;
  line-height: 12rem;
  text-align: center;
  display: block;
  cursor: pointer;
}

img {
  width: 100%;
  cursor: pointer;
}

ul {
  width: 100%;
}

h2 {
  clear: both;
}

#mark-anim dl {
  padding: 0.8rem;
  text-align: center;
}

</style>
<script>
export default {
  data() {
    return {
      anims: [{
        seen: true,
        anim: 'circle',
        name: '圆形切换',
      }, {
        anim: 'slide',
        name: '上滑切换',
        seen: true,
      }, {
        anim: 'drop',
        name: '下滑切换',
        seen: true,
      }, {
        anim: 'in-left',
        name: '左滑切换',
        seen: true,
      }],
      listData:[1,2,3,4,5]
    }
  },
  methods: {
    trans(ev) {
      let target = ev.target
      while (target.tagName !== 'SPAN') {
        target = target.parentNode
      }
      this.anims.forEach(item => {
        if (item.anim === target.id) item.seen = !item.seen
      })
    },
    list(ev) {
      let target = ev.target
      while (target.tagName !== 'OL') {
        target = target.parentNode
      }
      let name = target.className
      target.classList.remove(name)
      setTimeout(() => {
        target.classList.add(name)
      }, 200)
    },
    flow() {
      this.$pd.id('card-example').classList.add('flow-up')
      setTimeout(() => {
        this.$pd.id('card-example').classList.remove('flow-up')
      }, 600)
    },
    exposure() {
      this.$pd.id('card-example').classList.add('exposure')
      setTimeout(() => {
        this.$pd.id('card-example').classList.remove('exposure')
      }, 600)
    }
  }
}

</script>
