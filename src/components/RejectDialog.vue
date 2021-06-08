<!--
 * @author: kangxue
 * @Date: 2020-08-20 14:25:32
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-21 18:14:24
 * @description: 驳回弹窗组件，仅只是驳回原因书写，可控制字数
        <reject-dialog title="驳回"
            :visible="rejectVisible"
            @close="rejectVisible = false"
            @confirm="confirmReject"></reject-dialog>
-->
<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisble"
        @close="cancelReject"
        :close-on-click-modal="false"
        width="550px"
        center
    >
        <el-form
            :model="rejectForm"
            ref="rejectForm"
        >
            <el-form-item
                prop="reason"
                :label="label"
                :rules="{ required: isRequired, message: this.label + '不能为空', trigger: 'blur' }"
            >
                <el-input
                    type="textarea"
                    :placeholder="'请填写'+label+'，最多'+maxLength+'字，超出无法输入'"
                    :maxlength="maxLength"
                    :autosize="{ minRows: 5, maxRows: 10}"
                    resize="none"
                    v-model.trim="rejectForm.reason"
                ></el-input>
            </el-form-item>
        </el-form>
        <div
            slot="footer"
            class="dialog-footer"
        >
            <el-button @click="cancelReject">{{cancelBtn}}</el-button>
            <el-button
                type="primary"
                @click="confirmReject"
            >{{confirmBtn}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'reject-dialog',
        props: {
            // 弹窗标题
            title: {
                type: String,
                default: '',
            },
            // 是否展示弹窗
            visible: {
                type: Boolean,
                default: false,
            },
            // 驳回原因限制字数
            maxLength: {
                type: Number,
                default: 300,
            },
            // 文本描述
            label: {
                type: String,
                default: '驳回原因',
            },
            // 取消按钮文本
            cancelBtn: {
                type: String,
                default: '取消',
            },
            // 确认按钮文本
            confirmBtn: {
                type: String,
                default: '确定',
            },
            // 是否校验必填
            isRequired: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                // 弹窗展示
                dialogVisble: this.visible,
                // 驳回表单
                rejectForm: {
                    reason: '',
                },
            };
        },
        watch: {
            // 监听是否展示弹窗
            visible(newVal) {
                this.dialogVisble = newVal;
            },
        },
        methods: {
            // 关闭弹窗时重置表单
            cancelReject() {
                this.$refs.rejectForm.resetFields();
                this.$emit('close');
            },
            confirmReject() {
                if (this.isRequired) {
                    this.$refs.rejectForm.validate(valid => {
                        if (valid) {
                            this.$emit('confirm', this.rejectForm.reason);
                        }
                    });
                } else {
                    this.$emit('confirm', this.rejectForm.reason);
                }
            },
        },
    };
</script>

