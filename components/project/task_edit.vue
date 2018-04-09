<template>
    <transition name='opacity'>
    <div class='mask' v-if='seen' @click='out'>
        <dialog @click.stop>
            <header>
                <li>
                    <h1>任务详情</h1>
                    <button type='icon' class='color-alert' @click='delTask'><icon name='trash'></icon></button>
                </li>
            </header>
            <content style="overflow:hidden">
                <ol>
                    <li>
                        <em char='5'>计划名</em>
                        <input type="text" v-model='initData.name'>
                    </li>
                    <li><em char='5'>开始日期</em>
                        <input type="date" v-model='initData.start' :min='initData.min' :max='initData.max'>
                    </li>
                    <li>
                        <em char='5'>截止日期</em>
                        <input type="date" v-model='initData.end' :min='initData.min' :max='initData.max'>
                    </li>
                    <li class='blink-theme' @click='slctPrio'>
                        <em char='5'>优先级</em>
                        <pre>{{initData.prio}}</pre>
                        <label><icon name='angle-right'></icon></label>
                    </li>
                    <li class='blink-theme' @click='slctPerson'>
                        <em char='5'>责任人</em>
                        <pre id='person'>{{initData.pname}}</pre>
                        <label><icon name='angle-right'></icon></label>
                    </li>
                    <li>
                        <button class='color-theme' @click='save'>保存</button>
                    </li>
                </ol>
            </content>
        </dialog>
        <presenter
            ref='prio'
            :title='"选择优先级"'
            :type='"radio"'
            :data='prios'
            @out='setPrio'>
        </presenter>
        <presenter
            ref='person'
            :title='"选择责任人"'
            :type='"radio"'
            :data='staffs'
            @out='setPerson'>
        </presenter>
    </div>
    </transition>
</template>
<script>
export default{
    props:['init'],
    data(){
        return{
            seen:false,
            initData:{},
            code:this.$route.query.code,
            prios:[
                {_id:'high',name:'高'},
                {_id:'regular',name:'中'},
                {_id:'low',name:'低'},
            ],
            staffs:[]
        }
    },
    methods:{
        save(){
            if (!this.initData.name
                ||!this.initData.start
                ||!this.initData.end) return this.$pd.toast('请检查输入')
            if (this.initData.end<=this.initData.start) return this.$pd.toast('开始日期要小于截止日期')
            this.$http.post('/api/projects/plan/update',{
                task:this.initData,
                code:this.code
            }).then(res => {
                if (res.body.code!==0) return
                this.$pd.toast('操作成功')
                this.seen=false
                this.$parent.refresh()
            });            
        },
        delTask(ev){
            this.$http.post('/api/projects/plan/remove',{
                code:this.code,
                _id:this.initData._id
            }).then(res => {
                if (res.body.code!==0) return
                this.$pd.toast('删除成功')
                this.seen=false
                this.$parent.refresh()
            })
        },
        slctPrio(){
            this.$refs.prio.seen=true
            this.$refs.prio.check([this.initData.prio])
        },
        setPrio(res){
            if (!res) return
            this.initData.prio=res[0]._id
        },
        slctPerson(){
            this.$refs.person.seen=true
            this.$http.post('/api/projects/staff/find',{
                code:this.code,
            }).then(res => {
                if (res.body.code!==0) return
                res.body.data.forEach(item=>{
                    item.pre=item.mobile
                })
                this.staffs=res.body.data
            });
        },
        setPerson(res){
            if (!res) return
            this.initData.pname=res[0].name
            this.initData.puid=res[0].puid
        },
        out(){
            this.seen=false
        },
    },
    watch:{
        init(value){
            this.initData=JSON.parse(JSON.stringify(value))
        }
    }
}
</script>