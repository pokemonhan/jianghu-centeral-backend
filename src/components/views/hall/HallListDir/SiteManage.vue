<template>
    <div class="cont">
        <div class="body">
            <div class="left">
                <ul style="margin-top:-13px;" class="form">
                    <li>
                        <span>代理方式:</span>
                        <Checkbox label="PC" v-model="checked[0]" />
                        <Checkbox label="H5" v-model="checked[1]" />
                        <Checkbox label="APP" v-model="checked[2]" />
                    </li>
                    <li>
                        <span>有效日期:</span>
                        <div class="text-center">
                            <Date type="datetime" v-model="dates[0]" />
                            <span>~</span>
                            <Date type="datetime" v-model="dates[1]" />
                        </div>
                    </li>
                </ul>
            </div>
            <div class="right">
                <ul class="skin">
                    <li>
                        <span class="skin-pc">PC皮肤:</span>
                        <Select v-model="skin_pc" :options="skin_pc_opt"></Select>
                    </li>
                    <li>
                        <span>H5皮肤:</span>
                        <Select v-model="skin_h5" :options="skin_h5_opt"></Select>
                    </li>
                    <li>
                        <span>APP皮肤:</span>
                        <Select v-model="skin_app" :options="skin_app_opt"></Select>
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
                        <Input class="w280" v-model="authority" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="btns">
            <button class="btn-plain-large">重置</button>
            <button class="btn-blue-large ml50">保存</button>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        id: String
    },
    data() {
        return {
            show_black_list_conf:true,
            checked: [],
            dates: [],
            skin_pc: 0,
            skin_h5: 0,
            skin_app: 0,
            skin_pc_opt: [
                { label: '默认皮肤', value: 0 },
                { label: '皮肤一', value: 1 },
                { label: '皮肤二', value: 2 },
                { label: '皮肤三', value: 3 },
            ],
            skin_h5_opt: [
                { label: '默认皮肤', value: 0 },
                { label: '皮肤一', value: 1 },
                { label: '皮肤二', value: 2 },
                { label: '皮肤三', value: 3 },
            ],
            skin_app_opt: [
                { label: '默认皮肤', value: 0 },
                { label: '皮肤一', value: 1 },
                { label: '皮肤二', value: 2 },
                { label: '皮肤三', value: 3 },
            ],
            sms: '',
            authority: ''
        }
    },
    methods: {},
    mounted() {
        // console.log('%c id','color:green;font-size:18px;',this.id)
    }
}
</script>

<style scoped>
.cont{
    width: 1000px;
    padding: 50px 0;
}
.body {
    display: flex;
}
.form > li {
    display: flex;
    align-items: baseline;
    margin-top: 20px;
    /* border: 1px solid #000; */
}
.form > li > span:first-child {
    width: 7em;
    margin-right: 15px;
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
.skin li:not(:first-child) > span:first-child{
    margin-right: 10px;
}
.w280 {
    width: 280px;
}

</style>
