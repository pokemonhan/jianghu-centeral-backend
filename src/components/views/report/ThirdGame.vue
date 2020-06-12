<template>
    <div class="container">
        <!-- 厅主注单报表 -->
        <!-- 注单就是下注单 -->
        <QuickQuery :date="quick_query" @update="qqUpd" />

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>游戏平台</span>
                    <Input class="w100" v-model="filter.game_vendor_sign" />
                </li>
                <li>
                    <span>日期</span>
                    <Date type="daterange" v-model="filter.report_day" @update="timeUpdate" />
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-blue" @click="exportExcel">导出Excel</button>
                </li>
                <li>
                    <button class="btn-red" @click="clear">清除</button>
                </li>
            </ul>
        </div>

        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <td>{{row.game_vendor&&row.game_vendor.name}}</td>
                    <td>{{tofixedTwo(row.effective_bet)}}</td>
                    <td>{{tofixedTwo(row.tax)}}</td>
                    <td>{{tofixedTwo(row.bet)}}</td>
                    <td>{{tofixedTwo(row.commission)}}/{{tofixedTwo(row.rebate)}}</td>
                    <td>{{tofixedTwo(Number(row.win_money) - Number(row.bet))}}</td>
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
</template>
<script>
export default {
    name: 'ThirdGame',
    data() {
        return {
            filter: {
                game_vendor_sign: '',
                report_day: []
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '已派彩', value: '1' },
                { label: '未派彩', value: '2' }
            ],
            quick_query: [],
            /* table */
            headers: [
                '游戏平台',
                '总有效下注',
                '总游戏税收',
                '总投注额',
                '佣金/返利',
                '游戏盈亏',
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
            // 同步时间筛选值
            this.filter.report_day = dates
        },
        timeUpdate() {
            // 同步快捷查询按钮状态
            this.quick_query = this.filter.report_day
        },
        clear() {
            this.quick_query = []
            this.filter = {
                game_vendor_sign: '',
                report_day: []
            }
        },

        exportExcel() {
            import('../../../js/config/Export2Excel').then(excel => {
                const tHeader = this.headers
                const data = this.list.map(item => {
                    return [item.a1, item.a2, item.a3, item.a4]
                })

                let chainName = window.all.tool.getChainName(this.$route.path)
                excel.export_json_to_excel({
                    header: tHeader, //表头 必填
                    data, //具体数据 必填
                    filename: `${chainName} ${this.pageNo}`, //非必填
                    autoWidth: true, //非必填
                    bookType: 'xlsx' //非必填
                })
            })
        },
        tofixedTwo(num) {
            if (!num) return 0
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
                // report_day: this.filter.report_day,
                game_vendor_sign: this.filter.game_vendor_sign,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            if (this.filter.report_day[0] && this.filter.report_day[1]) {
                para.report_day = JSON.stringify(this.filter.report_day)
            }
            let data = window.all.tool.rmEmpty(para)

            let { url, method } = this.$api.third_game_report_list
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
.mt20 {
    margin-top: 20px;
}
</style>