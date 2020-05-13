<template>
    <div class="table-container v-table" :class="css">
        <table :class="[fixed?'table-layout-fixed':'']">
            <thead>
                <tr>
                    <th class="center-box" v-if="hadCheckbox">
                        <!-- <input type="checkbox" class="checkbox" v-model="all_checked" @change="onChange(999999, $event)" /> -->
                        <Checkbox
                            class="checkbox"
                            v-model="all_checked"
                            @update="onChange(999999, all_checked)"
                        />
                    </th>
                    <th v-for="(col, index) in headers" :key="index">
                        <!-- 使用label 时 -->
                        <!-- 格式：[ {"label":"中文名","key":"email","sortable":true,"isFrontSort":"String"},{}] -->
                        <template v-if="col.label">
                            <div :class="['th-sort',sortKey===col.key?'orange':'']" @click="sortBy(col,index)">
                                <div>{{col.label}}</div>
                                <div v-if="sortKey===col.key" class="sort">
                                    <!-- <span class="desc"></span> -->
                                    <span :class="['desc',sortOrder==='desc'?'desc-active':'']"></span>
                                    <span :class="['asc',sortOrder==='asc'?'asc-active':'']"></span>
                                </div>
                            </div>
                        </template>

                        <!-- 直接使用数组时 -->
                        <template v-else>
                            <div>{{col}}</div>
                        </template>
                    </th>
                </tr>
            </thead>
            <tbody class="select-text">
                <!-- 有数据时 -->
                <template v-if="column&&column.length">
                    <tr v-for="(col_row, idx) in column" :key="idx">
                        <!-- // 如果有checkbox -->
                        <td v-if="hadCheckbox">
                            <Checkbox
                                class="checkbox"
                                v-model="col_row.checked"
                                @update="onChange(idx, col_row.checked)"
                            />
                        </td>
                        <!-- td 内容 -->
                        <slot name="item" :row="col_row" :idx="idx"></slot>
                    </tr>

                    <!-- 如果直接用tr -->
                    <slot name="tr"></slot>
                </template>

                <!-- 没有数据时 -->
                <template v-else>
                    <tr>
                        <td :colspan="headers.length+hadCheckbox">没有数据</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        css: Object,
        fixed: Boolean,
        headers: Array,
        column: Array,
        hadCheckbox: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            all_checked: false,
            check_list: [],
            // list: [
            //     {
            //         label: 'First Name',
            //         key: 'first_name',
            //         sortable: true,
            //         type: 'String'
            //     },
            //     {
            //         label: 'Last Name',
            //         key: 'last_name',
            //         sortable: true,
            //         type: 'String'
            //     },
            //     {
            //         label: 'Email',
            //         key: 'email',
            //         sortable: true,
            //         type: 'String'
            //     },
            //     { label: 'Age', key: 'age', sortable: true, type: 'Number' },
            //     {
            //         label: 'Country',
            //         key: 'country',
            //         sortable: true,
            //         type: 'String'
            //     },
            //     {
            //         label: 'Category',
            //         key: 'category',
            //         sortable: true,
            //         type: 'String'
            //     },
            //     {
            //         label: 'Last Update',
            //         key: 'last_update',
            //         sortable: true,
            //         type: 'String'
            //     }
            // ],
            sortOrder: '', // asc:正序, desc 倒序
            sortKey: '' // 排序关键字
        }
    },
    methods: {
        onChange(index, checked) {
            // 全选或全不选
            if (index === 999999) {
                // this.check_list = this.check_list.map(item => e.target.checked)
                this.column.forEach(item => {
                    item.checked = this.all_checked
                })
            } else {
                this.all_checked = this.column.every(item => item.checked)
            }

            /**
             *  @param {Number}     index       点击的哪个checkbox, 999999:全部;其他index: 第几个
             *  @param {Boolean}    checked     Boolean 是否选中
             *
             *  */
            // checked 已植入 this.column 中，可直接获取
            this.$emit('checkboxChange', index, checked)
        },
        sortBy(row, index) {
            // console.log('row: ', row);
            if (this.sortKey && this.sortKey === row.key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
                // this.column.reverse()
            } else {
                this.sortColumn = index
                this.sortOrder = 'asc'
                this.sortKey = row.key
            }
            let obj = {
                key: this.sortKey,
                sortOrder: this.sortOrder
            }
            // console.log('obj: ', obj)
            this.$emit('sortUpdate', obj)
        }
    },
    watch: {
        column(val) {}
    },
    mounted() {
        // 初始化 column 使checked都为false
        this.column.forEach(item => {
            if (!item.checked) {
                item.checked = false
            }
        })
    }
}
</script>

<style scoped>
.v-table {
    min-height: calc(100vh - 290px);
    /* border: 1px solid #4c8bfd; */
}
.table-container table {
    border-collapse: collapse;
    width: 100%;
    /* table-layout: fixed */
}
.table-container .table-layout-fixed {
    table-layout: fixed;
    /* border: 1px solid #000; */
}
tbody tr:nth-child(2n) {
    /* background: #F7F7F7FF; */
    background: rgb(248, 252, 255);
}

tbody tr:hover {
    background: #fbfdfe;
}

.table-container table th {
    position: relative;
    /* padding: 7px 4px; */
    height: 2.8rem;
    border: 1px solid #6fa2fe;
    font-weight: 400;
    color: #ffffff;
    background: #70a1fd;
}
tr td {
    /* height: 40px; */
    text-align: center;
    /* padding: 7px 4px; */
    height: 2.9rem;
    border: 1px solid #6fa2fe;
    /* font-size: 13px; */
}
.checkbox {
    justify-content: center;
}

th > div {
    display: flex;
    justify-content: center;
}
/* .sort {
} */
.desc {
    position: relative;
    top: 1.3rem;
    left: 7px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #ffffff;
}
th .desc-active{
    border-top: 6px solid #f36608;
}
.asc {
    position: relative;
    top: -15px;
    left: -5px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #ffffff;
}
th .asc-active {
    border-bottom: 6px solid #f36608;
}
.th-sort {
    cursor: pointer;
    /* border: 1px solid #000; */
}
.select-text {
    user-select: text;
}
</style>