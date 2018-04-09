<template>
  <transition name='opacity'>
    <div class='mask' @click.stop='out(false)' v-if='seen'>
      <dialog @click.stop v-if='seen&&type!=="confirm"'>
        <header>
          <li>
            <h1>{{ title }}</h1>
            <button type='icon' class='color-alert' v-if='del' @click='_del'>
              <icon name='trash'></icon>
            </button>
          </li>
        </header>
        <content>
          <ol class='shade-as-list'>
            <!-- 多选框 -->
            <li v-for='(item, index) in items' v-if='type==="check"' :key='item._id' @click='_check(index)' class='blink-theme'>
              <label type='switch' :checked='item.checked'>
                <icon name="square-o"></icon>
                <icon name="check-square"></icon>
              </label>
              <em>{{ item.name }}</em>
              <pre>{{ item.pre }}</pre>
            </li>
            <!-- 单选框 -->
            <li v-for='(item, index) in items' :id='item._id' v-if='type==="radio"' @click='_radio(index)' class='blink-theme'>
              <label type='switch' :checked='item.checked'>
                <icon name="circle-o"></icon>
                <icon name="dot-circle-o"></icon>
              </label>
              <em>{{ item.name }}</em>
              <pre>{{ item.pre }}</pre>
            </li>
            <!-- 菜单 -->
            <li v-for='(item, index) in items' :id='item._id' v-if='type==="menu"' class='blink-theme' @click='_href(index)'>
              <em>{{ item.name }}</em>
              <pre>{{ item.pre }}</pre>
              <label>
                <icon name="angle-right"></icon>
              </label>
            </li>
            <!-- 输入框 -->
            <li v-for='(key, value) in items' v-if='type==="input"'>
              <em char='6'>{{ lan(value) }}</em>
              <input type="text" :value='key' @input='items[value]=$event.target.value'>
            </li>
          </ol>
        </content>
        <footer>
          <li>
            <button type='half' @click='out(false)'>取消</button>
            <button type='half' @click='out(true)'>确认</button>
          </li>
        </footer>
      </dialog>
      <!-- 下面是确认框 -->
      <dialog @click.stop v-if='seen&&type==="confirm"' class='confirm'>
        <content>
          <dl>
            <dt>
              <h1>{{ title }}</h1></dt>
            <dd>
              <button type='neg' @click='out(false)'>取消</button>
            </dd>
            <dd>
              <button type='neg' @click='out(true)'>确认</button>
            </dd>
          </dl>
        </content>
      </dialog>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      default () {
        return []
      },
    },
    parse: {
      type: Object,
      default () {
        return {}
      },
    },
    del: {
      type: Function,
    }
  },
  methods: {
    _check(item) {
      this.items[item].checked = !this.items[item].checked
      this.$set(this.items, item, this.items[item])
    },
    _radio(index) {
      this.items.forEach(item => {
        item.checked = item._id === this.items[index]._id
      })
      this.$set(this.items, index, this.items[index])
    },
    _href(index) {
      this.$emit('out', this.items[index])
    },
    _del(ev) {
      this.$emit('del', true)
    },
    out(res) {
      this.seen = false
      if (!res) return this.$emit('out', res)
      switch (this.type) {
        case 'radio':
        case 'check':
          res = this.items.filter(item => {
            return item.checked
          })
          break
        case 'input':
          res = this.items
          break
      }
      return this.$emit('out', res)
    },
    lan(char) {
      return this.parse[char] || char
    },
    check(arr) {
      let n = 0
      this.checked = JSON.parse(JSON.stringify(arr))
      this.items.forEach((item, index) => {
        n = 0
        this.checked.forEach(chItem => {
          if (item._id === chItem) n++
        })
        item.checked = (n) ? true : false
        this.$set(this.items, index, item)
      })
    },
  },
  data() {
    return {
      seen: false,
      checked: [],
      items: JSON.parse(JSON.stringify(this.data)),
    }
  },
  watch: {
    data(_v) {
      this.items = JSON.parse(JSON.stringify(_v))
    }
  }
}

</script>
