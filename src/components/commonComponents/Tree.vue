<template>
    <div class="v-tree">
        <ul class="lev1">
            <li v-for="(lev1, lev1_idx) in list" :key="lev1_idx" >
                <div class="title" @click="expand(lev1_idx)">
                    <i class="iconfont iconup"></i>
                    <span>{{lev1.label}}</span>
                </div>

                <!-- 内容 -->
                <ul class="lev2" :ref="lev1_idx" v-if="lev1.child">
                    <li v-for="(lev2, lev2_idx) in lev1.child" :key="lev2_idx">
                        <span>{{lev2.label}}</span>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>


<script>
export default {
    props: {
        list:{
            type: Array
        }
    },
    data() {
        return {

        };
    },
    methods: {
        expand(index) {
            
            let ele = this.$refs[index]
            $(ele).slideToggle(200);
        }
    },
    mounted() {
    },
};
</script>

<style scoped>
    .v-tree{
        user-select: none;
    }
    .lev1 .title{
        cursor: pointer;
    }
    .lev1 >li {
        margin-top: 10px;
    }
    
    .lev1 > li > .title > span{
        font-weight: 600;
    }
    .lev2{
        margin-left: 30px;
        font-size: 12px;
    }
    .lev2 > li > span {
        display: inline-block;
        margin-top: 6px;
    }
</style>
