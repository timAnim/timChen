<style scoped>
nav {
  height: 3.2rem;
  line-height: 3.2rem;
}

nav>*[checked=checked] {
  border-top: none;
  border-bottom: 0.3rem solid #8bc34a;
}

nav>*[hidden]{
  display: none;
}

</style>
<template>
  <nav>
    <span class='color-light' v-for='nav in navs' :checked="nav.id===cur" :hidden='nav.hidden' @click='href(nav)'>
      {{ nav.name }}
    </span>
  </nav>
</template>
<script>
export default {
  props: {
    navs: {
      default: [],
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
