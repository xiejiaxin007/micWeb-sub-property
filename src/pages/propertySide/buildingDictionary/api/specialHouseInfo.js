/*
 * @Name: 优惠折扣特价
 * @Description: 优惠折扣特价API
 * @Author: xiebin
 * @Date: 2019-12-19
 */
import { axios } from '@/assets/js/http/axios';

// 删除特价房信息Url
const delSpecialHouseApi = '/backend-api/project/project-maintenance/del-special-house-by-id';

// 初始化接口信息Url
const initSpecialInfoApi = '/backend-api/project/project-maintenance/get-discount-page-info';

// 初始化接口信息Url
const saveSpecialHouseApi = '/backend-api/project/discount/save';
// 敏感词校验Url
const checkSensitiveWordsApi = '/backend-api/common/check-keywords';
// 特价房页面批量删除隐藏特价房API
const delHideSpecialHouseApi = '/backend-api/project/discount/del-hide-special-house';
// 判断优惠信息是否可编辑
const isEditApi = '/backend-api/project/discount/is-edit';

/**
 * 初始化接口信息
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @return {Promise} promise对象
 */
const delHideSpecialHouse = (params) => axios.post(delHideSpecialHouseApi, params);
/**
 * 获取城市数据信息
 * @param {object} params参数
 * @param {string} params.q 搜索的城市名
 * @return {Promise} promise对象
 */
const delSpecialHouseData = (params) => axios.get(delSpecialHouseApi, {params});

/**
 * 初始化接口信息
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @return {Promise} promise对象
 */
const initSpecialInfoData = (params) => axios.post(initSpecialInfoApi, params);

/**
 * 保存特价房信息
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @return {Promise} promise对象
 */
const saveSpecialHouseData = (params) => axios.post(saveSpecialHouseApi, params);

/**
 * 敏感词校验接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.city_id 城市ID
 * @param {string} params.is_create_project 是否新增楼盘  8.1这边没有新增的，是新增的=1，不是新增的=2
 * @param {string} params.str 敏感词
 * @return {Promise} promise对象
 */
const checkSensitiveWordsData = (params) => axios.get(checkSensitiveWordsApi, {params});
/**
 * 判断优惠信息是否可编辑
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @return {Promise} promise对象
 */
const isEdit = (params) => axios.get(isEditApi, {params});

export default {
    delSpecialHouseData,
    initSpecialInfoData,
    saveSpecialHouseData,
    checkSensitiveWordsData,
    delHideSpecialHouse,
    isEdit
}