import { axios, instance } from '@/assets/js/http/axios';
const addCopyApi = '/backend-api/project/bd-spider-config/copy-field-constant'; // 添加复制
const getBrandApi = '/backend-api/common/brand-developer'; // 获取居理品牌开发商列表
const getBrandEditApi =
    '/backend-api/project/bd-spider-config/brand-developer-map'; // 获取品牌开发商编辑页列表
const importSubwayApi = '/backend-api/subway/modify'; // 导入地铁信息
const saveApi =
    '/backend-api/project/bd-spider-config/save-brand-developer-map'; // 映射关系保存接口

/**
 * 其余信息配置添加复制
 * @param {string} fromCityId 老城市ID
 * @param {string} targetCityId 新城市ID
 * @return {Promise} promise对象
 */
export const addCopyData = (fromCityId, targetCityId) =>
    axios.get(addCopyApi, {
        params: { from_city_id: fromCityId, target_city_id: targetCityId }
    });

/**
 * 获取居理品牌开发商列表
 * @return {Promise} promise对象
 */
export const getBrandData = () => axios.get(getBrandApi);

/**
 * 获取品牌开发商编辑页列表
 * @return {Promise} promise对象
 */
export const getBrandEditData = () => axios.get(getBrandEditApi);

/**
 * 地铁导入新增或更新
 * @param {file} file 二进制文件
 * @return {Promise} promise对象
 */
export const importSubwayData = params =>
    instance.post(importSubwayApi, params);

/**
 * 映射关系保存
 * @param {Object} params 映射关系数据对象
 * @param {Array} params.brand_developer_map 品牌开发商映射关系数据数组
 * @param {Array} params.city_py_map 搜房城市拼音对应关系数据数组
 * @return {Promise} promise对象
 */
export const saveData = params => axios.post(saveApi, params);
