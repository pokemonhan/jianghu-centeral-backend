// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './js/router'
import store from './js/vuex'
Vue.config.productionTip = false


import tool from './js/tool'                  // 常用工具
import plugins from './js/plugins'            // 1.公用组件, 2.指令,  3.axios

import echarts from 'echarts'
import wangeditor from 'wangeditor'           // wangeditor 富文本 ,使用见官网
import menu_list from './js/menuList'         // 菜单目录
import './assets/font-icon/iconfont.css'      // 引入css
import Jquery from 'jquery'

import xss from 'xss'

window.$ = Jquery;
// import slide from './js/slide'

Vue.use(plugins)
window.all = {
  tool,
  store,
  router,
  menu_list,
  echarts,
  wangeditor  // 暂时没用,可能以后要用
}
// 防止xss 攻击
Object.defineProperty(Vue.prototype, '$xss', {
  value: xss
})
/* eslint-disable no-new */
window.__vm__ = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
