<template>
    <div class="container">
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>活动名称</span>
                    <Input class="w100" v-model="filter.name" />
                </li>
                <li>
                    <span>活动状态</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue">查找</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.a1}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td :class="['bold',row.a2==='1'?'green':'red']">{{row.a2}}</td>
                    <td>
                        <!-- <button class="btns-red">禁用</button> -->
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
    </div>
</template> <script>
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
            list: [
                {
                    a1: '64646466??',
                    a2: 'sdfsdfdsf',
                    a3: '充支好礼',
                    a4: '1',
                    a5: '2019-02-02 21:30'
                },
                {
                    a1: '64646466',
                    a2: 'sdfsdfdsf',
                    a3: '充支好礼',
                    a4: '1',
                    a5: '2019-02-02 21:30'
                }
            ],
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
                this.mod_cont = '是否确定禁用该通道名称'
            } else {
                this.mod_title = '启用'
                this.mod_cont = '是否确定启用该通道名称'
            }
        },
        updateNo() {
            this.getList()
        },
        updateSize() {
            this.pageNo = 1
            this.getList()
        }
    },
    mounted() {}
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