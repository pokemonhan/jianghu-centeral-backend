<template>
    <div class="center-box">
        <ul class="lev1">
            <li v-for="(lv1,lv1_idx) in menu" :key="lv1_idx">
                <div class="title">
                    <i
                        :class="['iconfont iconup',lv1.children?'':'hide']"
                        @click="expand(lv1_idx)"
                    ></i>
                    <span class="title-cont">{{lv1.label}}</span>
                    <span class="add-router">添加路由</span>
                </div>
                <ul v-if="lv1.children" class="lev2" :ref="lv1_idx">
                    <li v-for="(lv2,lv2_idx) in lv1.children" :key="lv2_idx">
                        <div class="title">
                            <i
                                :class="['iconfont iconup',lv2.children?'':'hide']"
                                @click="expand(lv1_idx+'-'+lv2_idx)"
                            ></i>
                            <span class="title-cont">{{lv2.label}}</span>
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
        }
    },
    methods: {
        expand(index) {
            let ele = this.$refs[index]
            $(ele).slideToggle(200)
        },
        /**
         * 转成可用tree数组
         * @params {array} list 要转数组
         * @params {string} pre_idx 前缀
         */
        toTreeArray(list, pre_idx = '') {
            return list.map((lev1, lev1_idx) => {
                let item = {}
                item.id = pre_idx + lev1_idx
                item.label = lev1.label

                if (lev1.child) {
                    item.children = this.toTreeArray(lev1.child, item.key + '-')
                }

                return item
            })
        }
    },
    mounted() {
        // let menu = window.all.menu_list.slice()
        // this.menu = this.toTreeArray(menu)
        console.log(this.menu);
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
</style>