<template lang="html">
  <div class="cron" :val="value_">
    <el-tabs v-model="activeName">
      <!-- <el-tab-pane label="秒?" name="s">
        <second-and-minute v-model="sVal" lable="秒?"></second-and-minute >
      </el-tab-pane> -->
      <el-tab-pane label="分" name="m">
        <second-and-minute v-model="mVal" lable="分"></second-and-minute >
      </el-tab-pane>
      <el-tab-pane label="时" name="h">
        <hour v-model="hVal" lable="时"></hour>
      </el-tab-pane>
      <el-tab-pane label="日" name="d">
        <day v-model="dVal" lable="日"></day>
      </el-tab-pane>
      <el-tab-pane label="月" name="month">
        <month v-model="monthVal" lable="月"></month>
      </el-tab-pane>
      <el-tab-pane label="周" name="week">
        <week v-model="weekVal" lable="周"></week>
      </el-tab-pane>
      <el-tab-pane label="年" name="year">
        <year v-model="yearVal" lable="年"></year>
      </el-tab-pane>
    </el-tabs>
    <!-- table -->
    <el-table
       :data="tableData"
       size="mini"
       border
       style="width: 100%;">
       <!-- <el-table-column
         prop="sVal"
         label="秒"
         width="70">
       </el-table-column> -->
       <el-table-column
         prop="mVal"
         label="分"
         width="70">
       </el-table-column>
       <el-table-column
         prop="hVal"
         label="时"
         width="70">
       </el-table-column>
       <el-table-column
         prop="dVal"
         label="日"
         width="70">
       </el-table-column>
       <el-table-column
         prop="monthVal"
         label="月"
         width="70">
       </el-table-column>
       <el-table-column
         prop="weekVal"
         label="周"
         width="70">
       </el-table-column>
       <el-table-column
         prop="yearVal"
         label="年">
       </el-table-column>
     </el-table>
    <div class="flex justify-center mt20">
        <!-- <el-button>确认</el-button> -->
        <button class="btn-blue-large" @click="confirm"> 确定 </button>
    </div>
  </div>
</template>

<script>
// 'el-tabs', 'el-tab-pane', 'el-table', 'el-table-column'
// import { Tabs, TabPane, Table, TableColumn } from 'element-ui'
import { Button, Tabs, TabPane, Table, TableColumn } from 'element-ui'
// console.log('🍨 TabPane: ', TabPane)
import SecondAndMinute from './cron/secondAndMinute'
import hour from './cron/hour'
import day from './cron/day'
import month from './cron/month'
import week from './cron/week'
import year from './cron/year'
export default {
    props: {
        value: {
            type: String
        }
    },

    components: {
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Button.name]: Button,
        SecondAndMinute,
        hour,
        day,
        month,
        week,
        year
    },
    data() {
        return {
            //
            activeName: 'm',
            // sVal: '',
            mVal: '',
            hVal: '',
            dVal: '',
            monthVal: '',
            weekVal: '',
            yearVal: ''
        }
    },

    computed: {
        tableData() {
            return [
                {
                    // sVal: this.sVal,
                    mVal: this.mVal,
                    hVal: this.hVal,
                    dVal: this.dVal,
                    monthVal: this.monthVal,
                    weekVal: this.weekVal,
                    yearVal: this.yearVal
                }
            ]
        },
        value_() {
            if (!this.dVal && !this.weekVal) {
                return ''
            }
            if (this.dVal === '?' && this.weekVal === '?') {
                setTimeout(() => {
                    this.$toast.error('日期与星期不可以同时为“不指定”')
                })
            }
            // if (this.dVal !== '?' && this.weekVal !== '?') {
            //     setTimeout(() => {
            //         this.$toast.error('日期与星期必须有一个为“不指定”')
            //     })
            // }
            let v = `${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`
            if (v !== this.value) {
                this.$emit('input', v)
            }
            return v
        }
    },
    methods: {
        updateVal() {
            if (!this.value) {
                return
            }
            let arrays = this.value.split(' ')
            // this.sVal = arrays[0]
            this.mVal = arrays[0]
            this.hVal = arrays[1]
            this.dVal = arrays[2]
            this.monthVal = arrays[3]
            this.weekVal = arrays[4]
            this.yearVal = arrays[5] || '*'
        },
        confirm() {
            let v = `${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`
            this.$emit('confirm', v)
        }
    },
    watch: {
        value(a, b) {
            console.log('🥥 a: ', a)
            this.updateVal()
        }
    },
    created() {
        this.updateVal()
    }
    // components: {

    // }
}
</script>

<style lang="css">
.cron {
    min-width: 800px;
    min-height: 500px;
    text-align: left;
    padding: 10px;
    background: #fff;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
</style>
