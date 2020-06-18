<template>
    <div class="cont">
        <!-- 厅主列表 - 站点管理 -->
        <div class="head">
            <el-steps :active="active" align-center finish-status="success">
                <el-step
                    class="pointer"
                    title="代理方式"
                    description="有效日期"
                    :status="stepStatus(0)"
                    @click.native="active=0"
                ></el-step>
                <el-step
                    class="pointer"
                    title="皮肤"
                    description="更改皮肤"
                    :status="stepStatus(1)"
                    @click.native="active=1"
                ></el-step>
                <el-step
                    class="pointer"
                    title="短信数量"
                    description="修改短信数量"
                    :status="stepStatus(2)"
                    @click.native="active=2"
                ></el-step>
                <el-step
                    class="pointer"
                    title="权限"
                    description="权限选项"
                    :status="stepStatus(3)"
                    @click.native="active=3"
                ></el-step>
            </el-steps>
        </div>
        <div class="body mt50">
            <div class="form-cont">
                <ul v-if="active===0" class="form">
                    <li>
                        <span>代理方式:</span>
                        <Checkbox label="PC" v-model="agency_method[0]" />
                        <Checkbox label="H5" v-model="agency_method[1]" />
                        <Checkbox label="APP" v-model="agency_method[2]" />
                        <p v-show="!agency_method.find(item=>item)" class="err-tips">至少选择一个!</p>
                    </li>

                    <li>
                        <span>有效日期:</span>
                        <div class="text-center">
                            <date style="width:340px;" type="datetimerange" v-model="dates" />
                            <p v-show="!(dates[0]&&dates[1])" class="red mt5">开始时间和结束都不可为空!</p>
                        </div>
                    </li>
                </ul>
                <ul v-if="active===1" class="skin">
                    <li>
                        <span class="skin-pc">PC皮肤:</span>
                        <Select v-model="pc_skin_id" :options="pc_skin_opt"></Select>
                    </li>
                    <li>
                        <span>H5皮肤:</span>
                        <Select v-model="h5_skin_id" :options="skin_h5_opt"></Select>
                    </li>
                    <li>
                        <span>APP皮肤:</span>
                        <Select v-model="app_skin_id" :options="skin_app_opt"></Select>
                    </li>
                </ul>
                <ul v-if="active===2" class="form">
                    <li>
                        <span>修改短信数量:</span>
                        <Select
                            v-model="type"
                            :options="[{label:'增加',value:1},{label:'减少',value:0}]"
                        ></Select>
                        <Input
                            :showerr="type===0&&sms_num>last_sms_num"
                            errmsg="数字错误"
                            class="w280"
                            limit="p-integer"
                            v-model="sms_num"
                        />
                        <span class="ml20">剩余短信数量: {{last_sms_num}}</span>
                    </li>
                </ul>
                <ul v-if="active===3" class="form">
                    <li>
                        <span>权限选项:</span>
                        <!-- <AuthorityTree
                            style="width:500px;"
                            :menutree="tree_list"
                            v-model="role"
                            @update="treeListUpd"
                        /> -->
                      
                        <div>
                            <AuthorityList
                                style="width:500px;"
                                :menutree="tree_list"
                                v-model="role"
                                @update="treeListUpd"
                            />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="btns">
            <button class="btn-plain-large" @click="initial">重置</button>
            <button v-show="active===3" class="btn-blue-large ml50" @click="save">保存</button>
        </div>
    </div>
</template>


<script>
import { Steps, Step } from 'element-ui'
import AuthorityTree from '../../../commonComponents/AuthorityTree'
import AuthorityList from '../../../commonComponents/AuthorityList'
export default {
    props: {
        row: {
            type: Object,
            default: () => {}
        },
        tree_list: Array
    },
    components: {
        AuthorityTree: AuthorityTree,
        AuthorityList: AuthorityList,
        [Steps.name]: Steps,
        [Step.name]: Step
    },
    data() {
        return {
            // show_black_list_conf: true,
            active: 0,
            agency_method: [false, false, false],
            dates: [],
            pc_skin_id: 0,
            h5_skin_id: 0,
            app_skin_id: 0,
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
            type: 1, // 短信操作方式  0减少 1增加
            last_sms_num: '', // 剩余短信数量
            sms_num: '',
            authority: '',
            // authorityList: []
            role: [] // 权限内容
        }
    },
    methods: {
        initial() {
            let row = this.row
            if (row) {
                let agency_method = (row.agency_method || '').split(',')
                let arr = agency_method || []
                this.agency_method = []

                arr.forEach((item, index) => {
                    // 使代理方式checkbox 选中
                    this.agency_method[item - 1] = true // 代理方式
                })
                // console.log('this.agency_method: ', this.agency_method);
                this.dates[0] = row.start_time // 有效日期
                this.dates[1] = row.end_time
                this.pc_skin_id = row.pc_skin_id // 皮肤
                this.h5_skin_id = row.h5_skin_id
                this.app_skin_id = row.app_skin_id
                this.last_sms_num = row.sms_num // 剩余短信数量
                this.sms_num = ''
                this.role = row.role.slice() // 权限选项
            }
        },
        treeListUpd() {},
        step0Check() {
            let had_agent_method = this.agency_method.find(item => item)
            let had_date = this.dates[0] && this.dates[1]
            return had_agent_method && had_date
        },
        step1Check() {
            return true
        },
        step2Check() {
            return true
        },
        step3Check() {
            return this.role.length > 0
        },
        checkForm() {
            if (!this.agency_method.find(item => item)) {
                this.$toast.warning('代理方式不可为空!')
                return false
            }
            return true
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
                        return this.step3Check() ? 'success' : 'error'
                        break
                    default:
                        break
                }
            }
        },
        save() {
            if (!this.checkForm()) return
            function getAgencyMethod(arr) {
                let agencyArr = []
                arr.forEach((item, index) => {
                    item && agencyArr.push(index + 1)
                })
                if (agencyArr.length) {
                    return agencyArr.toString()
                } else {
                    return ''
                }
            }
            let data = {
                // id: this.id,
                // agency_method: agency_method.join(','),
                // role: '',

                id: this.row.id, //id
                agency_method: getAgencyMethod(this.agency_method), // 代理方式
                start_time: this.dates[0], // 有效日期 开始时间
                end_time: this.dates[1], // 有效日期 结束时间

                pc_skin_id: this.pc_skin_id, // PC皮肤id
                h5_skin_id: this.h5_skin_id, // H5皮肤ID
                app_skin_id: this.app_skin_id, // APP皮肤ID
                type: this.type,
                sms_num: this.sms_num || 0, // 短信操作数量
                role: JSON.stringify(this.role) // 菜单权限
            }

            let { url, method } = this.$api.site_manage_set
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    // this.getList()
                    this.$emit('confirm')
                }
            })
        }
    },
    mounted() {
        this.initial()
    }
}
</script>

<style scoped>
.cont {
    min-width: 800px;
    height: 740px;
    padding-top: 50px;
    padding-bottom: 90px;
}

.form-cont {
    display: flex;
    justify-content: center;
}
.form > li {
    display: flex;
    align-items: baseline;
    position: relative;
    min-height: 32px;
    margin-top: 20px;
}
.form > li > span:first-child {
    width: 7em;
    margin-right: 15px;
}
.mt5 {
    margin-top: 5px;
}
.err-tips {
    position: absolute;
    left: 10em;
    top: 32px;
    color: rgb(255, 17, 0);
    /* font-size: 12px; */
}
.transparent {
    opacity: 0;
    border: 1px solid #000;
}
.ml20 {
    margin-left: 20px;
}
.text-center {
    text-align: center;
}
.btns {
    margin-top: 50px;
    text-align: center;
}
.ml50 {
    margin-left: 50px;
}
.right {
    margin-left: 100px;
}
.skin {
    display: flex;
}
.skin > li {
    display: flex;
    align-items: center;
    margin-right: 20px;
}
.skin .skin-pc {
    margin-right: 25px;
}
.skin li:not(:first-child) > span:first-child {
    margin-right: 10px;
}
.w280 {
    width: 280px;
}
</style>
