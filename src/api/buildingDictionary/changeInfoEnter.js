/**
 * @name: 变更信息录入APi
 * @description: 变更信息录入页面api
 * @author: 贺伟
 * @date: 2019-11-16
 */
import { axios } from '@/assets/js/http/axios';


// 获取楼盘基本信息接口
const getProjectBaseInfoApi = '/backend-api/project/get-project-info';

// 获取楼盘通用配置信息接口
const getProjectConfigApi = '/backend-api/common/get-project-config';

// 获取关联楼栋接口
const getProjectBuildingListApi = '/backend-api/project/get-project-building-list';

// 获取关联户型接口
const getRelatedHouseTypeListApi = '/backend-api/project/get-project-house-type-list';

// 提交表单信息接口
const saveFormInfoApi = '/backend-api/project/cj-project-change-notify/create';


/**
 * 获取楼盘基本信息
 * @param {String} id 楼盘id
 * @param {String} isInfo   have_default_notify_content  是否有默认通知内容（1是2否）
 */
const getProjectBaseInfoData = (id, isInfo) => axios.get(getProjectBaseInfoApi, {params: {project_id: id, have_default_notify_content: isInfo}})

/**
 * 获取楼盘通用配置信息
 * 类型:type 1楼盘/户型/分期销售状态 2是否合作 3放量计划类型 4产权年限 5建设阶段类型 6单价类型 7总价类型 8户型居室 9房屋朝向 10户型标签
 * 11装修情况 12环线情况 13区域板块 14交房时间类型 15审核反馈内容类型 16审核反馈内容结果 17 楼盘组审核状态 18 图片审核状态 19 图片类型
 * 20 数据源类型 21 是否合作楼盘
 * @param {Object} options 参数对象
 * @param {Array} options.type 当前配置的类型
 * @param {String} options.city_id 搜索的城市ID
 * @return [Promise] promise对象
 */
const getProjectConfigData = (options) => axios.post(getProjectConfigApi, options);

/**
 * 获取关联楼栋信息
 * @param {Object} params 参数对象
 * @param {string} params.project_id 楼盘ID
 * @return {promises} promise对象
 */
const getProjectBuildingListdata = (params) => axios.get(getProjectBuildingListApi, {params});

/**
 * 获取关联户型信息
 * @param {String} id 楼盘id
 */
const getRelatedHouseTypeData = (id) => axios.get(getRelatedHouseTypeListApi, {params: {project_id: id}});

/**
 * 提交表单信息
 * @param {Array} params 提交的表单信息参数
 */
const saveFormInfoData = (params) => axios.post(saveFormInfoApi, params);

export default {
    getProjectBaseInfoData,
    getProjectConfigData,
    getProjectBuildingListdata,
    getRelatedHouseTypeData,
    saveFormInfoData
}