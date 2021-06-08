/*
 * @Name: 楼盘分级列表API
 * @Description: 楼盘分级列表API
 * @Author: xiebin
 * @Date: 2019-11-16
 */
import { axios } from '@/assets/js/http/axios';
// 城市下拉URL
const getProjectLevelCityListApi = '/backend-api/project/cj-project-level/city-list';

// 楼盘名称URL
const getProjectNameListApi = '/backend-api/project/get-project-name-list';

// 楼盘通用配置URL
const getProjectConfigListApi = '/backend-api/common/get-project-config';

// 楼盘分级列表URL
const getProjectLevelListApi = '/backend-api/project/cj-project-level/index';


/**
 * 获取城市数据信息
 * @params [object] params参数
 * @params [string] params.q 搜索的城市名
 * @return [Promise] promise对象
 */
const getProjectLevelCityListData = (params) => axios.get(getProjectLevelCityListApi, {params});

/**
 * 获取楼盘名称信息
 * @params [object] params参数
 * @params [string] params.q 搜索的楼盘名
 * @params [string] params.city_id 搜索的城市ID
 * @return [Promise] promise对象
 */
const getProjectNameListData = (params) => axios.get(getProjectNameListApi, {params});

/**
 * 获取楼盘分级列表信息
 * @params [object] params参数
 * @params [string] params.project_id 楼盘ID
 * @params [string] params.city_id 城市ID
 * @params [string] params.project_level 楼盘等级
 * @params [string] params.is_cooperate 是否合作
 * @return [Promise] promise对象
 */
const getProjectLevelListData = (params) => axios.get(getProjectLevelListApi, {params});

/**
 * 获取楼盘通用配置信息
 * @params [object] params参数
 * @params [string] params.type 当前配置的类型
 * @params [string] params.city_id 搜索的城市ID
 * @return [Promise] promise对象
 */
const getProjectConfigListData = (params) => axios.post(getProjectConfigListApi, params);

export default {
    getProjectLevelCityListData,
    getProjectNameListData,
    getProjectConfigListData,
    getProjectLevelListData
}