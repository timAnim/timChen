<style scoped>
section {
  max-width: 60rem;
}

.shade-as-card {
  padding: 0.8rem;
}

</style>
<template>
  <main>
    <transition name='slide' mode='out-in' duration='100'>
      <article v-if='seen'>
        <header>
          <section>
            <li>
              <button @click='$router.back()'>
                <icon name="chevron-down"></icon>
              </button>
              <h1>添加项目</h1>
              <button type='neg' @click='save'>
                <icon name='save'></icon>
              </button>
            </li>
          </section>
        </header>
        <content>
          <section>
            <ol class='shade-as-card' type='expand'>
              <li>
                <em char='6'>项目名</em>
                <input-text v-model='proj.name' :icon='"suitcase"' :placeholder='"最多20个字"' :max='20'>
                </input-text>
              </li>
              <li>
                <em char='6'>项目代号</em>
                <input-text v-model='proj.code' :icon='"code"' :placeholder='"数字和字母"'>
                </input-text>
              </li>
              <li>
                <em char='6'>开始日期</em>
                <input-date v-model='proj.start'></input-date>
              </li>
              <li>
                <em char='6'>截止日期</em>
                <input-date v-model='proj.end'></input-date>
              </li>
              <li @click='$refs.response.seen=true' class="blink-theme">
                <em char='6'>适配设备</em>
                <pre>{{ proj.responseTxt }}</pre>
                <label>
                  <icon name='angle-right'></icon>
                </label>
              </li>
            </ol>
          </section>
        </content>
      </article>
    </transition>
    <presenter ref='response' :title='"选择适配设备"' :type='"check"' :data='respArr' @out='response'>
    </presenter>
  </main>
</template>
<script>
import inputDate from '../_common/input-date.vue'
export default {
  data() {
    return {
      seen: false,
      proj: {
        name: '',
        isover: '',
        code: '',
        index: '',
        start: '',
        end: '',
        responseTxt: '',
      },
      respArr: [
        { _id: 'desktop', name: '桌面端' },
        { _id: 'pad', name: '平板端' },
        { _id: 'mobile', name: '手机端' },
      ],
    }
  },
  methods: {
    save() {
      if (!this.proj.start ||
        !this.proj.end ||
        !this.proj.name ||
        !this.proj.code) return this.$pd.toast('请检查输入')
      this.$http.post('/api/projects/insert', {
        data: this.proj
      }).then(res => {
        if (res.body.code !== 0) return
        this.$pd.toast('添加成功')
        this.$router.back()
      });
    },
    response(res) {
      if (!res) return
      var txt = []
      this.respArr.forEach(item => {
        this.proj[item._id] = false
        res.forEach(_r => {
          if (item._id === _r._id) this.proj[item._id] = true
        })
      })
      res.forEach(_r => {
        txt.push(_r.name)
      })
      this.proj.responseTxt = txt.join(', ')
      this.proj = Object.assign({}, this.proj)
    },
  },
  mounted() {
    this.seen = true
  },
  components: {
    'input-date': inputDate
  }
}

</script>
