<template>
    <div class="v-upload">
        <div>
            <input
                class="v-upload-input"
                type="file"
                accept="image/png, image/jpg, image/gif"
                ref="upload-input"
                @change="change"
            />
            <button :style="`width:${width}px`" class="btn" type="button" @click="chooseFile">
                <i v-if="showIcon" class="iconfont iconshangchuan"></i>
                <span>
                    {{title}}
                    <!-- <slot></slot> -->
                </span>
            </button>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        title:String,
        width:String,
        showIcon:{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    methods: {
        change(e){
            // let file = e.targe.files[0]
            this.$emit('change', e)
        },
        chooseFile() {
            this.$refs['upload-input'].click()
        },
    },
    mounted() {}
}
</script>

<style scoped>
/* .v-upload {
    width: 160px;
}
.v-upload > div {
    width: 100%;
} */
.iconshangchuan{
    margin-right: 10px;
}
.v-upload-input {
    width: 100%;
    display: none;
}
.btn{
    width: 100%;
}
</style>
