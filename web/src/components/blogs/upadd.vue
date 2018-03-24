<template>
  <article pt>
    <header>
      <section>
        <li pt>
          <button class='back-btn' @click='$router.go(-1)'>
            <icon name='chevron-left'></icon>
          </button>
          <h1>我的博客</h1>
          <button class='back-btn' @click='remove'>
            <icon name='trash'></icon>
          </button>
          <button class='back-btn' @click='save'>
            <icon name='save'></icon>
          </button>
        </li>
      </section>
    </header>
    <content id='scroller'>
      <section>
        <h3 pt></h3>
        <ol pt>
          <li>
            <label>标题</label>
            <input type="text" name="title" v-model='blog.title'>
          </li>
        </ol>
        <h3 pt></h3>
        <ul pt class='pd-half shade-card'>
          <textarea id='content' v-model='blog.content'></textarea>
        </ul>
        <h3 pt></h3>
        <ol pt>
          <li>
            <label>选择封面</label>
            <input type="text">
            <button @click='selectFile'>
              <icon name='image'></icon>
            </button>
            <input type="file" id="file-selector" @change='upload' accept="image/gif, image/jpeg">
          </li>
          <div id='img-preview'><img :src="blog.cover"></div>
        </ol>
      </section>
    </content>
  </article>
</template>
<style scoped lang='scss'>
@import 'static/paratag/config.scss';
input[type=file] {
  display: none;
}

textarea {
  margin: 0;
  height: 10rem;
  display: block;
  flex: 0 0 100%;
  border: none;
  box-shadow: none;
}

.pd-half {
  padding: 1.6rem;
}

.outer {
  height: 32rem;
  overflow: hidden;
  position: relative;
  background: white;
}

header button {
  flex: 0 0 4.8rem;
  height: 4.8rem;
}

.blog-title {
  height: 2.4rem;
  line-height: 2.4rem;
  position: absolute;
  padding: 0 0.8rem;
  color: white;
}

.blog-img {
  display: block;
  width: 100%;
  height: auto;
}

content {
  position: relative;
  overflow-y: hidden;
}

nav {
  flex: 0 0 6.4rem;
}

#img-preview {
  height: 10rem;
  line-height: 10rem;
  overflow: hidden;
  display: block;
}

#img-preview img {
  height: 100%;
  width: auto;
}

</style>
<script>
export default {
  data() {
    return {
      blog: {
        title: '新的博客',
        content: '内容',
        cover: '',
      }
    }
  },
  mounted() {
    let _id = this.$route.query._id
    if (typeof(_id) === 'undefined') {
      this.blog = {
        title: '新的博客',
        content: '内容',
        cover: '',
        _id: '',
      }
    } else {
      this.$http.post('/api/blogs/find', { _id: _id })
        .then(res => {
          this.blog = res.body
        })
    }
  },
  methods: {
    save() {
      this.$http.post('/api/blogs/upadd', {
        blog: {
          _id: this.blog._id,
          title: this.blog.title,
          content: this.blog.content,
          cover:this.blog.cover
        }
      }).then(res => {
        this.pd.toast('操作成功')
        this.$router.go(-1)
      })
    },
    selectFile() {
      this.pd.id('file-selector').click()
    },
    remove() {
      this.$http.post('/api/blogs/remove', {
        _id: this.blog._id
      }).then(res => {
        this.pd.toast('删除成功')
        this.$router.go(-1)
      })
    },
    upload(event) {
      let file = event.target.files[0]
      if (!file) return
      var formData = new FormData()
      formData.append('file', file)
      this.pd.toast('上传中...')
      this.$http.post('/api/files/upload', formData)
        .then(res => {
          var result = res.body
          if (!result) return
          this.blog.cover = res.body
          this.pd.toast('上传成功')
          event.target.value = null
        })
    }
  },
}

</script>
