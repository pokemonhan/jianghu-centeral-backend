<template>
    <div class="container">
        <!-- 厅主列表 -->

        <div class="filter">
            <ul class="left">
                <li>
                    <span>厅主账号</span>
                    <Input class="w100" v-model="filter.email" />
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
                    <Date v-model="filter.add_dates[0]" />
                    <span class="mh-5">至</span>
                    <Date v-model="filter.add_dates[1]" />
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
                    <td>{{row.owner &&row.owner.email}}</td>
                    <td>{{row.name}}</td>
                    <td>{{'??'}}</td>
                    <td>
                        <i
                            :class="[row.status===1?'iconfont icongou green':'iconfont iconcha red']"
                        ></i>
                    </td>
                    <td>
                        <span
                            :class="['bold',row.a5==='1'?'orange':'gray']"
                        >{{row.a5==='1'?'维护中??':'未维护??'}}</span>
                    </td>
                    <td style="font-size:12px;padding:5px;">
                        <div>{{String(row.a6).split('~')[0]}}</div>
                        <div>~??</div>
                        <div>{{String(row.a6).split('~')[1]}}</div>
                    </td>
                    <td style="font-size:12px;padding:5px;">
                        <div>{{String(row.a7).split('-')[0]}}</div>
                        <div>~??</div>
                        <div>{{String(row.a7).split('-')[1]}}</div>
                    </td>
                    <td>{{row.created_at}}</td>
                    <td style="padding:5px 0;">
                        <div>
                            <!-- <button class="btns-blue" @click="operateMod(row)">{{row.a5==='1'?'启用':'禁用'}}</button> -->
                        <button :class="[row.status?'btns-red':'btns-green']" @click="operateMod(row)">{{row.status===1?'禁用':'启用'}}</button>

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

            <Page
                class="table-page"
                :total="total"
                :pageNo.sync="pageNo"
                :pageSize.sync="pageSize"
                @updateNo="updateNo"
                @updateSize="updateSize"
            />
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
                            <Input class="w250" v-model="form.acc" />
                        </li>
                        <li>
                            <span>登录密码:</span>
                            <Input class="w250" type="password" v-model="form.pwd" />
                        </li>
                        <li>
                            <span>有效日期:</span>
                            <div>
                                <Date style="width:250px;" type="datetime" v-model="form.dates[0]" />
                                <div class="text-center">至</div>
                                <Date style="width:250px;" type="datetime" v-model="form.dates[1]" />
                            </div>
                        </li>
                        <li>
                            <span>站点名称:</span>
                            <Input class="w250" v-model="form.site_name" />
                        </li>
                        <li>
                            <span>主域名:</span>
                            <textarea
                                style="width:250px;height:80px;"
                                class="textarea"
                                v-model="form.domain"
                            ></textarea>
                        </li>
                        <li>
                            <span>代理方式:</span>
                            <Checkbox label="PC" v-model="form.checked[0]" />
                            <Checkbox
                                style="margin-left:50px;"
                                label="H5"
                                v-model="form.checked[1]"
                            />
                            <Checkbox
                                style="margin-left:50px;"
                                class="ml50"
                                label="APP"
                                v-model="form.checked[2]"
                            />
                        </li>
                        <li>
                            <span>权限选择</span>
                            <Input class="w250" v-model="form.authority" />
                        </li>
                        <li>
                            <span>短信数量</span>
                            <Input class="w250" limit="p-integer" v-model="form.sms" />
                        </li>
                        <li>
                            <span>站点标识</span>
                            <Input class="w250" v-model="form.site_ident" />
                        </li>
                        <li>
                            <span>厅主状态:</span>
                            <Radio
                                class="radio-left"
                                label="启用"
                                :value="form.status"
                                val="on"
                                v-model="form.status"
                            />
                            <Radio
                                class="radio-right"
                                label="禁用"
                                :value="form.status"
                                val="off"
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
                    <div style="align-self:flex-start;">维护时间:</div>
                    <div class="mt20">
                        <Date style="width:250px;" type="datetime" v-model="maintain_dates[0]" />
                        <Date
                            style="width:250px; margin-top:20px;"
                            type="datetime"
                            v-model="maintain_dates[1]"
                        />
                    </div>
                    <div class="maintain-btns">
                        <button class="btn-plain-large" @click="dia_show=''">取消</button>
                        <button class="btn-blue-large ml50" @click="maintainCfm">确定</button>
                    </div>
                </div>

                <!-- 站点管理 -->
                <SiteManage v-if="dia_show==='site'" :id="curr_row.id" />

                <!-- 域名管理 -->
                <Domain v-if="dia_show==='domain'" :sign="curr_row.sign" />
                <!-- 游戏管理 -->
                <Gamemanage v-if="dia_show==='game'" :id="curr_row" />
                <!-- 活动管理 -->
                <ActiveManage v-if="dia_show==='active'" :id="curr_row.id" />
            </div>
        </Dialog>
    </div>
</template> 
<script>
import SiteManage from './HallListDir/SiteManage'
import Domain from './HallListDir/Domain'
import Gamemanage from './HallListDir/Gamemanage'
import ActiveManage from './HallListDir/ActiveManage'
export default {
    components: {
        SiteManage: SiteManage,
        Domain: Domain,
        Gamemanage: Gamemanage,
        ActiveManage: ActiveManage
    },
    data() {
        return {
            filter: {
                status: '',
                acc: '',
                website: '',
                maintain: '',
                add_dates: []
            },
            form: {
                acc: '',
                pwd: '',
                dates: [],
                site_name: '',
                domain: '',
                checked: [],
                authority: '',
                sms: '',
                site_ident: '',
                status: 'on'
            },
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
            maintain_dates: []
        }
    },
    methods: {
        addHall() {
            this.dia_show = 'add'
            this.dia_title = '添加厅主'
        },

        // 确认添加厅主
        addHallCfm() {
            // let para = {
            //     name: this.filter.vendor,
            //     status: this.filter.status,
            //     pageSize: this.pageSize,
            //     page: this.pageNo
            // }
            // TODO:  ..

            // let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.platform_add
            this.$http({
                method: method,
                url: url,
                data: data
            }).then(res => {
                if (res && res.code === '200') {
                    self.total = res.data.total
                    self.list = res.data.data
                    this.$toast.success(res && res.message)
                } else {
                    if (res && res.message !== '') {
                        self.$toast.error(res.message)
                    }
                }
            })
        },
        // 【禁用】或【启用】站点
        operateMod(row) {
            this.curr_row = row
            this.mod_status = 'switch'
            this.mod_show = true
        },

        // 禁用启用 确认
        modConf() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status === 1 ? 0 : 1
            }
            let { url, method } = this.$api.platform_switch_set
            this.$http({
                method: method,
                url: url,
                data: data
            }).then(res => {
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
        // 维护
        maintainShow(row) {
            this.curr_row = row
            this.dia_show = 'maintain'
            this.dia_title = '维护'
        },
        // 站点管理
        siteManageShow() {
            this.dia_show = 'site'
            this.dia_title = '站点管理'
        },
        // 域名管理
        domainShow(row) {
            console.log('row: ', row);
            this.curr_row = row

            this.dia_show = 'domain'
            this.dia_title = '域名管理'
        },
        // 游戏管理
        gameShow() {
            this.dia_show = 'game'
            this.dia_title = '游戏管理'
        },
        // 活动管理
        activeShow() {
            this.dia_show = 'active'
            this.dia_title = '活动管理'
        },
        maintainCfm() {
            let data = { id: this.curr_row.id, }
            // TODO:
            let { url, method } = this.$api.platform_maintain_set
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
            
                    this.$toast.success(res && res.message)
                    this.dia_show=false
                    this.getList()
                }
            })
        },
        getList() {
            /**
             * TODO 🎈
             */
            let para = {
                email: this.filter.email,
                status: this.filter.status,
                createAt: JSON.stringify(this.filter.add_dates),
                pageSize: this.pageSize,
                page: this.pageNo
            }
            // if(this.filter.add_dates)

            let data = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.platform_list
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data
                } else {
                    if (res && res.message !== '') {
                        this.toast.error(res.message)
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
        this.getList()
        // 初始化时间
        let date = this.filter.add_dates
        date[0] = '2000-01-01'
        date[1] = window.all.tool.formatDate(new Date())
    }
}
</script>
<style scoped>
.w100 {
    width: 100px;
}
.filter {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 5px;
}
/* margin-horizontal 水平边框为5px*/
/*  添加  */

.form > li {
    display: flex;
    align-items: baseline;
    padding: 0 150px;
    margin-top: 10px;
}
.form > li span:first-child {
    width: 4.3em;
    margin-right: 10px;
}
.radio-right {
    margin-left: 50px;
}

.text-center {
    text-align: center;
}
.mh-5 {
    margin-left: 5px;
    margin-right: 5px;
}
.mt10 {
    margin-top: 10px;
}
.mt20 {
    margin-top: 20px;
}
.gray {
    color: rgb(152, 155, 158);
}
.dia-inner {
    max-height: 80vh;
    overflow: auto;
}
.dia-maintain {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.maintain-btns {
    margin-top: 40px;
    text-align: center;
}
.ml50 {
    margin-left: 50px;
}
.w250 {
    width: 250px;
}
.center-box {
    display: flex;
    justify-content: center;
}
.mt50 {
    margin-top: 50px;
}
.ml50 {
    margin-left: 50px;
}
</style>