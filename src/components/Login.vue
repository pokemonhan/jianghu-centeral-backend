<template>
    <div class="login">
        <div class="inner">
            <!-- <div class="left"> -->
            <img class="left" src="../assets/image/login/left.jpg" alt="图片刷新加载..." />
            <!-- </div> -->
            <div class="right login-box">
                <div>
                    <div class="title">江湖总控</div>
                    <div style="margin-top:50px;">
                        <ul>
                            <li class>
                                <span class="v-input">
                                    <i class="iconfont iconzhanghao"></i>
                                    <input
                                        class="input"
                                        type="text"
                                        placeholder="请输入账号"
                                        v-model="account"
                                    />
                                </span>
                                <div v-show="accMsg" class="err-item">{{accMsg}}</div>
                            </li>
                            <li></li>
                            <li class>
                                <span class="v-input">
                                    <i class="iconfont iconsuo"></i>
                                    <input
                                        class="input"
                                        type="password"
                                        placeholder="请输入密码"
                                        v-model="password"
                                        @keyup.enter="login"
                                    />
                                </span>
                                <div v-show="pwdMsg" class="err-item">{{pwdMsg}}</div>
                            </li>
                            <!-- <li class="err-item">
                                <span>{{pwdMsg}}</span>
                            </li>-->
                            <!-- <li>
                                <div class="flex">
                                      <span class="verify-input">
                                    <i class="iconfont icondunpai"></i>
                                    <input
                                        class="input"
                                        type="text"
                                        placeholder="验证码"
                                        v-model="verifyCode"
                                    />
                                </span>
                                <span class="verify-img"></span>
                                <span class="pic-change">换一张</span>
                                </div>
                                <div v-show="verifyMsg" class="err-item">{{verifyMsg}}</div>
                            </li>-->
                            <li style="margin-top:40px;">
                                <button
                                    :class="['login-btn',login_show?'cursor-wait':'']"
                                    @click="login"
                                    :disabled="login_show"
                                >登录</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- <Loading :show="login_show"/>  -->
        <!-- <div class="modal-mask" v-if="login_show">
            <Loading show />
        </div>-->
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            account: '',
            password: '',
            verifyCode: '',
            unameReg: /^.{8,32}$/,
            pwdReg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
            accMsg: '',
            pwdMsg: '',
            verifyMsg: '',
            login_show: false
        }
    },
    methods: {
        checkUname() {
            if (!this.account) {
                this.accMsg = '账号不能为空'
            } else {
                this.accMsg = this.unameReg.test(this.account)
                    ? ''
                    : '请输入8-16个字符组合账号'
            }
            return this.accMsg ? false : true
        },
        checkPwd() {
            if (!this.password) {
                this.pwdMsg = '密码不能为空'
            } else {
                this.pwdMsg = this.pwdReg.test(this.password)
                    ? ''
                    : '请输入8-16个字母+数字组合'
            }
            // TODO 解放这里,当格式不对,不通过
            return this.pwdMsg ? false : true
            return true
        },
        // checkVerify(){
        //     return true
        //     // console.log(this.verifyCode,'验证码');
        //   if(this.verifyCode){
        //       this.verifyMsg = ''
        //       return true
        //   }else{
        //       this.verifyMsg = '验证码不能为空'
        //       return false
        //   }

        // objToArr(obj, pre_idx = '') {
        //     // let list = []
        //     return Object.keys(obj).map((key, index) => {
        //         let item = obj[key]

        //         let template = {
        //             id: item.id,
        //             label: item.label,
        //             en_name: item.en_name,
        //             path: item.route,
        //             display: item.display,
        //             pre_idx: pre_idx + index,
        //             // type: '',
        //             level: item.level
        //         }

        //         // TODO: 后期改为以其他关键字作为匹配.
        //         let curr_menu = window.all.menu_list.filter(
        //             menu => menu.label === item.label
        //         )
        //         if (curr_menu.length) {
        //             template.icon = curr_menu[0].icon
        //         }
        //         if (item.child) {
        //             template.children = this.objToArr(
        //                 item.child,
        //                 pre_idx + index + '-'
        //             )
        //         }
        //         return template
        //     })
          
        // },
        // getMenuList() {
        //     // let { method, url } = this.$api.menu_all_list
        //     let { method, url } = this.$api.current_admin_menu

        //     this.$http({ method, url }).then(res => {
        //         if (res && res.code === '200') {
        //             let menu = this.objToArr(res.data)
        //             window.all.tool.setLocal('menu', menu)

        //             // 获取到列表数据在跳转
        //             this.$router.push('/home')
        //         }
        //     })
        // },
        login() {
            let self = this
            setTimeout(() => {
                self.login_show = false
            }, 15000)
            let params = {
                email: this.account,
                password: this.password
            }
            let { url, method } = this.$api.login
            if (this.checkUname() && this.checkPwd()) {
                this.login_show = true

                this.$http({
                    method: this.$api.login.method,
                    url: this.$api.login.url,
                    data: params // post 请求用data
                }).then(res => {
                    this.login_show = false
                    if (res && res.code === '200') {
                        let Authorization =
                            res.data.token_type + ' ' + res.data.remember_token
                        window.all.tool.setLocal('Authorization', Authorization)
                        window.all.tool.setLocal('name', res.data.name)
                        window.all.tool.setLocal('email', res.data.email)
                        self.$toast.success('登陆成功')
                        // TODO: 可能有些不能查看首页
                        this.$router.push('/home/home')
                       
                    }
                })
            }
        }
    },
    mounted() {
        // 清空localStorage
        localStorage.clear()
    }
}
</script>

<style scoped>
.login {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgb(245, 245, 245);
    text-align: center;
    background-image: url('../assets/image/login/bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
}
.inner {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    width: 1200px;
    height: 580px;
    margin-left: -600px;
    margin-top: -290px;
    box-shadow: 0 10px 59px 0 rgba(4, 0, 0, 0.3);
}
.left {
    width: 655px;
    height: 100%;
    /* background-image: url('../assets/image/login/left.jpg'); */
}
.right {
    position: relative;
    width: 545px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
}
/* .right > div {
} */
.title {
    font-size: 30px;
    color: #2882fe;
    font-weight: bold;
}
.right li {
    position: relative;
    margin-top: 16px;
    width: 337px;
    text-align: left;
}
.v-input {
    display: inline-block;
    width: 100%;
    height: 42px;
    line-height: 42px;
    padding-left: 15px;
    border: 1px solid #e9e9e9;
}
/* .verify-input {
    display: inline-block;
    width: 200px;
    height: 42px;
    line-height: 42px;
    padding-left: 15px;
    border: 1px solid #e9e9e9;
} */
/* .verify-inner-input{
    width: 80%;
    height: 34px;
    padding: 0 10px;
    font-size: 16px;
} */
.input {
    width: 80%;
    height: 34px;
    padding: 0 10px;
    font-size: 16px;
    border: none;
    /* outline: none; */
}

.err-item {
    position: absolute;
    top: 40px;
    left: 10px;
    /* height: 13px; */
    font-size: 13px;
    color: red;
}
.login-btn {
    width: 337px;
    height: 42px;
    font-size: 15px;
    background: #4c8bfd;
    color: #fff;
}
.login-btn:active {
    background: #3275f0;
}
.cursor-wait {
    /* cursor: cursor-waited; */
    cursor: wait;
}

.flex {
    display: flex;
    /* justify-content: center; */
    align-items: center;
}
.pic-change {
    font-size: 11px;
    cursor: pointer;
}

.modal-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.103);
}
</style>


