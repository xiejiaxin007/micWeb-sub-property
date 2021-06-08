import { axios } from '@/assets/js/http/axios';
// 城市下拉URL
const getDetailCityListApi = '/backend-api/select2/bank/get-city-dropdown-list';
// 获取公司账号URL
const getCompanyNumberApi = '/backend-api/select2/bank/get-account-name';
// 获取回款详情统计URL
// const getPayBackDetailAPi = '/backend-api/expand/ex-bank-flow/verify-count';
// 获取回款详情请求URL
const getPayBackDetailUrlAPi = '/backend-api/expand/ex-bank-flow/get-verify-count-url';


/**
 * 获取城市数据信息
 * @params [object] params参数
 * @params [string] params.type 是否是全部城市
 * @params [string] params.param 不搜全部城市
 * @return [Promise] promise对象
 */
const getDetailCityListData = (params) => axios.get(getDetailCityListApi, {params});

/**
 * 获取公司账号URL
 * @params [Object] 公司账号请求参数
 * @params [Object] params.$q 公司账号名称
 * @return [Promise] promise对象
 */
const getCompanyNumberData = (params) => axios.get(getCompanyNumberApi, {params});

/**
 * 获取回款统计详情信息
 * @params [string] url 请求的URL地址
 * @params [Object] params 搜索条件
 * @params [string] params.date 日期
 * @params [string] params.city_id 城市id
 * @return [Promise] promise对象
 */
const getPayBackDetailData = (url, params) => axios.get(url, {params});

/**
 * 获取回款统计详情请求Url
 * @return [Promise] promise对象
 */
const getPayBackDetailUrlData = () => axios.get(getPayBackDetailUrlAPi);

export default {
    getCompanyNumberData,
    getPayBackDetailData,
    getPayBackDetailUrlData,
    getDetailCityListData
}