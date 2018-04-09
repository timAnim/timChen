<template>
  <div class='outer layout-h' :class="{'icon':icon}">
    <input type="text" :value='value' @input.stop.prevent='input' @change.prevent.stop='valid(value)'>
    <span class='placeholder' v-if='placeholder' :alert='invalid'>{{ placeholder }}</span>
    <icon :name='icon' v-if='icon' class='label'></icon>
    <button class='clear' @click.stop.prevent='clear'>
      <icon name='times-circle'></icon>
    </button>
    <!-- <hr class='highlight'> -->
  </div>
</template>
<style scoped>
.outer {
  position: relative;
}

input::-webkit-search-cancel-button {
  display: none;
}

input {
  padding: 0 0.8rem 0 3.2rem;
}

.outer>.label {
  position: absolute;
  left: 0.8rem;
  fill: #e0e0e0;
  transition: all 0.4s ease;
  transform: scale(0.8);
}

.clear {
  position: absolute;
  height: 2.4rem;
  width: 2.4rem;
  border-radius: 50%;
  right: 0.1rem;
  top: 50%;
  margin-top: -1.2rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.clear svg {
  margin-bottom: -0.2rem;
  fill: #bdbdbd;
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

input:valid~button {
  opacity: 1;
}

input:hover~.label,
input:focus~.label {
  fill: #9e9e9e;
}


/*.highlight{
  border-bottom: 2px solid #8bc34a;
  position: absolute;
  bottom: 0;
  margin-bottom: -0.2rem;
  left: 50%;
  right: 50%;
  transition: all 0.3s ease;
}

input:hover~.highlight,
input:focus~.highlight {
  left: 1.6rem;
  right: 1.6rem;
}*/

</style>
<script>
export default {
  props: ['icon', 'placeholder', 'value', 'max', 'reg'],
  data() {
    return {
      invalid: false,
    }
  },
  methods: {
    clear(ev) {
      this.$emit('input', '')
      this.invalid = false
    },
    input(ev) {
      this.$emit('input', ev.target.value)
    },
    valid(_v) {
      var valid = new RegExp(this.reg).test(_v);
      this.invalid = !valid
    }
  },
  mounted() {
    var inp = this.$pd.find('input', this.$el)
    inp.setAttribute('spellcheck', false)
    inp.setAttribute('required', 'required')
  },
}

</script>
