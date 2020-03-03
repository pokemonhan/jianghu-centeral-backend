<template>
    <div class="container">
        <!-- 厅主注单报表 -->
        <!-- 注单就是下注单 -->
        <QuickQuery :date="quick_query" @update="qqUpd" />

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>游戏平台</span>
                    <Input class="w100" v-model="filter.name" />
                </li>
                <li>
                    <span>日期</span>
                    <Date v-model="filter.dates[0]" @update="timeUpdate()" />
                    <span class="mh5">~</span>
                    <Date v-model="filter.dates[1]" @update="timeUpdate()" />
                </li>
                <li>
                    <button class="btn-blue">查询</button>
                    <button class="btn-blue">导出Excel</button>
                </li>
                <li>
                    <button class="btn-red" @click="clear">清除</button>
                </li>
            </ul>
        </div>
     
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <td>{{row.a1}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
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
                name: '',
                dates: []
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '已派彩', value: '1' },
                { label: '未派彩', value: '2' }
            ],
            quick_query: [],
            /* table */
            headers: ['游戏平台','总有效下注','总游戏税收','总投注额','佣金/返利','游戏盈亏','日期'],
            list: [
                {
                    a1: '64646466',
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
        qqUpd(dates) {
            //同步时间筛选值
            this.filter.dates = dates
        },
        timeUpdate() {
            //同步快捷查询按钮状态
            this.quick_query = this.filter.dates
        },
        clear() {
            this.quick_query = []
            this.filter = {
                name: '',
                dates: []
            }
        },
        updateNo() {
            // this.getList()
        },
        updateSize() {
            this.pageNo = 1
            // this.getList()
        },
    },
    mounted() {}
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