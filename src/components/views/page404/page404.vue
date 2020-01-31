<template>
    <div class="login">
        <div class="inner ">
            <div>
                <img class="img-404" src="../../../assets/image/404.svg" alt="消失的图片"> <br>
                <span class="text-center">对不起，您请求的页面不存在、或已被删除、或暂时不可用</span>
                <br>
                <button class="btn-blue-large mt20" @click="goHome">返回首页</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
           
        }
    },
    methods: {
        goHome() {
            this.$router.push('/home')
        }
    },
    mounted() {
        // localStorage.clear()
    }
}
</script>

<style scoped>
 .icon {
       width: 1em; height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }
.login {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgb(245, 245, 245);
    text-align: center;
    /* background-image: url('../../assets/image/login/bg.jpg'); */
    background-repeat: no-repeat;
    background-size: cover;
}
.inner {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;

    width: 800px;
    height: 800px;
    margin-left: -400px;
    margin-top: -400px;
    border: 1px solid #eee;
    border-radius: 50%;
    transition: box-shadow .5s linear;
}
.inner:hover {
    box-shadow: 0 10px 59px 0 rgba(4, 0, 0, 0.3);
}
.img-404 {
    width: 100%;
    max-width: 1000px;
}
.text-center {
    width: 100%;
    margin-top: 20px;
    font-size: 26px;
    text-align:center;
    /* border: 1px solid #000; */
}

</style>


