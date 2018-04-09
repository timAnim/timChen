<template>
  <div>
    <child :children='_list' @check='onCheck'></child>
  </div>
</template>
<style>
.open>._caret>.fa-icon {
  transform: rotate(90deg)!important;
}

._caret,
._check {
  margin: 0!important;
  flex: 0 0 3.2rem;
  text-align: center;
  cursor: pointer;
}

._caret>.fa-icon {
  transition: transform 0.1s ease;
  fill: #424242;
}

._title {
  margin: 0;
  margin-left: 1.2rem;
  transition: color 0.6s ease;
}

#scroller div{
  width: 20rem;
}

div[end] ._caret svg {
  visibility: hidden;
}

li {
  min-width: 14rem;
}

*[state=FULL]>li {
  background: #eee;
}

*[state=PART]>li {
  background: #fafafa;
}

._title:hover{
  color: #8bc34a;
  text-decoration: underline;
  cursor: pointer;
}

</style>
<script>
import checkIcon from './../../icons/check-icon.vue'
export default {
  props: ['initData'],
  methods: {
    // 对数据进行初始化
    init(arr) {
      // 递归标记终端节点end为true
      this.setEnd(arr);
      // 递归计算每个节点下面有多少终端节点total,多少终端节点被选中endChecked
      for (var i = arr.length - 1; i >= 0; i--) {
        this.setState(arr[i])
      }
      return arr
    },
    // 抽离出来方便递归
    setEnd(arr) {
      for (var i = arr.length - 1; i >= 0; i--) {
        arr[i].show = arr[i].show || false
        if (arr[i].next && arr[i].next.length) {
          arr[i].end = false
          this.setEnd(arr[i].next)
        } else {
          arr[i].end = true
          arr[i].label = true
          arr[i].state = arr[i].check ? 'FULL' : 'NONE'
          arr[i].total = 1
          arr[i].endChecked = arr[i].check ? 1 : 0
        }
      }
    },
    // 对对象进行state的设置，方便递归
    setState(item) {
      item.total = 0
      item.endChecked = 0
      if (item.end) {
        item.total = 1
        item.endChecked = item.state === 'FULL' ? 1 : 0
      } else {
        this.countEnd(item, item.next)
      }
      if (item.total === item.endChecked) item.state = 'FULL'
      else if (item.endChecked === 0) item.state = 'NONE'
      else item.state = 'PART'
    },
    // 计算一个数组里终端节点，和被选中的终端节点个数，在item里累加 
    countEnd(item, arr) {
      for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i].end) {
          item.total++;
          if (arr[i].state === 'FULL') item.endChecked++
        } else {
          this.countEnd(item, arr[i].next)
          this.setState(arr[i])
        }
      }
    },
    // 每次check的时候，对状态进行更新
    onCheck() {
      var arr = this._list
      for (var i = arr.length - 1; i >= 0; i--) {
        this.setState(arr[i])
      }
    },
  },
  components: {
    child: {
      name: 'child',
      props: ['children'],
      template: `<div>
        <div v-for='a in children' style='padding-left:1.6rem'
        :end='a.end' :state='a.state'>
          <li :class='{open:a.show}' style='border-bottom:1px solid #eee'>
            <div @click.stop.prevent='open(a)' class='_caret'>
              <svg version="1.1" role="presentation" width="6" height="16" viewBox="0 0 640 1792" class="fa-icon"><path d="M576 896q0 26-19 45l-448 448q-19 19-45 19t-45-19-19-45v-896q0-26 19-45t45-19 45 19l448 448q19 19 19 45z"></path>
              </svg>
            </div>
            <div @click.stop.prevent='check(a)' class='_check' :title='a.endChecked+"/"+a.total'>
              <check-icon :state='a.state'></check-icon>
            </div>
            <label v-if='a.label'><icon name='bus'></icon></label>
            <div class='_title'>{{a.name}}</div>
            <label v-if='a.sign'><icon name='circle' style='fill:#8bc34a'></icon></label>
          </li>
          <child :children='a.next' @check='onCheck($event)' v-if='a.show& !a.end'></child>
        </div>
      </div>`,
      methods: {
        open(item) {
          item.show = (item.show === true) ? false : true
        },
        check(item) {
          var flag
          flag = (item.state === 'FULL') ? 'NONE' : 'FULL'
          item.state = flag
          if (!item.end) this.checkAll(item.next, flag)
          this.$emit('check', flag)
        },
        onCheck(flag) {
          this.$emit('check', flag)
        },
        checkAll(arr, flag) {
          for (var i = arr.length - 1; i >= 0; i--) {
            arr[i].state = flag
            if (arr[i].next) { this.checkAll(arr[i].next, flag) }
          }
        }
      },
      components: {
        'check-icon': checkIcon,
      }
    },
  },
  data() {
    return {
      inited: JSON.parse(JSON.stringify(this.init(this.initData)))
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
