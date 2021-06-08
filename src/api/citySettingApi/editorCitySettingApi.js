import { axios } from '@/assets/js/http/axios'

const getCitySettingApi =
  '/backend-api/project/bd-spider-config/get-config-detail' // 获取城市配置信息详情
const getHouseTagsApi = '/backend-api/common/project-tags' // 获取城居理楼盘标签
const getHouseTypeTagsApi = '/backend-api/common/house-type-tags' // 获取居理户型标签
const getCityListApi =
  '/backend-api/project/bd-spider-config/get-finish-city-config' // 获取已完成城市列表
const copyOriginCityApi =
  '/backend-api/project/bd-spider-config/copy-config-detail' // 粘贴到该城市
const saveCityInfoApi = '/backend-api/project/bd-spider-config/save' // 保存城市级配置信息

/**
 * 获取城市配置信息详情
 *
 * @param {string} city_id 城市ID
 * @return {Promise} promise对象
 */
export const getCitySettingData = city_id =>
  axios.get(getCitySettingApi, { params: { city_id } })

/**
 * 获取城居理楼盘标签
 * @return {Promise} promise对象
 */
export const getHouseTagsData = () => axios.get(getHouseTagsApi)

/**
 * 获取居理户型标签
 * @return {Promise} promise对象
 */
export const getHouseTypeTagsData = () => axios.get(getHouseTypeTagsApi)

/**
 * 获取已完成城市列表
 * @return {Promise} promise对象
 */
export const getCityListData = () => axios.get(getCityListApi)

/**
 * 获取已完成城市列表
 * @params {Object} params 城市所需参数
 * @return {Promise} promise对象
 */
export const copyOriginCityData = params =>
  axios.get(copyOriginCityApi, { params })

/**
 * 获取已完成城市列表
 * @params {Object} params 保存城市信息所需参数
 * @params {String} params.city_id 城市ID
 * @params {Array} params.district_map 区域映射关系参数
 * @params {Array} params.project_type_map 业态映射关系参数
 * @params {Array} params.ring_road_map 城市环线参数
 * @params {Array} params.project_tags_map 楼盘标签映射参数
 * @params {Array} params.house_tags_map 户型标签映射参数
 * @params {Obeject} params.spider_url 抓取城市URL参数
 * @params {String} params.is_inject_trade_area 是否灌入板块参数
 * @params {String} params.is_heating_city 是否供暖城市参数
 * @return {Promise} promise对象
 */
export const saveCityInfoData = params => axios.post(saveCityInfoApi, params)
