<template>
    <div class="v-pic-show">
        <div class="pic-content" @mouseenter="onmouseover($event)" @mouseleave="onmouseleave">
            <slot></slot>
        </div>
        <transition name="fade-transform">
            <div v-if="isShow" ref="showPic" :class="['tip',position, maxWidth ? 'word-wrap' : '']">
                <slot name="content"></slot>
                {{content}}
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'PicShow',
    props: {
        content: String,
        icon: String,
        // 图标位置,其实就是class
        // position: {
        //     type: String,
        //     default: 'top'
        // },
        maxWidth: {
            type: [Number, String]
        }
    },
    data() {
        return {
            isShow: false,
            position: 'down-right'
        }
    },
    methods: {
        onmouseover(e) {
            // console.log('🍪 e: ', e)
            // console.log('鼠标悬浮')
            this.isShow = true
            // setTimeout(()=>{
            //     let picEle = this.$refs
            //     console.log('🍥 picEle: ', picEle)
            // },210)
            let scrollTop = document.documentElement.scrollTop
            let scrollHeight = document.body.scrollHeight
            let toBottom = e.target.getBoundingClientRect().bottom
            let y = scrollHeight - scrollTop - toBottom

            if (toBottom >= 300 && y >= 300) {
                this.position = 'center-right'
            } else if (toBottom > y) {
                this.position = 'up-right'
            } else {
                this.position = 'down-right'
            }
            // this.position = 'up-right'
        },
        onmouseleave() {
            this.isShow = false
        }
    }
}
</script>

<style scoped>
/* fade-transform */

.fade-transform-enter-active {
    transition: all 0.2s;
}
/* .fade-transform-leave-active, */
.fade-transform-enter {
    opacity: 0.8;
    transform: scale(0.8);
}

.fade-transform-leave-to {
    opacity: 1;
    transform: scale(1);
}

.v-pic-show {
    position: relative;
    display: inline-block;
    padding: 0;
}
.tip {
    box-shadow: 1px 1px 4px rgb(150, 150, 150);
}
.v-pic-show > .down-right {
    position: absolute;
    top: 0px;
    left: 150%;
    /* margin-top: 100%; */
    /* transform: translateX(-50%); */
    /* line-height: 1.5; */
    /* border-radius: 3px; */
    /* background-color: #fff; */
    /* font-size: 12px; */

    /* white-space: nowrap; */
    z-index: 100;
    border-color: red;
    /* box-shadow: 1px 1px 4px rgb(150, 150, 150); */
    box-shadow: 1px 7px 25px 8px rgba(10, 10, 10, 0.308);
}
.v-pic-show > .center-right {
    position: absolute;
    top: 50%;
    left: 150%;
    /* margin-top: -50%; */
    transform: translateY(-50%);
    /* line-height: 1.5; */
    /* border-radius: 3px; */
    /* background-color: #fff; */
    /* font-size: 12px; */

    /* white-space: nowrap; */
    z-index: 100;
    border-color: 1px solide red;
    box-shadow: 1px 7px 25px 8px rgba(10, 10, 10, 0.308);
}
.v-pic-show > .up-right {
    position: absolute;
    /* top: 5px; */
    left: 150%;
    bottom: 0;
    /* margin-top: 100%; */
    /* transform: translateX(-50%); */
    /* border-radius: 3px; */
    /* background-color: #fff; */
    font-size: 12px;

    white-space: nowrap;
    z-index: 100;
    box-shadow: 1px 7px 25px 8px rgba(10, 10, 10, 0.308);
}

/* .v-pic-show span.word-wrap {
    white-space: normal;
} */

/* 三角形 */
/* .v-pic-show .bottom:after {
    content: '';

    display: inline-block;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%);

    width: 0;
    height: 0;
    border-width: 20px 6px 6px 6px;
    border-style: solid;
    border-color: transparent transparent hsla(0, 0%, 85%, 0.5) transparent;
} */

/* 提示在顶部 */
/* .v-pic-show .up-right {
    position: absolute;
    left: 150%;
    bottom: 0;
    z-index: 10;
    line-height: 1.5;
    padding: 2px 8px;
    white-space: nowrap;
    border-radius: 3px;
    color: #666;
    background: #fff;
    opacity: 1;
    box-shadow: 1px 1px 4px rgb(150, 150, 150);
} */
</style>