<template>
    <section>
        <ol class='shade-as-card'>
            <li type='filter'>
                <em>全部用户</em>
                <button class='theme-mark' @click='add'>添加</button>
            </li>
            <li v-for="user in users"
                @click.stop='edit(user)'
                class="blink-theme">
                <em>{{ user.name }}</em>
                <pre>{{ user.mobile }}</pre>
                <label>
                    <icon name="angle-right"></icon>
                </label>
            </li>
        </ol>
        <user-add ref='add'></user-add>
    </section>
</template>
<script>
export default {
    data() {
        return {
            users: [],
        }
    },
    methods: {
        edit(us) {
            this.$router.push({
                path: '/staff/edit/',
                query:{
                    id:us._id
                }});
        },
        add() {
            this.$refs.add.seen=true
        },
        range() {
            this.users = this.users.sort((a, b) => {
                return b.name.localeCompare(a.name)
            })
        },
        init(){
            this.$http.post('/api/staff/find').then(res => {
                if (res.body.code!==0) return
                this.users=res.body.data
                this.range()
            });            
        }
    },
    created() {   
        this.init()
    },
    components:{
        'user-add': require('./user-add.vue')
    }
}
</script>
