<!--
    /**
     * @file 人工审核-竞对图片展示页面
     * @author  XieBin
     * @date 2019.10.31
     */
 -->
<template>
    <div class="content-box">
        <div class="build-box clear-float">
            <div class="building-left-box">
                <p class="font-box">
                    <el-button
                        type="text"
                        v-show="buildingAudit.isHavePre"
                        @click="preProjectInfo">
                        上一个楼盘
                    </el-button>
                    <span>当前审核楼盘: {{buildingAudit.projectName}}</span>
                    <el-button
                        type="text"
                        v-show="buildingAudit.isHaveNext"
                        @click="nextProjectInfo">
                        下一个楼盘
                    </el-button>
                </p>
                <p>共{{buildingAudit.buildingNum}}个楼盘，未审核{{buildingAudit.unAuditNum}}个，部分审核{{buildingAudit.someAuditNum}}个，全部审核{{buildingAudit.allAuditNum}}个</p>
            </div>
            <div class="building-right-box">
                <p class="btn-box">
                    <el-button
                        type="primary"
                        @click="closeTask"
                        v-if="iscloseBtnShow">
                        关闭任务
                    </el-button>
                    <span>批量操作：</span>
                    <el-button
                        type="success"
                        @click="batchPassAudit('success')"
                        v-loading.fullscreen.lock="batchPassBtnLoading">
                        批量通过
                    </el-button>
                    <el-button
                        type="danger"
                        v-loading.fullscreen.lock="batchNoBtnLoading"
                        @click="batchPassAudit('pass')">
                        批量不通过
                    </el-button>
                </p>
                <p class="font-style">批量操作只对未审核状态的数据有效</p>
            </div>
        </div>
        <!-- 图片展示区域 -->
        <div class="photo-show-area clear-float">
            <!-- 竞对图片展示区域 -->
            <div class="competing-photo-area">
                <div v-if="competingPageination.totalNum > 0">
                    <div
                        class="photo-continaer"
                        v-for="(item, index) in competingPhotoData"
                        :key="index">
                        <h2>{{item.img_type}}</h2>
                        <div class="img-box clear-float">
                            <ul>
                                <li
                                    v-for="(imgUrl) in item.img_list"
                                    :key="imgUrl.id">
                                    <p class="text-content clear-float">
                                        <span>数据源：{{imgUrl.source_text}} (</span>
                                        <span class="no-warp">{{imgUrl.project_name}})</span>
                                    </p>
                                    <span
                                    class="font-position"
                                    v-show="imgUrl.is_task === 1 ? true : false">新</span>
                                    <el-image
                                        style="width: 240px; height: 180px;border:1px solid #f5f4f4;margin-right:10px;"
                                        :src="imgUrl.img_url_show"
                                        fit="scale-down"
                                        :alt="imgUrl.title"
                                        @click="openPhotoViewer(imgUrl.img_url_show)">
                                    </el-image>
                                    <p class="audit-result">
                                        <span>审核结果: {{objStatus[imgUrl.audit_status][2]}}</span>
                                        <el-button
                                            size="mini"
                                            type="success"
                                            @click="passAudit(imgUrl.source, imgUrl.id, 'competing', 'success', imgUrl)"
                                            v-show="objStatus[imgUrl.audit_status][0]">
                                            通过
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            v-show="objStatus[imgUrl.audit_status][1]"
                                            @click="passAudit(imgUrl.source, imgUrl.id, 'competing', 'pass', imgUrl)">
                                            不通过
                                        </el-button>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="no-photo-info" v-else>
                    <h2>当前条件下无图片信息</h2>
                </div>
                <p
                    class="data-show-style"
                    v-if="competingPageination.competingDataShow">
                    第{{competingPageination.startNum}}-{{competingPageination.endNum}},共{{competingPageination.totalNum}}条数据
                </p>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="competingPageination.totalNum"
                    :page-size="competingPageination.pageSize"
                    :hide-on-single-page="true"
                    :current-page.sync="competingPageination.currentPage"
                    @current-change="pageChange($event, 'competing')">
                </el-pagination>
            </div>
            <!-- 居理图片展示区域 -->
            <div class="competing-photo-area julive-photo-area">
                <div v-if="julivePageination.totalNum > 0">
                    <div
                        class="photo-continaer"
                        v-for="(item, index) in julivePhotoData"
                        :key="index">
                        <h2>{{item.img_type}}</h2>
                        <div class="img-box clear-float">
                            <ul>
                                <li
                                    v-for="(imgUrl) in item.img_list"
                                    :key="imgUrl.id">
                                    <p class="text-content clear-float">
                                        <span>数据源：{{imgUrl.source_text}} (</span>
                                        <span class="no-warp">{{imgUrl.project_name}})</span>
                                    </p>
                                    <el-image
                                        style="width: 240px; height: 180px;border:1px solid #f5f4f4;margin-right:10px;"
                                        :src="imgUrl.img_url_show"
                                        fit="scale-down"
                                        :alt="imgUrl.title"
                                        @click="openPhotoViewer(imgUrl.img_url_show)">
                                    </el-image>
                                    <p class="audit-result">
                                        <span>审核结果: {{objStatus[imgUrl.audit_status][2]}}</span>
                                        <el-button
                                            size="mini"
                                            type="success"
                                            @click="passAudit(imgUrl.source, imgUrl.id, 'julive', 'success', imgUrl)"
                                            v-show="objStatus[imgUrl.audit_status][0]">
                                            通过
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            v-show="objStatus[imgUrl.audit_status][1]"
                                            @click="passAudit(imgUrl.source, imgUrl.id, 'julive', 'pass', imgUrl)">
                                            不通过
                                        </el-button>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="no-photo-info" v-else>
                    <h2>当前条件下无图片信息</h2>
                </div>
                <p
                    class="data-show-style"
                    v-show="julivePageination.juliveDataShow">
                    第{{julivePageination.startNum}}-{{julivePageination.endNum}},共{{julivePageination.totalNum}}条数据
                </p>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="julivePageination.totalNum"
                    :page-size="julivePageination.pageSize"
                    :hide-on-single-page="true"
                    :current-page.sync="julivePageination.currentPage"
                    @current-change="pageChange($event, 'julive')">
                </el-pagination>
            </div>
            <!-- 图片预览查看器 -->
            <jl-image-preview
                v-if="PhotoIsShow"
                :showViewer="PhotoIsShow"
                :urlList="urlList"
                @closeViewer="closeViewer">
            </jl-image-preview>
        </div>
    </div>
</template>

<script>
import photoAuditApi from '../../../api/manualReview/photonAudit';
export default {
    props: {
        // 搜索条件
        searchList: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // 是否要刷新
        refalsh: {
            type: Number,
            default: 0
        },
        // 当前页码
        currentPage: {
            type: Number,
            dafault: 1
        }
    },
    watch: {
        // 搜索条件
        'searchList': function(val) {
            this.buildingAudit.isHavePre = false;
            if (this.$route.query.project_id && this.$route.query.city_id) {
                val.project_id = this.$route.query.project_id;
                val.city_id = this.$route.query.city_id;
            }
            this.getCompetingPhotoInfo(val);
            this.getJulivePhotoInfo(val);
        },
        // 是否要刷新
        refalsh: function(val) {
            // 获取竞对楼盘信息
            this.getCompetingPhotoInfo();
            // 获取居理楼盘信息
            this.getJulivePhotoInfo();
        },
        // 当前页码
        currentPage: function(val) {
            this.julivePageination.currentPage = 1;
            this.competingPageination.currentPage = 1;
        },
        deep: true
    },
    data() {
        return {
            // 预览效果是否显示
            PhotoIsShow: false,
            // 楼盘组ID
            propertyGroupId: 0,
            // 竞对楼盘图片数据
            competingPhotoData: [],
            // 居理楼盘图片数据
            julivePhotoData: [],
            // 预览图片地址
            urlList: [],
            // 竞对楼盘图片分页
            competingPageination: {
                totalNum: 0,
                pageSize: 30,
                startNum: 0,
                endNum:0,
                competingDataShow: true,
                currentPage: 1
            },
            // 居理楼盘图片分页
            julivePageination: {
                totalNum: 0,
                pageSize: 20,
                startNum: 0,
                endNum:0,
                juliveDataShow: true,
                currentPage: 1
            },
            // 楼盘组审核个数
            buildingAudit: {
                // 楼盘名称
                projectName: '',
                // 是否展示上个楼盘按钮
                isHavePre: false,
                //是否展示下个楼盘
                isHaveNext: false,
                // 楼盘个数
                buildingNum: 0,
                // 未审核个数
                unAuditNum: 0,
                // 部分审核个数
                someAuditNum: 0,
                // 全部审核个数
                allAuditNum: 0
            },
            // 居理id
            juliveId: '',
            // 竞对楼盘当前页图片
            competHouseArr: [],
            // 居理楼盘当前页图片
            juliveHouseArr: [],
            // 审核通过按钮是否展示
            isAuditSuccessCompeting: true,
            isAuditSuccessJulive: true,
            // 审核不通过按钮是否展示
            isAuditPassJulive: true,
            isAuditPassCompeting: true,
            // 审核结果文案
            juliveAuditText: '',
            competingAuditText: '',
            objStatus: {
                '1': [true, true, '未审核'],
                '2': [false, true, '审核通过'],
                '3': [true, false, '审核不通过']
            },
            iscloseBtnShow: true,
            // 批量通过loading
            batchPassBtnLoading: false,
            // 批量不通过loading
            batchNoBtnLoading: false,
            // 数据统计是否显示
            // juliveCurrengPage: null,
            // competingCurrengPage: null,
        }
    },
    mounted() {
        // if (this.$route.query.project_id && this.$route.query.city_id) {
        //     this.searchList.project_id = this.$route.query.project_id;
        //     this.searchList.city_id = this.$route.query.city_id;
        //     // 获取竞对楼盘信息
        //     this.getCompetingPhotoInfo(this.searchList);
        //     // 获取居理楼盘信息
        //     this.getJulivePhotoInfo(this.searchList);
        // } else {
        //     // 获取竞对楼盘信息
        //     this.getCompetingPhotoInfo();
        //     // 获取居理楼盘信息
        //     this.getJulivePhotoInfo();
        // }
        // 关闭任务按钮是否展示
        this.closeIsShow();
        // 居理页脚数据展示
        this.juliveDataShow();
        // 竞对页脚数据展示
        this.competingDataShow();
    },
    updated() {
        this.competingDataShow(this.competingPageination.currentPage);
        this.juliveDataShow(this.julivePageination.currentPage);
    },
    methods: {
        /**
         * 居理数据量展示
         * @param {string} pageVal 当前页码
         */
        juliveDataShow(pageVal) {
                if (this.julivePageination.totalNum > 0) {
                    this.julivePageination.juliveDataShow = true;
                    if (pageVal) {
                        this.julivePageination.startNum = pageVal === 1 ? 1 : (pageVal - 1) * 20 + 1 ;
                        this.julivePageination.endNum = Math.ceil(this.julivePageination.totalNum / this.julivePageination.pageSize) === pageVal ? this.julivePageination.totalNum : pageVal * 20;
                    } else {
                        this.julivePageination.startNum = 1;
                        this.julivePageination.endNum = 20;
                    }
                } else {
                    this.julivePageination.juliveDataShow = false;
                }
        },
        /**
         * 竞对数据展示
         * @param {string} pageVal 当前页码
         */
        competingDataShow(pageVal) {
            if (this.competingPageination.totalNum > 0) {
                this.competingPageination.competingDataShow = true;
                if (pageVal) {
                    this.competingPageination.startNum = pageVal === 1 ? 1 : (pageVal - 1) * 30 + 1 ;
                    this.competingPageination.endNum = Math.ceil(this.competingPageination.totalNum / this.competingPageination.pageSize) === pageVal ? this.competingPageination.totalNum : pageVal * 30;
                } else {
                    this.competingPageination.startNum = 1;
                    this.competingPageination.endNum = 30;
                }
            } else {
                this.competingPageination.competingDataShow = false;
            }
        },
        // 关闭按钮是否显示
        closeIsShow() {
            if (this.$route.query.task_state) {
                this.iscloseBtnShow = true;
            }else {
                this.iscloseBtnShow = false;
            }
        },
        // 点击下一个楼盘
        nextProjectInfo() {
            // 展示上一个楼盘按钮
            this.buildingAudit.isHavePre = true;
            this.searchList.prev = '';
            this.searchList.next = 1;
            this.searchList.id = this.propertyGroupId;
            this.getCompetingPhotoInfo(this.searchList);
            this.getJulivePhotoInfo(this.searchList);
        },
        // 点击上一个楼盘
        preProjectInfo() {
            this.searchList.prev = 1;
            this.searchList.next = '';
            this.searchList.id = this.propertyGroupId;
            this.getCompetingPhotoInfo(this.searchList);
            this.getJulivePhotoInfo(this.searchList);
        },
        /**
         * 分页改变时
         * @param {number} val 当前页面
         * @param {number} pageType 分页类型是竞对还是居理
         */
        pageChange(val, pageType) {
                this.searchList.page = val;
                this.searchList.id = this.propertyGroupId;
            if(pageType === 'competing') {
                this.getCompetingPhotoInfo(this.searchList);
            } else if (pageType === 'julive') {
                this.searchList.project_id = this.juliveId;
                this.getJulivePhotoInfo(this.searchList);
                this.dataType = 'julive'
            }
        },
        // 关闭任务
        async closeTask() {
            let params = {
                project_id: this.juliveId
            }
            try {
                let result = await photoAuditApi.closeTaskData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.iscloseBtnShow = false;
                    this.searchList.project_id = this.$route.query.project_id;
                    this.searchList.city_id = this.$route.query.city_id;
                    this.getCompetingPhotoInfo(this.searchList);
                    this.getJulivePhotoInfo(this.searchList);
                    this.$router.push({
                        path: '/review/photoReview',
                        query: {
                            city_id: this.$route.query.city_id,
                            project_id: this.$route.query.project_id
                        }
                    });
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * 审核通过
         * @param {number} resource 源id
         * @param {string} photoId 图片id
         * @param {string} type 审核类型
         * @param {string} isAuditSuccess 是否审核通过
         * @param {object} imgUrl 当前图片的集合
         */
        async passAudit(resource, photoId, type, isAuditSuccess, imgUrl) {
            let houseIdInfo = [];
            let params = {};
            houseIdInfo.push(resource + '_' + photoId);
            let queryState = this.$route.query;
            if (isAuditSuccess === 'success') {
                params = {
                    id: this.propertyGroupId,
                    img_ids: houseIdInfo,
                    audit_status: 2,
                    project_id: imgUrl.project_id ? queryState.project_id : ''
                };
            } else if (isAuditSuccess === 'pass') {
                params = {
                    id: this.propertyGroupId,
                    img_ids: houseIdInfo,
                    audit_status: 3,
                    project_id: imgUrl.project_id ? queryState.project_id : ''
                };
            }
            try {                
                let result = await photoAuditApi.getPhotoAuditData(params);
                let { data } = result;
                if (data.code === 0) {
                    if (isAuditSuccess === 'success') {
                        if(type === 'julive' || type === 'competing') {
                            this.$set(imgUrl, 'audit_status', '2');
                        }
                    } else if (isAuditSuccess === 'pass') {
                        if(type === 'julive' || type === 'competing') {
                            this.$set(imgUrl, 'audit_status', '3');
                        }
                    }
                    if(data.data.is_refresh === 1) {
                        this.iscloseBtnShow = false;
                        // 如果是从运营任务列表进入需要带参数刷新
                        if (queryState.city_id) {
                            this.searchList.city_id = queryState.city_id;
                            this.searchList.project_id = queryState.project_id;
                            // 获取竞对楼盘信息
                            this.getCompetingPhotoInfo(this.searchList);
                            // 获取居理楼盘信息
                            this.getJulivePhotoInfo(this.searchList);
                        }
                    }
                }
            }
            catch(error) {
                console.log(error);
            }           
        },
        /**
         * 批量审核通过
         * @param {number} type 通过/不通过
         */
        async batchPassAudit(type) {
            this.batchPassBtnLoading = true;
            let params = {};
            let queryInfo = this.$route.query;
            if (type === 'success') { 
                params =  {
                    id: this.propertyGroupId,
                    img_ids: this.houseIdCheck(),
                    audit_status: 2,
                    project_id: queryInfo.project_id ? queryInfo.project_id : ''
                };
            } else if (type === 'pass') {
                params =  {
                    id: this.propertyGroupId,
                    img_ids: this.houseIdCheck(),
                    audit_status: 3,
                    project_id: queryInfo.project_id ? queryInfo.project_id : ''
                };
            }
            try {                
                let result = await photoAuditApi.getPhotoAuditData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.batchPassBtnLoading = false;
                    this.getCompetingPhotoInfo(this.searchList);
                    this.getJulivePhotoInfo(this.searchList);
                    this.$message({
                            message: '审核完成',
                            type: 'success'
                        });
                    if (data.data.is_refresh === 1) {
                        this.iscloseBtnShow = false;
                        this.$router.push({
                            path: '/review/photoReview',
                            query: {
                                city_id: this.$route.query.city_id,
                                project_id: this.$route.query.project_id
                            }
                        });
                    }
                } else if (data.code === 1012) {
                    this.batchPassBtnLoading = false;
                } else {
                    this.batchPassBtnLoading = false;
                        this.$message({
                            message: '当前无可操作的数据',
                            type: 'warning'
                        });
                }
            }
            catch(error) {
                this.batchPassBtnLoading = false;
                console.log(error);
            }    
        },
        // 户型id格式转换
        houseIdCheck() {
            let houseIDStr = [];
            this.competHouseArr.forEach(item => {
                item.img_list.filter(data => {
                    if (data.audit_status === '1') {
                        houseIDStr.push(data.source + '_' + data.id);
                    }
                })
            })
            return houseIDStr;
        },
        /**
         * 获取竞对楼盘图片数据
         * @param {object} searchArr 搜索条件
         */
        async getCompetingPhotoInfo(searchArr) {
            let params = {};
            if (searchArr) {
                params = searchArr;
            }
            try {
                let result = await photoAuditApi.getCompetingPhotoData(params);
                let { data } = result;
                if (data.code === 0) {
                    // 图片列表数据
                    this.competingPhotoData = data.data.img_data;
                    // 总条数
                    this.competingPageination.totalNum = data.data.total;
                    // 当前楼盘名称
                    this.buildingAudit.projectName = data.data.project_name;
                    // 是否展示下个楼盘
                    this.buildingAudit.isHaveNext = data.data.is_have_next === 0 ? false : true;
                    // 楼盘个数
                    this.buildingAudit.buildingNum = data.data.audit_total;
                    // 未审核个数
                    this.buildingAudit.unAuditNum = data.data.audit_not;
                    // 部分审核个数
                    this.buildingAudit.someAuditNum = data.data.audit_part;
                    // 全部审核个数
                    this.buildingAudit.allAuditNum = data.data.audit_yes;
                    // 获取楼盘组Id
                    this.propertyGroupId = data.data.id;
                    // 竞对当前页楼盘图获取
                    this.competHouseArr = [];
                    if(data.data.img_data && data.data.img_data.length > 0) {
                        this.competHouseArr.push(...data.data.img_data);
                    }
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * 获取居理楼盘图片数据
         * @param {object} searchArr 搜索条件
         */
        async getJulivePhotoInfo(searchArr) {
            let params = {};
            if (searchArr) {
                params = searchArr;
            }
            try {
                let result = await photoAuditApi.getJulivePhotoData(params);
                let { data } = result;
                if (data.code === 0) {
                    // 图片列表数据
                    this.julivePhotoData = data.data.img_data;
                    // 总条数
                    this.julivePageination.totalNum = data.data.total;
                    // 居理ID
                    this.juliveId = data.data.project_id;
                    // 居理楼盘当前页图片
                    this.JuliveHouseArr = [];
                    if (data.data.img_data && data.data.img_data.length > 0) {
                        this.JuliveHouseArr.push(...data.data.img_data);
                    }
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * 点击图片打开预览
         * @param {string} imgurl 图片地址
         */
        openPhotoViewer(imgUrl) {
            this.urlList = [];
            this.urlList.push(imgUrl);
            this.PhotoIsShow = true;
        },
        /**
         * 点击model关闭预览
         * @param {boolean} val 关闭预览
         */
        closeViewer(val) {
            document.body.style.overflow = 'auto';
            this.PhotoIsShow = val;
        }
    }
}
</script>

<style lang="less" scoped>
.build-box {
    width: 100%;
    background: #ebebeb;
    .building-left-box {
        float: left;
        font-size: 14px;
        color: #666;
        padding: 10px;
        box-sizing: border-box;
        .font-box {
            margin: 10px 0 12px;
        }
    }
    .building-right-box {
        float: right;
        font-size: 14px; 
        padding: 10px;
        box-sizing: border-box;
        color: #666;
        .btn-box {
            margin: 10px 0;
        }
        .font-style {
            float: right;
            margin-right: 74px;
        }
    }
}
.photo-show-area {
    margin-top: 20px;
    display: flex;
    .competing-photo-area {
        width: 764px;
        .photo-continaer {
            margin-top: 30px;
            h3 {
                margin-bottom: 10px;
            }
            .img-box {
                li {
                    float: left;
                    position: relative;
                    margin-top: 20px;
                    .font-position {
                        position: absolute;
                        top: 20;
                        left: 0;
                        width: 20px;
                        height: 20px;
                        border-radius: 2px;
                        background: #92aef7;
                        color: #fff;
                        text-align: center;
                        z-index: 2;
                    }
                    .text-content {
                        margin-bottom: 10px;
                        color: #666;
                        span {                            
                            float:left;
                        }
                        .no-warp {
                            width: 150px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                    .audit-result {
                        margin-top: 10px;
                        /deep/ .el-button {
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
    }
    .julive-photo-area {
        flex: 1;
    }
    .no-photo-info {
        width: 100%;
        h2{
            text-align: center;
        }
    }
    .data-show-style {
        font-size: 14px;
        margin-top: 20px;
    }
    /deep/ .el-pagination {
        margin: 40px 0;
        text-align: center;
    }
}
.clear-float:after {
    display: block;
    clear:both;
    height:0;
    content: "";
    visibility: hidden;
    overflow:hidden;
    }
</style>