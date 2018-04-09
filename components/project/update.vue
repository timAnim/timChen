<style scoped>
.cover {
  text-align: center;
  flex: 0 0 20rem;
}

dl .mo-upload {
  width: 16rem;
  margin: 0.8rem auto;
}

.files .mo-upload {
  flex: 0 0 6rem;
}

</style>
<template>
  <transition name='slide' mode='out-in' duration='100'>
    <section>
      <ol class='shade-as-card pd-normal' type='expand'>
        <dl>
          <dd class='cover'>
            <upload @complete='setCover'>
              <img :src="proj.cover||'/static/img/img01.jpg'">
            </upload>
          </dd>
          <dd>
            <li>
              <em char='6'>项目代号</em>
              <em>{{proj.code}}</em>
            </li>
            <li>
              <em char='6'>项目名</em>
              <input-text :icon='"suitcase"' :placeholder='"最多20个字"' v-model='proj.name'></input-text>
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
          </dd>
        </dl>
      </ol>
      <li type='filter'>
        <em char='6'>项目文档</em>
      </li>
      <ol class="shade-as-card files pd-normal" type="expand">
        <li>
          <em char='6'>资料</em>
          <input-file v-model='proj.material' :placeholder='"输入URL"'></input-file>
        </li>
        <li>
          <em char='6'>原型</em>
          <input-file-zip v-model='proj.proto' type="proto" :code='proj.code'></input-file-zip>
        </li>
        <li>
          <em char='6'>设计</em>
          <input-file-zip v-model='proj.design' :code='proj.code' type="design"></input-file-zip>
        </li>
        <li>
          <em char='6'>研发</em>
          <input-text :icon='"code"' :placeholder='"网址"' v-model='proj.develop'></input-text>
        </li>
        <li>
          <em char='6'>正式</em>
          <input-text :icon='"home"' :placeholder='"网址"' v-model='proj.product'></input-text>
        </li>
      </ol>
      <presenter ref='del' :title='"确认删除项目？"' :type='"confirm"' @out='del'>
      </presenter>
      <presenter ref='response' :title='"选择适配设备"' :type='"check"' :data='respArr' @out='response'>
      </presenter>
    </section>
  </transition>
</template>
<script>
import inputDate from '../_common/input-date.vue'
import inputFile from '../_common/input-file.vue'
import inputFileZip from '../_common/input-file-zip.vue'
export default {
  data() {
    return {
      seen: false,
      proj: {
        name: '',
        isover: '',
        responseTxt: '',
        material: '',
        proto: '',
        design: '',
        product: '',
        develop: '',
      },
      isAdmin: sessionStorage.token ? true : false,
      code: '',
      respArr: [
        { _id: 'desktop', name: '桌面端' },
        { _id: 'pad', name: '平板端' },
        { _id: 'mobile', name: '手机端' },
      ],
    }
  },
  methods: {
    init() {
      this.$http.post('/api/projects/find', {
        code: this.code
      }).then(res => {
        if (res.body.code !== 0) return
        for (var prop in res.body.data) {
          this.$set(this.proj, prop, res.body.data[prop])
        }
        this.proj.start = new Date(this.proj.start).Format('yyyy-MM-dd')
        this.proj.end = new Date(this.proj.end).Format('yyyy-MM-dd')
        var txt = []
        if (this.proj.desktop) txt.push('桌面端')
        if (this.proj.mobile) txt.push('手机端')
        if (this.proj.pad) txt.push('平板')
        this.proj.responseTxt = txt.join(', ')
      });
    },
    del(res) {
      if (!res) return
      this.$http.post('/api/projects/remove', {
        code: this.code
      }).then(res => {
        if (res.body.code !== 0) return
        this.$pd.toast('删除成功')
        this.$router.replace('/projects')
      });
    },
    save() {
      if (!this.proj.start ||
        !this.proj.end ||
        !this.proj.name ||
        !this.proj.code) return this.$pd.toast('请检查输入')
      var self = this
      self.$http.post('/api/projects/update', {
        data: self.proj
      }).then(res => {
        if (res.body.code !== 0) return
        self.$pd.toast('修改成功')
        self.init()
      })
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
    setCover(ev) {
      this.$set(this.proj, 'cover', ev.resPath)
    }
  },
  mounted() {
    this.seen = true
    this.code = this.$route.query.code
    this.init()
  },
  components: {
    'input-file': inputFile,
    'input-date': inputDate,
    'input-file-zip': inputFileZip,
  }
}

</script>
