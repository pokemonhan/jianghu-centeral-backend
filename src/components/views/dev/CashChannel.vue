<template>
    <div class="container">
        <!-- 金流通道配置 -->

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>厂商名称</span>
                    <Select style="width:150px;" v-model="filter.vendor_id" :options="vendor_opt" @update="vendorUpd"></Select>
                </li>
                <li>
                    <span>分类名称</span>
                    <Select style="width:150px;" v-model="filter.type_id" :options="type_opt" @update="typeUpd"></Select>
                </li>
                <li>
                    <span>通道名称</span>
                    <Select style="width:150px;" v-model="filter.channel_id" :options="channel_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-blue" @click="add">添加通道</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.vendor &&row.vendor.name}}</td>
                    <td>{{row.type&&row.type.name}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.sign}}</td>
                    <td>{{row.author&&row.author.name}}</td>
                    <td>{{row.created_at}}</td>
                    <td>{{row.last_editor&&row.last_editor.name}}</td>
                    <td>{{row.updated_at}}</td>
                    <td
                        :class="[row.status?'green':'red']"
                    >{{row.status===1?'开启':row.status===0?'关闭':'--'}}</td>
                    <td>
                        <button class="btns-blue" @click="edit(row)">编辑</button>
                        <button :class="[row.status?'btns-red':'btns-green']" @click="statusSwitch(row)">{{row.status===1?'禁用':'启用'}}</button>

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
        <Dialog :show.sync="dia_show" :title="dia_status==='add'?'添加':'编辑'">
            <div class="dia-inner">
                <div class="dia-maintain">
                    <ul class="form">
                        <li>
                            <span>选择厂商:</span>
                            <Select class="w250" v-model="form.vendor_id" :options="vendor_opt"></Select>
                            <span v-show="form.vendor_id===''" class="err-tips">请选择厂商</span>
                        </li>
                        <li>
                            <span>选择分类:</span>
                            <Select class="w250" v-model="form.type_id" :options="type_opt"></Select>
                            <span v-show="form.type_id===''" class="err-tips">请选择分类</span>
                        </li>
                        <li>
                            <span>通道名称:</span>
                            <Input class="w250" v-model="form.name" />
                            <span v-show="!form.name" class="err-tips">通道名称不可为空</span>
                        </li>
                        <li>
                            <span>通道标记:</span>
                            <Input class="w250" v-model="form.sign" />
                            <span v-show="!form.sign" class="err-tips">通道标记不可为空</span>
                        </li>
                        <li>
                            <span>请求模式:</span>

                            <Radio
                                class="radio-left"
                                label="直接跳转"
                                :value="form.request_mode"
                                val="0"
                                v-model="form.request_mode"
                            />

                            <Radio
                                class="radio-right ml50"
                                label="获取数据模式"
                                :value="form.request_mode"
                                val="1"
                                v-model="form.request_mode"
                            />
                        </li>
                        <li>
                            <span>请求地址:</span>
                            <Input
                                class="w250"
                                placeholder="例如:http://baidu.com"
                                v-model="form.request_url"
                            />
                            <!-- <span v-show="!form.request_url" class="err-tips">请求地址不可为空</span> -->
                             <span
                                    v-show="!urlRegExp.test(form.request_url)"
                                    class="err-tips"
                                >请检查内容格式!</span>
                        </li>
                        <li>
                            <span>银行码:</span>
                            <Input class="w250" v-model="form.banks_code" />
                        </li>
                        <li>
                            <span>描述:</span>
                            <textarea class="textarea" v-model="form.desc"></textarea>
                        </li>
                        <li v-if="dia_status==='add'">
                            <span>状态选择:</span>
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
                    </ul>
                    <div class="form-btns">
                        <button class="btn-plain-large" @click="dia_show=false">取消</button>
                        <button class="btn-blue-large ml50" @click="diaConf">确定</button>
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
</template>

<script>
export default {
    name: 'CashChannel',
    data() {
        return {
            selectOpt: {},
            filter: {
                channel_id: '',
                vendor_id: '',
                type_id: ''
            },
            vendor_opt: [],
            type_opt: [],
            channel_opt: [],

            headers: [ '编号', '厂商名称', '分类名称', '通道名称', '通道标识', '添加人', '添加时间', '最后更新人', '最后更新时间', '状态', '操作' ],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            // 添加， 编辑dialog
            dia_show: false,
            dia_status: '',
            curr_row: {},
            form: {
                vendor_id: '',
                type_id: '',
                name: '',
                sign: '',
                request_mode: '0',
                request_url: '',
                banks_code: '',
                desc: '',
                status: '1'
            },
            urlRegExp : /^https?:\/\/([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+/,
            // modal 确认modal
            mod_show: false,
            mod_status: '',
            mod_title: '',
            mod_cont: ''
        }
    },

    methods: {
        // 后台数组转为 select_opt 数组
        toSelectOpt(arr) {
            let array = [{ label: '全部', value: '' }]
            let opt = arr.map(item => {
                return { label: item.name, value: item.id }
            })
            return array.concat(opt)
        },
        getSelectOpt() {
            let { url, method } = this.$api.dev_finance_channel_search_condition

            this.$http({ method, url }).then(res => {
                if (res && res.code === '200') {
                    this.selectOpt = res.data
                    this.channel_opt = this.toSelectOpt(res.data.channels)
                    this.vendor_opt = this.toSelectOpt(res.data.vendors)
                    this.type_opt = this.toSelectOpt(res.data.types)
                }
            })
        },
        vendorUpd() {
            if(this.filter.vendor_id === '') return
            this.filterChannel()
        },
        typeUpd() {
            if(this.filter.type_id === '') return
            this.filterChannel()
        },
        // 根据厂商,分类已选内容,筛选通道名称
        filterChannel() {
            let vendor_id = this.filter.vendor_id
            let type_id = this.filter.type_id
            let opt = this.selectOpt.channels.filter(item => {

                // 条件一：等于该厂商或者厂商id为空时 && 条件二：等于该游戏分类或者该分类筛选为空时
                return (item.vendor_id === vendor_id || vendor_id==='') && (item.type_id ===type_id ||type_id==='')
            })
            this.channel_opt = this.toSelectOpt(opt)

        },
        initForm() {
            this.form = {
                vendor_id: '',
                type_id: '',
                name: '',
                sign: '',
                request_mode: '0',
                request_url: '',
                banks_code: '',
                desc: '',
                status: '1'
            }
        },
        add() {
            this.initForm()
            this.dia_status = 'add'
            this.dia_show = true
        },
        edit(row) {
            // console.log('row: ', row)
            this.form = {
                id: row.id,
                vendor_id: row.vendor_id,
                type_id: row.type_id,
                name: row.name,
                sign: row.sign,
                request_mode: String(row.request_mode),
                request_url: row.request_url,
                banks_code: row.banks_code,
                desc: row.desc,
                status: String(row.status)
            }
            this.dia_status = 'edit'
            this.dia_show = true
        },
        statusSwitch(row) {
            this.curr_row = row
            this.mod_status = 'switch'
            this.mod_title = row.status === 1 ? '禁用' : '启用'
            this.mod_cont = `是否确定${this.mod_title}该通道名称？`
            this.mod_show = true
        },
        del(row) {
            this.curr_row = row
            this.mod_show = true
            this.mod_status = 'del'
            this.mod_cont = '是否确定删除该通道名称？'
        },
        diaConf() {
            if (this.dia_status === 'add') {
                this.addConfirm()
            }
            if (this.dia_status === 'edit') {
                this.editConfirm()
            }
        },
        checkForm() {
            let requireArr = [
                'vendor_id',
                'type_id',
                'name',
                'sign',
                'request_url'
            ]
            for (const key in this.form) {
                if (this.form[key] === '') {
                    if (requireArr.indexOf(key) !== -1) {
                        // console.log(key,'呵呵')
                        return false
                    }
                }
            }
            return true
        },
        addConfirm() {
            if (!this.checkForm()) return
            // let data = {
            //     vendor_id: this.form.vendor_id,
            //     type_id: this.form.type_id,
            //     name: this.form.name,
            //     sign: this.form.sign,
            //     request_mode: this.form.request_mode,
            //     request_url: this.form.request_url,
            //     banks_code: this.form.banks_code,
            //     desc: this.form.desc,
            //     status: this.form.status
            // }
            let data = this.form

            data = window.all.tool.rmEmpty(data)
            let { url, method } = this.$api.dev_finance_channel_add
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
        editConfirm() {
            if (!this.checkForm()) return
            let data = this.form
            data = window.all.tool.rmEmpty(data)
            // console.log('data: ', data)
            let { url, method } = this.$api.dev_finance_channel_set
            this.$http({ method, url, data }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
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
            if (this.mod_status === 'del') {
                this.delCfm()
            }
        },
        switchCfm() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status ? 0 : 1
            }

            let { url, method } = this.$api.dev_finance_channel_status_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.getList()
                }
            })
        },
        delCfm() {
            let data = { id: this.curr_row.id }

            let { url, method } = this.$api.dev_finance_channel_del
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
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
        getList() {
            let para = {
                channel_id: this.filter.channel_id,
                vendor_id: this.filter.vendor_id,
                type_id: this.filter.type_id,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)

            let { url, method } = this.$api.dev_finance_channel_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
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
        }
    },
    mounted() {
        this.getSelectOpt()
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
.form .w250 {
    width: 250px;
}
.form-btns {
    margin-top: 50px;
    text-align: center;
}
.ml50 {
    margin-left: 50px;
}
/* table-page .textarea 部分样式为全局样式 */
.textarea {
    width: 250px;
    height: 80px;
}
.err-tips {
    position: absolute;
    left: 7em;
    top: 32px;
    color: red;
    font-size: 12px;
}
</style>