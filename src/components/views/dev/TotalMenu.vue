<template>
    <div class="container total-menu">
        <!-- 总控菜单 -->

        <div class="tol-left">
            <div class="head">编辑菜单</div>
            <div class="head-sub">
                <button class="btn-blue" @click="addLev1Menu">添加一级菜单</button>
            </div>
            <!-- 编辑菜单 -->
            <div class="edit-menu center-box">
                <div>
                    <ul class="lev1" @contextmenu.prevent>
                        <li v-for="(lev1, lev1_idx) in menu" :key="lev1_idx">
                            <div class="title" @click.right="contexMenu(lev1)">
                                <i
                                    :class="['iconfont iconup',lev1.children?'':'hide']"
                                    @click="expand(lev1.id)"
                                ></i>
                                <span class="title-cont">{{lev1.label}}</span>
                                <Switchbox class="switch" />
                                <div v-if="lev1.show_menu" class="context-menu">
                                    <p @click="addSubordinate(lev1)">添加下级</p>
                                    <p @click="quoteMsg">编辑菜单</p>
                                    <p @click="deleteMsg">删除菜单</p>
                                    <p class="close-menu" @click="closeMenu(lev1)">关闭</p>
                                </div>
                            </div>

                            <!-- 内容 -->
                            <ul v-if="lev1.children" class="lev2" :ref="lev1.id">
                                <li v-for="(lev2, lev2_idx) in lev1.children" :key="lev2_idx">
                                    <div class="title" @click.right="contexMenu(lev2)">
                                        <i
                                            :class="['iconfont iconup',lev2.children?'':'hide']"
                                            @click="expand(lev2.id)"
                                        ></i>
                                        <span>{{lev2.label}}</span>

                                        <Switchbox class="switch" />
                                        <div v-if="lev2.show_menu" class="context-menu">
                                            <p @click="addSubordinate(lev2)">添加下级</p>
                                            <p @click="quoteMsg">编辑菜单</p>
                                            <p @click="deleteMsg">删除菜单</p>
                                            <p class="close-menu" @click="closeMenu(lev2)">关闭</p>
                                        </div>
                                    </div>
                                    <ul v-if="lev2.children" class="lev3" :ref="lev2.id">
                                        <li
                                            v-for="(lev3, lev3_idx) in lev2.children"
                                            :key="lev3_idx"
                                        >
                                            <div class="title">
                                                <i
                                                    :class="['iconfont iconup',lev3.children?'':'hide']"
                                                    @click="expand(lev3.id)"
                                                ></i>
                                                <span>{{lev3.label}}</span>
                                                <Switchbox class="switch" />
                                                <div v-if="lev3.show_menu" class="context-menu">
                                                    <p @click="addSubordinate(lev3)">添加下级</p>
                                                    <p @click="quoteMsg">编辑菜单</p>
                                                    <p @click="deleteMsg">删除菜单</p>
                                                </div>
                                            </div>
                                            <ul
                                                v-if="lev3.children"
                                                class="lev4"
                                                :ref="lev3.id"
                                                @click="expand(lev4.id)"
                                            >
                                                <li
                                                    v-for="(lev4, lev4_idx) in lev3.children"
                                                    :key="lev4_idx"
                                                >
                                                    <i
                                                        :class="['iconfont iconup',lev4.children?'':'hide']"
                                                        @click="expand(lev4.id)"
                                                    ></i>
                                                    <span>{{lev4.title}}</span>
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
        </div>

        <div class="tol-center">
            <div class="head">菜单拖动排序</div>
            <!-- <div class="head-sub">
                <button class="btn-blue">添加一级菜单</button>
            </div>-->
            <div class="center-box">
                <!-- 这里使用 ant vue ui -->
                <el-tree
                    :data="menu"
                    node-key="id"
                    default-expand-all
                    @node-drag-start="handleDragStart"
                    @node-drag-enter="handleDragEnter"
                    @node-drag-leave="handleDragLeave"
                    @node-drag-over="handleDragOver"
                    @node-drag-end="handleDragEnd"
                    @node-drop="handleDrop"
                    draggable
                    :allow-drop="allowDrop"
                    :allow-drag="allowDrag"
                ></el-tree>
            </div>
        </div>
        <!-- 右边 -->
        <div class="tol-right">
            <div class="head">路由设置</div>
            <RouteTree :menu="menu" />
        </div>

        <!-- 添加一级菜单 -->
        <Dialog :show.sync="dia_show" title="标题标题">
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
                            <span>是否是父级ID：</span>
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
                        <button class="btn-blue-large ml20" @click="addLev1MenuCfm">确认创建</button>
                    </div>
                </div>
            </div>
        </Dialog>
        <!-- @update:show="(show) => contextMenuVisible = show" -->
    </div>
</template>

<script>
// import DragTree from 'ant-design-vue/lib/tree' // 按需引入
// import css from 'ant-design-vue/lib/tree/style/css' // 加载 ant CSS
// import Vue from 'vue';
import RouteTree from './TotaMenuDir/RouteTree'
import { Tree } from 'element-ui'
export default {
    // name: 'vue-draggable-tree-demo',
    components: {
        [Tree.name]: Tree,
        RouteTree: RouteTree
    },
    data() {
        return {
            menu: [],
            expandedKeys: ['0', '0-0', '0-0-0', '0-0-0-0'],
            dia_show: false,
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
            contextMenuTarget: document.body, // 可右键区域，这里也可以绑定$refs
            contextMenuVisible: false
        }
    },
    methods: {
        addLev1Menu() {
            this.dia_show = true
        },
        expand(index) {
            console.log('index: ', index)
            let ele = this.$refs[index]
            $(ele).slideToggle(200)
        },
        // 点击右键菜单
        contexMenu(item) {
            this.menu.forEach(item => {
                item.show_menu = false
                if (item.children) {
                    item.children.forEach(children => {
                        children.show_menu = false
                    })
                }
            })
            item.show_menu = true
            this.menu = this.menu.slice()
            console.log('this.menu: ', this.menu)
        },
        // 关闭菜单
        closeMenu(item) {
            this.menu = this.menu.slice()
            item.show_menu = false
        },
        updateShow(show) {
            // console.log('show: ', show);
            // this.contextMenuVisible = show
        },
        addLev1MenuCfm() {
            console.log('addLev1MenuCfm点击确认')
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
                if(res && res.code==='200') {
                    this.$toast.success(res.message)
                }
            })
        },
        rtClick(r) {
            console.log('dsf', r)
        },
        handleDragStart(node, ev) {
            console.log('drag start', node)
        },
        handleDragEnter(draggingNode, dropNode, ev) {
            console.log('tree drag enter: ', dropNode.label)
        },
        handleDragLeave(draggingNode, dropNode, ev) {
            console.log('tree drag leave: ', dropNode.label)
        },
        handleDragOver(draggingNode, dropNode, ev) {
            console.log('tree drag over: ', dropNode.label)
        },
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            console.log('tree drag end: ', dropNode && dropNode.label, dropType)
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
            console.log('tree drop: ', dropNode.label, dropType)
        },
        allowDrop(draggingNode, dropNode, type) {
            // 允许drop条件
            // if (dropNode.data.label === '二级 3-1') {
            //     return type !== 'inner'
            // } else {
            //     return true
            // }
            return true
        },
        allowDrag(draggingNode) {
            // return draggingNode.data.label.indexOf('三级 3-2-2') === -1
            return true
        },

        // 后台数据转成可用tree数组1
        /**
         *
         * @params {array} list 要转数组
         * @params {string} pre_idx 前缀
         */
        toTreeArray(list, pre_idx = '') {
            return Object.keys(list).map((key, lev1_idx) => {
                let item = {
                    id: pre_idx + lev1_idx,
                    label: list[key].label
                }
                if (list[key].child) {
                    item.children = this.toTreeArray( list[key].child, item.id + '-' )
                }

                return item
            })
        },
        addSubordinate(row) {
            console.log('row: ', row);

        },
        quoteMsg() {
            console.log('点击引用')
        },
        deleteMsg() {
            console.log('点击删除')
        },
        // rightExpand(index) {
        //     let ele = this.$refs[index]
        //     $(ele).slideToggle(200)
        // }
        getList() {
            let { url, method } = this.$api.menu_all_list
            this.$http({ method, url }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    let menu = res.data
                    console.log('menu: ', menu)
                    this.menu = this.toTreeArray(menu)
                } else {
                    if (res && res.message !== '') {
                        // this.$toast.error(res.message)
                    }
                }
            })
        }
    },
    mounted() {
        // let menu = window.all.menu_list.slice()

        // this.menu = this.toTreeArray(menu)
        this.getList()
        console.log(' this.menu: ', this.menu)
        console.log(' window.all.menu_list: ', window.all.menu_list)
    }
}
</script>

<style scoped>
.total-menu {
    display: flex;
}
.total-menu .tol-left,
.total-menu .tol-center,
.total-menu .tol-right {
    width: 360px;
    border: 1px solid #70a2fd;
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
    line-height: 25px;
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
    position: absolute;
    top: 25px;
    left: 50px;
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
    margin-top: 50px;
}
</style>