<template>
    <div v-show="$route.path!=='/home/home'" class="v-breadcrumb">
        <transition>
            <div v-if="show">
                <span>{{name_array[0]}}</span>
                <span class="split">/</span>
                <span>{{name_array[1]}}</span>
            </div>
        </transition>
    </div>
</template>

<script>
// import router from '../../js/router'
export default {
    data() {
        return {
            name_array: [],
            show: true
        }
    },
    methods: {
        setName() {
            let chainName = window.all.tool.getChainName(this.$route.path)
            this.show = false
            if (chainName) {
                this.name_array = chainName.split('-')
            }
            setTimeout(() => {
                this.show = true
            }, 0);
        }
    },
    watch: {
        $route() {
            this.setName()
        }
    }
}
</script>

<style scoped>
.v-breadcrumb {
    /* color: #ccc; */
    background: rgba(255, 255, 255, 0.815);
    margin-bottom: 5px;
    padding-left: 20px;
    padding-top: 3px;
    padding-bottom: 5px;
}
.split {
    color: #ccc;
    margin-left: 10px;
    margin-right: 10px;
}

</style>