<template>
  <div id='list' v-if='seen'>
    <example></example>
    <div class='shade-as-card doc' @click.prevent.stop='getPlatformDoc'>
      <em>平台类产品设计规范</em>
      <img src="/static/img/platform_instruction.png">
    </div>
    <div class='shade-as-card doc' @click.prevent.stop='getResponseDoc'>
      <em>响应式组件设计建议</em>
      <img src="/static/img/aboutUsBgSmall.png">
    </div>
    <button @click='up'>
      <icon name='angle-double-up'></icon>
    </button>
  </div>
</template>
<style scoped lang='scss'>
#list>.doc {
  height: 9.6rem;
  margin: 0.8rem 0;
  align-items: flex-start;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  em {
    margin: 0;
    text-indent: 1.6rem;
    color: white;
    line-height: 3.2rem;
    position: absolute;
    z-index: 10;
  }
  &:hover img {
    filter: grayscale(0%) brightness(100%);
  }
  img {
    filter: grayscale(80%) brightness(80%);
    display: block;
    transform: translateY(-50%);
    transition: filter 0.8s ease;
  }
}

button {
  position: fixed;
  right: 1.6rem;
  bottom: 1.6rem;
  height: 3.2rem;
  width: 3.2rem;
  background: #bdbdbd;
  opacity: 0.3;
  transition: opacity 0.8s ease;
}

button:hover {
  opacity: 0.6;
}

</style>
<script>
import example from './example.vue'
export default {
  data() {
    return {
      seen: false,
    }
  },
  methods: {
    up() {
      this.$pd.id('outer').scrollTop = 0;
    },
    getPlatformDoc() {
      window.location.href = '/static/files/宇通集团平台类产品设计规范 1.0.pdf'
    },
    getResponseDoc(){
      window.location.href = '/static/files/响应式组件设计建议1.0.pdf'
    }
  },
  mounted() {
    this.seen = true
  },
  components: {
    example: example
  }
}

</script>
