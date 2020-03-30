<template>
    <div class="container">
        <!---------------------- 分类设置 -------------------->
        <!-- <div class="filter p10">
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
        </div>-->
        <!-- <div class="table mt20">
            <Table :headers="headers" :column="list">
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
        </div>-->
        <div class="cont">
            <div class="left tree">
                <div class="left-inner">
                    <div>
                        <button class="btn-blue-large ml50" @click="add('lev1')">添加一级分类</button>
                    <ul class="lev1 mt20">
                        <li v-for="(lv1, lv1_idx) in showList" :key="lv1_idx">
                            <div class="title t1">
                                <i
                                    v-if="lv1.children"
                                    :class="['iconfont iconup',lv1.isMenuOpen?'iconopen':'']"
                                ></i>
                                <span @click="expand(lv1_idx,lv1)">{{lv1.name}}</span>

                                <button class="btns-plain-blue" @click="add(lv1,2)">添加</button>
                                <button class="btns-plain-blue" @click="edit(lv1)">编辑</button>
                                <button class="btns-plain-red" @click="del(lv1)">删除</button>
                                <Switchbox
                                    class="switch"
                                    v-model="lv1.status"
                                    @update="switchUpd(lv1)"
                                />
                            </div>
                            <!-- 二级 子内容 -->
                            <ul v-if="lv1.children" class="lev2" :ref="lv1_idx">
                                <li v-for="(lv2, lv2_idx) in lv1.children" :key="lv2_idx">
                                    <div class="title t2">
                                        <i
                                            v-if="lv2.children"
                                            :class="['iconfont iconup',lv2.isMenuOpen?'iconopen':'']"
                                        ></i>
                                        <span>{{lv2.name}}</span>
                                        <button class="btns-plain-blue" @click="edit(lv2)">编辑</button>
                                        <button class="btns-plain-red" @click="del(lv2)">删除</button>
                                        <!-- <Switchbox
                                        class="switch"
                                        v-model="lv2.status"
                                        @update="switchUpd(lv2)"
                                        />-->
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="right-inner">
                    <div>
                         <SortSetDetail :menu="showList" @refreshMenu="refreshMenu" />
                    </div>
                </div>
            </div>
        </div>
        <Dialog :show.sync="dia_show" :title="dia_title">
            <div class="dia-inner">
                <div>
                    <ul class="form">
                        <li>
                            <span>分类名称</span>
                            <Input class="w250" v-model="form.name" />
                            <span class="err-tips">{{form.name===''?'不可为空':''}}</span>
                        </li>
                        <li>
                            <span>分类标识</span>
                            <Input class="w250" limit="word" v-model="form.sign" />
                            <span class="err-tips">{{form.sign===''?'不可为空':''}}</span>
                        </li>
                        <li v-if="dia_status==='add'">
                            <span>状态选择</span>
                            <Radio
                                class="radio-left"
                                label="启用"
                                :value="form.status"
                                val="1"
                                v-model="form.status"
                            />
                            <Radio
                                class="radio-right ml50"
                                label="禁用"
                                :value="form.status"
                                val="0"
                                v-model="form.status"
                            />
                        </li>
                        <li class="center-box">
                            <button class="btn-plain-large" @click="dia_show=false">取消</button>
                            <button class="btn-blue-large ml50" @click="diaConfirm">确定</button>
                        </li>
                    </ul>
                </div>
            </div>
        </Dialog>
        <Modal :show.sync="mod_show" :title="mod_title" :content="mod_cont" @confirm="modConf"></Modal>
    </div>
</template>
<script>
import SortSetDetail from './SortSetDetail'
export default {
    name: 'SortSet',
    components: {
        SortSetDetail
    },
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

            // headers: [
            //     '编号',
            //     '分类名称',
            //     '分类状态',
            //     '最后更新人',
            //     '最后更新时间',
            //     '操作'
            // ],
            // list: [],
            // total: 0,
            // pageNo: 1,
            // pageSize: 25,

            // tree 样式
            showList: [],
            // 确认框
            mod_show: false,
            mod_status: '',
            mod_title: '1',
            mod_cont: '',
            curr_row: {},
            // dialog 对话框
            dia_show: false,
            dia_title: '',
            dia_status: '',
            form: {
                name: '',
                sign: '',
                status: 1
            }
        }
    },
    methods: {
        expand(index, item) {
            let ele = this.$refs[index]
            item.isMenuOpen = !ele[0].offsetHeight
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
        refreshMenu() {
            this.getList()
        },
        getList() {
            let para = {
                name: this.filter.name,
                status: this.filter.status
                // pageSize: this.pageSize,
                // page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.game_sort_list
            this.$http({ method, url, params }).then(res => {
                console.log('res: ', res)
                if (res && res.code === '200') {
                    // this.total = res.data.total
                    // this.list = res.data.data
                    let arr = res.data || []
                    this.showList = arr.map(item => {
                        item.isMenuOpen = true
                        return item
                    })
                }
            })
        },
        add(row) {
            console.log('row: ', row)
            this.form = {
                name: '',
                sign: '',
                status: 1,
                category_type: row !== 'lev1' ? 2 : 1
            }
            if (row.id) {
                this.form.parent_id = row.id
            }
            console.log('this.form: ', this.form)
            this.dia_status = 'add'
            this.dia_title =
                this.form.category_type === 1 ? '添加一级菜单' : '添加子级'
            this.dia_show = true
        },
        edit(row) {
            this.form = {
                id: row.id,
                name: row.name,
                sign: row.sign,
                // status: row.status
                category_type: row.parent_id ? 2 : 1
            }
            this.dia_status = 'edit'
            this.dia_title = '编辑'
            this.dia_show = true
        },
        del(row) {
            this.curr_row = row
            this.mod_status = 'del'
            this.mod_title = '删除'
            this.mod_cont = '是否确定删除该游戏分类？'
            this.mod_show = true
        },
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
            if (this.mod_status === 'del') {
                this.delCfm()
            } else if (this.mod_status === 'switch') {
                this.switchCfm()
            }
        },
        delCfm() {
            console.log('this.curr_row: ', this.curr_row);
            let data = {
                id: this.curr_row.id,
                category_type: this.curr_row.parent_id ? 2 : 1
                
            }
            let { url, method } = this.$api.game_type_del
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.mod_show = false
                }
                this.getList()
            })
        },
        switchUpd(row) {
            let { id, status } = row
            let data = {
                id: id,
                status: status ? 1 : 0,
                category_type: row.parent_id ? 2 : 1
            }
            let { url, method } = this.$api.game_sort_status_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    this.mod_show = false
                }
                this.getList()
            })
        },
        diaConfirm() {
            if (this.dia_status === 'add') {
                this.addCfm()
            } else if (this.dia_status === 'edit') {
                this.editCfm()
            }
        },
        checkForm() {
            if (this.form.name === '') {
                this.$toast.warning('分类名称不可为空!')
                return false
            }
            if (this.form.sign === '') {
                this.$toast.warning('分类标识不可为空!')
                return false
            }
            return true
        },
        // 添加确认
        addCfm() {
            if (!this.checkForm()) return
            let data = this.form
            let { url, method } = this.$api.game_type_add

            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
                }
            })
        },

        // 编辑确认
        editCfm() {
            if (!this.checkForm()) return
            //   let data = {
            //     id: this.form.id,
            //     name: this.form.name,
            //     sign: this.form.sign,
            //     category_type: Boolean(1)
            //   };
            let data = this.form
            console.log('data: ', data)

            let { url, method } = this.$api.game_sort_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    this.getList()
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
.container {
    background: rgb(248, 248, 248);

}
.cont {
    display: flex;
    height: 100%;
    /* font-size: 1.5rem; */
    /* background: #eee; */
}
.cont .left,
.cont .right {
    display: flex;
    justify-content: center;
    width: 50%;
    height: 100%;
    /* padding: 20px; */
    padding-top: 20px;
    /* background: #000; */
    /* border: 1px solid #4c8bfd; */
}

.cont .left .left-inner, 
.cont .right .right-inner {
    min-height: calc(100vh - 200px);
    /* padding: 20px; */
    display: flex;
    justify-content: center;
    min-width: 80%;
    
    border-radius: 5px;
    border: 1px solid #4c8bfd;
    background: #fff;
    
    transition: box-shadow .8s;
}
.cont .left .left-inner:hover {
    box-shadow: 0 0 7px 1px rgb(207, 207, 207);
} 
.cont .right .right-inner:hover {
    box-shadow: 0 0 7px 1px rgb(207, 207, 207);
}
.cont .left .left-inner {
    padding-top: 20px;
}
.cont .right-inner {
    padding-top: 70px;
}
li > .title {
    display: flex;
    align-items: center;
    height: 26px;
}
.t2 {
    margin-left: 2em;
}
.iconfont {
    height: 1em;
    transform: rotate(180deg);
    transition: all 0.2s;
    transform-origin: center;
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
.iconopen {
    transform: rotate(0deg);
    /* transform-origin: 50% 50%; */
}
.form > li {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 20px;
}
.form > li > span:first-child {
    width: 5em;
}
.form li .err-tips {
    position: absolute;
    top: 30px;
    left: 6em;
    color: red;
}
.w250 {
    width: 250px;
}
.ml50 {
    margin-left: 50px;
}

.form .center-box {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}
</style>