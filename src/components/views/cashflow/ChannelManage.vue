<template>
    <div class="container">
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>通道名称</span>
                    <Select style="width:200px;" v-model="filter.channel_id" :options="channel_opt"></Select>
                </li>
                <li>
                    <span>厂商名称</span>
                    <Select v-model="filter.vendor_id" :options="vendor_opt"></Select>
                </li>
                <li>
                    <span>分类名称</span>
                    <Select v-model="filter.type_id" :options="sort_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                </li>
            </ul>
        </div>
        <div class="table">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.vendor?row.vendor.name:''}}</td>
                    <td>{{row.type?row.type.name:''}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>{{row.last_editor?row.last_editor.name:'--'}}</td>
                    <td :class="[row.status===1?'green':'red']">{{row.status===1?'开启':row.status===0?'关闭':'---?'}}</td>
                    <td>
                        <span class="a" @click="opera(row)">{{opera_obj[row.status]}}</span>
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
        <Modal
            :show.sync="mod_show"
            :title="mod_title"
            :content="mod_cont"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>

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
            select:{},
            filter: {
                channel_id: '',
                vendor_id: '',
                type_id: ''
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
            // /* table 内容 */
            // status_obj: {
            //     '1': '开启', // 开启状态禁用
            //     '0': '关闭'
            // },
            opera_obj: {
                '1': '禁用', // 开启状态禁用
                '0': '启用'
            },
            headers: [
                '编号',
                '厂商名称',
                '所属分类',
                '通道名称',
                '最后更新人',
                '最后跟新时间',
                '状态',
                '操作'
            ],
            list: [
                {
                    a1: '64646466',
                    a2: 'sdfsdfdsf',
                    a3: '充支好礼',
                    a4: '1',
                    a5: '2019-02-02 21:30',
                    a6: '1'
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

            // 现在操作的row
            curr_row: {},
            // mod 确认模态框
            mod_show: false,
            mod_title: '',
            mod_cont: '',
            // 详情
            dia_show: false
        }
    },
    methods: {
        getSelect() {
            let { url, method } = this.$api.dev_finance_channel_search_condition
            this.$http({
                method: method,
                url: url
            }).then(res => {
                console.log('res😍: ', res);
                if (res && res.code === '200') {
                    this.select = res.data
                    this.channel_opt = this.backToSelOpt(res.data.channels)
                    this.vendor_opt = this.backToSelOpt(res.data.vendors)
                    this.sort_opt = this.backToSelOpt(res.data.types)
                }
            })
        },
        // 后台数组转为 select_opt 数组
        backToSelOpt(list) {
            let arr = [
                {
                    label: '全部',
                    value: ''
                }
            ]
            list.forEach(item => {
                let opt = {
                    label: item.name,
                    value: item.id
                }
                arr.push(opt)
            })
            return arr
        },
        opera(row) {
            this.mod_show = true
            this.curr_row = row
            if (row.a6 === '1') {
                this.mod_title = '禁用'
                this.mod_cont = '是否确定禁用该通道名称'
            } else {
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
            let params = {}
            params.status = this.curr_row.status === 1 ? 0 : 1
            params.id = this.curr_row.id
            let { url, method } = this.$api.finance_channel_status_set
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.mod_show = false
                    this.getList()
                } else {
                    res && this.$toast(res.message)
                }
            })
        },
        getList() {
            let self = this
            let para = {
                channel_id: this.filter.channel_id,
                vendor_id: this.filter.vendor_id,
                type_id: this.filter.type_id,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.finance_channel_list
            this.$http({
                method: method,
                url: url,
                params: params
            }).then(res => {
                if (res && res.code === '200') {
                    self.total = res.data.total
                    self.list = res.data.data
                } else {
                    if (res && res.message !== '') {
                        self.toast.error(res.message)
                    }
                }
            })
        }
    },
    mounted() {
        this.getList()
        this.getSelect()
    }
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