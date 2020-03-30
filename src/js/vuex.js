import Vue from 'vue'
import Vuex from 'vuex';


Vue.use(Vuex);

const state = {
    isShowLoading: false,
    showMask: false,
    tab_nav_list: [],         // 顶部导航菜单 顶部导航菜单 顶部导航菜单
    // keepAliveList
    keepAliveExclude: [],
    picPrefix: window.location.protocol + '//pic.397017.com/', // 静态图片前缀
};
const getters = {
    keepAliveInclude(state) {
        let home = ['Home']
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