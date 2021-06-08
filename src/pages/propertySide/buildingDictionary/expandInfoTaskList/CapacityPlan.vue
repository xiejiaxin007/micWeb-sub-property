<!--
    @name: 放量计划详情
    @description: 放量计划详情页面
    @author: 贺伟
    @date: 2019-12-20
-->
<template>
    <div class="capacity-wrap" v-loading="pageLoading">
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
                <a @click="goToCapacityHandRoom">放量&amp;交房</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                放量计划页
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{isEdit ? '编辑' : '查看'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="capacity-info">
            <div class="head-line flex-box">
                <h4>{{getProjectNameAndTypes()}}放量计划</h4>
                <div v-if="getEditAuth == 2 && !isEdit">
                    <auto-set-dynamic></auto-set-dynamic>
                    <el-button
                        @click="editInfo('1')"
                        type="primary">
                        编辑
                    </el-button>
                </div>
            </div>
            <div
                class="dynamic-sale-main"
                v-if="!isEdit">
                <capacity-plan-detail :info-data="originData"/>
            </div>
            <div v-show="isEdit">
                <div class="capacity-info-title">
                    <h3 class="title-content">放量详情</h3>
                    <p
                        v-if="getConfigList && getConfigList.current_role_source === 7"
                        class="origin-title">信息来源：</p>
                </div>
                <!--表单部分开始-->
                <el-form
                    ref="capacityForm"
                    class="capacity-form"
                    :model="capacityForm"
                    label-width="140px">
                    <el-form-item
                        v-if="capacityForm.volume_type"
                        class="form-item-wrap"
                        :prop="'volume_type.field_value'"
                        :rules="planTypeRule"
                        label="放量计划类型">
                        <div class="form-left-box">
                            <el-select
                                v-model="capacityForm.volume_type.field_value"
                                clearable
                                @change="clearType"
                                @clear="clearType"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in getConfigList.volume_type"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <info-origin
                            class="msg-origin"
                            v-if="capacityForm.volume_type.is_show_belong_role == 1"
                            v-model="capacityForm.volume_type.belong_role"
                            :other-val.sync="capacityForm.volume_type.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            :operate-msg="getOriginOperateInfo(capacityForm.volume_type, false)" />
                    </el-form-item>
                    <el-form-item
                        v-if="capacityForm.volume_date_year"
                        class="form-item-wrap"
                        :prop="'volume_date_year.field_value'"
                        :rules="planTimeRule"
                        label="放量时间：">
                        <div class="form-left-box flex-box">
                                <date-picker-tenday
                                    type="1"
                                    v-model="capacityTime"
                                    @change="(dateObj) => tendayChange(dateObj, capacityForm.volume_date_day)"
                                    :year.sync="capacityForm.volume_date_year.field_value"
                                    :month.sync="capacityForm.volume_date_month.field_value"
                                    :day.sync="capacityForm.volume_date_day.field_value"
                                    :tenday.sync="capacityForm.volume_date_ten.field_value"/>
                        </div>
                        <info-origin
                            class="msg-origin"
                            v-if="capacityForm.volume_date_year.is_show_belong_role == 1"
                            v-model="capacityForm.volume_date_year.belong_role"
                            :other-val.sync="capacityForm.volume_date_year.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            @change="(val, otherVal) => changeTenDate(val, otherVal)"
                            :operate-msg="getOriginOperateInfo(capacityForm.volume_date_year, false)" />
                    </el-form-item>
                    <el-form-item
                        v-if="capacityForm.relation_house_types"
                        class="form-item-wrap"
                        label="关联户型：">
                        <div class="form-left-box">
                            <el-select
                                class="house-mult-select no-shake-select"
                                multiple
                                v-model="capacityForm.relation_house_types.field_value"
                                @focus="getHouseListById"
                                placeholder="请选择">
                                <el-option
                                    v-for="(item, idx) in relatedHouseTypeList"
                                    :key="idx"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <div
                                v-if="true"
                                class="btn-box">
                                <el-button
                                    @click="showGotoDialog({
                                        path: 'BuildAddHouseDetail',
                                        idName: 'houseTypeId',
                                        isEdit: 1
                                    })"
                                    type="text">
                                    找不到去新增户型
                                </el-button>
                            </div>
                        </div>
                        <info-origin
                            class="msg-origin"
                            v-if="capacityForm.relation_house_types.is_show_belong_role == 1"
                            v-model="capacityForm.relation_house_types.belong_role"
                            :other-val.sync="capacityForm.relation_house_types.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            :operate-msg="getOriginOperateInfo(capacityForm.relation_house_types, false)" />
                    </el-form-item>
                    <el-form-item
                        v-if="capacityForm.relation_buildings"
                        class="form-item-wrap"
                        label="关联楼栋：">
                        <div class="form-left-box">
                            <select-building class="mult-select"
                                v-model="capacityForm.relation_buildings.field_value"
                                :options="relatedBuilding">
                            </select-building>
                            <div
                                v-if="true"
                                class="btn-box">
                                <el-button
                                    @click="showGotoDialog({
                                        path: 'buildingDetailEdit',
                                        idName: 'buildingId',
                                        isEdit: 1
                                    })"
                                    type="text">
                                    找不到去新增楼栋
                                </el-button>
                            </div>
                        </div>
                        <info-origin
                            v-if="capacityForm.relation_buildings.is_show_belong_role == 1"
                            class="msg-origin"
                            v-model="capacityForm.relation_buildings.belong_role"
                            :other-val.sync="capacityForm.relation_buildings.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            :operate-msg="getOriginOperateInfo(capacityForm.relation_buildings, false)" />
                    </el-form-item>
                    <el-form-item
                        v-if="capacityForm.is_need_paihao"
                        class="form-item-wrap"
                        label="放量前是否有排号：">
                        <div class="form-left-box">
                            <el-radio-group
                                @change="changeWaitingStatus"
                                v-model="capacityForm.is_need_paihao.field_value">
                                <el-radio
                                    v-for="ele in getConfigList.is_need_paihao"
                                    :key="ele.id"
                                    :label="ele.id">
                                    {{ele.text}}
                                </el-radio>
                            </el-radio-group>
                        </div>
                        <info-origin
                            class="msg-origin"
                            v-if="capacityForm.is_need_paihao.is_show_belong_role == 1"
                            v-model="capacityForm.is_need_paihao.belong_role"
                            @change="(val, otherVal) => changeWaitingSource(capacityForm.is_need_paihao.field_value, val, otherVal)"
                            :other-val.sync="capacityForm.is_need_paihao.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            :operate-msg="getOriginOperateInfo(capacityForm.is_need_paihao, false)" />
                    </el-form-item>
                    <el-form-item
                        v-if="capacityForm.paihao_status && capacityForm.is_need_paihao && capacityForm.is_need_paihao.field_value != 2"
                        class="form-item-wrap"
                        label="排号状态：">
                        <div class="form-left-box">
                            <el-radio-group
                                v-model="capacityForm.paihao_status.field_value">
                                <el-radio
                                    v-for="ele in getConfigList.paihao_status"
                                    :key="ele.id"
                                    :label="ele.id">
                                    {{ele.text}}
                                </el-radio>
                            </el-radio-group>
                        </div>
                        <info-origin
                            class="msg-origin"
                            v-if="capacityForm.paihao_status.is_show_belong_role == 1"
                            v-model="capacityForm.paihao_status.belong_role"
                            :other-val.sync="capacityForm.paihao_status.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            :operate-msg="getOriginOperateInfo(capacityForm.paihao_status, false)" />
                    </el-form-item>
                    <el-form-item
                        v-if="capacityForm.paihao_start_datetime && capacityForm.is_need_paihao && capacityForm.is_need_paihao.field_value != 2"
                        class="form-item-wrap"
                        label="排号开始时间：">
                        <div class="form-left-box flex-box">
                            <el-date-picker
                                v-model="capacityForm.paihao_start_datetime.field_value"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <info-origin
                            class="msg-origin"
                            v-if="capacityForm.paihao_start_datetime.is_show_belong_role == 1"
                            v-model="capacityForm.paihao_start_datetime.belong_role"
                            :other-val.sync="capacityForm.paihao_start_datetime.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            :operate-msg="getOriginOperateInfo(capacityForm.paihao_start_datetime, false)" />
                    </el-form-item>
                    <el-form-item
                        v-if="capacityForm.paihao_end_datetime && capacityForm.is_need_paihao && capacityForm.is_need_paihao.field_value != 2"
                        class="form-item-wrap"
                        label="排号结束时间：">
                        <div class="form-left-box flex-box">
                            <el-date-picker
                                v-model="capacityForm.paihao_end_datetime.field_value"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <info-origin
                            class="msg-origin"
                            v-if="capacityForm.paihao_end_datetime.is_show_belong_role == 1"
                            v-model="capacityForm.paihao_end_datetime.belong_role"
                            :other-val.sync="capacityForm.paihao_end_datetime.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            :operate-msg="getOriginOperateInfo(capacityForm.paihao_end_datetime, false)" />
                    </el-form-item>
                    <el-form-item
                        v-if="capacityForm.note"
                        label="备注：">
                        <div class="form-left-box flex-box">
                            <el-input
                                type="textarea"
                                :rows="5"
                                :maxlength="1024"
                                placeholder="请输入备注信息"
                                show-word-limit
                                v-model="capacityForm.note.field_value">
                            </el-input>
                            <info-origin
                                class="msg-origin"
                                v-if="capacityForm.note.is_show_belong_role == 1"
                                v-model="capacityForm.note.belong_role"
                                :other-val.sync="capacityForm.note.belong_other"
                                :origin-arr="getConfigList.qd_source_list"
                                :operate-msg="getOriginOperateInfo(capacityForm.note, false)" />
                        </div>
                    </el-form-item>
                    <el-form-item class="mark-form">
                        <el-button
                            @click="cancleEdit">
                            取消
                        </el-button>
                        <el-button
                            type="primary"
                            @click="getInfoValid">
                            保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    import InfoOrigin from '../components/InfoOrigin';
    import MsgDialog from '../components/MsgDialog';
    import AutoSetDynamic from '../components/AutoSetDynamic';
    import DatePickerTenday from '../components/DatePickerTenday';
    import SelectBuilding from '../components/SelectBuilding';
    import CapacityPlanDetail from './CapacityPlanDetail';
    import { commonFun } from '@/assets/js/utils/utils';
    import { getCurMonthDays } from '../utils/index';
    import commonApi from '../api/common';
    import {
        isRequiredInfoOrigin,
        getOriginOperateInfo,
        getProjectNameAndTypes,
        getHrefUrl
    } from '../utils/index';
    import api from '../api/capacityPlan';
    export default {
        name: 'CapacityPlan',
        components: {
            InfoOrigin,
            MsgDialog,
            DatePickerTenday,
            CapacityPlanDetail,
            AutoSetDynamic,
            SelectBuilding
        },
        computed: {
            ...mapState({
                // getConfigList: state => state.buildingDictionary.projectConfiglist,
                houseTypeId: state => state.buildingDictionary.houseTypeId,
                // 获取页面权限信息
                getEditAuth: state => state.buildingDictionary.isAuditorAuth
            }),
            // 放量计划类型验证
            planTypeRule() {
                let {
                    // 放量计划类型
                    volume_type: {
                        field_value: volumeTypeVal
                    },
                    // 放量时间
                    volume_date_year: {
                        field_value: yearVal
                    },
                    volume_date_month: {
                        field_value: monthVal
                    },
                    volume_date_day: {
                        field_value: dayVal
                    },
                    volume_date_ten: {
                        field_value: tenVal
                    }
                } = this.capacityForm;
                dayVal = dayVal || (tenVal == 3 ? getCurMonthDays(monthVal) : tenVal * 10);
                // 如果放量计划时间不为空则需要校验放量计划和放量时间的匹配 已放量和已加推 放量时间需要小于等于当前日期 预计开盘和预计加推 反之
                return this.capacityTime !== '' ? { validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请选择放量计划类型'));
                    } else {
                        // 定义选择的日期
                        const timeVal = dayVal ? new Date(yearVal, monthVal - 1, dayVal) : new Date(yearVal, monthVal, dayVal);
                        // 1 2分别对应 已开盘已加推   3 4 对应预计开盘和预计加推
                        if ([1, 2].includes(volumeTypeVal) && timeVal > new Date()) {
                            callback(new Error('当前放量时间与选择的放量计划类型不匹配'));
                            return;
                        }
                        if ([3, 4].includes(volumeTypeVal) && timeVal <= new Date()) {
                            callback(new Error('当前放量时间与选择的放量计划类型不匹配'));
                            return;
                        }
                        callback();
                    }
                },
                trigger: 'change' } : { required: true, message: '放量计划类型不可为空' };
            },
            // 放量时间验证
            planTimeRule() {
                let {
                    // 放量计划类型
                    volume_type: {
                        field_value: volumeTypeVal
                    },
                    // 放量时间
                    volume_date_year: {
                        field_value: yearVal
                    },
                    volume_date_month: {
                        field_value: monthVal
                    },
                    volume_date_day: {
                        field_value: dayVal
                    },
                    volume_date_ten: {
                        field_value: tenVal
                    }
                } = this.capacityForm;
                dayVal = dayVal || (tenVal == 3 ? getCurMonthDays(monthVal) : tenVal * 10);
                // 如果放量计划不为空 需要校验和计划类型匹配度 规则同放量计划类型
                return volumeTypeVal !== '' ? { validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入放量时间'));
                    } else {
                        // 定义选择的日期
                        const timeVal = dayVal ? new Date(yearVal, monthVal - 1, dayVal) : new Date(yearVal, monthVal, dayVal);
                        if ([1, 2].includes(volumeTypeVal) && timeVal > new Date()) {
                            callback(new Error('当前放量计划类型下放量时间不得大于当前日期'));
                            return;
                        }
                        if ([3, 4].includes(volumeTypeVal) && timeVal <= new Date()) {
                            callback(new Error('当前放量计划类型下放量时间必须大于当前日期'));
                            return;
                        }
                        callback();
                    }
                },
                trigger: 'change' } : { required: true, message: '放量时间不可为空' };
            }
        },
        data() {
            return {
                // 是否编辑
                isEdit: false,
                // 楼盘表单信息
                capacityForm: {},
                // 初次返回的原始数据
                originData: {},
                pageLoading: false,
                // 关联户型下拉
                relatedHouseTypeList: [],
                // 关联楼栋下拉
                relatedBuilding: [],
                // 放量时间默认值
                capacityTime: '',
                getConfigList: this.getConfigLists(),
                // 面包屑文案
                breadText: '楼盘列表',
                getProjectNameAndTypes,
                // detail=上一页是详情页   list=上一页是放量交房页
                lastPage: '',
                // 按键按下的键组成的数组
                arrKey: [],
                // 按键拼接字符串
                keydown: '',
                // 系统
                device: ''
            }
        },
        created() {
            this.initHandle();
            // 获取初始化放量计划详情数据
            this.getInitData();
            // 获取户型下拉
            this.getHouseListById();
            // 获取楼栋下拉
            this.getBuildList();
            // 面包屑初始化
            this.isOperation();
            // 获取权限
            this.getisEditAuth();
        },
        mounted() {
            // 获取设备
            this.device = commonFun.getDevice();
            // 快捷键监听
            document.addEventListener('keydown', this.handleKeyDown);
            document.addEventListener('keyup', this.handleKeyUp);
        },
        destroyed() {
            document.removeEventListener('keydown', this.handleKeyDown);
            document.removeEventListener('keyup', this.handleKeyUp);
        },
        watch: {
            // 监听路由参数变化
            $route: {
                handler(newVal, oldVal) {
                    this.isEdit = this.$route.query.isEdit ? true : false;
                    if (this.$route.name === 'CapacityPlan') {
                        // 获取初始化信息，取消编辑或者编辑保存时
                        if (!newVal.query.isEdit && oldVal.query.isEdit === '1') {
                            this.getInitData();
                        }
                    }
                }
            }
        },
        // 从放量交房页过来会出发此方法
        beforeRouteEnter(to, from, next) {
            next(vm => {
                // 从放量交房页面过来的
                vm.lastPage = "list";
            });
        },
        // 编辑和查看页相互跳转时会出发此方法
        beforeRouteUpdate(to, from, next) {
            // 从详情页进入
            this.lastPage = "detail";
            next();
        },
        methods: {
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
                    // 保存快捷键操作
                    if (this.isEdit && this.keydown === 'meta+s') {
                        this.getInfoValid();
                        // 取消浏览器原有的操作
                        e.preventDefault();
                    }
                    // 编辑快捷键操作
                    if (!this.isEdit && this.getEditAuth == 2 && this.keydown === 'meta+e') {
                        this.editInfo('1');
                        // 取消浏览器原有的操作
                        e.preventDefault();
                    }
                } else {
                    // 保存快捷键操作
                    if (this.isEdit && this.keydown === 'control+s') {
                        this.getInfoValid();
                        // 取消浏览器原有的操作
                        e.preventDefault();
                    }
                    // 编辑快捷键操作
                    if (!this.isEdit && this.getEditAuth == 2 && this.keydown === 'control+e') {
                        this.editInfo('1');
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
             * @description: 编辑和保存跳转到详情页
             * @param {String} isEdit  =1进入编辑页
             * @param {String} id  放量ID
             * @return {type} 
             */            
            editInfo(isEdit, id) {
                let params = commonFun.deepClone(this.$route.query);
                params.isEdit = isEdit;
                if (id) {
                    params.volumeId = id;
                }
                if (!params.isEdit) {
                    delete params.isEdit;
                }
                this.$router.push({ name: this.$route.name, query: params});
            },
            // 初始化方法
            initHandle() {
                // 获取url参数
                this.projectId = this.$route.query.projectId;
                this.taskId = this.$route.query.taskId;
                this.volumeId = this.$route.query.volumeId;
                this.isEdit = this.$route.query.isEdit == 1;
                // 挂载导入的方法
                this.isRequiredInfoOrigin = isRequiredInfoOrigin;
                this.getOriginOperateInfo = getOriginOperateInfo;
                this.getHrefUrl = getHrefUrl;
            },
            // 获取配置信息
            getConfigLists() {
                if (!localStorage.getItem('getConfigLists')) return;
                const storageStr = localStorage.getItem('getConfigLists');
                return JSON.parse(storageStr);
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
            /**
             * 根据楼盘id获取户型下拉数据
             */
            async getHouseListById() {
                try {
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId,
                        select_false: 0
                    };
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await commonApi.getHouseTypeListData(options);
                    if (code === 0) {
                        this.relatedHouseTypeList = data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 获取楼栋下拉数据
             */
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
            // 如果旬有值则清空对应的天数
            tendayChange(dateObj, day) {
                // 延迟 在验证之后再清空值
                setTimeout(() => {
                    if (dateObj.tenday) {
                        day.field_value = '';
                    }
                }, 200);
            },
            /**
             * 排号状态改变 如果是没有排号 则清空之前填写的值
             * @param {Sting} value 改变的状态值
             */
            changeWaitingStatus(value) {
                let {
                    paihao_status,
                    paihao_start_datetime,
                    paihao_end_datetime
                } = this.capacityForm;
                // 如果选择没有排号 则清空排号状态和时间的值
                if (value === 2) {
                    // 清空值
                    paihao_status.field_value = '';
                    paihao_start_datetime.field_value = '';
                    paihao_end_datetime.field_value = '';
                    // 清空来源
                    if (paihao_status.is_show_belong_role == '1') {
                        paihao_status.belong_role = '';
                        paihao_status.belong_other = '';
                    }
                    if (paihao_start_datetime.is_show_belong_role == '1') {
                        paihao_start_datetime.belong_role = '';
                        paihao_start_datetime.belong_other = '';
                    }
                    if (paihao_end_datetime.is_show_belong_role == '1') {
                        paihao_end_datetime.belong_role = '';
                        paihao_end_datetime.belong_other = '';
                    }
                }
            },
            /**
             * 排号状态来源值改变事件处理
             * @param {String} status 是否需要排号对应状态值
             * @param {String} orgVal 来源值
             */
            changeWaitingSource(status, orgVal, otherVal) {
                // 如果是没有排号 且是编辑时 切换来源更新排号相关字段来源值
                if (status === 2 && this.$route.query.volumeId) {
                    let {
                        paihao_status,
                        paihao_start_datetime,
                        paihao_end_datetime
                    } = this.capacityForm;
                    const souceObj = {
                        belong_role: orgVal,
                        belong_other: otherVal
                    };
                    paihao_status.is_show_belong_role == '1' && Object.assign(paihao_status, souceObj);
                    paihao_start_datetime.is_show_belong_role == '1' && Object.assign(paihao_start_datetime, souceObj);
                    paihao_end_datetime.is_show_belong_role == '1' && Object.assign(paihao_end_datetime, souceObj);
                }
            },
            /**
             * 初始化信息处理
             * @param {Object} data 需要处理的数据
             * @return {Object} 处理之后的数据
             */
            initInfoDealwith(data) {
                const initData = commonFun.deepClone(data.volume_detail.data);
                // 需要转换为数字的值 销售状态、单价类型 总价类型
                const numberFields = ['volume_type', 'is_need_paihao', 'paihao_status'];
                // const timeFilters = ['paihao_start_datetime', 'paihao_end_datetime'];
                // 需要判断为空的数组字段
                // const arrFileds = ['relation_buildings', 'relation_house_types'];
                Object.keys(initData).forEach(ele => {
                    // 来源转数字
                    if (initData[ele].is_show_belong_role == '1') {
                        initData[ele].belong_role = Number(initData[ele].belong_role);
                    }
                    // 下拉字段转换为数字
                    if (numberFields.includes(ele)) {
                        initData[ele].field_value = initData[ele].field_value === '' ? '' : Number(initData[ele].field_value);
                    }
                    /* if (arrFileds.includes(ele)) {
                        initData[ele].field_value = initData[ele].field_value === '' ? [] : initData[ele].field_value;
                    } */
                    // 日期转换
                    /* if (timeFilters.includes(ele)) {
                        // initData[ele].field_value = initData[ele].field_value === 0 ? '' : new Date(initData[ele].field_value * 1000);
                        initData[ele].field_value = initData[ele].field_value === 0 ? '' : filterDate(initData[ele].field_value, 'YYYY-MM-DD');
                    } */
                });
                return initData;
            },
            // 获取放量详情初始化空数据结构
            /* async getEmptyInitData() {
                try {
                    const options = {
                        // 放量详情页面id为8
                        page_id: 8
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
                        this.spaceModuleData = {
                            baseInfo: this.getNecessaryData(this.initInfoDealwith(data)),
                            relativeInfo: [],
                            name: 'initEmptyOrg'
                        };
                        // 如果不存在楼栋id 则认为时新增 取空结构数据推入
                        if (!this.buildingId) {
                            // 新增时带入楼栋名称
                            this.spaceModuleData.baseInfo.building_name.field_value = this.buildingName || '';
                            this.originData = [data.building_base_detail.data];
                            this.buildingData.push(this.spaceModuleData);
                        }
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            }, */
            // 获取放量计划初始化数据
            async getInitData() {
                try {
                    this.pageLoading = true;
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId,
                        volume_id: this.$route.query.volumeId
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await api.getCapacityInfo(options);
                    this.pageLoading = false;
                    if (code === 0) {
                        this.originData = data.volume_detail.data;
                        this.capacityForm = this.initInfoDealwith(data);
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    this.pageLoading = false;
                    console.log(error);
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
            // 跳转放量和交房页面
            goToCapacityHandRoom() {
                this.goToMainPage();
            },
            // 新增户型/楼栋事件处理方法
            showGotoDialog(hrefMsg) {
                const {
                    path,
                    isEdit,
                    id,
                    idName
                } = hrefMsg;
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
                // 户型详情页面
                if (idName === 'houseTypeId') {
                    window.open(`${baseUrl}&cityId=${cityId}`);
                    return;
                }
                // 跳转楼栋编辑页面
                /* if (!id && idName === 'buildingId' && buildingName !== '') {
                    window.open(`${baseUrl}&buildingName=${buildingName}`);
                    return;
                } */
                window.open(baseUrl);
            },
            // 年的来源改变更新其他字段来源值
            changeTenDate(val, otherVal) {
                const {
                    // 放量时间
                    volume_date_year: year,
                    volume_date_month: month,
                    volume_date_day: day,
                    volume_date_ten: tenday
                } = this.capacityForm;
                year.belong_role = val;
                month.belong_role = val;
                day.belong_role = val;
                tenday.belong_role = val;

                year.belong_other = otherVal;
                month.belong_other = otherVal;
                day.belong_other = otherVal;
                tenday.belong_other = otherVal;
            },
            /**
             * 组装来源操作展示的信息
             * @param {Object} item 字段信息对象
             * @param {String} item.belong_datetime 信息来源操作时间
             * @param {String} item.belong_employee_name 信息来源操作人
             * @param {String} item.belong_employee_id 信息来源操作人工号
             * @return {String} 信息来源操作信息
             */
            /* getOriginOperateInfo({
                belong_datetime,
                belong_employee_name,
                belong_employee_id
            }) {
                return belong_datetime && belong_employee_name && belong_employee_id ? `${belong_datetime} ${belong_employee_name} - ${belong_employee_id}` : '';
            }, */
            /**
             * 楼盘单价类型变化是清空已编辑的值
             * @param {String} type 类型 1为楼盘单价类型 2为楼盘总价类型 3为放量计划类型 4为交房时间类型
             * @param {String} val 变化的值
             */
            clearType() {
                // 重置放量计划时间
                this.capacityForm.volume_date_year.field_value = '';
                this.capacityForm.volume_date_month.field_value = '';
                this.capacityForm.volume_date_day.field_value = '';
                this.capacityForm.volume_date_ten.field_value = '';
                this.capacityTime = '';
            },
            // 验证
            getInfoValid() {
                // 表单必填校验开始
                let validStatus = false;
                this.$refs.capacityForm.validate((valid) => {
                    if (valid) {
                        validStatus = true;
                    } else {
                        validStatus = false;
                    }
                });
                if (!validStatus) {
                    this.$message('请检查必填信息是否填写完整!');
                    return;
                }
                // 校验日期和状态匹配开始
                if (this.capacityForm.is_need_paihao) {
                    const {
                        // 是否需要排号
                        is_need_paihao: {field_value: isNeedArrang},
                        // 排号状态
                        paihao_status: {field_value: arrangStatus},
                        // 排号开始时间
                        paihao_start_datetime: {field_value: arrangStartTime},
                        // 排号结束时间
                        paihao_end_datetime: {field_value: arrangEndTime}
                    } = this.capacityForm;
                    // 如果有排号需要判断时间和排号状态一致性
                    if (isNeedArrang == 1) {
                        const curDateTime = new Date().getTime();
                        const startT = arrangStartTime && new Date(arrangStartTime + ' 00:00:01');
                        const endT = arrangEndTime && new Date(arrangEndTime + ' 23:59:59')
                        if (startT && endT) {
                            if (startT > endT) {
                                this.$message.error('开始时间必须小于结束时间!');
                                return;
                            }
                        }
                        if (startT) {
                            if (arrangStatus == 1 && startT <= curDateTime) {
                                this.$message.error('当前排号状态下，排号开始时间必须大于当前时间!');
                                return;
                            } else if (arrangStatus == 2 && startT > curDateTime) {
                                this.$message.error('当前排号状态下，排号开始时间必须小于等于当前时间!');
                                return;
                            } else if (arrangStatus == 3 && startT >= curDateTime) {
                                this.$message.error('当前排号状态下，排号开始时间必须小于当前时间!');
                                return;
                            }
                        }
                        if (endT) {
                            if (arrangStatus == 2 && endT < curDateTime) {
                                this.$message.error('当前排号状态下，排号结束时间必须大于等于当前时间!');
                                return;
                            } else if (arrangStatus == 3 && endT >= curDateTime) {
                                this.$message.error('当前排号状态下，排号结束时间必须小于当前时间!');
                                return;
                            } else if (arrangStatus == 1 && endT <= curDateTime) {
                                this.$message.error('当前排号状态下，排号开始时间必须大于当前时间!');
                                return;
                            }
                        }
                    }
                }
                // 校验信息来源是否变更
                if (!this.isRequiredInfoOrigin(this.originData, this.capacityForm)) {
                    return;
                }
                // 以上验证都通过后执行保存信息
                this.saveCapacityInfo();
            },
            cancleEdit() {
                if (this.lastPage === 'list') {
                    // 返回放量和交房页面
                    this.goToMainPage();
                } else {
                    this.editInfo('');
                }
            },
            goToMainPage() {
                this.$router.push(this.getHrefUrl(3).replace(/^\/dist/, ''));
            },
            // 保存放量计划信息
            async saveCapacityInfo() {
                try {
                    this.pageLoading = true;
                    // 判断是否在提交过程中，防止重复提交
                    if (this.isSubmiting) {
                        return;
                    }
                    this.isSubmiting = true;
                    const options = {
                        project_id: this.projectId,
                        volume_id: this.$route.query.volumeId,
                        task_id: this.taskId,
                        // 楼盘备注
                        volume_detail: {
                            data: this.capacityForm
                        }
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await api.saveCapacityInfo(options);
                    this.isSubmiting = false;
                    this.pageLoading = false;
                    if (code === 0) {
                        this.$message('保存成功！');
                        this.editInfo('', data.id);
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    console.log(error);
                    this.pageLoading = false;
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
    .capacity-wrap{
        font-size: 14px;
        padding: 15px;
        background-color: #fff;
        border-radius: 8px;
        .head-line{
            padding: 15px 0;
            font-size: 16px;
            font-weight: bold;
            justify-content: space-between;
            h4 {
                flex: 1;
                padding-right: 20px;
            }
        }
    }
    .capacity-info-title{
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
    }
    .capacity-form {
        margin-top: 20px;
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
        .single-ipt{
            width: 260px;
        }
    }
    .form-item-wrap {
        /deep/ .el-form-item__content{
            display: flex;
        }
    }
    .house-mult-select{
        width: 320px;
        /deep/ .el-tag.el-tag--info{
            width: auto;
            max-width: 310px;
            white-space: inherit;
            height: auto;
        }
    }
    .mult-select {
        width: 320px;
    }
</style>