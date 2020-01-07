<template>
    <div class="contain">
        <ul class="level-1">
            <li v-for="(lev1, lev1_index) in menu_list" :key="lev1_index">
                <span
                    :class="['title',$route.path == lev1.path?'active-menu':'']"
                    @click="expandMenu(lev1,lev1_index)"
                >
                    <!-- <span></span> -->
                    <!-- name 改label,child 改child-->
                    <!-- <i :class="['icon-left','iconfont', lev1.icon]"></i> -->
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
            currentMenu: Number,
            menu_list: []
        }
    },
    computed: {
        ...mapState(['tab_nav_list'])
    },
    methods: {
        ...mapMutations(['updatetab_nav_list']),
        expandMenu(item, index) {
            // console.log("TCL: expandMenu -> item", item)
            // console.log("该元素item", item);
            // console.log("这个index", index);
            // console.log("TCL: expandMenu -> 当前", this.currentMenu)
            if (item.path && true) {
                if (this.$route.path !== item.path) {
                    this.$router.push(item.path)
                }

                let list = this.tab_nav_list
                // 导航条没有该页面 就添加进去
                if (this.tab_nav_list.indexOf(item) === -1) {
                    list.push(item)
                    this.updatetab_nav_list(list)
                }

                // 没有 path 就是父级菜单,就下滑打开该菜单
            } else {
                let ele = this.$refs[index]
                item.child && $(ele).slideToggle(200)
            }
            this.currentMenu = index
        },
        objToArr(obj) {
            let list = []
            for (let key in obj) {
                let item = obj[key]
                if (item.child) {
                    item.child = objToArr(item.child)
                }
                list.push(item)
            }
            return list
        }
    },
    watch: {
        $route: function(to, from) {
            if (to.path === '/home') return
            let path = to.path
            // console.log("TCL: path", path);
            /*       1.同一父级,则 退出 2.不同父级,关闭以前,打开跳转的父级菜单 */

            //1.同一父级,则 退出

            //取 path 的父级
            // menu_list = this.menu_list

            /*** TODO: 
             * 
            */
            function getfather(array) {
                array.forEach((item, index) => {
                    // console.log("TCL: getfather -> item", item)
                    if (item.child) {
                        item.child.forEach(i => {
                            if (i.path === to.path) {
                                return item.path
                            }
                        })
                    }
                })
            }
            let father_path = getfather(this.menu_list)
        }
    },
    mounted() {
        // console.log('aside');
        this.menu_list = window.all.menu_list
        const self = this
        // let { method, url, params } = this.$api.all_menu
        // function objToArr(obj) {
        //     let list = [];
        //     for (let key in obj) {
        //         let item = obj[key];
        //         if (item.child) {
        //             item.child = objToArr(item.child);
        //         }
        //         list.push(item);
        //     }
        //     return list;
        // }

        // let opt = {
        //     method,
        //     url,
        //     data: params
        // }
        // this.$http(opt).then(res => {
        //     // console.log(res);
        //     if (res && res.code === '200') {
        //         // self.menu_list = res.data;
        //         function objToArr(obj) {
        //             let list = []
        //             for (let key in obj) {
        //                 let item = obj[key]
        //                 if (item.child) {
        //                     item.child = objToArr(item.child)
        //                 }
        //                 list.push(item)
        //             }
        //             return list
        //         }
        //         // console.log("list-list", objToArr(self.menu_list));
        //     }
        // })
        // 解决刷新时顶部tab_nav都消失的问题, 根据路由加载当前导航.
        setTimeout(() => {
            if (self.tab_nav_list.length === 0) {
                self.menu_list.forEach((item, index) => {
                    if (item.child) {
                        item.child.forEach(item => {
                            if (item.path === self.$route.path) {
                                let list = [item] // 获取当前路由 item {name: name,path:'/***'}
                                self.updatetab_nav_list(list)
                            }
                        })
                    }
                })
            }
        }, 100)
    }
}
</script>

<style scoped>
.contain {
    width: 150px;
    max-height: 92vh;
    box-sizing: border-box;
    background: #fff;
    /* text-align: center; */
    /* border-radius: 6px; */
    cursor: pointer;
    overflow: auto;
    /* border: 1px solid #48f; */
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