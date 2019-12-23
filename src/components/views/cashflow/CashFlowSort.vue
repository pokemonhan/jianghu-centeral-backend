<template>
    <div class="container">
        <!-------------------- 分类管理 ------------------------->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>分类管理</span>
                    <Input class="w100" v-model="filter.name" />
                </li>
                <li>
                    <span>厂商状态</span>
                    <Select v-model="filter.status" :options="status_opt" ></Select>
                </li>
                <li>
                    <button class="btn-blue">查询</button>
                </li>
            </ul>
        </div>
        <div class="table">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.a1}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a2}}</td>
                    <td>
                        <span class="a" @click="opera(row)">{{row.a2==='1'?'禁用':'启用'}}</span>
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
                {label:'全部',value: ''},
                {label:'开启',value: '1'},
                {label:'关闭',value: '0'},
            ],
            headers: ['编号','分类名称','最后更新人','最后跟新时间','状态','操作'],
            list: [
                {
                    a1: '64646466',
                    a2: '1',
                    a3: '充支好礼',
                    a4: '1',
                    a5: '2019-02-02 21:30'
                },
                {
                    a1: '64646466',
                    a2: '0',
                    a3: '充支好礼',
                    a4: '1',
                    a5: '2019-02-02 21:30'
                }
            ],
            status_obj:{
                '1': '禁用',
                '0': '启用',
            },
            total: 0,
            pageNo: 1,
            pageSize: 25,

            mod_show: false,
            mod_title: '',      
            mod_cont: '',
            
        }
    },
    methods: {
        updateNo(val) {},
        updateSize(val) {},
        opera(row) {
            this.mod_show = true
            if(row.a2==='1'){
                this.mod_title = '禁用'
                this.mod_cont = '是否确认禁用该支付厂商!'
            }else {
                this.mod_title = '启用'
                this.mod_cont = '是否确认启用该支付厂商!'
            }
        },
        modConf() {

        }
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
.table {
    margin-top: 10px;
}
</style>