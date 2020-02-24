<template>
    <div class="cont">
        <div class="filter p10">
            <ul class="left">
                <!-- 左侧的 -->
                <li>
                    <span>游戏平台</span>
                    <Select
                        v-model="filterLeft.vendor_id"
                        :options="plantform_opt"
                        @update="plantformLeftUpd"
                    ></Select>
                </li>
                <li v-show="name_left_show">
                    <span>游戏名称</span>
                    <Select v-model="filterLeft.game_id" :options="game_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getUnsignList">查找</button>
                    <!-- <button class="btn-blue">全部添加</button> -->
                </li>

                <!-- 右边的 right -->
            </ul>
            <ul class="right">
                <li>
                    <span>游戏平台</span>
                    <Select
                        v-model="filterRight.vendor_id"
                        :options="plantform_opt"
                        @update="plantformRightUpd"
                    ></Select>
                </li>
                <li v-show="name_right_show">
                    <span>游戏名称</span>
                    <Select v-model="filterRight.game_id" :options="game_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getAssignedList">查找</button>
                </li>
            </ul>
        </div>
        <div class="table table-container">
            <div class="tab-left">
                <table>
                    <thead>
                        <tr>
                            <th>游戏平台</th>
                            <th>游戏名称</th>
                            <th class="th-checkbox">
                                <span>操作</span>
                                <span>
                                    <Checkbox
                                        label="全选"
                                        v-model="left.allChecked"
                                        @update="leftCheckBoxUpd('all')"
                                    />
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in left.list" :key="index">
                            <td>{{plantform_obj[row.vendor_id]}}</td>
                            <td>{{row.name}}</td>
                            <td >
                                <div class="select-center">
                                    <Checkbox
                                    label
                                    v-model="row.checked"
                                    @update="leftCheckBoxUpd(index)"
                                />
                                </div>
                            </td>
                        </tr>
                        <tr v-if="left.list&&left.list.length===0">
                            <td colspan="3">数据为空</td>
                        </tr>
                    </tbody>
                </table>
                <Page
                    class="mt10"
                    :total="left.total"
                    :pageNo.sync="left.pageNo"
                    :pageSize.sync="left.pageSize"
                    @updateNo="leftUpdateNo"
                    @updateSize="leftUpdateSize"
                />
            </div>

            <!-- 右边的table -->
            <div class="tab-right">
                <table>
                    <thead>
                        <tr>
                            <th>游戏平台</th>
                            <th>游戏名称</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in right.list" :key="index">
                            <td>{{plantform_obj[row.vendor_id]}}</td>
                            <td>{{row.name}}</td>
                            <td>
                                <button class="btn-blue" @click="remove(row)">移除</button>
                            </td>
                        </tr>
                        <tr v-if="right.list&&right.list.length===0">
                            <td colspan="3">数据为空</td>
                        </tr>
                    </tbody>
                </table>
                <Page
                    class="mt10"
                    :total="right.total"
                    :pageNo.sync="right.pageNo"
                    :pageSize.sync="right.pageSize"
                    @updateNo="rightUpdateNo"
                    @updateSize="rightUpdateSize"
                />
            </div>
        </div>
        <div class="btn-save">
            <button class="btn-blue-large mt30" @click="save">保存</button>
        </div>
    </div>
</template> 
<script>
export default {
    props: {
        platform_sign: {
            type: String
        }
    },
    data() {
        return {
            filterLeft: {
                plantform: '',
                game_id: ''
            },
            filterRight: {
                plantform: '',
                game_id: ''
            },
            name_left_show: false,
            name_right_show: false,
            plantform_opt: [],
            plantform_obj: [], // id为key ,方便获取平台的中文名字
            game_opt: [],
            game_obj: [],
            // headers: ['游戏平台', '游戏名称', '操作'],
            left: {
                // headers: ['游戏平台', '游戏名称', '操作'],
                allChecked: false,
                checked: [],
                list: [],
                total: 0,
                pageNo: 1,
                pageSize: 25
            },
            right: {
                // headers: ['游戏平台', '游戏名称', '操作'],
                list: [],
                total: 0,
                pageNo: 1,
                pageSize: 25
            }
        }
    },
    methods: {
        plantformLeftUpd(val) {
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
        },
        // 获取下拉框opt
        getOpt() {
            let arrToOpt = function(arr = []) {
                let list = [{ label: '全部', value: '' }]
                arr = arr.map(item => {
                    return {
                        label: item.name,
                        value: item.id
                    }
                })
                return list.concat(arr)
            }

            let { url, method } = this.$api.game_manage_opt_list
            this.$http({ method, url }).then(res => {
                // console.log('option👌: ', res)
                if (res && res.code === '200' && res.data) {
                    this.plantform_opt = arrToOpt(res.data.vendors)
                    let vendors = res.data.vendors || []
                    vendors.forEach(item => {
                        this.plantform_obj[item.id] = item.name
                    })
                    this.game_opt = arrToOpt(res.data.games)
                }
            })
        },
        leftCheckBoxUpd(val) {
            // checkbox全选
            if (val === 'all') {
                this.left.list.forEach(item => {
                    item.checked = this.left.allChecked
                })
            } else {
                let self = this
                this.$nextTick(function() {
                    self.left.allChecked = self.left.list.every(
                        item => item.checked
                    )
                })
            }
        },
        // 添加保存
        save() {
            let list = this.left.list || []
            if (list.length < 1) {
                return
            }
            let game_signs = []
            list.forEach(item => {
                if (item.checked) {
                    game_signs.push(item.sign)
                }
            })
            let data = {
                platform_sign: this.platform_sign,
                game_signs: JSON.stringify(game_signs)
            }

            let { url, method } = this.$api.game_manage_add
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.getUnsignList()
                    this.getAssignedList()
                }
            })
        },
        remove(row) {
            console.log('row: ', row)
            let data = {
                platform_sign: this.platform_sign,
                game_signs: `["` + row.sign + `"]`
            }

            let { url, method } = this.$api.game_manage_del
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.getUnsignList()
                    this.getAssignedList()
                }
            })
        },
        leftUpdateNo(val) {},
        leftUpdateSize(val) {},
        rightUpdateNo(val) {},
        rightUpdateSize(val) {},
        getUnsignList() {
            let para = {
                platform_sign: this.platform_sign,
                vendor_id: this.filterLeft.vendor_id,

                game_id: this.filterLeft.game_id,
                pageSize: this.left.pageSize,
                page: this.left.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
            console.log('this.filterRight: ', this.filterRight)
            let { url, method } = this.$api.game_manage_unsign_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.left.total = res.data.total
                    this.left.list = res.data.data

                    if (this.left.list && this.left.list.length > 0) {
                        this.left.list.forEach(item => {
                            item.checked = false
                        })
                        this.left.list
                        console.log('this.left.list: ', this.left.list)
                    }
                }
            })
        },
        getAssignedList() {
            let para = {
                platform_sign: this.platform_sign,
                vendor_id: this.filterRight.vendor_id,
                game_id: this.filterRight.game_id,
                pageSize: this.right.pageSize,
                page: this.right.pageNo
            }
            let params = window.all.tool.rmEmpty(para)

            let { url, method } = this.$api.game_manage_assigned_list
            this.$http({ method, url, params }).then(res => {
                console.log('右边: ', res)
                if (res && res.code === '200') {
                    this.right.total = res.data.total
                    this.right.list = res.data.data
                }
            })
        }
    },
    mounted() {
        this.getUnsignList()
        this.getAssignedList()
        // 获取下拉框内容
        this.getOpt()
    }
}
</script>

<style scoped>
.cont {
    min-width: 1000px;
}

.table {
    display: flex;
    margin-top: 20px;
}
.table .tab-left,
.table .tab-right {
    width: 510px;
}
.table table {
    table-layout: auto;
    border-collapse: collapse;
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
.right > li {
    display: flex;
    align-items: center;
    margin-right: 10px;
}
.right > li span:first-child {
    margin-right: 10px;
}

.table-container table {
    border-collapse: collapse;
    width: 100%;
    /* table-layout: fixed */
}
.th-checkbox {
    display: flex;
    justify-content: center;
    align-items: center;
}
.select-center {
    display: flex;
    justify-content: center;
    align-items: center;

}
tbody tr:nth-child(2n) {
    /* background: #F7F7F7FF; */
    background: rgb(248, 252, 255);
}

tbody tr:hover {
    background: #fbfdfe;
}

.table-container table th {
    position: relative;
    /* padding: 7px 4px; */
    height: 2.8rem;
    font-weight: 400;
    color: #ffffff;
    background: #70a1fd;
}
tr td {
    /* height: 40px; */
    text-align: center;
    /* padding: 7px 4px; */
    height: 2.9rem;
    border: 1px solid #6fa2fe;
    /* font-size: 13px; */
}
.checkbox {
    justify-content: center;
}

th > div {
    display: flex;
    justify-content: center;
}
</style>