<template>
    <!-- 进度条 -->
    <div class="steps">
        <!-- //current代表从调用页中传输过来的数字，代表当前的进度 -->
        <ul :currentData="current" id="ul">
            <template v-for="(item,index) in stepsData">
                <!-- //li标签通过从获取到的进度数字再结合当前的索引做类的不同状态 -->
                <li
                    :key="index"
                    v-if="currentData >= index + 1"
                    :class="stepsLength == 2 ? 'twoSteps1': stepsLength == 3 ? 'threeSteps1':stepsLength == 4 ? 'fourSteps1':stepsLength == 5 ? 'fiveSteps1':stepsLength == 6 ? 'sixSteps1':''"
                >
                    <p class="stepNum stepNumIndex" id="stepNum1">{{item.title}}</p>
                    <strong class="direction directionIndex">{{item.name}}</strong>
                </li>
                <li
                    :key="index"
                    v-else
                    :class="stepsLength == 2 ? 'twoSteps2': stepsLength == 3 ? 'threeSteps2':stepsLength == 4 ? 'fourSteps2':stepsLength == 5 ? 'fiveSteps2':stepsLength == 6 ? 'sixSteps2':''"
                >
                    <p class="stepNum">{{item.title}}</p>
                    <strong class="direction">{{item.name}}</strong>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
// 使用例子 // <Step current='3' :stepsData="stepsData"></Step>
// stepsData: [
//     { title: 1, name: '选择商品分类' },
//     { title: 2, name: '填写商品信息' },
//     { title: 3, name: '填写商品属性' },
//     { title: 4, name: '填写商品关联' }
// ]
export default {
    name: "Step",
    props: ['current', 'stepsData'],
    data() {
        return {
            currentData: 1,
            stepsLength: 2
        }
    },
    mounted() {
        this.ul()
    },
    updated() {
        //当页面更新的时候及时刷新
        this.ul()
    },
    methods: {
        ul() {
            //通过绑定dom获取到ul的自定义属性的属性值
            let ul = document.getElementById('ul')
            this.currentData = ul.getAttribute('currentData')
            this.stepsLength = this.stepsData.length
        }
    }
}
</script>

<style scoped>
/* @charset "UTF-8"; */
.steps {
    margin-top: 20px;
}

.steps ul {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
}

.steps ul li {
    float: left;
    position: relative;
}

.steps ul li .stepNum {
    width: 30px;
    height: 30px;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    margin: 0 auto 15px;
    font-size: 20px;
    color: #ccc;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
    font-weight: 700;
}

.steps ul li .stepNumIndex {
    background-color: #0099ff;
    color: #fff;
}

.steps ul li .direction {
    color: #999;
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
    font-weight: 700;
    font-size: 14px;
}

.steps ul li .directionIndex {
    color: #0099ff;
}

.steps ul .twoSteps1:nth-child(n)::before,
.steps ul .twoSteps2:nth-child(n)::before,
.steps ul .threeSteps1:nth-child(n)::before,
.steps ul .threeSteps2:nth-child(n)::before,
.steps ul .fourSteps1:nth-child(n)::before,
.steps ul .fourSteps2:nth-child(n)::before,
.steps ul .fiveSteps1:nth-child(n)::before,
.steps ul .fiveSteps2:nth-child(n)::before,
.steps ul .sixSteps1:nth-child(n)::before,
.steps ul .sixSteps2:nth-child(n)::before {
    content: '';
    position: absolute;
    top: 23px;
    right: 65px;
    bottom: 58px;
    width: auto;
}

.steps ul .twoSteps1:first-child::before,
.steps ul .twoSteps2:first-child::before,
.steps ul .threeSteps1:first-child::before,
.steps ul .threeSteps2:first-child::before,
.steps ul .fourSteps1:first-child::before,
.steps ul .fourSteps2:first-child::before,
.steps ul .fiveSteps1:first-child::before,
.steps ul .fiveSteps2:first-child::before,
.steps ul .sixSteps1:first-child::before,
.steps ul .sixSteps2:first-child::before {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;

}

.steps ul .twoSteps1:nth-child(n)::before {
    content: '';
    left: -950px;
    background-color: #0094ff;
}

.steps ul .twoSteps2:nth-child(n)::before {
    content: '';
    left: -950px;
    background-color: #e4e4e4;
}

.steps ul .threeSteps1:nth-child(n)::before {
    content: '';
    left: -443px;
    background-color: #0094ff;
}

.steps ul .threeSteps2:nth-child(n)::before {
    content: '';
    left: -443px;
    background-color: #e4e4e4;
}

.steps ul .fourSteps1:nth-child(n)::before {
    content: '';
    left: -274px;
    background-color: #0094ff;
    height: 2px;
}

.steps ul .fourSteps2:nth-child(n)::before {
    content: '';
    left: -210px;
    top: 14px;
    background-color: #587aeb;
}

.steps ul .fiveSteps1:nth-child(n)::before {
    content: '';
    left: -189px;
    background-color: #0094ff;
}

.steps ul .fiveSteps2:nth-child(n)::before {
    content: '';
    left: -189px;
    background-color: #e4e4e4;
}

.steps ul .sixSteps1:nth-child(n)::before {
    content: '';
    left: -138px;
    background-color: #0094ff;
}

.steps ul .sixSteps2:nth-child(n)::before {
    content: '';
    left: -138px;
    background-color: #e4e4e4;
}
</style>