<template>
    <transition name='in-left'>
    <section id='calendar'>
        <ol id='list-first' class='shade-as-card'>
            <dl v-for='item in staffs'
                class='ht-high pd-half'
                :key='item._id'
                @click='href(item.website)'>
                <dd type='fixed'>
                    <div class='clip' type='circle-m'>
                        <img :src='"/static/img/"+item.name+".jpg"'>
                    </div>
                </dd>
                <dd>
                    <li class='ht-low'>
                        <label class='ft-large color-light'>{{item.name}}</label>
                        <em class='color-light'>{{item.position}}</em>
                    </li>
                    <li class='ht-compact'>
                        <em>电话</em>
                        <pre>{{item.number}}, {{item.mobile}}</pre>
                    </li>
                    <li class='ht-compact'>
                        <em>邮箱</em>
                        <pre @click.stop>
                            <a :href='"mailto:"+item.mail' class='href'>{{item.mail}}</a>
                        </pre>
                    </li>
                </dd>
            </dl>
            <li type='full' v-if='isAdmin' @click='staffHdl'>
                <button>人员管理</button>
            </li>
        </ol>
        <presenter
            ref='present'
            :title='"人员管理"'
            :type='"check"'
            @out='setStaff'>
        </presenter>
    </section>
</transition>
</template>
<style scoped>
    .ht-high{
        height: 9.6rem;
        line-height: 9.6rem;
    }
</style>
<script>
export default{
    data(){
        return{
            staffs:[],
            code:this.$route.query.code,
            isAdmin:sessionStorage.token?true:false,
        }
    },
    methods:{
        href(web) {
            var eip="http://ekp.yutong.com/ekp/km/expert/km_person_info/kmPersonInfo.do?method=view&fdId="
            window.location.href = eip + web;
        },
        init(){
            this.$http.post('/api/projects/staff/find',{
                code:this.code,
            }).then(response => {
                if (response.body.code!==0) return
                this.staffs=response.body.data
            });
        },
        staffHdl(){
            this.$refs.present.seen=true
            this.$http.post('/api/staff/find').then(res=>{
                this.$refs.present.items=res.body.data
                var arr=[]
                this.staffs.forEach(i=>{
                    arr.push(i._id)
                })
                this.$refs.present.check(arr)
            })
        },
        setStaff(res){
            if (!res) return
            var arr=[]
            res.forEach(i=>{
                arr.push(i._id)
            })
            this.$http.post('/api/projects/staff/update',{
                code:this.code,
                staff:arr,
            }).then(response => {
                if (response.body.code!==0) return
                this.$pd.toast('修改成功')
                this.init()
            });
        },
    },
    mounted(){
        this.init()
    }
}
</script>