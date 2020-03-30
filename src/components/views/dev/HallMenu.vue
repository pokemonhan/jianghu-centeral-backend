<template>
    <div class="container hall-menu">
        <!-- 总控菜单 -->
        <div class="tol-left" @contextmenu.prevent>
            <div class="head">编辑菜单</div>
            <div class="head-sub">
                <button class="btn-blue" @click="addLev1Menu">添加菜单</button>
            </div>
            <!-- 编辑菜单 -->
            <div class="edit-menu center-box ph20">
                <ul class="lev1">
                    <li v-for="(lev1, lev1_idx) in menu" :key="lev1_idx">
                        <div
                            :class="[active_title_id===lev1.id?'active-title':'','title']"
                            @contextmenu.prevent="contextmenu($event,lev1)"
                        >
                            <i
                                :class="['iconfont iconup',lev1.children?'':'hide']"
                                @click="expand(lev1)"
                            ></i>
                            <span class="title-cont label" @click="expand(lev1)">{{lev1.label}}</span>
                            <Switchbox
                                class="switch"
                                :value="lev1.display"
                                @update="switchDisplay($event,lev1)"
                            />
                        </div>

                        <!-- 内容 -->
                        <ul v-if="lev1.children" class="lev2" :ref="lev1.id">
                            <li v-for="(lev2, lev2_idx) in lev1.children" :key="lev2_idx">
                                <div
                                    :class="[active_title_id===lev2.id?'active-title':'','title']"
                                    @contextmenu.prevent="contextmenu($event,lev2)"
                                >
                                    <i
                                        :class="['iconfont iconup',lev2.children?'':'hide']"
                                        @click="expand(lev2)"
                                    ></i>
                                    <span class="label" @click="expand(lev2)">{{lev2.label}}</span>

                                    <Switchbox
                                        class="switch"
                                        :value="lev2.display"
                                        @update="switchDisplay($event,lev2)"
                                    />
                                </div>

                                <ul v-if="lev2.children" class="lev3" :ref="lev2.id">
                                    {{lev2.pre_idx}}
                                    <li v-for="(lev3, lev3_idx) in lev2.children" :key="lev3_idx">
                                        <div
                                            :class="[active_title_id===lev3.id?'active-title':'','title']"
                                            @contextmenu.prevent="contextmenu($event,lev3)"
                                        >
                                            <i
                                                :class="['iconfont iconup',lev3.children?'':'hide']"
                                                @click="expand(lev3)"
                                            ></i>
                                            <span class="label" @click="expand(lev3)">{{lev3.label}}</span>
                                            <Switchbox
                                                class="switch"
                                                :value="lev3.display"
                                                @update="switchDisplay($event,lev3)"
                                            />
                                        </div>

                                        <ul v-if="lev3.children" class="lev4" :ref="lev3.id">
                                            <li
                                                v-for="(lev4, lev4_idx) in lev3.children"
                                                :key="lev4_idx"
                                            >
                                                <i
                                                    :class="['iconfont iconup',lev4.children?'':'hide']"
                                                    @click="expand(lev4)"
                                                ></i>
                                                <span
                                                    class="label"
                                                    @click="expand(lev4)"
                                                >{{lev4.label}}</span>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 菜单拖拽排序 -->
        <div class="tol-center">
            <div class="head">菜单拖动排序</div>

            <div class="center-box ph20">
                <MenuSort :menu="menu" @refreshMenu="getMenuList" />
            </div>
        </div>
        <!-- 右边 -->
        <div class="tol-right">
            <div class="head">路由设置</div>
            <RouteSet class="ph20" :menu="menu" />
        </div>

        <!-- 添加一级菜单 -->
        <Dialog :show.sync="dia_show" :title="dia_title">
            <div class="dia-inner">
                <div class="form">
                    <ul>
                        <li>
                            <span>图标：</span>
                            <Input class="w250" v-model="form.icon" />
                        </li>
                        <li>
                            <span>中文名称：</span>
                            <Input class="w250" v-model="form.label" />
                        </li>
                        <li>
                            <span>英文名称：</span>
                            <Input class="w250" v-model="form.en_name" />
                        </li>
                        <li>
                            <span>路由：</span>
                            <Input class="w250" v-model="form.route" />
                        </li>
                       <li v-if="dia_status==='add'">
                            <span>是否是一级菜单：</span>
                            <Radio
                                class="radio-left"
                                label="是"
                                :value="form.is_lev1"
                                val="1"
                                v-model="form.is_lev1"
                                @update="islev1Upd"
                            />
                            <Radio
                                class="radio-right ml20"
                                label="否"
                                :value="form.is_lev1"
                                val="0"
                                v-model="form.is_lev1"
                                @update="islev1Upd"
                            />
                        </li>
                        <li v-if="form.is_lev1==='0'">
                            <span>一级菜单：</span>
                            <Select class="w250" v-model="form.pid" :options="parent_menu_opt" @update="parentMenuUpd"></Select>
                        </li>
                        <!-- 备用 -->
                        <li v-show="false">
                            <span>父级ID：</span>
                            <Input class="w250" v-model="form.pid" />
                        </li>
    
                        <!-- 备用 -->
                        <li v-show="false">
                            <span>层级：</span>
                            <Input class="w250" v-model="form.level" />
                        </li>
                        <li>
                            <span>是否显示：</span>
                            <Radio
                                class="radio-left"
                                label="是"
                                :value="form.display"
                                val="1"
                                v-model="form.display"
                            />
                            <Radio
                                class="radio-right ml20"
                                label="否"
                                :value="form.display"
                                val="0"
                                v-model="form.display"
                            />
                        </li>
                    </ul>
                    <div class="center-box mt30">
                        <button class="btn-plain-large" @click="dia_show=false">取消创建</button>
                        <button
                            v-if="dia_status==='add'"
                            class="btn-blue-large ml20"
                            @click="diaCfm"
                        >确认创建</button>
                        <button
                            v-if="dia_status==='edit'"
                            class="btn-blue-large ml20"
                            @click="diaCfm"
                        >确认创建</button>
                    </div>
                </div>
            </div>
        </Dialog>
        <Modal
            :show.sync="mod_show"
            title="删除菜单"
            content="是否删除该菜单"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>

        <div v-show="menu_show" class="context-menu" ref="menu" v-clickoutside="menuClose">
            <p v-if="curr_row.level===1" @click="addSubordinate">添加下级</p>
            <p @click="editMenu">编辑菜单</p>
            <p @click="delClick">删除菜单</p>
        </div>
    </div>
</template>

<script>
import RouteSet from './hallMenuDir/HallRouteSet'
import MenuSort from './hallMenuDir/HallMenuSort'
import slide from '../../../js/config/slide'
export default {
    name: 'HallMenu',
    components: {
        RouteSet: RouteSet,
        MenuSort: MenuSort
    },
    data() {
        return {
            menu: [],
            active_title_id: 'null',
            curr_row: {},
            // dialog
            dia_show: false,
            dia_status: '',
            dia_title: '',
            form: {
                icon: '',
                label: '',
                en_name: '',
                route: '',

                pid: '',
                level: '',
                display: 1
            },
            parent_menu_opt:[],
            menu_show: false,
            // modal
            mod_show: false
        }
    },
    methods: {
        // 更改父级菜单
        parentMenuUpd() {

        },
        islev1Upd(val) {
            let is_lev1 = val
            console.log('val: ', val);
            // 一级菜单
            if(is_lev1==='1') {
                this.form.pid = '0'
                this.form.level= '1'
            // 子菜单
            }else {
                this.form.level= '2'
            }
        },
        initForm() {
            this.form = {
                icon: '',
                label: '',
                en_name: '',
                route: '',
                is_lev1: '1',
                pid: 0,
                level: 1,
                display: 1
            }
        },

        addLev1Menu() {
            this.initForm()
            this.dia_status = 'add'
            this.dia_title = '添加菜单'
            this.dia_show = true
            
        },
        expand(item) {
            let ele = (this.$refs[item.id] && this.$refs[item.id][0]) || ''
            if (!ele) return
            // $(ele).slideToggle(200)
            // slide.slideToggle(ele)
            window.all.tool.slideToggle(ele)
        },

        contextmenu(e, row) {
            console.log('row: ', row)

            this.curr_row = row
            this.active_title_id = row.id
            let left = e.clientX
            let top = e.clientY + 20
            // this.$refs.menu
            let menuDom = this.$refs.menu
            menuDom.style.left = left + 'px'
            menuDom.style.top = top + 'px'
            this.menu_show = true
        },

        addSubordinate() {
            console.log('当前值', this.curr_row)
            this.dia_status = 'add'
            let label = this.curr_row.label
            this.dia_title = '添加下级 - ' + label
            this.dia_show = true
            this.menu_show = false
            this.form = {
                is_lev1: '0',
                pid: this.curr_row.id,
                level: this.curr_row.level + 1,
                display: 1
            }
        },

        editMenu() {
            console.log('当前值', this.curr_row)
            this.dia_status = 'edit'
            let label = this.curr_row.label
            this.dia_title = '编辑菜单 - ' + label
            this.dia_show = true
            this.menu_show = false
            this.form = {
                id: this.curr_row.id,
                icon: this.curr_row.icon,
                label: this.curr_row.label,
                en_name: this.curr_row.en_name,
                route: this.curr_row.route,
                pid: this.curr_row.pid,
                level: this.curr_row.level,
                display: this.curr_row.display
            }
        },
        delClick() {
            this.mod_show = true
        },
        delCfm() {
            let data = {
                id: this.curr_row.id
            }

            let { url, method } = this.$api.merchant_menu_del
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.getMenuList()
                    // this.getList()
                }
            })
        },

        diaCfm() {
            if (this.dia_status === 'add') {
                this.addMenuCfm()
            }
            // if (this.dia_status === 'add_sub') {
            //     this.addMenuCfm()
            // }
            if (this.dia_status === 'edit') {
                this.editCfm()
            }
        },
        addMenuCfm() {
            // console.log('当前row', this.curr_row)
            let data = {
                label: this.form.label,
                en_name: this.form.en_name,
                display: this.form.display,
                route: this.form.route,
                pid: this.form.pid ? this.form.pid : 0,
                level: this.form.level ? this.form.level : 0,
                icon: this.form.icon
            }
            let { url, method } = this.$api.merchant_menu_add

            this.$http({ method, url, data }).then(res => {
                console.log('res: ', res)
                if (res && res.code === '200') {
                    this.dia_show = false

                    this.$toast.success(res.message)
                    this.getMenuList()
                }
            })
        },
        editCfm() {
            let data = {
                id: this.form.id,
                label: this.form.label,
                en_name: this.form.en_name,
                display: this.form.display,
                route: this.form.route,
                pid: this.form.pid ? this.form.pid : 0,
                level: this.form.level ? this.form.level : 0,
                icon: this.form.icon
            }

            let { url, method } = this.$api.merchant_menu_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getMenuList()
                }
            })
        },

        modConf() {
            this.delCfm()
        },
        // 关闭菜单
        menuClose() {
            this.menu_show = false
        },

        // rtClick(r) {
        //     console.log('dsf', r)
        // },
        // 切换菜单显示状态
        switchDisplay(val, row) {
            // console.log('val: ', val)
            // console.log('row: ', row)
            let data = {
                id: row.id,
                display: val ? 1 : 0
            }

            let { url, method } = this.$api.merchant_menu_display_set
            this.$http({ method, url, data }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                }
                this.getMenuList()
            })
        },
        // 后台数据转成可用tree数组1
        /**
         *
         * @params {array} list 要转换的数组
         * @params {string} pre_idx 前缀
         */
        toTreeArray(list, pre_idx = '') {
            return Object.keys(list).map((key, index) => {
                let item = list[key]

                item.key = pre_idx + index // 方便下拉框使用
                if (list[key].child) {
                    item.children = this.toTreeArray(
                        list[key].child,
                        item.key + '-'
                    )
                    delete item.child
                }

                return item
            })
        },

        getMenuList() {
            let { url, method } = this.$api.merchant_menu_all_list
            this.$http({ method, url }).then(res => {
                if (res && res.code === '200') {
                    // console.log('res全部列表: ', res)
                    Object.keys(res.data).forEach(item => {
                        // console.log(item);
                    })
                    let menu = res.data
                    this.menu = this.toTreeArray(menu) || []
                    this.parent_menu_opt = this.menu.map(item => {
                        console.log('item: ', item);
                        return {
                            value: item.id,
                            label: item.label
                        }
                    })
                    // console.log('外层menu: ', this.menu)
                }
            })
            // this.menu = JSON.parse(localStorage.getItem('menu'))
            // this.menu = window.all.menu_list
        }
    },

    mounted() {
        this.getMenuList()
    }
}
</script>

<style scoped>
.hall-menu {
    display: flex;
    min-width: 1200px;
    /* height: 100%; */
    /* padding: 0; */
}
.hall-menu .tol-left,
.hall-menu .tol-center,
.hall-menu .tol-right {
    /* width: 33.333%; */
    /* height: 100%; */
    padding-bottom: 20px;
    /* min-width: 350px; */
    min-height: 700px;
    border: 1px solid #70a2fd;
    border-bottom: none;
    overflow: auto;
}
.hall-menu .tol-left {
    width: 30%;
}
.hall-menu .tol-center {
    width: 30%;
}
.tol-right {
    width: 40%;
    white-space: nowrap;
    overflow: auto;
}
.hall-menu .head {
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #70a2fd;
    color: #fff;
}
.head-sub {
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #e5f7ff;
    color: #fff;
}
.center-box {
    display: flex;
    justify-content: center;
}
.edit-menu .title {
    position: relative;
    line-height: 26px;
}
.lev1 ul {
    /* border: 1px solid #000; */
    overflow: hidden;
    transition: max-height 0.2s;
}
.lev2 .title {
    padding-left: 2em;
}
.title {
    display: flex;
}
.title .hide {
    opacity: 0;
}
.edit-menu .title:hover {
    color: #fff;
    background: #79a6f8;
}
.edit-menu .active-title {
    color: #fff;
    background: #79a6f8;
    transition: all 0.3s;
}

/* 该属性与 引入属性不一致 */
.btn-blue {
    line-height: 20px;
}
.switch {
    transform: scale(0.5);
    /* transform: translateY(-10%); */
}
/* .lev1 .title {
} */
/* .lev1 > li {
    margin-top: 10px;
} */

/* .lev1 > li > .title > span { */
/* } */
.lev1 > li > div .label {
    min-width: 5em;
}
.lev2 > li > div .label {
    min-width: 7em;
}
.lev2 {
    box-sizing: border-box;
    font-size: 12px;
    /* text-align: left; */
}
/* .lev2 > li {
} */
.lev2 > li > span {
    display: inline-block;
    margin-top: 6px;
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
.form {
    padding: 0 100px;
}
.form ul li {
    display: flex;
    align-items: center;
    margin-top: 20px;
}
.form ul li:first-child {
    margin-top: 0;
}
.form ul li > span:first-child {
    width: 8em;
    text-align: right;
}
.ml20 {
    margin-left: 20px;
}
.mt30 {
    margin-top: 30px;
}

/* 右键菜单 */
.context-menu {
    position: fixed;

    background: rgb(255, 255, 255);
    border: 1px solid #eee;
    border-radius: 5px;
    box-shadow: 0 0 5px 2px rgba(2, 29, 70, 0.247);
    z-index: 3;
}
.context-menu p {
    padding: 6px 20px;
}
.context-menu p:hover {
    color: #fff;
    background: #79a6f8;
}
.close-menu {
    font-size: 12px;
    color: red;
}
/* 右键菜单 */

/* 菜单拖动排序  中*/
.tol-center .center-box {
    margin-top: 40px;
}
.ph20 {
    padding-left: 20px;
    padding-right: 20px;
}
</style>