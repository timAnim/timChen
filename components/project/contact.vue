<template>
    <ol class='shade-as-card'>
        <li type='filter'><em>宇通产品体验设计团队</em></li>
        <img src="/static/img/aboutUsBgSmall.png">
        <div id='h-outer'>
            <ul id='h-inner' class='flow-up'>
                <dl>
                    <dt class='clip' type='circle-s'>
                        <img src="/static/img/img01.jpg">
                    </dt>
                    <dd>
                        <li evnt="mailToUser1">
                            <label><i class="fa fa-envelope"></i></label>
                            <em>汝霄</em>
                            <label><i class="fa fa-angle-right"></i></label>
                        </li>
                    </dd>
                </dl>
                <dl>
                    <dt class='clip' type='circle-s'>
                        <img src="/static/img/img01.jpg">
                    </dt>
                    <dd>
                        <li evnt="mailToUser1">
                            <label><i class="fa fa-envelope"></i></label>
                            <em>陈峥</em>
                            <label><i class="fa fa-angle-right"></i></label>
                        </li>
                    </dd>
                </dl>
                <dl>   
                    <dt class='clip' type='circle-s'>
                        <img src="/static/img/img01.jpg">
                    </dt>
                    <dd>
                        <li evnt="mailToUser2" >
                            <label><i class="fa fa-envelope"></i></label>
                            <em>闫亚州</em>
                            <label><i class="fa fa-angle-right"></i></label>
                        </li>
                    </dd>
                </dl>
                <dl>   
                    <dt class='clip' type='circle-s'>
                        <img src="/static/img/img01.jpg">
                    </dt>
                    <dd>
                        <li evnt="mailToUser2" >
                            <label><i class="fa fa-envelope"></i></label>
                            <em>段坤明</em>
                            <label><i class="fa fa-angle-right"></i></label>
                        </li>
                    </dd>
                </dl>
                <dl>   
                    <dt class='clip' type='circle-s'>
                        <img src="/static/img/img01.jpg">
                    </dt>
                    <dd>
                        <li evnt="mailToUser2" >
                            <label><i class="fa fa-envelope"></i></label>
                            <em>姜贺</em>
                            <label><i class="fa fa-angle-right"></i></label>
                        </li>
                    </dd>
                </dl>
            </ul>
        </div>
    </ol>
</template>
<style scoped>
    ol>img{
        width: 100%;
        height: auto;
        display: block;
        animation: expand 500ms ease, exposure 1500ms ease-out;
    }
    dd>li>em{
        text-align: center;
    }
    #h-inner{

    }
    #h-inner>dl{
        flex: 0 0 11rem;
        margin:1rem;
    }
    #h-outer{
        position: relative;
        overflow:hidden;
    }
    .clip{
        flex:0 0 60%;
    }
</style>
<script>
import  Scroller from 'Scroller'
export default{
    data(){
        return{
            staffs:[]
        }
    },
    methods:{
        href(ev) {
            let target=ev.target;
            while(target.tagName!=='DL'){
                target=target.parentNode
            }
            window.location.href = target.id;
        },
        mailToUser1(){
            window.location.href = 'mailto:chenzheng@yutong.com';
        },
        mailToUser2(){
            window.location.href = 'mailto:yanyzb@yutong.com';
        },
        notice(){
            if (updateArr == 0) {
                this.$pd.toast('没有更新');
                return;
            }
            var menu = new Presenter({
                title: '更新列表',
                type: 'menu',
                data: updateArr,
                onOut: function(res) {
                    this.$pd.href('./project.html?project=' + res);
                }
            });
            menu.show();
            localStorage['lastVisit'] = new Date().valueOf();
            updateArr = [];
            this.$pd.id('notice').removeAttribute('notice');
        },
    },
    mounted(){
        this.$pd.id('h-inner').style.width='65rem'
        this.scroller=new Scroller('#h-outer',{
            scrollX:true,
            scrollY:false,
        })
        setTimeout(ev=>{
            this.scroller.refresh()
        },600)
    }
}
</script>