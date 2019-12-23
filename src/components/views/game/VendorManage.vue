<template>
    <div class="container">
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
                    <button class="btn-blue" @click="getList">查询</button>
                </li>
            </ul>
        </div>
        <div class="table">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row,idx}">
                    <!-- '编号', '游戏厂商', '厂商状态', '最后更新人','最后更新时间','操作' -->
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.name}}</td>
                    <td :class="[row.status===1?'green':'red']">{{status_txt[row.status]}}</td>
                    <td>{{row.last_editor && row.last_editor.name}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>
                        <span class="a" @click="opera(row)">{{row.status===1?'禁用':'启用'}}</span>
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
            title="厂商管理"
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
                vendor: '',
                status: ''
            },
            status_opt: [
                { label: '全部', value: '' },
                { label: '关闭', value: '0' },
                { label: '启用', value: '1' }
            ],
            status_txt: {
                '1': '开启',
                '0': '关闭'
            },

            total: 0,
            pageNo: 1,
            pageSize: 25,
            headers: [
                '编号',
                '游戏厂商',
                '厂商状态',
                '最后更新人',
                '最后更新时间',
                '操作'
            ],
            list: [],
            mod_show: false,
            mod_cont: '',
            // 当前需要更改的 row对象
            curr_row: {}
        }
    },
    methods: {
        opera(row) {
            this.curr_row = row
            this.mod_show = true
            if (row.a2 === '1') {
                this.mod_cont = '是否确定禁用该厂商!'
            } else {
                this.mod_cont = '是否确定启用该厂商!'
            }
        },
        // 去除为param空的 属性
        rmEmpty(obj) {
            let params = {}
            for (const key in obj) {
                if (Array.isArray(obj[key])) {
                    if (obj.length > 0) {
                        params[key] = obj[key]
                    }
                } else if (obj[key] !== '') {
                    params[key] = obj[key]
                }
            }
            return params
        },
        getList() {
            let self = this
            let par = {
                name: this.filter.vendor,
                status: this.filter.status,
                pageSize: this.pageSize,
                page: this.pageNo
            }

            let params = this.rmEmpty(par)
            // console.log('params: ', params)
            let { url, method } = this.$api.game_vendor_list
            this.$http({
                method: method,
                url: url,
                params: params
            })
                .then(res => {
                    // console.log('%cres: ', 'color:red;font-size:18px;', res)
                    if (res && res.code === '200') { self.total = res.data.total; self.list = res.data.data; } else { if (res && res.message !== '') { self.$toast.error(res.message); } }
                })
                .catch(err => {
                    // console.log('错误内容:', err)
                    // alert(err)
                })
        },
        modConf() {
            let id = this.curr_row.id
            let status = this.curr_row.status === 1 ? 0: this.curr_row.status === 0 ? 1:this.curr_row.status
            let params ={
                id:id,
                status:status
            }
            let { url, method } = this.$api.game_vendor_status_set
            this.$http({
                method: method,
                url: url,
                params:params
            }).then(res=>{
                if(res && res.code==='200'){
                    this.mod_show = false
                    this.$toast.success(res.message)
                    this.getList()
                }else{
                    this.$toast.error(res.message)
                }
            })
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
.table {
    margin-top: 20px;
}
</style>