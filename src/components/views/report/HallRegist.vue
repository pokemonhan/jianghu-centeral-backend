<template>
    <div class="container">
        <!-- 厅主注单报表 -->
        <!-- 注单就是下注单 -->
        <QuickQuery :date="quick_query" @update="qqUpd" />

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>站点名称</span>
                    <Input class="w100" v-model="filter.name" />
                </li>
                <li>
                    <span>派彩时间</span>
                    <Date v-model="filter.lottery_dates[0]" @update="timeUpdate()" />
                    <span style="margin:0 5px;">~</span>
                    <Date v-model="filter.lottery_dates[1]" @update="timeUpdate()" />
                </li>
                <li>
                    <span>入库时间</span>
                    <Date v-model="filter.warehouse_dates[0]" @update="timeUpdate()" />
                    <span style="margin:0 5px;">~</span>
                    <Date v-model="filter.warehouse_dates[1]" @update="timeUpdate()" />
                </li>
            </ul>
        </div>
        <div class="filter filter-row2">
            <ul class="left">
                <li>
                    <span>派彩状态</span>
                    <Select style="width:100px;" v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <span>注单时间</span>
                    <Date v-model="filter.bet_dates[0]" @update="timeUpdate()" />
                    <span style="margin:0 5px;">~</span>
                    <Date v-model="filter.bet_dates[1]" @update="timeUpdate()" />
                </li>
            </ul>
        </div>
        <div class="table">
            <TwoTable :column="table_list" :headers="table_headers">
                <template v-slot:tdOne="{row}">
                    <td>{{row.a1}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a3}}</td>
                    <td>{{row.a4}}</td>
                    <td>{{row.a5}}</td>
                    <td>{{row.a6}}</td>
                    <td>{{row.a6}}</td>
                    <td>{{row.a6}}</td>
                    <td>{{row.a6}}</td>
                </template>
                <template v-slot:tdTwo="{row}">
                    <td>{{row.a7}}</td>
                    <td>{{row.a8}}</td>
                    <td>{{row.a9}}</td>
                    <td>{{row.a10}}</td>
                    <td>{{row.a11}}</td>
                    <td>{{row.a12}}</td>
                </template>
            </TwoTable>
        </div>
    </div>
</template> <script>
export default {
    data() {
        return {
            filter: {
                acc: '',
                status: '',
                name: '',
                lottery_dates: [],
                bet_dates: [],
                warehouse_dates: []
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '已派彩', value: '1' },
                { label: '未派彩', value: '2' }
            ],
            quick_query: [],
            /* table */
            table_headers: [
                [
                    { label: '系统注单', width: '173'},
                    { label: '注单号', width: '100'},
                    { label: '会员账号', width: '100'},
                    { label: '会员ID', width: '100'},
                    { label: '站点名称', width: '100'},
                    { label: '游戏平台', width: '100'},
                    { label: '游戏名称' , width: '100'},
                    { label: '投注额' , width: '100'},
                    { label: '有效下注' , width: '100'}
                ],
                ['抽水', '输赢', '派彩状态', '注单时间', '派彩时间', '入库时间']
            ],
            table_list: [
                { a1: 'aD201909201252', a2: '13245678942', a3: '4561234', a4: '13256689796', a5: '红牛商户', a6: '微信充值', a7: '100', a8: '99.9', a9: '已支付', a10: '2019/09/20 12:25:20', a11: '2019/09/20 12:25:20', a12: '2019/09/20 12:25:20' },
                { a1: 'aD201909201252', a2: '13245678942', a3: '4561234', a4: '13256689796', a5: '红牛商户', a6: '微信充值', a7: '100', a8: '99.9', a9: '已支付', a10: '2019/09/20 12:25:20', a11: '2019/09/20 12:25:20', a12: '2019/09/20 12:25:20' },
            ]
        }
    },
    methods: {
        qqUpd(dates) {
            //同步时间筛选值
            this.filter.bet_dates = dates
            this.filter = Object.assign(this.filter)
        },
        timeUpdate() {
            //同步快捷查询按钮状态
            this.quick_query = this.filter.bet_dates
        }
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
.filter-row2 {
    padding-left: 10px;
    padding-bottom: 10px;
}
</style>