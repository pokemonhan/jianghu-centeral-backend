<template>
    <div
        :class="['v-select',disabled?'disabled':'']"
        :style="css"
        v-clickoutside="closeSections"
        ref="v-select"
    >
        <div
            :class="['val-box', isShow ? 'val-box-active' : '']"
            @click.stop="showOptions"
            @mouseover="updateClearState(true)"
            @mouseout="updateClearState(false)"
        >
            <input
                ref="hiddenInput"
                type="hidden"
                v-model="selectedValue"
                
            />
            <input
                v-if="isShow"
                ref="input"
                class="show-input"
                v-model="showInputLabel"
                :type="input?'text':'hidden'"
                :title="showInputLabel"
                @keydown.down.stop.prevent="navigateOptions('next')"
                @keydown.up.stop.prevent="navigateOptions('prev')"
                @keydown.enter.prevent="selectOption"
                @input="handleInput"
                @change="inputChange"
                @focus="inputFocus"
                :placeholder="placeholder"
            />
            <span
                class="show-select-label"
                v-show="!input||!isShow"
            >{{selectedLabel?selectedLabel:placeholder}}</span>
            <i v-show="clearable && isClear" @click.stop="clear" class="iconfont iconcuowuguanbi-"></i>
            <span
                v-show="!(clearable && isClear)"
                :class="['drop-down', '', isShow ? 'icon-rotate' : '']"
            ></span>
        </div>
        <ul :class="['sections', sectionsDir]" ref="sections">
            <li
                v-for="(item,index) in opt"
                :key="item.value"
                :ref="'opt-'+index"
                :class="[selectedValue===item.value ? 'active' : '',hoverIndex===index?'option-hover':'','option']"
                @click.stop="select(item)"
                :title="TitleShow(input,item)"
            >{{item.label}}</li>
        </ul>
        <span v-show="showerr||(required&&!value)" class="error-message">
            <i class="iconfont iconjinggao1-"></i>
            {{errmsg}}
        </span>
    </div>
</template>

<script>
/* 
        evnet
            update: 数据改变触发 返回(value, item)

        可绑定 v-model
     */
// import Slide from '../../js/config/slide'
import tool from '../../js/tool.js'
export default {
    name: 'Select',
    props: {
        css: Object, // 自定义css
        input: Boolean, // 是否像 input 可以输入
        noFilter: Boolean, // 默认根据input内容筛选。
        options: {
            // 选项内容
            type: Array,
            default: () => []
        },
        value: [Number, String], // 默认值
        clearable: {
            type: Boolean,
            default: false
        }, // 是否可清空
        placeholder: String,
        disabled: Boolean,
        // 当required为true时, 值为空,就会提示
        required: {
            type: Boolean,
            default: false
        },
        showerr: {
            type: Boolean,
            default: false
        },
        errmsg: {
            type: String,
            default: ''
        }
    },
    model: {
        prop: 'value',
        event: 'update'
    },
    data() {
        return {
            showInputLabel: '', // input 里面的内容
            selectedValue: '',
            selectedLabel: '',
            // index: 0,
            isShow: false, // 本义展示下拉框
            // opt: [], // 下拉框内容
            isClear: false,
            sectionsDir: 'bottom-upfold',
            sectionsHeight: '0px',
            hoverIndex: -1
        }
    },
    computed: {
        opt() {
            // 输入框内容为空则 返回全部， 不筛选也返回全部
            if (!this.input || !this.showInputLabel || this.noFilter) {
                return this.options
            } else {
                let opt_temp = (this.options || []).filter(item => {
                    // let LowerCase
                    if (item.label) {
                        return (
                            (item.label || '')
                                .toLowerCase()
                                .indexOf(
                                    (this.showInputLabel || '').toLowerCase()
                                ) !== -1
                        )
                    } else {
                        return false
                    }
                })
                return opt_temp
            }
        }
    },
    methods: {
        TitleShow(input, item) {
            let title = ''
            if (input) {
                title = item.title ? item.title : item.label
            }
            return title
        },
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
            if (this.disabled) return
            this.hoverIndex = -1
            if (this.input) {
                this.isShow = true
                // setTimeout(() => {
                // })
                this.$nextTick(() => {
                    this.$refs.input.focus()
                })
            } else {
                this.isShow = !this.isShow
                this.$refs.hiddenInput.focus()
            }
            let ele = this.$refs.sections
            if (this.isShow) {
                /** 滚动条到顶部的距离 */
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
        navigateOptions(direction) {
            if (!this.isShow) return
            if (this.options.length === 0) return
            if (direction === 'next') {
                this.hoverIndex++
                if (this.hoverIndex === this.options.length) {
                    this.hoverIndex = 0
                }
            } else if (direction === 'prev') {
                this.hoverIndex--
                if (this.hoverIndex < 0) {
                    this.hoverIndex = this.options.length - 1
                }
            }
            
            this.$nextTick(() => this.scrollToOption())
        },
        scrollToOption() {
            let container = this.$refs.sections
            let ref_name = 'opt-'+this.hoverIndex
            let selected = (this.$refs[ref_name]&&this.$refs[ref_name][0]) || ''
            if(!container||!selected) return
            tool.scrollIntoView(container,selected)
        },
        select(item) {
            this.isShow = false
            let ele = this.$refs.sections
            // $(ele).slideUp(200)
            // Slide.slideUp(ele)
            if (item.value === this.selectedValue) return
            this.selectedValue = item.value
            this.selectedLabel = item.label
            this.slideUp(ele)

            // this.showInputLabel = item.label // input 展示的内容
            this.$emit('update', item.value)
        },
        selectOption() {
            if(!this.isShow) return
            if(this.handleInput===-1) return
            let curr_option = this.options[this.hoverIndex] || ''
            if(!curr_option) return
            this.select(curr_option)
        },
        clear() {
            if (this.disabled) return
            this.selectedValue = ''
            // this.selectedLabel = ''
            this.$emit('update', '', '')
        },
        closeSections() {
            this.isShow = false
            let ele = this.$refs.sections
            // $(ele).slideUp(200)
            // Slide.slideUp(ele)
            this.slideUp(ele)
        },
        updateClearState(bool) {
            if (this.disabled) return
            this.isClear = bool
        },
        handleInput() {
            this.$emit('input', this.showInputLabel)
        },
        inputChange() {
            this.$emit('inputchange', this.showInputLabel)
        },
        inputFocus() {
            this.showInputLabel = ''
            this.$emit('input', this.showInputLabel)
        },
        setSelectedLabel() {
            this.options.forEach(item => {
                if (item.value === this.value) {
                    this.selectedLabel = item.label
                }
            })
        }
    },
    watch: {
        value(val) {
            this.selectedValue = val
            this.selectedLabel = ''
            this.setSelectedLabel()
        },
        options(opt) {
            // console.log('🥪 opt: ', opt);
            // this.selectedValue = ''
            this.selectedLabel = ''
            if (!this.options) return
            this.setSelectedLabel()
        }
    },
    mounted() {
        // console.log('palceholder', this.placeholder)
        this.selectedValue = this.value
        // this.options.forEach(item => {
        //     if (item.value === this.value) {
        //         this.selectedLabel = item.label
        //     }
        // })
        this.setSelectedLabel()
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
    cursor: pointer;
    /* overflow: hidden; */
}
.disabled .val-box {
    cursor: not-allowed;
}
.v-select .val-box-active {
    border-color: #57a3f3;
}
.val-box .show-input {
    /* height: 95%; */
    width: 98%;
    margin-left: 1px;
    padding-left: 6px;
    padding-right: 23px;
    border: none;
    background: rgb(253, 254, 255);
}
.show-select-label {
    /* width: 100%; */
    padding-right: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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
    right: 3px;
    font-size: 1.5em;
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
.option-hover {
    background-color: rgb(243, 243, 243);
}
.error-message {
    position: absolute;
    top: 30px;
    left: 1em;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #ef583d;
}
.error-message .iconjinggao1- {
    font-size: 13px;
}

.iconcuowuguanbi-:hover {
    color: rgb(255, 60, 0);
}
.disabled .iconcuowuguanbi-:hover {
    color: #ccc;
}
</style>


