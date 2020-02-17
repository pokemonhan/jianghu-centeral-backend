<template>
    <div class="container">
        <!------------ 活动列表 ------------->

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>活动名称</span>
                    <Input class="w10rem" v-model="filter.name" />
                </li>
                <li>
                    <span>活动状态</span>
                    <Select class="w10rem" v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList()">查找</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <!-- '编号', '活动名称', '最后更新人', '最后更新时间', '活动状态', '操作'  -->
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.last_editor&&row.last_editor.name}}</td>
                    <td>{{row.updated_at}}</td>
                    <td :class="[row.status?'green':'red']">{{row.status===1?'启用':'禁用'}}</td>
                    <td>
                        <button
                            :class="[row.status?'btns-red':'btns-green']"
                            @click="statusSwitch(row)"
                        >{{row.status===1?'禁用':'启用'}}</button>
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
        <Modal
            :show.sync="mod_show"
            title="状态"
            :content="mod_cont"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filter: {
                name: '',
                status: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '启用', value: '1' },
                { label: '禁用', value: '0' }
            ],
            headers: [
                '编号',
                '活动名称',
                '最后更新人',
                '最后更新时间',
                '活动状态',
                '操作'
            ],
            list: [],
            // dialog 对话框
            mod_show: false,
            mod_cont: '',

            total: 0,
            pageNo: 1,
            pageSize: 25
        }
    },
    methods: {
        statusSwitch(row) {
            this.mod_show = true
            this.curr_row = row
            if (row.status === 1) {
                this.mod_title = '禁用'
                this.mod_cont = '是否确定禁用该活动!'
            } else {
                this.mod_title = '启用'
                this.mod_cont = '是否确定启用该活动!'
            }
        },
        modConf() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status === 1 ? 0 : 1
            }

            let { url, method } = this.$api.active_manage_status_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.getList()
                }
            })
        },
        getList() {
            let para = {
                name: this.filter.name,
                status: this.filter.status,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)

            let { url, method } = this.$api.active_manage_list
            this.$http({ method, url, params }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
                }
            })
        },
        updateNo() {
            this.getList()
        },
        updateSize() {
            this.pageNo = 1
            this.getList()
        }
    },
    mounted() {
        this.getList()
    }
}
</script>

<style scoped>
</style>