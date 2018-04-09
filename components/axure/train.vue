<template>
  <div class="container">
    <ul id='list' v-if='seen'>
      <li class='shade-as-card doc' @click.prevent.stop='getPPT'>
        <em>培训的讲义</em>
        <img src="/static/img/ppt.jpg">
      </li>
      <li class='shade-as-card doc' @click.prevent.stop='getResponseDoc'>
        <em>基础组件库模板</em>
        <img src="/static/img/axure.jpg">
      </li>

      <li class='shade-as-card doc' @click.prevent.stop='getFontIcon'>
        <em>FA图标字体</em>
        <img src="/static/img/faicon.png">
      </li>
    </ul>
    <h2>展示的原型</h2>
    <ul class="axures">
      <div class="shade-as-card add-btn" @click='add'>
        <icon name='plus'></icon>
      </div>
      <div @click='projectDetail(item)' v-for='item in axures' class='blink-theme shade-as-cut'>
        <li class='ctrl-bar ht-compact'>
          {{ item.name }}
        </li>
        <div class='clip'>
          <img :src= "item.cover || '/static/img/rp.jpg'">
        </div>
        <li class="ht-compact date">
          <label>
            <icon name='user'></icon>
          </label>
          <em>{{ item.cuser }}</em>
          <button type='icon' @click.stop='detail(item)'>
            <icon name='ellipsis-v'></icon>
          </button>
        </li>
      </div>
    </ul>
  </div>
</template>
<style scoped lang='scss'>
#list>.doc {
  height: 9.6rem;
  margin: 0.8rem;
  align-items: flex-start;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  flex: 0 0 calc(50% - 1.6rem);
  border-radius: 0;
  box-shadow: 0 3px 6px #bdbdbd;
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
    display: inline;
    transform: translateY(-50%);
    transition: filter 0.8s ease;
    width: 100%;
    margin: 0;

  }
}

.axures {
  .ctrl-bar {
    padding: 0 0.8rem;
    font-size: 1.4rem;
    font-weight: 800;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  >div {
    margin: 0.8rem 0.5%;
  }

  pre {
    margin-right: 0.8rem;
  }

  .clip {
    border: none;
    background: transparent;
    margin: 1.6rem;
  }

  dl {
    flex: 100%;
    background: white;
    margin: 0.4rem 1.6rem;
  }

  .add-btn {
    position: relative;
    background: #f1f8e9;
    border-radius: 0.4rem;
    cursor: pointer;

    svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(3);
      fill: #8bc34a;
    }
  }

  .date {
    font-size: 1.2rem;
    text-indent: 0.8rem;

    label {
      text-align: center;
      margin: 0 !important;
      svg {
        fill: #bdbdbd;
      }
    }

    button {
      margin: 0;
      svg {
        fill: #424242;
      }
    }
  }
}

</style>
<script>
export default {
  data() {
    return {
      seen: false,
      axures: [{}],
    }
  },
  methods: {
    add() {
      this.$pd.id('outer').scrollTop = 0;
      this.$router.push('/axure/add')
    },
    getPPT() {
      window.location.href = 'http://10.23.40.194:8080/files/axure/Axure培训.pptx'
    },
    getResponseDoc() {
      window.location.href = 'http://10.23.40.194:8080/files/proto/componentLib/基础组件线框.rplib'
    },
    getFontIcon(){
      window.location.href = 'http://10.23.40.194:8080/files/axure/fontawesome-free-5.0.9.zip'
    },
    getData() {
      this.$http.post('/api/axure/find')
        .then(response => {
          if (response.body.code !== 0) return
          console.log(response.body.data)
          this.axures = response.body.data;
        });
    },
    projectDetail(item) {
      window.location.href = item.proto
    },
    detail(item) {
      this.$router.push({
        path: '/axure/update',
        query: { _id: item._id }
      })
    }
  },
  mounted() {
    this.getData()
    this.seen = true
  }
}

</script>
