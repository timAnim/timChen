<style scoped>
    ol>li>em{
        flex:0 0 8em;
    }
    header h1{
        font-size: 16px;
        font-weight: 600;
    }
    content{
        overflow: hidden;
    }
    .shade-as-card{
        padding: 0.8rem;
    }
</style>
<template>
    <transition name='opacity'>
    <div class='mask' v-if='seen' @click='out'>
        <dialog @click.stop>
            <header>
                <li><h1>里程碑详情</h1><button type='icon' @click='save'>保存</button></li>
            </header>
            <content>
                <ol class='shade-as-card'>
                    <li>
                        <em>里程碑</em>
                        <input type="text" v-model='initData.title'>
                    </li>
                    <li>
                        <em>截止日期</em>
                        <input type="date" v-model='initData.date' :min='initData.min' :max='initData.max'>
                    </li>
                    <li><button type='alert' @click='delStage'>删除</button></li>
                </ol>
            </content>
        </dialog>
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
        }
    },
    methods:{
        save(){
            if (!this.initData.title
                ||!this.initData.date) return this.$pd.toast('请检查输入')
                
            this.$http.post('/api/projects/stage/update',{
                code:this.code,
                stage:this.initData,
            }).then(res => {
                if (res.body.code!==0) return
                this.$pd.toast('操作成功')
                this.seen=false
                this.$parent.refresh()
            });            
        },
        out(){
            this.seen=false
        },
        delStage(){
            var self=this
            this.$http.post('/api/projects/stage-remove',{
                code:this.code,
                _id:this.initData._id
            }).then(res => {
                if (res.body.code!==0) return
                this.$pd.toast('删除成功')
                this.seen=false
                this.$parent.refresh()
            })
        },
    },
    watch:{
        init(value){
            this.initData=value
        }
    }
}
</script>