<template>
    <div class="container">
        <!-- 游戏分类配置 -->

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>分类名称</span>
                    <Input v-model="filter.name" />
                </li>
                <li>
                    <span>分类状态</span>
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
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.name}}</td>
                    <!-- <td
                        :class="[row.status?'green':'red']"
                    >{{row.status===1?'开启':row.status===0?'关闭':'???'}}</td> -->
                     <td>
                        <Switchbox v-model="row.status" @update="statusSwitch(row)" />
                    </td>
                    <td>{{row.sign}}</td>
                    <td>{{row.author && row.author.name}}</td>
                    <td>{{row.created_at}}</td>
                    <td>{{row.last_editor&&row.last_editor.name}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>
                        <button class="btns-blue" @click="edit(row)">编辑</button>
                        <!-- <button :class="[row.status?'btns-red':'btns-green']" @click="statusSwitch(row)">{{row.status===1?'禁用':'启用'}}</button> -->

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
                    <ul class="form">
                        <li>
                            <span>分类名称</span>
                            <Input class="w250" v-model="form.name" />
                            <span class="err-tips">{{form.name===''?'不可为空':''}}</span>
                        </li>
                        <li>
                            <span>分类标识</span>
                            <Input class="w250" limit="word" v-model="form.sign" />
                            <span class="err-tips">{{form.sign===''?'不可为空':''}}</span>
                        </li>
                        <li v-if="dia_status==='add'">
                            <span>状态选择</span>
                            <Radio
                                class="radio-left"
                                label="启用"
                                :value="form.status"
                                val="1"
                                v-model="form.status"
                            />
                            <Radio
                                class="radio-right ml50"
                                label="禁用"
                                :value="form.status"
                                val="0"
                                v-model="form.status"
                            />
                        </li>
                        <li class="center-box">
                            <button class="btn-plain-large" @click="dia_show=false">取消</button>
                            <button class="btn-blue-large ml50" @click="diaConfirm">确定</button>
                        </li>
                    </ul>
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
</template> <script>
export default {
    name: 'GameSort',
    data() {
        return {
            filter: {
                name: '',
                status: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '开启', value: 1 },
                { label: '关闭', value: 0 }
            ],
            headers: [
                '编号',
                '分类名称',
                '分类状态',
                '分类标识',
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
                name: '',
                sign: '',
                status: 1
            },
        
            // mod 禁用删除框
            mod_show: false,
            mod_status: '',
            mod_title: '',
            mod_cont: ''
        }
    },
    methods: {
        initForm() {
            this.form = {
                name: '',
                sign: '',
                status: '1'
            }
        },
        add() {
            this.dia_status = 'add'
            this.dia_title = '添加'
            this.initForm()
            this.dia_show = true
        },
        edit(row) {
            this.dia_show = true
            this.form = {
                id: row.id,
                name: row.name,
                sign: row.sign,
                // status: row.status
            }
            this.dia_status = 'edit'
        },
        statusSwitch(row) {
            this.curr_row = row
            // this.mod_title = row.status === 1 ? '禁用' : '启用'
            // this.mod_cont = `是否确定${this.mod_title}该游戏分类？`
            // this.mod_status = 'switch'
            // this.mod_show = true
            this.statusSet()
        },
        del(row) {
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_title = '删除'
            this.mod_cont = '是否确定该游戏分类？'
            this.mod_show = true
        },

        diaConfirm() {
            if (this.dia_status === 'add') {
                this.addCfm()
            } else if (this.dia_status === 'edit') {
                this.editCfm()
            }
        },
        checkForm() {
            if (this.form.name === '') {
                this.$toast.warning('分类名称不可为空!')
                return false
            }
            if (this.form.sign === '') {
                this.$toast.warning('分类标识不可为空!')
                return false
            }
            return true
        },
        // 添加确认
        addCfm() {
            if (!this.checkForm()) return
            let data = {
                name: this.form.name,
                sign: this.form.sign,
                status: this.form.status
            }
            let { url, method } = this.$api.dev_game_type_add

            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },

        // 编辑确认
        editCfm() {
            if (!this.checkForm()) return
            let data = this.form
        
            let { url, method } = this.$api.dev_game_type_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
        
                    this.$toast.success(res && res.message)
                    this.dia_show=false
                    this.getList()
                }
            })
        },
        modConf() {
            console.log('this.mod_status: ', this.mod_status)
            if (this.mod_status === 'switch') {
                this.statusSet()
            } else if (this.mod_status === 'del') {
                this.delSet()
            }
        },
        statusSet() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status? 1 : 0
            }
            let { url, method } = this.$api.dev_game_sort_status_set
            this.$http({ method, url, data }).then(res => {
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
        delSet() {
            let data = { id: this.curr_row.id }

            let { url, method } = this.$api.dev_game_type_del
            this.$http({ method, url, data }).then(res => {
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
        getList() {
            let para = {
                name: this.filter.name,
                status: this.filter.status,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.dev_game_type_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
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
    display: flex;
    justify-content: center;
    min-width: 600px;
    padding-bottom: 20px;
}
.form > li {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 20px;
}
.form > li > span:first-child {
    width: 5em;
}
.form li .err-tips {
    position: absolute;
    top: 30px;
    left: 6em;
    color: red;
}
.w250 {
    width: 250px;
}
.ml50 {
    margin-left: 50px;
}

.form .center-box {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}
</style>