<template>
    <div class="container">
        <!-- 厅主充提报表 -->
        <QuickQuery :date="quick_query" @update="qqUpd" />

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>站点名称</span>
                    <Input v-model="filter.platform_name" />
                </li>
                <li>
                    <span>时间</span>
                    <date type="daterange" :disabledDate="['no_after_tomorrow']" v-model="filter.report_day" @update="timeUpdate" />
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-red" @click="clear">清除</button>
                </li>
            </ul>
        </div>

        <div class="table">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <td>{{row.platform_name}}</td>
                    <td>{{tofixedTwo(row.recharge_sum)}}</td>
                    <td>{{tofixedTwo(row.withdraw_sum)}}</td>
                    <td>{{tofixedTwo(row.reduced_sum)}}</td>
                    <td>{{tofixedTwo(row.activity_sum)}}</td>
                    <td>{{tofixedTwo(Number(row.recharge_sum)-Number(row.withdraw_sum)-Number(row.reduced_sum)-Number(row.activity_sum))}}</td>
                    <td>{{row.day}}</td>
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
    name: 'HallDeposit',
    data() {
        return {
            quick_query: [],
            filter: {
                platform_name: '',
                report_day: []
            },
            /* table */
            headers: [
                '站点名称',
                '充值总额',
                '出款总额',
                '优惠总额',
                '活动总额',
                '盈利总额',
                '日期'
            ],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 1
        }
    },
    methods: {
        qqUpd(dates) {
            //同步时间筛选值
            this.filter.report_day = dates
        },
        timeUpdate() {
            //同步快捷查询按钮状态
            this.quick_query = this.filter.report_day
        },
        clear() {
            this.quick_query = []
            this.filter = {
                platform_name: '',
                report_day: []
            }
        },
        tofixedTwo(num){
            if(!num) return 0
            return Number(num).toFixed(2)
        },
        updateNo() {
            this.getList()
        },
        updateSize() {
            this.pageNo = 1
            this.getList()
        },
        getList() {
            let para = {
                platform_name: this.filter.platform_name,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            if(this.filter.report_day[0]&&this.filter.report_day[1]){
                para.report_day = JSON.stringify(this.filter.report_day)
            }
            let data = window.all.tool.rmEmpty(para)

            let { url, method } = this.$api.platform_topup_list
            this.$http({ method, url, data }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
                }
            })
        }
    },
    mounted() {
        this.getList()
    }
}
</script> 

<style scoped>
.filter-row2 {
    padding-left: 10px;
    padding-bottom: 10px;
}
.table {
    margin-top: 20px;
}
</style>