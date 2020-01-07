<template>
    <transition name="toast">
        <div v-if="show" class="vue-toast">
            <div class="inner">
                <div>
                    <i v-if="type==='warning'" class="toast-warning iconfont iconjinggao1-"></i>
                    <i v-else-if="type==='success'" class="toast-success iconfont iconchenggong-"></i>
                    <i v-else-if="type==='error'" class="toast-error iconfont iconcuowuguanbi-"></i>
                    <i v-else-if="type==='info'" class="toast-info iconfont iconinfor"></i>
                    <span class="title">{{title}}</span>
                    <i :class="['close','iconfont iconicon-test']" @click="close"></i>
                </div>
                <div class="content">{{message}}</div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Toast',
    props: {
        title: {
            type: String
        },
        message: {
            type: String,
            // required:
            default: () => '$notice is null'
        },
        type: {
            type: String,
            default: () => 'info'
        },
        duration: {
            type: Number,
            default: () => 3000
        }
    },
    data() {
        return {
            show: false
        }
    },
    methods: {
        close() {
            this.show = false
        }
    },
    mounted() {
        this.show = true
        // setTimeout( ()=>{
        //     this.show = false
        // }, this.duration-400)
    }
}
</script>

<style scoped>
.toast-enter {
    position: relative;
    opacity: 0;
    transform: translateY(-20px);
    z-index: 100;
}
.toast-leave-to {
    margin-top: -55px;
    opacity: 0;
}
.toast-enter-to,
.toast-leave {
    margin: 0;
    transform: translateY(0);
    opacity: 1;
}
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}
.vue-toast {
    max-height: 400px;
    width: 350px;
    box-sizing: border-box;
    padding: 8px;
    /* text-align: center; */
    /* display: flex;
    align-items: center;
    justify-content: center; */
    overflow: hidden;
}
.vue-toast .inner {
    height: 100%;
    padding: 16px 20px;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    /* display: flex; */
    /* flex-direction: row; */
    /* justify-content: center; */
    /* align-items: center; */
}
.vue-toast i {
    margin-right: 8px;
}
.vue-toast .toast-success {
    color: #19be6b;
}
.vue-toast .toast-warning {
    color: #f90;
}
.vue-toast .toast-info {
    color: #2d8cf0;
}
.vue-toast .toast-error {
    color: #ed4014;
}
.title {
    font-size: 18px;
    font-weight: 600;
}
.close {
    font-size: 20px;
    position: absolute;
    right: 10px;
    top: 15px;
}
.close:hover {
    font-size: 20px;
    color: #ed4014;
}
</style>