<template>
    <div v-if="show" ref="mask" class="dialog-mask">
        <transition name="fade-transform">
            <div v-if="dialog" ref="dialog" class="v-dialog">
                <div>
                    <div class="dialog-header" ref="header">
                        <!-- <i v-if="icon" :class="['iconfont', icon]"></i> -->
                        <span v-text="title"></span>
                        <i @click="close" class="iconfont iconcuowuguanbi-"></i>
                    </div>
                    <div class="dialog-body">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Dialog',
    props: {
        show: {
            type: Boolean,
            default: () => false
        },
        title: {
            type: String,
            default: () => '我是标题'
        },
        icon: String
    },
    data() {
        return {
            dialog: true
        }
    },
    methods: {
        close() {
            this.$emit('update:show', false)
            this.$emit('close')
        },
        dragBox(drag, wrap) {
            // console.log('wrap: ', wrap)
            // console.log('drag: ', drag)
            let headerDom = this.$refs.header

            function getCss(ele, prop) {
                return parseInt(window.getComputedStyle(ele)[prop])
            }

            var initX,
                initY,
                dragable = false,
                wrapLeft = getCss(wrap, 'left'),
                wrapRight = getCss(wrap, 'top')
            // console.log('wrapLeft: ', wrapLeft);
            drag.addEventListener(
                'mousedown',
                function(e) {
                    // 如果 鼠标在 header 里面可以拖动
                    if (headerDom.contains(e.target)) {
                        dragable = true
                        initX = e.clientX
                        initY = e.clientY
                    }
                },
                false
            )

            document.addEventListener('mousemove', function(e) {
                if (dragable === true) {
                    var nowX = e.clientX,
                        nowY = e.clientY,
                        disX = nowX - initX,
                        disY = nowY - initY
                    wrap.style.left = wrapLeft + disX + 'px'
                    wrap.style.top = wrapRight + disY + 'px'
                }
            })

            drag.addEventListener(
                'mouseup',
                function(e) {
                    dragable = false
                    wrapLeft = getCss(wrap, 'left')
                    wrapRight = getCss(wrap, 'top')
                },
                false
            )
        }
        // cancel() {
        //     this.$emit('update:show', false)
        //     this.$emit('cancel')
        // },
        // confirm() {
        //     this.$emit('update:show', false)
        //     this.$emit('confirm')
        // }
    },
    watch: {
        show(val) {
            // 当有遮罩时, 禁止滚动
            document.body.style.overflow = val ? 'hidden' : 'auto'

            setTimeout(() => {
                this.dialog = val
            }, 100)
        },

        dialog(val) {
            if (val) {
                this.$nextTick().then(() => {
                    this.dragBox(this.$refs.mask, this.$refs.dialog)
                })
            }
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
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.4s;
}

.fade-transform-enter {
    opacity: 0;
    transform: translateY(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
/* 背景遮罩层 */
.dialog-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
    overflow: hidden;
}
.v-dialog {
    /* min-width: 160px;
    min-height: 90px; */
    /* position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); */
    /* width: 100%;
    height: 100%; */
    position: relative;
    min-width: 400px;
    min-height: 220px;
    background-color: #fff;
    border-radius: 5px;
}
.dialog-mask .dialog-header {
    position: relative;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: #4c8bfd;
    color: #fff;
    /* cursor: move; */
    /* -webkit-cursor:move; */
}
/* dialog 关闭按钮 */
.dialog-mask .iconcuowuguanbi- {
    position: absolute;
    right: 12px;
    font-size: 26px;
    color: #ffffff;
    cursor: pointer;
}
.dialog-mask .iconcuowuguanbi-:hover {
    /* color: #1660ebb0; */
    transform: scale(1.1);
}
.dialog-mask .dialog-body {
    max-height: 90vh;
    max-width: 96vw;
    padding: 20px 25px;
    overflow: auto;
}
</style>

 