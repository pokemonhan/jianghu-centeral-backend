<template>
    <div class="v-tree">
        <ul class="lev1">
            <li v-for="(lev1, lev1_idx) in list" :key="lev1_idx" >
                <div class="title" >
                    <i class="iconfont iconup" @click="expand(lev1_idx)"></i>
                    <Checkbox class="checkbox-head" :label="lev1.label" v-model="lev1.checked" @update="checkBoxUpd($event, lev1_idx)" />
                </div>

                <!-- 内容 -->
                <ul class="lev2" :ref="lev1_idx" v-if="lev1.child">
                    <li v-for="(lev2, lev2_idx) in lev1.child" :key="lev2_idx">
                        <!-- <span class="title">{{lev2.label}}</span> -->
                        <Checkbox class="checkbox" :label="lev2.label" v-model="lev2.checked" @update="checkBoxUpd($event, lev1_idx+'-'+lev2_idx)" />
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
            checked:{}
        };
    },
    methods: {
        expand(index) {
            
            let ele = this.$refs[index]
            $(ele).slideToggle(200);
        },
        checkBoxUpd(bool, idx) {
            let idx_arr = idx.toString().split('-')
            let list = this.list
            /* 一级 */
            if(idx_arr.length === 1){
                if(list[idx].child){
                    list[idx].child.forEach(item=>{
                        item.checked = bool
                    })
                }
                /* 二级 */
            } else if (idx_arr.length === 2) {
                let lev1 = idx_arr[0]
                list[lev1].checked = list[lev1].child.every(item=>item.checked)
                
            }
            // this.list = this.list.map(item=>item)
            this.$emit('change', bool, idx, this.list)
        }
    },
    created() {
        // console.log('list', this.list)
        // this.list.forEach(item=>{
        //     item.checked = true
        //     if(item.child){
        //         console.log('item child',item.child)
        //         item.child.forEach(element => {
        //             console.log('element元素: ', element);
        //             element.checked = true
        //         });
        //     }
        // })
        // setTimeout(()=>{
        //     this.list = this.list
        // },200)
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
        /* text-align: left; */
    }
    .lev2 > li{
        /* text-align: left; */
    }
    .lev2 > li > span {
        display: inline-block;
        margin-top: 6px;
    }
    .title{
        display: flex;
    }
    .checkbox-head {
        font-weight: bold;
        font-size: 16px;
    }
    .lev2 .checkbox{
        /* margin-top: 10px; */
        padding: 5px 0;
    }
    .lev2 .v-checkbox {
        /* justify-content: start; */
    }
</style>
