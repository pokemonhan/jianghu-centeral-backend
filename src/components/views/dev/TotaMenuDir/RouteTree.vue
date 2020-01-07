<template>
    <div class="center-box">
        <ul class="lev1">
            <li v-for="(lv1,lv1_idx) in menu" :key="lv1_idx">
                <div class="title">
                    <i :class="['iconfont iconup',lv1.children?'':'hide']" @click="expand(lv1_idx)"></i>
                    <span class="title-cont">{{lv1.label}}</span>
                    <span class="add-router" @click="add">添加路由</span>
                </div>
                <ul v-if="lv1.children" class="lev2" :ref="lv1_idx">
                    <li v-for="(lv2,lv2_idx) in lv1.children" :key="lv2_idx">
                        <div class="title">
                            <i
                                :class="['iconfont iconup',lv2.children?'':'hide']"
                                @click="expand(lv1_idx+'-'+lv2_idx)"
                            ></i>
                            <span class="title-cont">{{lv2.label}}</span>
                            <span class="a" @click="edit(lv2)">编辑</span>
                            <span class="a" @click="del(lv2)">删除</span>
                            <Switchbox class="switch" />
                        </div>
                        <ul v-if="lv2.children" class="lev3" :ref="lv1_idx+'-'+lv2_idx">
                            <li v-for="(lv3, lv3_idx) in lv2.children" :key="lv3_idx">
                                <div class="title">
                                    <i
                                        :class="['iconfont iconup',lv3.children?'':'hide']"
                                        @click="expand(lv1_idx+'-'+lv2_idx+'-'+lv3_idx)"
                                    ></i>
                                    <span>{{lv3.label}}</span>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
        <Dialog :show.sync="dia_show" :title="dia_status==='add'?'添加':'编辑'">
            <div class="dia-inner">
                <div>
                    <ul class="form">
                        <li>
                            <span>选择路由:</span>
                            <Select
                                style="width:550px;margin-top:10px;"
                                v-model="form.route"
                                :options="route_opt"
                            ></Select>
                        </li>
                        <li class="mt20">
                            <span class="mb10">标题</span>
                            <Input style="width:550px" v-model="form.title" />
                        </li>
                    </ul>
                    <div class="center-box mt50">
                        <button class="btn-plain-large" @click="dia_show=false">取消</button>
                        <button class="btn-blue-large ml50">确认</button>
                    </div>
                </div>
            </div>
        </Dialog>

        <Modal
            :show.sync="mod_show"
            title="我是标题"
            content="我是内容"
            @cancel="mod_show=false"
            @confirm="modConf"
        ></Modal>
    </div>
</template> 

<script>
export default {
    props: {
        menu: Array
    },
    data() {
        return {
            // menu: [],
            // dialog
            dia_show: false,
            form: {
                route: '',
                title: ''
            },
            route_opt: [],
            // dia
            dia_status: '',

            // modal 框
            mod_show: false
        }
    },
    methods: {
        // 备用
        toTreeArray(list, pre_idx = '') {
            return list.map((lev1, lev1_idx) => {
          
                let item = {
                    id: pre_idx + lev1_idx,
                    label: lev1.label
                }
                if (lev1.child) {
                    item.children = this.toTreeArray(lev1.child, item.key + '-')
                }

                return item
            })
        },
        add() {
            // this.curr_row = {}
            this.dia_status = 'add'
            this.dia_show = true
        },
        edit(row) {
            this.curr_row = row
            this.dia_status = 'edit'
            this.dia_show = true
        },
        del() {
            // console.log('sdfsdf')
            this.mod_show = true
        },
        expand(index) {
            let ele = this.$refs[index]
            $(ele).slideToggle(200)
        },
        /**
         * 后台数据转成可用tree数组
         * @params {array} list 要转数组
         * @params {string} pre_idx 前缀
         */

        modConf() {},
        getList() {
            let params = {
                type: 0
            }
            let { url, method } = this.$api.menu_date_list
            this.$http({ method, url, params }).then(res => {
                // console.log('理由👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.route_opt = res.data.route_info.map((item, index) => {
                        return { label: item.url, value: index }
                    })
                    // console.log('opt', this.route_opt)
                }
            })
        }
    },
    mounted() {
        this.getList()
        // console.log(this.menu);
    }
}
</script>

<style scoped>
.add-router {
    color: #4c8bfd;
    cursor: pointer;
    margin-left: 20px;
}
.center-box {
    display: flex;
    justify-content: center;
}
.lev1 > li {
    margin-top: 10px;
}

/* .lev1 > li > .title > span { */
/* } */
.lev2 {
    margin-left: 10px;
    font-size: 12px;
    /* text-align: left; */
}
/* .lev2 > li {
} */
.lev2 > li > span {
    display: inline-block;
    margin-top: 6px;
}
.title {
    display: flex;
}
.title .hide {
    opacity: 0;
}
.checkbox-head {
    font-weight: bold;
    font-size: 16px;
}
.lev2 .checkbox {
    /* margin-top: 10px; */
    padding: 5px 0;
}
.iconup {
    margin-right: 5px;
}
.lev3 {
    margin-left: 16px;
}
.lev4 {
    margin-left: 16px;
}
.switch {
    position: relative;
    margin-top: -5px;
    transform: scale(0.5);
}

/* 编辑路由 */
.form > li {
    display: flex;
    align-items: center;
}
.form > li > span:first-child {
    width: 5em;
    text-align: right;
    margin-right: 10px;
}
.dia-inner {
    padding: 0 50px;
}
.mt20 {
    margin-top: 20px;
}
.mb10 {
    margin-bottom: 10px;
}
.mt50 {
    margin-top: 50px;
}
.center-box {
    display: flex;
    justify-content: center;
}
.ml50 {
    margin-left: 50px;
}
</style>