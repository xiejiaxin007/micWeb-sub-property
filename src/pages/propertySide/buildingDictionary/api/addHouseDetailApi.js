/*
 * @Name: 优惠折扣特价
 * @Description: 优惠折扣特价API
 * @Author: xiebin
 * @Date: 2019-12-19
 */
import { axios } from '@/assets/js/http/axios';

// 初始化接口信息Url
const initHouseDetailApi = '/backend-api/project/cj-house-type/get-house-type-page-info';

// 初始化接口信息Url
const getHouseTypeApi = '/backend-api/project/get-house-building-type-list';

// 保存信息Url
const saveInfoApi = '/backend-api/project/cj-house-type/save';

// 删除户型图片Url
const delHousePhotoApi = '/backend-api/project/cj-house-type/del-house-type-img';

// 敏感词校验Url
const checkSensitiveWordsApi = '/backend-api/common/check-keywords';


/**
 * 初始化接口信息
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.house_type_id 户型ID
 * @param {string} params.task_id 任务ID
 * @return {Promise} promise对象
 */
const initHouseDetailData = (params) => axios.get(initHouseDetailApi, {params});

/**
 * 初始化接口信息
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @return {Promise} promise对象
 */
const getHouseTypeData = (params) => axios.get(getHouseTypeApi, {params});

/**
 * 保存信息接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @return {Promise} promise对象
 */
const saveInfoData = (params) => axios.post(saveInfoApi, params);

/**
 * 删除户型图片接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.img_id 图片ID
 * @param {string} params.task_id 任务ID
 * @return {Promise} promise对象
 */
const delHousePhotoData = (params) => axios.get(delHousePhotoApi, {params});

/**
 * 敏感词校验接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.city_id 城市ID
 * @param {string} params.is_create_project 是否新增楼盘
 * @param {string} params.str 敏感词
 * @return {Promise} promise对象
 */
const checkSensitiveWordsData = (params) => axios.get(checkSensitiveWordsApi, {params});


export default {
    initHouseDetailData,
    getHouseTypeData,
    saveInfoData,
    delHousePhotoData,
    checkSensitiveWordsData
}