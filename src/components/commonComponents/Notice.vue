<template>
    <transition name="notice">
        <div v-if="show" class="vue-notice">
            <div class="inner">
                <div>
                    <i v-if="type==='warning'" class="notice-warning iconfont iconjinggao1-"></i>
                    <i v-else-if="type==='success'" class="notice-success iconfont iconchenggong-"></i>
                    <i v-else-if="type==='error'" class="notice-error iconfont iconcuowuguanbi-"></i>
                    <i v-else-if="type==='info'" class="notice-info iconfont iconinfor"></i>
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
    name: 'notice',
    props: {
        title: {
            type: String,
            // default: () => 'title is null'
        },
        message: {
            type: String,
            // required:
            default: () => 'message is null'
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

.notice-enter {
    position: relative;
    opacity: 0;
    transform: translateY(-74px);
    z-index: 100;
}
.notice-leave-to {
    margin-bottom: -90px;
    opacity: 0;
}
.notice-enter-to,
.notice-leave {
    margin: 0;
    transform: translateY(0);
    opacity: 1;
}
.notice-enter-active,
.notice-leave-active {
    transition: all .2s ease;
}
.vue-notice {
    position: relative;
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
.vue-notice .inner {
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
.vue-notice i {
    margin-right: 8px;
}
.vue-notice .notice-success {
    color: #19be6b;
}
.vue-notice .notice-warning {
    color: #f90;
}
.vue-notice .notice-info {
    color: #2d8cf0;
}
.vue-notice .notice-error {
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