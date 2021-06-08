<!--
    @file: 户型详情页
    @description: 户型详情页
    @author: xiebin
    @date: 2019-12-20
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
            <el-breadcrumb-item>
                <a @click="gotoDymicInfo">动销信息</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>户型详情页</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="head-line">
            <h4>{{projectName + buildingType}} -- 户型详情</h4>
            <div v-if="getEditAuth && getEditAuth == 2">
                <auto-set-dynamic></auto-set-dynamic>
                <el-button
                    @click="gotoEditPage"
                    type="primary">
                    编辑
                </el-button>
            </div>
        </div>
        <div class="content-list-box">
            <!-- 户型图集 -->
            <div class="photo-box-list">
                <div :class="{'house-photo-list': true, 'is-fixed': isFixed}">
                    <div class="header-contnet">
                        <h3>户型图集</h3>
                    </div>
                    <div class="content-photo-list">
                        <div
                            class="photo-box"
                            v-for="(item, index) in photoListArr"
                            :key="index">
                            <el-form
                                label-width="100px"
                                >
                                <el-form-item
                                    v-if="item.apart_img">
                                    <el-image
                                        style="width: 100%; height: 100%"
                                        :src="gethost + item.apart_img.field_value"
                                        fit="scale-down"
                                        :alt="item.name" />
                                </el-form-item>
                                <el-form-item
                                    label="楼层:"
                                    v-if="item.storey">
                                    <p>{{ item.storey.field_text }}</p>
                                </el-form-item>
                                <el-form-item
                                    label="展示顺序:"
                                    v-if="item.show_index">
                                    <p>{{ item.show_index.field_value }}</p>
                                </el-form-item>
                                <el-form-item
                                    label="是否展示:"
                                    v-if="item.status">
                                    <p>{{ item.status.field_text }}</p>
                                </el-form-item>
                                <el-form-item
                                    label="信息来源:"
                                    v-if="item.apart_img && item.apart_img.is_show_belong_role == '1'">
                                    <p>{{spliceInfoOrigin(item.apart_img)}}</p>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 户型信息 -->
            <div class="house-info-list">
                <div class="header-contnet clear-float-box">
                    <h3>户型基础信息</h3>
                    <p v-if="getConfigList.current_role_source && getConfigList.current_role_source == 7 && !$route.query.taskId">信息来源</p>
                </div>
                <div class="form-list-box">
                    <el-form
                        :model="houseInitInfo"
                        label-width="90px"
                        ref="initInfoForm">
                        <el-form-item
                            label="户型编号:"
                            v-if="houseInitInfo.house_type_num">
                            <div class="form-input-box">
                                <p>{{ houseInitInfo.house_type_num.field_value }}</p>
                            </div>
                            <p v-if="houseInitInfo.house_type_num.is_show_belong_role == '1'">{{spliceInfoOrigin(houseInitInfo.house_type_num)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="户型类型:"
                            v-if="this.houseInitInfo.building_type && this.isShowHouseType">
                            <div class="form-input-box">
                                <p>{{ houseInitInfo.building_type.field_text }}</p>
                            </div>
                            <p v-if="houseInitInfo.building_type.is_show_belong_role == '1'">{{spliceInfoOrigin(houseInitInfo.building_type)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="户型居室:"
                            v-if="houseInitInfo.room_type">
                            <div class="form-input-box">
                                <p>{{ houseInitInfo.room_type.field_text }}</p>
                            </div>
                            <p v-if="houseInitInfo.room_type.is_show_belong_role == '1'">{{spliceInfoOrigin(houseInitInfo.room_type)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="厅室描述:"
                            v-if="houseInitInfo.layout_shi && houseInitInfo.layout_ting && houseInitInfo.layout_chu && houseInitInfo.layout_wei">
                            <div class="form-input-box">
                                <p>{{ this.houseRommConcat() }}</p>
                            </div>
                            <p v-if="houseInitInfo.layout_shi.is_show_belong_role == '1'">{{spliceInfoOrigin(houseInitInfo.layout_shi)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="层高:"
                            v-if="houseInitInfo.floor_height">
                            <div class="form-input-box">
                                <span>{{ isWithUnit(houseInitInfo.floor_height.field_value, 'm') }}</span>
                            </div>
                            <p v-if="houseInitInfo.floor_height.is_show_belong_role == '1'">{{spliceInfoOrigin(houseInitInfo.floor_height)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="房屋朝向:"
                            v-if="houseInitInfo.orientation">
                            <div class="form-input-box">
                                <p>{{ houseInitInfo.orientation.field_text }}</p>
                            </div>
                            <p v-if="houseInitInfo.orientation.is_show_belong_role == '1'">{{spliceInfoOrigin(houseInitInfo.orientation)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="户型总量:"
                            v-if="houseInitInfo.total_count">
                            <div class="form-input-box">
                                <span>{{ isWithUnit(houseInitInfo.total_count.field_value, '户') }}</span>
                            </div>
                            <p v-if="houseInitInfo.total_count.is_show_belong_role == '1'">{{spliceInfoOrigin(houseInitInfo.total_count)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="排序:"
                            v-if="houseInitInfo.show_index">
                            <div class="form-input-box">
                                <p>{{ houseInitInfo.show_index.field_value }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="是否显示:"
                            v-if="houseInitInfo.is_show_room_type">
                            <div class="form-input-box">
                                <p>{{ houseInitInfo.is_show_room_type.field_text }}</p> 
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 户型动销信息 -->
                <div class="header-contnet clear-float-box">
                    <h3>户型动销信息</h3>
                    <p v-if="getConfigList.current_role_source && getConfigList.current_role_source == 7 && !$route.query.taskId">信息来源</p>
                </div>
                <div class="form-list-box">
                    <el-form
                        :model="houseDynameicInfo"
                        label-width="120px"
                        ref="dynamicInfoForm">
                        <el-form-item
                            label="户型销售状态:"
                            v-if="houseDynameicInfo.status">
                            <div class="form-input-box">
                                <span>{{ houseDynameicInfo.status.field_text }}</span>
                            </div>
                            <p v-if="houseDynameicInfo.status.is_show_belong_role == '1'">{{spliceInfoOrigin(houseDynameicInfo.status)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="建筑面积:"
                            v-if="houseDynameicInfo.acreage">
                            <div class="form-input-box">
                                <span>{{ isWithUnit(houseDynameicInfo.acreage.field_value, '㎡') }}</span>
                            </div>
                            <p v-if="houseDynameicInfo.acreage.is_show_belong_role == '1'">{{spliceInfoOrigin(houseDynameicInfo.acreage)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="套内面积:"
                            v-if="houseDynameicInfo.ac_acreage">
                            <div class="form-input-box">
                                <span>{{ isWithUnit(houseDynameicInfo.ac_acreage.field_value, '㎡') }}</span>
                            </div>
                            <p v-if="houseDynameicInfo.ac_acreage.is_show_belong_role == '1'">{{spliceInfoOrigin(houseDynameicInfo.ac_acreage)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="单价:"
                            v-if="houseDynameicInfo.offer_price">
                            <div class="form-input-box">
                                <span>{{ isWithUnit(houseDynameicInfo.offer_price.field_value, '万元') }}</span>
                            </div>
                            <p v-if="houseDynameicInfo.offer_price.is_show_belong_role == '1'">{{spliceInfoOrigin(houseDynameicInfo.offer_price)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="总价:"
                            v-if="houseDynameicInfo.price">
                            <div class="form-input-box">
                                <span>{{ isWithUnit(houseDynameicInfo.price.field_value, '万元') }}</span>
                            </div>
                            <p v-if="houseDynameicInfo.price.is_show_belong_role == '1'">{{spliceInfoOrigin(houseDynameicInfo.price)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="首付比例:"
                            v-if="houseDynameicInfo.payment_ratio">
                            <div class="form-input-box">
                                <span>{{ isWithUnit(houseDynameicInfo.payment_ratio.field_value, '%') }}</span>
                            </div>
                            <p v-if="houseDynameicInfo.payment_ratio.is_show_belong_role == '1'">{{spliceInfoOrigin(houseDynameicInfo.payment_ratio)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="首付:"
                            v-if="houseDynameicInfo.down_pay">
                            <div class="form-input-box">
                                <span>{{ isWithUnit(houseDynameicInfo.down_pay.field_value, '元') }}</span>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="月供:"
                            v-if="houseDynameicInfo.month_pay">
                            <div class="form-input-box">
                                <span>{{ isWithUnit(houseDynameicInfo.month_pay.field_value, '元') }}</span>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="户型在售余量:"
                            v-if="houseDynameicInfo.house_on_sale_num">
                            <div class="form-input-box">
                                <span>{{ isWithUnit(houseDynameicInfo.house_on_sale_num.field_value, '套') }}</span>
                            </div>
                            <p v-if="houseDynameicInfo.house_on_sale_num.is_show_belong_role == '1'">{{spliceInfoOrigin(houseDynameicInfo.house_on_sale_num)}}</p>
                        </el-form-item>
                        <el-form-item
                            label="关联楼栋:"
                            v-if="houseDynameicInfo.relation_buildings">
                            <div class="form-input-box">
                                <span>{{ repeatFieldText(houseDynameicInfo.relation_buildings.field_text) }}</span>
                            </div>
                            <p v-if="houseDynameicInfo.relation_buildings.is_show_belong_role == '1'">{{spliceInfoOrigin(houseDynameicInfo.relation_buildings)}}</p>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 户型解析 -->
                <div class="header-contnet clear-float-box">
                    <h3 v-if="getConfigList.current_role_source && getConfigList.current_role_source == 7 && !$route.query.taskId">户型解析</h3>
                </div>
                <div class="form-list-box">
                    <el-form
                        :model="houseParseInfo"
                        label-width="120px"
                        ref="subForm">
                        <el-form-item
                            label="户型标签:"
                            v-if="houseParseInfo.house_tag">
                            <div class="form-input-box">
                                <span>{{ repeatFieldText(houseParseInfo.house_tag.field_text) }}</span>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="优势描述:"
                            v-if="houseParseInfo.good_desc">
                            <div class="form-input-box">
                                <span>{{ houseParseInfo.good_desc.field_value }}</span>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="劣势描述:"
                            v-if="houseParseInfo.bad_desc">
                            <div class="form-input-box">
                                <span>{{ houseParseInfo.bad_desc.field_value }}</span>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="卧室:"
                            v-if="houseParseInfo.master_bed_room">
                            <div class="form-input-box">
                                <span>{{ houseParseInfo.master_bed_room.field_value }}</span>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="卫生间:"
                            v-if="houseParseInfo.toilet">
                            <div class="form-input-box">
                                <span>{{ houseParseInfo.toilet.field_value }}</span>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="客厅:"
                            v-if="houseParseInfo.living_room">
                            <div class="form-input-box">
                                <span>{{ houseParseInfo.living_room.field_value }}</span>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="厨房:"
                            v-if="houseParseInfo.kitchen">
                            <div class="form-input-box">
                                <span>{{ houseParseInfo.kitchen.field_value }}</span>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="餐厅:"
                            v-if="houseParseInfo.restaurant">
                            <div class="form-input-box">
                                <span>{{ houseParseInfo.restaurant.field_value }}</span>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="阳台:"
                            v-if="houseParseInfo.terrace">
                            <div class="form-input-box">
                                <span>{{ houseParseInfo.terrace.field_value }}</span>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapState } from "vuex";
import InfoOrigin from '../components/InfoOrigin';
import { yuanToWan } from '../utils/index';
import MsgDialog from '../components/MsgDialog';
import AutoSetDynamic from '../components/AutoSetDynamic';
import addHouseAPi from '../api/addHouseDetailApi';
import commonApi from '../api/common';
import { commonFun } from "@/assets/js/utils/utils";
export default {
    name: 'BuildNamePoition',
    data() {
        return {
            // 户型图集
            photoListArr: [],
            // 户型基础信息
            houseInitInfo: {},
            // 户型动销信息
            houseDynameicInfo: {},
            // 户型解析
            houseParseInfo: {},
            // 获取户型类型
            getHosueTypeDataList: [],
            // 是否使用固定定位
            isFixed: false,
            // 通用配置信息
            getConfigList: {},
            // 图片url地址
            gethost: {},
            // 面包屑文案
            breadText: '楼盘列表',
            // 户型类型是否展示
            isShowHouseType: true,
            // 楼盘业态
            projectType: '',
            // 按键按下的键组成的数组
            arrKey: [],
            // 按键拼接字符串
            keydown: '',
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
            // 获取通用配置信息
            getEditAuth: state => state.buildingDictionary.isAuditorAuth,
        })
    },
    mounted() {
        // 获取设备
        this.device = commonFun.getDevice();
        // 快捷键监听
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        // 页面滚动的监听回调
        window.addEventListener('scroll', this.photoIsFixed);
        // 获取楼盘信息，主要获取城市，楼盘名字，业态
        this.getProjectInfo();
        // 初始化数据
        this.addHouseAPi();
        // 获取通用配置的信息
        this.getConfigList = JSON.parse(localStorage.getItem('getConfigLists'));
        // 获取图片host
        this.gethost = JSON.parse(localStorage.getItem('gethost'));
        // 判断面包屑内容
        this.isOperation();
        this.getisEditAuth();
        this.getProjcetInitInfo();
    },
    destroyed(){
        window.removeEventListener('scroll', this.photoIsFixed);
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
                if (this.getEditAuth && this.getEditAuth == 2 && this.keydown === 'meta+e') {
                    this.gotoEditPage();
                    // 取消浏览器原有的操作
                    e.preventDefault();
                }
            } else {
                if (this.getEditAuth && this.getEditAuth == 2 && this.keydown === 'control+e') {
                    this.gotoEditPage();
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
        getisEditAuth(pageId) {
            let params = {
                task_id: this.$route.query.taskId,
                page_id: 6
            };
            this.$store.dispatch('isEditAuth', params);
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
        // 跳转到动销页面
        gotoDymicInfo() {
            this.$router.push({
                path: '/building/tabToggleList',
                query: {
                    projectId: this.$route.query.projectId,
                    taskId: this.$route.query.taskId,
                    cityId: this.cityId,
                    projectName: this.projectName,
                    role: this.$route.query.role,
                    positionTab: '2',
                    buildingType: this.buildingType
                }
            });
        },
        // 跳转到编辑页面
        gotoEditPage() {
            this.$router.push({
                path: '/building/BuildAddHouseDetail',
                query: {
                    projectId: this.$route.query.projectId,
                    taskId: this.$route.query.taskId,
                    houseTypeId: this.$route.query.houseTypeId,
                    role: this.$route.query.role,
                    isViewJump: true
                }
            })
        },
        /**
         * 厅室描述拼接
         * @param {object}
         */
        houseRommConcat() {
            let {
                layout_shi,
                layout_ting,
                layout_chu,
                layout_wei
            } = this.houseInitInfo;
            let shiValue = layout_shi.field_value !== '' ? layout_shi.field_value + '室' : '';
            let tingValue = layout_ting.field_value !== '' ? layout_ting.field_value + '厅' : '';
            let chuValue = layout_chu.field_value !== '' ? layout_chu.field_value + '厨' : '';
            let weiValue = layout_wei.field_value !== '' ? layout_wei.field_value + '卫' : '';
            return shiValue + ' ' + tingValue + ' ' + chuValue + ' ' + weiValue;
        },
        /**
         * 字段为空不展示数量单位名称
         * @param {string} fieldText 字段名称
         * @param {string} unit 单位名称
         */
        isWithUnit(fieldText, unit) {
            return fieldText !== '' ? fieldText + ' ' + unit : '';
        },
        /**
         * 遍历字段为数组的元素名称并展开
         * @param {string} fieldText 字段名称
         */
        repeatFieldText(fieldText) {
            let str = '';
            if (fieldText.length > 0) {
                fieldText.forEach(item => {
                    str += item + '、'
                });
            }
            str = str.substr(0, str.length - 1);
            return str;
        },
        // 获取楼盘基本信息
        async getProjcetInitInfo() {
            try {
                let params = {
                    project_id: this.$route.query.projectId,
                    task_id: this.$route.query.taskId
                };
                let result = await commonApi.getProjectBaseInfo(params);
                let { data } = result;
                if (data.code === 0) {
                    this.projectType = data.data.project_type;
                    // 根据楼盘业态是否展示户型类型
                    if (this.projectType == 1 || this.projectType == 2 || this.projectType == 3) {
                        this.isShowHouseType = true;
                    } else {
                        this.isShowHouseType = false;
                    }
                }                
            }
            catch(error) {
                console.log(error);
            }
        },
        // 初始化数据
        async addHouseAPi() {
            let result;
            let params;
            try {
                params = {
                    project_id: this.$route.query.projectId,
                    task_id: this.$route.query.taskId,
                    house_type_id: this.$route.query.houseTypeId
                }
                result = await addHouseAPi.initHouseDetailData(params);
                let { data } = result
                if (data.code === 0) {
                    // 户型图集
                    this.photoListArr = data.data.house_type_detail_imgs.data;
                    // 户型基础信息
                    this.houseInitInfo = data.data.house_type_base_detail.data;
                    // 户型动销信息
                    this.houseDynameicInfo = data.data.house_type_movable_pin_detail.data;
                    this.houseDynameicInfo.offer_price.field_value = yuanToWan(this.houseDynameicInfo.offer_price.field_value);
                    this.houseDynameicInfo.price.field_value = yuanToWan(this.houseDynameicInfo.price.field_value);
                    // 户型解析
                    this.houseParseInfo = data.data.house_type_analysis.data;
                } else {
                    this.$message(data.msg);
                }
            }
            catch(error) {

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
        spliceInfoOrigin({belong_role_text, belong_role, belong_datetime, belong_employee_name, belong_employee_id, belong_other }) {
            if (belong_datetime === '') {
                return '';
            } else {
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
        // 户型图集滚动吸顶
        photoIsFixed() {
            let elOffSetTop = document.querySelector('.house-photo-list').offsetTop;
            // 得到页面滚动的距离
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            // 判断页面滚动的距离是否大于吸顶元素的位置
            this.isFixed = scrollTop > elOffSetTop;
        }

    },
    components: {
        InfoOrigin,
        MsgDialog,
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
    .head-line{
        display: flex;
        align-items: center;
        padding: 15px 0;
        font-size: 16px;
        font-weight: bold;
        justify-content: space-between;
    }
    .content-list-box {
        display: flex;
        flex-direction: row;
        margin-top: 20px;
        /deep/ .el-form-item {
            margin-bottom: 0px;
        }
        // 户型图集
        .photo-box-list {
            width: 30%;
            margin-right: 20px;
            .house-photo-list{
                height: 400px;
                overflow-y: auto;
                .header-contnet {
                    h3 {
                        border-bottom: 1px #ccc solid;
                        padding-bottom: 10px;
                        box-sizing: border-box; 
                    }
                }
                .content-photo-list {
                    width: 100%;
                    .number-input-box {
                        width: 90%;
                        display: inline-block;
                    }
                }
            }
        }
        .is-fixed{
            position: fixed;
            top: 120px;
            width: 26%;
        }
        // 户型基础信息
        .house-info-list {
            flex: 1;
            .header-contnet {
                h3 {
                    float: left;
                    width: 47%;
                    border-bottom: 1px #ccc solid;
                    padding-bottom: 10px;
                    box-sizing: border-box;
                    margin-right: 20px;
                }
                p {
                    width: 50%;
                    float: left;
                    font-size: 14px;
                }
            }
            .form-list-box {
                margin-top: 15px;
                /deep/ .el-form-item__content {
                    display: flex;
                    flex-direction: row;
                }
                .form-input-box {
                    width: 45%;
                    .number-input-box {
                        width: 90%;
                        display: inline-block;
                    }
                }
            }
        }
        .el-icon-warning {
            color: #ff6e0e;
            font-size: 20px;
            margin-top: 10px;
            margin-left: 6px;
        }
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: #F5F5F5;
    }
    
    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
    }
    
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background: rgba(196, 195, 195, 0.7);
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