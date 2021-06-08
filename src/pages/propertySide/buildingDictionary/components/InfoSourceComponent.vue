<!--
    @name: 信息来源组件，根据后期需要新复制的组件，由于原组件在大范围使用，涉及页面很多，所以新开这个组件
    @description: 楼盘动销信息页面 - 信息来源弹窗组件
    @author: xiejiaxin
    @date: 2020-08-24
-->
<template>
    <div class="info-source info-source-component-box">
        <!-- 如果isShowVal是true，表示正常展示，如果是false，表示 以不展示选中结果的 样式展示（表格顶部批量修改） -->
        <div v-if="isShowVal"
            :class="`source-content-wrap ${!canClear ? 'clear-content-wrap' : ''}`">
            <div class="source-content">
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
                <div class="other-box"
                    v-else>
                    <span class="other-tip">其他-</span>
                    <el-input
                        readonly
                        @focus="handFocus"
                        v-model="otherValue">
                    </el-input>
                </div>
            </div>
            <i class="iconfont iconicon-delete"
                aria-hidden="true"
                v-if="canClear"
                @click="clearOriginVal"></i>
        </div>
        <!-- 表格顶部箭头 -->
        <i class="iconfont iconxialajiantou"
            aria-hidden="true"
            v-else
            @click="handFocus"></i>
        <!-- isInFixed如果是true，表示弹窗放到了fixed的表格里面，需要单独处理 -->
        <el-dialog
            class="source-dialog"
            title="信息来源"
            center
            width="680px"
            :append-to-body="isInFixed"
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
                    class="other-origin other-input-inner"
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
     * @date 2020.08.24
     * @author xiejiaxin
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
            },
            // 是否在固定的表格列，如果是，需要把弹窗插入body中，否则弹窗层级会发生错误
            isInFixed: {
                type: Boolean,
                default: false
            },
            // 是否是表格顶部展示样式，表格顶部不展示结果
            isShowVal: {
                type: Boolean,
                default: true
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
        computed: {
            canClear() {
                return (this.originValue || this.otherValue);
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
                // 如果选择的时其他 则将id为-1的值推入，以展示其后对应的文字
                if (this.originValue === 10) {
                    if (this.otherValue === '') {
                        this.$message.error('请输入来源为其他对应的值');
                        this.hasSubmit = false;
                        return;
                    }
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
    .other-box {
        .other-tip {
            color: #409eff;
        }
    }
    .source-content-wrap {
        display: flex;
        .iconicon-delete {
            line-height: 28px;
            color: #aaa;
        }
    }
    .info-source-component-box {
        /deep/.el-input {
            width: 58px;
            background-color: transparent;
            .el-input__inner {
                height: 28px;
                line-height: 28px;
                padding: 0;
                border: none;
                background-color: transparent;
                cursor: pointer;
                color: #409eff;
            }
            .el-input__inner::-webkit-input-placeholder {
                color: #409eff;
                font-weight: normal;
            }
            .el-input__inner::-moz-placeholder {
                color: #409eff;
                font-weight: normal;
            }
            .el-input__inner:-ms-input-placeholder {
                color: #409eff;
                font-weight: normal;
            }
            .el-input__inner:-moz-placeholder {
                color: #409eff;
                font-weight: normal;
            }
            &.other-input-inner {
                .el-input__inner {
                    padding: 0 15px;
                    color: #606266;
                    border-radius: 4px;
                    border: 1px solid #dcdfe6;
                }
            }
        }
        /deep/.el-select {
            .el-input__suffix {
                display: none;
            }
        }
        .iconxialajiantou {
            margin-left: 2px;
            font-size: 20px;
            cursor: pointer;
        }
        .clear-content-wrap {
            /deep/.el-input {
                width: 74px;
            }
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
<style lang="less">
.source-dialog {
    .radio-group {
        /deep/.el-input {
            width: 80px;
            &.other-input-inner {
                .el-input__inner {
                    height: 28px;
                    line-height: 28px;
                    padding: 0 15px;
                    color: #606266;
                    border-radius: 4px;
                    border: 1px solid #dcdfe6;
                }
            }
        }
    }
}
</style>