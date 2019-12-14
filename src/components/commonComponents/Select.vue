<template>
    <div class="v-select" :style="css" v-clickoutside="closeSections" ref="v-select">
        <div
            :class="['val-box', isShow ? 'val-box-active' : '']"
            @click.stop="showOptions"
            @mouseover="updateClearState(true)"
            @mouseout="updateClearState(false)"
        >
            <input v-model="selectedValue" type="hidden" />
            <span>{{selectedLabel}}</span>
            <i v-if="clearable && isClear" @click.stop="clear" class="iconfont icon-icon-test"></i>
            <span v-else :class="['drop-down', '', isShow ? 'icon-rotate' : '']"></span>
        </div>
        <ul :class="['sections', sectionsDir]" ref="sections">
            <li
                v-for="(item, index) in options"
                :key="index"
                :class="[selectedValue===item.value ? 'active' : '']"
                @click="select(item)"
            >{{item.label}}</li>
        </ul>
    </div>
</template>

<script>
/* 
        evnet
            update: 数据改变触发 返回(value, item)

        可绑定 v-model
     */
export default {
    name: 'Select',
    props: {
        options: {
            // 可选选项
            type: Array,
            default: () => []
        },
        css: Object, // 自定义css
        value: [Number, String], // 默认值
        clearable: Boolean // 是否可清空
    },
    model: {
        prop: 'value',
        event: 'update'
    },
    data() {
        return {
            selectedValue: '',
            selectedLabel: '',
            index: 0,
            isShow: false,
            isClear: false,
            sectionsDir: 'bottom-upfold',
            sectionsHeight: '0px'
        }
    },
    methods: {
        showOptions(e) {
            this.isShow = !this.isShow
            let ele = this.$refs.sections
            // console.log("TCL: showOptions -> ele", ele)
            if (this.isShow) {
                let y =
                    document.body.scrollHeight -
                    e.target.getBoundingClientRect().bottom
                this.sectionsDir =
                    y < 220
                        ? 'top-upfold'
                        : 'bottom-upfold'
                $(ele).slideDown(200)
            } else {
                $(ele).slideUp(200)
            }
        },
        select(item) {
            this.isShow = false
            let ele = this.$refs.sections
            $(ele).slideUp(200)
            if (item.value === this.selectedValue) return
            this.selectedValue = item.value
            this.selectedLabel = item.label
            this.$emit('update', item.value, item)
        },
        clear() {
            this.selectedValue = ''
            this.selectedLabel = ''
            this.$emit('update', undefined, undefined)
        },
        closeSections() {
            this.isShow = false
            let ele = this.$refs.sections
            $(ele).slideUp(200)
        },
        updateClearState(bool) {
            this.isClear = bool
        }
    },
    watch: {
        value(val) {
            this.selectedValue = this.val
            this.options.forEach(item => {
                if (item.value === this.value) {
                    this.selectedLabel = item.label
                }
            })
        }
    },
    mounted() {
        this.selectedValue = this.value
        this.options.forEach(item => {
            if (item.value === this.value) {
                this.selectedLabel = item.label
            }
        })
    }
}
</script>

<style scoped>
.v-select {
    /* height: 22px; */
    /* height: 100%; */
    width: 110px;
    position: relative;
    /* margin: 0 5px; */
    /* display: inline-block; */
    box-sizing: border-box;
    cursor: pointer;
    box-sizing: border-box;
    background: #fff;
}
.val-box {
    width: 100%;
    height: 30px;
    line-height: 28px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid #e2dcdc;
    border-radius: 4px;
    position: relative;
}
.v-select .val-box-active {
    border-color: #57a3f3;
}
.val-box .icon-icon-test {
    display: none;
    cursor: pointer;
}
.val-box .icon-rotate {
    transform: rotate(180deg);
}
.val-box:hover .icon-icon-test {
    display: inline-block;
}
.val-box i {
    display: inline-block;
    position: absolute;
    right: 10px;
    transition: all 0.2s ease;
}
.val-box span {
    display: inline-block;
    width: 100%;
    height: 26px;
    text-align: left;
    text-indent: 10px;
}
.val-box .drop-down {
    width: 0;
    height: 0;
    margin-top: 10px;
    margin-right: 4px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #4c8bfd;
    transition: all 0.2s;
}
.sections {
    width: 100%;
    max-height: 180px;
    position: absolute;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    background-color: #fff;
    overflow-y: scroll;
    display: none;
    z-index: 1;
}
.bottom-upfold {
    bottom: -5px;
    transform: translateY(100%);
}
.top-upfold {
    top: -5px;
    transform: translateY(-100%);
}
.sections li {
    width: 100%;
    height: 26px;
    line-height: 26px;
    box-sizing: border-box;
    padding: 0 10px;
    text-align: left;
    border-radius: 4px;
}
.sections .active {
    background-color: rgb(243, 243, 243);
    color: #2d8cf0;
}
.sections li:hover {
    background-color: rgb(243, 243, 243);
}
</style>


