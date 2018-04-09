<style scoped>
section {
  max-width: 60rem;
}

.shade-as-card {
  padding: 0.8rem;
}

.mo-upload {
  text-align: center;
}

.mo-upload img {
  height: 9.6rem;
  width: auto;
  margin: 0.8rem auto;
}

.zip {
  position: relative;
}

.zip input {
  padding-left: 3.2rem;
}

.zip>.label {
  position: absolute;
  left: 0.8rem;
  fill: #e0e0e0;
  transition: all 0.4s ease;
  transform: scale(0.8);
}

.zip .upload {
  position: absolute;
  height: 2.4rem;
  width: 5.6rem;
  border-radius: 1.2rem;
  right: 0.1rem;
  top: 50%;
  margin-top: -1.2rem;
  opacity: 1;
}

.zip .upload svg {
  margin-bottom: -0.2rem;
  fill: white;
}

.zip input[type="file"] {
  display: none;
}

.zip input:hover~.label,
.zip input:focus~.label {
  fill: #9e9e9e;
}

.zip .placeholder {
  position: absolute;
  left: 3.2rem;
  transition: all 0.4s ease;
  line-height: 2.4rem;
  color: #bdbdbd;
  pointer-events: none;
  top: 0;
}

.zip .placeholder[alert=true] {
  color: #ff9800;
}

.zip .placeholder[alert=true]~.label {
  fill: #ff9800;
}

.zip input:focus~.placeholder,
.zip input:valid~.placeholder {
  top: 100%;
  margin-top: -0.2rem;
  left: 0.8rem;
  transform: scale(0.8);
  transform-origin: left top;
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
              <h1>{{ name }}</h1>
              <button type='neg' @click='save'>
                <icon name='save'></icon>
              </button>
            </li>
          </section>
        </header>
        <content>
          <section>
            <ol class='shade-as-card' type='expand'>
              <upload @complete='setCover' :size='240'>
                <img :src="cover||'/static/img/rp.jpg'">
              </upload>
              <li>
                <em char='6'>项目名</em>
                <input-text v-model='name' :icon='"suitcase"' :placeholder='"最多10个字"' :max='20'>
                </input-text>
              </li>
              <li>
                <em char='6'>用户</em>
                <input-text v-model='cuser' :icon='"suitcase"' :placeholder='"最多10个字"' :max='20'>
                </input-text>
              </li>
              <li>
                <em char='6'>原型</em>
                <div class='outer layout-h icon zip'>
                  <input type="text" :value='proto' spellcheck="false" disabled="disabled" placeholder="请压缩成zip格式上传">
                  <icon name='file' class='label'></icon>
                  <button class='upload theme-mark' @click='select'>
                    <icon name='upload'></icon>
                  </button>
                  <input type="file" :id='cid' :accept="accepts" @change="upload">
                </div>
              </li>
              <h3></h3>
            </ol>
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
      name: '',
      cuser: '',
      cover: '',
      proto: '',
      accepts: {
        type: String,
        default: 'zip'
      },
      type: {
        type: String,
      },
      invalid: false,
      cid: this.$pd.randId(4),
    }
  },
  methods: {
    save() {
      if (!this.name ||
        !this.cuser ||
        !this.proto) return this.$pd.toast('请检查输入');
      var self = this;
      this.$http.post('/api/axure/update', {
        data: {
          _id: self._id,
          name: self.name,
          cuser: self.cuser,
          cover: self.cover,
          proto: self.proto,
        }
      }).then(res => {
        if (res.body.code !== 0) return
        this.$pd.toast('修改成功')
      });
    },
    setCover(ev) {
      this.$set(this, 'cover', ev.resPath)
    },
    upload(event) {
      this.$pd.toast('请稍后，不要离开页面')
      let file = event.target.files[0]
      const self = this
      const formData = new FormData()
      if (!file || !self.cuser) return this.$pd.toast('请先输入姓名')

      formData.append('file', file)
      formData.append('cuser', self.cuser)

      self.$http.post('/api/axure/zip', formData, {
          progress(event) {
            self.$emit('progress', parseFloat(event.loaded / event.total * 100))
          }
        })
        .then(res => {
          if (res.body) {
            self.$set(self, 'proto', res.body.entrance)
            self.$pd.toast('上传成功')
            event.target.value = null
          } else {
            self.$emit('complete', 500, result)
          }
        }, error => self.$emit('complete', 500))
    },
    select() {
      this.$pd.id(this.cid).click()
    },
    getData() {
      this.$http.post('/api/axure/find', {
          _id: this.$route.query._id
        })
        .then(response => {
          if (response.body.code !== 0) return
          var data = response.body.data;
          this._id = data._id;
          this.name = data.name;
          this.proto = data.proto;
          this.cuser = data.cuser;
          this.cover = data.cover;
        });
    },
  },
  mounted() {
    this.getData();
    this.seen = true

  }
}

</script>
