<template>
  <div>
    <div class='slider shade-as-card'>
<!--       <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for='item in blogs' :key='item._id' class='swiper-slide'>
          <div class="slide-mask">
            <div class='slide-title layout-h'>
              <span>{{ item.title }}</span><pre>by: {{ item.cname }}</pre>
            </div>
          </div>
          <img :src='item.cover'>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper> -->
      <banner></banner>
    </div>
    <h3></h3>
    <ul class='flow-up'>
      <dl v-for='item in blogs' :key='item._id' class='shade-as-card' @click='detail(item)'>
        <dt class="clip" type='square-m'>
          <img :src='item.cover'>
        </dt>
        <dt class='title'>{{ item.title }}</dt>
        <dt class='title'>{{ item.cdate }}</dt>
      </dl>
    </ul>
    <div v-if='isAdmin' class="float shade-as-card theme-mark blink-wave" @click='add'>
      <icon name='plus'></icon>
    </div>
    <preview :init='blog' ref='preview'></preview>
  </div>
</template>
<style scoped lang='scss'>
@import '/static/css/swiper-3.4.2.min.css';
.float {
  position: absolute;
  bottom: 1em;
  right: 2em;
  height: 4rem;
  width: 4rem;
  line-height: 4rem;
  text-align: center;
  border-radius: 50%;
}

section {
  max-width: 80rem;
}

.swiper-slide {
  max-height: 32rem;
}

.slider{
  height: 32rem;
  position: relative;
}

.slide-mask {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(rgba(117, 117, 117, 0.5), rgba(117, 117, 117, 0) 50%);
}

.slide-title {
  width: 100%;
  font-size: 1.8rem;
  padding: 1.2rem;
  color: white;
  box-sizing: border-box;
}

.slide-title pre {
  color: white;
  font-size: 1.4rem;
}

.clip {
  border: none;
  box-shadow: none;
}

.clip img {
  transition: all 0.2s ease;
  height: 100%;
  width: auto;
  max-width: inherit;
}

.swiper-slide img {
  width: 100%;
  display: block;
}

dl .title {
  padding: 0.8rem;
  box-sizing: border-box;
  text-align: center;
  line-height: 1em;
}

</style>
<script>
import preview from './blog_preview.vue'
import banner from './banner.vue'

export default {
  methods: {
    add() {
      this.$router.push('/blogs/update')
    },
    detail(data) {
      this.blog = data
      this.$refs.preview.seen = true
    },
  },
  mounted() {
    this.$http.post('/api/blogs/find').then(res => {
      this.blogs = res.body.data
      this.blogs.forEach(item => {
        item.cdate = new Date(item.cdate).Format('yyyy-MM-dd')
      })
    })
  },
  data() {
    return {
      coms: [],
      blogs: [],
      isAdmin: sessionStorage.token ? true : false,
      blog: {},
      notNextTick: true,
      swiperOption: {
        // autoplay: 3000,
        loop: true,
        grabCursor: true,
        setWrapperSize: true,
        autoHeight: true,
        pagination: '.swiper-pagination',
        mousewheelControl: true,
        observeParents: true,
        onClick: sw => {
          var index = sw.clickedSlide.getAttribute('data-swiper-slide-index')
          this.detail(this.blogs[index])
        }
      }
    }
  },
  components: {
    'preview': preview,
    'banner': banner
  },
}

</script>
