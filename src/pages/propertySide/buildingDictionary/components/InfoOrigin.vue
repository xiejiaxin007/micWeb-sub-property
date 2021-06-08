<!--
    @name: 信息来源组件
    @description: 楼盘动销信息页面 - 信息来源组件
    @author: 贺伟
    @date: 2019-12-09
-->
<template>
    <div class="info-origin">
        <div class="radio-box">
            <el-radio-group
                :class="{'radio-group': isBreak ? false : true, 'radio-break': isBreak}"
                @change="radioChange"
                v-model="originValue">
                <el-radio
                    class="origin-radio"
                    v-for="(ele, idx) in originArr"
                    :key="idx"
                    :label="ele.id">
                    {{ele.text}}
                </el-radio>
                <el-input
                    class="other-origin"
                    v-show="originValue == 10"
                    size="small"
                    v-model="otherValue"
                    @input="otherValInput">
                </el-input>
            </el-radio-group>
        </div>
        <div class="time-info">
            {{operateMsg}}
        </div>
    </div>
</template>

<script>
    /**
     * 信息来源组件 v-model绑定的为来源单选对应值，必传。
     * prop:otherVal为选中其他的默认值，必填，请添加.sync 请添加.sync 修饰符,以实现prop双向绑定
     * @date 2019.12.09
     * @author 贺伟
     * @prop {string} otherVal 选中其他的默认值,必传
     * @prop {string} operateMsg 组件底部默认的操作信息 不传则为空不展示信息
     * @prop {Array} originArr 渲染单选的标签数组 必传
     * @example 调用示例 <info-origin v-model="xxx" :other-val="myval" :operateMsg=""></info-origin>
     */
    export default {
        name: 'InfoOrigin',
        props: {
            // 选中其他值输入的值
            otherVal: {
                type: String,
                default: ''
            },
            // 来源选项的值
            value: {
                type: [String, Number],
                default: ''
            },
            // 组件下方操作信息
            operateMsg: {
                type: String,
                default: ''
            },
            // 信息来源是否换行
            isBreak: {
                type: Boolean,
                default: false
            },
            // 信息来源选项数组
            originArr: {
                type: Array,
                default: () => []
            }
        },
        watch: {
            value(newVal) {
                this.originValue = newVal;
            },
            otherVal(newVal) {
                this.otherValue = newVal;
            }
        },
        data() {
            return {
                // 来源的值
                originValue: this.value,
                // 其他自己输入的值
                otherValue: this.otherVal
            }
        },
        methods: {
            // 其他选项值变更触发
            otherValInput(val) {
                // 更新父组件对应的prop值
                this.$emit('update:otherVal', val);
                // 触发父组件变化函数
                this.$emit('change', this.originValue, this.otherValue);
            },
            /**
             * radio值变化触发更新
             */
            radioChange(val) {
                // 清空otherval
                this.otherValue = '';
                this.$emit('input', val);
                // 触发父组件变化函数
                this.$emit('change', val, this.otherValue);
                // 更新父组件对应的prop值
                this.$emit('update:otherVal', this.otherValue);
            }
        }
    }
</script>

<style lang="less" scoped>
    .radio-group{
        display: flex;
        align-items: center;
        height: 40px;
        .origin-radio.el-radio{
            margin-right: 7px;
            /deep/ .el-radio__label{
                padding-left: 4px;
            }
        }
        .other-origin{
            width: 71px;
        }
    }
    .radio-break {
        width: 322px;
        height: 40px;
        line-height: 26px;
        display: inline-block;
        margin-bottom: 24px;
        .origin-radio.el-radio{
            margin-right: 10px;
            /deep/ .el-radio__label{
                padding-left: 4px;
            }
        }
        .other-origin{
            width: 100px;
        }
    }
    .time-info{
        line-height: 1;
        color: #777;
    }
</style>