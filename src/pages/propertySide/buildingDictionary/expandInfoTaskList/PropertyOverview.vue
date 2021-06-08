<!--
    @file: 楼盘概况
    @description: 楼盘概况
    @author: xiebin
    @date: 2019-12-30
-->
<template>
    <div
        class="content-box"
        v-loading="saveLoading">
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
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="head-line">
            <h4>{{$route.query.projectName + $route.query.buildingType}} -- 楼盘概况</h4>
        </div>
        <div class="modal-title-box header-title-box">
            <h3 class="title-content">楼盘相关</h3>
            <p class="origin-title"
                v-if="currentRoleSource && currentRoleSource == 7">信息来源：</p>
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
                        <!-- 日期选择 -->
                        <date-select-border
                            v-model="projectSurveyInfo.take_land.field_value"
                            @getTime="getTime" />
                    </div>
                    <info-origin
                        v-if="projectSurveyInfo.take_land.is_show_belong_role == '1'"
                        v-model="projectSurveyInfo.take_land.belong_role"
                        :other-val.sync="projectSurveyInfo.take_land.belong_other"
                        :operate-msg="spliceInfoOrigin(projectSurveyInfo.take_land)"
                        :originArr="qdSourceList">
                    </info-origin>
                </el-form-item>
                <el-form-item
                    label="拿地总价:"
                    v-if="projectSurveyInfo.take_land_price">
                    <div class="form-input-box">
                        <jl-number-input
                            v-model="projectSurveyInfo.take_land_price.field_value"
                            minVal="0.0001"
                            maxVal="9999999.9999"
                            reg="fourNum">
                        </jl-number-input> 万元
                    </div>
                    <info-origin
                        v-if="projectSurveyInfo.take_land_price.is_show_belong_role == '1'"
                        v-model="projectSurveyInfo.take_land_price.belong_role"
                        :other-val.sync="projectSurveyInfo.take_land_price.belong_other"
                        :operate-msg="spliceInfoOrigin(projectSurveyInfo.take_land_price)"
                        :originArr="qdSourceList">
                    </info-origin>
                </el-form-item>
                <el-form-item
                    label="容积率:"
                    v-if="projectSurveyInfo.far">
                    <div class="form-input-box">
                        <jl-number-input
                            v-model="projectSurveyInfo.far.field_value"
                            minVal="0.01"
                            maxVal="99.99"
                            reg="twoNum">
                        </jl-number-input>
                    </div>
                    <info-origin
                        v-if="projectSurveyInfo.far.is_show_belong_role == '1'"
                        v-model="projectSurveyInfo.far.belong_role"
                        :other-val.sync="projectSurveyInfo.far.belong_other"
                        :operate-msg="spliceInfoOrigin(projectSurveyInfo.far)"
                        :originArr="qdSourceList">
                    </info-origin>
                </el-form-item>
                <el-form-item
                    label="绿化率:"
                    v-if="projectSurveyInfo.greening">
                    <div class="form-input-box">
                        <jl-number-input
                            v-model="projectSurveyInfo.greening.field_value"
                            minVal="0.01"
                            maxVal="99.99"
                            reg="twoNum">
                        </jl-number-input> %
                    </div>
                    <info-origin
                        v-if="projectSurveyInfo.greening.is_show_belong_role == '1'"
                        v-model="projectSurveyInfo.greening.belong_role"
                        :other-val.sync="projectSurveyInfo.greening.belong_other"
                        :operate-msg="spliceInfoOrigin(projectSurveyInfo.greening)"
                        :originArr="qdSourceList">
                    </info-origin>
                </el-form-item>
                <el-form-item
                    label="车位情况:"
                    v-if="projectSurveyInfo.car_space">
                    <div class="form-input-box">
                        <el-input
                            class="input-text"
                            v-model="projectSurveyInfo.car_space.field_value">
                        </el-input>
                    </div>
                    <info-origin
                        v-if="projectSurveyInfo.car_space.is_show_belong_role == '1'"
                        v-model="projectSurveyInfo.car_space.belong_role"
                        :other-val.sync="projectSurveyInfo.car_space.belong_other"
                        :operate-msg="spliceInfoOrigin(projectSurveyInfo.car_space)"
                        :originArr="qdSourceList">
                    </info-origin>
                </el-form-item>
                <el-form-item
                    label="开发商:"
                    v-if="projectSurveyInfo.developer">
                    <div class="form-input-box">
                        <el-input
                            v-model="projectSurveyInfo.developer.field_value"
                            class="input-text"
                            maxlength="255"
                            placeholder="请输入开发商">
                        </el-input>
                    </div>
                    <info-origin
                        v-if="projectSurveyInfo.developer.is_show_belong_role == '1'"
                        v-model="projectSurveyInfo.developer.belong_role"
                        :other-val.sync="projectSurveyInfo.developer.belong_other"
                        :operate-msg="spliceInfoOrigin(projectSurveyInfo.developer)"
                        :originArr="qdSourceList">
                    </info-origin>
                </el-form-item>
                <el-form-item
                    label="品牌开发商:"
                    v-if="projectSurveyInfo.brand_developer">
                    <div class="form-input-box">
                        <el-select
                            class="no-shake-select"
                            v-model="projectSurveyInfo.brand_developer.field_value"
                            placeholder="请选择品牌开发商"
                            filterable
                            multiple>
                            <el-option
                                v-for="item in brandDevalopSelOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <info-origin
                        v-if="projectSurveyInfo.brand_developer.is_show_belong_role == '1'"
                        v-model="projectSurveyInfo.brand_developer.belong_role"
                        :other-val.sync="projectSurveyInfo.brand_developer.belong_other"
                        :operate-msg="spliceInfoOrigin(projectSurveyInfo.brand_developer)"
                        :originArr="qdSourceList">
                    </info-origin>
                </el-form-item>
                <el-form-item
                    label="供暖方式:"
                    v-if="projectSurveyInfo.heating">
                    <div class="form-input-box">
                        <el-input
                            v-model="projectSurveyInfo.heating.field_value"
                            class="input-text"
                            placeholder="请选择供暖方式"
                            maxlength="100">
                        </el-input>
                    </div>
                    <info-origin
                        v-if="projectSurveyInfo.heating.is_show_belong_role == '1'"
                        v-model="projectSurveyInfo.heating.belong_role"
                        :other-val.sync="projectSurveyInfo.heating.belong_other"
                        :operate-msg="spliceInfoOrigin(projectSurveyInfo.heating)"
                        :originArr="qdSourceList">
                    </info-origin>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表格 -->
        <property-related-info
            ref="tableData"
            v-if="allDataInfo"/>
        <!-- 楼盘标签内容 -->
        <project-tag-content
            ref="projectTag"
            v-if="projectTagContentList"
            :projectTagContentList="projectTagContentList" />
        <div class="footer-box">
            <el-button
                @click="cancel">取消</el-button>
            <el-button
                type="primary"
                @click="saveDate">
                保存
            </el-button>
        </div>
    </div>
</template>

<script>
import DateSelectBorder from '../components/DateSelectBorder';
import InfoOrigin from '../components/InfoOrigin';
import PropertyRelatedInfo from './PropertyRelatedInfo';
import ProjectTagContent from './ProjectTagContent';
import propertyApi from '../api/propretyOverview';
import moment from 'moment';
import { isRequiredInfoOrigin } from '../utils/index';
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
        DateSelectBorder,
        // 信息来源
        InfoOrigin,
        // 楼盘楼栋相关信息
        PropertyRelatedInfo,
        // 楼盘标签内容
        ProjectTagContent
    },
    data() {
        return {
            // 面包屑text
           breadText: '楼盘列表',
            // 全部数据
            allDataInfo: null,
            // 楼盘相关
           projectSurveyInfo: {},
           projectSurveyInfoCopy: [],
            // 品牌开发商下拉
            brandDevalopSelOptions: [],
            // 楼盘标签内容
            projectTagContentList: null,
            // 产权年限为空是否继续保存
            confimIsEmpty: true,
            saveLoading: false
        }
    },
    mounted() {
        this.isOperation();
        // 初始化接口
        this.initPropertyDetailInfo();
        // 品牌开发商下拉
        this.brandDevelopSelList();
        // 将导入的方法绑定到实例上
        this.isRequiredInfoOrigin = isRequiredInfoOrigin;
    },
    methods: {
        // 【父组件调用】快捷键保存操作
        handleShortCut() {
            this.saveDate();
        },
        // 返回
        cancel() {
            this.$emit('propertyChangeStatus', false);
        },
        // 保存数据
        async saveDate() {
            // 当拿地时间的下拉框被选择后再赋值
            // 表格数据
            let tableData = this.$refs['tableData'].pushDataToParent().allTableVal;
            // 产权年限
            let projectPropertyYearInfo = tableData.propertyYear.newData;
            let projectPropertyYearInfoCopy = tableData.propertyYear.originData;
            let projectPropertyYearisEmpty = tableData.propertyYear.isEmpty;
            let projectPropertyYearIsRepeat = tableData.propertyYear.isRepeat;
            // 建筑类型
            let buildingType = tableData.buildingType.newData;
            let buildingTypeCopy = tableData.buildingType.originData;
            // 物业公司
            let propertyCompany = tableData.propertyCompany.newData;
            let propertyCompanyCopy = tableData.propertyCompany.originData;
            let propertyCompanyIsRepeat = tableData.propertyCompany.isRepeat;
            // 物业费
            let propertyPrice = tableData.propertyPrice.newData;
            let propertyPriceCopy = tableData.propertyPrice.originData;
            let propertyPriceIsRepeat = tableData.propertyPrice.isRepeat;
            // 水电气
            let Hydroelectric = tableData.Hydroelectric.newData;
            let HydroelectricCopy = tableData.Hydroelectric.originData;
            let HydroelectricIsRepeat = tableData.Hydroelectric.isRepeat;
            // 装修情况
            let decorationStatus = tableData.decorationStatus.newData;
            let decorationStatusCopy = tableData.decorationStatus.originData;
            let decorationStatusIsRepeat = tableData.decorationStatus.isRepeat;
            // 校验拿地时间是否小于当前时间
            if (!this.checkTimeIsCurrentTime(this.projectSurveyInfo.take_land.field_value) && this.projectSurveyInfo.take_land.field_value !== '') {
                this.$message({
                    type: 'warning',
                    message: '拿地时间不能大于当前时间'
                })
                return false;
            }
            // 楼盘相关表单的信息来源
            let projectFormFlag = this.isRequiredInfoOrigin(this.projectSurveyInfoCopy, [this.projectSurveyInfo], true, '', true);
            if (!projectFormFlag) {
                return false;
            }
            // 校验产权年限信息来源是否为空
            let projectYearFlag = this.isRequiredInfoOrigin(projectPropertyYearInfoCopy, projectPropertyYearInfo, true, '产权年限模块', false);
            if (!projectYearFlag) {
                return false;
            }
            // 校验产权年限其他的值是否重复填写
            if (projectPropertyYearIsRepeat) {
                this.$message({
                    type: 'warning',
                    message: '产权年限-其他的值不能重复输入!'
                })
                return false;
            }
            // 校验建筑类型来源是否为空
            let buildingTypeFlag = this.isRequiredInfoOrigin(buildingTypeCopy, buildingType, true, '建筑类型模块', false);
            if (!buildingTypeFlag) {
                return false;
            }
            // 校验物业公司来源是否为空
            let propertyCompanyFlag = this.isRequiredInfoOrigin(propertyCompanyCopy, propertyCompany, true, '物业公司模块', false);
            if (!propertyCompanyFlag) {
                return false;
            }
            // 校验物业公司是否选择重复
            if (propertyCompanyIsRepeat) {
                this.$message({
                    message: '物业公司不能重复选择!',
                    type: 'warning'
                });
                return false;
            }
            // 校验物业费来源是否为空
            let propertyPriceFlag = this.isRequiredInfoOrigin(propertyPriceCopy, propertyPrice, true, '物业费模块', false);
            if (!propertyPriceFlag) {
                return false;
            }
            // 校验物业费不能重复输入
            if (propertyPriceIsRepeat) {
                this.$message({
                    message: '物业费不能重复输入!',
                    type: 'warning'
                });
                return false;
            }
            // 校验水电气来源是否为空
            let HydroelectricFlag = this.isRequiredInfoOrigin(HydroelectricCopy, Hydroelectric, true, '水电气模块', false);
            if (!HydroelectricFlag) {
                return false;
            }
            // 校验水电气不能重复输入
            if (HydroelectricIsRepeat) {
                this.$message({
                    message: '水电气不能重复输入!',
                    type: 'warning'
                });
                return false;
            }
            // 校验装修情况来源是否为空
            let decorationStatusFlag = this.isRequiredInfoOrigin(decorationStatusCopy, decorationStatus, true, '装修情况模块', false);
            if (!decorationStatusFlag) {
                return false;
            }
            // 校验装修情况-装修单位+装修费用的值是否重复填写
            if (decorationStatusIsRepeat) {
                this.$message({
                    type: 'warning',
                    message: '装修情况-装修单位、装修费用的值不能重复输入!'
                })
                return false;
            }
            // 是否有产权年限校验
            if (projectPropertyYearisEmpty && this.confimIsEmpty) {
                this.$confirm('该楼盘无产权年限，请确认是否添加后保存！', '提示', {
                    confirmButtonText: '不添加',
                    cancelButtonText: '添加',
                    type: 'warning'
                }).then(() => {
                    this.confimIsEmpty = false;
                    this.saveDate();
                    this.$message({
                        type: 'success',
                        message: '确认成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    }); 
                          
                });
                return false;
            }
            try {
                this.saveLoading = true;
                let params = {
                    project_id: this.$route.query.projectId,
                    task_id: this.$route.query.taskId,
                    params: this.concatData()
                }
                let result = await propertyApi.saveInfoData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.saveLoading = false;
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    // 跳转到查看页面
                    this.$emit('propertyChangeStatus', false);
                } else {
                    this.saveLoading = false;
                    this.$message(data.msg);
                }
            }
            catch (error) {
                this.saveLoading = false;
                console.log(error);
            }
        },
        // 保存时数据整合
        concatData() {
            // 表格数据
            let tableData = this.$refs['tableData'].pushDataToParent().allTableVal;
            return {
                // 楼盘信息
                project_survey_info: {
                    module_name: this.projectSurveyName,
                    data: this.projectSurveyInfo
                },
                // 产权年限
                project_property_year_info: {
                    module_name: this.projectYearName,
                    data: tableData.propertyYear.newData
                },
                // 建筑类型
                project_construct_type_info: {
                    module_name: this.projectTypeName,
                    data: tableData.buildingType.newData
                },
                // 物业公司
                project_property_company_info: {
                    module_name: this.projectCompanyName,
                    data: tableData.propertyCompany.newData
                },
                // 物业费
                project_property_fee_info: {
                    module_name: this.projectPriceName,
                    data: tableData.propertyPrice.newData
                },
                // 水电气
                project_water_electy_info: {
                    module_name: this.projectHydroelectricName,
                    data: tableData.Hydroelectric.newData
                },
                // 装修情况
                project_decorate_info: {
                    module_name: this.projectStatusName,
                    data: tableData.decorationStatus.newData
                },
                // 标签内容
                project_survey_tag_info: {
                    module_name: this.projectTagName,
                    data: this.$refs['projectTag'] && this.$refs['projectTag'].pushDataToParent().newData
                }
            }
        },
        // 校验拿地时间是否大于当前时间
        checkTimeIsCurrentTime(takeLandTime) {
            let flag = true;
            let dateStr = takeLandTime;
            dateStr = dateStr.replace('年', '-');
            dateStr = dateStr.replace('月', '-');
            dateStr = dateStr.replace('日', '-');
            let newstr = dateStr.replace(/-/g,'/');
            // 编辑的时间
            let newDate = new Date(newstr);
            // 当前时间
            let currentDate = new Date();
            if(!dateStr.includes('月') && !dateStr.includes('日') && newDate.getFullYear() > currentDate.getFullYear()) {
                flag = false;
            } else if (!dateStr.includes('日') && newDate.getFullYear() == currentDate.getFullYear() && (newDate.getMonth() + 1) > (currentDate.getMonth() + 1)) {
                flag = false
            } else if (newDate.getFullYear() == currentDate.getFullYear() && (newDate.getMonth() + 1) == (currentDate.getMonth() + 1) && newDate.getDate() > currentDate.getDate()) {
                flag = false;
            }
            return flag;
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
                    if (this.projectSurveyInfo.greening.field_value.indexOf('%') >= 0) {
                        this.projectSurveyInfo.greening.field_value = this.projectSurveyInfo.greening.field_value.substr(0, this.projectSurveyInfo.greening.field_value.indexOf('%'))
                    }
                    this.projectSurveyInfoCopy.push(JSON.parse(JSON.stringify(data.data.project_survey_info.data)))
                    this.projectSurveyName = data.data.project_survey_info.module_name;
                    // 产权年限 name
                    this.projectYearName = data.data.project_property_year_info.module_name;
                    // 建筑类型 name
                    this.projectTypeName = data.data.project_construct_type_info.module_name;
                    // 物业公司 name
                    this.projectCompanyName = data.data.project_property_company_info.module_name;
                    // 物业费 name
                    this.projectPriceName = data.data.project_property_fee_info.module_name;
                    // 水电气 name
                    this.projectHydroelectricName = data.data.project_water_electy_info.module_name;
                    // 装修情况 name
                    this.projectStatusName = data.data.project_decorate_info.module_name;
                    // 标签内容 name
                    if (data.data.project_survey_tag_info) {
                        this.projectTagName = data.data.project_survey_tag_info.module_name;
                        this.projectTagContentList = data.data.project_survey_tag_info.data.tag;
                    }
                    // 整体数据
                    this.allDataInfo = data.data;
                    this.$store.dispatch('getAllTableData',data.data)
                    // 楼盘标签内容
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * 拼接信息来源信息
         * @param {object} originInfo 信息来源
         * @param {string} originInfo.belong_datetime 信息来源操作时间
         * @param {string} originInfo.belong_employee_name 信息来源操作人
         * @param {string} originInfo.belong_employee_id 信息来源操作人工号
         * @return {string} 信息来源操作信息
         */
        spliceInfoOrigin({ belong_datetime, belong_employee_name, belong_employee_id }) {
            return belong_datetime === '' ? '' : this.filterDate(belong_datetime) + ' ' + belong_employee_name + '-' + belong_employee_id;
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
        },
        // 品牌开发商下拉
        async brandDevelopSelList() {
            try {
                let result = await propertyApi.brandDeveloperDropData();
                let { data } = result;
                if (data.code === 0) {
                    this.brandDevalopSelOptions = data.data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * 获取拿地时间的值
         * @param {string} 拿地时间拼接好的值
         */
        getTime(e) {
            this.projectSurveyInfo.take_land.field_value = e;
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
    .head-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 15px;
        min-height: 40px;
        margin-top: 15px;
        font-size: 16px;
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
            .no-shake-select {
                width: 86%;
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