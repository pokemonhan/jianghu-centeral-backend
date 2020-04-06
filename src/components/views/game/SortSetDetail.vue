<template>
    <div class="content">
        <el-tree
            :data="menuList"
            node-key="sign"
            default-expand-all
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDraghandleDragEndOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
        ></el-tree>
    </div>
</template>
<script>
import { Tree } from 'element-ui'

export default {
    components: {
        [Tree.name]: Tree
    },
    props: {
        menu: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            start_node: {},
            end_node: {},
            menuList: []
            // data:
        }
    },
    methods: {
        handleDragStart(node, ev) {
            // console.log('drag start', node)
            this.start_node = node
        },
        handleDragEnter(draggingNode, dropNode, ev) {
            // console.log('tree drag enter: ', dropNode.label)
        },
        handleDragLeave(draggingNode, dropNode, ev) {
            // console.log('tree drag leave: ', dropNode.label)
        },
        handleDragOver(draggingNode, dropNode, ev) {
            // console.log('tree drag over: ', dropNode.label)
        },
        handleDraghandleDragEndOver() {},
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            // console.log('tree drag end: ', dropNode && dropNode.label, dropType)
            this.sortConfirm(this.start_node, dropNode, dropType)
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
            // console.log('tree drop: ', dropNode.label, dropType)
        },
        allowDrop(draggingNode, dropNode, type) {
            let dropging = draggingNode.data // 正在拖拽的节点
            let drop = dropNode.data // 放置的节点
            if (!dropging || !drop) return
            // 没有父级id就是父级（目前只有两级）
            let dropgingIsParent = !dropging.parent_id
            let dropIsParent = !drop.parent_id

            // 只允许同级拖拽
            // 如果是inner 就加一级
            // 如果是某个子菜单
            let inner = type === 'inner' ? 1 : 0 // 如果是inner层级 +1
            let dropgingLevel = dropgingIsParent ? 0 : 1

            let droptLevel = !dropIsParent + inner
            // 如果层级 不同不可放置
            if (dropgingLevel !== droptLevel) {
                return false
            }
            // 父id不同不可 放置
            // if (dropging.parent_id !== drop.parent_id) {
            //     return false
            // }
            return true
        },
        allowDrag(draggingNode) {
            return true
        },
        // 提交数据
        /**
         * @param {object} start 开始拖拽的节点
         * @param {object} end  拖拽结束的节点（放置的节点）
         */
        sortConfirm(start_node, dropNode, type) {
            if (!start_node || !dropNode) return

            let start = start_node.data
            let end = dropNode.data
            // 如果id相同，1.跨级相同，不发送，2.同级相同（位置没变） 不发送
            // if (start.id === end.id) return
            // 跨级不发送
            // if(type==='inner') return
            // let data = this.menuList
            let model_type = end.parent_id ? 2 : 1
            let sort = []
            // 如果是父级级菜单
            if (model_type === 1) {
                sort = this.menuList.map((item, index) => {
                    return {
                        sort: item.sort,
                        key: item.id
                    }
                })
                // 如果是子集
            } else {
                this.menuList.forEach(item => {
                    console.log('父级item: ', item);
                    if (item.children) {
                        item.children.forEach(child => {
                            sort.push({
                                sort: child.sort,
                                key: child.id,
                                parent_id: item.id,
                                label:child.label
                            })
                        })
                    }
                })
            }
            let data = {
                sort: sort,
                // 1 游戏父级分类  2 游戏子分类
                model_type: model_type
            }
            let { url, method } = this.$api.pub_sort_set
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)

                    // 刷新菜单
                    this.$emit('refreshMenu')
                }
            })
        },
        setMenu() {
            let arr = JSON.parse(JSON.stringify(this.menu))
            this.menuList = arr.map(item => {
                item.label = item.name
                if (item.children) {
                    item.children = item.children.map(item => {
                        item.label = item.name
                        return item
                    })
                }
                return item
            })
            this.menuList = this.menuList.slice()
        }
    },
    watch: {
        menu(menu) {
            this.setMenu()
        }
    },
    mounted() {
        this.setMenu()
        // console.log('this.menu: ', this.menu)
    }
}
</script>

<style scoped>
</style>