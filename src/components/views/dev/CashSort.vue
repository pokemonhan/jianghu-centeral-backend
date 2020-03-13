<template>
    <div class="container">
        <!-- 金流分类管理 -->

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>分类名称</span>
                    <Input v-model="filter.name" />
                </li>
                <li>
                    <span>分类状态</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-blue" @click="add">添加分类</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.sign}}</td>
                    <td>{{row.author&&row.author.name}}</td>
                    <td>{{row.created_at}}</td>
                    <td>{{row.last_editor&&row.last_editor.name}}</td>
                    <td>{{row.updated_at}}</td>
                    <!-- <td
                        :class="[row.status?'green':'red']"
                    >{{row.status===1?'启用':row.status===0?'关闭':'???'}}</td>-->
                    <td>
                        <Switchbox v-model="row.status" @update="statusSwitch(row)" />
                    </td>
                    <td>
                        <button class="btns-blue" @click="edit(row)">编辑</button>
                        <!-- <button
                            :class="[row.status?'btns-red':'btns-green']"
                            @click="statusSwitch(row)"
                        >{{row.status===1?'禁用':'启用'}}</button>-->
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
                            <span>分类名称:</span>
                            <Input class="w250" v-model="form.name" />
                        </li>
                        <li>
                            <span>分类标识:</span>
                            <Input class="w250" limit="word" v-model="form.sign" />
                        </li>
                        <li>
                            <span>金流方向:</span>
                            <Radio
                                class="radio-left"
                                label="入款"
                                :value="form.direction"
                                val="1"
                                v-model="form.direction"
                            />
                            <Radio
                                class="radio-right ml40"
                                label="出款"
                                :value="form.direction"
                                val="0"
                                v-model="form.direction"
                            />
                        </li>
                        <li>
                            <span>是否上线:</span>
                            <Radio
                                class="radio-left"
                                label="线上"
                                :value="form.is_online"
                                val="1"
                                v-model="form.is_online"
                            />
                            <Radio
                                class="radio-right ml40"
                                label="线下"
                                :value="form.is_online"
                                val="0"
                                v-model="form.is_online"
                            />
                        </li>
                        <li v-if="dia_status==='add'">
                            <span>选择状态:</span>
                            <Radio
                                class="radio-left"
                                label="启用"
                                :value="form.status"
                                val="1"
                                v-model="form.status"
                            />
                            <Radio
                                class="radio-right ml40"
                                label="禁用"
                                :value="form.status"
                                val="0"
                                v-model="form.status"
                            />
                        </li>
                    </ul>
                    <div class="center-box mt50">
                        <button class="btn-plain-large" @click="dia_show=false">取消</button>
                        <button class="btn-blue-large ml40" @click="diaCfm">确认</button>
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
    name: 'CashSort',
    data() {
        return {
            filter: {
                name: '',
                status: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '启用', value: '1' },
                { label: '关闭', value: '0' }
            ],
            headers: [
                '编号',
                '分类名称',
                '分类标识',
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

            // 添加-编辑 dialog
            curr_row: {},
            dia_show: false,
            dia_title: '',
            form: {
                name: '',
                sign: '',
                direction: '1',
                is_online: '1',
                status: '1'
            },
            dia_status: '',

            // 确认
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
                direction: '1',
                is_online: '1',
                status: '1'
            }
        },
        add() {
            this.dia_status = 'add'
            this.dia_title = '添加'
            this.initForm()
            this.dia_show = true
        },
        edit(row) {
            this.form = {
                id: row.id,
                name: row.name,
                sign: row.sign,
                direction: String(row.direction),
                is_online: String(row.is_online),
                status: String(row.status)
            }
            this.dia_status = 'edit'

            this.dia_title = '编辑'
            this.dia_show = true
        },
        statusSwitch(row) {
            this.curr_row = row
            // this.mod_status = 'switch'

            // this.mod_title = row.status === 1 ? '禁用' : '启用'
            // this.mod_cont = `是否确认${this.mod_title}该分类!`
            // this.mod_show = true
            this.switchCfm()
        },
        del(row) {
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_title = '删除'
            this.mod_cont = '是否删除该分类名称'
            this.mod_show = true
        },
        //dialog confirm
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
                this.$toast.warning('分类名称不可为空!')
                return false
            }
            if (this.form.sign === '') {
                this.$toast.warning('分类标识不可为空!')
                return false
            }
            return true
        },
        addConfirm() {
            if (!this.checkForm()) return
            let data = {
                name: this.form.name,
                sign: this.form.sign,
                is_online: this.form.is_online,
                direction: this.form.direction,
                status: this.form.status
            }

            let { url, method } = this.$api.dev_finance_sort_add
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },
        EditConfirm() {
            if (!this.checkForm()) return
            let data = {
                id: this.form.id,
                name: this.form.name,
                sign: this.form.sign,
                is_online: this.form.is_online,
                direction: this.form.direction,
                status: this.form.status
            }

            let { url, method } = this.$api.dev_finance_sort_set
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

            let { url, method } = this.$api.dev_finance_sort_status_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    // this.mod_show = false
                }
                this.getList()
            })
        },
        delCfm() {
            let data = {
                id: this.curr_row.id
            }

            let { url, method } = this.$api.dev_finance_sort_del
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.getList()
                } else {
                    if (res && res.message !== '') {
                        // this.$toast.error(res.message)
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

            let { url, method } = this.$api.dev_finance_sort_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
                }
            })
        }
    },
    created() {
        this.getList()
    },
    mounted() {}
}
</script>
<style scoped>
/* dialog */
.dia-inner {
    padding: 0 200px;
}
.form > li {
    display: flex;
    align-items: center;
    margin-top: 20px;
}
.form > li > span:first-child {
    margin-right: 10px;
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
.ml40 {
    margin-left: 40px;
}
.mt50 {
    margin-top: 50px;
}
.center-box {
    display: flex;
    justify-content: center;
}
</style>