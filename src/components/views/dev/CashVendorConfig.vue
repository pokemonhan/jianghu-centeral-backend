<template>
    <div class="container">
        金流厂商配置
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>厂商名称</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <span>厂商状态</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue">查询</button>
                    <button class="btn-blue" @click="add">添加厂商</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.a1}}</td>
                    <td :class="row.a2===1?'green':'red'">{{row.a2}}</td>
                    <td>{{row.a3}}</td>
                    <td>{{row.a4}}</td>
                    <td>{{row.a5}}</td>
                    <td>{{row.a6}}</td>
                    <td>{{row.a7}}</td>
                    <td>
                        <span class="a" @click="edit(row)">编辑</span>
                        <span class="a" @click="operate(row)">禁用</span>
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
                            <span>厂商名称</span>
                            <Input class="w250" v-model="form.name" />
                        </li>
                        <li>
                            <span>厂商标识</span>
                            <Input class="w250" v-model="form.sign" />
                        </li>
                        <li>
                            <span>白名单</span>
                            <textarea class="textarea" ></textarea>
                        </li>
                        <li v-if="dia_status_show">
                            <span> 状态选择 </span>
                            <Radio class="radio-left" label="启用" :value="form.status" val="on" v-model="form.status" />
                            <Radio class="radio-right ml50" label="禁用" :value="form.status" val="off" v-model="form.status" />
                        </li>
                        <li class="center-box">
                            <button class="btn-plain-large" @click="dia_show=false">取消</button>
                            <button class="btn-blue-large ml50">确定</button>
                        </li>
                    </ul>
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
                name: '',
                status: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' }
            ],
            headers: ['编号','厂商名称','厂商标识','添加人','添加时间','最后更新人','最后跟新时间','状态','操作'],
            list: [
                {
                    a1: '热门棋牌',
                    a2: '1',
                    a3: '1',
                    a4: '李白',
                    a5: '2019-02-02 21:30',
                    a6: '周树人',
                    a7: '2019-02-02 21:30',
                },
                {
                    a1: '刺激棋牌',
                    a2: '0',
                    a3: '2',
                    a4: 'admin',
                    a5: '2019-02-02 21:30',
                    a6: '送到附近的',
                    a7: '2019-02-02 21:30'
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            // dialog 添加 编辑对话框
            curr_row: {},
            dia_show: false,
            dia_title: '',
            dia_status_show: true,
            form: {
                name: '',
                sign: '',
                status: '',
            },

            // mod 禁用删除框
            mod_show: false,
            mod_title: '',
            mod_cont: '',
        }
    },
    methods: {
        add() {
            this.dia_show = true
            this.dia_title = '添加厂商'
            this.dia_status_show = true
        },
        edit(row) {
            this.dia_show = true
            this.dia_title = '编辑'
            this.curr_row = row
            this.dia_status_show = false

        },
        operate(row) {
            this.mod_show = true
            this.mod_title = row.status===1?'禁用' :'启用'
            this.mod_cont = `是否确定${this.mod_title}该支付产商？`
        },
        del(row) {
            this.mod_show = true
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该支付产商？'
        },
        modConf() {

        },
        updateNo(val) {},
        updateSize(val) {}
    },
    mounted() {}
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
.dia-inner {
    display: flex;
    justify-content: center;
    min-width: 600px;
    padding-bottom: 20px;
}
.form > li {
    display: flex;
    align-items: baseline;
    margin-top: 20px;
}
.form >li >span:first-child {
    width: 5em;
}
.w250 {
    width: 250px;
}
.ml50 {
    margin-left: 50px;
}
/* .textarea 有全局样式 */
.textarea {
    width: 250px;
    height: 100px;
}
.form .center-box {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}
</style>