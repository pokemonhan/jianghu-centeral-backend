<template>
    <div class="cont">
        <div class="filter p10">
            <div class="left">
                <ul class="up">
                    <!-- 左侧的 -->
                    <li>
                        <span>游戏名称</span>
                        <Select input v-model="filter.left_name" :options="act_name_left_opt"></Select>
                    </li>
                    <li>
                        <button class="btn-blue" @click="getUnsignList">查找</button>
                    </li>
                </ul>
            </div>
            <!-- 右边的 right -->

            <div class="right">
                <ul class="up">
                    <li>
                        <span>游戏名称</span>
                        <Select input v-model="filter.right_name" :options="act_name_right_opt"></Select>
                    </li>
                    <li>
                        <button class="btn-blue" @click="getAssignedList">查找</button>
                    </li>
                </ul>
            </div>
        </div>

        <div class="table table-container">
            <div class="tab-left">
                <button class="btn-blue-large mt30" @click="save">分配</button>
                <table class="mt10">
                    <thead>
                        <tr>
                            <th>游戏平台</th>
                            <th>游戏名称</th>
                            <th>
                                <div class="th-checkbox">
                                    <span>操作</span>
                                    <span>
                                        <Checkbox
                                            label="全选"
                                            v-model="left.allChecked"
                                            @update="leftCheckBoxUpd('all')"
                                        />
                                    </span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in left.list" :key="index">
                            <td>{{(right.pageNo-1)*right.pageSize+index+1}}</td>
                            <td>{{row.name}}</td>
                            <td>
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
                <div class="flex justify-center">
                    <Page
                        class="mt10"
                        :total="left.total"
                        hiddenJump
                        hiddenSelect
                        :pageNo.sync="left.pageNo"
                        :pageSize.sync="left.pageSize"
                        @updateNo="leftUpdateNo"
                        @updateSize="leftUpdateSize"
                    />
                </div>
            </div>

            <!-- 右边的table -->
            <div class="tab-right">
                <button class="btn-red-large mt30" @click="remove">移除</button>
                <table class="mt10 x-table">
                    <thead>
                        <tr>
                            <th>游戏平台</th>
                            <th>游戏名称</th>
                            <th>
                                <div class="th-checkbox">
                                    <span>操作</span>
                                    <span>
                                        <Checkbox
                                            label="全选"
                                            v-model="right.allChecked"
                                            @update="rightCheckBoxUpd('all')"
                                        />
                                    </span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in right.list" :key="index">
                            <td>{{(right.pageNo-1)*right.pageSize+index+1}}</td>
                            <td>{{row.name}}</td>
                            <td>
                                <div class="select-center">
                                    <Checkbox label v-model="row.checked" @update="rightCheckBoxUpd(index)" />
                                </div>
                            </td>
                        </tr>
                        <tr v-if="right.list&&right.list.length===0">
                            <td colspan="3">数据为空</td>
                        </tr>
                    </tbody>
                </table>
                <div class="flex justify-center">
                    <Page
                        class="mt10"
                        hiddenJump
                        hiddenSelect
                        :total="right.total"
                        :pageNo.sync="right.pageNo"
                        :pageSize.sync="right.pageSize"
                        @updateNo="rightUpdateNo"
                        @updateSize="rightUpdateSize"
                    />
                </div>
            </div>
        </div>
        <div class="btn-save"></div>
    </div>
</template> 
<script>
import tool from '../../../../js/tool'
export default {
    props: {
        platform_sign: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            act_name_left_opt: [],
            act_name_right_opt: [],
            filter: {
                left_name: '',
                right_name: '',
            },
            left: {
                // headers: ['编号', '活动名称', '操作'],
                allChecked: false,
                checked: [],
                list: [],
                total: 0,
                pageNo: 1,
                pageSize: 10
            },
            right: {
                // headers: ['编号', '活动名称', '操作'],
                allChecked: false,
                checked: [],
                list: [],
                total: 0,
                pageNo: 1,
                pageSize: 10
            }
        }
    },
    methods: {
        gameMainUpd(left_or_right) {
            if ((left_or_right = 'left')) {
            }
        },
        leftCheckBoxUpd(val) {
            // console.log('val: ', val)
            // checkbox全选
            if (val === 'all') {
                this.left.list = this.left.list.map(item => {
                    item.checked = this.left.allChecked
                    return item
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
        rightCheckBoxUpd(val) {
            if (val === 'all') {
                this.right.list = this.right.list.map(item => {
                    item.checked = this.right.allChecked
                    return item
                })
            } else {
                let self = this
                this.$nextTick(function() {
                    // console.log('🍢 self.right.lis: ', self.right)
                    self.right.allChecked = (self.right.list || []).every(
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
            let act_ids = []
            list.forEach(item => {
                if (item.checked) {
                    act_ids.push(item.id)
                }
            })
            let data = {
                platform_sign: this.platform_sign,
                activities: JSON.stringify(act_ids)
            }

            let { url, method } = this.$api.active_manage_add
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.getUnsignList()
                    this.getAssignedList()
                }
            })
        },
        remove(row) {
            let list = this.right.list || []
            if (list.length < 1) {
                return
            }
            let game_ids = []
            list.forEach(item => {
                if (item.checked) {
                    game_ids.push(item.id)
                }
            })
            let data = {
                platform_sign: this.platform_sign,
                activities: JSON.stringify(game_ids)
            }

            let { url, method } = this.$api.active_manage_del
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.getUnsignList()
                    this.getAssignedList()
                }
            })
        },
        leftUpdateNo(val) {
            this.getUnsignList()
        },
        leftUpdateSize(val) {
            this.left.pageNo = 1
            this.getUnsignList()
        },
        rightUpdateNo(val) {
            this.getAssignedList()
        },
        rightUpdateSize(val) {
            this.right.pageNo = 1
            this.getAssignedList()
        },
        // left
        getUnsignList() {
            let para = {
                platform_sign: this.platform_sign,
                name: this.filter.left_name,
                pageSize: this.left.pageSize,
                page: this.left.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.active_manage_unassign_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.left.total = res.data.total
                    this.left.list = res.data.data || []
                    // 去掉选择checkbox
                    this.left.allChecked = false
                    this.act_name_left_opt = [{label:'全部',value:''}]

                    if (this.left.list.length > 0) {
                        this.left.list.forEach(item => {
                            item.checked = false
                            this.act_name_left_opt.push({
                                label: item.name,
                                value: item.name
                            })
                        })
                    }
                }
            })
        },
        // right
        getAssignedList() {
            let para = {
                platform_sign: this.platform_sign,
                name: this.filter.right_name,
                pageSize: this.right.pageSize,
                page: this.right.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.active_manage_assigned_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.right.total = res.data.total
                    this.right.list = res.data.data || []
                    // 去掉选择checkbox
                    this.right.allChecked = false
                    this.act_name_right_opt = [{label:'全部',value:''}]
                    if (this.right.list.length > 0) {
                        this.right.list.forEach(item => {
                            item.checked = false
                            this.act_name_right_opt.push({
                                label: item.name,
                                value: item.name
                            })
                        })

                    }
                }
            })
        }
    },
    mounted() {
        this.getUnsignList()
        this.getAssignedList()
    }
}
</script>

<style scoped>
.cont {
    min-width: 900px;
    height: 650px;
}
.filter {
    justify-content: space-around;
}
.filter > .left,
.filter > .right {
    display: initial;
}
.filter .up,
.filter .down {
    display: flex;
}
.up li,
.down li {
    display: flex;
    align-items: center;
    margin-right: 10px;
}
.up span:first-child,
.down span:first-child {
    margin-right: 5px;
}
.down {
    margin-top: 10px;
}
/* .up li:not */
.table {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.table .tab-left,
.table .tab-right {
    width: 510px;
}
.table table {
    /* table-layout: auto; */
    border-collapse: collapse;
    box-sizing: border-box;
}
.tab-right {
    margin-left: 50px;
}
.table .x-table {
    min-height: 0;
}
.btn-save {
    margin-top: 50px;
    text-align: center;
}
/* .right {
    display: flex;
}
.right > li {
    display: flex;
    align-items: center;
    margin-right: 10px;
}
.right > li span:first-child {
    margin-right: 10px;
} */

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
    border: 1px solid #6fa2fe;
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