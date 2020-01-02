<template>
    <div class="container">
        <!-- 金流银行卡配置 -->

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>银行名称</span>
                    <Input class="w100" v-model="filter.bank" />
                </li>
                <li>
                    <span>状态</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue">查询</button>
                    <button class="btn-blue" @click="add">添加银行</button>
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
                    <td :class="row.a7?'green':'red'">{{row.a7===1?'开启':row.a7===0?'关闭':'--'}}</td>
                    <td>
                        <span class="a" @click="edit(row)">编辑</span>
                        <span class="a" @click="operate(row)">{{row.a7===1?'禁用':row.a7===0?'启用':'--'}}</span>
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
                            <span>银行名称:</span>
                            <Input class="w250" v-model="form.name" />
                        </li>
                        <li>
                            <span>银行编码:</span>
                            <Input class="w250" v-model="form.name" />
                        </li>
                        <li>
                            <span>银行网址:</span>
                            <Input class="w250" v-model="form.name" />
                        </li>
                        <li v-if="isAdd">
                            <span>银行码:</span>
                            <Input class="w250" v-model="form.name" />
                        </li>
                        <li v-if="isAdd">
                            <span>状态选择:</span>
                            <Radio class="radio-left" label="开启" :value="form.status" val="on" v-model="form.status" />
                            <Radio class="radio-right ml50" label="关闭" :value="form.status" val="off" v-model="form.status" />
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
</template> <script>
export default {
    data() {
        return {
            filter: {
                bank: '',
                status: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' }
            ],
            headers: [
                '银行编码',
                '银行名称',
                '银行官网地址',
                '创建人',
                '创建时间',
                '最后更新人',
                '最后更新时间',
                '状态',
                '操作'
            ],
            list: [
                {
                    a1: 'GSYH',
                    a2: '工商银行',
                    a3: 'http//:www.icbc',
                    a4: '2019/11/15 12:52:30',
                    a5: 'admin',
                    a6: '2019/11/15 12:52:30',
                    a7: 1
                },
                {
                    a1: 'GSYH',
                    a2: '工商银行',
                    a3: 'http//:www.icbc',
                    a4: '2019/11/15 12:52:30',
                    a5: 'admin',
                    a6: '2019/11/15 12:52:30',
                    a7: 0
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            // dialog 添加 &编辑
            curr_row: {},
            dia_show: false,
            isAdd: false,
            form: {
                name: '',
                encode: '',
                url: '',
                code: '',
                status: '',
            },

            // 禁用|启用 删除 modal
            mod_show: true,
            mod_title: '',
            mod_cont: ''
        }
    },
    methods: {
        add() {
            this.dia_show = true
            this.isAdd = true
        },
        edit(row) {
            this.curr_row = row
            this.isAdd = false
            this.dia_show = true
        },
        operate(row) {
            // this.curr_row = row
            this.mod_title = row.a7===1 ? '禁用': '启用'
            this.mod_cont = row.a7===1 ? '是否确定启用该银行？': '是否确定禁用该银行？'
            this.mod_show = true
        },
        del(row) {
            // this.curr_row = row
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该银行？'
            this.mod_show = true
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
.w250 {
    width: 250px;
}
.form-btns {
    margin-top: 50px;
    text-align: center;
}
.ml50 {
    margin-left: 50px;
}
</style>