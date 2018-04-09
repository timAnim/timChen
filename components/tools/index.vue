<template>
  <section>
    <ul>
      <dl class="gray">
        <dd>图片转文字</dd>
        <dt class='outer icon'>
          <textarea @drop.prevent='ocr' @click='select' id='ocr'></textarea>
          <div class="label">
            <icon name='image'></icon>
          </div>
          <div class='hint'>点击上传或拖拽到此区域</div>
          <input type="file" @change.prevent="ocr" name='ocr'>
        </dt>
      </dl>
      <dl class="gray">
        <dd>票据识别</dd>
        <dt class='outer icon'>
          <textarea @drop.prevent='receipt' @click='select' id='receipt'></textarea>
          <div class="label">
            <icon name='drivers-license-o'></icon>
          </div>
          <div class='hint'>点击上传或拖拽到此区域</div>
          <input type="file" @change.prevent="receipt" name='receipt'>
        </dt>
      </dl>
    </ul>
    <h3></h3>
    <ul>
      <dl class="gray">
        <dd>菜品识别</dd>
        <dt class='outer icon'>
          <textarea @drop.prevent='dish' @click='select' id='dish'></textarea>
          <div class="label">
            <icon name='cutlery'></icon>
          </div>
          <div class='hint'>点击上传或拖拽到此区域</div>
          <input type="file" @change.prevent="dish" name='dish'>
        </dt>
      </dl>
      <dl class="gray">
        <dd>乘用车识别</dd>
        <dt class='outer icon'>
          <textarea @drop.prevent='car' @click='select' id='car'></textarea>
          <div class="label">
            <icon name='car'></icon>
          </div>
          <div class='hint'>点击上传或拖拽到此区域</div>
          <input type="file" @change.prevent="car" name='car'>
        </dt>
      </dl>
      <dl class="gray">
        <dd>动物识别</dd>
        <dt class='outer icon'>
          <textarea @drop.prevent='animal' @click='select' id='animal'></textarea>
          <div class="label">
            <icon name='paw'></icon>
          </div>
          <div class='hint'>点击上传或拖拽到此区域</div>
          <input type="file" @change.prevent="animal" name='animal'>
        </dt>
      </dl>
      <dl class="gray">
        <dd>植物识别</dd>
        <dt class='outer icon'>
          <textarea @drop.prevent='plant' @click='select' id='plant'></textarea>
          <div class="label leaf">
            <icon name='leaf'></icon>
          </div>
          <div class='hint'>点击上传或拖拽到此区域</div>
          <input type="file" @change.prevent="plant" name='plant'>
        </dt>
      </dl>
    </ul>
    <h3></h3>
    <ol class="shade-as-cut pd-half">
      <li type='filter'><em>周报</em>
        <button>
          <span>第 {{ curWeek }} 周</span>
        </button>
        <button @click='getWeekReport'>
          <span>保存</span>
        </button>
      </li>
      <ul v-for='(list,index) in taskList' class='item-card'>
        <dl class='main-part'>
          <li class='ht-high'>
            <input-text icon='tasks' placeholder='本周项目' v-model='list.project'></input-text>
            <input-text icon='flag' placeholder='完成状态' v-model='list.state'></input-text>
          </li>
          <li class='ht-high'>
            <input-text icon='check' placeholder='下周计划' v-model='list.plan'></input-text>
            <input-text icon='info' placeholder='存在问题' v-model='list.problem'></input-text>
          </li>
        </dl>
        <dl class='seco-part'>
          <li class='ht-high'>
            <button type='icon' @click='delTask($event,index)'>
              <icon name='minus-circle'></icon>
            </button>
            <button type='icon' @click='addTask($event,index)'>
              <icon name='plus-circle'></icon>
            </button>
          </li>
        </dl>
      </ul>
    </ol>
    <loading :show='loading'></loading>
    <text-viewer :data='json' :seen='storyBoard' @close='storyBoard=false'></text-viewer>
  </section>
</template>
<style scoped>
dl {
  flex: 1 1 10rem;
  margin: 0 0.8rem;
  border-radius: 4px;
  overflow: hidden;
}

dl:first-child {
  margin-left: 0;
}

dl:last-child {
  margin-right: 0;
}

dd {
  padding: 0.4rem 0.8rem;
  color: white;
}

dd label {
  display: inline-block;
  float: right;
  cursor: pointer;
  color: white;
}

textarea {
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 0;
  left: 0;
  top: 0;
  cursor: pointer;
  z-index: 99;
}

.outer {
  position: relative;
}

.outer>.label {
  line-height: 6rem;
}

.outer>.label svg {
  transform: scale(2);
}

.upload {
  position: absolute;
  height: 2.4rem;
  width: 5.6rem;
  border-radius: 1.2rem;
  right: 0.1rem;
  top: 50%;
  margin-top: -1.2rem;
  opacity: 1;
}

.upload svg {
  margin-bottom: -0.2rem;
  fill: white;
}

input[type="file"] {
  display: none;
}

.task-input button {
  border-radius: 50%;
  height: 3rem;
  line-height: 3rem;
}

.task-input input {
  border-radius: 0;
}

.gray {
  background-color: #f5f5f5;
}

.gray dd {
  color: #424242;
  font-weight: bold;
}

.gray svg {
  fill: #9e9e9e;
}

.gray .outer {
  background-color: white;
  text-align: center;
  line-height: 3rem;
  font-size: 0.875rem;
}

.hint {
  display: block;
  line-height: 3rem;
}

.procedure {
  cursor: pointer;
}

.procedure img {
  transform: translateY(-50%);
}

.cliper {
  height: 8rem;
  overflow: hidden;
}

.leaf svg {
  fill: #8bc34a;
}
.item-card{
  border:1px solid #eee;
  margin-bottom: 0.8rem;
}
.item-card li{
  width:100%;
}

.item-card button{
  margin: 0;
}

.main-part{
  flex: 1 1 50%;
  margin:0;
}

.seco-part{
  flex: 0 0 6rem;
  margin:0;
}
</style>
<script>
import viewer from './../_common/text-viewer'
export default {
  data() {
    return {
      loading: false,
      storyBoard: false,
      json: '',
      taskList: [{ project: '',state:'', plan: '',problem:'' }],
    }
  },
  methods: {
    ocr(ev) {
      var files = event.target.files || event.dataTransfer.files
      this.detectTxt('/api/ocr/image', files[0])
    },
    receipt(ev) {
      var files = event.target.files || event.dataTransfer.files
      this.detectTxt('/api/ocr/receipt', files[0])
    },
    dish(ev) {
      var files = event.target.files || event.dataTransfer.files
      this.detectImg('/api/ocr/dish', files[0])
    },
    car(ev) {
      var files = event.target.files || event.dataTransfer.files
      this.detectImg('/api/ocr/car', files[0])
    },
    animal(ev) {
      var files = event.target.files || event.dataTransfer.files
      this.detectImg('/api/ocr/animal', files[0])
    },
    plant(ev) {
      var files = event.target.files || event.dataTransfer.files
      this.detectImg('/api/ocr/plant', files[0])
    },
    detectTxt(url, file) {
      if (!file) return false
      const formData = new FormData()
      formData.append('file', file)
      this.loading = true
      this.$http.post(url, formData)
        .then(res => {
          this.loading = false
          if (!res.body) return
          event.target.value = null
          this.json = JSON.parse(res.body.data).words_result
          this.storyBoard = true
        })
    },
    detectImg(url, file) {
      if (!file) return false
      const formData = new FormData()
      formData.append('file', file)
      this.loading = true
      this.$http.post(url, formData)
        .then(res => {
          this.loading = false
          if (!res.body) return
          var result = JSON.parse(res.body.data).result[0]
          this.$pd.toast(result.name)
          event.target.value = null
        })
    },
    getWeekReport() {
      this.$http.post('/api/workflow/generate-week-report', {
        week: this.curWeek,
        data: this.taskList,
        start: this.start,
        end: this.end,
      }).then(res => {
        if (!res.body) return
        this.$pd.toast('上传成功')
        window.location.href = res.body.resPath
      })
    },
    addTask(ev, index) {
      this.taskList.splice(index + 1, 0, {})
    },
    delTask(ev, index) {
      if (this.taskList.length === 1) return
      this.taskList.splice(index, 1)
    },
    select(ev) {
      var _id = event.target.id
      this.clicked = _id
      document.getElementsByName(_id)[0].click()
    }
  },
  components: {
    'text-viewer': viewer,
  },
  computed: {
    curWeek() {
      function isLeapYear(year) {
        return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
      }

      function getMonthDays(year, month) {
        return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
      }

      function getWeekNumber(y, m, d) {
        var now = new Date()
        if (y && m && d) now = new Date(y, m - 1, d);
        var year = now.getFullYear(),
          month = now.getMonth(),
          days = now.getDate();
        //那一天是那一年中的第多少天
        for (var i = 0; i < month; i++) {
          days += getMonthDays(year, i);
        }
        //那一年第一天是星期几
        var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

        var week = null;
        if (yearFirstDay == 1) {
          week = Math.ceil(days / yearFirstDay);
        } else {
          days -= (7 - yearFirstDay + 1);
          week = Math.ceil(days / 7) + 1;
        }
        return week;
      }
      return getWeekNumber()
    },
    start() {
      var now = new Date()
      var day = now.getDay()
      var month = now.getMonth() + 1
      var date = now.getDate()
      return month + '-' + (date - (day - 1))
    },
    end() {
      var now = new Date()
      var day = now.getDay()
      var month = now.getMonth() + 1
      var date = now.getDate()
      return month + '-' + (date + (5 - day))
    }
  }
}

</script>
