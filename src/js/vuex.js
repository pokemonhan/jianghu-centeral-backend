import Vue from 'vue'
import Vuex from 'vuex';


Vue.use(Vuex);

const state = {
    isShowLoading: false,
    showMask: false,
    tab_nav_list: []         // 顶部导航菜单
};
const getters = {}
const mutations = {};
for (let item in state) {
    getters[item] = state => {
        return state[item]
    }
    mutations['update' + item] = (state, value) => {
        state[item] = value
    }
}
export default new Vuex.Store({
    state,
    getters,
    mutations
})