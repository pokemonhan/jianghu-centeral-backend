<template>
    <div v-if="show" class="modal-mask">
        <transition name="modal-animate">
            <div v-if="dialog" class="v-modal">
                <div class="modal-header">
                    <!-- <i v-if="icon" :class="['iconfont', icon]"></i> -->
                    <span v-text="title"></span>
                    <i v-if="true" @click="close" class="iconfont iconcuowuguanbi-"></i>
                </div>
                <div class="modal-body">
                    <div>{{content}}</div>
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <button class="cancel" @click="cancel">取消</button>
                    <button class="confirm" @click="confirm">确认</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        show: {
            type: Boolean,
            default: () => false
        },
        title: {
            type: String,
            default: () => '我是标题'
        },
        content: String,
        icon: String,
        cancleable: {
            type: Boolean,
            default: () => true
        },
        closeable: {
            type: Boolean,
            default: () => true
        },
        content: {
            type: String
        }
    },
    data() {
        return {
            dialog: true
        }
    },
    watch: {
        show(val) {
            // 当有遮罩时, 禁止滚动
            document.body.style.overflow = val ? 'hidden' : 'auto'
            setTimeout(() => {
                this.dialog = val
            }, 100)
        }
    },
    methods: {
        close() {
            this.$emit('update:show', false)
            this.$emit('close')
        },
        cancel() {
            this.$emit('update:show', false)
            this.$emit('cancel')
        },
        confirm() {
            // this.$emit('update:show', false)
            this.$emit('confirm')
        }
    },
    mounted() {
        setTimeout(() => {
            this.dialog = this.show
        }, 100)
    }
}
</script>

<style scoped>
.modal-mask {
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    z-index: 10001;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    background-color: rgba(55, 55, 55, 0.6);
}

/* modal-animate */
.modal-animate-leave-active,
.modal-animate-enter-active {
    transition: all 0.4s;
}

.modal-animate-enter {
    opacity: 0;
    transform: translateY(-30px);
}

.modal-animate-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}

.v-modal {
    width: 520px;
    z-index: 12;

    background-color: #fff;
    border-radius: 5px;
}
.v-modal .modal-header {
    position: relative;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: #4c8bfd;
    color: #fff;
}
.v-modal .modal-header i:first-child {
    margin-right: 5px;
}
/* .v-modal .modal-header i:last-child{
        cursor: pointer;
        position: absolute;
        right: 16px;
    } */
.v-modal .modal-body {
    padding: 46px 16px;
    font-size: 17px;
    /* line-height: 1.5; */
    /* color: #3f4450; */
    text-align: center;
}
.v-modal .modal-footer {
    padding: 12px 18px;
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #f7f9fa;
}
.v-modal .modal-footer button {
    /* padding: 6px 15px; */
    width: 100px;
    height: 30px;
    font-size: 14px;
    border-radius: 4px;
    outline: none;
    border-width: 1px;
    border-style: solid;
    border-color: #2d8cf0;
}
.v-modal .modal-footer .cancel {
    border-color: #2d8cf0;
    background: #fff;
    color: #2d8cf0;
    box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
}
.v-modal .modal-footer .cancel:hover {
    box-shadow: none;
}
.v-modal .modal-footer .confirm {
    background-color: #4c8bfd;
    color: #fff;
    margin-left: 8px;
    box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.219);
}
.v-modal .modal-footer .confirm:hover {
    background-color: #6e9df5;
    border: 1px solid #6e9df5;
    box-shadow: none;
}
.v-modal .modal-footer .confirm:active {
    background-color: #4c8bfd;
}
</style>

