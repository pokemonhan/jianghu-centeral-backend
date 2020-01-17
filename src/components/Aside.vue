<template>
    <div class="contain">
        <ul class="level-1">
            <li v-for="(lev1, lev1_index) in menu_list" :key="lev1_index">
                <span
                    :class="['title',$route.path == lev1.path&&(!lev1.child)?'active-menu':'']"
                    @click="expandMenu(lev1,lev1_index)"
                >
                    <span class="title-name">{{lev1.label}}</span>
                    <span v-if="lev1.child" class="iconfont iconup right"></span>
                </span>
                <!-- 二级菜单 -->
                <ul :ref="lev1_index" class="level2">
                    <li v-for="(lev2, lev2_index) in lev1.child" :key="lev2_index">
                        <!-- 标题 -->
                        <span
                            :class="['title',$route.path == lev2.path?'active-menu':'']"
                            @click="expandMenu(lev2, lev2_index)"
                        >
                            <!-- <i :class="['iconfont', i.icon]"></i> -->
                            <span>{{lev2.label}}</span>
                            <span v-if="lev2.child" class="iconfont iconup right"></span>
                        </span>

                        <!-- ---------    三级菜单 ------------------------->
                        <ul :ref="lev2_index" class="level3">
                            <li v-for="(lev3, lev3_index) in lev2.child" :key="lev3_index">
                                <span
                                    :class="['title',$route.path == lev3.path?'active-menu':'']"
                                    @click="expandMenu(lev3, lev3_index)"
                                >
                                    <!-- <i :class="['iconfont', i.icon]"></i> -->
                                    <span>{{lev3.label}}</span>
                                    <span v-if="lev3.child" class="iconfont iconup right"></span>
                                </span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
    data() {
        return {
            menu_list: [],
            chain: [] // 父子级关系，格式[0,2,3]// 第0下标个的第二个子级
        }
    },
    computed: {
        ...mapState(['tab_nav_list'])
    },
    methods: {
        ...mapMutations(['updatetab_nav_list']),
        expandMenu(item, index) {
            // console.log("该元素item", item);
            // console.log("这个index", index);
            if (!item.child) {
                this.$router.push(item.path)

                let list = this.tab_nav_list
                // 导航条没有该页面 就添加进去
                let isHadTab = list.find(tab => tab.path === item.path)
                if (!isHadTab) {
                    list.push({
                        label: item.label,
                        path: item.path
                    })
                    this.updatetab_nav_list(list)
                }

                // 没有 child 就是父级菜单,就下滑打开该菜单
            } else {
                let ele = this.$refs[index]
                $(ele).slideToggle(200)
            }
        },
        objToArr(obj) {
            let list = []
            for (let key in obj) {
                let item = obj[key]

                if (item.child) {
                    item.child = this.objToArr(item.child)
                }
                list.push(item)
            }
            return list
        },
        // 获取当前路由的父级或祖先级
        getFather() {
            let curr_path = this.$route.path
            let menu = this.menu_list
            if (!menu) return
            // console.log('menu: ', menu);
            // 获取父子级关系 如 1-1-1
            let chain_temp = ''
            let getPreChain = function(arr, pre_fix = '') {
                arr.forEach((item, index) => {

                    if (item.child) {
                        let pre = pre_fix!=='' ? pre_fix + '-' + index : index
                        getPreChain(item.child, pre)

                    } else {
                        if (item.path === curr_path) {
                            pre_fix = pre_fix!=='' ? pre_fix + '-' + index : index
                            chain_temp = pre_fix
                        }
                    }
                })
            }
            getPreChain(menu)
            // this.chain = (chain_temp||[]).split('-')
            // console.log('menu: ', menu)
            // console.log('锁链', this.chain)
        }
    },
    watch: {
        $route: function(to, from) {
            // if (to.path === '/home') return
            // console.log("TCL: path", path);
            /*       1.同一父级,则 退出 2.不同父级,关闭以前,打开跳转的父级菜单 */

            //1.同一父级,则 退出

            //取 path 的父级
            // menu_list = this.menu_list

            /*** TODO:
             *
             */
            // 当前没有菜单就 localStorage找
            if (!this.menu_list) {
                let menu = window.all.tool.getLocal('menu')
                if (menu) {
                    this.menu_list = menu
                }
            } else {
                this.getFather()
            }
        }
    },
    mounted() {
        // console.log('aside');
        // this.menu_list = window.all.menu_list
        // const self = this
        // this.getList()
        this.menu_list = window.all.tool.getLocal('menu')
        this.menu_list && this.getFather()
        // console.log()
    }
}
</script>

<style scoped>
.contain {
    width: 150px;
    max-height: 92vh;
    box-sizing: border-box;
    background: #fff;
    border-top: 2px solid #4c8bfd;
    cursor: pointer;
    overflow: auto;
    user-select: none;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
}
.contain::-webkit-scrollbar {
    width: 3px;
    color: #48f;
}
.contain::-webkit-scrollbar-thumb {
    background: #d3e0f8;
}
/* 一级菜单 */
.level-1 > li > .title {
    display: inline-block;
    padding: 10px 0;
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    /* color: rgb(63, 62, 62); */
}
/* 二级菜单 */
/* .level2 {
} */
.level2 > li > .title {
    display: inline-block;
    /* display:none; */
    padding: 8px 10px;
    padding-left: 20px;
    width: 100%;
    font-size: 14px;
    /* font-weight: 600; */
    /* border: 1px solid #000; */
}
.level3 > li .title {
    display: inline-block;
    padding: 8px 10px;
    padding-left: 60px;
    font-size: 15px;
}
li .title:hover {
    width: 100%;
    background: #6791df;
    color: #fff;
}
.active-menu {
    background: #4c8bfd;
    color: #fff;
}
/* .contain > ul > li {
  
} */
.right {
    float: right;
    margin-right: 8px;
    margin-top: 4px;
}
.title-name {
    margin-left: 16px;
}
.icon-left {
    margin-left: 21px;
}
</style>