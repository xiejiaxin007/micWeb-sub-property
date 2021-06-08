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
import { getTrackInfo } from '@/api/commonApi';

export default {
  // 存入state埋点信息
  getTrackCommon({commit}) {
    return new Promise((resolve, reject) => {
      getTrackInfo().then(res => {
        if (res && res.status === 200 && res.data.code === 0) {
          let data = {
            info: res.data.data.result,
            backendApi: res.data.data.www_backend_api
          }
          let performance = {
            userId: data.info.job_number,
            mapKey: 'job_number',
            desc: '用户工号'
          };
          window.sessionStorage.setItem('jlWebReportUser', JSON.stringify(performance));
          commit(GET_TRACK_COMMON, {data});
          resolve(data);
        } else {
          reject('');
        }
      })
    })
    
  },
  // test
  getTrackInfo ({commit}, data) {
    commit(GET_TRACK_INFO, {data})
  },
  get_employee_name ({commit}, data) {
    commit(GET_EMPLOYEE_NAME, data)
  },
  get_uid ({commit}, data) {
    commit(GET_UID, data)
  },
  get_role ({commit}, data) {
    commit(GET_ROLE, data)
  },
  get_post_num ({commit}, data) {
    commit(GET_POST_NUM, data)
  },
  net_timeout ({commit}, data) {
    commit(NET_TIMEOUT, data)
  },
  get_cityinfo ({commit}, data) {
    commit(GET_CITYINFO, data)
  },
  get_trackmessages ({commit}, data) {
    commit(GET_TRACKMESSAGES, data)
  },
  get_backend_api ({commit}, data) {
    commit(GET_BACKEND_API, data)
  },
  // 获取用户角色列表信息
  get_role_list({commit}, data) {
      commit(GET_ROLE_LIST, data)
  },
  // 获取登录人信息
  get_user_info({commit}, data) {
    commit(GET_USER_INFO, data)
  },
  // 接口请求次数限制触发
  get_xhr_timeout({commit}, data) {
    commit(GET_XHR_TIMEOUT, data);
  }
}
