<template>
    <div class="cont">
        <!-- 厅主列表 - 站点管理 -->

        <div class="body">
            <div class="left">
                <ul style="margin-top:-13px;" class="form">
                    <li>
                        <span>代理方式?:</span>
                        <Checkbox label="PC" v-model="agency_method[0]" />
                        <Checkbox label="H5" v-model="agency_method[1]" />
                        <Checkbox label="APP" v-model="agency_method[2]" />
                        <p v-show="!agency_method.find(item=>item)" class="err-tips">至少选择一个!</p>
                    </li>

                    <li>
                        <span>有效日期:</span>
                        <div class="text-center">
                            <Date type="datetime" v-model="dates[0]" />
                            <span>~</span>
                            <Date type="datetime" v-model="dates[1]" />
                            <p v-show="!(dates[0]&&dates[1])" class="red mt5">开始时间和结束都不可为空!</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="right">
                <ul class="skin">
                    <li>
                        <span class="skin-pc">PC皮肤:</span>
                        <Select v-model="pc_skin_id" :options="pc_skin_opt"></Select>
                    </li>
                    <li>
                        <span>H5皮肤:</span>
                        <Select v-model="h5_skin_id" :options="skin_h5_opt"></Select>
                    </li>
                    <li>
                        <span>APP皮肤:</span>
                        <Select v-model="app_skin_id" :options="skin_app_opt"></Select>
                    </li>
                </ul>
                <ul class="form">
                    <li>
                        <span>修改短信数量:</span>
                        <Input class="w280" limit="p-integer" v-model="sms" />
                        <span class="ml20">剩余短信数量: {{'1000'}}</span>
                    </li>
                    <li>
                        <span>权限选项:</span>
                        <!-- <div>x</div> -->
                        <!-- <Input class="w280" v-model="authority" /> -->
                        <AuthorityTree
                            style="width:500px;"
                            :menutree="tree_list"
                            v-model="role"
                            @update="treeListUpd"
                        />
                    </li>
                </ul>
            </div>
        </div>
        <div class="btns">
            <button class="btn-plain-large" @click="initial">重置</button>
            <button class="btn-blue-large ml50" @click="save">保存</button>
        </div>
    </div>
</template>


<script>
import AuthorityTree from '../../../commonComponents/AuthorityTree'
export default {
    props: {
        id: [String, Number],
        tree_list: Array
    },
    components: {
        AuthorityTree: AuthorityTree
    },
    data() {
        return {
            show_black_list_conf: true,
            agency_method: [],
            dates: [],
            pc_skin_id: 0,
            h5_skin_id: 0,
            app_skin_id: 0,
            pc_skin_opt: [
                { label: '默认皮肤', value: 0 },
                { label: '皮肤一', value: 1 },
                { label: '皮肤二', value: 2 },
                { label: '皮肤三', value: 3 }
            ],
            skin_h5_opt: [
                { label: '默认皮肤', value: 0 },
                { label: '皮肤一', value: 1 },
                { label: '皮肤二', value: 2 },
                { label: '皮肤三', value: 3 }
            ],
            skin_app_opt: [
                { label: '默认皮肤', value: 0 },
                { label: '皮肤一', value: 1 },
                { label: '皮肤二', value: 2 },
                { label: '皮肤三', value: 3 }
            ],
            sms: '',
            authority: '',
            // authorityList: []
            role: [] // 权限内容
        }
    },
    methods: {
        treeListUpd() {},
        initial() {
            this.agency_method = []
            this.dates = []
            this.pc_skin_id = ''
            this.h5_skin_id = ''
            this.app_skin_id = ''
            this.sms = ''
            this.role = []
        },
        checkForm() {
            return true
        },
        save() {
            if(!this.checkForm()) return
            function getAgencyMethod(arr) {
                let agencyArr = []
                arr.forEach((item,index)=>{
                    item && agencyArr.push(index+1)
                })
                if(agencyArr.length){
                    return JSON.stringify(agencyArr)
                }else {
                    return ''
                }
            }
            let data = {
                // id: this.id,
                // agency_method: agency_method.join(','),
                // role: '',

                id: this.id, //id
                agency_method: getAgencyMethod(this.agency_method), // 代理方式
                start_time: this.dates[0], // 有效日期 开始时间
                end_time: this.dates[1], // 有效日期 结束时间

                pc_skin_id: this.pc_skin_id, // PC皮肤id
                h5_skin_id: this.h5_skin_id, // H5皮肤ID
                app_skin_id: this.app_skin_id, // APP皮肤ID
                //  TODO: 短信数量 字段添加
                role: JSON.stringify(this.role) // 菜单权限
            }

            let { url, method } = this.$api.site_manage_set
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res && res.message)
                    this.dia_show = false
                    // this.getList()
                    // this.$emit('confirm')
                }
            })
        }
    },
    mounted() {
        console.log('%c id', 'color:green;font-size:18px;', this.id)
    }
}
</script>

<style scoped>
.cont {
    width: 1000px;
    padding-top: 50px;
    padding-bottom: 90px;
}
.body {
    display: flex;
}
.form > li {
    display: flex;
    position: relative;
    min-height: 32px;
    margin-top: 20px;
}
.form > li > span:first-child {
    width: 7em;
    margin-right: 15px;
}
.mt5 {
    margin-top: 5px;
}
.err-tips {
    position: absolute;
    left: 10em;
    top: 32px;
    color: rgb(255, 17, 0);
    /* font-size: 12px; */
}
.transparent {
    opacity: 0;
    border: 1px solid #000;
}
.ml20 {
    margin-left: 20px;
}
.text-center {
    text-align: center;
}
.btns {
    margin-top: 50px;
    text-align: center;
}
.ml50 {
    margin-left: 50px;
}
.right {
    margin-left: 100px;
}
.skin {
    display: flex;
}
.skin > li {
    display: flex;
    align-items: center;
    margin-right: 20px;
}
.skin .skin-pc {
    margin-right: 25px;
}
.skin li:not(:first-child) > span:first-child {
    margin-right: 10px;
}
.w280 {
    width: 280px;
}
</style>
