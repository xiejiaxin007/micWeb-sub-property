import { axios } from '@/assets/js/http/axios';

// 获取地理城市接口
const getMultiCityApi = '/backend-api/project/multi-city-manage/get-geo-city';
// 获取经营城市接口
const getOperaCityApi = '/backend-api/common/all-city-list';
// 获取列表页地理城市和经营城市对应关系接口
const getCityTableApi = '/backend-api/project/multi-city-manage/get-city-map';
// 城市关系删除接口
const deleteSelIptApi = '/backend-api/project/multi-city-manage/del-city-map';
// 城市关系保存接口
const saveTableInfoApi = '/backend-api/project/multi-city-manage/save';

/**
 * 获取地理城市接口数据
 *
 * @param {string} city_name 城市名
 * @return {Promise} promise对象
 */
const getMultiCityData = city_name => axios.get(getMultiCityApi, { params: { city_name } });

/**
 * 获取经营城市接口数据
 *
 * @param {string} city_name 城市名
 * @return {Promise} promise对象
 */
const getOperaCityData = q => axios.get(getOperaCityApi, { params: { q } });

/**
 * 获取列表页地理城市和经营城市对应关系
 *
 * @param {string} cj_district_sub_id 地理城市ID
 * @param {string} cj_district_id 经营城市ID
 * @return {Promise} promise对象
 */
const getCityTableData = (cj_district_sub_id, cj_district_id, page_num, page_size) => axios.get(getCityTableApi, { params: { cj_district_sub_id, cj_district_id, page_num, page_size } });

/**
 * 城市关系删除
 *
 * @param {string} relation_id 城市关系id
 * @return {Promise} promise对象
 */
const deleteSelIptData = relation_id => axios.get(deleteSelIptApi, { params: { relation_id } });
/**
 * 城市关系保存
 *
 * @param {array} params 城市关系数据
 * @return {Promise} promise对象
 */
const saveTableInfoData = params => axios.post(saveTableInfoApi, params);

export default {
    getMultiCityData,
    getOperaCityData,
    getCityTableData,
    deleteSelIptData,
    saveTableInfoData
}