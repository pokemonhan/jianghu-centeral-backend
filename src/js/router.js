import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/views/Home.vue'
import Login from '@/components/Login.vue'

// import LoginRecord from '../components/views/hall/LoginRecord'
Vue.use(Router)

// const router = new Router({
//     mode: 'history',
//     routes: [
//         {
//             path: '/',
//             component: HomePage
//         },
//     ]
// })

// export default router
const routes = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Home
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
    // console.log(to.path);
    // console.log(from.path);
    if (to.path !== from.path) {
        next()
    }
})
let route_add = []

//获取 /views所有文件路径 lazy加载
let r = require.context('../components/views', true, /.vue$/, 'lazy')
r.keys().forEach(file_name => {
    let path = file_name.slice(1).replace('.vue', '').toLowerCase()

    let length = file_name.split('/').length
    // let name = file_name.split('/')[length-1].replace('.vue','')
    // console.log(name)
    // console.log('文件path ', path)
    route_add.push({
        path: path,
        // name: name,
        // 懒加载
        component: () => r(file_name)
    })

})
// console.log('"所有"路由',route_add)
routes.addRoutes(route_add)
export default routes

