/*
 * @Name: 放量&交房页面api
 * @Description: 放量&交房页面主api文件
 * @Author: 贺伟
 * @Date: 2019-12-28
 */
import { axios } from '@/assets/js/http/axios';

// 放量和交房初始化数据获取接口
const capacityHandRoomInfoApi = '/backend-api/project/cj-project-volume-living/get-info';

// 放量删除接口
const deleteVolumeApi = '/backend-api/project/cj-project-volume-living/delete-volume';

// 分期删除
const delectStageingApi = '/backend-api/project/cj-project-volume-living/delete-staging';

// 交房时间删除接口
const delectHandroomApi = '/backend-api/project/cj-project-volume-living/delete-living';

// 建设阶段删除接口
const delectConstructApi = '/backend-api/project/cj-project-volume-living/delete-construction-phase';

// 放量交房保存接口
const saveCapacityHandroomApi = '/backend-api/project/cj-project-volume-living/save-info';

/**
 * 放量和交房初始化数据获取
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @param {String} params.task_id 任务id
 * @return {Promise} promise对象
 */
const getCapacityHandRoomInfo = (params) => axios.get(capacityHandRoomInfoApi, {params});

/**
 * 根据id删除放量计划数据
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @param {String} params.id 放量id
 * @param {String} params.task_id 任务id
 * @return {Promise} promise对象
 */
const deleteVolumeInfoById = (params) => axios.post(deleteVolumeApi, params);

/**
 * 根据id删除分期情况数据
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @param {String} params.id 放量id
 * @param {String} params.task_id 任务id
 * @return {Promise} promise对象
 */
const delectStageingInfoById = (params) => axios.post(delectStageingApi, params);

/**
 * 根据id删除交房时间数据
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @param {String} params.live_id 交房id
 * @param {String} params.task_id 任务id
 * @return {Promise} promise对象
 */
const delectHandroomInfoById = (params) => axios.post(delectHandroomApi, params);

/**
 * 根据id删除建设阶段数据
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @param {String} params.construction_phase_id 建设阶段id
 * @param {String} params.task_id 任务id
 * @return {Promise} promise对象
 */
const delectConstructInfoById = (params) => axios.post(delectConstructApi, params);

/**
 * 保存放量详情数据
 * @param {Object} params.data 参数 json串
 * @param {String} params.data.project_id 楼盘id
 * @param {Object} params.data.data 保存的数据对象
 * @param {String} params.data.task_id 任务id
 * @return {Promise} promise对象
 */
const saveCapacityHandroomInfo = (params) => axios.post(saveCapacityHandroomApi, params);

export default {
    getCapacityHandRoomInfo,
    deleteVolumeInfoById,
    saveCapacityHandroomInfo,
    delectStageingInfoById,
    delectHandroomInfoById,
    delectConstructInfoById
}