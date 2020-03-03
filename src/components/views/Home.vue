<template>
    <div class="home">
        <ul class="row1">
            <!-- 今日总盈利 -->
            <li>
                <div class="head bg-red">
                    <span>今日总盈利</span>
                </div>
                <div class="cont">
                    <div>
                        <span class="number">{{'0.00'}}</span>
                    </div>
                    <div class="bottom-10">
                        <span>日环比:</span>
                        <span>{{'0.00%'}}</span>
                        <span>人</span>
                    </div>
                </div>
            </li>
            <!-- 今日总首充 -->
            <li>
                <div class="head bg-blue">
                    <span>今日总首充</span>
                </div>
                <div class="cont">
                    <div>
                        <span class="number">{{'0.00'}}</span>
                    </div>
                    <div class="fcharge-pic">
                        <div id="first_recharge" class="row1-3"></div>
                    </div>

                    <div class="bottom-10">
                        <span>充值总人数:</span>
                        <span>{{'0'}}</span>
                        <span>人</span>
                    </div>
                </div>
            </li>
            <!-- 今日总提现 -->
            <li>
                <div class="head bg-green">
                    <span>今日总提现</span>
                </div>
                <div class="cont">
                    <div>
                        <span class="number">{{'0.00'}}</span>
                    </div>
                    <div class="bottom-10">
                        <span>提现总人数:</span>
                        <span>{{'0'}}</span>
                        <span>人</span>
                    </div>
                </div>
            </li>
            <!-- 今日总彩金优惠 -->
            <li>
                <div class="head bg-orange">
                    <span>今日总彩金优惠</span>
                </div>
                <div class="cont">
                    <div>
                        <span class="number">{{'0.00'}}</span>
                    </div>

                    <div class="bottom-10">
                        <span>领取总人数:</span>
                        <span>{{'0'}}</span>
                        <span>人</span>
                    </div>
                </div>
            </li>
        </ul>

        <div class="row2">
            <div class="header">
                <button
                    :class="[peopleIdx===index?'btn-active':'btn-plain-white']"
                    v-for="(item,index) in ['登录总人数','注册总人数']"
                    :key="index"
                    @click="searchPeople(item,index)"
                >{{item}}</button>
            </div>
            <div class="body">
                <div class="left">
                    <div class="circle-title">{{['登录总人数','注册总人数'][peopleIdx]}}</div>
                    <div class="circle-body"></div>
                    <div class="circle-inner">
                        <div>登录人数</div>
                        <div style="margin-top:5px;">{{'16'}}人</div>
                    </div>
                </div>
                <div class="right">
                    <div ref="loginEchart" class="echart-content"></div>
                    <div class="echart-name">站点名称</div>
                </div>
            </div>
        </div>
        <!-------------- row3 --------------------->
        <div class="row3">
            <div class="header">
                <button
                    :class="[amountIdx===index?'btn-active':'btn-plain-white']"
                    v-for="(item,index) in ['今日充值','今日提款', '今日盈利', '今日彩金优惠']"
                    :key="index"
                    @click="searchAmount(item,index)"
                >{{item}}</button>
            </div>
            <div class="body">
                <div class="left">
                    <div class="circle-title">{{['总充值','总提款', '总盈利', '总优惠'][amountIdx]}}</div>
                    <div class="circle-body"></div>
                    <div class="circle-inner">
                        <div style="margin-top:5px;">{{'100000.00'}}</div>
                    </div>
                </div>
                <div class="right">
                    <div ref="totalEchart" class="echart-content"></div>
                    <div class="echart-name">站点名称</div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'Home',
    data() {
        return {
            peopleIdx: 0,
            amountIdx: 0
        }
    },
    methods: {
        searchPeople(item, index) {
            this.peopleIdx = index

        },
        searchAmount(item, index) {
            this.amountIdx = index
        },
        loginChartDraw() {
            let echarts = window.all.echarts
            let login_chart = echarts.init(this.$refs.loginEchart)
            // console.log('this.$refs.loginEchart: ', this.$refs.loginPic);
            login_chart.setOption({
                xAxis: {
                    type: 'category',
                    data: ['江湖互娱', '财神棋牌', '九五至尊'],
                     // 刻度线
                    axisTick: {
                        show:false
                    },
                },
                yAxis: {
                    type: 'value',
                    show: false,
                    // // 刻度线
                    // axisTick: {
                    //     show:false
                    // },
                    // // 去掉网格线
                    // splitLine: {
                    //     show: false
                    // }
                },
                series: [
                    {
                        data: [10, 6, 10],
                        type: 'bar',
                        barWidth: '30px',
                        label:{
                            normal: {
                                position: 'top',
                                show:true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    let colorList = [
                                        '#4c8bfd',
                                        '#ffbf41',
                                        '#4dc213',
                                    ]
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }
                ]
            })
        },
        amountDraw() {
            let echarts = window.all.echarts
            let login_chart = echarts.init(this.$refs.totalEchart)
            // console.log('this.$refs.loginPic: ', this.$refs.loginPic);
            login_chart.setOption({
                xAxis: {
                    type: 'category',
                    data: ['江湖互娱', '财神棋牌', '九五至尊'],
                     // 刻度线
                    axisTick: {
                        show:false
                    },
                },
                yAxis: {
                    type: 'value',
                    show: false,
                    // // 刻度线
                    // axisTick: {
                    //     show:false
                    // },
                    // // 去掉网格线
                    // splitLine: {
                    //     show: false
                    // }
                },
                series: [
                    {
                        data: [50000, 30000, 50000],
                        type: 'bar',
                        barWidth: '30px',
                        label:{
                            normal: {
                                position: 'top',
                                show:true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    let colorList = [
                                        '#4c8bfd',
                                        '#ffbf41',
                                        '#4dc213',
                                    ]
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }
                ]
            })
        }
    },
    mounted() {
        this.loginChartDraw()
        this.amountDraw()
    }
}
</script>

<style scoped>
.home {
    min-width: 1040px;
    /* padding-right: 20px; */
    margin-right: 20px;
}
.row1 {
    width: 100%;
    /* height: 150px; */
    height: 13rem;
    min-height: 150px;
    display: flex;
    justify-content: space-between;
}
.row1 li {
    position: relative;
    width: 22%;
    height: 100%;
    /* padding: 10px; */
    /* border-radius: 5px; */
    background: #fff;
}
.row1 li:first-child {
    border: 1px solid #f44;
}
.row1 li:nth-child(2) {
    border: 1px solid #48f;
}
.row1 li:nth-child(3) {
    border: 1px solid #4c1;
}
.row1 li:nth-child(4) {
    border: 1px solid #fa0;
}
/* 设置4个框里面,每个li的头,但不设置颜色, */
.row1 > li .head {
    padding-top: 5px;
    padding-bottom: 5px;
    /* height: 2rem; */
    /* min-height: 26px; */

    /* line-height: 2rem; */
    color: #fff;
    text-indent: 17px;
}
.bg-orange {
    background: #ff9900;
}
.bg-blue {
    background: #4c8bfd;
}
.bg-light-blue {
    background: #70a1fd;
}
.bg-green {
    background: #4dc213;
}
.bg-red {
    background: #f44;
}
.row1 .cont {
    padding: 10px;
}
/* 隐藏echart 外面样式 */
.row1 .fcharge-pic {
    position: relative;
    left: 2px;
    top: -56px;
    width: 224px;
    height: 100px;
    overflow: hidden;
}
.row1 #first_recharge {
    position: relative;
    top: -37px;
    left: -48px;
    width: 317px;
    height: 200px;
}
.row1 .right {
    float: right;
    margin-right: 10px;
}
.row1 .number {
    font-size: 20px;
    /* position: relative; */
}
.row1 .bottom-10 {
    width: 90%;
    position: absolute;
    bottom: 10px;
    padding-top: 4px;
    border-top: 1px solid #ccc;
    font-size: 14px;
}

.row2,
.row3 {
    /* width: 1040px; */
    /* height: 300px; */
    min-height: 300px;
    height: 18rem;
    /* margin-top: 20px; */
    margin-top: 1.3rem;
    border: 1px solid #4c8bfd;
    background: #fff;
}


/* row2,3,4 头 */
.row2 .header,
.row3 .header {
    height: 45px;
    line-height: 45px;
    padding-left: 20px;
    color: #fff;
    background: #70a1fd;
    box-shadow: 1px 2px 3px #f0eded;
}
/* 白色朴素plain按钮 */
.btn-plain-white {
    /* padding: 5px 10px; */
    height: 30px;
    line-height: 20px;
    border: 1px solid #fff;
    color: #fff;
    background: transparent;
}
.btn-plain-white:hover {
    background: #82abf8;
}
/* 激活按钮 */
.btn-active {
    /* padding: 5px 10px; */
    height: 30px;
    line-height: 20px;
    border-radius: 3px;
    background: #fff;
    color: #4c8bfd;
    border: 1px solid #fff;
}
.btn-active:hover {
    /* box-shadow: none; */
    background: #f9fafc;
    color: #4c8bfd;
    border: 1px solid #f9fafc;
}

/* 第二排,第三排 主体 */
.row2 .body,
.row3 .body {
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 100%; */
}
.row2 .body .left,
.row3 .body .left {
    position: relative;
    width: 300px;
    height: 254px;
}
.row2 .circle-title,
.row3 .circle-title {
    /* position: absolute;
    top: 30px;
    left: 105px; */
    margin-top: 30px;
    text-align: center;
    font-size: 18px;
}
.row2 .body .left .circle-inner{
    position: relative;
    top: -68px;
    text-align: center;
}

.row2 .circle-body,
.row3 .circle-body {
    position: relative;
    top: 20px;
    left: 80px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 20px solid #4c8bfd;
}
.right {
    display: flex;
}

.row2 .echart-content,
.row3 .echart-content {
    width: 340px;
    height: 254px;
    /* border: 1px solid #000; */
}
.right .echart-name{
    margin-top: 185px;
    margin-left: -20px;
    /* border: 1px solid #000;    */
}
.row3 .body .left .circle-inner {
    position: relative;
    top: -65px;
    text-align: center;
}
</style>
