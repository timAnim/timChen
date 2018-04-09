<template>
  <div class='outer layout-h'>
    <span class='input'>
      <input type="text" @focus='show' @blur='hide' v-model='input'>
      <button class='add theme-mark' @click='confirm'>
        <icon name='arrow-right'></icon>
      </button>
    </span>
    <pre id='_pre' v-if='tags.length>0'>
      <span v-for='(tag,i) in tags' class='tag in-pop' @click='remove(i)'>
        {{ tag.txt }}
        <span><icon name='times'></icon></span>
      </span>
    </pre>
    <transition name='opacity'>
      <div class='hint' v-if='presetSeen'>
        <div class='title'>推荐标签</div>
        <span v-for='tag in presets' @click='addTag(tag)' class='blink-theme preset'>{{ tag.txt }}</span>
      </div>
    </transition>
    <transition name='opacity'>
      <div class='hint' v-if='searchSeen'>
        <div class='title'>搜索建议</div>
        <div v-for='tag in searchs' @click='addTag(tag)' class='blink-theme'>
          {{ tag.txt }}
        </div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
.outer {
  line-height: 4rem;
  height: 4rem;
  position: relative;
}

.hint {
  position: absolute;
  display: block;
  background: #fafafa;
  line-height: 2em;
  top: 100%;
  z-index: 999;
  box-shadow: 0 1px 3px #9e9e9e;
  padding: 0.8rem;
  box-sizing: border-box;
  border-radius: 0.2rem;
  margin-top: 0.1rem;
  width: 100%;
}

.input {
  position: relative;
  flex: auto;
}

#_pre {
  text-align: left;
  margin-left: 0.8rem;
  box-sizing: border-box;
  flex: none;
}

.input input {
  background: #fafafa;
  border-radius: 1.2rem;
  padding: 0.6rem;
  border: 0.1rem solid #eee;
  width: 100%;
  margin-top: -0.1rem;
}

.input input:focus {
  box-shadow: 0 1px 3px #9e9e9e;
  border-color: transparent;
}

.add {
  position: absolute;
  background: transparent;
  height: 2.4rem;
  width: 2.4rem;
  border-radius: 50%;
  border: none;
  right: 0;
  top: 50%;
  margin-top: -1.2rem;
}

.add svg {
  transform: scale(0.8);
  margin-bottom: -0.1rem;
  margin-right: -0.25rem;
}

.tag {
  margin: 0 0.2rem;
  padding: 0.4rem;
  color: #212121;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  border-radius: 0.2rem;
  display: inline-block;
  box-sizing: border-box;
  line-height: 1.2em;
}

.tag svg {
  transform: scale(0.6);
  transition: transform 0.4s ease;
  fill: #9e9e9e;
}

.tag:hover svg {
  transform: scale(0.6) rotate(180deg);
}

.title {
  color: #9e9e9e;
  font-size: 12px;
}

.preset {
  padding: 0 1.2rem;
  border-radius: 0.2rem;
  border: 1px solid #e0e0e0;
  margin: 0.2rem;
  display: inline-block;
  height: 2.4rem;
  line-height: 2.4rem;
}

</style>
<script>
export default {
  props: ['preset', 'search'],
  data() {
    return {
      input: '',
      tags: [],
      presetSeen: false,
      searchSeen: false,
      presets: JSON.parse(JSON.stringify(this.preset)) || [],
      searchs: JSON.parse(JSON.stringify(this.search)) || []
    }
  },
  methods: {
    confirm(ev) {
      if (!this.input) return
      this.tags.push({
        txt: this.input
      })
    },
    addTag(tag) {
      this.tags.push(tag)
    },
    remove(i) {
      this.tags.splice(i, 1)
    },
    show() {
      if (this.input) {
        this.presetSeen = false
        this.searchSeen = true
      } else {
        this.presetSeen = true
        this.searchSeen = false
      }
    },
    hide() {
      this.presetSeen = this.searchSeen = false
    }
  },
  watch: {
    input(_n) {
      this.show()
    },
    preset(_n) {
      console.log(_n)
      this.presets = JSON.parse(JSON.stringify(_n))
    },
    search(_n) {
      this.searchs = JSON.parse(JSON.stringify(_n))
    }
  },
}

</script>
