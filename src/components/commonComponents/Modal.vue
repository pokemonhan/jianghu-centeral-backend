<template>
    <div v-if="show" class="modal-mask">
        <transition name="modal-animate">
            <div v-if="show" class="v-modal">
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
        return {}
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
    }
}
</script>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 10001;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(55, 55, 55, 0.6);
}
.v-modal {
    width: 520px;
    position: absolute;
    /* top: 100px; */
    top: 40%;
    z-index: 10002;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    /* border-radius: 8px; */
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
    background-color: #2d8cf0;
    color: #fff;
    margin-left: 8px;
    box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.219);
}
.v-modal .modal-footer .confirm:hover {
    box-shadow: none;
}
</style>

