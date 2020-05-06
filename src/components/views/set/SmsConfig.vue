<template>
    <div class="container">
        <!-- 短信配置 -->

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>更新人</span>
                    <Input v-model="filter.name" />
                </li>
                <li>
                    <span>更新日期</span>
                    <!-- <Date v-model="filter.dates[0]" />
                    <span style="margin:0 5px;">~</span>
                    <Date v-model="filter.dates[1]" />-->
                    <Date type="daterange" v-model="filter.dates" />
                </li>
                <li>
                    <span>启用状态:</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-blue ml10" @click="add">添加</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <!-- '商户号', '短信条数', '最后更新人', '最后更新时间', '启用状态', '添加时间', '操作' -->
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td class="td-2">{{row.name}}</td>
                    <td>{{row.sms_remaining}}</td>
                    <td>{{row.admin&&row.admin.name}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>
                        <Switchbox v-model="row.status" @update="statusSwitch(row)" />
                    </td>
                    <td>{{row.created_at}}</td>
                    <td>
                        <button class="btns-blue" @click="edit(row)">编辑</button>
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
                <ul class="form">
                    <li>
                        <span>商户名称</span>
                        <Input class="w250" v-model="form.name" />
                        <span class="err-tips" v-show="!form.name">商户名称不可为空!</span>
                    </li>
                    <li>
                        <span>商户标识</span>
                        <Input
                            class="w250"
                            :disabled="dia_status==='edit'"
                            required
                            errmsg="商户标识不可为空!"
                            v-model="form.sign"
                        />
                    </li>

                    <li v-if="dia_status==='add'">
                        <span>短信数量</span>
                        <Input
                            class="w250"
                            required
                            errmsg="短信不可为空!"
                            limit="p-integer"
                            v-model="form.sms_num"
                        />
                    </li>
                    <li v-if="dia_status==='edit'">
                        <span>短信数量</span>
                        <Select v-model="form.is_increase" :options="increase_opt"></Select>
                        <Input
                            class="ml10"
                            style="width:129px"
                            :showerr="smsErr(form.crease)"
                            errmsg="减少数量太大"
                            limit="p-integer"
                            v-model="form.crease"
                        />
                    </li>
                    <li v-if="dia_status==='edit'">
                        <div class="form-curr-sms">当前短信数量: {{form.sms_remaining}}</div>
                    </li>
                </ul>
                <div class="form-btn">
                    <button class="btn-plain-large" @click="dia_show=false">取消</button>
                    <button class="btn-blue-large ml50" @click="diaCfm">确认</button>
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
    name: 'SmsConfig',
    data() {
        return {
            filter: {
                name: '',
                dates: [],
                status: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' }
            ],
            increase_opt: [
                { label: '增加', value: 1 },
                { label: '减少', value: 2 }
            ],
            headers: [
                {
                    label: '编号',
                    width: '200px'
                },
                '商户名称',
                '短信条数',
                '最后更新人',
                '最后更新时间',
                '启用状态',
                '添加时间',
                '操作'
            ],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25,
            /* table 编辑dialog内容 */
            curr_row: {},
            dia_show: false,
            dia_status: '',
            form: {
                name: '',
                sign: '',
                is_increase: 1,
                crease: 0,
                sms_num: ''
            },
            // mod 确认框
            mod_show: false,
            mod_status: '',
            mod_title: '',
            mod_cont: ''
        }
    },
    methods: {
        smsErr(val) {
            // 是否是减少
            let isDecrease = this.form.is_increase === 2
            if (
                isDecrease &&
                parseInt(val) > parseInt(this.form.sms_remaining)
            ) {
                return true
            } else {
                return false
            }
        },
        add() {
            this.form = {
                name: '',
                sign: '',
                is_increase: 1,
                sms_num: ''
            }
            this.dia_status = 'add'
            this.dia_show = true
        },

        edit(row) {
            // console.log('row: ', row)
            this.curr_row = row
            this.dia_status = 'edit'
            this.dia_show = true
            this.form = {
                id: row.id, // id
                name: row.name,
                sign: row.sign,
                is_increase: 1,
                crease: 0,
                sms_remaining: row.sms_remaining
                // sms_num: String(row.sms_num)
            }
        },

        statusSwitch(row) {
            this.curr_row = row
            this.switchCfm()
        },
        del(row) {
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该短信产商？'
            this.mod_show = true
        },
        diaCfm() {
            if (this.dia_status === 'add') {
                this.addCfm()
            }
            if (this.dia_status === 'edit') {
                this.editCfm()
            }
        },
        checkForm() {
            let checkArr = ['name', 'sign', 'sms_num']
            let pass = true
            checkArr.forEach(key => {
                if (this.form[key] === '') {
                    pass = false
                }
            })
            // if(this.dia_status==='edit'){

            // }
            if (!pass) {
                this.$toast.warning('请检查表单内容!')
            }
            return pass
        },
        addCfm() {
            if (!this.checkForm()) return
            let data = {
                name: this.form.name,
                sms_num: this.form.sms_num,
                sign: this.form.sign
            }
            let { url, method } = this.$api.sms_config_add
            this.$http({ method, url, data }).then(res => {
                // console.log('列表: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },
        editCfm() {
            if (!this.checkForm()) return
            let data = {
                id: this.form.id,
                name: this.form.name,
                is_increase: this.form.is_increase,
                sms_num: this.form.crease || 0 // 增加减少值
            }

            let { url, method } = this.$api.sms_config_set
            this.$http({ method, url, data }).then(res => {
                // console.log('列表: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.dia_show = false
                    this.getList()
                }
            })
        },

        modConf() {
            // if (this.mod_status === 'switch') {
            //     this.switchCfm()
            // }
            if (this.mod_status === 'del') {
                this.delCfm()
            }
        },
        switchCfm() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status ? 1 : 0
            }

            let { url, method } = this.$api.sms_config_status_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    // this.mod_show = false
                    // this.dia_show = false
                }
                this.getList()
            })
        },
        delCfm() {
            let data = {
                id: this.curr_row.id
            }

            let { url, method } = this.$api.sms_config_del
            this.$http({ method, url, data }).then(res => {
                // console.log('列表: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.dia_show = false
                    this.getList()
                }
            })
        },

        getList() {
            let data = {
                name: this.filter.name,
                status: this.filter.status,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            if (this.filter.dates[0] && this.filter.dates[1]) {
                data.updated_at = JSON.stringify(this.filter.dates)
            }
            data = window.all.tool.rmEmpty(data)


            let { url, method } = this.$api.sms_config_list
            this.$http({ method, url, data }).then(res => {
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
.form {
    padding: 20px 50px;
}
.form > li {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 20px;
}
.form > li > span:first-child {
    width: 4.4em;
    text-align: right;
    margin-right: 10px;
}

.err-tips {
    position: absolute;
    top: 30px;
    left: 7em;
    color: red;
    font-size: 12px;
}
.form-btn {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
.form-curr-sms {
    margin-left: 170px;
    margin-top: -5px;
}
</style>