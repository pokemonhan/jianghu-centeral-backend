<template>
    <div class="container">
        <!-- 游戏管理配置  开发管理-->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>游戏分类</span>
                    <Select input v-model="filter.type_id" :options="type_opt"></Select>
                </li>
                <li>
                    <span>游戏厂商</span>
                    <Select v-model="filter.vendor_id" :options="vendor_opt"></Select>
                </li>

                <li>
                    <span>游戏名称</span>
                    <Select
                        input
                        v-model="filter.game_id"
                        :options="game_name_opt"
                        @update="gameNameUpd"
                    ></Select>
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
                    <!-- '编号', '游戏厂商', '游戏名称', '游戏分类', '游戏标识', '游戏状态', '添加人', '添加时间', '最后更新人', '最后更新时间', '操作' -->
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.vendor_name}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.type+' - '+row.sub_type}}</td>
                    <td>{{row.sign}}</td>

                    <td>
                        <Switchbox v-model="row.status" @update="statusSwitch(row)" />
                    </td>
                    <td>{{row.author||'---'}}</td>
                    <td>{{row.created_at||'---'}}</td>
                    <td>{{row.last_editor||'---'}}</td>
                    <td>{{row.updated_at||'---'}}</td>
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
                                    :options="vendor_opt.filter(item=>item.value!=='')"
                                    @update="formVendorUpd"
                                ></Select>
                                <span v-show="!form.vendor_id" class="err-tips">必填项!</span>
                            </li>
                            <li>
                                <span>游戏父类:</span>
                                <Select
                                    style="width:250px;"
                                    disabled
                                    v-model="form.type_id"
                                    :options="type_opt.filter(item=>item.value)"
                                ></Select>
                            </li>

                            <li>
                                <span>游戏子类</span>
                                <Select
                                    style="width:250px"
                                    input
                                    required
                                    errmsg="请选择子类"
                                    v-model="form.game_id"
                                    :options="game_child_opt"
                                ></Select>
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
                                    val="2"
                                    v-model="form.request_mode"
                                />
                            </li>
                            <!-- <li>
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
                                <Input
                                    class="w250"
                                    placeholder="格式:  http://baidu.com"
                                    v-model="form.test_in_game_url"
                                />
                                <span
                                    v-show="form.test_in_game_url&&(!urlRegExp.test(form.test_in_game_url))"
                                    class="err-tips"
                                >请检查内容格式!</span>
                            </li>
                            <li>
                                <span>额度转换测试地址:</span>
                                <Input
                                    class="w250"
                                    placeholder="格式:  http://baidu.com"
                                    v-model="form.test_conver_url"
                                />
                                <span
                                    v-show="form.test_conver_url&&(!urlRegExp.test(form.test_conver_url))"
                                    class="err-tips"
                                >请检查内容格式!</span>
                            </li>

                            <li>
                                <span>检查余额测试地址:</span>
                                <Input
                                    class="w250"
                                    placeholder="格式:  http://baidu.com"
                                    v-model="form.test_check_balance_url"
                                />
                                <span
                                    v-show="form.test_check_balance_url&&(!urlRegExp.test(form.test_check_balance_url))"
                                    class="err-tips"
                                >请检查内容格式!</span>
                            </li>
                            <li>
                                <span>检查订单测试地址:</span>
                                <Input
                                    class="w250"
                                    placeholder="格式:  http://baidu.com"
                                    v-model="form.test_check_order_url"
                                />
                                <span
                                    v-show="form.test_check_order_url&&(!urlRegExp.test(form.test_check_order_url))"
                                    class="err-tips"
                                >请检查内容格式!</span>
                            </li>
                            <li>
                                <span>活动注单测试地址:</span>
                                <Input
                                    class="w250"
                                    placeholder="格式:  http://baidu.com"
                                    v-model="form.test_get_station_order_url"
                                />
                                <span
                                    v-show="form.test_get_station_order_url&&(!urlRegExp.test(form.test_get_station_order_url))"
                                    class="err-tips"
                                >请检查内容格式!</span>
                            </li>-->
                        </ul>
                        <!-- form 右侧 -->
                        <ul class="form ml20">
                            <li>
                                <span>游戏标识:</span>
                                <Input class="w250" limit="word" v-model="form.sign" />
                                <span v-show="!form.sign" class="err-tips">不可为空!</span>
                            </li>
                            <li>
                                <span>游戏名称:</span>
                                <Input class="w250" v-model="form.name" />
                                <span v-show="!form.name" class="err-tips">不可为空!</span>
                            </li>
                            <!-- <li>
                                <span>商户公钥:</span>
                                <Input class="w250" v-model="form.public_key" />
                            </li>

                            <li>
                                <span>APPID:</span>
                                <Input class="w250" v-model="form.app_id" />
                            </li>
                            <li>
                                <span>进入游戏地址:</span>
                                <Input
                                    class="w250"
                                    placeholder="格式:  http://baidu.com"
                                    v-model="form.in_game_url"
                                />
                                <span
                                    v-show="!urlRegExp.test(form.in_game_url)"
                                    class="err-tips"
                                >请检查内容格式!</span>
                            </li>
                            <li>
                                <span>额度转换地址:</span>
                                <Input
                                    class="w250"
                                    placeholder="格式:  http://baidu.com"
                                    v-model="form.conver_url"
                                />
                                <span
                                    v-show="!urlRegExp.test(form.conver_url)"
                                    class="err-tips"
                                >请检查内容格式!</span>
                            </li>
                            <li>
                                <span>检查余额地址:</span>
                                <Input
                                    class="w250"
                                    placeholder="格式:  http://baidu.com"
                                    v-model="form.check_balance_url"
                                />
                                <span
                                    v-show="!urlRegExp.test(form.check_balance_url)"
                                    class="err-tips"
                                >请检查内容格式!</span>
                            </li>
                            <li>
                                <span>检查订单地址:</span>
                                <Input class="w250" v-model="form.check_order_url" />
                                <span
                                    v-show="!urlRegExp.test(form.check_order_url)"
                                    class="err-tips"
                                >请检查内容格式!</span>
                            </li>
                            <li>
                                <span>获取注单地址:</span>
                                <Input
                                    class="w250"
                                    placeholder="格式:  http://baidu.com"
                                    v-model="form.get_station_order_url"
                                />
                                <span
                                    v-show="!urlRegExp.test(form.get_station_order_url)"
                                    class="err-tips"
                                >请检查内容格式!</span>
                            </li>-->

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
</template>
<script>
import tool from '../../../js/tool'
export default {
    name: 'GameManaConfig',
    data() {
        return {
            filter: {
                game_id: '',
                vendor_id: '',
                type_id: ''
            },
            // game_name_opt: [], // 游戏名称
            vendor_opt: [],
            // vendor_obj: {},
            /** 游戏父类 游戏主类 */
            type_opt: [], // 游戏父类
            type_obj: {},
            // game_child_opt: [], // 游戏子类
            game_sort_obj: {},
            headers: [
                '编号',
                '游戏厂商',
                '游戏名称',
                '游戏分类',
                '游戏标识',
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
            form: {
                vendor_id: '', // 厂商选择
                sign: '', // 游戏标识
                type_id: '', // 游戏分类
                game_id: '', // 游戏子类
                name: '', // 游戏名称
                request_mode: '1', // 请求模式
                status: '1' // 状态选择
            },
            urlRegExp: /^https?:\/\/([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+/,
            sort_opt: [{ label: '全部', value: '' }],

            // mod 禁用删除框
            mod_show: false,
            mod_status: '',
            mod_title: '',
            mod_cont: ''
        }
    },
    computed: {
        /**游戏名称 */
        game_name_opt() {
            return this.getMatchOpt(this.filter.vendor_id, this.vendor_opt)
        },
        /**游戏子类 */
        game_child_opt() {
            return this.getMatchOpt(this.form.vendor_id, this.vendor_opt)
        }
    },
    methods: {
        initForm() {
            this.form = {
                vendor_id: '', // 厂商选中
                sign: '', // 游戏标识
                type_id: '', // 游戏分类
                name: '', // 游戏名称
                game_id: '', // 游戏子类
                request_mode: '1', // 请求模式
                status: '1' // 状态选择
            }
        },
        checkForm() {
            // let regExp = /^https?:\/\/([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+/
            let errInform = {
                vendor_id: {
                    title: '厂商选择'
                },
                sign: {
                    title: '游戏标识'
                },
                type_id: {
                    title: '游戏分类'
                },
                name: {
                    title: '游戏名称'
                },
                // in_game_url: {
                //     title: '进入游戏地址',
                //     regExp: regExp
                // },
                // conver_url: {
                //     title: '额度转换地址',
                //     regExp: regExp
                // },
                // check_balance_url: {
                //     title: '检查余额地址',
                //     regExp: regExp
                // },
                // check_order_url: {
                //     title: '检查订单地址',
                //     regExp: regExp
                // },
                // get_station_order_url: {
                //     title: '获取注单地址',
                //     regExp: regExp
                // },
                request_mode: {
                    title: '请求模式'
                },
                status: {
                    title: '状态选择'
                }
            }
            for (const key in errInform) {
                if (this.form[key] === '') {
                    this.$toast.info(`${errInform[key].title}不可为空`)
                    return false
                }
            }
            return true
        },
        /** 游戏厂商更新 */
        formVendorUpd(id) {
            this.form.game_id = ''
            // this.game_child_opt = this.getMatchOpt(id, this.vendor_opt)
            this.form.type_id = ''
            this.type_opt.forEach(item => {
                if (item.children && item.children.length) {
                    let vendor_obj = item.children[0]
                    if (vendor_obj.value === id) {
                        this.form.type_id = item.value
                    }
                }
            })
        },
        /**根据厂商id 找 游戏主类id */
        VendorIdFindType(vendor_id) {
            let type_id
            this.type_opt.forEach(item => {
                if (item.children && item.children.length) {
                    let vendor_obj = item.children[0]
                    if (vendor_obj.value === vendor_id) {
                        type_id = item.value
                    }
                }
            })
            return type_id
        },
        gameNameUpd(val) {
            let vendor_arr = this.vendor_opt.find(item => {
                let isHad = (item.children || []).find(child => {
                    return child.value === val
                })
                return isHad
            })
            this.filter.vendor_id = vendor_arr.value // 设置游戏厂商
            this.filter.type_id = this.VendorIdFindType(this.filter.vendor_id)
        },
        add() {
            this.initForm()
            this.dia_title = '添加'
            this.dia_status = 'add'
            this.dia_show = true
        },
        edit(row) {
            console.log('🍬 row: ', row)
            this.form = {
                id: row.id,
                vendor_id: row.vendor_id,
                sign: row.sign,
                type_id: row.type_id,
                name: row.name,
                game_id: row.game_id,
                request_mode: row.request_mode,
                status: row.status
            }
            this.dia_status = 'edit'
            this.dia_title = '编辑'
            this.dia_show = true
        },
        statusSwitch(row) {
            this.curr_row = row
            // this.mod_status = 'switch'
            // this.mod_title = row.status === 1 ? '禁用' : '启用'
            // this.mod_cont = `是否确定${this.mod_title}该游戏名称？`
            // this.mod_show = true
            this.switchStatus()
        },
        del(row) {
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该游戏名称？'
            this.mod_show = true
        },
        /** dialog确认 */
        diaCfm() {
            if (this.dia_status === 'add') {
                this.addCfm()
            }
            if (this.dia_status === 'edit') {
                this.editCfm()
            }
        },

        addCfm() {
            if (!this.checkForm()) return
            let data = {
                type_id: this.form.type_id,
                game_id: this.form.game_id,
                vendor_id: this.form.vendor_id,
                name: this.form.name,
                sign: this.form.sign,
                request_mode: this.form.request_mode,
                status: this.form.status
            }
            data = window.all.tool.rmEmpty(data)
            let { url, method } = this.$api.dev_game_add
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },
        editCfm() {
            if (!this.checkForm()) return
            let data = Object.assign(this.form)
            if (data.request_mode) {
                data.request_mode = parseInt(data.request_mode)
            }
            data = window.all.tool.rmEmpty(data)
            let { url, method } = this.$api.dev_game_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },
        // mod 确认
        modConf() {
            // if (this.mod_status === 'switch') {
            //     this.switchStatus()
            // }
            if (this.mod_status === 'del') {
                this.delCfm()
            }
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
        switchStatus() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status ? 1 : 0
            }
            let { url, method } = this.$api.dev_game_status_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    // this.mod_show = false
                }
                this.getList()
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
        // 这个名字就是value //
        // gameToSelectOpt(arr) {
        //     let array = [
        //         {
        //             label: '全部',
        //             value: ''
        //         }
        //     ]
        //     let opt = arr.map(item => {
        //         return { label: item.name, value: item.name }
        //     })
        //     return array.concat(opt)
        // },
        /**
         * 更具value获取 匹配的值
         */
        getMatchOpt(val, father_arr = []) {
            let arr = []
            father_arr.forEach(father => {
                if (father.value === val || !val) {
                    if (father.children && Array.isArray(father.children)) {
                        father.children.forEach(child => {
                            // 设置 游戏子类
                            arr.push(child)
                        })
                    }
                }
            })
            return arr
        },
        /** 获取下拉框内容 */
        getSelectOpt() {
            tool.getJsonOpt('game_vendors__games').then(res => {
                if (res && Array.isArray(res)) {
                    this.vendor_opt = [{ label: '全部', value: '' }]
                    res.forEach(item => {
                        let children = []
                        if (item.games_under_vendor) {
                            children = item.games_under_vendor.map(child => {
                                return { label: child.name, value: child.id }
                            })
                        }
                        this.vendor_opt.push({
                            label: item.name,
                            value: item.id,
                            children: children
                        })
                    })
                    // this.game_name_opt = this.getMatchOpt('', this.vendor_opt)
                }
            })
            // 游戏分类, 游戏父类 设置
            tool.getJsonOpt('game_type_vendors').then(res => {
                if (res && Array.isArray(res)) {
                    // self.type_opt = []
                    this.type_opt = [{ label: '全部', value: '' }]
                    // this.vendor_obj = {}

                    res.forEach(item => {
                        let children = []
                        if (item.vendors) {
                            children = item.vendors.map(child => {
                                return { label: child.name, value: child.id }
                            })
                        }
                        this.type_opt.push({
                            label: item.name,
                            value: item.id,
                            children: children
                        })
                    })
                    // console.log('🍎 this.vendor_opt: ', this.type_opt)
                }
            })
        },
        /** 获取游戏分类 opt */
        getGameOpt() {
            let { url, method } = this.$api.game_sort_list
            this.$http({ method, url }).then(res => {
                if (res && res.code === '200') {
                    // this.game_sort_obj =
                    if (res.data && Array.isArray(res.data)) {
                        res.data.forEach(item => {
                            let opt = []
                            if (item.children && Array.isArray(item.children)) {
                                opt = item.children.map(child => {
                                    return {
                                        label: child.name,
                                        value: child.id
                                    }
                                })
                            }
                            /** 根据 父级id放置 子类 */
                            this.game_sort_obj[item.id] = opt
                        })
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
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
                }
            })
        }
    },
    created() {
        // this.getGameOpt()
        this.getSelectOpt()
        // this.initOpt()
    },
    mounted() {
        this.getList()
        this.initForm()
    }
}
</script>

<style scoped>
/* dia-inner 有全局样式 */
.dia-inner {
    padding: 50px 50px;
}
.dia-detail {
    display: flex;
}

.form > li {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 25px;
}
.form > li > span:first-child {
    width: 6em;
}
.err-tips {
    position: absolute;
    top: 30px;
    left: 7em;
    color: rgb(255, 51, 0);
}
/* .w250 {
    width: 250px;
} */
/* .ml50 {
    margin-left: 50px;
} */
/* .ml20 {
    margin-left: 20px;
} */
.center-box {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}
</style>