<!--
    @name: 户型信息模块
    @description: 楼盘动销信息页面 - 户型信息子模块
    @author: 贺伟
    @date: 2019-12-09
-->
<template>
    <div class="house-info">
        <div class="modal-title-box">
            <h3 class="title-content">户型信息
                <span class="title-tip">表头的下拉按钮可标记整列数据的信息来源</span>
            </h3>
            <el-button
                @click="showGotoDialog({
                    path: 'BuildAddHouseDetail',
                    id: '',
                    idName: 'houseTypeId',
                    isEdit: 1
                })"
                type="primary"
                size="small">
                新增户型
            </el-button>
        </div>
        <el-form :model=model 
            ref="houseForm" 
            v-loading="tableLoading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading">
            <div class="table-wrap-box-box"
                v-if="model.tableData.length > 0">
                <div class="house-list">
                    <div class="table-title" ref="headerWrapper">
                        <ul class="table-flex-box">
                            <li v-if="tableItemShows['acreage']">
                                <div class="flex-box">
                                    <span>建筑面积(㎡)</span>
                                    <info-source-component
                                        v-if="canTbShow('acreage')"
                                        :isShowVal="false"
                                        @change="(val, otherVal) => changeAllSource('acreage', val, otherVal)"
                                        :other-val.sync="acreage.otherVal"
                                        :origin-arr="infoSource"
                                        v-model="acreage.value"/>
                                </div>
                            </li>
                            <li v-if="tableItemShows['ac_acreage']">
                                <div class="flex-box">
                                    <span>套内面积(㎡)</span>
                                    <info-source-component
                                        v-if="canTbShow('ac_acreage')"
                                        :isShowVal="false"
                                        @change="(val, otherVal) => changeAllSource('ac_acreage', val, otherVal)"
                                        :other-val.sync="acAcreage.otherVal"
                                        :origin-arr="infoSource"
                                        v-model="acAcreage.value"/>
                                </div>
                            </li>
                            <li v-if="tableItemShows['status']">
                                <div class="flex-box">
                                    <span>销售状态</span>
                                    <info-source-component
                                        v-if="canTbShow('status')"
                                        :isShowVal="false"
                                        @change="(val, otherVal) => changeAllSource('status', val, otherVal)"
                                        :other-val.sync="status.otherVal"
                                        :origin-arr="infoSource"
                                        v-model="status.value"/>
                                </div>
                            </li>
                            <li v-if="tableItemShows['offer_price']">
                                <div class="flex-box">
                                    <span>单价(万元)</span>
                                    <info-source-component
                                        v-if="canTbShow('offer_price')"
                                        :isShowVal="false"
                                        @change="(val, otherVal) => changeAllSource('offer_price', val, otherVal)"
                                        :other-val.sync="offerPrice.otherVal"
                                        :origin-arr="infoSource"
                                        v-model="offerPrice.value"/>
                                </div>
                            </li>
                            <li v-if="tableItemShows['price']">
                                <div class="flex-box">
                                    <span>总价(万元)</span>
                                    <info-source-component
                                        v-if="canTbShow('price')"
                                        :isShowVal="false"
                                        @change="(val, otherVal) => changeAllSource('price', val, otherVal)"
                                        :other-val.sync="price.otherVal"
                                        :origin-arr="infoSource"
                                        v-model="price.value"/>
                                </div>
                            </li>
                            <li v-if="tableItemShows['is_show_room_type']">是否展示</li>
                            <li v-if="tableItemShows['layout_shi']" 
                                class="layout-item">
                                <div class="flex-box">
                                    <span>厅室描述</span>
                                    <info-source-component
                                        v-if="canTbShow('layout_shi')"
                                        :isShowVal="false"
                                        @change="(val, otherVal) => changeAllSource('layout_shi', val, otherVal)"
                                        :other-val.sync="layoutShi.otherVal"
                                        :origin-arr="infoSource"
                                        v-model="layoutShi.value"/>
                                </div>
                            </li>
                            <li v-if="tableItemShows['floor_height']">
                                <div class="flex-box">
                                    <span>层高</span>
                                    <info-source-component
                                        v-if="canTbShow('floor_height')"
                                        :isShowVal="false"
                                        @change="(val, otherVal) => changeAllSource('floor_height', val, otherVal)"
                                        :other-val.sync="floorHeight.otherVal"
                                        :origin-arr="infoSource"
                                        v-model="floorHeight.value"/>
                                </div>
                            </li>
                            <li v-if="tableItemShows['building_type']">
                                <div class="flex-box">
                                    <span>户型类型</span>
                                    <info-source-component
                                        v-if="canTbShow('building_type')"
                                        :isShowVal="false"
                                        @change="(val, otherVal) => changeAllSource('building_type', val, otherVal)"
                                        :other-val.sync="buildingType.otherVal"
                                        :origin-arr="infoSource"
                                        v-model="buildingType.value"/>
                                </div>
                            </li>
                            <li v-if="tableItemShows['house_on_sale_num']">
                                <div class="flex-box">
                                    <span>在售余量(套)</span>
                                    <info-source-component
                                        v-if="canTbShow('house_on_sale_num')"
                                        :isShowVal="false"
                                        @change="(val, otherVal) => changeAllSource('house_on_sale_num', val, otherVal)"
                                        :other-val.sync="houseOnSaleNum.otherVal"
                                        :origin-arr="infoSource"
                                        v-model="houseOnSaleNum.value"/>
                                </div>
                            </li>
                            <li v-if="tableItemShows['room_type']">
                                <div class="flex-box">
                                    <span>户型居室</span>
                                    <info-source-component
                                        v-if="canTbShow('room_type')"
                                        :isShowVal="false"
                                        @change="(val, otherVal) => changeAllSource('room_type', val, otherVal)"
                                        :other-val.sync="roomType.otherVal"
                                        :origin-arr="infoSource"
                                        v-model="roomType.value"/>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="table-list" ref="bodyWrapper">
                        <ul class="table-flex-box"  v-for="(item,index) in model.tableData" :key="index">
                            <li v-if="tableItemShows['acreage'] && item.acreage">
                                <jl-number-input
                                    class="num-input"
                                    @blur="calculationAllPrice(item)"
                                    v-model="item.acreage.field_value"
                                    :minVal="1"
                                    :maxVal="99999"
                                    reg="int"
                                ></jl-number-input>
                                <div class="check-source-box"
                                    v-if="canTbShow('acreage')">
                                    <info-source-component
                                        :other-val.sync="item.acreage.belong_other"
                                        :origin-arr="infoSource"
                                        v-model="item.acreage.belong_role" />
                                </div>
                            </li>
                            <li v-if="tableItemShows['ac_acreage'] && item.ac_acreage">
                                <jl-number-input
                                    @blur="calculationAllPrice(item)"
                                    class="num-input"
                                    v-model="item.ac_acreage.field_value"
                                    :minVal="1"
                                    :maxVal="99999.99"
                                    reg="twoNum"
                                ></jl-number-input>
                                <div class="check-source-box"
                                    v-if="canTbShow('ac_acreage')">
                                    <info-source-component
                                        :other-val.sync="item.ac_acreage.belong_other"
                                        :origin-arr="infoSource"
                                        v-model="item.ac_acreage.belong_role" />
                                </div>
                            </li>
                            <li v-if="tableItemShows['status'] && item.status">
                                <el-form-item
                                    :prop="'tableData.' + index + '.status.field_value'"
                                    :rules="[ { required: true, message: '销售状态必填', trigger: 'blur' } ]">
                                    <el-select
                                        v-model="item.status.field_value"
                                        placeholder="请选择">
                                        <el-option
                                        v-for="item in saleStatus"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <div class="check-source-box"
                                    v-if="canTbShow('status')">
                                    <info-source-component
                                        :isInFixed="true"
                                        :other-val.sync="item.status.belong_other"
                                        :origin-arr="infoSource"
                                        v-model="item.status.belong_role" />
                                </div>
                            </li>
                            <li v-if="tableItemShows['offer_price'] && item.offer_price">
                                <jl-number-input
                                    class="num-input"
                                    @blur="calculationAllPrice(item)"
                                    v-model="item.offer_price.field_value"
                                    :minVal="0.0001"
                                    :maxVal="99.9999"
                                    reg="fourNum"
                                ></jl-number-input>
                                <div class="check-source-box"
                                    v-if="canTbShow('offer_price')">
                                    <info-source-component
                                        @change="(val, otherVal) => changePriceSource(item, val, otherVal)"
                                        :other-val.sync="item.offer_price.belong_other"
                                        :origin-arr="infoSource"
                                        v-model="item.offer_price.belong_role" />
                                </div>
                            </li>
                            <li v-if="tableItemShows['price'] && item.price">
                                <jl-number-input
                                    class="num-input"
                                    v-model="item.price.field_value"
                                    :minVal="1"
                                    :maxVal="99999.9999"
                                    reg="fourNum"
                                ></jl-number-input>
                                <div class="check-source-box"
                                    v-if="canTbShow('price')">
                                    <info-source-component
                                        :other-val.sync="item.price.belong_other"
                                        :origin-arr="infoSource"
                                        v-model="item.price.belong_role" />
                                </div>
                            </li>
                            <li v-if="tableItemShows['is_show_room_type'] && item.is_show_room_type">
                                <el-form-item
                                    :prop="'tableData.' + index + '.is_show_room_type.field_value'"
                                    :rules="[ { required: true, message: '是否展示必填', trigger: 'change' } ]">
                                    <el-select
                                        v-model="item.is_show_room_type.field_value"
                                        placeholder="请选择">
                                        <el-option
                                        v-for="item in houseTypeIsShow"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </li>
                            <li v-if="tableItemShows['layout_shi'] && item.layout_shi"
                                class="layout-item">
                                <div class="hall-room">
                                    <el-form-item
                                        :prop="'tableData.' + index + '.layout_shi.field_value'"
                                        :rules="[ { required: true, message: '厅必填', trigger: 'blur' } ]">
                                        <jl-number-input
                                            class="num-input"
                                            v-model="item.layout_shi.field_value"
                                            :minVal="1"
                                            :maxVal="20"
                                            reg="int"
                                            @blur="houseRoomLinkage(item)"
                                        ></jl-number-input>
                                    </el-form-item>
                                        室
                                    <jl-number-input
                                        class="num-input"
                                        v-model="item.layout_ting.field_value"
                                        :minVal="0"
                                        :maxVal="20"
                                        reg="parseInt"
                                    ></jl-number-input>
                                        厅
                                    <jl-number-input
                                        class="num-input"
                                        v-model="item.layout_chu.field_value"
                                        :minVal="0"
                                        :maxVal="20"
                                        reg="parseInt"
                                    ></jl-number-input>
                                        厨
                                    <jl-number-input
                                        class="num-input"
                                        v-model="item.layout_wei.field_value"
                                        :minVal="0"
                                        :maxVal="20"
                                        reg="parseInt"
                                    ></jl-number-input>
                                        卫
                                </div>
                                <div class="check-source-box"
                                    v-if="canTbShow('layout_shi')">
                                    <info-source-component
                                        :other-val.sync="item.layout_shi.belong_other"
                                        :origin-arr="infoSource"
                                        @change="(val, otherVal) => changeChu(item, val, otherVal)"
                                        v-model="item.layout_shi.belong_role" />
                                </div>
                            </li>
                            <li v-if="tableItemShows['floor_height'] && item.floor_height">
                                <jl-number-input
                                    class="num-input small-box"
                                    v-model="item.floor_height.field_value"
                                    :minVal="0.01"
                                    :maxVal="99.99"
                                    reg="twoNum"
                                ></jl-number-input>
                                <div class="check-source-box"
                                    v-if="canTbShow('floor_height')">
                                    <info-source-component
                                        :other-val.sync="item.floor_height.belong_other"
                                        :origin-arr="infoSource"
                                        v-model="item.floor_height.belong_role" />
                                </div>
                            </li>
                            <li v-if="tableItemShows['building_type'] && item.building_type">
                                <el-select
                                    clearable
                                    v-model="item.building_type.field_value"
                                    placeholder="请选择">
                                    <el-option
                                    v-for="item in houseTypes"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                                <div class="check-source-box"
                                    v-if="canTbShow('building_type')">
                                    <info-source-component
                                        :other-val.sync="item.building_type.belong_other"
                                        :origin-arr="infoSource"
                                        v-model="item.building_type.belong_role" />
                                </div>
                            </li>
                            <li v-if="tableItemShows['house_on_sale_num'] && item.house_on_sale_num">
                                <jl-number-input
                                    class="num-input small-box"
                                    v-model="item.house_on_sale_num.field_value"
                                    :minVal="0"
                                    :maxVal="99999"
                                    reg="parseInt"
                                ></jl-number-input>
                                <div class="check-source-box"
                                    v-if="canTbShow('house_on_sale_num')">
                                    <info-source-component
                                        :other-val.sync="item.house_on_sale_num.belong_other"
                                        :origin-arr="infoSource"
                                        v-model="item.house_on_sale_num.belong_role" />
                                </div>
                            </li>
                            <li v-if="tableItemShows['room_type'] && item.room_type">
                                <el-select
                                    class="middle-box"
                                    v-model="item.room_type.field_value"
                                    placeholder="请选择">
                                    <el-option
                                    v-for="item in roomTypes"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                                <div class="check-source-box"
                                    v-if="canTbShow('room_type')">
                                    <info-source-component
                                        :other-val.sync="item.room_type.belong_other"
                                        :origin-arr="infoSource"
                                        v-model="item.room_type.belong_role" />
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="table-fix-info table-left-info">
                        <div class="table-head">
                            <ul class="table-flex-box">
                                <li v-if="tableItemShows['house_type_id']" class="id-item">户型id</li>
                                <li v-if="tableItemShows['house_type_imgs']" class="img-item">户型图片</li>
                                <li v-if="tableItemShows['house_type_num']" class="num-item">
                                    <div class="flex-box">
                                        <span>户型编号</span>
                                        <info-source-component
                                            v-if="canTbShow('house_type_num')"
                                            :isInFixed="true"
                                            :isShowVal="false"
                                            @change="(val, otherVal) => changeAllSource('house_type_num', val, otherVal)"
                                            :other-val.sync="houseTypeNum.otherVal"
                                            :origin-arr="infoSource"
                                            v-model="houseTypeNum.value"/>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="table-body" ref="fixedBodyWrapper">
                            <ul class="table-flex-box"  v-for="(item,index) in model.tableData" :key="index">
                                <li v-if="tableItemShows['house_type_id'] && item.house_type_id" class="id-item">
                                    {{item.house_type_id.field_value}}
                                </li>
                                <li v-if="tableItemShows['house_type_imgs']" class="img-item">
                                    <img v-if="item.house_type_imgs && item.house_type_imgs.field_value.length > 0"
                                    :src="host + item.house_type_imgs.field_value[0]"
                                    class="tb-hx-img"
                                    @click="imgPreview([item.house_type_imgs.field_value[0]])"
                                    alt="户型图片"/>
                                </li>
                                <li v-if="tableItemShows['house_type_num'] && item.house_type_num" class="num-item">
                                    <el-form-item
                                        :prop="'tableData.' + index + '.house_type_num.field_value'"
                                        :rules="[ { required: true, message: '户型编号不可为空', trigger: 'blur' } ]">
                                        <el-input
                                            v-model.trim="item.house_type_num.field_value"
                                            :maxlength="20"
                                            placeholder="存在编号即可输入编号，不知道时输入面积即可">
                                        </el-input>
                                    </el-form-item>
                                    <div class="check-source-box"
                                        v-if="canTbShow('house_type_num')">
                                        <info-source-component
                                            :isInFixed="true"
                                            :other-val.sync="item.house_type_num.belong_other"
                                            :origin-arr="infoSource"
                                            v-model="item.house_type_num.belong_role" />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="table-fix-info table-right-info"
                        :class="model.tableData.length > 3 ? 'is-scroll' : ''">
                        <div class="table-head">
                            <ul class="table-flex-box">
                                <li>操作</li>
                            </ul>
                        </div>
                        <div class="table-body" ref="rightFixedBodyWrapper">
                            <ul class="table-flex-box"  v-for="(item,index) in model.tableData" :key="index">
                                <li>
                                    <el-button
                                        @click="showGotoDialog({
                                            path: 'BuildAddHouseView',
                                            id: item.house_type_id.field_value,
                                            idName: 'houseTypeId'
                                        })"
                                        type="text">
                                        查看
                                    </el-button>
                                    <el-button
                                        @click="showGotoDialog({
                                            path: 'BuildAddHouseDetail',
                                            id: item.house_type_id.field_value,
                                            idName: 'houseTypeId',
                                            isEdit: 1
                                        })"
                                        type="text">
                                        编辑
                                    </el-button>
                                    <el-button
                                        @click="delectHouseType(item.house_type_id.field_value, index)"
                                        class="btn-danger"
                                        type="text">
                                        删除
                                    </el-button>
                                    <el-button
                                        v-if="roleNumber == ROLENUMBER"
                                        @click="copyAndAddHouseType(item.house_type_id.field_value)"
                                        type="text">
                                        复制并新增
                                    </el-button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div v-if="showExpandBtn"
                    class="btn-box">
                    <el-button
                        @click="showMoreInfo()"
                        type="text">
                        {{showAll ? '收起查看户型' : '查看更多户型'}}
                    </el-button>
                </div>
            </div>
            <div v-else class="no-data house-list">
                <div class="table-title">
                    <ul class="table-flex-box">
                        <li>户型id</li>
                        <li>户型图片</li>
                        <li>户型编号</li>
                        <li>建筑面积(㎡)</li>
                        <li>套内面积(㎡)</li>
                        <li>销售状态</li>
                        <li>单价(万元)</li>
                        <li>总价(万元)</li>
                        <li>是否展示</li>
                        <li>厅室描述</li>
                        <li>层高</li>
                        <li>户型类型</li>
                        <li>在售余量(套)</li>
                        <li>户型居室</li>
                    </ul>
                </div>
                <div class="msg-info">暂无户型数据</div>
            </div>
        </el-form>
        <image-view
            :vshow.sync="imageViewShow"
            :src-list="imgList" />
    </div>
</template>

<script>
    // import { throttle } from 'throttle-debounce';
    import throttle from '../utils/throttle'
    import ImageView from '../components/ImageView';
    import InfoSourceComponent from '../components/InfoSourceComponent';
    import { commonFun } from '@/assets/js/utils/utils';
    import apiObj from '@/api/buildingDictionary/expandTagList.js';
    import {
        confirmMsg,
        isRequiredInfoOrigin,
        yuanToWan
    } from '../utils/index';
    import {
        hosueRoomIsReg
    } from '../utils/checkHouseInfo';
    import {
        roleNumList
    } from '../config/tabToggleList';
    export default {
        name: 'ChildModuleHouseInfo',
        components: {
            ImageView,
            InfoSourceComponent
        },
        props: {
            // 信息来源列表
            infoSource: {
                type: Array,
                default: () => []
            },
            // 楼盘销售状态
            saleStatus: {
                type: Array,
                default: () => []
            },
            // 户型居室
            roomTypes: {
                type: Array,
                default: () => []
            },
            // 房屋朝向
            roomOrientation: {
                type: Array,
                default: () => []
            },
            // 是否展示下拉数据
            houseTypeIsShow: {
                type: Array,
                default: () => []
            },
            // 渲染表单的数据
            initData: {
                type: Object,
                default: () => {}
            },
            // 阿里云图片地址
            host: {
                type: String,
                default: ''
            },
            // 当前角色值 7为运营
            roleNumber: {
                type: [String, Number],
                default: ''
            },
            // 城市ID
            cityId: {
                type: [String, Number],
                default: ''
            }
        },
        created() {
            // 初始化
            this.initInfo();
            // 获取户型下拉数据
            this.getHouseTypeList();
            this.initHouseInfo();
            this.hosueRoomIsReg = hosueRoomIsReg;
        },
        mounted() {
            this.bindEvents();   
        },
        destroyed() {
            this.unbindEvents();
        },
        computed: {
            bodyWrapper() {
                return this.$refs.bodyWrapper;
            },
            showAll() {
                return this.model.tableData.length === this.allData.length;
            },
            // 是否展示展开全部按钮
            showExpandBtn() {
                return this.allData.length > 2;
            },
            // 判断表格列是否展示
            canTbShow() {
                return ((type) => {
                    return this.tableItemShows[type] && this.tableColStatus[type] == '1';
                });
            }
        },
        data() {
            return {
                // 图片数组
                imgList: [],
                // 图片浏览是否展示
                imageViewShow: false,
                // 获取运营角色值
                ROLENUMBER: roleNumList.yunYing,
                // table数据渲染loading
                tableLoading: false,
                // 是否展示全部户型数据
                hasShowAllData: false,
                // 渲染表格的数据
                model: {
                    tableData: []
                },
                // tableData: [],
                // 户型类型下拉数据
                houseTypes: [],
                // 表格列来源是否显示
                tableColStatus: {},
                // 此表格列是否显示
                tableItemShows: {},
                // 户型编号来源全选
                houseTypeNum: {
                    value: '',
                    otherVal: ''
                },
                // 销售状态来源全选
                status: {
                    value: '',
                    otherVal: ''
                },
                // 建筑面积来源全选
                acreage: {
                    value: '',
                    otherVal: ''
                },
                // 套内面积来源全选
                acAcreage: {
                    value: '',
                    otherVal: ''
                },
                // 单价来源全选
                offerPrice: {
                    value: '',
                    otherVal: ''
                },
                // 总价来源全选
                price: {
                    value: '',
                    otherVal: ''
                },
                // 在售余量来源全选
                houseOnSaleNum: {
                    value: '',
                    otherVal: ''
                },
                // 厅室描述来源全选 室为必填
                layoutShi: {
                    value: '',
                    otherVal: ''
                },
                // 户型居室来源全选
                roomType: {
                    value: '',
                    otherVal: ''
                },
                // 户型类型来源全选
                buildingType: {
                    value: '',
                    otherVal: ''
                },
                // 层高来源全选
                floorHeight: {
                    value: '',
                    otherVal: ''
                },
                // 朝向来源全选
                orientation: {
                    value: '',
                    otherVal: ''
                }
            }
        },
        watch: {
            initData() {
                this.initHouseInfo();
            }
        },
        methods: {
            // mounted监听滚动事件
            bindEvents() {
                if(this.bodyWrapper) {
                    this.bodyWrapper.addEventListener('scroll', this.syncPostion, { passive: true });
                }
            },
            unbindEvents() {
                if(this.bodyWrapper) {
                    this.bodyWrapper.removeEventListener('scroll', this.syncPostion, { passive: true });
                }
            },
            // 节流，户型列表滑动监听事件，滑动后左侧固定与右侧固定跟随滑动，头部跟随滑动
            syncPostion: throttle(20, function() {
                const { scrollLeft, scrollTop } = this.bodyWrapper;
                const { headerWrapper, fixedBodyWrapper, rightFixedBodyWrapper} = this.$refs;
                if (headerWrapper) headerWrapper.scrollLeft = scrollLeft;
                if (fixedBodyWrapper) fixedBodyWrapper.scrollTop = scrollTop;
                if (rightFixedBodyWrapper) rightFixedBodyWrapper.scrollTop = scrollTop;
            }),
            imgPreview(list) {
                this.imgList = this.createImageUrl(list);
                this.imageViewShow = true;
            },
            initHouseInfo() {
                // 获取当前所处城市的ID
                this.belongCity = this.cityId;
                const initData = commonFun.deepClone(this.initData.data);
                // 需要转换为数字的值 销售状态、单价类型 总价类型
                const numberFields = ['status', 'is_show_room_type', 'acreage', 'ac_acreage', 'offer_price', 'price'];
                // 需要转换为万元的字段
                const unitYuans = ['price', 'offer_price'];
                const newData = initData.map((ele, idx) => {
                    const necessaryData = {};
                    Object.keys(ele).forEach(item => {
                        // 保存返回的此列是否展示来源的值 来源是否展示室一致的，不存在某一行来源展示，另一行数据不展示的情况,直接去第一行数据
                        if (idx === 0) {
                            // 储存需要展示来源的字段，1表示需要展示来源
                            this.tableColStatus[item] = ele[item].is_show_belong_role == 1;
                            // 储存需要展示的字段
                            this.tableItemShows[item] = true;
                        }
                        // 来源id为0不展示
                        if (ele[item].is_show_belong_role == '1') {
                            ele[item].belong_role = ele[item].belong_role || '';
                        }
                        // 将元转为万元展示
                        if (unitYuans.includes(item)) {
                            ele[item].field_value = yuanToWan(ele[item].field_value);
                            // 转换源对象的单价 和总价为万元
                            this.initData.data[idx][item].field_value = yuanToWan(this.initData.data[idx][item].field_value);
                        }
                        // 下拉字段转换为数字
                        if (numberFields.includes(item)) {
                            ele[item].field_value = ele[item].field_value ? Number(ele[item].field_value) : '';
                        }
                        const list = ele[item];
                        necessaryData[item] = {
                            field_id: list.field_id,
                            field_name: list.field_name,
                            field_value: list.field_value,
                            field_desc: list.field_desc,
                            belong_role: list.belong_role,
                            belong_other: list.belong_other,
                            is_show_belong_role: list.is_show_belong_role,
                            field_text: list.field_text,
                            table_id: list.table_id
                        };
                    });
                    return necessaryData;
                });
                // let trueData = newData.filter((item) => {
                //     return item.is_false && item.is_false.field_value === '2';
                // })
                this.model.tableData = newData.slice(0, 2);
                this.allData = newData;
            },
            // 初始化默认数据
            initInfo() {
                // 初始化户型id
                this.projectId = this.$route.query.projectId;
                // 初始化户型id
                this.taskId = this.$route.query.taskId;// 获取当前所处城市的ID
                // 初始化导入的方法，挂载到this
                this.confirmMsg = confirmMsg;
                this.isRequiredInfoOrigin = isRequiredInfoOrigin;
            },
            /**
             * 触发父组件跳转提示弹窗
             * @param {String} tag 跳转弹窗标识
             */
            showGotoDialog(tagMsg) {
                // this.$store.dispatch('getHouseTypeId', id);
                this.$emit('goToAlert', tagMsg);
            },
            // 获取户型下拉
            async getHouseTypeList() {
                try {
                    const options = {
                        project_id: this.projectId
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await apiObj.getHouseTypeInfo(options);
                    if (code === 0) {
                        this.houseTypes = data;
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 查看折叠更多户型
            showMoreInfo() {
                // 防止重复点击
                if (this.tableLoading) {
                    return;
                }
                this.tableLoading = true;
                // 添加超时，是为了让loading先于表格数据渲染，不让其整合到一起渲染，解决loading无效问题
                setTimeout(() => {
                    if (this.showAll) {
                        this.$refs['houseForm'].validate((valid) => {
                            if (valid) {
                                // 收起
                                this.model.tableData = this.allData.slice(0, 2);
                            }
                        });
                    } else {
                        this.model.tableData = [...this.allData];
                    }
                    this.$nextTick(() => {
                        this.tableLoading = false;
                    });
                }, 100);
            },
            /**
             * 户型居室联动
             * @param {object} item 当前的户型所在的对象
             */
            houseRoomLinkage(item) {
                const roomVal = item.layout_shi.field_value;
                if (roomVal < 5 && roomVal > 1) {
                    item.room_type.field_value = Number(roomVal);
                } else if (roomVal >= 5) {
                    item.room_type.field_value = 5;
                }
            },
            /**
             * 删除单个户型
             * @param {String} houseId 户型id
             * @param {Number} index 数据所在索引
             */
            async delectHouseType(houseId, index) {
                try {
                    // 判断是否点了确定按钮
                    const res = await this.confirmMsg('一旦删除则数据无法恢复，请确认是否删除！');
                    if (!res) {
                        return;
                    }
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId,
                        house_type_id: houseId
                    };
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await apiObj.delHouseTypeData(options);
                    this.$message(msg);
                    if (code === 0) {
                        // 删除此条数据
                        this.allData.splice(index, 1);
                        if (this.showAll) {
                            this.model.tableData = [...this.allData];
                        } else {
                            this.model.tableData = this.allData.slice(0, 2);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 根据单价来源修改总价来源
             * @param {Object} row 当前行数据对象
             * @param {String} value 来源组件传回的值
             * @param {String} otherVal 来源组件传回的选择其他填写的值
             */
            changePriceSource(row, value, otherVal) {
                row.price.belong_role = value;
                row.price.belong_other = otherVal;
            },
            /**
             * 批量修改所在列来源
             * @param {String} name 此列对应的数据字段的key
             * @param {String} value 来源组件传回的值
             * @param {String} otherVal 来源组件传回的选择其他填写的值
             */
            changeAllSource(name, value, otherVal) {
                // 遍历数据 修改所在列的来源绑定的值
                this.allData.forEach(ele => {
                    Object.keys(ele).forEach(item => {
                        if (name === item) {
                            if (name === 'layout_shi') {
                                // 将厅室厨卫的来源值都变更和厨一致
                                const arr = ['layout_ting', 'layout_chu', 'layout_wei'];
                                arr.forEach(key => {
                                    ele[key].belong_role = value;
                                    ele[key].belong_other = otherVal;
                                });
                            }
                            // 如果是单价，需要将总价同步修改
                            if (name === 'offer_price') {
                                ele.price.belong_role = value;
                                ele.price.belong_other = otherVal;
                            }
                            ele[item].belong_role = value;
                            ele[item].belong_other = otherVal;
                        }
                    });
                })
            },
            changeChu(item, value, otherVal) {
                // 将厅室厨卫的来源值都变更和厨一致
                const arr = ['layout_ting', 'layout_shi', 'layout_chu', 'layout_wei'];
                arr.forEach(ele => {
                    item[ele].belong_role = value;
                    item[ele].belong_other = otherVal;
                });
            },
            /**
             * 生成最终链接  将host拼接进去
             * @param {Array} srcList 服务端返回的文件半路径
             */
            createImageUrl(srcList) {
                return srcList.map(ele => `${this.host}${ele}`);
            },
            /**
             * 判断套面和建筑面积是否都为空
             */
            validAcreageAndAcacreage(item) {
                let {
                    // 建筑面积
                    acreage: {
                        field_value: buildingAreaVal
                    },
                    // 套内面积
                    ac_acreage: {
                        field_value: insideAreaVal
                    }
                } = item;
                return buildingAreaVal === '' && insideAreaVal === '';
            },
            /**
             * 判断厅室描述和户型居室不匹配 只判断2室及以上
             * @param {Object} item 行对象
             * @return {Boolean} 是否相匹配 不匹配返回true
             */
            validHomeDescWithHouse(item) {
                let {
                    // 室
                    layout_shi: {
                        field_value: homeVal
                    },
                    // 户型居室
                    room_type: {
                        field_value: roomVal
                    }
                } = item;
                // return Number(homeVal) >= 2 && roomVal != homeVal;
                return !this.hosueRoomIsReg(Number(homeVal), Number(roomVal))
            },
            /**
             * 总计自动计算  单价*面积优先建筑面积/重庆城市要反过来
             * @param {object} item 当前模块参数
             */
            calculationAllPrice(item) {
                let {
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
                    }
                } = item;
                // 先判断套内面积和建筑面积是否都为空
                if (this.validAcreageAndAcacreage(item)) {
                    this.$message.error('建筑面积和套内面积二必填一');
                    return;
                }
                // 建筑面积或套内面积v和单价都不为空是计算总价
                if ((buildingAreaVal !== '' && singlePriceVal !== '') || (insideAreaVal !== '' && singlePriceVal !== '')) {
                    if (Number(buildingAreaVal) && insideAreaVal !== '') {
                        // 重庆特殊处理，计算反过来
                        console.warn(this.belongCity)
                        if (this.belongCity === '20000050') {
                            item.price.field_value = (Number(insideAreaVal) ? insideAreaVal * singlePriceVal : buildingAreaVal * singlePriceVal).toFixed(4);
                        } else {
                            item.price.field_value = (buildingAreaVal * singlePriceVal).toFixed(4);
                        }
                    } else if (Number(buildingAreaVal) && insideAreaVal === '') {
                        item.price.field_value = (buildingAreaVal * singlePriceVal).toFixed(4);
                    } else {
                        item.price.field_value = (insideAreaVal * singlePriceVal).toFixed(4);
                    }
                } else if (singlePriceVal === '' || singlePriceVal === undefined || singlePriceVal === null) {
                    item.price.field_value = '';
                }
            },
            /**
             * 户型在售余量自洽
             * @param {object} itemVal 当前模块参数
             * @return {Boolean} flag 是否通过
             */
            checkHouseMargin(itemVal) {
                let {
                    // 销售状态
                    status,
                    // 户型在售余量
                    house_on_sale_num
                } = itemVal;
                let flag = true;
                // 当在售||待售时，在售余量不等于空并且小于0
                let checkOne = (status.field_value == 2 || status.field_value == 4) && house_on_sale_num.field_value !== '' && house_on_sale_num.field_value <= 0;
                let checkTwo = status.field_value == 3 && house_on_sale_num.field_value !== '' && house_on_sale_num.field_value > 0;
                if (checkOne || checkTwo) {
                    this.$alert(this.houseNumArcageConcat(itemVal) + '的销售状态和在售余量不自冾', '提示', {
                        confirmButtonText: '确定'
                    });
                    flag = false;
                }
                return flag;
            },
            /**
             * 户型编号面积拼接
             * @param {Object} initInfo 户型基础信息
             * @param {Object} dynamicInfo 户型动销信息
             * @return {String} str 户型拼接值
             */
            houseNumArcageConcat(initInfo) {
                let {
                    // 户型编号
                    house_type_num,
                    // 厅室描述
                    layout_shi,
                    layout_ting,
                    layout_chu,
                    layout_wei,
                    // 建筑面积
                    acreage,
                    // 套内面积
                    ac_acreage
                } = initInfo;
                let str = '';
                let layoutShi = '';
                let layoutTing = '';
                let layoutChu = '';
                let layoutWei = '';
                // 给厅室厨卫判断赋值
                layoutShi = layout_shi.field_value === '' || layout_shi.field_value == 0 ? '' : layout_shi.field_value + '室';
                layoutTing = layout_ting.field_value === '' || layout_ting.field_value == 0 ? '' : layout_ting.field_value + '厅';
                layoutChu = layout_chu.field_value === '' || layout_chu.field_value == 0 ? '' : layout_chu.field_value + '厨';
                layoutWei = layout_wei.field_value === '' || layout_wei.field_value == 0 ? '' : layout_wei.field_value + '卫';
                // 拼接户型信息
                if ((acreage.field_value !== '' && ac_acreage.field_value !== '') || (acreage.field_value !== '' && ac_acreage.field_value === '')) {
                    str = house_type_num.field_value + '-' + acreage.field_value + '㎡' + '-' + layoutShi + layoutTing + layoutChu + layoutWei;
                } else if (acreage.field_value === '' && ac_acreage.field_value !== '') {
                    str = house_type_num.field_value + '-' + ' (套内)' + ac_acreage.field_value + '㎡' + '-' + layoutShi + layoutTing + layoutChu + layoutWei;
                }
                return str;
            },
            /**
             * 复制并新增户型弹窗
             * @param {String} id 户型id
             */
            copyAndAddHouseType(id) {
                // this.houseTypeId = id;
                // this.houseDialogVisible = true;
                this.$emit('copyHouse', 'edit', id);
            },
            // 获取模块的数据
            getEditData() {
                let validStatus = false;
                this.$refs.houseForm.validate((valid) => {
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
                // 检查销售状态和在售余量自洽
                let validStatusWithMount = () => this.allData.find(ele => {
                    return !this.checkHouseMargin(ele);
                });
                if (validStatusWithMount()) {
                    return;
                }
                // 检查厅室描述和户型居室是否匹配
                let validRoom = () => this.allData.find(ele => {
                    return this.validHomeDescWithHouse(ele);
                });
                if (validRoom()) {
                    // this.$message.error('厅室描述和户型居室不匹配，请确认检查信息！');
                    return;
                }
                // 检查面积二必须填一
                let validArea = () => this.allData.find(ele => {
                    return this.validAcreageAndAcacreage(ele);
                });
                if (validArea()) {
                    this.$message.error('建筑面积和套内面积二必填一');
                    return;
                }
                // 校验是否通过
                if (!this.isRequiredInfoOrigin(this.initData.data, this.allData, true, '户型信息模块：')) {
                    return;
                }
                // 将本地的值进行返回
                return this.allData;
            }
        }
    }
</script>

<style lang="less" scoped>
    // flex展示户型列表
    .house-list {
        position: relative;
        overflow: hidden;
        .table-flex-box {
            display: flex;
            align-items: center;
            height: 110px;
            li {
                padding: 10px;
                width: 140px;
                border-bottom: 1px solid #eee;
                box-sizing: border-box;
                height: 100%;
                &.layout-item {
                    width: 270px;
                }
            }
        }
        .table-title {
            width: 100%;
            overflow: hidden;
            .table-flex-box {
                width: 2140px;
                padding-left: 330px;
                padding-right: 12px;
            }
        }
        .table-title,
        .table-head {
            .table-flex-box {
                min-height: 40px;
                height: auto;
                background: #eee;
                li {
                    border-top: 1px solid #eee;
                }
            }
        }
        .table-list {
            position: relative;
            width: 100%;
            overflow-x: auto;
            overflow-y: auto; 
            max-height: 340px;
            .table-flex-box{
                height: 110px;
                width: 2140px;
                padding-left: 330px;
                box-sizing: border-box;
                li {
                    height: 100%;
                }
            }
        }
        .table-flex-box {
            .id-item {
                display: flex;
                align-items: center;
                width: 90px;
            }
            .img-item {
                display: flex;
                align-items: center;
                width: 100px;
            }
        }
        .table-fix-info {
            position: absolute;
            top: 0;
            bottom: 15px;
            background: #fff;
            box-shadow: 0 0 10px rgba(0,0,0,.12);
            &.table-left-info {
                left: 0;
                width: 330px;
            }
            &.table-right-info {
                right: 0px;
                width: 140px;
                &.is-scroll {
                    right: 12px;
                    .table-head {
                        margin-right: -12px;
                    }
                }
            }
            .table-body {
                max-height: 325px;
                overflow: hidden;
            }
        }
    }
    .no-data {
        margin-top: 20px;
        .table-title .table-flex-box {
            padding-left: 0;
            width: 100%;
            li {
                width: auto;
                flex: 1;
            }
        }
        .msg-info {
            text-align: center;
            padding: 30px 0;
            border: 1px solid #eee;
        }
    }

    .flex-box {
        display: flex;
        align-items: center
    }
    /* .btn-danger{
        color: #f56c6c;
    } */
    .house-info {
        padding: 0 10px;
        margin-top: 50px;
    }
    .title-tip {
        font-weight: normal;
        font-size: 14px;
        padding-left: 10px;
        color: #999;
    }
    .table-wrap-box-box {
        margin-top: 20px;
        /deep/ .el-form-item{
            margin-bottom: 0;
        }
        .tb-hx-img {
            width: 80px;
            height: 60px;
            cursor: pointer;
        }
        // /deep/.el-table {
        //     th {
        //         div {
        //             &.flex-box {
        //                 padding-left: 0;
        //             }
        //         }
        //     }
        //     .img-cell {
        //         .cell {
        //             text-overflow: clip;
        //         }
        //     }
        // }
        // .small-box {
        //     /deep/.el-input {
        //         .el-input__inner {
        //             width: 80px;
        //         }
        //     }
            
        // }
        // .small-num-input {
        //     /deep/.el-input {
        //         .el-input__inner {
        //             width: 80px;
        //         }
        //     }
        // }
        // .middle-box {
        //     /deep/.el-input {
        //         .el-input__inner {
        //             width: 124px;
        //         }
        //     }
            
        // }
    }
    .hall-room {
        display: flex;
        align-items: center;
        /deep/.el-form-item {
            .num-input {
                .el-input__inner {
                    padding: 0 10px;
                }
            }
        }
    }
    .item{
        margin-left: 5px;
        color: #f78f0f;
        font-size: 16px;
        cursor: pointer;
        .focus{
            font-weight: bold;
        }
    }
    .btn-box {
        text-align: right;
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
    .check-source-box {
        min-height: 28px;
        margin-top: 20px;
    }
</style>