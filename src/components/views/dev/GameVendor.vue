<template>
    <div class="container">
        <!-- 游戏厂商配置 -->

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>游戏厂商</span>
                    <Input class="w100" v-model="filter.name" />
                </li>
                <li>
                    <span>厂商状态</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查找</button>
                    <button class="btn-blue" @click="add">添加</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.name}}</td>
                    <td
                        :class="row.status?'green':'red'"
                    >{{row.status===1?'开启':row.status===0?'关闭':'-??'}}</td>
                    <td>{{row.sign}}</td>
                    <td>{{row.author&&row.author.name}}</td>
                    <td>{{row.created_at}}</td>
                    <td>{{row.last_editor&&row.last_editor.name}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>
                        <span class="a" @click="edit(row)">编辑</span>
                        <span class="a" @click="switchStatus(row)">禁用</span>
                        <span class="a" @click="del(row)">删除</span>
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
                            <span>厂商名称:</span>
                            <Input class="w250" v-model="form.name" />
                            <span v-show="!form.name" class="err-tips">厂商名不可为空</span>
                        </li>
                        <li>
                            <span>厂商标识:</span>
                            <Input class="w250" v-model="form.sign" />
                            <span v-show="!form.sign" class="err-tips">厂商标识不可为空</span>
                        </li>
                        <li>
                            <span>白名单:</span>
                            <textarea class="textarea" v-model="form.whitelist_ips"></textarea>
                        </li>
                        <li>
                            <span>状态选择:</span>
                            <Radio
                                class="radio-left"
                                label="启用"
                                :value="form.status"
                                val="1"
                                v-model="form.status"
                            />
                            <Radio
                                class="radio-right ml100"
                                label="禁用"
                                :value="form.status"
                                val="0"
                                v-model="form.status"
                            />
                        </li>
                        <li class="center-box">
                            <button class="btn-plain-large" @click="dia_show=false">取消</button>
                            <button class="btn-blue-large ml50" @click="diaCfm">确认</button>
                        </li>
                    </ul>
                </div>
            </div>
        </Dialog>
        <Modal :show.sync="mod_show" :title="mod_title" :content="mod_cont" @confirm="modConf"></Modal>
    </div>
</template> <script>
export default {
    data() {
        return {
            filter: {
                name: '',
                status: '',
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' }
            ],
            headers: [
                '编号',
                '游戏厂商',
                '厂商状态',
                '厂商标识',
                '添加人',
                '添加时间',
                '最后更新人',
                '最后更新时间',
                '操作'
            ],
            list: [
                {
                    a1: '64646466',
                    a2: 'sdfsdfdsf',
                    a3: '充支好礼',
                    a4: '1',
                    a5: '2019-02-02 21:30'
                },
                {
                    a1: '64646466',
                    a2: 'sdfsdfdsf',
                    a3: '充支好礼',
                    a4: '1',
                    a5: '2019-02-02 21:30'
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            // 添加， 编辑 内容
            curr_row: {},
            dia_show: false,
            dia_status: '',
            dia_title: '',
            form: {
                name: '',
                sign: '',
                whitelist_ips: '',
                status: '1' //设置默认
            },

            // mod
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
                whitelist_ips: '',
                status: '1'
            }
        },
        add() {
            this.initForm()
            this.dia_status = 'add'
            this.dia_title = '添加'

            this.dia_show = true
        },
        edit(row) {
            this.form = {
                id: row.id,
                name: row.name,
                sign: row.sign,
                status: String(row.status)
            }

            if (row.whitelist_ips) {
                this.form.whitelist_ips = row.whitelist_ips.replace( /["\[\]]/g, '' )
            }
            this.dia_status = 'edit'
            this.dia_title = '编辑'
            this.dia_show = true
        },
        switchStatus(row) {
            this.curr_row = row
            this.mod_status = 'switch'
            this.mod_title = '禁用'
            this.mod_cont = '是否确定禁用该游戏产商？'

            this.mod_show = true
        },
        del(row) {
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该游戏产商！'

            this.mod_show = true

        },
        checkForm() {
            if(this.form.name==='') return false
            if(this.form.sign==='') return false
            return true
        },
        diaCfm() {
            if(!this.checkForm()) return
            if (this.dia_status === 'add') {
                this.addCfm()
            }
            if (this.dia_status === 'edit') {
                this.editCfm()
            }
        },
        addCfm() {
            let data = {
                name: this.form.name,
                sign: this.form.sign,
                whitelist_ips: this.form.whitelist_ips,
                status: this.form.status
            }
            if (data.whitelist_ips) {
                let str = data.whitelist_ips.replace('，', ',')
                str = str.replace(/\s+/g, '')
                data.whitelist_ips = JSON.stringify(str.split(','))
            }
            data = window.all.tool.rmEmpty(data)
            let { url, method } = this.$api.dev_game_vendor_add
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                } else {
                    if (res && res.message !== '') {
                        this.$toast.error(res.message)
                    }
                }
            })
        },
        editCfm() {
            let data = JSON.parse(JSON.stringify(this.form))
            if (data.whitelist_ips) {
                let str = data.whitelist_ips.replace('，', ',')
                str = str.replace(/\s+/g, '')
                data.whitelist_ips = JSON.stringify(str.split(','))
            }

            let { url, method } = this.$api.dev_game_vendor_set
            this.$http({ method, url, data }).then(res => {

                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },
        modConf() {
            if (this.mod_status === 'switch') {
                this.switchCfm()
            }
            if (this.mod_status === 'del') {
                this.delCfm()
            }
        },
        // 改变状态
        switchCfm() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status === 1 ? 0 : 1
            }

            let { url, method } = this.$api.dev_game_vendor_status_set
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.mod_show = false
                    this.getList()
                }
            })
        },
        delCfm() {
            let data = {
                id: this.curr_row.id,
            }
            
            let { url, method } = this.$api.dev_game_vendor_del
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
            
                    this.$toast.success(res && res.message)
                    this.mod_show=false
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
            let { url, method } = this.$api.dev_game_vendor_list
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
</script> <style scoped>
.w100 {
    width: 100px;
}
.p10 {
    padding: 10px;
}
.mt20 {
    margin-top: 20px;
}
.w250 {
    width: 250px;
}

.dia-inner {
    display: flex;
    justify-content: center;
    width: 700px;
    height: 330px;
}

.form > li {
    display: flex;
    position: relative;
    margin-top: 20px;
}
.form > li > span:first-child {
    min-width: 4em;
    margin-right: 10px;
    text-align: right;
}
.err-tips {
    position: absolute;
    left: 7em;
    top: 32px;
    font-size: 12px;
    color: red;
}
.textarea {
    width: 250px;
    height: 100px;
}
.ml100 {
    margin-left: 100px;
}
.ml50 {
    margin-left: 50px;
}
.center-box {
    display: flex;
    justify-content: center;
}
</style>