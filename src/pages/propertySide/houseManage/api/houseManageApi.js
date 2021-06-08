import {axios} from '@/assets/js/http/axios'

// 获取土地信息和成交数据城市下拉api
const landCityUrl = '/backend-api/bd-creis/city-list';
// 中指数据登录api
const creisLoginUrl = '/backend-api/bd-creis/login';
// 获取最近一次抓取日志api
const crawlLogUrl = '/backend-api/bd-creis/get-log';
// 获取中指登录的二维码api
const getQrCodeApi = '/backend-api/bd-creis/get-login-img';
// 获取中指登录状态api
const getLoginStatusApi = '/backend-api/bd-creis/get-login-status';


// 获取城市信息接口，参数type 城市类型（1.地块城市下拉， 2.成交数据城市下拉）
const getLandCity = (type) => axios.get(landCityUrl, {params: {type}});

// 中指数据登录接口 参数options:{land_city_ids,deal_city_ids,username,password}四个参数
const loginCreis = (options) => axios.post(creisLoginUrl, options);

// 获取爬取日志 参数logId为log id
const getCrawlLog = (logId) => axios.get(crawlLogUrl, {params: {id: logId}});

/**
 * 获取中指登录的二维码
 * @param {Object} params 参数
 * @param {string} params.land_city_ids	土地城市
 * @param {string} params.deal_city_ids 成交城市
 * @return {Promise}
 */
const getQrCode = (params) => axios.post(getQrCodeApi, params);

/**
 * 获取中指登录状态
 * @param {Object} params 参数
 * @param {string} params.key 获取二维码的时候返回的key
 * @return {Promise}
 */
const getLoginStatus = (params) => axios.get(getLoginStatusApi, {params});

export default {
    getLandCity,
    loginCreis,
    getCrawlLog,
    getQrCode,
    getLoginStatus
}

