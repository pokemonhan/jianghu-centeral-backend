import Vue from 'vue'
import Vuex from 'vuex';

let HOST = process.env.HOST
let hostList = {
    inner: location.protocol + '//api.397017.com',              // 测试站内网
    outer: location.protocol + '//api.397017.com',              // 测试外围
    harris: location.protocol + '//api.jianghu.me',             // harris
    // ethan: location.protocol + '//apionline.jianghu.ethanphp', // ethan
}

const BASE_PATH = hostList[HOST] || HOST

Vue.use(Vuex);

const state = {
    isShowLoading: false,
    showMask: false,
    tab_nav_list: [],         // 顶部导航菜单 顶部导航菜单 顶部导航菜单
    // keepAliveList
    keepAliveExclude: ['SendEmail','OperatLog'],   // 不需要缓存的 组件name()
    baseUrl: BASE_PATH,
    picPrefix: window.location.protocol + '//pic.397017.com/', // 静态图片前缀
};
const getters = {
    keepAliveInclude(state) {
        let home = []
        // 使导航条的路由 保持keepalive 
        let arr = (state.tab_nav_list || []).map(item => {
            return item.name
        })
        return arr.concat(home)

    }
}
const mutations = {};
for (let key in state) {
    getters[key] = state => {
        return state[key]
    }
    let mutationKey = 'update' + key.charAt(0).toUpperCase() + key.slice(1)
    mutations[mutationKey] = (state, value) => {
        state[key] = value
    }
}
export default new Vuex.Store({
    state,
    getters,
    mutations
})