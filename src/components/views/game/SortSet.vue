<template>
    <div class="container">
        <!---------------------- 分类设置 -------------------->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>分类名称</span>
                    <Input class="w100" v-model="filter.name" />
                </li>
                <li>
                    <span>分类状态</span>
                    <Select v-model="filter.status" :options="sort_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <!-- ['编号','分类名称','分类状态','最后更新人','最后跟新时间','操作'] -->
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.name}}</td>
                    <td >
                        <span :class="[row.status===1?'green':'red']">{{row.status===1?'开启':'关闭'}}</span>
                    </td>
                    <td>{{row.last_editor?row.last_editor.name:'---'}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>
                        <span class="a" @click="opera(row)">{{row.status=== 1 ?'启用':row.status=== 0 ?'禁用':row.status}}</span>
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
        <Modal :show.sync="mod_show" :title="mod_title" :content="mod_cont"  @confirm="modConf"></Modal>
    </div>
</template> <script>
export default {
    data() {
        return {
            filter: {
                name: '',
                status: ''
            },
            sort_opt: [
                { label: '全部', value: '' },
                { label: '关闭', value: 0 },
                { label: '启用', value: 1 }
            ],

            headers: [
                '编号',
                '分类名称',
                '分类状态',
                '最后更新人',
                '最后跟新时间',
                '操作'
            ],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25,
            // 确认框
            mod_show: false,
            mod_title: '1',
            mod_cont: '',
            curr_row: {}
        }
    },
    methods: {
        updateNo(val) {},
        updateSize(val) {},
        getList() {
            let para = {
                name: this.filter.name,
                status: this.filter.status,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.game_sort_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
                } else {
                    if (res && res.message !== '') {
                        self.$toast.error(res.message)
                    }
                }
            })
        },
        opera(row) {
            this.curr_row = row
            if(row.status===1){
                this.mod_title = '禁用'
                this.mod_cont = '是否确定禁用该游戏分类？'
            }else {
                this.mod_title = '启用'
                this.mod_cont = '是否确定启用该游戏分类？'
            }
            this.mod_show = true
        },
        modConf(){
            let {id, status} = this.curr_row
            let params = {
                id: id,
                status: status===1? 0 : 1
            }
            let { url, method } = this.$api.game_sort_status_set
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.mod_show = false
                    this.getList()
                } else {
                    if (res && res.message !== '') {
                        this.$toast.error(res.message)
                    }
                }
            })
        }
    },
    mounted() {
        this.getList()
    }
}
</script> <style scoped>
.w100 {
    width: 100px;
}
.p10 {
    padding: 10px;
}
.mt20 {
    margin-top: 20px;
}
</style>