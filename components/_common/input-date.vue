<template>
  <div class='outer layout-h icon'>
    <input type="date" :value='value' @input='input'>
    <icon name='calendar' class='label'></icon>
    <button class='open'>
      <icon name='chevron-circle-down'></icon>
    </button>
  </div>
</template>
<style scoped>
.outer {
  position: relative;
}

::-webkit-inner-spin-button,
::-webkit-clear-button {
  display: none;
}

::-webkit-calendar-picker-indicator {
  height: 2rem;
  width: 2rem;
  opacity: 0;
  position: absolute;
  right: 0;
}

::-webkit-datetime-edit-text {
  color: #bdbdbd;
  padding: 0 0.2rem;
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

.open {
  position: absolute;
  height: 2.4rem;
  width: 2.4rem;
  border-radius: 50%;
  right: 0.1rem;
  top: 50%;
  margin-top: -1.2rem;
  opacity: 1;
  pointer-events: none;
}

.open svg {
  margin-bottom: -0.2rem;
  fill: #bdbdbd;
  transition: all 0.4s ease;
}

input:hover~.label,
input:focus~.label {
  fill: #9e9e9e;
}

input:hover~.open svg,
input:focus~.open svg {
  fill: #8bc34a;
}

</style>
<script>
export default {
  props: ['value', 'max'],
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
  },
  mounted() {
    var inp = this.$pd.find('input', this.$el)
    inp.setAttribute('spellcheck', false)
    inp.setAttribute('required', 'required')
  },
}

</script>
