<template>
    <div class="container">
        <!-- 游戏管理配置 -->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>游戏名称</span>
                    <Select v-model="filter.name" :options="name_opt"></Select>
                </li>
                <li>
                    <span>游戏厂商</span>
                    <Select v-model="filter.name" :options="name_opt"></Select>
                </li>
                <li>
                    <span>游戏分类</span>
                    <Select v-model="filter.name" :options="name_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue">查询</button>
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
                    <td>{{row.a3}}</td>
                    <td>{{row.a4}}</td>
                    <td>{{row.a5}}</td>
                    <td>{{row.a6}}</td>
                    <td>{{row.a7}}</td>
                    <td>{{row.a8}}</td>
                    <td>{{row.a9}}</td>
                    <td>{{row.a10}}</td>
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
                    <div class="dia-detail">
                        <!-- form 左侧 -->
                        <ul class="form">
                            <li>
                                <span>厂商选择:</span>
                                <Select style="width:250px;" v-model="form.sort" :options="sort_opt"></Select>
                            </li>
                            <li>
                                <span>游戏分类:</span>
                                <Select style="width:250px;" v-model="form.sort" :options="sort_opt"></Select>
                            </li>
                            <li>
                                <span>商户秘钥:</span>
                                <Input class="w250" v-model="form.secret_key" />
                            </li>
                            <li>
                                <span>商户号:</span>
                                <Input class="w250" v-model="form.number" />
                            </li>
                            <li>
                                <span>授权码:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>

                            <li>
                                <span>进入游戏测试地址:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>额度测试地址:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>

                            <li>
                                <span>检查余额测试地址:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>活动订单测试地址:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>活动注单测试地址:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li v-if="dia_status_show">
                                <span>状态选择</span>
                                <Radio
                                    class="radio-left"
                                    label="启用"
                                    :value="form.status"
                                    val="on"
                                    v-model="form.status"
                                />
                                <Radio
                                    class="radio-right ml50"
                                    label="禁用"
                                    :value="form.status"
                                    val="off"
                                    v-model="form.status"
                                />
                            </li>
                        </ul>
                        <!-- form 右侧 -->
                        <ul class="form ml20">
                            <li>
                                <span>游戏标识:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>游戏名称:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>商户公钥:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>APPID:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>进入游戏地址:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>额度地址:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>检查余额地址:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>检查订单地址:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>检查注单地址:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                            <li>
                                <span>请求模式:</span>
                                <Input class="w250" v-model="form.author" />
                            </li>
                        </ul>
                    </div>
                    <div class="center-box">
                        <button class="btn-plain-large" @click="dia_show=false">取消</button>
                        <button class="btn-blue-large ml50">确定</button>
                    </div>
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
    data() {
        return {
            filter: {
                name: ''
            },
            name_opt: [{ label: '测试账号', value: 0 }],
            headers: [
                '编号',
                '游戏厂商',
                '游戏名称',
                '游戏分类',
                '游戏标识',
                'APPID',
                '游戏状态',
                '添加人',
                '添加时间',
                '最后跟新人',
                '最后跟新时间',
                '操作'
            ],
            list: [
                {
                    a1: '开元棋牌',
                    a2: '抢庄牛牛',
                    a3: '热门棋牌',
                    a4: 'ADB',
                    a5: '1',
                    a6: '1',
                    a7: 'admin',
                    a8: '2019-02-02 21:30',
                    a9: 'admin',
                    a10: '2019-02-02 21:30'
                },
                {
                    a1: '开元棋牌',
                    a2: '抢庄牛牛',
                    a3: '热门棋牌',
                    a4: 'ADB',
                    a5: '1',
                    a6: '0',
                    a7: 'admin',
                    a8: '2019-02-02 21:30',
                    a9: 'admin',
                    a10: '2019-02-02 21:30'
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            // dialog 添加 编辑对话框
            curr_row: {},
            dia_show: false,
            dia_title: '',
            dia_status_show: false,
            form: {
                name: '',
                sort: '',
                secret_key: '',
                number: '',
                author: ''
            },
            sort_opt: [{ label: '全部', value: '' }],

            // mod 禁用删除框
            mod_show: false,
            mod_title: '',
            mod_cont: ''
        }
    },
    methods: {
        add() {
            this.dia_show = true
            this.dia_status_show = true
        },
        edit(row) {
            this.dia_show = true
            this.curr_row = row
            this.dia_status_show = false
        },
        operate(row) {
            this.mod_show = true
            this.mod_title = row.status === 1 ? '禁用' : '启用'
            this.mod_cont = `是否确定${this.mod_title}该游戏名称？`
        },
        del(row) {
            this.mod_show = true
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该游戏名称？'
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
.dia-detail {
    display: flex;
}

.form > li {
    display: flex;
    align-items: center;
    margin-top: 20px;
}
.form > li > span:first-child {
    width: 9em;
}
.w250 {
    width: 250px;
}
.ml50 {
    margin-left: 50px;
}
.ml20 {
    margin-left: 20px;
}
.center-box {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}
</style>