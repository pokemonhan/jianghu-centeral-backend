<template>
    <div id="app">
        <!-- 顶部 -->
        <Header class="app-header"></Header>
        <div class="app-content">
            <!-- 侧边栏 -->
            <Aside class="app-aside"></Aside>
            <div class="app-main">
                <TabNav class="tab-nav"></TabNav>
                <router-view class="router-view" />
            </div>
        </div>
        <div id="toast-box"></div>
        <!-- <div class="modal-mask" v-if="showMask"></div> -->
        <!-- <div id="message-box"></div> -->
    </div>
</template>

<script>
// import { mapGetters } from 'vuex'

import Header from './components/Header.vue'
import Aside from './components/Aside.vue'
import TabNav from './components/TabNav.vue'

export default {
    name: 'App',
    components: {
        Header: Header,
        Aside: Aside,
        TabNav: TabNav
    },
    data() {
        return {
            play: true
        }
    },
    computed: {
        // ...mapGetters(['showMask'])
    },
    methods: {
        playMusic() {
            //方式1
            // var audio = document.createElement("audio");
            // audio.src = require("./assets/audio/wan.wav");
            // audio.play();
            // 方式2
            // var audio = new Audio(require('./assets/audio/wan.wav'))
            // audio.play();

            // let play = true
            // document.body.addEventListener('mouseenter', function() {
            //     play && audio.play()
            //     play = false
                // audio = null;
            // })
        }
    },
    mounted() {
        let self = this
        setTimeout(() => {
            // self.playMusic()
        }, 400)
    }
}
</script>

<style scoped>
.app-header {
    width: 100%;
}
.app-content {
    max-width: 1200px;
    display: flex;
    margin: 0 auto;
    margin-top: 20px;
}
.app-aside {
    width: 150px;
    /* overflow: hidden; */
}
.app-main {
    margin-left: 10px;
    /* width: 100%; */
    width: 1040px;
    overflow: hidden;
}
/* .router-view{
    width: 1040px;
} */
.tab-nav {
    width: 100%;
}
#toast-box {
    position: fixed;
    top: 10px;
    left: 50%;
}
</style>




<style>
/* ----------------------    公共样式    全局-------------------------------------------------- */
.textarea {
    padding: 10px;
    /* min-height: 130px; */
    border-radius: 4px;
    border: 1px solid #ddd;
    /* font-size: 16px; */
}
.container {
    padding: 20px 8px 20px 8px;
    background: #fff;
    border: 1px solid #4c8bfd;
    width: 1040px;
}
/* 背景遮罩层 */
.modal-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.6);
}
.v-modal {
    /* min-width: 160px;
    min-height: 90px; */
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 5px;
}
.modal-mask .mod-head {
    position: relative;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: #4c8bfd;
    color: #fff;
}
/* modal 关闭按钮 */
.modal-mask .iconcuowuguanbi- {
    position: absolute;
    right: 12px;
    font-size: 26px;
    color: #ffffff;
    cursor: pointer;
}
.modal-mask .iconcuowuguanbi-:hover {
    /* color: #1660ebb0; */
    transform: scale(1.1);
}
.modal-mask .mod-body {
    padding: 20px 25px;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
/* 按钮 */
button {
    outline: none;
    border: none;
    padding: 4px 8px;
    border-radius: 3px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    margin: 0 2px;
}
button:hover {
    box-shadow: none;
}
.btn {
    padding: 5px 15px;
    box-sizing: border-box;
    border-radius: 3px;
    outline: none;
    border: none;
    cursor: pointer;
    color: #4c8bfd;
    border: 1px solid #4c8bfd;
    background-color: #fff;
}

.btn:hover {
    box-shadow: none;
}

.btn-blue {
    padding: 5px 16px;
    box-shadow: 1px 1px 2px #2e549b3d;
    color: #fff;
    background: #4c8bfd;
}

.btn-blue:hover {
    background: #6397f7;
    transition: box-shadow 0.2s;
}
.btn-blue:active {
    box-shadow: none;
    background: #4c8bfd;
}
.btn-orange {
    padding: 5px 16px;
    box-shadow: 1px 1px 2px rgba(250, 170, 11, 0.2);
    color: #fff;
    background: #faaa0b;
}

.btn-orange:hover {
    background: rgb(248, 180, 44);
    transition: box-shadow 0.2s;
}
.btn-orange:active {
    box-shadow: none;
    background: #faaa0b;
}
/* 绿色 按钮 */
.btn-green {
    padding: 5px 16px;
    box-shadow: 1px 1px 2px rgba(250, 170, 11, 0.2);
    color: #fff;
    background: #07d184;
}

.btn-green:hover {
    background: #00cc33;
    transition: box-shadow 0.2s;
}
.btn-green:active {
    box-shadow: none;
    background: #07d184;
}
/* 红色 按钮 */
.btn-red {
    padding: 5px 16px;
    color: #fff;
    background: #ff6a6a;
    box-shadow: 1px 1px 2px rgba(138, 37, 37, 0.205);
}

.btn-red:hover {
    background: rgb(250, 123, 123);
}
.btn-red:active {
    background: #ff6a6a;
}

.btn-blue-large {
    height: 30px;
    width: 100px;
    /* padding: 9px 22px; */
    /* outline: none; */
    border: none;
    /* box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); */
    cursor: pointer;
    box-sizing: border-box;
    border-radius: 3px;
    color: #fff;
    background: #4c8bfd;
}

.btn-blue-large:hover {
    box-shadow: none;
    background: #6397f7;
}
.btn-blue-large:active {
    box-shadow: none;
    background: #3f7beb;
}
.btn-blue-large:hover {
    box-shadow: none;
    background: #6397f7;
}

.btn-plain {
    /* height: 26px; */

    padding: 4px 15px;
    box-sizing: border-box;
    /* box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); */
    color: #4c8bfd;
    border: 1px solid #4c8bfd;
    background-color: #fff;
}

.btn-plain:hover {
    box-shadow: none;
    color: #246aeb;
}

.btn-plain-large {
    /* height: 26px; */
    height: 30px;
    width: 100px;
    /* padding: 8px 22px; */
    box-sizing: border-box;
    /* box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); */
    color: #4c8bfd;
    border: 1px solid #4c8bfd;
    background-color: #fff;
}

.btn-plain-large:hover {
    color: #246aeb;
}
.btn-plain-large:active {
    box-shadow: none;
    color: #3f7beb;
}
/* 小按钮 */
.btns-red {
    color: #fff;
    background: #ff6a6a;
    box-shadow: 1px 1px 3px rgba(255, 106, 106, 0.226);
}
.btns-red:hover {
    background: rgba(245, 87, 87, 0.8);
}
.btns-red:active {
    background: #ff6a6a;
}
.btns-green {
    color: #fff;
    background: #4cc013;
    box-shadow: 1px 1px 3px rgba(67, 204, 17, 0.2);
}
.btns-green:hover {
    background: #42a80f;
}
.btns-gree:active {
    background: #4cc013;
}
.btns-blue {
    color: #fff;
    background: #48f;
    box-shadow: 1px 1px 3px rgba(68, 137, 255, 0.2);
}
.btns-blue:hover {
    background: rgba(68, 137, 255, 0.801);
}
.btns-blue:active {
    color: #fff;
    background: #48f;
}
.btns-yellow {
    color: #fff;
    background: #fa0;
    box-shadow: 1px 1px 3px rgba(255, 170, 0, 0.2);
}
.btns-yellow:hover {
    background: rgba(255, 170, 0, 0.815);
}
.btns-yellow {
    color: #fff;
    background: #fa0;
}

/* *星符号 */
.require::before {
    content: '*';
    color: red;
    /* line-height: 1em; */
}

.flex {
    display: flex;
}

.filter {
    display: flex;
    /* line-height: 30px; */
    align-items: center;
    justify-content: space-between;
    /* white-space: nowrap; */
    font-size: 13px;
    /* line-height: 30px; */
    background: #f2f2f2;
}

.filter .left,
.filter .right {
    display: flex;
    flex-wrap: wrap;
}

.filter .left > li {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.filter .left > li > span:first-child {
    margin-right: 4px;
}

.table-page {
    margin-top: 25px;
    display: flex;
    justify-content: center;
}

.a {
    /* font-weight: 400; */
    text-decoration: underline;
    cursor: pointer;
    color: #4c8bfd;
    margin-left: 8px;
}

.a:active {
    color: red;
}
.w100 {
    width: 110px;
}
/* 字体颜色 */
.orange {
    color: #ff9900;
}
.blue {
    color: #4c8bfd;
}
.green {
    color: #00cc33;
}

.red {
    color: #f44;
}
.purple {
    color: #9900ff;
}
/* 背景色 */
.bg-orange {
    background: #ff9900;
}
.bg-blue {
    background: #4c8bfd;
}
.bg-green {
    background: #4cc013;
}
.bg-red {
    background: #f44;
}
.bg-gray {
    background: #f2f2f2;
}
.p10 {
    padding: 10px;
}
.total-table ul {
    display: flex;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    font-weight: bold;
    color: #4c8bfd;
    background: rgba(229, 247, 255, 1);
}
.total-table ul > li {
    margin-right: 100px;
}
.g-form > li {
    display: flex;
    align-items: center;
}
.g-form > li > span:first-child {
    border: 1px solid #000;
}
.bold {
    font-weight: bold;
}
</style>
