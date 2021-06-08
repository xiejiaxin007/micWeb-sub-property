<!--
    @name: 信息来源组件
    @description: 楼盘动销信息页面 - 信息来源弹窗组件
    @author: 贺伟
    @date: 2019-12-10
-->
<template>
    <div class="info-source">
        <el-select
            v-if="originValue !== 10"
            v-model="originValue"
            class="source-val"
            :popper-append-to-body="false"
            @focus="handFocus"
            placeholder="请选择来源"
            clearable
            @clear="clearOriginVal">
            <el-option
                v-for="item in originList"
                :key="item.id"
                :label="item.text"
                :value="item.id">
            </el-option>
        </el-select>
        <el-input
            readonly
            @focus="handFocus"
            v-model="otherValue"
            v-else>
            <i class="el-icon-circle-close el-input__icon"
                aria-hidden="true"
                slot="suffix"
                @click="clearOriginVal">
            </i>
        </el-input>
        <el-dialog
            class="source-dialog"
            title="信息来源"
            center
            width="680px"
            @close="closeDialog"
            @open="openDialog"
            :visible.sync="dialogFormVisible">
            <el-radio-group
                class="radio-group"
                @change="radioChange"
                v-model="originValue">
                <el-radio
                    class="origin-radio"
                    v-for="(ele, idx) in originList"
                    :key="idx"
                    :label="ele.id">
                    {{ele.text}}
                </el-radio>
                <el-input
                    class="other-origin"
                    v-show="originValue == 10"
                    size="small"
                    v-model="otherValue">
                </el-input>
            </el-radio-group>
            <div
                slot="footer"
                class="dialog-footer">
                <el-button
                    type="primary"
                    @click="checkedCurVal">
                    提交
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    /**
     * 信息来源组件 v-model绑定的为来源单选对应值，必传。
     * prop:otherVal为选中其他的默认值，必填，请添加.sync 请添加.sync 修饰符,以实现prop双向绑定
     * @date 2019.12.10
     * @author 贺伟
     * @prop {string} otherVal 选中其他的默认值,必传
     * @prop {string} value 组件v-model绑定的值 默认读取value
     * @example 调用示例 <info-origin v-model="xxx" :other-val="myval"></info-origin>
     */
    import { commonFun } from '@/assets/js/utils/utils';
    export default {
        name: 'InfoOrigin',
        props: {
            // 来源选项的值
            value: {
                type: [String, Number],
                default: ''
            },
            // 选中其他时输入的值
            otherVal: {
                type: [String, Number],
                default: ''
            },
            // 信息来源选项数组
            originArr: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                // 弹窗显示隐藏
                dialogFormVisible: false,
                originList: commonFun.deepClone(this.originArr),
                // 来源的值
                originValue: this.value,
                // 其他自己输入的值
                otherValue: this.otherVal,
                hasSubmit: false
            }
        },
        watch: {
            // 监听value变化进行赋值
            value(newVal) {
                this.originValue = newVal;
            },
            // 监听其他值变化赋值本地
            otherVal(newVal) {
                this.otherValue = newVal;
            },
            originArr(newVal) {
                this.originList = commonFun.deepClone(newVal);
            }
        },
        methods: {
            // 清空orginval
            clearOriginVal() {
                this.originValue = '';
                this.otherValue = '';
                // 更新父组件的值
                this.$emit('input', this.originValue);
                this.$emit('update:otherVal', this.otherValue);
                // 触犯父组件变化函数
                this.$emit('change', this.originValue, this.otherValue);
            },
            // 弹窗打开事件
            openDialog() {
                this.hasSubmit = false;
            },
            // 弹窗关闭事件
            closeDialog() {
                if (this.hasSubmit) {
                    return;
                }
                this.originValue = this.value;
                this.otherValue = this.otherVal;
            },
            /**
             * radio值变化触发更新
             */
            radioChange(val) {
                // 清空otherval
                this.otherValue = '';
            },
            // 点击提交更新值 并关闭弹窗
            checkedCurVal() {
                this.hasSubmit = true;
                // let value = this.originValue;
                // 如果选择的时其他 则将id为-1的值推入，以展示其后对应的文字
                if (this.originValue === 10) {
                    if (this.otherValue === '') {
                        this.$message.error('请输入来源为其他对应的值');
                        this.hasSubmit = false;
                        return;
                    }
                    // value = -1;
                    // this.originList.push({
                    //     id: value,
                    //     text: this.otherValue
                    // });
                }
                // 更新父组件的值
                this.$emit('input', this.originValue);
                this.$emit('update:otherVal', this.otherValue);
                // 触犯父组件变化函数
                this.$emit('change', this.originValue, this.otherValue);
                this.dialogFormVisible = false;
            },
            /**
             * 组件获取焦点事件处理
             * @param {String} val 表单的值
             */
            handFocus() {
                // 如果下拉存在已经选择其他推入的值，则先删掉 清空
                // let index = this.originList.findIndex(ele => ele.id === -1);
                // if (index !== -1) {
                //     this.originList.splice(index, 1);
                // }
                // this.otherValue = '';
                this.dialogFormVisible = true;
                return false;
            }
        }
    }
</script>

<style lang="less" scoped>
    .info-source{
        padding: 0;
        display: block;
        line-height: 1;
        /deep/ .el-input{
            padding: 0;
        }
    }
    .radio-group {
        display: flex;
        align-items: center;
        height: 32px;
        overflow: initial;
        .origin-radio.el-radio{
            margin-right: 20px;
            /deep/ .el-radio__label{
                padding-left: 2px;
            }
        }
        .other-origin{
            width: 150px;
        }
    }
    .source-val {
        padding: 0;
        /deep/ .el-input{
            padding: 0;
            .el-input__suffix{
                right: 15px;
            }
        }
    }
    .source-dialog {
        /deep/ .el-dialog {
            display: block !important;
            > div {
                display: block;
            }
            .el-dialog__body{
                padding: 25px 20px;
            }
        }
    }
</style>