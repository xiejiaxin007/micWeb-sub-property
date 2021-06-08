<!--
    @file: 楼盘名称&位置
    @description: 楼盘名称&位置
    @author: xiebin
    @date: 2019-12-10
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
            <el-breadcrumb-item>楼盘名称&位置</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="form-list-box">
            <div class="head-line">
                <h4>{{$route.query.projectName + $route.query.buildingType}} -- 楼盘名称&位置</h4>
                <div v-if="currentRoleSource && currentRoleSource == 7">
                    <el-button
                        type="success"
                        @click="addUserReviews">
                        新增用户点评
                    </el-button>
                </div>
            </div>
            <el-form
                :model="projectDetailData"
                label-width="120px"
                ref="subForm">
                <el-form-item v-if="currentRoleSource && currentRoleSource == 7"
                    class="form-head"
                    label="楼盘信息:">
                    <div class="form-input-box"></div>
                    <div><strong>信息来源：</strong></div>
                </el-form-item>
                <el-form-item
                    label="城市:"
                    v-if="projectDetailData.city_id"
                    required>
                    <div class="form-input-box">
                        <el-input
                            v-model="projectDetailData.city_id.field_text"
                            disabled>
                        </el-input>
                        <el-tooltip placement="top">
                            <div slot="content">
                                慎！选定保存后无法修改
                            </div>
                            <i class="el-icon-warning" 
                                aria-hidden="true"></i>
                        </el-tooltip>
                    </div>
                </el-form-item>
                <el-form-item
                    label="区域:"
                    v-if="projectDetailData.district_id"
                    :prop="'district_id.field_value'"
                    :rules="[ { required: true, message: '请选择区域', trigger: 'change' } ]">
                    <div class="form-input-box">
                        <el-select
                            :disabled="projectDetailData.district_id.is_disable === 1"
                            v-model="projectDetailData.district_id.field_value"
                            placeholder="请选择区域"
                            filterable
                            clearable
                            @change="districtChange">
                        <el-option
                            v-for="item in formList.selDistrictOpitions"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                        </el-select>
                    </div>
                    <info-origin
                        v-if="projectDetailData.district_id.is_show_belong_role == '1'"
                        v-model="projectDetailData.district_id.belong_role"
                        :other-val.sync="projectDetailData.district_id.belong_other"
                        :originArr="qdSourceList"
                        :operate-msg="spliceInfoOrigin(projectDetailData.district_id)">
                    </info-origin>
                </el-form-item>
                <el-form-item
                    label="楼盘名称:"
                    v-if="projectDetailData.name"
                    :prop="'name.'+ 'field_value'"
                    :rules="[ { required: true, message: '请输入楼盘名称', trigger: 'blur' } ]">
                    <div class="form-input-box">
                        <el-input
                            :disabled="currentRoleSource != 7"
                            v-model="projectDetailData.name.field_value"
                            maxlength="50"
                            @input="(val) => checkInput(val, projectDetailData.name)"
                            placeholder="请输入楼盘名称">
                        </el-input>
                        <el-tooltip placement="top">
                            <div slot="content">
                                · 主要为楼盘推广名（合作盘以渠道给的名称为准；非合作盘和其他竞品网站统一：房天下、搜狐优先）
                                <br/>
                                · 若确定项目只有一种业态，则输入项目名称即可。
                                <br/>
                                · 若某项目有多种业态，则需要在楼盘名称末尾对除住宅业态外的其他业态加后缀说明，后缀括号统一用英文半角括号，
                                  eg：恒华湖公馆(商办)、青楠里(公寓)、西溪美岸(商住)、翡翠公园(别墅)、万科智谷(商铺)
                            </div>
                            <i class="el-icon-warning" 
                                aria-hidden="true"></i>
                        </el-tooltip>
                    </div>
                    <info-origin
                        v-if="projectDetailData.name.is_show_belong_role == '1'"
                        v-model="projectDetailData.name.belong_role"
                        :other-val.sync="projectDetailData.name.belong_other"
                        :originArr="qdSourceList"
                        :operate-msg="spliceInfoOrigin(projectDetailData.name)">
                    </info-origin>
                </el-form-item>
                <el-form-item
                    label="别名:"
                    v-if="projectDetailData.alias">
                    <div class="form-input-box">
                        <el-input
                            v-model="projectDetailData.alias.field_value"
                            maxlength="200"
                            placeholder="请输入别名">
                        </el-input>
                        <el-tooltip placement="top">
                            <div slot="content">
                                楼盘除当前推广名之外的其他名字，如曾用推广名，住建委备案名、前一期项目的名称、中指上的楼盘名称等。
                                <br />
                                · 获取方法：查询门户网站，多个别名之间用英文逗号“,”隔开。示例如图：（一期二期关联）
                            </div>
                            <i class="el-icon-warning" 
                                aria-hidden="true"></i>
                        </el-tooltip>
                    </div>
                </el-form-item>
                <el-form-item
                    label="错别字别名:"
                    v-if="projectDetailData.error_alias">
                    <div class="form-input-box">
                        <el-input
                            v-model="projectDetailData.error_alias.field_value"
                            maxlength="300"
                            placeholder="请输入错别字别名">
                        </el-input>
                    </div>
                </el-form-item>
                <!-- 楼盘类型 -->
                <el-form-item
                    label="楼盘类型:"
                    v-if="projectDetailData.project_type">
                    <div class="form-input-box">
                        <el-select
                            :disabled="currentRoleSource && currentRoleSource != 7"
                            v-model="projectDetailData.project_type.field_value"
                            placeholder="请选择楼盘类型"
                            clearable>
                        <el-option
                            v-for="item in formList.sleBuildTypeOpitions"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                        </el-select>
                    </div>
                    <info-origin
                        v-if="projectDetailData.project_type.is_show_belong_role == '1'"
                        v-model="projectDetailData.project_type.belong_role"
                        :other-val.sync="projectDetailData.project_type.belong_other"
                        :originArr="qdSourceList"
                        :operate-msg="spliceInfoOrigin(projectDetailData.project_type)">
                    </info-origin>
                </el-form-item>
                <!-- 是否显示 -->
                <el-form-item
                    label="是否显示:"
                    v-if="projectDetailData.is_show"
                    :prop="'is_show.field_value'"
                    :rules="[ { required: true, message: '请选择是否显示', trigger: 'change' } ]">
                    <div class="form-input-box">
                        <el-radio-group
                            v-model="projectDetailData.is_show.field_value"
                            :disabled="isDelete === '1'"
                            @change="radioValChange">
                            <el-radio
                                label="1">
                                显示
                            </el-radio>
                            <el-radio
                                label="2">
                                隐藏
                            </el-radio>
                        </el-radio-group>
                        <el-tooltip placement="top">
                            <div slot="content">
                                无特殊情况都选显示，特殊情况可隐藏当期已显示的楼盘。 特殊情况举例：
                                <br />
                                （1）开发商要求隐藏 ：
                                <br />
                                · a：违反广告法宣传的楼盘：如上海严查商办，开发商要求隐藏自己的商办楼盘；
                                <br />
                                · b：开发商其他形式的楼盘隐藏要求：如上海之前有个楼盘已经售罄了，开发商不愿意在网站上展示他们的售罄盘，要求下架
                                <br />
                                （2）重复楼盘处理：历史录入重复或渠道添加重复 
                                <br />
                                · a：针对楼盘录入内容不多的情况：名称改为【待修改】xxx，隐藏；若该项目没有关联订单，可以直接在该楼盘下修改替换成其他楼盘；
                                <br />
                                · b：楼盘已录入信息较多的情况：名称改为【删】xxx，隐藏。
                            </div>
                            <i class="el-icon-warning" 
                                aria-hidden="true"></i>
                        </el-tooltip>
                    </div>
                </el-form-item>
                <!-- 板块 -->
                <el-form-item
                    label="板块:"
                    v-if="projectDetailData.trade_area">
                    <div class="form-input-box">
                        <el-select
                            v-model="projectDetailData.trade_area.field_value"
                            placeholder="请选择板块"
                            clearable
                            filterable>
                        <el-option
                            v-for="item in tradeArea"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                        </el-select>
                    </div>
                    <info-origin
                        v-if="projectDetailData.trade_area.is_show_belong_role == '1'"
                        v-model="projectDetailData.trade_area.belong_role"
                        :other-val.sync="projectDetailData.trade_area.belong_other"
                        :originArr="qdSourceList"
                        :operate-msg="spliceInfoOrigin(projectDetailData.trade_area)">
                    </info-origin>
                </el-form-item>
                <!-- 位置描述 -->
                <el-form-item
                    label="位置描述:"
                    v-if="projectDetailData.address"
                    :prop="'address.field_value'"
                    :rules="[ { required: true, message: '请输入位置描述', trigger: 'blur' } ]">
                    <div class="form-input-box">
                        <el-input
                            v-model="projectDetailData.address.field_value"
                            maxlength="255"
                            placeholder="请输入位置描述">
                        </el-input>
                        <el-tooltip placement="top">
                            <div slot="content">
                                必填，有具体清晰的地址的需要填写具体地址，尽量不要使用类似：位于xx路口等模糊的位置信息，可参考竞品，
                                <br />
                                地址前不需要添加楼盘名称，维护时尽量兼顾前端展示，建议较长的楼盘地址，中间用顿号隔开
                            </div>
                            <i class="el-icon-warning" 
                                aria-hidden="true"></i>
                        </el-tooltip>
                    </div>
                    <info-origin
                        v-if="projectDetailData.address.is_show_belong_role == '1'"
                        v-model="projectDetailData.address.belong_role"
                        :other-val.sync="projectDetailData.address.belong_other"
                        :originArr="qdSourceList"
                        :operate-msg="spliceInfoOrigin(projectDetailData.address)">
                    </info-origin>
                </el-form-item>
                <!-- 地图 -->
                <building-map
                    v-if="projectDetailData.project_address"
                    :warpWeptValone="warpWeptValone"
                    type="project"
                    labelName="楼盘位置:"
                    @getLngVal="getLngVal"
                    mapId="mapContaner"
                    :inputIsShow="true"
                    inputId="suggestId"
                    v-model="projectDetailData.project_address.field_value">
                </building-map>
                <!-- 楼盘经纬度 -->
                <el-form-item
                    label="楼盘经纬度:"
                    required
                    v-if="projectDetailData.lng && projectDetailData.lat">
                    <div class="form-input-box latitude-box">
                        <el-form-item
                            :prop="'lng.field_value'"
                            :rules="[ { required: true, message: '请输入楼盘经度', trigger: 'blur' } ]">
                            <jl-number-input
                                v-model="projectDetailData.lng.field_value"
                                reg="negativeNumber"
                                maxlength="30"
                                placeholder="请输入楼盘经度"
                                class="in-stock-val"
                                minVal="0"
                                maxVal="180">
                            </jl-number-input>
                        </el-form-item>
                        <el-form-item
                            :prop="'lat.field_value'"
                            :rules="[ { required: true, message: '请输入楼盘纬度', trigger: 'blur' } ]">
                            <jl-number-input
                                v-model="projectDetailData.lat.field_value"
                                placeholder="请输入楼盘纬度"
                                maxlength="30"
                                reg="negativeNumber"
                                class="in-stock-val"
                                minVal="0"
                                maxVal="90">
                            </jl-number-input>
                        </el-form-item>
                        <el-button
                            type="primary"
                            size="min"
                            @click="setPosition('project')">
                            定位
                        </el-button>
                        <el-tooltip placement="top">
                            <div slot="content">
                                必填字段，如果穷尽目前已知的方法依然找不到楼盘坐标，可先用售楼处坐标代替，但是要做好记录方便以后查阅和更新。
                            </div>
                            <i class="el-icon-warning" 
                                aria-hidden="true"></i>
                        </el-tooltip>
                    </div>
                    <info-origin
                        v-if="projectDetailData.coordinate.is_show_belong_role == '1'"
                        v-model="projectDetailData.lng.belong_role"
                        :other-val.sync="projectDetailData.lng.belong_other"
                        :originArr="qdSourceList"
                        :operate-msg="spliceInfoOrigin(projectDetailData.lng)"
                        @input="setLatVal($event, 'project')">
                    </info-origin>
                </el-form-item>
                <!-- 售楼处位置 -->
                <building-map
                    v-if="projectDetailData.sale_office_address"
                    :warpWeptVal="warpWeptVal"
                    type="salesOffPosition"
                    labelName="售楼处位置:"
                    @getLngVal="getLngVal"
                    :inputIsShow="true"
                    mapId="mapContanerOne"
                    inputId="suggestIdOne"
                    v-model="projectDetailData.sale_office_address.field_value">
                </building-map>
                <!-- 售楼处经纬度 -->
                <el-form-item
                    label="售楼处经纬度:"
                    v-if="projectDetailData.sale_office_lng && projectDetailData.sale_office_lat">
                    <div class="form-input-box latitude-box">
                        <el-form-item>
                            <jl-number-input
                                v-model="projectDetailData.sale_office_lng.field_value"
                                reg="negativeNumber"
                                maxlength="30"
                                placeholder="请输入售楼处经度"
                                class="in-stock-val"
                                minVal="0"
                                maxVal="180">
                            </jl-number-input>
                        </el-form-item>
                        <el-form-item>
                            <jl-number-input
                                v-model="projectDetailData.sale_office_lat.field_value"
                                placeholder="请输入售楼处纬度"
                                reg="negativeNumber"
                                maxlength="30"
                                class="in-stock-val"
                                minVal="0"
                                maxVal="90">
                            </jl-number-input>
                        </el-form-item>
                        <el-button
                            type="primary"
                            size="min"
                            @click="setPosition('salesOffPosition')">
                            定位
                        </el-button>
                    </div>
                    <info-origin
                        v-if="projectDetailData.sale_office_lng.is_show_belong_role == '1' && projectDetailData.sale_office_lat.is_show_belong_role == '1'"
                        v-model="projectDetailData.sale_office_lng.belong_role"
                        :other-val.sync="projectDetailData.sale_office_lng.belong_other"
                        :originArr="qdSourceList"
                        :operate-msg="spliceInfoOrigin(projectDetailData.sale_office_lng)"
                        @input="setLatVal($event, 'saleOffice')">
                    </info-origin>
                </el-form-item>
                <!-- 环线 -->
                <el-form-item
                    label="环线:"
                    v-if="projectDetailData.ring_road">
                    <div class="form-input-box">
                        <el-select
                            v-model="projectDetailData.ring_road.field_value"
                            placeholder="请选择环线"
                            clearable>
                        <el-option
                            v-for="item in loopLineList"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                        </el-select>
                        <el-tooltip placement="top">
                            <div slot="content">
                                环线：筛选即可，可根据百度/高德地图看具体在几环。
                                <br />
                                *数值最多只能保留1位小数点。
                            </div>
                            <i class="el-icon-warning" 
                                aria-hidden="true"></i>
                        </el-tooltip>
                    </div>
                </el-form-item>
                <!-- 距近环 -->
                <el-form-item
                    label="距近环:"
                    v-if="projectDetailData.near_distance">
                    <div class="form-input-box">
                        <jl-number-input
                            v-model="projectDetailData.near_distance.field_value"
                            placeholder="请输入距近环"
                            reg="oneNum"
                            class="in-stock"
                            minVal="0.1"
                            maxVal="999.9">
                        </jl-number-input>km
                        <el-tooltip placement="top">
                            <div slot="content">
                                距近环：距离市中心更近的环线，例如：距2环。
                                <br />
                                *数值最多只能保留1位小数点。
                            </div>
                            <i class="el-icon-warning" 
                                aria-hidden="true"></i>
                        </el-tooltip>
                    </div>
                </el-form-item>
                <!-- 距远环 -->
                <el-form-item
                    label="距远环:"
                    v-if="projectDetailData.far_distance">
                    <div class="form-input-box">
                        <jl-number-input
                            v-model="projectDetailData.far_distance.field_value"
                            placeholder="请输入距远环"
                            reg="oneNum"
                            class="in-stock"
                            minVal="0.1"
                            maxVal="999.9">
                        </jl-number-input>km
                        <el-tooltip placement="top">
                            <div slot="content">
                                距远环：距离市中心更远的环线，例如：距3环。
                                <br />
                                *数值最多只能保留1位小数点。
                            </div>
                            <i class="el-icon-warning" 
                                aria-hidden="true"></i>
                        </el-tooltip>
                    </div>
                </el-form-item>
                <!-- 周边描述 -->
                <el-form-item
                    label="周边描述:"
                    v-if="projectDetailData.ambitus_text">
                    <div class="form-input-box">
                        <el-input
                            type="textarea"
                            maxlength="99999"
                            v-model="projectDetailData.ambitus_text.field_value"
                            placeholder="请输入周边描述">
                        </el-input>
                    </div>
                </el-form-item>
                <!-- 楼盘概述 -->
                <el-form-item
                    label="楼盘概述:"
                    v-if="projectDetailData.project_desc">
                    <div class="form-input-box">
                        <el-input
                            type="textarea"
                            maxlength="400"
                            v-model="projectDetailData.project_desc.field_value"
                            placeholder="请输入楼盘概述">
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="btn-box">
                        <el-button @click="cancelDeatil">取消</el-button>
                        <el-button
                            type="primary"
                            @click="submitForm('subForm')">
                            提交
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="dialog-box">
            <msg-dialog
                @closeDialog="close"
                title="保存跳转提示"
                :dialog-show="dialogVisible">
                    <p>当前页面信息还没有保存，请确认</p> 
                    <div class="footer" slot="footer">
                        <el-button
                            type="primary"
                            @click="goToaddHouse(true)">
                            保存当前信息并进行跳转
                        </el-button>
                        <el-button
                            type="warning"
                            @click="goToaddHouse(false)">
                            不保存当前信息并进行跳转
                        </el-button>
                        <el-button
                            @click="dialogVisible = false">
                            取 消
                        </el-button>
                    </div>
            </msg-dialog>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import InfoOrigin from '../components/InfoOrigin';
import BuildingMap from '../components/BuildingMap';
import expandApi from '@/api/buildingDictionary/expandTagList';
import { isRequiredInfoOrigin } from '../utils/index';
import MsgDialog from '../components/MsgDialog';
import commonApi from '../api/common';
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
        },
        // 板块列表
        tradeArea: {
            type: Array,
            default: ()=>{}
        },
        // 环线列表
        loopLine: {
            type: Array,
            default: ()=>{}
        },
        // 来源列表
        qdSourceList: {
            type: Array,
            default: ()=>{}
        },
        // 楼盘是否显示
        projectIsShow: {
            type: Array,
            default: ()=>{}
        },
    },
    watch: {
        tradeArea: function(val) {
            this.tradeArea = val;
            this.treadAreaList = val;
        }
    },
    data() {
        return {
            dialogVisible: false,
            // 详情数据列表
            projectDetailData: {},
            // 拷贝表单数据
            projectDataCopy: {},
            // 表单
            formList: {
                // 区域
                selDistrictOpitions: [],
                // 楼盘类型
                sleBuildTypeOpitions: []
            },
            // 售楼处经纬度
            warpWeptVal: {},
            // 楼盘经纬度
            warpWeptValone: {},
            // 面包屑文案
            breadText: '楼盘列表',
            // 保存时的loading
            saveLoading: false,
            // 板块
            treadAreaList: [],
            // 环线
            loopLineList: [],
            // 是否是弃用，如果是，则展示隐藏不能进行操作了,1-弃用，2-使用
            isDelete: '2'
        }
    },
    mounted() {
        // 获取初始化数据
        this.getProjectNameAndPosData();
        this.isRequiredInfoOrigin = isRequiredInfoOrigin;
        // 判断角色修改面包屑文案
        this.isOperation();
        this.getDistrictListInfoData();
        this.projectTypesInfoData();
        // 请求基础接口，判断展示隐藏是否选项是否禁用
        this.getProjectBaseData();
    },
    methods: {
        async getProjectBaseData() {
            try {
                const {
                    data: { code, msg, data }
                } = await commonApi.getProjectInfoById({
                    project_id: this.$route.query.projectId,
                    fields: 'is_delete'
                });
                if (code === 0) {
                    this.isDelete = data.is_delete;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 【父组件调用】快捷键保存操作
        handleShortCut() {
            if(this.dialogVisible) {
                this.submitForm('subForm', 'addUserReviews');
                this.dialogVisible = false;
            } else {
                this.submitForm('subForm');
            }
        },
        /**
         * @description: 楼盘名称输入过过滤空格
         * @param {String} val 输入内容
         * @param {Object} model 输入框绑定的字段的父对象
         */
        checkInput(val, model) {
            let rel = val.replace(/\s+/g, '');
            this.$set(model, 'field_value', rel);
        },
        // 环线截取
        loopLineListLimit() {
            this.loopLineList = this.loopLine;
            this.loopLineList = this.loopLineList.splice(1);
        },
        // 关闭弹窗
        close() {
            this.dialogVisible = false;
        },
        /**
         * 新增跳转
         * @param {Boolean} isSave 是否进行保存再跳转
         */
        goToaddHouse(isSave) {
            if (isSave) {
                this.submitForm('subForm', 'addUserReviews');
                this.dialogVisible = false;
            } else {
                this.$emit('changeStatus', false);
                this.dialogVisible = false;
                window.open(`/index.php?r=yw-user-project-comment%2Fcreate&city_id=${this.$route.query.cityId}&project_id=${this.$route.query.projectId}`);
            }
        },
        /**
         * 纬度整合赋值
         * @param {Boolean} e 回传的数据
         * @param {Boolean} type 类型
         */
        setLatVal(e, type) {
            if(type === 'project') {
                this.projectDetailData.lat.belong_role = this.projectDetailData.lng.belong_role;
            } else if (type === 'saleOffice') {
                this.projectDetailData.sale_office_lat.belong_role = this.projectDetailData.sale_office_lng.belong_role;
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
        // 新增用户点评
        addUserReviews() {
            this.dialogVisible = true;
        },
        /**
         * 提交
         * @param {string} formName 表单ref
         * @param {string} isAddUser 是否是点击新增点评后执行的保存
         */
        submitForm(formName, isAddUser) {
            // 售楼处经纬度为空时将楼盘经纬度赋值到售楼处
            if (this.projectDetailData.sale_office_lng.field_value === '' || this.projectDetailData.sale_office_lat.field_value === '') {
                // 整合经纬度赋值
                this.projectDetailData.sale_office_lng.field_value = this.projectDetailData.lng.field_value;
                this.projectDetailData.sale_office_lat.field_value = this.projectDetailData.lat.field_value;
                this.projectDetailData.sale_office_lng.belong_role = this.projectDetailData.lng.belong_role;
                this.projectDetailData.sale_office_lng.belong_other = this.projectDetailData.lng.belong_other;
                this.projectDetailData.sale_office_lat.belong_role = this.projectDetailData.lng.belong_role;
                this.projectDetailData.sale_office_lat.belong_other = this.projectDetailData.lng.belong_other;
                this.projectDetailData.lat_lng.belong_role = this.projectDetailData.lng.belong_role;
                this.projectDetailData.lat_lng.belong_other = this.projectDetailData.lng.belong_other;
            }
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    // 楼盘经度赋值
                    this.projectDetailData.coordinate.belong_other = this.projectDetailData.lng.belong_other;
                    this.projectDetailData.lat.belong_other = this.projectDetailData.lng.belong_other;
                    // 售楼处经度赋值 
                    this.projectDetailData.lat_lng.belong_other = this.projectDetailData.sale_office_lng.belong_other;
                    this.projectDetailData.sale_office_lat.belong_other = this.projectDetailData.sale_office_lng.belong_other;
                    // 页面字段修改后 信息来源未标记
                    let flag = this.isRequiredInfoOrigin(this.projectDataCopy, this.projectDetailData);
                    if (!flag) { 
                        return;
                    }
                    try {
                        this.saveLoading = true;
                        let queryData = this.$route.query;
                        let projectNameLocation = {};
                        projectNameLocation.data = this.projectDetailData;
                        projectNameLocation.module_name = this.moduleName;
                        // 楼盘经纬度整合
                        this.projectDetailData.coordinate.field_value = this.projectDetailData.lng.field_value + ',' + this.projectDetailData.lat.field_value;
                        this.projectDetailData.lat.belong_role = this.projectDetailData.lng.belong_role;
                        this.projectDetailData.coordinate.belong_role = this.projectDetailData.lng.belong_role;
                        // 售楼处经纬度整合
                        this.projectDetailData.lat_lng.field_value = this.projectDetailData.sale_office_lng.field_value + ',' + this.projectDetailData.sale_office_lat.field_value;
                        projectNameLocation.data.coordinate.field_value = this.projectDetailData.coordinate.field_value;
                        projectNameLocation.data.lat_lng.field_value = this.projectDetailData.lat_lng.field_value;
                        // 给lat_lng赋值
                        projectNameLocation.data.lat_lng.belong_role = this.projectDetailData.sale_office_lng.belong_role;
                        let params = {
                            project_id: queryData.projectId,
                            task_id: queryData.taskId,
                            project_name_location: projectNameLocation
                        };
                        let result = await expandApi.saveProjectNamePageInfoData(params);
                        let { data } = result;
                        if (data.code === 0) {
                            this.saveLoading = false;
                            // 是否是点击新增点评后执行的保存
                            if (isAddUser === 'addUserReviews') {
                                window.open(`/index.php?r=yw-user-project-comment%2Fcreate&city_id=${this.$route.query.cityId}&project_id=${this.$route.query.projectId}`);
                            }
                            this.$message({
                                type: 'success',
                                message: '提交成功'
                            });
                            // 切换到详情查看页面
                            this.$emit('changeStatus', false);
                        } else if (data.code === 1007) {
                            this.saveLoading = false;
                            if (Array.isArray(data.data.name)) {
                                this.$confirm('该楼盘在居理已经存在，现规则暂不允许添加同城市同业态且名称相同的楼盘', '提示', {
                                    confirmButtonText: '点击可查看居理楼盘',
                                    cancelButtonText: '取消',
                                    type: 'warning',
                                    center: true
                                    }).then(() => {
                                        window.open(`/index.php?r=yw-projects%2Findex&project_house_id=${data.data.name[1]}&city_id=${data.data.name[0]}`)
                                    }).catch((error) => {
                                        console.log(error);
                                });
                            } else {
                                this.$message(data.data.name);
                            }
                            
                        } else {
                            this.$message(data.data.name);
                            this.saveLoading = false;
                        }
                    }
                    catch(error) {
                        this.saveLoading = false;
                        console.log(error);
                    }
                } else {
                    return false;
                }
            });
        },
        // 返回
        cancelDeatil() {
            this.$emit('changeStatus', false);
        },
        // 初始化数据
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
                    this.moduleName = data.data.project_name_location.module_name;
                    // 环线的值为0处理
                    if (this.projectDetailData.ring_road && this.projectDetailData.ring_road.field_value == 0) {
                        this.projectDetailData.ring_road.field_value = '';
                    }
                    this.projectDataCopy = JSON.parse(JSON.stringify(this.projectDetailData));
                    if (this.projectDetailData.district_id) {
                        this.$emit('changeVal', this.projectDetailData.district_id.field_value);
                    }
                    // 楼盘经纬度赋值
                    if (this.projectDetailData.lng && this.projectDetailData.lat) {
                        this.warpWeptValone = {
                            lngVal: this.projectDetailData.lng.field_value,
                            latVal: this.projectDetailData.lat.field_value
                        }
                    }
                    // 售楼处经纬度赋值
                    if (this.projectDetailData.sale_office_lng && this.projectDetailData.sale_office_lat) {
                        this.warpWeptVal = {
                            lngVal: this.projectDetailData.sale_office_lng.field_value,
                            latVal: this.projectDetailData.sale_office_lat.field_value
                        }
                    }
                }
                // 环线截取
                this.loopLineListLimit();
            }
            catch(error) {
                console.log(error)
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
        // 获取区域信息
        async getDistrictListInfoData() {
            let params = {
                city_id: this.$route.query.cityId || '',
                status: 1
            }
            try {
                let result = await expandApi.getDistrictListData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.formList.selDistrictOpitions = data.data;
                }
            }
            catch(error) {

            }
        },
        /**
         * 当区域改变的时候
         * @param {string} value 改变的值
         */
        districtChange(value) {            
            this.$emit('changeVal', value);
            this.treadAreaList = [];
            this.projectDetailData.trade_area.field_value = '';
        },
        // 获取楼盘名称信息
        async projectTypesInfoData() {
            let params = {
                city_id: this.$route.query.cityId
            }
            try {
                let result = await expandApi.projectTypesData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.formList.sleBuildTypeOpitions = data.data;
                }
            }
            catch(error) {

            }
        },
        /**
         * radio改变的时候
         * @param {String} e 改变的值
         */
        radioValChange(e) {
            if (e == '1') {
                this.projectDetailData.is_show.field_text = '显示';
            } else {
                this.projectDetailData.is_show.field_text = '隐藏';
            }
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
        /**
         * 点击定位向地图组件传入经纬度
         * @param {Sting}} type 点击定位的类型
         */
        setPosition(type) {
            if (type === 'project') {
                this.warpWeptValone = {
                    lngVal: this.projectDetailData.lng.field_value,
                    latVal: this.projectDetailData.lat.field_value                    
                }
            } else if (type === 'salesOffPosition') {
                this.warpWeptVal = {
                    lngVal: this.projectDetailData.sale_office_lng.field_value,
                    latVal: this.projectDetailData.sale_office_lat.field_value
                }
            }
        },
    },
    components: {
        InfoOrigin,
        BuildingMap,
        MsgDialog
    }
}
</script>

<style lang="less" scoped>
.content-box {
    padding: 15px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 7px;
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
        /deep/ .el-button {
            height: 40px;
        }
        .form-input-box {
            width: 47%;
            /deep/ .el-input {
                width: 90%;
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
        .latitude-box {
            display: flex;
            flex-direction: row;
            /deep/ .el-form-item {
                width: 35%;
                margin-right: 5px;
            }
            .in-stock-val {
                width: 100%;
            }
            /deep/ .el-input {
                width: 100%;
            }
        }
        .in-stock {
            display: inline-block;
            width: 87%;
            margin-right: 3px;
            /deep/ .el-input {
                width: 100%;
            }
        }
        .btn-box {
            text-align: center;
            margin-top: 30px;
        }
    }
    .dialog-box {
        /deep/ .el-dialog {
            width: 30% !important;
        }
        /deep/ .el-button {
            width: 200px;
            margin: 10px auto;
            display: block;
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