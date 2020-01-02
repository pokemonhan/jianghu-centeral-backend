<template>
    <div class="container">
        金流通道配置
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>通道名称</span>
                    <Select v-model="filter.channel" :options="channel_opt"></Select>
                </li>
                <li>
                    <span>厂商名称</span>
                    <Select v-model="filter.vendor" :options="vendor_opt"></Select>
                </li>
                <li>
                    <span>分类名称</span>
                    <Select v-model="filter.type" :options="type_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue">查询</button>
                    <button class="btn-blue" @click="add">添加通道</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.a1}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a3}}</td>
                    <td>{{row.a4}}</td>
                    <td>{{row.a5}}</td>
                    <td>{{row.a6}}</td>
                    <td>{{row.a7}}</td>
                    <td>{{row.a8}}</td>
                    <td :class="[row.a9?'green':'red']">{{row.a9===1?'开启':row.a9===0?'关闭':'--'}}</td>
                    <td>
                        <span class="a" @click="edit(row)">编辑</span>
                        <span class="a" @click="operate(row)">{{row.a9===1?'禁用':row.a9===0?'启用':'--'}}</span>
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
        <Dialog :show.sync="dia_show" :title="isAdd?'添加':'编辑'">
            <div class="dia-inner">
                <div class="dia-maintain">
                    <ul class="form">
                        <li>
                            <span>选择厂商:</span>
                            <Select class="w250" v-model="form.vendor" :options="vendor_opt" ></Select>
                        </li>
                        <li>
                            <span>选择分类:</span>
                            <Select class="w250" v-model="form.type" :options="type_opt" ></Select>
                        </li>
                        <li>
                            <span>通道名称:</span>
                            <Input class="w250" v-model="form.channel" />
                        </li>
                        <li>
                            <span>通道标记:</span>
                            <Input class="w250" v-model="form.sign" />
                        </li>
                        <li>
                            <span>请求模式:</span>
                            <Radio class="radio-left" label="直接跳转" :value="form.mode" val="on" v-model="form.mode" />
                            <Radio class="radio-right ml50" label="获取数据模式" :value="form.mode" val="off" v-model="form.mode" />
                        </li>
                        <li>
                            <span>请求地址:</span>
                            <Input class="w250" v-model="form.model" />
                        </li>
                        <li>
                            <span>银行码:</span>
                            <Input class="w250" v-model="form.code" />
                        </li>
                        <li>
                            <span>描述:</span>
                            <textarea class="textarea"></textarea>
                        </li>
                        <li v-if="isAdd">
                            <span>状态选择:</span>
                            <Radio class="radio-left" label="启用" :value="form.status" val="on" v-model="form.status" />
                            <Radio class="radio-right ml50" label="禁用" :value="form.status" val="off" v-model="form.status" />
                        </li>
                    </ul>
                    <div class="form-btns">
                        <button class="btn-plain-large" @click="dia_show=false">取消</button>
                        <button class="btn-blue-large ml50">确定</button>
                    </div>
                </div>
            </div>
        </Dialog>

        <Modal :show.sync="mod_show" :title="mod_title" :content="mod_cont" @cancel="mod_show=false" @confirm="modConf"></Modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filter: {
                acc: ''
            },
            channel_opt: [
                { label: '全部', value: '' },
                { label: '测试账号', value: 1 },
            ],
            vendor_opt: [
                { label: '全部', value: '' },
                { label: '测试账号', value: 1 },
            ],
            type_opt: [
                { label: '全部', value: '' },
                { label: '测试账号', value: 1 },
            ],
            headers: [ '编号', '厂商名称', '分类名称', '通道名称', '通道标识', '添加人', '添加时间', '最后更新人', '最后跟新时间', '状态', '操作' ],
            list: [
                {
                    a1: '红牛',
                    a2: '支付宝',
                    a3: '通道一',
                    a4: 'hjk',
                    a5: 'adminn',
                    a6: '2019-02-02 21:30',
                    a7: 'admin',
                    a8: '2019-02-02 12:30:30',
                    a9: 1
                },
                {
                    a1: '红牛',
                    a2: '支付宝',
                    a3: '通道一',
                    a4: 'hjk',
                    a5: 'adminn',
                    a6: '2019-02-02 21:30',
                    a7: 'admin',
                    a8: '2019-02-02 12:30:30',
                    a9: 0
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            // 添加， 编辑dialog
            dia_show: false,
            isAdd: false, // 是否是编辑（true: 添加窗口，false: 编辑）
            curr_row: {},
            form: {
                vendor: '',
                type: '',
                channel: '',
                sign: '',
                model: '',

            },

            // modal 确认modal
            mod_show: false,
            mod_status: '',
            mod_title: '',
            mod_cont: '',
        }
    },
    methods: {
        add() {
            this.dia_show = true
            this.isAdd = true
        },
        edit(row) {
            this.curr_row = row
            this.dia_show = true
            this.isAdd = false
        },
        operate(row) {
            this.curr_row = row
            this.mod_show = true
            this.mod_status = 'operate'
            this.mod_cont = row.a9===1? '是否确定禁用该通道名称？': '是否确定启用该通道名称？'
        },
        del(row) {
            this.curr_row = row
            this.mod_show = true
            this.mod_status = 'del'
            this.mod_cont = '是否确定删除该通道名称？'
        },
        modConf() {

        },
        updateNo() {
            // this.getList()
        },
        updateSize() {
            this.pageNo = 1
            // this.getList()
        },
    },
    mounted() {}
}
</script>
<style scoped>
.w100 {
    width: 100px;
}
.p10 {
    padding: 10px;
}
.mt20 {
    margin-top: 20px;
}
.dia-maintain {
    padding: 0 150px;
}
.form > li {
    display: flex;
    align-items: baseline;
    margin-top: 20px;
}
.form > li > span:first-child {
    min-width: 4.1em;
    margin-right: 10px;
    text-align: right;
}
.form .w250 {
    width: 250px;
}
.form-btns {
    margin-top: 50px;
    text-align: center;
}
.ml50 {
    margin-left: 50px;
}
/* table-page .textarea 部分样式为全局样式 */
.textarea {
    width: 250px;
    height: 80px;
}
</style>