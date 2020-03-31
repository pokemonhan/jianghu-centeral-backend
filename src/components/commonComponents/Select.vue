<template>
    <div class="v-select" :style="css" v-clickoutside="closeSections" ref="v-select">
        <div
            :class="['val-box', isShow ? 'val-box-active' : '']"
            @click.stop="showOptions"
            @mouseover="updateClearState(true)"
            @mouseout="updateClearState(false)"
        >
            <input v-model="selectedValue" type="hidden" />
            <input
                class="show-input"
                v-model="showInputLabel"
                :type="input?'text':'hidden'"
                :title="showInputLabel"
                @input="handleInput"
                @change="inputChange"
                :placeholder="placeholder"
            />
            <span v-show="!input">{{selectedLabel}}</span>
            <i v-if="clearable && isClear" @click.stop="clear" class="iconfont icon-icon-test"></i>
            <span v-else :class="['drop-down', '', isShow ? 'icon-rotate' : '']"></span>
        </div>
        <ul :class="['sections', sectionsDir]" ref="sections">
            <li
                v-for="(item, index) in options"
                :key="index"
                :class="[selectedValue===item.value ? 'active' : '','option']"
                @click="select(item)"
                :title="input?item.label:''"
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
import Slide from '../../js/config/slide'
export default {
    name: 'Select',
    props: {
        css: Object, // 自定义css
        input: Boolean, // 是否像 input 可以输入
        options: {
            // 选项内容
            type: Array,
            default: () => []
        },
        value: [Number, String], // 默认值
        clearable: Boolean, // 是否可清空
        placeholder: String
    },
    model: {
        prop: 'value',
        event: 'update'
    },
    data() {
        return {
            showInputLabel: '',
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
        slideDown(ele) {
            if (!ele) return
            if (!(ele instanceof Element)) {
                ele = ele[0]
            }
            ele.style.display = 'block'
            ele.style.maxHeight = '0'
            setTimeout(() => {
                ele.style.maxHeight = '180px'
            }, 20)
        },
        slideUp(ele, time = 20) {
            if (!ele) return
            if (!(ele instanceof Element)) {
                ele = ele[0]
            }
            setTimeout(() => {
                ele.style.maxHeight = '0'
            }, 20)
        },
        showOptions(e) {
            if (this.input) {
                this.isShow = true
            } else {
                this.isShow = !this.isShow
            }
            let ele = this.$refs.sections
            if (this.isShow) {
                let scrollTop = document.documentElement.scrollTop
                let scrollHeight = document.body.scrollHeight
                let toBottom = e.target.getBoundingClientRect().bottom
                let y = scrollHeight - scrollTop - toBottom

                this.sectionsDir = y < 150 ? 'top-upfold' : 'bottom-upfold'

                // $(ele).slideDown(200)
                // Slide.slideDown(ele)
                this.slideDown(ele)
                // ele.style.maxHeight = '180px'
            } else {
                // $(ele).slideUp(200)
                // Slide.slideUp(ele)
                this.slideUp(ele)
            }
        },
        select(item) {
            this.isShow = false
            let ele = this.$refs.sections
            // $(ele).slideUp(200)
            // Slide.slideUp(ele)
            this.slideUp(ele)
            if (item.value === this.selectedValue) return
            this.selectedValue = item.value
            this.selectedLabel = item.label

            this.showInputLabel = item.label // input 展示的内容
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
            // $(ele).slideUp(200)
            // Slide.slideUp(ele)
            this.slideUp(ele)
        },
        updateClearState(bool) {
            this.isClear = bool
        },
        handleInput() {
            this.$emit('input', this.showInputLabel)
        },
        inputChange() {
            this.$emit('update', this.showInputLabel)
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
        },
        options() {
            if (!this.options) return
            this.options.forEach(item => {
                if (item.value === this.value) {
                    this.selectedLabel = item.label
                }
            })
        }
    },
    mounted() {
        console.log('palceholder', this.placeholder)
        this.selectedValue = this.value
        this.options.forEach(item => {
            if (item.value === this.value) {
                this.selectedLabel = item.label
                this.showInputLabel = item.label // input 展示的内容
            }
        })
    }
}
</script>

<style scoped>
.v-select {
    /* height: 22px; */
    /* height: 100%; */
    /* width: 110px; */
    min-width: 110px;
    position: relative;
    /* margin: 0 5px; */
    /* display: inline-block; */
    box-sizing: border-box;
    cursor: pointer;
    /* box-sizing: border-box; */
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
    /* overflow: hidden; */
}
.v-select .val-box-active {
    border-color: #57a3f3;
}
.val-box .show-input {
    height: 95%;
    width: 98%;
    margin-left: 1px;
    padding-left: 6px;
    padding-right: 23px;
    border: none;
    background: rgb(253, 254, 255);
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
    position: absolute;
    right: 4px;
    top: 10px;
    width: 10px;
    height: 3px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #4c8bfd;
    transition: transform 0.2s;
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
    z-index: 2;
    transition: max-height 0.2s;
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
    /* overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
    overflow-y: auto;
}
.sections .active {
    background-color: rgb(243, 243, 243);
    color: #2d8cf0;
}
.sections li:hover {
    background-color: rgb(243, 243, 243);
}
.option {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>


