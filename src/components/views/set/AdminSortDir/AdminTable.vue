<template>
    <div class="table">
        <div class="mb20" v-show="!isSearch">
            <span>成员列表：</span>
            <button class="btn-blue" @click="addMember">添加成员</button>
        </div>
        <div class="show-table">
            <Table class="admin-table" :headers="headers" :column="list">
                <template v-slot:item="{row}">
                    <td class="px10 min-w-60">{{row.name}}</td>
                    <td class="px10 min-w-180">{{row.email}}</td>
                    <!-- <td
                    :class="[row.status?'green':'red']"
                    >{{row.status===1?'启用':row.status===0?'禁用':'出错!!!'}}</td>-->
                    <td class="px5 min-w-60">
                        <Switchbox v-model="row.status" @update="memberStatusSwitch(row)" />
                    </td>
                    <td class="px5 min-w100">
                        <button class="btns-blue" @click="editPwd(row)">修改密码</button>
                        <!-- <button
                        :class="[row.status?'btns-red':'btns-green']"
                        @click="memberStatusSwitch(row)"
                        >{{row.status===1?'禁用':row.status===0?'启用':'出错'}}</button>-->
                    </td>
                </template>
            </Table>

            <!-- <Page
                v-show="!isSearch"
                class="table-page"
                :total="total"x
                :pageNo.sync="pageNo"
                :pageSize.sync="pageSize"
                @updateNo="updateNo"
                @updateSize="updateSize"
            />-->
        </div>
        <!-- <Pagefront class="mt20" :page-config="pageConfig" @update="updatePage"></Pagefront> -->
        <Dialog :show="dia_show!==''" :title="dia_title" @close="dia_show=''">
            <div class="dia-inner">
                <div v-if="dia_show==='add_member'">
                    <ul class="form">
                        <li>
                            <span>名称:</span>
                            <Input class="w250" v-model="addForm.name" @keyup="nameCheck" />
                            <span class="err-tips">{{add_err_msg.name}}</span>
                        </li>
                        <li>
                            <span>邮箱:</span>
                            <Input class="w250" v-model="addForm.email" @keyup="emailCheck" />
                            <span class="err-tips">{{add_err_msg.email}}</span>
                        </li>
                        <li>
                            <span>密码:</span>
                            <Input
                                class="w250"
                                type="password"
                                v-model="addForm.pwd"
                                @keyup="pwdCheck"
                            />
                            <span class="err-tips">{{add_err_msg.pwd}}</span>
                        </li>
                        <li>
                            <span>确认密码:</span>
                            <Input class="w250" type="password" v-model="addForm.cfm_pwd" />
                            <span class="err-tips">{{add_err_msg.cfm_pwd}}</span>
                        </li>
                    </ul>
                    <div class="add-member-btn">
                        <button class="btn-plain-large" @click="dia_show=''">取消</button>
                        <button class="btn-blue-large ml20" @click="addMemberCfm">确认</button>
                    </div>
                </div>
                <!-- 修改密码 -->
                <div v-if="dia_show==='edit_pwd'">
                    <ul class="form">
                        <li>
                            <span>密码:</span>
                            <Input
                                class="w250"
                                :autocomplete="'new-password'"
                                type="password"
                                v-model="editForm.pwd"
                            />
                        </li>
                        <li>
                            <span>确认密码:</span>
                            <Input class="w250" type="password" v-model="editForm.cfm_pwd" />
                            <span class="err-tips">{{edit_conf_pwd}}</span>
                        </li>
                    </ul>
                    <div class="add-member-btn">
                        <button class="btn-plain-large" @click="dia_show=''">取消</button>
                        <button class="btn-blue-large ml20" @click="editMemberCfm">确认</button>
                    </div>
                </div>
            </div>
        </Dialog>
        <Modal
            :show.sync="mod_show"
            title="禁用"
            content="确认禁用该成员"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>
    </div>
</template>

<script>
import Pagefront from '../../../commonComponents/PageFront'

export default {
    props: {
        group_id: {
            type: [Number, String]
        }
    },
    components: {
        Pagefront
    },
    data() {
        return {
            // table
            isSearch: false, // 是否是点击搜索按钮的结果(而不是点击查看或者编辑)
            headers: ['名称', '邮箱', '状态', '操作'],
            total_list: [], // 未分页前的所有内容
            list: [],
            // total: 0,
            // pageNo: 1,
            // pageSize: 25,
            // pageNo
            pageConfig: { total: 0, pageSize: 25, pageNo: 1 },
            // 添加 成员
            curr_row: {},
            dia_show: '',
            dia_title: '',

            /* 添加成员 */
            addForm: {
                name: '',
                email: '',
                pwd: '',
                cfm_pwd: ''
            },
            add_err_msg: {
                name: '',
                email: '',
                pwd: '',
                cfm_pwd: ''
            },
            // 修改密码
            editForm: {
                pwd: '',
                cfm_pwd: ''
            },
            edit_conf_pwd: '',
            mod_show: false
        }
    },
    methods: {
        // 给父组件调用此方法
        setList(list, total = 0) {
            this.isSearch = true
            this.list = list
            this.total = total
        },
        // updatePage(val) {
        //     console.log('val: ', val);

        // },
        updatePage(val) {
            let p = (val || this.pageConfig.pageNo) - 1
            let size = this.pageConfig.pageSize

            this.list = this.total_list.slice(p * size, (p + 1) * size)
        },
        getList() {
            let params = {
                id: this.group_id,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let { url, method } = this.$api.admin_group_user_list
            this.$http({ method, url, params }).then(res => {
                // console.log('成语列表呢res: ', res)
                if (res && res.code === '200') {
                    // this.total = res.data.total
                    this.pageConfig.total = res.data.total
                    this.total_list = res.data.data
                    this.updatePage()
                }
            })
        },
        addMember() {
            this.dia_show = 'add_member'
            this.dia_title = '添加成员'
            this.addForm = {
                name: '',
                email: '',
                pwd: ''
                // cfm_pwd: ''
            }
        },
        nameCheck() {
            let val = this.addForm.name
            if (val !== '') {
                this.add_err_msg.name = ''
                return true
            } else {
                this.add_err_msg.name = '不可为空'
                return false
            }
        },
        emailCheck() {
            let regExp = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
            let val = this.addForm.email
            if (val === '') {
                this.add_err_msg.email = 'email不可为空!'
                return false
            }
            if (regExp.test(val)) {
                this.add_err_msg.email = ''
                return true
            } else {
                this.add_err_msg.email = '邮箱格式错误请检查!'
                return false
            }
        },
        pwdCheck() {
            let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
            let val = this.addForm.pwd
            if (val === '') {
                this.add_err_msg.pwd = '密码不可为空!'
                return false
            }
            if (regExp.test(val)) {
                this.add_err_msg.pwd = ''
                return true
            } else {
                this.add_err_msg.pwd = '必须同时包含字母和数字8-16位的组合!'
                return false
            }
        },
        confPwdCheck() {
            let val = this.addForm.cfm_pwd

            if (val !== this.addForm.pwd) {
                // console.log('this.addForm.pwd: ', this.addForm.pwd)
                this.add_err_msg.cfm_pwd = '两次密码不一致!'
                return false
            } else {
                this.add_err_msg.cfm_pwd = ''
                return true
            }
        },
        // 添加成员 确认
        addMemberCfm() {
            if (
                this.nameCheck() &&
                this.emailCheck() &&
                this.pwdCheck() &&
                this.confPwdCheck()
            ) {
                let data = {
                    name: this.addForm.name,
                    email: this.addForm.email,
                    password: this.addForm.pwd,
                    group_id: this.group_id
                }
                let { method, url } = this.$api.admin_user_add
                this.$http({ method, url, data }).then(res => {
                    if (res && res.code === '200') {
                        this.$toast.success(res.message)
                        this.getList()
                        this.dia_show = ''
                    } else {
                        this.$toast.error((res && res.message) || '错误')
                    }
                })
            }
        },
        editPwd(row) {
            this.curr_row = row
            this.dia_title = `修改密码: ${row.name}`
            this.dia_show = 'edit_pwd'
        },
        memberStatusSwitch(row) {
            // let status = row.status
            this.curr_row = row
            // if (status === 1) {
            //     this.mod_title = '禁用'
            //     this.mod_status = 'turnOff'
            //     this.mod_cont = '是否确认禁用该成员!'
            // } else if (status === 0) {
            //     this.mod_status = 'turnOn'
            //     this.mod_title = '启用'
            //     this.mod_cont = '是否确认启用该成员!'
            // }
            // this.mod_show = true
            this.modConf()
        },

        // 检查编辑 密码
        checkEditPwd() {
            let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
            let val = this.editForm.cfm_pwd
            // console.log('val: ', val)
            if (val === '') {
                this.edit_conf_pwd = '内容不能为空!'
                return false
            }
            if (val !== this.editForm.pwd) {
                this.edit_conf_pwd = '确认密码不相同!'
                return false
            }
            if (regExp.test(val)) {
                this.edit_conf_pwd = ''
                return true
            } else {
                this.edit_conf_pwd = '必须同时包含字母和数字8-16位的组合!'
                return false
            }
        },
        // 编辑成员 确认 (即:修改密码)
        editMemberCfm() {
            if (!this.checkEditPwd()) return
            let data = {
                id: this.curr_row.id,
                name: this.curr_row.name,
                password: this.editForm.pwd
            }
            let { method, url } = this.$api.admin_user_other_pwd_set
            this.$http({ method, url, data }).then(res => {
                // console.log('res: ', res)
                if (res && res.code === '200') {
                    res.message && this.$toast.success(res.message)
                    this.dia_show = ''
                    // this.getList()
                } else {
                    res.message && this.$toast.error(res.message)
                }
            })
        },
        // 目前里面只有禁用
        modConf() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status ? 1 : 0
            }

            let { url, method } = this.$api.admin_user_status_set
            this.$http({ method, url, data }).then(res => {
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    // this.mod_show = false
                }
                if (this.isSearch) {
                    this.$emit('search')
                } else {
                    this.getList()
                }
            })
        },
        updateNo() {
            this.getList()
        },
        updateSize() {
            this.pageNo = 1
            this.getList()
        }
    },

    watch: {
        group_id(val) {
            // console.log('val: ', val)
            if (val) {
                this.isSearch = false
                this.getList()
            }
        }
    },
    mounted() {
        this.getList()
    }
}
</script>

<style scoped>
.mb20 {
    margin-bottom: 20px;
}
.show-table .admin-table {
    min-width: 500px;
    min-height: 150px;
}
.form > li {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 20px;
}
.form > li span:first-child {
    width: 70px;
    text-align: right;
    margin-right: 10px;
}
.w250 {
    width: 250px;
}
.add-member-btn {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
.min-w-60 {
    min-width: 60px;
}
.min-w-180 {
    min-width: 180px;
}
.min-w-100 {
    min-width: 100px;
}
.ml20 {
    margin-left: 20px;
}
.err-tips {
    position: absolute;
    top: 30px;
    left: 90px;
    color: red;
}
</style>
