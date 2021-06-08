<!--
    @file: 拓展维护楼盘任务列表
    @description: 拓展维护楼盘任务列表
    @author: xiebin
    @date: 2019-12-09
-->
<template>
  <div class="expand-list-box">
    <!--面包屑-->
    <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="bread-nav">
        <el-breadcrumb-item>
            <a href="/">首页</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>楼盘任务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content-box">
        <!-- 搜索表单 -->
        <div class="search-list-box">
            <el-form
            :inline="true"
            ref="searchForm"
            :model="expandFormLine">
                <el-form-item
                    label="任务ID:"
                    prop="taskIdVal">
                    <el-input
                        v-model="expandFormLine.taskIdVal"
                        placeholder="请输入任务ID">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="城市:"
                    prop="selCityVal">
                    <el-select
                        v-model="expandFormLine.selCityVal"
                        placeholder="请选择城市"
                        filterable
                        remote
                        :remote-method="getCitySelectList"
                        @focus="getCitySelectList('')"
                        @change="cityChangeList">
                        <el-option
                        v-for="item in expandFormLine.selCityOpations"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="目标楼盘:"
                    prop="selBuildingNameVal">
                    <el-select
                        v-model="expandFormLine.selBuildingNameVal"
                        placeholder="请选择目标楼盘"
                        filterable
                        remote
                        :remote-method="getProjectNameSelectList"
                        :loading="expandFormLine.searchLoading"
                        @focus="getCityProjectList">
                        <el-option
                        v-for="item in expandFormLine.selBuildingNameOpations"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="任务截止时间:"
                    prop="taskEndTime">
                    <el-date-picker
                        v-model="expandFormLine.taskEndTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="任务执行人:"
                    prop="executorVal">
                    <el-select
                        placeholder="请选择任务执行人"
                        filterable
                        clearable
                        v-model="expandFormLine.executorVal"
                        remote
                        @focus="getExecutorList('')"
                        :remote-method="getExecutorList">
                        <el-option
                        v-for="item in expandFormLine.executorOpations"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="任务状态:"
                    prop="taskStatusVal">
                    <el-select
                        v-model="expandFormLine.taskStatusVal"
                        placeholder="请选择任务状态"
                        filterable
                        clearable>
                        <el-option
                        v-for="item in expandFormLine.taskStatusOpations"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="btn-search-box">
                    <el-button @click="restFromVal('searchForm')">重置</el-button>
                    <el-button
                        type="primary"
                        @click="getSearchList(1)">
                        搜索
                    </el-button>
                </el-form-item>
            </el-form>
        </div>        
    </div>
    <!-- 任务表格 -->
    <div class="table-list-box">
        <div class="header-title clear-float-box">
            <p>共{{pageList.totalNum}}条数据,第{{pageList.startNum}}-{{pageList.endNum}}条数据</p>
            <el-button
                v-if="isShowAdd"
                type="primary"
                @click="jumpeditPage('addTask')">
                新增任务
            </el-button>
        </div>
        <el-table
            :data="expandTaskTable"
            border
            style="width: 100%">
            <el-table-column
                prop="id"
                align="center"
                label="任务ID">
            </el-table-column>
            <el-table-column
                prop="city_name"
                align="center"
                label="城市">
            </el-table-column>
            <el-table-column
                align="center"
                label="目标楼盘">
                <template slot-scope="scope">
                    {{scope.row.project_name}} {{scope.row.project_type_name === '' ? '' : '(' + scope.row.project_type_name +')'}}
                </template>
            </el-table-column>
            <el-table-column
                prop="exec_end_datetime"
                align="center"
                label="任务截止时间">
            </el-table-column>
            <el-table-column
                prop="employee_name"
                align="center"
                label="执行者">
                <template slot-scope="scope">
                    {{scope.row.employee_name}}-{{scope.row.job_number}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="任务更新人">
                <template slot-scope="scope">
                    {{scope.row.updator_employee_name}}-{{scope.row.updator_job_number}}
                </template>
            </el-table-column>
            <el-table-column
                prop="update_datetime"
                align="center"
                label="更新时间">
            </el-table-column>
            <el-table-column
                prop="status_name"
                align="center"
                label="执行状态">
            </el-table-column>
            <el-table-column
                align="center"
                width="265"
                label="操作">
                <template slot-scope="scope">
                    <template v-for="item in scope.row.opeation_btn">
                        <el-button
                            type="text"
                            :key="item.btn_idx"
                            @click="clickOperationBtn(item.btn_idx,scope)"
                            v-if="item.btn_idx!=='btn_1'&&item.is_show===1">
                            {{item.btn_text}}
                        </el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageList.pageSize"
            :hide-on-single-page="true"
            :total="pageList.totalNum"
            :current-page.sync="pageList.scurrentPage"
            @current-change="currentChange">
        </el-pagination>
    </div>
    <!-- 任务审核记录 -->
    <el-dialog
        class="dialog-box"
        title="任务审核记录"
        :visible.sync="examineListObj.examineListShow"
        width="800px"
        center>
        <div class="table-wrap-new">
            <el-table
                ref="tableFixedWrap"
                border
                :data="examineListObj.examineList"
                :highlight-current-row="true"
            >
                <el-table-column
                    min-width="100"
                    prop="create_datetime"
                    label="审核时间"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    min-width="80"
                    prop="name_and_job_number"
                    label="审核人"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    min-width="80"
                    prop="op_type_text"
                    label="审核结果"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    min-width="150"
                    prop="remark"
                    label="驳回理由"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover"
                            :content="scope.row.remark">
                            <span slot="reference" class="refuse-res">{{scope.row.remark}}</span>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    v-if="examineListObj.totalNum > 0"
                    background
                    :page-size="examineListObj.pageSize"
                    layout="prev, pager, next"
                    :current-page.sync="examineListObj.currentexamineListPage"
                    @current-change="getExamineListData"
                    :total="examineListObj.totalNum"
                >
                </el-pagination>
            </div>
        </div>
    </el-dialog>
    <!-- 审核任务放弃 -->
    <el-dialog
        class="dialog-box"
        title="审核任务放弃"
        :visible.sync="auditTaskdialog"
        :close-on-click-modal="false"
        width="520px"
        center>
        <p>申请理由：{{remark}}</p>
        <span
            slot="footer"
            class="dialog-footer">
            <el-button @click="rejectAudit">驳 回</el-button>
            <el-button
                type="primary"
                @click="submitReason">
                通 过
            </el-button>
        </span>
    </el-dialog>
    <!-- 驳回 审核任务放弃 -->
    <reject-dialog :title="rejectType === 1 ? '任务放弃申请' : '任务审核驳回'"
        :visible="rejectDialog"
        :maxLength="rejectType === 1 ? 200 : 300"
        :confirmBtn="rejectType === 1 ? '提交' : '确定'"
        :cancelBtn="rejectType === 1 ? '放弃' : '取消'"
        :label="rejectType === 1 ? '申请理由' : '驳回原因'"
        @close="rejectDialog = false"
        @confirm="handleConfirmReject"></reject-dialog>
</div>
</template>

<script>
import expandListApi from '@/api/buildingDictionary/expandTaskList';
import { RejectDialog } from '@/components';
export default {
    name: 'ExpandTaskList',
    data() {
        return {
            // 搜索表单
            expandFormLine: {
                // 任务ID
                taskIdVal: '',
                // 城市
                selCityVal: '',
                selCityOpations: [],
                // 目标楼盘
                selBuildingNameVal: '',
                selBuildingNameOpations: [],
                searchLoading: false,
                // 任务截止时间
                taskEndTime: '',
                // 执行者
                executorVal: '',
                executorOpations: [],
                // 任务状态
                taskStatusVal: '',
                taskStatusOpations: []
            },
            // 任务表格
            expandTaskTable: [],
            // 分页
            pageList: {
                totalNum: 0,
                pageSize: 20,
                scurrentPage: 1,
                startNum: 1,
                endNum: 20
            },
            // 审核任务放弃弹窗
            auditTaskdialog: false,
            // 审核任务放弃弹窗中的申请理由
            remark: '',
            // 申请任务放弃=1   审核任务放弃驳回操作=2
            rejectType: 1,
            // 审核任务记录
            examineListObj: {
                examineList: [],
                // 审核任务记录弹窗
                examineListShow: false,
                // 审核任务记录页码
                currentexamineListPage: 1,
                // 操作id
                operationId: '',
                // 每页的数据量
                pageSize: 10
            },
            // 是否展示新增任务按钮
            isShowAdd: true,
            // 驳回原因弹窗
            rejectDialog: false
        }
    },
    mounted() {
        if (this.$route.query.task_id) {
            this.expandFormLine.taskIdVal = this.$route.query.task_id;
        }
        // 获取任务状态下拉列表
        this.getTaskStatusSelData();
        // 初始化任务列表数据
        this.getSearchList(1);
    },
    components: {
        RejectDialog
    },
    methods: {
        /**
         * 点击操作按钮
         * @param {Object} type 按钮类型
         * @param {Object} scope 当前行的参数集合
         */
        clickOperationBtn(type, scope) {
            let routeData = {};
            switch (type) {
                // 修改任务
                case 'btn_2':
                    routeData = this.$router.resolve({
                        path: '/building/expandEditTask',
                        query: {
                            taskId: scope.row.id
                        }
                    });
                    window.open(routeData.href).opener = null;
                    break;
                // 查看任务详情
                case 'btn_3':
                    routeData = this.$router.resolve({
                        path: '/building/tabToggleList',
                        query: {
                            projectId: scope.row.project_id,
                            taskId: scope.row.id,
                            cityId: scope.row.city_id,
                            projectName: scope.row.project_name,
                            buildingType: scope.row.project_type_name === '' ? '' : '(' + scope.row.project_type_name + ')',
                            role: 'expand'
                        }
                    });
                    window.open(routeData.href).opener = null;
                    break;
                // 编辑任务详情
                case 'btn_4':
                    routeData = this.$router.resolve({
                        path: '/building/tabToggleList',
                        query: {
                            projectId: scope.row.project_id,
                            taskId: scope.row.id,
                            cityId: scope.row.city_id,
                            projectName: scope.row.project_name,
                            buildingType: scope.row.project_type_name === '' ? '' : '(' + scope.row.project_type_name + ')',
                            role: 'expand',
                            isEdit: '1'
                        }
                    })
                    window.open(routeData.href).opener = null;
                    break;
                // 提交任务
                case 'btn_5':
                    this.sunbmitTaskInfo(scope)
                    break;
                // 审核任务
                case 'btn_6':
                    routeData = this.$router.resolve({
                        path: '/building/expandAuditTaskDetail',
                        query: {
                            taskId: scope.row.id,
                            projectId: scope.row.project_id
                        }
                    })
                    window.open(routeData.href).opener = null;
                    break;
                // 申请任务放弃
                case 'btn_7':
                    this.rejectDialog = true;
                    this.taskIds = scope.row.id;
                    this.remark = scope.row.desert_remark || '';
                    this.rejectType = 1;
                    break;
                // 审核任务放弃
                case 'btn_8':
                    this.auditTaskdialog = true;
                    this.taskIds = scope.row.id;
                    this.remark = scope.row.desert_remark || '';
                    break;
                // 查看审核记录
                case 'btn_9':
                    this.examineListObj.examineListShow = true;
                    this.examineListObj.operationId = scope.row.id;
                    this.getExamineListData(1);
                    break;
                // 查看审核详情
                case 'btn_10':
                    routeData = this.$router.resolve({
                        path: '/building/showAuditTaskDetail',
                        query: {
                            taskId: scope.row.id,
                            projectId: scope.row.project_id
                        }
                    })
                    window.open(routeData.href).opener = null;
                    break;
            }
        },
        /**
         * 获取看审核任务记录
         * @param {Object} page 页码
         */
        async getExamineListData(page) {
            if (page) {
                this.examineListObj.currentexamineListPage = page;
            }
            let params = {
                task_id: this.examineListObj.operationId,
                page_num: this.examineListObj.currentexamineListPage,
                page_size: this.examineListObj.pageSize
            };
            try {
                const {data: {code, msg, data}} = await expandListApi.getAuditLog(params);
                if (code === 0) {
                    this.examineListObj.examineList = data.data;
                    this.examineListObj.totalNum = Number(data.total_num);
                } else {
                    this.$message(msg);
                }
            } catch (err) {
                console.log(err)
            }
        },
        // 搜索获取列表数据
        async getSearchList(pageVal) {
            let params = {
                id: this.expandFormLine.taskIdVal,
                city_id: this.expandFormLine.selCityVal,
                project_id: this.expandFormLine.selBuildingNameVal,
                exec_employee_id: this.expandFormLine.executorVal,
                exec_end_datetime_start: this.expandFormLine.taskEndTime[0],
                exec_end_datetime_end: this.expandFormLine.taskEndTime[1],
                status: this.expandFormLine.taskStatusVal,
                page: pageVal || ''
            };
            this.pageList.scurrentPage = pageVal;
            this.getTaskListData(params);
        },
        // 判断是否是从楼盘名称&位置页面跳进来的
        // isProjectNameAndPosition() {
        //     let queryData = this.$route.query;
        //     if (queryData.cityId && queryData.projectId) {
        //         this.expandFormLine.selCityVal = queryData.cityId;
        //         this.expandFormLine.selBuildingNameOpations.push({
        //             id: queryData.project_id,
        //             text: queryData.projectName
        //         })
        //         this.expandFormLine.selBuildingNameVal = queryData.projectId;
        //         this.getSearchList(1);
        //     } else {
        //         // 初始化任务列表数据
        //         this.getTaskListData();
        //     }
        // },
        /**
         * 初始化任务列表数据
         * @param {Object} parmas 搜索参数
         */
        async getTaskListData(params) {
            let result
            try {
                if (params) {
                    result = await expandListApi.getTaskListData(params);
                } else {
                    result = await expandListApi.getTaskListData();
                }
                let { data } = result;
                if (data.code === 0) {
                    this.expandTaskTable = data.data.list;
                    this.pageList.totalNum = Number(data.data.total);
                    this.isShowAdd = data.data.create_btn.is_show && data.data.create_btn.is_show === 1 ? true : false;
                }

                let pageVal = params ? params.page : 1;
                if (pageVal > 1) {
                    this.pageList.startNum = pageVal === 1 ? 1 : (pageVal - 1) * 20 + 1 ;
                    this.pageList.endNum = Math.ceil(this.pageList.totalNum / this.pageList.pageSize) === pageVal ? this.pageList.totalNum : pageVal * 20;
                } else {
                    this.pageList.startNum = 1;
                    this.pageList.endNum = this.pageList.totalNum > this.pageList.pageSize ? this.pageList.pageSize : this.pageList.totalNum;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * 维护楼盘任务列表提交任务接口
         * @param {object} 当前行的参数
         */
        async sunbmitTaskInfo(scope) {
            let params = {
                id: scope.row.id
            };
            try{
                let result = await expandListApi.submitTaskData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                    this.getSearchList(this.pageList.scurrentPage);
                } else if (data.code === 1012) {
                    this.$message({
                        type: 'error',
                        message: '您没有操作的权限！'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: data.msg
                    });
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * 维护楼盘任务列表申请放弃任务接口
         * @param {object} formName 表单ref
         */
        async applyAbandonmentTask(reason) {
            try{
                let params = {
                    id: this.taskIds,
                    remark: reason
                };
                let result = await expandListApi.applyAbandonmentTaskData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                    this.rejectDialog = false;
                    this.getSearchList(this.pageList.scurrentPage);
                } else {
                    this.$message({message: data.msg});
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * @description: 驳回弹窗确定按钮
         * @param {string} reason  驳回原因
         */
        handleConfirmReject(reason) {
            if (this.rejectType === 1) {
                // 申请任务放弃确定操作
                this.applyAbandonmentTask(reason);
            } else {
                // 任务审核驳回确定操作
                this.confirmReject(reason);
            }
        },
        // 驳回 审核任务放弃
        rejectAudit() {
            this.rejectDialog = true;
            this.rejectType = 2;
        },
        // 确定驳回
        async confirmReject(reason) {
            let params = {
                id: this.taskIds,
                remark: reason
            };
            try {
                let { data } = await expandListApi.auditAbandonmentTaskPassData(params);
                if (data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '驳回成功'
                    });
                    this.rejectDialog = false;
                    this.auditTaskdialog = false;
                    this.getSearchList(this.pageList.scurrentPage);
                } else {
                    this.$message({message: data.msg});
                }
            } catch (error) {
                console.log(error);
            }       
        },
        // 维护楼盘任务列表审核放弃任务通过
        async submitReason() {
            let params = {
                id: this.taskIds
            };
            try {
                let { data } = await expandListApi.auditAbandonmentTaskData(params);
                if (data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '提交通过'
                    });
                    this.auditTaskdialog = false;
                    this.getSearchList(this.pageList.scurrentPage);
                } else {
                    this.$message({message: data.msg});
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取任务状态下拉列表
        async getTaskStatusSelData() {
            let result = await expandListApi.getTaskStatusData();
            let { data } = result;
            if (data.code === 0) {
                this.expandFormLine.taskStatusOpations = data.data;
            }
        },
        // 获取城市下拉列表
        async getCitySelectList(query) {
            let params = {
                q: query
            };
            try {
                let result = await expandListApi.getCityList(params);
                let { data } = result;
                if (data.code === 0) {
                    this.expandFormLine.selCityOpations = data.data;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 当城市放生改变时
        cityChangeList() {
            this.expandFormLine.selBuildingNameVal = '';
            this.expandFormLine.selBuildingNameOpations = [];
        },
        // 获取楼盘名称列表
        async getProjectNameSelectList(query) {
            this.expandFormLine.searchLoading = true;
            let params = {
                q: query,
                city_id: this.expandFormLine.selCityVal > '0' ? this.expandFormLine.selCityVal : ''
            };
            try {
                let result = await expandListApi.getProjectNameListData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.expandFormLine.searchLoading = false;
                    this.expandFormLine.selBuildingNameOpations = data.data;
                } else {
                    this.expandFormLine.searchLoading = false;
                }
            }
            catch(error) {
                console.log(error);
                this.expandFormLine.searchLoading = false;
            }
        },
        // 获取焦点时获取楼盘
        getCityProjectList() {
            this.getProjectNameSelectList('')
        },
        // 远程获取执行者下拉
        async getExecutorList(query) {
            this.expandFormLine.searchLoading = true;
            let params = {
                q: query
            };
            try {
                let result = await expandListApi.getExecutorListData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.expandFormLine.executorOpations = data.data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * 切换分页
         * @param {number} changeVal 当前页面的值
         */
        currentChange(pageVal) {
            let params = {
                id: this.expandFormLine.taskIdVal,
                city_id: this.expandFormLine.selCityVal,
                project_id: this.expandFormLine.selBuildingNameVal,
                exec_employee_id: this.expandFormLine.executorVal,
                exec_end_datetime_start: this.expandFormLine.taskEndTime[0],
                exec_end_datetime_end: this.expandFormLine.taskEndTime[1],
                status: this.expandFormLine.taskStatusVal,
                page: pageVal
            };
            // 调取搜索表格信息接口
            this.getTaskListData(params);
        },
        /**
         * 跳转到编辑/新增页面
         * @param {string} type 点击的按钮类型
         * @param {Object} scope 当前行的参数集合
         */
        jumpeditPage(type, scope) {
            if (type === 'addTask') {
                this.$router.push({
                    path: '/building/expandEditTask'
                })
            }
        },
        /**
         * 重置表单
         * @param {string} formName form表单ref的值
         */
        restFromVal(formName) {
            this.$refs[formName].resetFields();
            this.pageList = {
                totalNum: 0,
                pageSize: 20,
                startNum: 1,
                endNum:20,
                scurrentPage: 1
            }
            this.getTaskListData();
        }
    }
}
</script>

<style lang="less" scoped>
.expand-list-box {
    padding: 10px 15px;
    box-sizing: border-box;
    .content-box, .table-list-box{
        margin-top: 30px;
        padding: 20px 15px;
        box-sizing: border-box;
        background-color: #fff;
        .search-list-box {
            /deep/ .el-form-item {
                margin-right: 30px;
            }
            /deep/ .el-range-input {
                background: #fff;
            }
            /deep/ .btn-search-box {
                display: block;
                text-align: center;
                /deep/ .el-button {
                    width: 100px;
                }
            }
        }
    }
    .table-list-box{
        margin-top: 20px;
        .header-title {
            margin-bottom: 15px;
            p {
                float: left;
                font-size: 14px;
                margin-top: 13px;
            }
            /deep/ .el-button {
                float: right;
                margin-right: 100px;
            }
        }
        /deep/ .el-pagination {
            text-align: center;
            margin-top: 30px;
        }
        .project-style {
            color: #409EFF;
            font-weight: bold;
            cursor: pointer;
        }
    }
    .dialog-box {
        /deep/ .el-textarea__inner {
            min-height: 150px !important;
        }
        .message-val {
            color: red;
        }
        .refuse-res {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        /deep/ .el-table th.gutter{ // 解决某些电脑缩放导致的表头错位
            display: table-cell!important;
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
.el-pagination {
    text-align: center;
}
</style>