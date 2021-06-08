<!--
    @name: 放量和交房
    @description: 放量和交房主页面
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
            <el-breadcrumb-item>放量&amp;交房</el-breadcrumb-item>
            <el-breadcrumb-item>{{isEdit ? '编辑' : '查看'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!--主要内容部分开始-->
        <div class="dynamic-sale-main">
            <div class="head-line">
                <h4>{{getProjectNameAndTypes()}} 放量&amp;交房</h4>
                <div v-if="getEditAuth == 2  && !isEdit">
                    <auto-set-dynamic></auto-set-dynamic>
                    <el-button
                        @click="editInfo"
                        type="primary">
                        编辑
                    </el-button>
                </div>
            </div>
            <div v-if="!isEdit">
                <capacity-hand-room-detail
                    :capacity-data="capacityPlanData"
                    :stageing-data="stageSituationData"
                    :handroom-data="handRoomData"
                    :construct-data="constructStageData"/>
            </div>
            <div v-else>
                <!--放量计划-->
                <child-module-capacity-plan
                    ref="capacityPlan"
                    v-if="capacityPlanData"
                    @goToAlert="showHrefDialog"
                    :related-building="relatedBuilding"
                    :info-source="getConfigList.qd_source_list"
                    :volume-type="getConfigList.volume_type"
                    :empty-structure-data="capacityPlanEmptyData"
                    :init-data="capacityPlanData"/>
                <!--分期情况-->
                <child-module-stageing-situation
                    ref="stageingSituation"
                    v-if="stageSituationData"
                    @goToAlert="showHrefDialog"
                    :empty-structure-data="stageSituationEmptyData"
                    :related-building="relatedBuilding"
                    :info-source="getConfigList.qd_source_list"
                    :sale-status="getConfigList.sale_status"
                    :init-data="stageSituationData"/>
                <!--交房时间-->
                <child-module-handroom-time
                    ref="handroomTime"
                    v-if="handRoomData"
                    @goToAlert="showHrefDialog"
                    :empty-structure-data="handRoomEmptyData"
                    :related-building="relatedBuilding"
                    :handroom-type="getConfigList.new_live_date_type"
                    :info-source="getConfigList.qd_source_list"
                    :init-data="handRoomData"/>
                <!--建设阶段-->
                <child-module-construct-stage
                    ref="constructStage"
                    v-if="constructStageData"
                    @goToAlert="showHrefDialog"
                    :empty-structure-data="constructStageEmptyData"
                    :related-building="relatedBuilding"
                    :construct-stage="getConfigList.construct_stage"
                    :info-source="getConfigList.qd_source_list"
                    :init-data="constructStageData"/>
                <div class="btn-box">
                    <el-button
                        @click="cancleEdit">
                        取 消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="saveInfo">
                        保 存
                    </el-button>
                </div>
            </div>
        </div>
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
                    修改分期销售状态
                </el-button>
                <el-button
                    type="primary"
                    @click="editProjectStatus">
                    修改楼盘销售状态
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ChildModuleCapacityPlan from './CMCapacityPlan';
    import ChildModuleStageingSituation from './CMStageingSituation';
    import ChildModuleHandroomTime from './CMHandroomTime';
    import ChildModuleConstructStage from './CMConstructStage';
    import CapacityHandRoomDetail from './CapacityHandRoomDetail';
    import apiObj from '../api/capacityHandRoom.js';
    import commonApi from '../api/common';
    import { commonFun } from '@/assets/js/utils/utils';
    import MsgDialog from '../components/MsgDialog';
    import AutoSetDynamic from '../components/AutoSetDynamic';
    import {
        confirmMsg,
        confirmDefindMsg,
        getHrefUrl,
        getProjectNameAndTypes,
        getComputedTimeByTenData,
        setTrack,
        toRouterLink
    } from '../utils/index';
    import { mapState } from "vuex";
    import {
        trackIdList
    } from '../config/tabToggleList';
    export default {
        name: 'CapacityHandRoomEdit',
        components: {
            ChildModuleCapacityPlan,
            ChildModuleStageingSituation,
            ChildModuleHandroomTime,
            ChildModuleConstructStage,
            MsgDialog,
            CapacityHandRoomDetail,
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
            // 监听路由参数变化
            $route: {
                handler(newVal, oldVal) {
                    this.isEdit = this.$route.query.isEdit ? true : false;
                    if (this.$route.query.positionTab === '3') {
                        // 重新获取楼盘销售状态 ，放量页面编辑时才请求
                        if (newVal.query.isEdit === '1' && !oldVal.query.isEdit) {
                            this.getProjectInfo();
                        }
                        // 获取初始化信息，取消编辑或者编辑保存时
                        if (!newVal.query.isEdit && oldVal.query.isEdit === '1') {
                            this.getInitInfo();
                        }
                    }
                }
            }
        },
        data() {
            return {
                // 跳转确认弹窗
                dialogVisible: false,
                // 页面loading
                pageLoading: false,
                // 标识是否在提交中，防止重复提交
                isSubmiting: false,
                // 放量计划信息数据
                capacityPlanData: [],
                // 分期情况数据信息
                stageSituationData: [],
                // 交房时间信息数据
                handRoomData: [],
                // 建设阶段信息数据
                constructStageData: [],
                // 空结构
                capacityPlanEmptyData: {},
                stageSituationEmptyData: {},
                handRoomEmptyData: {},
                constructStageEmptyData: {},
                // 是否时编辑页
                isEdit: false,
                // 关联楼栋下拉
                relatedBuilding: [],
                // 面包屑文案
                breadText: '楼盘列表',
                // 销售状态自洽弹窗
                selfConsistentDialogvisible: false,
                // 自洽提示
                selfConsistentMessage: '',
                getProjectNameAndTypes
            }
        },
        created() {
            this.toRouterLink = toRouterLink;
            // 获取楼盘id
            this.projectId = this.$route.query.projectId;
            // 获取任务id
            this.taskId = this.$route.query.taskId;
            // 获取是否要跳转到编辑
            this.isEdit = this.$route.query.isEdit === '1';
            // 确认弹窗
            this.confirmMsg = confirmMsg;
            this.confirmDefindMsg = confirmDefindMsg;
            this.getHrefUrl = getHrefUrl;
            // 获取初始化信息
            this.getInitInfo();
            // 获取数据空结构数据
            this.getEmptyInitData();
            // 获取关联楼栋下拉
            this.getBuildList();
            // 面包屑初始化
            this.isOperation();
            // 获取楼盘销售状态
            this.getProjectInfo();
        },
        methods: {
            // 【父组件调用】快捷键保存、编辑操作
            handleShortCut() {
                if (this.$route.query.isEdit && this.$route.query.isEdit === '1') {
                    // 保存操作 ，如果有跳转提示弹窗要关闭弹窗并跳转
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
             * 页面跳转保存
             * @param {Boolean} isSave 是否进行保存再跳转
             */
            goToPage(isSave) {
                if (isSave) {
                    this.isGo = true;
                    this.saveInfo();
                    return;
                }
                this.goToNewPage();
                // 关闭弹窗
                this.dialogVisible = false;
                // 更新数据进入详情
                this.toRouterLink('3');
            },
            // 新页面跳转
            goToNewPage() {
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
                    cityId = '',
                    projectName = '',
                    buildingType = '',
                    role = ''
                } = this.$route.query;
                const fieldId = id ? `&${idName}=${id}` : '';
                const baseUrl = `/dist/building/${path}?projectId=${projectId}&taskId=${taskId}${fieldId}&projectName=${projectName}&buildingType=${buildingType}&isEdit=${isEdit}&role=${role}`;
                if (idName === 'houseTypeId') {
                    window.open(`${baseUrl}&cityId=${cityId}`);
                    return;
                }
                if (!id && idName === 'buildingId' && buildingName !== '') {
                    window.open(`${baseUrl}&buildingName=${buildingName}`);
                    return;
                }
                window.open(baseUrl);
            },
            // 编辑信息
            editInfo() {
                this.toRouterLink('3', '1');
            },
            // 获取楼盘销售状态
            async getProjectInfo() {
                try {
                    const options = {
                        // 楼详情页面id为7
                        project_id: this.projectId,
                        task_id: this.taskId
                    };
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await commonApi.getProjectBaseInfo(options);
                    if (code === 0) {
                        // 存储楼盘销售状态
                        this.saleStatus = data.status;
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
                        page_id: 3,
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
                        // 拼装要渲染的数据结构
                        // 赋值放量计划信息数据
                        this.capacityPlanEmptyData = data.volume_living_volume_info.data || {};
                        // 赋值分期情况数据信息
                        this.stageSituationEmptyData = data.volume_living_stage_info.data || {};
                        // 赋值交房时间信息数据
                        this.handRoomEmptyData = data.volume_living_info.data || {};
                        // 赋值建设阶段信息数据
                        this.constructStageEmptyData = data.volume_living_construction.data || {};
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取初始化信息
            async getInitInfo(tag) {
                try {
                    this.pageLoading = true;
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
                    } = await apiObj.getCapacityHandRoomInfo(options);
                    if (code === 0) {
                        // debugger
                        // 对返回的数据进行赋值
                        // 赋值放量计划信息数据
                        this.capacityPlanData = data.volume_living_volume_info.data || [];
                        // 赋值分期情况数据信息
                        this.stageSituationData = data.volume_living_stage_info.data || [];
                        // 赋值交房时间信息数据
                        this.handRoomData = data.volume_living_info.data || [];
                        // 赋值建设阶段信息数据
                        this.constructStageData = data.volume_living_construction.data || [];

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
            async getBuildList() {
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
                    } = await commonApi.getProjectBuildingListdata(options);
                    if (code === 0) {
                        this.relatedBuilding = data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 修改楼栋销售状态
            editBuildingStatus() {
                // error_type 1、楼盘销售状态被修改导致的不自洽2、户型销售状态被修改导致的不自洽
                // error_type 3、楼栋销售状态被修改导致的不自洽4、分期销售状态被修改导致的不自洽
                // frompage/topage 1、动销信息列表页 2、户型详情页 3、楼栋详情页 4、放量&交房页
                setTrack(trackIdList.stageing, {
                    error_type: '4',
                    role: this.getConfigList.current_role_source == 7 ? '2' : '1',
                    frompage: '4',
                    topage: '4'
                });
                this.selfConsistentDialogvisible = false;
            },
            // 修改楼盘销售状态
            editProjectStatus() {
                setTrack(trackIdList.project, {
                    error_type: '4',
                    role: this.getConfigList.current_role_source == 7 ? '2' : '1',
                    frompage: '4',
                    topage: '1'
                });
                this.selfConsistentDialogvisible = false;
                window.open(this.getHrefUrl(2, 1));
            },
            // 取消编辑
            cancleEdit() {
                this.toRouterLink('3');
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
            /**
             * 判断是否存在重复的数据 仅适用于8.1表格初始化数据结构
             * @param {Array} arr 数组数据
             * @param {String} field 要判断的首字段名
             * @param {String} viceField 要判断的第二个次级字段
             * @return {Boolean} 是否存在重复
             */
            checkFieldRepeat(arr, field, viceField) {
                let isRepeat = false;
                // 是否继续循环
                let isContinue = true;
                for (let i = 0; i < arr.length; i++) {
                    for (let j = i + 1; j < arr.length; j++) {
                        const fieldVal = arr[i][field].field_value;
                        const otherFieldVal = arr[j][field].field_value;
                        let viceFieldVal, otherViceFieldVal;
                        if (viceField === 'volume_date_year') {
                            let {
                                volume_date_year: {field_value: year},
                                volume_date_month: {field_value: month},
                                volume_date_day: {field_value: day},
                                volume_date_ten: {field_value: ten}
                            } = arr[i];
                            let {
                                volume_date_year: {field_value: otherYear},
                                volume_date_month: {field_value: otherMonth},
                                volume_date_day: {field_value: otherDay},
                                volume_date_ten: {field_value: otherTen}
                            } = arr[j];
                            viceFieldVal = getComputedTimeByTenData({year, month, day, ten});
                            otherViceFieldVal = getComputedTimeByTenData({year: otherYear, month: otherMonth, day: otherDay, ten: otherTen});
                        }
                        if (viceField === 'live_date_year') {
                            let {
                                live_date_year: {field_value: year},
                                live_date_month: {field_value: month},
                                live_date_day: {field_value: day},
                                live_date_ten: {field_value: ten}
                            } = arr[i];
                            let {
                                live_date_year: {field_value: otherYear},
                                live_date_month: {field_value: otherMonth},
                                live_date_day: {field_value: otherDay},
                                live_date_ten: {field_value: otherTen}
                            } = arr[j];
                            viceFieldVal = getComputedTimeByTenData({year, month, day, ten});
                            otherViceFieldVal = getComputedTimeByTenData({otherYear, otherMonth, otherDay, otherTen});
                        }
                        // 如果存在副字段验证 则要判断对应辅助字段值
                        if (viceField) {
                            // const viceFieldVal = arr[i][viceField].field_value;
                            // const otherViceFieldVal = arr[j][viceField].field_value;
                            if (fieldVal === otherFieldVal && viceFieldVal === otherViceFieldVal) {
                                isRepeat = true;
                                isContinue = false;
                                break;
                            }
                        } else {
                            if (fieldVal === otherFieldVal && fieldVal !== '') {
                                isRepeat = true;
                                isContinue = false;
                                break;
                            }
                        }
                    }
                    if (!isContinue) {
                        break;
                    }
                }
                return isRepeat;
            },
            // 保存信息
            async saveInfo() {
                // 放量计划数据获取
                const capacityData = this.$refs.capacityPlan ? this.$refs.capacityPlan.getData('capacityForm', '放量计划模块：') : [];
                // 分期情况数据获取
                const stageingData = this.$refs.stageingSituation ? this.$refs.stageingSituation.getData('stageingForm', '分期情况模块：') : [];
                // 交房时间数据获取
                const handroomData = this.$refs.handroomTime ? this.$refs.handroomTime.getData('handroomForm', '交房时间模块：') : [];
                // 建设阶段数据获取
                const constructData = this.$refs.constructStage ? this.$refs.constructStage.getData('constructForm', '建设阶段模块：') : [];
                if (!capacityData || !stageingData || !handroomData || !constructData) {
                    return;
                }
                if (capacityData.length === 0 && stageingData.length === 0 && handroomData.length === 0 && constructData.length === 0) {
                    this.$message('不可添加空数据，请至少添加一条数据！')
                    return;
                }
                // 销售状态为在售时 在售楼盘的放量计划为空判断
                if (capacityData.length === 0 && this.saleStatus === 2) {
                    let capacityRes = await this.confirmDefindMsg({
                        msg: '在售楼盘的放量计划为空，系统不推荐保存，请确定是否需要添加放量计划信息！',
                        confirmText: '不添加',
                        cancleText: '添加'
                    });
                    if (!capacityRes) {
                        return;
                    }
                }
                // 唯一性校验
                // 放量计划唯一性校验  判断是否存在相同的放量时间类型 然后再判断放量时间是否一致 如果二者均一致则判定重复
                if (this.checkFieldRepeat(capacityData, 'volume_type', 'volume_date_year')) {
                    this.confirmDefindMsg({
                        msg: '录入的【放量计划】存在可合并的数据，请仔细核对，系统不支持拆分提交',
                        confirmText: '确定',
                        cancleText: '取消'
                    });
                    return;
                }
                // 分期情况唯一性校验 判断分期名称是否相同 然后判断销售状态是否一致 二者都一致判定为重复
                // if (this.checkFieldRepeat(stageingData, 'staging_name', 'staging_sale_status')) {
                // 改为只判断分期名称
                if (this.checkFieldRepeat(stageingData, 'staging_name')) {
                    this.confirmDefindMsg({
                        msg: '录入的【分期情况】存在可合并的数据，请仔细核对，系统不支持拆分提交',
                        confirmText: '确定',
                        cancleText: '取消'
                    });
                    return;
                }
                // 交房时间唯一性校验  判断交房时间类型是否相同 再判断交房时间是否也相同
                if (this.checkFieldRepeat(handroomData, 'live_date_type', 'live_date_year')) {
                    this.confirmDefindMsg({
                        msg: '录入的【交房时间】存在可合并的数据，请仔细核对，系统不支持拆分提交',
                        confirmText: '确定',
                        cancleText: '取消'
                    });
                    return;
                }
                // 建设阶段唯一性校验 判断是否存在相同的建设阶段 否则判定为重复
                if (this.checkFieldRepeat(constructData, 'construction_stage')) {
                    this.confirmDefindMsg({
                        msg: '录入的【建设阶段】存在可合并的数据，请仔细核对，系统不支持拆分提交',
                        confirmText: '确定',
                        cancleText: '取消'
                    });
                    return;
                }

                // 判断如果该楼盘当前存在交房时间类型为交房，则该楼盘的建设阶段需要存在现房，
                // 遍历交房时间 判断是否存在交房时间类型为交房的数据
                let hasRelativeBuilding = [];
                // 是否存在又交房时间类型为交房的数据
                let isExistHandroom = false;
                // 遍历交房数据的关联楼栋保存
                handroomData.forEach(ele => {
                    if (ele.live_date_type.field_value == 2) {
                        isExistHandroom = true;
                        hasRelativeBuilding.push(...ele.relation_buildings.field_value);
                    }
                });
                // 去除重复楼栋
                hasRelativeBuilding = Array.from(new Set(hasRelativeBuilding));
                // 判断是否存在建设阶段为现房
                const hasReadyHouse = constructData.find(ele => ele.construction_stage.field_value == 1);
                // 如果存在类型为交房 建设阶段没有现房  需要提示
                if (isExistHandroom && !hasReadyHouse) {
                    const res = await this.confirmDefindMsg({
                        msg: '交房时间小于等于现在时间是否需要增加现房建设阶段！',
                        confirmText: '确定',
                        cancleText: '取消'
                    });
                    if (res) {
                        // let tableData = this.$refs.constructStage.model.tableData;
                        // 如果点击确定 需要新增一条建设阶段 并将交房类型为交房的关联楼栋全部关联到这个交房时间上去。如果此次关联的楼栋其中存在关联的”期房“的，需要去除其关联
                        const emptyData = commonFun.deepClone(this.constructStageEmptyData);
                        // 建设阶段现房为1 期房是2
                        emptyData.construction_stage.field_value = 1;
                        emptyData.id.isNew = true;
                        // 赋值关联楼栋
                        emptyData.relation_buildings.field_value = hasRelativeBuilding;
                        // 去除已选期房数据中该现房关联的楼栋
                        constructData.forEach(ele => {
                            if (ele.construction_stage.field_value == 2) {
                                // 获取已关联的楼栋
                                const relativeBuild = ele.relation_buildings.field_value;
                                // const arr = relativeBuild.slice();
                                let arr = relativeBuild.filter(item => {
                                    return !hasRelativeBuilding.includes(item)
                                });
                                ele.relation_buildings.field_value = arr;
                            }
                        });
                        constructData.push(emptyData);
                        this.$refs.constructStage.addConstruct(constructData);
                        return;
                    }
                }
                // 备注信息
                this.saveDynamicInfo({
                    // 放量
                    volume_living_volume_info: {
                        data: capacityData
                    },
                    // 分期
                    volume_living_stage_info: {
                        data: stageingData
                    },
                    // 交房
                    volume_living_info: {
                        data: handroomData
                    },
                    // 建设阶段
                    volume_living_construction: {
                        data: constructData
                    }
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
                        task_id: this.taskId
                    };
                    Object.assign(options, editData);
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await apiObj.saveCapacityHandroomInfo({data: JSON.stringify(options)});
                    this.isSubmiting = false;
                    this.pageLoading = false;
                    if (code === 0) {
                        // 保存成功
                        if (this.isGo) {
                            // 保存成功后关闭弹窗 进行跳转
                            this.closeHrefDiag();
                            this.goToNewPage();
                        }
                        this.$message('保存成功');
                        this.toRouterLink('3');
                    } else if (code === 20021) {
                        // 楼栋销售状态和不自洽提示
                        this.selfConsistentMessage = msg;
                        this.selfConsistentDialogvisible = true;
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    this.pageLoading = false;
                    console.log(error);
                }
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
        /deep/ .mult-select{
            .el-tag.el-tag--info{
                width: auto;
                max-width: 310px;
                white-space: inherit;
                height: auto;
            }
        }
    }
    .dynamic-sale-main {
        margin: 15px 0;
        .head-line{
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 40px;
            padding-bottom: 15px;
            font-size: 16px;
            h4 {
                flex: 1;
                padding-right: 20px;
            }
        }
        /deep/ .el-form-item__error{
            position: relative;
        }
    }
    .project-mark {
        padding: 0 10px 20px;
        margin-top: 20px;
    }
    .project-mark-title {
        position: relative;
        padding: 0 10px 10px;
        border-bottom: 1px solid #dcdfe6;
        margin-bottom: 20px;
        .title-content {
            font-size: 15px;
            font-weight: bold;
        }
    }
    .mark-form{
        text-align: center;
    }
    .dialog-box {
        /deep/ .el-button {
            width: 200px;
            margin-left: 0px;
            margin-bottom: 10px;
        }
    }
    .btn-box {
        text-align: center;
        padding-bottom: 20px;
    }
</style>