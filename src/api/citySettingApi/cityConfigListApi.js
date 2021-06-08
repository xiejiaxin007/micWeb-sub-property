import { axios } from '@/assets/js/http/axios';
const getConfigListApi = '/backend-api/project/bd-spider-config/city-config'; // 获取数据列表信息
const getSoureListApi = '/backend-api/common/source-list'; // 获取竟对源列表信息
const tapConfimBtnApi = '/backend-api/project/bd-spider-config/batch-inject'; // 批量灌入提交表单
const cityUrl = '/backend-api/common/get-all-city-list'; // 获取城市下拉列表（不区分运营城市）

/**
 * 获取城市数据列表信息
 * @param {String} page 页码
 * @param {String} cityId 城市ID
 * @return {Promise} promise对象
 */
export const getConfigListData = (page, cityId) =>
    axios.get(getConfigListApi, { params: { page, city_id: cityId } });

/**
 * 获取竟对源列表信息
 * @return {Promise} promise对象
 */
export const getSoureListData = () => axios.get(getSoureListApi);

/**
 * 批量灌入提交表单
 * @param {String} cityId 城市ID
 * @param {String} source 源
 * @return {Promise} promise对象
 */
export const tapConfimBtnData = (cityId, source) =>
    axios.get(tapConfimBtnApi, { params: { city_id: cityId, source } });

/**
 * 获取城市下拉选项（不区分运营城市）
 * @param {string} type 城市类型(为空则传全部城市)
 * @return {Promise} promise对象
 */
export const getCity = type =>
    axios.get(cityUrl, { params: { city_type: type } });
