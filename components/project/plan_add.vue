<style scoped>
    #back-btn {
        margin: 0;
        border-radius: 0;
        height: 4.8rem;
        flex-basis: 4.8rem;
    }
    ol>li>em{
        flex:0 0 8em;
    }
    section{
        max-width: 70rem;
    }
    header h1{
        font-size: 16px;
        font-weight: 600;
    }
    content{
        overflow-y: scroll;
    }
</style>
<template>
    <main>
        <transition name='slide' mode='out-in' duration='100'>
        <article v-if='seen'>
            <header>
                <section>
                    <li>
                        <button id='back-btn' @click='backBtn'><icon name="chevron-down"></icon></button>
                        <h1 id='project-name'>添加任务</h1>
                    </li>
                </section>
            </header>
            <content id='outer'>
                <section id='calendar'>
                    <nav-bar :navs='navs' :cur='cur' @nav='navHdl'></nav-bar>
                    <keep-alive>
                        <stage-add v-if='cur==="stage"&&init' :init='init'></stage-add>
                        <task-add v-if='cur==="task"&&init' :init='init'></task-add>
                        <task-import v-if='cur==="import"&&init' :init='init'></task-import>
                    </keep-alive>
                </section>
            </content>
        </article>
        </transition>
    </main>
</template>
<script>
import stageAdd from './stage_add.vue'
import taskAdd from './task_add.vue'
import taskImport from './import.vue'
export default{
    data(){
        return{
            seen:false,
            navs:[{
                id:'task',
                name:'任务',
            },{
                id:'import',
                name:'导入'
            },{
                id:'stage',
                name:'里程碑'
            }],
            cur:'task',
            code:this.$route.query.code,
            init:'',
        }
    },
    methods:{
        backBtn(){
            this.$router.back()
        },
        navHdl(cur){
            this.cur=cur
        }
    },
    mounted(){
        this.seen=true
        this.$http.post('/api/projects/find',{code:this.code})
        .then(res => {
            if (res.body.code!==0) return
            this.init=res.body.data
            this.init.start=new Date(res.body.data.start).Format('yyyy-MM-dd')
            this.init.end=new Date(res.body.data.end).Format('yyyy-MM-dd')
        })
    },
    components:{
        'stage-add':stageAdd,
        'task-add':taskAdd,
        'task-import':taskImport,
    }
}
</script>