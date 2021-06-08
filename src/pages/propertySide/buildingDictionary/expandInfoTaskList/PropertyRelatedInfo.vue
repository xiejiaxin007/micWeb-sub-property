<template>
    <div class="property-box">
        <div class="modal-title-box">
            <h3 class="title-content">楼盘楼栋相关信息
                <el-button
                    type="text"
                    class="add-btn"
                    @click="addBuilding">
                    找不到去新增楼栋
                </el-button>
            </h3>
        </div>
        <!-- 产权年限 -->
        <project-property-year
            ref="propertyYear"
            v-if="initStructureData"
            :tableDataInfo="getAllTableData"
            :initStructureData="initStructureData" />
        <!-- 建筑类型 -->
        <project-building-type
            ref="buildingType"
            v-if="initStructureData"
            :tableDataInfo="getAllTableData"
            :initStructureData="initStructureData" />
        <!-- 物业公司 -->
        <project-property-company
            ref="propertyCompany"
            v-if="initStructureData"
            :tableDataInfo="getAllTableData"
            :initStructureData="initStructureData" />
        <!-- 物业费 -->
        <project-property-price
            ref="propertyPrice"
            v-if="initStructureData"
            :tableDataInfo="getAllTableData"
            :initStructureData="initStructureData" />
        <!-- 水电气 -->
        <project-hydroelectric
            ref="Hydroelectric"
            v-if="initStructureData"
            :tableDataInfo="getAllTableData"
            :initStructureData="initStructureData" />
        <!-- 装修情况 -->
        <project-decoration-status
            ref="decorationStatus"
            v-if="initStructureData"
            :tableDataInfo="getAllTableData"
            :initStructureData="initStructureData" />
    </div>
</template>

<script>
import ProjectPropertyYear from './ProjectPropertyYear';
import ProjectBuildingType from './ProjectBuildingType';
import ProjectPropertyCompany from './ProjectPropertyCompany';
import ProjectPropertyPrice from './ProjectPropertyPrice';
import ProjectHydroelectric from './ProjectHydroelectric';
import ProjectDecorationStatus from './ProjectDecorationStatus';
import commonApi from '../api/common';
import { mapState } from "vuex";
export default {
    props: {
        tableDataInfo: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        ProjectPropertyYear,
        ProjectBuildingType,
        ProjectPropertyCompany,
        ProjectPropertyPrice,
        ProjectHydroelectric,
        ProjectDecorationStatus
    },
    data() {
        return {
            // 全部表格数据copy
            tableDataInfoCopy: {},
            // 初始化结构
            initStructureData: null,
            // 表格列来源是否显示
            tableColStatus: {},
            // 此表格列是否显示
            tableItemShows: {},
            // 关联楼栋下拉
            getRelatedBuildingOpiton: []
        }
    },
    computed: {
        ...mapState({
            // 获取全部列表数据
            getAllTableData: state => state.buildingDictionary.allTableData,
        })
    },
    mounted() {
        // 初始化结构
        this.initStructure();
    },
    methods: {
        // 向父页面提交值
        pushDataToParent() {
            return {
                allTableVal: this.getAllTableVal()
            }
        },
        // 跳转到楼栋页面
        addBuilding() {
            let queryHref = this.$router.resolve({
                path: '/building/buildingDetailEdit',
                query: {
                    projectId: this.$route.query.projectId,
                    taskId: this.$route.query.taskId,
                    isEdit: '1',
                    cityId: this.$route.query.cityId,
                    projectName: this.$route.query.projectName,
                    role: this.$route.query.role,
                    buildingType: this.$route.query.buildingType
                }
            });
            window.open(queryHref.href);
        },
        // 获取各表格的值
        getAllTableVal() {
            return {
                // 产权年限的值
                propertyYear: this.$refs['propertyYear'].pushDataToParents(),
                // 建筑类型的值
                buildingType: this.$refs['buildingType'].pushDataToParents(),
                // 物业公司的值
                propertyCompany: this.$refs['propertyCompany'].pushDataToParents(),
                // 物业费的值
                propertyPrice: this.$refs['propertyPrice'].pushDataToParents(),
                // 水电气的值
                Hydroelectric: this.$refs['Hydroelectric'].pushDataToParents(),
                // 装修情况的值
                decorationStatus: this.$refs['decorationStatus'].pushDataToParents()
            }
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
    .add-btn {
        margin-left: 20px;
    }
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