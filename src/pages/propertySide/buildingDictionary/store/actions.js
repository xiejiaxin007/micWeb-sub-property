import {
    GET_PROJECT_CONFIG_LIST,
    GET_HOUSE_TYPE_ID,
    GET_OSS_ORIGIN_HOST,
    GET_ALL_TABLE_DATA,
    GET_AUTH_COMMON
} from './mutation-types';
import configApi from '@/api/buildingDictionary/common';
import commonApi from '@/api/commonApi';
import getCommonApi from '../api/common';

 export default {
    // 获取楼盘通用配置信息
    async getProjectConfigList({ commit }, params) {
        try {
            let result = await configApi.getProjectConfigData(params);
            let {data} = result;
            if (data.code === 0) {
                localStorage.setItem('getConfigLists', JSON.stringify(data.data));
                commit(GET_PROJECT_CONFIG_LIST, data.data);
            }
        } catch (error) {
            console.log(error);
        }
    },
    // 获取页面是否编辑权限
    async isEditAuth({ commit }, params) {
        try {
            let result = await getCommonApi.getDetailAuthConfigData(params);
            let { data } = result;
            if (data.code === 0) {
                commit(GET_AUTH_COMMON, data.data.job);
            }
        }
        catch(error) {
            console.log(error);
        }
    },
    // 户型id
    getHouseTypeId ({commit}, data) {
        commit(GET_HOUSE_TYPE_ID, data)
    },
    // 楼盘概况页面--多个表格数据
    getAllTableData ({commit}, data) {
        commit(GET_ALL_TABLE_DATA, data)
    },
    // 阿里云服务器存储源host
    async getOssOriginHost({ commit }, params) {
        try {
            const {
                data: {
                    code,
                    data
                }
            } = await commonApi.getSign(params);
            if (code === 0) {
                localStorage.setItem('gethost', JSON.stringify(data.host));
                commit(GET_OSS_ORIGIN_HOST, data.host)
            }
        } catch (error) {
            console.log(error);
        }
    }
}