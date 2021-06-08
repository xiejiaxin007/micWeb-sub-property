<!--
    @name: 楼盘动销信息详情页
    @description: 楼盘动销信息详情页 仅展示字段信息
    @author: 贺伟
    @date: 2019-12-14
-->
<template>
    <div class="info-detail">
        <!--楼盘信息-->
        <div v-if="projectData.data">
            <div class="modal-title-box">
                <h3 class="title-content">楼盘动态信息</h3>
            </div>
            <div class="info-content-wrap" v-if="projectData.data">
                <el-form
                label-width="120px">
                    <template v-for="(value, name) in projectData.data">
                        <el-form-item
                            :key="name"
                            v-if="showField(name)"
                            class="form-item-wrap"
                            :label="formatDesc(value)">
                            <div class="form-left-box flex-box">
                                <div class="filed-value">{{getValueOrText(value)}}</div>
                                <div
                                    class="info-source"
                                    v-if="!$route.query.taskId && value.is_show_belong_role == '1'">
                                    {{getOriginOperateInfo(value)}}
                                </div>
                                <!-- name=status代表要放在销售状态后面 -->
                                <el-button v-if="name === 'status' && showSourceBtn"
                                    type="text"
                                    class="mark-source-btn"
                                    @click="batchMarkSource">批量标记销售状态来源</el-button>
                            </div>
                        </el-form-item>
                    </template>
                </el-form>
            </div>
        </div>
        <!--户型信息-->
        <div v-if="houseTypeData.data">
            <div class="modal-title-box">
                <h3 class="title-content">户型信息</h3>
                <el-button
                    v-if="hasEditAuth"
                    @click="toNewPage()"
                    type="primary"
                    size="small">
                    新增户型
                </el-button>
            </div>
            <div class="info-content-wrap" v-if="houseTypeData.data">
                <el-table
                    :data="houseTypeData.data"
                    max-height="490"
                    border>
                    <!--由于存在字段权限判断 v-if之后会出现无数据得情况表头也没了，故加上length是否等于0的判断-->
                    <el-table-column
                        fixed
                        min-width="100"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['house_type_id']"
                        label="户型id">
                        <template v-if="scope.row.house_type_id" slot-scope="scope">
                            {{scope.row.house_type_id.field_value}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed
                        min-width="100"
                        label="户型图片"
                        class-name="img-cell"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['house_type_imgs']">
                        <template slot-scope="scope">
                            <img v-if="scope.row.house_type_imgs && scope.row.house_type_imgs.field_value.length > 0"
                                :src="host + scope.row.house_type_imgs.field_value[0]"
                                class="tb-hx-img"
                                @click="imgPreview([scope.row.house_type_imgs.field_value[0]])"
                                alt="户型图片">
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed
                        min-width="150"
                        label="户型编号"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['house_type_num']">
                        <template v-if="scope.row.house_type_num" slot-scope="scope">
                            <div class="main-content">{{scope.row.house_type_num.field_value}}</div>
                            <span
                                class="info-source" v-if="!$route.query.taskId && scope.row.house_type_num.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.house_type_num)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="建筑面积(㎡)"
                        min-width="150"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['acreage']">
                        <template v-if="scope.row.acreage" slot-scope="scope">
                            <div class="main-content">{{scope.row.acreage.field_value}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.acreage.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.acreage)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="套内面积(㎡)"
                        min-width="150"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['ac_acreage']">
                        <template v-if="scope.row.ac_acreage" slot-scope="scope">
                            <div class="main-content">{{scope.row.ac_acreage.field_value}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.ac_acreage.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.ac_acreage)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="销售状态"
                        min-width="150"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['status']">
                        <template v-if="scope.row.status" slot-scope="scope">
                            <div class="main-content">{{scope.row.status.field_text}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.status.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.status)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="单价(万元)"
                        min-width="150"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['offer_price']">
                        <template v-if="scope.row.offer_price" slot-scope="scope">
                            <div class="main-content">{{scope.row.offer_price.field_value}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.offer_price.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.offer_price)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="总价(万元)"
                        min-width="150"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['price']">
                        <template v-if="scope.row.price" slot-scope="scope">
                            <div class="main-content">{{scope.row.price.field_value}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.price.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.price)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="是否展示"
                        min-width="100"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['is_show_room_type']">
                        <template v-if="scope.row.is_show_room_type" slot-scope="scope">
                        <div class="main-content">{{scope.row.is_show_room_type.field_text}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="厅室描述"
                        min-width="150"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['layout_shi']">
                        <template v-if="scope.row.layout_shi" slot-scope="scope">
                            <div class="main-content">
                                {{scope.row.layout_shi.field_value}}室
                                {{scope.row.layout_ting.field_value != 0 ? `${scope.row.layout_ting.field_value}厅` : '' }}
                                {{scope.row.layout_chu.field_value != 0 ? `${scope.row.layout_chu.field_value}厨` : '' }}
                                {{scope.row.layout_wei.field_value != 0 ? `${scope.row.layout_wei.field_value}卫` : '' }}
                            </div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.layout_shi.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.layout_shi)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="层高"
                        min-width="150"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['floor_height']">
                        <template v-if="scope.row.floor_height" slot-scope="scope">
                            <div class="main-content">{{scope.row.floor_height.field_value}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.floor_height.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.floor_height)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="户型类型"
                        min-width="150"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['building_type']">
                        <template v-if="scope.row.building_type" slot-scope="scope">
                        <div class="main-content">{{scope.row.building_type.field_text}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.building_type.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.building_type)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="在售余量(套)"
                        min-width="150"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['house_on_sale_num']">
                        <template v-if="scope.row.house_on_sale_num" slot-scope="scope">
                            <div class="main-content">{{scope.row.house_on_sale_num.field_value}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.house_on_sale_num.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.house_on_sale_num)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="户型居室"
                        min-width="150"
                        v-if="houseTypeData.data.length === 0 || houseTableCol['room_type']">
                        <template v-if="scope.row.room_type" slot-scope="scope">
                            <div class="main-content">{{scope.row.room_type.field_text}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.room_type.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.room_type)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        min-width="120"
                        v-if="houseTypeData.data.length > 0"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                v-if="scope.row.is_false && scope.row.is_false.field_value === '2'"
                                @click="toNewPage(scope.row.house_type_id.field_value, 0)"
                                type="text">
                                查看
                            </el-button>
                            <template v-if="hasEditAuth">
                                <el-button
                                    v-if="scope.row.is_false && scope.row.is_false.field_value === '2'"
                                    @click="toNewPage(scope.row.house_type_id.field_value, 1)"
                                    type="text">
                                    编辑
                                </el-button>
                                <el-button
                                    @click="delectHouseType(scope.row.house_type_id.field_value, scope.$index)"
                                    class="btn-danger"
                                    type="text">
                                    删除
                                </el-button>
                                <el-button
                                    v-if="(roleNumber == ROLENUMBER) && scope.row.is_false && (scope.row.is_false.field_value === '2')"
                                    @click="copyAndAddHouseType(scope.row.house_type_id.field_value)"
                                    type="text">
                                    复制并新增
                                </el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <build-module-warp
            :has-auth="getEditAuth"
            :build-data="buildingData.data">
            <div class="info-content-wrap">
                <el-table
                    :data="buildingData.data"
                    border>
                    <!-- 拓展不展示 -->
                    <el-table-column
                        label="楼栋ID"
                        v-if="!$route.query.taskId">
                        <template v-if="scope.row.id" slot-scope="scope">
                            <div class="main-content">{{scope.row.id.field_value}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="楼栋名称">
                        <template v-if="scope.row.building_name" slot-scope="scope">
                            <div class="main-content">{{scope.row.building_name.field_value}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.building_name.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.building_name)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="楼栋销售状态">
                        <template v-if="scope.row.saling_status" slot-scope="scope">
                            <div class="main-content">{{scope.row.saling_status.field_text}}</div>
                            <span class="info-source" v-if="!$route.query.taskId && scope.row.saling_status.is_show_belong_role == 1">
                                {{getOriginOperateInfo(scope.row.saling_status)}}
                            </span>
                        </template>
                    </el-table-column>
                    <!-- 拓展不展示 -->
                    <el-table-column
                        label="是否显示"
                        v-if="!$route.query.taskId">
                        <template v-if="scope.row.is_show" slot-scope="scope">
                            <div class="main-content">{{scope.row.is_show.field_text}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="120">
                        <template slot="header">
                            操作
                        </template>
                        <template slot-scope="scope">
                            <el-button
                                @click="toBuildingPage(scope.row.id.field_value)"
                                type="text">
                                查看
                            </el-button>
                            <template v-if="hasEditAuth">
                                <el-button
                                    @click="toBuildingPage(scope.row.id.field_value, '1')"
                                    type="text">
                                    编辑
                                </el-button>
                                <el-button
                                    class="btn-danger"
                                    @click="delectBuilding(scope.row.id.field_value, scope.$index)"
                                    type="text">
                                    删除
                                </el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </build-module-warp>
        <!--楼盘备注-->
        <div v-if="projectRemark.data">
            <div class="modal-title-box">
                <h3 class="title-content">楼盘备注</h3>
            </div>
            <div class="info-content-wrap">
                <el-form
                label-width="120px">
                    <el-form-item
                        v-for="(value, name) in projectRemark.data"
                        :key="name"
                        class="form-item-wrap"
                        :label="`${value.field_desc}：`">
                        <div class="form-left-box flex-box">
                            <div class="filed-value">{{value.field_value}}</div>
                            <div class="info-source">
                               {{getOriginOperateInfo(value)}}
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <image-view
            :vshow.sync="imageViewShow"
            :src-list="imgList" />
        <!-- 批量标记销售状态来源弹窗 -->
        <el-dialog
            title="批量标记销售状态来源"
            :visible.sync="sourceDialog"
            width="750px"
            center
            @close="closeSourceDialog">
            <el-alert title="注意："
                description="勾选模块的销售状态将会被批量改为售罄，若勾选了户型和楼栋模块，则户型和楼栋的在售余量会被置为0，且来源跟户型和楼栋的销售状态的信息来源一致，请谨慎操作！"
                type="error"
                :closable="false">
            </el-alert>
            <el-form :model="sourceForm" 
                :rules="sourceRules" 
                ref="sourceForm" 
                label-width="150px">
                <el-form-item label="批量标记来源模块：" 
                    prop="modal">
                    <el-checkbox-group v-model="sourceForm.modal">
                        <el-checkbox label="1" 
                            @change="changeModal($event, 'house')">户型</el-checkbox>
                        <el-checkbox label="2" 
                            @change="changeModal($event, 'building')">楼栋</el-checkbox>
                        <el-checkbox label="3" 
                            @change="changeModal($event, 'stage')">分期</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="sourceForm.modal.indexOf('1') !== -1"
                    label="户型信息来源：" 
                    prop="house">
                    <info-origin v-model="sourceForm.house.source"
                        :other-val.sync="sourceForm.house.other"
                        :origin-arr="infoSource"/>
                </el-form-item>
                <el-form-item v-if="sourceForm.modal.indexOf('2') !== -1"
                    label="楼栋信息来源：" 
                    prop="building">
                    <info-origin v-model="sourceForm.building.source"
                        :other-val.sync="sourceForm.building.other"
                        :origin-arr="infoSource"/>
                </el-form-item>
                <el-form-item v-if="sourceForm.modal.indexOf('3') !== -1"
                    label="分期信息来源：" 
                    prop="stage">
                    <info-origin v-model="sourceForm.stage.source"
                        :other-val.sync="sourceForm.stage.other"
                        :origin-arr="infoSource"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeSourceDialog">取消</el-button>
                <el-button type="primary" @click="confirmBatchSource">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ImageView from '../components/ImageView';
    import BuildModuleWarp from './BuildModuleWarp';
    import {
        roleNumList
    } from '../config/tabToggleList';
    import commonApi from '../api/common';
    import apiObj from '@/api/buildingDictionary/expandTagList.js';
    import {
        getOriginOperateInfo,
        confirmMsg
    } from '../utils/index';
    import { mapState } from "vuex";
    import InfoOrigin from '../components/InfoOrigin';
    export default {
        name: 'DynamicDetail',
        components: {
            ImageView,
            BuildModuleWarp,
            InfoOrigin
        },
        props: {
            // 楼盘信息数据
            projectData: {
                type: Object,
                default: () => {}
            },
            // 户型数据信息
            houseTypeData: {
                type: Object,
                default: () => {}
            },
            // 楼栋信息数据
            buildingData: {
                type: Object,
                default: () => {}
            },
            // 楼盘备注信息
            projectRemark: {
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
            // 户型复制标签数据
            houseTypeCopy: {
                type: Object,
                default: () => {}
            },
            // 信息来源列表
            infoSource: {
                type: Array,
                default: () => []
            },
            // 是否展示批量修改来源的按钮，和编辑按钮一个权限且没有taskId
            showSourceBtn: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapState({
                // 获取页面权限信息
                getEditAuth: state => state.buildingDictionary.isAuditorAuth
            }),
            hasEditAuth() {
                return this.getEditAuth == 2;
            }
        },
        data() {
            // 信息来源校验
            let validateSource = (rule, value, callback) => {
                this.$nextTick(() => {
                    if (!value.source) {
                        callback(new Error());
                    } else if(value.source === 10 && !value.other) {
                        callback(new Error());
                    } else {
                        callback();
                    }
                })
            };
            return {
                // 挂载来源转换方法
                getOriginOperateInfo,
                confirmMsg,
                // 获取运营角色值
                ROLENUMBER: roleNumList.yunYing,
                // 需要展示的字段
                houseTableCol: {},
                // 图片数组
                imgList: [],
                // 图片浏览是否展示
                imageViewShow: false,
                // 批量修改来源的弹窗
                sourceDialog: false,
                // 批量修改来源的表单信息
                sourceForm: {
                    // 来源模块
                    modal: [],
                    // 户型来源
                    house: {
                        source: '',
                        other: ''
                    },
                    // 楼栋来源
                    building: {
                        source: '',
                        other: ''
                    },
                    // 分期来源
                    stage: {
                        source: '',
                        other: ''
                    },
                },
                // 批量修改来源中的表单校验
                sourceRules: {
                    modal: [
                        { type: 'array', required: true, message: '请选择需要标记信息来源的模块', trigger: 'change' }
                    ],
                    house: [
                        { validator: validateSource, message: '请选择户型信息来源' }
                    ],
                    building: [
                        { validator: validateSource, message: '请选择楼栋信息来源' }
                    ],
                    stage: [
                        { validator: validateSource, message: '请选择分期信息来源' }
                    ]
                },
                // 是否重复提交
                isSubmit: false
            }
        },
        created() {
            // 初始化户型id
            this.projectId = this.$route.query.projectId;
            this.taskId = this.$route.query.taskId;
            this.getDataField();
        },
        watch: {
            houseTypeData(val) {
                this.getDataField();
            }
        },
        methods: {
            // 批量标记销售状态来源
            batchMarkSource() {
                this.sourceDialog = true;
            },
            /**
             * @description: 模块选择，取消选择时要清空所选的值
             * @param {string} val  操作的值 
             * @param {string} modal  当前操作的是哪个模块 
             * @return {type} 
             */
            changeModal(val, modal) {
                if (!val) {
                    this.sourceForm[modal].source = '';
                    this.sourceForm[modal].other = '';
                }
            },
            // 确定批量修改状态来源
            confirmBatchSource() {
                this.$refs.sourceForm.validate(async (valid) => {
                    if (valid) {
                        if (this.isSubmit) {
                            return false;
                        }
                        this.isSubmit = true;
                        let params = {
                            project_id: this.projectId,
                            house_type: {
                                belong_source: this.sourceForm.house.source,
                                belong_other: this.sourceForm.house.other
                            },
                            building_info: {
                                belong_source: this.sourceForm.building.source,
                                belong_other: this.sourceForm.building.other
                            },
                            staging_info: {
                                belong_source: this.sourceForm.stage.source,
                                belong_other: this.sourceForm.stage.other
                            }
                        }
                        try {
                            const {
                                data: { code, msg }
                            } = await apiObj.batchUpdateStatus(params);
                            if (code === 0) {
                                this.sourceDialog = false;
                                this.isSubmit = false;
                                this.$message({
                                    type: "success",
                                    message: '提交成功'
                                });
                                this.$emit('updateInitInfo');
                            } else {
                                this.isSubmit = false;
                                this.$message(msg);
                            }
                        } catch (error) {
                            this.isSubmit = false;
                            console.log(error);
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 关闭批量修改来源的弹窗需要重置表单
            closeSourceDialog() {
                this.$refs.sourceForm.resetFields();
                this.sourceForm = {
                    // 来源模块
                    modal: [],
                    // 户型来源
                    house: {
                        source: '',
                        other: ''
                    },
                    // 楼栋来源
                    building: {
                        source: '',
                        other: ''
                    },
                    // 分期来源
                    stage: {
                        source: '',
                        other: ''
                    },
                };
                this.sourceDialog = false;
            },
            // 图片预览
            imgPreview(list) {
                this.imgList = this.createImageUrl(list);
                this.imageViewShow = true;
            },
            // 获取要展示的字段 来判断字段是否显示
            getDataField() {
                // 保存返回的此列是否展示来源的值 来源是否展示室一致的，不存在某一行来源展示，另一行数据不展示的情况,直接去第一行数据
                const houseData = this.houseTypeData && this.houseTypeData.data && (this.houseTypeData.data[0] || {});
                houseData && Object.keys(houseData).forEach(item => {
                    // 储存需要展示的字段
                    this.houseTableCol[item] = true;
                });
            },
            /**
             * 直接打开新页面跳转到户型编辑或者详情页
             * @param {String} id 户型id
             * @param {String} type 标识要跳转得页面类型 0：详情查看页   1：户型编辑页面
             */
            toNewPage(id = '', type = 1) {
                const {
                    projectId = '',
                    taskId = '',
                    role = ''
                } = this.$route.query;
                // 定义id字段
                const fieldId = id ? `&houseTypeId=${id}` : '';
                const path = type === 0 ? 'BuildAddHouseView' : 'BuildAddHouseDetail';
                let baseUrl = `/dist/building/${path}?projectId=${projectId}&taskId=${taskId}${fieldId}&role=${role}`;
                // 户型详情页面
                window.open(`${baseUrl}`);
            },
            /**
             * 直接打开新页面跳转到楼栋编辑或者详情页
             * @param {String} id 楼栋id
             * @param {String} type 标识要跳转得页面类型 0：详情查看页   1：编辑页面
             */
            toBuildingPage(id = '', type = '') {
                const {
                    projectId = '',
                    taskId = '',
                    role = ''
                } = this.$route.query;
                // 定义id字段
                const fieldId = id ? `&buildingId=${id}` : '';
                const path = 'buildingDetailEdit';
                let baseUrl = `/dist/building/${path}?projectId=${projectId}&taskId=${taskId}${fieldId}&role=${role}`;
                if (type) {
                    baseUrl += `&isEdit=${type}&isDynamic=1`;
                }
                // 户型详情页面
                window.open(`${baseUrl}`);
            },
            /**
             * 删除楼栋
             * @param {String} houseId 户型id
             * @param {Number} index 数据所在索引
             */
            async delectBuilding(buildingId, index) {
                try {
                    // 判断是否点了确定按钮
                    const res = await this.confirmMsg('一旦删除则数据无法恢复，请确认是否删除！');
                    if (!res) {
                        return;
                    }
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId,
                        building_id: buildingId
                    };
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await apiObj.delBuildingData(options);
                    this.$message(msg);
                    if (code === 0) {
                        /* // 删除此条数据
                        // this.model.tableData.splice(index, 1);
                        this.allData.splice(index, 1);
                        // 同步删除源数据里的数据
                        this.initData.data.splice(index, 1);
                        if (this.hasShowAllData) {
                            // 收起
                            this.model.tableData = this.allData;
                        } else {
                            // 显示全部
                            this.model.tableData = this.allData.slice(0, 2);
                        } */
                        // 重新获取初始化信息
                        this.$emit('updateInitInfo');
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 单价最小是不显示 且当总价类型非区间时 不展示总价最大值
             */
            showField(name) {
                if (name === 'current_rate_max') {
                    return false;
                }
                /* if (priceType != 4 && name === 'price_max') {
                    return false;
                } */
                if (name === 'price_max') {
                    return false;
                }
                return true;
            },
            /**
             * 复制并新增户型弹窗
             * @param {String} id 户型id
             */
            copyAndAddHouseType(id) {
                // this.houseTypeId = id;
                // this.houseDialogVisible = true;
                this.$emit('copyHouse', 'detail', id);
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
                    } = await commonApi.delHouseTypeData(options);
                    this.$message(msg);
                    if (code === 0) {
                        // 重新获取初始化信息
                        this.$emit('updateInitInfo');
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 生成最终链接  将host拼接进去
             * @param {Array} srcList 服务端返回的文件半路径
             */
            createImageUrl(srcList) {
                return srcList.map(ele => `${this.host}${ele}`);
            },
            /**
             * 处理展示的字段名称key
             * @param {Object} field 字段对象
             * @return {String} 处理后的值
             */
            formatDesc(field) {
                let desc = field.field_desc;
                // 如果未单价最小值 且单价类型不是区间 则展示总价
                if (field.field_name === 'price_min') {
                    desc = '总价'
                }
                if (field.field_name === 'current_rate') {
                    desc = '单价'
                }
                return desc + '：';
            },
            /**
             * 判断是否室下拉的展示，展示对应的文本
             * @param {Object} item 对应的数据项
             * @return {String} 处理后的值
             */
            getValueOrText(item) {
                let content = item.field_value;
                if (!content) {
                    return '无';
                }
                // 需要展示文本的字段
                const showTextArr = ['status', 'price_type', 'current_price_type'];
                // 需要展示单位万元的字段
                const showUnitArr = ['current_rate', 'price_min', 'price_max'];
                // 总价类型
                const priceType = this.projectData.data.price_type.field_value;
                // 总价最大值
                const maxPrice = this.projectData.data.price_max.field_value;
                // 单价最大值
                const maxCurPrice = this.projectData.data.current_rate_max.field_value;
                // 单价类型
                const curPriceType = this.projectData.data.current_price_type.field_value;
                if (showUnitArr.includes(item.field_name)) {
                    content = `${item.field_value} 万元`;
                    if (item.field_name === 'price_min') {
                        // 2为低价  4为总价区间
                        content = priceType == 2 ? `${item.field_value} 万元起` : priceType == 3 ? `${item.field_value} 万元` : `${item.field_value} - ${maxPrice} 万元`;
                    } else if (item.field_name === 'current_rate') {
                        // 3为单价底价  4为单价区间
                        content = curPriceType == 3 ? `${item.field_value} 万元起` : curPriceType == 2 ? `${item.field_value} 万元` : `${item.field_value} - ${maxCurPrice} 万元`;
                    }
                }
                if (showTextArr.includes(item.field_name)) {
                    content = item.field_text;
                }
                return content;
            }
        }
    }
</script>

<style lang="less" scoped>
    .flex-box{
        display: flex;
    }
    .info-detail{
        padding: 0 10px;
    }
    .mark-source-btn {
        padding: 0 0 0 50px;
    }
    .info-content-wrap{
        margin-bottom: 30px;
        padding: 20px 10px;
        .tb-hx-img {
            width: 80px;
            height: 60px;
            cursor: pointer;
        }
        /deep/.el-table {
            .img-cell {
                .cell {
                    text-overflow: clip;
                }
            }
        }
    }
    .form-left-box{
        .filed-value{
            padding-right: 25px;
            word-break: break-word;
        }
    }
    .info-source{
        color: #bbb;
    }
    /deep/ .el-table th.gutter{ // 解决某些电脑缩放导致的表头错位
        display: table-cell!important;
    }
</style>