<template>
    <div class="cont">
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>游戏厂商</span>
                    <Select v-model="filter.vendor" :options="vendor_opt"></Select>
                </li>
                <li>
                    <span>游戏名称</span>
                    <Select v-model="filter.name" :options="name_opt"></Select>
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
                    <span>{{'2分钟前'}}</span>
                    <div class="pic-cont">
                        <img class="img" src="../../../assets/image/game/img (1).jpg" alt="图片丢失" />
                        <div class="vertical-bar"></div>
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
                <ul>
                    <li>
                        <div class="bold-blue">操作设置</div>
                        <div class="mt8">修改抢红包金额</div>
                        <div class="mt8">修改抢红包VIP7特权倍数</div>
                    </li>
                    <li class="mt30">
                        <div class="bold-blue mt8">删除内容</div>
                        <div class="mt8">删除14:30抢红包活动</div>
                    </li>
                </ul>
            </div>
        </Dialog>
    </div>
</template> <script>
export default {
    props: {
        id: {
            require: true,
            type: [String, Number]
        }
    },
    data() {
        return {
            filter: {
                vendor: '',
                name: '',
                sort: '',
                dates: ['','']
            },
            vendor_opt: [
                {
                    label: '抢庄牛牛',
                    value: '1'
                },
                {
                    label: '百家乐',
                    value: '2'
                }
            ],
            name_opt: [
                {
                    label: '抢庄牛牛',
                    value: '1'
                },
                {
                    label: '百家乐',
                    value: '2'
                }
            ],
            dia_show: true
        }
    },
    methods: {
        detail() {
            this.dia_show = true
        },
        getList() {
            console.log('🎈等待接口中...');
            // let params = {id:this.id}
            // let { url, method } = this.$api.game_vendor_list
            // this.$http({
            //     method: method,
            //     url: url,
            //     data: params
            // }).then(res => {
            //     if (res && res.code === '200') {
            //         self.total = res.data.total
            //         self.list = res.data.data
            //     } else {
            //         if (res && res.message !== '') {
            //             self.toast.error(res.message)
            //         }
            //     }
            // })
        }
    },
    mounted() {
        this.getList()
    }
}
</script> <style scoped>
.cont {
    width: 800px;
    max-height: 80vh;
    overflow: auto;
}

.opera-list {
    margin-top: 20px;
    margin-left: 50px;
    overflow: hidden;
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
    top: 40px;
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
    font-weight: bold;
    color: #4c8bfd;
}
.mt8 {
    margin-top: 8px;
}
.bold-blue {
    font-weight: bold;
    color: #4c8bfd;
}
.mt30 {
    margin-top: 30px;
}
</style>