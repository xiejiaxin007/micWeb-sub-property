import { axios } from '@/assets/js/http/axios';
const getRateListApi = '/backend-api/expand/ex-target-rate/index'; // 获取费率数据列表信息
const getEditRateApi = '/backend-api/expand/ex-target-rate/edit'; // 编辑目标费率获取初始数据
const getSaveRateApi = '/backend-api/expand/ex-target-rate/edit'; // 编辑目标费率保存数据
// 获取季度下拉数据
const getQuarterListApi = '/backend-api/expand/ex-target-rate/init';
// 新增保存季度
const saveQuarterApi = '/backend-api/expand/ex-target-rate/add';

/**
 * 获取费率数据列表信息
 * @param {String} pageIndex 页码下表从0开始 非必填
 * @param {String} defaultPageSize 控制页面展示数据量
 * @param {String} city_id 城市ID
 * @param {String} business_datetime 季度
 * @return {Promise} promise对象
 */
const getRateListData = (params) => axios.get(getRateListApi, {params: params});

/**
 * 编辑目标费率获取初始数据
 * @param {String} city_id 城市ID
 * @param {String} business_datetime	季度
 * @return {Promise} promise对象
 */
const getEditRateData = params => axios.get(getEditRateApi, {params: params});

/**
 * 编辑目标费率保存数据
 * @param {Object} params 请求参数
 * @param {Array} params.list  配置数组
 * @param {string} params.list.id 业态配置ID
 * @param {string} params.list.rate 费率
 * @return {Promise} promise对象
 */
const getSaveRateData = params => axios.post(getSaveRateApi, params);

/**
 * 获取季度下拉数据
 * @param {Object} params 请求参数
 * @return {Promise} promise对象
 */
const getQuarterList = params => axios.post(getQuarterListApi, params);

/**
 * 保存季度数据
 * @param {Object} params 请求参数
 * @param {Object} business_datetime 季度
 * @return {Promise} promise对象
 */
const saveQuarter = params => axios.post(saveQuarterApi, params);




export default {
    getRateListData,
    getEditRateData,
    getSaveRateData,
    getQuarterList,
    saveQuarter
}
