<template>
    <div class="cont">
        <div class="domain-select">
            <button
                :class="domain_idx ===index?'btn-blue':'btn-plain'"
                v-for="(item, index) in domain_btns"
                :key="index"
                @click="domainClk(index)"
            >{{item}}</button>
        </div>
        <!-- 筛选框 -->
        <div class="filter p10 mt10">
            <ul class="left">
                <li>
                    <span>域名</span>
                    <Input class="w100" v-model="filter.domain" />
                </li>
                <li>
                    <span>状态</span>
                    <Select v-model="filter.status" :options="status_opt" ></Select>
                </li>
                <li>
                    <span>日期</span>
                    <Date v-model="filter.dates[0]" />
                    <span style="margin:0 5px;">~</span>
                    <Date v-model="filter.dates[1]" />
                </li>
                <li>
                    <button class="btn-blue">查询</button>
                    <button class="btn-blue" @click="addDomain">添加</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table
                :headers="headers"
                :column="list"
            >
                <template v-slot:item="{row}">
                    <td class="tab-domain">
                        <i v-show="domain_idx!==0" class="iconfont iconstart"></i>
                        <span>{{row.a1}}</span>
                    </td>
                    <td>{{row.a2}}</td>
                    <td>
                        <span :class="[row.a3==='1'?'green':'red']">{{row.a3==='1'?'开启':'关闭'}}</span>
                    </td>
                    <td>
                        <span class="a" @click="forbid(row)">禁止</span>
                        <span class="a" @click="del(row)">删除</span>
                    </td>
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
        <!-- 添加弹出框 -->
        <Dialog :show.sync="dia_show" title="添加域名">
            <div class="dia-inner">
                <ul class="form">
                    <li>
                        <span>域名:</span>
                        <Input class="w250" v-model="form.domain" />
                    </li>
                    <li>
                        <span>是否启用:</span>
                        <Radio class="radio-left" label="是" :value="form.is_turnon" val="on" v-model="form.is_turnon" />
                        <Radio class="radio-right" label="否" :value="form.is_turnon" val="off" v-model="form.is_turnon" />
                    </li>
                </ul>
                <div class="mt50">
                    <button class="btn-plain-large" @click="dia_show=false">取消</button>
                    <button class="btn-blue-large ml20">确定</button>
                </div>
            </div>
        </Dialog>

        <!-- 确认, 删除 弹出框 -->
        <Modal :show.sync="mod_show" :title="mod_title" :content="mod_cont" @cancel="mod_show=false" @confirm="modConf"></Modal>
    </div>
</template>


<script>
export default {
    props: {
        id: ''
    },
    data() {
        return {
            domain_btns: ['主域名', 'PC域名', '手机H5域名', 'APP下载域名'],
            domain_idx: 0,
            filter: {
                domain: '',
                status: '',
                dates: []
            },
            status_opt: [
                {label:'全部',value: ''},
                {label:'开启',value: 0},
                {label:'关闭',value: 1},
            ],
            headers: ['域名', '添加时间', '状态', '操作'],
            list: [
                {
                    a1: 'www.sdfsdfsdfsf.com.',
                    a2: 'sdfsdfdsf',
                    a3: '1',
                    a4: '1',
                    a5: '2019-02-02 21:30'
                },
                {
                    a1: '64646466',
                    a2: 'sdfsdfdsf',
                    a3: '0',
                    a4: '1',
                    a5: '2019-02-02 21:30'
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 25,
            // dialog 对话框
            dia_show: false,
            form: {
                domain: '',
                is_turnon: ''
            },
            // 确认模态框 modal
            mod_show : false,
            mod_title: '',
            mod_status: '',
            mod_cont: ''

        }
    },
    methods: {
        domainClk(index) {
            this.domain_idx = index
        },
        addDomain() {
            this.dia_show = true
        },
        modConf() {

        },
        forbid () {
            this.mod_status = 'forbid'
            this.mod_cont = '是否禁止该域名!'
            this.mod_show = true
        },
        del() {
            this.mod_status = 'delete'
            this.mod_cont = '是否删除该域名!'
            this.mod_show = true
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
.dia-inner {
    text-align: center;
}
.cont {
    width: 900px;
}
.p10 {
    padding: 10px;
}
.mt10 {
    margin-top: 10px;
}
.mt20 {
    margin-top: 20px;
}
.tab-domain {
    /* position: relative; */
    width: 200px;
}
.iconstart {
    /* position: absolute;
    top: 5px;
    left: 10px; */
    color:rgb(251, 204, 2);
    font-size: 25px;
}
.radio-right {
    margin-left: 50px;
}
.form > li {
    display: flex;
    align-items: center;
    margin-top: 20px;
}
.form > li span:first-child {
    width: 80px;
    text-align: right;
    margin-right: 10px;
}
.w250 {
    width: 250px;
}
.mt50 {
    margin-top: 50px;
}
.ml20 {
    margin-left: 20px;
}
</style>
