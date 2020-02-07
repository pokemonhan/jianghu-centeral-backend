<template>
    <div class="container">
        <!-- 厅主注单报表 -->
        <!-- 注单就是下注单 -->
        <QuickQuery :date="quick_query" @update="qqUpd" />

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>站点名称</span>
                    <Input v-model="filter.name" />
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
        <div class="mt20">
            <div class="table">
                <Table class="v-table" :headers="headers" :column="list">
                    <template v-slot:item="{row,idx}">
                        <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                        <td
                            :class="[row.status?'green':'red']"
                        >{{row.status===1?'开启':row.status===0?'关闭':'???'}}</td>
                        <td>{{row.a1}}</td>
                        <td>{{row.a2}}</td>
                        <td>{{row.a3}}</td>
                        <td>{{row.a4}}</td>
                        <td>{{row.a5}}</td>
                        <td>{{row.a6}}</td>
                        <td>{{row.a7}}</td>
                        <td>{{row.a8}}</td>
                        <td>{{row.a8}}</td>
                        <td>{{row.a8}}</td>
                        <td>{{row.a8}}</td>
                        <td>{{row.a8}}</td>
                        <td>{{row.a8}}</td>
                    </template>
                </Table>
            </div>

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
            headers: [
                '系统注单',
                '注单号',
                '会员账号',
                '会员ID',
                '站点名称',
                '游戏平台',
                '游戏名称',
                '投注额',
                '有效下注',
                '抽水',
                '输赢',
                '派彩状态',
                '注单时间',
                '派彩时间',
                '入库时间'
            ],
            list: [
                {
                    a1: '64646466',
                    a2: 'sdfsdfdsf',
                    a3: '充支好礼',
                    a4: '1',
                    a5: '2019-02-02 21:30',
                    a6: '2019-02-02 21:30',
                    a7: '2019-02-02 21:30',
                    a8: '2019-02-02 21:30',
                    a9: '2019-02-02 21:30'
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
            pageSize: 25,

            updateNo(val) {},
            updateSize(val) {}
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
/*定义滑块
 内阴影+圆角*/
/* ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(30, 130, 245, 0.3);
    background-color: #70a1fd8f;
    height: 2px;
} */
/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    width:8px;
    height:8px;
    /* background-color:#F5F5F5; */
}


.filter-row2 {
    padding-left: 10px;
    padding-bottom: 10px;
}
.table {
    overflow-x: auto;
}
.table .v-table {
    min-width: 1920px;
}

</style>