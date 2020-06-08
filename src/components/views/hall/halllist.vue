<template>
    <div class="container">
        <!-- 厅主列表 -->

        <div class="filter">
            <ul class="left">
                <li>
                    <span>厅主账号</span>
                    <Input v-model="filter.email" />
                </li>
                <li>
                    <span>站点状态</span>
                    <Select v-model="filter.status" :options="website_opt"></Select>
                </li>
                <li>
                    <span>维护状态</span>
                    <Select v-model="filter.maintain" :options="maintain_opt"></Select>
                </li>
                <li>
                    <span>站点添加时间</span>
                    <Date type="daterange" v-model="filter.add_dates" />
                    <!-- <span class="mh-5">至</span> -->
                    <!-- <Date v-model="filter.add_dates[1]" /> -->
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                    <button class="btn-blue" @click="addHall">添加厅主</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <!-- '厅主账号', '站点名称', '短信数量', '站点状态', '维护状态', '站点有效日期', '站点维护日期', '站点添加日期', '操作'  -->
                    <td>{{row.email}}</td>
                    <td>{{row.cn_name}}</td>
                    <td>{{row.sms_num}}</td>
                    <!-- <td>
                        <i
                            :class="[row.status===1?'iconfont icongou green':'iconfont iconcha red']"
                        ></i>
                    </td>-->
                    <td>
                        <Switchbox v-model="row.status" @update="statusSwitch(row)" />
                    </td>
                    <td>
                        <span
                            :class="[isMaintain(row)?'orange':'gray']"
                        >{{isMaintain(row)?'维护中':'未维护'}}</span>
                    </td>
                    <td>
                        <div>{{row.start_time}}</div>
                        <div>{{row.end_time}}</div>
                    </td>
                    <td>
                        <div>{{row.maintain_start}}</div>
                        <div>{{row.maintain_end}}</div>
                        <div>{{!row.maintain_start&&!row.maintain_end&&'---'}}</div>
                    </td>
                    <td>{{row.created_at}}</td>
                    <td style="padding:5px 0;">
                        <div>
                            <!-- <button class="btns-blue" @click="statusSwitch(row)">{{row.a5==='1'?'启用':'禁用'}}</button> -->
                            <!-- <button
                                :class="[row.status?'btns-red':'btns-green']"
                                @click="statusSwitch(row)"
                            >{{row.status===1?'禁用':'启用'}}</button>-->

                            <button class="btns-blue" @click="maintainShow(row)">维护</button>
                            <button class="btns-blue" @click="siteManageShow(row)">站点管理</button>
                        </div>
                        <div style="margin-top:5px;">
                            <button class="btns-blue" @click="domainShow(row)">域名管理</button>
                            <button class="btns-blue" @click="gameShow(row)">游戏管理</button>
                            <button class="btns-blue" @click="activeShow(row)">活动管理</button>
                        </div>
                    </td>
                </template>
            </Table>
            <!-- 
            <Page
                class="table-page"
                :total="total"
                :pageNo.sync="pageNo"
                :pageSize.sync="pageSize"
                @updateNo="updateNo"
                @updateSize="updateSize"
            />-->
        </div>
        <!-- 禁用 启用 -->
        <Modal
            :show.sync="mod_show"
            title="站点状态"
            :content="curr_row.status?'确认禁用站点':'确认启用站点'"
            @confirm="modConf"
        ></Modal>

        <Dialog :show="dia_show!==''" :title="dia_title" @close="dia_show=''">
            <div class="dia-inner">
                <!-- 添加 -->
                <div v-if="dia_show==='add'">
                    <ul class="form add-from">
                        <li>
                            <span>厅主账号:</span>
                            <Input class="w300" v-model="form.email" />
                        </li>
                        <li>
                            <span>登录密码:</span>
                            <Input class="w300" type="password" v-model="form.password" />
                        </li>
                        <li>
                            <span>有效日期:</span>
                            <div>
                                <date
                                    :disabledDate="['no_before_today']"
                                    style="width:300px;"
                                    type="datetimerange"
                                    v-model="form.dates"
                                />
                            </div>
                        </li>
                        <li>
                            <span>站点名称:</span>
                            <Input class="w300" v-model="form.platform_name" />
                        </li>
                        <li>
                            <span>主域名:</span>
                            <textarea
                                style="width:300px;height:80px;"
                                class="textarea"
                                placeholder="例子: http:abc.com,http:ac.com"
                                v-model="form.domains"
                            ></textarea>
                        </li>
                        <li>
                            <span>代理方式:</span>
                            <Checkbox label="PC" v-model="form.agency_method[0]" />
                            <Checkbox
                                style="margin-left:50px;"
                                label="H5"
                                v-model="form.agency_method[1]"
                            />
                            <Checkbox
                                style="margin-left:50px;"
                                class="ml50"
                                label="APP"
                                v-model="form.agency_method[2]"
                            />
                        </li>
                        <li>
                            <ul class="skin">
                                <li>
                                    <span class="skin-pc">PC皮肤:</span>
                                    <Select v-model="form.pc_skin_id" :options="pc_skin_opt"></Select>
                                </li>
                                <li class="ml10">
                                    <span>H5皮肤:</span>
                                    <Select v-model="form.h5_skin_id" :options="skin_h5_opt"></Select>
                                </li>
                                <li class="ml10">
                                    <span>APP皮肤:</span>
                                    <Select v-model="form.app_skin_id" :options="skin_app_opt"></Select>
                                </li>
                            </ul>
                        </li>
                        <li class="form-authority">
                            <span>权限选择</span>
                            <!-- // TODO: -->
                            <!-- <Input class="w300" v-model="form.role" /> -->
                            <!-- <AuthorityTree v-model="form.role" style="width:500px;" /> -->
                            <AuthorityTree
                                style="width:500px;"
                                :menutree="tree_list"
                                v-model="form.role"
                                @update="treeListUpd"
                            />
                        </li>
                        <li>
                            <span>短信数量</span>
                            <Input class="w300" limit="p-integer" v-model="form.sms_num" />
                        </li>
                        <li>
                            <span>站点标识</span>
                            <Input class="w300" v-model="form.platform_sign" />
                        </li>
                        <li>
                            <span>厅主状态:</span>
                            <Radio
                                class="radio-left"
                                label="启用"
                                :value="form.status"
                                val="1"
                                v-model="form.status"
                            />
                            <Radio
                                class="radio-right"
                                label="禁用"
                                :value="form.status"
                                val="0"
                                v-model="form.status"
                            />
                        </li>
                        <li>
                            <button class="btn-plain-large">取消</button>
                            <button class="btn-blue-large ml50" @click="addHallCfm">确定</button>
                        </li>
                    </ul>
                    <div class="center-box mt50"></div>
                </div>
                <!-- 维护 -->
                <div v-if="dia_show==='maintain'" class="dia-maintain">
                    <div>
                        <div style="align-self:flex-start;">维护时间:</div>
                        <div class="mt20">
                            <!-- <Date style="width:250px;" type="datetime" v-model="maintain_dates[0]" />
                            <Date
                                style="width:250px; margin-top:20px;"
                                type="datetime"
                                v-model="maintain_dates[1]"
                            />-->
                            <date
                                style="width:300px;"
                                type="datetimerange"
                                v-model="maintain_dates"
                            />
                        </div>
                        <div class="mt50">提示: 不传时间代表取消维护状态.</div>
                        <div class="maintain-btns">
                            <button class="btn-plain-large" @click="dia_show=''">取消</button>
                            <button class="btn-blue-large ml50" @click="maintainCfm">确定</button>
                        </div>
                    </div>
                </div>

                <!-- 站点管理 -->
                <SiteManage
                    v-if="dia_show==='site'"
                    :row="curr_row"
                    :id="curr_row.id"
                    :tree_list="tree_list"
                    @confirm="siteManageCfm"
                />

                <!-- 域名管理 -->
                <Domain v-if="dia_show==='domain'" :sign="curr_row.sign" />
                <!-- 游戏管理 -->
                <Gamemanage v-if="dia_show==='game'" class="dia-game" :outRow="curr_row" />
                <!-- 活动管理 -->
                <ActiveManage v-if="dia_show==='active'" :platform_sign="curr_row.sign" />
            </div>
        </Dialog>
        <Loading :show.sync="loading" />
    </div>
</template> 
<script>
import AuthorityTree from '../../commonComponents/AuthorityTree'

import SiteManage from './HallListDir/SiteManage'
import Domain from './HallListDir/Domain'
import Gamemanage from './HallListDir/GameMana'
import ActiveManage from './HallListDir/ActiveManage'
export default {
    name: 'HallList',
    components: {
        SiteManage: SiteManage,
        Domain: Domain,
        Gamemanage: Gamemanage,
        ActiveManage: ActiveManage,
        AuthorityTree: AuthorityTree
    },
    data() {
        return {
            
            filter: {
                status: '',
                email: '',
                maintain: '',
                add_dates: []
            },
            pc_skin_opt: [
                { label: '默认皮肤', value: 0 },
                { label: '皮肤一', value: 1 },
                { label: '皮肤二', value: 2 },
                { label: '皮肤三', value: 3 }
            ],
            skin_h5_opt: [
                { label: '默认皮肤', value: 0 },
                { label: '皮肤一', value: 1 },
                { label: '皮肤二', value: 2 },
                { label: '皮肤三', value: 3 }
            ],
            skin_app_opt: [
                { label: '默认皮肤', value: 0 },
                { label: '皮肤一', value: 1 },
                { label: '皮肤二', value: 2 },
                { label: '皮肤三', value: 3 }
            ],
            form: {
                email: '',
                password: '',
                dates: [],
                platform_name: '',
                domains: '',
                agency_method: [],
                pc_skin_id: 0,
                h5_skin_id: 0,
                app_skin_id: 0,
                role: [], // 权限选择
                sms_num: '',
                platform_sign: '', // 站点标识
                status: '1'
            },
            tree_list: [],
            // authorityList: [],
            loading: false,
            website_opt: [
                { label: '全部', value: '' },
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 }
            ],
            maintain_opt: [
                { label: '全部', value: '' },
                { label: '维护中', value: 1 },
                { label: '未维护', value: 0 }
            ],
            headers: [
                '厅主账号',
                '站点名称',
                '短信数量',
                '站点状态',
                '维护状态',
                '站点有效日期',
                '站点维护日期',
                '站点添加日期',
                '操作'
            ],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            mod_show: false,
            mod_cont: '',
            // 是否启用 站点
            is_turn_on: false,
            curr_row: {},
            // dia 弹窗
            dia_show: '',
            dia_title: '',
            // 维护 dialog
            maintain_dates: [,]
        }
    },
    methods: {
        intiForm() {
            this.form = {
                email: '',
                password: '',
                dates: [],
                platform_name: '',
                domains: '',
                agency_method: [],
                pc_skin_id: 0,
                h5_skin_id: 0,
                app_skin_id: 0,
                role: [], // 权限选择
                sms_num: '',
                platform_sign: '', // 站点标识
                status: '1'
            }
        },
        addHall() {
            this.dia_show = 'add'
            this.dia_title = '添加厅主'
            this.intiForm()
        },
        treeListUpd() {},
        checkForm() {
            let checkArr = [
                { key: 'email', message: '厅主账号不可为空!' },
                { key: 'password', message: '登录密码不可为空!' },
                { key: 'platform_name', message: '站点名称不可为空!' },
                { key: 'domains', message: '主域名不可为空!' },
                { key: 'sms_num', message: '短信数量不可为空!' },
                { key: 'platform_sign', message: '站点标识不可为空!' }
            ]
        
            let EmptyItem = checkArr.find(item => this.form[item.key] === '')
            if (EmptyItem) {
                this.$toast.warning(EmptyItem.message)
                return false
            }
            if(this.form.email) {
                let emailReg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
                if(!emailReg.test(this.form.email)) {
                    this.$toast.warning('厅主账号格式错误(应为邮箱格式)')
                    return false
                }
            }
            if(this.form.domains) {
                this.form.domains = this.form.domains.replace(/\s/g,'')
                let arr = this.form.domains.split(/[\,\，]/)
                let urlRegExp = /^https?:\/\/([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+/
                let testUrl = arr.every(item=>{
                    return urlRegExp.test(item)
                })
                if(!testUrl) {
                    this.$toast.warning('主域名格式不正确')
                    return false
                }
            }
            if (!this.form.dates[0] || !this.form.dates[1]) {
                this.$toast.warning('有效日期不可为空!')
                return false
            }
            if (!this.form.agency_method.some(item => item)) {
                this.$toast.warning('代理方式不可为空!')
                return false
            }
            if (!this.form.role.length) {
                this.$toast.warning('权限选择不可为空!')
                return false
            }

            return true
        },
        // 确认添加厅主
        addHallCfm() {
            if (!this.checkForm()) return
            function getAgencyMethod(arr = []) {
                if (arr.length === 0) return ''
                let methods_arr = []
                arr.forEach((item, index) => {
                    if (item) {
                        methods_arr.push(index + 1)
                    }
                })
                return methods_arr.join(',')
            }

            let data = {
                email: this.form.email,
                password: this.form.password,
                start_time: this.form.dates[0] || '', // 有效日期
                end_time: this.form.dates[1] || '',
                platform_name: this.form.platform_name, // 站点名称
                domains: this.form.domains.split(/[\,\，]/), // TODO: 是数组吗?
                agency_method: getAgencyMethod(this.form.agency_method), // 1,2,3
                pc_skin_id: this.form.pc_skin_id,
                h5_skin_id: this.form.h5_skin_id,
                app_skin_id: this.form.app_skin_id,
                role: JSON.stringify(this.form.role), // TODO:
                sms_num: this.form.sms_num,
                platform_sign: this.form.platform_sign,
                status: this.form.status
            }

            let { url, method } = this.$api.platform_add
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    // self.total = res.data.total
                    // self.list = res.data.data
                    this.$toast.success(res && res.message)
                    this.dia_show = ''
                    this.getList()
                }
            })
        },
        // 是否维护
        isMaintain(row) {
            // console.log('row: ', row);
            let start = new Date(row.maintain_start).valueOf()
            let end = new Date(row.maintain_end).valueOf()
            let now = new Date().valueOf()
            if (now > start && now < end) {
                return true
            } else {
                return false
            }
        },
        // 【禁用】或【启用】站点
        statusSwitch(row) {
            this.curr_row = row
            // this.mod_status = 'switch'
            // this.mod_show = true
            this.modConf()
        },

        // 禁用启用 确认
        modConf() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status ? 1 : 0
            }
            let { url, method } = this.$api.platform_switch_set
            this.$http({
                method: method,
                url: url,
                data: data
            }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    // this.mod_show = false
                }
                this.getList()
            })
        },
        // 维护
        maintainShow(row) {
            this.curr_row = row
            this.maintain_dates[0] = row.maintain_start
            this.maintain_dates[1] = row.maintain_end
            this.dia_show = 'maintain'
            this.dia_title = '维护'
        },
        // 站点管理
        siteManageShow(row) {
            console.log('row: ', row)
            this.curr_row = row
            this.dia_show = 'site'
            this.dia_title = '站点管理'
        },
        // 站点确认
        siteManageCfm() {
            this.dia_show = ''
            this.getList()
        },
        // 域名管理
        domainShow(row) {
            console.log('row: ', row)
            this.curr_row = row

            this.dia_show = 'domain'
            this.dia_title = '域名管理'
        },
        // 游戏管理
        gameShow(row) {
            console.log('row: ', row)
            this.curr_row = row
            this.dia_show = 'game'
            this.dia_title = '游戏管理'
        },
        // 活动管理
        activeShow(row) {
            this.curr_row = row
            this.dia_show = 'active'
            this.dia_title = '活动管理'
        },
        maintainCfm() {
            let data = {
                id: this.curr_row.id,
                maintain_start: this.maintain_dates[0],
                maintain_end: this.maintain_dates[1]
            }
            data = window.all.tool.rmEmpty(data)
            let { url, method } = this.$api.platform_maintain_set
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = ''
                    this.getList()
                }
            })
        },
        // 获取后台菜单树
        getTreeList() {
            // 后台res 转化为 tree 数组
            function resToTree(list) {
                return Object.keys(list).map(key => {
                    let item = {}
                    item.label = list[key].label
                    item.id = list[key].id
                    item.checked = false
                    if (list[key].child) {
                        item.child = resToTree(list[key].child)
                    }
                    return item
                })
            }
            let { url, method } = this.$api.menu_all_list
            this.$http({ method, url }).then(res => {
                // console.log('所有权限树: ', res)
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.tree_list = resToTree(res.data)
                    // console.log('this.tree_list: ', this.tree_list)
                }
            })
        },
        getList() {
            /**
             * TODO 🎈
             */

            // this.loading = true
            let createdAt = ''
            if (this.filter.add_dates[0] && this.filter.add_dates[1]) {
                let dates = [
                    this.filter.add_dates[0] + ' 00:00:00',
                    this.filter.add_dates[1] + ' 00:00:00'
                ]
                createdAt = JSON.stringify(dates)
            }

            let para = {
                email: this.filter.email,
                status: this.filter.status,
                maintain: this.filter.maintain,
                createdAt: createdAt
                // pageSize: this.pageSize,
                // page: this.pageNo
            }
            // if(this.filter.add_dates)

            let data = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.platform_list
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data
                }
                // this.loading =false
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
        // 初始化时间
        this.getList()
        this.getTreeList()
    }
}
</script>
<style scoped>
/* .container {
    min-width: 1040px;
} */
.filter {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
}
/* margin-horizontal 水平边框为5px*/
/*  添加  */
.skin {
    display: flex;
}
.skin > li {
    display: flex;
    align-items: center;
}
.form > li {
    display: flex;
    align-items: baseline;
    padding: 0 100px;
    margin-top: 10px;
}
.form > li span:first-child {
    width: 4.3em;
    margin-right: 10px;
}
/* .form-authority {
    align-self: center;
    border: 1px solid #000;
} */
.radio-right {
    margin-left: 50px;
}

.text-center {
    text-align: center;
}

.gray {
    color: rgb(152, 155, 158);
}
.dia-inner {
    max-height: 80vh;
    overflow-y: auto;
}
.dia-maintain {
    display: flex;
    min-height: 420px;
    width: 700px;
    justify-content: center;
}
.w300 {
    width: 300px;
}
.maintain-btns {
    margin-top: 40px;
    text-align: center;
}

.center-box {
    display: flex;
    justify-content: center;
}
.dia-game {
    padding-bottom: 35px;
}
</style>