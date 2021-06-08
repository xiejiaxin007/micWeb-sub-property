/*
 * @Name: 楼栋详情/编辑页API
 * @Description: 楼栋详情/编辑页API
 * @Author: 贺伟
 * @Date: 2019-12-26
 */
import { axios } from '@/assets/js/http/axios';

// 证件楼栋下拉接口
const licenseBuildingApi = '/backend-api/project/qd-building/get-license-building';

// 获取楼栋信息接口
const buildingInfoApi = '/backend-api/project/cj-building-info/field-source-get-info';

// 删除楼栋接口
const delBuildingApi = '/backend-api/project/cj-project-field-belong-config/del-building';

// 楼栋信息保存接口
const saveBuildingInfoApi = '/backend-api/project/qd-building/save-detail';

/**
 * 获取证件楼栋下拉数据
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @return {Promise} promise对象
 */
const getLicenseBuildingList = (params) => axios.get(licenseBuildingApi, {params});

/**
 * 获取获取楼栋信息
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @param {String} params.task_id 任务id
 *  @param {String} params.building_id 楼栋id
 * @return {Promise} promise对象
 */
const getbuildingInfo = (params) => axios.get(buildingInfoApi, {params});

/**
 * 获取编辑楼盘任务详情接口
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id 渠道删除必填
 * @param {String} params.building_id 楼栋id
 * @param {String} params.task_id 任务id 渠道删除必填
 * @return {Promise} promise对象
 */
const delBuildingData = (params) => axios.get(delBuildingApi, {params});

/**
 * 保存放量详情数据
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id 渠道删除必填
 * @param {String} params.building_id 楼栋id
 * @param {String} params.task_id 任务id
 * @param {Object} params.belong_data 保存得数据对象
 * @return {Promise} promise对象
 */
const saveBuildingInfo = (params) => axios.post(saveBuildingInfoApi, params, {
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    getLicenseBuildingList,
    getbuildingInfo,
    delBuildingData,
    saveBuildingInfo
}