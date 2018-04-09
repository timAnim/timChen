<template>
  <transition name='opacity'>
    <ol class="pd-half">
      <li v-if='seen'>
        <em v-for='color in colors' :style="{ 'background-color':color.hex}" @mousedown.prevent.stop='tap($event,color)' :class="{'dark-text':color.darkText}" @contextmenu.prevent.stop>
          {{color.name}}
        </em>
      </li>
    </ol>
  </transition>
</template>
<style scoped>
em {
  color: white;
  font-size: 0.875rem;
  text-indent: 0.8rem;
  margin: 0!important;
  cursor: pointer;
}

.dark-text {
  color: black!important;
}

</style>
<script>
export default {
  props: ['colors', 'seen'],
  methods: {
    tap(ev, color) {
      if (!document.execCommand) return this.$pd.toast('浏览器不支持')

      var target = ev.target
      var _id = this.$pd.randId(4)
      var colorType = (ev.button === 2) ? 'rgb' : 'hex'
      var color = colorType === 'rgb' ? color.rgb : color.hex
      color = color.toString()
      if (colorType === 'hex') {
        color = color.split('#')[1]
      }

      var html = `<textarea style="opacity: 0;position: absolute;z-index: -1;"
                   id='${_id}'>${color}</textarea>`

      target.append(this.$pd.toHTML(html))
      var ta = this.$pd.id(_id)
      ta.select()
      document.execCommand("copy")
      this.$pd.toast('已复制 ' + color)
      ta.parentNode.removeChild(ta)
    },
  },
}

</script>
