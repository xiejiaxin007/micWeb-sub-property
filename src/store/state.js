export default {
  userInfo: {},
  trackInfos: '',
  employeeName: {},
  netTimeOut: false, // 网络超时标志
  cityInfo: {}, // 城市信息
  trackMessages: {}, // 埋点信息
  uid: '', // 用户id
  role: '', // 权限
  postNum: '', // 岗位id
  backendApi: '', // 埋点地址
  // 用户角色列表
  roleList: [],
  // 文章楼盘数据
  articleProInfo: [],
  // 公共埋点接口数据
  trackCommon: {
    // 基本信息
    info: {},
    // 埋点地址
    backendApi: ''
  },
  // 公共埋点接口地址
  trackBackendApi: '',
  // 接口请求次数超过限制标志提示
  xhrTimeOut: {
    code: '',
    msg: ''
  }
}
