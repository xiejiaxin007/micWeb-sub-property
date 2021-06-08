import { axios } from '@/assets/js/http/axios';
// 获取银行流水信息URL/保存银行流水信息URL
const getBankFlowApi = '/backend-api/expand/ex-bank-flow/edit';
// 获取公司账号URL
const getCompanyNumberApi = '/backend-api/select2/bank/get-account-number';
// 获取公司名称URL
const getCompanyNameApi = '/backend-api/select2/bank/get-company-name';

/**
 * 获取银行流水信息
 * @Params [object] params 参数对象
 * @Params [string] params.flowId 流水ID
 * @return [Promise] promise对象
 */
const getBankFlowData = (params) => axios.get(getBankFlowApi, {params});

/**
 * 获取银行流水信息
 * @Params [object] params 参数对象
 * @Params [string] params.flowId 流水ID
 * @return [Promise] promise对象
 */
const saveBankFlowData = (params) => axios.post(getBankFlowApi, params);

/**
 * 获取公司账号信息
 * @params [object] 公司账号请求参数
 * @params [string] params.$q 公司账号名称
 * @return [Promise] promise对象
 */
const getCompanyNumberData = (params) => axios.get(getCompanyNumberApi, {params});

/**
 * 获取公司名称信息
 * @params [object] 公司账号请求参数
 * @params [string] params.$q 公司账号名称
 * @return [Promise] promise对象
 */
const getCompanyNameData = (params) => axios.get(getCompanyNameApi, {params});

export default {
    getBankFlowData,
    getCompanyNumberData,
    saveBankFlowData,
    getCompanyNameData
}