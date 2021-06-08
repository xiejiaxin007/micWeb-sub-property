/* 公共api */
import {axios} from '@/assets/js/http/axios';
// 获取头部信息
const getheaderInfoApi = '/backend-api/api-user/header';

const cityUrl = '/backend-api/select2/select2/get-city-list-select2';
// 获取咨询师
const employeeUrl = '/backend-api/select2/select2/get-employee-list-select2';
// 获取咨询师主管
const employeeLeaderApi = '/backend-api/select2/select2/get-team-leader-name-list-select2';
// 获取上传签名API
const uploadSignApi = '/backend-api/bk-api-upload/get-upload-sign'
// 登录api
const login = '/backend-api/api-user/login';
// 获取咨询师工作微信API
const zxsWxApi = '/backend-api/select2/select2/gew-wx-dropdown-list';
// 分页获取咨询师api
const newEmployeeApi = '/backend-api/select2/select2/new-get-employee-list-select2';
// 获取用户角色权限列表
const roleListApi = '/backend-api/common/get-role-list';
// 切换用户角色权限api
const switchRoleApi = '/backend-api/common/switch-role';
// 获取公共弹窗接口
const commonDialogApi = '/backend-api/api-user/pop';
// 响应差-发送验证码
const talkingPopSendCodeApi = '/backend-api/api-user/talking-pop-send-code';
// 响应差-验证验证码
const talkingPopCheckCodeApi = '/backend-api/api-user/talking-pop-check-code';
// 响应差-轮询是否给客户回电
const talkingPopApi = '/backend-api/api-user/talking-pop';
// 轮询-线上看房弹窗信息
const pollOnlineHouseRemindApi = '/backend-api/bk-heartbeat/live-heartbeat-time';
// 获取轮询配置信息
const getHeartbeatInfoApi = '/backend-api/common/get-heartbeat-info';
// 弹窗-开始看房
const enterRoomApi = '/backend-api/bk-live/enter-room';
// 弹窗-取消看房
const cancelEnterRoomApi = '/backend-api/bk-live/cancel-enter-room';
// 弹窗-超时未接通记录
const popupTimeOutAPi = '/backend-api/bk-live/popup-time-out';
// 楼盘下拉获取楼盘列表
const projectListApi = '/backend-api/kfs-developer/get-project-list';
// 获取全国的城市，区别cityUrl  cityUrl会根据登录人限制城市列表 getAllCityNewApi获取全国
const getAllCityNewApi = '/backend-api/select2/select2/new-get-all-city';
// 城市群楼盘下拉
const getProjectListApi = '/backend-api/select2/select2/get-city-group-project-list';
// 获取所有员工下拉（没有默认城市限制）
const getAllEmployeeApi = '/backend-api/employee/get-employee-dropdown-list';
// 获取员工下拉，推荐完整版
const getStaffListApi = '/backend-api/select2/select2/employee-list-for-select2';
// 城市下拉--渠道
const getDetailCityListApi = '/backend-api/common/get-city-dropdown-list';
// 楼盘下拉
const getHouseListApi = '/backend-api/common/get-project-and-type';
// 合作方主体
const cooperateMainApi = '/backend-api/common/get-supplier';
// 合作方下拉api
const cooperateApi = '/backend-api/expand/ex-money-back-group/get-project-partner-list';
// 楼盘下拉--订单侧api
const getHouseOrderApi = '/backend-api/select2/select2/get-alloc-project-dropdown-list';
// 回款负责人下拉api
const getStaffApi = '/backend-api/common/get-employee-dropdown-list';
// 开发商员工下拉接口
const getPartnerApi = '/backend-api/select2/select2/get-partner-employee-dropdown-list';
// 主管下拉api
const managerStaffApi = '/backend-api/select2/select2/get-employee-list-select2';
// 根据登录角色获取员工下拉接口
const getStaffByLoginApi = '/backend-api/select2/select2/get-employee-by-role';
// 弹窗-获取订单相关信息
const getDataForOrderApi = '/backend-api/didi-order/get-data-for-order';
// 弹窗-保存关联订单
const saveRelateDidiApi = '/backend-api/didi-order/save-relate-didi';
// 弹窗-订单搜索
const didiSearchOrderApi = '/backend-api/didi-order/search-order';
// 根据楼盘id获取楼盘基本信息接口
const getProjectInfoByIdApi = '/backend-api/project/cj-project/get';
// 敏感词校验Url
const checkSensitiveWordsApi = '/backend-api/common/check-keywords';
// 获取楼盘ID下拉API
const getHouseIdListApi = '/backend-api/select2/cj-project-info/get-project';
// 获取楼盘下拉(全部)
const getHouseAllApi = '/backend-api/select2/cj-project-info/get-project-list';
// 获取oss临时令牌API
const getOssSignApi = '/backend-api/aliyun-oss-sts/get-tem-token';
// 根据角色获取业务城市下拉API（自己负责的城市的数据，城市优先取业务城市，业务城市为空取地理城市，无全国选项）
const getOwnerCityApi = '/backend-api/project/role-district/get-city-list';



// 根据头部信息
const getheaderInfo = (params) => axios.post(getheaderInfoApi, params);

// 根据楼盘id获取楼盘基本信息接口
const getOssSign = (params) => axios.get(getOssSignApi, {params});
/**
 * 根据城市ID获取楼盘ID下拉
 * @param {Object} params参数
 * @param {String} params.city_id 城市id
 * @param {String} params.q 模糊筛选内容
 * @return {Promise} promise对象
 */
const getHouseAll = (params) => axios.get(getHouseAllApi, {params});

/**
 * 根据城市ID获取楼盘ID下拉
 * @param {Object} params参数
 * @param {String} params.city_id 城市id
 * @return {Promise} promise对象
 */
const getHouseIdList = (params) => axios.get(getHouseIdListApi, {params});

/**
 * 根据楼盘id获取楼盘基本信息接口
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @param {String} params.fields 要获取的字段，逗号分割，使用此参数好找字段
 * @return {Promise} promise对象
 */
const getProjectInfoById = (params) => axios.get(getProjectInfoByIdApi, {params});

/**
 * 弹窗-订单搜索
 * @param {Object} params 参数
 * @param {string} params.q	搜索关键词
 * @return {Promise}
 */
const didiSearchOrder = (params) => axios.get(didiSearchOrderApi, {params});
/**
 * 弹窗-保存关联订单
 * @param {Object} params 参数
 * @param {string} params.id	打车单ID
 * @param {string} params.order_id	订单ID
 * @param {string} params.reason	类型 1 正常带看；2 临时取消带看； 3 签约陪同；4 其他成交后服务 5 其他
 * @param {string} params.see_project	带看ID
 * @param {string} params.sign_deal_id	成交单ID
 * @param {string} params.sign_accmopany	签约陪同
 * @param {string} params.deal_id	成交单ID
 * @param {string} params.remarks_1	1正常带看 备注
 * @param {string} params.remarks_2	临时取消带看 备注
 * @param {string} params.remarks_3	签约陪同 备注
 * @param {string} params.remarks_4	其他成交后服务 备注
 * @param {string} params.remarks_5	其他 备注
 * @return {Promise}
 */
const saveRelateDidi = (params) => axios.post(saveRelateDidiApi, params);
/**
 * 弹窗-获取订单相关信息
 * @param {Object} params 参数
 * @param {string} params.order_id	订单ID
 * @param {string} params.replate_reason 类型 1 正常带看；2 临时取消带看； 3 签约陪同；4 其他成交后服务 5 其他
 * @return {Promise}
 */
const getDataForOrder = (params) => axios.post(getDataForOrderApi, params);

// 获取城市信息接口，参数type 城市类型（如需全国请传1）
export const getCity = (type) => axios.get(cityUrl, {params: {city_type: type}})

/* 获取员工，可更具不同参数筛选不同类型员工
 * options : {
 *  q: '', 输入搜索的内容
 *  role: '' 搜索的角色
 *  header_manager_id: ''	获取某个咨询师组所有成员
 *  city_id: '' 城市id
 *  department_id: '' 部门id
 *  status: '' 在职状态
 * }
 *@getEmployee 获取员工
 *@param{Object} options 参数对象集合
 *······
 *参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=1911&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E5%85%AC%E5%85%B1%E6%8E%A5%E5%8F%A3&projectID=131
 *@return {Promise} 返回异步resolve后的Promise
*/
export const getEmployee = (options) => axios.get(employeeUrl, {params: options})

/**
 * 获取咨询师主管
 * @param {Object} option 参数
 * @param {string} option.q	搜索关键词
 * @param {string} option.city_id 城市ID
 * @return {Promise}
 */
export const getEmployeeLeader = (options) => axios.get(employeeLeaderApi, {params: options})

/**
 * 获取上传签名信息
 * @param {string} cate 上传图片文件夹
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=1147&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E6%A0%87%E7%AD%BE%E4%BC%98%E5%8C%96&projectID=74
 * @return {Promise} 返回异步resolve后的Promise
 */
export const getSign = (params) => axios.post(uploadSignApi, params)

/**
 * 获取咨询师工作微信
 * @param {Object} option 参数
 * @param {string} option.q 查询关键字
 * @return {Promise}
 */
export const getZxsWx = (option) => axios.get(zxsWxApi, {params: option})

/**
 * 登录接口
 * @param {int} params.job_number 工号
 * @param {string} params.password 密码
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=1147&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E6%A0%87%E7%AD%BE%E4%BC%98%E5%8C%96&projectID=74
 * @return {Promise} 返回异步resolve后的Promise
 */
const userLogin = (params) => axios.post(login, params)

/**
 * 分页获取咨询师
 * @param {Object} params 参数
 * @param {String} params.q 输入搜索的内容
 * @param {String} params.role 搜索的角色
 * @param {String} params.header_manager_id 获取某个咨询师组所有成员
 * @param {String} params.city_id 城市id
 * @param {String} params.department_id 部门id
 * @param {String} params.post_id 岗位id
 * @param {Number} params.status 在职状态
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2347&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E5%85%AC%E5%85%B1%E6%8E%A5%E5%8F%A3&projectID=131
 * @return {Promise} 返回异步resolve后的Promise
 */
export const getPageEmployee = (params) => axios.get(newEmployeeApi, {params})

/**
 * 获取登录用户的角色列表
 * @param {Object} params 参数
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2333&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E5%85%AC%E5%85%B1%E6%8E%A5%E5%8F%A3&projectID=131
 * @return {Promise}
 */
const getRoleList = (params) => axios.post(roleListApi, params)

/**
 * 切换登录用户的角色
 * @param {Object} params 参数
 * @param {String} params.role_name 切换角色的标示
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2336&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E5%85%AC%E5%85%B1%E6%8E%A5%E5%8F%A3&projectID=131
 * @return {Promise}
 */
const switchRole = (params) => axios.post(switchRoleApi, params)


/**
 * 获取公共弹窗
 * @return {Promise}
 */
const getCommonDialogApi = () => axios.get(commonDialogApi);

/**
 * @description: 公共埋点接口
 */
const trackInfoApi = '/backend-api/common/backend-track-info';
export const getTrackInfo = () => axios.post(trackInfoApi);

/**
 * 响应差-发送验证码
 * @param {string} params.task_id 任务ID
 * @return {Promise}
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2547&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E5%85%AC%E5%85%B1%E6%8E%A5%E5%8F%A3&projectID=131
 */
const getTalkingPopSendCode = (params) => axios.post(talkingPopSendCodeApi, params);

/**
 * 响应差-验证验证码
 * @param {string} params.order_id 订单id
 * @param {string} params.mobile 手机号
 * @param {string} params.code 验证码
 * @param {string} params.task_id 任务ID
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2548&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E5%85%AC%E5%85%B1%E6%8E%A5%E5%8F%A3&projectID=131
 * @return {Promise}
 */
const getTalkingPopCheckCode = (params) => axios.post(talkingPopCheckCodeApi, params);

/**
 * 轮询咨询师是否已给客户回电
 * @param {string} params.talkiing_id 记录Id
 * @return {Promise}
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2546&projectName=%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F-%E5%85%AC%E5%85%B1%E6%8E%A5%E5%8F%A3&projectID=131
 */
const getTalkingPop = (params) => axios.post(talkingPopApi, params);

/**
 * 轮询-线上看房弹窗信息
 * @param {string} params.sign 记录Id
 * @param {string} params.employee_id 咨询师id
 * @return {Promise}
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2764&projectName=%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%9C%8B%E6%88%BF&projectID=199
 */
const pollOnlineHouseRemind = (params) => axios.post(pollOnlineHouseRemindApi, params);

/**
 * 获取轮询配置信息
 * @return {Promise}
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2804&projectName=%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%9C%8B%E6%88%BF&projectID=199
 */
const getHeartbeatInfo = () => axios.post(getHeartbeatInfoApi);
/**
 * 弹窗-开始看房
 * @param {string} params.room_id 房间Id
 * @param {string} params.alloc_type 弹窗类型
 * @return {Promise}
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2765&projectName=%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%9C%8B%E6%88%BF&projectID=199
 */
const enterRoom = (params) => axios.post(enterRoomApi, params);
/**
 * 弹窗-取消看房
 * @param {string} params.room_id 房间Id
 * @param {string} params.alloc_type 弹窗类型
 * @param {string} params.circulation_type 分配轮次
 * @return {Promise}
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2766&projectName=%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%9C%8B%E6%88%BF&projectID=199
 */
const cancelEnterRoom = (params) => axios.post(cancelEnterRoomApi, params);
/**
 * 弹窗-超时未接通记录
 * @param {string} params.room_id 房间Id
 * @param {string} params.alloc_type 弹窗类型
 * @return {Promise}
 * 参考接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2794&projectName=%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%9C%8B%E6%88%BF&projectID=199
 */
const popupTimeOut = (params) => axios.post(popupTimeOutAPi, params);

/**
 * 获取城市数据信息
 * @param {object} params参数
 * @param {string} params.type 2为城市搜索
 * @param {string} params.param withAll--不带总部,noAll—没有全国 country—都有
 * @return {Promise} promise对象
 */
const getDetailCityListData = (params) => axios.get(getDetailCityListApi, {params});

/**
 * 获取楼盘下拉
 * @param {Object} params 参数
 * @param {String} q 模糊搜索关键字
 */
const getHouseList = (params) => axios.get(getHouseListApi, {params});

/**
 * 获取楼盘下拉
 * @param {Object} params 参数
 * @param {String} q 模糊搜索关键字
 */
const getHouseOrder = (params) => axios.post(getHouseOrderApi, params);

/**
 * 主管下拉
 * @param {Object} params 参数
 * @param {String} params.q 模糊搜索关键字
 * @param {String} params.role header咨询师，header_manager咨询师主管，admin总管理员
 * @param {String} params.header_manager_id 获取某个咨询师组所有成员
 * @param {String} params.city_id 城市id
 * @param {String} params.department_id 部门id
 * @param {String} params.status 在职状态
 * @param {String} params.post_id 岗位ID
 */
const managerStaff = (params) => axios.get(managerStaffApi, {params});

/**
 * 获取回款负责人下拉
 * @param {Object} params 参数
 * @param {String} q 模糊搜索关键字
 */
const getStaff = (params) => axios.get(getStaffApi, {params});

/**
 * 获取合作方下拉
 * @param {Object} params 参数
 * @param {String} params.q 模糊搜索关键字
 * @param {String} params.city_id 城市ID
 */
const getCooperate = (params) => axios.post(cooperateApi, params);

/**
 * 合作方主体
 * @param {Object} params 参数
 * @param {String} q 模糊搜索关键字
 */
const getCooperateMain = (params) => axios.get(cooperateMainApi, {params});

/**
 * 楼盘下拉获取楼盘列表
 * @param {Object} params 参数描述
 * @param {string} params.name 楼盘名称 非必填
 * @param {string} params.developer_id 开发商id(不填查全部) 非必填
 * @param {array} params.not_in_id 过滤楼盘id 非必填
 * 参考公共接口：http://ams.julive.com/#/home/project/inside/api/detail?groupID=-1&apiID=2642&projectName=%E5%BC%80%E5%8F%91%E5%95%86%E7%B3%BB%E7%BB%9F-%E6%94%AF%E6%92%91%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0&projectID=182
 * @return {Object} 结果
 */
export const projectList = (params) => axios.post(projectListApi, params);

/**
 * 获取全国的城市，区别cityUrl  cityUrl会根据登录人限制城市列表 getAllCityNewApi获取全国
 * @return {Promise}
 */
export const getAllCityNew = () => axios.get(getAllCityNewApi)
/**
 * 获取城市群楼盘下拉
 * @param {Object} option 参数描述
 * @param {String} option.q 输入搜索的内容
 * @param {String} option.city_id 城市id
 * @param {String} option.for 固定值： frontend
 * @return {Promise}
 */
export const getProjectListPublic = (option) => axios.get(getProjectListApi, {params: option});
/**
 * 获取所有员工下拉（没有默认城市限制）
 * @param {Object} option 参数描述
 * @param {String} option.q 输入搜索的内容
 * @return {Promise}
 */
export const getAllEmployee = (option) => axios.get(getAllEmployeeApi, {params: option});
/**
 * 获取员工下拉 ,推荐完整版
 * @param {Object} option 参数描述
 * @param {String} option.q 输入搜索的内容
 * @param {String} option.role	搜索的角色	header咨询师，header_manager咨询师主管，admin总管理员
 * @param {String} option.header_manager_id	获取某个咨询师组所有成员
 * @param {String} option.city_id	城市id
 * @param {String} option.department_id	部门id
 * @param {String} option.status	在职状态   0离职
 * @param {String} option.post_id	岗位id
 * @param {String} option.all	是否查询全国员工数据， 会忽略当前登录人的城市，默认1
 * @return {Promise}
 */
export const getStaffList = (option) => axios.get(getStaffListApi, {params: option});

/**
 * 开发商员工下拉接口
 * @param {Object} option 参数描述
 * @param {String} option.q 输入搜索的内容
 * @param {String} option.id 员工id
 * @return {Promise}
 */
export const getPartner = (option) => axios.get(getPartnerApi, {params: option});
/**
 * 根据登录角色获取员工下拉接口
 * @param {Object} option 参数描述
 * @param {String} option.q 输入搜索的内容
 * @return {Promise}
 */
const getStaffByLogin = (option) => axios.get(getStaffByLoginApi, {params: option});

/**
 * 敏感词校验接口
 * @param {object} params参数
 * @param {string} params.project_id 楼盘ID
 * @param {string} params.city_id 城市ID
 * @param {string} params.is_create_project 是否新增楼盘  8.1这边没有新增的，是新增的=1，不是新增的=2
 * @param {string} params.str 敏感词
 * @return {Promise} promise对象
 */
const checkSensitiveWordsData = (params) => axios.get(checkSensitiveWordsApi, {params});

/**
 * 根据角色获取业务城市下拉
 * @param {object} params参数
 * @param {string} params.q 搜索关键词
 */
const getOwnerCity = (params) => axios.get(getOwnerCityApi, {params});

const apiObj = {
    getheaderInfo,
    userLogin,
    getSign,
    getPageEmployee,
    getRoleList,
    switchRole,
    getCommonDialogApi,
    getTalkingPopSendCode,
    getTalkingPopCheckCode,
    getTalkingPop,
    pollOnlineHouseRemind,
    enterRoom,
    cancelEnterRoom,
    popupTimeOut,
    getHeartbeatInfo,
    projectList,
    getAllCityNew,
    getProjectListPublic,
    getAllEmployee,
    getStaffList,
    getDetailCityListData,
    getHouseList,
    getHouseOrder,
    getCooperateMain,
    getStaff,
    managerStaff,
    getCooperate,
    getPartner,
    getStaffByLogin,
    getDataForOrder,
    saveRelateDidi,
    didiSearchOrder,
    getProjectInfoById,
    checkSensitiveWordsData,
    getHouseIdList,
    getHouseAll,
    getOssSign,
    getOwnerCity
};
export default apiObj;
