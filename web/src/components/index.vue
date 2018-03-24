<template>
  <article pt>
    <li class="head" pt>
      <span>tim</span>
    </li>
    <header>
      <section>
        <li pt>
          <nav @click='$router.push("/blogs/upadd")'>新建</nav>
          <nav @click='test'>test</nav>
          <nav>dd</nav>
          <nav>dd</nav>
        </li>
      </section>
    </header>
    <content id='scroller'>
      <section>
        <h3 pt></h3>
        <div class='outer' shade='card'>
          <swiper :options="swiperOption" class="swiper-box">
            <swiper-slide class="swiper-item" v-for='item in banners'>
              <img :src="item" class='swiper-img'>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <h3 pt></h3>
        <ul pt>
          <dl v-for='item in populars' @click.prevent='find(item._id)'>
            <dt class='blog-title'>{{item.title}}</dt>
            <img :src="item.cover" class='blog-img'>
          </dl>
        </ul>
        <h3 pt></h3>
        <ol pt>
          <li v-for='item in blogs' @click.prevent='find(item._id)'>
            <div class='cliper' :style='"background-image:url(" +item.cover+ ")"'></div>
            <em>{{item.title}}</em>
            <pre>{{item.content}}</pre>
          </li>
        </ol>
        <h3 pt></h3>
      </section>
    </content>
  </article>
</template>
<style scoped lang='scss'>
@import 'static/paratag/config.scss';
#textarea {
  margin: 0;
  padding: $padding-half;
  padding-left: $padding-normal*2;
  line-height: $height-low;
}

.outer {
  height: 32rem;
  overflow: hidden;
  position: relative;
  background: white;
}

.swiper-wrapper {
  overflow: hidden;
}

.swiper-img {
  width: 100%;
  height: auto;
  transform: translateY(-50%);
}

.swiper-item {
  text-align: center
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
  overflow-y: auto;
}

.cliper {
  flex: 0 0 4.8rem;
  overflow: hidden;
  height: 100%;
  background-size: cover;
  background-position: 50% 50%;
}

nav {
  flex: 0 0 6.4rem;
}

ol>li {
  cursor: pointer;
}

.head{
  flex-basis: 3.2rem;
  line-height: 3.2rem;
  background: #212121;
  color: white;
}

</style>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Scroller from './../../static/predev/Scroller.js'
require('swiper/dist/css/swiper.css')

export default {
  data() {
    return {
      banners: ['static/img/u23.jpg', 'static/img/u25.jpg', 'static/img/u27.jpg', 'static/img/u29.jpg'],
      swiperOption: {
        pagination: '.swiper-pagination',
        direction: 'horizontal',
        slidesPerView: 1,
        paginationClickable: true,
        mousewheelControl: true
      },
      blogs: [],
      populars: []
    }
  },
  mounted() {
    // this.scroller = new Scroller('#scroller')
    this.list()
    // setTimeout(ev => {
    //   this.scroller.refresh()
    // }, 1000)
  },
  updated() {
    // this.scroller.refresh()
  },
  methods: {
    list() {
      this.$http.post('/api/blogs/list')
        .then(res => {
          this.blogs = res.body
          this.populars = res.body.slice(0, 4)
        })
    },
    find(_id) {
      this.$router.push({ path: '/blogs/upadd', query: { _id: _id } })
    },
    remove(_id) {
      this.$http.post('/api/blogs/remove', {
        _id: _id
      }).then(res => {
        this.pd.toast('删除成功')
        this.list()
      })
    },
    test() {
      this.$http.post('/api/blogs/list')
      .then(res => {
        console.log(res)
      })
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  components: {
    swiper,
    swiperSlide
  },
}

</script>
