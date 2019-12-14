<template>
    <div class="v-switch">
        <span :class="['switch',size,me_checked?'switch-on': '']" :value="value" @click="toggle"></span>
    </div>
</template>

<script>
export default {
    name: 'Switchbox',
    props:{
        value: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'normal'
        },
        // color:{
        //     type :String,
        // }
    },
    model:{
        prop:'value',
        event: 'update'
    },
    data() {
        return {
            me_checked:this.value
        }
    },
    methods:{
        toggle(){
            this.me_checked = !this.me_checked;
        }
    },
    watch:{
        me_checked(val){
            this.$emit('update', val);
        },
        value(val){
            this.value = val
        }
    },
    mounted(){

    }
}
</script>

<style scoped>
/* 大背景 */
.v-switch{
    display: flex;
    justify-content: center;
}
.switch {
    display: block;
    position: relative;
    /* width: 52px;
        height: 32px; */
    width: 42px;
    height: 25px;
    border: 1px solid #aaa;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #aaa;
    transition: background-color 0.1s, border 0.1s;
    cursor: pointer;
}
.small {
    width: 35px;
    height: 20px;
    border-radius: 13px;
}
.small::before {
    width: 35px;
    height: 18px;
}
.small::after {
    width: 18px;
    height: 18px;
}
.normarl {
    width: 42px;
    height: 25px;
}
.normal::before {
    width: 40px;
    height: 23px;
}
.normal::after {
    width: 23px;
    height: 23px;
}
/* 小背景 */
.switch:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    /* width: 50px;
        height: 30px; */

    border-radius: 15px;
    background-color: rgb(175, 175, 175);
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.5, 1);
}
/* 小圆球 */
.switch:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    /* width: 30px;
        height: 30px; */

    border-radius: 50%;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}
/* 大背景变色 */
.switch-on {
    border-color: #1aad19;
    background-color: #1aad1a;
}
/* 小背景变色 */
.switch-on::before {
    border-color: #1aad19;
    background-color: #1aad19;
}
/* 小圆球位移 */
.switch-on:after {
    /* transform: translateX(20px); */
    transform: translateX(17px);
}
</style>