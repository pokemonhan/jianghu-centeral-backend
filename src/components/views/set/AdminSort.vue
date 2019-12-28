<template>
    <div class="container">
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>组列表</span>
                    <Input class="w100" v-model="filter.group" />
                </li>
                <li>
                    <button class="btn-blue">查找</button>
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
                            <span v-show="group.id!==1" class="a">删除</span>
                            <span class="a" @click="edit(group)">编辑</span>
                        </div>
                    </li>
                </ul>
                <div class="vertical-line"></div>
            </div>
            <!-- 右边的 页面 -->
            <div class="cont-right">
                <div class="edit-form">
                    <div>
                        <span class="cont-r-hd">{{right_show==='add'?'创建组':right_show==='check'?'查看组':right_show==='edit'?'编辑组':right_show}}</span>
                    </div>
                    <div class="edit-name">
                        <p class="mb10">组名称:</p>
                        <Input
                            style="width:300px;"
                            :disabled="right_show==='check'"
                            v-model="edit_form.name"
                        />
                    </div>
                    <div class="edit-authority">
                        <p class="mb10">选择组权限:</p>
                        <div class="show-selected" @click="openTree">
                            <span
                                class="sel-item"
                                v-for="(item, index) in authority_list"
                                :key="index"
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
                            <Tree style="width:fit-content" :list="tree_list" @change="treeUpd" />
                        </div>
                    </div>
                    <div class="mt50 t-center">
                        <button class="btn-plain-large">取消</button>

                        <button v-if="right_show==='add'"
                            class="btn-blue-large ml30"
                            @click="groupAddCfm"
                        >确定创建</button>

                        <button v-if="right_show==='set'"
                            class="btn-blue-large ml30"
                            @click="groupSetCfm"
                        >确定修改</button>

                        <button v-if="right_show==='check'"
                            class="btn-blue-large ml30"
                            @click="groupSetCfm"
                        >确定</button>
                    </div>
                </div>
                <!-- 查看check之下面内容 -->
                <div v-if="right_show==='check'" class="mt20">
                    <div>
                        <span>成员列表：</span>
                        <span>
                            <button class="btn-blue" @click="addMember">添加成员</button>
                        </span>
                    </div>
                    <div class="table">
                        <Table :headers="headers" :column="list">
                            <template v-slot:item="{row,idx}">
                                <td>{{row.a1}}</td>
                                <td>{{row.a2}}</td>
                                <td
                                    :class="[row.a3==='1'?'green':'red']"
                                >{{row.a3==='1'?'启用':row.a3==='0'?'禁用':'出错'}}</td>
                                <td>
                                    <span class="a" @click="editPwd(row)">修改密码</span>
                                    <span
                                        class="a"
                                        @click="memberStatuUpd(row)"
                                    >{{row.a3==='1'?'禁用':row.a3==='0'?'启用':'出错'}}</span>
                                </td>
                            </template>
                        </Table>

                        <Page
                            class="table-page"
                            :total="total"
                            :pageNo.sync="pageNo"
                            :pageSize.sync="pageSize"
                            @updateNo="updateNo"
                            @updateSize="updateSize"
                        />
                    </div>
                </div>
            </div>
        </div>
        <Dialog :show="dia_show!==''" :title="dia_title" @close="dia_show=''">
            <div class="dia-inner">
                <div v-if="dia_show==='add_member'">
                    <ul class="form">
                        <li>
                            <span>账号:</span>
                            <Input class="w250" v-model="add_member_form.acc" />
                        </li>
                        <li>
                            <span>邮箱:</span>
                            <Input class="w250" v-model="add_member_form.email" />
                        </li>
                        <li>
                            <span>密码:</span>
                            <Input class="w250" type="password" v-model="add_member_form.pwd" />
                        </li>
                        <li>
                            <span>确认密码:</span>
                            <Input class="w250" type="password" v-model="add_member_form.conf_pwd" />
                        </li>
                    </ul>
                    <div class="add-member-btn">
                        <button class="btn-plain-large" @click="dia_show=''">取消</button>
                        <button class="btn-blue-large ml20" @click="addMemberCfm">确认</button>
                    </div>
                </div>
                <div v-if="dia_show==='edit_pwd'">
                    <ul class="form">
                        <li>
                            <span>密码:</span>
                            <Input class="w250" type="password" v-model="edit_member_form.pwd" />
                        </li>
                        <li>
                            <span>确认密码:</span>
                            <Input
                                class="w250"
                                type="password"
                                v-model="edit_member_form.conf_pwd"
                            />
                        </li>
                    </ul>
                    <div class="add-member-btn">
                        <button
                            v-if="right_show==='check'"
                            class="btn-plain-large"
                            @click="dia_show=''"
                        >取消</button>
                        <button v-else class="btn-blue-large ml20" @click="editMemberCfm">确认</button>
                    </div>
                </div>
            </div>
        </Dialog>
        <Modal :show.sync="mod_show" :title="mod_title" :content="mod_cont" @confirm="modConf"></Modal>
    </div>
</template> <script>
import Tree from '../../commonComponents/Tree.vue'
export default {
    components: {
        Tree: Tree
    },
    data() {
        return {
            right_show: 'add', // 默认为添加组
            filter: {
                group: ''
            },
            group_list: [],
            edit_form: {
                name: ''
            },
            tree_list: [],
            authority_list: [],
            tree_show: false,
            // table
            headers: ['名称', '邮箱', '状态', '操作'],
            list: [
                {
                    a1: 'admin',
                    a2: 'admin@qq.com',
                    a3: '1',
                    a4: '1',
                    a5: '2019-02-02 21:30'
                },
                {
                    a1: '64646466',
                    a2: 'sdfsdfdsf',
                    a3: '0',
                    a4: '1',
                    a5: '2019-02-02 21:30'
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 25,
            dia_show: '',
            dia_title: '',
            /* 添加成员 */
            add_member_form: {
                acc: '',
                email: '',
                pwd: '',
                cfm_pwd: ''
            },
            // 修改密码
            edit_member_form: {
                pwd: '',
                cfm_pwd: ''
            },
            // 启用 禁用modal
            mod_show: false,
            mod_title: '',
            mod_cont: ''
        }
    },
    computed: {},
    methods: {
        addsort() {
            this.right_show = 'add'
        },
        // 查看点击组
        check() {
            this.right_show = 'check'
        },
        edit(group) {
            this.right_show = 'edit'
        },
        // 后台res 转化为 tree 数组
        resToTree(list) {
            return Object.keys(list).map(key => {
                let item = {}

                item.label = list[key].label
                item.id = list[key].id
                if (list[key].child) {
                    item.child = this.resToTree(list[key].child)
                }
                return item
            })
        },
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
                // console.log('res👌: ', res);
                if (res && res.code === '200') {
                    self.total = res.data.total
                    self.tree_list = this.resToTree(res.data)
                } else {
                    if (res && res.message !== '') {
                        self.toast.error(res.message)
                    }
                }
            })
        },
        getAuthorityList() {
            let list = this.tree_list
            // list.forEach(item=>{
            //     item.checked = Boolean(item.checked)
            //     if(item.child){
            //         console.log('item child',item.child)
            //         item.child.forEach(element => {
            //             console.log('element元素: ', element);
            //             element.checked = true
            //         });
            //     }
            // })
            console.log('list: ', list)
            let arr = []
            list.forEach(item => {
                if (item.child) {
                    item.child.forEach(child_item => {
                        if (child_item.checked) {
                            arr.push({
                                label: child_item.label,
                                id: child_item.id
                            })
                        }
                    })
                }
                if (item.path === '/home' && item.checked) {
                    arr.push({
                        label: item.label,
                        id: item.id
                    })
                }
            })
            this.authority_list = arr
        },
        // 关闭 tree 下拉内容
        closeTree() {
            if (!this.tree_show) return
            this.tree_show = false
        },
        treeUpd(bool, index, list) {
            // console.log('外部获取里面反馈: ', list);
            // 重新赋值让其能检测到
            this.tree_list = list.map(item => item)
            // console.log('外部tree_list更新: ', this.tree_list)
            this.getAuthorityList()
        },
        // 子集全选则 父级选中  ,目前到二级菜单。。
        isChildSelAll(list) {
            list.forEach((lev1, lev1_idx) => {
                if (lev1.child) {
                    lev1.checked = lev1.child.every(item => {
                        // if(item.child){
                        //     item.checked = item.child.every(i => i.checked)
                        // }
                        return item.checked
                    })
                }
                // return lev1
            })
            this.list = this.list.concat()
        },
        // 打开tree 下拉表
        openTree() {
            if (this.tree_show) {
                // this.tree_show = false
            } else {
                let self = this
                setTimeout(() => {
                    this.tree_show = true
                    $(this.$refs.tree).slideDown(200)
                }, 0)
            }
        },
        // 关闭 tab 框(点击tab里那个叉叉时触发..)
        tabClose(sel_item) {
            this.tree_list = this.tree_list.map((item, index) => {
                if (item.child) {
                    item.child.forEach((child_item, child_index) => {
                        if (child_item.label === sel_item.label) {
                            child_item.checked = false
                        }
                    })
                }
                if (sel_item.label === '首页' && sel_item.label === '首页') {
                    item.checked = false
                }
                return item
            })

            this.getAuthorityList()
            this.isChildSelAll(this.tree_list)
        },
        groupAddCfm() {
            let para = {
                name: this.filter.vendor,
                status: this.filter.status,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.admin_class_add
            this.$http({
                method: method,
                url: url,
                data: params
            }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.sucess(res.message)
                } else {
                    this.$toast.error(res.message)
                }
            })
        },
        groupSetCfm() {},
        addMember() {
            this.dia_show = 'add_member'
        },
        // 添加成员确认
        addMemberCfm() {},
        editPwd(row) {
            this.dia_show = 'edit_pwd'
        },
        memberStatuUpd(row) {
            let status = row.a3
            if (status === '1') {
                this.mod_title = '禁用'
                this.mod_cont = '是否确认禁用该成员!'
            } else if (status === '0') {
                this.mod_title = '启用'
                this.mod_cont = '是否确认启用该成员!'
            }
            this.mod_show = true
        },
        editMemberCfm() {},
        // 确认禁用,或确认启用
        modConf() {},
        getGroupList() {
            let para = {}
            // let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.admin_class_list
            this.$http({
                method: method,
                url: url
                // params:params
            }).then(res => {
                if (res && res.code === '200') {
                    this.group_list = res.data
                }
            })
        },
        updateNo(val) {},
        updateSize(val) {}
    },
    mounted() {
        this.getGroupList()
        this.getAuthorityList()
        this.getTreeList()
    }
}
</script>
<style scoped>
.w100 {
    width: 100px;
}
.p10 {
    padding: 10px;
}
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
.form > li {
    display: flex;
    align-items: center;
    margin-top: 10px;
}
.form > li span:first-child {
    width: 70px;
    text-align: right;
    margin-right: 10px;
}
.w250 {
    width: 250px;
}
.add-member-btn {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
.ml20 {
    margin-left: 20px;
}
</style>