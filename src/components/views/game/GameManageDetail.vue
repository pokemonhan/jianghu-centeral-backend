
<template>
    <div class="container" ref="operalog">
        <div class="operalog">
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
                        <Date v-model="filter.dates[1]" />-->
                        <Date type="daterange" v-model="filter.created_at" />
                    </li>
                    <li>
                        <button class="btn-blue">查询</button>
                    </li>
                </ul>
            </div>
            <div>
                <ul class="opera-list">
                    <li v-for="(item, index) in list" :key="index">
                        <span style="min-width:150px;text-align:right;">{{timeAgo(item.created_at)}}</span>
                        <div class="pic-cont">
                            <img
                                class="img"
                                src="../../../assets/image/game/img (1).jpg"
                                alt="图片丢失"
                            />
                            <div :class="[index!==list.length-1?'vertical-bar':'']"></div>
                        </div>
                        <div class="opera-cont">
                            <div class="cont-left">
                                <div class="cont-title">{{item.title}}</div>
                                <div class="mt8">
                                    <span>操作时间:</span>
                                    <span>{{item.created_at}}</span>
                                </div>
                            </div>
                            <div class="cont-right">
                                <button class="btn-blue" @click="detail(item)">查看详情</button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- <div class="mb20">
                <Page
                    class="table-page"
                    :total="total"
                    :pageNo.sync="pageNo"
                    :pageSize.sync="pageSize"
                    @updateNo="updateNo"
                    @updateSize="updateSize"
                />
            </div>-->
        </div>
        <Dialog :show.sync="dia_show" title="操作详情">
            <div class="dia-inner">
                <ul>
                    <li>
                        <div class="bold-blue">{{curr_row.title}}</div>
                    </li>
                    <li class="detail">
                        <div>
                            <span>管理员:</span>
                            <span>{{curr_row.admin_name}}</span>
                        </div>
                        <div>
                            <span>时间:</span>
                            <span>{{curr_row.created_at}}</span>
                        </div>
                        <div>
                            <span class>来源:</span>
                            <span>{{curr_row.origin}}</span>
                        </div>
                        <div>
                            <span>IP:</span>
                            <span>{{curr_row.ip}}</span>
                        </div>
                        <div>
                            <span>代理:</span>
                            <span>{{curr_row.user_agent}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </Dialog>
    </div>
</template>

<script>
export default {
    name: 'OperatLog',
    props: {
        id: [Number, String],
        select: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            filter: {
                vendor: '',
                name: '',
                created_at: []
            },
            vendor_opt: [],
            type_opt: [],
            name_opt: [],

            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25,

            dia_show: false,
            curr_row: {},
            isOver: false // 是否都加载完了
        }
    },
    methods: {
        detail(item) {
            this.dia_show = true
            this.curr_row = item
        },
        // 后台数组转为 select_opt 数组
        backToSelOpt(list = []) {
            console.log('🥘 list: ', list)
            let arr = [{ label: '全部', value: '' }]
            list.forEach(item => {
                let opt = { label: item.name, value: item.id }
                arr.push(opt)
            })
            return arr
        },
        initOpt() {
            if(JSON.stringify(this.select.vendors) === '{}') return
            this.vendor_opt = this.backToSelOpt(this.select.vendors)
            this.name_opt = this.backToSelOpt(this.select.games)
            this.type_opt = this.backToSelOpt(this.select.types)
        },
        // 第一次加载
        firstLoad() {
            this.getList().then(res => {
                if (res.data) {
                    this.list = res.data.data
                    this.total = res.data.toal
                }
            })
        },
        getList() {
            return new Promise((resolve, reject) => {
                let created_at = ''
                if (this.filter.created_at[0] && this.filter.created_at[1]) {
                    created_at = JSON.stringify(this.filter.created_at)
                }
                let para = {
                    data_id: this.id, // Id
                    admin_name: this.filter.admin_name, // 管理员名称
                    created_at: created_at, // 管理员时间
                    pageSize: this.pageSize,
                    page: this.pageNo
                }

                let params = window.all.tool.rmEmpty(para)
                let { url, method } = this.$api.game_edit_detail_list
                this.$http({ method, url, params }).then(res => {
                    // console.log('列表👌👌👌👌: ', res)
                    if (res && res.code === '200') {
                        console.log('🥨 this.pageNo: ', this.pageNo)

                        resolve(res)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        // updateNo(val) {
        //     // this.getList()
        // },
        // updateSize(val) {
        //     this.pageNo = 1
        //     // this.getList()
        // },
        timeAgo(time) {
            let reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
            if (!reg.test(time)) return
            let dateTimeStamp = new Date(time)

            //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
            var minute = 1000 * 60 //把分，时，天，周，半个月，一个月用毫秒表示
            var hour = minute * 60
            var day = hour * 24
            var week = day * 7
            var halfamonth = day * 15
            var month = day * 30
            var now = new Date().getTime() //获取当前时间毫秒
            var diffValue = now - dateTimeStamp //时间差

            if (diffValue < 0) {
                return
            }
            var minC = diffValue / minute //计算时间差的分，时，天，周，月
            var hourC = diffValue / hour
            var dayC = diffValue / day
            var weekC = diffValue / week
            var monthC = diffValue / month
            let result = '--'
            if (monthC >= 1 && monthC <= 3) {
                result = ' ' + parseInt(monthC) + '月前'
            } else if (weekC >= 1 && weekC <= 3) {
                result = ' ' + parseInt(weekC) + '周前'
            } else if (dayC >= 1 && dayC <= 6) {
                result = ' ' + parseInt(dayC) + '天前'
            } else if (hourC >= 1 && hourC <= 23) {
                result = ' ' + parseInt(hourC) + '小时前'
            } else if (minC >= 1 && minC <= 59) {
                result = ' ' + parseInt(minC) + '分钟前'
            } else if (diffValue >= 0 && diffValue <= minute) {
                result = '刚刚'
            } else {
                var datetime = new Date()
                datetime.setTime(dateTimeStamp)
                var Nyear = datetime.getFullYear()
                var Nmonth =
                    datetime.getMonth() + 1 < 10
                        ? '0' + (datetime.getMonth() + 1)
                        : datetime.getMonth() + 1
                var Ndate =
                    datetime.getDate() < 10
                        ? '0' + datetime.getDate()
                        : datetime.getDate()
                var Nhour =
                    datetime.getHours() < 10
                        ? '0' + datetime.getHours()
                        : datetime.getHours()
                var Nminute =
                    datetime.getMinutes() < 10
                        ? '0' + datetime.getMinutes()
                        : datetime.getMinutes()
                var Nsecond =
                    datetime.getSeconds() < 10
                        ? '0' + datetime.getSeconds()
                        : datetime.getSeconds()
                result = Nyear + '-' + Nmonth + '-' + Ndate
            }
            return result
        },

        // 滚动加载
        scroll(person) {
            let isLoading = false
            let ele = this.$refs.operalog

            ele.onscroll = () => {
                // 距离底部200px时加载一次
                let scrollHeight = ele.scrollHeight
                let scrollTop = ele.scrollTop
                let offsetHeight = ele.offsetHeight
                let bottomOfWindow = scrollHeight - scrollTop - offsetHeight
                console.log('🍹 isLoading: ', isLoading)
                if (bottomOfWindow < 200 && isLoading == false) {
                    let totalPage = Math.ceil(this.total / this.pageSize)
                    // 如果是加
                    if (this.pageNo > totalPage) return
                    isLoading = true
                    this.pageNo++ // 请求下一页
                    this.getList().then(res => {
                        isLoading = false
                        if (res.data) {
                            this.list = this.list.concat(res.data.data || [])
                        }
                    })
                }
            }
        }
    },
    watch: {
        select(val) {
            this.initOpt()
        }
    },
    mounted() {
        this.initOpt()
        this.firstLoad()
        this.scroll()
    }
}
</script>
<style scoped>
.operalog {
    height: calc(100vh - 170px);
    overflow: autos;
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
.detail div > span:first-child {
    display: inline-block;
    min-width: 5em;
    margin-top: 20px;
    margin-right: 10px;
    /* text-align: right; */
    text-align-last: justify; /* ie9*/
    /* font-weight: bold; */
    font-size: 1.1em;
    color: #444;
}
.mt8 {
    margin-top: 8px;
}
.bold-blue {
    /* font-weight: bold; */
    font-size: 1.3em;
    color: #4c8bfd;
}
.mt30 {
    margin-top: 30px;
}
.dia-inner {
    display: flex;
    justify-content: center;
}
</style>