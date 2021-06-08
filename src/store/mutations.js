import {
  GET_TRACK_INFO,
  GET_EMPLOYEE_NAME,
  GET_UID,
  NET_TIMEOUT,
  GET_CITYINFO,
  GET_TRACKMESSAGES,
  GET_ROLE,
  GET_POST_NUM,
  GET_BACKEND_API,
  GET_ROLE_LIST,
  GET_TRACK_COMMON,
  GET_USER_INFO,
  GET_XHR_TIMEOUT
} from './mutation-types'

export default {
  // 存储埋点地址
  [GET_TRACK_COMMON](state, {data}) {
    state.trackCommon = data
  },
  [GET_TRACK_INFO] (state, {data}) {
    state.trackInfos = data
  },
  [GET_EMPLOYEE_NAME] (state, data) {
    state.employeeName = data
  },
  [GET_UID] (state, data) {
    state.uid = data
  },
  [NET_TIMEOUT] (state, data) {
    state.netTimeOut = data
  },
  [GET_CITYINFO] (state, data) {
    state.cityInfo = data
  },
  [GET_TRACKMESSAGES] (state, data) {
    state.trackMessages = data
  },
  [GET_ROLE] (state, data) {
    state.role = data
  },
  [GET_POST_NUM] (state, data) {
    state.postNum = data
  },
  [GET_BACKEND_API] (state, data) {
    state.backendApi = data
  },
  // 更新用户角色列表信息
  [GET_ROLE_LIST] (state, data) {
      state.roleList = data
  },
  [GET_USER_INFO] (state, data) {
    state.userInfo = data
  },
  // 接口请求限制
  [GET_XHR_TIMEOUT] (state, data) {
    state.xhrTimeOut = data;
  }
}
