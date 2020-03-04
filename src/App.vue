<template>
    <div id="app">
        <!-- 顶部 -->
        <Header class="app-header"></Header>
        <!-- <div style="border:1px solid red;width:10rem;">10rem</div>
        <div style="border:1px solid red;width:10em;">10em</div>-->

        <div class="app-content">
            <!-- 侧边栏 -->
            <div class="app-aside">
                <Aside class="adf"></Aside>
            </div>
            <div class="app-main">
                <TabNav class="tab-nav"></TabNav>
                <transition name="fade-transform" mode="out-in">
                    <keep-alive :include="keepAliveInclude" :exclude="keepAliveExclude">
                        <router-view class="router-view" />
                    </keep-alive>
                </transition>
            </div>
        </div>
        <!-- <div class="load-back">
            <div class="loading"></div>
        </div>-->
        <div id="toast-box"></div>
        <!-- <div class="modal-mask" v-if="showMask"></div> -->
        <!-- <div id="message-box"> </div> -->
        <div id="notice-box"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
            play: true,
            excludeRouteName: []
        }
    },
    computed: {
        ...mapGetters(['keepAliveInclude','keepAliveExclude']),
        // keepAliveList() {
        //     // tab_nav_list 中的每一个没有exclude的都保持keep-alive, 还有home
        //     // let home = 'Home'
        //     // return this.tab_nav_list.map(item => item.name &&(!item.exclude)).concat(home)
        // }
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
        },

        // 阻止 别人f12按键审查代码
        stopCheckCode() {
            document.onkeydown = function(e) {
                let currKey = 0
                let evt = e || window.event
                currKey = evt.keyCode || evt.which || evt.charCode
                if (currKey == 123) {
                    window.event.cancelBubble = true
                    window.event.returnValue = false
                }
            }
        }
    },
    mounted() {
        // this.stopCheckCode()
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
    display: flex;
    /* justify-content: center; */
    min-width: 1200px;
    max-width: 2220px;
    margin: 10px auto 0 auto;
}

.app-aside {
    /* width: 150px; */
    margin-left: 10px;
    /* overflow: scroll; */
}
.app-main {
    margin-left: 10px;
    /* width: 100%; */
    width: 100%;
    overflow: hidden;
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.3s;
}

.fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
/* .router-view{
    width: 1040px;
} */
.tab-nav {
    width: 100%;
    margin-bottom: 5px;
    padding-right: 20px;
}
#toast-box {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10002;
}
#notice-box {
    position: fixed;
    z-index: 30;
    right: 7px;
    bottom: 10px;
}
</style>




<style>
/* ----------------------    公共样式    全局-------------------------------------------------- */

@media screen and (max-width: 1200px) {
    /* .app-content {
        font-size: 12px;
    } */
    html {
        /* color: rgb(110, 38, 243); */

        font-size: 12px;
    }

    .app-aside {
        width: 150px;
    }
}

@media screen and (min-width: 1201px) and (max-width: 1400px) {
    /*  .app-content {
        max-width: 1200px;
    } */
    html {
        /* color: rgb(243, 120, 38); */
        font-size: 12px;
    }
    .app-aside {
        width: 165px;
    }
}
@media screen and (min-width: 1401px) and (max-width: 1600px) {
    /*  .app-content {
        max-width: 1400px;
    } */
    .app-aside {
        width: 180px;
    }
    html {
        /* width: 1240px; */
        font-size: 13px;
        /* color: rgb(192, 192, 5); */
    }
}
@media screen and (min-width: 1601px) and (max-width: 1900px) {
    /*  .app-content {
        max-width: 1600px;
    } */
    html {
        /* width: 1440px; */
        font-size: 14px;

        /* color: green; */
    }
    .app-aside {
        width: 195px;
    }
}
@media screen and (min-width: 1901px) and (max-width: 2300px) {
    /*  .app-content {
        max-width: 1900px;
    } */
    html {
        /* width: 1740px; */
        /* color: turquoise; */
        font-size: 15px;
    }
    .app-aside {
        width: 210px;
    }
}

@media screen and (min-width: 2301px) {
    /*   .app-content {
        max-width: 2300px;
    } */
    html {
        /* width: 2140px; */
        /* color: purple !important; */
        font-size: 15px;
    }
    .app-aside {
        width: 225px;
    }
}

/* @media screen and (min-width: 2500px) {
    .app-content {
        max-width: 2500px;
    }
    html {
        width: 2340px;
        color: darkblue;
    }
} */

/* setup tooltips */

::-webkit-scrollbar {
    width: 5px;
    height: 13px;
    background-color: #808080;
}
/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(239, 240, 241, 0.979); */
    box-shadow: inset 0 0 6px rgba(241, 241, 241, 0.568);
    border-radius: 3px;
    background-color: #d6d8da;
}
/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 3px;
    /* -webkit-box-shadow: inset 0 0 3px rgba(247, 247, 247, 0.849); */
    box-shadow: inset 0 0 3px rgba(243, 243, 243, 0.849);
    background-color: #a8a8a8;
}

.textarea {
    padding: 10px;
    /* min-height: 130px; */
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 14px;
}
.textarea:focus {
    border: 1px solid #4c8bfd;
}
.container {
    padding: 20px 8px 20px 8px;
    background: #fff;
    border: 1px solid #4c8bfd;
    margin-right: 10px;
    /* min-width: 1040px; */
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
/* .v-modal {
   
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); 
    background-color: #fff;
    border-radius: 5px;
} */
/* transform 会影响position fixed的定位 */

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
button:focus {
    outline: 1px dotted #4c8bfd;
}
/* button :disabled{
    padding: 4px 8px;
    color:#ccc;
    border: 1px solid #ccc;
    cursor: not-allowed;
} */
.btn {
    padding: 5px 15px;
    box-sizing: border-box;
    border-radius: 3px;
    outline: none;
    /* border: none; */
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
    box-shadow: 1px 1px 2px rgba(5, 65, 37, 0.2);
    color: #fff;
    background: #07d184;
}

.btn-green:hover {
    background: #1ad48d;
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
    color: #b9cff8;
    box-shadow: none;
    background: #2c71f1;
}

/* .btn-blue-large:hover {
    box-shadow: none;
    background: #6397f7;
} */

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
    color: #83acf7;
    border: 1px solid #83acf7;
}
.btn-plain:active {
    color: #4c8bfd;
    border: 1px solid #4c8bfd;
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
    color: #6796ec;
    border: 1px solid #6796ec;
}
/* 小按钮 */
.btns-red {
    color: #fff;
    background: #ec5946;
    box-shadow: 1px 1px 3px rgba(255, 106, 106, 0.226);
}
.btns-red:hover {
    background: rgba(241, 119, 119, 0.8);
}
.btns-red:active {
    background: #ec5946;
}
.btns-green {
    color: #fff;
    background: #19be6b;
    box-shadow: 1px 1px 3px rgba(37, 224, 131, 0.253);
}
.btns-green:hover {
    background: #35d485;
}
.btns-gree:active {
    background: #4cc013;
}
.btns-blue {
    color: #fff;
    background: #4c8bfd;
    box-shadow: 1px 1px 3px rgba(102, 158, 255, 0.2);
}
.btns-blue:hover {
    background: rgba(68, 137, 255, 0.801);
}
.btns-blue:active {
    color: #fff;
    background: #4c8bfd;
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
    align-items: center;
    justify-content: space-between;
    /* white-space: nowrap; */
    /* font-size: 13px; */
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

/* 所有筛选下面的输入框 */
/* .filter .w10rem{
    width: 10rem;
    min-width: 100px;

} */
.filter .left > li > span:first-child {
    margin-right: 4px;
}
.filter .v-input,
.filter .v-date-picker,
.filter .v-select {
    width: 8.3rem;
}
/* 让page 居中,margin-top设置为25 */
.table-page {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 30px;
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
    width: 100px;
}
.w250 {
    width: 250px;
}
.mh5 {
    margin-left: 5px;
    margin-right: 5px;
}
.ml5 {
    margin-left: 5px;
}
.ml10 {
    margin-left: 10px;
}
.ml20 {
    margin-left: 20px;
}
.ml50 {
    margin-left: 50px;
}
.mr5 {
    margin-right: 5px;
}

.mt10 {
    margin-top: 10px;
}
.mt20 {
    margin-top: 20px;
}
.mt50 {
    margin-top: 50px;
}
.mb10 {
    margin-bottom: 10px;
}
.p5 {
    padding: 5px;
}
.p10 {
    padding: 10px;
}
/* 字体颜色 */
.orange {
    color: #ff9900;
}
.blue {
    color: #4c8bfd;
}
.green {
    color: #4cc013;
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
/* .total-table ul {
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
} */
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
.t-center-center {
    display: table-cell;
    vertical-align: middle;
}
</style>
