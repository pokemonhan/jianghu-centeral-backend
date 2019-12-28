<template>
    <div class="container">
        分类管理
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>分类名称</span>
                    <Input class="w100" v-model="filter.acc" />
                </li>
                <li>
                    <span></span>
                </li>
                <li>
                    <span></span>
                </li>
                <li>
                    <span></span>
                </li>
            </ul>
        </div>
    </div>
</template> <script>
export default {
    data() {
        return { filter: { acc: '' } }
    },
    methods: {},
    mounted() {}
}
</script> <style scoped>
.w100 {
    width: 100px;
}
.p10 {
    padding: 10px;
}
</style>