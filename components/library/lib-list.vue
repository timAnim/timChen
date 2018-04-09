<template>
  <div id='container'>
    <iframe id='frame' src="http://10.23.40.194:8080/files/proto/componentLib/start.html"></iframe>
    <div id="download-panel" class="theme-dark radius-m" @click='download'>
      <icon name="download"></icon><span class="ft-big">下载组件库</span>
    </div>
  </div>
</template>
<style scoped lang='scss'>
#frame {
  height: 100%;
  width: calc(100% + 55px);
  position: absolute;
  left: 0;
  top: 0;
  border: none;
  margin-left: -55px;
}

#container {
  position: fixed;
  overflow: hidden;
}

#download-panel {
  position: absolute;
  height: 60px;
  width: 220px;
  cursor: pointer;
  line-height: 56px;
  text-align: center;
  left: 10px;
  top: 10px;
}

</style>
<script>
export default {
  methods: {
    download(e) {
      window.location.href = 'http://10.23.40.194:8080/files/proto/componentLib/基础组件线框.rplib'
    },
    add() {
      this.$router.push('/interacts/add')
    },
    onclose(res) {
      this.$router.replace({ path: this.$route.path, query: {} })
    },
    resizeHdl() {
      var outer = document.getElementById('outer'),
        con = document.getElementById('container');

      con.style.height = outer.clientHeight + 'px';
      con.style.width = outer.clientWidth + 'px';
      con.style.left = outer.offsetLeft + 8 +'px';
      con.style.top = outer.offsetTop + 8 +'px';
      con.style.marginLeft = -8 + 'px';
      con.style.marginTop = -8 + 'px';
    }
  },
  mounted() {
    this.resizeHdl()
    window.onresize = this.resizeHdl
  },
  update(){
    this.resizeHdl()
  }

}

</script>
