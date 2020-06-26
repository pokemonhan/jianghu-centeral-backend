<template>
    <div class="v-tree">
        <div class="tree-left" @click.stop="treeHandle">
            <ul class="lev1">
                <li v-for="(lev1, lev1_idx) in tree_list" :key="lev1_idx">
                    <div class="title">
                        <span
                            v-show="hadChild(lev1)||lev1.checked"
                            :class="[disabled?'sel-item-disabled':'sel-item']"
                            @click.stop
                        >
                            <span>{{lev1.label}}</span>
                            <i
                                class="iconfont iconcuowuguanbi-"
                                @click.stop="tabClose(lev1,lev1_idx)"
                            ></i>
                        </span>
                        <!-- </div> -->
                    </div>

                    <!-- 内容 -->
                    <ul class="lev2" :ref="lev1_idx" v-if="lev1.child">
                        <li v-for="(lev2, lev2_idx) in lev1.child" :key="lev2_idx">
                            <div v-if="lev2.checked" class="title">
                                <div
                                    :class="['dot-line',lev2_idx===lev1.child.length-1?'bottom-dot-line':'center-dot-line']"
                                ></div>
                                <span @click.stop :class="[disabled?'sel-item-disabled':'sel-item']">
                                    <span>{{lev2.label}}</span>
                                    <i
                                        class="iconfont iconcuowuguanbi-"
                                        @click.stop="tabClose(lev2,lev1_idx+'-'+lev2_idx)"
                                    ></i>
                                </span>
                            </div>

                            <ul class="lev3" :ref="lev2_idx" v-if="lev2.child">
                                <li v-for="(lev3, lev3_idx) in lev2.child" :key="lev3_idx">
                                    <span @click.stop :class="[disabled?'sel-item-disabled':'sel-item']">
                                        <span>{{lev3.label}}</span>
                                        <i
                                            class="iconfont iconcuowuguanbi-"
                                            @click.stop="tabClose(lev2,lev1_idx+'-'+lev2_idx+'-'+lev3_idx)"
                                        ></i>
                                    </span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <transition name="tree-slide">
            <div v-if="rightShow" class="tree-right">
                <ul class="lev1">
                    <li v-for="(lev1, lev1_idx) in tree_list" :key="lev1_idx">
                        <div class="title">
                            <span :class="[disabled?'sel-item-disabled':'sel-item']">
                                <!-- <i
                                    :class="['iconfont iconup',lev1.child?'':'hide']"
                                    @click="expand(lev1,lev1_idx)"
                                ></i>-->
                                <Checkbox
                                    v-model="lev1.checked"
                                    :label="lev1.label"
                                    :disabled="disabled"
                                    @update="checkBoxUpd($event, lev1_idx)"
                                />
                            </span>
                            <!-- </div> -->
                        </div>

                        <!-- 内容 -->
                        <ul class="lev2" :ref="lev1_idx" v-if="lev1.child">
                            <li v-for="(lev2, lev2_idx) in lev1.child" :key="lev2_idx">
                                <div class="title">
                                    <div
                                        :class="['dot-line',lev2_idx===lev1.child.length-1?'bottom-dot-line':'center-dot-line']"
                                    ></div>
                                    <span :class="[disabled?'sel-item-disabled':'sel-item']">
                                        <Checkbox
                                            class
                                            v-model="lev2.checked"
                                            :label="lev1.label"
                                            :disabled="disabled"
                                            @update="checkBoxUpd($event, lev1_idx+'-'+lev2_idx)"
                                        />
                                        <!-- <span>{{lev2.label}}</span> -->
                                    </span>
                                </div>

                                <ul class="lev3" :ref="lev2_idx" v-if="lev2.child">
                                    <li v-for="(lev3, lev3_idx) in lev2.child" :key="lev3_idx">
                                        <span :class="[disabled?'sel-item-disabled':'sel-item']">
                                            <span>{{lev3.label}}</span>
                                        </span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>


<script>
import Slide from '../../js/config/slide'
export default {
    props: {
        /** 权限数组 */
        value: {
            type: Array
        },
        disabled: {
            type: Boolean,
            default: false
        },
        menutree: {
            type: Array,
            default: () => []
        },
        rightShow: {
            type: Boolean,
            default: () => false
        }
    },
    model: {
        prop: 'value',
        event: 'update'
    },
    data() {
        return {
            // tree_show: false,
            tagShowList: [],
            tree_list: [],
            // tagShowObj: {}, //id为key ,名字为值,方便展示
            // isUpdateTree: true, //是否需要更新tree 避免wathc重复循环更新
            // rightShow: true
        }
    },
    methods: {
        clickOutSide() {
            this.rightShow = false
        },
        treeHandle() {
            // this.rightShow = !this.rightShow
            this.$emit('update:rightShow',!this.rightShow)
        },
        expand(lev1, index) {
            let ele = this.$refs[index][0]
            Slide.slideToggle(ele)
        },
        hadChild(arr) {
            if (arr && Array.isArray(arr.child)) {
                return arr.child.some(item => item.checked)
            }
            return false
        },
        tabClose(curr_row, idx) {
            if (this.disabled) return
            curr_row.checked = false
            let idx_arr = idx.toString().split('-')
            let list = this.tree_list
            /* 一级 */
            if (idx_arr.length === 1) {
                if (list[idx].child) {
                    list[idx].child.forEach(item => {
                        item.checked = false
                    })
                }
                // curr_row.tabShow = false
                /* 二级  比如:1-1 就是二级*/
            } else if (idx_arr.length === 2) {
                let lev1 = idx_arr[0] || {}
                list[lev1].checked = list[lev1].child.every(
                    item => item.checked
                )
            }
            //  else if (idx_arr.length === 3) {
            //     let lev1 = idx_arr[0]
            //     let lev2 = idx_arr[1]
            //     list[lev2].checked = list[lev2].child.every(
            //         item => item.checked
            //     )
            // }
            // this.$emit('update', this.tree_list)
            this.setTabList()
        },
        checkBoxUpd(bool, idx) {
            let idx_arr = idx.toString().split('-')
            let list = this.tree_list
            /* 一级 */
            if (idx_arr.length === 1) {
                if (list[idx].child) {
                    list[idx].child.forEach(item => {
                        item.checked = bool
                    })
                }
                /* 二级  比如:1-1 就是二级*/
            } else if (idx_arr.length === 2) {
                let lev1 = idx_arr[0]
                list[lev1].checked = list[lev1].child.every(item => {
                    return item.checked
                })
            } else if (idx_arr.length === 3) {
                let lev1 = idx_arr[0]
                let lev2 = idx_arr[1]
                list[lev2].checked = list[lev2].child.every(
                    item => item.checked
                )
            }
            // this.list = this.list.map(item=>item)
            this.$emit('change', bool, idx, this.tree_list)
            this.setTabList()
        },

        /**
         * @description 根据选中的数组 展示勾选 tree中此项
         * @param {Array} arr 选中的id数组
         */
        treeSelectShow() {
            let authority_arr = this.tagShowList
            // id 是否在选择项数组中
            let isSelect = function(id) {
                return authority_arr.indexOf(id) !== -1
            }

            function listSetCheked(arr, lev) {
                let list = arr.map(item => {
                    // 一级菜单
                    if (lev === 1 && item.child) {
                        listSetCheked(item.child)
                        item.checked = item.child.every(i => i.checked)
                    } else {
                        item.checked = isSelect(item.id, lev + 1)
                    }
                    return item
                })
                return list
            }

            this.tree_list = listSetCheked(this.tree_list, 1)
        },
        // 返回已选中权限数组 （有[x]的tab框子）
        setTabList() {
            let tabShowList = []
            function getCheckedArr(arr) {
                arr.forEach(item => {
                    if (!item.child) {
                        // 没有子项，就是路由,当选中，放入 tabShowList中，方便展示
                        item.checked && tabShowList.push(item.id)
                    } else {
                        item.child && getCheckedArr(item.child)
                    }
                })
            }
            getCheckedArr(this.tree_list)
            this.isShow = false
            this.$emit('update', tabShowList)
            // return tabShowList
        }
    },
    watch: {
        value(val) {
            this.tagShowList = this.value.slice()
            // if (this.isUpdateTree) {
                this.treeSelectShow(val)
            // } else {
            //     this.isUpdateTree = true
            // }
        },
        menutree(list) {
            this.tree_list = list
            this.treeSelectShow(this.value)
        }
    },
    created() {
        this.tree_list = this.menutree
        // console.log('🍆 this.tree_list: ', this.tree_list)
        this.tagShowList = this.value.slice()
        this.treeSelectShow(this.tagShowList)
    },
    mounted() {}
}
</script>

<style scoped>
.tree-slide-leave-active,
.tree-slide-enter-active {
    transition: all 0.3s;
}

.tree-slide-enter,
.tree-slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
.v-tree {
    display: flex;
    position: relative;
    width: 100%;
    min-height: 165px;
    padding: 0 10px 10px 10px;
    user-select: none;
}
.tree-left,
.tree-right {
    width: 50%;
    padding-left: 20px;
    border: 1px solid #d9ecff;
    border-radius: 5px;
}
/* .tree-right {
} */
.iconfont {
    position: relative;
    /* z-index: 10; */
    /* background: #fff; */
}
/* .lev1 .title {
    cursor: pointer;
} */
/* .lev1 > li {
    margin-top: 10px;
} */

.lev1 > li > .title > span {
    font-weight: 600;
}
.lev2 {
    margin-left: 30px;
    font-size: 12px;
    /* text-align: left; */
}
/* .lev2 > li{
    } */
.lev2 > li > span {
    display: inline-block;
    margin-top: 6px;
}
.title {
    display: flex;
    /* border-left: 1px dotted #999; */
}
.title .hide {
    opacity: 0;
}
.dot-line {
    position: relative;
    top: 5px;
    width: 18px;
    height: 30px;
    margin-right: 5px;
    transform: scale(1.2);
    background: url('../../assets/image/tree.png') 0 0 repeat-y;
    /* background-position: -56px -15px; */
}
.center-dot-line {
    background-position: -56px -15px;
}
.bottom-dot-line {
    background-position: -56px -33px;
}
.checkbox-head {
    font-weight: bold;
    font-size: 16px;
}
/* .lev2 .checkbox {
    padding: 5px 0;
} */
/* .show-selected {
    width: 100%;
    min-height: 165px;
    border: 1px solid #d9ecff;
    padding: 0 10px 10px 0;
    border-radius: 5px;
} */
.sel-item-disabled {
    display: flex;
    height: 27px;
    line-height: 25px;
    margin-top: 5px;
    margin-bottom: 5px;
    /* padding: 3px 10px; */
    padding-left: 10px;
    padding-right: 10px;
    font-size: 14px;
    color: #8ba1b8;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    background-color: #ecf5ff;
}
.sel-item {
    display: flex;
    /* margin-left: 10px; */
    margin-top: 5px;
    margin-bottom: 5px;
    /* padding: 3px 10px; */
    height: 27px;
    line-height: 25px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 14px;
    color: #409eff;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    background-color: #ecf5ff;
}
.iconcuowuguanbi- {
    display: inline-block;
    width: 12px;
    /* height: 1.5; */
    line-height: 25px;
    margin-left: 2px;
    cursor: pointer;
}
.sel-item-disabled .iconcuowuguanbi-:hover {
    cursor: not-allowed;
}
.sel-item .iconcuowuguanbi-:hover {
    color: red;
}
/* 选择组 下拉list */
.drop-list {
    margin-top: 10px;
    padding-top: 10px;
    padding-left: 50px;
    border: 1px solid #d9ecff;
    border-radius: 4px;
}
</style>
