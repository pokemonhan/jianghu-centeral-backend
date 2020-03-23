<template>
    <div class="content">
        <el-tree
            :data="menuList"
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
            menuList:[],
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
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            // console.log('tree drag end: ', dropNode && dropNode.label, dropType)
            this.sortConfirm(this.start_node, dropNode, dropType)
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
            // console.log('tree drop: ', dropNode.label, dropType)
        },
        allowDrop(draggingNode, dropNode, type) {
            // console.log('dropNode: ', dropNode);
            // console.log('draggingNode: ', draggingNode);
            // 目前只可以拖到同一层
            // if(draggingNode.level!==dropNode.level ||type==='inner'){

            //     return false
            // }
            return true
        },
        allowDrag(draggingNode) {
            return draggingNode.data.label.indexOf('三级 3-2-2') === -1
        },
        // 提交数据
        /**
         * @param {object} start 开始拖拽的节点
         * @param {object} end  拖拽结束
         */
        sortConfirm(start_node, dropNode, type) {
            if (!start_node || !dropNode) return
            let start = start_node.data
            let end = dropNode.data
            console.log('end: ', end)
            console.log('type: ', type)
            if (start.id === end.id) {
                return
            }

            let data = {
                id: start.id, // 菜单id
                pid: end.pid, // 修改后的上级id,顶级为0
                sort: end.sort, // 修改后的排序
                level: end.level // 修改后的层级
            }
            // 拖进一个菜单
            if (type === 'inner') {
                data.pid = end.id
                data.sort = 1
                data.level = end.level + 1
            } else if (type === 'before') {
            }
            console.log('data: ', data)
            // if (data & (data.level > 3)) {

            //     this.$toast('最多三级菜单')
            // }
            let { url, method } = this.$api.merchant_menu_parent_sort
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)

                    // this.getList()
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