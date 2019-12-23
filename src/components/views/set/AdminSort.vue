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
                    <button class="btn-blue">创建分组</button>
                </li>
            </ul>
        </div>
        <div class="cont">
            <div class="cont-left">
                <ul>
                    <li v-for="n in 6" :key="n">
                        <div class="li-left">
                            <p class="li-hd">
                                <span>超级管理组</span>
                            </p>
                            <span>{{'2019/11/09 19:30:45'}}</span>
                        </div>

                        <div class="li-right">
                            <span v-show="n!==1" class="a">删除</span>
                            <span class="a">编辑</span>
                        </div>
                    </li>
                </ul>
                <div class="vertical-line"></div>
            </div>

            <div class="cont-right">
                <!-- 查看组 -->
                <div></div>
                <!-- 编辑组 -->
                <div class="edit-form">
                    <div>
                        <span class="cont-r-hd">编辑组</span>
                    </div>
                    <div class="edit-name">
                        <p class="mb10">组名称:</p>
                        <Input style="width:300px;" v-model="edit.name" />
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
                        <button class="btn-blue-large ml30">确定创建</button>
                    </div>
                </div>
                <!-- 查看之下面内容 -->
                <div class="mt20">
                    <div>
                        <span>成员列表：</span>
                        <span>
                            <button class="btn-blue">添加成员</button>
                        </span>
                    </div>
                    <div class="table">
                        <Table :headers="headers" :column="list">
                            <template v-slot:item="{row,idx}">
                                <td>{{row.a1}}</td>
                                <td>{{row.a2}}</td>
                                <td :class="[row.a3==='1'?'green':'red']">{{row.a3==='1'?'启用':row.a3==='0'?'禁用':'出错'}}</td>
                                <td>
                                    <span class="a">修改密码</span>
                                    <span class="a">启用</span>
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
    </div>
</template> <script>
import Tree from '../../commonComponents/Tree.vue'
export default {
    components: {
        Tree: Tree
    },
    data() {
        return {
            filter: {
                group: ''
            },
            edit: {
                name: ''
            },
            tree_list: JSON.parse(JSON.stringify(window.all.menu_list)), // 拷贝
            authority_list: [],
            tree_show: false,
            // table
            headers: ['名称','邮箱','状态','操作'],
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
            pageSize: 25
        }
    },
    computed: {},
    methods: {
        getAuthorityList() {
            let list = this.tree_list
            let arr = []
            list.forEach(item => {
                if (item.child) {
                    item.child.forEach(child_item => {
                        if (child_item.checked) {
                            arr.push({
                                label: child_item.label,
                                id: '5'
                            })
                        }
                    })
                }
                if (item.path === '/home' && item.checked) {
                    arr.push({
                        label: item.label,
                        id: '5'
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
            // 重新赋值让其能检测到
            this.tree_list = list.map(item => item)
            this.getAuthorityList()
        },
        // 子集全选则 父级选中  ,目前只二级菜单。。
        isChildSelAll(list) {
            list.forEach((lev1, lev1_idx) => {
                if (lev1.child) {
                    lev1.checked = lev1.child.every(item => item.checked)
                }
                // return lev1
            })
        },
        openTree() {
            if (this.tree_show) {
                // this.tree_show = false
            } else {
                let self = this
                setTimeout(() => {
                    this.tree_show = true
                    // this.$refs.tree
                    console.log('this.$refs.tree: ', self.$refs)
                    $(this.$refs.tree).slideDown(200)
                }, 0)
            }
        },
        // 关闭 tab
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
        updateNo(val) {},
        updateSize(val) {},
    },
    mounted() {}
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
</style>