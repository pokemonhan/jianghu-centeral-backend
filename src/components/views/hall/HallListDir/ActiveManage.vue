<template>
    <div class="cont">
        <div class="filter p10">
            <ul class="left">
                <!-- 左侧的 -->
              
                <li>
                    <span>活动名称</span>
                    <Select v-model="filterLeft.name" :options="active_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue">查找</button>
                    <button class="btn-blue">全部添加</button>
                </li>
                <li style="margin-left:240px;">
                    <span>活动名称</span>
                    <Select v-model="filterRight.name" :options="active_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue">查找</button>
                </li>
            </ul>
        </div>
        <div class="table">
            <Table class="tab-left" :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <td>{{row.a1}}</td>
                    <td>{{row.a2}}</td>
                    <td>
                        <button class="btn-blue">添加</button>
                    </td>
                </template>
            </Table>
            <Table class="tab-right" :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <td>{{row.a1}}</td>
                    <td>{{row.a2}}</td>
                    <td>
                        <button class="btn-blue">移除</button>
                    </td>
                </template>
            </Table>
        </div>
        <div class="btn-save">
            <button class="btn-blue-large">保存</button>
        </div>
    </div>
</template> 
<script>
export default {
    props: {
        platform_sign: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            filterLeft: {
                name: '1'
            },
            filterRight: {
                name: '1'
            },
            name_left_show: false,
            name_right_show: false,
            active_opt: [
                // {label:'全部',value: ''},
                { label: '活动名称', value: '1' },
            ],
            headers: ['编号', '活动名称', '操作'],
            list: [
                {
                    a1: '1',
                    a2: '抢红包',
                },
                {
                    a1: '64646466',
                    a2: '幸运转盘',
                }
            ]
        }
    },
    methods: {
        getAssignedList() {
            let para = {
                platform_sign: this.platform_sign,
                name: this.name,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
        
            let { url, method } = this.$api.active_manage_assigned_list
            this.$http({ method, url, params }).then(res => {
        console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
        
                }
            })
        },
    },
    mounted() {
        this.getAssignedList()
    }
}
</script>

<style scoped>
.cont {
    width: 1040px;
}

.table {
    display: flex;
    margin-top: 20px;
}
.table .tab-left,
.table .tab-right {
    width: 510px;
}
.tab-right {
    margin-left: 100px;
}
.btn-save {
    margin-top: 50px;
    text-align: center;
}
</style>