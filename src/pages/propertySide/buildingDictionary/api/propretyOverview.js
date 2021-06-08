/*
 * @Name: 楼盘概况
 * @Description: 楼盘概况API
 * @Author: xiebin
 * @Date: 2019-12-31
 */
import { axios } from '@/assets/js/http/axios';

// 初始化接口信息Url
const initPropertyDetailApi = '/backend-api/project/project-profile/get-info';

// 品牌开发商下拉Url
const brandDeveloperDropApi = '/backend-api/common/brand-developer';

// 删除产权年限Url
const delPropertyYearApi = '/backend-api/project/qd-property-year/del';

// 获取建筑类型下拉Url
const getBuildingTypeApi = '/backend-api/common/project-business-layout';

// 删除建筑类型Url
const delBuildingTypeApi = '/backend-api/project/qd-construct-type/del';

// 删除物业公司Url
const delPropertyCompanyApi = '/backend-api/project/qd-property-company/del';

// 删除物业费Url
const delPropertyPriceApi = '/backend-api/project/qd-property-fee/del';

// 删除水电气Url
const delHydroelectricApi = '/backend-api/project/project-profile/delete-water-electy';

// 删除装修情况Url
const delDecorationStatusApi = '/backend-api/project/project-profile/delete-decorate-info';

// 物业公司下拉Url
const getPropertyCompanyApi = '/backend-api/common/get-property-company';

// 楼盘便签Url
const projectTagApi = '/backend-api/project/tags';

// 保存信息Url
const saveInfoApi = '/backend-api/project/project-profile/save';

// 拓展物业公司下拉Url
const expandSelectApi = '/backend-api/project/cj-property-company/get-qd-select2';





/**
 * 初始化接口信息
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.task_id 任务ID
 * @return {Promise} promise对象
 */
const initPropertyDetailData = (params) => axios.get(initPropertyDetailApi, {params});

/**
 * 品牌开发商下拉
 * @return {Promise} promise对象
 */
const brandDeveloperDropData = () => axios.get(brandDeveloperDropApi);

/**
 * 楼盘便签接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @return {Promise} promise对象
 */
const projectTagData = (params) => axios.get(projectTagApi, {params});

/**
 * 删除产权年限接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.property_year 产权年限ID
 * @param {string} params.task_id 任务ID
 * @return {Promise} promise对象
 */
const delPropertyYearData = (params) => axios.post(delPropertyYearApi, params);

/**
 * 获取建筑类型下拉接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @return {Promise} promise对象
 */
const getBuildingTypeData = (params) => axios.post(getBuildingTypeApi, params);

/**
 * 获取物业公司下拉接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @return {Promise} promise对象
 */
const getPropertyCompanyData = (params) => axios.post(getPropertyCompanyApi, params);

/**
 * 删除建筑类型接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.business_layout 建筑类型ID
 * @param {string} params.task_id 任务ID
 * @return {Promise} promise对象
 */
const delBuildingTypeData = (params) => axios.post(delBuildingTypeApi, params);

/**
 * 删除建筑类型接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.business_layout 建筑类型ID
 * @param {string} params.task_id 任务ID
 * @return {Promise} promise对象
 */
const delPropertyCompanyData = (params) => axios.post(delPropertyCompanyApi, params);

/**
 * 删除物业费接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.property_fee 物业费
 * @param {string} params.task_id 任务ID
 * @return {Promise} promise对象
 */
const delPropertyPriceData = (params) => axios.post(delPropertyPriceApi, params);

/**
 * 删除水电气接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.id 水电气费
 * @param {string} params.task_id 任务ID
 * @return {Promise} promise对象
 */
const delHydroelectricData = (params) => axios.post(delHydroelectricApi, params);

/**
 * 删除装修情况接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.id 装修情况id
 * @param {string} params.task_id 任务ID
 * @return {Promise} promise对象
 */
const delDecorationStatusData = (params) => axios.post(delDecorationStatusApi, params);

/**
 * 保存信息接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.house_type_id 户型ID
 * @param {string} params.task_id 任务ID
 * @return {Promise} promise对象
 */
const saveInfoData = (params) => axios.post(saveInfoApi, params, {
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * 拓展物业公司下拉接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.query 参数
 * @param {string} params.task_id 任务ID
 * @return {Promise} promise对象
 */
const expandSelectData = (params) => axios.get(expandSelectApi, {params});


export default {
    projectTagData,
    initPropertyDetailData,
    brandDeveloperDropData,
    delPropertyYearData,
    getBuildingTypeData,
    delBuildingTypeData,
    getPropertyCompanyData,
    delPropertyCompanyData,
    delPropertyPriceData,
    delHydroelectricData,
    delDecorationStatusData,
    saveInfoData,
    expandSelectData
}