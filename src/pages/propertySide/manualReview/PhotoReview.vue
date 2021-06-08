<!--
    /**
     * @file 人工审核-图片审核页面
     * @author  XieBin
     * @date 2019.10.29
     */
 -->
<template>
    <div class="collocation-wrap">
        <!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
        <el-breadcrumb-item>
            <a href="/">首页</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
            人工审核
        </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 页面切换 -->
        <el-select
            v-model="pageVal"
            placeholder="请选择"
            @change="urlChange">
                <el-option
                    v-for="item in pageOptions"
                    :key="item.url"
                    :label="item.text"
                    :value="item.url">
                </el-option>
        </el-select>
        <div class="content-box">
            <div class="photo-review-border">
                <h2>图片审核</h2>
            </div>
            <!-- 搜索下拉框 -->
            <div class="search-box">
                <el-form
                    :inline="true"
                    :model="searchForm"
                    class="demo-form-inline">
                    <el-form-item label="城市:">
                        <el-select
                            v-model="searchForm.cityVal"
                            placeholder="请选择城市"
                            filterable
                            @change="cityValChange"
                            @focus="blurGetCity">
                            <el-option
                                v-for="item in searchForm.cityOpations"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否合作:">
                        <el-select
                            v-model="searchForm.isComblen"
                            placeholder="请选择">
                            <el-option
                                v-for="item in searchForm.isComblenOpations"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 楼盘名称远程搜索 -->
                    <el-form-item label="楼盘名称:">
                        <el-select
                            v-model="searchForm.buildName"
                            placeholder="请选择"
                            value-key="project_id"
                            filterable
                            remote
                            clearable
                            :remote-method="remoteBuildName"
                            :loading="searchLoading"
                            @focus="projectFocus">
                            <el-option
                                v-for="(item, index) in searchForm.buildOpations"
                                :key="index"
                                :label="item.text"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="区域:">
                        <el-select
                            v-model="searchForm.areaName"
                            placeholder="请选择"
                            multiple
                            filterable
                            @focus="blurDistrictInfo">
                            <el-option
                                v-for="item in searchForm.areaOpations"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业态:">
                        <el-select
                            v-model="searchForm.businessName"
                            placeholder="请选择"
                            multiple
                            filterable
                            @focus="focusBusinessInfo">
                            <el-option
                                v-for="item in searchForm.businessOpations"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!-- 复选框 -->
                <div class="check-box">
                    <el-form label-width="130px" >
                        <el-form-item label="楼盘组审核状态：">
                            <el-checkbox
                                v-model="checkAll"
                                @change="handleCheckAllChange($event, 'build')">
                                不限
                            </el-checkbox>
                            <el-checkbox-group
                                v-model="checkedCities"
                                @change="handleSingleChange($event, 'build')">
                                <el-checkbox
                                    v-for="item in buildCities"
                                    :label="item.id"
                                    :key="item.id">
                                    {{item.text}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="图片审核结果：">
                            <el-checkbox
                                v-model="photoCheckAll"
                                @change="handleCheckAllChange($event, 'photoAudit')">
                                不限
                            </el-checkbox>
                            <el-checkbox-group
                                v-model="photoAudioCities"
                                @change="handleSingleChange($event, 'photoAudit')">
                                <el-checkbox
                                    v-for="item in photosCities" 
                                    :label="item.id"
                                    :key="item.id">
                                    {{item.text}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="图片类型：">
                            <el-checkbox
                                v-model="photoTypesAll"
                                @change="handleCheckAllChange($event, 'photoTypes')">
                                不限
                            </el-checkbox>
                            <el-checkbox-group
                                v-model="photoTypecCheckCities"
                                @change="handleSingleChange($event, 'photoTypes')">
                                <el-checkbox
                                    v-for="item in photoTypesCitites" 
                                    :label="item.id"
                                    :key="item.id">
                                    {{item.text}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="数据源：">
                            <el-checkbox
                                v-model="resouceAll"
                                @change="handleCheckAllChange($event, 'resourceOrigin')">
                                不限
                            </el-checkbox>
                            <el-checkbox-group
                                v-model="resourceCheckCities"
                                @change="handleSingleChange($event, 'resourceOrigin')">
                                <el-checkbox
                                    v-for="item in resourceOriginCities" 
                                    :label="item.id"
                                    :key="item.id">
                                    {{item.text}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                    <div class="btn-box">
                        <el-button @click="resetSearch">重置</el-button>
                        <el-button
                            type="primary"
                            @click="searchMethod">
                            搜索
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 图片展示页面 -->
        <photo-list-show
            :searchList="searchList"
            :refalsh="refalsh"
            :currentPage="currentPage">
        </photo-list-show>
    </div>
</template>

<script>
import dataConfig from './config/index';
import PhotoListShow from './PhotoListShow';
import photoAudioApi from '../../../api/manualReview/photonAudit';
export default {
    name: 'photoReview',
    data() {
        return {
            // 页面切换下拉
            pageVal: '',
            pageOptions: dataConfig.pagesSelect,
            // 加载loading
            searchLoading: false,
            // 搜索条件
            searchForm: {
                // 城市
                cityVal: '',
                cityOpations: [],
                // 是否合作
                isComblen: '',
                isComblenOpations: [],
                // 楼盘名称
                buildName: {
                    project_id: '',
                    id: ''
                },
                buildOpations: [],
                // 区域
                areaName: '',
                areaOpations: [],
                // 业态
                businessName: '',
                businessOpations: []
            },
            // 楼盘组审核状态复选框
            checkAll: true,
            checkedCities: [],
            buildCities: [],
            // 图片审核结果
            photoCheckAll: false,
            photoAudioCities: [1],
            photosCities: [],
            // 图片类型
            photoTypesAll: true,
            photoTypecCheckCities: [],
            photoTypesCitites: [],
            // 数据源
            resouceAll: true,
            resourceCheckCities: [],
            resourceOriginCities: [],
            // 搜索条件
            searchList: {},
            refalsh: 0,
            currentPage: 1
        }
    },
    created() {
        // 获取楼盘通用配置信息
        this.getBuildingGeneraInfoData();
    },
    mounted() {
        // 获取城市下拉数据
        this.getCityData('noInitData','notSelectFiirst');
        // 获取区域下拉数据
        this.remoteDistrictInfo();
        // 获取业态下拉数据
        this.remoteProjectType();
        
        this.pageVal = this.pageOptions[0].url;      
    },
    methods: {
        /**
         * url改变的时候
         * @param {string} val url改变的值
         */
        urlChange(val) {
            window.location.href = val;
        },
        // 点击搜索
        searchMethod() {
            this.searchList = {
                // 楼盘组ID
                id: this.searchForm.buildName.id || this.$route.query.id || '',
                // 城市ID
                city_id: this.searchForm.cityVal,
                // 是否合作
                is_cooperate: this.searchForm.isComblen,
                // 楼盘组审核状态
                state: this.checkedCities,
                // 图片审核状态
                audit_status: this.photoAudioCities,
                // 图片类型
                img_type: this.photoTypecCheckCities,
                // 源
                source: this.resourceCheckCities,
                // 区域ID
                district_id: this.searchForm.areaName,
                // 业态
                project_type: this.searchForm.businessName,
                page: 1
            }
            setTimeout(()=> {
                this.searchList.city_id = this.searchForm.cityVal
            },0)
            this.currentPage += 1;
        },
        // 获取楼盘通用配置信息
        async getBuildingGeneraInfoData() {
                let params = {
                    type: [17, 18, 19, 20, 21],
                    city_id: this.searchForm.cityVal
                };
                try {
                    let result = await photoAudioApi.getGeneraInfoData(params);
                    let { data } = result;
                    if (data.code === 0) {
                        // 是否合作下拉数据
                        this.searchForm.isComblenOpations = data.data.is_cooperate;
                        // 楼盘组审核状态复选框
                        this.buildCities = data.data.group_audit;
                        if (this.checkAll) {
                            this.buildCities.map(item => {
                                this.checkedCities.push(item.id);
                            });
                        }
                        // 图片审核结果
                        this.photosCities = data.data.pic_audit;
                        if (this.photoCheckAll) {
                            this.photosCities.map(item => {
                                this.photoAudioCities.push(item.id);
                            });
                        }
                        // 图片类型
                        this.photoTypesCitites = data.data.img_type;
                        if (this.photoTypesAll) {
                            this.photoTypesCitites.map(item => {
                                this.photoTypecCheckCities.push(item.id);
                            });
                        }
                        // 数据源
                        this.resourceOriginCities = data.data.source_list;
                        if (this.resouceAll) {
                            this.resourceOriginCities.map(item => {
                                this.resourceCheckCities.push(item.id);
                            });
                        }
                    }
                }
                catch(error) {
                    console.log(error)
                }
        },
        // 获取焦点获取城市下拉
        blurGetCity() {
            this.getCityData('initData','notSelectFiirst');
        },
        /**
         * 城市下拉select2
         * @param {string} type 是否初始化数据
         * @param {string} isSelectFirst 是否要选中当前业务城市第一条数据
         */
        async getCityData(type, isSelectFirst) {
                let params = {
                    q: '',
                    type: '1'
                };
                try {
                    let result = await photoAudioApi.getCityListData(params);
                    let { data } = result;
                    if (data.code === 0) {
                        this.searchForm.cityOpations = data.data;
                        if (isSelectFirst == 'notSelectFiirst') {
                            if (this.$route.query.city_id) {
                                let opation = this.searchForm.cityOpations.find(item => item.id === Number(this.$route.query.city_id));
                                this.searchForm.cityVal = opation.id;
                                this.searchMethod();
                            } else {
                                this.searchForm.cityVal = this.searchForm.cityOpations[0].id;
                                this.searchMethod();
                            }
                        }
                    }
                }
                catch(error) {
                    console.log(error);
                }
        },
        /**
         * 城市id改变
         * @param {string} val 城市id
         */
        cityValChange(val) {
            // 当城市改变的时候清空区域和业态
            this.searchForm.areaName = '';
            this.searchForm.businessName = '';
            this.searchForm.buildName = {
                id: '',
                project_id: ''
            };
            this.searchForm.areaOpations = [];
            this.searchForm.businessOpations = [];
            this.searchForm.buildOpations = [];
            if (this.searchForm.cityVal > '0') {
                this.remoteDistrictInfo();
                this.remoteProjectType();
            } else {
                this.searchForm.areaOpations = [];
                this.searchForm.businessOpations = [];
            }
            if (this.$route.query.id) {
                this.$router.push({
                    path: '/review/photoReview',
                    query: {
                        city_id: this.$route.query.city_id,
                        audit_obj: this.$route.query.audit_obj,
                    }
                })
            }
        },
        // 楼盘名称获取焦点调取
        projectFocus() {
            this.remoteBuildName();
        },
        /**
         * 楼盘名称select2
         * @param {string} query 当前输入的楼盘名称
         */
        async remoteBuildName(query) {
                this.searchLoading = true;
                let params = {
                    q: query,
                    city_id: this.searchForm.cityVal,
                    result_type: '3'
                }
                try {
                    let result = await photoAudioApi.getBuildNameData(params);
                    let { data } = result;
                    if (data.code === 0) {
                        this.searchLoading = false;
                        this.searchForm.buildOpations = data.data;
                    } else {
                        this.searchLoading = false;
                    }
                }
                catch(error) {
                    console.log(error)
                    this.searchLoading = false;
                }
        },
        // 区域信息
        blurDistrictInfo() {
            this.remoteDistrictInfo();
        },
        // 区域信息select2
        async remoteDistrictInfo() {
            if (this.searchForm.cityVal > '0') {
                let params = {
                    q: this.searchForm.areaName,
                    city_id: this.searchForm.cityVal,
                    status: 1
                }
                try {
                    let result = await photoAudioApi.getDistrictInfoData(params);
                    let { data } = result;
                    if (data.code === 0) {
                        this.searchForm.areaOpations = data.data;
                    }
                }
                catch(error) {
                    console.log(error)
                }
            } else {
                this.searchForm.areaOpations = [];
            }
        },
        // 业态获取焦点
        focusBusinessInfo() {
            this.remoteProjectType();
        },
        // 业态信息select2
        async remoteProjectType() {
            if (this.searchForm.cityVal > '0') {
                let params = {
                    q: this.searchForm.businessName,
                    city_id: this.searchForm.cityVal
                }
                try {
                    let result = await photoAudioApi.getProjectTypeData(params);
                    let { data } = result;
                    if (data.code === 0) {
                        this.searchForm.businessOpations = data.data;
                    }
                }
                catch(error) {
                    console.log(error)
                }
            } else {
                this.searchForm.businessOpations = [];
            }
        },
        /**
          * 点击不限全选按钮
          * @param {boolean} val 当前checkbox状态
          * @param {string} types 当前所属checkbox组
          */
        handleCheckAllChange(val, types) { 
            let dataArr = [];
            // 楼盘组审核
            if (types === 'build') {
                this.buildCities.map(item => {
                    dataArr.push(item.id);
                })
                this.checkedCities = val ? dataArr : [];
            } else if (types === 'photoAudit') {
                // 图片审核
                this.photosCities.map(item => {
                    dataArr.push(item.id);
                })
                this.photoAudioCities = val ? dataArr : [];
            } else if (types === 'photoTypes') {
                // 图片类型
                this.photoTypesCitites.map(item => {
                    dataArr.push(item.id);
                })
                this.photoTypecCheckCities = val ? dataArr : [];
            } else if (types === 'resourceOrigin') {
                // 数据源
                this.resourceOriginCities.map(item => {
                    dataArr.push(item.id);
                })
                this.resourceCheckCities = val ? dataArr : [];
            }
            
        },
        /**
          * 点击单个按钮
          * @param {boolean} val 当前checkbox状态
          * @param {string} types 当前所属checkbox组
          */
        handleSingleChange(val, types) {
            let checkedCount = val.length;
            if (types === 'build') {
                // 楼盘组审核
                this.checkAll = checkedCount === this.buildCities.length;
            } else if (types === 'photoAudit') {
                // 图片审核
                this.photoCheckAll = checkedCount === this.photosCities.length;
            } else if (types === 'photoTypes') {
                // 图片类型
                this.photoTypesAll = checkedCount === this.photoTypesCitites.length;
            } else if (types === 'resourceOrigin') {
                // 数据源
                this.resouceAll = checkedCount === this.resourceOriginCities.length;
            }
        },
        // 重置按钮
        resetSearch() {
            // 搜索条件
            this.searchForm = {
                // 城市
                cityVal: this.searchForm.cityOpations[0].id,
                cityOpations: this.searchForm.cityOpations,
                // 是否合作
                isComblen: '',
                isComblenOpations: this.searchForm.isComblenOpations,
                // 楼盘名称
                buildName: {
                    id: '',
                    project_id: ''
                },
                buildOpations: [],
                // 区域
                areaName: '',
                areaOpations: [],
                // 业态
                businessName: '',
                businessOpations: []
            };
            // 楼盘组审核状态复选框
            this.checkAll = true;
            this.checkedCities = [];
            // 图片审核结果
            this.photoCheckAll = false;
            this.photoAudioCities = [1];
            // 图片类型
            this.photoTypesAll = true;
            this.photoTypecCheckCities = [];
            // 是否重新调取接口
            this.refalsh += 1;
            // 数据源
            this.resouceAll = true;
            this.resourceCheckCities = [];
            if (this.$route.query.city_id) {
                let result = this.$router.resolve({
                    path: '/review/photoReview'
                });
                window.location.href = result.href;
            }
        }
    },
    components: {
        PhotoListShow
    }
}
</script>

<style lang="less" scoped>
.collocation-wrap {
    width: 100%;
    padding: 20px 0 0 20px;
    margin: 0 auto;
    box-sizing: border-box;
    .bread-nav {
        margin-bottom: 20px;
    }
    .content-box {
        width: 100%;
        background: #fff;
        margin-top: 20px;
        padding: 20px 20px 20px 30px;
        box-sizing: border-box;
        .photo-review-border {
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
            box-sizing: border-box;
        }
        .search-box {
            margin-top: 20px;
            /deep/ .el-form--inline .el-form-item {
                margin-right: 100px;
            }
            .check-box {
                /deep/ .el-checkbox-group {
                    display: inline-block;
                    margin-left: 20px;
                }
                /deep/ .el-form-item {
                    margin-bottom: 0px;
                }
                /deep/ .el-form-item__content {
                    display:flex;
                    flex-direction: row;
                }
            }
            .btn-box {
                text-align: center;
                margin-top: 20px;
                /deep/ .el-button {
                    width: 120px;
                    margin-left: 20px;
                }
            }
        }
    }
}
</style>