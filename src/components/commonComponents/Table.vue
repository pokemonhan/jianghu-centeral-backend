<template>
    <div class="table-container" :class="css">
        <table>
            <thead>
                <tr>
                    <th class="center-box" v-if="hadCheckbox">
                        <!-- <input type="checkbox" class="checkbox" v-model="all_checked" @change="onChange(999999, $event)" /> -->
                        <Checkbox class="checkbox" v-model="all_checked" @update="onChange(999999, all_checked)" />
                    </th>
                    <th v-for="(col, index) in headers" :key="index">
                        <!-- <div v-if="col.label.split(',').length!==0"></div> -->
                        <template v-if="col.label">
                            <div v-for="(item, index) in col.label.split(',')" :key="index">{{item}}</div>
                        </template>
                        <template v-else>
                            <div v-for="(item, index) in col.split(',')" :key="index">{{item}}</div>                   
                        </template>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(col_row, idx) in column" :key="idx">
                    <!-- <slot name="item" :row="row"></slot> -->
                    <td v-if="hadCheckbox">
                        <!-- <input
                            type="checkbox"
                            class="checkbox"
                            v-model="col_row.checked"
                            @change="onChange(idx, $event)"
                        /> -->
                        <Checkbox class="checkbox" v-model="col_row.checked" @update="onChange(idx, col_row.checked)" />
                    </td>
                    <slot name="item" :row="col_row" :idx="idx"></slot>
                </tr>
                <slot name="tr"></slot>
            </tbody>
        </table>

    </div>
</template>

<script>
export default {
    props: {
        css: Object,
        headers: Array,
        column: Array,
        hadCheckbox: {
            type:Boolean,
            default:()=>false
        }
    },
    data() {
        return {
            all_checked: false,
            check_list: []
        };
    },
    methods: {
        onChange(index, checked) {
            // 全选或全不选
            if (index === 999999) {
                // this.check_list = this.check_list.map(item => e.target.checked)
                this.column.forEach(item => {
                    item.checked = this.all_checked;
                });
            } else {
                this.all_checked = this.column.every(item => item.checked);
            }
            
            /**
             *  @param {Number}     index               点击的哪个checkbox, 999999:全部;其他index: 第几个
             *  @param {Boolean}    checked                Boolean 是否选中
             *  
             *  */
            // checked 已植入 this.column 中，可直接获取
            this.$emit( "checkboxChange", index, checked );
        }
    },
    watch:{
        column(val){

        }
    },
    mounted() {
        // 初始化 column 使checked都为false
        this.column.forEach(item => {
            item.checked = false;
        });
    }
};
</script>

<style scoped>
.table-container table {
    border-collapse: collapse;
    width: 100%;
}

tbody tr:nth-child(2n){
    /* background: #F7F7F7FF; */
    background: rgb(248, 252, 255);
}

tbody tr:hover {
    background: rgb(230, 244, 253);
}

.table-container table th {
    padding: 7px 4px;
    border: 1px solid #6fa2fe;
    font-weight: 400;
    color: #ffffff;
    background: #70a1fd;
}
tr td {
    height: 40px;
    text-align: center;
    /* padding: 7px 4px; */
    border: 1px solid #6fa2fe;
    font-size: 13px;
}
/* .checkbox {
   
} */
</style>