<template>
    <div class="container total-menu">
        <!-- 总控菜单 -->
        <div class="tol-left" @contextmenu.prevent>
            <div class="head">编辑菜单</div>
            <div class="head-sub">
                <button class="btn-blue" @click="addLev1Menu">添加一级菜单</button>
            </div>
            <!-- 编辑菜单 -->
            <div class="edit-menu center-box ph20">
                <ul class="lev1">
                    <li v-for="(lev1, lev1_idx) in menu" :key="lev1_idx">
                        <div class="title" @contextmenu.prevent="contextmenu($event,lev1)">
                            <i
                                :class="['iconfont iconup',lev1.children?'':'hide']"
                                @click="expand(lev1.pre_idx)"
                            ></i>
                            <span class="title-cont label">{{lev1.label}}</span>
                            <Switchbox class="switch" />
                        </div>

                        <!-- 内容 -->
                        <ul v-if="lev1.children" class="lev2" :ref="lev1.pre_idx">
                            <li v-for="(lev2, lev2_idx) in lev1.children" :key="lev2_idx">
                                <div class="title" @contextmenu.prevent="contextmenu($event,lev2)">
                                    <i
                                        :class="['iconfont iconup',lev2.children?'':'hide']"
                                        @click="expand(lev2.pre_idx)"
                                    ></i>
                                    <span class="label">{{lev2.label}}</span>

                                    <Switchbox class="switch" />
                                    <div v-show="lev2.show_menu" class="context-menu">
                                        <p @click="addSubordinate(lev1)">添加下级</p>
                                        <p @click="editMenu(lev1)">编辑菜单</p>
                                        <p @click="delMenu(lev1)">删除菜单</p>
                                    </div>
                                </div>

                                <ul v-if="lev2.children" class="lev3" :ref="lev2.pre_idx">{{lev2.pre_idx}}
                                    <li v-for="(lev3, lev3_idx) in lev2.children" :key="lev3_idx">
                                        <div
                                            class="title"
                                            @contextmenu.prevent="contextmenu($event,lev3)"
                                        >
                                            <i
                                                :class="['iconfont iconup',lev3.children?'':'hide']"
                                                @click="expand(lev3.pre_idx)"
                                            ></i>
                                            <span class="label">{{lev3.label}}</span>
                                            <Switchbox class="switch" />
                                        </div>

                                        <ul
                                            v-if="lev3.children"
                                            class="lev4"
                                            :ref="lev3.pre_idx"
                                            @click="expand(lev4.pre_idx)"
                                        >
                                            <li
                                                v-for="(lev4, lev4_idx) in lev3.children"
                                                :key="lev4_idx"
                                            >
                                                <i
                                                    :class="['iconfont iconup',lev4.children?'':'hide']"
                                                    @click="expand(lev4.pre_idx)"
                                                ></i>
                                                <span class="label">{{lev4.label}}</span>
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
                
                <MenuSort :menu="menu"/>
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
                        <li>
                            <span>是否是父级菜单：</span>
                            <Radio
                                class="radio-left"
                                label="是"
                                :value="form.is_parent"
                                val="1"
                                v-model="form.is_parent"
                            />
                            <Radio
                                class="radio-right ml20"
                                label="否"
                                :value="form.is_parent"
                                val="0"
                                v-model="form.is_parent"
                            />
                        </li>
                        <li>
                            <span>父级ID：</span>
                            <Input class="w250" v-model="form.parent_id" />
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
                        <button class="btn-plain-large">取消创建</button>
                        <button class="btn-blue-large ml20" @click="diaCfm">确认创建</button>
                    </div>
                </div>
            </div>
        </Dialog>
        <div v-show="menu_show" class="context-menu" ref="menu" v-clickoutside="menuClose">
            <p @click="addSubordinate">添加下级</p>
            <p @click="editMenu">编辑菜单</p>
            <p @click="delMenu">删除菜单</p>
        </div>
    </div>
</template>

<script>
// import DragTree from 'ant-design-vue/lib/tree' // 按需引入
// import css from 'ant-design-vue/lib/tree/style/css' // 加载 ant CSS
// import Vue from 'vue';
import RouteSet from './TotaMenuDir/RouteSet'
import MenuSort from './TotaMenuDir/MenuSort'
import { Tree } from 'element-ui'
export default {
    // name: 'vue-draggable-tree-demo',
    components: {
        [Tree.name]: Tree,
        RouteSet: RouteSet,
        MenuSort: MenuSort
    },
    data() {
        return {
            menu: [],
            expandedKeys: ['0', '0-0', '0-0-0', '0-0-0-0'],
            curr_row: {},
            dia_show: false,
            dia_status: '',
            dia_title: '',
            form: {
                icon: '',
                label: '',
                en_name: '',
                route: '',
                sort: '1', //   TODO: 先随便写个, 待和后台交流, 为什么这么写
                is_parent: '',
                parent_id: '',
                display: ''
            },
            menu_show: false
        }
    },
    methods: {
        initForm() {
            // this.form = {}
        },
        addLev1Menu() {
            this.initForm()
            this.dia_status = 'addlev1'
            this.dia_title = '添加一级菜单'
            this.dia_show = true
        },
        expand(index) {
            // console.log('index: ', index)
            let ele = this.$refs[index]
            $(ele).slideToggle(200)
        },

        contextmenu(e, row) {
            this.curr_row = row
            let left = e.clientX
            let top = e.clientY + 20
            // this.$refs.menu
            let menuDom = this.$refs.menu
            menuDom.style.left = left + 'px'
            menuDom.style.top = top + 'px'
            this.menu_show = true
        },

        addSubordinate() {
            console.log('当前值',this.curr_row)
            this.dia_status = 'add_sub'
            this.dia_title = '添加下级'
            this.dia_show = true
            this.menu_show = false
        },
        editMenu() {
            console.log('当前值',this.curr_row)
            this.dia_status = 'edit'
            this.dia_title = '编辑菜单'
            this.dia_show = true
            this.menu_show = false
        },
        delMenu() {
            console.log('点击删除')
        },

        diaCfm() {
            if(this.dia_status==='addlev1') {
                this.addMenuCfm()
            }
            if(this.dia_status==='add_sub') {
                this.addSubCfm()
            }
            if(this.dia_status==='edit') {
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
                sort: this.form.sort,
                is_parent: this.form.is_parent,
                parent_id: this.form.parent_id
            }
            let { url, method } = this.$api.menu_add
            this.$http({ method, url, data }).then(res => {
                console.log('res: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                }
            })
        },
        editCfm() {
            let data = {
                // id: this.form.id,
                // status: this.form.status,
            }
            
            let { url, method } = this.$api.menu_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
            
                    this.$toast.success(res && res.message)
                    this.mod_show=false
                    this.getList()
                } else {
                    if (res && res.message !== '') {
                        this.$toast.error(res.message)
                    }
                }
            })
        },
        // 关闭菜单
        menuClose() {
            this.menu_show = false
        },

        rtClick(r) {
            console.log('dsf', r)
        },

        // 后台数据转成可用tree数组1
        /**
         *
         * @params {array} list 要转数组
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
                }

                return item
            })
        },

        getMenuList() {
            // let { url, method } = this.$api.menu_all_list
            // this.$http({ method, url }).then(res => {
            //     if (res && res.code === '200') {
            //         let menu = res.data
            //         this.menu = this.toTreeArray(menu)
            //     }
            // })
            this.menu = JSON.parse(localStorage.getItem('menu'))
            console.log('外层menu: ', this.menu);
        }
    },
    mounted() {
        this.getMenuList()
    }
}
</script>

<style scoped>
.total-menu {
    display: flex;
    min-width: 1200px;
}
.total-menu .tol-left,
.total-menu .tol-center,
.total-menu .tol-right {
    width: 33%;
    /* padding: 20px; */
    /* min-width: 350px; */
    min-height: 700px;
    border: 1px solid #70a2fd;
}
/* .total-menu .tol-left {

}
.total-menu .tol-center {
} */
.tol-right {
    white-space: nowrap;
    overflow: auto;
}
.total-menu .head {
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
    background: #dce6fa;
}

/* 该属性与 引入属性有冲突 */
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
    /* top: 25px;
    left: 50px; */
    /* padding: 10px; */
    background: rgb(255, 255, 255);
    border: 1px solid #eee;
    border-radius: 5px;
    box-shadow: 0 0 5px 2px rgba(2, 29, 70, 0.247);
    z-index: 3;
}
.context-menu p {
    padding: 5px 10px;
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