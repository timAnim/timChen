<template>
  <div class='outer layout-h icon'>
    <input type="text" :value='value' @input='input' spellcheck="false">
    <icon name='file' class='label'></icon>
    <span class='placeholder' v-if='placeholder' :alert='invalid'>{{ placeholder }}</span>
    <button class='upload theme-mark' @click='select'>
      <icon name='upload'></icon>
    </button>
    <input type="file" :id='cid' :accept="accepts" @change="upload">
  </div>
</template>
<style scoped>
.outer {
  position: relative;
}

.icon input {
  padding-left: 3.2rem;
}

.outer>.label {
  position: absolute;
  left: 0.8rem;
  fill: #e0e0e0;
  transition: all 0.4s ease;
  transform: scale(0.8);
}

.upload {
  position: absolute;
  height: 2.4rem;
  width: 5.6rem;
  border-radius: 1.2rem;
  right: 0.1rem;
  top: 50%;
  margin-top: -1.2rem;
  opacity: 1;
}

.upload svg {
  margin-bottom: -0.2rem;
  fill: white;
}

input[type="file"] {
  display: none;
}

input:hover~.label,
input:focus~.label {
  fill: #9e9e9e;
}

.placeholder {
  position: absolute;
  left: 3.2rem;
  transition: all 0.4s ease;
  line-height: 2.4rem;
  color: #bdbdbd;
  pointer-events: none;
  top: 0;
}

.placeholder[alert=true] {
  color: #ff9800;
}

.placeholder[alert=true]~.label {
  fill: #ff9800;
}

input:focus~.placeholder,
input:valid~.placeholder {
  top: 100%;
  margin-top: -0.2rem;
  left: 0.8rem;
  transform: scale(0.8);
  transform-origin: left top;
}

</style>
<script>
export default {
  props: {
    value: {
      default: null
    },
    accepts: {
      type: String,
      default: 'image/jpeg,image/jpg,image/png,image/gif'
    },
    flag: [String, Number], //当前上传标识,以便于在同一个监听函数中区分不同的上传域
    maxSize: {
      type: Number,
      default: 0
    },
    placeholder: {
      default: false
    }
  },
  data() {
    return {
      invalid: false,
      cid: this.$pd.randId(4),
    }
  },
  methods: {
    input(ev) {
      this.$emit('input', ev.target.value)
    },
    upload(event) {
      let file = event.target.files[0]
      const self = this
      const flag = this.flag
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        self.$http.post('/api/upload/file', formData, {
            progress(event) {
              self.$emit('progress', parseFloat(event.loaded / event.total * 100), flag)
            }
          })
          .then(res => {
            if (res.body) {
              self.$emit('input', res.body.resPath)
              self.$pd.toast('上传成功')
              event.target.value = null
            } else {
              self.$emit('complete', 500, result, flag)
            }
          }, error => self.$emit('complete', 500), flag)
      }
    },
    select() {
      this.$pd.id(this.cid).click()
    }
  },
  mounted() {
    var inp = this.$pd.find('input', this.$el)
  },
}

</script>
