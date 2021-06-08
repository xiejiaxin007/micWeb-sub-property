<!--
    @name: 放量计划详情页
    @description: 放量计划详情页 仅展示字段信息
    @author: 贺伟
    @date: 2019-12-23
-->
<template>
    <div class="info-detail">
        <!--楼盘信息-->
        <div v-if="infoData">
            <div class="info-detail-title">
                <h3 class="title-content">放量详情</h3>
            </div>
            <div class="info-content-wrap" v-if="infoData">
                <el-form
                label-width="140px">
                    <template v-for="(value, name) in infoData">
                        <el-form-item
                            :key="name"
                            v-if="!hideField.includes(name)"
                            class="form-item-wrap"
                            :label="`${value.field_name === 'volume_date_year'? '放量时间' : value.field_desc}：`">
                            <div class="form-left-box flex-box">
                                <div class="filed-value">{{getValueOrText(value)}}</div>
                                <div class="info-source" v-if="value.is_show_belong_role == 1">
                                    {{getOriginOperateInfo(value)}}
                                </div>
                            </div>
                        </el-form-item>
                    </template>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getOriginOperateInfo
    } from '../utils/index';
    export default {
        name: 'CapacityPlanDetail',
        props: {
            // 详情信息数据
            infoData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                getOriginOperateInfo
                // 定义不需要渲染的字段
                // hideField: ['id', 'volume_date_month', 'volume_date_day', 'volume_date_ten']
            }
        },
        computed: {
            hideField() {
                let baseFields = ['id', 'volume_date_month', 'volume_date_day', 'volume_date_ten'];
                if (this.infoData.is_need_paihao && this.infoData.is_need_paihao.field_value === '2') {
                    const waitingNums = ['paihao_status', 'paihao_start_datetime', 'paihao_end_datetime'];
                    baseFields.push(...waitingNums);
                    return baseFields;
                }
                return baseFields;
            }
        },
        created() {
            if (this.infoData.is_need_paihao && this.infoData.is_need_paihao.field_value === '2') {
                const waitingNums = ['paihao_status', 'paihao_start_datetime', 'paihao_end_datetime'];
                this.hideField.push(...waitingNums);
            }
        },
        methods: {
            /**
             * 判断是否室下拉的展示，展示对应的文本
             * @param {Object} item 对应的数据项
             */
            getValueOrText(item) {
                let content = item.field_value;
                // 需要展示文本的字段
                const showTextArr = ['volume_type', 'relation_house_types', 'relation_buildings', 'is_need_paihao', 'paihao_status'];
                /* const timeFormat = ['paihao_start_datetime', 'paihao_end_datetime'];
                if (timeFormat.includes(item.field_name)) {
                    content = content && filterDate(Number(content), 'YYYY-MM-DD');
                } */
                // 对放量日期进行特殊处理
                if (item.field_name === 'volume_date_year') {
                    content = item.field_text_all;
                }
                if (showTextArr.includes(item.field_name)) {
                    content = Array.isArray(item.field_text) ? item.field_text.join(',') : item.field_text;
                }
                return content;
            }
        }
    }
</script>

<style lang="less" scoped>
    .flex-box{
        display: flex;
    }
    .info-detail{
        padding: 0 10px;
    }
    .info-detail-title{
        padding: 0 15px 10px;
        border-bottom: 1px solid #dcdfe6;
        .title-content{
            font-size: 15px;
            font-weight: bold;
        }
    }
    .info-content-wrap{
        margin-bottom: 30px;
        padding: 20px 10px;
    }
    .form-left-box{
        .filed-value{
            padding-right: 25px;
        }
    }
    .info-source{
        color: #bbb;
    }
</style>