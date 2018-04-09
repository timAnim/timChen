<style scoped>
    ol>li>em{
        flex:0 0 8em;
    }
    .shade-as-card{
        padding: 0.8rem;
    }
</style>
<template>
    <transition name='in-left'>
    <ol class='shade-as-card'>
        <li><em>里程碑</em><input type="text" v-model='title'></li>
        <li><em>截止日期</em><input type="date" v-model='date' :min='min' :max='max'></li>
        <li @click='save'><button>保存</button></li>
    </ol>
    </transition>
</template>
<script>
import pd from 'predev'
export default{
    props:['init'],
    data(){
        return{
            title:'',
            date:this.init.end,
            code:this.$route.query.code,
            min:this.init.start,
            max:this.init.end,
        }
    },
    methods:{
        save(){
            if (!this.title||!this.date) return pd.toast('请检查输入')
            this.$http.post('/api/projects/stage/insert',this.$data)
            .then(res => {
                if (res.body.code!==0)return
                pd.toast('添加成功')
                this.$router.back()
            });            
        },
    },
}
</script>