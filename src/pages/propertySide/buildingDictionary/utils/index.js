/**
 * @description 页面保存数据校验信息来源是否必填
 * @author xiebin
 * @time 2019.12.16
 * @update: hewie 2019-12-16
 */

import DateMethod from '@/assets/js/utils/timeRelated';
import moment from 'moment';
import { commonFun } from '@/assets/js/utils/utils';
import api from '../api/common.js';
/**
 * 校验数据是否发生改变
 * @param {Object} originData 源数据
 * @param {Object} newData 提交的数据
 * @param {Array} filterData 不需要提示的数据字段
 */
let isFormListDataChange = (originData, newData) => {
    let errorArr = [];
    for (let i in newData) {
        // 判断显示来源的字段是否发生变更 如果发生变更将变更字段的描述保存
        /* if (originData[i].is_show_belong_role == '1' && newData[i].field_value != originData[i].field_value && (!newData[i].belong_role || (newData[i].belong_role === 10 && newData[i].belong_other === ''))) {
            errorArr.push(newData[i].field_desc);
        } */
        const newVal = newData[i].field_value;
        let oldVal = originData[i].field_value;
        const belongRole = newData[i].belong_role;
        const belongOther = newData[i].belong_other;
        // 判断是否显示来源
        if (originData[i].is_show_belong_role == '1') {
            // 放量时间特殊处理
            let desc = newData[i].field_desc;
            const tenday = ['volume_date_year', 'volume_date_month', 'volume_date_day', 'volume_date_ten'];
            if (tenday.includes(i)) {
                desc = '放量时间';
            }
            // 关联户型和楼栋处理
            const arrFileds = ['relation_buildings', 'relation_house_types'];
            if (arrFileds.includes(i)) {
                if (oldVal === '') {
                    oldVal = [];
                }
            }
            // 判断字段field_value值是否为数组
            if (Array.isArray(newVal)) {
                if (!arrayIsEqua(newVal, oldVal) && (!belongRole || (belongRole === 10 && belongOther === ''))) {
                    errorArr.push(desc);
                }
            } else {
                if (newVal != oldVal && (!belongRole || (belongRole === 10 && belongOther === ''))) {
                    errorArr.push(desc);
                }
            }
        }
    }
    // 对经纬度去重
    let arrList = new Set(errorArr);
    return Array.from(arrList);
}

let isFormArrDataChange = (originData, newData, ischeckAll, moduleName) => {
    let errorArr = [];
    newData.forEach((item, idx) => {
        for (let i in item) {
            // 判断显示来源的字段是否发生变更 如果发生变更将变更字段的描述保存
            /* if (item[i].is_show_belong_role == '1' && item[i].field_value != originData[idx][i].field_value && (!newData[idx][i].belong_role && (newData[idx][i].belong_role === 10 && newData[idx][i].belong_other === ''))) {
                // 由于字段较多 进行单个提示
                if (errorArr.length === 0) {
                    let desc = item[i].field_desc;
                    const rooms = ['layout_ting', 'layout_shi', 'layout_chu', 'layout_wei'];
                    if (rooms.includes(i)) {
                        desc = '厅室描述';
                    }
                    errorArr.push(desc);
                }
                return false;
            } */

            let newVal = item[i].field_value;
            let oldVal = originData[idx][i].field_value;
            // 0是有效值的字段不能转为空字符串：户型总量  楼栋->在售房源数量    楼盘概况->车位情况    楼栋-》地下楼层数、总户数、总单元数、户型的在售余量
            let isZero = ['total_count', 'on_sale_num', 'car_space', 'under_floor_num', 'total_house_num', 'unit_num', 'house_on_sale_num'];
            if (isZero.indexOf(i) === -1) {
                newVal = Number(newVal) === 0 ? '' : newVal;
                oldVal = Number(oldVal) === 0 ? '' : oldVal;
            } else {
                // 楼栋的转成字符串，因为新值是数字0  0== '' 成立判断newVal != oldVal就不成立
                newVal += '';
                oldVal += '';
            }
            // 单价，总价要转为数字格式
            if (i === 'offer_price' || i === 'price') {
                newVal = newVal ? Number(newVal) : '';
                oldVal = oldVal ? Number(oldVal) : '';
            }
            const belongRole = item[i].belong_role;
            const isBelongShow = item[i].is_show_belong_role;
            const belongOther = item[i].belong_other;
            // 判断是否显示来源
            if (isBelongShow == '1') {
                if (!ischeckAll) {
                    if (errorArr.length === 0) {
                        let desc = item[i].field_desc;
                        // 厅室描述特殊处理
                        const rooms = ['layout_ting', 'layout_shi', 'layout_chu', 'layout_wei'];
                        const liveDate = ['live_date_year', 'live_date_month', 'live_date_day', 'live_date_ten'];
                        const tenday = ['volume_date_year', 'volume_date_month', 'volume_date_day', 'volume_date_ten'];
                        if (tenday.includes(i)) {
                            desc = '放量时间';
                        }
                        if (liveDate.includes(i)) {
                            desc = '交房时间';
                        }
                        if (rooms.includes(i)) {
                            desc = '厅室描述';
                        }
                        // 户型的信息要带上户型编号提示， 动销页面户型列表的moduleName 等于户型信息模块：以次来区分是否添加户型编号
                        if (moduleName === '户型信息模块：') {
                            desc = '户型（'+item['house_type_num'].field_value+'）的' + desc;
                        }
                        // 判断字段field_value值是否为数组
                        if (Array.isArray(newVal)) {
                            if (!arrayIsEqua(newVal, oldVal) && (!belongRole || (belongRole === 10 && belongOther === ''))) {
                                errorArr.push(desc);
                            }
                        } else {
                            if (newVal != oldVal && (!belongRole || (belongRole === 10 && belongOther === ''))) {
                                errorArr.push(desc);
                            }
                        }
                    } else {
                        return false;
                    }
                } else {
                    // 厅室描述特殊处理
                    let desc = item[i].field_desc;
                    const rooms = ['layout_ting', 'layout_shi', 'layout_chu', 'layout_wei'];
                    if (rooms.includes(i)) {
                        desc = '厅室描述';
                    }
                    // 判断字段field_value值是否为数组
                    if (Array.isArray(newVal)) {
                        if (!arrayIsEqua(newVal, oldVal) && (!belongRole || (belongRole === 10 && belongOther === ''))) {
                            errorArr.push(desc);
                        }
                    } else {
                        if (newVal !== oldVal && (!belongRole || (belongRole === 10 && belongOther === ''))) {
                            errorArr.push(desc);
                        }
                    }
                }
            }
        }
    })
    // 对厅室描述去重
    let arrList = new Set(errorArr);
    return Array.from(arrList);
}

/**
 * 校验数据发生改变时，信息来源是否为必填
 * 注意：为了能在页面内访问到组件的this实例，请在页面初始化是将此方法挂载到this上
 * @param {Object} originData 源数据
 * @param {Object} newData 提交的数据
 * @param {Array} isArr 是否是数组.
 * @param {String} moduleName 模块名称
 */
export function isRequiredInfoOrigin(originData, newData, isArr, moduleName, ischeckAll) {
    let repeatData = '';
    if (isArr) {
        repeatData = isFormArrDataChange(originData, newData, ischeckAll, moduleName);
    } else {
        repeatData = isFormListDataChange(originData, newData);
    }
    // let repeatData = isFormListDataChange(originData, newData);
    let str = '';
    // 模块名称
    let name = moduleName || '';
    if (repeatData.length > 0) {
        repeatData.forEach(item => {
            str += item + '、';
        })
        str = str.substring(0, str.length - 1);
        this.$alert(name + str + '的信息来源是必填项', '信息来源', {
            confirmButtonText: '确定'
        });
    }
    return repeatData.length === 0;
}


 /**
 * 操作提示方法
 * @param {String} msg 操作确认提示的信息
 * @return {Boolean} 是否确认
 */
export function confirmMsg(msg) {
    return new Promise((resolve) => {
        this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showClose: false,
            closeOnClickModal: false,
            type: 'warning'
        }).then(() => {
            resolve(true);
        }).catch(() => {
            resolve(false);
            this.$message({
                type: 'info',
                message: '已取消操作'
            });
        });
    })
}
/**
 * 自定义的确认弹窗
 * @param {Object} msgObj 弹窗参数
 * @return {Boolean} 是否确认
 */
export function confirmDefindMsg({
    msg,
    confirmText,
    cancleText,
    confirmFn,
    cancleFn
}) {
    return new Promise((resolve) => {
        this.$confirm(msg, '提示', {
            confirmButtonText: confirmText || '确定',
            cancelButtonText: cancleText || '取消',
            showClose: false,
            closeOnClickModal: false,
            type: 'warning'
        }).then(() => {
            confirmFn && confirmFn();
            resolve(true);
        }).catch(() => {
            cancleFn && cancleFn();
            resolve(false);
        });
    })
}

/**
 * 驼峰转下划线方法
 * @param {String} str 要转换的驼峰字符串
 * @return {String} 转换后的串
 */
export function underline(str) {
    if (!str) {
        return str;
    }
    return str.replace(/\B([A-Z])/g, '_$1').toLowerCase()
}
/**
 * 元转万
 * @param {String, Number}
 * @return {Number} 需要转为万元的值
 */
export function yuanToWan(origin) {
    if (isNaN(Number(origin))) {
        console.warn(`${origin}无法转成数字`);
        return origin;
    }
    if (!origin) {
        return origin;
    }
    return +(Number(origin) / 10000).toFixed(4);
}

/**
 * 滚动条滚动
 * @param {string} element 元素
 */
export function errorScroll(element) {
    let timer = null;
    clearInterval(timer);
    timer = setInterval(() => {
        document.documentElement.scrollTop = element.offsetTop - 112;
        clearInterval(timer);
    }, 10);
}

/**
 * 组装来源操作展示的信息
 * @param {Object} item 字段信息对象
 * @param {String} isShowOrg 是否展示来源
 * @return {String} 信息来源操作信息
 */
export function getOriginOperateInfo(item, isShowOrg = true) {
    try {
        const {
            belong_other = '',
            belong_role_text = '',
            belong_datetime = '',
            belong_employee_name = '',
            belong_employee_id = ''
        } = item;
        const belongOther = belong_other ? `-${belong_other}` : '';
        const dateTime = belong_datetime && DateMethod.filterDate(belong_datetime * 1000, 'YYYY-MM-DD HH:mm:ss');
        if (isShowOrg) {
            return !dateTime && !belong_employee_name && !belong_employee_id ? '' : `${belong_role_text}${belongOther} ${dateTime} ${belong_employee_name} ${belong_employee_id ? '-' + belong_employee_id : ''}`;
        }
        return !dateTime && !belong_employee_name && !belong_employee_id ? '' : `${dateTime} ${belong_employee_name} ${belong_employee_id ? '-' + belong_employee_id : ''}`;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 时间戳转换为年月日格式
 * @param {string} para 时间、默认不取毫秒，即后三位毫秒为0
 * @param {string} type 要转换的格式 例如'YYYY-MM-DD HH:mm:ss'
 * return 传入的时间格式
 */
export function filterDate(para, type) {
    return para === '' ? '' : moment(para * 1000).format(type);
}

/**
 * 判断两个数组是否相等 里面的值相等 限简单数字数组
 * @param {Array} firstArr 要比较的第一个数组
 * @param {Array} secondArr 要比较的第二个数组
 * @return {Boolean} 是否相等
 */
export function arrayIsEqua(firstArr, secondArr) {
    if (!(Array.isArray(firstArr) && Array.isArray(secondArr))) {
        // console.warn('要比较的对象必须是数组');
        return;
    }
    if (firstArr.length !== secondArr.length) {
        return false;
    }
    // 排序数组 从小到大
    const firstStr = firstArr.sort((prev, next) => prev - next).join('');
    const secondStr = secondArr.sort((prev, next) => prev - next).join('');
    return firstStr == secondStr;
}

/**
 * 获取当前月总天数
 * @param {String} month 当前月份
 */
export function getCurMonthDays(month, yearVal) {
    // 获取下一个月前一天的时间来获取本月总天数
    const year = yearVal || new Date().getFullYear();
    const totalDays = new Date(year, month.toString()).getTime() - 24 * 60 * 60 * 1000;
    // 将天返回
    return new Date(totalDays).getDate();
}

/**
 * 根据年月日旬参数 获取计算后的年月日
 * @param {Object} dateObj 包含年月日旬四个参数的对象 {year, month, day, ten} 年必传
 * @returns {Date} 返回格式化后的日期 YYYY-MM-DD
 */
export function getComputedTimeByTenData(dateObj) {
    try {
        let {
            year,
            month,
            day = '',
            ten = ''
        } = dateObj;
        month = month || 12;
        // 判断是否有旬  如果有则计算对应的日期并赋值
        if (ten) {
            if (ten == 1 || ten == 2) {
                day = ten * 10;
            } else if (ten == 3) {
                day = getCurMonthDays(month, year);
            }
        }
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 获取跳转8.1tab大页面url
 * @param {String} pageNum tab页面对应的pageId
 * @returns {String} 拼接后的url
 */
export function getHrefUrl(pageNum, isEdit = '') {
    const {
        query: {
            // 楼盘id
            projectId,
            // 任务id
            taskId = '',
            // 标识入口时从哪跳进来的   operation：楼盘列表（不分离页面）  expand：楼盘任务列表（分离页面）';
            role = '',
            // 楼盘业态
            buildingType = '',
            // 楼盘名称
            projectName = '',
            // 城市id
            cityId = ''
        }
    } = this.$route;
    const baseUrl = `/dist/building/tabToggleList?projectId=${projectId}`;
    return `${baseUrl}&taskId=${taskId}&role=${role}&cityId=${cityId}&projectName=${projectName}&buildingType=${buildingType}&positionTab=${pageNum}&isEdit=${isEdit}`;
}

// 从url中获取楼盘信息  楼盘名称和业态
export function getProjectNameAndTypes() {
    const {
        projectName = '',
        buildingType = ''
    } = this.$route.query;
    return projectName && `${projectName}${buildingType}--`;
}

/**
 * 获取必要的结构数据
 * @param {Object} origin 原数据
 * @return {Object} 过滤后的必要数据
 */
export function getNecessaryData(origin) {
    let necessaryData = {};
    // 遍历数据 保存必要的字段 并返回
    Object.keys(origin).forEach(name => {
        const item = origin[name];
        necessaryData[name] = {
            field_id: item.field_id,
            field_name: item.field_name,
            field_value: item.field_value,
            field_desc: item.field_desc,
            belong_role: item.belong_role,
            belong_other: item.belong_other,
            is_show_belong_role: item.is_show_belong_role,
            table_id: item.table_id,
            isNew: true
        };
    });
    return necessaryData;
}

/**
 * 公共埋点方法
 * @param {string} trackid 埋点ID
 * @param {object}} para 埋点拓展字段
 */
export function setTrack(trackId, para) {
    commonFun.setTrackMenu(trackId, para);
}

/**
 * 根据楼盘id获取楼盘基本信息
 * @param {Object} params参数
 * @param {String} params.project_id 楼盘id
 * @param {String} params.fields 要获取的字段，逗号分割，使用此参数好找字段
 * @return {Promise} promise对象
 */
export async function getInfoByProjectId(project_id, fields) {
    try {
        let params = {
            project_id: project_id,
            fields: fields
        }
        let result = await api.getProjectInfoById(params);
        let { code, data } = result.data;
        if (code === 0) {
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}
/**
 * @description: 楼盘8.1页面跳转，刷新能保留当前页，如果跳转到新页面就用上面的getHrefUrl方法
 * @param {String} tab  页面id
 * @param {String} isEdit 是否可编辑 
 * @return {type} 
 */
export function toRouterLink(tab, isEdit) {
    let params = commonFun.deepClone(this.$route.query);
    params.positionTab = tab;
    params.isEdit = isEdit;
    if (!params.isEdit) {
        delete params.isEdit;
    }
    this.$router.push({ name: this.$route.name, query: params});
}