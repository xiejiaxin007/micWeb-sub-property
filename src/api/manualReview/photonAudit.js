import { axios } from '@/assets/js/http/axios';
// 城市下拉URL
const getCityListApi = '/backend-api/common/get-city-list';
// 楼盘名称下拉URL
const getBuildNameApi = '/backend-api/project/project-group/get-project-dropdown-list';
// 区域信息URL
const getDistrictInfoApi = '/backend-api/common/get-district-list';
// 业态信息URL
const getProjectTypeApi = '/backend-api/common/get-project-type-list';
// 竞对楼盘图片URL
const getCompetingPhotoApi = '/backend-api/project/bd-project-img/get-imgs-by-group-id';
// 居理楼盘图片URL
const getJulivePhotoApi = '/backend-api/project/cj-project-img/get-imgs-by-group-id';
// 获取楼盘通用配置URL
const getGeneraInfoApi = '/backend-api/common/get-project-config';
// 获取图片审核接口URL
const getPhotoAuditApi = '/backend-api/project/project-img-audit/audit';
// 关闭任务接口URL
const closeTaskApi = '/backend-api/project/cj-project-img/close-task';


/**
 * 获取城市数据信息
 * @params [object] params参数
 * @params [string] params.type 类型
 * @params [string] params.q 城市名称
 * @return [Promise] promise对象
 */
const getCityListData = (params) => axios.get(getCityListApi, {params});

/**
 * 获取楼盘名称数据信息
 * @params [object] params参数
 * @params [string] params.city_id 楼盘名称
 * @params [string] params.q 城市名称
 * @return [Promise] promise对象
 */
const getBuildNameData = (params) => axios.get(getBuildNameApi, {params});

/**
 * 获取区域数据信息
 * @params [object] params参数
 * @params [string] params.city_id 楼盘名称
 * @params [string] params.q 城市名称
 * @return [Promise] promise对象
 */
const getDistrictInfoData = (params) => axios.get(getDistrictInfoApi, {params});

/**
 * 获取区域数据信息
 * @params [object] params参数
 * @params [string] params.city_id 楼盘名称
 * @params [string] params.q 城市名称
 * @return [Promise] promise对象
 */
const getProjectTypeData = (params) => axios.get(getProjectTypeApi, {params});

/**
 * 获取竞对楼盘图片信息
 * @params [object] params参数
 * @params [string] params.city_id 楼盘名称
 * @params [string] params.q 城市名称
 * @return [Promise] promise对象
 */
const getCompetingPhotoData = (params) => axios.get(getCompetingPhotoApi, {params});

/**
 * 获取居理楼盘图片信息
 * @params [object] params参数
 * @params [string] params.city_id 楼盘名称
 * @params [string] params.q 城市名称
 * @return [Promise] promise对象
 */
const getJulivePhotoData = (params) => axios.get(getJulivePhotoApi, {params});

/**
 * 获取居理楼盘图片信息
 * @params [object] params参数
 * @params [string] params.city_id 楼盘名称
 * @params [string] params.q 城市名称
 * @return [Promise] promise对象
 */
const getGeneraInfoData = (params) => axios.post(getGeneraInfoApi, params);

/**
 * 获取图片审核接口信息
 * @params [object] params参数
 * @params [string] params.id 楼盘组id
 * @params [array] params.img_ids 户型id信息
 * @params [number] params.audit_status 审核状态
 * @return [Promise] promise对象
 */
const getPhotoAuditData = (params) => axios.post(getPhotoAuditApi, params);

/**
 * 关闭任务接口信息
 * @params [object] params参数
 * @params [string] params.id 楼盘组id
 * @return [Promise] promise对象
 */
const closeTaskData = (params) => axios.get(closeTaskApi, { params });

export default {
    getCityListData,
    getBuildNameData,
    getCompetingPhotoData,
    getJulivePhotoData,
    getGeneraInfoData,
    getPhotoAuditData,
    closeTaskData,
    getDistrictInfoData,
    getProjectTypeData
}