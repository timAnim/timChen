<style scoped>
dl {
  flex: 1 1 50%;
  border: none;
}

section {
  max-width: 60rem;
}

img {
  margin: 0.8rem;
}

@media (max-width: 767px) {
  #outer dd {
    flex: 0 0 100%;
  }
}

.range {
  width: 48rem;
  margin: 0 auto;
}

.range dd {
  flex: 1 1 13.3%;
  text-align: center;
  border: none;
}

.shade-as-card {
  padding: 0.8rem;
}

#editor {
  outline: none;
  width: 100%;
  box-sizing: border-box;
  padding: 0.8rem;
  font-size: small;
  height: 100%;
  min-height: 10em;
  max-height: 100%;
}

#page {
  overflow-y: auto;
  width: 100%;
  height: 100%;
}

.img-col {
  flex: 0 0 240px;
}

.img-col div {
  color: #bdbdbd;
  max-width: 240px;
  overflow: hidden;
  margin: 0;
  text-align: center;
}

.mo-upload {
  margin: 0;
}

input[type=range] {
  -webkit-appearance: none;
  width: 8rem;
  height: 9rem;
  border-radius: 10px;
  transform: rotate(-90deg);
}

input[type=range]::-webkit-slider-runnable-track {
  height: 16px;
  border-radius: 8px;
  box-shadow: inset 0 0 16px #e0e0e0, inset -1px 0 3px #9e9e9e;
}

input[type=range]:focus {
  outline: none;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 24px;
  width: 24px;
  margin-top: -4px;
  background: #8bc34a;
  border-radius: 50%;
  border: solid 1px white;
  box-shadow: -1px 0 3px #bdbdbd;
}

.float {
  position: absolute;
}

.float button {
  margin: 0;
}

.parent {
  position: relative;
}

.canvas{
  box-sizing: border-box;
}

.canvas[expand]{
  position: absolute;
  width:60rem;
  box-sizing: border-box;
  top:0.8rem;
  left: 50%;
  margin-left: -30rem;
  bottom: .8rem;
  z-index: 20;
  height: inherit;
}

.toolbar button{
  margin:0;
  flex: 1 1 5em;
}

.mask{
  background-color: #eee;
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
              <h1>{{ initData.name }}</h1>
              <button v-if='initData._id' type='neg' class='color-alert' title='删除' @click='delBtn'>
                <icon name="trash"></icon>
              </button>
              <button type='neg' @click='preview' title='预览'>
                <icon name='external-link-square'></icon>
              </button>
              <button type='neg' @click='saveBtn'>
                <icon name="save"></icon>
              </button>
            </li>
          </section>
        </header>
        <content @click.stop>
          <section>
            <ol class='shade-as-card'>
              <dl>
                <dd class='img-col'>
                  <upload @complete='initData.cover=$event.resPath' @progress='progress'>
                    <img :src="initData.cover" style="width:176px">
                    <div align='center'>{{ initData.cover||"请选择" }}</div>
                  </upload>
                </dd>
                <dd>
                  <ol type='expand'>
                    <li>
                      <em char='6'>交互名称</em>
                      <input-text :icon='"suitcase"' :placeholder='"最多20个字"' v-model='initData.name'></input-text>
                    </li>
                    <li>
                      <em char='6'>图标</em>
                      <input-text :icon='"font-awesome"' :placeholder='"font-awesome图标"' v-model='initData.label'></input-text>
                    </li>
                    <li>
                      <em char='6'>英文名</em>
                      <input-text :icon='"tag"' :placeholder='"自定义标签"' v-model='initData.code'></input-text>
                    </li>
                    <li @click='getType' class='blink-theme'>
                      <em char='6'>类型</em>
                      <pre>{{ initData.typeTxt }}</pre>
                      <label>
                        <icon name='angle-right'></icon>
                      </label>
                    </li>
                    <li>
                      <em char='6'>标签</em>
                      <input-tag :preset='types' :search='types'></input-tag>
                    </li>
                  </ol>
                </dd>
              </dl>
            </ol>
            <ol class='shade-as-card'>
              <dl class='range'>
                <dd>兼容程度</dd>
                <dd>性能</dd>
                <dd>使用程度</dd>
                <dd>研究指数</dd>
                <dd>完整度</dd>
                <dd>推荐程度</dd>
              </dl>
              <dl class='range'>
                <dd>
                  <input type="range" min='1' max='10' step="1" defaultValue='5' v-model='initData.compatibility'>
                </dd>
                <dd>
                  <input type="range" min='1' max='10' step="1" defaultValue='5' v-model='initData.capability'>
                </dd>
                <dd>
                  <input type="range" min='1' max='10' step="1" defaultValue='5' v-model='initData.usability'>
                </dd>
                <dd>
                  <input type="range" min='1' max='10' step="1" defaultValue='5' v-model='initData.study'>
                </dd>
                <dd>
                  <input type="range" min='1' max='10' step="1" defaultValue='5' v-model='initData.integrity'>
                </dd>
                <dd>
                  <input type="range" min='1' max='10' step="1" defaultValue='5' v-model='initData.recommand'>
                </dd>
              </dl>
              <dl class='range'>
                <dd>{{ initData.compatibility }}</dd>
                <dd>{{ initData.capability }}</dd>
                <dd>{{ initData.usability }}</dd>
                <dd>{{ initData.study }}</dd>
                <dd>{{ initData.integrity }}</dd>
                <dd>{{ initData.recommand }}</dd>
              </dl>
            </ol>
            <h3></h3>
            <article class='shade-as-card shade-as-list canvas' :expand='fullscreen'>
                <li class='toolbar'>
                  <button title='退出全屏' @click='fullscreen=false' v-if='fullscreen'>
                    <icon name='compress'></icon>
                  </button>
                  <button title='全屏' @click='fullscreen=true' v-if='!fullscreen'>
                    <icon name='expand'></icon>
                  </button>
                  <button @focus='font=!font' @blur='font=!font' class='parent'>
                    <icon name="font"></icon>
                    <transition name='opacity'>
                      <ol class="shade-as-card float" v-show='font'>
                        <li class='ht-low'>
                          <button @click='exec' exec='fontsize' argu='2'>13px
                          </button>
                        </li>
                        <li class='ht-low ft-big'>
                          <button @click='exec' exec='fontsize' argu='3'>16px
                          </button>
                        </li>
                      </ol>
                    </transition>
                  </button>
                  <button class='parent' @focus='color=!color' @blur='color=!color'>
                    <icon name="tint"></icon>
                    <transition name='opacity'>
                      <ol class="shade-as-card float" v-show='color'>
                        <li class='ht-low'>
                          <button @click='exec' exec='forecolor' argu='#212121'>默认
                          </button>
                        </li>
                        <li class='ht-low'>
                          <button @click='exec' class='color-theme' exec='forecolor' argu='#8bc34a'>高亮
                          </button>
                        </li>
                      </ol>
                    </transition>
                  </button>
                  <button title='清除样式' @click='exec' exec='removeformat'>
                    <icon name="eraser"></icon>
                  </button>
                  <button @click='exec' exec='bold'>
                    <icon name="bold"></icon>
                  </button>
                  <button @click='exec' exec='italic'>
                    <icon name="italic"></icon>
                  </button>
                  <button @click='exec' exec='underline'>
                    <icon name="underline"></icon>
                  </button>
                  <button @click='exec' exec='indent'>
                    <icon name="indent"></icon>
                  </button>
                  <button @click='exec' exec='outdent'>
                    <icon name="dedent"></icon>
                  </button>
                  <button @click='exec' exec='JustifyLeft'>
                    <icon name="align-left"></icon>
                  </button>
                  <button @click='exec' exec='JustifyCenter'>
                    <icon name="align-center"></icon>
                  </button>
                  <button @click='exec' exec='JustifyRight'>
                    <icon name="align-right"></icon>
                  </button>
                  <button @click='exec' exec='inserthorizontalrule' title='分割线'>
                    <icon name="paragraph"></icon>
                  </button>
                  <button @click='exec' exec='CreateLink' argu='http://' title='插入链接'>
                    <icon name="link"></icon>
                  </button>
                  <button title='插入图片'>
                    <upload @complete='img'>
                      <icon name="image"></icon>
                    </upload>
                  </button>
                </li>
                <content id='page'>
                  <div id='editor' class='editor' @click='init' v-html='initData.content' spellcheck='false' contentEditable="true"></div>
                </content>
            </article>
            <presenter ref="confirm" :title='"确认删除？"' :type='"confirm"' @out='delInteract'></presenter>
            <presenter ref="type" :title='"选择类型"' :type='"radio"' :data='types' @out='setType'></presenter>
            <interact :init='initData' ref='detail'></interact>
          </section>
        </content>
        <div class="mask" v-show='fullscreen'></div>
      </article>
    </transition>
  </main>
</template>
<script>
import upload from '../_common/file-upload.vue'
import InputTag from '../_common/input-tag.vue'
import detail from './find.vue'
export default {
  data() {
    return {
      seen: false,
      font: false,
      color: false,
      fullscreen:false,
      initData: {
        name: '新增交互',
        code: '',
        label: '',
        cover: '/static/img/img01.jpg',
        content: '',
        compatibility: 5,
        capability: 5,
        usability: 5,
        study: 5,
        integrity: 5,
        recommand: 5,
        typeTxt: '请选择',
      },
      types: [{
        _id: 'com',
        name: '组件',
      }, {
        _id: 'dialog',
        name: '对话框',
      }, {
        _id: 'list',
        name: '列表动画',
      }, {
        _id: 'card',
        name: '卡片动画',
      }, {
        _id: 'mark',
        name: '强调动画',
      }, {
        _id: 'switch',
        name: '切换动画',
      }]
    }
  },
  methods: {
    saveBtn() {
      if (!this.initData.name || !this.initData.code)
        return this.$pd.toast('请检查输入')
      this.initData.content = this.$pd.id('editor').innerHTML
      this.$http.post('/api/interact/update', {
        data: this.initData
      }).then(res => {
        this.$pd.err(res)
        this.$pd.toast('操作成功')
        if (this.initData._id) return
        this.$router.back()
      })
    },
    progress(cent) {
      if (cent === 100) this.$pd.toast('上传完成')
    },
    exec(ev) {
      var target = this.$pd.target(ev, 'button')
      document.execCommand(
        target.getAttribute('exec'),
        false,
        target.getAttribute('argu') || null
      )
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
        _id: this.initData._id
      }).then(res => {
        this.$pd.err(res)
        this.$pd.toast('删除成功')
        this.$router.back()
      })
    },
    getType() {
      this.$refs.type.seen = true
    },
    setType(res) {
      if (!res) return
      this.$set(this.initData, 'type', res[0]._id)
      this.$set(this.initData, 'typeTxt', res[0].name)
    },
    preview() {
      this.$set(this.initData, 'content', this.$pd.id('editor').innerHTML)
      this.$refs.detail.preview = true
      this.$refs.detail.seen = true
    },
    img(ev) {
      document.execCommand(
        'insertimage',
        false,
        ev.resPath
      )
    },
  },
  mounted() {
    this.seen = true
    this.initData._id = this.$route.query._id || ''
    if (!this.initData._id) return false

    this.$http.post('/api/interact/find', {
      _id: this.initData._id
    }).then(res => {
      this.$pd.err(res)
      var txt = this.types.filter(item => {
        return item._id === res.body.data[0].type
      })
      res.body.data[0].typeTxt = txt[0].name
      this.initData = res.body.data[0]
    })
  },
  components: {
    'interact': detail,
    'input-tag': InputTag,
  }
}

</script>
