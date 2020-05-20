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
                    <td>
                        <PicShow>
                            <img
                                class="td-icon"
                                :src="/\.(png|jpe?g|gif|svg)$/.test(row.icon)?row.icon:defaultImg"
                                alt="图片加载中"
                            />
                            <template v-slot:content>
                                <div>
                                    <img class="td-pic-show" :src="row.icon" alt="图片失败" />
                                </div>
                            </template>
                        </PicShow>
                    </td>
                    <td>{{row.name}}</td>
                    <td>
                        <Switchbox :value="row.status" @update="statusSwitch($event, row)" />
                    </td>
                    <td>{{row.last_editor && row.last_editor.name||'---'}}</td>
                    <td>{{row.updated_at||'---'}}</td>
                    <td>
                        <Upload
                            style="width:90px;height:25px;"
                            title="上传图片"
                            @change="upPicChange($event, row)"
                        />
                        <button class="btn-blue" @click="downLoadImg(row)">下载图片</button>
                        <button class="btn-blue" @click="edit(row)">编辑</button>
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
            <div class="dia-inner">
                <el-steps :active="active" align-center finish-status="success">
                    <el-step
                        class="pointer"
                        title="厂商"
                        description="厂商类型"
                        :status="stepStatus(0)"
                        @click.native="active=0"
                    ></el-step>
                    <el-step
                        class="pointer"
                        title="正式站"
                        description="密钥信息"
                        :status="stepStatus(1)"
                        @click.native="active=1"
                    ></el-step>
                    <el-step
                        class="pointer"
                        title="正式站"
                        description="其他接口"
                        :status="stepStatus(2)"
                        @click.native="active=2"
                    ></el-step>
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
                                <span>正式地址</span>
                                <Input
                                    class="w250"
                                    :placeholder="test_url_holder"
                                    :showerr="!urlReg.test(form.production.third_party_url)"
                                    errmsg="正式地址格式错误"
                                    v-model="form.production.third_party_url"
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
                                <Input class="w250" v-model="form.production.app_id" />
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
                                    @update="formalSwitchChange($event)"
                                />
                                <span class="ml50 orange">{{form.production.third_party_url}}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>登录接口</span>
                                <Input
                                    class="w250"
                                    :placeholder="formal_url_holder"
                                    :showerr="showFormalUrlErr(form.production.url.login)"
                                    errmsg="登录接口格式错误!"
                                    v-model="form.production.url.login"
                                />
                            </div>
                            <div>
                                <span>查询代理余额接口</span>
                                <Input
                                    class="w250"
                                    :placeholder="formal_url_holder"
                                    :showerr="showFormalUrlErr(form.production.url.agent_account_query_url)"
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
                                    :placeholder="formal_url_holder"
                                    :showerr="showFormalUrlErr(form.production.url.account_query_url)"
                                    errmsg="查询余额接口格式错误!"
                                    v-model="form.production.url.account_query_url"
                                />
                            </div>
                            <div>
                                <span>上分接口</span>
                                <Input
                                    class="w250"
                                    :placeholder="formal_url_holder"
                                    :showerr="showFormalUrlErr(form.production.url.top_up_url)"
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
                                    :placeholder="formal_url_holder"
                                    :showerr="showFormalUrlErr(form.production.url.draw_out_url)"
                                    errmsg="下分接口格式错误!"
                                    v-model="form.production.url.draw_out_url"
                                />
                            </div>
                            <div>
                                <span>查询订单接口</span>
                                <Input
                                    class="w250"
                                    :placeholder="formal_url_holder"
                                    :showerr="showFormalUrlErr(form.production.url.order_query_url)"
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
                                    :placeholder="formal_url_holder"
                                    :showerr="showFormalUrlErr(form.production.url.user_active_query_url)"
                                    errmsg="查询玩家在线状态格式错误"
                                    v-model="form.production.url.user_active_query_url"
                                />
                            </div>
                            <div>
                                <span>查询游戏注单</span>
                                <Input
                                    class="w250"
                                    :placeholder="formal_url_holder"
                                    :showerr="showFormalUrlErr(form.production.url.game_order_query_url)"
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
                                    :placeholder="formal_url_holder"
                                    :showerr="showFormalUrlErr(form.production.url.user_total_status_query_url)"
                                    errmsg="查询玩家总分格式错误"
                                    v-model="form.production.url.user_total_status_query_url"
                                />
                            </div>
                            <div>
                                <span>踢玩家接口</span>
                                <Input
                                    class="w250"
                                    :placeholder="formal_url_holder"
                                    :showerr="showFormalUrlErr(form.production.url.kick_out_url)"
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
                                    <span>测试三方urls</span>
                                    <Input
                                        class="w250"
                                        :placeholder="test_url_holder"
                                        :showerr="testUrlErrShow"
                                        errmsg="三方调用测试urls格式错误"
                                        v-model="form.staging.third_party_url"
                                    />
                                </div>
                                <div>
                                    <span>des秘钥</span>
                                    <Input class="w250" v-model="form.staging.des_key" />
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>终端号</span>
                                    <Input class="w250" v-model="form.staging.app_id" />
                                </div>
                                <div>
                                    <span>商户号:</span>
                                    <Input class="w250" v-model="form.staging.merchant_id" />
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
                                        :showerr="testKeyShow"
                                        errmsg="商户秘钥不可为空"
                                        v-model="form.staging.merchant_secret"
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
                                        :showerr="testKeyShow"
                                        errmsg="公钥不可为空"
                                        v-model="form.staging.public_key"
                                    />
                                </div>
                                <div>
                                    <span>私钥</span>
                                    <Input
                                        class="w250"
                                        :showerr="testKeyShow"
                                        errmsg="私钥不可为空"
                                        v-model="form.staging.private_key"
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
                                        :showerr="testKeyShow"
                                        errmsg="md5_key不可为空"
                                        v-model="form.staging.md5_key"
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
                                    <span class="ml50 orange">{{form.test_urls}}</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>登录接口</span>
                                    <Input
                                        class="w250"
                                        :placeholder="test_url_holder"
                                        :showerr="showTestUrlErr(form.staging.url.login)"
                                        errmsg="登录接口格式错误!"
                                        v-model="form.staging.url.login"
                                    />
                                </div>
                                <div>
                                    <span>查询代理余额接口</span>
                                    <Input
                                        class="w250"
                                        :placeholder="test_url_holder"
                                        :showerr="showTestUrlErr(form.staging.url.agent_account_query_url)"
                                        errmsg="查询查询代理余额接口格式错误"
                                        v-model="form.staging.url.agent_account_query_url"
                                    />
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>查询余额接口</span>
                                    <Input
                                        class="w250"
                                        :placeholder="test_url_holder"
                                        :showerr="showTestUrlErr(form.staging.url.account_query_url)"
                                        errmsg="查询余额接口格式错误!"
                                        v-model="form.staging.url.account_query_url"
                                    />
                                </div>
                                <div>
                                    <span>上分接口</span>
                                    <Input
                                        class="w250"
                                        :placeholder="test_url_holder"
                                        :showerr="showTestUrlErr(form.staging.url.top_up_url)"
                                        errmsg="上分接口格式错误!"
                                        v-model="form.staging.url.top_up_url"
                                    />
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>下分接口</span>
                                    <Input
                                        class="w250"
                                        :placeholder="test_url_holder"
                                        :showerr="showTestUrlErr(form.staging.url.draw_out_url)"
                                        errmsg="下分接口格式错误!"
                                        v-model="form.staging.url.draw_out_url"
                                    />
                                </div>
                                <div>
                                    <span>查询订单接口</span>
                                    <Input
                                        class="w250"
                                        :placeholder="test_url_holder"
                                        :showerr="showTestUrlErr(form.staging.url.order_query_url)"
                                        errmsg="查询订单接口格式错误"
                                        v-model="form.staging.url.order_query_url"
                                    />
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>查询玩家在线状态</span>
                                    <Input
                                        class="w250"
                                        :placeholder="test_url_holder"
                                        :showerr="showTestUrlErr(form.staging.url.user_active_query_url)"
                                        errmsg="查询玩家在线状态格式错误"
                                        v-model="form.staging.url.user_active_query_url"
                                    />
                                </div>
                                <div>
                                    <span>查询游戏注单</span>
                                    <Input
                                        class="w250"
                                        :placeholder="test_url_holder"
                                        :showerr="showTestUrlErr(form.staging.url.game_order_query_url)"
                                        errmsg="查询游戏注单格式错误"
                                        v-model="form.staging.url.game_order_query_url"
                                    />
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span>查询玩家总分</span>
                                    <Input
                                        class="w250"
                                        :placeholder="test_url_holder"
                                        :showerr="showTestUrlErr(form.staging.url.user_total_status_query_url)"
                                        errmsg="查询玩家总分格式错误"
                                        v-model="form.staging.url.user_total_status_query_url"
                                    />
                                </div>
                                <div>
                                    <span>踢玩家接口</span>
                                    <Input
                                        class="w250"
                                        :placeholder="test_url_holder"
                                        :showerr="showTestUrlErr(form.staging.url.kick_out_url)"
                                        errmsg="踢玩家接口格式错误"
                                        v-model="form.staging.url.kick_out_url"
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
                                <Input
                                    style="width:500px"
                                    required
                                    :showerr="errIpsShow(form.whitelist_ips)"
                                    errmsg="格式错误"
                                    placeholder="格式:1.1.1.1,2.2.2.2"
                                    v-model="form.whitelist_ips"
                                />
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="form-btns">
                    <button v-show="active!==0" class="btn-blue-large" @click="prevStep">上一步</button>
                    <button v-if="active!==5" class="btn-blue-large" @click="nextStep">下一步</button>
                    <button v-else class="btn-blue-large ml50" @click="diaCfm">确定</button>
                </div>
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
import axios from 'axios'
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
            defaultImg: require('../../../assets/image/picError.svg'),
            // 页面内容
            total: 0,
            pageNo: 1,
            pageSize: 25,
            headers: [
                '编号',
                'ICON',
                '游戏厂商',
                '厂商状态',
                '最后更新人',
                '最后更新时间',
                '操作'
            ],
            list: [],
            // dialog
            dia_show: '',
            dia_status: '',
            dia_title: '',
            game_type_opt: [], // 游戏类型下拉框

            isAddFormalUrl: false, //是否以正式地址为准 添加正式地址
            isAddTestUrl: false, //是否以测试地址为准 添加测试地址
            form_need_test: true, // 是否需要配置测试站
            formal_url_holder: '例如: http://abc.com', // 正式地址 url的 placeholder
            test_url_holder: '例如: http://abc.com', // 测试地址 url的 placeholder
            form: {
                name: '', // 厂商名称
                sign: '', // 厂商标识
                type_id: '', // 游戏类型id
                status: '1', // 状态
                production: {
                    third_party_url: '',
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
                staging: {
                    third_party_url: '',
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
            let production = this.form.production || {}
            // let template = production
            let key_one = !!production.merchant_secret // 商户秘钥
            let key_two = !!production.public_key && !!production.private_key // 商户秘钥
            let key_three = !!production.md5_key // 商户秘钥
            if (key_one || key_two || key_three) {
                return false
            } else {
                return true
            }
        },
        // 测试秘钥,私钥公钥...等等
        testKeyShow() {
            let staging = this.form.staging || {}

            let key_one = !!staging.merchant_secret // 商户秘钥
            let key_two = !!staging.public_key && !!staging.private_key // 商户秘钥
            let key_three = !!staging.md5_key // 商户秘钥
            if (key_one || key_two || key_three) {
                return false
            } else {
                return true
            }
        },
        //
        testUrlErrShow() {
            let url = this.form.staging.third_party_url
            if (url && !this.urlReg.test(url)) {
                return true
            }
            return false
        }
    },
    methods: {
        initForm() {
            this.form = {
                // id: '',
                name: '', // 厂商名称
                sign: '', // 厂商标识
                type_id: '', // 游戏类型id
                status: 1, // 状态
                production: {
                    third_party_url: '',
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
                staging: {
                    third_party_url: '',
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
         *  */
        showFormalUrlErr(val) {
            // 以正式地址为准 ,  有正式地址前缀,反之则不加前缀,
            // reg判断 1.加前缀格式 /ab 2.不加前缀格式 http://xx.com/ab
            let reg
            if (this.isAddFormalUrl) {
                reg = /^\/\w+/
            } else {
                reg = this.urlReg
            }
            // 有值时才判断 是否错误
            if (val && !reg.test(val)) {
                return true
            }
            return false
        },
        showTestUrlErr(val) {
            let reg
            if (this.isAddTestUrl) {
                reg = /^\/\w+/
            } else {
                reg = this.urlReg
            }
            // 有值时才判断 是否错误
            if (val && !reg.test(val)) {
                return true
            }
            return false
        },
        errIpsShow(val) {
            if (!val) return true
            // ip 正则
            let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

            let list = this.ipFormat(val)
            let iptest = list.every(item => {
                return reg.test(item)
            })
            if (!iptest) {
                return true
            }
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
        /** 上传图片 */
        upPicChange(e, row) {
            let pic = e.target.files[0]
            let path = 'central/game/vendormanage'
            let formData = new FormData()
            formData.append('file', pic, pic.name)
            formData.append('path', path)
            let { url, method } = this.$api.pic_update
            let data = formData
            let headers = { 'Content-Type': 'multipart/form-data' }
            this.$http({ method, url, data, headers }).then(res => {
                // let a = 'http//apionline.jianghu.ethanphp'
            // axios({ method, url:a+url, data, headers }).then(res => {
                if (res && res.code == '200') {
                    // this.pic_data = res.data.path
                    if (res.data) {
                        this.iconUpdate(row.id, res.data)
                    }
                }
            })
            // let reader = new FileReader()
            // reader.readAsDataURL(file)
            // reader.onerror = function() {
            //     return
            // }
            // reader.onload = function() {
            //     // self.src[index] = this.result
            //     self.pic_data = this.result
            // }
        },
        /** 上传图片成功后上传icon地址 */
        iconUpdate(id, res) {
            // console.log('🥩 id: ', id);
            // console.log('🍕 res: ', res);
            let data = {
                id: id,
                icon_id: res.id
            }
            data = window.all.tool.rmEmpty(data)

            let { url, method } = this.$api.game_vendor_icon_set
            this.$http({ method, url, data }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    //this.mod_show = false
                    //this.dia_show = false
                    this.getList()
                }
            })
        },
        /** 下载图片 */
        downLoadImg(row) {
            var image = new Image()
            // 解决跨域 Canvas 污染问题
            image.setAttribute('crossOrigin', 'anonymous')
            image.onload = function() {
                var canvas = document.createElement('canvas')
                canvas.width = image.width
                canvas.height = image.height

                var context = canvas.getContext('2d')
                context.drawImage(image, 0, 0, image.width, image.height)
                var url = canvas.toDataURL('image/png')

                // 生成一个a元素
                var a = document.createElement('a')
                // 创建一个单击事件
                var event = new MouseEvent('click')

                // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
                a.download = row.name || '下载图片'
                // 将生成的URL设置为a.href属性
                a.href = url
                // 触发a的单击事件
                a.dispatchEvent(event)
            }

            image.src = row.icon
        },
        edit(row) {
            // console.log('row: ', row)
            if (!row) return
            this.curr_row = row
            this.active = 0
            this.isAddFormalUrl = false // 是否以正式地址为准
            this.isAddTestUrl = false // 是否以测试地址为准
            let production = row.production || {}
            let product_url = production.url || {}
            let staging = row.staging || {}
            let test_url = staging.url || {}
            // console.log('🍈 production: ', production)
            this.form = {
                id: row.id,
                name: row.name,
                sign: row.sign, // 厂商标识
                type_id: row.type_id, // 游戏类型id
                status: row.status, // 状态
                production: {
                    third_party_url: production.third_party_url,
                    des_key: production.des_key,
                    app_id: production.app_id,
                    status: row.status, // 状态

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
                    }
                },
                staging: {
                    third_party_url: staging.third_party_url,

                    des_key: staging.des_key,
                    app_id: staging.app_id,
                    merchant_id: staging.merchant_id,
                    merchant_secret: staging.merchant_secret,
                    public_key: staging.public_key,
                    private_key: staging.private_key,
                    md5_key: staging.md5_key,
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
                    }
                },
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
        step0Check() {
            let arr = ['name', 'sign', 'type_id']
            return arr.every(key => {
                return this.form[key]
            })
        },
        step1Check() {
            let production = this.form.production || {}
            // 1.正式地址 2. 商户号 3. 其中一个秘钥 都是true 才通过
            if (
                production.third_party_url &&
                production.merchant_id &&
                !this.formalKeyShow
            ) {
                return true
            } else {
                return false
            }
        },
        step2Check() {
            let production = this.form.production || {}
            let product_url = production.url || {}
            let reg
            if (this.isAddFormalUrl) {
                reg = /^\/\w+/
            } else {
                reg = this.urlReg
            }
            let arr = [
                'login',
                'agent_account_query_url',
                'account_query_url',
                'top_up_url',
                'draw_out_url',
                'order_query_url',
                'user_active_query_url',
                'game_order_query_url',
                'user_total_status_query_url',
                'kick_out_url'
            ]
            return arr.every(key => {
                let item_val = product_url[key] || ''

                if (!item_val) {
                    return true
                } else {
                    return reg.test(item_val)
                }
            })
        },
        step3Check() {
            if (!this.form_need_test) {
                return true
            }
            let staging = this.form.staging || {}
            let third_party_url = staging.third_party_url
            //  1.有测试地址 && 2.地址不通过
            if (third_party_url && !this.urlReg.test(third_party_url)) {
                return false
            }
            return true
        },
        step4Check() {
            if (!this.form_need_test) {
                return true
            }
            let staging = this.form.staging || {}
            let stag_url = staging.url || {}
            let reg
            if (this.isAddTestUrl) {
                reg = /^\/\w+/
            } else {
                reg = this.urlReg
            }
            let arr = [
                'login',
                'agent_account_query_url',
                'account_query_url',
                'top_up_url',
                'draw_out_url',
                'order_query_url',
                'user_active_query_url',
                'game_order_query_url',
                'user_total_status_query_url',
                'kick_out_url'
            ]
            return arr.every(key => {
                let item_val = stag_url[key] || ''
                // 可以为空
                if (!item_val) {
                    return true
                } else {
                    return reg.test(item_val)
                }
            })
        },
        step5Check() {
            let ip = this.form.whitelist_ips
            return !this.errIpsShow(ip)
        },
        /**自动加前缀
         * @param {object} url_obj 需要加前缀的对象
         * @param {string} prefix 前缀
         */
        addPrefix(url_obj = {}, prefix) {
            let obj = {}
            for (const key in url_obj) {
                let item = url_obj[key]
                if (item) {
                    obj[key] = prefix + item
                }
            }
            return obj
        },
        checkForm() {
            if (!this.step0Check()) {
                this.$toast.warning('步骤1 错误')
                return false
            }
            if (!this.step1Check()) {
                this.$toast.warning('步骤2 错误')
                return false
            }
            if (!this.step2Check()) {
                this.$toast.warning('步骤3 错误')
                return false
            }
            if (!this.step3Check()) {
                this.$toast.warning('步骤4 错误')
                return false
            }
            if (!this.step4Check()) {
                this.$toast.warning('步骤5 错误')
                return false
            }
            if (!this.step5Check()) {
                this.$toast.warning('步骤6 错误')
                return false
            }
            return true
        },
        diaCfm() {
            if (!this.checkForm()) return
            if (this.dia_status === 'add') {
                this.addCfm()
            }
            if (this.dia_status === 'edit') {
                this.editCfm()
            }
        },
        addCfm() {
            let production = this.form.production || {}
            let product_url = production.url || {}
            let staging = this.form.staging || {}
            let stag_url = staging.url || {}
            let data = {
                name: this.form.name, // 厂商名称
                sign: this.form.sign, // 厂商标识
                type_id: this.form.type_id, // 游戏类型id
                status: this.form.status, // 状态
                production: {
                    third_party_url: production.third_party_url,
                    des_key: production.des_key,
                    app_id: production.app_id, // 终端号
                    merchant_id: production.merchant_id, // 商户号
                    merchant_secret: production.merchant_secret, //商户秘钥
                    public_key: production.public_key, // 公钥
                    private_key: production.private_key, // 私钥
                    md5_key: production.md5_key, // md5秘钥
                    url: {
                        login: product_url.login, // 登录接口
                        agent_account_query_url:
                            product_url.agent_account_query_url, // 查询代理余额接口
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
                    }
                },
                staging: {
                    third_party_url: production.third_party_url,
                    des_key: staging.des_key,
                    app_id: staging.app_id, // 终端号
                    merchant_id: staging.merchant_id, // 商户号
                    merchant_secret: staging.merchant_secret, //商户秘钥
                    public_key: staging.public_key, // 公钥
                    private_key: staging.private_key, // 私钥
                    md5_key: staging.md5_key, // md5秘钥
                    url: {
                        login: stag_url.login, // 登录接口
                        agent_account_query_url:
                            stag_url.agent_account_query_url, // 查询代理余额接口
                        account_query_url: stag_url.account_query_url, //查询余额接口
                        top_up_url: stag_url.top_up_url, //上分接口
                        draw_out_url: stag_url.draw_out_url, // 下分接口
                        order_query_url: stag_url.order_query_url, // 查询订单接口
                        user_active_query_url: stag_url.user_active_query_url, //查询玩家在线状态
                        game_order_query_url: stag_url.game_order_query_url, // 查询游戏注单
                        user_total_status_query_url:
                            stag_url.user_total_status_query_url, // 查询玩家总分
                        kick_out_url: stag_url.kick_out_url // 踢玩家接口
                    }
                }
                // whitelist_ips:
                //     this.form.white_list &&
                //     (this.form.white_list.ips || []).join(',') // 白名单
            }
            if (this.form.whitelist_ips) {
                let str = this.form.whitelist_ips.replace('，', ',')
                str = str.replace(/\s+/g, '')
                data.whitelist_ips = JSON.stringify(str.split(','))
            }
            // 是否以正式地址为准 自动加前缀
            if (this.isAddFormalUrl) {
                data.production.url = this.addPrefix(
                    production.url,
                    production.third_party_url
                )
            }
            if (this.isAddTestUrl) {
                data.staging.url = this.addPrefix(
                    staging.url,
                    staging.third_party_url
                )
            }
            let { url, method } = this.$api.game_vendor_add
            this.$http({ method, url, data }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = ''
                    this.getList()
                }
            })
        },
        editCfm() {
            let production = this.form.production || {}
            let product_url = production.url || {}
            let staging = this.form.staging || {}
            let stag_url = staging.url || {}
            let data = {
                id: this.form.id,
                name: this.form.name, // 厂商名称
                sign: this.form.sign, // 厂商标识
                type_id: this.form.type_id, // 游戏类型id
                status: this.form.status, // 状态
                production: {
                    third_party_url: production.third_party_url,
                    des_key: production.des_key, // des_key
                    app_id: production.app_id, // 终端号
                    merchant_id: production.merchant_id, // 商户号
                    merchant_secret: production.merchant_secret, //商户秘钥
                    public_key: production.public_key, // 公钥
                    private_key: production.private_key, // 私钥
                    md5_key: production.md5_key, // md5秘钥
                    url: {
                        login: product_url.login, // 登录接口
                        agent_account_query_url:
                            product_url.agent_account_query_url, // 查询代理余额接口
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
                    }
                },
                staging: {
                    third_party_url: staging.third_party_url,
                    des_key: staging.des_key,
                    app_id: staging.app_id, // 终端号
                    merchant_id: staging.merchant_id, // 商户号
                    merchant_secret: staging.merchant_secret, //商户秘钥
                    public_key: staging.public_key, // 公钥
                    private_key: staging.private_key, // 私钥
                    md5_key: staging.md5_key, // md5秘钥
                    url: {
                        login: stag_url.login, // 登录接口
                        agent_account_query_url:
                            stag_url.agent_account_query_url, // 查询代理余额接口
                        account_query_url: stag_url.account_query_url, //查询余额接口
                        top_up_url: stag_url.top_up_url, //上分接口
                        draw_out_url: stag_url.draw_out_url, // 下分接口
                        order_query_url: stag_url.order_query_url, // 查询订单接口
                        user_active_query_url: stag_url.user_active_query_url, //查询玩家在线状态
                        game_order_query_url: stag_url.game_order_query_url, // 查询游戏注单
                        user_total_status_query_url:
                            stag_url.user_total_status_query_url, // 查询玩家总分
                        kick_out_url: stag_url.kick_out_url // 踢玩家接口
                    }
                }

                // whitelist_ips:
                //     this.form.white_list &&
                //     (this.form.white_list || []).join(',') // 白名单
            }
            // 白名单
            if (this.form.whitelist_ips) {
                let str = this.form.whitelist_ips.replace('，', ',')
                str = str.replace(/\s+/g, '')
                data.whitelist_ips = JSON.stringify(str.split(','))
            }
            // 是否以正式地址为准 自动加前缀
            if (this.isAddFormalUrl) {
                data.production.url = this.addPrefix(
                    production.url,
                    production.third_party_url
                )
            }
            if (this.isAddTestUrl) {
                data.staging.url = this.addPrefix(
                    staging.url,
                    staging.third_party_url
                )
            }

            let { url, method } = this.$api.game_vendor_set
            this.$http({ method, url, data }).then(res => {
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
        formalSwitchChange(val) {
            if (val) {
                this.formal_url_holder = '例如: /ab'
            } else {
                this.formal_url_holder = '例如: http://abc.com'
            }
        },
        /** 测试地址 Switch 样式  （是否以测试地址为准） */
        testSwitchChange(val) {
            if (val) {
                this.test_url_holder = '例如: /ab'
            } else {
                this.test_url_holder = '例如: http://abc.com'
            }
        },
        /** 展示 步骤条 状态 */
        stepStatus(stepVal) {
            // wait / process / finish / error / success
            if (this.active === stepVal) {
                return 'process'
            } else if (this.active > stepVal) {
                switch (stepVal) {
                    case 0:
                        return this.step0Check() ? 'success' : 'error'
                        break
                    case 1:
                        return this.step1Check() ? 'success' : 'error'
                        break
                    case 2:
                        return this.step2Check() ? 'success' : 'error'
                    case 3:
                        if (!this.form_need_test) {
                            return 'wait'
                        } else {
                            return this.step3Check() ? 'success' : 'error'
                        }
                        break
                    case 4:
                        if (!this.form_need_test) {
                            return 'wait'
                        } else {
                            return this.step4Check() ? 'success' : 'error'
                        }
                        break
                    case 5:
                        break
                    default:
                        break
                }
            }
        },
        // 白名单ip 变成需要的格式
        ipFormat(ip) {
            if (!ip) {
                return ''
            }
            let str = ip.replace('，', ',')
            str = str.replace(/\s+/g, '')
            return str.split(',')
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
.td-icon {
    max-width: 80px;
    max-width: 44px;
    padding-top: 3px;
}
.td-pic-show {
    max-width: 600px;
    max-height: 350px;
    display: block;
}
.dia-inner {
    min-height: 700px;
}
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