<style>
#list-zero {
  border-top: 4rem solid transparent;
  height: 1.8rem;
  position: relative;
  background-image: url(/static/img/ruler.svg);
  background-size: 49px 1rem;
  background-repeat: repeat-x;
  min-height: 1rem;
  margin-left: 15.2rem;
  margin-right: 1.4rem;
}

.stage {
  position: absolute;
  left: 0;
  height: 2.8rem;
  line-height: 1.4rem;
  min-width: 3.4rem;
  text-align: center;
  font-size: 0.8rem;
  color: white;
  top: 0;
  margin-top: -3rem;
  transform: translateX(-50%);
  border: none;
  cursor: pointer;
}

.stage div {
  border-radius: 0.2rem;
  background: #9e9e9e;
  transform: translate(0);
}

.stage:before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  left: 0;
  top: 55%;
  border-width: 1.5rem 1.5rem 0;
  border-style: solid;
  border-color: #9e9e9e transparent transparent;
}

.stage .stage-date {
  background: transparent;
  color: #9e9e9e;
}

.indicator {
  position: absolute;
  height: 4.8rem;
  width: 2px;
  background: #8bc34a;
  bottom: 0;
  margin-left: -1px;
}

.indicator:after {
  content: attr(start);
  background: #8bc34a;
  position: absolute;
  left: 0;
  top: 0;
  height: 1.2rem;
  line-height: 1.2rem;
  width: 3.2rem;
  font-size: 0.8rem;
  text-align: center;
  overflow: hidden;
  border-radius: 0.2rem;
  margin-left: -1.6rem;
  margin-top: -1rem;
  border: 1px solid #9e9e9e;
  color: white;
}

#gant-outer {
  padding: 0.8rem;
}

#gant-outer+ol {
  display: none
}

</style>
<template>
  <transition name='in-left'>
    <section>
      <ol class='shade-as-card' id='gant-outer'>
        <ol id='list-zero' :style='"background-size:"+picWidth+"px 10px; background-position:"+ weekday + " 0px;"'>
          <span class='stage in-bottom' v-for='stage in stageArr' :style='"left:"+ stage.left' @click='editStage(stage)' :id='stage._id'>
                    <div class='stage-date' :date='stage.date'>
                        {{stage._date}}
                    </div>
                    <div>{{stage.title}}</div>
                </span>
          <div class="indicator" :start='today' :style='"left:"+todayLeft'></div>
        </ol>
        <slider-date v-for='task in planArr' @tap='editTask(task)' @change='save' :gant='task' :key='task._id' :max='end' :min='start'>
        </slider-date>
        </dl>
        <li v-if='isAdmin'>
          <button @click='addPlan'>添加计划</button>
        </li>
      </ol>
      <task-edit ref='taskEdit' :init='task'></task-edit>
      <stage-edit ref='stageEdit' :init='stage'></stage-edit>
    </section>
  </transition>
</template>
<script type="text/javascript">
import sliderDate from '../_common/slider-date.vue'
import taskEdit from './task_edit.vue'
import stageEdit from './stage_edit.vue'
export default {
  data() {
    return {
      isAdmin: sessionStorage.token ? true : false,
      code: this.$route.query.code,
      planArr: [],
      stageArr: [],
      end: '',
      start: '',
      task: '',
      stage: '',
      picWidth: 0,
      unit: 0,
      weekday: 0,
      today: 0,
      todayLeft: 0,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      // 初始化
      this.$http.post('/api/projects/find', {
        code: this.code,
      }).then(res => {
        if (res.body.code !== 0) return
        //数据初始化
        this.start = new Date(res.body.data.start).valueOf()
        this.end = new Date(res.body.data.end).valueOf()
        var plans = res.body.data.plan
        this.planArr = plans.sort((a, b) => {
          return (new Date(a.start).valueOf() - new Date(b.start).valueOf())
        })
        this.stageArr = res.body.data.stage

        // 标尺格式化
        var week = this.getD((this.end - this.start) / 7) + 2
        var total = this.$pd.id('list-zero').clientWidth;
        this.picWidth = total / week;
        this.unit = total / (7 * week);
        this.weekday = -(new Date(this.start).getDay() + 1) * this.unit + 'px'
        //缓存
        var startStamp, endStamp
        // 里程碑的格式化
        this.stageArr.forEach(stage => {
          startStamp = new Date(stage.date).valueOf()
          stage.left = this.getD(startStamp - this.start) * this.unit + 'px'
          stage._date = new Date(stage.date).Format("MM-dd")
        })
        // 今天标签
        var today = new Date().valueOf();
        this.today = new Date().Format('MM-dd')
        if (today >= this.end) return;
        this.todayLeft = this.getD(today - this.start) * this.unit + 'px';
      });
    },
    addPlan() {
      this.$router.push({
        path: '/plan/add',
        query: { code: this.code }
      })
    },
    editStage(_s) {
      if (!this.isAdmin) return this.$pd.toast('请登录')
      this.stage = _s
      Object.assign(this.stage, {
        date: new Date(_s.date).Format('yyyy-MM-dd'),
        min: new Date(this.start).Format('yyyy-MM-dd'),
        max: new Date(this.end).Format('yyyy-MM-dd'),
      })
      this.$refs.stageEdit.seen = true
    },
    editTask(_t) {
      if (!this.isAdmin) return this.$pd.toast('请登录')
      this.task = _t
      Object.assign(this.task, {
        start: new Date(_t.start).Format('yyyy-MM-dd'),
        end: new Date(_t.end).Format('yyyy-MM-dd'),
        min: new Date(this.start).Format('yyyy-MM-dd'),
        max: new Date(this.end).Format('yyyy-MM-dd'),
      })
      this.$refs.taskEdit.seen = true
    },
    save(_t) {
      this.$http.post('/api/projects/plan/update', {
        task: _t,
        code: this.code
      }).then(res => {
        if (res.body.code !== 0) return this.$pd.toast('修改失败')
        // this.$pd.toast('修改成功')
      });
    },
    refresh() {
      this.initData()
    },
    getD(stamp) {
      return parseInt(stamp / 1000 / 60 / 60 / 24)
    }
  },
  components: {
    'stage-edit': stageEdit,
    'task-edit': taskEdit,
    'slider-date': sliderDate,
  }
}

</script>
