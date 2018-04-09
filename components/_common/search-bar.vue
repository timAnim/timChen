<template>
    <div class='search-bar'>
        <button id='filter-btn'>分类 <icon name='caret-down'></icon></button><input :placeholder="placeholder" id='search-input' @keyup='keyup'><button @click='search' type='switch' :searched='searched' id='search-btn'>
            <icon name='search' class='in-pop'></icon>
            <icon name='times-circle' class='in-pop'></icon>
        </button>
    </div>
</template>
<style scoped lang='scss'>
    .search-bar {
        word-spacing: -4px;
    }
    svg {
        fill:#9e9e9e;
        &:last-child {
            display: none;
        }
        &:first-child {
            display: inline-block;
        }
    }
    button[searched='true'] {
        svg:first-child {
            display: none;
        }
        svg:last-child {
            display: inline-block;
        }
    }
    input {
        width: 10em;
        box-sizing: border-box;
        word-spacing: 0;
        border-radius: 1.6rem 0 0 1.6rem;
    }
    button + #search-input {
        border-radius: 0;
    }
    #filter-btn{
        border-radius: 1.6rem 0 0 1.6rem;
        border-right: none;
    }
    #search-btn{
        border-radius: 0 1.6rem 1.6rem 0;
        border-left: none;
    }
</style>
<script>
export default {
    name: 'search',
    methods: {
        search() {
            var ser = this.searched
            var inp = document.getElementById('search-input')
            if (!ser && !inp.value) return
            if (ser) {
                inp.value = null;
                this.$emit('clear', false)
            } else {
                this.$emit('search', inp.value)
            }
            this.searched = !ser
        },
        keyup(ev) {
            if (ev.keyCode==13) this.search()
            else if(ev.keyCode==27) this.search()
        }
    },
    data() {
        return {
            searched: false
        }
    },
    props:['placeholder'],
}
</script>
