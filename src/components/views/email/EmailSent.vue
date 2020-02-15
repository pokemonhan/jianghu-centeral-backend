<template>
    <div class="container">
        <!----------------        收件箱          ----->
        <QuickQuery :date="quick_query" @update="qqUpd" />
        <!-- filter 筛选 -->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>发件人</span>
                    <Input v-model="filter.sender" />
                </li>
                <li>
                    <span>发件时间</span>
                    <Date v-model="filter.dates[0]" @update="timeUpdate()" />
                    <span style="margin: 0 5px;">~</span>
                    <Date v-model="filter.dates[1]" @update="timeUpdate()" />
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-red" @click="clearFilter">清空</button>
                </li>
            </ul>
        </div>
        <div style="margin-top:20px;">
            <!-- 控制栏 -->
            <div class="tab-control">
                <div class="left">
                    <button class="btn-plain" @click="mod_show=true">删除</button>
                </div>
                <div class="right">
                    <span>{{pageNo}}/{{Math.ceil(total/pageSize)}}</span>
                    <button
                        :disabled="pageNo<2"
                        :class="[pageNo>1?'btn-plain':'btn-disabled']"
                        @click="prevPage"
                    >上一页</button>
                    <button
                        :class="[pageNo<Math.ceil(total/pageSize)?'btn-plain':'btn-disabled']"
                        @click="nextPage"
                    >下一页</button>
                    <!-- <button class="btn-plain">上一页</button>
                    <button class="btn-plain">下一页</button> -->
                </div>
            </div>
            <!-- table -->
            <div style="margin-top:5px;"></div>
            <Table :headers="headers" :column="list" @checkboxChange="checkboxChange" hadCheckbox>
                <template v-slot:item="{row,idx}">
                    <td class="pointer" style="width:140px;" @click="showDetail(row,idx)">
                        <p v-for="(item, index) in row.receivers" :key="index">{{item}}</p>
                    </td>
                    <!-- <td>{{title}}</td> -->
                    <td
                        class="pointer"
                        style="min-width:760px;padding:5px;"
                        @click="showDetail(row,idx)"
                    >{{getText(row.content)}}</td>
                    <td class="pointer" @click="showDetail(row,idx)">{{row.send_time}}</td>
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
        <!-- 详情 -->
        <Dialog :show.sync="dia_show" title="已发邮件详情">
            <div class="dia-inner">
                <Detail class="email-detail" isSend :row="curr_row" @close="dia_show=false" />
            </div>
        </Dialog>
        <!-- 删除确认 -->
        <Modal
            :show.sync="mod_show"
            title="删除"
            content="是否删除选中邮件"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>
    </div>
</template>


<script>
import Detail from './EmailDetail'
export default {
    components: {
        Detail: Detail
    },
    data() {
        return {
            quick_query: [],
            filter: {
                sender: '',
                dates: []
            },
            headers: ['发件人', '内容', '收件日期'],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            curr_row: {},
            dia_show: false,
            mod_show: false
        }
    },
    methods: {
        timeUpdate() {
            //同步快捷查询按钮状态
            this.quick_query = this.filter.dates
        },
        qqUpd(dates) {
            //同步时间筛选值
            this.filter.dates = dates
            this.filter = Object.assign(this.filter)
        },
        clearFilter() {
            this.filter = {
                sender: '',
                dates: []
            }
        },
        prevPage() {
            if(this.pageNo>1) {
                this.pageNo--
                this.getList()
            }
        },
        nextPage() {
            if(this.pageNo<Math.ceil(this.total/this.pageSize)) {
                this.pageNo ++
                this.getList()
            }
        },
        checkboxChange(index, e) {
            // console.log('e: ', e);
            // console.log('index: ', index);
            // console.log(this.list);
        },
        showDetail(row, index) {
            this.curr_row = row
            this.curr_row.pageSize = this.pageSize
            this.curr_row.pageNo = this.pageNo
            this.curr_row.total = this.total
            this.curr_row.index = index
            // console.log(row);
            this.dia_show = true
        },
        modConf() {
            // console.log('确认删除')
        },
        getText(content) {
            let divLink = document.createElement('div')
            divLink.innerHTML = content
            return divLink.innerText
        },
        getList() {
            let created_at = ''
            if (this.filter.dates[0] && this.filter.dates[1]) {
                created_at = JSON.stringify(this.filter.dates)
            }
            let para = {
                name: this.filter.vendor,
                created_at: this.filter.created_at,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)

            let { url, method } = this.$api.email_sent_list
            this.$http({ method, url, params }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
                } else {
                    if (res && res.message !== '') {
                        this.$toast.error(res.message)
                    }
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

.tab-control {
    /* width: 100%; */
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    padding: 10px;
    background: #d8e2f5;
}
.pointer {
    cursor: pointer;
}
.btn-disabled {
    padding: 5px 15px;
    color: #ccc;
    border: 1px solid #ccc;
    cursor: not-allowed;
}
.dia-inner {
    min-width: 1000px;
    max-width: 80vw;
    max-height: 80vh;
    overflow: auto;
}
/* .email-detail {
    min-width: 800px;
    width: 100vw;
} */
</style>
