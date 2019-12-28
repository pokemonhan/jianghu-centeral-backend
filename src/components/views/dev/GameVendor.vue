<template>
    <div class="container">
        <!-- 游戏厂商配置 -->

        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>游戏厂商</span>
                    <Input class="w100" v-model="filter.vendor" />
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
                    <td>{{row.a1}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td>
                        <span class="a" @click="edit(row)">编辑</span>
                        <span class="a" @click="forbidden(row)">禁用</span>
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
                        </li>
                        <li>
                            <span>厂商标识:</span>
                            <Input class="w250" v-model="form.sign" />
                        </li>
                        <li>
                            <span>白名单:</span>
                            <textarea class="textarea" v-model="form.white_list"></textarea>
                        </li>
                        <li>
                            <span>是否显示:</span>
                            <Radio
                                class="radio-left"
                                label="是"
                                :value="form.show"
                                val="on"
                                v-model="form.show"
                            />
                            <Radio
                                class="radio-right ml100"
                                label="否"
                                :value="form.show"
                                val="off"
                                v-once
                                v-model="form.show"
                            />
                        </li>
                        <li class="center-box">
                            <button class="btn-plain-large" @click="dia_show=false">取消</button>
                            <button class="btn-blue-large ml50">确认</button>
                            
                        </li>
                    </ul>
                </div>
            </div>
        </Dialog>
        <Modal
            :show="mod_show"
            :title="mod_title"
            :content="mod_cont"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>
    </div>
</template> <script>
export default {
    data() {
        return {
            filter: {
                vendor: ''
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
            dia_title: '',
            form: {
                name: '',
                sign: '',
                white_list: '',
                status: ''
            },

            // mod
            mod_show: false,
            mod_title: '',
            mod_cont: ''
        }
    },
    methods: {
        getList() {},
        add() {
            this.dia_show = true
            this.dia_title = '添加'
        },
        edit(row) {
            this.curr_row = row
            this.dia_show = true
            this.dia_title = '编辑'
        },
        forbidden(row) {
            this.mod_show = true
            this.mod_title = '禁用'
            this.mod_cont = '是否确定禁用该游戏产商？'
        },
        del(row) {
            this.mod_show = true
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该游戏产商！'
        },
        modConf() {

        },
        updateNo(val) {},
        updateSize(val) {}
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
    margin-top: 20px;
}
.form > li > span:first-child {
    min-width: 4em;
    margin-right: 10px;
    text-align: right;
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