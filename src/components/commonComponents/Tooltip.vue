<template>
    <div class="v-tooltip" @mouseenter="onmouseover" @mouseleave="onmouseleave">
        <slot></slot>
        <transition name="fade-transform">
            <span
                v-show="isShow"
                :class="[position, maxWidth ? 'word-wrap' : '']"
                :style="{width: maxWidth+'px'}"
            >
                <slot name="content"></slot>
                {{content}}
            </span>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Tooltip',
    props: {
        content: String,
        icon: String,
        position: {
            type: String,
            default: 'top'
        },
        maxWidth: {
            type: [Number, String]
        }
    },
    data() {
        return {
            isShow: false
        }
    },
    methods: {
        onmouseover() {
            this.isShow = true
        },
        onmouseleave() {
            this.isShow = false
        }
    }
}
</script>

<style scoped>
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.2s;
}

.fade-transform-enter,
.fade-transform-leave-to {
    opacity: 0;
    transform: scale(0.1);
}

.fade-transform-leave,
.fade-transform-enter-to {
    opacity: 1;
    transform: scale(1);
}

.v-tooltip {
    position: relative;
    display: inline-block;
    padding: 0;
}
/* .normal {
    position: absolute;
    opacity: 1;
    transform: scale(0.1);
    transition: all 0.4s;
} */
.v-tooltip > .bottom {
    position: absolute;
    top: 5px;
    left: 50%;
    margin-top: 100%;
    transform: translateX(-50%);
    line-height: 1.5;

    padding: 2px 8px;
    border-radius: 3px;
    background-color: #fff;
    font-size: 12px;

    white-space: nowrap;
    z-index: 10;
    /* border-color: hsla(0, 0%, 85%, 0.5); */
    box-shadow: 1px 1px 4px rgb(150, 150, 150);
}
.v-tooltip span.word-wrap {
    white-space: normal;
}

/* 三角形 */
.v-tooltip .bottom:after {
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
}

/* 提示在顶部 */
.v-tooltip .top {
    position: absolute;
    top: -220%;
    left: 50%;
    z-index: 10;
    line-height: 1.5;
    transform: translateX(-50%);
    padding: 2px 8px;
    white-space: nowrap;
    border-radius: 3px;
    color: #666;
    background: #fff;
    opacity: 1;
    box-shadow: 1px 1px 4px rgb(150, 150, 150);
}
/* 三角形 */
.v-tooltip .top::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 5px;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
}
</style>