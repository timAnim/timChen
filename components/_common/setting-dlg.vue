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
        right:4.8rem;
        overflow:hidden;
    }
    content{
        width: 24rem;
    }
</style>

<template id='depart-tpl'>
    <transition name='drop'>
    <div class='mask' v-if='seen' @click='close'>
        <div id='setting-dlg'>
            <content>
                <ol class="shade-as-card">
                    <li class='blink-wave' @click='edit'>
                        <em>设置</em>
                        <label><icon name='angle-right'></icon></label>
                    </li>
                    <li class='blink-wave' @click='href'><em>登出</em>
                        <label><icon name='angle-right'></icon></label>
                    </li>
                </ol>
            </content>
        </div>
    </div>
    </transition>
</template>
<style scoped>
    #setting-dlg{
        width: 24rem!important;
    }
</style>

<script>
export default {
    methods:{
        close(ev){
            this.seen=false
        },
        href(ev){
            this.seen=false
            sessionStorage.token=''
            this.$pd.toast('成功登出')
            setTimeout(ev=>{
                window.history.go(0)
            },1500)
        },
        edit(){
            this.$router.push({
                path: '/staff/edit/',
                query:{
                    id:sessionStorage.uid
                }});
        }
    },
    data(){
        return{
            reminds:[],
            left:20,
            seen:false,
        }
    },
}
</script>