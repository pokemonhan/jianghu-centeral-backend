<template>
    <div class="container">
        厅主列表
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>厅主账号</span>
                    <Input class="w100" v-model="filter.acc" />
                </li>
                <li>
                    <span>站点状态</span>
                    <Select v-model="filter.website" :options="website_opt"></Select>
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
                <li class="mt10">
                    <span>站点有效日期</span>
                    <Date v-model="filter.effect_dates[0]" />
                    <span class="mh-5">至</span>
                    <Date v-model="filter.effect_dates[1]" />
                </li>
                <li class="mt10">
                    <span>站点维护日期</span>
                    <Date v-model="filter.maintain_dates[0]" />
                    <span class="mh-5">至</span>
                    <Date v-model="filter.maintain_dates[1]" />
                </li>
                <li class="mt10">
                    <button class="btn-blue">查询</button>
                    <button class="btn-blue">添加厅主</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <td>{{row.a1}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a3}}</td>
                    <td>
                        <i :class="[row.a4==='1'?'iconfont icongou green':'iconfont iconcha red']"></i>
                    </td>
                    <td>
                        <span
                            :class="['bold',row.a5==='1'?'orange':'gray']"
                        >{{row.a5==='1'?'维护中':'未维护'}}</span>
                    </td>
                    <td>
                        <div>{{String(row.a6).split('~')[0]}}</div>
                        <div>~</div>
                        <div>{{String(row.a6).split('~')[1]}}</div>
                    </td>
                    <td style="padding:5px 0;">
                        <div>{{String(row.a7).split('-')[0]}}</div>
                        <div>~</div>
                        <div>{{String(row.a7).split('-')[1]}}</div>
                    </td>
                    <td>{{row.a8}}</td>
                    <td>
                        <span class="a" @click="modShow(row)">{{row.a5==='1'?'启用':'禁用'}}</span>
                        <span class="a" @click="maintainShow(row)">维护</span>
                        <span class="a" @click="siteManageShow(row)">站点管理</span>
                        <span class="a" @click="domainShow(row)">域名管理</span>
                        <span class="a" @click="gameShow(row)">游戏管理</span>
                        <span class="a" @click="activeShow(row)">活动管理</span>
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
            title="站点维护"
            :content="is_turnon?'确认启用站点':'确认禁用站点'"
            @confirm="modConf"
        ></Modal>

        <Dialog :show="dia_show!==''" :title="dia_title" @close="dia_show=''">
            <div class="dia-inner">
                <!-- 添加 -->
                <div v-if="dia_show==='add'">
                    <ul class="form">
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
                            <textarea style="width:250px;height:80px;" class="textarea" v-model="form.domain"></textarea>
                        </li>
                        <li>
                            <span>代理方式:</span>
                            <Checkbox label="PC" v-model="form.checked[0]" />
                            <Checkbox style="margin-left:50px;" label="H5" v-model="form.checked[1]" />
                            <Checkbox style="margin-left:50px;" class="ml50" label="APP" v-model="form.checked[2]" />
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
                            <Radio class="radio-left" label="启用" :value="form.status" val="on" v-model="form.status" />
                            <Radio class="radio-right" label="禁用" :value="form.status" val="off" v-model="form.status" />
                        </li>
                        <li>
                            <div class="">
                                <button class="btn-plain-large">取消</button>
                                <button class="btn-blue-large">确定</button>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 维护 -->
                <div v-if="dia_show==='maintain'" class="dia-maintain">
                    <div style="align-self:flex-start;"> 维护时间: </div>
                    <div class="mt20">
                        <Date style="width:250px;" type="datetime" v-model="maintain_dates[0]" />
                        <Date style="width:250px; margin-top:20px;" type="datetime" v-model="maintain_dates[1]" />
                    </div>
                    <div class="maintain-btns">
                        <button class="btn-plain-large" @click="dia_show=''">取消</button>
                        <button class="btn-blue-large ml50" >确定</button>
                    </div>
                </div>

                <!-- 站点管理 -->
                <SiteManage v-if="dia_show==='site'" :id="'idshow'"/>

                <!-- 域名管理 -->
                <Domain v-if="dia_show==='domain'" :id="'idshow'"/>
                <!-- 游戏管理 -->
                <Gamemanage v-if="dia_show==='game'" :id="'idshow'"/>
                <!-- 活动管理 -->
                <ActiveManage v-if="dia_show==='active'" :id="'idshow'"/>
            </div>
        </Dialog>
    </div>
</template> 
<script>
import SiteManage from './halllist/SiteManage';
import Domain from './halllist/Domain';
import Gamemanage from './halllist/Gamemanage';
import ActiveManage from './halllist/ActiveManage';
export default {
    components:{
        SiteManage: SiteManage,
        Domain: Domain,
        Gamemanage: Gamemanage,
        ActiveManage: ActiveManage,
    },
    data() {
        return {
            filter: {
                acc: '',
                website: '',
                maintain: '',
                add_dates: [],
                effect_dates: [],
                maintain_dates: []
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
                { label: '启用', value: 0 },
                { label: '禁用', value: 1 }
            ],
            maintain_opt: [
                { label: '全部', value: '' },
                { label: '维护中', value: '1' },
                { label: '未维护', value: '0' }
            ],
            headers: [ '厅主账号', '站点名称', '短信数量', '站点状态', '维护状态', '站点有效日期', '站点维护日期', '站点添加日期', '操作' ],
            list: [ { a1: '8080@qq.com', a2: '江湖互娱', a3: '100000条', a4: '1', a5: '0', a6: '2019/11/09 13:40~2019/11/09 13:40', a7: '2019/11/09 13:40-2019/11/09 13:40', a8: '2019-02-02 21:30' }, { a1: '8080@qq.com', a2: '江湖互娱', a3: '100000条', a4: '0', a5: '1', a6: '2019/11/09 13:40~2019/11/09 13:40', a7: '2019/11/09 13:40-2019/11/09 13:40', a8: '2019-02-02 21:30' } ],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            mod_show: false,
            mod_cont: '',
            // 是否启用 站点
            is_turnon: false,
            // dia 弹窗
            dia_show: 'add', 
            dia_title: '临时标题!!!!',
            // 维护 dialog
            maintain_dates: [],
        }
    },
    methods: {
        modShow(row) {
            if (row.a5 === '1') {
                this.is_turnon = true
            } else {
                this.is_turnon = false
            }
            this.mod_show = true
        },
        modConf() {},
        // 维护
        maintainShow() {
            this.dia_show = 'maintain'
            this.dia_title = '维护'
        },
        // 站点管理
        siteManageShow() {
            this.dia_show = 'site'
            this.dia_title = '站点管理'
        },
        // 域名管理
        domainShow() {
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
        updateNo(val) {},
        updateSize(val) {}
    },
    mounted() {}
}
</script>
<style scoped>
.w100 {
    width: 100px;
}
.p10 {
    padding: 20px 10px;
}
/* margin-horizontal 水平边框为5px*/
/*  添加  */
.form > li{
    display: flex;
    align-items: baseline;
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

</style>