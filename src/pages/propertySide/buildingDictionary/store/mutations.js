import {
    GET_PROJECT_CONFIG_LIST,
    GET_HOUSE_TYPE_ID,
    GET_OSS_ORIGIN_HOST,
    GET_ALL_TABLE_DATA,
    GET_AUTH_COMMON
} from './mutation-types';

export default {
    // 更新配置列表
    [GET_PROJECT_CONFIG_LIST] (state, data) {
        state.projectConfiglist = data
    },
    [GET_HOUSE_TYPE_ID] (state, data) {
        state.houseTypeId = data
    },
    [GET_OSS_ORIGIN_HOST] (state, data) {
        state.ossOriginHost = data
    },
    // 楼盘概况-多个表格数据
    [GET_ALL_TABLE_DATA] (state, data) {
        state.allTableData = data
    },
    // 获取页面是否有编辑权限
    [GET_AUTH_COMMON] (state, data) {
        state.isAuditorAuth = data
    }
}
