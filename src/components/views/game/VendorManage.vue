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
        </div>xxx
        <Dialog :show="dia_show!==''" :title="dia_title" @close="dia_show=''">
            <el-steps :active="active" align-center finish-status="success">
                <el-step class="pointer" title="厂商" description="厂商类型" @click.native="active=0"></el-step>
                <el-step class="pointer" title="正式站" description="密钥信息" @click.native="active=1"></el-step>
                <el-step class="pointer" title="正式站" description="其他接口" @click.native="active=2"></el-step>
                <el-step
                    class="pointer"
                    title="测试站"
                    description="密钥信息"
                    :status="stepStatus(3)"
                    @click.native="active=3"
                ></el-step>
                <el-step
                    class="pointer"
                    title="测试站"
                    description="其他接口"
                    :status="stepStatus(4)"
                    @click.native="active=4"
                ></el-step>
                <el-step
                    class="pointer red"
                    title="白名单"
                    description="白名单信息"
                    @click.native="active=5"
                ></el-step>
            </el-steps>
            <div class="edit-form">
                <!-- 厂商类型 -->
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
                                required
                                errmsg="游戏类型不可为空"
                                :options="game_type_opt"
                            ></Select>
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
                <!-- 正式站密钥信息 -->
                <ul v-if="active===1" class="form">
                    <li>
                        <div>
                            <span>第三方urls</span>
                            <Input
                                class="w250"
                                placeholder="例如: http://abc.com"
                                :showerr="isShowErrUrl(form.prod_prefix,false)"
                                errmsg="urls格式错误"
                                v-model="form.prod_prefix"
                            />
                        </div>
                        <div>
                            <span>des秘钥</span>
                            <Input class="w250" v-model="form.production.des_key" />
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>终端号</span>
                            <Input
                                class="w250"
                                required
                                errmsg="终端号不可为空"
                                v-model="form.production.app_id"
                            />
                        </div>
                        <div>
                            <span>商户号:</span>
                            <Input
                                class="w250"
                                required
                                errmsg="商户号不可为空"
                                v-model="form.production.merchant_id"
                            />
                        </div>
                    </li>
                    <li>
                        <div class="form-line">
                            <p>商户秘钥</p>
                            <div class="line"></div>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>商户秘钥</span>
                            <Input
                                class="w250"
                                :required="formalKeyShow"
                                errmsg="商户秘钥不可为空"
                                v-model="form.production.merchant_secret"
                            />
                        </div>
                    </li>
                    <li>
                        <div class="form-line">
                            <p>公钥 + 私钥</p>
                            <div class="line"></div>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>公钥:</span>
                            <Input
                                class="w250"
                                :required="formalKeyShow"
                                errmsg="公钥不可为空"
                                v-model="form.production.public_key"
                            />
                        </div>
                        <div>
                            <span>私钥</span>
                            <Input
                                class="w250"
                                :required="formalKeyShow"
                                errmsg="私钥不可为空"
                                v-model="form.production.private_key"
                            />
                        </div>
                    </li>
                    <li>
                        <div class="form-line">
                            <p>md5_key</p>
                            <div class="line"></div>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>md5_key</span>
                            <Input
                                class="w250"
                                :required="formalKeyShow"
                                errmsg="md5_key不可为空"
                                v-model="form.production.md5_key"
                            />
                        </div>
                    </li>
                </ul>

                <!-- 正式站其他接口 -->
                <ul v-if="active===2" class="form form-2">
                    <li>
                        <div>
                            <span style="width:11em">是否以正式地址为准</span>
                            <Switchbox
                                class="ml20"
                                v-model="isAddFormalUrl"
                                @update="formalSwitchChange"
                            />
                            <div></div>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>登录接口</span>
                            <Input
                                class="w250"
                                placeholder="例如: http://abc.com"
                                :showerr="isShowErrUrl(form.production.url.login)"
                                errmsg="登录接口格式错误!"
                                v-model="form.production.url.login"
                            />
                        </div>
                        <div>
                            <span>查询代理余额接口</span>
                            <Input
                                class="w250"
                                placeholder="例如: http://abc.com"
                                :showerr="isShowErrUrl(form.production.url.agent_account_query_url)"
                                errmsg="查询代理余额接口格式错误"
                                v-model="form.production.url.agent_account_query_url"
                            />
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>查询余额接口</span>
                            <Input
                                class="w250"
                                placeholder="例如: http://abc.com"
                                :showerr="isShowErrUrl(form.production.url.account_query_url)"
                                errmsg="查询余额接口格式错误!"
                                v-model="form.production.url.account_query_url"
                            />
                        </div>
                        <div>
                            <span>上分接口</span>
                            <Input
                                class="w250"
                                placeholder="例如: http://abc.com"
                                :showerr="isShowErrUrl(form.production.url.top_up_url)"
                                errmsg="上分接口格式错误!"
                                v-model="form.production.url.top_up_url"
                            />
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>下分接口</span>
                            <Input
                                class="w250"
                                placeholder="例如: http://abc.com"
                                :showerr="isShowErrUrl(form.production.url.draw_out_url)"
                                errmsg="下分接口格式错误!"
                                v-model="form.production.url.draw_out_url"
                            />
                        </div>
                        <div>
                            <span>查询订单接口</span>
                            <Input
                                class="w250"
                                placeholder="例如: http://abc.com"
                                :showerr="isShowErrUrl(form.production.url.order_query_url)"
                                errmsg="查询订单接口格式错误"
                                v-model="form.production.url.order_query_url"
                            />
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>查询玩家在线状态</span>
                            <Input
                                class="w250"
                                placeholder="例如: http://abc.com"
                                :showerr="isShowErrUrl(form.production.url.user_active_query_url)"
                                errmsg="查询玩家在线状态格式错误"
                                v-model="form.production.url.user_active_query_url"
                            />
                        </div>
                        <div>
                            <span>查询游戏注单</span>
                            <Input
                                class="w250"
                                placeholder="例如: http://abc.com"
                                :showerr="isShowErrUrl(form.production.url.game_order_query_url)"
                                errmsg="查询游戏注单格式错误"
                                v-model="form.production.url.game_order_query_url"
                            />
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>查询玩家总分</span>
                            <Input
                                class="w250"
                                placeholder="例如: http://abc.com"
                                :showerr="isShowErrUrl(form.production.url.user_total_status_query_url)"
                                errmsg="查询玩家总分格式错误"
                                v-model="form.production.url.user_total_status_query_url"
                            />
                        </div>
                        <div>
                            <span>踢玩家接口</span>
                            <Input
                                class="w250"
                                placeholder="例如: http://abc.com"
                                :showerr="isShowErrUrl(form.production.url.kick_out_url)"
                                errmsg="踢玩家接口格式错误"
                                v-model="form.production.url.kick_out_url"
                            />
                        </div>
                    </li>
                    <li></li>
                </ul>

                <!-- 测试站密钥信息 -->
                <div v-if="active===3" style="min-height:450px">
                    <div class="mt20">
                        <Checkbox label="是否需要配置测试站信息" v-model="form_need_test" />
                    </div>
                    <ul v-if="form_need_test" class="form">
                        <li>
                            <div>
                                <span>测试站第三方urls</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="isShowErrUrl(form.test_urls,false)"
                                    errmsg="存放三方调用测试urls格式错误"
                                    v-model="form.test_urls"
                                />
                            </div>
                            <div>
                                <span>des秘钥</span>
                                <Input class="w250" v-model="form.testing.des_key" />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>终端号</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="终端号不可为空"
                                    v-model="form.testing.app_id"
                                />
                            </div>
                            <div>
                                <span>商户号:</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="商户号不可为空"
                                    v-model="form.testing.merchant_id"
                                />
                            </div>
                        </li>
                        <li>
                            <div class="form-line">
                                <p>商户秘钥</p>
                                <div class="line"></div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>商户秘钥</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="商户秘钥不可为空"
                                    v-model="form.testing.merchant_secret"
                                />
                            </div>
                        </li>
                        <li>
                            <div class="form-line">
                                <p>公钥 + 私钥</p>
                                <div class="line"></div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>公钥:</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="公钥不可为空"
                                    v-model="form.testing.public_key"
                                />
                            </div>
                            <div>
                                <span>私钥</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="私钥不可为空"
                                    v-model="form.testing.private_key"
                                />
                            </div>
                        </li>
                        <li>
                            <div class="form-line">
                                <p>md5_key</p>
                                <div class="line"></div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>md5_key</span>
                                <Input
                                    class="w250"
                                    required
                                    errmsg="md5_key不可为空"
                                    v-model="form.testing.md5_key"
                                />
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 测试站其他接口 -->
                <div v-if="active===4">
                    <ul v-if="form_need_test" class="form form-2">
                        <li>
                            <div>
                                <span>是否以测试地址为准</span>
                                <Switchbox
                                    class="ml20"
                                    v-model="isAddTestUrl"
                                    @update="testSwitchChange"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>登录接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="isShowErrUrl()"
                                    errmsg="登录接口格式错误!"
                                    v-model="form.testing.url.login"
                                />
                            </div>
                            <div>
                                <span>查询代理余额接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="isShowErrUrl()"
                                    errmsg="查询查询代理余额接口格式错误"
                                    v-model="form.testing.url.account_query_url"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>查询余额接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="isShowErrUrl()"
                                    errmsg="查询余额接口格式错误!"
                                    v-model="form.testing.url.account_query_url"
                                />
                            </div>
                            <div>
                                <span>上分接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="isShowErrUrl()"
                                    errmsg="上分接口格式错误!"
                                    v-model="form.testing.url.top_up_url"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>下分接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="isShowErrUrl()"
                                    errmsg="下分接口格式错误!"
                                    v-model="form.testing.url.draw_out_url"
                                />
                            </div>
                            <div>
                                <span>查询订单接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="isShowErrUrl()"
                                    errmsg="查询订单接口格式错误"
                                    v-model="form.testing.url.order_query_url"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>查询玩家在线状态</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="isShowErrUrl()"
                                    errmsg="查询玩家在线状态格式错误"
                                    v-model="form.testing.url.user_active_query_url"
                                />
                            </div>
                            <div>
                                <span>查询游戏注单</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="isShowErrUrl()"
                                    errmsg="查询游戏注单格式错误"
                                    v-model="form.testing.url.game_order_query_url"
                                />
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>查询玩家总分</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="isShowErrUrl()"
                                    errmsg="查询玩家总分格式错误"
                                    v-model="form.testing.url.user_total_status_query_url"
                                />
                            </div>
                            <div>
                                <span>踢玩家接口</span>
                                <Input
                                    class="w250"
                                    placeholder="例如: http://abc.com"
                                    :showerr="isShowErrUrl()"
                                    errmsg="踢玩家接口格式错误"
                                    v-model="form.testing.url.kick_out_url"
                                />
                            </div>
                        </li>
                        <li></li>
                    </ul>
                </div>
                <ul v-if="active===5" class="form">
                    <li>
                        <div>
                            <span>白名单</span>
                            <Input class="w250" v-model="form.whitelist_ips" />
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
            // status_txt: {
            //     '1': '开启',
            //     '0': '关闭'
            // },

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
            dia_show: '', // TODO:
            dia_status: '',
            dia_title: '',
            game_type_opt: [], // 游戏类型下拉框

            isAddFormalUrl: '', //是否以正式地址为准 添加正式地址
            isAddTestUrl: '', //是否以测试地址为准 添加测试地址
            form_need_test: true, // 是否需要配置测试站
            form: {
                name: '', // 厂商名称
                sign: '', // 厂商标识
                type_id: '', // 游戏类型id
                status: '1', // 状态
                prod_prefix: '', // 正式 第三方urls
                production: {
                    des_key: '',
                    app_id: '',
                    merchant_id: '',
                    merchant_secret: '',
                    public_key: '',
                    private_key: '',
                    md5_key: '',
                    url: {
                        login: '',
                        agent_account_query_url: '',
                        account_query_url: '',
                        top_up_url: '',
                        draw_out_url: '',
                        order_query_url: '',
                        user_active_query_url: '',
                        game_order_query_url: '',
                        user_total_status_query_url: '',
                        kick_out_url: ''
                    }
                },
                test_urls: '', // 测试第三方urls
                testing: {
                    des_key: '',
                    app_id: '',
                    merchant_id: '',
                    merchant_secret: '',
                    public_key: '',
                    private_key: '',
                    md5_key: '',
                    url: {
                        login: '',
                        agent_account_query_url: '',
                        account_query_url: '',
                        top_up_url: '',
                        draw_out_url: '',
                        order_query_url: '',
                        user_active_query_url: '',
                        game_order_query_url: '',
                        user_total_status_query_url: '',
                        kick_out_url: ''
                    }
                },
                isAddFormalUrl: '', // 是否以正式地址为准
                whitelist_ips: '' // 白名单
            },
            // mod_show: false,
            // mod_cont: '',
            /** 当前需要更改的 row对象 */

            curr_row: {},
            active: 0
        }
    },
    computed: {
        /** 正式站 （1）商户密钥。（2）公钥+私钥  (3) md5_key 必有一个 */
        formalKeyShow() {
            let key_one = !!this.form.merchant_secret // 商户秘钥
            let key_two = !!this.form.public_key && !!this.form.private_key // 商户秘钥
            let key_three = !!this.form.md5_key // 商户秘钥
            if (key_one || key_two || key_three) {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        initForm() {
            this.form = {
                name: '', // 厂商名称
                sign: '', // 厂商标识
                type_id: '', // 游戏类型id
                status: '1', // 状态
                prod_prefix: '', // 第三方urls
                production: {
                    des_key: '',
                    app_id: '',
                    merchant_id: '',
                    merchant_secret: '',
                    public_key: '',
                    private_key: '',
                    md5_key: '',
                    url: {
                        login: '',
                        agent_account_query_url: '',
                        account_query_url: '',
                        top_up_url: '',
                        draw_out_url: '',
                        order_query_url: '',
                        user_active_query_url: '',
                        game_order_query_url: '',
                        user_total_status_query_url: '',
                        kick_out_url: ''
                    }
                },
                testing: {
                    des_key: '',
                    app_id: '',
                    merchant_id: '',
                    merchant_secret: '',
                    public_key: '',
                    private_key: '',
                    md5_key: '',
                    url: {
                        login: '',
                        agent_account_query_url: '',
                        account_query_url: '',
                        top_up_url: '',
                        draw_out_url: '',
                        order_query_url: '',
                        user_active_query_url: '',
                        game_order_query_url: '',
                        user_total_status_query_url: '',
                        kick_out_url: ''
                    }
                },
                isAddFormalUrl: '', // 是否以正式地址为准
                whitelist_ips: '' // 白名单
            }
            this.active = 0
        },
        /**
         * 是否展示错误提示 只判断url类型
         * @param {string} val 筛选的值
         * @param {boolean} required 是否必填
         *  */
        isShowErrUrl(val, required = true) {
            if (required && !val) {
                return true
            }
            if (val && !this.urlReg.test(val)) {
                return true
            }
            return false
        },
        statusSwitch(value, row) {
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
            let production = row.production || {}
            let product_url = production.url || {}
            let testing = row.staging || {}
            let test_url = testing.url || {}
            console.log('🍈 production: ', production)
            this.form = {
                name: row.name,
                sign: row.sign, // 厂商标识
                type_id: row.type_id, // 游戏类型id
                production: {
                    des_key: production.des_key,
                    app_id: production.app_id,
                    merchant_id: production.merchant_id,
                    merchant_secret: production.merchant_secret,
                    public_key: production.public_key,
                    private_key: production.private_key,
                    md5_key: production.md5_key,
                    url: {
                        login: product_url.login, // 登录接口
                        agent_account_query_url:
                            product_url.agent_account_query_url, // 查询代理余额接口, //查询代理余额接口
                        account_query_url: product_url.account_query_url, //查询余额接口
                        top_up_url: product_url.top_up_url, //上分接口
                        draw_out_url: product_url.draw_out_url, // 下分接口
                        order_query_url: product_url.order_query_url, // 查询订单接口
                        user_active_query_url:
                            product_url.user_active_query_url, //查询玩家在线状态
                        game_order_query_url: product_url.game_order_query_url, // 查询游戏注单
                        user_total_status_query_url:
                            product_url.user_total_status_query_url, // 查询玩家总分
                        kick_out_url: product_url.kick_out_url // 踢玩家接口
                        // agent_account_query_url:
                    }
                },
                testing: {
                    des_key: testing.des_key,
                    app_id: testing.app_id,
                    merchant_id: testing.merchant_id,
                    merchant_secret: testing.merchant_secret,
                    public_key: testing.public_key,
                    private_key: testing.private_key,
                    md5_key: testing.md5_key,
                    url: {
                        login: test_url.login, // 登录接口
                        agent_account_query_url:
                            test_url.agent_account_query_url, // 查询代理余额接口, //查询代理余额接口
                        account_query_url: test_url.account_query_url, //查询余额接口
                        top_up_url: test_url.top_up_url, //上分接口
                        draw_out_url: test_url.draw_out_url, // 下分接口
                        order_query_url: test_url.order_query_url, // 查询订单接口
                        user_active_query_url: test_url.user_active_query_url, //查询玩家在线状态
                        game_order_query_url: test_url.game_order_query_url, // 查询游戏注单
                        user_total_status_query_url:
                            test_url.user_total_status_query_url, // 查询玩家总分
                        kick_out_url: test_url.kick_out_url // 踢玩家接口
                        // agent_account_query_url:
                    }
                },

                // test_url: {
                //     login: test_url && test_url.login // 存放三方调用测试url
                // },
                // app_id: app_id, //..终端号
                // merchant_id: merchant_id, //商户号
                // merchant_secret: merchant_secret, // 商户秘钥
                // public_key: public_key, // 公钥
                // private_key: private_key, // 私钥
                // des_key: des_key, // des 秘钥
                // md5_key: md5_key, // md5秘钥
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
                url: {
                    login: this.form.url.login, // 登录接口
                    account_query_url: this.form.url.account_query_url, //查询余额接口
                    top_up_url: this.form.url.top_up_url, //上分接口
                    draw_out_url: this.form.url.draw_out_url, // 下分接口
                    order_query_url: this.form.url.order_query_url, // 查询订单接口
                    user_active_query_url: this.form.url.user_active_query_url, //查询玩家在线状态
                    game_order_query_url: this.form.url.game_order_query_url, // 查询游戏注单
                    user_total_status_query_url: this.form.url
                        .user_total_status_query_url, // 查询玩家总分
                    kick_out_url: this.form.url.kick_out_url, // 踢玩家接口
                    agent_account_query_url: this.form.url
                        .agent_account_query_url // 查询代理余额接口
                },
                test_url: {
                    login: this.form.test_url.login // 存放三方调用测试url
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
                url: {
                    login: this.form.url.login, // 登录接口
                    account_query_url: this.form.url.account_query_url, //查询余额接口
                    top_up_url: this.form.url.top_up_url, //上分接口
                    draw_out_url: this.form.url.draw_out_url, // 下分接口
                    order_query_url: this.form.url.order_query_url, // 查询订单接口
                    user_active_query_url: this.form.url.user_active_query_url, //查询玩家在线状态
                    game_order_query_url: this.form.url.game_order_query_url, // 查询游戏注单
                    user_total_status_query_url: this.form.url
                        .user_total_status_query_url, // 查询玩家总分
                    kick_out_url: this.form.url.kick_out_url, // 踢玩家接口
                    agent_account_query_url: this.form.url
                        .agent_account_query_url // 查询代理余额接口
                },
                test_url: {
                    login: this.form.test_url.login // 存放三方调用测试url
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
            if (this.active < 6) {
                this.active++
            }
        },
        // 正式地址 Switch 样式  （是否以正式地址为准）
        formalSwitchChange() {},
        /** 测试地址 Switch 样式  （是否以测试地址为准） */
        testSwitchChange() {},
        /** 展示 步骤条 状态 */
        stepStatus(stepVal) {
            if (this.active === stepVal) {
                return 'process'
            } else {
                return this.active > stepVal && this.form_need_test
                    ? 'success'
                    : 'wait'
            }
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
        }
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
    min-width: 750px;
    min-height: 300px;
}
.form {
    /* width: 650px; */
    margin: 0 auto;
}
.form > li {
    display: flex;
    /* position: relative; */
    align-items: center;
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
    width: 9em;
    text-align: right;
}
/* .form-2 > li > div > span:first-child {
    width: 9em;
    text-align: right;
} */

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
.form-line {
    position: relative;
    margin-top: 1em;
    font-size: 1.1em;
    color: #4c8bfd;
}
.form-line .line {
    position: absolute;
    border: 1px solid #eff1f5;
    left: 6em;
    top: 13px;
    width: 530px;
}
.textarea {
    width: 250px;
    height: 100px;
}
</style>