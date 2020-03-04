<template>
    <div class="cont">
        <div class="filter p10">
            <ul class="left">
                 <li>
                    <span>通道名称</span>
                    <Select v-model="filter.channel" :options="channel_opt"></Select>
                </li>
                <li>
                    <span>厂商名称</span>
                    <Select v-model="filter.vendor" :options="vendor_opt"></Select>
                </li>
                <li>
                    <span>分类名称</span>
                    <Select v-model="filter.sort" :options="sort_opt" ></Select>
                </li>
                <li>
                    <span>日期选择</span>
                    <!-- <Date v-model="filter.dates[0]" />
                    <span style="margin:0 5px;">~</span>
                    <Date v-model="filter.dates[1]" /> -->
                    <Date type="daterange" v-model="filter.dates" />
                </li>
                <li>
                    <button class="btn-blue">查询</button>
                </li>
            </ul>
        </div>
        <div>
            <ul class="opera-list">
                <li v-for="(item, index) in 5" :key="index">
                    <span style="min-width:150px;text-align:right;">{{index=='1'?'1111小时50分前':'1小时前'}}</span>
                    <div class="pic-cont">
                        <img class="img" src="../../../assets/image/game/img (1).jpg" alt="图片丢失">
                        <div :class="[index!==4?'vertical-bar':'']"></div>
                    </div>
                    <div class="opera-cont">
                        <div class="cont-left">
                            <div class="cont-title">{{'admin操作活动管理-抢红包'}}</div>
                            <div class="mt8">
                                <span>操作时间:</span>
                                <span>{{'2019/11/11 14:30:15'}}</span>
                            </div>
                        </div>
                        <div class="cont-right">
                            <button class="btn-blue" @click="detail">查看详情</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <Dialog :show.sync="dia_show" title="操作详情">
            <div class="dia-inner">
                <ul class="dia-cont">
                    <li>
                        <div class="bold-blue">操作设置:</div>
                        <div class="mt8">修改抢红包金额</div>
                        <div class="mt8">修改抢红包VIP7特权倍数</div>
                    </li>
                    <li class="mt30">
                        <div class="bold-blue mt8">删除内容:</div>
                        <div class="mt8">删除14:30抢红包活动</div>
                    </li>
                </ul>
            </div>
        </Dialog>
    </div>
</template> <script>
export default {
    data() {
        return {
             filter: {
                vendor: '',
                name: '',
                sort: '',
                dates: []

            },
            channel_opt: [
                { label: '全部', value: '' },
                { label: '红牛', value: '1' },
                { label: '东鹏？', value: '2' }
            ],
            vendor_opt: [
                { label: '全部', value: '0' },
                { label: '抢庄牛牛', value: '1' },
                { label: '百家乐', value: '2' }
            ],
            sort_opt: [
                {
                    label: '抢庄牛牛',
                    value: '1'
                },
                {
                    label: '百家乐',
                    value: '2'
                }
            ],
            dia_show: false
        }
    },
    methods: {
        detail() {
            this.dia_show = true
        }
    },
    mounted() {}
}
</script>

<style scoped>
.cont {
    width: 1000px;
    max-height: 80vh;
    overflow: auto;
}

.opera-list {
    /* margin-left: 100px; */
    width: 730px;
    margin: 20px auto 0 auto;
    /* border: 1px solid #000; */
}
.opera-list > li {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    /* overflow: hidden; */
}
.opera-list > li .pic-cont {
    position: relative;
    width: 40px;
    height: 40px;
    margin-left: 10px;
}
.opera-list > li .img {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    z-index: 1;
}
/* 竖线 */
.opera-list > li .vertical-bar {
    position: absolute;
    top:40px;
    left: 50%;
    bottom: 0;
    width: 2px;
    height: 45px;
    background: #eee;
}


.opera-list > li .opera-cont {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 500px;
    /* height: 60px; */
    padding: 10px;
    margin-left: 10px;
    background: #f2f2f2;
    border-radius: 5px;
}
.opera-list > li .cont-title {
    font-weight:  bold;
    color: #4c8bfd;
}
.mt8 {
    margin-top: 8px;
}
.bold-blue {
    font-weight: bold;
    color: #4c8bfd;
}
.mt30{
    margin-top: 30px;
}
.dia-inner {
    display: flex;
    justify-content: center;
}
</style>