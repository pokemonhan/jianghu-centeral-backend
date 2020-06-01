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
                    <!-- '命令名称','arguments','option',,'cron表达式','开启状态', '备注','生成时间','最后更新' -->
                    <td>{{row.command}}</td>
                    <td>
                        <ul v-if="row.argument.length">
                            <li v-for="(item,index) in row.argument" :key="index">
                                <span class="bold">{{item.left}}:</span>
                                <span class="ml5">{{item.right}}</span>
                            </li>
                        </ul>
                        <div v-else>---</div>
                    </td>
                    <td>
                        <ul v-if="row.argument.length">
                            <li v-for="(item,index) in row.option" :key="index">
                                <span class="bold">{{item.left}}:</span>
                                <span class="ml5">{{item.right}}</span>
                            </li>
                        </ul>
                        <div v-else>---</div>
                    </td>
                    <td>{{row.schedule||'---'}}</td>
                    <td>
                        <Switchbox v-model="row.status" @update="statusSwitch($event,row)" />
                    </td>
                    <td>{{row.remarks}}</td>
                    <td>{{row.created_at||'---'}}</td>
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
                    <li class="align-center">
                        <span>命令名称</span>
                        <Select input v-model="form.command" :options="command_opt"></Select>
                    </li>
                    <li>
                        <span>cron表达式</span>
                        <Input placeholder="请输入定时策略" v-model="form.schedule" />
                        <button class="btns-blue" @click="cronShow=true">生成 cron</button>
                    </li>
                    <li>
                        <span>arguments</span>
                        <!-- <Input v-model="form.param" /> -->
                        <div>
                            <ul>
                                <li
                                    class="mt10"
                                    v-for="(item, index) in form.argument"
                                    :key="index"
                                >
                                    <div class="form-param">
                                        <Input limit="en-num" v-model="item.left" />
                                        <span style="margin:0 8px 0">:</span>
                                        <Input limit="en-num" v-model="item.right" />
                                        <i
                                            class="iconfont icontianjia ml10"
                                            @click="argAdd(form.argument,index)"
                                        ></i>
                                        <i
                                            class="iconfont iconcuowuguanbi- ml10"
                                            @click="argDel(form.argument,index)"
                                        ></i>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <span>options</span>
                        <ul>
                            <li class="mt10" v-for="(item, index) in form.option" :key="index">
                                <div class="form-param">
                                    <Input limit="en-num" v-model="item.left" />
                                    <span style="margin:0 8px 0">:</span>
                                    <Input limit="en-num" v-model="item.right" />
                                    <i
                                        class="iconfont icontianjia ml10"
                                        @click="argAdd(form.option,index)"
                                    ></i>
                                    <i
                                        class="iconfont iconcuowuguanbi- ml10"
                                        @click="argDel(form.option, index)"
                                    ></i>
                                </div>
                            </li>
                        </ul>
                    </li>
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
                    <button class="btn-blue-large ml50" @click="diaCfm">确认</button>
                </div>
            </div>

            <Dialog :show.sync="cronShow" title="设置cron">
                <cron :value="form.schedule" @input="changeCron" @confirm="cronCfm"></cron>
            </Dialog>
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
// import { cron } from 'vue-cron'
import cron from '.././../commonComponents/cron'
export default {
    name: 'Schedule',
    components: {
        cron
    },
    data() {
        return {
            headers: [
                '命令名称',
                'arguments',
                'option',
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
            command_opt: [],
            form: {
                command: '', // 任务命令名称
                schedule: '', // cron时间表达式
                argument: [], // 必须传递的参数  对象转的数组  不是指这里的必填。可以为空
                option: [], // 可选传递的参数
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
                command: '', // 任务命令名称
                schedule: '', // cron时间表达式
                argument: [{ left: '', right: '' }], // 必须传递的参数  对象转的数组  不是指这里的必填。可以为空
                option: [{ left: '', right: '' }], // 可选传递的参数
                status: 1, // 开启状态 0关闭 1开启
                remarks: '' // 定时任务用意描述备注
            }
        },
        changeCron(val) {
            // console.log('🍱 val: ', val);
            this.form.schedule = val
        },
        cronCfm(val) {
            this.cronShow = false
            // console.log('🍍 val: ', val);
            this.form.schedule = val
        },
        argAdd(arr, index) {
            if (arr.length > 5) {
                this.$toast.info('最多5个')
                return
            }

            arr.splice(index + 1, 0, { left: '', right: '' })
        },
        argDel(arr, index) {
            if (arr.length === 1) {
                let empty_arr = [{ left: '', right: '' }]
                arr = arr.splice(index, 1, empty_arr)
            } else {
                arr.splice(index, 1)
            }
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
            // if(this.)
            this.form = {
                id: row.id,
                command: row.command,
                schedule: row.schedule,
                argument: JSON.parse(JSON.stringify(row.argument)),
                option: JSON.parse(JSON.stringify(row.option)),
                status: row.status,
                remarks: row.remarks
            }
            if (this.form.argument.length === 0) {
                this.form.argument = [{ left: '', right: '' }]
            }
            if (this.form.option.length === 0) {
                this.form.option = [{ left: '', right: '' }]
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
            let data = {
                id: this.form.id,
                command: this.form.command,
                // param: JSON.stringify(param),
                schedule: this.form.schedule,
                status: this.form.status,
                remarks: this.form.remarks
            }
            let argument = this.toNeedArg(this.form.argument)
            let option = this.toNeedOpt(this.form.option)
            if (argument) {
                data.argument = JSON.stringify(argument)
            }
            if (option) {
                data.option = JSON.stringify(option)
            }
            // data = window.all.tool.rmEmpty(data)

            let { url, method } = this.$api.schedule_add
            this.$http({ method, url, data }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },

        editCfm() {
            let data = {
                id: this.form.id,
                command: this.form.command,
                // param: JSON.stringify(param),
                argument: '{}',
                option: '{}',
                schedule: this.form.schedule,
                status: this.form.status,
                remarks: this.form.remarks
            }
            let argument = this.toNeedArg(this.form.argument)
            let option = this.toNeedOpt(this.form.option, '--')
            if (argument) {
                data.argument = JSON.stringify(argument)
            }
            if (option) {
                data.option = JSON.stringify(option)
            }
            // data = window.all.tool.rmEmpty(data)

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
            // console.log('🍎 row: ', row)
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
        /**
         * 转换成后端需要数据 [{left:"sigin",right:"ling"}] 转成 {"sigin":"ling"}
         * @param {string} prefix 添加前缀
         * */
        toNeedArg(arr = [], prefix = '') {
            let obj = {}
            arr.forEach(item => {
                if (item.left) {
                    obj[prefix + item.left] = item.right
                }
            })
            if (JSON.stringify(obj) === '{}') {
                return ''
            } else {
                return obj
            }
        },
        toNeedOpt(arr = []) {
            let opt_arr = []

            arr.forEach(item => {
                if (item.left && item.right) {
                    // ｛"--key1=value1","--key2=value2"｝
                    let child = '--' + item.left + '=' + item.right
                    opt_arr.push(child)
                }
            })

            if (opt_arr.length === 0) {
                return ''
            } else {
                return opt_arr
            }
        },
        toNeedArr(arg_opt) {
            let arr = []
            if (!arg_opt) {
                return arr
            }
            // arg_opt 可能是 Array 数组格式 ，
            if (Array.isArray(arg_opt)) {
                return arg_opt.map(item => {
                    item = item.replace('--', '')
                    let leftAndRight = item.split('=')
                    return {
                        left: leftAndRight[0],
                        right: leftAndRight[1]
                    }
                })
            }
            for (const key in arg_opt) {
                arr.push({
                    left: key,
                    right: arg_opt[key]
                })
            }
            return arr
        },
        getCommandOpt() {
            let http_option = {
                url: this.$store.state.picPrefix + 'common/linter.json'
            }
            // 请求所有下拉路径
            this.$http(http_option).then(res => {
                if (res) {
                    // console.log('🍞 res: ', res);
                    let command_list = res.system_command_list.path
                    // 请求 命令集opt
                    if (command_list) {
                        let option = { url: command_list }
                        this.$http(option).then(res => {
                            if (res && Array.isArray(res)) {
                                this.command_opt = res.map(item => {
                                    return {
                                        title: item.description,
                                        label: item.sign,
                                        value: item.sign
                                    }
                                })
                            }
                        })
                    }
                }
            })
            // 请求命令内容
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
                        item.argument = this.toNeedArr(item.argument)
                        item.option = this.toNeedArr(item.option)
                        return item
                    })

                    // this.list = list
                    // console.log('🍱 this.list: ', this.list)
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
        this.getCommandOpt()
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
    align-items: baseline;
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
.form > li > .v-select {
    width: 300px;
}
.form .align-center {
    align-items: center;
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
.form-param .icontianjia:hover {
    cursor: pointer;
    color: #4c8bfd;
}
.form-param .iconcuowuguanbi-:hover {
    cursor: pointer;
    color: rgb(255, 60, 0);
}
</style>