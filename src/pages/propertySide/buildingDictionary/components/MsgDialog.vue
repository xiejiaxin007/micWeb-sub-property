<!--
 * @author: hewei
 * @Date: 2019-09-28
 * @description：公共弹窗
 -->
<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisble"
        :width="width"
        :center="center"
        @close="close">
        <slot name="default"></slot>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary"
                v-if="!$scopedSlots.footer"
                @click="dialogConfirm">确认</el-button>
            <slot name="footer"></slot>
        </span>
    </el-dialog>
</template>

<script>
    /**
     * 公共弹窗组件 默认只有一个确认按钮，进行简单弹窗的展示
     * @date 2019.12.14
     * @author 贺伟
     * @prop {string} width 弹窗的宽度 可选值
     * @prop {string} dialogShow 弹窗的显示隐藏状元 必填值
     * @prop {string} center 弹窗内容是否居中 可选值
     * @prop {string} title 弹窗的title标题 可选值
     * @example 调用示例 <msg-dialog title="保存跳转提示" :dialog-show="dialogVisible">这是提示的内容</msg-dialog>
     * @update 添加组件注释
     * @updater 贺伟
     */
    export default {
        name: 'MsgDialog',
        data() {
            return {
                dialogVisble: this.dialogShow
            }
        },
        props: {
            width: {
                type: String,
                default: '30%'
            },
            dialogShow: {
                type: Boolean,
                default: false
            },
            center: {
                type: Boolean,
                default: true
            },
            title: {
                type: String,
                default: '提示'
            }
        },
        watch: {
            dialogShow(newVal) {
                this.dialogVisble = newVal;
            }
        },
        methods: {
            // 点击确认按钮触发事件
            dialogConfirm() {
                this.$emit('confirm');
            },
            // 弹窗关闭事件
            close() {
                this.$emit('closeDialog');
            }
        },
    }
</script>

<style lang="less" scoped>

</style>