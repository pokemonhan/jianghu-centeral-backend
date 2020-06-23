<template>
    <div class="container">
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>账号:</span>
                    <Input class="w100" v-model="filter.email" />
                </li>
                <li>
                    <span>登录日期</span>

                    <Date type="daterange" :disabledDate="['no_after_tomorrow']" v-model="filter.createAt" />
                </li>
                <li>
                    <span>登录ip</span>
                    <Input class="w100" v-model="filter.loginIp" />
                </li>
            </ul>
            <div>
                <button class="btn-blue" @click="getList">查询</button>
                <button class="btn-blue" @click="exportExcel">导出Excel</button>
            </div>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <td>{{row.email}}</td>
                    <td>{{row.ip}}</td>
                    <td>{{row.created_at}}</td>
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
    </div>
</template>


<script>
export default {
    name: 'LoginRecord',
    data() {
        return {
            filter: {
                email: '',
                createAt: ['', ''],
                loginIp: ''
            },
            total: 0,
            pageNo: 1,
            pageSize: 25,
            headers: ['账号', '登录IP', '登录日期'],
            list: []
        }
    },
    methods: {
        exportExcel() {
            // console.log('触发')
            import('../../../js/config/Export2Excel').then(excel => {
                // console.log('触发2')
                const tHeader = this.headers
                const data = this.list.map(item => {
                    return [item.email, item.ip, item.created_at]
                })

                // let chainName = this.getChainName(this.$route.path)
                let chainName = window.all.tool.getChainName(this.$route.path)
                excel.export_json_to_excel({
                    header: tHeader, //表头 必填
                    data, //具体数据 必填
                    filename: `${chainName} ${this.pageNo}`, //非必填
                    autoWidth: true, //非必填
                    bookType: 'xlsx' //非必填
                })
            })
        },
        /** 链级 名称，如: 厅主管理-登录记录 */
        getChainName(path) {
            if (!path) {
                console.log('no path')
                return ''
            }
            let menuList = window.all.tool.getLocal('menu')
            let chain_name = ''
            if (menuList) {
                menuList.forEach(father => {
                    if (father.children) {
                        father.children.forEach(child => {
                            if (path === child.path) {
                                chain_name = father.label + '-' + child.label
                            }
                        })
                    }
                })
            }
            return chain_name
        },
        updateNo() {
            this.getList()
            setTimeout(()=>{
                this.$toast('222')
            })
        },
        updateSize() {
            this.pageNo = 1
            this.getList()
        },
        getList() {
            let createAt = ''
            if (this.filter.createAt[0] && this.filter.createAt[1]) {
                let start = this.filter.createAt[0] + ' 00:00:00'
                let end = this.filter.createAt[1] + ' 00:00:00'
                createAt = JSON.stringify([start, end])
            }
            let para = {
                email: this.filter.email,
                createAt: createAt,
                loginIp: this.filter.loginIp,
                pageSize: this.pageSize,
                page: this.pageNo
            }

            let params = window.all.tool.rmEmpty(para)

            let { url, method } = this.$api.login_record_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
                }
            })
        }
    },
    mounted() {
        this.getList()
    }
}
</script>

<style scoped>
</style>
