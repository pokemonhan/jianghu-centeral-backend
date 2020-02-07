<template>
    <div class="cont">
        <div class="filter p10">
            <ul class="left">
                <!-- 左侧的 -->
                <li>
                    <span>游戏平台</span>
                    <Select
                        v-model="filterLeft.plantform"
                        :options="plantform_opt"
                        @update="plantformLeftUpd"
                    ></Select>
                </li>
                <li v-show="name_left_show">
                    <span>游戏名称</span>
                    <Select v-model="filterLeft.name" :options="name_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue">查找</button>
                    <button class="btn-blue">全部添加</button>
                </li>
                <!-- 右边的 right -->
            </ul>
            <ul class="right">
                <li>
                    <span>游戏平台</span>
                    <Select
                        v-model="filterRight.plantform"
                        :options="plantform_opt"
                        @update="plantformRightUpd"
                    ></Select>
                </li>
                <li v-show="name_right_show">
                    <span>游戏名称</span>
                    <Select v-model="filterRight.name" :options="name_opt"></Select>
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
    data() {
        return {
            filterLeft: {
                plantform: '',
                name: ''
            },
            filterRight: {
                plantform: '',
                name: ''
            },
            name_left_show: false,
            name_right_show: false,
            plantform_opt: [
                { label: '全部', value: '' },
                { label: '开元棋牌', value: 1 },
                { label: '龙城棋牌', value: 2 },
                { label: 'AG电子', value: 3 },
                { label: 'BBN电子', value: 4 }
            ],
            name_opt: [
                // {label:'全部',value: ''},
                { label: '抢庄牛牛', value: 1 },
                { label: '百人牛牛', value: 2 },
                { label: '二人牛牛', value: 3 }
            ],
            headers: ['游戏平台', '游戏名称', '操作'],
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
            ]
        }
    },
    methods: {
        plantformLeftUpd(val) {
            console.log('val: ', val)
            if (val !== '') {
                this.name_left_show = true
            } else {
                this.name_left_show = false
            }
        },
        plantformRightUpd(val) {
            if (val !== '') {
                this.name_right_show = true
            } else {
                this.name_right_show = false
            }
        }
    },
    mounted() {}
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
.right {
    display: flex;
}
.right >li {
    display: flex;
    align-items: center;
    margin-right: 10px;
}
.right >li span:first-child {
    margin-right: 10px;
}
</style>