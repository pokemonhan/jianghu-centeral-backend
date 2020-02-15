<template>
    <div class="container">
        <div class="filter p10">
            <ul class="left">
              
                <li>
                    <!-- <button class="btn-blue">查找</button> -->
                    <button class="btn-blue" @click="addsort">创建分组</button>
                </li>
            </ul>
        </div>
        <div class="cont">
            <div class="cont-left">
                <ul>
                    <li v-for="(group,index) in group_list" :key="index">
                        <div class="li-left">
                            <p class="li-hd">
                                <span @click="check(group)">{{group.group_name}}</span>
                            </p>
                            <span>{{group.id!==1?group.created_at:''}}</span>
                        </div>

                        <div class="li-right">
                            <span v-if="group.id!==1" class="a" @click="del(group)">删除</span>
                            <span v-if="group.id!==1" class="a" @click="edit(group)">编辑</span>
                        </div>
                    </li>
                </ul>
                <div class="vertical-line"></div>
            </div>
            <!-- 右边的 页面 -->
            <div class="cont-right">
                <div class="edit-form">
                    <div>
                        <span
                            class="cont-r-hd"
                        >{{right_show==='add'?'创建组':right_show==='check'?'查看组':right_show==='edit'?'编辑组':right_show}}</span>
                    </div>
                    <div class="edit-name">
                        <p class="mb10">组名称:</p>
                        <Input style="width:300px;" v-model="form.group_name" />
                        <span v-show="!form.group_name" class="err-tips">组名称不可为空</span>
                    </div>
                    <div class="edit-authority">
                        <p class="mb10">选择组权限:</p>
                        <div class="show-selected" @click="openTree">
                            <span
                                class="sel-item"
                                v-for="(item, index) in authority_list"
                                :key="index"
                                @click.stop
                            >
                                <span>{{item.label}}</span>
                                <i class="iconfont iconcuowuguanbi-" @click.stop="tabClose(item)"></i>
                            </span>
                        </div>
                        <!-- v-clickoutside="closeTree" -->
                        <div
                            v-show="tree_show"
                            ref="tree"
                            class="drop-list"
                            v-clickoutside="closeTree"
                        >
                            <Tree style="width:fit-content" :list.sync="tree_list" @change="treeUpd" />
                        </div>
                    </div>

                    <div v-if="!(curr_group.id===1 &&right_show!=='add')" class="mt50 t-center">
                        <button class="btn-plain-large" @click="cancel">取消</button>

                        <button
                            v-if="right_show==='add'"
                            class="btn-blue-large ml30"
                            @click="groupAddCfm"
                        >确定创建</button>

                        <button
                            v-if="right_show==='edit'"
                            class="btn-blue-large ml30"
                            @click="groupSetCfm"
                        >确定修改</button>

                        <button
                            v-if="right_show==='check'"
                            class="btn-blue-large ml30"
                            @click="groupSetCfm"
                        >确定</button>
                    </div>
                </div>
                <!-- 查看check之下面内容 -->
                <div v-if="right_show==='check'" class="mt20">
                    <!-- table 内容 -->
                    <div class="table">
                        <AdminTable :group_id="admin_id" />
                    </div>
                </div>
            </div>
        </div>

        <Modal :show.sync="mod_show" :title="mod_title" :content="mod_cont" @confirm="modConf"></Modal>
    </div>
</template> <script>
import Tree from '../../commonComponents/Tree'
import AdminTable from './AdminSortDir/AdminTable'
export default {
    components: {
        Tree: Tree,
        AdminTable: AdminTable
    },
    data() {
        return {
            right_show: 'add', // 默认右侧为添加组
            // filter: {
            //     group: ''
            // },
            group_list: [], // 展示列表
            form: {
                group_name: ''
            },
            tree_list: [],
            authority_list: [],
            tree_show: false,

            // table
            admin_id: '',

            // dia_show: '',

            // dia_title: '',
            // /* 添加成员 */
            // add_member_form: {
            //     acc: '',
            //     email: '',
            //     pwd: '',
            //     cfm_pwd: ''
            // },
            // // 修改密码
            // edit_member_form: {
            //     pwd: '',
            //     cfm_pwd: ''
            // },
            // 启用 禁用modal
            mod_show: false,
            curr_group: {},
            mod_status: '',
            mod_title: '',
            mod_cont: ''
        }
    },
    computed: {},
    methods: {
        // 初始化tree 使其无选中项
        initTree(tree) {
            let arr = tree.map(item => {
                item.checked = false
                if (item.child) {
                    item.child = this.initTree(item.child)
                }
                return item
            })
            return arr
        },

        // 初始化mod 内容
        initMod() {
            this.mod_show = false
            this.curr_group = {}
            this.mod_status = ''
            this.mod_title = ''
            this.mod_cont = ''
        },

        // 根据group 展示勾选 tree中此项
        treeSelectShow(group) {
            // 当前权限数组
            let authority_arr = group.detail.map(item => item.menu_id)
            // console.log('authority_arr: ', authority_arr);

            // id 是否在选择项数组中
            let isSelect = function(id) {
                return authority_arr.indexOf(id) !== -1
                return false
            }

            let listSetCheked = function(arr) {
                let list = arr.map(item => {
                    item.checked = isSelect(item.id)
                    item.child && listSetCheked(item.child)
                    return item
                })
                return list
            }

            this.tree_list = listSetCheked(this.tree_list)
            this.getAuthorityList()
            this.isChildSelAll()
        },

        // 创建按钮
        addsort() {
            this.right_show = 'add'
            this.form.group_name = ''
            this.initTree(this.tree_list)
            this.getAuthorityList()
        },

        // 查看其中一组
        check(group) {
            this.right_show = 'check'
            this.curr_group = Object.assign({}, group)

            this.form.group_name = group.group_name
            this.admin_id = group.id
            this.treeSelectShow(group)
        },

        // 删除分组列表 按钮
        del(group) {
            this.mod_show = true
            this.curr_group = group // 存储当前点击的组
            this.mod_status = 'del'
            this.mod_title = '删除'
            this.mod_cont = '是否确认删除该分组！'
        },
        edit(group) {
            this.right_show = 'edit'
            this.curr_group = group // 存储当前点击的组
            this.form.group_name = group.group_name
            this.treeSelectShow(group)
        },

        // 后台res 转化为 tree 数组
        resToTree(list) {
            let arr = []
            arr = Object.keys(list).map(key => {
                let item = {}

                item.label = list[key].label
                item.id = list[key].id
                item.checked = false
                if (list[key].child) {
                    item.child = this.resToTree(list[key].child)
                }
                return item
            })
            return arr
        },

        // 获取后台所有权限树
        getTreeList() {
            // this.tree_list = JSON.parse(JSON.stringify(window.all.menu_list))
            // console.log('想要的tree_list: ', this.tree_list);
            // this.tree_list.forEach((item, index) => {
            //     item.id = index
            // })
            let self = this
            let { url, method } = this.$api.menu_all_list
            this.$http({
                method: method,
                url: url
            }).then(res => {
                // console.log('所有权限树: ', res)
                if (res && res.code === '200') {
                    self.total = res.data.total
                    self.tree_list = this.resToTree(res.data)
                }
            })
        },

        // 返回已选中权限数组 （有[x]的tab框子）
        getAuthorityList() {
            let tem_arr = []

            let getCheckedArr = function(arr) {
                arr.forEach(item => {
                    if (!item.child) {
                        // 没有子项，且选中，放入 tem_arr中，方便展示
                        item.checked &&
                            tem_arr.push({ label: item.label, id: item.id })
                    } else {
                        item.child && getCheckedArr(item.child)
                    }
                })
            }
            getCheckedArr(this.tree_list)

            this.authority_list = tem_arr
        },

        // 关闭 tree 下拉内容
        closeTree() {
            if (!this.tree_show) return
            this.tree_show = false

        },

        // tree 点击更新时
        treeUpd(bool, index, list) {
            // console.log('index: ', index);
            // console.log('外部获取里面反馈: ', list);
            // 重新赋值让其能检测到
            this.tree_list = list.slice()
            // console.log('this.tree_list: ', this.tree_list);
            this.getAuthorityList()
        },


        // 子集全选,则父级选中 。
        isChildSelAll() {
            let isSelectAll = function(arr) {
                arr.forEach(item => {
                    if (item.child) {
                        item.checked = item.child.every(item => item.checked)
                        isSelectAll(item.child)
                    }
                })
            }
            isSelectAll(this.tree_list)
            this.tree_list = this.tree_list.slice()
        },
        // 点击组权限框, 下拉打开 tree
        openTree() {
            if (!this.tree_show) {
                setTimeout(() => {
                    this.tree_show = true
                    $(this.$refs.tree).slideDown(200)
                }, 0)
            }
        },
        // 关闭 tab 框(点击tab里那个[x]时触发..)
        tabClose(sel_item) {

            this.tree_list = this.tree_list.map((item, index) => {
                if (item.child) {
                    item.child.forEach((child_item, child_index) => {
                        if (child_item.id === sel_item.id) {
                            child_item.checked = false
                        }
                    })
                }
                if (item.id === sel_item.id) {
                    item.checked = false
                }
                return item
            })

            this.getAuthorityList()
            this.isChildSelAll()
        },
        cancel() {
            let group = Object.assign({}, this.curr_group)
            this.form.group_name = group.group_name
            this.admin_id = group.id
            this.treeSelectShow(group)
        },
        // 创建分组 ——确认
        groupAddCfm() {
            if (this.form.group_name === '') {
                return this.$toast.error('组名称不可以为空！')
            }

            let role = this.authority_list.map(item => {
                return item.id
            })
            let data = {
                group_name: this.form.group_name,
                role: '[' + role.join(',') + ']'
            }

            let { url, method } = this.$api.admin_class_add
            let self = this
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.getGroupList() // 刷新分组列表
                } else {
                    // self.$toast.error(res.message)
                }
            })
        },

        //  编辑 确认, 查看确认
        groupSetCfm() {
            if (this.form.group_name === '') {
                return this.$toast.error('组名称不可以为空！')
            }

            let role = this.authority_list.map(item => {
                return item.id
            })
            let data = {
                id: this.curr_group.id,
                group_name: this.form.group_name,
                role: '[' + role.join(',') + ']'
            }
            let { method, url } = this.$api.admin_class_set
            this.$http({ method, url, data }).then(res => {
                console.log(res)
                if (res.code === '200') {
                    this.$toast.success(res.message)
                }
                this.getGroupList() // 刷新分组列表
            })
        },

        // 确认禁用,确认启用, 确认删除
        modConf() {
            // console.log('mod_确认');
            let group = this.curr_group
            switch (this.mod_status) {
                case 'del':
                    this.delGroup(group)
                    break

                // default:
                //     break;
            }
        },

        // 删除群组
        delGroup(group) {
            console.log('group: ', group)
            let data = {
                id: group.id,
                group_name: group.group_name
            }
            let { method, url } = this.$api.admin_class_del
            this.$http({ method, url, data }).then(res => {
                if (res.code === '200') {
                    this.$toast.success(res.message)
                    this.initMod()
                    this.getGroupList()
                }
            })
        },

        // 获取群组列表 (左侧的列表)
        getGroupList() {
            let { url, method } = this.$api.admin_class_list

            this.$http({ method, url }).then(res => {
                // console.log('res: ', res)
                if (res && res.code === '200') {
                    this.group_list = res.data
                }
            })
        }
    },
    mounted() {
        this.getGroupList()
        this.getTreeList()
    }
}
</script>

<style scoped>

.cont {
    display: flex;
    margin-top: 20px;
}
.cont-left {
    display: flex;
    /* todo */
    margin-left: 40px;
}
.cont .cont-left li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 300px;
    height: 50px;
    padding: 10px;
}
.cont-left li:nth-child(2n) {
    background: #e5f7ff;
}
.cont-left li:nth-child(2n-1) {
    background: #f9fbfc;
}
.cont .li-left .li-hd span {
    font-size: 16px;
    font-weight: bold;
    color: #4c8bfd;
    cursor: pointer;
}
.cont .li-left .li-hd span:active {
    color: red;
}
.vertical-line {
    width: 1px;
    height: 100%;
    margin-left: 50px;
    margin-right: 50px;
    background: #ededed;
}
.edit-form {
    width: 550px;
}
.err-tips {
    font-size: 12px;
    margin-left: 10px;
    color: red;
}
.cont-r-hd {
    font-size: 16px;
    font-weight: bold;
    color: #4c8bfd;
    border-bottom: 2px solid #4c8bfd;
}
.mt25 {
    margin-top: 25px;
}
.mb10 {
    margin-bottom: 10px;
}
.edit-name {
    /* width: 300px; */
    margin-top: 25px;
}
.edit-authority {
    margin-top: 20px;
}
/* 选择组权限 */
.show-selected {
    /* display: flex; */
    /* flex-wrap: wrap; */
    min-height: 165px;
    border: 1px solid #d9ecff;
    padding: 0 10px 10px 0;
    border-radius: 5px;
}

.sel-item {
    display: inline-block;
    margin-left: 10px;
    margin-top: 10px;
    padding: 3px 10px;

    font-size: 12px;
    color: #409eff;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    background-color: #ecf5ff;
}
.iconcuowuguanbi- {
    width: 12px;
    vertical-align: middle;
    cursor: pointer;
    transform: scale(1);
}
.iconcuowuguanbi-:hover {
    color: red;
}
/* 选择组 下拉list */
.drop-list {
    margin-top: 10px;
    padding-top: 10px;
    padding-left: 50px;
    border: 1px solid #d9ecff;
    border-radius: 4px;
}
/* 编辑组 确定取消 */
.mt50 {
    margin-top: 30px;
}
.t-center {
    text-align: center;
}
.ml30 {
    margin-left: 30px;
}

.mt20 {
    margin-top: 20px;
}
/* table 内容*/
.table {
    margin-top: 20px;
}
</style>