/**
 * @name: 楼盘测公共接口
 * @description: 楼盘测公共接口文件
 * @author: 贺伟
 * @date: 2019-12-10
 */
import { axios } from '@/assets/js/http/axios';

// 获取楼盘通用配置信息接口
const getProjectConfigApi = '/backend-api/common/get-project-config';

// 城市下拉URL
const getCityListApi = '/backend-api/common/get-city-list';

// 获取楼盘下拉列表接口·
const getProjectListApi = '/backend-api/common/get-project-list';


/**
 * 获取楼盘通用配置信息
 * 类型:type 1楼盘/户型/分期销售状态 2是否合作 3放量计划类型 4产权年限 5建设阶段类型 6单价类型 7总价类型 8户型居室 9房屋朝向 10户型标签
 * 11装修情况 12环线情况 13区域板块 14交房时间类型 15审核反馈内容类型 16审核反馈内容结果 17 楼盘组审核状态 18 图片审核状态 19 图片类型
 * 20 数据源类型 21 是否合作楼盘  30户型是否显示下拉（显示，隐藏）31楼盘是否显示下拉  32获取来源列表 34 复制户型功能字段配置
 * @param {Object} options 参数对象
 * @param {Array} options.type 当前配置的类型
 * @param {String} options.city_id 搜索的城市ID
 * @return {Promise} promise对象
 */
const getProjectConfigData = (options) => axios.post(getProjectConfigApi, options);

/**
 * 获取城市数据信息
 * @param {object} params 参数
 * @param {string} params.type 类型 1表示有全国选项
 * @param {string} params.q 城市名称
 * @return {Promise} promise对象
 */
const getCityListData = (params) => axios.get(getCityListApi, {params});

/**
 * 获取楼盘下拉列表
 * @param {object} params 参数
 * @param {string} params.city_id 城市ID
 * @param {string} params.search_alias 是否搜索别名，默认为false
 * @param {string} params.q 楼盘·名称
 * @return {Promise} promise对象
 */
const getProjectListData = (params) => axios.get(getProjectListApi, {params});

export default {
    getProjectConfigData,
    getCityListData,
    getProjectListData
}