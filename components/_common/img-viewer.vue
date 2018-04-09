<template>
  <div id="viewer_outer">
    <div class="container">
      <img id='viewer_img' :src="src" draggable='false'>
    </div>
    <div class='waitingBg' v-if='loading' @click='out'>
      <div class='waiting' align='center'>
        <p class="txt">加载中</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
#viewer_outer {
  overflow: hidden;
}

</style>
<script>
import Hammer from './../../../static/js/hammer.js'
export default {
  props: ['src'],
  mounted() {
    this.img = this.$pd.id('viewer_img')
    this.img.onload = ev => {
      this.ctrlInit()
    }
  },
  methods: {
    ctrlInit() {
      var hm = new Hammer(this.img)
      hm.on('tap',this.ontap)
      hm.on('panstart', this.panstart)
      hm.on('panmove', this.panmove)
      hm.on('panend', this.panend)
      hm.on('pancancel', this.panend)

      hm.get('pinch').set({ enable: true });
      hm.on('pinchstart', this.pinchstart)
      hm.on('pinchmove', this.pinchmove)
      hm.on('pinchend', this.pinchend)
      hm.on('pinchcancel', this.pinchend)
      this.img.addEventListener('mousewheel', this.pinchmove)
    },
    panstart(ev) {
      this.initX = this.x
      this.initY = this.y
    },
    panmove(ev) {
      this.x = ev.deltaX + this.initX
      this.y = ev.deltaY + this.initY
      this.refresh()
    },
    pinchstart(ev) {
      console.log('pinch')
    },
    pinchmove(ev) {
      if (ev.scale) {
        console.log('pinch')
      } else if (ev.deltaY) {
        if (ev.deltaY > 0) this.scale += 0.1
        else if (ev.deltaY < 0) this.scale -= 0.1
        if (this.scale < 0.4) this.scale = 0.4
        else if (this.scale > 3) this.scale = 3
        this.refresh()
      }
      return ev.preventDefault()
    },
    ontap(ev){
      console.log(ev)
    },
    refresh() {
      this.img.style.transform = 'translate(' + this.x + 'px,' + this.y + 'px) scale(' + this.scale + ')'
    }
  },
  data() {
    return {
      loading: false,
      scale: 1,
      img: '',
      initX: 0,
      initY: 0,
      x: 0,
      y: 0,
    }
  },
}

</script>
