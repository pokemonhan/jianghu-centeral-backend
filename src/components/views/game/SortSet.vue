<template>
    <div class="container">
        <!---------------------- 分类设置 -------------------->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>分类名称</span>
                    <Input v-model="filter.name" />
                </li>
                <li>
                    <span>分类状态</span>
                    <Select v-model="filter.status" :options="sort_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                </li>
            </ul>
        </div>
        <div class="table mt20">
            <Table :headers="headers" :column="list">
                <!-- ['编号','分类名称','分类状态','最后更新人','最后更新时间','操作'] -->
                <template v-slot:item="{row,idx}">
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>{{row.name}}</td>
                    <td>
                        <span :class="[row.status===1?'green':'red']">{{row.status===1?'开启':'关闭'}}</span>
                    </td>
                    <td>{{row.last_editor?row.last_editor.name:'---'}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>
                        <button
                            :class="[row.status?'btns-red':'btns-green']"
                            @click="statusSwitch(row)"
                        >{{row.status===1?'禁用':'启用'}}</button>
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
        <div class="tree">
            <ul class="lev1">
                <li v-for="(lv1, lv1_idx) in showList" :key="lv1_idx">
                    <div class="title t1">
                        <i
                            v-if="lv1.children"
                            :class="['iconfont iconup',lv1.isMenuOpen?'iconopen':'']"
                        ></i>
                        <span @click="expand(lv1_idx,lv1)">{{lv1.label}}</span>
                    </div>
                    <!-- 一级 子内容 -->
                    <ul v-if="lv1.children" class="lev2" :ref="lv1_idx">
                        <li v-for="(lv2, lv2_idx) in lv1.children" :key="lv2_idx">
                            <div class="title t2">
                                <i
                                    v-if="lv2.children"
                                    :class="['iconfont iconup',lv2.isMenuOpen?'iconopen':'']"
                                ></i>
                                <span @click="expand(lv2_idx,lv2)">{{lv2.label}}</span>
                                <button class="btns-plain-blue" @click="edit(lv1)">编辑</button>

                                <button class="btns-plain-red" @click="del(lv1)">删除</button>
                                <Switchbox class="switch" v-model="lv1.is_open" />
                            </div>
                            <ul v-if="lv2.children" :ref="lv1_idx+'-'+lv2_idx">
                                <li v-for="(lv3, lv3_idx) in lv2.children" :key="lv3_idx">
                                    <div class="title t3">
                                        <span>{{lv3.label}}</span>
                                        <button class="btns-plain-blue" @click="edit(lv2)">编辑</button>

                                        <button class="btns-plain-red" @click="del(lv2)">删除</button>
                                        <Switchbox class="switch" v-model="lv2.is_open" />
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <Modal :show.sync="mod_show" :title="mod_title" :content="mod_cont" @confirm="modConf"></Modal>
    </div>
</template>
<script>
export default {
    name: 'SortSet',
    data() {
        return {
            filter: {
                name: '',
                status: ''
            },
            sort_opt: [
                { label: '全部', value: '' },
                { label: '关闭', value: 0 },
                { label: '启用', value: 1 }
            ],

            headers: [
                '编号',
                '分类名称',
                '分类状态',
                '最后更新人',
                '最后更新时间',
                '操作'
            ],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            // tree 样式
            showList: window.all.menu_list,
            // 确认框
            mod_show: false,
            mod_title: '1',
            mod_cont: '',
            curr_row: {}
        }
    },
    methods: {
        expand(index, item) {
            console.log('index: ', index)
            let ele = this.$refs[index]
            // $(ele).slideToggle(200)
            item.isMenuOpen = !item.isMenuOpen
            let slideToggle = window.all.tool.slideToggle(ele)
            this.$forceUpdate()
        },

        updateNo() {
            this.getList()
        },
        updateSize() {
            this.pageNo = 1
            this.getList()
        },
        getList() {
            let para = {
                name: this.filter.name,
                status: this.filter.status,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.game_sort_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
                }
            })
        },
        edit(row) {
            // console.log('row: ', row)
        },
        del() {},
        statusSwitch(row) {
            this.curr_row = row
            if (row.status === 1) {
                this.mod_title = '禁用'
                this.mod_cont = '是否确定禁用该游戏分类？'
            } else {
                this.mod_title = '启用'
                this.mod_cont = '是否确定启用该游戏分类？'
            }
            this.mod_show = true
        },
        // 功能改动
        modConf() {
            let { id, status } = this.curr_row
            let data = {
                id: id,
                status: status === 1 ? 0 : 1
            }
            let { url, method } = this.$api.game_sort_status_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.mod_show = false
                }
                this.getList()
            })
        }
    },
    mounted() {
        this.getList()
    }
}
</script>

<style scoped>
li > .title {
    display: flex;
    height: 25px;
}
.t2 {
    margin-left: 2em;
}
.iconfont {
    transition: all 0.2s;
}
.lev1 ul {
    /* display: none; */
    overflow: hidden;
    transition: max-height 0.4s;
}
.btns-plain-blue,
.btns-plain-red {
    display: inline-block;
    height: 20px;
    vertical-align: middle;
    margin-left: 5px;
    padding: 0 2px;
    font-size: 12px;
    cursor: pointer;
}
.btns-plain-blue:active,
.btns-plain-red:active {
    transform: scale(0.9);
}
.btns-plain-blue {
    background: #ecf5ff;
    color: #4c8bfd;
    border: 1px solid #b3d8ff;
    border-radius: 3px;
    box-shadow: 1px 1px 3px rgba(102, 158, 255, 0.2);
}
.btns-plain-red {
    background: #fef0f0;
    color: #ec5946;
    border: 1px solid #fbc4c4;
    border-radius: 3px;
    box-shadow: 1px 1px 3px rgba(250, 179, 174, 0.2);
}
.switch {
    position: relative;
    margin-top: -2px;
    transform: scale(0.5);
}
/* .iconopen {
    transform: rotate(180deg);
} */
</style>