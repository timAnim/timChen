<style lang='scss' scoped>
.gant-title {
  flex: 0 0 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gant-person {
  flex: 0 0 4rem;
  overflow: hidden;
}

.gant-container {
  background: #eee;
  height: 0.8rem;
  border-radius: 0.8rem;
  border: 0.4rem solid #eee;
  position: relative;
  margin: 0.4rem 0;
  box-shadow: 0 0 0.8rem #bdbdbd inset;
}

.gant {
  position: absolute;
  background: #8bc34a;
  left: 0;
  height: 0.8rem;
  min-width: 0.5em;
  border-radius: 0.6rem;
  cursor: move;
}

.starter,
.ender {
  cursor: w-resize;
  background: white;
  position: absolute;
  left: 0;
  top: 0;
  height: 1.6rem;
  line-height: 1.6rem;
  width: 3.2rem;
  font-size: 0.8rem;
  text-align: center;
  overflow: hidden;
  border-radius: 0.2rem;
  margin-top: -1.2rem;
  margin-left: -3.2rem;
  box-shadow: 0 0 0.4rem #9e9e9e;
}

.ender {
  left: 100%;
  margin-left: 0;
}

dl {
  user-select: none;
}

</style>
<template>
  <dl class='ht-regular pd-half' :name='data.name' :id='data._id' @click='_click'>
    <dd class='gant-person color-light'>{{data.pname}}</dd>
    <dd class='gant-title'>{{data.name}}</dd>
    <dd>
      <div class="gant-container">
        <div class="gant" :style='"left:"+data.left+"px;right:"+data.right+"px;"' @mousedown.prevent.stop='movestart' tap='cancel'>
          <div class="starter" @mousedown.prevent.stop="dragstart" data='left' tap='cancel'>
            {{ data._left }}
          </div>
          <div class="ender" @mousedown.prevent.stop="dragstart" data='right' tap='cancel'>
            {{ data._right }}
          </div>
        </div>
      </div>
    </dd>
  </dl>
</template>
<script>
export default {
  props: {
    min: {
      required: true
    },
    max: {
      required: true
    },
    gant: {
      required: true
    },
  },
  data() {
    return {
      data: ' ',
      origin: 0,
      unit: 0,
      target: '',
      direct: '',
      length: 0,
      starter: '',
      ender: '',
      _min: '',
      _max: '',
      isDrag: false,
    }
  },
  mounted() {
    this.data = JSON.parse(JSON.stringify(this.gant))
    this.starter = this.$pd.find('.starter', this.data._id)
    this.ender = this.$pd.find('.ender', this.data._id)

    var min = this._min = new Date(this.min).valueOf()
    var max = this._max = new Date(this.max).valueOf()

    var start = new Date(this.data.start).valueOf()
    var end = new Date(this.data.end).valueOf()
    var total = this.getD(max - min)
    var length = this.length = this.$pd.find('.gant-container ', this.data._id).offsetWidth
    var unit = length / total
    this.unit = unit

    this.data.left = this.getD(start - min) * unit
    this.data.right = this.getD(max - end) * unit

    this.data._left = new Date(this.data.start).Format("MM-dd");
    this.data._right = new Date(this.data.end).Format("MM-dd");
  },
  methods: {
    getD(stamp) {
      return parseInt(stamp / 1000 / 60 / 60 / 24)
    },
    dragstart(ev) {
      var direct = this.direct = ev.target.getAttribute('data')

      this.initX = ev.x
      this.origin = this.data[direct]
      this.target = ev.target

      document.body.addEventListener('mousemove', this.drag)
      document.body.addEventListener('mouseup', this.dragend)
    },
    drag(ev) {
      var direct = this.direct
      var sign = (direct === 'left') ? 1 : -1
      this.isDrag = true

      this.data[direct] = this.origin + (ev.x - this.initX) * sign
      var _d = Math.floor(this.data[direct] / this.unit)
      if (_d < 0) return

      this.target.parentNode.style[direct] = this.unit * _d + 'px'

      var ex = this['_' + ((direct === 'left') ? 'min' : 'max')]
      var date = ex + _d * 24 * 60 * 60 * 1000 * sign

      this.data[((direct === 'left') ? 'start' : 'end')] = new Date(date)
      this.target.innerHTML = this.data['_' + direct] = new Date(date).Format("MM-dd");
    },
    dragend(ev) {
      document.body.removeEventListener('mousemove', this.drag)
      document.body.removeEventListener('mouseup', this.dragend)
      this.$emit('change', this.data)
      setTimeout(_t => this.isDrag = false, 50)
    },
    movestart(ev) {
      this.initX = ev.x
      this.target = ev.target
      this.origin = [this.data.left, this.data.right]

      document.body.addEventListener('mousemove', this.move)
      document.body.addEventListener('mouseup', this.moveend)
    },
    move(ev) {
      this.isDrag = true
      var delta = ev.x - this.initX
      this.data.left = this.origin[0] + delta
      this.data.right = this.origin[1] - delta

      var _d = Math.floor(this.data.left / this.unit)
      var _dr = Math.floor(this.data.right / this.unit)
      if (_d < 0 || _dr < 0) return

      this.target.style.left = this.unit * _d + 'px'
      this.target.style.right = this.unit * _dr + 'px'

      var start = this._min + _d * 24 * 60 * 60 * 1000
      var end = this._max - _dr * 24 * 60 * 60 * 1000

      this.data.start = new Date(start)
      this.data.end = new Date(end)

      this.starter.innerHTML = this.data._left = new Date(start).Format("MM-dd")
      this.ender.innerHTML = this.data._right = new Date(end).Format("MM-dd")
    },
    moveend(ev) {
      document.body.removeEventListener('mousemove', this.move)
      document.body.removeEventListener('mouseup', this.moveend)
      this.$emit('change', this.data)
      setTimeout(_t => this.isDrag = false, 50)
    },
    _click(ev) {
      if (this.isDrag) return
      if (ev.target.getAttribute('tap') === 'cancel') return
      this.$emit('tap', ev)
    },
  },
}

</script>
