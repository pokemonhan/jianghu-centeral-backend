<template>
    <div class="container">
        <div class="filter p10">
            <ul class="left">
                <li>
                    <button class="btn-blue" @click="goBack">返回</button>
                    <button v-if="!isSend" class="btn-blue ml10" @click="reply">回复</button>
                    <button class="btn-red ml10">删除</button>
                </li>
            </ul>
            <div class="right">
                <button class="btn-plain">上一封</button>
                <button class="btn-plain">下一封</button>
            </div>
        </div>
        <div class="body">
            <div class="top">
                <ul>
                    <li>
                        <span class="head">充值好礼</span>
                    </li>
                    <li>
                        <span>发件人:</span>
                        <span>{{'admin'}}</span>
                    </li>
                    <li>
                        <span>发送时间:</span>
                        <span>{{'2019/11/26 14:55'}}</span>
                    </li>
                    <li>
                        <span>收件人:</span>
                        <span>{{'test'}}</span>
                    </li>
                </ul>
            </div>
            <!-- 内容 -->
            <div class="content">
                <p class="p">
                    趣闻 1947 年，时装设计师 Elsa Schiaparelli 将“艳粉色”引入西方时尚圈。 桃色可以营造亲密氛围，减少攻击性和敌意。 由于听说粉色有一种镇定效果，有些球队会把客队的休息室漆成粉色。 对于粉色的研究发现，男性举重运动员在粉色房间内似乎感到力不从心，而女性举重运动员面对这种颜色反而会有变强的倾向。 糕点从粉色盒子里取出或盛在粉色盘子里时，尝起来会更美味（这种情况仅适用于甜点），因为粉色令我们渴望糖份。
                </p>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        id:String,
        // 是否是已发邮件(true: 已发邮件, false:收件箱)
        isSend: Boolean
    },
    data() {
        return {

        };
    },
    methods: {
        reply() {
            this.$router.push({
                path: '/email/sendemail',
                query:'传递的内容'
            })
        },
        goBack() {
            this.$emit('close')
        }
    },
    mounted() {
        console.log(this.id)
        console.log(this.isSend)
    },
};
</script>

<style scoped>
    .p10 {
        padding: 10px;
    }
    .ml10 {
        margin-left: 10px;
    }
    .body {
        padding: 30px 20px;
        margin-top: 20px;
        background: #f2f2f2;
    }
    .body .top {
        color: #4c8bfd;
    }
    .top >ul >li{
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
    .p{
        text-indent: 2em;
    }
</style>
