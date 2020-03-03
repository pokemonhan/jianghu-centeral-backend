import Vue from 'vue'
import Vuex from 'vuex';


Vue.use(Vuex);

const state = {
    isShowLoading: false,
    showMask: false,
    tab_nav_list: [],         // 顶部导航菜单 顶部导航菜单 顶部导航菜单 

};
const getters = {
    keepAliveInclude(state){
        return state.tab_nav_list.map(item => item.name)
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