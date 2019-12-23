<template>
    <div class="container">
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>账号:</span>
                    <Input class="w100" v-model="filter.acc" />
                </li>
                <li>
                    <span>登录日期</span>
                    <Input class="w100" v-model="filter.dates[0]" />
                    <span style="margin:0 5px;">~</span>
                    <Input class="w100" v-model="filter.dates[1]" />
                </li>
                <li>
                    <span>登录ip</span>
                    <Input class="w100" v-model="filter.login_ip" />
                </li>
            </ul>
            <div>
                <button class="btn-blue">查询</button>
                <button class="btn-blue">导出EXcel</button>
            </div>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <td>{{row.a1}}</td>
                    <td>{{row.a2}}</td>
                    <td>{{row.a3}}</td>
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
    data() {
        return {
            filter: {
                acc: '',
                dates: ['', ''],
                login_ip: ''
            },
            total: 0,
            pageNo: 1,
            pageSize: 25,
            headers: ['账号','登录IP','登录日期'],
            list: [
                {
                    a1: '13256564589',
                    a2: '192.168.1.1(中国.广州）',
                    a3: '2019/12/15 12:12:00'
                },
                {
                    a1: '13256564589',
                    a2: '192.168.1.1(中国.广州）',
                    a3: '2019/12/15 12:12:00'
                },
                
            ]
        }
    },
    methods: {
        updateNo(val) {},
        updateSize(val) {}
    },
    mounted() {
        this.filter.acc = '你好世界'
    }
}
</script>

<style scoped>
.p10 {
    padding: 10px;
}
.mt20 {
    margin-top: 20px;
}
</style>
