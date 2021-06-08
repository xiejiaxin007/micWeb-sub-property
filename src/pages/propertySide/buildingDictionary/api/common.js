/**
 * @name: 楼盘测公共接口
 * @description: 楼盘测公共接口文件
 * @author: 贺伟
 * @date: 2019-12-10
 * @update xiebin
 */
import { axios } from '@/assets/js/http/axios';

// 根据楼盘id获取户型下拉接口
const houseTypeListApi = '/backend-api/project/get-house-type-list';

// 获取关联楼栋下拉接口Url
const getBuildingSelApi = '/backend-api/project/get-project-building-list';

// 初始化结构信息Url
const getPageModuleApi = '/backend-api/project/cj-project-field-belong-config/get-page-module-fields-by-page';

// 获取关联楼栋接口
const getProjectBuildingListApi = '/backend-api/project/get-building-list';

// 获取楼盘基础信息
const projectBaseInfoApi = '/backend-api/project/get-project-detail';

// 删除户型接口
const delHouseTypeApi = '/backend-api/project/dynamic-sales/del-house-type';

// 获取楼盘通用配置信息接口
const getProjectConfigApi = '/backend-api/common/get-project-config';

// 获取页面权限url
const getDetailAuthConfigApi = '/backend-api/project/cj-qd-project-task/get-task-auth';

// 运营信息审核--获取建设阶段下拉接口
const getConstructionPhaseApi = '/backend-api/select2/cj-project-info/get-construction-phase';
// 运营审核页面--获取建筑类型字段下拉接口
const getConstructionTypeApi = '/backend-api/select2/cj-project-info/get-construct-type';
// 运营信息审核--获取物业公司下拉接口
const getPropertyCompanyApi = '/backend-api/select2/cj-project-info/get-project-property-company';
// 运营信息审核--获取物业费下拉接口
const getPropertyFeeApi = '/backend-api/select2/cj-project-info/get-project-property-fee';
// 运营审核页面--获取水电气下拉接口
const getWaterElectApi = '/backend-api/select2/cj-project-info/get-project-water-electy';
// 运营审核页面--获取分期下拉接口
const getProjectStageApi = '/backend-api/select2/cj-project-info/get-project-staging';
// 运营审核页面--获取放量下拉接口
const getProjectVolumeApi = '/backend-api/select2/cj-project-info/get-project-volume';
// 运营审核页面--获取交房下拉接口
const getProjectLiveApi = '/backend-api/select2/cj-project-info/get-project-live';
// 运营审核页面--获取装修情况下拉接口
const getProjectDecorApi = '/backend-api/select2/cj-project-info/get-project-decorat';
// 运营审核页面--获取产权年限下拉接口
const getPropertyYearApi = '/backend-api/select2/cj-project-info/get-property-year';



// 运营审核页面--获取户型详情接口
const getHouseTypeInfoApi = '/backend-api/project/cj-house-type/get-house-type-info';
// 运营审核页面--获取楼栋详情接口
const getBuildingInfoApi = '/backend-api/project/cj-building-info/get-building-info';

// 根据楼盘id获取楼盘基本信息接口
const getProjectInfoByIdApi = '/backend-api/project/cj-project/get';

// 根据任务ID获取当前任务是新增还是对比接口
const getTaskTypeApi = '/backend-api/project/cj-project-task/get';
// 获取业务接收城市api
const getBusinessCityApi = '/backend-api/select2/select2/get-business-citys-by-role-in-automation';
// 自动生成动态接口
const autoCreatApi = '/backend-api/project/cj-project-dynamic/auto-create';

/**
 * 获取业务接收城市
 * @param {String} params.q 远程搜索参数
 */
const getBusinessCity = (params) => axios.get(getBusinessCityApi, {params});

/**
 * 根据任务ID获取当前任务是新增还是对比
 * @param {String} params.id 任务id
 * @param {String} params.mode_type 1楼盘 2户型 3楼栋
 * @param {String} data_type 1新增 2对比
 * @return {promises} promise对象
 */
const getTaskType = (params) => axios.get(getTaskTypeApi, {params});

/**
 * 根据楼盘id获取户型下拉数据
 * @param {String} options.project_id 楼盘id
 * @param {String} options.task_id 任务id
 * @param {String} options.select_false   =0过滤假户型 1=包含假户型
 * @return {promises} promise对象
 */
const getHouseTypeListData = (options) => axios.get(houseTypeListApi, {params: options});

/**
 * 获取关联楼栋下拉数据
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getBuildingSelData = (options) => axios.get(getBuildingSelApi, {params: options});

/**
 * 初始化结构信息
 * @param {object} params参数
 * @param {string} params.page_id 页面ID
 * @return {Promise} promise对象
 */
const getPageModuleData = (params) => axios.get(getPageModuleApi, {params});

/**
 * 获取楼盘基本信息
 * @param {Object} params 参数对象
 * @param {string} params.project_id 楼盘ID
 * @param {String} params.task_id 任务id
 * @return {promises} promise对象
 */
const getProjectBaseInfo = (params) => axios.get(projectBaseInfoApi, {params});

/**
 * 获取关联楼栋信息
 * @param {Object} params 参数对象
 * @param {string} params.project_id 楼盘ID
 * @return {promises} promise对象
 */
const getProjectBuildingListdata = (params) => axios.get(getProjectBuildingListApi, {params});

/**
 * 根据id删除户型接口
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id 渠道删除必填
 * @param {String} params.house_type_id 户型id
 * @param {String} params.task_id 任务id 渠道删除必填
 * @return {Promise} promise对象
 */
const delHouseTypeData = (params) => axios.post(delHouseTypeApi, params);

/**
 * 获取页面权限接口
 * @param {Object} params参数
 * @param {String} params.page_id 页面id
 * @param {String} params.task_id 任务id
 * @return {Promise} promise对象
 */
const getDetailAuthConfigData = (params) => axios.get(getDetailAuthConfigApi, {params});

/**
 * 获取楼盘通用配置信息
 * 类型:type 1楼盘/户型/分期销售状态 2是否合作 3放量计划类型 4产权年限 5建设阶段类型 6单价类型 7总价类型 8户型居室 9房屋朝向 10户型标签
 * 11装修情况 12环线情况 13区域板块 14交房时间类型 15审核反馈内容类型 16审核反馈内容结果 17 楼盘组审核状态 18 图片审核状态 19 图片类型
 * 20 数据源类型 21 是否合作楼盘  30户型是否显示下拉（显示，隐藏）31楼盘是否显示下拉  32获取来源列表 34 复制户型功能字段配置 35 V8.1获取单价类型列表 36 V8.1获取总价类型累表 37 获取城市单价涨跌幅限制 38 获取区域下有效板块 39 获取当前登陆人来源 40 有无排号接口 41 排号状态接口 42 户型图是否显示 43 户型图楼层 44 交房时间类型 45 楼盘任务审核通过操作类型 46 朝向下拉（包含不限）47 字段属性 48 页面列表 49 字段配置状态
 * @param {Object} options 参数对象 
 * @param {Array} options.type 当前配置的类型
 * @param {String} options.city_id 搜索的城市ID
 * @return {Promise} promise对象
 */
const getProjectConfigData = (options) => axios.post(getProjectConfigApi, options);


/**
 * 根据楼盘id获取建设阶段下拉接口
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getConstructionPhaseList = (options) => axios.get(getConstructionPhaseApi, {params: options});
/**
 * 根据楼盘id获取建筑类型字段下拉接口
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getConstructionTypeList = (options) => axios.get(getConstructionTypeApi, {params: options});
/**
 * 根据楼盘id获取物业公司下拉接口
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getPropertyCompanyList = (options) => axios.get(getPropertyCompanyApi, {params: options});
/**
 * 根据楼盘id获获取物业费下拉接口
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getPropertyFeeList = (options) => axios.get(getPropertyFeeApi, {params: options});
/**
 * 根据楼盘id获取水电气下拉接口
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getWaterElectList = (options) => axios.get(getWaterElectApi, {params: options});
/**
 * 根据楼盘id获取分期下拉接口
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getProjectStageList = (options) => axios.get(getProjectStageApi, {params: options});
/**
 * 根据楼盘id获取放量下拉接口
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getProjectVolumeList = (options) => axios.get(getProjectVolumeApi, {params: options});
/**
 * 根据楼盘id获取交房下拉接口
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getProjectLiveList = (options) => axios.get(getProjectLiveApi, {params: options});
/**
 * 根据楼盘id获取装修情况下拉接口
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getProjectDecorList = (options) => axios.get(getProjectDecorApi, {params: options});
/**
 * 根据楼盘id获取产权年限下拉接口
 * @param {String} options.project_id 楼盘id
 * @return {promises} promise对象
 */
const getPropertyYearList = (options) => axios.get(getPropertyYearApi, {params: options});

// url=获取下拉的链接  detailUrl=获取详情的链接
let getAuditListDataApi = {
    // 分期
    'volume_living_stage_info': {
        url: getProjectStageApi,
        detailUrl: '/backend-api/select2/cj-project-info/get-project-staging-info'
    },
    // 建设阶段
    'volume_living_construction': {
        url: getConstructionPhaseApi,
        detailUrl: '/backend-api/project/cj-construction-phase/get-info'
    },
    // 交房时间
    'volume_living_info': {
        url: getProjectLiveApi,
        detailUrl: '/backend-api/project/cj-project-live/get-info'
    },
    // 放量计划
    'volume_living_volume_info': {
        url: getProjectVolumeApi,
        detailUrl: '/backend-api/project/cj-project-volume/get-info'
    },
    // 产权年限
    'project_property_year_info': {
        url: getPropertyYearApi,
        detailUrl: '/backend-api/project/cj-project-property-year/get-info'
    },
    // 建筑类型
    'project_construct_type_info': {
        url: getConstructionTypeApi,
        detailUrl: '/backend-api/project/cj-construct-type/get-info'
    },
    // 物业公司
    'project_property_company_info': {
        url: getPropertyCompanyApi,
        detailUrl: '/backend-api/project/cj-property-company/get-info'
    },
    // 物业费
    'project_property_fee_info': {
        url: getPropertyFeeApi,
        detailUrl: '/backend-api/project/cj-project-property-fee/get-info'
    },
    // 水电气
    'project_water_electy_info': {
        url: getWaterElectApi,
        detailUrl: '/backend-api/project/cj-water-electy/get-info'
    },
    // 装修情况
    'project_decorate_info': {
        url: getProjectDecorApi,
        detailUrl: '/backend-api/project/cj-project-decorate/get-info'
    }
};
/**
 * 根据楼盘id获取下拉接口（多种下拉，根据key值区分）
 * @param {String} options.project_id 楼盘id
 * @param {String} key 要获取的下拉的key
 * @return {promises} promise对象
 */
const getAuditListData = (options, key) => axios.get(getAuditListDataApi[key].url, {params: options});
/**
 * 根据id获取下拉选择的详情接口
 * @param {String} options.id 楼盘id
 * @param {String} key 要获取的详情的key
 * @return {promises} promise对象
 */
const getAuditDetailData = (options, key) => axios.get(getAuditListDataApi[key].detailUrl, {params: options});


/**
 * 运营审核页面--获取户型详情接口
 * @param {Object} params参数
 * @param {String} params.house_type_id 户型id
 * @param {String} params.is_images 是否需要户型图片信息 非必填  1=是
 * @param {String} params.is_building  是否需要楼栋信息 非必填  1=是
 * @return {Promise} promise对象
 */
const getHouseTypeInfo = (params) => axios.get(getHouseTypeInfoApi, {params});
/**
 * 运营审核页面--获取楼栋详情接口
 * @param {Object} params参数
 * @param {String} params.building_id 楼栋id
 * @return {Promise} promise对象
 */
const getBuildingInfo = (params) => axios.get(getBuildingInfoApi, {params});

/**
 * 根据楼盘id获取楼盘基本信息接口
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @param {String} params.fields 要获取的字段，逗号分割，使用此参数好找字段
 * @return {Promise} promise对象
 */
const getProjectInfoById = (params) => axios.get(getProjectInfoByIdApi, {params});

/**
 * 自动生成动态接口
 * @param {String} params.project_id 楼盘id
 */
const autoCreat = (params) => axios.get(autoCreatApi, {params});

export default {
    getHouseTypeListData,
    getBuildingSelData,
    getPageModuleData,
    getProjectBuildingListdata,
    getProjectBaseInfo,
    delHouseTypeData,
    getProjectConfigData,
    getDetailAuthConfigData,
    getConstructionPhaseList,
    getConstructionTypeList,
    getPropertyCompanyList,
    getPropertyFeeList,
    getWaterElectList,
    getProjectStageList,
    getProjectVolumeList,
    getProjectLiveList,
    getProjectDecorList,
    getPropertyYearList,
    getHouseTypeInfo,
    getBuildingInfo,
    getProjectInfoById,
    getAuditListData,
    getAuditDetailData,
    getTaskType,
    getBusinessCity,
    autoCreat
}