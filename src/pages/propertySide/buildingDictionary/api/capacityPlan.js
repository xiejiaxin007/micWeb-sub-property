/*
 * @Name: 放量计划详情页API
 * @Description: 放量计划详情页API
 * @Author: 贺伟
 * @Date: 2019-12-21
 */
import { axios } from '@/assets/js/http/axios';

// 获取放量详情接口
const getCapacityInfoApi = '/backend-api/project/project-volume/get-info';


// 放量详情保存接口
const saveCapacityInfoApi = '/backend-api/project/project-volume/save-info';

/**
 * 获取放量详情数据
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @param {String} params.task_id 任务id
 * @param {String} params.volume_id 放量id
 * @return {Promise} promise对象
 */
const getCapacityInfo = (params) => axios.get(getCapacityInfoApi, {params});



/**
 * 保存放量详情数据
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id 渠道删除必填
 * @param {String} params.volume_detail 保存的数据对象
 * @param {String} params.task_id 任务id 渠道删除必填is_check_volume
 * @return {Promise} promise对象
 */
const saveCapacityInfo = (params) => axios.post(saveCapacityInfoApi, params);

export default {
    getCapacityInfo,
    saveCapacityInfo
}