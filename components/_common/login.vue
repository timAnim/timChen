<template>
    <article>
        <content id='outer'>
            <section>
                <div class='shade-as-card in-top'>
                    <li>
                        <em class='logo-outer blink-text' evnt='repeat'>
                                <span class='logo color-theme'>Y</span>
                                <span class='logo color-theme'>U</span>
                                <span class='logo color-theme'>T</span>
                                <span class='logo color-theme'>O</span>
                                <span class='logo color-theme'>N</span>
                                <span class='logo color-theme'>G</span>
                            </em>
                    </li>
                    <div class='username'>
                        <li type='single'>
                            <h1>登录</h1></li>
                        <li type='single'><em>权限管理系统</em></li>
                        <h3></h3>
                        <li type='single'>
                            <label class='hint color-theme'>使用用户名登录</label>
                        </li>
                        <li type='single'>
                            <input type="text" id='name-input' placeholder="username" autocomplete="true" autosave="true">
                        </li>
                        <li class='button'>
                            <button class='blink-wave'>更多选项</button>
                            <em></em>
                            <button class='blink-wave theme-mark' @click='next'>下一步</button>
                        </li>
                    </div>
                    <div class='password in-right'>
                        <li type='single'>
                            <h1 id='name'>管理员</h1>
                        </li>
                        <li type='single'>
                            <label><i class="fa fa-user-circle color-theme"></i></label><em id='nameTxt'>admin</em></li>
                        <h3></h3>
                        <li type='single'>
                            <label class='hint color-theme'>输入您的密码</label>
                        </li>
                        <li type='single'>
                            <input type="password" placeholder="password" id='pwd-input' autocomplete="true" autosave="true">
                        </li>
                        <li class='button'>
                            <button @click='previous' class='blink-wave'>上一步</button>
                            <em></em>
                            <button class='blink-wave theme-mark shade-as-card' @click='login'>下一步</button>
                        </li>
                    </div>
                </div>
            </section>
        </content>
    </article>
</template>
<style lang='scss' scoped>
section {
    max-width: 450px;
    div {
        min-height: 500px;
        position: relative;
        padding: 2.4rem;
        box-sizing: border-box;
        overflow: hidden;
        width: 450px;
    }
}

div li {
    width: 100%;
}

article {
    background: url(/static/img/bgImg.svg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 100%;
}

content {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}

h1 {
    font-size: 2.5rem;
}

.hint {
    font-size: 0.8rem;
}

.button {
    margin-top: 5.6rem;
}

.button button {
    flex-basis: 8rem;
}

.username {
    position: absolute;
    left: 0;
    width: 100%;
    transition: all 0.2s ease;
    padding: 0.8rem 2.4rem;
    box-sizing: border-box;
}

.password {
    position: absolute;
    width: 100%;
    left: 100%;
    transition: all 0.2s ease;
    padding: 0.8rem 2.4rem;
    box-sizing: border-box;
}

.theme-mark {
    transition: 0.6s ease;
}

.theme-mark:hover {
    box-shadow: 0 1px 3px #bdbdbd;
}

.logo-outer {
    font-weight: 800;
    transform: scaleY(0.8);
    font-size: 2rem;
    font-family: Helvetica;
    word-spacing: -10px;
    cursor: pointer;
}

.logo {
    display: inline-block;
}
</style>
<script>
export default {
    name: 'login',
    data(){
        return{
            isSuper:false,
            curView:'name'
        }
    },
    methods: {
        previous() {
            var user = this.$pd.find('.username');
            var psw = this.$pd.find('.password');
            var outer = user.parentNode;
            psw.style.display = 'block';
            user.style.transform = 'translateX(0)';
            psw.style.transform = 'translateX(0)';
            this.curView = 'name';
            setTimeout(ev=> {
                this.$pd.id('name-input').focus();
            }, 200);
        },
        next() {
            var user = this.$pd.find('.username');
            var psw = this.$pd.find('.password');
            var outer = user.parentNode;
            psw.style.display = 'block';
            user.style.transform = 'translateX(-100%)';
            psw.style.transform = 'translateX(-100%)';
            this.isSuper = (this.$pd.id('name-input').value == 'Admin_YT');
            if (this.isSuper) {
                this.$pd.id('name').innerHTML = '超级管理员';
                this.$pd.id('nameTxt').innerHTML = 'Admin_YT';
            } else {
                this.$pd.id('name').innerHTML = '管理员';
                this.$pd.id('nameTxt').innerHTML = this.$pd.id('name-input').value;
            }
            this.curView = 'pwd';
            setTimeout(ev=>{
                this.$pd.id('pwd-input').focus();
            }, 200);
        },
        login() {
            var username = this.$pd.id('name-input').value,
                pwd = this.$pd.id('pwd-input').value;
            if (!username || !pwd) {
                this.$pd.toast('请检查输入');
                return;
            }
            this.$http.post('/api/staff/login',{
                uid:username,
                password:pwd
            }).then(res=>{
                if (!res.body.data) return  this.$pd.toast('用户名或密码错误');
                this.$pd.toast('登录成功');
                sessionStorage.token=res.body.data
                sessionStorage.uid=res.body.user._id
                sessionStorage.portrait=res.body.user.portrait
                this.$router.push('/projects');
                window.history.go(0)
            })  
        },
    },
    mounted() {
        this.$pd.id('name-input').focus();
        var self = this;
        this.$pd.onkeydown = function(code) {
            if (code != 13) return
            if (this.curView == 'name' && this.$pd.id('name-input').value) self.next();
            else if (this.curView == 'pwd') self.login();
        };
    },
}
</script>
