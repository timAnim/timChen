<template>
  <transition name='slide'>
    <div class="mask" v-if='seen'>
      <div id="viewer_outer">
        <div class="container">
          <button id='close-btn' class="shade-as-card" @click='$emit("close")'>
            <icon name='times-circle'></icon>
          </button>
          <span v-for='word in data' @click='ontap' :data-clipboard-text='word.words'>
          {{ word.words }}
        </span>
        </div>
      </div>
      <input type="text" id='middle'>
    </div>
  </transition>
</template>
<style scoped>
.mask {
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
}

#viewer_outer {
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: relative;
  padding: 1.6rem 0;
  box-sizing: border-box;
  border-radius: 0.4rem;
}

.container {
  height: 100%;
  max-width: 60rem;
  background-color: white;
  margin: 0 auto;
  padding: 0.8rem;
  box-sizing: border-box;
  position: relative;
}

#viewer_outer span {
  padding: 0.4rem 0.8rem;
  background-color: #dcedc8;
  margin: .4rem;
  display: inline-block;
  cursor: pointer;
  border-radius: 0.4rem;
  transition: all 0.1s ease;
}

#viewer_outer span:hover {
  color: white;
  background-color: #8bc34a;
}

#close-btn {
  width: 3.2rem;
  height: 3.2rem;
  line-height: 3.2rem;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 0;
  margin-top: -1.6rem;
  margin-right: -1.6rem;
  z-index: 9999;
}

#close-btn svg {
  transform: scale(1.6);
}

#middle {
  display: none
}

</style>
<script>
import Clipboard from 'clipboard'
export default {
  props: {
    data: {
      default: '""'
    },
    seen: {
      default: false
    }
  },
  methods: {
    ontap(ev) {
      this.$pd.toast('文字已复制到剪切板')
    }
  },
  updated() {
    try {
      var con = document.getElementById('viewer_outer')
      var arr = con.getElementsByTagName('span')
      for (var i = arr.length - 1; i >= 0; i--) {
        new Clipboard(arr[i])
      }
    } catch (err) {

    }
  },
}

</script>
