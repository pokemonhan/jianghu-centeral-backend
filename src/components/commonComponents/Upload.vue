<template>
    <span :class="['v-upload','inline-block']">
        <span class="inline-block">
            <input
                class="v-upload-input"
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                ref="upload-input"
                @change="change"
            />
            <button :style="`width:${width}px`" :class="['up-btn',btnclass ? btnclass : 'btn-plain']" type="button" @click="chooseFile">
                <i v-if="showIcon" class="iconfont iconshangchuan"></i>
                <span>
                    {{title}}
                    <!-- <slot></slot> -->
                </span>
            </button>
        </span>
    </span>
</template>


<script>
export default {
    props: {
        /** 按钮样式 */
        btnclass: String,
        title: String,
        width: String,
        showIcon: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    methods: {
        change(e) {
            // let file = e.targe.files[0]
            this.$emit('change', e)
        },
        chooseFile() {
            this.$refs['upload-input'].click()
        }
    },
    mounted() {}
}
</script>

<style scoped>
/* .v-upload {
    width: 160px;
}
.v-upload > span {
    width: 100%;
} */
.iconshangchuan {
    margin-right: 10px;
}
.v-upload-input {
    width: 100%;
    height: 100%;
    display: none;
}
/* .small {
} */
.up-btn {
    display: inline-block;
    white-space: nowrap;
}
.btn-plain {
    padding: 4px 15px;
    box-sizing: border-box;
    color: #4c8bfd;
    border: 1px solid #4c8bfd;
    background-color: #fff;
}
.inline-block {
    display: inline-block;
}
</style>
