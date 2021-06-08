<!--
    @name: 放量和交房详情页
    @description: 放量和交房详情页 仅展示字段信息
    @author: 贺伟
    @date: 2020-01-04
-->
<template>
    <div class="info-detail">
        <!--放量计划信息-->
        <div v-if="capacityData">
            <div class="modal-title-box">
                <h3 class="title-content">放量计划</h3>
            </div>
            <div class="info-content-wrap">
                <el-table
                    :data="capacityData"
                    border>
                    <el-table-column
                        fixed
                        label="放量时间类型"
                        v-if="capacityData.length === 0 || capacityTableCol['volume_type']">
                        <template slot-scope="scope">
                            <div class="main-content">{{getValueOrText(scope.row.volume_type)}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.volume_type.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.volume_type)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="放量时间"
                        v-if="capacityData.length === 0 || capacityTableCol['volume_date_year']">
                        <template slot-scope="scope">
                            <div class="main-content">{{createDate(scope.row, '1')}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.volume_date_year.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.volume_date_year)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="关联户型"
                        v-if="capacityData.length === 0 || capacityTableCol['relation_house_types']">
                        <template slot-scope="scope">
                            <div class="main-content">{{scope.row.relation_house_types.field_text.join(',')}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.relation_house_types.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.relation_house_types)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="关联楼栋"
                        v-if="capacityData.length === 0 || capacityTableCol['relation_buildings']">
                        <template slot-scope="scope">
                            <div class="main-content">{{scope.row.relation_buildings.field_text.join(',')}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.relation_buildings.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.relation_buildings)}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <add-capacity-plan-btn class="add-plan-btn"
                    @toUrl="showGotoDialog({
                    path: 'capacityPlan',
                    isEdit: 1
                })"></add-capacity-plan-btn>
            </div>
        </div>
        <!--分期情况信息-->
        <div v-if="stageingData">
            <div class="modal-title-box">
                <h3 class="title-content">分期情况</h3>
            </div>
            <div class="info-content-wrap">
                <el-table
                    :data="stageingData"
                    border>
                    <el-table-column
                        label="分期名称"
                        v-if="stageingData.length === 0 || stageingTableCol['staging_name']">
                        <template v-if="scope.row.staging_name" slot-scope="scope">
                            <div class="main-content">{{scope.row.staging_name.field_value}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.staging_name.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.staging_name)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="分期销售状态"
                        v-if="stageingData.length === 0 || stageingTableCol['staging_sale_status']">
                        <template v-if="scope.row.staging_sale_status" slot-scope="scope">
                            <div class="main-content">{{getValueOrText(scope.row.staging_sale_status)}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.staging_sale_status.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.staging_sale_status)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="关联楼栋"
                        v-if="stageingData.length === 0 || stageingTableCol['relation_buildings']">
                        <template v-if="scope.row.relation_buildings" slot-scope="scope">
                            <div class="main-content">{{scope.row.relation_buildings.field_text.join(',')}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.relation_buildings.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.relation_buildings)}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--交房时间信息-->
        <div v-if="handroomData">
            <div class="modal-title-box">
                <h3 class="title-content">交房时间</h3>
            </div>
            <div class="info-content-wrap">
                <el-table
                    :data="handroomData"
                    border>
                    <el-table-column
                        label="交房时间类型"
                        v-if="handroomData.length === 0 || handroomTableCol['live_date_type']">
                        <template slot-scope="scope">
                             <div class="main-content">{{getValueOrText(scope.row.live_date_type)}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.live_date_type.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.live_date_type)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="交房时间"
                        v-if="handroomData.length === 0 || handroomTableCol['live_date_year']">
                        <template slot-scope="scope">
                            <div class="main-content">{{createDate(scope.row, '2')}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.live_date_year.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.live_date_year)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="关联楼栋"
                        v-if="handroomData.length === 0 || handroomTableCol['relation_buildings']">
                        <template slot-scope="scope">
                            <div class="main-content">{{scope.row.relation_buildings.field_text.join(',')}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.relation_buildings.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.relation_buildings)}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--建设阶段信息-->
        <div v-if="constructData">
            <div class="modal-title-box">
                <h3 class="title-content">建设阶段</h3>
            </div>
            <div class="info-content-wrap">
                <el-table
                    :data="constructData"
                    border>
                    <el-table-column
                        label="建设阶段"
                        v-if="constructData.length === 0 || constructTableCol['construction_stage']">
                        <template v-if="scope.row.construction_stage" slot-scope="scope">
                            <div class="main-content">{{getValueOrText(scope.row.construction_stage)}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.construction_stage.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.construction_stage)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="关联楼栋"
                        v-if="constructData.length === 0 || constructTableCol['relation_buildings']">
                        <template v-if="scope.row.relation_buildings" slot-scope="scope">
                            <div class="main-content">{{scope.row.relation_buildings.field_text.join(',')}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.relation_buildings.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.relation_buildings)}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getOriginOperateInfo
    } from '../utils/index';
    import {
        tendayList
    } from '../config/tabToggleList';
    import AddCapacityPlanBtn from '../components/AddCapacityPlanBtn.vue';
    export default {
        name: 'CapacityHandRoomDetail',
        components: {
            AddCapacityPlanBtn
        },
        props: {
            // 放量计划数据
            capacityData: {
                type: Array,
                default: () => []
            },
            // 分期情况数据信息
            stageingData: {
                type: Array,
                default: () => []
            },
            // 交房时间信息数据
            handroomData: {
                type: Array,
                default: () => []
            },
            // 建设阶段信息
            constructData: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                getOriginOperateInfo,
                // 放量需要展示的字段
                capacityTableCol: {},
                // 放量需要展示的字段
                stageingTableCol: {},
                // 放量需要展示的字段
                handroomTableCol: {},
                // 放量需要展示的字段
                constructTableCol: {}
            }
        },
        watch: {
            capacityData() {
                this.getDataField('capacityData', 'capacityTableCol');
            },
            stageingData() {
                this.getDataField('stageingData', 'stageingTableCol');
            },
            handroomData() {
                this.getDataField('handroomData', 'handroomTableCol');
            },
            constructData() {
                this.getDataField('constructData', 'constructTableCol');
            }
        },
        created() {
            // 初始放量交房分期等信息
            this.getDataField('capacityData', 'capacityTableCol');
            this.getDataField('stageingData', 'stageingTableCol');
            this.getDataField('handroomData', 'handroomTableCol');
            this.getDataField('constructData', 'constructTableCol');
        },
        methods: {
            // 获取要展示的字段 来判断字段是否显示
            getDataField(dataKey, colKey) {
                // 保存返回的此列是否展示来源的值 来源是否展示室一致的，不存在某一行来源展示，另一行数据不展示的情况,直接去第一行数据
                const firstData = this[dataKey][0] || {};
                Object.keys(firstData).forEach(item => {
                    // 储存需要展示的字段
                    this[colKey][item] = true;
                });
            },
            /**
             * 生成拼接日期
             * @param {Object} item 单行数据对象
             */
            createDate(item, type) {
                let year, month, day, tenday;
                if (type === '1') {
                    const {
                        // 放量时间
                        volume_date_year: {
                            field_value: volumeYear
                        },
                        volume_date_month: {
                            field_value: volumeMonth
                        },
                        volume_date_day: {
                            field_value: volumeDay
                        },
                        volume_date_ten: {
                            field_value: volumeTenday
                        }
                    } = item;
                    year = volumeYear;
                    month = volumeMonth;
                    day = volumeDay;
                    tenday = volumeTenday;
                } else if (type === '2') {
                    const {
                        // 放量时间
                        live_date_year: {
                            field_value: liveYear
                        },
                        live_date_month: {
                            field_value: liveMonth
                        },
                        live_date_day: {
                            field_value: liveDay
                        },
                        live_date_ten: {
                            field_value: liveTenday
                        }
                    } = item;
                    year = liveYear;
                    month = liveMonth;
                    day = liveDay;
                    tenday = liveTenday;
                }
                year = year && `${year}年`;
                month = Number(month) ? `${month}月` : '';
                day = Number(day) ? `${day}日` : '';
                tenday = Number(tenday) ? `${tendayList.find(ele => ele.value == tenday).text}` : '';
                return year + month + day + tenday;
            },
            /**
             * 判断是否室下拉的展示，展示对应的文本
             * @param {Object} item 对应的数据项
             */
            getValueOrText(item) {
                let content = item.field_value;
                // 需要展示文本的字段
                const showTextArr = ['volume_type', 'staging_sale_status', 'live_date_type', 'construction_stage'];
                // 需要展示单位万元的字段
                const showUnitArr = ['current_rate', 'price_min', 'price_max'];
                if (showUnitArr.includes(item.field_name)) {
                    content = `${item.field_value} 万元`
                }
                if (showTextArr.includes(item.field_name)) {
                    content = item.field_text;
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
    .info-content-wrap{
        margin-bottom: 15px;
        padding: 15px 0px;
    }
    .form-left-box{
        .filed-value{
            padding-right: 25px;
        }
    }
    .info-source{
        color: #bbb;
    }
    /deep/ .el-table th.gutter{ // 解决某些电脑缩放导致的表头错位
        display: table-cell!important;
    }
    .add-plan-btn {
        padding-top: 10px;
    }
</style>