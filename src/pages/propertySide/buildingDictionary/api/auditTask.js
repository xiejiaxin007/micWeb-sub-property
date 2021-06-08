import { axios } from '@/assets/js/http/axios';

// 初始化审核页面
const getTaskInfoApi = '/backend-api/project/qd-audit/get-task-info';
// 驳回接口
const rejectAuditApi = '/backend-api/project/cj-qd-project-task/reject';
// 审核通过接口
const approveAuditApi = '/backend-api/project/cj-qd-project-task/save-pass';
// 查看审核页面
const getAuditResultApi = '/backend-api/project/qd-audit/get-audit-result';

/**
 * 初始化审核页面接口
 * @param {Object} params参数
 * @param {String} params.task_id 任务id
 * @return {Promise} promise对象
 */
const getTaskInfo = (params) => axios.get(getTaskInfoApi, {params});

/**
 * 审核任务驳回接口
 * @param {Object} params参数
 * @param {String} params.id 任务id
 * @param {String} params.remark 驳回理由
 * @return {Promise} promise对象
 */
const rejectAudit = (params) => axios.post(rejectAuditApi, params);

/**
 * 审核任务通过接口
 * @param {Object} params参数
 * @param {String} params.data 请求参数
 * @param {String} params.data.task_id 任务id
 * @param {String} params.data.project_id  楼盘id
 * @param {String} params.data.....  和初始化接口一样的数据
 * @return {Promise} promise对象
 */
const approveAudit = (params) => axios.post(approveAuditApi, params);

/**
 * 审核任务通过接口
 * @param {Object} params参数
 * @param {String} params.task_id 任务id
 * @return {Promise} promise对象
 */
const getAuditResult = (params) => axios.get(getAuditResultApi, {params});

export default {
    getTaskInfo,
    rejectAudit,
    approveAudit,
    getAuditResult
}