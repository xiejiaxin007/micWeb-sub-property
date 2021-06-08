<!--
    @name: 楼盘动销信息
    @description: 楼盘动销信息主页面
    @author: 贺伟
    @date: 2019-12-09
-->
<template>
    <div class="dynamic-sale" v-loading="pageLoading">
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
            <el-breadcrumb-item>动销信息</el-breadcrumb-item>
            <el-breadcrumb-item>{{isEdit ? '编辑' : '查看'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!--主要内容部分开始-->
        <div class="dynamic-sale-main">
            <div class="head-line">
                <h4>{{getProjectNameAndTypes}}动销信息</h4>
                <div v-if="getEditAuth == 2 && !isEdit">
                    <auto-set-dynamic></auto-set-dynamic>
                    <el-button
                        @click="editInfo"
                        type="primary">
                        编辑
                    </el-button>
                </div>
            </div>
            <!-- 动销详情展示 -->
            <dynamic-detail
                v-if="!isEdit"
                @goToAlert="showHrefDialog"
                @copyHouse="copyHouse"
                @updateInitInfo="updateInitInfo"
                :project-data="projectData"
                :house-type-data="houseTypeData"
                :building-data="buildingData"
                :project-remark="projectRemark"
                :house-type-copy="getConfigList.house_type_copy_field"
                :role-number="getConfigList.current_role_source"
                :info-source="getConfigList.qd_source_list"
                :host="host"
                :show-source-btn="getEditAuth == 2 && !isEdit && !taskId"/>
            <div v-show="isEdit">
                <!--楼盘信息-->
                <child-module-project-info
                    ref="project"
                    v-if="projectData.data"
                    :role-number="getConfigList.current_role_source"
                    :sale-status="getConfigList.sale_status"
                    :info-source="getConfigList.qd_source_list"
                    :price-type="getConfigList.unit_price_type"
                    :total-price-type="getConfigList.new_total_price_type_list"
                    :init-data="projectData"/>
                <!--户型信息-->
                <child-module-house-info
                    ref="houseType"
                    v-if="houseTypeDataEdit.data"
                    @goToAlert="showHrefDialog"
                    @copyHouse="copyHouse"
                    :role-number="getConfigList.current_role_source"
                    :sale-status="getConfigList.sale_status"
                    :info-source="getConfigList.qd_source_list"
                    :room-types="getConfigList.room_type"
                    :room-orientation="getConfigList.new_room_orientation"
                    :house-type-is-show="getConfigList.house_type_is_show"
                    :init-data="houseTypeDataEdit"
                    :host="host"
                    :cityId="cityId"/>
                <!--楼栋信息-->
                <child-module-building-info
                    ref="building"
                    v-if="buildingData.data"
                    @goToAlert="showHrefDialog"
                    :sale-status="getConfigList.sale_status"
                    :info-source="getConfigList.qd_source_list"
                    :is-show="getConfigList.building_is_show"
                    :init-data="buildingData"/>
                <!--楼盘备注-->
                <el-button
                    type="primary"
                    size="small"
                    v-if="getConfigList.current_role_source == ROLENUMBER"
                    @click="goToBuildPos">
                    上传楼座图
                </el-button>
                <div class="project-mark">
                    <div class="modal-title-box" v-if="projectRemark.data">
                        <h3 class="title-content">楼盘备注</h3>
                    </div>
                    <el-form class="mark-form" 
                        ref="copyForm">
                        <el-form-item
                            v-if="projectRemark.data"
                            label="楼盘备注："
                            label-width="100px">
                            <el-input
                                type="textarea"
                                class="mark-input"
                                :rows="5"
                                :maxlength="1024"
                                placeholder="请输入楼盘备注"
                                v-model="projectRemark.data.project_note.field_value">
                            </el-input>
                        </el-form-item>
                        <el-form-item class="mark-form-btn">
                            <el-button
                                @click="cancleEdit">
                                取消
                            </el-button>
                            <el-button
                                type="primary"
                                @click="saveInfo">
                                保存
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 价格涨跌限制弹窗 -->
        <el-dialog
            :visible.sync="priceLimitDialog"
            :title="dialogTitle"
            width="30%"
            class="price-msg-dialog"
            @close="confirmLimitSts = false, confirmChangeSts = false"
            center>
            <span v-html="priceLimitMessage"></span>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="confirmSubmit">
                    确认并保存
                </el-button>
                <el-button
                    type="primary"
                    @click="confirmToEdit">
                    修改
                </el-button>
            </span>
        </el-dialog>
        <!-- 楼盘户型自洽弹窗 -->
        <el-dialog
            :visible.sync="selfConsistentDialogvisible"
            title="不自洽提示"
            width="30%"
            center>
            <span>{{selfConsistentMessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="editHouseTypeStatus">
                    修改{{codeStatus === 20009 ? '楼栋' : '户型'}}销售状态
                </el-button>
                <el-button
                    type="primary"
                    @click="editHousePrejectStatus">
                    修改楼盘销售状态
                </el-button>
            </span>
        </el-dialog>
        <!--保存跳转提示弹窗-->
        <div class="dialog-box">
            <msg-dialog
                title="保存跳转提示"
                width="270px"
                @closeDialog="closeHrefDiag"
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
                            @click="dialogVisible = false">
                            取 消
                        </el-button>
                    </div>
            </msg-dialog>
        </div>
        <!--新增并复制户型弹窗-->
        <copy-house-type
            @statusChange="copyHouseChange"
            :house-type-id="houseTypeId"
            :city-id="cityId"
            :project-name="projectName"
            :project-id="projectId"
            :label-data="getConfigList.house_type_copy_field"
            :visible.sync="houseDialogVisible"/>
    </div>
</template>

<script>
    import ChildModuleProjectInfo from './CMProjectInfo';
    import ChildModuleHouseInfo from './CMHouseInfo';
    import ChildModuleBuildingInfo from './CMBuildingInfo';
    import CopyHouseType from '../components/CopyHouseTypeDialog';
    import DynamicDetail from './DynamicDetail';
    // const CopyHouseType = () => import(/* webpackChunkName: "CopyHouseType" */'../components/CopyHouseTypeDialog');
    // const DynamicDetail = () => import(/* webpackChunkName: "DynamicDetail" */'./DynamicDetail');
    import apiObj from '@/api/buildingDictionary/expandTagList';
    import commonApi from '../api/common';
    import MsgDialog from '../components/MsgDialog';
    import AutoSetDynamic from '../components/AutoSetDynamic';
    import {
        yuanToWan,
        confirmMsg,
        confirmDefindMsg,
        setTrack
    } from '../utils/index';
    import {
        roleNumList,
        trackIdList
    } from '../config/tabToggleList';
    import { mapState } from "vuex";
    import { commonFun } from '@/assets/js/utils/utils';
    export default {
        name: 'DynamicSaleInfoEdit',
        components: {
            ChildModuleProjectInfo,
            ChildModuleHouseInfo,
            ChildModuleBuildingInfo,
            DynamicDetail,
            MsgDialog,
            CopyHouseType,
            AutoSetDynamic
        },
        computed: {
            ...mapState({
                getConfigList: state => state.buildingDictionary.projectConfiglist,
                host: state => state.buildingDictionary.ossOriginHost,
                // 获取页面权限信息
                getEditAuth: state => state.buildingDictionary.isAuditorAuth
            })
        },
        watch: {
            // 监听路由，修改isEdit的值
            $route: function(val, oldVal) {
                this.isEdit = val.query.isEdit && val.query.isEdit === '1';
                // 从编辑页面进入详情页面从新请求初始化接口
                if (!val.query.isEdit && oldVal.query.isEdit === '1') {
                    this.getInitInfo();
                }
            }
        },
        data() {
            return {
                // 获取运营角色值
                ROLENUMBER: roleNumList.yunYing,
                // 跳转确认弹窗
                dialogVisible: false,
                // 页面loading
                pageLoading: false,
                // 标识是否在提交中，防止重复提交
                isSubmiting: false,
                // 弹窗title
                dialogTitle: '提示信息',
                // 自洽弹窗显示隐藏
                selfConsistentDialogvisible: false,
                // 自洽信息
                selfConsistentMessage: '',
                // 价格涨跌限制弹窗
                priceLimitDialog: false,
                // 价格涨跌限制弹窗信息
                priceLimitMessage: '',
                // 楼盘信息数据
                projectData: {},
                // 户型数据信息
                houseTypeData: {},
                // 户型数据信息--用于编辑（过滤假户型） 
                houseTypeDataEdit: {},
                // 楼栋信息数据
                buildingData: {},
                // 楼盘备注信息
                projectRemark: {},
                // 楼盘备注信息
                projectMarkInfo: '',
                // 是否时编辑页
                isEdit: false,
                // 阿里云图片host
                codeStatus: '',
                // 面包屑文案
                breadText: '楼盘列表',
                // 户型id
                houseTypeId: '',
                // 复制户型弹窗显示隐藏
                houseDialogVisible: false,
                // 标题，楼盘名+业态+--
                getProjectNameAndTypes: '',
                // 城市ID
                cityId: '',
                // 楼盘名
                projectName: '',
                // 业态
                buildingType: ''
            }
        },
        created() {
            this.pageLoading = true;
            // 获取楼盘id
            this.projectId = this.$route.query.projectId;
            this.getProjectInfo();
            // 获取任务id
            this.taskId = this.$route.query.taskId;
            // 获取是否要跳转到编辑
            this.isEdit = this.$route.query.isEdit === '1';
            // 挂载确认弹窗
            this.confirmMsg = confirmMsg;
            // 挂载可传参弹窗
            this.confirmDefindMsg = confirmDefindMsg;
            // 是否需要校验放量计划
            this.isCheckVolume = 1;
            // 动态面包屑
            this.isOperation();
            // 获取初始化信息
            this.getInitInfo();
        },
        methods: {
            // 根据楼盘id获取楼盘基本信息接口
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
            // 【父组件调用】快捷键保存、编辑操作
            handleShortCut() {
                if (this.$route.query.isEdit && this.$route.query.isEdit === '1') {
                    // 保存操作   如果有跳转提示弹窗要关闭弹窗并跳转
                    if(this.dialogVisible) {
                        this.isGo = true;
                        this.saveInfo();
                        return;
                    } else {
                        this.saveInfo();
                    }
                } else {
                    // 编辑操作
                    if (this.getEditAuth == 2) {
                        this.editInfo();
                    }
                }
            },
            /**
             * 展示跳转确认弹窗
             * @param {Object} hrefMsg 要跳转的对象信息
             */
            showHrefDialog(hrefMsg) {
                this.dialogVisible = true;
                this.hrefMsg = hrefMsg;
            },
            // 关闭跳转提示弹窗
            closeHrefDiag() {
                this.dialogVisible = false;
                this.isGo = false;
            },
            /**
             * 复制户型保存完成事件处理
             * @param {Boolean} status 是否复制户型成功
             * @param {String} data 如果保存成功 data返回户型id
             */
            copyHouseChange(status, data) {
                if (!status) {
                    return;
                }
                // 新标签页打开复制的户型编辑页面
                const querys = this.$route.query;
                
                let queryHref = this.$router.resolve({
                    path: '/building/BuildAddHouseDetail',
                    query: {
                        projectId: querys.projectId,
                        taskId: querys.taskId,
                        houseTypeId: data
                    }
                });
                window.open(queryHref.href);
                // 成功后重新调取获取接口获取数据更新页面
                this.updateInitInfo();
            },
            /**
             * 页面跳转保存
             * @param {Boolean} isSave 是否进行保存再跳转
             */
            goToPage(isSave) {
                // 如果是点击的保存当前信息跳转
                if (isSave) {
                    this.isGo = true;
                    // 保存数据
                    this.saveInfo();
                    return;
                }
                // 如果是编辑页面得复制户型
                // 注释掉复制户型时的保存跳转提示 此功能移除，无需弹保存跳转提示
                /* if (this.isCopyHouse) {
                    this.isEdit = false;
                    this.updateNewData();
                    // 弹出复制户型弹窗
                    this.houseDialogVisible = true;
                    // 关闭当前跳转弹窗
                    this.dialogVisible = false;
                    return;
                } */
                this.goToNewPage();
                // 关闭弹窗
                this.dialogVisible = false;
                // 进入详情
                this.$emit('changeStatus', false);
                // this.updateInitInfo()
            },
            /**
             * 点击复制户型 弹出跳转提示
             * @param {String} houseId 户型id
             */
            copyHouse(type, houseId) {
                // 保存当前得户型id
                this.houseTypeId = houseId;
                if (type === 'detail') {
                    this.houseDialogVisible = true;
                    return;
                }
                // this.isCopyHouse = true;
                // 弹出复制户型弹窗
                this.houseDialogVisible = true;
                // 显示跳转弹窗
                // this.dialogVisible = true;
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
            // 新页面跳转
            goToNewPage(url) {
                if (url) {
                    window.open(url);
                }
                const {
                    path,
                    isEdit = '',
                    id,
                    idName,
                    buildingName
                } = this.hrefMsg;
                const {
                    projectId = '',
                    taskId = '',
                    role = ''
                } = this.$route.query;
                // 定义需要的
                const fieldId = id ? `&${idName}=${id}` : '';
                let baseUrl = `/dist/building/${path}?projectId=${projectId}&taskId=${taskId}${fieldId}&isEdit=${isEdit}&role=${role}`;
                // 户型详情页面
                if (idName === 'houseTypeId') {
                    window.open(`${baseUrl}`);
                    return;
                }
                // 跳转楼栋编辑页面
                if (!id && idName === 'buildingId' && buildingName !== '') {
                    // 路由会把#处理掉 所以要进行转码
                    window.open(`${baseUrl}&buildingName=${encodeURIComponent(buildingName)}`);
                    return;
                }
                if (idName === 'oldBuildingPic') {
                    baseUrl = `/index.php?r=yw-projects%2Fupdate&project_id=${this.projectId}&page_tag=view-common-info`;
                }
                window.open(baseUrl);
            },
            // 编辑信息
            editInfo() {
                this.$emit('changeStatus', true);
            },
            // 获取初始化信息
            async getInitInfo() {
                try {
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await apiObj.getDynamicInfo(options);
                    if (code === 0) {
                        // 对返回的数据进行赋值
                        // 赋值楼盘信息
                        this.projectData = data.movable_pin_project_info || {};
                        // 赋值户型数据信息
                        this.houseTypeData = data.movable_pin_house_type_info || {};
                        // 深拷贝一份户型信息
                        this.houseTypeDataEdit = commonFun.deepClone(this.houseTypeData);
                        // 编辑状态下需要去掉假数据
                        this.houseTypeDataEdit.data = this.houseTypeData.data.filter((item) => {
                            return item.is_false && item.is_false.field_value === '2';
                        });
                        // 赋值楼栋信息数据
                        this.buildingData = data.movable_pin_building_info || {};
                        // 赋值楼盘备注信息
                        this.projectRemark = data.movable_pin_project_remark || {};
                        this.$nextTick(() => {
                            this.pageLoading = false;
                        });
                    } else {
                        this.pageLoading = false;
                        this.$message(msg);
                    }
                } catch (error) {
                    this.pageLoading = false;
                    console.log(error);
                }
            },
            // 进入楼座位置编辑页面
            goToBuildPos() {
                this.hrefMsg = {
                    idName: 'oldBuildingPic'
                };
                this.dialogVisible = true;
                // window.open(`/index.php?r=yw-projects%2Fupdate&project_id=${this.projectId}&page_tag=view-common-info`)
            },
            // 取消编辑
            cancleEdit() {
                this.$emit('changeStatus', false);
            },
            updateInitInfo() {
                this.getInitInfo().then(() => {
                    // this.updateNewData();
                });
            },
            // 更新最新数据
            updateNewData() {
                const data = this.houseTypeData;
                this.houseTypeData = {};
                this.$nextTick(() => {
                    this.houseTypeData = data;
                });
            },
            /**
             * 保存数据
             * @param {Object} editData 需要保存的楼盘、户型和楼栋信息
             */
            async saveDynamicInfo(editData) {
                try {
                    // 判断是否在提交过程中，防止重复提交
                    if (this.isSubmiting) {
                        return;
                    }
                    this.isSubmiting = true;
                    this.pageLoading = true;
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId,
                        is_check_volume: this.isCheckVolume,
                        // 楼盘备注
                        movable_pin_project_remark: this.projectRemark || {module_name: "楼盘信息", data: []}
                    };
                    Object.assign(options, editData);
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await apiObj.saveDynamicData(options);
                    this.isSubmiting = false;
                    // 20002 楼盘与户型楼栋 销售状态不自洽
                    // 20015 户型销售状态和在售余量不自洽
                    // 20020 户型居室类型不自洽
                    // 20007 楼栋名称不唯一
                    // 20008 户型销售状态不自洽
                    // 20009 楼栋销售状态不自洽
                    // 定义统一弹窗的code值
                    const selfConsisCodes = [20002, 20008, 20009];
                    // 记录返回的code值
                    this.codeStatus = code;
                    this.pageLoading = false;
                    if (code === 0) {
                        // 保存成功
                        if (this.isGo) {
                            // 保存成功后关闭弹窗 进行跳转
                            this.closeHrefDiag();
                            // 如果是编辑页面得复制户型
                            /* if (this.isCopyHouse) {
                                this.isEdit = false;
                                this.updateNewData();
                                // 弹出复制户型弹窗
                                this.houseDialogVisible = true;
                                return;
                            } */
                            this.goToNewPage();
                        }
                        this.$message('保存成功');
                        this.$emit('changeStatus', false);
                        // 将是否校验放量计划字段置为2，再次调取保存
                        this.isCheckVolume = 1;
                    } else if (code === 20013) {
                        // 放量不自洽弹窗
                        this.$confirm(msg, '提示', {
                            confirmButtonText: '添加',
                            cancelButtonText: '不添加',
                            showClose: false,
                            closeOnClickModal: false,
                            type: 'warning'
                        }).then(() => {
                            // 将是否校验放量计划字段置为2，再次调取保存
                            this.isCheckVolume = 2;
                            this.saveInfo(true).then(() => {
                                const search = location.search;
                                window.open(`/dist/building/capacityPlan?${search}&isEdit=1`);
                            });
                        }).catch(() => {
                            // 关闭弹窗
                            // 将是否校验放量计划字段置为2，再次调取保存
                            this.isCheckVolume = 2;
                            this.saveInfo(true);
                        });
                    } else if (selfConsisCodes.includes(code)) {
                        // 弹出自洽弹窗
                        this.selfConsistentMessage = msg;
                        this.selfConsistentDialogvisible = true;
                    } else if (code === 20015) {
                        this.$message.warning(msg);
                    } else if (code === 200007) {
                        // 楼栋重复验证
                        this.$alert(msg, '提示', {
                            confirmButtonText: '确定'
                        });
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    this.pageLoading = false;
                    console.log(error);
                }
            },
            // 大于10万小于一万判断
            priceValueValid(projectInfo, houseInfo) {
                const {
                    // 最小值
                    price_min: minPrice,
                    // 最大值
                    price_max: maxPrice
                } = this.getConfigList.price_limit_list;
                // 楼盘单价
                const projectPrice = Number(projectInfo.current_rate.field_value);
                const projectPriceMax = Number(projectInfo.current_rate_max.field_value);
                // 固定的提示文案
                const baseContent = '系统判断价格可能存在异常，请确认是否正确录入！';
                // 楼盘单价类型  4为区间值
                const currentPriceType = Number(projectInfo.current_price_type.field_value);
                // 楼盘提示信息
                let projectMsg = '';
                // 户型提示信息
                let houseMsgArr = [];
                // 判断楼盘价格是否超出限制 价格不得大于十万小于一万
                if (currentPriceType === 4) {
                    // 单价区间
                    if (projectPrice !== 0 && projectPriceMax !== 0 && (projectPriceMax >= yuanToWan(maxPrice) || projectPrice <= yuanToWan(minPrice))) {
                        projectMsg = `本次修改的楼盘单价为${projectPrice}-${projectPriceMax}万元/㎡，`
                    }
                } else {
                    if (projectPrice !== 0 && (projectPrice >= yuanToWan(maxPrice) || projectPrice <= yuanToWan(minPrice))) {
                        projectMsg = `本次修改的楼盘单价为${projectPrice}万元/㎡，`
                    }
                }
                // 判断户型价格限制
                houseInfo.forEach((ele, idx) => {
                    // 输入的户型单价
                    const unitPrice = ele.offer_price.field_value;
                    // 户型名称
                    const houseTypeName = ele.house_type_num.field_value;
                    // 建筑面积
                    const acreage = ele.acreage.field_value;
                    // 套内面积
                    const acAcreage = ele.ac_acreage.field_value;

                    const computeAcreage = acreage ? `(${acreage}㎡)` : acAcreage ? `(套内${acAcreage}㎡)` : '';

                    // 如果单机不等于0
                    if (unitPrice !== '' && (unitPrice >= yuanToWan(maxPrice) || unitPrice <= yuanToWan(minPrice))) {
                        houseMsgArr.push(`户型${houseTypeName}${computeAcreage}单价为${unitPrice}万元/㎡`);
                    }
                });
                // 如果存在超出限制的item项且原价不为0 则提示
                if (projectMsg !== '' || houseMsgArr.length > 0) {
                    this.dialogTitle = '单价录入提示';
                    this.priceLimitMessage = `${projectMsg} <br/> ${houseMsgArr.join('、<br/>')} ${baseContent}`;
                    // 标识当前弹窗类型
                    this.checkType = 'confirmChangeSts';
                    this.priceLimitDialog = true;
                    return false;
                }
                return true;
            },
            // 判断户型单价是否为空
            validHouseTypePrice(houuseData) {
                return houuseData.find(ele => {
                    const {
                        // 户型销售状态
                        status: {
                            field_value: saleStatus
                        },
                        // 户型单价
                        offer_price: {
                            field_value: unitPrice
                        }
                    } = ele;
                    // 销售状态在售
                    if (saleStatus == 2) {
                        return unitPrice === '';
                    }
                });
            },
            /**
             * 校验总价是否和单价*面积值一致
             */
            getPriceMatchStatus(allData) {
                let message = '';
                let existDiff = allData.find(item => {
                    const {
                        // 建筑面积
                        acreage: {
                            field_value: buildingAreaVal
                        },
                        // 套内面积
                        ac_acreage: {
                            field_value: insideAreaVal
                        },
                        // 单价
                        offer_price: {
                            field_value: singlePriceVal
                        },
                        // 总价
                        price: {
                            field_value: totalPriceVal
                        },
                        // 室
                        layout_shi: {
                            field_value: shiVal
                        },
                        // 厅
                        layout_ting: {
                            field_value: tingVal
                        },
                        // 厨
                        layout_chu: {
                            field_value: chuVal
                        },
                        // 卫
                        layout_wei: {
                            field_value: weiVal
                        },
                        // 户型编号
                        house_type_num: {
                            field_value: houseNumVal
                        }
                    } = item;
                    // 定义计算后的价格
                    let computedPrice = '';
                    const computeAcreage = buildingAreaVal ? `${buildingAreaVal}㎡` : insideAreaVal ? `(套内)${insideAreaVal}㎡` : '';
                    // 建筑面积或套内面积v和单价都不为空是计算总价
                    if ((buildingAreaVal !== '' && singlePriceVal !== '') || (insideAreaVal !== '' && singlePriceVal !== '')) {
                        if (Number(buildingAreaVal) && insideAreaVal !== '') {
                            // 重庆特殊处理，计算反过来
                            const belongCity = this.cityId || '';
                            if (belongCity === '20000050') {
                                computedPrice = (Number(insideAreaVal) ? insideAreaVal * singlePriceVal : buildingAreaVal * singlePriceVal).toFixed(4);
                            } else {
                                computedPrice = (buildingAreaVal * singlePriceVal).toFixed(4);
                            }
                        } else if (Number(buildingAreaVal) && insideAreaVal === '') {
                            computedPrice = (buildingAreaVal * singlePriceVal).toFixed(4);
                        } else {
                            computedPrice = (insideAreaVal * singlePriceVal).toFixed(4);
                        }
                    }
                    const shiMsg = Number(shiVal) ? `${shiVal || ''}室` : '';
                    const tingMsg = Number(tingVal) ? `${tingVal || ''}厅` : '';
                    const chuMsg = Number(chuVal) ? `${chuVal || ''}厨` : '';
                    const weiMsg = Number(weiVal) ? `${weiVal || ''}卫` : '';
                    message = `${houseNumVal}-${computeAcreage}-${shiMsg}${tingMsg}${chuMsg}${weiMsg}`;
                    return computedPrice !== '' && computedPrice != totalPriceVal;
                });
                return {
                    isEqual: !!existDiff,
                    message
                }
            },
            // 保存信息
            async saveInfo (isNotCheck = false) {
                // 楼盘信息数据及验证信息
                const projectValid = this.$refs.project ? this.$refs.project.getEditData() : {};
                if (!projectValid) {
                    return;
                }
                // 户型信息数据及验证信息
                const houseTypeValid = this.$refs.houseType ? this.$refs.houseType.getEditData() : [];
                if (!houseTypeValid) {
                    return;
                }
                // 楼栋信息数据及验证信息
                const buildingValid = this.$refs.building ? this.$refs.building.getEditData() : [];
                if (!buildingValid) {
                    return;
                }
                // 如果无需校验则直接保存
                if (isNotCheck === true) {
                    this.saveDynamicInfo({
                        movable_pin_project_info: {
                            module_name: "楼盘信息",
                            data: projectValid
                        },
                        movable_pin_house_type_info: {
                            module_name: "户型信息",
                            data: houseTypeValid
                        },
                        movable_pin_building_info: {
                            module_name: "楼栋信息",
                            data: buildingValid
                        }
                    });
                    return;
                }
                if (!(projectValid && houseTypeValid && buildingValid)) {
                    return;
                }
                if (!this.isCheckHousePrice && this.validHouseTypePrice(houseTypeValid)) {
                    const res = await this.confirmDefindMsg({
                        msg: '在售户型的报价为空，系统不推荐保存，请确认是否添加报价信息！',
                        confirmText: '不添加',
                        cancleText: '添加'
                    });
                    if (!res) {
                        return;
                    } else {
                        this.isCheckHousePrice = true;
                    }
                }
                // 校验价格大于10万小于1万限制
                if (!this.confirmChangeSts && !this.priceValueValid(projectValid, houseTypeValid)) {
                    return;
                }
                // 价格涨跌提示 如果confirmLimitSts（确认可以跳过价格限制判断）为false则需要弹窗提示 否则直接保存信息
                if (!this.confirmLimitSts && !this.checkPriceLimit(projectValid, houseTypeValid)) {
                    return;
                }
                // 判断是否确认计算总价和输入总价不一致
                const { isEqual, message } = this.getPriceMatchStatus(houseTypeValid);
                if (isEqual) {
                    let res = await this.confirmMsg(`${message}的价格面积修改存在错误，请确认是否保存`);
                    if (!res) {
                        return;
                    }
                }
                // 备注信息
                this.saveDynamicInfo({
                    movable_pin_project_info: {
                        module_name: "楼盘信息",
                        data: projectValid
                    },
                    movable_pin_house_type_info: {
                        module_name: "户型信息",
                        data: houseTypeValid
                    },
                    movable_pin_building_info: {
                        module_name: "楼栋信息",
                        data: buildingValid
                    }
                });
            },
            // 确认价格涨跌无误提交
            confirmSubmit() {
                // 标识是否可以跳过价格涨跌限制
                if (this.checkType === 'confirmLimitSts') {
                    this.confirmLimitSts = true;
                }
                // 大于10万小于1万
                if (this.checkType === 'confirmChangeSts') {
                    this.confirmChangeSts = true;
                }
                // 关闭弹窗
                this.priceLimitDialog = false;
                // 提交表单
                this.saveInfo();
            },
            // 确认价格涨跌错误
            confirmToEdit() {
                // 标识是否可以跳过价格涨跌限制
                /* if (this.checkType === 'confirmLimitSts') {
                    this.confirmLimitSts = false;
                }
                if (this.checkType === 'confirmChangeSts') {
                    this.confirmChangeSts = false;
                } */
                // 标识是否可以跳过价格涨跌
                this.confirmLimitSts = false;
                // 大于10万小于1万
                this.confirmChangeSts = false;
                // 关闭弹窗
                this.priceLimitDialog = false;
                // 添加关闭保存跳转弹窗
                this.selfConsistentDialogvisible = false;
                // errorScroll(this.$refs['houseType'].$el);
            },
            // 点击弹窗修改楼栋/户型销售状态处理 codeStatus === 20009为楼栋 其他为户型
            editHouseTypeStatus() {
                // 埋点
                // error_type 1、楼盘销售状态被修改导致的不自洽2、户型销售状态被修改导致的不自洽
                // error_type 3、楼栋销售状态被修改导致的不自洽4、分期销售状态被修改导致的不自洽
                // frompage/topage 1、动销信息列表页 2、户型详情页 3、楼栋详情页 4、放量&交房页
                const codeStatus = this.codeStatus;
                setTrack(codeStatus === 20009 ? trackIdList.building : trackIdList.houseType, {
                    error_type: codeStatus === 20009 ? '3' : '2',
                    role: this.getConfigList.current_role_source == 7 ? '2' : '1',
                    frompage: '1',
                    topage: '1'
                });
                // 关闭弹窗
                this.selfConsistentDialogvisible = false;
                this.editorHouseInfolist = this.editorHouseInfolists;
                // 滚动到楼盘销售状态更新处
                // errorScroll(this.$refs['houseType'].$el);
            },
            // 点击弹窗修改楼盘销售状态处理
            editHousePrejectStatus() {
                // 埋点
                setTrack(trackIdList.project, {
                    error_type: '1',
                    role: this.getConfigList.current_role_source == 7 ? '2' : '1',
                    frompage: '1',
                    topage: '1'
                })
                // 关闭弹窗
                this.selfConsistentDialogvisible = false;
                // 滚动到楼盘销售状态更新处
                // errorScroll(this.$refs['project'].$el);
            },
            /**
             * 价格涨跌限制检查
             * @param {Object} projectInfo 楼盘表单信息
             * @param {Object} houseInfo 户型表单信息
             * @return {Boolean} 是否通过校验
             */
            checkPriceLimit(projectInfo, houseInfo) {
                // 判断楼盘价格涨跌是否超出限制
                const {
                    // 价格变动限制 为-1不限制
                    price_limit: priceLimit

                } = this.getConfigList.price_limit_list;
                // 输入的单价
                const projectPrice = Number(projectInfo.current_rate.field_value);
                const projectPriceMax = Number(projectInfo.current_rate_max.field_value);
                // 当前类型
                const currentType = Number(projectInfo.current_price_type.field_value);
                // 原价
                const originPrice = Number(this.projectData.data.current_rate.field_value);
                const originPriceMax = Number(this.projectData.data.current_rate_max.field_value);
                // 固定的提示文案
                const baseContent = `单价涨跌超出${priceLimit}，请确认是否降价/涨价这么多！`;
                // 楼盘提示信息
                let projectMsg = '';
                // 户型提示信息
                let houseMsgArr = [];
                // 单价从0到有，都不触发
                // 任意类型切换到系统单价，不触发涨跌
                // 系统单价为0时，切换到其他类型，不触发涨跌
                // 系统单价有值时，切换到其他类型，需要校验是否超出涨跌值
                // 只要切到系统单价就不触发
                if (currentType !== 1) {
                    if (originPrice !== 0 && Math.abs(Math.round(projectPrice*10000 - originPrice*10000)) >= priceLimit) {
                        projectMsg = '楼盘单价 '
                    }
                    if (originPriceMax !== 0 && Math.abs(Math.round(projectPriceMax*10000 - originPriceMax*10000)) >= priceLimit) {
                        projectMsg = '楼盘单价 '
                    }
                }
                // 判断户型价格限制
                houseInfo.forEach((ele, idx) => {
                    // 建筑面积
                    const acreage = ele.acreage.field_value;
                    // 套内面积
                    const acAcreage = ele.ac_acreage.field_value;

                    const computeAcreage = acreage ? `(${acreage}㎡)` : acAcreage ? `(套内${acAcreage}㎡)` : '';
                    // 如果原价不为空且超出限制再提示
                    // 户型原价 万元
                    const oldPrice = +this.houseTypeDataEdit.data[idx].offer_price.field_value;
                    // 输入的户型单价
                    const unitPrice = ele.offer_price.field_value ? ele.offer_price.field_value : 0;
                    // 户型名称
                    const houseTypeName = ele.house_type_num.field_value;
                    // 如果单价不为空则进行判断
                    // if (oldPrice !== 0 && Math.abs(unitPrice - oldPrice) >= yuanToWan(priceLimit)) {
                    if (oldPrice !== 0 && commonFun.computedFloatNumber(unitPrice, '-', oldPrice) >= yuanToWan(priceLimit)) {
                        // houseMsgArr.push(`户型${houseTypeName}${computeAcreage} 单价${unitPrice}万,原价${oldPrice}万`);
                        houseMsgArr.push(`户型${houseTypeName}${computeAcreage}`);
                    }
                });
                // 如果存在超出限制的item项且原价不为0 则提示
                if (projectMsg !== '' || houseMsgArr.length > 0) {
                    this.dialogTitle = '价格涨跌提示';
                    this.priceLimitMessage = `本次修改的${projectMsg} ${projectMsg && houseMsgArr.length > 0 ? '、' : ''} ${houseMsgArr.join('、<br/>')}${baseContent}`;
                    // 标识当前弹窗类型
                    this.checkType = 'confirmLimitSts';
                    this.priceLimitDialog = true;
                    return false;
                }
                return true;
            }
        }
    };
</script>

<style lang="less" scoped>
    .dynamic-sale {
        font-size: 14px;
        padding: 15px 15px 0;
        background-color: #fff;
        border-radius: 8px;
    }
    .dynamic-sale-main {
        margin: 15px 0;
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
    }
    .project-mark {
        padding: 0 10px 20px;
        margin-top: 20px;
    }
    .mark-form{
        margin-top: 20px;
        .mark-form-btn {
            text-align: center;
        }
    }
    .dialog-box {
        /deep/ .el-button {
            width: 200px;
            margin-left: 0px;
            margin-bottom: 10px;
        }
    }
    .price-msg-dialog {
        /deep/ .el-dialog__body {
            max-height: 400px;
            overflow: auto;
        }
    }
</style>