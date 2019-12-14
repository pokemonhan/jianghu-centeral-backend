<template>
    <transition name="toast">
        <div v-show="show" class="vue-toast">
            <div>
                <i v-if="type==='warning'" class="toast-warning iconfont iconjinggao1-"></i>
                <i v-else-if="type==='success'" class="toast-success iconfont iconchenggong-"></i>
                <i v-else-if="type==='error'" class="toast-error iconfont iconcuowuguanbi-"></i>
                <i v-else-if="type==='info'" class="toast-info iconfont iconinfor"></i>
                <span>{{message}}</span>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "Toast",
    props: {
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: () => "info"
        },
        duration: {
            type: Number,
            default: () => 3000
        }
    },
    data() {
        return {
            show: false
        };
    },
    mounted() {
        this.show = true;
        setTimeout( ()=>{
            this.show = false
        }, this.duration-400)
    }
};
</script>

<style scoped>
.toast-enter {
    opacity: 0;
    transform: translateY(-30px);
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
    height: 55px;
    box-sizing: border-box;
    padding: 8px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}
.vue-toast div {
    height: 100%;
    padding: 0 16px;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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
</style>