<!--
    @name: 楼栋详情
    @description: 楼栋详情页面
    @author: 贺伟
    @date: 2019-12-23
-->
<template>
    <div class="building-wrap" v-loading="pageLoading">
        <!--面包屑开始-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <a @click="goToListPage">{{breadText}}</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <a @click="goToDynamicSale">动销信息</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                楼栋详情
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{isEdit ? '编辑' : '查看'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="building-info">
            <div class="head-line flex-box">
                <h4>{{getProjectNameAndTypes}}楼栋详情</h4>
                <div v-show="getEditAuth == 2 && !isEdit">
                    <auto-set-dynamic></auto-set-dynamic>
                    <el-button
                        @click="editInfo(true)"
                        type="primary">
                        编辑
                    </el-button>
                </div>
            </div>
            <div
                class="dynamic-sale-main"
                v-if="!isEdit">
                <building-detail
                    :role-num="getConfigList.current_role_source"
                    :info-data="initOriginData"/>
            </div>
            <div class="build-edit-wrap" v-if="isEdit">
                <div
                    class="build-form-wrap"
                    v-for="({
                        baseInfo: buildingForm,
                        relativeInfo: relativeForm,
                        name: dataName
                    }, idx) in buildingData"
                    :key="idx">
                    <div class="building-info-title">
                        <h3 class="title-content">基础信息</h3>
                        <p
                            v-if="getConfigList && getConfigList.current_role_source === 7"
                            class="origin-title">信息来源：</p>
                        <el-button
                            class="del-module"
                            size="small"
                            @click="delBuild(idx)"
                            type="danger">
                            删除
                        </el-button>
                    </div>
                    <!--表单部分开始-->
                    <el-form
                        ref="buildingForm"
                        class="building-form"
                        :model="buildingForm"
                        v-if="buildingForm"
                        label-width="140px">
                        <el-form-item
                            v-if="buildingForm.building_name"
                            class="form-item-wrap"
                            prop="building_name.field_value"
                            :rules="[ { required: true, message: '楼栋名称为必填', trigger: 'blur' }]"
                            label="楼栋名称：">
                            <div class="form-left-box">
                                <el-input
                                    :maxlength="10"
                                    v-model="buildingForm.building_name.field_value">
                                </el-input>
                                <el-tooltip placement="top">
                                    <div slot="content">
                                        楼栋名称要求：
                                        <br />
                                        · 和开发商保持一致：商务/拓展提供的楼栋名称或者开发商提供的楼栋图
                                        <br />
                                        · 获取不到开发商口径的楼栋名称时，对标参考的竞品的楼栋名称
                                    </div>
                                    <i class="el-icon-warning"
                                        aria-hidden="true"></i>
                                </el-tooltip>
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.building_name.is_show_belong_role == 1"
                                v-model="buildingForm.building_name.belong_role"
                                :key="buildingForm.used_name.belong_role + belongOther"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.building_name.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.building_name, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.used_name"
                            class="form-item-wrap"
                            label="楼栋曾用名：">
                            <div class="form-left-box">
                                <el-input
                                    :maxlength="100"
                                    v-model="buildingForm.used_name.field_value">
                                </el-input>
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.used_name.is_show_belong_role == 1"
                                v-model="buildingForm.used_name.belong_role"
                                :key="buildingForm.used_name.belong_role + belongOther"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.used_name.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.used_name, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.saling_status"
                            class="form-item-wrap"
                            label="楼栋销售状态：">
                            <div class="form-left-box">
                                <el-radio-group
                                    v-model="buildingForm.saling_status.field_value">
                                    <el-radio
                                        v-for="ele in getConfigList.sale_status"
                                        :key="ele.id"
                                        :label="ele.id">
                                        {{ele.text}}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.saling_status.is_show_belong_role == 1"
                                v-model="buildingForm.saling_status.belong_role"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.saling_status.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.saling_status, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.on_sale_num"
                            class="form-item-wrap"
                            label="在售房源量：">
                            <div class="form-left-box flex-box">
                                约
                                <jl-number-input
                                    class="num-input"
                                    v-model.number="buildingForm.on_sale_num.field_value"
                                    :minVal="0"
                                    :maxVal="9999"
                                    reg="parseInt">
                                </jl-number-input>
                                套
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.on_sale_num.is_show_belong_role == 1"
                                v-model="buildingForm.on_sale_num.belong_role"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.on_sale_num.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.on_sale_num, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.is_show"
                            class="form-item-wrap"
                            label="楼栋是否展示：">
                            <div class="form-left-box">
                                <el-radio-group
                                    v-model="buildingForm.is_show.field_value">
                                    <el-radio
                                        v-for="ele in getConfigList.project_is_show"
                                        :key="ele.id"
                                        :label="ele.id">
                                        {{ele.text}}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.is_show.is_show_belong_role == 1"
                                v-model="buildingForm.is_show.belong_role"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.is_show.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.is_show, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.above_floor_num"
                            class="form-item-wrap"
                            label="地上楼层数：">
                            <div class="form-left-box flex-box">
                                {{buildingForm.above_floor_type.field_value == 1 ? '最高' : ''}}
                                <jl-number-input
                                    class="num-input"
                                    v-model.number="buildingForm.above_floor_num.field_value"
                                    :minVal="0"
                                    :maxVal="9999"
                                    reg="int">
                                </jl-number-input>
                                <el-button
                                    class="btn-mark"
                                    size="small"
                                    @click="changeMark(buildingForm.above_floor_type)"
                                    type="primary">
                                    {{buildingForm.above_floor_type.field_value == 1 ? '取消标记' : '标记最高'}}
                                </el-button>
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.above_floor_num.is_show_belong_role == 1"
                                v-model="buildingForm.above_floor_num.belong_role"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.above_floor_num.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.above_floor_num, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.under_floor_num"
                            class="form-item-wrap"
                            label="地下楼层数：">
                            <div class="form-left-box">
                                <jl-number-input
                                    class="num-input"
                                    v-model.number="buildingForm.under_floor_num.field_value"
                                    :minVal="0"
                                    :maxVal="9999"
                                    reg="parseInt">
                                </jl-number-input>
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.under_floor_num.is_show_belong_role == 1"
                                v-model="buildingForm.under_floor_num.belong_role"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.under_floor_num.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.under_floor_num, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.total_house_num"
                            class="form-item-wrap"
                            label="总户数：">
                            <div class="form-left-box flex-box">
                                <jl-number-input
                                    class="num-input"
                                    v-model.number="buildingForm.total_house_num.field_value"
                                    :minVal="0"
                                    :maxVal="9999"
                                    reg="parseInt">
                                </jl-number-input>
                                户
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.total_house_num.is_show_belong_role == 1"
                                v-model="buildingForm.total_house_num.belong_role"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.total_house_num.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.total_house_num, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.unit_num"
                            class="form-item-wrap"
                            label="单元数：">
                            <div class="form-left-box">
                                <jl-number-input
                                    class="num-input"
                                    v-model.number="buildingForm.unit_num.field_value"
                                    :minVal="0"
                                    :maxVal="9999"
                                    reg="parseInt">
                                </jl-number-input>
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.unit_num.is_show_belong_role == 1"
                                v-model="buildingForm.unit_num.belong_role"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.unit_num.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.unit_num, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.ladder_ratio"
                            class="form-item-wrap"
                            label="梯户比：">
                            <div class="form-left-box">
                            <el-input
                                    class="single-ipt"
                                    :maxlength="30"
                                    v-model.trim="buildingForm.ladder_ratio.field_value">
                                </el-input>
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.ladder_ratio.is_show_belong_role == 1"
                                v-model="buildingForm.ladder_ratio.belong_role"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.ladder_ratio.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.ladder_ratio, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.storey_height"
                            class="form-item-wrap"
                            label="层高：">
                            <div class="form-left-box flex-box">
                                <jl-number-input
                                    cclass="num-input"
                                    v-model.number="buildingForm.storey_height.field_value"
                                    :minVal="0.01"
                                    :maxVal="99.99"
                                    reg="twoNum">
                                </jl-number-input>
                                m
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.storey_height.is_show_belong_role == 1"
                                v-model="buildingForm.storey_height.belong_role"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.storey_height.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.storey_height, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.relation_license_buildings"
                            class="form-item-wrap"
                            label="证件楼栋：">
                            <div class="form-left-box">
                                <el-select
                                    class="mult-select no-shake-select"
                                    multiple
                                    filterable
                                    @focus="getlicenseBuildingById"
                                    v-model="buildingForm.relation_license_buildings.field_value"
                                    placeholder="请选择">
                                    <el-option
                                        v-for="item in licenseBuildingList"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <div
                                    v-if="true"
                                    class="btn-box">
                                    <el-button
                                        @click="goToBuildPos('smxkz')"
                                        type="text">
                                        找不到去新增
                                    </el-button>
                                </div>
                            </div>
                            <info-origin
                                v-if="buildingForm.relation_license_buildings.is_show_belong_role == 1"
                                class="msg-origin"
                                v-model="buildingForm.relation_license_buildings.belong_role"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.relation_license_buildings.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.relation_license_buildings, false)" />
                        </el-form-item>
                        <el-form-item
                            v-if="buildingForm.remark"
                            class="form-item-wrap"
                            label="楼栋备注：">
                            <div class="form-left-box">
                                <el-input
                                    class="remark-info"
                                    type="textarea"
                                    :rows="5"
                                    :maxlength="300"
                                    placeholder="请输入备注信息"
                                    show-word-limit
                                    v-model="buildingForm.remark.field_value">
                                </el-input>
                            </div>
                            <info-origin
                                class="msg-origin"
                                v-if="buildingForm.remark.is_show_belong_role == 1"
                                v-model="buildingForm.remark.belong_role"
                                @change="(val, otherVal) => changeSource(dataName, 'used_name', idx, val, otherVal)"
                                :other-val.sync="buildingForm.remark.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(buildingForm.remark, false)" />
                        </el-form-item>
                    </el-form>
                    <div
                        v-if="getConfigList.current_role_source === 7 && relativeForm"
                        class="building-relative-info">
                        <div class="building-info-title flex-box">
                            <h3 class="title-content">楼栋关联信息</h3>
                            <span class="msg-warn">相关信息的来源无法在该页面编辑</span>
                        </div>
                        <el-form
                            :inline="true"
                            size="small"
                            label-width="120px">
                            <template v-for="(value, name) in relativeForm">
                                <el-form-item
                                    :key="name"
                                    v-if="name!== 'relation_house_types'"
                                    :label="`${value.field_desc}：`">
                                    <div class="form-left-box flex-box">
                                        <div class="filed-value">{{value.field_text}}</div>
                                        <div class="edit-info">
                                            <el-button
                                                @click="toEdit(value.url)"
                                                type="text">
                                                去修改
                                            </el-button>
                                        </div>
                                    </div>
                                </el-form-item>
                            </template>
                            <el-form-item
                                :label="`${dealwithHouse(relativeForm).field_desc}：`">
                                <div class="form-left-box flex-box">
                                    <div class="filed-value">{{dealwithHouse(relativeForm).field_text}}</div>
                                    <div class="edit-info">
                                        <el-button
                                            @click="toEdit(dealwithHouse(relativeForm).url)"
                                            type="text">
                                            去修改
                                        </el-button>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="btn-box add-building" v-if="buildingData.length < 20">
                    <el-button
                        type="primary"
                        @click="addSpaceBuilding"
                        size="small">
                        新增空白楼栋
                    </el-button>
                    <el-button
                        type="primary"
                        v-if="buildingData.length > 0"
                        @click="copyPrevBuilding"
                        size="small">
                        复制上个楼栋
                    </el-button>
                </div>
                <div
                    v-if="getConfigList && getConfigList.current_role_source === 7"
                    class="building-pic">
                    <div class="building-info-title">
                        <h3 class="title-content">楼座图及打点</h3>
                    </div>
                    <div class="btn-box">
                        <el-button
                            @click="goToBuildPos('lz')"
                            type="text">
                            进入楼座位置编辑页面
                        </el-button>
                    </div>
                </div>
                <div class="btn-operate">
                    <el-button
                        @click="cancleEdit">
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="getInfoValid">
                        保存
                    </el-button>
                </div>
            </div>
        </div>
        <!-- 楼栋自洽弹窗 -->
        <el-dialog
            :visible.sync="selfConsistentDialogvisible"
            title="不自洽提示"
            width="400px"
            center>
            <span>{{selfConsistentMessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="editBuildingStatus">
                    修改楼栋销售状态
                </el-button>
                <el-button
                    type="primary"
                    @click="editProjectStatus">
                    修改楼盘销售状态
                </el-button>
            </span>
        </el-dialog>
        <!--保存跳转提示弹窗-->
        <div class="dialog-box">
            <msg-dialog
                title="保存跳转提示"
                width="270px"
                @closeDialog="dialogVisible=false"
                :dialog-show="dialogVisible">
                    <p>当前页面信息还没有保存，请确认</p>
                    <div class="footer" slot="footer">
                        <el-button
                            type="primary"
                            @click="goToPage(true)">
                            保存当前信息并进行跳转
                        </el-button>
                        <el-button
                            type="warning"
                            @click="goToPage(false)">
                            不保存当前信息并进行跳转
                        </el-button>
                        <el-button
                            @click="dialogVisible=false">
                            取 消
                        </el-button>
                    </div>
            </msg-dialog>
        </div>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    import InfoOrigin from '../components/InfoOrigin';
    import MsgDialog from '../components/MsgDialog';
    import AutoSetDynamic from '../components/AutoSetDynamic';
    import BuildingDetail from './BuildingDetail';
    import { commonFun } from '@/assets/js/utils/utils';
    import commonApi from '../api/common';
    import {
        isRequiredInfoOrigin,
        getOriginOperateInfo,
        confirmMsg,
        setTrack
    } from '../utils/index';
    import api from '../api/buildingDetail';
    import {
        trackIdList
    } from '../config/tabToggleList';
    export default {
        name: 'BuildingDetailEdit',
        components: {
            InfoOrigin,
            BuildingDetail,
            MsgDialog,
            AutoSetDynamic
        },
        data() {
            return {
                // 保存跳转提示弹窗
                dialogVisible: false,
                belongOther: '',
                // 是否编辑
                isEdit: false,
                // 楼盘表单信息
                buildingData: [],
                // 初次返回的原始数据
                initOriginData: {},
                // 空结构原数据
                originData: [],
                // 页面loading
                pageLoading: false,
                // 面包屑文案
                breadText: '楼盘列表',
                // 销售状态自洽弹窗
                selfConsistentDialogvisible: false,
                // 自洽提示
                selfConsistentMessage: '',
                // 证件楼栋下拉
                licenseBuildingList: [],
                // 配置信息
                getConfigList: this.getConfigLists(),
                // 按键按下的键组成的数组
                arrKey: [],
                // 按键拼接字符串
                keydown: '',
                // 页面标题，楼盘名+业态
                getProjectNameAndTypes: '',
                // 城市ID
                cityId: '',
                // 楼盘名
                projectName: '',
                // 业态
                buildingType: '',
                // 系统
                device: ''
            }
        },
        computed: {
            ...mapState({
                // 获取页面权限信息
                getEditAuth: state => state.buildingDictionary.isAuditorAuth
            })
        },
        watch: {
            // 监听路由，修改isEdit的值
            $route: function(val) {
                this.isEdit = val.query.isEdit && val.query.isEdit === '1';
                // 从编辑页面进入详情页面从新请求初始化接口
                this.getBuildInitData();
            }
        },
        created() {
            // 获取设备
            this.device = commonFun.getDevice();
            // 快捷键监听
            document.addEventListener('keydown', this.handleKeyDown);
            document.addEventListener('keyup', this.handleKeyUp);
            // 获取楼盘信息，主要获取城市，楼盘名字，业态
            this.getProjectInfo();
            this.initHandle();
            // 面包屑初始化
            this.isOperation();
            // 获取初始化楼栋详情数据
            if (this.buildingId) {
                // 如果是编辑才调取初始化接口
                this.getBuildInitData();
            }
            // 获取页面空数据结构
            this.getEmptyInitData();
            // 获取证件楼栋下拉
            this.getlicenseBuildingById();
            // 获取权限
            this.getisEditAuth();
        },
        destroyed() {
            document.removeEventListener('keydown', this.handleKeyDown);
            document.removeEventListener('keyup', this.handleKeyUp);
        },
        methods: {
            // 根据楼盘id获取楼盘基本信息接口，主要获取城市，楼盘名字，业态
            async getProjectInfo() {
                try {
                    const {
                        data: { code, msg, data }
                    } = await commonApi.getProjectInfoById({
                        project_id: this.$route.query.projectId,
                        fields: 'name,city_id,project_type_text'
                    });
                    if (code === 0) {
                        this.cityId = data.city_id;
                        this.projectName = data.name;
                        this.buildingType = data.project_type_text ? '(' + data.project_type_text + ')' : '';
                        this.getProjectNameAndTypes = data.name && data.name + this.buildingType  + '--';
                    } else {
                        this.$message.error(msg);
                    }
                } catch (err) {}
            },
            /**
             * @description: 按键按下的事件
             * @param {Object}  e
             * @return {type} 
             */
            handleKeyDown(e) {
                if (this.arrKey.length > 0) { 
                    // a-z的按键 长按去重
                    if (this.arrKey.indexOf(e.key.toLowerCase()) >= 0) {
                        return
                    }
                }
                this.arrKey.push(e.key.toLowerCase())
                this.keydown = this.arrKey.join('+')
                if (this.device === 'mac') {
                    if (this.isEdit && this.keydown === 'meta+s') {
                        if (this.dialogVisible) {
                            // 是否保存成功后跳转新页面
                            this.isGo = true;
                            this.getInfoValid();
                            // 关闭弹窗
                            this.dialogVisible = false;
                        } else {
                            this.getInfoValid();
                        }
                        // 取消浏览器原有的操作
                        e.preventDefault();
                    }
                    if (!this.isEdit && this.getEditAuth == 2 && this.keydown === 'meta+e') {
                        this.editInfo(true);
                        // 取消浏览器原有的操作
                        e.preventDefault();
                    }
                } else {
                    if (this.isEdit && this.keydown === 'control+s') {
                        if (this.dialogVisible) {
                            // 是否保存成功后跳转新页面
                            this.isGo = true;
                            this.getInfoValid();
                            // 关闭弹窗
                            this.dialogVisible = false;
                        } else {
                            this.getInfoValid();
                        }
                        // 取消浏览器原有的操作
                        e.preventDefault();
                    }
                    if (!this.isEdit && this.getEditAuth == 2 && this.keydown === 'control+e') {
                        this.editInfo(true);
                        // 取消浏览器原有的操作
                        e.preventDefault();
                    }
                }
            },
            /**
             * @description: 按键起来的事件
             * @param {Object}  e
             * @return {type} 
             */
            handleKeyUp(e) {
                this.keydown = '';
                this.arrKey = [];
                e.preventDefault();
            },
            /**
             * @description: 编辑详情跳转
             * @param {boolean} isEdit  true=进入编辑页   false=进入详情页 
             * @return {type} 
             */
            editInfo(isEdit) {
                let params = commonFun.deepClone(this.$route.query);
                if(isEdit) {
                    params.isEdit = '1';
                } else {
                    delete params.isEdit;
                }
                // 从动销页面点击编辑带进来的参数，只是为了点击取消按钮决定返回哪个页面
                if (params.isDynamic) {
                    delete params.isDynamic;
                }
                this.$router.push({ name: this.$route.name, query: params});
            },
            // 获取页面权限
            getisEditAuth() {
                const params = {
                    task_id: this.$route.query.taskId,
                    // 放量详情页面id为8
                    page_id: 8
                };
                this.$store.dispatch('isEditAuth', params);
            },
            // 处理关联户型
            dealwithHouse(data) {
                return data && data.relation_house_types;
            },
            // 初始化方法
            initHandle() {
                // 获取url参数
                this.projectId = this.$route.query.projectId;
                this.taskId = this.$route.query.taskId;
                this.buildingId = this.$route.query.buildingId;
                this.isEditVal = this.$route.query.isEdit;
                this.buildingName = this.$route.query.buildingName ? decodeURIComponent(this.$route.query.buildingName) : '';
                // 挂载导入的方法
                this.isRequiredInfoOrigin = isRequiredInfoOrigin;
                this.getOriginOperateInfo = getOriginOperateInfo;
                this.confirmMsg = confirmMsg;
                // 动态修改是否编辑
                // this.isEditVal = this.buildingId ? this.isEdit == 1 : true;
                this.isEdit = this.buildingId ? this.isEditVal == 1 : true;
            },
            /**
             * @description: 获取跳转8.1tab大页面url  （因为楼栋页面链接参数精简了，所以不能使用公共方法的getHrefUrl）
             * @param {String} pageNum tab页面对应的pageId
             * @param {String} isEdit  1=编辑
             * @returns {String} 拼接后的url
             */
            getHrefUrl(pageNum, isEdit = '') {
                const {
                    query: {
                        // 楼盘id
                        projectId,
                        // 任务id
                        taskId = '',
                        // 标识入口时从哪跳进来的   operation：楼盘列表（不分离页面）  expand：楼盘任务列表（分离页面）';
                        role = '',
                        // 楼盘业态
                        buildingType = this.buildingType,
                        // 楼盘名称
                        projectName = this.projectName,
                        // 城市id
                        cityId = this.cityId
                    }
                } = this.$route;
                const baseUrl = `/dist/building/tabToggleList?projectId=${projectId}`;
                return `${baseUrl}&taskId=${taskId}&role=${role}&cityId=${cityId}&projectName=${projectName}&buildingType=${buildingType}&positionTab=${pageNum}&isEdit=${isEdit}`;
            },
            // 获取配置信息
            getConfigLists() {
                if (!localStorage.getItem('getConfigLists')) return;
                const storageStr = localStorage.getItem('getConfigLists');
                return JSON.parse(storageStr);
            },
            // 修改楼栋销售状态
            editBuildingStatus() {
                // error_type 1、楼盘销售状态被修改导致的不自洽2、户型销售状态被修改导致的不自洽
                // error_type 3、楼栋销售状态被修改导致的不自洽4、分期销售状态被修改导致的不自洽
                // frompage/topage 1、动销信息列表页 2、户型详情页 3、楼栋详情页 4、放量&交房页
                setTrack(trackIdList.building, {
                    error_type: '3',
                    role: this.getConfigList.current_role_source == 7 ? '2' : '1',
                    frompage: '3',
                    topage: '3'
                });
                this.selfConsistentDialogvisible = false;
            },
            // 修改楼盘销售状态
            editProjectStatus() {
                setTrack(trackIdList.project, {
                    error_type: '3',
                    role: this.getConfigList.current_role_source == 7 ? '2' : '1',
                    frompage: '3',
                    topage: '1'
                });
                window.open(this.getHrefUrl(2));
            },
            // 标记最高
            changeMark(item) {
                if (item.field_value === '1') {
                    item.field_value = '2';
                } else {
                    item.field_value = '1';
                }
            },
            /**
             * 判断是否室下拉的展示，展示对应的文本
             * @param {Object} item 对应的数据项
             */
            getValueOrText(item) {
                let content = item.field_value;
                // 需要展示文本的字段
                const showTextArr = ['saling_status', 'relation_house_types'];
                if (showTextArr.includes(item.field_name)) {
                    content = Array.isArray(item.field_text) ? item.field_text.join(',') : item.field_text;
                }
                return content;
            },
            /**
             * 根据楼盘id获取证件楼栋下拉数据
             */
            async getlicenseBuildingById() {
                try {
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId
                    };
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await api.getLicenseBuildingList(options);
                    if (code === 0) {
                        this.licenseBuildingList = data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取楼栋详情初始化空数据结构
            async getEmptyInitData() {
                try {
                    const options = {
                        // 楼详情页面id为7
                        page_id: 7,
                        task_id: this.$route.query.taskId || ''
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await commonApi.getPageModuleData(options);
                    if (code === 0) {
                        // this.initOriginData = data;
                        // 拼装要渲染的数据结构
                        this.spaceModuleData = {
                            baseInfo: this.getNecessaryData(this.initInfoDealwith(data)),
                            relativeInfo: data.building_relation_detail && this.getNecessaryData(data.building_relation_detail.data),
                            name: 'initEmptyOrg'
                        };
                        // 如果不存在楼栋id 则认为时新增 取空结构数据推入
                        if (!this.buildingId) {
                            // 新增时带入楼栋名称
                            this.spaceModuleData.baseInfo.building_name.field_value = this.buildingName || '';
                            this.originData = [data.building_base_detail.data];
                            this.buildingData = [commonFun.deepClone(this.spaceModuleData)];
                            this.initOriginData = data;
                        }
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取楼栋详情初始化数据
            async getBuildInitData() {
                try {
                    this.pageLoading = true;
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId,
                        building_id: this.$route.query.buildingId
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await api.getbuildingInfo(options);
                    this.pageLoading = false;
                    if (code === 0) {
                        // 保存源数据
                        this.initOriginData = data;
                        this.originData = [data.building_base_detail.data];
                        // 过滤必要字段信息 只保存必要的字段 减少观测 也减少向后台提交的数据
                        const necessaryData = {
                            baseInfo: this.getNecessaryData(this.initInfoDealwith(data)),
                            relativeInfo: data.building_relation_detail && this.getNecessaryData(data.building_relation_detail.data),
                            name: 'initOrg'
                        };
                        this.buildingData = [necessaryData];
                        // this.initOriginData = this.buildingData;
                        // 标识是编辑页面 需要删除远程数据
                        this.needRemote = true;
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    console.log(error);
                    this.pageLoading = false;
                }
            },
            /**
             * 获取必要的结构数据
             * @param {Object} origin 原数据
             * @return {Object} 过滤后的必要数据
             */
            getNecessaryData(origin) {
                let necessaryData = {};
                // 遍历数据 保存必要的字段 并返回
                Object.keys(origin).forEach(name => {
                    const item = origin[name];
                    necessaryData[name] = {
                        field_id: item.field_id,
                        field_name: item.field_name,
                        field_value: item.field_value,
                        field_text: item.field_text,
                        field_desc: item.field_desc,
                        belong_role: item.belong_role,
                        belong_other: item.belong_other,
                        is_show_belong_role: item.is_show_belong_role,
                        belong_employee_id: item.belong_employee_id,
                        belong_employee_name: item.belong_employee_name,
                        belong_datetime: item.belong_datetime,
                        table_id: item.table_id
                    };
                    if (item.url) {
                        necessaryData[name].url = item.url;
                    }
                });
                return necessaryData;
            },
            /**
             * 初始化信息处理
             * @param {Object} data 需要处理的数据
             * @return {Object} 处理之后的数据
             */
            initInfoDealwith(data) {
                const initData = commonFun.deepClone(data.building_base_detail.data);
                // 需要转换为数字的值 销售状态、证件楼栋 是否显示
                const numberFields = ['saling_status', 'is_show'];
                Object.keys(initData).forEach(ele => {
                    // 来源转数字
                    if (initData[ele].is_show_belong_role == '1') {
                        initData[ele].belong_role = Number(initData[ele].belong_role);
                    }
                    // 下拉字段转换为数字
                    if (numberFields.includes(ele)) {
                        initData[ele].field_value = initData[ele].field_value === '' ? '' : Number(initData[ele].field_value);
                    }
                });
                return initData;
            },
            /**
             * 来源变化触发change
             * @param {String} name 数组对象所属的来源名称 用来区分是更新来源所属对象
             * @param {String} fieldName 对应的字段名 用此字段名匹配更新对应的来源
             * @param {Number} index 当前触发变化的来源所在索引
             * @param {String} val 变更后来源的值
             * @param {String} otherVal 变更后其他来源输入的值
             */
            changeSource(name, fieldName, index, val, otherVal) {
                // 遍历所有子模块给每个模块内得来源赋值
                this.buildingData.forEach((ele, idx) => {
                    if (index !== idx && ele.name === name) {
                        const formData = ele.baseInfo;
                        // 如果是切换标签改变来源值 否则改变other值
                        if (otherVal === '') {
                            formData[fieldName].belong_role = val;
                        } else {
                            formData[fieldName].belong_other = otherVal;
                            // 延时更新组件key
                            setTimeout(() => {
                               this.belongOther = otherVal;
                            }, 800)
                        }
                    }
                });
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
            // 跳转动销信息页面
            goToDynamicSale() {
                this.$router.push(this.getHrefUrl(2).replace(/^\/dist/, ''));
            },
            // 新增楼栋
            addSpaceBuilding() {
                const newData = commonFun.deepClone(this.spaceModuleData);
                // 将值置为空
                newData.baseInfo.building_name.field_value = '';
                this.buildingData.push(newData);
                // 再push一份到源数据  以便于后来比较
                this.originData.push(commonFun.deepClone(newData.baseInfo));
            },
            /**
             * 删除楼栋模块
             * @param {Number} index 模块对应索引
             */
            async delBuild(index) {
                try {
                    const canDel = await this.confirmMsg('一旦删除则数据无法恢复，请确认是否删除！');
                    if (!canDel) {
                        return;
                    }
                    // 判断是否是已有的楼栋删除 如果是则请求删除接口删除 否则本地删除
                    if (index === 0 && this.needRemote) {
                        // 远程删除
                        const res = await this.remoteDelBuildingById();
                        if (!res) {
                            return;
                        }
                    }
                    this.buildingData.splice(index, 1);
                    this.originData.splice(index, 1);
                } catch (error) {
                    console.log(error);
                }
            },
            // 根据远程删除楼栋
            async remoteDelBuildingById() {
                try {
                    const options = {
                        project_id: this.projectId,
                        building_id: this.$route.query.buildingId,
                        task_id: this.taskId
                    };
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await api.delBuildingData(options);
                    this.$message(msg);
                    if (code === 0) {
                        this.needRemote = false;
                        return true;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 复制上个楼栋
            copyPrevBuilding() {
                // 去数组中的最后一位的数据
                const lastData = this.buildingData[this.buildingData.length - 1];
                const deepData = commonFun.deepClone(lastData);
                // 剔除楼栋名称和楼栋曾用名
                deepData.baseInfo.building_name.field_value = '';
                if (deepData.baseInfo.used_name) {
                    deepData.baseInfo.used_name.field_value = '';
                }
                // push到表单渲染数据
                this.buildingData.push(deepData);
                // 再push一份到源数据  以便于后来比较
                this.originData.push(commonFun.deepClone(deepData.baseInfo));
            },
            // 打开新页面修改信息
            toNewPage() {
                let tabNumber = 1;
                if (this.url === '/building/projectSituation') {
                    tabNumber = 4;
                } else if (this.url === '/building/capacityPlan') {
                    tabNumber = 3;
                } else if (this.url === '/building/tabToggleList') {
                    tabNumber = 2;
                } else {
                    // 表示要跳转到楼座位置编辑页面
                    window.open(this.url);
                    return;
                }
                if (tabNumber === 2 || tabNumber === 3) {
                    window.open(this.getHrefUrl(tabNumber, 1));
                    return;
                }
                window.open(this.getHrefUrl(tabNumber));
            },
            // 点击去修改
            toEdit(url) {
                this.url = url;
                this.dialogVisible = true;
            },
            /**
             * 页面跳转方法
             * @param {Boolean} isSave 是否保存
             */
            goToPage(isSave) {
                if (isSave) {
                    // 是否保存成功后跳转新页面
                    this.isGo = true;
                    this.getInfoValid();
                    // 关闭弹窗
                    this.dialogVisible = false;
                    return;
                }
                this.toNewPage();
                // 关闭弹窗
                this.dialogVisible = false;
                // 获取数据进入查看页
                this.editInfo(false);
                // 更新数据进入详情
               /*  const { query, path } = this.$route;
                this.$router.push({
                    path,
                    query: Object.assign({}, query, {isEdit: 0})
                });
                window.location.reload(); */
            },
            /**
             * 新页面打开链接
             * @param {String} type 要跳转地址type
             */
            goToBuildPos(type) {
                if (type === 'lz') {
                    // 显示保存跳转弹窗
                    this.dialogVisible = true;
                    this.url = `/index.php?r=yw-projects%2Fupdate&project_id=${this.projectId}&page_tag=view-common-info`;
                    // 进入楼座位置编辑页面
                    // window.open(`/index.php?r=yw-projects%2Fupdate&project_id=${this.projectId}&page_tag=view-common-info`);
                } else if (type === 'smxkz') {
                    // 售卖许可证列表页
                    window.open(`/index.php?r=cj-license%2Findex&project_id=${this.projectId}`);
                }
            },
            // 验证
            getInfoValid() {
                if (this.buildingData.length === 0) {
                    // this.$router.push(this.getHrefUrl(2));
                    // 返回动销页面
                    this.goToDynamicSale();
                    return;
                }
                // 表单必填校验开始
                let validStatus = [];
                // 循环验证多个表单记录每个表单验证结果
                this.$refs.buildingForm.forEach(ele => {
                    ele.validate((valid) => {
                        if (valid) {
                            validStatus.push(true);
                        } else {
                            validStatus.push(false);
                        }
                    });
                });
                if (validStatus.includes(false)) {
                    this.$message.warning('请检查必填信息是否填写完整!');
                    return;
                }
                // 获取当前需要校验得表单数据
                const buildingData = this.buildingData.map(ele => {
                    return ele.baseInfo;
                });
                // 楼栋名称重复校验
                const names = buildingData.map(ele => {
                    return ele.building_name.field_value;
                });
                if (new Set(names).size !== names.length) {
                    this.$message.warning('楼栋名称不可重复');
                    return;
                }
                // 楼栋销售状态自洽判断
                const resSts = buildingData.find(ele => {
                    // 销售状态
                    const saleStatus = ele.saling_status.field_value;
                    // 在售房源量
                    const saleNum = ele.on_sale_num.field_value;
                    if (saleStatus == 3 && Number(saleNum)) {
                        this.$message('售罄楼栋在售房源量需要为0或者空');
                        return true;
                    }
                    if ((saleStatus == 2 || saleStatus == 4) && saleNum === 0) {
                        this.$message('在售/待售楼栋的在售房源量不能为0');
                        return true;
                    }
                });
                if (resSts) {
                    return;
                }
                // 校验信息来源是否变更
                if (!this.isRequiredInfoOrigin(this.originData, buildingData, true)) {
                    return;
                }
                // 拼接要保存得数据结构
                const createdData = {
                    org: {
                        building_base_detail: this.buildingData[0].baseInfo,
                        building_relation_detail: this.buildingData[0].relativeInfo
                    },
                    new: this.buildingData.slice(1).map(ele => {
                        return {
                            building_base_detail: ele.baseInfo,
                            building_relation_detail: ele.relativeInfo
                        }
                    })
                };
                // 以上验证都通过后执行保存信息
                this.saveCapacityInfo(createdData);
            },
            // 取消操作
            cancleEdit() {
                // 新增楼栋取消返回动销
                if (this.buildingData.length === 0) {
                    this.goToDynamicSale();
                    return;
                }
                // 如果进入页面时是查看页 则取消后还返回查看
                if (!this.$route.query.isDynamic) {
                    this.editInfo(false);
                    return;
                }
                // 返回动销页面
                this.goToDynamicSale();
            },
            // 保存楼栋详情信息
            async saveCapacityInfo(submitData) {
                this.pageLoading = true;
                try {
                    // 判断是否在提交过程中，防止重复提交
                    if (this.isSubmiting) {
                        return;
                    }
                    this.isSubmiting = true;
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId,
                        building_id: this.$route.query.buildingId
                    };
                    options.belong_data = submitData;
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await api.saveBuildingInfo(options);
                    this.isSubmiting = false;
                    if (code === 0) {
                        this.$message('保存成功');
                        if (!this.$route.query.buildingId) {
                            // 新增页面
                            this.$router.push({
                                path: '/building/buildingDetailEdit',
                                query: {
                                    projectId: this.projectId,
                                    taskId: this.taskId,
                                    buildingId: data.id
                                }
                            })
                        } else {
                            this.editInfo(false);
                        }
                        if (this.isGo) {
                            // 保存成功后关闭弹窗 进行跳转
                            this.dialogVisible = false;
                            this.toNewPage();
                        }
                    } else if (code === 10007) {
                        // 楼栋名称重复
                        this.$alert(msg, '提示', {
                            confirmButtonText: '确定'
                        });
                    } else if (code === 10008) {
                        // 楼栋销售状态和不自洽提示
                        this.selfConsistentMessage = msg;
                        this.selfConsistentDialogvisible = true;
                    } else {
                        this.$message(msg);
                    }
                    // 保存完成后先清空跳转状态
                    this.url = '';
                    this.isGo = false;
                    this.pageLoading = false;
                } catch (error) {
                    this.isSubmiting = false;
                    this.pageLoading = false;
                    console.log(error);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .flex-box{
        display: flex;
        align-items: center
    }
    .el-icon-warning {
        color: #ff6e0e;
        font-size: 20px;
        margin-top: 10px;
        margin-left: 6px;
    }
    .building-wrap{
        font-size: 14px;
        padding: 15px;
        background-color: #fff;
        border-radius: 8px;
        .head-line{
            padding: 15px 0;
            font-size: 16px;
            font-weight: bold;
            justify-content: space-between;
        }
    }
    .build-form-wrap {
        border: 1px dotted #bbb;
        border-radius: 8px;
        padding: 10px;
    }
    .building-relative-info {
        margin-top: 40px;
        .form-left-box {
            min-width: 300px;
        }
        .edit-info {
            margin-left: 25px;
        }
    }
    .building-info-title{
        position: relative;
        padding: 0 10px 10px;
        border-bottom: 1px solid #dcdfe6;
        .title-content{
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
    .del-module {
        position: absolute;
        top: -6px;
        right: 0;
    }
    .building-form {
        margin-top: 20px;
    }
    .add-building {
        padding: 20px 0 0;
    }
    .building-pic {
        padding-top: 20px;
    }
    .form-left-box{
        min-width: 520px;
        .item{
            margin-left: 25px;
            color: #f78f0f;
            font-size: 16px;
            cursor: pointer;
            .focus{
                font-weight: bold;
            }
        }
        /deep/ .el-input{
            width: 260px;
        }
    }
    .form-item-wrap {
        /deep/ .el-form-item__content{
            display: flex;
        }
        .btn-mark{
            margin-left: 10px;
        }
    }
    .remark-info {
        /deep/ .el-input__count {
            background-color: transparent;
        }
    }
    .btn-operate {
        text-align: center;
        padding: 15px 0;
    }
    .dialog-box {
        /deep/ .el-button {
            width: 200px;
            margin-left: 0px;
            margin-bottom: 10px;
        }
    }
</style>