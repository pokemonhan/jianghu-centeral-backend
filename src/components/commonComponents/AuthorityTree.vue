<template>
    <div>
        <!-- 展示tab [x] -->
        <div class="show-selected" @click="openTree">
            <span class="sel-item" v-for="(item, index) in tab_list" :key="index" @click.stop>
                <span>{{item.label}}</span>
                <i class="iconfont iconcuowuguanbi-" @click.stop="tabClose(item)"></i>
            </span>
        </div>

        <!-- 树 -->
        <div v-show="tree_show" ref="tree" class="drop-list" v-clickoutside="closeTree">
            <Tree style="width:fit-content" :list="tree_list" @change="treeUpd" />
        </div>
    </div>
</template>


<script>
import Tree from '../commonComponents/Tree'
export default {
    name: 'AuthorityTree',
    components: {
        Tree: Tree
    },
    props: {},
    data() {
        return {
            tree_show: true,
            tab_list: [],
            tree_list: []
        }
    },
    methods: {
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

            this.getTabList()
            this.isChildSelAll()
        },

        // tree 点击更新时
        treeUpd(bool, index, list) {
            // console.log('index: ', index);
            // console.log('外部获取里面反馈: ', list);
            // 重新赋值让其能检测到
            this.tree_list = list.map(item => item)
            // console.log('this.tree_list: ', this.tree_list);
            this.getTabList()
        },

        // 返回已选中权限数组 （有[x]的tab框子）
        getTabList() {
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

            this.tab_list = tem_arr
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
        // 关闭 tree 下拉内容
        closeTree() {
            if (!this.tree_show) return
            this.tree_show = false
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
            // this.getTabList()
        }
    },
    mounted() {
        // this.getTreeList()
    }
}
</script>

<style scoped>
/* 选择组权限 */
.show-selected {
    /* display: flex; */
    /* flex-wrap: wrap; */
    width: 100%;
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
</style>
