<template>
    <div class="cont email-detail">
        <div class="filter p10">
            <ul class="left">
                <li>
                    <button class="btn-blue" @click="goBack">返回</button>
                    <button v-if="!isSend" class="btn-blue ml10" @click="reply">回复</button>
                    <button class="btn-red ml10">删除</button>
                </li>
            </ul>
            <div class="right">
                <span class="page-indicate">{{list_idx}}/{{total}}</span>
                <button :class="[list_idx>1?'btn-plain':'btn-disabled']" @click="prevEmail">上一封</button>
                <button :class="[list_idx<total?'btn-plain':'btn-disabled']" @click="nextEmail">下一封</button>
            </div>
        </div>
        <div class="body">
            <div class="top">
                <ul>
                    <li>
                        <span class="head">{{content.title}}</span>
                    </li>
                    <li>
                        <span>发件人:</span>
                        <!-- <span>{{content.platform_sign}}</span> -->
                        <span>{{content.headquarters&&content.headquarters.name}}</span>
                    </li>
                    <li>
                        <span>发送时间:</span>
                        <span>{{content.send_time}}</span>
                    </li>
                    <li v-if="isSend">
                        <span>收件人:</span>
                        <div>
                            <span
                                class="ml10"
                                v-for="(item, index) in (content.receivers||[])"
                                :key="index"
                            >{{item}}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 内容 -->
            <div class="content">
                <span class="p" v-html="$xss(content.content)"></span>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        isSend: Boolean, // 是否是已发邮件(true: 已发邮件, false:收件箱)
        row: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            content: {},
            list_idx: 1, // 第几个
            content_obj: {},

            pageNo: 1,
            pageSize: 25,
            total: 0
        }
    },
    methods: {
        reply() {
            this.$router.push({
                path: '/email/sendemail',
                query: {
                    platform_sign: this.content.platform_sign
                }
            })
        },
        goBack() {
            this.$emit('close')
        },

        getList() {
            if (this.isSend) {
                this.getSentList()
            } else {
                this.getRecei_list()
            }
        },
        // 获取 收件箱
        getRecei_list() {
            let para = {
                pageSize: this.pageSize,
                page: Math.ceil(this.list_idx / this.pageSize)
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.email_recei_list

            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    let list = res.data && res.data.data
                    list.forEach((item, index) => {
                        // 后台数据的第几个,存入content_obj 中. 
                        let idx = (para.page - 1) * this.pageSize + index + 1
                        this.content_obj[String(idx)] = item && item.email
                    })
                    this.content = this.content_obj[this.list_idx] || {}
                }
            })
        },
        // 获取 已发邮件
        getSentList() {
            let para = {
                pageSize: this.pageSize,
                page: Math.ceil(this.list_idx / this.pageSize)
            }
            let params = window.all.tool.rmEmpty(para)
            let { url, method } = this.$api.email_sent_list
            this.$http({ method, url, params }).then(res => {
                if (res && res.code === '200') {
                    let list = res.data && res.data.data

                    list.forEach((item, index) => {
                        // 后台数据的第几个,存入content_obj 中.
                        let idx = (para.page - 1) * this.pageSize + index + 1
                        this.content_obj[String(idx)] = item
                    })
                    this.content = this.content_obj[this.list_idx] || {}
                }
            })
        },
        prevEmail() {
            if (this.list_idx <= 1) return
            this.list_idx--

            // 判断是否在其中, 在就获取内部, 2. 不在就getList
            if (this.content_obj[this.list_idx]) {
                this.content = this.content_obj[this.list_idx]
            } else {
                this.getList()
            }
        },
        nextEmail() {
            // 判断是否在其中, 在就获取内部, 2. 不在就getList
            if (this.list_idx >= this.total) return
            this.list_idx++
            if (this.content_obj[this.list_idx]) {
                this.content = this.content_obj[this.list_idx]
            } else {
                this.getList()
            }
        }
    },
    mounted() {
        // 1. 已发邮件
        if (this.isSend) {
            this.content = this.row

            // 2. 收件箱
        } else {
            this.content = this.row && this.row.email
        }
        this.total = this.row.total
        // 这是后端数据的第几条
        this.list_idx =
            (this.row.pageNo - 1) * this.row.pageSize + this.row.index + 1
    }
}
</script>

<style scoped>
/* p10 ml10 全局css样式 App.vue中 */
.email-detail {
    height: 80%;
    /* width: 100%; */
    padding: 10px;
    border: 1px solid #4c8bfd;
    overflow: auto;

}
.btn-disabled {
    padding: 5px 15px;
    color: #ccc;
    border: 1px solid #ccc;
    cursor: not-allowed;
}
.page-indicate {
    vertical-align: center;
    line-height: 28px;
    margin-right: 5px;
}
.body {
    max-height: 50%;
    padding: 30px 20px;
    margin-top: 20px;
    background: #f2f2f2;
    overflow: auto;
}
.body .top {
    color: #4c8bfd;
}
.top > ul > li {
    margin-top: 8px;
}
.body .top .head {
    font-size: 16px;
    font-weight: bold;
}
.content {
    margin-top: 50px;
    /* height: 770px; */
    overflow: auto;
}
.p {
    text-indent: 2em;
}
</style>
