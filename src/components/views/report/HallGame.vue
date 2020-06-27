<template>
    <div class="container">
        <!-- 厅主游戏报表 -->
        <QuickQuery :date="quick_query" @update="qqUpd" />

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>站点名称</span>
                    <Input class="w100" v-model="filter.platform_name" />
                </li>
                <li>
                    <span>时间</span>
                    <date type="daterange" v-model="filter.report_day" @update="timeUpdate" />
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-red" @click="clear">清除</button>
                </li>
            </ul>
        </div>

        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <!-- ['站点名称','游戏平台','总投注额','总有效下注','总抽水','总输赢','日期'] -->
                <template v-slot:item="{row}">
                    <td>{{row.platform_name}}</td>
                    <td>{{row.game_vendor_name}}</td>
                    <td>{{tofixedTwo(row.bet_money)}}</td>
                    <td>{{tofixedTwo(row.effective_bet)}}</td>
                    <td>{{tofixedTwo(row.our_net_win)}}</td>
                    <td>{{Number(row.win_money)-Number(row.bet_money)}}</td>
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
    name: 'HallGame',
    data() {
        return {
            quick_query: [],
            filter: {
                platform_name: '',
                report_day: ''
            },
            /* table */
            headers: [
                '站点名称',
                '游戏平台',
                '总投注额',
                '总有效下注',
                '总抽水',
                '总输赢',
                '日期'
            ],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25
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
                report_day: this.filter.report_day,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let data = window.all.tool.rmEmpty(para)
            if (data.report_day) {
                data.report_day = JSON.stringify(data.report_day)
            }
            let { url, method } = this.$api.hall_game_report_list
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
.mh5 {
    margin-left: 5px;
    margin-right: 5px;
}
.filter-row2 {
    padding-left: 10px;
    padding-bottom: 10px;
}
</style>