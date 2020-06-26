<template>
    <div class="container">
        <div class="filter p10">
            <ul class="left">
                <li>
                    <!-- <button class="btn-blue">查找</button> -->
                    <button class="btn-blue" @click="addsort">创建分组</button>
                </li>
                <li>
                    <Input class="filter-input ml50" v-model="filter.searchStr" @enter="search" />
                    <button class="btn-blue" @click="search">搜索</button>
                </li>
            </ul>
        </div>
        <div class="cont">
            <div class="cont-left">
                <ul>
                    <li
                        :class="[searchGroup.indexOf(group.id)>-1?'had-search':'',form.id===group.id?'curr-group':'']"
                        v-for="(group,index) in group_list"
                        :key="index"
                    >
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

            <!--------- 右边的 页面 ---------->
            <div class="cont-center">
                <div class="edit-form">
                    <div>
                        <span
                            class="cont-r-hd"
                        >{{right_show==='add'?'创建组':right_show==='check'?'查看组':right_show==='edit'?'编辑组':right_show}}</span>
                    </div>
                    <div class="edit-name">
                        <p class="mb10">组名称:</p>
                        <Input
                            style="width:300px;"
                            :disabled="form.id===1"
                            v-model="form.group_name"
                        />
                        <span v-show="!form.group_name" class="err-tips">组名称不可为空</span>
                    </div>
                    <!-- 测试 -->
                    <!-- <div>
                        {{form.tagList}}
                    </div>-->
                    <div class="edit-authority">
                        <p class="mb10">选择组权限:</p>
                        <div class="flex" v-clickoutside="treeClickOut">
                            <AuthorityList
                                class="author-left"
                                :menutree="tree_list"
                                :disabled="form.id===1"
                                :rightShow.sync="tree_select_show"
                                v-model="form.tagList"
                                @update="treeUpd"
                            />
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
                <!-- 中间竖线 -->
                <div class="vertical-line"></div>
                <!-- 查看check之下面内容 -->
            </div>
            <div class="cont-right">
                <div v-if="right_show==='check'" class="mt20">
                    <!-- table 内容 -->
                    <div class="table">
                        <AdminTable ref="adminTable" :group_id="admin_id" @search="search" />
                    </div>
                </div>
            </div>
        </div>

        <Modal :show.sync="mod_show" :title="mod_title" :content="mod_cont" @confirm="modConf"></Modal>
    </div>
</template> <script>
import Tree from '../../commonComponents/Tree'
import AdminTable from './AdminSortDir/AdminTable'
import AuthorityTree from '../../commonComponents/AuthorityTree'
import AuthorityList from '../../commonComponents/AuthorityList'
export default {
    name: 'AdminSort',
    components: {
        Tree: Tree,
        AdminTable: AdminTable,
        AuthorityTree: AuthorityTree,
        AuthorityList
    },
    data() {
        return {
            right_show: 'add', // 默认右侧为添加组
            filter: {
                searchStr: ''
            },
            searchGroup: [],
            treeShow: false,
            group_list: [], // 展示列表
            form: {
                group_name: '',
                tagList: []
            },
            tree_list: [],
            tree_select_show: false,
            // authority_list: [],
            tree_show: false,

            // table
            admin_id: '', // 展示成员table所需要的id

            // 启用 禁用modal
            mod_show: false,
            curr_group: {},
            last_group: {},
            last_group_index: 0,
            mod_status: '',
            mod_title: '',
            mod_cont: ''

            // 以下测试
            // tagList: []
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
            // this.last_group = {}
            this.mod_status = ''
            this.mod_title = ''
            this.mod_cont = ''
        },

        search() {
            if (!this.filter.searchStr) return
            let data = {
                searchStr: this.filter.searchStr
            }

            let { url, method } = this.$api.search_admin_list
            this.$http({ method, url, data }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    // console.log('res: ', res);

                    this.searchGroup = (res.data || []).map(
                        item => item.group_id
                    ) // 管理员所在的分组

                    // 展示搜索结果中,第一个的名字,权限,id
                    let firstGroup = this.group_list.find(item => {
                        return item.id === this.searchGroup[0]
                    })
                    if (firstGroup) {
                        this.form.group_name = firstGroup.group_name
                        this.form.id = firstGroup.id
                        this.form.tagList = firstGroup.detail.map(
                            item => item.menu_id
                        )
                    }

                    this.$refs.adminTable.setList(res.data, res.data.length)
                    // console.log('adminTable: ', adminTable);
                    // this.$toast.success(res && res.message)
                }
            })
        },
        treeClickOut() {
            this.treeShow = false
        },
        treeLeftClick(e) {
            // e.stopPropagation();
            // if(!this.treeShow) {
            //     this.treeShow = true
            // }
        },
        // 根据group 展示勾选 tree中此项
        // treeSelectShow(group) {
        //     return
        //     // 当前权限数组
        //     let authority_arr = group.detail.map(item => item.menu_id)
        //     // id 是否在选择项数组中
        //     let isSelect = function(id) {
        //         return authority_arr.indexOf(id) !== -1
        //     }

        //     function listSetCheked(arr, lev) {
        //         let list = arr.map(item => {
        //             // 一级菜单
        //             if (lev === 1 && item.child) {
        //                 listSetCheked(item.child)
        //                 item.checked = item.child.every(i => i.checked)
        //             } else {
        //                 item.checked = isSelect(item.id,lev+1)
        //             }
        //             return item
        //         })
        //         return list
        //     }

        //     this.tree_list = listSetCheked(this.tree_list, 1)
        //     // this.getAuthorityList()
        //     // this.isChildSelAll()
        // },

        // 创建按钮
        addsort() {
            this.right_show = 'add'
            this.form.group_name = ''
            this.form.id = ''
            this.form.tagList = []
            this.tree_list = this.initTree(this.tree_list)
            this.tree_select_show = true
            // this.getAuthorityList()
        },

        // 查看其中一组
        check(group) {
            if (!group) return
            // console.log('group: ', group);
            this.searchGroup = []
            this.right_show = 'check'
            this.curr_group = Object.assign({}, group)
            this.last_group = Object.assign({}, group)
            this.form.group_name = group.group_name
            this.form.id = group.id
            this.admin_id = group.id

            this.form.tagList = (group.detail || []).map(item => item.menu_id)
            // this.treeSelectShow(group)
            this.tree_select_show = false
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
            this.last_group = group // 最后次点击的组
            this.form.group_name = group.group_name
            // this.treeSelectShow(group)
            this.tree_select_show = true
        },

        // ,

        // 获取后台所有权限树
        getTreeList() {
            // 后台res 转化为 tree 数组
            function resToTree(list) {
                return Object.keys(list).map(key => {
                    let item = {}
                    item.label = list[key].label
                    item.id = list[key].id
                    item.checked = false
                    if (list[key].child) {
                        item.child = resToTree(list[key].child)
                    }
                    return item
                })
            }
            let { url, method } = this.$api.menu_all_list
            this.$http({ method, url }).then(res => {
                // console.log('所有权限树: ', res)
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.tree_list = resToTree(res.data)
                    if (Object.keys(this.curr_group).length) {
                        // this.treeSelectShow(this.curr_group)
                    }
                }
            })
        },
        // treeListUpd(val) {},

        // 同步设置 已选中【权限】数组 （有[x]的tab框子数组） 例如: [1,2,3] :首页内容,厂商管理 ...
        setTagList() {
            let tabShowList = []
            function getCheckedArr(arr) {
                arr.forEach(item => {
                    if (!item.child) {
                        // 没有子项，就是路由,当选中，放入 tabShowList中，方便展示
                        // 全域没有子项
                        item.checked && tabShowList.push(item.id)
                    } else {
                        item.child && getCheckedArr(item.child)
                    }
                })
                return arr
            }
            getCheckedArr(this.tree_list)
            this.form.tagList = tabShowList
        },
        // 树左边 ，树右边更新
        treeUpd() {
            // 更新 权限 数组
            // this.setTagList()
        },
        cancel() {
            if (this.right_show === 'add') {
                this.form.group_name = ''
                this.form.id = ''
                this.form.tagList = []
                this.tree_list = this.initTree(this.tree_list)
          
            } else {
                let group = Object.assign({}, this.last_group)
                this.check(group)
            }
        },
        // 创建分组 ——确认
        groupAddCfm() {
            if (this.form.group_name === '') {
                return this.$toast.error('组名称不可以为空！')
            }

            let data = {
                group_name: this.form.group_name,
                role: JSON.stringify(this.form.tagList || [])
            }

            let { url, method } = this.$api.admin_class_add
            let self = this
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.getGroupList() // 刷新分组列表
                }
            })
        },

        //  编辑 确认, 查看确认
        groupSetCfm() {
            if (this.form.group_name === '') {
                return this.$toast.error('组名称不可以为空！')
            }

            let data = {
                id: this.curr_group.id,
                group_name: this.form.group_name,
                role: JSON.stringify(this.form.tagList || [])
            }
            let { method, url } = this.$api.admin_class_set
            this.$http({ method, url, data }).then(res => {
                // console.log(res)
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
                // console.log('进来');
                if (res && res.code === '200') {
                    this.group_list = res.data
                    // this.last_group = this.group_list && this.group_list[0]
                    if (this.right_show === 'add') {
                        let last = this.group_list[this.group_list.length - 1]
                        if (last) {
                            this.check(last)
                        }
                    } else if (this.right_show === 'edit'||this.right_show === 'check') {
                        if (this.admin_id) {
                            // console.log('🍾 this.admin_id: ', this.admin_id);
                            let group = this.group_list.find(
                                item => item.id === this.admin_id
                            )
                            if (group) {
                                this.check(group)
                            }
                        }
                    } else if (this.right_show === 'del') {
                        this.check(this.group_list[0])
                    }
                }
            })
        },
        // 初次进去展示check 页面
        firstView() {
            let { url, method } = this.$api.admin_class_list

            this.$http({ method, url }).then(res => {
                // console.log('res: ', res)
                if (res && res.code === '200') {
                    this.group_list = res.data
                    this.group_list &&
                        this.$nextTick(() => {
                            let self = this
                            // setTimeout(()=>{
                            self.check(self.group_list[0])
                            // },1000)
                        })
                }
            })
        }
    },
    mounted() {
        // this.getGroupList()
        this.firstView()
        this.getTreeList()
    }
}
</script>

<style scoped>
.tree-slide-leave-active,
.tree-slide-enter-active {
    transition: all 0.3s;
}

.tree-slide-enter,
.tree-slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.cont {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
}
.cont-left {
    display: flex;
    margin-left: 40px;
    margin-bottom: 30px;
}
.filter-input {
    width: 15em;
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
    background: #f6fcff;
}
.cont-left li:nth-child(2n-1) {
    background: #f9fbfc;
}
.cont .cont-left .had-search {
    border: 1px solid rgb(195, 250, 240);
    background: rgb(234, 245, 251);
    transition: background-color 0.2s;
}
.cont .cont-left .curr-group {
    border: 1px solid rgb(195, 210, 250);
    background: rgb(234, 245, 251);
    transition: background-color 0.2s;
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
    /* 和左右maring合并 */
    margin-left: 50px;
    margin-right: 50px;
    background: #ededed;
}
/* 中间边的 内容 */
.cont-center {
    display: flex;
    margin-left: 40px;
}
.cont-right {
    margin-left: 40px;
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

/* 选择组 下拉list */
.drop-list {
    margin-top: 10px;
    padding-top: 10px;
    padding-left: 50px;
    border: 1px solid #d9ecff;
    border-radius: 4px;
}
.edit-authority .author-left {
    /* width: 275px; */
    width: 550px;
    min-height: 800px;
}
.check-tree {
    /* width: 275px; */
    padding-left: 20px;
    border: 1px solid #d9ecff;
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

/* .mt20 {
    margin-top: 20px;
} */
/* table 内容*/
.table {
    margin-top: 20px;
}
</style>