<style scoped>
    .info-row {
        padding: 0.8rem 0;
    }
    
    .icon {
        height: 5.6rem;
        line-height: 5.6rem;
        text-align: center;
        color: #9e9e9e;
        margin-top: 0.4rem;
    }
    #setting-dlg li label:first-child{
        flex: 0 0 2em;
    }
    .mask{
        background: transparent;
    }
    #setting-dlg{
        box-shadow: 0 0 12px #9e9e9e;
        border-radius: 0.4rem;
        top:5rem;
        width: 20rem;
        position: absolute;
        right:0.4rem;
        overflow:hidden;
    }
    content{
        max-height: 480px;
        width: 360px;
    }
    .empty{
        display: none;
    }
    .empty:only-child{
        display: flex;
    }
    ol>li em:first-child{
        flex:0 0 6em;
    }
</style>

<template id='depart-tpl'>
    <transition name='drop'>
    <div class='mask' v-if='seen' @click='close'>
        <div id='setting-dlg'>
            <content>
                <ol class="shade-as-card">
                    <li class='blink-theme' v-for='{proj_name,date,proj_code,_id,item} in reminds' :id='_id' :code='proj_code' @click='href($event.currentTarget)'>
                        <em>{{ item }}</em>
                        <em>{{ proj_name }}</em>
                        <pre>{{ date }}</pre>
                    </li>
                    <li class='empty'><em align='center'>没有日志</em></li>
                </ol>
            </content>
        </div>
    </div>
    </transition>
</template>
<style scoped>
    #setting-dlg{
        width: 30rem!important;
    }
</style>

<script>
export default {
    data(){
        return{
            reminds:[],
            seen:false,
        }
    },
    methods:{
        close(ev){
            this.seen=false
        },
        href(target){
            let href='#/projects/find?code='+target.getAttribute('code')
            window.location.href=href
        }
    },
    mounted(){
        this.$http.post('/api/log/find').then(rep=>{
            rep.body.data.forEach(item=>{
                item.date= (new Date(item.date)).Format('yyyy-MM-dd hh:mm')
            })
            this.reminds=rep.body.data
        })
    },
}
</script>