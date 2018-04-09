<template>
    <div class='waitingBg' v-if='seen' @click='out'>
        <div class='waiting' align='center'>
            <!-- <p>加载中</p> -->
            <slot name='txt'></slot>
            <!-- <icon name='circle-o-notch'></icon> -->
        </div>
    </div>
</template>
<style>
</style>
<script>
export default {
    methods: {
        out(){
            this.seen=false
        }
    },
    data(){
        return{
            seen:false,
        }
    },
}
</script>