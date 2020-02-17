<template>
    <div class="center-box content">
        <div>
            <div class="search">
                <Input placeholder="搜索" v-model="search" />
            </div>

            <ul class="lev1">
                <!-- 一级 -->
                <li v-for="(lv1,lv1_idx) in routesMenu" :key="lv1_idx">
                    <div class="title">
                        <span class="icons">
                            <i
                                :class="['iconfont iconup',lv1.children?'':'hide']"
                                @click="expand(lv1_idx)"
                            ></i>
                            <!-- <i
                                :class="['iconfont iconup',lv1.routes?'':'none']"
                                @click="routeExpand(lv1_idx)"
                            ></i>-->
                        </span>
                        <span class="title-cont">{{lv1.label}}</span>
                        <span v-if="!lv1.children" class="add-router" @click="add">添加路由</span>
                    </div>

                    <!-- 二级 路由内容 -->
                    <ul v-if="lv1.routes" class="route-lv2" :ref="lv1_idx">
                        <li v-for="(route, route_idx) in lv1.routes" :key="route_idx">
                            <i class="iconfont iconshezhi2"></i>
                            <span :class="isShowRed(route)?'red':''">{{route.title}}</span>
                            <span class="a" @click="edit(lv1)">编辑</span>
                            <span></span>
                            <span class="a" @click="del(lv1)">删除</span>
                            <Switchbox class="switch" v-model="route.is_open" />
                        </li>
                    </ul>

                    <!-- 二级 菜单 -->
                    <ul v-if="lv1.children" class="lev2" :ref="lv1_idx">
                        <li v-for="(lv2,lv2_idx) in lv1.children" :key="lv2_idx">
                            <div class="title">
                                <span class="icons">
                                    <i
                                        :class="['iconfont iconup',lv2.children?'':'hide']"
                                        @click="expand(lv1_idx+'-'+lv2_idx)"
                                    ></i>
                                    <!-- <i
                                        :class="['iconfont iconup',lv2.routes?'':'none']"
                                        @click="routeExpand(lv1_idx+'-'+lv2_idx)"
                                    ></i>-->
                                </span>

                                <span class="title-cont">{{lv2.label}}</span>
                                <span v-if="!lv2.children" class="add-router" @click="add(lv2)">添加路由</span>
                            </div>

                            <!-- ** 三级 路由内容 -->
                            <ul v-if="lv2.routes" class="route-lv3" :ref="lv1_idx+'-'+lv2_idx">
                                <li
                                    class="flex"
                                    v-for="(route2, rout2_idx) in lv2.routes"
                                    :key="rout2_idx"
                                >
                                    <i class="iconfont iconshezhi2"></i>
                                    <span :class="isShowRed(route2)?'red':''">{{route2.title}}</span>
                                    <span class="a" @click="edit(route2)">编辑</span>
                                    <span class="a" @click="del(route2)">删除</span>
                                    <Switchbox class="switch" v-model="route2.is_open" />
                                </li>
                            </ul>
                            <!-- 三级 菜单 -->
                            <ul v-if="lv2.children" class="lev3" :ref="lv1_idx+'-'+lv2_idx">
                                <li v-for="(lv3, lv3_idx) in lv2.children" :key="lv3_idx">
                                    <div class="title">
                                        <i
                                            :class="['iconfont iconup',lv3.children?'':'hide']"
                                            @click="expand(lv1_idx+'-'+lv2_idx+'-'+lv3_idx)"
                                        ></i>
                                        <i
                                            :class="['iconfont iconup',lv3.routes?'':'none']"
                                            @click="expand(lv1_idx+'-'+lv2_idx+'-'+lv3_idx)"
                                        ></i>
                                        <span class="title-cont">{{lv3.label}}</span>
                                        <span
                                            v-if="!lv3.children"
                                            class="add-router"
                                            @click="add(lv3)"
                                        >添加路由</span>
                                    </div>

                                    <!-- 四级路由 -->
                                    <ul
                                        v-if="lv3.routes"
                                        class="route-lv4"
                                        :ref="lv1_idx+'-'+lv2_idx+'-'+lv3_idx"
                                    >
                                        <li
                                            class="flex"
                                            v-for="(route3, route3_idx) in lv3.routes"
                                            :key="route3_idx"
                                        >
                                            <i class="iconfont iconshezhi2"></i>
                                            <!-- <span>{{route3.title}}</span> -->
                                            <span
                                                :class="isShowRed(route3)?'red':''"
                                            >{{route3.title}}</span>

                                            <span class="a" @click="edit(route3)">编辑</span>
                                            <span class="a" @click="del(route3)">删除</span>
                                            <Switchbox class="switch" v-model="route3.is_open" />
                                        </li>
                                    </ul>
                                    <!-- 四级 菜单 -->
                                    <ul
                                        v-if="lv2.children"
                                        class="lev3"
                                        :ref="lv1_idx+'-'+lv2_idx+'-'+lv3_idx"
                                    >
                                        <li v-for="(lv4, lv4_idx) in lv3.children" :key="lv4_idx">
                                            <div class="title">
                                                <i
                                                    :class="['iconfont iconup',lv3.children?'':'hide']"
                                                    @click="expand(lv1_idx+'-'+lv2_idx+'-'+lv3_idx+'-'+lv4_idx)"
                                                ></i>
                                                <span class="title-cont">{{lv4.label}}</span>
                                                <span
                                                    v-if="!lv4.children"
                                                    class="add-router"
                                                    @click="add(lv4)"
                                                >添加路由</span>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <Dialog :show.sync="dia_show" :title="dia_title">
            <div class="dia-inner">
                <div>
                    <ul class="form">
                        <!-- 添加 编辑路由 -->
                        <li>
                            <span>选择路由1:</span>
                            <!-- <Select
                                style="width:550px;margin-top:10px;"
                                v-model="form.route"
                                :options="add_route_opt"
                                input
                                @input="routeInput"
                            ></Select>-->
                            <Select
                                style="width:550px;margin-top:10px;"
                                v-model="form.route_name"
                                :options="route_show_opt"
                                input
                                @input="routeInput"
                                @update="routeSelect"
                            ></Select>
                        </li>

                        <!-- 编辑路由 -->
                        <!-- <li>
                            <span>选择路由(编辑):</span>
                            <Select
                                style="width:550px;margin-top:10px;"
                                v-model="form.route_name"
                                :options="edit_route_opt"
                                input
                                @input="routeInput"
                            ></Select>
                        </li>-->
                        <li class="mt20">
                            <span class="mb10">标题</span>
                            <Input style="width:550px" v-model="form.title" />
                        </li>
                        <li class="mt20">
                            <span>控制器</span>
                            <span>{{form.controller}}</span>
                        </li>
                    </ul>
                    <div class="center-box mt50">
                        <button class="btn-plain-large" @click="dia_show=false">取消</button>
                        <button class="btn-blue-large ml50" @click="diaCfm">确认</button>
                    </div>
                </div>
            </div>
        </Dialog>

        <Modal
            :show.sync="mod_show"
            title="删除"
            content="是否删除该路由"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>
    </div>
</template> 

<script>
export default {
    props: {
        menu: Array
    },
    data() {
        return {
            search: '',
            routesMenu: [],
            // dialog
            dia_show: false,
            form: {
                route_name: '',
                title: ''
            },
            route_all_opt: [], // 所有 select 下拉框内容
            // 展示的下拉框内容
            route_show_opt: [],

            route_obj: {}, // 目前路由_对象
            curr_route: [], // 目前路由_后端信息
            // dia
            dia_status: '',
            dia_title: '',

            // modal 框
            mod_show: false,
            mod_status: ''
        }
    },
    methods: {
        expand(index) {
            let ele = this.$refs[index]
            $(ele).slideToggle(200)
        },
        isShowRed(route) {
            let search = this.search
            let title = route && route.title
            if (!title) return false
            if (!search) return false
            return title.indexOf(search) !== -1
        },
        // routeExpand(index) {
        //     let ele = this.$refs[index]
        //     $(ele).slideToggle(200)
        // },
        // 根据route_name 返回它的相关内容
        getRouterNameObj(route_name) {
            return this.route_all_opt.find(item => {
                return item.route_name === route_name
            })
        },

        /* 获取所有可选路由 (即: 添加路由,编辑路由的select下拉框内容) */
        getRouteSelect() {
            // 根据数组变成 需要的 option下拉框
            let toRouteOpt = (arr = []) => {
                return arr.map((item, index) => {
                    return {
                        label: item.route_name + '(' + item.url + ')',
                        value: item.route_name,
                        url: item.url, // 例如: headquarters-api/activity/index-do
                        route_name: item.route_name, // 例如 headquarters-api.activity.index-do
                        controller: item.controller
                    }
                })
            }
            let data = { type: 0 }
            let { url, method } = this.$api.menu_date_list
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.route_all_opt = toRouteOpt(
                        res.data && res.data.route_info
                    )
                }
            })
        },

        initForm() {
            this.form = {}
        },
        add(row) {
            this.initForm()

            let route_arr = this.curr_route.map(item => item.route_name) // 已使用路由数组
            // 已使用路由不可再被使用
            this.route_show_opt = this.route_all_opt.filter(item => {
                // 路由没有被使用就放进select,另外当前路由虽然有使用也需要放进去.，以便展示自己
                let not_used = route_arr.indexOf(item.route_name) === -1 // 1.路由没有被使用就放进select
                return not_used
            })

            this.curr_row = row
            this.dia_status = 'add'
            this.dia_title = '添加路由'
            this.dia_show = true
        },
        edit(row) {

            let route_arr = this.curr_route.map(item => item.route_name) // 已使用路由数组
            // // 已使用路由不可再被使用
            this.route_show_opt = this.route_all_opt.filter(item => {
                // 1.路由没有被使用就放进select, 2. 当前路由也需要放进去.
                let not_used = route_arr.indexOf(item.route_name) === -1 // 1.路由没有被使用就放进select
                let isCurrent = item.route_name === row.route_name // 2.当前路由也需要放进去.
                return not_used || isCurrent
            })

            this.form = {
                route_name: row.route_name,
                title: row.title,
                controller:
                    this.getRouterNameObj(row.route_name) &&
                    this.getRouterNameObj(row.route_name).controller
            }

            this.form = Object.assign(this.form)
            this.curr_row = row
            this.dia_status = 'edit'
            this.dia_title = '编辑路由'
            this.dia_show = true
        },
        del(row) {
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_show = true
        },

        modConf() {
            // 删除 确认
            if (this.mod_status === 'del') {
                this.delCfm()
            }
        },

        diaCfm() {
            if (this.dia_status === 'add') {
                this.addCfm()
            }
            if (this.dia_status === 'edit') {
                this.editCfm()
            }
        },
        // select 下拉框点击更新时
        routeSelect() {
            let routeObj = this.getRouterNameObj(this.form.route_name) || ''
            this.$set(this.form, 'controller', routeObj.controller)
        },
        // 当路由input输入时 ,

        routeInput: window.all.tool.debounce(function(val) {
            let route_arr = this.curr_route.map(item => item.route_name)
            this.route_show_opt = this.route_all_opt.filter(item => {
                let not_used = route_arr.indexOf(item.route_name) === -1 // 1.路由没有被使用就放进select
                let isCurrent = item.route_name === this.curr_row.route_name // 2.当前路由也需要放进去.
                let inputfilter = item.label.indexOf(val) !== -1 // 3.并且根据input内容筛选

                return (not_used || isCurrent) && inputfilter
            })
        }, 300),

        checkForm() {
            let route_temp = this.route_all_opt.find(
                item => item.route_name === this.form.route_name
            )
            if (!route_temp) {
                this.$toast.warning('路由不匹配!')
                return false
            }
            if (!this.form.route_name) {
                this.$toast.warning('请检查路由!')
                return false
            }
            if (!this.form.title) {
                this.$toast.warning('请检查标题!')
                return false
            }
            return true
        },
        addCfm() {
            if (!this.checkForm()) return
            let route_temp = this.route_all_opt.find(
                item => item.route_name === this.form.route_name
            )
            console.log('route_temp: ', route_temp)
            let controller = route_temp.controller.split('\\')
            controller = controller[controller.length - 1].split('@')[0]

            let data = {
                menu_group_id: this.curr_row.id,
                title: this.form.title,
                route_name: this.form.route_name,
                controller: controller, // 后端不方便获取,所以这里再返还给他
                method: route_temp.controller.split('@')[1] // 同上
            }

            let { url, method } = this.$api.route_add
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getRouteList()
                }
            })
        },
        editCfm() {
            if (!this.checkForm()) return
            let route_temp = this.route_all_opt.find(item => {
                return item.value === this.form.route_name
            })
            let controller = route_temp.controller.split('\\')
            controller = controller[controller.length - 1].split('@')[0]

            let data = {
                id: this.curr_row.id,
                menu_group_id: this.curr_row.menu_group_id,
                title: this.form.title,
                route_name: this.form.route_name,
                controller: controller,
                method: route_temp.controller.split('@')[1]
            }

            let { url, method } = this.$api.route_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getRouteList()
                }
            })
        },
        delCfm() {
            let data = {
                id: this.curr_row.id
            }

            let { url, method } = this.$api.route_del
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    // this.getRouteList()
                }
                this.getRouteList()
            })
        },
        // 获取当前路由对象,方便调用 . 以id 为key 保存所有信息到route_obj 里面
        // 这样就方便查找该菜单id 下的所有路由数组. 例如: 发邮件页面id为5 ,它下面有 列表,删除,最近联系人等api接口信息
        getRouteObj(arr) {
            let route_obj = {}

            arr.forEach(item => {
                // 对象属性下为空, 就设置为数组类型
                if (!route_obj[item.menu_group_id]) {
                    route_obj[item.menu_group_id] = []
                }
                // 并push 到数组下
                route_obj[item.menu_group_id].push(item)
            })
            return route_obj
        },
        // 获取包含路由的菜单. (让菜单里面能显示路由)
        setRouteMenu() {
            if (this.menu.length === 0) return
            if (this.curr_route.length === 0) return
            let self = this

            let toTreeArray = function(menu) {
                return menu.map(item => {
                    // 根据菜单id 得知它自身api路由有哪些,
                    // 例如: 登录记录 id为5，  api路由 (routes）有 登录记录-列表api
                    if (self.route_obj[item.id]) {
                        item.routes = self.route_obj[item.id]
                    }
                    if (item.children) {
                        item.children = toTreeArray(item.children)
                    }
                    return item
                })
            }
            let menu = JSON.parse(JSON.stringify(this.menu))
            this.routesMenu = toTreeArray(menu)
        },
        // 获取目前api路由内容，( __路由是根据菜单id 知道在哪个菜单的子项)
        getRouteList() {
            console.log('刷新页面')
            let { url, method } = this.$api.route_all_list
            this.$http({ method, url }).then(res => {
                if (res && res.code === '200') {
                    if (!res.data) return
                    this.curr_route = res.data
                    // console.log('this.curr_route: ', this.curr_route);
                    this.route_obj = this.getRouteObj(res.data)

                    this.setRouteMenu()
                }
            })
        }
    },
    watch: {
        menu(menu) {
            this.setRouteMenu()
        }
    },
    mounted() {
        this.getRouteSelect()
        this.getRouteList()
    }
}
</script>

<style scoped>
.content div .search {
    width: 250px;
    margin: 0 auto;
    margin-top: 20px;
}

.center-box {
    display: flex;
    justify-content: center;
}
/* .center-box li {
    margin-top: 3px;
    margin-bottom: 3px;
} */
.lev1 > li {
    /* margin-top: 10px; */
    padding-top: 10px;
}
.add-router {
    color: #4c8bfd;
    cursor: pointer;
    margin-left: 20px;
}
/* .lev1 > li > .title > span { */
/* } */
.lev2 {
    color: #777;
    font-size: 13px;
    /* text-align: left; */
    margin-left: 2em;
}
/* .lev2 > li {
} */
.lev2 > li > span {
    display: inline-block;
    margin-top: 6px;
}
.lev3 {
    margin-left: 3em;
}
.title {
    display: flex;
}
.title .hide {
    /* opacity: .2; */
    display: none;
}
.title .none {
    display: none;
}
.checkbox-head {
    font-weight: bold;
    font-size: 16px;
}
.iconup {
    margin-right: 5px;
    cursor: pointer;
}
.lev2 .checkbox {
    /* margin-top: 10px; */
    padding: 5px 0;
}

.lev3 {
    margin-left: 4em;
}
.lev4 {
    margin-left: 56px;
}
.switch {
    position: relative;
    margin-top: -5px;
    transform: scale(0.5);
}

/* 编辑路由 */
.form > li {
    display: flex;
    align-items: baseline;
}
.form > li > span:first-child {
    width: 5em;
    text-align: right;
    margin-right: 10px;
}
.dia-inner {
    padding: 0 50px;
}

.iconshezhi2 {
    margin-right: 5px;
}

.flex {
    display: flex;
}
.operate {
    display: flex;
}
/* 路由内容 */
.route-lv2 {
    margin-left: 3em;
    /* border: 1px solid red; */
}
.route-lv2 > li {
    display: flex;
    /* align-items: center; */
    white-space: nowrap;
}
.route-lv3 {
    margin-left: 3em;
    /* border: 1px solid #000; */
}
.route-lv2 > li,
.route-lv3 > li {
    /* margin: 2px 0; */

    font-size: 12px;
    color: rgb(118, 135, 155);
}
.route-lv4 {
    margin-left: 3em;
}
.icons {
    width: 3em;
    text-align: right;
}
</style>