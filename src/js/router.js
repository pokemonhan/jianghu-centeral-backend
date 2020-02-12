import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/views/Home.vue'
import Login from '@/components/Login.vue'

// /*------------------- 厅主管理 --------------------*/
// import HalList from '../components/views/hall/Halllist'
// import LoginRecord from '../components/views/hall/LoginRecord'

// /*------------------- 厂商管理 --------------------*/
// // import hehe from '../components/views/hall/hehe'
// import VendorManage from '../components/views/game/VendorManage'
// import SortSet from '../components/views/game/SortSet'
// import GameManage from '../components/views/game/GameManage'

Vue.use(Router)

// 解决 路由 NavigationDuplicated 报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

// const router = new Router({
//     mode: 'history',
//     routes: [
//         {
//             path: '/',
//             component: Login
//         },
//         {
//             path: '/home',
//             component: Home
//         },
//         {
//             path: '/login',
//             component: Login
//         },

//         /*------------------ 厅主管理 ------------------------*/
//         {
//             path: '/hall/halllist',
//             component: HalList
//         },
//         {
//             path: "/hall/halllist",
//             component: () => import('../components/views/hall/Halllist.vue')
//         },
//         {
//             path: '/hall/loginrecord',
//             component: LoginRecord
//         },
//         /* 厅主管理 */

//         /*--------------------- 游戏管理 ---------------------*/
//         {
//             path: '/game/vendormanage',
//             component: VendorManage
//         },
//         {
//             path: '/game/sortset',
//             component: SortSet
//         },
//         {
//             path: '/game/gamemanage',
//             component: GameManage
//         }

//         /*---------------------- 游戏管理 ----------------------*/

//     ]
// })

// export default router


// 自动加载路由

const routes = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: 'login'
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/login',
            component: Login
        },
    ]
})
routes.beforeEach((to, from, next) => {

    if (to.path !== from.path) { next() }
})
let route_add = []

//获取 /views所有文件路径 lazy加载
let r = require.context('../components/views', true, /.vue$/, 'lazy')
r.keys().forEach(file_name => {
    // 路径
    let path = file_name.slice(1).replace('.vue', '').toLowerCase()

    // let length = file_name.split('/').length
    // let name = file_name.split('/')[length - 1].replace('.vue', '')
    // console.log(name)
    route_add.push({
        path: path,
        // 懒加载
        component: () => r(file_name),
        // meta:{}
    })

})
route_add.push({
    path: '/page404',
    component: ()=>import('../components/views/page404/page404.vue')
})
route_add.push({
    path: '*',
    redirect: '/page404'
})
// console.log('"所有"路由', JSON.stringify(route_add))
// console.table(route_add)
routes.addRoutes(route_add)

export default routes

