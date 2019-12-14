<template>
    <div class="container">
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>账号:</span>
                    <Input class="w100" v-model="filter.acc" />
                </li>
                <li></li>
            </ul>
        </div>
    </div>
</template>


<script>
export default {
    props: {

    },
    data() {
        return {
            filter: {
                acc: '556456'
            }
        };
    },
    methods: {

    },
    mounted() {

    },
};
</script>

<style scoped>
.p10 {
    padding: 10px; 
}
</style>
