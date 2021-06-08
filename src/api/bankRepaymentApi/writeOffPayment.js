import { axios } from '@/assets/js/http/axios';
// 财务审核驳回api
const financeRejectApi = '/backend-api/expand/ex-bank-flow/finance-reject';
// 释放撤回Api
const releaseRecallApi = '/backend-api/expand/ex-bank-flow/release-recall';



/**
 * 财务审核驳回
 * @param {object} params 对象参数
 * @param {Array} params.list 数据列表对象数组
 * @param {String} params.reason 驳回原因,释放理由
 * @param {String} params.id 流水id
 * @return {Object<promis>} promise对象
 */
const updateRejectData = (params) => axios.post(financeRejectApi, params);

/**
 * 释放撤回
 * @param {String} id 对象参数
 * @param {Array} list 数据列表对象数组
 * @return {Object<promis>} promise对象
 */
const updateReleaseRecallData = (id, list) => axios.post(releaseRecallApi, {id, list});


export default {
    updateRejectData,
    updateReleaseRecallData
}