<!--
    @file: 楼盘名称&位置详情页
    @description: 楼盘名称&位置详情页
    @author: xiebin
    @date: 2019-12-14
-->
<template>
    <div class="content-box">
        <!--面包屑-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <a @click="goToListPage">{{breadText}}</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>楼盘名称&位置</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="form-list-box">
            <div class="head-line">
                <h4>{{$route.query.projectName + $route.query.buildingType}} -- 楼盘名称&位置</h4>
                <div>
                    <el-button
                        class="btn-user-reviews"
                        type="success"
                        @click="addUserReviews"
                        v-if="currentRoleSource && currentRoleSource == 7 && !$route.query.taskId">
                        新增用户点评
                    </el-button>
                    <auto-set-dynamic v-if="getEditAuth && getEditAuth == 2"
                        class="btn-editor"></auto-set-dynamic>
                    <el-button
                        v-if="getEditAuth && getEditAuth == 2"
                        class="btn-editor"
                        type="primary"
                        @click="editPageInfo">
                        编辑    
                    </el-button>
                </div>
            </div>
            <el-form label-width="100px">
                <el-form-item v-if="currentRoleSource && currentRoleSource == 7 && infoOriginIsShow"
                    class="form-head"
                    label="楼盘信息:">
                    <div class="form-input-box"></div>
                    <div><strong>信息来源：</strong></div>
                </el-form-item>
                <el-form-item
                    label="城市:"
                    v-if="projectDetailData.city_id">
                    <div class="form-input-box">
                        <p>{{projectDetailData.city_id.field_text}}</p>
                    </div>
                </el-form-item>
                <!-- 区域 -->
                <el-form-item
                    label="区域:"
                    v-if="projectDetailData.district_id">
                    <div class="form-input-box">
                        <p>{{projectDetailData.district_id.field_text}}</p>
                    </div>
                    <p v-if="projectDetailData.district_id.is_show_belong_role == '1'">{{spliceInfoOrigin(projectDetailData.district_id)}}</p>
                </el-form-item>
                <!-- 楼盘名称 -->
                <el-form-item
                    label="楼盘名称:"
                    v-if="projectDetailData.name">
                    <div class="form-input-box">
                        <p>{{projectDetailData.name.field_value}}</p>
                    </div>
                    <p v-if="projectDetailData.name.is_show_belong_role == '1'">{{spliceInfoOrigin(projectDetailData.name)}}</p>
                </el-form-item>
                <!-- 别名 -->
                <el-form-item
                    label="别名:"
                    v-if="projectDetailData.alias">
                    <div class="form-input-box">                        
                        <p>{{projectDetailData.alias.field_value}}</p>
                    </div>
                </el-form-item>
                <!-- 错别字别名 -->
                <el-form-item
                    label="错别字别名:"
                    v-if="projectDetailData.error_alias">
                    <div class="form-input-box">
                        <p>{{projectDetailData.error_alias.field_value}}</p>
                    </div>
                </el-form-item>
                <!-- 楼盘类型 -->
                <el-form-item
                    label="楼盘类型:"
                    v-if="projectDetailData.project_type">
                    <div class="form-input-box">
                        <p>{{projectDetailData.project_type.field_text}}</p>
                    </div>
                    <p v-if="projectDetailData.project_type.is_show_belong_role == '1'">{{spliceInfoOrigin(projectDetailData.project_type)}}</p>
                </el-form-item>
                <!-- 是否显示 -->
                <el-form-item
                    label="是否显示:"
                    v-if="projectDetailData.is_show">
                    <div class="form-input-box">
                        <p>{{projectDetailData.is_show.field_text}}</p>
                    </div>
                </el-form-item>
                <!-- 板块 -->
                <el-form-item
                    label="板块:"
                    v-if="projectDetailData.trade_area">
                    <div class="form-input-box">                        
                        <p>{{projectDetailData.trade_area.field_text}}</p>
                    </div>
                    <p v-if="projectDetailData.trade_area.is_show_belong_role == '1'">{{spliceInfoOrigin(projectDetailData.trade_area)}}</p>
                </el-form-item>
                <!-- 位置描述 -->
                <el-form-item
                    label="位置描述:"
                    v-if="projectDetailData.address">
                    <div class="form-input-box">
                        <p>{{projectDetailData.address.field_value}}</p>
                    </div>
                    <p v-if="projectDetailData.address.is_show_belong_role == '1'">{{spliceInfoOrigin(projectDetailData.address)}}</p>
                </el-form-item>
                <el-form-item
                    label="楼盘位置:"
                    v-if="projectDetailData.project_address">
                    <div class="form-input-box">
                        <p>{{projectDetailData.project_address.field_value}}</p>
                    </div>
                </el-form-item>
                <!-- 地图 -->
                <building-map
                    v-if="projectDetailData.project_address"
                    :warpWeptValone="warpWeptValone"
                    type="project"
                    labelName="楼盘位置:"
                    @getLngVal="getLngVal"
                    mapId="mapContaner"
                    inputId="suggestId"
                    :inputIsShow="false"
                    v-model="projectDetailData.project_address.field_value">
                </building-map>
                <!-- 楼盘经纬度 -->
                <el-form-item
                    label="楼盘经纬度:"
                    v-if="projectDetailData.lng && projectDetailData.lat">
                    <div class="form-input-box latitude-box">
                        <span>{{projectDetailData.lng.field_value}}</span>
                        {{projectDetailData.lng.field_value ? ',' : ''}}
                        <span>{{projectDetailData.lat.field_value}}</span>
                    </div>
                    <p v-if="projectDetailData.coordinate.is_show_belong_role == '1'">{{spliceInfoOrigin(projectDetailData.lng)}}</p>
                </el-form-item>
                <!-- 售楼处位置 -->
                <el-form-item
                    label="售楼处位置:"
                    v-if="projectDetailData.sale_office_address">
                    <div class="form-input-box">
                        <p>{{projectDetailData.sale_office_address.field_value}}</p>
                    </div>
                </el-form-item>
                <building-map
                    v-if="projectDetailData.sale_office_address"
                    :warpWeptVal="warpWeptVal"
                    type="salesOffPosition"
                    labelName="售楼处位置:"
                    @getLngVal="getLngVal"
                    mapId="mapContanerOne"
                    :inputIsShow="false"
                    inputId="suggestIdOne"
                    v-model="projectDetailData.sale_office_address.field_value">
                </building-map>
                <!-- 售楼处经纬度 -->
                <el-form-item
                    label="售楼处经纬度:"
                    v-if="projectDetailData.sale_office_lng && projectDetailData.sale_office_lat">
                    <div class="form-input-box latitude-box">
                        <span>{{projectDetailData.sale_office_lng.field_value}}</span>
                        {{projectDetailData.sale_office_lng.field_value ? ',' : ''}}
                        <span>{{projectDetailData.sale_office_lat.field_value}}</span>
                    </div>
                    <p v-if="projectDetailData.sale_office_lng.is_show_belong_role == '1'">{{spliceInfoOrigin(projectDetailData.sale_office_lng)}}</p>
                </el-form-item>
                <!-- 环线 -->
                <el-form-item
                    label="环线:"
                    v-if="projectDetailData.ring_road">
                    <div class="form-input-box">
                        <p>{{projectDetailData.ring_road.field_text === '请选择' ? '' : projectDetailData.ring_road.field_text}}</p>
                    </div>
                </el-form-item>
                <!-- 距近环 -->
                <el-form-item
                    label="距近环:"
                    v-if="projectDetailData.near_distance">
                    <div class="form-input-box">
                        <p>{{projectDetailData.near_distance.field_value !== '' ? projectDetailData.near_distance.field_value + 'km' : ''}}</p>
                    </div>
                </el-form-item>
                <!-- 距远环 -->
                <el-form-item
                    label="距远环:"
                    v-if="projectDetailData.far_distance">
                    <div class="form-input-box">
                        <p>{{projectDetailData.far_distance.field_value !== '' ? projectDetailData.far_distance.field_value + 'km' : ''}}</p>
                    </div>
                </el-form-item>
                <!-- 周边描述 -->
                <el-form-item
                    label="周边描述:"
                    v-if="projectDetailData.ambitus_text">
                    <div class="form-input-box">
                        <p>{{projectDetailData.ambitus_text.field_value}}</p>
                    </div>
                </el-form-item>
                <!-- 楼盘概述 -->
                <el-form-item
                    label="楼盘概述:"
                    v-if="projectDetailData.project_desc">
                    <div class="form-input-box">
                        <p>{{projectDetailData.project_desc.field_value}}</p>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import BuildingMap from '../components/BuildingMap';
import AutoSetDynamic from '../components/AutoSetDynamic';
import expandApi from '@/api/buildingDictionary/expandTagList';
import { mapState } from "vuex";
export default {
    name: 'BuildNamePoition',
    props: {
        // 页面ID
        pageId: {
            type: String,
            default: ''
        },
        // 角色ID
        currentRoleSource: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            // 详情数据列表
            projectDetailData: {},
            // 面包屑文案
            breadText: '楼盘列表',
            warpWeptVal: {},
            warpWeptValone: {},
            // 信息来源标题是否显示 如果所有的字段都没有信息来源 标题就不显示
            infoOriginIsShow: false
        }
    },
    computed: {
        ...mapState({
            // 获取通用配置信息
            getEditAuth: state => state.buildingDictionary.isAuditorAuth,
        })
    },
    mounted() {
        // 获取初始化数据
        this.getProjectNameAndPosData();
        this.isOperation();
    },
    methods: {
        // 【父组件调用】快捷键编辑操作
        handleShortCut() {
            if (this.getEditAuth && this.getEditAuth == 2) {
                this.editPageInfo();
            }
        },
        // 获取初始化数据
        async getProjectNameAndPosData() {
            let query = this.$route.query;
            let params = {
                project_id: query.projectId,
                page_id: this.pageId,
                task_id: query.taskId
            }
            try {
                let result = await expandApi.getProjectNameAndPositionData(params);
                let { data } = result;
                if (data.code === 0) {                    
                    this.projectDetailData = data.data.project_name_location.data;
                    // 楼盘经纬度赋值
                    this.warpWeptValone = {
                        lngVal: this.projectDetailData.lng.field_value || '',
                        latVal: this.projectDetailData.lat.field_value || ''
                    }
                    // 售楼处经纬度赋值
                    this.warpWeptVal = {
                        lngVal: this.projectDetailData.sale_office_lng.field_value || '',
                        latVal: this.projectDetailData.sale_office_lat.field_value || ''
                    }
                }
            }
            catch(error) {

            }
        },
        // 新增用户点评
        addUserReviews() {
            window.location.href = `/index.php?r=yw-user-project-comment%2Fcreate&city_id=${this.projectDetailData.city_id.field_value}&project_id=${this.$route.query.projectId}`
        },
        /**
         * 拼接信息来源信息
         * @param {object} originInfo 信息来源
         * @param {string} originInfo.belong_role_text 信息来源内容
         * @param {string} originInfo.belong_datetime 信息来源操作时间
         * @param {string} originInfo.belong_employee_name 信息来源操作人
         * @param {string} originInfo.belong_employee_id 信息来源操作人工号
         * @return {string} 信息来源操作信息
         */
        spliceInfoOrigin({belong_role_text, belong_datetime, belong_employee_name, belong_employee_id, belong_role, belong_other}) {
            if (belong_datetime === '') {
                return '';
            } else {
                this.infoOriginIsShow = true;
                if (belong_role == 10) {
                    return belong_role_text + '-' + belong_other + ' ' + this.filterDate(belong_datetime) + ' ' + belong_employee_name + '-' + belong_employee_id;
                } else {
                    return belong_role_text + ' ' + this.filterDate(belong_datetime) + ' ' + belong_employee_name + '-' + belong_employee_id;
                }
            }
        },
        /**
         * 时间戳转换为年月日格式
         * @param {string} para 时间、默认不取毫秒，即后三位毫秒为0
         * @param {string} type 要转换的格式 例如'YYYY-MM-DD HH:mm:ss'
         * return 传入的时间格式
         */
        filterDate(para, type) {
            return para === '' ? '' : moment(para * 1000).format('YYYY-MM-DD HH:mm:ss');
        },
        // 跳转到编辑页
        editPageInfo() {
            this.$emit('changeStatus', true);
        },
        /**
         * 获取楼盘&售楼处经纬度
         * @param {Object} e 经纬度集合
         */
        getLngVal(e) {
            if (e.type === 'project') {
                this.projectDetailData.lng.field_value = e.lngVal.lng;
                this.projectDetailData.lat.field_value = e.lngVal.lat;
            } else if (e.type === 'salesOffPosition') {
                this.projectDetailData.sale_office_lng.field_value = e.lngVal.lng;
                this.projectDetailData.sale_office_lat.field_value = e.lngVal.lat;
            }
        },
        // 判断角色修改面包屑文案
        isOperation() {
            if (this.$route.query.role === 'operation') {
                this.breadText = '楼盘列表';
            } else if (this.$route.query.role === 'expand') {
                this.breadText = '楼盘任务列表';
            }
        },
        // 修改点击面包屑跳转
        goToListPage() {
            if (this.$route.query.role === 'operation') {
                window.location.href = '/index.php?r=yw-projects/index';
            } else if (this.$route.query.role === 'expand') {
                this.$router.push({
                    path: '/building/ExpandTaskList'
                });
            }
        },
    },
    components: {
        BuildingMap,
        AutoSetDynamic
    }
}
</script>

<style lang="less" scoped>
.content-box {
    padding: 15px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 7px;
    /deep/ .el-form-item {
        margin-bottom: 0px;
    }
    .form-list-box {
        margin-top: 15px;
        .head-line{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 15px;
            font-size: 16px;
            min-height: 40px;
            h4 {
                flex: 1;
                padding-right: 20px;
            }
        }
        .form-head /deep/ .el-form-item__label{
            font-weight: bold;
            color: #333;
        }
        /deep/ .el-form-item__content {
            display: flex;
            flex-direction: row;
        }
        .form-input-box {
            width: 47%;
            margin-right: 20px;
        }
        .latitude-box {
            .in-stock-val {
                width: 40%;
                display: inline-block;
            }
            /deep/ .el-input {
                width: 100%;
            }
        }
        .btn-box {
            text-align: center;
            margin-top: 30px;
        }
    }
    /* 清除浮动 */
    .clear-float-box:after {
        display:block;
        clear:both;
        content:"";
        visibility:hidden;
        height:0;
    }
}
</style>