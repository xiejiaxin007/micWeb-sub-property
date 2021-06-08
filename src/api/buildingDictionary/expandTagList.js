/**
 * @name: tab切换列表APi
 * @description: tab切换列表APi
 * @author: 解彬
 * @date: 2019-12-11
 */
import { axios } from '@/assets/js/http/axios';


// 获取页面权限列表Url
const getPageAuthListApi = '/backend-api/project/cj-project-field-belong-config/get-page-list';

// 获取区域列表Url
const getDistrictListApi = '/backend-api/common/get-district-list';

// 获取楼盘名称&位置页面数据url
const getProjectNameAndPositionApi = '/backend-api/project/cj-project-field-belong-config/get-project-location-page-info';

// 动销信息页面数据获取url
const dynamicSaleInfoApi = '/backend-api/project/dynamic-sales/get-info';

// 获取户型建筑类型URL
const houseTypesApi = '/backend-api/project/get-house-building-type-list';

// 获取楼盘业态URl
const projectTypesApi = '/backend-api/common/get-project-type-list';

// 保存楼盘名称&位置信息Url
const saveProjectNamePageInfoApi = '/backend-api/project/cj-project-field-belong-config/save-project-location-page-info';
// 获取户型下拉接口
const houseTypeListApi = '/backend-api/project/get-house-type-list';

// 复制户型保存接口
const copyHouseTypeSaveApi = '/backend-api/project/cj-house-type/copy-house-type';

// 删除户型接口
const delHouseTypeApi = '/backend-api/project/dynamic-sales/del-house-type';

// 删除楼栋接口
const delBuildingApi = '/backend-api/project/cj-project-field-belong-config/del-building';

// 保存动销信息接口
const saveDynamicInfoApi = '/backend-api/project/dynamic-sales/save';

// 导入楼栋接口
const importBuildInfoApi = '/backend-api/project/dynamic-sales/import-build-info';

// 导出楼栋接口
const exportBuildInfoApi = '/backend-api/project/dynamic-sales/export-build-info';
// 批量标记销售状态来源
const batchUpdateStatusApi = '/backend-api/project/cj-project/batch-update-status';

/**
 * 获取页面权限列表
 * @param {String} taskId 任务id
 */
const getPageAuthListData = (taskId) => axios.get(getPageAuthListApi, { params: {task_id: taskId} })

/**
 * 获取区域信息
 * @param {Object} params 参数对象
 * @param {String} params.city_id 城市ID
 * @param {String} params.q	 区域名称
 * @return {promises} promise对象
 */
const getDistrictListData = (params) => axios.get(getDistrictListApi, {params})

/**
 * 保存楼盘名称&位置信息
 * @param {Object} params 参数对象
 * @param {String} params.city_id 城市ID
 * @param {String} params.task_id 任务ID
 * @param {Object} params.project_name_location 表单参数
 * @return {promises} promise对象
 */
const saveProjectNamePageInfoData = (params) => axios.post(saveProjectNamePageInfoApi, params)

/**
 * 获取楼盘业态信息
 * @param {Object} params 参数对象
 * @param {String} params.city_id 城市ID
 * @param {String} params.q	 区域名称
 * @return {promises} promise对象
 */
const projectTypesData = (params) => axios.get(projectTypesApi, {params})

/**
 * 获取楼盘名称&位置页面数据信息
 * @param {Object} params 参数对象
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.page_id 楼盘ID
 * @param {string} params.task_id 楼盘ID
 * @return {promises} promise对象
 */
const getProjectNameAndPositionData = (params) => axios.get(getProjectNameAndPositionApi, {params});


/**
 * 获取动销信息页面数据
 * @param {String} options.projectId 楼盘id
 * @param {String} options.taskId 任务id
 * @return {promises} promise对象
 */
const getDynamicInfo = (options) => axios.get(dynamicSaleInfoApi, {params: options});

/**
 * 获取户型建筑类型数据
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getHouseTypeInfo = (options) => axios.get(houseTypesApi, {params: options});

/**
 * 获取户型下拉数据
 * @param {String} options.project_id 楼盘id
 * @param {String} options.task_id 任务id
 * @return {promises} promise对象
 */
const getHouseTypeListData = (options) => axios.get(houseTypeListApi, {params: options});

/**
 * 新增复制户型保存
 * @param {String} options.project_id 楼盘id
 * @param {Array} options.source_house_type 复制的户型信息字段
 * @param {String} options.house_type_id 目标户型id
 * @param {String} options.house_type_num 新户型的户型编号
 * @return {promises} promise对象
 */
const saveCoyyHouseType = (options) => axios.post(copyHouseTypeSaveApi, options);

/**
 * 获取编辑楼盘任务详情接口
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id 渠道删除必填
 * @param {String} params.house_type_id 户型id
 * @param {String} params.task_id 任务id 渠道删除必填
 * @return {Promise} promise对象
 */
const delHouseTypeData = (params) => axios.post(delHouseTypeApi, params);

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
 * 保存动销信息数据
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id 渠道删除必填
 * @param {String} params.data 保存的数据对象
 * @param {String} params.task_id 任务id 渠道删除必填is_check_volume
 * @return {Promise} promise对象
 */
const saveDynamicData = (params) => axios.post(saveDynamicInfoApi, params, {
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * 导入楼栋
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id 渠道删除必填
 * @param {String} params.content 保存的文件
 * @param {String} params.task_id 任务id 渠道删除必填
 * @param {String} params.is_check_volume 标识是否校验放量
 * @return {Promise} promise对象
 */
const importBuildInfo = (params) => axios.post(importBuildInfoApi, params);

/**
 * 导出楼栋
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id 渠道删除必填
 * @param {String} params.task_id 任务id 渠道删除必填
 * @return {Promise} promise对象
 */
const exportBuildInfo = (params) => axios.post(exportBuildInfoApi, params);

/**
 * 批量标记销售状态来源
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @param {Object} params.house_type 户型来源信息
 * @param {String} params.house_type.belong_source 来源
 * @param {String} params.house_type.belong_other  来源其他备注
 * @param {Object} params.building_info 楼栋来源信息
 * @param {String} params.house_type.belong_source 来源
 * @param {String} params.house_type.belong_other  来源其他备注
 * @param {Object} params.staging_info 分期来源信息
 * @param {String} params.house_type.belong_source 来源
 * @param {String} params.house_type.belong_other  来源其他备注
 * @return {Promise} promise对象
 */
const batchUpdateStatus = (params) => axios.post(batchUpdateStatusApi, params);

export default {
    getPageAuthListData,
    getDistrictListData,
    getProjectNameAndPositionData,
    getDynamicInfo,
    getHouseTypeInfo,
    projectTypesData,
    saveProjectNamePageInfoData,
    getHouseTypeListData,
    saveCoyyHouseType,
    delHouseTypeData,
    delBuildingData,
    saveDynamicData,
    importBuildInfo,
    exportBuildInfo,
    batchUpdateStatus
}