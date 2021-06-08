/*
 * @Name: 楼盘分级列表API
 * @Description: 楼盘分级列表API
 * @Author: xiebin
 * @Date: 2019-11-16
 */
import { axios } from '@/assets/js/http/axios';
// 城市下拉URL
const getProjectLevelCityListApi = '/backend-api/common/get-all-city-list';

// 任务列表，获取当前登录人业务接受城市
const getCityListApi = '/backend-api/select2/select2/get-business-citys';

// 楼盘名称URL
const getProjectNameListApi = '/backend-api/project/get-project-name-list';

// 获取执行者URL
const getExecutorListApi = '/backend-api/employee/get-employee-dropdown-list';
// 获取任务编辑页面任务执行人select2  修改版
const getEmployeeByCityRoleApi = '/backend-api/employee/get-employee-by-role-and-city';

// 获取任务状态URL
const getTaskStatusApi = '/backend-api/project/cj-qd-project-task/all-status';

// 获取列表数据URL
const getTaskListApi = '/backend-api/project/cj-qd-project-task/list';

// 维护楼盘任务列表提交任务接口
const submitTaskApi = '/backend-api/project/cj-qd-project-task/submit';

// 维护楼盘任务列表申请放弃任务接口
const applyAbandonmentTaskApi = '/backend-api/project/cj-qd-project-task/ask-for-cancel';

// 维护楼盘任务列表审核放弃任务通过接口
const auditAbandonmentTaskApi = '/backend-api/project/cj-qd-project-task/ask-for-cancel-pass';

// 维护楼盘任务列表审核放弃任务驳回接口
const auditAbandonmentTaskPassApi = '/backend-api/project/cj-qd-project-task/ask-for-cancel-reject';

// 新增任务提交接口
const createTaskInfoApi = '/backend-api/project/cj-qd-project-task/create';

// 新增任务编辑详情获取接口
const getEditDetailInfoApi = '/backend-api/project/cj-qd-project-task/detail';

// 编辑任务提交接口
const getEditDetailSubmitApi = '/backend-api/project/cj-qd-project-task/update';

// 获取任务审核记录接口
const getAuditLogApi = '/backend-api/project/qd-audit/get-audit-log';

/**
 * 获取城市数据信息
 * @param {object} params参数
 * @param {string} params.q 搜索的城市名
 * @return {Promise} promise对象
 */
const getProjectLevelCityListData = (params) => axios.get(getProjectLevelCityListApi, {params});
/**
 * 任务列表，获取当前登录人业务接受城市
 * @param {object} params参数
 * @param {string} params.q 搜索的城市名
 * @param {string} params.employee_id 员工id
 * @return {Promise} promise对象
 */
const getCityList = (params) => axios.get(getCityListApi, {params});

/**
 * 获取楼盘名称信息
 * @param {object} params参数
 * @param {string} params.q 搜索的楼盘名
 * @param {string} params.city_id 搜索的城市ID
 * @return {Promise} promise对象
 */
const getProjectNameListData = (params) => axios.get(getProjectNameListApi, {params});

/**
 * 获取执行者下拉列表
 * @param {object} params参数
 * @param {string} params.q 模糊搜索
 * @return {Promise} promise对象
 */
const getExecutorListData = (params) => axios.get(getExecutorListApi, {params});
/**
 * 获取执行者下拉列表——修改版
 * @param {object} params参数
 * @param {string} params.q 搜索条件
 * @param {string} params.city_id 城市ID多个用逗号分隔
 * @param {string} params.role  角色 默认不传拓展专员+项目专员+商务专员+集团拓展专员
 * @return {Promise} promise对象
 */
const getEmployeeByCityRole = (params) => axios.get(getEmployeeByCityRoleApi, {params});


/**
 * 维护楼盘任务列表提交任务接口
 * @param {object} params参数
 * @param {string} params.id 任务ID
 * @return {Promise} promise对象
 */
const submitTaskData = (params) => axios.post(submitTaskApi, params);

/**
 * 维护楼盘任务列表审核放弃任务通过接口
 * @param {object} params参数
 * @param {string} params.id 任务ID
 * @return {Promise} promise对象
 */
const auditAbandonmentTaskData = (params) => axios.post(auditAbandonmentTaskApi, params);

/**
 * 维护楼盘任务列表审核放弃任务驳回接口
 * @param {object} params参数
 * @param {string} params.id 任务ID
 * @param {string} params.remark 驳回原因
 * @return {Promise} promise对象
 */
const auditAbandonmentTaskPassData = (params) => axios.post(auditAbandonmentTaskPassApi, params);

/**
 * 维护楼盘任务列表申请放弃任务接口
 * @param {object} params参数
 * @param {string} params.id 任务ID
 * @return {Promise} promise对象
 */
const applyAbandonmentTaskData = (params) => axios.post(applyAbandonmentTaskApi, params);

/**
 * 获取任务列表数据
 * @param {object} params参数
 * @param {string} params.id 任务id
 * @param {string} params.city_id 楼盘城市ID
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.exec_employee_id 执行人id
 * @param {string} params.status 维护任务状态
 * @param {string} params.page 第几页
 * @return {Promise} promise对象
 */
const getTaskListData = (params) => axios.post(getTaskListApi, params);

/**
 * 新增任务提交
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.exec_employee_id 执行人id
 * @param {string} params.exec_end_datetime 执行截止时间
 * @return {Promise} promise对象
 */
const createTaskInfoData = (params) => axios.post(createTaskInfoApi, params);

/**
 * 编辑任务提交
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.exec_employee_id 执行人id
 * @param {string} params.exec_end_datetime 执行截止时间
 * @return {Promise} promise对象
 */
const getEditDetailSubmitData = (params) => axios.post(getEditDetailSubmitApi, params);

/**
 * 获取编辑楼盘任务详情接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.exec_employee_id 执行人id
 * @param {string} params.exec_end_datetime 执行截止时间
 * @return {Promise} promise对象
 */
const getEditDetailInfoData = (params) => axios.post(getEditDetailInfoApi, params);

/**
 * 获取楼盘任务状态
 * @return {Promise} promise对象
 */
const getTaskStatusData = () => axios.post(getTaskStatusApi);

/**
 * 获取任务审核记录接口
 * @param {object} params参数
 * @param {string} params.task_id 渠道任务id
 * @param {string} params.page_num 页码
 * @param {string} params.page_size 页长
 * @return {Promise} promise对象
 */
const getAuditLog = (params) => axios.get(getAuditLogApi, {params});

export default {
    auditAbandonmentTaskPassData,
    getProjectLevelCityListData,
    getCityList,
    applyAbandonmentTaskData,
    auditAbandonmentTaskData,
    getEditDetailSubmitData,
    getProjectNameListData,
    getEditDetailInfoData,
    getExecutorListData,
    getEmployeeByCityRole,
    createTaskInfoData,
    getTaskStatusData,
    getTaskListData,
    submitTaskData,
    getAuditLog
}