<template>
    <div class="center-box content">
        <div>
            <div class="search">
                <Input style="width:250px;" placeholder="搜索" v-model="search" @update="searchUpd" />
                <Select
                    style="width:30px;margin-left:5px;"
                    v-model="is_open_status"
                    :options="is_open_opt"
                    @update="selectUpdate"
                ></Select>
            </div>

            <ul class="lev1">
                <!-- 一级 -->
                <li v-for="(lv1,lv1_idx) in routesMenu" :key="lv1_idx">
                    <div class="title">
                        <span class="icons">
                            <i
                                :class="['iconfont',lv1.isMenuOpen?'iconwenjian':'iconfolder-fill']"
                                @click="expand(lv1_idx,lv1)"
                            ></i>
                            <!-- <i
                                :class="['iconfont iconfolder-fill',lv1.routes?'':'hide']"
                                @click="routeExpand(lv1_idx)"
                            ></i>-->
                        </span>
                        <span
                            :class="[(search&&lv1.isSelect)?'search-item':'','title-cont']"
                            @click="expand(lv1_idx, lv1)"
                        >{{lv1.label}}</span>
                        <span v-if="!lv1.children" class="add-router" @click="add">添加路由</span>
                    </div>

                    <!-- 二级 路由内容 -->
                    <ul v-if="lv1.routes" class="route-lv2" :ref="lv1_idx">
                        <li v-for="(route, route_idx) in lv1.routes" :key="route_idx">
                            <i class="iconfont iconshezhi2"></i>
                            <span :class="(search&&route.isSelect)?'search-item':''">{{route.title}}</span>
                            <button class="btns-plain-blue" @click="edit(lv1)">编辑</button>

                            <button class="btns-plain-red" @click="del(lv1)">删除</button>
                            <Tooltip content="是否开放式">
                                <Switchbox class="switch" v-model="route.is_open" />
                            </Tooltip>
                        </li>
                    </ul>

                    <!-- 二级 菜单 -->
                    <ul v-if="lv1.children" class="lev2" :ref="lv1_idx">
                        <li v-for="(lv2,lv2_idx) in lv1.children" :key="lv2_idx">
                            <div class="title">
                                <span class="icons">
                                    <i
                                        :class="['iconfont ',lv2.isMenuOpen?'iconfile':'iconfeeds-fill']"
                                        @click="expand(lv1_idx+'-'+lv2_idx,lv2)"
                                    ></i>
                                </span>

                                <span
                                    :class="[(search&&lv2.isSelect)?'search-item':'','title-cont']"
                                    @click="expand(lv1_idx+'-'+lv2_idx,lv2)"
                                >{{lv2.label}}</span>
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
                                    <span
                                        :class="(search&&route2.isSelect)?'search-item':''"
                                    >{{route2.title}}</span>
                                    <button class="btns-plain-blue" @click="edit(route2)">编辑</button>
                                    <button class="btns-plain-red" @click="del(route2)">删除</button>
                                    <Switchbox
                                        class="switch"
                                        v-model="route2.is_open"
                                        @update="isOpenSwitch($event,route2)"
                                    />
                                </li>
                            </ul>
                            <!-- 三级 菜单 -->
                            <ul v-if="lv2.children" class="lev3" :ref="lv1_idx+'-'+lv2_idx">
                                <li v-for="(lv3, lv3_idx) in lv2.children" :key="lv3_idx">
                                    <div class="title">
                                        <i
                                            :class="['iconfont',lv1.children?'iconfolder-fill':'iconfeeds-fill']"
                                            @click="expand(lv1_idx+'-'+lv2_idx+'-'+lv3_idx,lv3)"
                                        ></i>
                                        <!-- <i
                                            :class="['iconfont iconfolder-fill',lv3.routes?'':'hide']"
                                            @click="expand(lv1_idx+'-'+lv2_idx+'-'+lv3_idx)"
                                        ></i>-->
                                        <span
                                            :class="[(search&&lv3.isSelect)?'search-item':'','title-cont']"
                                            @click="expand(lv1_idx+'-'+lv2_idx+'-'+lv3_idx,lv3)"
                                        >{{lv3.label}}</span>
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
                                                :class="isSearchItem(route3)?'search-item':''"
                                            >{{route3.title}}</span>

                                            <button class="btns-plain-blue" @click="edit(route3)">编辑</button>
                                            <button class="btns-plain-red" @click="del(route3)">删除</button>
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
                                                    :class="['iconfont iconfolder-fill',lv3.children?'':'hide']"
                                                    @click="expand(lv1_idx+'-'+lv2_idx+'-'+lv3_idx+'-'+lv4_idx,lv4)"
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
                        <li class="mt10">
                            <span>选择路由:</span>
                            <Select
                                style="width:550px;"
                                :placeholder="route_placeholder"
                                v-model="form.route_name"
                                :options="route_show_opt"
                                input
                                @input="routeInput"
                                @update="routeSelect"
                            ></Select>
                        </li>
                        <!-- <li v-if="!route_show_opt.length" class="no-router">
                            <span>sorry,没有可以使用的路由....</span>
                        </li> -->
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
            :content="mod_content"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>
    </div>
</template> 

<script>
let count = 0
export default {
    props: {
        menu: Array
    },
    data() {
        return {
            search: '',
            is_open_status: '',
            is_open_opt: [
                { label: '全部', value: '' },
                { label: '封闭式', value: 0 },
                { label: '开放式', value: 1 }
            ],
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

            route_obj: {}, // 已使用路由_对象 ,方便调用
            curr_route: [], // 当前已使用的路由信息
            // dia
            dia_status: '',
            dia_title: '',
            route_placeholder: '', // sorry,没有可使用路由...
            // modal 框
            mod_show: false,
            mod_status: '',
            mod_content: ''
        }
    },
    methods: {
        searchUpd: window.all.tool.debounce(function(search) {
            let self = this

            function isMatch(item) {
                console.log('item: ', item);
                /**
                 * 1. 路由中文名称 : title
                 * 2. 路由名称 : route_name
                 * 3. 路由url : url
                 * 
                 * 4.菜单文字标题 : label
                 */
                // 是否匹配input条件其中一个
                let matchInput

                let match_open = false // 匹配是否开放式
                let keyArr = ['title', 'route_name', 'url', 'label']
                matchInput = keyArr.some(key => {
                    return item[key] && item[key].indexOf(search) !== -1
                })
                if (matchInput || search === '') {
                    matchInput = true
                }
                // 状态为空, 或者 等于选中的状态,
                if (
                    self.is_open_status === '' ||
                    self.is_open_status === item.is_open
                ) {
                    match_open = true
                }
                return matchInput && match_open
            }
            // 根据匹配结果 打开菜单,
            function setCss(arr = [], isRoute = true) {
                let isMenuOpen = false
                arr.forEach((item, index) => {
                    // console.log('item: ', item)
                    item.isSelect = false
                    item.isMenuOpen = false

                    if (isRoute && isMatch(item)) {
                        item.isSelect = true
                        // isMenuOpen = true
                        item.isMenuOpen = true
                    }
                    if (item.children) {
                        // 子集有,父级就有
                        item.isSelect = item.isMenuOpen = setCss(
                            item.children,
                            true
                        )
                    } else if (item.routes) {
                        // 子集有,父级就有
                        item.isSelect = item.isMenuOpen = setCss(
                            item.routes,
                            true
                        )
                    }
                    if (item.isMenuOpen) {
                        isMenuOpen = true

                        // $(self.$refs[item.prefix]).slideDown()
                        let ele = self.$refs[item.prefix]
                        // console.log('ele: ', ele)
                        window.all.tool.slideDown(ele, 400)
                    } else {
                        // $(self.$refs[item.prefix]).slideUp()
                        let ele = self.$refs[item.prefix]
                        window.all.tool.slideUp(ele, 400)
                    }
                })
                return isMenuOpen
            }
            setCss(this.routesMenu)
            this.$forceUpdate()
        }, 200),
        selectUpdate() {
            this.searchUpd('')
        },
        expand(index, item) {
            let ele = this.$refs[index]
            // $(ele).slideToggle(200)
            item.isMenuOpen = !item.isMenuOpen
            let slideToggle = window.all.tool.slideToggle(ele)
        },

        // routeExpand(index) {
        //     let ele = this.$refs[index]
        //     $(ele).slideToggle(200)
        // },

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
            // console.log('this.route_show_opt: ', this.route_show_opt)
            if(this.route_show_opt.length===0) {
                this.route_placeholder = ' sorry,没有可使用路由...'
            }
            this.curr_row = row
            this.dia_status = 'add'
            this.dia_title = '添加路由'
            this.dia_show = true
        },
        edit(row) {
            // console.log('row: ', row);
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

            this.form = Object.assign({}, this.form)
            this.curr_row = row
            this.dia_status = 'edit'
            this.dia_title = '编辑路由'
            this.dia_show = true
        },
        del(row) {
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_content = `是否删除 ${row && row.title}`
            this.mod_show = true
        },
        isOpenSwitch(val, route) {
            // console.log('route: ', route)
            let data = {
                id: route.id,
                is_open: val ? 1 : 0
            }

            let { url, method } = this.$api.route_is_open_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                }
                this.getRouteList()
            })
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
            // console.log('route_temp: ', route_temp)
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
        // 根据route_name 返回它的相关内容
        getRouterNameObj(route_name) {
            return (
                this.route_all_opt.find(item => {
                    return item.route_name === route_name
                }) || {}
            )
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
            let data = { type: 1 } // 0全部 ，这里1:总后台 ，2. 代理后台，3. App
            let { url, method } = this.$api.menu_date_list
            this.$http({ method, url, data }).then(res => {
                // console.log('res: ', res);
                if (res && res.code === '200') {
                    this.route_all_opt = toRouteOpt(
                        res.data && res.data.route_info
                    )
                    // 获取路由信息, (成功后设置菜单)
                    this.getRouteList()
                }
            })
        },
        // 获取当前路由对象,方便调用 . 以id 为key 保存所有信息到route_obj 里面
        // 这样就方便查找该菜单id 下的所有路由数组. 例如: 发邮件页面id为5 ,它下面有 列表,删除,最近联系人等api接口信息
        getRouteObj(arr) {
            let RouteObj = {}

            arr.forEach(item => {
                // console.log('路由对象item: ', item);
                // 对象属性下为空, 就设置为数组类型
                if (!RouteObj[item.menu_group_id]) {
                    RouteObj[item.menu_group_id] = []
                }
                // 并push 到数组下
                let child = {
                    id: item.id,
                    route_name: item.route_name,
                    menu_group_id: item.menu_group_id,
                    title: item.title,
                    description: item.description,
                    is_open: item.is_open,
                    url: this.getRouterNameObj(item.route_name).url
                    // controller: this.getRouterNameObj(item.route_name),
                }
                RouteObj[item.menu_group_id].push(child)
            })
            return RouteObj
        },
        // 获取包含路由的菜单. (让菜单里面能显示路由)
        setRouteMenu() {
            if (this.menu.length === 0) return
            if (this.curr_route.length === 0) return
            // if (this.route_all_opt.length === 0) return
            let self = this
            function toTreeArray(menu) {
                return menu.map((item, index) => {
                    // 根据菜单id 得知它自身api路由有哪些,
                    // 例如: 登录记录 id为5，  路由 (routes）有 登录记录-列表(api)
                    if (self.route_obj[item.id]) {
                        item.routes = self.route_obj[item.id]
                    }
                    item.isMenuOpen = true
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
            // console.log('刷新页面')
            let { url, method } = this.$api.route_all_list
            this.$http({ method, url }).then(res => {
                if (res && res.code === '200') {
                    console.log('res: ', res)
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
    }
}
</script>

<style scoped>
.content {
    font-size: 14px;
}
.content div .search {
    /* width: 250px; */
    /* margin: 0 auto; */
    display: flex;
    justify-content: center;
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
.lev1 ul {
    /* display: none; */
    /* overflow: hidden; */
    transition: max-height 0.3s;
}
.lev1 > li > .title {
    line-height: 20px;
    font-size: 15px;
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
    /* font-size: 13px; */
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
    visibility: hidden;
}
.title .none {
    display: none;
}
.checkbox-head {
    font-weight: bold;
    /* font-size: 16px; */
}

.iconfont {
    margin-right: 5px;
    cursor: pointer;
    color: #88a6df;
}
.title-cont {
    cursor: pointer;
}
.iconfolder-fill {
    margin-right: 5px;
    cursor: pointer;
    color: #fad002;
}
.iconwenjian {
    margin-right: 5px;
    cursor: pointer;
    color: #fad002;
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
    align-items: center;
}
.form > li > span:first-child {
    width: 5em;
    text-align: right;
    margin-right: 10px;
}
.dia-inner {
    padding: 0 50px;
}
.no-router {
    display: flex;
    justify-content: center;
    color: #4c8bfd;
    font-size: 22px;
    margin-left: -50px;
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
    margin-left: 2em;
    /* border: 1px solid #000; */
}
.route-lv2 > li,
.route-lv3 > li {
    height: 22px;
    /* font-size: 14px; */
    color: rgb(118, 135, 155);
}
.route-lv4 {
    margin-left: 3em;
}
.icons {
    /* width: 3em; */
    text-align: right;
}
.btns-plain-blue,
.btns-plain-red {
    display: inline-block;
    height: 20px;
    vertical-align: middle;
    margin-left: 5px;
    padding: 0 2px;
    font-size: 12px;
    cursor: pointer;
}
.btns-plain-blue:active,
.btns-plain-red:active {
    transform: scale(0.9);
}
.btns-plain-blue {
    background: #ecf5ff;
    color: #4c8bfd;
    border: 1px solid #b3d8ff;
    border-radius: 3px;
    box-shadow: 1px 1px 3px rgba(102, 158, 255, 0.2);
}
.btns-plain-red {
    background: #fef0f0;
    color: #ec5946;
    border: 1px solid #fbc4c4;
    border-radius: 3px;
    box-shadow: 1px 1px 3px rgba(250, 179, 174, 0.2);
}
.search-item {
    padding-left: 5px;
    line-height: 21px;
    font-weight: bold;
    color: rgb(253, 95, 55);

    background: rgb(243, 242, 242);
    transition: all 0.2s;
}
</style>