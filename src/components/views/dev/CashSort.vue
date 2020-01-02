<template>
    <div class="container">
        分类管理
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>分类名称</span>
                    <Input class="w100" v-model="filter.acc" />
                </li>
                <li>
                    <span>分类状态</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue">查询</button>
                    <button class="btn-blue" @click="add">添加分类</button>
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
        <Dialog :show.sync="dia_show" title="标题标题">
            <div class="dia-inner">
                <div>
                    <ul class="form">
                        <li>
                            <span>分类名称:</span>
                            <Input class="w250" v-model="form.name" />
                        </li>
                        <li>
                            <span>分类标识:</span>
                            <Input class="w250" v-model="form.sign" />
                        </li>
                        <li>
                            <span>金流方向:</span>
                            <Radio class="radio-left" label="入款" :value="form.cash" val="in" v-model="form.cash" />
                            <Radio class="radio-right ml40" label="出款" :value="form.cash" val="out" v-model="form.cash" />
                        </li>
                        <li>
                            <span>是否上线:</span>
                            <Radio class="radio-left" label="线上" :value="form.isOnLine" val="online" v-model="form.isOnLine" />
                            <Radio class="radio-right ml40" label="线下" :value="form.isOnLine" val="offline" v-model="form.isOnLine" />
                        </li>
                        <li v-if="status_show">
                            <span>选择状态:</span>
                            <Radio class="radio-left" label="启用" :value="form.status" val="online" v-model="form.status" />
                            <Radio class="radio-right ml40" label="禁用" :value="form.status" val="offline" v-model="form.status" />
                        </li>
                    </ul>
                    <div class="center-box mt50">
                        <button class="btn-plain-large" @click="dia_show=false">取消</button>
                        <button class="btn-blue-large ml40">确认</button>
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
                acc: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '启用', value: '1' },
                { label: '关闭', value: '0' }
            ],
            headers: ['编号','分类名称','分类标识','添加人','添加时间','最后更新人','最后跟新时间','状态','操作'],
            list: [
                {
                    a1: '64646466',
                    a2: 'sdfsdfdsf',
                    a3: '充支好礼',
                    a4: '1',
                    a5: '2019-02-02 21:30',
                    a6: '2019-02-02 21:30',
                    a7: '2019-02-02 21:30',
                    a8: '2019-02-02 21:30',
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

            // 添加-编辑 dialog
            curr_row: {},
            dia_show: false,
            dia_title: '',
            form: {
                name: '',
                sign: '',
                cash: '',
                isOnLine: '',
                status: '',
            },
            status_show: false,

            // 确认
            mod_show: true,
            mod_title:'',
            mod_cont: ''
        }
    },
    methods: {
        add() {
            this.dia_show = true
            this.dia_title = '添加'
            this.status_show = true
        },
        edit(row) {
            this.curr_row = row
            this.dia_show = true
            this.dia_title = '编辑'
            this.status_show = false
        },
        forbidden(row) {
            this.curr_row = row
            this.mod_show = true
            this.mod_title = '禁用'
            this.mod_cont = '是否禁用该分类'

        },
        del(row) {
            this.curr_row = row
            this.mod_show = true
            this.mod_title = '删除'
            this.mod_cont = '是否删除该分类'
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

/* dialog */
.dia-inner {
    padding: 0 200px;
}
.form > li {
    display: flex;
    align-items: center;
    margin-top: 20px;
}
.form >li >span:first-child {
    margin-right: 10px;
}
.w250 {
    width: 250px;
}
.ml40 {
    margin-left: 40px;
}
.mt50 {
    margin-top: 50px;
}
.center-box {
    display: flex;
    justify-content: center;
}

</style>