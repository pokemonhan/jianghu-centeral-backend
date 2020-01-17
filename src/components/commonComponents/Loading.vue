<template>
    <div @dblclick="dblclick" v-if="show" class="conta">
        <div class="loading"></div>
    </div>
</template>

<script>
export default {
    name: 'loading',
    props:{
        show:Boolean
    },
    data() {
        return {
            // show: false
        }
    },
    methods: {
        dblclick() {
            this.$emit('update:show',false)
        }
    },
}
</script>

<style scoped>
.conta {
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 100px;
    border-radius: 5px;
    background: rgba(168, 168, 168, 0.199);
    transform: translate(-50%, -50%);
}

.loading {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border: 5px solid #eff1f3;
    border-right-color: #7a9bc2;
    animation: loading 1s linear infinite;
}

@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>