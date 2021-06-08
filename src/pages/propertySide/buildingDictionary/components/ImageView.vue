<!--
    @name: 图集预览组件
    @description: 楼盘动销信息页面 - 图集预览组件
    @author: 贺伟
    @date: 2019-12-13
-->
<template>
    <div class="img-view">
        <image-preview-drag
            v-show="viewShow"
            :on-close="closeImgView"
            :url-list="srcList"></image-preview-drag>
    </div>
</template>

<script>
    import ImagePreviewDrag from './ImagePreviewDrag';
    export default {
        name: 'ImageView',
        components: {
            ImagePreviewDrag
        },
        props: {
            // 图片预览组件src的urlList
            srcList: {
                type: Array,
                default: () => []
            },
            vshow: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            vshow(newVal) {
                this.viewShow = newVal;
            }
        },
        data() {
            return {
                // 图片预览是否显示
                viewShow: false
            }
        },
        methods: {
            // 关闭当前预览
            closeImgView() {
                this.viewShow = false;
                this.$emit('update:vshow', false);
            },
            // 打开图片预览
            imgPreview() {
                this.viewShow = true;
                this.$emit('update:vshow', true);
            }
        }
    }
</script>
