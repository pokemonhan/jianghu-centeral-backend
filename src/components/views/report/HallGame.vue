<template>
    <div class="container">
        <!-- 厅主注单报表 -->
        <!-- 注单就是下注单 -->
        <QuickQuery :date="quick_query" />

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>站点名称</span>
                    <Input class="w100" v-model="filter.name" />
                </li>
                <li>
                    <button class="btn-blue">查询</button>
                    <button class="btn-red" @click="clear">清除</button>
                </li>
            </ul>
        </div>
     
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <td>{{row.a1}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a3}}</td>
                    <td>{{row.a4}}</td>
                    <td>{{row.a5}}</td>
                    <td>{{row.a6}}</td>
                    <td>{{row.a7}}</td>
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
                name: '',
            },
            /* table */
            headers: ['站点名称','游戏平台','总投注额','总有效下注','总抽水','总输赢','日期'],
            list: [
                {
                    a1: '江湖互娱',
                    a2: '开元棋牌',
                    a3: '100',
                    a4: '100',
                    a5: '0',
                    a6: '-456',
                    a7: '2019-11-26',
                },
                {
                    a1: '江湖互娱',
                    a2: '开元棋牌',
                    a3: '100',
                    a4: '100',
                    a5: '0',
                    a6: '-456',
                    a7: '2019-11-26',
                },
        
            ],
            total: 0,
            pageNo: 1,
            pageSize: 25
        }
    },
    methods: {
     
        clear() {
            this.quick_query = []
            this.filter = {
                name: ''
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
</style>