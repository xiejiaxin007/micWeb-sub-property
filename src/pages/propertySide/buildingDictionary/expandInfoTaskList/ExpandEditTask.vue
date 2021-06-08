<!--
    @file: 拓展维护楼盘新增任务
    @description: 拓展维护楼盘新增任务
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
            <el-breadcrumb-item :to="{path: '/building/ExpandTaskList'}">楼盘任务列表</el-breadcrumb-item>
            <el-breadcrumb-item>{{pageTitleCon}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content-box">
            <h2>{{pageTitleCon}}</h2>
            <el-form
                :model="expandFormLine"
                label-width="120px"
                :rules="rules"
                ref="rulesForm">
                <el-form-item
                    label="城市:"
                    prop="selCityVal">
                    <el-select
                        v-model="expandFormLine.selCityVal"
                        placeholder="请选择城市"
                        filterable
                        remote
                        :remote-method="getCitySelectList"
                        :disabled="expandFormLine.isCityDisabled"
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
                    prop="selBuildingNameVal"
                    ref="buildName">
                    <el-select
                        v-model="expandFormLine.selBuildingNameVal"
                        placeholder="请选择目标楼盘"
                        filterable
                        remote
                        :remote-method="getProjectNameSelectList"
                        @focus="getProjectNameSelectList('')"
                        :loading="expandFormLine.searchLoading"
                        :disabled="expandFormLine.isDisabled">
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
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择日期"
                        :picker-options="expireTimeOption">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="任务执行人:"
                    prop="executorVal"
                    ref="executorName">
                    <el-select
                        v-model="expandFormLine.executorVal"
                        placeholder="请选择任务执行人"
                        filterable
                        clearable
                        remote
                        :remote-method="getExecutorList"
                        @focus="getExecutorList('')"
                        :disabled="expandFormLine.isExecutorValDisabled">
                        <el-option
                        v-for="item in expandFormLine.executorOpations"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="btn-search-box">
                    <el-button @click="cancelList">取 消</el-button>
                    <el-button
                        v-if="$route.query.taskId"
                        type="primary"
                        @click="submitEditForm('rulesForm')">
                        提 交
                    </el-button>
                    <el-button
                        v-else
                        type="primary"
                        @click="submitForm('rulesForm')">
                        提 交
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import expandListApi from '@/api/buildingDictionary/expandTaskList';
export default {
    name: 'ExpandEditTask',
    data() {
        return {
            // 搜索表单
            expandFormLine: {
                // 城市id
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
                // 是否禁用
                isCityDisabled: true,
                isDisabled: true,
                isExecutorValDisabled: true
            },
            rules: {
                selCityVal: [
                    { required: true, message: '请选择城市', trigger: 'change' }
                ],
                selBuildingNameVal: [
                    { required: true, message: '请选择目标楼盘', trigger: 'change' }
                ],
                taskEndTime: [
                    { required: true, message: '请选择任务截止时间', trigger: 'change' }
                ],
                executorVal: [
                    { required: true, message: '请选择任务执行人', trigger: 'change' }
                ],
            },
            expireTimeOption: {
                disabledDate(date) {
                    //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
                    return date.getTime() < Date.now();
				}
            },
            // 页面标题内容
            pageTitleCon: ''
        }
    },
    mounted() {
        // 是否是编辑页
        this.isEditTask()
    },
    methods: {
        /**
         * 获取编辑详情
         * @param {string} taskId 任务ID
         */
        async getEditDetail(taskId) {
            try {
                let params = {
                    id: taskId
                }
                let result = await expandListApi.getEditDetailInfoData(params);
                let { data } = result;
                if (data.code === 0) {
                    // 楼盘名称赋值
                    this.expandFormLine.selBuildingNameOpations.push(
                        {
                            id: data.data.project_id,
                            text: data.data.project_name + '(' + data.data.project_type_name + ')'
                        }
                    )
                    this.expandFormLine.selBuildingNameVal = data.data.project_id;
                    // 任务截止时间
                    this.expandFormLine.taskEndTime = data.data.exec_end_datetime;
                    // 给执行者赋值
                    this.expandFormLine.executorOpations.push(
                        {
                            id: data.data.exec_employee_id,
                            text: data.data.employee_name + '-' + data.data.job_number
                        }
                    )
                    this.expandFormLine.executorVal = data.data.exec_employee_id;
                    // 获取城市id
                    this.expandFormLine.selCityVal = data.data.city_id;
                    this.expandFormLine.selCityOpations.push(
                        {
                            id: data.data.city_id,
                            text: data.data.city_name
                        }
                    )
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /** 
         * 新增提交任务
         * @param {String} formName 表单名称
         */
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let params = {
                        city_id: this.expandFormLine.selCityVal,
                        project_id: this.expandFormLine.selBuildingNameVal,
                        exec_employee_id: this.expandFormLine.executorVal,
                        exec_end_datetime: this.expandFormLine.taskEndTime
                    };
                    try {
                        let result = await expandListApi.createTaskInfoData(params);
                        let { data } = result;
                        if (data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '提交成功'
                            });
                            this.$router.push({
                                path: '/building/expandTaskList'
                            })
                        } else if (data.code === 1006) {
                            this.$confirm(data.msg, '温馨提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                                }).then(() => {
                                }).catch(() => {});
                        } else {
                            this.$message({message: data.msg});
                        }  
                    }
                    catch(error) {
                        console.log(error);
                    }
                } else {
                    return false;
                }
            })
        },
        // 当城市放生改变时
        cityChangeList() {
            if (this.pageTitleCon == '新增') {
                this.expandFormLine.isDisabled = false;
                this.expandFormLine.isExecutorValDisabled = false;
                this.$refs.buildName.resetField();
                this.$refs.executorName.resetField();
            }
        },
        // 获取城市下拉列表
        async getCitySelectList(query) {
            let params = {
                q: query
            };
            try{
                let result = await expandListApi.getCityList(params);
                let { data } = result;
                if (data.code === 0) {
                    this.expandFormLine.selCityOpations = data.data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /** 
         * 编辑提交任务
         * @param {String} formName 表单名称
         */
        submitEditForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let params = {
                        city_id: this.expandFormLine.selCityVal,
                        id: this.$route.query.taskId,
                        project_id: this.expandFormLine.selBuildingNameVal,
                        exec_employee_id: this.expandFormLine.executorVal,
                        exec_end_datetime: this.expandFormLine.taskEndTime
                    };
                    try {
                        let result = await expandListApi.getEditDetailSubmitData(params);
                        let { data } = result;
                        if (data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '提交成功'
                            });
                            this.$router.push({
                                path: '/building/expandTaskList'
                            })
                        } else if (data.code === 1006) {
                            this.$message({
                                type: 'warning',
                                message: data.msg
                            });
                            this.$confirm(data.msg, '温馨提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                                }).then(() => {
                                    
                                }).catch(() => {
                                           
                            });
                        } else {
                            this.$message({message: data.msg});
                        }
                    }
                    catch(error) {
                        console.log(error);
                    }
                } else {
                    return false;
                }
            })
        },
        /** 
         * 获取楼盘名称列表
         * @param {String} query 搜索的名称
         */
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
        // 远程获取执行者下拉
        async getExecutorList(query) {
            this.expandFormLine.searchLoading = true;
            let params = {
                q: query,
                city_id: this.expandFormLine.selCityVal
            };
            try {
                let result = await expandListApi.getEmployeeByCityRole(params);
                let { data } = result;
                if (data.code === 0) {
                    this.expandFormLine.executorOpations = data.data;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 返回列表
        cancelList() {
            this.$router.push({
                path: '/building/expandTaskList'
            })
        },
        // 判断新增还是编辑
        isEditTask() {
            let status = this.$route.query;
            if (status.taskId) {
                this.pageTitleCon = '编辑';
                this.getEditDetail(status.taskId);
                this.expandFormLine.isExecutorValDisabled = false;
                // 编辑时城市禁用
                this.expandFormLine.isCityDisabled = true;
            } else {
                this.pageTitleCon = '新增';
                this.expandFormLine.isExecutorValDisabled = true;
                // 新增时城市不禁用
                this.expandFormLine.isCityDisabled = false;
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .expand-list-box {
        padding: 10px 15px;
        box-sizing: border-box;
        .content-box {
            margin-top: 30px;
            padding: 20px 15px;
            box-sizing: border-box;
            background-color: #fff;
            /deep/ .el-range-input {
                background: #fff;
            }
            /deep/ .el-select {
                width: 23%;
            }
            /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
                width: 23%;
            }
            /deep/ .btn-search-box {
                display: block;
                margin-top: 30px;
                /deep/ .el-button {
                    width: 100px;
                }
            }
            h2 {
                margin-bottom: 20px;
            }
        }
    }
</style>