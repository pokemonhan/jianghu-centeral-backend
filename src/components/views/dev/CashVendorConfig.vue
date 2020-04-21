<template>
    <div class="container">
        <!-- 金流厂商配置 -->

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>厂商名称</span>
                    <Input v-model="filter.name" />
                </li>
                <li>
                    <span>厂商状态</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-blue" @click="add">添加厂商</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <!-- '编号','厂商名称','厂商标识','添加人','添加时间','最后更新人','最后更新时间','状态','操作' -->
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.sign}}</td>
                    <td>{{row.author&&row.author.name}}</td>
                    <td>{{row.created_at}}</td>
                    <td>{{row.last_editor&&row.last_editor.name||'---'}}</td>
                    <td>{{row.updated_at||'---'}}</td>
                    <!-- <td
                        :class="[row.status?'green':'red']"
                    >{{row.status===1?'开启':row.status===0?'关闭':'----'}}</td>-->
                    <td>
                        <Switchbox v-model="row.status" @update="statusSwitch(row)" />
                    </td>
                    <td>
                        <button class="btns-blue" @click="edit(row)">编辑</button>
                        <!-- <button :class="[row.status?'btns-red':'btns-green']" @click="statusSwitch(row)">{{row.status===1?'禁用':'启用'}}</button> -->
                        <button class="btns-red" @click="del(row)">删除</button>
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
        <Dialog :show.sync="dia_show" :title="dia_title">
            <div class="dia-inner">
                <div>
                    <ul class="form">
                        <li>
                            <span>厂商名称</span>
                            <Input class="w250" v-model="form.name" />
                            <span v-show="form.name===''" class="err-tips">不可为空</span>
                        </li>
                        <li>
                            <span>厂商标识</span>
                            <Input class="w250" v-model="form.sign" />
                            <span v-show="form.sign===''" class="err-tips">不可为空</span>
                        </li>
                        <li>
                            <span>白名单</span>
                            <textarea
                                class="textarea"
                                placeholder="多个ip用都逗号隔开,例如: 1.1.1.1, 2.2.2.2"
                                v-model="form.whitelist_ips"
                            ></textarea>
                        </li>
                        <li v-if="dia_status==='add'">
                            <span>状态选择</span>
                            <Radio
                                class="radio-left"
                                label="启用"
                                :value="form.status"
                                val="1"
                                v-model="form.status"
                            />
                            <Radio
                                class="radio-right ml50"
                                label="禁用"
                                :value="form.status"
                                val="0"
                                v-model="form.status"
                            />
                        </li>
                        <li class="center-box">
                            <button class="btn-plain-large" @click="dia_show=false">取消</button>
                            <button class="btn-blue-large ml50" @click="diaCfm">确定</button>
                        </li>
                    </ul>
                </div>
            </div>
        </Dialog>
        <Modal
            :show.sync="mod_show"
            :title="mod_title"
            :content="mod_cont"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>
    </div>
</template> <script>
export default {
    name: 'CashVendorConfig',
    data() {
        return {
            filter: {
                name: '',
                status: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' }
            ],
            headers: [
                '编号',
                '厂商名称',
                '厂商标识',
                '添加人',
                '添加时间',
                '最后更新人',
                '最后更新时间',
                '状态',
                '操作'
            ],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            // dialog 添加 编辑对话框
            curr_row: {},
            dia_show: false,
            dia_title: '',
            dia_status: '',
            form: {
                name: '',
                sign: '',
                whitelist_ips: '',
                status: '1'
            },

            // mod 禁用删除框
            mod_show: false,
            mod_status: '',
            mod_title: '',
            mod_cont: ''
        }
    },
    methods: {
        initForm() {
            this.form = {
                name: '',
                sign: '',
                whitelist_ips: '',
                status: '1'
            }
        },
        add() {
            this.initForm()
            this.dia_status = 'add'
            this.dia_title = '添加厂商'
            this.dia_show = true
        },
        edit(row) {
            this.form = Object.assign({}, row)

            if (this.form.whitelist_ips) {
                this.form.whitelist_ips = this.form.whitelist_ips.replace(
                    /["\[\]]/g,
                    ''
                )
            }
            this.dia_status = 'edit'
            this.dia_title = '编辑'
            // this.curr_row = row

            this.dia_show = true
        },
        statusSwitch(row) {
            this.curr_row = row
            // this.mod_status = 'switch'
            // this.mod_title = row.status === 1 ? '禁用' : '启用'
            // this.mod_cont = `是否确定${this.mod_title}该支付厂商？`

            // this.mod_show = true
            this.switchStatus()
        },
        del(row) {
            this.mod_status = 'del'
            this.curr_row = row
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该支付厂商？'

            this.mod_show = true
        },

        checkForm() {
            if (this.form.name === '') {
                return false
            }
            if (this.form.sign === '') {
                return false
            }
            return true
        },
        diaCfm() {
            if (this.dia_status === 'add') {
                this.addVendor()
            }
            if (this.dia_status === 'edit') {
                this.editVendor()
            }
        },
        addVendor() {
            if (!this.checkForm()) return
            // let whitelist_ips =this.form.whitelist_ips && this.form.whitelist_ips.split(',')
            let data = {
                name: this.form.name,
                sign: this.form.sign,
                // whitelist_ips: JSON.stringify(whitelist_ips),
                status: this.form.status
            }
            if (this.form.whitelist_ips) {
                let str = this.form.whitelist_ips.replace('，', ',')
                str = str.replace(/\s+/g, '')
                data.whitelist_ips = JSON.stringify(str.split(','))
            }
            /// <reference path="../../../main.js" />
            /// <reference path="../../../js/plugins.js" />
            let { url, method } = this.$api.dev_finance_vendor_add
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                } else {
                    if (res && res.message !== '') {
                        this.$toast.error(res.message)
                    }
                }
            })
        },
        editVendor() {
            if (!this.checkForm()) return
            let data = {
                id: this.form.id,
                name: this.form.name,
                sign: this.form.sign,
                status: this.form.status
            }
            if (this.form.whitelist_ips) {
                let str = this.form.whitelist_ips.replace('，', ',')
                str = str.replace(/\s+/g, '')
                data.whitelist_ips = JSON.stringify(str.split(','))
            }
            let { url, method } = this.$api.dev_finance_vendor_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },
        modConf() {
            // if (this.mod_status === 'switch') {
            //     this.switchStatus()
            // }
            if (this.mod_status === 'del') {
                this.delConfirm()
            }
        },
        switchStatus() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status ? 1 : 0
            }

            let { url, method } = this.$api.dev_finance_vendor_status_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    // this.mod_show = false
                }
                this.getList()
            })
        },
        delConfirm() {
            let data = {
                id: this.curr_row.id
            }

            let { url, method } = this.$api.dev_finance_vendor_del
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.getList()
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
        },
        getList() {
            let para = {
                name: this.filter.name,
                status: this.filter.status,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)

            let { url, method } = this.$api.dev_finance_vendor_list
            this.$http({ method, url, params }).then(res => {
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
.dia-inner {
    display: flex;
    justify-content: center;
    min-width: 600px;
    padding-bottom: 20px;
}
.form > li {
    display: flex;
    align-items: baseline;
    position: relative;
    margin-top: 20px;
}
.form > li > span:first-child {
    width: 5em;
}
.err-tips {
    position: absolute;
    left: 7em;
    top: 32px;
    color: red;
    font-size: 12px;
}
.w250 {
    width: 250px;
}
.ml50 {
    margin-left: 50px;
}
/* .textarea 有全局样式 */
.textarea {
    width: 250px;
    height: 100px;
}
.form .center-box {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}
</style>