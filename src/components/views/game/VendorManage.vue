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
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <!-- '编号', '游戏厂商', '厂商状态', '最后更新人','最后更新时间','操作' -->
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.name}}</td>
                    <td :class="[row.status===1?'green':'red']">{{status_txt[row.status]}}</td>
                    <td>{{row.last_editor && row.last_editor.name}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>
                        <button class="btns-blue" @click="edit(row)">编辑??</button>
                        <button
                            :class="[row.status?'btns-red':'btns-green']"
                            @click="statusSwitch(row)"
                        >{{row.status===1?'禁用':'启用'}}</button>
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
                <div class="edit-form">
                    <ul class="form">
                        <li>
                            <span>游戏名称</span>
                            <Input class="w250" v-model="form.name" />
                            <span v-show="!form.name" class="err-tips">游戏名称不可为空!</span>
                        </li>
                        <li>
                            <span>商户秘钥:</span>
                            <Input class="w250" v-model="form.merchant_secret" />
                        </li>
                        <li>
                            <span>商户私钥:</span>
                            <Input class="w250" v-model="form.private_key" />
                        </li>
                        <li>
                            <span>商户公钥:</span>
                            <Input class="w250" v-model="form.public_key" />
                        </li>
                        <li>
                            <span>商户号:</span>
                            <Input class="w250" v-model="form.merchant_code" />
                        </li>
                        <li>
                            <span>APPID:</span>
                            <Input class="w250" v-model="form.app_id" />
                        </li>
                        <li>
                            <span>授权码:</span>
                            <Input class="w250" v-model="form.authorization_code" />
                        </li>
                    </ul>
                    <div class="form-btns">
                        <button class="btn-plain-large" @click="dia_show=''">取消</button>
                        <button class="btn-blue-large ml50" @click="editConf">确定</button>
                    </div>
                </div>
                <!-- <div v-if="dia_show==='detail'" class="dia-detail">
                    <GameManageDetail :id="curr_row.id" />
                </div>-->
            </div>
        </Dialog>
        <Modal
            :show.sync="mod_show"
            title="厂商管理"
            :content="mod_cont"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filter: {
                vendor: '',
                status: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '关闭', value: '0' },
                { label: '启用', value: '1' }
            ],
            status_txt: {
                '1': '开启',
                '0': '关闭'
            },

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
            dia_show: '',
            dia_title: '',
            form: {
                name: '',
                merchant_secret: '',
                private_key: '',
                public_key: '',
                merchant_code: '',
                app_id: '',
                authorization_code: ''
            },
            mod_show: false,
            mod_cont: '',
            // 当前需要更改的 row对象
            curr_row: {}
        }
    },
    methods: {
        statusSwitch(row) {
            this.curr_row = row
            this.mod_show = true
            if (row.status === 1) {
                this.mod_cont = '是否确定禁用该厂商!'
            } else {
                this.mod_cont = '是否确定启用该厂商!'
            }
        },
        // 去除为param空的 属性
        rmEmpty(obj) {
            let params = {}
            for (const key in obj) {
                if (Array.isArray(obj[key])) {
                    if (obj.length > 0) {
                        params[key] = obj[key]
                    }
                } else if (obj[key] !== '') {
                    params[key] = obj[key]
                }
            }
            return params
        },
        getList() {
            let self = this
            let par = {
                name: this.filter.vendor,
                status: this.filter.status,
                pageSize: this.pageSize,
                page: this.pageNo
            }

            let params = this.rmEmpty(par)
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
                } else {
                    if (res && res.message !== '') {
                        self.$toast.error(res.message)
                    }
                }
            })
        },
        edit(row) {
            this.form = {
                id: row.id,
                name: row.name,
                merchant_secret: row.merchant_secret,
                private_key: row.private_key,
                public_key: row.public_key,
                merchant_code: row.merchant_code,
                app_id: row.app_id,
                authorization_code: row.authorization_code
            }
            this.curr_row = row
            this.dia_show = 'edit'
            this.dia_title = '编辑'
        },
        modConf() {
            let id = this.curr_row.id
            let status = this.curr_row.status === 1 ? 0 : 1
                   
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
                    this.getList()
                } else {
                    this.$toast.error(res.message)
                }
            })
        },
        checkForm() {
            if (this.form.name === '') {
                return false
            }
            return true
        },
        editConf() {
            if (!this.checkForm()) return
            let data = window.all.tool.rmEmpty(this.form)
            let { url, method } = this.$api.game_set
            this.$http({ url, method, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.getList()
                    this.dia_show = ''
                } else {
                    if (res && res.message) {
                        this.$toast.error(res.message)
                    } else {
                        this.$toast.error('更新失败')
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
    }
}
</script> <style scoped>
/* .table {
    margin-top: 20px;
} */
.edit-form {
    position: relative;
    width: 700px;
    height: 400px;
}
.form {
    width: 350px;
    margin: 0 auto;
}
.form > li {
    display: flex;
    position: relative;
    align-items: baseline;
}
.form > li > span:first-child {
    min-width: 4.1em;
    margin-right: 10px;
    margin-top: 20px;
    text-align: right;
}
.err-tips {
    position: absolute;
    bottom: -15px;
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
</style>