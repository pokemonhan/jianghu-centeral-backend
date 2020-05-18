<template>
    <div>
        <div class="header">
            <div class="content">
                <div class="left">
                    <div class="head-title">
                        <span class="title">总控后台</span>
                    </div>
                </div>
                <ul class="right">
                    <li>
                        <span>在线人数</span>
                        <span>{{'35456'}}</span>
                    </li>
                    <li style="margin-left:50px;">
                        <span>活跃人数</span>
                        <span>{{'3646'}}</span>
                    </li>

                    <!-- 喇叭 -->
                    <li style="width:22px;margin-left:50px;" @click="play_music=!play_music">
                        <i
                            :class="['iconfont',play_music?'iconspeaker':'iconmute']"
                        ></i>
                    </li>
                    <li class="account" @mouseenter="accoutEnter" @mouseleave="accountLeave">
                        <span>
                            <i class="iconfont iconzhanghao"></i>
                        </span>
                        <span>{{user_name}}</span>
                        <span>退出</span>
                        <ul class="account-inner">
                            <li @click="dia_show=true">修改密码</li>
                            <li @click="logout">退出</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <Modal
            :show="logout_conf_show"
            title="退出"
            content="确认退出"
            @confirm="logoutConf"
            @close="logout_conf_show = false"
            @cancel="cancel"
        ></Modal>
        <Dialog :show.sync="dia_show" title="修改密码">
            <div class="dia-inner">
                <div class="center-box">
                    <ul class="form">
                        <li>
                            <span>原密码</span>
                            <Input
                                class="w250"
                                limit="en-num"
                                type="password"
                                v-model="form.old_pwd"
                            />
                            <p v-show="err_tips[0]" class="err-tips">{{err_tips[0]}}</p>
                        </li>
                        <li>
                            <span>新密码</span>
                            <Input
                                class="w250"
                                limit="en-num"
                                type="password"
                                v-model="form.new_pwd"
                            />
                            <p v-show="err_tips[1]" class="err-tips">{{err_tips[1]}}</p>
                        </li>
                        <li>
                            <span>确认密码</span>
                            <Input
                                class="w250"
                                limit="en-num"
                                type="password"
                                v-model="form.conf_pwd"
                            />
                            <p v-show="err_tips[2]" class="err-tips">{{err_tips[2]}}</p>
                        </li>
                    </ul>
                    <div class="form-btns">
                        <button class="btn-plain-large" @click="dia_show=false">取消</button>
                        <button class="btn-blue-large ml50" @click="passwordConf">确认</button>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
export default {
    name: 'Header',
    // components: { tabNav, langSelect },
    data() {
        return {
            // isfullScreen: true,
            play_music: true,
            account_ishow: false,
            logout_conf_show: false,
            user_name: '',
            dia_show: false,
            form: {
                old_pwd: '',
                new_pwd: '',
                conf_pwd: ''
            },
            err_tips: ['', '', '', '']
        }
    },

    methods: {
        // 全屏
        // fullScreen() {
        //     if (this.isfullScreen) {
        //         var docElm = document.documentElement;
        //         if (docElm.requestFullscreen) {
        //             docElm.requestFullscreen();
        //         } else if (docElm.mozRequestFullScreen) {
        //             docElm.mozRequestFullScreen();
        //         } else if (docElm.webkitRequestFullScreen) {
        //             docElm.webkitRequestFullScreen();
        //         } else if (elem.msRequestFullscreen) {
        //             elem.msRequestFullscreen();
        //         }
        //         this.isfullScreen = false;
        //     } else {
        //         if (document.exitFullscreen) {
        //             document.exitFullscreen();
        //         } else if (document.mozCancelFullScreen) {
        //             document.mozCancelFullScreen();
        //         } else if (document.webkitCancelFullScreen) {
        //             document.webkitCancelFullScreen();
        //         } else if (document.msExitFullscreen) {
        //             document.msExitFullscreen();
        //         }
        //         this.isfullScreen = true;
        //     }
        // },

        playMusic() {
            // let ele = document.querySelector('.playMusic');
            // console.log("TCL: playMusic -> ele", ele)
            // ele.play()
            //方式1
            // var audio = document.createElement("audio");
            // audio.src = require("../assets/audio/wan.wav");
            // audio.play();
            //方式2
            // var audio = new Audio(require('../assets/audio/wan.wav'))
            // audio.play()
        },
        accoutEnter() {
            let ele = document.querySelector('.account-inner')
            ele.style.display = 'block'
            ele.style.maxHeight = '100px'
            // ele.style.overflow = 'visible'
            this.account_ishow = true
        },
        accountLeave() {
            this.account_ishow = false
            let ele = document.querySelector('.account-inner')
            // todo
            ele.style.maxHeight = '0'
            ele.style.overflow = 'hidden'

            let self = this
            setTimeout(() => {
                if (self.account_ishow === false) {
                    //todo
                    ele.style.display = 'none'
                }
            }, 300)
        },
        logout() {
            // window.all.tool.removeSession('token')
            // this.$router.push('/login')
            this.logout_conf_show = true
        },
        logoutConf() {
            let self = this
            this.$http({
                method: this.$api.logout.method,
                url: this.$api.logout.url
                // data: params
            }).then(res => {
                if (res.code === '200') {
                    self.$toast('登出成功')
                }
            })
            // window.all.tool.removeSession('token')
            this.$router.push('/login')
            this.logout_conf_show = false
        },
        cancel() {
            this.logout_conf_show = false
        },
        checkPwd() {
            let { old_pwd, new_pwd, conf_pwd, verificCode } = this.form
            let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/

            // 原密码
            if (!regExp.test(old_pwd)) {
                this.$set(
                    this.err_tips,
                    '0',
                    '请输入8~16位英文字母+数字密码组合!'
                )
                return false

                // 新密码 验证
            } else if (!regExp.test(new_pwd)) {
                this.$set(
                    this.err_tips,
                    '1',
                    '请输入8~16位英文字母+数字密码组合!'
                )
                return false

                // 确认密码
            } else if (!regExp.test(conf_pwd)) {
                this.$set(
                    this.err_tips,
                    '2',
                    '请输入8~16位英文字母+数字密码组合!'
                )
                return false

                // 确认密码是否与原密码相同
            } else if (new_pwd !== conf_pwd) {
                this.$set(this.err_tips, '2', '两次密码不同!')
                return false
            } else {
                return true
            }
        },
        // 密码确认
        passwordConf() {
            this.err_tips = ['', '', '', '']
            if (!this.checkPwd()) return
            console.log('form', this.form)
            let data = {
                old_password: this.form.old_pwd,
                password: this.form.new_pwd
            }
            let { method, url } = this.$api.self_update_pwd
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                } else {
                    if (res && res.message !== '') {
                        self.toast.error(res.message)
                    }
                }
            })
        }
    },
    watch: {
        $route() {
            this.user_name = window.all.tool.getLocal('name')
        }
    },
    mounted() {
        // this.user_name = window.all.tool.getLocal('name')
        // console.log('this.user_name: ', this.user_name);
    }
}
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #4c8bfd;
    /* font-size: 14px; */
}
.content {
    /* height: 100%; */
    display: flex;
    /* flex-wrap: wrap; */
    justify-content: space-between;
    align-items: center;
    width: 100%;
    /* line-height: 70px; */
    min-width: 700px;
    max-width: 2220px;

    margin: 0 auto;
    padding-left: 30px;
    padding-right: 30px;
    color: #fff;
    /* background: #4c8bfd; */
}
.left {
    display: flex;
    align-items: center;
    /* border: 1px solid #000; */
    line-height: 42px;
}
.left .title {
    font-size: 30px;
}
.left .detail {
    margin-left: 30px;
}
.left .up .date-due {
    font-size: 18px;
}
.content .left .down {
    display: flex;
    margin-top: 10px;
}
.down > li {
    margin-right: 28px;
}
.down > li > span:first-child {
    margin-right: 2px;
}
/* .content .left > span:not(:first-child) {
    margin-left: 20px;
} */

.content .right {
    display: flex;
    align-items: center;
    /* margin-left: 50px; */
    margin-right: 10px;
}
/* .content .mt10{
    margin-top: 10px;
} */
.content .right > li {
    margin-right: 8px;
    cursor: pointer;
    /* height: 65%; */
    /* border: 1px solid #000; */
}

.content .right > li > span:first-child:hover {
    color: #e5edfa;
}

.content .right .info-music {
    display: inline-block;
    width: 56px;
}

.iconfont {
    margin-right: 5px;
}
/* .badge */
/* .badge .badge-inner {
    display: inline-block;
    position: relative;
    top: -10px;
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 12px;
    background: rgb(235, 58, 58);
    border-radius: 10px;
} */
.account {
    position: relative;
}
.account-inner {
    display: none;
    width: 100px;
    position: absolute;
    right: -10px;
    top: 30px;
    border-radius: 3px;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.212);
    z-index: 20;
    color: #000;
    background: #fff;
    transition: max-height 0.3s ease;
}
.account-inner > li {
    width: 100%;
    height: 40px;
    line-height: 40px;
    /* padding: 6px 20px; */
    /* border-bottom: 1px solid #000; */
    text-align: center;
}
.account-inner > li:hover {
    color: #fff;
    background: #70a1fd;
}
.pointer {
    cursor: pointer;
}
.dia-inner {
    width: 600px;
    min-height: 200px;
    /* border: 1px solid red; */
}
.center-box {
    width: 350px;
    margin: 0 auto;
    /* border: 1px solid green; */
}
.form > li {
    display: flex;
    position: relative;
    align-items: center;
    margin-top: 20px;
}
.form > li > span:first-child {
    display: inline-block;
    min-width: 4em;
    text-align: right;
    margin-right: 10px;
}
.w250 {
    width: 250px;
}

.err-tips {
    position: absolute;
    top: 31px;
    left: 70px;
    color: red;
    font-size: 12px;
}
.form-btns {
    margin-top: 40px;
    text-align: center;
}
.ml50 {
    margin-left: 50px;
}
</style>
