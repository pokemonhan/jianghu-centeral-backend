<template>
    <div class="container">
        <!-- 游戏管理配置 -->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>游戏名称</span>
                    <Select v-model="filter.game_id" :options="geme_type_opt"></Select>
                </li>
                <li>
                    <span>游戏厂商</span>
                    <Select v-model="filter.vendor_id" :options="vendor_opt"></Select>
                </li>
                <li>
                    <span>游戏分类</span>
                    <Select v-model="filter.type_id" :options="type_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-blue" @click="add">添加</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.vendor&&row.vendor.name}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.type&&row.type.name}}</td>
                    <td>{{row.sign}}</td>
                    <td>{{row.app_id}}</td>
                    <td
                        :class="['bold',row.status?'green':'red']"
                    >{{row.status===1?'开启':row.status===0?'关闭':'???'}}</td>
                    <td>{{row.author&&row.author.name}}</td>
                    <td>{{row.created_at}}</td>
                    <td>{{row.last_editor&&row.last_editor.name}}</td>
                    <td>{{row.updated_at}}</td>
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
        <Dialog :show.sync="dia_show" :title="dia_title">
            <div class="dia-inner">
                <div>
                    <div class="dia-detail">
                        <!-- form 左侧 -->
                        <ul class="form">
                            <li>
                                <span>厂商选择:</span>
                                <Select
                                    style="width:250px;"
                                    v-model="form.vendor_id"
                                    :options="vendor_opt"
                                ></Select>
                            </li>
                            <li>
                                <span>游戏分类:</span>
                                <Select
                                    style="width:250px;"
                                    v-model="form.type_id"
                                    :options="type_opt"
                                ></Select>
                            </li>
                            <li>
                                <span>商户密钥:</span>
                                <Input class="w250" v-model="form.merchant_secret" />
                            </li>
                            <li>
                                <span>商户号:</span>
                                <Input class="w250" v-model="form.merchant_code" />
                            </li>
                            <li>
                                <span>商户私钥:</span>
                                <Input class="w250" v-model="form.private_key" />
                            </li>
                            <li>
                                <span>授权码:</span>
                                <Input class="w250" v-model="form.authorization_code" />
                            </li>

                            <li>
                                <span>进入游戏测试地址:</span>
                                <Input class="w250" v-model="form.test_in_game_url" />
                            </li>
                            <li>
                                <span>额度测试地址:</span>
                                <Input class="w250" v-model="form.test_conver_url" />
                            </li>

                            <li>
                                <span>检查余额测试地址:</span>
                                <Input class="w250" v-model="form.test_check_balance_url" />
                            </li>
                            <li>
                                <span>检查订单测试地址:</span>
                                <Input class="w250" v-model="form.test_check_order_url" />
                            </li>
                            <li>
                                <span>活动注单测试地址:</span>
                                <Input class="w250" v-model="form.test_get_station_order_url" />
                            </li>
                        </ul>
                        <!-- form 右侧 -->
                        <ul class="form ml20">
                            <li>
                                <span>游戏标识:</span>
                                <Input class="w250" v-model="form.sign" />
                            </li>
                            <li>
                                <span>游戏名称:</span>
                                <Input class="w250" v-model="form.name" />
                            </li>
                            <li>
                                <span>商户公钥:</span>
                                <Input class="w250" v-model="form.public_key" />
                            </li>

                            <li>
                                <span>APPID:</span>
                                <Input class="w250" v-model="form.app_id" />
                            </li>
                            <li>
                                <span>进入游戏地址:</span>
                                <Input class="w250" v-model="form.in_game_url" />
                            </li>
                            <li>
                                <span>额度地址:</span>
                                <Input class="w250" v-model="form.conver_url" />
                            </li>
                            <li>
                                <span>检查余额地址:</span>
                                <Input class="w250" v-model="form.check_balance_url" />
                            </li>
                            <li>
                                <span>检查订单地址:</span>
                                <Input class="w250" v-model="form.check_order_url" />
                            </li>
                            <li>
                                <span>获取注单地址:</span>
                                <Input class="w250" v-model="form.get_station_order_url" />
                            </li>
                            <li>
                                <span>请求模式:</span>

                                <Radio
                                    label="获取数据模式"
                                    :value="form.request_mode"
                                    val="1"
                                    v-model="form.request_mode"
                                />

                                <Radio
                                    class="ml50"
                                    label="直接跳转"
                                    :value="form.request_mode"
                                    val="0"
                                    v-model="form.request_mode"
                                />
                            </li>
                            <li v-if="dia_status==='add'">
                                <span>状态选择</span>
                                <Radio
                                    label="启用"
                                    :value="form.status"
                                    val="1"
                                    v-model="form.status"
                                />
                                <Radio
                                    class="ml50"
                                    label="禁用"
                                    :value="form.status"
                                    val="0"
                                    v-model="form.status"
                                />
                            </li>
                        </ul>
                    </div>
                    <div class="center-box">
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
    data() {
        return {
            filter: {
                game_id: '',
                vendor_id: '',
                type_id: ''
            },
            geme_type_opt: [],
            vendor_opt: [],
            type_opt: [],
            headers: [
                '编号',
                '游戏厂商',
                '游戏名称',
                '游戏分类',
                '游戏标识',
                'APPID',
                '游戏状态',
                '添加人',
                '添加时间',
                '最后更新人',
                '最后更新时间',
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
            form: {},
            sort_opt: [{ label: '全部', value: '' }],

            // mod 禁用删除框
            mod_show: false,
            mod_title: '',
            mod_cont: ''
        }
    },
    methods: {
        initForm() {
            this.form = {
                vendor_id: '', // 厂商选中
                sign: '', // 游戏标识
                type_id: '', // 游戏分类
                name: '', // 游戏名称

                merchant_secret: '', // 商户密钥
                public_key: '', // 商户公钥
                merchant_code: '', //商户号码
                private_key: '', // 商户私钥
                app_id: '',

                authorization_code: '', //授权码
                in_game_url: '', // 进入游戏地址
                test_in_game_url: '', // 进入游戏测试地址
                conver_url: '', // 额度转换地址 额度地址
                test_conver_url: '', // 额度测试地址
                check_balance_url: '', //检查余额地址
                test_check_balance_url: '', //检查余额测试地址
                check_order_url: '', // 检查订单地址
                test_check_order_url: '', // 检查订单测试地址
                get_station_order_url: '', // 获取注单地址
                test_get_station_order_url: '', // 活动注单测试地址
                request_mode: '1', // 请求模式
                status: '1' // 状态选择
            }
        },
        add() {
            this.initForm()
            this.dia_title = '添加'
            this.dia_status = 'add'
            this.dia_show = true
        },
        edit(row) {
            console.log('row: ', row)
            // this.curr_row = row
           
            this.form = {
				id: row.id,
				vendor_id: row.vendor_id, 
				sign: row.sign,
				type_id: row.type_id,
				name: row.name,

				merchant_secret: row.merchant_secret,
				public_key: row.public_key,
				merchant_code: row.merchant_code,
				private_key: row.private_key,
				app_id: row.app_id,

				authorization_code: row.authorization_code, 
				in_game_url: row.in_game_url,
				test_in_game_url: row.test_in_game_url,
				conver_url: row.conver_url,
				test_conver_url: row.test_conver_url,
				check_balance_url: row.check_balance_url, 
				test_check_balance_url: row.test_check_balance_url, 
				check_order_url: row.check_order_url, 
				test_check_order_url: row.test_check_order_url, 
				get_station_order_url: row.get_station_order_url, 
				test_get_station_order_url: row.test_get_station_order_url, 
                // request_mode,
                status: row.status
            }
            this.form.request_mode = String(row.request_mode)
            this.dia_status = 'edit'
            this.dia_title = '编辑'
            this.dia_show = true
        },
        statusSwitch(row) {
            this.curr_row = row
            this.mod_status = 'switch'
            this.mod_title = row.status === 1 ? '禁用' : '启用'
            this.mod_cont = `是否确定${this.mod_title}该游戏名称？`
            this.mod_show = true
        },
        del(row) {
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该游戏名称？'
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
        addCfm() {
            let data = {
                type_id: this.form.type_id,
                vendor_id: this.form.vendor_id,
                name: this.form.name,
                sign: this.form.sign,
                request_mode: this.form.request_mode,

                conver_url: this.form.conver_url,
                test_conver_url: this.form.test_conver_url,
                check_balance_url: this.form.check_balance_url,
                test_check_balance_url: this.form.test_check_balance_url,
                check_order_url: this.form.check_order_url,

                test_check_order_url: this.form.test_check_order_url,
                in_game_url: this.form.in_game_url,
                test_in_game_url: this.form.test_in_game_url,
                get_station_order_url: this.form.get_station_order_url,
                test_get_station_order_url: this.form .test_get_station_order_url,

                status: this.form.status,
                app_id: this.form.app_id,
                authorization_code: this.form.authorization_code,
                merchant_code: this.form.merchant_code,
                merchant_secret: this.form.merchant_secret,

                public_key: this.form.public_key,
                private_key: this.form.private_key
            }
            console.log('检查')
            let { url, method } = this.$api.dev_game_add
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
        editCfm() {
            let data = this.form

            let { url, method } = this.$api.dev_game_set
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.getList()
                }
            })
        },
        modConf() {
            if (this.mod_status === 'switch') {
                this.switchStatus()
            }
            if (this.mod_status === 'del') {
                this.delCfm()
            }
        },
        switchStatus() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status === 1 ? 0 : 1
            }
            let { url, method } = this.$api.dev_game_status_set
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
            let { url, method } = this.$api.dev_game_del
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.getList()
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
        toSelectOpt(arr) {
            let array = [{ label: '全部', value: '' }]
            let opt = arr.map(item => {
                return { label: item.name, value: item.id }
            })
            return array.concat(opt)
        },
        // 这个名字就是value // TODO:
        gameToSelectOpt(arr) {
            let array = [
                {
                    label: '全部',
                    value: ''
                }
            ]
            let opt = arr.map(item => {
                return { label: item.name, value: item.name }
            })
            return array.concat(opt)
        },
        getSelectOpt() {
            let { url, method } = this.$api.dev_game_search_condition_get

            this.$http({ method, url }).then(res => {
                console.log('select列表: ', res)
                if (res && res.code === '200') {
                    this.geme_type_opt = this.toSelectOpt(res.data.games)

                    this.vendor_opt = this.toSelectOpt(res.data.vendors)
                    this.type_opt = this.toSelectOpt(res.data.types)
                    // 初始化 filter 筛选内容
                } else {
                    if (res && res.message !== '') {
                        this.$toast.error(res.message)
                    }
                }
            })
        },
        getList() {
            let para = {
                game_id: this.filter.game_id,
                vendor_id: this.filter.vendor_id,
                type_id: this.filter.type_id,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)

            let { url, method } = this.$api.dev_game_list
            this.$http({ method, url, params }).then(res => {
                console.log('游戏管理配置列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
                }
            })
        }
    },
    created() {
        this.getSelectOpt()
    },
    mounted() {
        this.getList()
        this.initForm()
    }
}
</script> <style scoped>
.w100 {
    width: 100px;
}
.p10 {
    padding: 10px;
}
.mt20 {
    margin-top: 20px;
}
/* dia-inner全局样式 */
.dia-inner {
    padding: 0 50px;
}
.dia-detail {
    display: flex;
}

.form > li {
    display: flex;
    align-items: center;
    margin-top: 20px;
}
.form > li > span:first-child {
    width: 9em;
}
.w250 {
    width: 250px;
}
.ml50 {
    margin-left: 50px;
}
.ml20 {
    margin-left: 20px;
}
.center-box {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}
</style>