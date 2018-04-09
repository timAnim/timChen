<style scoped>
nav {
  height: 3.2rem;
  line-height: 3.2rem;
}

</style>
<template>
  <nav>
    <span class='color-light'
    v-for='nav in navs'
    :checked="nav.id===cur"
    @click='href(nav)'>
      {{ nav.name }}
    </span>
  </nav>
</template>
<script>
export default {
  props: {
    navs: {
      default:[],
    },
    cur: {
      default: '',
    }
  },
  methods: {
    href(nav) {
      this.$emit('nav', nav.id)
    },
  }
}

</script>
