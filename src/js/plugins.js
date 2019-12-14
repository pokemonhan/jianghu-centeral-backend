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


// 指令
import directives from './config/directive.js'

//axios
import $http from '../js/config/$http.js'
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
    TwoTable
}


export default {
    install(Vue) {
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

            document.querySelector('#toast-box').appendChild(tpl)

            if (opt.duration) {
                setTimeout(function () {
                    document.querySelector('#toast-box').removeChild(tpl)
                }, opt.duration)
            }
            // if (document.querySelector('#toast-box').children.length > 200) {
            //     setTimeout(function () { document.querySelector('#toast-box').html = '' }, 3000)
            // }
        }
        new Array('error', 'success', 'info', 'warning').forEach(type => {
            Vue.prototype.$toast[type] = function (tips) {
                return Vue.prototype.$toast({
                    message: tips,
                    type: type
                })
            }
        })

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