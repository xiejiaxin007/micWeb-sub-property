/**
 * @name: 楼盘侧自动维护api
 * @description: 楼盘侧自动维护api
 * @author: xiejiaxin
 * @date: 2020-09-16
 * @update xiejiaxin
 */
import { axios } from '@/assets/js/http/axios';
// 获取字段名称api
const getWordNameApi = '/backend-api/project/field-config/get-field-by-page-city';
// 获取高质量信息源api
const getQualityListApi = '/backend-api/common/get-source-list';
// 高质量信息源配置列表api
const getQualityTbListApi = '/backend-api/project/field-config/get-source-field-config-list';
// 高质量信息源配置编辑页面初始化接口，带上大数据返回的计算结果
const initSourceConfigApi = '/backend-api/project/field-config/edit-init';
// 保存高质量信息源配置
const saveSourceConfigApi = '/backend-api/project/field-config/edit';
// 城市字段配置启用禁用api
const updateStatusApi = '/backend-api/project/field-config/update-status';
// 导入高质量源配置api
const importSourceApi = '/backend-api/project/field-config/import-source-field-config';
// 导出自动维护数据
const exportAutoDataApi = '/backend-api/project/field-config/export-maintain-data';


/**
 * 高质量信息源配置列表
 * @param {Object} params 参数
 * @param {String} params.q 远程搜索参数
 */
const getQualityTbList = (params) => axios.get(getQualityTbListApi, {params});
/**
 * 高质量信息源下拉
 * @param {Object} params 参数
 * @param {String} params.q 远程搜索参数
 */
const getQualityList = (params) => axios.get(getQualityListApi, {params});
/**
 * 获取字段名称
 * @param {Object} params 参数
 * @param {String} params.page_id 页面ID
 * @param {String} params.city_id 城市ID
 * @param {String} params.field_config_id   编辑ID，编辑时需要
 */
const getWordName = (params) => axios.post(getWordNameApi, params);
/**
 * 高质量信息源配置编辑页面初始化接口
 * @param {Object} params 参数
 * @param {String} params.field_config_id 高质量源主键id
 */
const initSourceConfig = (params) => axios.get(initSourceConfigApi, {params});
/**
 * 保存高质量信息源配置
 * @param {Object} params 参数
 * @param {String} params.field_config_id   高质量源主键id   编辑保存才有
 * @param {String} params.city_id    城市id
 * @param {String} params.page_id    页面ID
 * @param {String} params.field_id   字段ID
 * @param {Array} params.   高质量信息源
 * @param {String} params.accuracy_threshold   	竞对准确率阀值
 * @param {String} params.baseline_value   	居理高质量源字段底线值
 * @param {String} params.field_scale   	居理高质量源字段占比
 * @param {String} params.field_baseline_value   高质量员匹配竞对字段底线值
 */
const saveSourceConfig = (params) => axios.post(saveSourceConfigApi, params);
/**
 * 城市字段配置启用禁用
 * @param {Object} params 参数
 * @param {String} params.id  配置id
 * @param {String} params.status    1启动 2禁用
 */
const updateStatus = (params) => axios.post(updateStatusApi, params);
/**
 * 导入高质量源配置
 * @param {Object} params 参数
 * @param {String} params.content  文件内容
 */
const importSource = (params) => axios.post(importSourceApi, params);
/**
 * 导出自动维护数据
 * @param {Object} params 参数
 * @param {String} params.date  导出数据的时间
 * @param {String} params.city_id  导出数据的城市范围
 */
const exportAutoData = (params) => axios.get(exportAutoDataApi, {params});

export default {
    getWordName,
    getQualityList,
    getQualityTbList,
    initSourceConfig,
    saveSourceConfig,
    updateStatus,
    importSource,
    exportAutoData
}