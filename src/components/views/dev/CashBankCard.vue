<template>
    <div class="container">
        <!-- 金流银行卡配置 -->

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>银行名称</span>
                    <!-- <Input v-model="filter.name" /> -->
                    <Select input v-model="filter.name" :options="bank_opt"></Select>
                </li>
                <li>
                    <span>状态</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-blue" @click="add">添加银行</button>
                </li>
            </ul>
        </div>

        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.code}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.author&&row.author.name}}</td>
                    <td>{{row.created_at}}</td>
                    <td>{{row.last_editor&&row.last_editor.name||'---'}}</td>
                    <td>{{row.updated_at||'---'}}</td>
                    <!-- <td :class="[row.status?'green':'red']" >{{row.status===1?'开启':row.status===0?'关闭':'--'}}</td> -->
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
        <Dialog :show.sync="dia_show" :title="dia_status==='add'?'添加':'编辑'">
            <div class="dia-inner">
                <div class="dia-maintain">
                    <ul class="form">
                        <li>
                            <span>银行名称:</span>
                            <Input class="w250" v-model="form.name" />
                            <span v-show="!form.name" class="err-tips">不可为空</span>
                        </li>
                        <li>
                            <span>银行编码:</span>
                            <Input class="w250" limit="en-num" v-model="form.code" />
                            <span v-show="!form.code" class="err-tips">不可为空</span>
                        </li>
                        <li v-if="dia_status==='add'">
                            <span>状态选择:</span>
                            <Radio
                                class="radio-left"
                                label="开启"
                                :value="form.status"
                                val="1"
                                v-model="form.status"
                            />
                            <Radio
                                class="radio-right ml50"
                                label="关闭"
                                :value="form.status"
                                val="0"
                                v-model="form.status"
                            />
                        </li>
                    </ul>
                    <div class="form-btns">
                        <button class="btn-plain-large" @click="dia_show=false">取消</button>
                        <button class="btn-blue-large ml50" @click="diaCfm">确定</button>
                    </div>
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
    name: 'CashBankCard',
    data() {
        return {
            filter: {
                name: '',
                status: ''
            },
            bank_opt: [],
            status_opt: [
                { label: '全部', value: '' },
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' }
            ],
            headers: [
                '编号',
                '银行编码',
                '银行名称',
                '创建人',
                '创建时间',
                '最后更新人',
                '最后更新时间',
                '状态',
                '操作'
            ],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            // dialog 添加 &编辑
            curr_row: {},
            dia_show: false,
            dia_status: '',
            form: {
                name: '',
                code: '',
                status: '1'
            },

            // 禁用|启用 删除 modal
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
                code: '',
                status: '1'
            }
        },
        add() {
            this.initForm()
            this.dia_show = true
            this.dia_status = 'add'
        },
        edit(row) {
            this.form = {
                id: row.id,
                name: row.name,
                code: row.code,
                status: row.status
            }
            this.dia_status = 'edit'

            this.dia_show = true
        },
        statusSwitch(row) {
            this.curr_row = row
            // this.mod_status = 'switch'
            // this.mod_title = row.status === 1 ? '禁用' : '启用'
            // this.mod_cont = `是否确定${this.mod_title}该银行？`
            // this.mod_show = true
            this.switchConfirm()
        },
        del(row) {
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该银行？'
            this.mod_show = true
        },
        diaCfm() {
            if (this.dia_status === 'add') {
                this.addConfirm()
            }
            if (this.dia_status === 'edit') {
                this.EditConfirm()
            }
        },
        checkForm() {
            if (this.form.name === '') {
                return false
            }
            if (this.form.code === '') {
                return false
            }
            return true
        },
        addConfirm() {
            if (!this.checkForm()) return
            let data = {
                name: this.form.name,
                code: this.form.code,
                status: this.form.status
            }

            let { url, method } = this.$api.dev_sys_bank_add
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                } else {
                    if (res && res.message !== '') {
                        // this.$toast.error(res.message)
                    }
                }
            })
        },
        EditConfirm() {
            if (!this.checkForm()) return
            let data = {
                id: this.form.id,
                name: this.form.name,
                code: this.form.code,
                status: this.form.status
            }

            let { url, method } = this.$api.dev_sys_bank_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.info(res && res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },
        modConf() {
            // if (this.mod_status === 'switch') {
            //     this.switchConfirm()
            // }
            if (this.mod_status === 'del') {
                this.delConfirm()
            }
        },
        switchConfirm() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status ? 1 : 0
            }

            let { url, method } = this.$api.dev_sys_bank_status_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    // this.mod_show = false
                }
                this.getList()
            })
        },
        delConfirm() {
            let data = { id: this.curr_row.id }

            let { url, method } = this.$api.dev_sys_bank_del
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.getList()
                }
            })
        },
        getCommandOpt() {
            let http_option = {
                url: this.$store.state.picPrefix + 'common/linter.json'
            }
            // 请求所有下拉路径
            this.$http(http_option).then(res => {
                if (res) {
                    console.log('🍞 res: ', res);
                    let bankList = res.system_banks_available.path
                    // 请求 命令集opt
                    if (bankList) {
                        let option = { url: bankList }
                        this.$http(option).then(result => {
                            console.log('😎 result: ', result);
                            if (result && Array.isArray(result)) {
                                this.bank_opt = result.map(item => {
                                    return {
                                        label: item.name,
                                        value: item.name
                                    }
                                })
                            }
                        })
                    }
                }
            })
            // 请求命令内容
        },
        getList() {
            let para = {
                name: this.filter.name,
                status: this.filter.status,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)

            let { url, method } = this.$api.dev_sys_bank_list
            this.$http({ method, url, params }).then(res => {
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
        this.getCommandOpt()
        this.getList()
    }
}
</script>

<style scoped>
.dia-maintain {
    padding: 0 150px;
}
.form > li {
    display: flex;
    align-items: baseline;
    position: relative;
    margin-top: 20px;
}
.form > li > span:first-child {
    min-width: 4.1em;
    margin-right: 10px;
    text-align: right;
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
.form-btns {
    margin-top: 50px;
    text-align: center;
}
.ml50 {
    margin-left: 50px;
}
</style>