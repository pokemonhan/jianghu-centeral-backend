<template>
    <div class="container">
        厅主列表
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
                    <Select v-model="filter.sort" :options="sort_opt"></Select>
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
                    <td>{{row.a3}}</td>
                    <td>{{row.a4}}</td>
                    <td>{{row.a5}}</td>
                    <td :class="[row.a6==='1'?'green':'red']">{{status_obj[row.a6]}}</td>
                    <td>
                        <span class="a" @click="opera(row)">{{opera_obj[row.a6]}}</span>
                        <span class="a" @click="detail(row)">操作详情</span>
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

        <!------------ 操作详情 ----------------->
        <Dialog :show.sync="dia_show" title="详情">
            <div class="dia-inner">
                <ChannelManageDetail />
            </div>
        </Dialog>
    </div>
</template>

<script>
import ChannelManageDetail from './ChannelManageDetail'
export default {
    components: {
        ChannelManageDetail: ChannelManageDetail
    },
    data() {
        return {
            filter: {
                channel: '',
                vendor: '',
                sort: ''
            },
            channel_opt: [
                { label: '全部', value: '' },
                { label: '红牛', value: '1' },
                { label: '东鹏', value: '2' }
            ],
            vendor_opt: [
                { label: '全部', value: '' },
                { label: '红牛', value: '1' },
                { label: '东鹏', value: '2' }
            ],
            sort_opt: [
                { label: '全部', value: '' },
                { label: '支付宝', value: '1' },
                { label: '微信', value: '2' },
                { label: '扫码支付', value: '3' }
            ],
            /* table 内容 */
            status_obj: {
                '1': '开启', // 开启状态禁用
                '0': '关闭',
            },
            opera_obj: {
                '1': '禁用', // 开启状态禁用
                '0': '启用',
            },
            headers: ['编号','厂商名称','所属分类','通道名称','最后更新人','最后跟新时间','状态','操作'],
            list: [
                {
                    a1: '64646466',
                    a2: 'sdfsdfdsf',
                    a3: '充支好礼',
                    a4: '1',
                    a5: '2019-02-02 21:30',
                    a6: '1',
                },
                {
                    a1: '64646466',
                    a2: 'sdfsdfdsf',
                    a3: '充支好礼',
                    a4: '1',
                    a6: '0'
                }
            ],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            // mod 确认模态框
            mod_show: false,
            mod_title: '',
            mod_cont: '',
            // 详情
            dia_show: true

        }
    },
    methods: {
        opera(row) {
            this.mod_show = true
            if(row.a6==='1'){
                this.mod_title = '禁用'
                this.mod_cont = '是否确定禁用该通道名称'
            }else {
                this.mod_title = '启用'
                this.mod_cont = '是否确定启用该通道名称'
            }
        },
        detail() {
            this.dia_show = true
        },
        updateNo(val) {},
        updateSize(val) {},
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