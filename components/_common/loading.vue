<template>
    <div class='waitingBg' id='waitBg' v-if='show'>
        <div class='waiting' align='center'>
            <p>加载中</p>
            <icon name='circle-o-notch'></icon>
        </div>
    </div>
</template>
<style>
</style>
<script>
export default {
    name: 'loading',
    props: ['show'],
    methods: {

    },
    mounted(){
    }
}
</script>