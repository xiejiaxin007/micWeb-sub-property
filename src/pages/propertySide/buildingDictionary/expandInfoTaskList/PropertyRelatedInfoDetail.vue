<template>
    <div class="property-box">
        <div class="modal-title-box">
            <h3 class="title-content">楼盘楼栋相关信息</h3>
        </div>
        <div class="property-box">
            <!-- 产权年限 -->
            <div class="years-property-box">
                <el-table
                    :data="projectPropertyYearInfo"
                    border
                    style="width: 100%"
                    :header-cell-style="tableHeaderColor">
                    <el-table-column
                        label="产权年限"
                        align="center"
                        v-if="tableItemShows['property_year']">
                        <template slot-scope="scope">
                            <span>{{ scope.row.property_year.field_text }}</span>
                            <span v-show="scope.row.property_year.field_value == -1">{{ scope.row.property_year_other.field_value }}</span>
                            <p v-if="scope.row.property_year.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.property_year)}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="关联楼栋"
                        align="center"
                        v-if="tableItemShows['relation_buildings']">
                        <template slot-scope="scope">
                            <p
                                v-for="(item, index) in scope.row.relation_buildings.field_text"
                                :key="index">
                                {{ item + ' '}}
                            </p>
                            <p v-if="scope.row.relation_buildings.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.relation_buildings)}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 建筑类型 -->
            <div class="years-property-box">
                <el-table
                    :data="buildingTypeInfo"
                    border
                    style="width: 100%"
                    :header-cell-style="tableHeaderColor">
                    <el-table-column
                        label="建筑类型"
                        align="center"
                        v-if="tableItemShows['business_layout']">
                        <template slot-scope="scope">
                            <span>{{ scope.row.business_layout.field_text }}</span>
                            <p v-if="scope.row.business_layout.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.business_layout)}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="关联楼栋"
                        align="center"
                        v-if="tableItemShows['relation_buildings']">
                        <template slot-scope="scope">
                            <p
                                v-for="(item, index) in scope.row.relation_buildings.field_text"
                                :key="index">
                                {{ item + ' '}}
                            </p>
                        <p v-if="scope.row.relation_buildings.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.relation_buildings)}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 物业公司 -->
            <div class="years-property-box">
                <el-table
                    :data="propertyCompanyInfo"
                    border
                    style="width: 100%"
                    :header-cell-style="tableHeaderColor">
                    <el-table-column
                        label="物业公司"
                        align="center"
                        v-if="tableItemShows['property_company_id']">
                        <template slot-scope="scope">
                            <span>{{ scope.row.property_company_id.field_text }}</span>
                            <p v-if="scope.row.property_company_id.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.property_company_id)}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="关联楼栋"
                        align="center"
                        v-if="tableItemShows['relation_buildings']">
                        <template slot-scope="scope">
                            <p
                                v-for="(item, index) in scope.row.relation_buildings.field_text"
                                :key="index">
                                {{ item + ' '}}
                            </p>
                        <p v-if="scope.row.relation_buildings.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.relation_buildings)}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 物业费 -->
            <div class="years-property-box">
                <el-table
                    :data="propertyPriceInfo"
                    border
                    style="width: 100%"
                    :header-cell-style="tableHeaderColor">
                    <el-table-column
                        label="物业费(元/㎡/月)"
                        align="center"
                        v-if="tableItemShows['property_fee']">
                        <template slot-scope="scope">
                            <span>{{ scope.row.property_fee.field_value }}</span>
                            <p v-if="scope.row.property_fee.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.property_fee)}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="关联楼栋"
                        align="center"
                        v-if="tableItemShows['relation_buildings']">
                        <template slot-scope="scope">
                            <p
                                v-for="(item, index) in scope.row.relation_buildings.field_text"
                                :key="index">
                                {{ item + ' '}}
                            </p>
                        <p v-if="scope.row.relation_buildings.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.relation_buildings)}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 水电气 -->
            <div class="years-property-box">
                <el-table
                    :data="hydroelectricInfo"
                    border
                    style="width: 100%"
                    :header-cell-style="tableHeaderColor">
                    <el-table-column
                        label="水电气"
                        align="center"
                        v-if="tableItemShows['water_electy']">
                        <template slot-scope="scope">
                            <span>{{ scope.row.water_electy.field_value }}</span>
                            <p v-if="scope.row.water_electy.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.water_electy)}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="关联楼栋"
                        align="center"
                        v-if="tableItemShows['relation_buildings']">
                        <template slot-scope="scope">
                            <p
                                v-for="(item, index) in scope.row.relation_buildings.field_text"
                                :key="index">
                                {{ item + ' '}}
                            </p>
                        <p v-if="scope.row.relation_buildings.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.relation_buildings)}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 装修情况 -->
            <div class="years-property-box">
                <el-table
                    :data="decorationStatusInfo"
                    border
                    style="width: 100%"
                    :header-cell-style="tableHeaderColor">
                    <el-table-column
                        label="装修情况"
                        align="center"
                        v-if="tableItemShows['decorate_info']">
                        <template slot-scope="scope">
                            <span>{{ scope.row.decorate_info.field_text }}</span>
                            <p v-show="scope.row.decorate_info.field_value == 1">
                                装修费用: {{ scope.row.decorate_fee.field_value }} 元/㎡
                            </p>
                            <p v-show="scope.row.decorate_info.field_value == 1">
                                装修单位: {{ scope.row.decorate_unit.field_value }}
                            </p>
                            <p v-if="scope.row.decorate_info.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.decorate_info)}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="关联楼栋"
                        align="center"
                        v-if="tableItemShows['relation_buildings']">
                        <template slot-scope="scope">
                            <p
                                v-for="(item, index) in scope.row.relation_buildings.field_text"
                                :key="index">
                                {{ item + ' '}}
                            </p>
                        <p v-if="scope.row.relation_buildings.is_show_belong_role == '1'">{{spliceInfoOrigin(scope.row.relation_buildings)}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import InfoOrigin from '../components/InfoOrigin';
import { mapState } from "vuex";
import commonApi from '../api/common';
import moment from 'moment';
export default {
    props: {
        tableDataInfo: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        InfoOrigin
    },
    data() {
        return {
            // 产权年限
            projectPropertyYearInfo: [],
            // 建筑类型
            buildingTypeInfo: [],
            // 物业公司
            propertyCompanyInfo: [],
            // 物业费
            propertyPriceInfo: [],
            // 水电气
            hydroelectricInfo: [],
            // 装修情况
            decorationStatusInfo: [],
            // 表格列来源是否显示
            tableColStatus: {},
            // 此表格列是否显示
            tableItemShows: {},
            // 获取初始化结构
            initStructureData: {}
        }
    },
    computed: {
        ...mapState({
            // 获取全部列表数据
            getAllTableData: state => state.buildingDictionary.allTableData
        })
    },
    mounted() {
        // 获取初始化结构
        this.initStructure();
    },
    methods: {
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f9f9f9;color: #333;';
            }
        },
        // 遍历初始化数据
        initHouseInfo(initData) {
            const newData = initData.map((ele, idx) => {
                Object.keys(ele).forEach(item => {
                    // 保存返回的此列是否展示来源的值 来源是否展示室一致的，不存在某一行来源展示，另一行数据不展示的情况,直接去第一行数据
                    if (idx === 0) {
                        // 储存需要展示来源的字段
                        this.tableColStatus[item] = ele[item].is_show_belong_role;
                        // 储存需要展示的字段
                        this.tableItemShows[item] = true;
                    }
                })
                return ele;
            })
            this.allData = newData;
        },
        // 获取各表格的值
        getAllTableVal() {
            // 产权年限   当产权年限的字段有值的时候取后台返回的，没有取初始化结构的
            if (this.tableDataInfo.project_property_year_info.data.length > 0) {
                this.projectPropertyYearInfo = this.tableDataInfo.project_property_year_info.data;
            } else {
                this.projectPropertyYearInfo.push(this.initStructureData.project_property_year_info.data);
            }
            this.initHouseInfo(this.projectPropertyYearInfo);
            // 建筑类型
            if (this.tableDataInfo.project_construct_type_info.data.length > 0) {
                this.buildingTypeInfo = this.tableDataInfo.project_construct_type_info.data;
            } else {
                this.buildingTypeInfo.push(this.initStructureData.project_construct_type_info.data);
            }
            this.initHouseInfo(this.buildingTypeInfo);
            // 物业公司
            if (this.tableDataInfo.project_property_company_info.data.length > 0) {
                this.propertyCompanyInfo = this.tableDataInfo.project_property_company_info.data;
            } else {
                this.propertyCompanyInfo.push(this.initStructureData.project_property_company_info.data);
            }
            this.initHouseInfo(this.propertyCompanyInfo);
            // 物业费
            if (this.tableDataInfo.project_property_fee_info.data.length > 0) {
                this.propertyPriceInfo = this.tableDataInfo.project_property_fee_info.data;
            } else {
                this.propertyPriceInfo.push(this.initStructureData.project_property_fee_info.data);
            }
            this.initHouseInfo(this.propertyPriceInfo);
            // 水电气
            if (this.tableDataInfo.project_water_electy_info.data.length > 0) {
                this.hydroelectricInfo = this.tableDataInfo.project_water_electy_info.data;
            } else {
                this.hydroelectricInfo.push(this.initStructureData.project_water_electy_info.data);
            }
            this.initHouseInfo(this.hydroelectricInfo);
            // 装修情况
            if (this.tableDataInfo.project_decorate_info.data.length > 0) {
                this.decorationStatusInfo = this.tableDataInfo.project_decorate_info.data;
            } else {
                this.decorationStatusInfo.push(this.initStructureData.project_decorate_info.data);
            }
            this.initHouseInfo(this.decorationStatusInfo);
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
        // 获取增加初始化结构
        async initStructure() {
            try {
                let params = {
                    page_id: 4,
                    task_id: this.$route.query.taskId || ''
                }
                let result = await commonApi.getPageModuleData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.initStructureData = data.data;
                    this.getAllTableVal();
                } else {
                    this.$message(data.msg);
                }
            }
            catch(error) {
                console.log(error);
            }
        }
    }
}
</script>

<style lang="less" scoped>
.property-box {
    // 表格样式
    .years-property-box {
        margin-top: 20px;
        .ipt-val {
            width: 65%;
            margin-top: 10px;
        }
        .btn-add-pro {
            margin-top: 15px;
        }
        .sel-style {
            width: 100%;
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