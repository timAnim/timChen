<template>
  <transition name='slide'>
    <div class="mask" v-if='seen' @click='close'>
      <article>
        <content id='mask-outer'>
          <section>
            <ol class='shade-as-card shade-as-list' @click.stop>
              <li type='filter'>
                <button @click='close' id='back-btn'>
                  <icon name='chevron-down'></icon>
                </button>
                <h1>{{ init.name }}</h1>
                <button id='edit-btn' @click='edit' v-if='!preview'>
                  <icon name='cog'></icon>
                </button>
              </li>
              <div id='_chart'></div>
              <div id='_img'>
                <img id='cover' :src='init.cover'>
              </div>
              <div id='_con'></div>
            </ol>
          </section>
        </content>
      </article>
    </div>
  </transition>
</template>
<style scoped>
#_con {
  padding: 1.6rem;
  line-height: 2em;
}

li>button {
  height: 4.8rem;
  border-radius: 0;
  margin: 0;
  background: none;
  border: none;
  flex-basis: 4.8rem;
}

#back-btn {
  margin-right: 0.8rem;
  border-right: 1px solid #e0e0e0;
}

#edit-btn {
  border-left: 1px solid #e0e0e0;
}

section {
  max-width: 516px;
}

div {
  overflow: hidden;
}

content {
  padding: 1.6rem;
}

p {
  padding: 0.8rem;
}

#_img>img {
  margin: 8px auto;
  display: block;
}

#_chart {
  height: 240px;
  width: 100%;
}

h1 {
  font-size: 1.75rem;
  font-weight: 800;
}

#_dlg img {
  position: absolute;
  transition: all 0.4s linear;
}

article {
  background: transparent;
}

.shade-as-card {
  box-shadow: 0 1px 3px black;
}

</style>
<script>
var echarts = require('echarts');
var Scroller = require('Scroller').default;
export default {
  props: ['init'],
  methods: {
    close(ev) {
      this.seen = false
      this.$emit('close',true)
      if (this.preview) return
      let mask = this.$pd.toHTML('<div id="_dlg" class="mask" style="z-index=8000;background:transparent;"></div>')
      let img = this.$pd.id('cover')
      let cimg = img.cloneNode(true)
      cimg.style = "left:" + this.$pd.getElementLeft(img) + 'px;top:' + this.$pd.getElementTop(img) + "px;height:" + img.height + "px;width:auto;"

      document.body.appendChild(mask)
      this.$pd.id('_dlg').appendChild(cimg)

      setTimeout(() => cimg.style = 'left:' + this.init.left + 'px;height:144px;width:auto;top:' + this.init.top + 'px;', 50)

      setTimeout(() => this.$pd.id(this.init.code).setAttribute('checked', true), 450)

      setTimeout(() => {
        this.$pd.clean('_dlg')
        this.$pd.id(this.init.code).removeAttribute('checked')
      }, 600)
    },
    chart() {
      let myChart = echarts.init(this.$pd.id('_chart'));
      let data = [this.init.capability,
        this.init.capability,
        this.init.usability,
        this.init.study,
        this.init.integrity,
        this.init.recommand
      ]
      let indicator = [
        { name: '兼容程度', max: 10 },
        { name: '性能', max: 10 },
        { name: '使用程度', max: 10 },
        { name: '研究指数', max: 10 },
        { name: '完整度', max: 10 },
        { name: '推荐程度', max: 10 }
      ]
      myChart.setOption({
        radar: {
          indicator: indicator
        },
        series: [{
          name: '基础参数',
          type: 'radar',
          data: [{
            value: data
          }],
        }],
      });
    },
    edit() {
      if (!this.isAdmin) return this.$pd.toast('请登录')
      this.$router.push('/interacts/add?_id=' + this.init._id)
    }
  },
  data() {
    return {
      seen: false,
      preview: false,
      isAdmin: sessionStorage.token ? true : false
    }
  },
  watch: {
    seen(_v) {
      if (_v) setTimeout(ev => {
        this.chart()
        this.$pd.id('_con').innerHTML = this.init.content
        // this.scroller = new Scroller('#mask-outer')
      }, 200)

    }
  },
}

</script>
