<template>
    <div class="container">
        <!-- 短信配置 -->
        
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>更新人</span>
                    <Input class="w100" v-model="filter.acc" />
                </li>
                <li>
                    <span>更新日期</span>
                    <Date v-model="filter.dates[0]" />
                    <span style="margin:0 5px;">~</span>
                    <Date v-model="filter.dates[1]" />
                </li>
                <li>
                    <span>启用状态:</span>
                    <Select v-model="filter.status" :options="status_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue">查询</button>
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
        <Dialog :show.sync="dia_show" title="编辑">
            <div class="dia-inner">
                <ul class="form">
                    <li>
                        <span>商户名称</span>
                        <Input class="w250" v-model="form.name" />
                    </li>
                    <li>
                        <span>商户标识</span>
                        <Input class="w250" v-model="form.ident" />
                    </li>
                    <li>
                        <span>商户号</span>
                        <Input class="w250" v-model="form.number" />
                    </li>
                    <li>
                        <span>商户秘钥</span>
                        <Input class="w250" v-model="form.private" />
                    </li>
                    <li>
                        <span>商户公钥</span>
                        <Input class="w250" v-model="form.public" />
                    </li>
                    <li>
                        <span>短信数量</span>
                        <Input class="w250" limit="p-integer" v-model="form.sms_num" />
                    </li>
                    <li>
                        <span>授权码</span>
                        <Input class="w250" limit="p-integer" v-model="form.authority" />
                    </li>
                    <li>
                        <span>请求地址</span>
                        <Input class="w250" limit="p-integer" v-model="form.add" />
                    </li>
                </ul>
                <div class="form-btn">
                    <button class="btn-plain-large" @click="dia_show=false">取消</button>
                    <button class="btn-blue-large ml30">确认</button>
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
                acc: '',
                dates: [],
                status: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' }
            ],
            headers: [
                '编号',
                '商户号',
                '短信条数',
                '最后跟新人',
                '最后跟新时间',
                '启用状态',
                '添加时间',
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
            /* table 编辑dialog内容 */
            dia_show: false,
            form: {
                name: '',
                ident: '',
                number: '',
                private: '',
                public: '',
                sms_num: '',
                authority: '',
                add: ''
            },
            // mod 确认框
            mod_show: false,
            mod_title: '',
            mod_cont: '',
        }
    },
    methods: {
        edit(row) {
            this.dia_show = true;
        },
       
        modConf() {

        },
        forbidden(row) {
            this.mod_show = true
            this.mod_title = '禁用'
            this.mod_cont = '是否确定禁用该短信产商？'
        },
        del(row) {
            this.mod_show = true
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该短信产商？'
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
.form {
    /* border: 1px solid #000; */
    padding: 20px 190px;
}
.form > li {
    display: flex;
    margin-top: 20px;
}
.form > li > span:first-child {
    width: 4.4em;
    text-align: right;
    margin-right: 10px;
}
.w250 {
    width: 250px;
}
.form-btn {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
.ml30 {
    margin-left: 50px;
}
</style>