<template>
    <div class="cont">
        <div class="filter p10">
            <div class="left">
                <ul class="up">
                    <!-- 左侧的 -->
                    <li>
                        <span>游戏平台</span>
                        <Select
                            v-model="filterLeft.vendor_id"
                            :options="platform_opt"
                            @update="plantformLeftUpd"
                        ></Select>
                    </li>
                    <li v-show="true">
                        <span>游戏名称</span>
                        <Select
                            input
                            v-model="filterLeft.game_id"
                            :options="game_name_opt(filterLeft.vendor_id)"
                        ></Select>
                    </li>
                    <li>
                        <button class="btn-blue" @click="getUnsignList">查找</button>
                    </li>
                </ul>
                <!-- <ul class="down">
                    <li>
                        <span>游戏主类</span>
                        <Select
                            v-model="filterLeft.game_main_type"
                            :options="platform_opt"
                            @update="gameMainUpd('left')"
                        ></Select>
                    </li>
                    <li v-show="true">
                        <span>游戏次类</span>
                        <Select input v-model="filterLeft.sub_game_type" :options="sub_game_left_opt"></Select>
                    </li>
                    
                </ul>-->
            </div>
            <!-- 右边的 right -->

            <div class="right">
                <ul class="up">
                    <li>
                        <span>游戏平台</span>
                        <Select
                            v-model="filterRight.vendor_id"
                            :options="platform_opt"
                            @update="plantformRightUpd"
                        ></Select>
                    </li>
                    <li v-show="true">
                        <span>游戏名称</span>
                        <Select
                            input
                            v-model="filterRight.game_id"
                            :options="game_name_opt(filterRight.vendor_id)"
                        ></Select>
                    </li>
                    <li>
                        <button class="btn-blue" @click="getAssignedList">查找</button>
                    </li>
                </ul>
                <!-- <ul class="down">
                    <li>
                        <span>游戏主类</span>
                        <Select
                            v-model="filterRight.game_main_type"
                            :options="platform_opt"
                         
                        ></Select>
                    </li>
                    <li v-show="true">
                        <span>游戏次类</span>
                        <Select input v-model="filterRight.subgame_type" :options="sub_game_right_opt"></Select>
                    </li>
                </ul>-->
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
                            <td>{{plantform_obj[row.vendor_id]}}</td>
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
                <Page
                    class="mt10"
                    :total="left.total"
                    hiddenJump
                    :pageNo.sync="left.pageNo"
                    :pageSize.sync="left.pageSize"
                    @updateNo="leftUpdateNo"
                    @updateSize="leftUpdateSize"
                />
            </div>

            <!-- 右边的table -->
            <div class="tab-right">
                <button class="btn-red-large mt30" @click="remove">移除</button>
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
                            <td>{{plantform_obj[row.vendor_id]}}</td>
                            <td>{{row.name}}</td>
                            <td>
                                <div class="select-center">
                                    <Checkbox
                                        label
                                        v-model="row.checked"
                                        @update="rightCheckBoxUpd(index)"
                                    />
                                </div>
                            </td>
                            <!-- <td>
                                <button class="btn-blue" @click="remove(row)">移除</button>
                            </td>-->
                        </tr>
                        <tr v-if="right.list&&right.list.length===0">
                            <td colspan="3">数据为空</td>
                        </tr>
                    </tbody>
                </table>
                <Page
                    class="mt10"
                    hiddenJump
                    :total="right.total"
                    :pageNo.sync="right.pageNo"
                    :pageSize.sync="right.pageSize"
                    @updateNo="rightUpdateNo"
                    @updateSize="rightUpdateSize"
                />
            </div>
        </div>
        <div class="btn-save"></div>
    </div>
</template> 
<script>
import tool from '../../../../js/tool'
export default {
    props: {
        outRow: {
            type: Object
        }
    },
    data() {
        return {
            filterLeft: {
                plantform: '',
                game_id: '',
                game_main_type: '',
                subgame_type: ''
            },
            filterRight: {
                plantform: '',
                game_id: '',
                game_main_type: '',
                subgame_type: ''
            },
            name_left_show: false,
            name_right_show: false,
            platform_opt: [], // 游戏平台下拉
            plantform_obj: {}, // id为key ,方便获取平台的中文名字
            // game_name_opt: [], // 游戏名称
            // headers: ['游戏平台', '游戏名称', '操作'],
            game_sort_obj: {}, // 游戏父子分类对象
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
                allChecked: false,
                checked: [],
                list: [],
                total: 0,
                pageNo: 1,
                pageSize: 25
            }
        }
    },
    computed: {
        /** 游戏次类 left */
        sub_game_left_opt() {},
        /** 游戏次类 left */
        sub_game_right_opt() {}
    },
    methods: {
        plantformLeftUpd(val) {
            // if (val !== '') {
            //     this.name_left_show = true
            // } else {
            //     this.name_left_show = false
            // }
        },
        plantformRightUpd(val) {
            // if (val !== '') {
            //     this.name_right_show = true
            // } else {
            //     this.name_right_show = false
            // }
        },
        /** 获取下拉框 */
        getOpt() {
            tool.getOpt('game_vendors__games').then(res => {
                if (res && Array.isArray(res)) {
                    this.platform_opt = [{ label: '全部', value: '' }]
                    res.forEach(item => {
                        this.platform_opt.push({
                            label: item.name,
                            value: item.id,
                            children: item.games_under_vendor
                        })
                        this.plantform_obj[item.id] = item.name
                    })
                }
            })
        },
        game_name_opt(id) {
            let arr = [{ label: '全部', value: '' }]
            this.platform_opt.forEach(item => {
                if (item.value === id || !id) {
                    if (item.children) {
                        item.children.forEach(child => {
                            arr.push({
                                label: child.name,
                                value: item.id
                            })
                        })
                    }
                }
            })
            // console.log('🍬 arr: ', arr);
            return arr
        },
        // 获取游戏平台下拉框opt
        // getPlatformOpt() {
        //     let arrToOpt = function(arr = []) {
        //         let list = [{ label: '全部', value: '' }]
        //         arr = arr.map(item => {
        //             return {
        //                 label: item.name,
        //                 value: item.id
        //             }
        //         })
        //         return list.concat(arr)
        //     }

        //     let { url, method } = this.$api.game_manage_opt_list
        //     this.$http({ method, url }).then(res => {
        //         // console.log('option👌: ', res)
        //         if (res && res.code === '200' && res.data) {
        //             this.platform_opt = arrToOpt(res.data.vendors)
        //             let vendors = res.data.vendors || []
        //             vendors.forEach(item => {
        //                 this.plantform_obj[item.id] = item.name
        //             })
        //             this.game_name_opt = arrToOpt(res.data.games)
        //         }
        //     })
        // },
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
            let game_ids = []
            list.forEach(item => {
                if (item.checked) {
                    game_ids.push(item.id)
                }
            })
            let data = {
                platform_id: this.outRow.id,
                game_ids: JSON.stringify(game_ids)
            }

            let { url, method } = this.$api.game_manage_add
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
                platform_id: this.outRow.id,
                game_ids: JSON.stringify(game_ids)
            }

            let { url, method } = this.$api.game_manage_del
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
        /** 获取游戏父子分类 opt */
        getGameOpt() {
            let all_opt_item = []
            let { url, method } = this.$api.game_sort_list
            this.$http({ method, url }).then(res => {
                if (res && res.code === '200') {
                    if (res.data && Array.isArray(res.data)) {
                        res.data.forEach(item => {
                            let opt = [{ label: '全部', value: '' }]
                            if (item.children && Array.isArray(item.children)) {
                                item.children.forEach(child => {
                                    opt.push({
                                        label: child.name,
                                        value: child.id
                                    })
                                })
                            }
                            /** 根据 父级id放置 子类 */
                            this.game_sort_obj[item.id] = opt
                        })
                    }
                }
            })
        },
        /** 后端数据可能为 对象 格式这里转换一下 */
        objToArr(rightList = []) {
            if (Array.isArray(rightList)) {
                return rightList
            }
            if (window.all.tool.isType(rightList) === 'Object') {
                let arr = []
                Object.keys(rightList).forEach(key => {
                    arr.push(rightList[key])
                })
                return arr
            }
        },
        getUnsignList() {
            let para = {
                platform_id: this.outRow.id,
                vendor_id: this.filterLeft.vendor_id,

                game_id: this.filterLeft.game_id,
                pageSize: this.left.pageSize,
                page: this.left.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.game_manage_unsign_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.left.total = res.data.total
                    this.left.list = res.data.data || []
                    // 去掉选择checkbox
                    this.left.allChecked = false
                    if (this.left.list.length > 0) {
                        this.left.list.forEach(item => {
                            item.checked = false
                        })
                    }
                }
            })
        },
        // right
        getAssignedList() {
            let para = {
                platform_id: this.outRow.id,
                vendor_id: this.filterRight.vendor_id,
                game_id: this.filterRight.game_id,
                pageSize: this.right.pageSize,
                page: this.right.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
            // console.log('🍍 params: ', params);

            let { url, method } = this.$api.game_manage_assigned_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.right.total = res.data.total
                    this.right.list = this.objToArr(res.data.data)

                    this.right.allChecked = false
                }
            })
        }
    },
    mounted() {
        this.getUnsignList()
        this.getAssignedList()
        // 获取下拉框内容
        // this.getPlatformOpt()
        // this.getGameOpt()
        this.getOpt()
    }
}
</script>

<style scoped>
.cont {
    min-width: 900px;
    /* width: 99%; */
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