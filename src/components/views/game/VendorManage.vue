<template>
    <div class="container">
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>游戏厂商</span>
                    <Input v-model="filter.vendor" />
                </li>
                <li>
                    <span>厂商状态</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
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
                    <!-- '编号', '游戏厂商', '厂商状态', '最后更新人','最后更新时间','操作' -->
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.name}}</td>
                    <!-- <td :class="[row.status===1?'green':'red']">{{status_txt[row.status]}}</td> -->
                    <td>
                        <Switchbox :value="row.status" @update="statusSwitch($event, row)" />
                    </td>
                    <td>{{row.last_editor && row.last_editor.name||'---'}}</td>
                    <td>{{row.updated_at||'---'}}</td>
                    <td>
                        <button class="btns-blue" @click="edit(row)">编辑</button>
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
        <Dialog :show="dia_show!==''" :title="dia_title" @close="dia_show=''">
            <!-- <Dialog :show="true" :title="dia_title" @close="dia_show=''"> -->
            <div class="dia-inner">
                <div class="edit-form">
                    <ul class="form">
                        <!-- <li>
                            <div class="left">
                                <span>厂商名称:</span>
                                <Input
                                    class="w250"
                                    :showerr="!form.name"
                                    errmsg="游戏名称不可为空!"
                                    v-model="form.name"
                                />
                            </div>
                            <div class="right">
                                <span>厂商标识:</span>
                                <Input
                                    class="w250"
                                    :showerr="!form.sign"
                                    errmsg="厂商标识不可为空!"
                                    v-model="form.sign"
                                />
                            </div>
                        </li>-->

                        <!-- <li>
                            <div>
                                <span>游戏类型:</span>
                                
                                <Select
                                    class="ml10 w250"
                                    v-model="form.type_id"
                                    :options="game_type_opt"
                                ></Select>
                                <span v-show="!form.type_id" class="err-tips">游戏类型不可为空</span>
                            </div>
                            <div>
                                <span>登录接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="!form.urls.login||!urlReg.test(form.urls.login)"
                                    errmsg="登录接口格式错误!"
                                    v-model="form.urls.login"
                                />
                            </div>
                        </li>-->
                        <!-- <li>
                            <span>白名单</span>
                            <Input class="w250" v-model="form.whitelist_ips" />
                        </li>-->
                        <li>
                            <div>
                                <span>查询余额接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="!form.urls.account_query_url||!urlReg.test(form.urls.account_query_url)"
                                    errmsg="查询余额接口格式错误!"
                                    v-model="form.urls.account_query_url"
                                />
                            </div>
                            <div>
                                <span>上分接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="!form.urls.top_up_url||!urlReg.test(form.urls.top_up_url)"
                                    errmsg="上分接口格式错误!"
                                    v-model="form.urls.top_up_url"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>下分接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="!form.urls.draw_out_url||!urlReg.test(form.urls.draw_out_url)"
                                    errmsg="下分接口格式错误!"
                                    v-model="form.urls.draw_out_url"
                                />
                            </div>
                            <div>
                                <span>查询订单接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="!form.urls.order_query_url||!urlReg.test(form.urls.order_query_url)"
                                    errmsg="查询订单接口格式错误"
                                    v-model="form.urls.order_query_url"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>查询玩家在线状态</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="!form.urls.user_active_query_url||!urlReg.test(form.urls.user_active_query_url)"
                                    errmsg="查询玩家在线状态格式错误"
                                    v-model="form.urls.user_active_query_url"
                                />
                            </div>
                            <div>
                                <span>查询游戏注单</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="!form.urls.game_order_query_url||!urlReg.test(form.urls.game_order_query_url)"
                                    errmsg="查询游戏注单格式错误"
                                    v-model="form.urls.game_order_query_url"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>查询玩家总分</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="!form.urls.user_total_status_query_url||!urlReg.test(form.urls.user_total_status_query_url)"
                                    errmsg="查询玩家总分格式错误"
                                    v-model="form.urls.user_total_status_query_url"
                                />
                            </div>
                            <div>
                                <span>踢玩家接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="!form.urls.kick_out_url||!urlReg.test(form.urls.kick_out_url)"
                                    errmsg="踢玩家接口格式错误"
                                    v-model="form.urls.kick_out_url"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>查询代理余额接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="!form.urls.agent_account_query_url||!urlReg.test(form.urls.agent_account_query_url)"
                                    errmsg="查询玩家总分格式错误"
                                    v-model="form.urls.agent_account_query_url"
                                />
                            </div>
                            <div>
                                <span>存放三方调用测试urls</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="!form.test_urls.login||!urlReg.test(form.test_urls.login)"
                                    errmsg="存放三方调用测试urls格式错误"
                                    v-model="form.test_urls.login"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>终端号</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="终端号不可为空"
                                    v-model="form.app_id"
                                />
                            </div>
                            <div>
                                <span>商户号:</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="商户号不可为空"
                                    v-model="form.merchant_id"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>商户秘钥:</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="商户秘钥不可为空"
                                    v-model="form.merchant_secret"
                                />
                            </div>
                            <div>
                                <span>公钥:</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="公钥不可为空"
                                    v-model="form.public_key"
                                />
                            </div>
                        </li>

                        <li>
                            <div>
                                <span>私钥:</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="私钥不可为空"
                                    v-model="form.private_key"
                                />
                            </div>
                            <div>
                                <span>des秘钥:</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="des秘钥不可为空"
                                    v-model="form.des_key"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>md5_key</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="md5_key不可为空"
                                    v-model="form.md5_key"
                                />
                            </div>
                            <div>
                                <span>白名单:</span>
                                <textarea
                                    class="textarea ml10"
                                    placeholder="格式例子: 2.2.2.2, 5.5.3.5"
                                    v-model="form.whitelist_ips"
                                ></textarea>
                                <span v-show="!form.whitelist_ips" class="err-tips">白名单不可为空</span>
                            </div>
                        </li>

                        <li>
                            <!-- <div>
                                <span>状态:</span>
                                <Radio
                                    class="radio-left ml50"
                                    label="开"
                                    :value="form.status"
                                    val="1"
                                    v-model="form.status"
                                />
                                <Radio
                                    class="radio-right ml10"
                                    label="关"
                                    :value="form.status"
                                    val="0"
                                    v-model="form.status"
                                />
                            </div>-->
                        </li>
                    </ul>
                    <div class="form-btns">
                        <button v-show="active!==1" class="btn-blue-large">上一步</button>
                        <!-- <button class="btn-blue-large" @click="next">下一步</button> -->
                        <button class="btn-plain-large" @click="dia_show=''">取消</button>
                        <button class="btn-blue-large ml50" @click="diaCfm">确定</button>
                    </div>
                </div>
                <!-- <div v-if="dia_show==='detail'" class="dia-detail">
                    <GameManageDetail :id="curr_row.id" />
                </div>-->
            </div>
        </Dialog>
        <Dialog :show="dia_show!==''" title="标题xxx" @close="dia_show=''">
            <el-steps :active="active" finish-status="success">
                <el-step title="厂商类型"></el-step>
                <el-step title="正式在密钥信息"></el-step>
                <el-step title="正式在其他接口信息"></el-step>
                <el-step title="测试站密钥信息"></el-step>
                <el-step title="测试站其他接口信息"></el-step>
                <el-step title="配置白名单信息"></el-step>
            </el-steps>
            <div class="edit-form">
                <ul v-if="active===0" class="form">
                    <li>
                        <div class="left">
                            <span>厂商名称:</span>
                            <Input
                                class="w250"
                                :showerr="!form.name"
                                errmsg="游戏名称不可为空!"
                                v-model="form.name"
                            />
                        </div>
                        <div class="right">
                            <span>厂商标识:</span>
                            <Input
                                class="w250"
                                :showerr="!form.sign"
                                errmsg="厂商标识不可为空!"
                                v-model="form.sign"
                            />
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>游戏类型:</span>
                            <Select
                                class="ml10 w250"
                                v-model="form.type_id"
                                :options="game_type_opt"
                            ></Select>
                            <span v-show="!form.type_id" class="err-tips">游戏类型不可为空</span>
                        </div>
                        <div>
                            <span>状态:</span>
                            <Radio
                                class="radio-left ml50"
                                label="开"
                                :value="form.status"
                                val="1"
                                v-model="form.status"
                            />
                            <Radio
                                class="radio-right ml10"
                                label="关"
                                :value="form.status"
                                val="0"
                                v-model="form.status"
                            />
                        </div>
                    </li>
                </ul>
            </div>
            <div class="form-btns">
                <button v-show="active!==0" class="btn-blue-large" @click="prevStep">上一步</button>
                <button v-if="active!==5" class="btn-blue-large" @click="nextStep">下一步</button>
                <!-- <button class="btn-plain-large" @click="dia_show=''">取消</button> -->
                <button v-else class="btn-blue-large ml50" @click="diaCfm">确定</button>
            </div>
        </Dialog>
        <!-- <Modal
            :show.sync="mod_show"
            title="厂商管理"
            :content="mod_cont"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>-->
    </div>
</template>

<script>
import { Steps, Step } from 'element-ui'

export default {
    name: 'VendorManage',
    components: {
        [Steps.name]: Steps,
        [Step.name]: Step
    },
    data() {
        return {
            urlReg: /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/,
            filter: {
                vendor: '',
                status: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '关闭', value: '0' },
                { label: '启用', value: '1' }
            ],
            status_txt: {
                '1': '开启',
                '0': '关闭'
            },

            total: 0,
            pageNo: 1,
            pageSize: 25,
            headers: [
                '编号',
                '游戏厂商',
                '厂商状态',
                '最后更新人',
                '最后更新时间',
                '操作'
            ],
            list: [],
            // dialog
            dia_show: 'TODO', // TODO:
            dia_status: '',
            dia_title: '',
            game_type_opt: [], // 游戏类型下拉框
            form: {
                name: '', // 厂商名称
                sign: '', // 厂商标识
                type_id: '', // 游戏类型id
                urls: {
                    login: '', // 登录接口
                    account_query_url: '', //查询余额接口
                    top_up_url: '', //上分接口
                    draw_out_url: '', // 下分接口
                    order_query_url: '', // 查询订单接口
                    user_active_query_url: '', //查询玩家在线状态
                    game_order_query_url: '', // 查询游戏注单
                    user_total_status_query_url: '', // 查询玩家总分
                    kick_out_url: '', // 踢玩家接口
                    agent_account_query_url: '' // 查询代理余额接口
                },
                test_urls: {
                    login: '' // 存放三方调用测试urls
                },
                app_id: '', //..终端号
                merchant_id: '', //商户号
                merchant_secret: '', // 商户秘钥
                public_key: '', // 公钥
                private_key: '', // 私钥
                des_key: '', // des 秘钥
                md5_key: '', // md5秘钥
                whitelist_ips: '', // 白名单
                status: '1' // 状态
            },
            // mod_show: false,
            // mod_cont: '',
            // 当前需要更改的 row对象
            curr_row: {},
            active: 0
        }
    },
    methods: {
        // 待改动
        statusSwitch(value, row) {
            // this.curr_row = row
            // this.mod_show = true
            // if (row.status === 1) {
            //     this.mod_cont = '是否确定禁用该厂商!'
            // } else {
            //     this.mod_cont = '是否确定启用该厂商!'
            // }
            this.switchConf(value, row)
        },

        add() {
            this.initForm()
            this.dia_show = 'add'
            this.dia_status = 'add'
            this.dia_title = '添加'
        },
        edit(row) {
            console.log('row: ', row)
            if (!row) return
            this.form = {
                name: row.name,
                sign: row.sign, // 厂商标识
                type_id: row.type_id, // 游戏类型id
                // whitelist_ips: '', //
                urls: {
                    login: row.urls && row.urls.login, // 登录接口
                    account_query_url: row.urls && row.urls.account_query_url, //查询余额接口
                    top_up_url: row.urls && row.urls.top_up_url, //上分接口
                    draw_out_url: row.urls && row.urls.draw_out_url, // 下分接口
                    order_query_url: row.urls && row.urls.order_query_url, // 查询订单接口
                    user_active_query_url:
                        row.urls && row.urls.user_active_query_url, //查询玩家在线状态
                    game_order_query_url:
                        row.urls && row.urls.game_order_query_url, // 查询游戏注单
                    user_total_status_query_url:
                        row.urls && row.urls.user_total_status_query_url, // 查询玩家总分
                    kick_out_url: row.urls && row.urls.kick_out_url, // 踢玩家接口
                    agent_account_query_url:
                        row.urls && row.urls.agent_account_query_url // 查询代理余额接口
                },
                test_urls: {
                    login: row.test_urls && row.test_urls.login // 存放三方调用测试urls
                },
                app_id: row.app_id, //..终端号
                merchant_id: row.merchant_id, //商户号
                merchant_secret: row.merchant_secret, // 商户秘钥
                public_key: row.public_key, // 公钥
                private_key: row.private_key, // 私钥
                des_key: row.des_key, // des 秘钥
                md5_key: row.md5_key, // md5秘钥
                status: row.status, // 状态
                whitelist_ips:
                    row.white_list && (row.white_list.ips || []).join(',') // 白名单
            }
            this.curr_row = row
            this.dia_show = 'edit'
            this.dia_status = 'edit'
            this.dia_title = '编辑'
        },
        switchConf(value, row) {
            let id = row.id
            let status = value ? 1 : 0

            let data = {
                id: id,
                status: status
            }
            let { url, method } = this.$api.game_vendor_status_set
            this.$http({
                method: method,
                url: url,
                data: data
            }).then(res => {
                if (res && res.code === '200') {
                    this.mod_show = false
                    this.$toast.success(res.message)
                }
                this.getList()
            })
        },
        checkForm() {
            // if (this.form.name === '') {
            //     return false
            // }
            return true
        },
        diaCfm() {
            if (!this.checkForm()) return
            // let data = window.all.tool.rmEmpty(this.form)
            // let { url, method } = this.$api.game_set
            // this.$http({ url, method, data }).then(res => {
            //     if (res && res.code === '200') {
            //         this.$toast.success(res.message)
            //         this.getList()
            //         this.dia_show = ''
            //     }
            // })
            if (this.dia_status === 'add') {
                this.addCfm()
            }
            if (this.dia_status === 'edit') {
                this.editCfm()
            }
        },
        addCfm() {
            console.log('添加')
            let data = {
                // id: this.curr_row.id,
                name: this.form.name,
                sign: this.form.sign, // 厂商标识
                type_id: this.form.type_id, // 游戏类型id
                urls: {
                    login: this.form.urls.login, // 登录接口
                    account_query_url: this.form.urls.account_query_url, //查询余额接口
                    top_up_url: this.form.urls.top_up_url, //上分接口
                    draw_out_url: this.form.urls.draw_out_url, // 下分接口
                    order_query_url: this.form.urls.order_query_url, // 查询订单接口
                    user_active_query_url: this.form.urls.user_active_query_url, //查询玩家在线状态
                    game_order_query_url: this.form.urls.game_order_query_url, // 查询游戏注单
                    user_total_status_query_url: this.form.urls
                        .user_total_status_query_url, // 查询玩家总分
                    kick_out_url: this.form.urls.kick_out_url, // 踢玩家接口
                    agent_account_query_url: this.form.urls
                        .agent_account_query_url // 查询代理余额接口
                },
                test_urls: {
                    login: this.form.test_urls.login // 存放三方调用测试urls
                },
                app_id: this.form.app_id, //..终端号
                merchant_id: this.form.merchant_id, //商户号
                merchant_secret: this.form.merchant_secret, // 商户秘钥
                public_key: this.form.public_key, // 公钥
                private_key: this.form.private_key, // 私钥
                des_key: this.form.des_key, // des 秘钥
                md5_key: this.form.md5_key, // md5秘钥
                status: this.form.status // 状态
            }
            if (this.form.whitelist_ips) {
                let str = this.form.whitelist_ips.replace('，', ',')
                str = str.replace(/\s+/g, '')
                data.whitelist_ips = JSON.stringify(str.split(','))
            }

            let { url, method } = this.$api.game_vendor_add
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = ''
                    this.getList()
                }
            })
        },
        editCfm() {
            console.log('编辑')
            let data = {
                id: this.curr_row.id,
                name: this.form.name,
                sign: this.form.sign, // 厂商标识
                type_id: this.form.type_id, // 游戏类型id
                urls: {
                    login: this.form.urls.login, // 登录接口
                    account_query_url: this.form.urls.account_query_url, //查询余额接口
                    top_up_url: this.form.urls.top_up_url, //上分接口
                    draw_out_url: this.form.urls.draw_out_url, // 下分接口
                    order_query_url: this.form.urls.order_query_url, // 查询订单接口
                    user_active_query_url: this.form.urls.user_active_query_url, //查询玩家在线状态
                    game_order_query_url: this.form.urls.game_order_query_url, // 查询游戏注单
                    user_total_status_query_url: this.form.urls
                        .user_total_status_query_url, // 查询玩家总分
                    kick_out_url: this.form.urls.kick_out_url, // 踢玩家接口
                    agent_account_query_url: this.form.urls
                        .agent_account_query_url // 查询代理余额接口
                },
                test_urls: {
                    login: this.form.test_urls.login // 存放三方调用测试urls
                },
                app_id: this.form.app_id, //..终端号
                merchant_id: this.form.merchant_id, //商户号
                merchant_secret: this.form.merchant_secret, // 商户秘钥
                public_key: this.form.public_key, // 公钥
                private_key: this.form.private_key, // 私钥
                des_key: this.form.des_key, // des 秘钥
                md5_key: this.form.md5_key, // md5秘钥
                status: this.form.status // 状态
            }
            if (this.form.whitelist_ips) {
                let str = this.form.whitelist_ips.replace('，', ',')
                str = str.replace(/\s+/g, '')
                data.whitelist_ips = JSON.stringify(str.split(','))
            }
            let { url, method } = this.$api.game_vendor_set
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = ''
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
        initForm() {
            this.form = {
                name: '', // 厂商名称
                sign: '', // 厂商标识
                type_id: '', // 游戏类型id
                whitelist_ips: '', //
                urls: {
                    login: '', // 登录接口
                    account_query_url: '', //查询余额接口
                    top_up_url: '', //上分接口
                    draw_out_url: '', // 下分接口
                    order_query_url: '', // 查询订单接口
                    user_active_query_url: '', //查询玩家在线状态
                    game_order_query_url: '', // 查询游戏注单
                    user_total_status_query_url: '', // 查询玩家总分
                    kick_out_url: '', // 踢玩家接口
                    agent_account_query_url: '' // 查询代理余额接口
                },
                test_urls: {
                    login: '' // 存放三方调用测试urls
                },
                app_id: '', //..终端号
                merchant_id: '', //商户号
                merchant_secret: '', // 商户秘钥
                public_key: '', // 公钥
                private_key: '', // 私钥
                des_key: '', // des 秘钥
                md5_key: '', // md5秘钥
                whitelist_ips: '', // 白名单
                status: '1' // 状态
            }
        },
        getGameTypeOpt() {
            let { url, method } = this.$api.game_sort_list
            this.$http({ method, url }).then(res => {
                // console.log('res: ', res)
                if (res && res.code === '200') {
                    // this.total = res.data.total
                    // this.list = res.data.data
                    let arr = res.data || []
                    this.game_type_opt = arr.map(item => {
                        return {
                            value: item.id,
                            label: item.name
                        }
                    })
                }
            })
        },
        prevStep() {
            this.active--
        },
        nextStep() {
            this.active++
        },
        getList() {
            let self = this
            let par = {
                name: this.filter.vendor,
                status: this.filter.status,
                pageSize: this.pageSize,
                page: this.pageNo
            }

            let params = window.all.tool.rmEmpty(par)
            // console.log('params: ', params)
            let { url, method } = this.$api.game_vendor_list
            this.$http({
                method: method,
                url: url,
                params: params
            }).then(res => {
                // console.log('%cres: ', 'color:red;font-size:18px;', res)
                if (res && res.code === '200') {
                    self.total = res.data.total
                    self.list = res.data.data
                }
            })
        },
    },
    mounted() {
        this.getList()
        this.getGameTypeOpt()
    }
}
</script>
<style scoped>
/* .table {
    margin-top: 20px;
} */
.edit-form {
    /* position: relative; */
    /* width: 700px; */
    /* height: 400px; */
    /* margin: 0 auto; */
    border: 1px solid #000;
}
.form {
    /* width: 650px; */
    margin: 0 auto;
}
.form > li {
    display: flex;
    /* position: relative; */
    align-items: baseline;
    margin-top: 20px;
}
.form > li > div {
    display: flex;
    position: relative;
    align-items: center;
}
.form > li > div:first-child {
    margin-right: 10px;
}
.form > li > div > span:first-child {
    width: 4em;
    text-align: right;
}

.form > li > div .v-input {
    margin-left: 10px;
}
/* .form > li > span:first-child {
    min-width: 4.1em;
    margin-right: 10px;
    margin-top: 20px;
    text-align: right;
} */
.err-tips {
    position: absolute;
    bottom: -16px;
    left: 7em;
    font-size: 12px;
    color: rgb(255, 38, 0);
}
/* .w250 {
    width: 250px;
} */
.form-btns {
    margin-top: 50px;
    text-align: center;
}
.textarea {
    width: 250px;
    height: 100px;
}
</style>