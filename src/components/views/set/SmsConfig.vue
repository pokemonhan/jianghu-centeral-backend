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
                    <Date v-model="filter.dates[1]" /> -->
                    <Date type="daterange" v-model="filter.dates" />
                </li>
                <li>
                    <span>启用状态:</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td class="td-2">{{row.merchant_code}}</td>
                    <td>{{row.sms_num}}</td>
                    <td>{{row.admin&&row.admin.name}}</td>
                    <td>{{row.updated_at}}</td>
                    <td
                        :class="[row.status?'green':'red']"
                    >{{row.status===1?'开启':row.status===0?'关闭':'???'}}</td>
                    <td>{{row.created_at}}</td>
                    <td>
                        <button class="btns-blue" @click="edit(row)">编辑</button>
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
        <Dialog :show.sync="dia_show" title="编辑">
            <div class="dia-inner">
                <ul class="form">
                    <li>
                        <span>商户名称</span>
                        <Input class="w250" v-model="form.name" />
                        <span class="err-tips" v-show="!form.name">商户名称不可为空!</span>
                    </li>
                    <li>
                        <span>商户标识</span>
                        <Input class="w250" disabled v-model="form.sign" />
                    </li>
                    <li>
                        <span>商户号</span>
                        <Input class="w250" v-model="form.merchant_code" />
                        <span class="err-tips" v-show="!form.merchant_code">商户号不可为空!</span>
                    </li>
                    <li>
                        <span>商户密钥</span>
                        <Input class="w250" v-model="form.merchant_secret" />
                        <span class="err-tips" v-show="!form.merchant_secret">商户密钥不可为空!</span>
                    </li>
                    <li>
                        <span>商户公钥</span>
                        <Input class="w250" v-model="form.public_key" />
                        <span class="err-tips" v-show="!form.public_key">商户公钥不可为空!</span>
                    </li>
                    <li>
                        <span>短信数量</span>
                        <Input class="w250" limit="p-integer" v-model="form.sms_num" />
                        <span class="err-tips" v-show="!form.sms_num">短信不可为空!</span>
                    </li>
                    <li>
                        <span>授权码</span>
                        <Input class="w250" limit="en-num" v-model="form.authorization_code" />
                        <span class="err-tips" v-show="!form.authorization_code">授权码不可为空!</span>
                    </li>
                    <li>
                        <span>请求地址</span>
                        <Input class="w250" v-model="form.url" />
                        <span class="err-tips" v-show="!form.url">请求地址不可为空!</span>
                    </li>
                </ul>
                <div class="form-btn">
                    <button class="btn-plain-large" @click="dia_show=false">取消</button>
                    <button class="btn-blue-large ml30" @click="diaCfm">确认</button>
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
            headers: [
                {
                    label: '编号',
                    width: '200px'
                },
                '商户号',
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
                merchant_code: '',
                merchant_secret: '',
                public_key: '',
                sms_num: '',
                authorization_code: '',
                url: ''
            },
            // mod 确认框
            mod_show: false,
            mod_status: '',
            mod_title: '',
            mod_cont: ''
        }
    },
    methods: {
        edit(row) {
            // console.log('row: ', row)
            this.curr_row = row
            this.dia_status = 'edit'
            this.dia_show = true
            this.form = {
                id: row.id, // id
                sign: row.sign,
                name: row.name,
                merchant_code: row.merchant_code,
                merchant_secret: row.merchant_secret,
                public_key: row.public_key,
                sms_num: String(row.sms_num),
                authorization_code: row.authorization_code,
                url: row.url
            }
            // console.log('form', this.form)
        },

        statusSwitch(row) {
            this.curr_row = row
            this.mod_status = 'switch'
            if (row.status === 1) {
                this.mod_title = '禁用'
                this.mod_cont = '是否确定禁用该厂商!'
            } else {
                this.mod_title = '启用'
                this.mod_cont = '是否确定启用该厂商!'
            }
            this.mod_show = true
        },
        del(row) {
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该短信产商？'
            this.mod_show = true
        },
        diaCfm() {
            if (this.dia_status === 'edit') {
                this.editCfm()
            }
        },
        checkForm() {
            let checkArr = ['name','merchant_code', 'merchant_secret', 'public_key','sms_num','authorization_code','url']
            let pass = true
            checkArr.forEach(key => {
                if(this.form[key]==='') {
                    pass = false
                    this.$toast.warning('请检查表单内容!')
                    
                }
            })
            
            return pass
            
        },
        editCfm() {
            if(!this.checkForm()) return
            let data = {
                id: this.form.id,
                name: this.form.name,
                merchant_code: this.form.merchant_code,
                merchant_secret: this.form.merchant_secret,
                public_key: this.form.public_key,
                sms_num: this.form.sms_num,
                authorization_code: this.form.authorization_code,
                url: this.form.url
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
        switchCfm() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status === 1 ? 0 : 1
            }

            let { url, method } = this.$api.sms_config_status_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
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
            let para = {
                name: this.filter.name,
                
                
                status: this.filter.status,

                pageSize: this.pageSize,
                page: this.pageNo
            }
                console.log('para: ', para);
            if(this.filter.dates[0]&&this.filter.dates[1]){
                para.updatedAt = JSON.stringify(this.filter.dates)
            }
            let params = window.all.tool.rmEmpty(para)

            console.log('params: ', params);

            let { url, method } = this.$api.sms_config_list
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
        this.getList()
    }
}
</script>

<style scoped>

.mt20 {
    margin-top: 20px;
}
.form {
    /* border: 1px solid #000; */
    padding: 20px 190px;
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
.ml30 {
    margin-left: 50px;
}
</style>