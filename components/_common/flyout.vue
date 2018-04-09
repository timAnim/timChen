<template>
    <transition name='opacity'>
    <div class='mask'
        @click.stop='out(false)'
        v-if='seen'>
        <dialog
            @click.stop>
            <header>
                <slot name='header'>
                    <li>
                        <h1>{{ title }}</h1>
                        <button
                            v-if='del'
                            type='icon' class='color-alert'>
                            <icon name='trash'></icon>
                        </button>
                    </li>
                </slot>
            </header>
            <content>
                <slot name='content'></slot>
            </content>
            <footer>
                <slot name='footer'>
                    <li>
                        <button type='half' @click='out(false)'>取消</button>
                        <button type='half' @click='out(true)'>确认</button>
                    </li>
                </slot>
            </footer>
        </dialog>
    </div>
    </transition>
</template>
<script>
export default {
    props:{
        title:{
            type:String,
            default(){
                return "请输入"
            }
        },
        seen:{
            type:Boolean,
            default(){
                return false
            }
        },
        del:{
            type:Function,
        }
    },
    methods: {
        out(res){
            this.$emit('out',res)
        }
    },
}
</script>