<template>
    <div class="container">
        <!-- 厅主注单报表 -->
        <!-- 注单就是下注单 -->
        <!-- <div class="date-select"> -->
        <!-- <QuickQuery :date="quick_query" @update="qqUpd" /> -->

        <!-- </div> -->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>站点名称</span>
                    <Input style="width:110px;" v-model="filter.platform_name" />
                </li>
                <li>
                    <span>派彩时间</span>

                    <Date type="datetimerange" v-model="filter.delivery_time" />
                </li>
                <li>
                    <span>入库时间</span>

                    <Date type="datetimerange" v-model="filter.created_at" />
                </li>
            </ul>
        </div>
        <div class="filter filter-row2">
            <ul class="left">
                <li>
                    <span>派彩状态</span>
                    <Select style="width:110px;" v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <span>注单时间</span>
                    <Date type="datetimerange" v-model="filter.their_create_time" />
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-blue" @click="exportExcel">导出Excel</button>
                    <button class="btn-blue" @click="exportAll">导出所有Excel</button>
                </li>
                <li>
                    <button class="btn-red" @click="Clear">清除</button>
                </li>
            </ul>
        </div>
        <div class="mt20">
            <div class="table mb10">
                <Table class="v-table" :headers="headers" :column="list">
                    <!-- [ '系统注单', '注单号', '会员账号', '会员ID', '站点名称', '游戏平台', '游戏名称', '投注额', '有效下注', '抽水', '输赢', '派彩状态', '注单时间', '派彩时间', '入库时间' ], -->
                    <template v-slot:item="{row}">
                        <td>{{row.serial_number}}</td>
                        <td>{{row.their_serial_number}}</td>
                        <td>{{row.mobile}}</td>
                        <td>{{row.guid}}</td>
                        <td>{{row.platform_name}}</td>
                        <td>{{row.game_vendor}}</td>
                        <td>{{row.game_name}}</td>
                        <td>{{tofixedTwo(row.bet_money)}}</td>
                        <td>{{tofixedTwo(row.effective_bet)}}</td>
                        <td>{{row.charged_fees}}</td>
                        <td>{{tofixedTwo(Number(row.win_money)-Number(row.bet_money))}}</td>
                        <td>{{lottery_status[row.status]||'---'}}</td>
                        <td>{{row.their_create_time}}</td>
                        <td>{{row.delivery_time||'---'}}</td>
                        <td>{{row.created_at}}</td>
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
    name: 'HallRegist',
    data() {
        return {
            filter: {
                status: '', // 派彩状态 0已投注 1已撤销 2未中奖 3已中奖 4已派奖
                platform_name: '', // 站点名称
                delivery_time: [], // 派彩时间
                created_at: [],
                their_create_time: []
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '已投注', value: '0' },
                { label: '已撤销', value: '1' },
                { label: '未中奖', value: '2' },
                { label: '已中奖', value: '3' },
                { label: '已派奖', value: '4' }
            ],
            quick_query: [],
            /* table */
            // 0已投注 1已撤销 2未中奖 3已中奖 4已派奖
            lottery_status: {
                '0': '已投注',
                '1': '已撤销',
                '2': '未中奖',
                '3': '已中奖',
                '4': '已派奖'
            },
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
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25
        }
    },
    methods: {
        // qqUpd(dates) {
        //     //同步时间筛选值
        //     this.filter.bet_dates = dates
        //     this.filter = Object.assign(this.filter)
        // },
        Clear() {
            this.quick_query = []
            this.filter = {
                status: '',
                name: '',
                delivery_time: [],
                bet_dates: [],
                created_at: [],
                their_create_time: []
            }
        },
        ExcelOut(data, file_name) {
            let header = this.headers
            let self = this
            function getdata(data) {
                return data.map(item => {
                    return [
                        item.serial_number,
                        item.their_serial_number,
                        item.mobile,
                        item.guid,
                        item.platform_name,
                        item.game_vendor,
                        item.game_name,
                        self.tofixedTwo(item.bet_money),
                        self.tofixedTwo(item.effective_bet),
                        item.charged_fees,
                        self.tofixedTwo(
                            Number(item.win_money) - Number(item.bet_money)
                        ),
                        self.lottery_status[item.status] || '---',
                        item.their_create_time,
                        item.delivery_time || '---',
                        item.created_at
                    ]
                })
            }
            import('../../../js/config/Export2Excel').then(excel => {
                excel.export_json_to_excel({
                    header: header, //表头 必填
                    data:getdata(data), //具体数据 必填
                    filename: file_name, //非必填
                    autoWidth: true, //非必填
                    bookType: 'xlsx' //非必填
                })
            })
        },
        async exportAll() {
            let self = this
            let pageSize = 100
            function getPageList(pageNo) {
                return new Promise((resolve, reject) => {
                    let para = {
                        platform_name: self.filter.platform_name,
                        status: self.filter.status,
                        delivery_time: self.filter.delivery_time,
                        their_create_time: self.filter.their_create_time,
                        created_at: self.filter.created_at,
                        pageSize: pageSize,
                        page: pageNo
                    }
                    let data = window.all.tool.rmEmpty(para)
                    if (data.delivery_time) {
                        data.delivery_time = JSON.stringify(data.delivery_time)
                    }
                    if (data.their_create_time) {
                        data.their_create_time = JSON.stringify(
                            data.their_create_time
                        )
                    }
                    if (data.created_at) {
                        data.created_at = JSON.stringify(data.created_at)
                    }
                    let { url, method } = self.$api.hall_regist_report_list
                    self.$http({ method, url, data }).then(res => {
                        if (res && res.code === '200') {
                            if (res.data && res.data.data) {
                                setTimeout(() => {
                                    resolve(res.data.data)
                                }, 150)
                            }
                        }
                    })
                })
            }
            if (!self.total) return
            let totalPage = Math.ceil(self.total / 100)
            let list = []
            for (let i = 1; i <= totalPage; i++) {
                let currList = await getPageList(i) // 获取i页的内容
                list = list.concat(currList)
            }

            let chainName = window.all.tool.getChainName(self.$route.path)
            let file_name = `${chainName}`
            self.ExcelOut(list, file_name)
        },
        exportExcel() {
            let header = this.headers
            // const data = this.list.map(item => {
            //     return [
            //         item.serial_number,
            //         item.their_serial_number,
            //         item.mobile,
            //         item.guid,
            //         item.platform_name,
            //         item.game_vendor,
            //         item.game_name,
            //         this.tofixedTwo(item.bet_money),
            //         this.tofixedTwo(item.effective_bet),
            //         item.charged_fees,
            //         this.tofixedTwo(
            //             Number(item.win_money) - Number(item.bet_money)
            //         ),
            //         this.lottery_status[item.status] || '---',
            //         item.their_create_time,
            //         item.delivery_time || '---',
            //         item.created_at
            //     ]
            // })
            let chainName = window.all.tool.getChainName(this.$route.path)
            let file_name = `${chainName} ${this.pageNo}`
            this.ExcelOut(this.list, file_name)
        },
        // timeUpdate() {
        //     //同步快捷查询按钮状态
        //     this.quick_query = this.filter.bet_dates
        // },
        tofixedTwo(num) {
            if (!num) return 0
            return Number(num).toFixed(2)
        },
        updateNo(val) {
            this.getList()
        },
        updateSize(val) {
            this.pageNo = 1
            this.getList()
        },
        getList() {
            let para = {
                platform_name: this.filter.platform_name,
                status: this.filter.status,
                delivery_time: this.filter.delivery_time,
                their_create_time: this.filter.their_create_time,
                created_at: this.filter.created_at,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let data = window.all.tool.rmEmpty(para)
            if (data.delivery_time) {
                data.delivery_time = JSON.stringify(data.delivery_time)
            }
            if (data.their_create_time) {
                data.their_create_time = JSON.stringify(data.their_create_time)
            }
            if (data.created_at) {
                data.created_at = JSON.stringify(data.created_at)
            }
            let { url, method } = this.$api.hall_regist_report_list
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
    width: 10px;
    height: 10px;
    /* background-color:#F5F5F5; */
}
.date-select {
    display: flex;
    align-items: center;
}
.btn-clear {
    height: 30px;
    padding-left: 15px;
    padding-right: 15px;
    color: #fff;
    background: #4c8bfd;
}
.btn-clear:hover {
    background: #6397f7;
    transition: box-shadow 0.2s;
}
.btn-clear:active {
    box-shadow: none;
    background: #4c8bfd;
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
    min-height: calc(100vh - 350px);
    margin-bottom: 5px;
}
</style>