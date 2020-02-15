// 全局注册组件
import Input from '../components/commonComponents/Input.vue'
import Upload from '../components/commonComponents/Upload.vue'
import Select from '../components/commonComponents/Select.vue'
import Date from '../components/commonComponents/DatePicker.vue'
import Switchbox from '../components/commonComponents/Switch.vue'
import Table from '../components/commonComponents/Table.vue'
import Modal from '../components/commonComponents/Modal.vue'
import Dialog from '../components/commonComponents/Dialog.vue'
import Page from '../components/commonComponents/Page.vue'
import Checkbox from '../components/commonComponents/Checkbox.vue'
import Radio from '../components/commonComponents/Radio.vue'
import QuickQuery from '../components/commonComponents/QuickQuery.vue'
import TwoTable from '../components/commonComponents/TwoTable.vue'

import Toast from '../components/commonComponents/Toast.vue'
import Notice from '../components/commonComponents/Notice.vue'
import Loading from '../components/commonComponents/Loading.vue'
// import DragTree from '../components/commonComponents/dragtree/index.js'

// 指令
import directives from './config/directive.js'

//axios
import $http from '../js/config/$http.js'
// api 后端接口
import $api from '../js/config/api.js'

// websocket
import $socket from '../js/config/socket'

const components = {
    Input,
    Upload,
    Select,
    Date,
    Switchbox,
    Toast,
    Table,
    Modal,
    Dialog,
    Page,
    Checkbox,
    Radio,
    QuickQuery,
    TwoTable,
    Loading
    // DragTree
}

let toastTimer = []
export default {
    install(Vue) {
        // 相同提示 5s内不再提示
        // 1.  $toast组件
        Vue.prototype.$toast = function (option) {
            let opt = {}
            if (typeof option === 'string' || typeof option === 'number') {
                opt = { message: option }
            } else if (typeof option === 'object') {
                opt = option
            }

            let ToastConstructor = Vue.extend(Toast)
            let tpl = new ToastConstructor({
                propsData: opt
            }).$mount().$el;
            let toastDom = document.querySelector('#toast-box')
            // 判断 toast-box 是否已有同样的消息
            function noSameToast() {
                for (let child of toastDom.children) {
                    if (child.innerText === opt.message) return false
                }
                return true
            }
            // 当前 toast-box 没有该消息 则添加
            noSameToast() && toastDom.appendChild(tpl)
            if (opt.duration) {
                setTimeout(function () {
                    tpl.tagName && document.querySelector('#toast-box').removeChild(tpl)
                }, opt.duration)
            }
        }
        new Array('error', 'success', 'info', 'warning').forEach(type => {
            Vue.prototype.$toast[type] = function (tips) {
                return Vue.prototype.$toast({
                    message: tips,
                    type: type
                })
            }
        })
        // $notice 注册
        Vue.prototype.$notice = function (option) {
            let NoticeConstructor = Vue.extend(Notice)
            let tpl2 = new NoticeConstructor({
                propsData: option
            }).$mount().$el
            document.querySelector('#notice-box').appendChild(tpl2)

            if (option.duration) {
                setTimeout(function () {
                    document.querySelector('#notice-box').removeChild(tpl)
                }, opt.duration)
            }
        }

        // // $loading 注册
        // const LoadingConstructor = Vue.extend(Loading)
        // // 生成一个该子类的实例
        // const instance = new LoadingConstructor()
        // // 将这个实例挂载在我创建的div上
        // // 并将此div加入全局挂载点内部
        // instance.$mount(document.createElement('div'))
        // document.body.appendChild(instance.$el)
        // //注入vue的原型链
        // Vue.prototype.$loading = {
        //     show() {
        //         instance.show = true
        //     },
        //     close() {
        //         instance.show = false
        //     }
        // }


        // 2. 全局注册组件

        for (let key in components) {
            Vue.component(key, components[key])
        }
        // 3. 指令
        for (let key in directives) {
            Vue.directive(key, directives[key])
        }

        // 4. axios
        Vue.prototype.$http = $http;
        Vue.prototype.$api = $api;
        Vue.prototype.$socket = $socket;
    }
}