<style scoped>
section {
  max-width: 60rem;
}

.shade-as-card {
  padding: 0.8rem;
}

em svg {
  fill: #e0e0e0;
}

li>div:nth-child(3) {
  flex: 0 0 8rem;
}

</style>
<template>
  <main>
    <transition name='slide'>
      <article v-show='seen'>
        <header>
          <section>
            <li>
              <button @click='$router.back()'>
                <icon name="chevron-down"></icon>
              </button>
              <h1>{{ palette.name }}</h1>
              <button v-if='palette._id' type='neg' class='color-alert' title='删除' @click='delBtn'>
                <icon name="trash"></icon>
              </button>
              <button type='neg' @click='saveBtn'>
                <icon name="save"></icon>
              </button>
            </li>
          </section>
        </header>
        <content @click.stop>
          <section>
            <ol type='expand' class="shade-as-card">
              <li>
                <em char='6'>色板名称</em>
                <input-text :icon='"suitcase"' :placeholder='"最多20个字"' v-model='palette.name'></input-text>
              </li>
              <li>
                <em char='6'>简介</em>
                <input-text :icon='"tag"' :placeholder='"简介"' v-model='palette.des'></input-text>
              </li>
            </ol>
            <h3></h3>
            <div class="shade-as-card">
              <div v-for='(c,i) in palette.colors'>
                <li>
                  <em char='3'>
                    <svg :style='{fill:c.hex}'  version="1.1" role="presentation" width="13.714285714285714" height="16" viewBox="0 0 1536 1792" class="fa-icon">
                      <path d="M1536 896q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"></path>
                    </svg>
                  </em>
                  <input-text v-model='c.name' :placeholder='"添加颜色"' :icon='"i-cursor"'></input-text>
                  <input-text v-model='c.hex' :reg='"^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$"' :placeholder='"例#fafafa"' :icon='"paint-brush"'></input-text>
                  <button char='3' @click.prevent.stop='delColor(i)'>
                    <icon name='trash'></icon>
                  </button>
                  <button char='3' @click.prevent.stop='addColor(i)'>
                    <icon name='plus-circle'></icon>
                  </button>
                </li>
                <ol style="margin-left:4rem;" v-if='c.related'>
                  <li v-for='(r,index) in c.related'>
                    <em char='3'>
                    <svg :style='{fill:r.hex}'  version="1.1" role="presentation" width="13.714285714285714" height="16" viewBox="0 0 1536 1792" class="fa-icon">
                      <path d="M1536 896q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"></path>
                    </svg>
                  </em>
                    <input-text v-model='r.name' :placeholder='"关联颜色"' :icon='"link"'></input-text>
                    <input-text v-model='r.hex' :placeholder='"例#fafafa"' :reg='"^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$"' :icon='"paint-brush"'></input-text>
                    <button char='3' @click.prevent.stop='delRelate(c,index)'>
                      <icon name='trash'></icon>
                    </button>
                    <button char='3' @click.prevent.stop='addRelate(c,index)'>
                      <icon name='plus-circle'></icon>
                    </button>
                  </li>
                </ol>
              </div>
            </div>
            <presenter ref="confirm" :title='"确认删除？"' :type='"confirm"' @out='delInteract'></presenter>
          </section>
        </content>
      </article>
    </transition>
  </main>
</template>
<script>
export default {
  data() {
    return {
      seen: false,
      palette: {
        name: '新增色板',
        des: '',
        colors: [],
      },
    }
  },
  methods: {
    saveBtn() {
      if (!this.palette.name) return this.$pd.toast('请检查输入')
      this.palette.colors.map((c, i) => {
        if (!c.name || !c.hex) this.palette.colors.splice(i, 1)
        c.related.map((r, j) => {
          if (!r.name || !r.hex) c.related.splice(j, 1)
        })
      })
      this.$http.post('/api/palettes/upadd', {
        data: this.palette
      }).then(res => {
        if (!res.body.data) return
        this.$pd.toast('操作成功')
        if (!this.palette._id) this.$router.back()
      })
    },
    init(ev) {
      if (this.$pd.id('editor').children.length === 0)
        document.execCommand('formatblock', false, 'div')

      var target = ev.target
      if (target.tagName !== 'A') return

      var link = target.href
      var hint = this.$pd.toHTML(
        `<div class="float hint" contentEditable="false">
        <input id='link-input' type='text' value=` + link + `>
        <button class="theme-mark" id='link-confirm'>确定</button>
        <button id='link-del'>删除</button>
        </div>`)
      target.appendChild(hint)

      this.$pd.id('link-confirm').onclick = evnt => {
        target.href = this.$pd.id('link-input').value
      }

      this.$pd.id('link-del').onclick = evnt => {
        clean('.hint')
        target.outerHTML = target.innerHTML
        return false
      }

      this.$pd.find('input', target).focus()

      this.$pd.find('input', target).onblur = evnt => {
        setTimeout(t => {
          clean('.hint')
        }, 200)
      }

      var clean = () => {
        var arr = document.getElementsByClassName('hint')
        for (var i = arr.length - 1; i >= 0; i--) {
          this.$pd.clean(arr[i])
        }
      }
    },
    delBtn() {
      this.$refs.confirm.seen = true
    },
    delInteract(result) {
      if (!result) return
      this.$http.post('/api/interact/remove', {
        _id: this.palette._id
      }).then(res => {
        this.$pd.err(res)
        this.$pd.toast('删除成功')
        this.$router.back()
      })
    },
    addColor(index) {
      this.palette.colors.splice(index + 1, 0, { hex: '', name: '', related: [{ hex: '', name: '' }] })
    },
    delColor(index) {
      if (this.palette.colors.length === 1) return
      this.palette.colors.splice(index, 1)
    },
    addRelate(color, index) {
      color.related.splice(index + 1, 0, { hex: '', name: '' })
    },
    delRelate(color, index) {
      if (color.related.length === 1) return
      color.related.splice(index, 1)
    },
  },
  mounted() {
    this.seen = true
    this.palette._id = this.$route.query._id
    if (!this.palette._id) {
      this.palette.colors[0] = {
        name: '新增颜色',
        hex: '#e0e0e0',
        related: [{
          name: '关联颜色',
          hex: '#e0e0e0',
        }]
      }
      return false
    }
    this.$http.post('/api/palettes/find', {
      _id: this.palette._id
    }).then(res => {
      if (!res.body) return
      this.palette = res.body.data[0]
      this.palette.colors.map(c => {
        if (!c.related || !c.related.length) {
          c.related[0] = {}
        }
      })
    })
  },
}

</script>
