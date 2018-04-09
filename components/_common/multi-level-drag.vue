<template>
  <div id='drag-outer'>
    <child :children='_list'></child>
  </div>
</template>
<style>
.open>.drag_caret>.fa-icon {
  transform: rotate(90deg)!important;
}

.drag_caret,
._check {
  margin: 0!important;
  flex: 0 0 3.2rem;
  text-align: center;
  cursor: pointer;
}

.drag_caret>.fa-icon {
  transition: transform 0.1s ease;
  fill: #424242;
}

.drag_item{
  cursor: move;
}

.drag_title {
  pointer-events: none;
  transition: transform 0.2s ease;
}

div[end] .drag_caret svg {
  visibility: hidden;
}

#drag-outer {
  overflow: hidden;
}

li[_start] {
  opacity: 0.5;
  background-color: #f5f5f5;
}

li:after {
  content: '';
  position: absolute;
  top: 0;
  width: 100%;
  height: 4rem;
  background-color: #c5e1a5;
  visibility: hidden;
  pointer-events: none;
  transition: transform 0.2s ease;
  transform-origin: 50% 50%;
  z-index: -1;
}

li[_drag='move-before']>.drag_title {
  transform: translateY(20%);
  color: #8bc34a;
  font-weight: 800;
}

li[_drag='move-after']>.drag_title {
  transform: translateY(-20%);
  color: #8bc34a;
  font-weight: 800;
}

li[_drag='move-before']:after {
  visibility: visible;
  transform: translateY(-35%) scale(1, 0.3);
}

li[_drag='move-in']:after {
  visibility: visible;
  transform: translateX(2.4rem) scale(1, 1);
  opacity: 0.5;
  border-radius: 2rem 0 0 2rem;
}

li[_drag='move-after']:after {
  visibility: visible;
  transform: translateY(35%) scale(1, 0.3);
}

</style>
<script>
var itemFrom, arrFrom, itemTo, arrTo, indexFrom, indexTo, tend
var initFn
export default {
  props: ['initData'],
  mounted() {
    initFn = this.initFn
  },
  methods: {
    // 对数据进行初始化
    init(arr) {
      this.setEnd(arr);
      return arr
    },
    initFn() {
      this.setEnd(this._list);
    },
    // 抽离出来方便递归
    setEnd(arr) {
      for (var i = arr.length - 1; i >= 0; i--) {
        arr[i].show = true
        if (!arr[i].next) {
          arr[i].next = []
          arr[i].end = true
        } else if (arr[i].next.length === 0) {
          arr[i].end = true
        } else {
          arr[i].end = false
          this.setEnd(arr[i].next)
        }
      }
    },
  },
  components: {
    child: {
      name: 'child',
      props: ['children'],
      template: `<div>
        <div v-for='(a,index) in children' style='margin-left:1.6rem'
        :end='a.end' :key='index'>
          <li :class='{open:a.show,drag_item:true}'
            draggable='true'
            @dragstart.stop='onStart($event,a,index,children)'
            @dragover.prevent.stop='onOver($event, a)'
            @dragenter.stop='onEnter($event, a)'
            @dragleave.stop='onLeave($event, a)'
            @drop.stop='onDrop($event,a,index,children)'
            @dragend.stop='onEnd($event,a)'
            style='border-bottom:1px solid #eee'>
            <div @click.stop.prevent='open(a)' class='drag_caret'>
              <svg version="1.1" role="presentation" width="6" height="16" viewBox="0 0 640 1792" class="fa-icon"><path d="M576 896q0 26-19 45l-448 448q-19 19-45 19t-45-19-19-45v-896q0-26 19-45t45-19 45 19l448 448q19 19 19 45z"></path>
              </svg>
            </div>
            <div class='drag_title'>{{a.name}}</div>
          </li>
          <transition name='expand'>
            <child :children='a.next' v-show='a.show& !a.end'></child>
          </transition>
        </div></div>`,
      methods: {
        open(item) {
          item.show = (item.show === true) ? false : true
        },
        onStart(ev, item, index, next) {
          ev.currentTarget.setAttribute('_start', true)
          itemFrom = item
          indexFrom = index
          arrFrom = next
          setTimeout(t => item.show = false, 200)
        },
        onOver(ev, item) {
          if (item === itemFrom) return false
          if (ev.y < this.boundery[0]) {
            ev.currentTarget.setAttribute('_drag', 'move-before')
            tend = 'move-before'
          } else if (ev.y > this.boundery[0] & ev.y < this.boundery[1]) {
            ev.currentTarget.setAttribute('_drag', 'move-in')
            tend = 'move-in'
            item.show = true
          } else {
            ev.currentTarget.setAttribute('_drag', 'move-after')
            tend = 'move-after'
          }
        },
        onEnter(ev, item) {
          if (item === itemFrom) return false
          var ele = ev.currentTarget
          var unit = (ele.getBoundingClientRect().bottom - ele.getBoundingClientRect().top) / 3
          this.boundery = [
            ele.getBoundingClientRect().top + unit,
            ele.getBoundingClientRect().top + 2 * unit
          ];
        },
        onLeave(ev, item) {
          ev.currentTarget.removeAttribute('_drag')
        },
        onDrop(ev, item, index, arrTo) {
          if (item === itemFrom) return false
          ev.currentTarget.removeAttribute('_drag')
          switch (tend) {
            case 'move-after':
              arrTo.splice(index + 1, 0, itemFrom)
              for (var i = 0; i < arrFrom.length; i++) {
                if (arrFrom[i] === itemFrom) {
                  arrFrom.splice(i, 1)
                  break;
                }
              }
              break;
            case 'move-before':
              arrTo.splice(index, 0, itemFrom)
              for (var i = arrFrom.length - 1; i >= 0; i--) {
                if (arrFrom[i] === itemFrom) {
                  arrFrom.splice(i, 1)
                  break;
                }
              }
              break;
            case 'move-in':
              arrFrom.splice(indexFrom, 1)
              item.next.push(itemFrom)
              break;
          }
          initFn()
        },
        onEnd(ev, item) {
          item.show = true
          ev.currentTarget.removeAttribute('_start')
        },
      },
    },
  },
  data() {
    return {
      inited: JSON.parse(JSON.stringify(this.init(this.initData))),
      boudery: [],
    }
  },
  computed: {
    _list: {
      get() {
        return this.inited
      },
      set(_d) {
        this._list = _d
      }
    }
  }
}

</script>
