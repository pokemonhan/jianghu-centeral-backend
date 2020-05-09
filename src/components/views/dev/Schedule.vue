<template>
    <div class="container">
        <!-- 任务定时 -->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <button class="btn-blue" @click="add">添加</button>
                </li>
            </ul>
        </div>
        <div class="table mt10">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <!-- '命令名称','传递的参数','cron表达式','开启状态', '备注','生成时间','最后更新' -->
                    <td>{{row.command}}</td>
                    <td>
                        <ul>
                            <li v-for="(item,index) in row.param" :key="index">
                                <span class="bold">{{item.key}}:</span>
                                <span class="ml5">{{item.value}}</span>
                            </li>
                        </ul>
                    </td>
                    <td>{{row.schedule}}</td>
                    <td>
                        <Switchbox v-model="row.status" @update="statusSwitch($event,row)" />
                    </td>
                    <td>{{row.remarks}}</td>
                    <td>{{row.created_at}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>
                        <button class="btn-blue" @click="edit(row)">编辑</button>
                        <button class="btn-red" @click="del(row)">删除</button>
                    </td>
                </template>
            </Table>
            <!-- <Page
                class="table-page"
                :total="total"
                :pageNo.sync="pageNo"
                :pageSize.sync="pageSize"
                @updateNo="updateNo"
                @updateSize="updateSize"
            />-->
        </div>
        <Dialog :show.sync="dia_show" :title="dia_title">
            <div class="dia-inner loc-dialog">
                <ul class="form">
                    <li>
                        <span>命令名称</span>
                        <Input v-model="form.command" />
                    </li>

                    <li>
                        <span>传递参数</span>
                        <!-- <Input v-model="form.param" /> -->
                        <div>
                            <ul>
                                <li>{{form.parma}}</li>

                                <li
                                    class="mt10"
                                    v-for="(item, index) in (form.param||[{}])"
                                    :key="index"
                                >
                                    <div class="form-param">
                                        <Input v-model="item.key" />
                                        <span style="margin:0 8px 0">:</span>
                                        <Input v-model="item.value" />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <span>cron表达式</span>
                        <Input
                            placeholder="请输入定时策略"
                            v-model="form.schedule"
                            @focus="cronShow=true"
                        />
                    </li>
                    <li></li>
                    <li>
                        <span>状态</span>
                        <Radio
                            class="radio-left"
                            label="开启"
                            :value="form.status"
                            val="1"
                            v-model="form.status"
                        />
                        <Radio
                            class="radio-right ml50"
                            label="关闭"
                            :value="form.status"
                            val="0"
                            v-model="form.status"
                        />
                    </li>
                    <li>
                        <span>备注</span>
                        <Input v-model="form.remarks" />
                    </li>
                </ul>
                <div class="form-btn mt20">
                    <button class="btn-plain-large" @click="dia_show=false">取消</button>
                    <button class="btn-blue-large ml30" @click="diaCfm">确认</button>
                </div>
            </div>
        </Dialog>
        <Dialog :show.sync="cronShow" title="设置cron">
            <cron @change="changeCron" @close="cronShow=false" i18n="cn"></cron>
        </Dialog>
        <Modal
            :show.sync="mod_show"
            title="删除"
            :content="mod_content"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>
    </div>
</template>

<script>
import { cron } from 'vue-cron'
export default {
    components: {
        cron
    },
    data() {
        return {
            headers: [
                '命令名称',
                '传递的参数',
                'cron表达式',
                '开启状态',
                '备注',
                '生成时间',
                '最后更新',
                '操作'
            ],
            list: [],
            curr_row: {},
            // dialog
            dia_show: false,
            dia_title: '',
            dia_status: '',
            // cron 时间任务
            cronPopover: false,
            cronShow: false,
            /** form */
            form: {
                command: '', // 任务命令名称
                param: [{}], // 需要传递的参数 假数组
                schedule: '', // cron时间表达式
                status: 1, // 开启状态 0关闭 1开启
                remarks: '' // 定时任务用意描述备注
            },
            /**modal  */
            mod_show: false,
            mod_status: '',
            mod_content: ''
            // total: 0,
            // pageNo: 1,
            // pageSize: 2
        }
    },
    methods: {
        initForm() {
            this.form = {
                command: '', //任务命令名称
                param: [{}], // 需要传递的参数 数组里面有1个{} [{},{}]
                schedule: '', // cron时间表达式
                status: 1, // 开启状态 0关闭 1开启
                remarks: '' // 定时任务用意描述备注
            }
        },
        changeCron(val) {
            this.form.schedule = val
        },
        add() {
            this.initForm()
            this.dia_title = '添加'
            this.dia_status = 'add'
            this.dia_show = true
        },
        statusSwitch(val, row) {
            let data = {
                id: row.id,
                status: val ? 1 : 0
            }
            let { url, method } = this.$api.schedule_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.getList()
                }
            })
        },
        edit(row) {
            console.log('🍉 row: ', row)
            this.dia_title = '编辑'
            this.dia_status = 'edit'
            this.curr_row = row
            this.form = {
                id: row.id,
                command: row.command || [{}],
                param: row.param,
                schedule: row.schedule,
                status: row.status,
                remarks: row.remarks
            }
            this.dia_show = true
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
            // let param = [{ sign: 'ling' }, { sign1: 'ling1' }]
            // console.log('🍎 this.form.param: ', this.form.param)
            // [{"key":"df","value":"df"}]

            let param = (this.form.param || []).map(item => {
                let obj = {}
                obj[item.key] = item.value
                return obj
            })
            console.log(' param: ', param)
            let data = {
                command: this.form.command,
                param: JSON.stringify(param),
                schedule: this.form.schedule,
                status: this.form.status,
                remarks: this.form.remarks
            }
            // data = window.all.tool.rmEmpty(data)

            let { url, method } = this.$api.schedule_add
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
        editCfm() {
            let param = (this.form.param || []).map(item => {
                let obj = {}
                obj[item.key] = item.value
                return obj
            })
            let data = {
                id: this.form.id,
                command: this.form.command,
                param: JSON.stringify(param),
                schedule: this.form.schedule,
                status: this.form.status,
                remarks: this.form.remarks
            }
            data = window.all.tool.rmEmpty(data)

            let { url, method } = this.$api.schedule_set
            this.$http({ method, url, data }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },
        del(row) {
            console.log('🍎 row: ', row)
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_content = '是否删除该定时任务!'
            this.mod_show = true
        },
        modConf() {
            if (this.mod_status === 'del') {
                this.delCfm()
            }
        },
        delCfm() {
            let data = {
                id: this.curr_row.id
            }
            data = window.all.tool.rmEmpty(data)
            let { url, method } = this.$api.schedule_del
            this.$http({ method, url, data }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.mod_show = false
                    this.getList()
                }
            })
        },
        // 后端参数转换 {"aa":"bb"} 转成{key:"aa",value:"bb"}
        toNeedObj(obj = {}) {
            let temp_obj = {}
            for (const key in obj) {
                temp_obj = {
                    key: key,
                    value: obj[key]
                }
            }
            return temp_obj
        },
        getList() {
            let para = {
                // pageSize: this.pageSize,
                // page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)

            let { url, method } = this.$api.schedule_list
            this.$http({ method, url, params }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    // this.total = res.data.total
                    let list = res.data.data || []
                    this.list = list.map(item => {
                        let param = item.param

                        if (Array.isArray(param)) {
                            item.param = param.map(par => {
                                return this.toNeedObj(par)
                            })
                        }
                        return item
                    })
                    // this.list = list
                    console.log('🍱 this.list: ', this.list)
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
.dia-inner {
    /* width: 700px; */
    /* min-width: 700px; */
    /* min-height: 600px; */
    /* margin: 0 auto; */
    padding: 0 60px;
}
.form {
    width: 100%;
}
.form > li {
    display: flex;
    align-items: center;
    width: 100%;
    line-height: 30px;
    margin-top: 20px;
}
.form > li > span:first-child {
    min-width: 8em;
    text-align: right;
    margin-right: 10px;
}
.form > li > .v-input {
    width: 300px;
}
.form-btn {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
.form-param {
    display: flex;
}
.form-param .v-input {
    width: 140px;
}
</style>