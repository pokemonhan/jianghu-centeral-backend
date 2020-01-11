<template>
    <div class="center-box">
        <ul class="lev1">
            <li v-for="(lv1,lv1_idx) in routes" :key="lv1_idx">
                <div class="title">
                    <i :class="['iconfont iconup',lv1.children?'':'hide']" @click="expand(lv1_idx)"></i>
                    <span class="title-cont">{{lv1.label}}</span>
                    <span v-if="!lv1.children" class="add-router" @click="add">添加路由</span>
                </div>

                <!-- ** 路由内容 -->
                <ul v-if="lv1.routes" class="route-lv2">
                    <li v-for="(route, route_idx) in lv1.routes" :key="route_idx">
                        <i class="iconfont iconshezhi2"></i>
                        <span>{{route.title}}</span>
                        <span class="a" @click="edit(lv1)">编辑</span>
                        <span class="a" @click="del(lv1)">删除</span>
                        <Switchbox class="switch" />
                    </li>
                </ul>

                <ul v-if="lv1.children" class="lev2" :ref="lv1_idx">
                    <li v-for="(lv2,lv2_idx) in lv1.children" :key="lv2_idx">
                        <div class="title">
                            <i
                                :class="['iconfont iconup',lv2.children?'':'hide']"
                                @click="expand(lv1_idx+'-'+lv2_idx)"
                            ></i>
                            <span class="title-cont">{{lv2.label}}</span>
                            <span v-if="!lv2.children" class="add-router" @click="add(lv2)">添加路由</span>
                        </div>

                        <!-- ** 路由内容 -->
                        <ul v-if="lv2.routes" class="route-lv3">
                            <li
                                class="flex"
                                v-for="(route2, route_idx_2) in lv2.routes"
                                :key="route_idx_2"
                            >
                                <i class="iconfont iconshezhi2"></i>
                                <span>{{route2.title}}</span>
                                <span class="a" @click="edit(route2)">编辑</span>
                                <span class="a" @click="del(route2)">删除</span>
                                <Switchbox class="switch" />
                            </li>
                        </ul>

                        <ul v-if="lv2.children" class="lev3" :ref="lv1_idx+'-'+lv2_idx">
                            <li v-for="(lv3, lv3_idx) in lv2.children" :key="lv3_idx">
                                <div class="title">
                                    <i
                                        :class="['iconfont iconup',lv3.children?'':'hide']"
                                        @click="expand(lv1_idx+'-'+lv2_idx+'-'+lv3_idx)"
                                    ></i>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
        <Dialog :show.sync="dia_show" :title="dia_title">
            <div class="dia-inner">
                <div>
                    <ul class="form">
                        <li v-if="dia_status==='add'">
                            <span>选择路由:</span>
                            <Select
                                style="width:550px;margin-top:10px;"
                                v-model="form.route"
                                :options="add_route_opt"
                            ></Select>
                        </li>
                        <li v-else>
                            <span>选择路由:</span>
                            <Select
                                style="width:550px;margin-top:10px;"
                                v-model="form.route"
                                :options="edit_route_opt"
                            ></Select>
                        </li>
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
            // console.log('this.route_opt.length: ', this.route_opt.length);

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
            let params = { type: 0 }
            let { url, method } = this.$api.menu_date_list
            this.$http({ method, url, params }).then(res => {
                // console.log('select 内容res: ', res);
                // this.route_info = res.data.route_info
                if (res && res.code === '200') {
                    this.route_all = res.data.route_info.map((item, index) => {
                        return {
                            label: item.url,
                            value: index,
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
            this.initForm()

            let route_arr = this.curr_route.map(item => item.route_name)
            // 已使用路由不可再被使用
            this.add_route_opt = this.route_all.filter(item => {
                // 路由没有被使用就放进select 
                return route_arr.indexOf(item.url) === -1
            })

            this.curr_row = row
            this.dia_status = 'add'
            this.dia_title = '添加路由'
            this.dia_show = true
        },
        edit(row) {
            let route_arr = this.curr_route.map(item => item.route_name)
            // 已使用路由不可再被使用
            this.edit_route_opt = this.route_all.filter(item => {
                 // 路由没有被使用就放进select,另外当前路由也需要放进去. () 
                return route_arr.indexOf(item.url) === -1 ||item.url===row.route_name
            })

            this.route_all.forEach((item, index) => {
                if (item.url === row.route_name) {
                    this.form.route = index
                    return
                }
            })
            this.form.title = row.title
            console.log('this.form: ', this.form)
            // this.$forceUpdate()
            this.form = Object.assign(this.form)
            this.curr_row = row
            this.dia_status = 'edit'
            this.dia_title = '编辑路由'
            this.dia_show = true
        },
        del(row) {
            // console.log('sdfsdf')
            this.curr_row = row
            this.mod_show = true
        },
        expand(index) {
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
                console.log('列表👌👌👌👌: ', res)
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
        addCfm() {
            let route_temp = this.route_all[this.form.route]
            let controller = route_temp.controller.split('\\')
            controller = controller[controller.length - 1].split('@')[0]

            let data = {
                menu_group_id: this.curr_row.id,
                title: this.form.title,
                route_name: route_temp.url,
                controller: controller,
                method: this.route_all[this.form.route].controller.split('@')[1]
            }

            let { url, method } = this.$api.route_add
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getRouteList()
                }
            })
        },
        editCfm() {
            let route_temp = this.route_all[this.form.route]
            let controller = route_temp.controller.split('\\')
            controller = controller[controller.length - 1].split('@')[0]

            let data = {
                id: this.curr_row.id,
                menu_group_id: this.curr_row.menu_group_id,
                title: this.form.title,
                route_name: route_temp.url,
                controller: controller,
                method: this.route_all[this.form.route].controller.split('@')[1]
            }

            let { url, method } = this.$api.route_set
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
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
                    // if(this.menu.length !==0 &&this.menu.length===0){
                    //     this.toTreeArray(this.menu)

                    // }
                    this.getRouteMenu()
                }
            })
        },
        // 设置当前路由对象,方便调用
        setRouteObj(arr) {
            this.route_obj = {}

            arr.forEach(item => {
                // this.route_obj[item.menu_group_id] = item
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
            // console.log('变化之后 ', menu);

            this.getRouteMenu()
            // console.log('this.routes: ', this.routes);
        }
    },
    mounted() {
        this.getRouteSelect()
        this.getRouteList()
    }
}
</script>

<style scoped>
.add-router {
    color: #4c8bfd;
    cursor: pointer;
    margin-left: 20px;
}
.center-box {
    display: flex;
    justify-content: center;
}
.lev1 > li {
    margin-top: 10px;
}

/* .lev1 > li > .title > span { */
/* } */
.lev2 {
    margin-left: 10px;
    font-size: 12px;
    /* text-align: left; */
}
/* .lev2 > li {
} */
.lev2 > li > span {
    display: inline-block;
    margin-top: 6px;
}
.title {
    display: flex;
}
.title .hide {
    opacity: 0;
}
.checkbox-head {
    font-weight: bold;
    font-size: 16px;
}
.lev2 .checkbox {
    /* margin-top: 10px; */
    padding: 5px 0;
}
.iconup {
    margin-right: 5px;
}
.lev3 {
    margin-left: 16px;
}
.lev4 {
    margin-left: 16px;
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
    margin-left: 40px;
}
.route-lv2 > li {
    display: flex;
    /* align-items: center; */
    white-space: nowrap;
}
.route-lv3 {
    margin-left: 40px;
}
</style>