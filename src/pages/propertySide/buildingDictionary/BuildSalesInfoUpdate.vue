<!--
    @file: 楼盘分级任务列表
    @description: 楼盘分级任务列表
    @author: xiebin
    @date: 2019-11-14
-->
<template>
    <div class="sales-box">
        <!--面包屑-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>楼盘分级任务列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="sales-content">
            <el-form :inline="true"
                :model="searchForm"
                ref="searchForm"
                label-width="100px">
                <el-form-item label="城市："
                    prop="selCityVal">
                    <el-select v-model="searchForm.selCityVal"
                        placeholder="请选择"
                        filterable
                        clearable
                        @change="cityChangeList">
                        <el-option v-for="item in searchForm.selCityOpations"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="楼盘名称："
                    prop="selBuildingNameVal">
                    <el-select v-model="searchForm.selBuildingNameVal"
                        placeholder="请选择"
                        filterable
                        remote
                        :remote-method="getProjectNameSelectList"
                        :loading="searchForm.searchLoading"
                        @focus="focusGetSelList">
                        <el-option v-for="item in searchForm.selBuildingNameOpations"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="楼盘ID："
                    prop="buildingIdVal">
                    <el-input v-model="searchForm.buildingIdVal"
                        placeholder="请输入楼盘ID">
                    </el-input>
                </el-form-item>
                <el-form-item label="合作状态："
                    prop="selIsCooperationVal">
                    <el-select v-model="searchForm.selIsCooperationVal"
                        placeholder="请选择"
                        @focus="getProjectConfigList">
                        <el-option v-for="item in searchForm.selIsCooperationOpations"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="楼盘等级："
                    prop="selBuildingRankVal">
                    <el-select v-model="searchForm.selBuildingRankVal"
                        placeholder="请选择"
                        @focus="getProjectConfigList"
                        multiple="">
                        <el-option v-for="item in searchForm.selBuildingRankOpations"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 搜索按钮 -->
                <div class="btn-box">
                    <el-button @click="resetForm('searchForm')">重置</el-button>
                    <el-button type="primary"
                        @click="searchList">
                        搜索
                    </el-button>
                </div>
            </el-form>
            <!-- 列表数据 -->
            <div class="table-box">
                <div class="data-show-box">
                    <span>共{{pageList.totalNum}}条数据,第{{pageList.startNum}}-{{pageList.endNum}}条数据</span>
                    <el-button type="text"
                        @click="onlyLookFirstProject">
                        仅看1、2级的合作和外联楼盘
                    </el-button>
                </div>
                <el-table :data="projectTableData"
                    border
                    style="width: 100%">
                    <el-table-column prop="city_text"
                        label="城市"
                        width="80">
                    </el-table-column>
                    <el-table-column prop="project_name"
                        label="楼盘名称">
                    </el-table-column>
                    <el-table-column prop="project_id"
                        label="楼盘ID"
                        width="100">
                    </el-table-column>
                    <el-table-column label="合作状态"
                        width="100">
                        <template slot-scope="scope">
                            <p>{{scope.row.cooperate_status_text}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="project_level_text"
                        label="楼盘等级"
                        width="100">
                    </el-table-column>
                    <el-table-column prop="uv_update_time"
                        label="分级更新时间">
                        <template slot-scope="scope">
                            <p>{{filterDate(scope.row.uv_update_time, 'YYYY-MM-DD HH:mm:ss')}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header"
                            slot-scope="scope">
                            <el-button type="text"
                                @click="sortList">
                                本周信息更新度
                            </el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-button type="text"
                                @click="updateInfoPage(scope.row.project_id)">
                                {{scope.row.update_rate}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column width="200">
                        <template slot="header">
                            <el-button type="text"
                                @click="businessUpdateSortList">
                                本周信息商务更新度
                            </el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-button type="text"
                                @click="updateInfoPage(scope.row.project_id)">
                                {{scope.row.business_update_rate}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dongtai_update_num"
                        label="近30天动态更新量">
                    </el-table-column>
                    <el-table-column label="本月缺少的动态更新量">
                        <template slot-scope="scope">
                            {{Number(scope.row.lack_dongtai_update_num) < 0 ? `超出要求${Math.abs(scope.row.lack_dongtai_update_num)}个` : scope.row.lack_dongtai_update_num}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"
                        width="80">
                        <template slot-scope="scope">
                            <p>
                                <el-button type="text"
                                    size="small"
                                    @click="businessChange(scope.row.project_id)">
                                    商务变更
                                </el-button>
                            </p>
                            <p>
                                <el-button type="text"
                                    size="small"
                                    @click="dynamicChange(scope.row.project_id)">
                                    动态更新
                                </el-button>
                            </p>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination background
                    layout="prev, pager, next"
                    :page-size="pageList.pageSize"
                    :hide-on-single-page="true"
                    :total="pageList.totalNum"
                    :current-page.sync="pageList.scurrentPage"
                    @current-change="currentChange">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import projectLevelApi from '@/api/buildingDictionary/buildSalesInfoUpdate';
export default {
    name: 'BuildSalesInfoUpdate',
    data() {
        return {
            searchForm: {
                // 城市下拉val
                selCityVal: '',
                selCityOpations: [],
                // 楼盘名称下拉
                selBuildingNameVal: '',
                selBuildingNameOpations: [],
                // 楼盘ID
                buildingIdVal: '',
                // 是否合作下拉
                selIsCooperationVal: '',
                selIsCooperationOpations: [],
                // 楼盘等级下拉
                selBuildingRankVal: [],
                selBuildingRankOpations: [],
                // loding
                searchLoading: false
            },
            // 分页
            pageList: {
                totalNum: 0,
                pageSize: 20,
                scurrentPage: 1,
                startNum: 0,
                endNum: 0
            },
            // 更新度排序
            sortVal: 'asc',
            // 商务更新度排序
            businessUpdateSortVal: 'asc',
            // 表格数据
            projectTableData: []
        };
    },
    mounted() {
        // 调用获取城市下拉列表
        this.getCitySelectList();
        // 调用楼盘分级列表
        // this.getProjectLevelList();
        this.currentChange(1);
        this.getProjectConfigList();
    },
    methods: {
        /**
         * 跳转详情页
         * @param {string} projectId 楼盘ID
         */
        updateInfoPage(projectId) {
            this.$router.push({
                path: '/building/HousesInfoUpdateDetail',
                query: {
                    projectId
                }
            });
        },
        /**
         * 点击商务变更
         * @param {string} projectId 楼盘ID
         */
        businessChange(projectId) {
            let hrefVal = this.$router.resolve({
                path: '/building/changeInfoEntering',
                query: {
                    projectId
                }
            });
            window.open(hrefVal.href);
        },
        /**
         * 点击动态更新
         * @param {string} projectId 楼盘ID
         */
        dynamicChange(projectId) {
            window.open(`/index.php?r=cj-project-dynamic-info%2Findex&project_id=${projectId}&page_tag=dynamic-info&show=1`);
        },
        // 点击仅查看1,2级楼盘
        onlyLookFirstProject() {
            this.searchForm.selBuildingRankVal = [1, 2];
            this.searchForm.selIsCooperationVal = 4;
            let params = {
                project_level: this.searchForm.selBuildingRankVal,
                is_cooperate: this.searchForm.selIsCooperationVal
            };
            this.getProjectLevelList(params);
        },
        // 更新度排序
        sortList() {
            let params;
            if (this.sortVal == 'asc') {
                this.sortVal = 'desc';
                params = {
                    u_sort: 'asc'
                };
            } else {
                this.sortVal = 'asc';
                params = {
                    u_sort: 'desc'
                };
            }
            this.getProjectLevelList(params);
        },
        // 商务更新度排序
        businessUpdateSortList() {
            let params;
            if (this.businessUpdateSortVal == 'asc') {
                this.businessUpdateSortVal = 'desc';
                params = {
                    b_u_sort: 'asc'
                };
            } else {
                this.businessUpdateSortVal = 'asc';
                params = {
                    b_u_sort: 'desc'
                };
            }
            this.getProjectLevelList(params);
        },
        /**
         * 切换分页
         * @param {number} changeVal 当前页面的值
         */
        currentChange(pageVal) {
            let params = {
                page: pageVal,
                city_id: this.searchForm.selCityVal,
                project_id: this.searchForm.buildingIdVal || this.searchForm.selBuildingNameVal,
                project_level: this.searchForm.selBuildingRankVal,
                is_cooperate: this.searchForm.selIsCooperationVal
            };
            if (pageVal > 1) {
                this.pageList.startNum = pageVal === 1 ? 1 : (pageVal - 1) * 20 + 1;
                this.pageList.endNum = Math.ceil(this.pageList.totalNum / this.pageList.pageSize) === pageVal ? this.pageList.totalNum : pageVal * 20;
            } else {
                this.pageList.startNum = 1;
                this.pageList.endNum = 20;
            }
            this.getProjectLevelList(params);
        },
        // 点击搜索
        searchList() {
            let params = {
                city_id: this.searchForm.selCityVal,
                project_id: this.searchForm.buildingIdVal || this.searchForm.selBuildingNameVal,
                project_level: this.searchForm.selBuildingRankVal,
                is_cooperate: this.searchForm.selIsCooperationVal
            };
            this.getProjectLevelList(params);
            this.currentChange(1);
        },
        // 获取楼盘分级列表
        async getProjectLevelList(params) {
            let result;
            try {
                if (params) {
                    result = await projectLevelApi.getProjectLevelListData(params);
                } else {
                    result = await projectLevelApi.getProjectLevelListData();
                }
                let { data } = result;
                if (data.code === 0) {
                    this.projectTableData = data.data.project_level_info;
                    this.pageList.totalNum = data.data.total_count;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取楼盘通用配置列表
        // 29 合作外联下拉/ 26 楼盘分级
        async getProjectConfigList() {
            let params = {
                type: [29, 26],
                city_id: this.searchForm.selCityVal
            };
            try {
                let result = await projectLevelApi.getProjectConfigListData(params);
                let { data } = result;
                if (data.code === 0) {
                    // 是否合作
                    this.searchForm.selIsCooperationOpations = data.data.cooperate_type;
                    // 楼盘等级
                    this.searchForm.selBuildingRankOpations = data.data.project_level;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取城市下拉列表
        async getCitySelectList() {
            let params = {
                q: ''
            };
            let result = await projectLevelApi.getProjectLevelCityListData(params);
            let { data } = result;
            if (data.code === 0) {
                this.searchForm.selCityOpations = data.data;
            }
        },
        // 当城市发生改变时清空楼盘列表
        cityChangeList() {
            this.searchForm.selBuildingNameVal = '';
            this.searchForm.selBuildingNameOpations = [];
        },
        // 获取焦点时获取当前城市的楼盘名称
        focusGetSelList() {
            this.getProjectNameSelectList('');
        },
        // 获取楼盘名称列表
        async getProjectNameSelectList(query) {
            this.searchForm.searchLoading = true;
            let params = {
                q: query,
                city_id: this.searchForm.selCityVal > '0' ? this.searchForm.selCityVal : ''
            };
            try {
                let result = await projectLevelApi.getProjectNameListData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.searchForm.searchLoading = false;
                    this.searchForm.selBuildingNameOpations = data.data;
                } else {
                    this.searchForm.searchLoading = false;
                }
            } catch (error) {
                console.log(error);
                this.searchForm.searchLoading = false;
            }
        },
        /**
         * 时间戳转换为年月日格式
         * @param {string} para 时间、默认不取毫秒，即后三位毫秒为0
         * @param {string} type 要转换的格式 例如'YYYY-MM-DD HH:mm:ss'
         * return 传入的时间格式
         */
        filterDate(para, type) {
            return para === '' ? '' : moment(para * 1000).format('YYYY-MM-DD HH:mm:ss');
        },
        /**
         * 重置搜索条件
         * @param {string} 当前表单ref值
         */
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.pageList = {
                totalNum: 0,
                pageSize: 20,
                startNum: 1,
                endNum: 20,
                scurrentPage: 1
            };
            this.getProjectLevelList();
        }
    }
};
</script>

<style lang="less" scoped>
.sales-box {
    padding: 20px;
    box-sizing: border-box;
    .sales-content {
        width: 100%;
        background: #fff;
        padding: 20px;
        box-sizing: border-box;
        .btn-box {
            margin-top: 40px;
            text-align: center;
            /deep/ .el-button {
                width: 120px;
                margin-right: 20px;
            }
        }
        .table-box {
            margin-top: 40px;
            /deep/ .el-pagination {
                text-align: center;
                margin-top: 30px;
            }
            .data-show-box {
                span {
                    font-size: 14px;
                }
            }
        }
    }
}
</style>