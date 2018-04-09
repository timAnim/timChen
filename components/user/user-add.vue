<template>
    <flyout
        :seen='seen'
        :title='"添加用户"'
        @out='out'
        ref='outer'>
        <ol slot='content'>
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
    </flyout>
</template>
<script>
export default {
    data() {
        return {
            seen:false,
            user:{},
        }
    },
    methods: {
        save() {
            this.$http.post('/api/staff/insert',{
                data:this.user
            }).then(res => {
                this.seen=false
                if (res.body.code!==0) return
                this.$pd.toast('信息已保存');
                this.$parent.init()
            });
        },
        out(res){
            this.seen=false
            if (res) this.save()
        }
    }
}
</script>
