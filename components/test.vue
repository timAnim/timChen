<template>
  <div id='scroller'>
    <check-check :initData='children' ref='ckck'></check-check>
    <multi-level-drag :initData='children' ref='ckck'></multi-level-drag>
  </div>
</template>
<style scoped>
#scroller {
  height: 100%;
  overflow-y: auto;
  width: 100%;
}
</style>
<script>
import checkCheck from './_common/check-check.vue'
import multiDrag from './_common/multi-level-drag.vue'
export default {
  data() {
    var arr = [{
      name: 1,
      next: [{
        name: '1-1',
        next: [{
          name: '1-1-1',
          next: [{
            name: '1-1-1-1',
            check: true,
            next: [{
              name: 1,
              next: [{
                name: '1-1',
                next: [{
                  name: '1-1-1',
                  next: [{
                    name: '1-1-1-1',
                    check: true,
                    next: [{
                      name: 1,
                      next: [{
                        name: '1-1',
                        next: [{
                          name: '1-1-1',
                          next: [{
                            name: '1-1-1-1',
                            check: true,
                            sign:true,
                            next: []
                          }, {
                            name: '1-1-1-2',
                            check: false,
                          }]
                        }]
                      }, {
                        name: '1-2',
                      }]
                    }]
                  }, {
                    name: '1-1-1-2',
                    check: false,
                  }]
                }]
              }, {
                name: '1-2',
              }]
            }]
          }, {
            name: '1-1-1-2',
            check: false,
          }]
        }]
      }, {
        name: '1-2',
      }]
    }, {
      name: 2,
      check: true,
    }, {
      name: 3,
      check: true,
      next: [{
        name: '3-1',
      }, {
        name: '3-2',
      }]
    }]
    return {
      children: arr
    }
  },
  methods: {
    get() {
      console.log(this.$refs.ckck._list)
    }
  },
  components: {
    'check-check': checkCheck,
    'multi-level-drag': multiDrag,
  }
}

</script>
