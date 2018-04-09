<template>
  <transition name='slide'>
    <div class="mask" v-if='seen' @click='close'>
      <article>
        <content id='mask-outer'>
          <section>
            <ol class='shade-as-card shade-as-list' @click.stop>
              <li type='filter'>
                <button @click='close' id='back-btn'>
                  <icon name='chevron-down'></icon>
                </button>
                <h1>{{ init.title }}</h1>
                <button id='edit-btn' @click='edit' v-if='isAdmin'>
                  <icon name='cog'></icon>
                </button>
              </li>
              <div id='_img'>
                <img id='cover' :src='init.cover'>
              </div>
              <div id='_con' v-html='init.content'></div>
            </ol>
          </section>
        </content>
      </article>
    </div>
  </transition>
</template>
<style scoped>
#_con {
  padding: 1.6rem;
  line-height: 2em;
}

li>button {
  height: 4.8rem;
  border-radius: 0;
  margin: 0;
  background: none;
  border: none;
  flex-basis: 4.8rem;
}

#back-btn {
  margin-right: 0.8rem;
  border-right: 1px solid #e0e0e0;
}

#edit-btn {
  border-left: 1px solid #e0e0e0;
}

section {
  max-width: 516px;
}

div {
  overflow: hidden;
}

content {
  padding: 1.6rem;
}

p {
  padding: 0.8rem;
}

#_img>img {
  margin: 8px auto;
  display: block;
}

#_chart {
  height: 240px;
  width: 100%;
}

h1 {
  font-size: 1.75rem;
  font-weight: 800;
}

#_dlg img {
  position: absolute;
  transition: all 0.4s linear;
}

article {
  background: transparent;
}

.shade-as-card {
  box-shadow: 0 1px 3px black;
}

</style>
<script>
export default {
  props: ['init'],
  methods: {
    close(ev) {
      this.seen = false
    },
    edit() {
      if (!this.isAdmin) return this.$pd.toast('请登录')
      this.$router.push('/blogs/update?_id=' + this.init._id)
    }
  },
  data() {
    return {
      seen: false,
      isAdmin: sessionStorage.token ? true : false
    }
  },
}

</script>
