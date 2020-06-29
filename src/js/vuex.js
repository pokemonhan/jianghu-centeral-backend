import Vue from 'vue'
import Vuex from 'vuex';

let HOST = process.env.HOST

let hostObj = {
    inner: {
        url: location.protocol + '//api.397017.com',              // 测试站内网
        pic: location.protocol + '//pic.397017.com/',             // 静态图片前缀
    },
    outer: {
        url: location.protocol + '//api.397017.com',              // 测试外围
        pic: location.protocol + '//pic.397017.com/', // 静态图片前缀
    },
    harris: {
        url: location.protocol + '//api.jianghu.me',              // harris
    },
    ethan: {
        url: location.protocol + '//apionline.jianghu.ethanphp',  // ethan
        pic: location.protocol + '//pic.397017.com/',             // 静态图片前缀
    },
    stg: {
        url: location.protocol + '//apistg.397017.com',           // staging 筹备地址
        pic: location.protocol + '//picstg.397017.com/'
    }
}
const BASE_PATH = hostObj[HOST].url || HOST
// console.log('😅 BASE_PATH: ', BASE_PATH);

Vue.use(Vuex);

const state = {
    themeColor: '',
    isShowLoading: false,
    showMask: false,
    tab_nav_list: [],                                          // 顶部导航菜单 顶部导航菜单 顶部导航菜单
    keepAliveExclude: ['SendEmail','OperatLog'],               // 不需要缓存的 组件name()
    baseUrl: BASE_PATH,
    
    picPrefix: hostObj[HOST].pic, // 静态图片前缀
    aside_scroll_path: '', // 自动滚动的路径
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