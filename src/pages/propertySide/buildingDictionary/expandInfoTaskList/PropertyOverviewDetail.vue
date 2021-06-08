<!--
    @file: 楼盘概况详情
    @description: 楼盘概况详情
    @author: xiebin
    @date: 2020.01.03
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
            <el-breadcrumb-item>楼盘概况</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="head-line">
            <h4>{{$route.query.projectName + $route.query.buildingType}} -- 楼盘概况</h4>
            <div v-if="getEditAuth && getEditAuth == 2">
                <auto-set-dynamic></auto-set-dynamic>
                <el-button
                    @click="gotoEdit"
                    type="primary">
                    编辑
                </el-button>
            </div>
        </div>
        <div class="modal-title-box header-title-box">
            <h3 class="title-content">楼盘相关</h3>
            <p class="origin-title" 
                v-if="currentRoleSource && currentRoleSource == 7 && infoOriginIsShow">信息来源:</p>
        </div>
        <div class="form-list-box">
            <el-form
                :model="projectSurveyInfo"
                label-width="120px"
                ref="subForm">
                <el-form-item
                    label="拿地时间:"
                    v-if="projectSurveyInfo.take_land">
                    <div class="form-input-box">
                        <p>{{projectSurveyInfo.take_land.field_value}}</p>
                    </div>
                    <p v-if="projectSurveyInfo.take_land.is_show_belong_role == '1'">{{spliceInfoOrigin(projectSurveyInfo.take_land)}}</p>
                </el-form-item>
                <el-form-item
                    label="拿地总价:"
                    v-if="projectSurveyInfo.take_land_price">
                    <div class="form-input-box">
                        <p>{{projectSurveyInfo.take_land_price.field_value !== '' ? projectSurveyInfo.take_land_price.field_value + '万元' : '' }}</p>
                    </div>
                    <p v-if="projectSurveyInfo.take_land_price.is_show_belong_role == '1'">{{spliceInfoOrigin(projectSurveyInfo.take_land_price)}}</p>
                </el-form-item>
                <el-form-item
                    label="容积率:"
                    v-if="projectSurveyInfo.far">
                    <div class="form-input-box">
                        <p>{{projectSurveyInfo.far.field_value}}</p>
                    </div>
                    <p v-if="projectSurveyInfo.far.is_show_belong_role == '1'">{{spliceInfoOrigin(projectSurveyInfo.far)}}</p>
                </el-form-item>
                <el-form-item
                    label="绿化率:"
                    v-if="projectSurveyInfo.greening">
                    <div class="form-input-box">
                        <p>{{projectSurveyInfo.greening.field_value}}</p>
                    </div>
                    <p v-if="projectSurveyInfo.greening.is_show_belong_role == '1'">{{spliceInfoOrigin(projectSurveyInfo.greening)}}</p>
                </el-form-item>
                <el-form-item
                    label="车位情况:"
                    v-if="projectSurveyInfo.car_space">
                    <div class="form-input-box">
                        <p>{{projectSurveyInfo.car_space.field_value}}</p>
                    </div>
                    <p v-if="projectSurveyInfo.car_space.is_show_belong_role == '1'">{{spliceInfoOrigin(projectSurveyInfo.car_space)}}</p>
                </el-form-item>
                <el-form-item
                    label="开发商:"
                    v-if="projectSurveyInfo.developer">
                    <div class="form-input-box">
                        <p class="text-style">{{projectSurveyInfo.developer.field_value}}</p>
                    </div>
                    <p v-if="projectSurveyInfo.developer.is_show_belong_role == '1'">{{spliceInfoOrigin(projectSurveyInfo.developer)}}</p>
                </el-form-item>
                <el-form-item
                    label="品牌开发商:"
                    v-if="projectSurveyInfo.brand_developer">
                    <div class="form-input-box">
                        <span
                            v-for="(item, index) in projectSurveyInfo.brand_developer.field_text"
                            :key="index">
                            {{ item + ' '}}
                        </span>
                    </div>
                    <p v-if="projectSurveyInfo.brand_developer.is_show_belong_role == '1'">{{spliceInfoOrigin(projectSurveyInfo.brand_developer)}}</p>
                </el-form-item>
                <el-form-item
                    label="供暖方式:"
                    v-if="projectSurveyInfo.heating">
                    <div class="form-input-box">
                        <p class="text-style">{{projectSurveyInfo.heating.field_value}}</p>
                    </div>
                    <p v-if="projectSurveyInfo.heating.is_show_belong_role == '1'">{{spliceInfoOrigin(projectSurveyInfo.heating)}}</p>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表格 -->
        <property-related-info-detail
            ref="tableData"
            v-if="allDataInfo"
            :tableDataInfo="allDataInfo" />
        <!-- 楼盘标签内容 -->
        <project-tag-content-detail
            v-if="projectTagContentList"
            :projectTagContentList="projectTagContentList" />
    </div>
</template>

<script>
import InfoOrigin from '../components/InfoOrigin';
import AutoSetDynamic from '../components/AutoSetDynamic';
import PropertyRelatedInfoDetail from './PropertyRelatedInfoDetail';
import ProjectTagContentDetail from './ProjectTagContentDetail';
import propertyApi from '../api/propretyOverview';
import moment from 'moment';
import { mapState } from "vuex";
export default {
    props: {
        // 角色信息
        currentRoleSource: {
            type: Number,
            default: 7
        },
        // 信息来源
        qdSourceList: {
            type: Array,
            default: () => []
        }
    },
    components: {
        // 信息来源
        InfoOrigin,
        // 楼盘楼栋相关信息
        PropertyRelatedInfoDetail,
        // 楼盘标签内容
        ProjectTagContentDetail,
        AutoSetDynamic
    },
    data() {
        return {
            // 面包屑text
           breadText: '楼盘列表',
            // 全部数据
            allDataInfo: null,
            // 楼盘相关
           projectSurveyInfo: {},
           // 楼盘标签内容
            projectTagContentList: null,
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
        // 初始化接口
        this.initPropertyDetailInfo();
        this.isOperation();
    },
    methods: {
        // 【父组件调用】快捷键编辑操作
        handleShortCut() {
            if (this.getEditAuth && this.getEditAuth == 2) {
                this.gotoEdit();
            }
        },
        // 跳转到编辑页面
        gotoEdit() {
            this.$emit('propertyChangeStatus', true);
        },
        // 初始化接口
        async initPropertyDetailInfo() {
            try {
                let params = {
                    project_id: this.$route.query.projectId,
                    task_id: this.$route.query.taskId
                };
                let result = await propertyApi.initPropertyDetailData(params);
                let { data } = result;
                if (data.code === 0) {
                    // 楼盘相关
                    this.projectSurveyInfo = data.data.project_survey_info.data;
                    // 整体数据
                    this.allDataInfo = data.data;
                    this.$store.dispatch('getAllTableData',data.data);
                    // 楼盘标签内容
                    if (data.data.project_survey_tag_info) {
                        this.projectTagContentList = data.data.project_survey_tag_info.data.tag;
                    }
                }
            }
            catch(error) {
                console.log(error);
            }
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
         * @return 传入的时间格式
         */
        filterDate(para, type) {
            return para === '' ? '' : moment(para * 1000).format('YYYY-MM-DD HH:mm:ss');
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
        }
    }
}
</script>

<style lang="less" scoped>
.content-box {
    padding: 15px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 7px;
    .head-line{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 15px;
        margin-top: 15px;
        font-size: 16px;
        h4 {
            flex: 1;
            padding-right: 20px;
        }
    }
    .header-title-box{
        justify-content: start;
        .title-content{
            width: 50%;
        }
        .origin-title{
            font-size: 15px;
            font-weight: bold;
        }
    }
    .form-list-box {
        margin-top: 15px;
        /deep/ .el-form-item__content {
            display: flex;
            flex-direction: row;
        }
        .form-input-box {
            width: 47%;
            .number-input-box {
                width: 86%;
                display: inline-block;
                margin-right: 5px;
            }
            .car-item {
                /deep/ .el-form-item__content {
                    display: flex;
                    flex-direction: column;
                }
                /deep/ .el-input{
                     width: 90%;
                }
            }
            /deep/ .el-select {
                margin-right: 5px;
            }
            .input-text {
                width: 86%;
            }
            /deep/ .el-textarea {
                width: 90%;
            }
            /deep/ .el-textarea__inner {
                min-height: 150px !important;
            }
            .el-icon-warning {
                color: #ff6e0e;
                font-size: 20px;
                margin-top: 10px;
                margin-left: 6px;
            }
            .text-style {
                word-break: break-all;
                width: 95%;
            }
        }
    }
    .footer-box {
        text-align: center;
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