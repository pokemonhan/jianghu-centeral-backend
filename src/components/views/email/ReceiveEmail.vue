<template>
    <div class="container">

        <!----------------        收件箱          ----->
        <QuickQuery :date="quick_query" @update="qqUpd" />
        <!-- filter 筛选 -->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>发件人</span>
                    <Input class="w100" v-model="filter.sender" />
                </li>
                <li>
                    <span>收件时间</span>
                    <Date v-model="filter.dates[0]" @update="timeUpdate()" />
                    <span style="margin: 0 5px;">~</span>
                    <Date v-model="filter.dates[1]" @update="timeUpdate()" />
                </li>
                <li>
                    <button class="btn-blue">查询</button>
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
                    <button class="btn-plain">上一页</button>
                    <button class="btn-plain">下一页</button>
                </div>
            </div>
            <!-- table -->
            <div style="margin-top:5px;"></div>
            <Table :headers="headers" :column="list" @checkboxChange="checkboxChange" hadCheckbox>
                <template v-slot:item="{row}">
                    <td class="pointer" style="width:100px;" @click="showDetail(row)">{{row.a1}}</td>
                    <td class="pointer" style="width:760px;padding:5px;" @click="showDetail(row)">{{row.a2}}</td>
                    <td class="pointer" @click="showDetail(row)">{{row.a3}}</td>
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
        <Dialog :show.sync="dia_show" title="收件箱详情">
            <div class="dia-inner">
                <Detail @close="dia_show=false" />
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
import Detail from './ReceiveEmailDetail'
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
            list: [
                {
                    a1: 'admin',
                    a2:
                        'admin趣闻 1947 年，时装设计师 Elsa Schiaparelli 将“艳粉色”引入西方时尚圈。 桃色可以营造亲密氛围，减少攻击性和敌意。 由于听说粉色有一种镇定效果，有些球队会把客队的休息室漆成粉色。 对于粉色的研究发现，男性举重运动员在粉色房间内似乎感到力不从心，而女性举重运动员面对这种颜色反而会有变强的倾向。 糕点从粉色盒子里取出或盛在粉色盘子里时，尝起来会更美味（这种情况仅适用于甜点），因为粉色令我们渴望糖份',
                    a3: '2019-02-02'
                },
                {
                    a1: 'admin',
                    a2:
                        'admin趣闻 1947 年，时装设计师 Elsa Schiaparelli 将“艳粉色”引入西方时尚圈。 桃色可以营造亲密氛围，减少攻击性和敌意。 由于听说粉色有一种镇定效果，有些球队会把客队的休息室漆成粉色。 对于粉色的研究发现，男性举重运动员在粉色房间内似乎感到力不从心，而女性举重运动员面对这种颜色反而会有变强的倾向。 糕点从粉色盒子里取出或盛在粉色盘子里时，尝起来会更美味（这种情况仅适用于甜点），因为粉色令我们渴望糖份',
                    a3: '2019-02-02'
                }
            ],
            total: 2,
            pageNo: 1,
            pageSize: 25,
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
            this.filter.dates = dates;
            this.filter = Object.assign(this.filter)
        },
        clearFilter() {
            this.filter = {
                sender: '',
                dates: []
            }
        },
        checkboxChange(index, e) {
            // console.log('e: ', e);
            // console.log('index: ', index);
            // console.log(this.list);
        },
        showDetail(row) {
            console.log(row);
            this.dia_show = true
        },
        modConf() {
            console.log('确认删除')
        },
        updateNo(val) {},
        updateSize(val) {}
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
.tab-control {
    /* width: 100%; */
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    padding: 10px;
    background: #d8e2f5;
}
.pointer{
    cursor: pointer;
}
</style>
