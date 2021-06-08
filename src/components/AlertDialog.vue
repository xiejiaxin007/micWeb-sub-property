<!--
 * @author: kangxue
 * @Date: 2020-09-04 16:46:19
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-30 10:53:03
 * @description: 单一功能，alert提示弹窗，插槽展示内容，就一个按钮关闭
-->
<template>
    <el-dialog :title="title"
        :visible="dialogVisble"
        :width="width"
        @close="close"
        center>
        <div class="slot-wrapper">
            <slot/>
        </div>
        <span slot="footer"
            class="dialog-footer">
            <el-button type="primary"
                @click="confirm">{{confirmBtn}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'AlertDialog',
    props: {
        // 弹窗标题
        title: {
            type: String,
            default: '提示'
        },
        // 是否展示弹窗
        visible: {
            type: Boolean,
            default: false
        },
        // 确认按钮文本
        confirmBtn: {
            type: String,
            default: '确定'
        },
        // 弹窗宽度  px值或者百分比
        width: {
            type: String,
            default: '350px'
        }
    },
    watch: {
        visible(newVal) {
            this.dialogVisble = newVal;
        }
    },
    data() {
        return {
            // 弹窗是否展示
            dialogVisble: this.visible
        }
    },
    methods: {
        close() {
            this.$emit('update:visible', false);
        },
        confirm() {
            this.$emit('update:visible', false);
            this.$emit('confirm');
        }
    }
};
</script>

<style lang="less" scoped>
.slot-wrapper {
    max-height: 400px;
    overflow: auto;
}
</style>