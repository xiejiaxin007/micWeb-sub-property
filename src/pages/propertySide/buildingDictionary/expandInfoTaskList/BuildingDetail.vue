<!--
    @name: 楼栋详情页
    @description: 楼栋详情页仅展示字段信息
    @author: 贺伟
    @date: 2019-12-23
-->
<template>
    <div class="info-detail"  v-if="infoData">
        <!--楼盘信息-->
        <div class="project-info">
            <div class="building-info-title">
                <h3 class="title-content">基础信息</h3>
            </div>
            <div class="info-content-wrap" v-if="baseDetail">
                <el-form
                    label-width="120px">
                    <template v-for="(value, name) in baseDetail">
                        <el-form-item
                            :key="name"
                            v-if="!['id', 'above_floor_type'].includes(name)"
                            class="form-item-wrap"
                            :label="`${value.field_desc}：`">
                            <div class="form-left-box flex-box">
                                <div class="filed-value">{{getValueOrText(value)}}</div>
                                <div class="info-source" v-if="value.is_show_belong_role !== '2'">
                                    {{getOriginOperateInfo(value)}}
                                </div>
                            </div>
                        </el-form-item>
                    </template>
                </el-form>
            </div>
        </div>
        <div
            class="building-relative-info"
            v-if="!$route.query.taskId && roleNum == ROLENUMBER">
            <div class="building-info-title flex-box">
                <h3 class="title-content">楼栋关联信息</h3>
                <span class="msg-warn">相关信息的来源无法在该页面编辑</span>
            </div>
            <el-form
                :inline="true"
                v-if="relativeDetail"
                label-width="120px">
                <template v-for="(value, name) in relativeDetail">
                    <el-form-item
                        :key="name"
                        v-if="name!== 'relation_house_types'"
                        class="form-item-wrap"
                        :label="`${value.field_desc}：`">
                        <div class="form-left-box flex-box">
                            <div class="filed-value">{{value.field_text}}</div>
                        </div>
                    </el-form-item>
                </template>
                <el-form-item
                    :key="name"
                    class="form-item-wrap"
                    :label="`${dealwithHouse(relativeDetail).field_desc}：`">
                    <div class="form-left-box flex-box">
                        <div class="filed-value">{{dealwithHouse(relativeDetail).field_text}}</div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="building-pic" v-if="!$route.query.taskId && roleNum == ROLENUMBER">
            <div class="building-info-title">
                <h3 class="title-content">楼座图及打点</h3>
            </div>
            <div class="btn-box">
                <el-button
                    @click="goToBuildPos"
                    type="text">
                    进入楼座位置编辑页面
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getOriginOperateInfo
    } from '../utils/index';
    import {
        roleNumList
    } from '../config/tabToggleList';
    export default {
        name: 'CapacityPlanDetail',
        props: {
            // 详情信息数据
            infoData: {
                type: Object,
                default: () => {}
            },
            // 当前角色值 7为运营
            roleNum: {
                type: [String, Number],
                default: ''
            }
        },
        data() {
            return {
                getOriginOperateInfo,
                baseDetail: null,
                relativeDetail: null,
                // 获取运营角色值
                ROLENUMBER: roleNumList.yunYing
            }
        },
        watch: {
            infoData(newVal) {
                this.buildDataDealwith();
            }
        },
        mounted() {
            this.buildDataDealwith();
        },
        methods: {
            // 处理关联户型
            dealwithHouse(data) {
                return data && data.relation_house_types;
            },
            // 楼栋数据处理
            buildDataDealwith() {
                try {
                    this.baseDetail = this.infoData.building_base_detail && this.infoData.building_base_detail.data;
                    this.relativeDetail = this.infoData.building_relation_detail && this.infoData.building_relation_detail.data;
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 判断是否室下拉的展示，展示对应的文本
             * @param {Object} item 对应的数据项
             */
            getValueOrText(item) {
                let content = item.field_value;
                // 需要展示文本的字段
                const showTextArr = ['saling_status', 'relation_license_buildings', 'is_show'];
                if (showTextArr.includes(item.field_name)) {
                    content = item.field_text;
                }
                if (item.field_name === 'relation_license_buildings') {
                    content = item.field_text && item.field_text.join(',');
                }
                // 拼接单位
                switch (item.field_name) {
                    // 在售房源量
                    case 'on_sale_num':
                        content = content && `约${content}套`
                        break;
                    // 总户数
                    case 'total_house_num':
                        content = content && `${content}户`
                        break;
                    // 层高
                    case 'storey_height':
                        content = content && `${content} m`
                        break;
                    // 层高
                    case 'above_floor_num':
                        content = this.baseDetail.above_floor_type.field_value == 1 ? `最高 ${content}` : content;
                        break;
                    default:
                        break;
                }
                return content;
            },
            /**
             * 新页面打开链接
             * @param {String} type 要跳转地址type
             */
            goToBuildPos(type) {
                // 进入楼座位置编辑页面
                window.open(`/index.php?r=yw-projects%2Fview&project_id=${this.$route.query.projectId}&page_tag=view-common-info`);
            }
        }
    }
</script>

<style lang="less" scoped>
    .flex-box{
        display: flex;
    }
    .info-detail{
        border: 1px dotted #bbb;
        border-radius: 8px;
        padding: 10px;
        .head-line{
            padding-bottom: 8px;
            font-size: 16px;
            font-weight: bold;
        }
    }
    .building-info-title {
        position: relative;
        padding: 0 10px 10px;
        border-bottom: 1px solid #dcdfe6;
        .title-content {
            font-size: 15px;
            font-weight: bold;
        }
        .origin-title{
            position: absolute;
            left: 640px;
            top: 0;
        }
        .msg-warn {
            margin-left: 20px;
            color: #e94949
        }
    }
    .form-left-box{
        min-width: 280px;
        .filed-value{
            padding-right: 25px;
        }
    }
    .info-source{
        color: #bbb;
    }
</style>