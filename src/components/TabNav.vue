<template>
    <div class="tab-nav" v-if="$route.path!=='/home'">
        <ul>
            <!-- 展示当前路由tab -->
            <li v-if="other_nav.length!==0" :class="['active-tab-nav',current_close?'need-close':'']">
                <span class="title">{{current_item?current_item.label:''}}</span>
                <span class="close" @click="currClose()">X</span>
            </li>
            <!-- 其他已点开路由 -->
            <li
                v-for="(item, index) in other_nav"
                :key="item.path"
                :class="[item.path===$route.path?'active-tab-nav':'bg-gray',need_close===index?'need-close':'']"
            >
                <span class="title" @click="jumpRouter(item)">{{item.label}}</span>
                <span class="close" @click="close(item,index)">X</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data() {
        return {
            menu_list: [],
            current_close: false,
            need_close: -1
        }
    },
    computed: {
        ...mapState(['tab_nav_list']),
        other_nav() {
            let length = this.tab_nav_list.length
            // 不在这里展示当前,因为展示到第一位
            let list = this.tab_nav_list.filter(
                item => item.path !== this.$route.path
            )

            if (length > 7) {
                list = list.slice(length - 7, length)

                // 然后放到第一位
                return list
            } else {
                return list
            }
            // return list
        },
        current_item() {
            let tabList = this.tab_nav_list
            let list = tabList.filter(item => {
                return item.path === this.$route.path
            })[0]
            return list
        }
    },
    methods: {
        ...mapMutations(['updatetab_nav_list']),
        jumpRouter(item) {
            // 非当前则跳转
            if (item.path !== this.$route.path) {
                this.$router.push(item.path)
            }
        },
        currClose() {
            if (this.tab_nav_list.length < 2) return
            let current_item = this.current_item
            // 去除当前
            this.current_close = true
            let self = this
            // 200毫秒执行关闭动画后,关闭跳转
            setTimeout(() => {
                let list = this.tab_nav_list.filter(
                    item => item.path !== current_item.path
                )
                self.updatetab_nav_list(list)
                let last_index = self.tab_nav_list.length - 1
                self.$router.push(self.tab_nav_list[last_index].path)
                this.current_close = false
            }, 200)
        },
        close(tab, index) {
            // 长度为1,或者0 ,跳出
            if (this.tab_nav_list.length < 2) return
            this.need_close = index //设置需要马上关闭的 index
            let self = this
            setTimeout(() => {
                // 把当前tab 从中去除
                let list = self.tab_nav_list.filter(
                    item => item.path !== tab.path
                )
                self.updatetab_nav_list(list)
                self.need_close = -1
            }, 200)

            // 如果关闭当前,跳转到最后一个tab
            // if (this.$route.path === tab.path) {
            //     let last_index = this.tab_nav_list.length - 2
            //     this.$router.push(this.tab_nav_list[last_index].path)
            // }
        }
    },
    watch: {
        tab_nav_list(val) {}
    },
    mounted() {
        this.menu_list = window.all.menu_list
    }
}
</script>

<style scoped>
.tab-nav {
    width: 100%;
    max-width: 1000px;
    overflow: auto;
}

.tab-nav ul {
    width: 100%;
    display: flex;
    font-size: 14px;
    font-weight: 600;
    color: #444;
}

.tab-nav ul > li:hover {
    cursor: pointer;
}
.tab-nav ul > li {
    position: relative;
    height: 28px;
    line-height: 28px;
    width: 130px;
    background: #fff;
    margin-left: 5px;
    padding-left: 6px;
    /* border-top-left-radius: 5px;
    border-top-right-radius: 5px; */
    background: #e7e8e9;
    /* padding: 4px 20px 4px 8px; */
}
.tab-nav ul > li:first-child {
    margin-left: 0;
}
.tab-nav ul li .title {
    display: inline-block;
    width: 100px;
}
.tab-nav ul > li:hover {
    background: #5c88db;
    color: #fff;
}
.close {
    /* float: right; */
    /* display: inline-block; */
    height: 23px;
    width: 23px;
    position: absolute;
    right: 3px;
    top: 3px;
    padding: 2px 2px 2px 7px;
    /* border: 1px solid #000; */
    /* background: rgb(241, 241, 241); */
    border-radius: 50%;
    line-height: 17px;
    /* background: #000; */
    /* margin-right: -5px; */
}
.close:hover {
    /* color: rgb(241, 72, 50); */
    background: rgb(59, 118, 187);
    transform: scale(1.2);
}
.bg-gray {
    color: rgb(133, 133, 133);
    background: rgba(255, 255, 255, 0);
}
/* 激活的样式 */
.tab-nav ul .active-tab-nav {
    /* color: rgb(0, 128, 255);
    background-color: rgba(255, 255, 255, 0.8); */
    background: #4c8bfd;
    color: #fff;
}
.need-close {
    transform: scale(0.2);
    opacity: 0.2;
    transition: all 0.2s;
}
</style>
