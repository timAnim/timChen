<template>
  <aside :aside-default='asideState'>
    <header>
      <li>
        <label>
          <icon name='gg'></icon>
        </label><em>宇通产品体验设计</em></li>
    </header>
    <content id='aside-scroller'>
      <section>
        <div v-for='{id,label,name,checked,children,opened,seen} in asides' :opened='opened'>
          <li @click='_switch' class='blink-wave' :id='id' :checked='checked' :type='children?"MENU":"HREF"' v-show='seen'>
            <label>
              <icon :name='label'></icon>
            </label><em>{{ name }}</em>
            <label v-if='typeof(children)=="object"'>
              <icon name='angle-down'></icon>
            </label>
          </li>
          <transition-group name='in-top'>
            <li @click='_switch' class='child blink-wave' v-for='{id,name,checked,seen} in children' :key='id' :id='id' :checked='checked' type='CHILD' v-if='opened&&asideState=="on"'>
              <em>{{ name }}</em>
            </li>
          </transition-group>
        </div>
      </section>
    </content>
  </aside>
</template>
<style scoped lang='scss'>
.child em {
  margin-left: 5.6rem;
}

div[opened=true]>li:first-child {
  opacity: 0.7;
}

div[opened=true] .child {
  display: flex;
  background: #424242;
}

div[opened=true]>li label:last-child {
  transform: rotate(-90deg);
  transition: transform 0.2s ease;
}

li {
  transition: background 0.1s ease;
}

header {
  box-shadow: 0 0 0.4rem black;
}

content {
  overflow: hidden;
  position: relative;
}

</style>
<script>
export default {
  name: 'aside',
  props: ['asides'],
  methods: {
    _switch(ev) { //处理收缩状态
      var target = ev.target
      while (target.tagName != 'LI') {
        target = target.parentNode
      }
      let type = target.getAttribute('type')
      this.scroller.scrollToElement(target, 500)
      switch (type) {
        case 'MENU':
          this.asides.forEach(item => {
            if (item.children) {
              if (item.id == target.id) this.$set(item, 'opened', !item.opened)
              else this.$set(item, 'opened', false)
            }
          })
          setTimeout(() => {
            this.scroller.refresh()
          }, 300)
          break;
        case 'CHILD':
          this.asides.forEach(item => {
            if (item.children) {
              item.children.forEach(child => {
                this.$set(child, 'checked', target.id == child.id)
              })
            }
          })
          this.$router.replace(target.id)
          this.$emit('href', target.id)
          break;
        case 'HREF':
          if (target.id === '/home/instruction') {
            window.location.href = '/static/instruction/index.html'
          } else if (target.id === '/home/icons') {
            window.location.href = 'http://fontawesome.io/icons/'
          } else {
            this.$router.replace(target.id)
          }
          this.$emit('href', target.id)
          break;
      }
    },
    update() { //跳转之后回调，处理高亮
      var cur = this.$route.path
      let childCheck
      this.asides.forEach(item => {
        if (item.children) {
          item.children.forEach(child => {
            this.$set(child, 'checked', child.path == cur)
            childCheck = childCheck || child.checked
          })
          this.$set(item, 'checked', childCheck)
          this.$set(item, 'opened', childCheck)
          childCheck = false
        } else {
          this.$set(item, 'checked', cur.indexOf(item.id) == 0)
        }
      })
      this.scroller.wrapper.scrollTop = 0
      this.scroller.refresh()
    },
    toggle() {
      this.asideState = (this.asideState == 'on') ? 'off' : 'on'
      setTimeout(item => {
        this.scroller.refresh()
      }, 200)
    }
  },
  data() {
    return {
      asideState: 'on',
      img: require('../../../static/img/img01.jpg'),
    }
  },
  mounted() {
    var Scroller = require('Scroller').default
    this.scroller = new Scroller('#aside-scroller');
    this.update();
  },
}

</script>
