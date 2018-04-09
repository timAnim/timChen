<template>
    <main>
        <transition name='slide'>
        <article v-show='seen'>
            <header>
                <section>
                    <li>
                        <button @click='back' id='back-btn'>
                            <icon name="chevron-down"></icon>
                        </button>
                        <h1>用户修改</h1>
                        <button type='icon'
                            class="color-alert" 
                            @click='$refs.del.seen=true'>
                            <icon name='trash'></icon>
                        </button>
                        <button type='icon'
                            @click='save'>
                            <icon name='save'></icon>
                        </button>
                    </li>
                </section>
            </header>
            <content>
                <section>
                    <ol class="shade-as-card">
                        <dl>
                            <dt class='portrait-container'>
                                <div class="clip" type='circle-l'>
                                <img :src='user.name?"/static/img/"+user.name+".jpg":""'>
                                </div>
                            </dt>
                        </dl>
                        <li>
                            <label char="4">姓名</label>
                            <input placeholder="姓名" v-model='user.name'>
                        </li>
                        <li>
                            <label char="4">电话</label>
                            <input type='number' placeholder="电话" v-model='user.number'>
                        </li>
                        <li>
                            <label char="4">手机</label>
                            <input type='number' placeholder="手机" v-model='user.mobile'>
                        </li>
                        <li>
                            <label char="4">UID</label>
                            <input type='number' placeholder="UID" v-model='user.uid'>
                        </li>
                        <li>
                            <label char="4">职位</label>
                            <input placeholder="职位" v-model='user.position'>
                        </li>
                        <li>
                            <label char="4">邮箱</label>
                            <input type='mail' placeholder="邮箱" v-model='user.mail'>
                        </li>
                        <li>
                            <label char="4">网址</label>
                            <input placeholder="网址" v-model='user.website'>
                        </li>
                    </ol>
                    <h3></h3>
                    <ol class="shade-as-card" v-if='isSelf'>
                        <li @click='pswd' class="blink-theme">
                            <em>修改密码</em>
                            <label><icon name='angle-right'></icon></label>
                        </li>
                    </ol>
                </section>
            </content>
        </article>
        </transition>
        <presenter
            ref='del'
            @out='del'
            :type='"confirm"'
            :title='"确认删除用户?"'></presenter>
        <modify-pswd ref='pswd'></modify-pswd>
    </main>
</template>
<style scoped>
#back-btn {
    margin: 0;
    border-radius: 0;
    height: 4.8rem;
    line-height: 4.8rem;
    flex: 0 0 4.8rem;
}
section{
    max-width: 60rem;
}
content{
    overflow-y: auto;
}
header h1{
    font-size: 1.6rem;
    font-weight: 600;
}
</style>
<script>
import pswd from './modify-pswd.vue'
export default {
    data() {
        return {
            seen:false,
            user:{},
            _id:this.$route.query.id,
            isSelf:this.$route.query.id===sessionStorage.uid
        }
    },
    methods: {
        back() {
            this.$router.back()
        },
        save() {
            this.$http.post('/api/staff/update',{
                _id:this._id,
                data:this.user
            }).then(res => {
                if (res.body.code!==0) return
                this.$pd.toast('人员信息已修改');
                this.init()
            });
        },
        init(){
            this.$http.post('/api/staff/find',{
                _id:this._id
            }).then(res=>{
                if(res.body.code!==0)return
                this.user=res.body.data[0]
            })
        },
        del(res){
            if (!res) return
            this.$http.post('/api/staff/remove',{
                _id:this._id
            }).then(res => {
                if (res.body.code!==0) return
                this.$pd.toast('用户已删除')
                this.$router.back()
            });
        },
        pswd(){
            this.$refs.pswd.seen=true
        }
    },
    mounted(){
        this.seen=true
        this._id=this.$route.query.id
        this.init()
    },
    components:{
        'modify-pswd':pswd
    }
}
</script>
