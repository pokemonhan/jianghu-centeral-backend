<template>
    <div class="center-box">
        <div>
            <div class="search">
                <Input placeholder="搜索" v-model="search" />
            </div>

            <ul class="lev1">
                <!-- 一级 -->
                <li v-for="(lv1,lv1_idx) in routes" :key="lv1_idx">
                    <div class="title">
                        <span class="icons">
                            <i
                                :class="['iconfont iconup',lv1.children?'':'hide']"
                                @click="expand(lv1_idx)"
                            ></i>
                            <i
                                :class="['iconfont iconup',lv1.routes?'':'none']"
                                @click="routeExpand(lv1_idx)"
                            ></i>
                        </span>
                        <span class="title-cont">{{lv1.label}}</span>
                        <span v-if="!lv1.children" class="add-router" @click="add">添加路由</span>
                    </div>

                    <!-- 二级 路由内容 -->
                    <ul v-if="lv1.routes" class="route-lv2" :ref="lv1_idx">
                        <li v-for="(route, route_idx) in lv1.routes" :key="route_idx">
                            <i class="iconfont iconshezhi2"></i>
                            <span
                                :class="isShowRed(route)?'red':''"
                            >{{route.title}}</span>
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
                                    <i
                                        :class="['iconfont iconup',lv2.routes?'':'none']"
                                        @click="routeExpand(lv1_idx+'-'+lv2_idx)"
                                    ></i>
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
                                    <span
                                        :class="isShowRed(route2)?'red':''"
                                    >{{route2.title}}</span>
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

                        <!-- 添加路由 -->
                        <li>
                            <span>选择路由:</span>
                            <Select
                                style="width:550px;margin-top:10px;"
                                v-model="form.route"
                                :options="add_route_opt"
                                input
                                @input="routeInput"
                            ></Select>
                        </li>

                        <!-- 编辑路由 -->
                        <!-- <li >
                            <span>选择路由:</span>
                            <Select
                                style="width:550px;margin-top:10px;"
                                v-model="form.route"
                                :options="edit_route_opt"
                                input
                                @input="routeInput"
                            ></Select>
                        </li> -->
                        <li class="mt20">
                            <span class="mb10">标题</span>
                            <Input style="width:550px" v-model="form.title" />
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
            routes: [],
            // dialog
            dia_show: false,
            form: {
                route: '',
                title: ''
            },
            route_all: [], // 所有 select 选项框内容
            add_route_opt: [], // 添加 select
            edit_route_opt: [], // 编辑 select

            route_obj: {}, // 目前路由_对象
            curr_route: [], // 目前路由_后端信息
            // dia
            dia_status: '',
            dia_title: '',

            // modal 框
            mod_show: false
        }
    },
    methods: {
        toTreeArray(menu) {
            return menu.map(item => {
                if (this.route_obj[item.id]) {
                    item.routes = this.route_obj[item.id]
                }
                if (item.children) {
                    item.children = this.toTreeArray(item.children)
                }
                return item
            })
        },
        /* 获取所有可选路由 (select内容) */
        getRouteSelect() {
            let data = { type: 0 }
            let { url, method } = this.$api.menu_date_list
            this.$http({ method, url, data }).then(res => {
                // console.log('select 内容res: ', res);
                // this.route_info = res.data.route_info
                if (res && res.code === '200') {
                    this.route_all = res.data.route_info.map((item, index) => {
                        return {
                            label: item.url,
                            value: item.url,
                            url: item.url,
                            controller: item.controller
                        }
                    })
                }
            })
        },
        // 获取包含路由菜单. 让菜单里面能显示路由
        getRouteMenu() {
            if (this.menu.length === 0) return
            if (this.curr_route.length === 0) return
            this.routes = this.toTreeArray(this.menu)
        },
        initForm() {
            this.form = {}
        },
        add(row) {
            // console.log('row: ', row);
            this.initForm()

            let route_arr = this.curr_route.map(item => item.route_name)
            // 已使用路由不可再被使用
            this.add_route_opt = this.route_all.filter(item => {
                // 路由没有被使用就放进select,另外当前路由也需要放进去. ()
                return (
                    route_arr.indexOf(item.url) === -1 ||
                    item.url === row.route_name
                )
            })

            this.curr_row = row
            this.dia_status = 'add'
            this.dia_title = '添加路由'
            this.dia_show = true
        },
        edit(row) {
            let route_arr = this.curr_route.map(item => item.route_name)
            // // 已使用路由不可再被使用
            this.add_route_opt = this.route_all.filter(item => {
                // 路由没有被使用就放进select,另外当前路由也需要放进去. ()
                return (
                    route_arr.indexOf(item.url) === -1 ||
                    item.url === row.route_name
                )
            })

            this.form.route = row.route_name
            this.form.title = row.title
         
            this.form = Object.assign(this.form)
            this.curr_row = row
            this.dia_status = 'edit'
            this.dia_title = '编辑路由'
            this.dia_show = true
        },
        del(row) {
            this.curr_row = row
            this.mod_show = true
        },
        expand(index) {
            let ele = this.$refs[index]
            $(ele).slideToggle(200)
        },
        isShowRed(route) {
            let search = this.search
            let title = route && route.title
            if(!title) return false
            if(!search) return false
            return title.indexOf(search) !== -1
        },
        routeExpand(index) {
            let ele = this.$refs[index]
            $(ele).slideToggle(200)
        },
        modConf() {
            // 删除 确认
            let data = {
                id: this.curr_row.id
            }

            let { url, method } = this.$api.route_del
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.getRouteList()
                }
            })
        },

        diaCfm() {
            if (this.dia_status === 'add') {
                this.addCfm()
            }
            if (this.dia_status === 'edit') {
                this.editCfm()
            }
        },

        // 当路由输入时 ,更新select里面的内容
        routeInput(val) {
            let route_arr = this.curr_route.map(item => item.route_name)

            this.add_route_opt = this.route_all.filter(item=>{

                 // 1.路由没有被使用就放进select 2.当前路由也需要放进去. 3.并且根据input内容筛选
                let isNothad = route_arr.indexOf(item.url) === -1
                let isCurrent = item.url === this.curr_row.route_name
                let inputfilter = item.url.indexOf(val)!== -1
                return (isNothad || isCurrent) && inputfilter
         
            })
        },
        checkForm() {
            let route_temp = this.route_all.filter(item=>item.url===this.form.route)[0]
            if(!route_temp) {
                this.$toast.warning('请检查路由内容!')
                return false
            }
            if(!this.form.title) {
                this.$toast.warning('请检查标题!')
                return false
            }
                return true
          
        },
        addCfm() {
            if(!this.checkForm()) return
            let route_temp = this.route_all.filter(item=>item.url===this.form.route)[0]
            console.log('route_temp: ', route_temp);
            let controller = route_temp.controller.split('\\')
            controller = controller[controller.length - 1].split('@')[0]

            let data = {
                menu_group_id: this.curr_row.id,
                title: this.form.title,
                route_name: route_temp.url,
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
            
          
            if(!this.checkForm()) return
            let route_temp = this.route_all.filter(item=>item.url===this.form.route)[0]
            let controller = route_temp.controller.split('\\')
            controller = controller[controller.length - 1].split('@')[0]

            let data = {
                id: this.curr_row.id,
                menu_group_id: this.curr_row.menu_group_id,
                title: this.form.title,
                route_name: route_temp.url,
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
        // 获取目前路由内容， __路由是根据id 知道在哪个菜单的子项
        getRouteList() {
            let { url, method } = this.$api.route_all_list
            this.$http({ method, url }).then(res => {
                if (res && res.code === '200') {
                    if (!res.data) return
                    this.curr_route = res.data
                    this.setRouteObj(res.data)
                  
                    this.getRouteMenu()
                }
            })
        },
        // 设置当前路由对象,方便调用
        setRouteObj(arr) {
            this.route_obj = {}

            arr.forEach(item => {
                if (!this.route_obj[item.menu_group_id]) {
                    // 转换为对象列表 方便使用
                    this.route_obj[item.menu_group_id] = []
                }
                this.route_obj[item.menu_group_id].push(item)
            })
        }
    },
    watch: {
        menu(menu) {

            this.getRouteMenu()
        }
    },
    mounted() {
        this.getRouteSelect()
        this.getRouteList()
    }
}
</script>

<style scoped>
.center-box div .search {
    width: 250px;
    margin: 0 auto;
    margin-top: 20px;
}

.center-box {
    display: flex;
    justify-content: center;
}
.center-box li {
    margin-top: 3px;
    margin-bottom: 3px;
}
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
.mt20 {
    margin-top: 20px;
}
.mb10 {
    margin-bottom: 10px;
}
.iconshezhi2 {
    margin-right: 5px;
}
.ml5 {
    margin-left: 5px;
}
.ml10 {
    margin-left: 10px;
}
.ml20 {
    margin-left: 20px;
}
.mt50 {
    margin-top: 50px;
}
.center-box {
    display: flex;
    justify-content: center;
}
.ml50 {
    margin-left: 50px;
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
.mt20 {
    margin-top: 20px;
}
</style>