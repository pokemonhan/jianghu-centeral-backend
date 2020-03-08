<template>
    <div class="cont">
        <!-- 域名管理 -->

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
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <span>日期</span>
                    <Date type="daterange" v-model="filter.dates" />
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-blue" @click="add">添加</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <td class="tab-domain">
                        <i v-show="domain_idx!==0" class="iconfont iconstart"></i>
                        <span>{{row.domain}}</span>
                    </td>
                    <td>{{row.created_at}}</td>
                    <td>
                        <span
                            :class="[row.status===1?'green':'red']"
                        >{{row.status===1?'开启':'关闭'}}</span>
                    </td>
                    <td>
                        <button
                            :class="[row.status?'btns-red':'btns-green']"
                            @click="statusSwitch(row)"
                        >{{row.status===1?'禁用':'启用'}}</button>
                        <button class="btns-blue" @click="del(row)">删除</button>
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
                        <Radio
                            class="radio-left"
                            label="是"
                            :value="form.status"
                            val="1"
                            v-model="form.status"
                        />
                        <Radio
                            class="radio-right"
                            label="否"
                            :value="form.status"
                            val="0"
                            v-model="form.status"
                        />
                    </li>
                </ul>
                <div class="mt50">
                    <button class="btn-plain-large" @click="dia_show=false">取消</button>
                    <button class="btn-blue-large ml20" @click="diaCfm">确定</button>
                </div>
            </div>
        </Dialog>

        <!-- 确认, 删除 弹出框 -->
        <Modal
            :show.sync="mod_show"
            :title="mod_title"
            :content="mod_cont"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>
    </div>
</template>


<script>
export default {
    props: {
        sign: {
            type: [String, Number]
        }
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
                { label: '全部', value: '' },
                { label: '开启', value: 1 },
                { label: '关闭', value: 0 }
            ],
            headers: ['域名', '添加时间', '状态', '操作'],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25,
            // dialog 对话框
            dia_show: false,
            dia_status: '',
            form: {
                domain: '',
                status: '1'
            },

            // 确认模态框 modal
            curr_row: {},
            mod_show: false,
            mod_title: '',
            mod_status: '',
            mod_cont: ''
        }
    },
    methods: {
        domainClk(index) {
            this.domain_idx = index
            this.getList()
        },
        initForm() {
            this.form = {
                domain: '',
                status: '1'
            }
        },
        add() {
            this.dia_status = 'add'
            this.dia_show = true
        },
        diaCfm() {
            if (this.dia_status === 'add') {
                this.addCfm()
            }
        },
        addCfm() {
            let data = {
                platform_sign: this.sign,
                type: this.domain_idx, // 类型 1.PC 2.H5 3.APP
                domain: this.form.domain,
                status: this.form.status
            }

            let { url, method } = this.$api.platform_domain_add
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },
        modConf() {
            if (this.mod_status === 'switch') {
                this.switchCfm()
            }
        },
        statusSwitch(row) {
            this.curr_row = row
            this.mod_status = 'switch'
            this.mod_title = row.status === 1 ? '禁用' : '启用'
            this.mod_cont = '是否禁用该域名!'
            this.mod_show = true
        },
        del() {
            this.mod_status = 'delete'
            this.mod_title = '删除'
            this.mod_cont = '是否删除该域名!'
            this.mod_show = true
        },
        switchCfm() {
            return // TODO:
            let data = {
                id: this.form.id,
                status: this.form.status
            }

            // let { url, method } = this.$api.aaaaaaaa🐷
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.getList()
                }
            })
        },
        getList() {
            console.log('getlist', this.sign)
            let para = {
                sign: this.sign,
                type: this.domain_idx,
                domain: this.filter.domain,
                status: this.filter.status,

            }
            if(this.filter.dates[0]&&this.filter.dates[1]) {
                para.createdAt = JSON.stringify(this.filter.dates)
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.platform_domain_list
            this.$http({ method, url, params }).then(res => {
                console.log('域名列表?👌: ', res)
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
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
.dia-inner {
    text-align: center;
}
.cont {
    width: 900px;
    min-height: 500px;
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
    color: rgb(251, 204, 2);
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
