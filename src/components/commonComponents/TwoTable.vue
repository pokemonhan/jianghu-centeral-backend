<template>
    <div class="contain">
        <div style="margin-top:20px;"></div>
        <div
            :class="[is_show[index]?'opened':'','content']"
            v-for="(row, index) in column"
            :key="index"
        >
            <table :class="['table','first-table',first_tbl_isfixed?'talbe-fixed':'']">
                <thead>
                    <tr>
                        <th style="width:40px;" @click="expand(index)">
                            <i :class="['iconfont',is_show[index]?'iconjianshao':'icontianjia']"></i>
                        </th>
                        <th
                            v-for="(th, th_index) in headers[0]"
                            :key="th_index"
                            :style="'width:'+th.width+'px'"
                        >{{th.label?th.label:th}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td ></td>
                        <slot name="tdOne" :row="row" :idx="index"></slot>
                    </tr>
                    <slot name="tr1"></slot>
                </tbody>
            </table>

            <div class="table second-table" :ref="'table_'+index">
                <table :class="['table',second_tbl_isfixed?'talbe-fixed':'']">
                    <thead>
                        <tr>
                            <!-- 留空 -->
                            <th style="width:40px;border:none;"></th>
                            <th
                                v-for="(th, index) in headers[1]"
                                :key="index"
                                 :style="'width:'+th.width+'px'"
                            >{{th.label?th.label:th}}</th>
                            <!-- <th></th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="width:40px;border:none"></td>
                            <slot name="tdTwo" :row="row" :idx="index"></slot>
                            <!-- <td style="width:5px;"></td> -->
                        </tr>
                        <slot name="tr2"></slot>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- <slot name="" -->
    </div>
</template>

<script>
export default {
    props: {
        css: Object,
        headers: Array,
        column: Array
    },
    data() {
        return {
            is_show: [],
            first_tbl_isfixed: false,
            second_tbl_isfixed: false,
            
        }
    },
    methods: {
        expand(i) {
            this.is_show.splice(i, 1, !this.is_show[i])
            $(this.$refs['table_' + i]).slideToggle(200)
        }
    },
    mounted() {
        if(this.headers[0][0].width){
            this.first_tbl_isfixed=true
        }
        if(this.headers[1][0].width){
            this.second_tbl_isfixed=true
        }
    }
}
</script>

<style scoped>
/* .container {
    padding: 20px 8px 20px 8px;
    border-top-right-radius: 5px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background: #fff;
} */
.content{
    border: 1px solid #4c8bfd;
}
.opened {
    box-shadow: 0 -2px 3px 0 rgb(195, 209, 224) inset;
    transition: all 0.2s;
}

.table {
    /* table-layout: fixed; */
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
}
.talbe-fixed {
    table-layout: fixed;
}
.table td,
.table th {
    height: 40px;
    border: 1px solid #70a2fd;
}
.first-table tbody td:first-child{
    border:none;
}
.table tbody tr:nth-child(2n) {
    background: rgb(250, 249, 249);
}
.table tr td {
    text-align: center;
    /* padding: 8px 4px; */
    /* border: 1px solid #70a2fdff; */
    font-size: 13px;
}
/* tbody tr:hover {
    background: rgb(248, 250, 246);
} */
.container .first-table th {
    /* padding: 8px 6px; */
    /* border: 1px solid #70a2fdff; */
    font-weight: 400;
    color: #ffffff;
    background: #70a2fd;
}
.container .first-table td {
    border-bottom: none;

}
.second-table {
    display: none;
    /* box-shadow: 0 -1px 7px -1px rgb(156, 192, 226) inset; */
}

.container .second-table th:not(:first-child) {
    padding: 2px 6px;
    font-size: 15px;
    /* border: 1px solid rgb(230, 229, 229); */
    font-weight: 400;
    color: #4c8bfd;
    background: #e5f7ff;
}

/* .total-table table tr td {
    border: none;
}
.total-table table tr th {
    height: 40px;
    padding: 6px 8px;
    color: #6d93db;
    background: #eef7fc;
    font-weight: 400;
} */
</style>