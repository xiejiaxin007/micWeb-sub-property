<!--
 * @author: kangxue
 * @Date: 2020-09-03 22:20:31
 * @LastEditors: kangxue
 * @LastEditTime: 2020-11-30 15:19:10
 * @description: 单一功能，confirm提示弹窗，两个按钮
-->
<template>
    <el-dialog :title="title"
        :visible.sync="dialogVisble"
        :width="width"
        @close="cancel"
        center>
        <div class="confirm-info">{{content}}</div>
        <span slot="footer"
            class="dialog-footer">
            <el-button type="primary"
                class="confirm-btn"
                @click="confirm">{{confirmBtn}}</el-button>
            <el-button @click="cancel"
                class="cancel-btn">{{cancelBtn}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'ConfirmDialog',
    props: {
        // 弹窗标题
        title: {
            type: String,
            default: '提示'
        },
        // 提示内容
        content: {
            type: String,
            default: ''
        },
        // 是否展示弹窗
        visible: {
            type: Boolean,
            default: false
        },
        // 取消按钮文本
        cancelBtn: {
            type: String,
            default: '取消'
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
        };
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        confirm() {
            this.$emit('confirm');
        }
    }
};
</script>

<style>
</style>