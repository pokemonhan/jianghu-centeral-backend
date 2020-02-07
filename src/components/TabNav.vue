<template>
    <div class="tab-nav" v-if="$route.path!=='/home' && tab_nav_list.length>0" ref="tabNav">
        <button class="btn-arrow" @click="scrollLeft">
            <i class="iconfont iconzuofanyezuohua"></i>
        </button>
        <ul class="ul" ref="ul">
            <li
                :class="[item.path===$route.path?'active-tab-nav':'bg-gray',need_close===index?'need-close':'']"
                v-for="(item, index) in tab_nav_list"
                :key="item.path"
                :ref="item.path"
                :title="item.label"
                @contextmenu.prevent="contextmenu($event,item)"
            >
                <span class="title" @click="jumpRouter(item)">{{item.label}}</span>
                <span class="close" @click="closeCurrent(item,index)">X</span>
            </li>
        </ul>
        <button class="btn-arrow" @click="scrollRight">
            <i class="iconfont iconyoufanyeyouhua"></i>
        </button>
        <!-- TODO: -->
        <!-- <context-menu
            class="right-menu"
            :target="contextMenuTarget"
            :show="contextMenuVisible"
            @update:show="(show) => contextMenuVisible = show"
        >
           <span>一</span>
           <span>二</span>
           <span>三</span>
        </context-menu>-->
        <div v-show="menu_show" class="context-menu" ref="menu" v-clickoutside="closeMenu">
            <div @click="menuClose('other')">关闭其他菜单</div>
            <div @click="menuClose('all')">关闭所有菜单</div>
            <div @click="menuClose('current')">关闭该菜单</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
// import { component as VueContextMenu } from '@xunlei/vue-context-menu'

export default {
    // components: {
    //     'context-menu': VueContextMenu
    // },
    data() {
        return {
            // menu_list: [],
            current_close: false,
            need_close: -1,

            menu_show: false,
            curr_tab: {}
            // context_menu 右键菜单
            // contextMenuTarget: this.$refs.tabNav,
            // contextMenuVisible: false
        }
    },
    computed: {
        ...mapState(['tab_nav_list'])

        // current_item() {
        //     let tabList = this.tab_nav_list
        //     let list = tabList.filter(item => {
        //         return item.path === this.$route.path
        //     })[0]
        //     return list
        // }
    },
    methods: {
        ...mapMutations(['updatetab_nav_list']),
        scrollLeft() {
            let ul = this.$refs.ul
            if (!ul) return
            let width = ul.offsetWidth - 150
            ul.scrollBy({ top: 0, left: 0 - width, behavior: 'smooth' })
        },
        scrollRight() {
            let ul = this.$refs.ul
            if (!ul) return
            let width = ul.offsetWidth - 150
            ul.scrollBy({ top: 0, left: width, behavior: 'smooth' })
        },
        jumpRouter(item) {
            // 非当前则跳转
            if (item.path !== this.$route.path) {
                this.$router.push(item.path)
            }
        },
        contextmenu(e, row) {
            this.curr_tab = row
            let left = e.clientX
            let top = e.clientY + 20
            // this.$refs.menu
            let menuDom = this.$refs.menu
            menuDom.style.left = left + 'px'
            menuDom.style.top = top + 'px'
            this.menu_show = true
        },
        menuClose(val) {
            if (val === 'other') {
                let list = this.tab_nav_list.filter(
                    item => item.path === this.curr_tab.path
                )
                this.updatetab_nav_list(list)
                this.$router.push(this.curr_tab.path)
            }
            if (val === 'all') {
                let list = []
                this.updatetab_nav_list(list)
            }
            if (val === 'current') {
                let list = this.tab_nav_list.filter(
                    item => item.path !== this.curr_tab.path
                )
                this.updatetab_nav_list(list)

                // 如果关闭当前,跳转到最后一个tab
                if (this.tab_nav_list.length > 1) {
                    if (this.$route.path === this.curr_tab.path) {
                        let last_index = this.tab_nav_list.length - 1
                        this.$router.push(this.tab_nav_list[last_index].path)
                    }
                }
            }
            this.menu_show = false
        },
        closeCurrent(tab, index) {
            // 长度为1,或者0 ,跳出
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
            if (this.tab_nav_list.length < 2) return

            // 如果关闭当前,跳转到最后一个tab
            if (this.$route.path === tab.path) {
                let last_index = this.tab_nav_list.length - 2
                this.$router.push(this.tab_nav_list[last_index].path)
            }
        },
        // 根据当前路由 自动滚动
        autoScroll(route) {
            if (this.tab_nav_list.length < 2) return
            let path = route.fullPath
            let ul = this.$refs.ul
            if(!ul) return
            let parent_left = ul.offsetLeft
            let curr_li = this.$refs[path] && this.$refs[path][0]
            let left = curr_li && curr_li.offsetLeft
            ul.scrollTo({
                top: 0,
                left: left - parent_left,
                behavior: 'smooth'
            })
        },
        closeMenu() {
            this.menu_show = false
        }
    },
    watch: {
        $route(route) {
            this.autoScroll(route)
        }
    },
    mounted() {
        // this.menu_list = window.all.menu_list
        // 解决ie scrollTo 兼容
        if (!document.body.scrollTo) {
            Element.prototype.scrollTo = function(obj) {
                this.scrollLeft = obj.left
                this.scrollTop = obj.top
            }
        }
        // 解决ie scrollBy 兼容
        if (!document.body.scrollBy) {
            Element.prototype.scrollBy = function(obj) {
                this.scrollLeft += obj.left
                this.scrollTop += obj.top
            }
        }
        

    }
}
</script>

<style scoped>

.tab-nav {
    width: 100%;
    max-width: 100%;
    overflow: auto;
    display: flex;
}
.btn-arrow {
    height: 28px;
    padding: 0 8px;
    color: #4c8bfd;
    border: 1px solid #4c8bfd;
    background: #fff;
    box-shadow: none;
}
.btn-arrow:active {
    color: #0dbb24;
}
.iconfont {
    font-size: 24px;
}
.tab-nav ul {
    width: 100%;
    display: flex;
    font-size: 14px;
    font-weight: 600;
    color: #444;
    overflow: auto;
}

.tab-nav ul > li {
    position: relative;
    min-width: 140px;
    width: 140px;
    /* border: 1px solid #000; */
    height: 28px;
    line-height: 28px;
    margin-left: 5px;
    padding-left: 6px;
    background: #fff;
    font-size: 13px;
    cursor: pointer;
}
.tab-nav ul > li:first-child {
    margin-left: 0;
}
.tab-nav ul li .title {
    display: inline-block;
    width: 100px;
}
.tab-nav ul > li:hover {
    background: #679cff;
    color: #fff;
}
.close {
    position: absolute;
    top: 6px;
    right: 5px;
    display: inline-block;
    height: 16px;
    line-height: 16px;
    width: 16px;
    font-size: 12px;
    text-align: center;
    /* margin-right: 2px; */
    color: rgb(158, 158, 158);
    border-radius: 50%;
    background: #fff;
}
.close:hover {
    color: rgb(248, 111, 93);
    background: rgba(255, 255, 255, 0.808);
    transform: scale(1.1);
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
    box-shadow: 0 0 6px rgb(124, 124, 124);
    transition: box-shadow 0.3s ease-in-out;
}
.need-close {
    transform: scale(0.2);
    opacity: 0.2;
    transition: all 0.2s;
}

.context-menu {
    position: fixed;
    z-index: 10;
    /* display: flex; */
    top: 120px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.39);
}

.context-menu > div {
    padding: 4px 8px;
}
.context-menu > div:hover {
    color: #fff;
    background: #4c8bfd;
}

/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    /* width:6px; */
    height: 6px;
    border-radius: 3px;
    background-color: #fff;
}
/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
    /* box-shadow:inset 0 0 6px rgba(48, 100, 241, 0.3); */
    border-radius: 3px;
    background-color: rgb(228, 233, 238);
}
.tab-nav .btn-plain {
    height: 28px;
}
</style>
