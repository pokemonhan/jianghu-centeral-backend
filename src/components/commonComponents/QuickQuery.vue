<template>
    <div class="quick-query">
        <span>快捷查询</span>
        <button
            :class="[active_btn===item.value?'btn-blue':'btn','buttons']"
            v-for="(item, index) in list"
            :key="index"
            @click="btnClick(item,index)"
        >{{item.label}}</button>
    </div>
</template>


<script>
export default {
    props: {
        date: Array
    },
    data() {
        return {
            active_btn: "",
            list: [
                { label: "今日", value: "today" },
                { label: "昨日", value: "yesterday" },
                { label: "上周", value: "lastweek" },
                { label: "本周", value: "thisweek" },
                { label: "上月", value: "lastmonth" },
                { label: "本月", value: "thismonth" }
            ],
            time_obj:{}
        };
    },
    computed: {
        
    },
    methods: {
        btnClick(item, index) {
            this.active_btn = item.value;
            let formatDate = window.all.tool.formatDate;
        
            let start = this.time_obj[item.value][0]
            let end = this.time_obj[item.value][1]
            
            this.$emit("update", [formatDate(start), formatDate(end)]);
            this.$emit("update:date", [formatDate(start), formatDate(end)]);
        },
        initDate() {
            let formatDate = window.all.tool.formatDate;
            var now = new Date(); //当前日期

            var nowYear = now.getFullYear(); // 当前年
            var nowMonth = now.getMonth(); // 当前月
            var nowDay = now.getDate(); // 当前日

            var nowDayOfWeek = now.getDay(); // 今天是本周的第几天
            // (周日获取的是第0天,设置为7天)
            if (nowDayOfWeek === 0) {
                nowDayOfWeek = 7;
            }

            
            // 今天
            function getToday() {
                return [new Date(), new Date()];
            }
            // 昨天
            function getYesterday() {
                let yesterday = new Date().valueOf() - 1000 * 60 * 60 * 24;
                let start = new Date(yesterday);
                let end = new Date(yesterday);
                return [start, end];
            }
            // 上周
            function getLastweek() {
                let start = new Date(
                    nowYear,
                    nowMonth,
                    nowDay - nowDayOfWeek - 6
                );
                let end = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
                return [start,end]
            }
            // 本周
            function getThisweek() {
                let start = new Date(
                    nowYear,
                    nowMonth,
                    nowDay - nowDayOfWeek + 1
                );
                let end = new Date(
                    nowYear,
                    nowMonth,
                    nowDay + (7 - nowDayOfWeek)
                );
                return [start, end];
            }
            //  获得某月的天数 下面备用
            function getMonthDays(myMonth) {
                var monthStartDate = new Date(nowYear, myMonth, 1);
                var monthEndDate = new Date(nowYear, myMonth + 1, 1);
                var days =(monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
                return days;
            }
            // 上月
            function getLastmonth() {
                let start = new Date(nowYear, nowMonth - 1, 1);
                let end = new Date(
                    nowYear,
                    nowMonth - 1,
                    getMonthDays(nowMonth - 1)
                );
                return [start, end];
            }
            // 本月
            function getThismonth() {
                let start = new Date(nowYear, nowMonth, 1);
                let end = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
                return [start, end]
            }
            this.time_obj = {
                today: getToday(),
                yesterday: getYesterday(),
                lastweek: getLastweek(),
                thisweek: getThisweek(),
                lastmonth: getLastmonth(),
                thismonth: getThismonth(),
            }
        },
        getTimeTab(date) {
            let formatDate = window.all.tool.formatDate;
            if(date && date[0] && date[1]){
                // 循环 1.today  2.yesterday 3.lastweek 4.thisweek 5.lastmonth 6.thismonth 
                for (const key in this.time_obj) {
                    let start = formatDate(this.time_obj[key][0])
                    let end = formatDate(this.time_obj[key][1])
                    if(start===date[0] && end===date[1]){
                        return key
                    }
                        
                }
            }
            return '出错,没有匹配项'
        }
    },
    watch: {
        date(date){
            this.active_btn = this.getTimeTab(date)
        }
    },
    mounted() {
        this.initDate()
        
    }
};
</script>

<style scoped>
.quick-query{
    padding: 10px;
}
.btn-blue {
    /* height: 26px; */
    padding-left: 15px;
    padding-right: 15px;
    outline: none;
    border: none;
    /* box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); */
    cursor: pointer;
    box-sizing: border-box;
    border-radius: 3px;
    color: #fff;
    border: 1px solid #4c8bfd;
    background: #4c8bfd;
}

.btn-blue:hover {
    box-shadow: none;
    background: #6397f7;
}
.btn-blue:active {
    box-shadow: none;
    background: #3f7beb;
}
.buttons{
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 5px;
}
</style>
