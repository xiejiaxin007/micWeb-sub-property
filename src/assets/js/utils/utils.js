import {
    trackAxios
} from '@/assets/js/http/axios'
import api from '@/api/commonApi.js';
import store from '../../../store'
const commonFun = {
    /**
     * 获取小数中小数点后的位数
     * @param {Number} num 传入的小数
     * @returns {Number} 小数点后的位数
     */
    getDecimalLen(num) {
        if (isNaN(num)) {
            return;
        }
        // 判断是否是小数 不是小数返回0
        if (Number.isInteger(num)) {
            return 0;
        }
        const len = num.toString().split('.').length > 1 ? num.toString().split('.')[1].length : 0;
        return len;
    },
    /**
     * 对数字进行四舍五入
     * @param {Number} num 传入的数字 
     */
    numRound(num) {
        if (isNaN(num)) {
            return;
        }
        if (num >= 0) {
            return Math.round(num);
        }
        // 解决round负数处理的问题
        return -Math.round(-num);
    },
    /**
     * 对两个数进行运算返回处理后的值，解决精度导致的问题
     * @param {Number} first 需要运算的第一位数值
     * @param {String} type 运算的类型 取值未 + - * /
     * @param {Number} second 需要运算的第一位数值
     * @return {Number} 运算后的结果
     */
    computedFloatNumber(first, type, second) {
        if (isNaN(first) || isNaN(second) || !type) {
            return;
        }
        // 分别获取参与运算两个数字的小数位数
        const maxLen = Math.max(commonFun.getDecimalLen(first), commonFun.getDecimalLen(second));
        // 取最大得位数对应的10得次方分别与两个数相乘，将小数转换为整数
        const baseNum = Math.pow(10, maxLen);
        // 将其进行四舍五入进一步解决精度问题
        const firstVal = commonFun.numRound(first * baseNum);
        const secondVal = commonFun.numRound(second * baseNum);
        const comput = {
            '+': (firstVal + secondVal) / baseNum,
            '-': (firstVal - secondVal) / baseNum,
            '*': (firstVal * secondVal) / Math.pow(baseNum, 2),
            '/': (firstVal / secondVal)
        };
        let res = comput[type] || 0;
        return Math.abs(res);
    },
    /*
     * 根据楼盘id获取楼盘基本信息
     * @param {Object} params参数
     * @param {String} params.project_id 楼盘id
     * @param {String} params.fields 要获取的字段，逗号分割，使用此参数好找字段
     * @return {Promise} promise对象
     */
    async getInfoByProjectId(project_id, fields) {
        try {
            let params = {
                project_id: project_id,
                fields: fields
            }
            let result = await api.getProjectInfoById(params);
            return result;
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * 获取当前元素的其他兄弟元素
     * @params [Object] elem 选择的当前元素
     */
    siblingElems(elem) {
        let nodes = []
        let _elem = elem
        if (elem.nodeType == 1) {
            while ((elem = elem.previousSibling)) {
                nodes.push(elem)
            }
        }
        let elems = _elem
        if (elems.nodeType == 1) {
            while ((elems = elems.nextSibling)) {
                nodes.push(elems)
            }
        }
        return nodes
    },
    // 深拷贝
    deepClone(obj) {
        let newObj;
        if (typeof obj === "object" && obj !== null) {
            newObj = obj.constructor === Array ? [] : {};
            for (let k in obj) {
                newObj[k] = typeof obj[k] === "object" ? this.deepClone(obj[k]) : obj[k];
            }
        } else {
            newObj = obj;
        }
        return newObj;
    },
    /**
     * 校验手机号
     *
     * @param {string} phoneNum 手机号码
     * @return {Boolean} 返回是否是正规手机号
     */
    verifyTelNum(phoneNum) {
        let result;
        // 手机号校验正则
        let phoneReg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        if (phoneNum && phoneReg.test(phoneNum)) {
            result = true;
        } else {
            result = false;
        }
        return result;
    },
    /**
     * 校验邮箱
     *
     * @param {string} email 邮箱
     * @return {Boolean} 返回是否是正规邮箱
     */
    verifyEmail(email) {
        let result;
        // 邮箱校验正则
        // let emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        let emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (email && emailReg.test(email)) {
            result = true;
        } else {
            result = false;
        }
        return result;
    },
    // 去掉首尾空格
    trim: (str) => {
        if (typeof str !== 'string') {
            return str;
        }
        return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    // 去所有空格
    trimAll: (str) => {
        if (typeof str !== 'string') {
            return str;
        }
        return str.replace(/\s+/g, '')
    },
    // 生成随机字符串
    random_string: (lens) => {
        let len = lens || 32
        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        let maxPos = chars.length
        let pwd = ''
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos))
        }
        return pwd
    },
    // 函数节流
    highThottle: (fn, content, musttime, time) => {
        let start = new Date()
        let musttimes = musttime || 5000
        return function () {
            let args = arguments
            clearTimeout(fn.timer)
            let end = new Date()
            if (end - start > musttimes) {
                start = new Date()
                clearTimeout(fn.timer)
                fn.apply(content, args)
            } else {
                fn.timer = setTimeout(function () {
                    start = new Date()
                    fn.apply(content, args)
                }, time || 200)
            }
        }
    },
    // 获取设备
    getDevice: () => {
        let agent = navigator.userAgent.toLowerCase()
        if (/windows/.test(agent)) {
            return 'windows pc'
        } else if (/iphone|ipod/.test(agent) && /mobile/.test(agent)) {
            return 'iphone'
        } else if (/ipad/.test(agent) && /mobile/.test(agent)) {
            return 'ipad'
        } else if (/android/.test(agent) && /mobile/.test(agent)) {
            return 'android'
        } else if (/linux/.test(agent)) {
            return 'linux pc'
        } else if (/mac/.test(agent)) {
            return 'mac'
        } else {
            return 'other'
        }
    },
    // 获取操作系统版本
    getOS: () => {
        let sUserAgent = navigator.userAgent
        let isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
        let isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
        if (isMac) return 'Mac'
        let isUnix = navigator.platform === 'X11';
        if (isUnix) return 'Unix'
        let isLinux = (String(navigator.platform).indexOf('Linux') > -1)
        if (isLinux) return 'Linux'
        if (isWin) {
            let isWin2K = sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1
            if (isWin2K) {
                return {
                    os: 'windows',
                    os_version: '2000'
                }
            }
            let isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1
            if (isWinXP) {
                return {
                    os: 'windows',
                    os_version: 'XP'
                }
            }
            let isWin2003 = sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1
            if (isWin2003) {
                return {
                    os: 'windows',
                    os_version: '2003'
                }
            }
            let isWinVista = sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1
            if (isWinVista) {
                return {
                    os: 'windows',
                    os_version: 'Vista'
                }
            }
            let isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1
            if (isWin7) {
                return {
                    os: 'windows',
                    os_version: '7'
                }
            }
            let isWin10 = sUserAgent.indexOf('Windows NT 10') > -1 || sUserAgent.indexOf('Windows 10') > -1
            if (isWin10) {
                return {
                    os: 'windows',
                    os_version: '10'
                }
            }
        }
        return {
            os: 'other',
            os_version: ''
        }
    },
    // 获得屏幕宽度
    ScreenWidth: () => {
        return window.screen.width
    },
    // 获得屏幕高度
    ScreenHeight: () => {
        return window.screen.height
    },
    // 获得浏览器
    getBrowse: () => {
        let agent = navigator.userAgent.toLowerCase()
        let browser = {
            browser: 'unknown',
            browser_version: '0'
        }
        if (/se[\s\.a-zA-Z\d]+metasr/.test(agent)) {
            browser.browser = 'sougou'
            browser.browser_version = '0'
        } else if (/(qqbrowser|ubrowser)\D+(\d[\d.]*)/.test(agent) || /(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(agent)) {
            // qq浏览器,UC浏览器 火狐，谷歌...
            browser.browser = RegExp.$1
            browser.browser_version = RegExp.$2
        } else if (/version\D+(\d[\d.]*).*safari/.test(agent)) {
            // safari
            browser.browser = 'safari'
            browser.browser_version = RegExp.$1
        }
        return browser
    },
    /**
     * 验证是否是数字、或者是否是数字字符串
     *
     * @param 需要校验的参数
     * @return {Boolean} 是否是字符串结果
     */
    matchFigure: (para) => {
        let reg = /^[0-9]*$/;
        return !!(para && reg.test(para));
    },
    /*
     * 公共埋点方法---找房工具使用（无顶部导航，只能同用户需求里面获取埋点信息）
     * params（埋点ID，埋点基本信息（接口下发参数），扩展字段（根据不同埋点的一些特殊字段），埋点请求api地址）
     * */
    setTrack: (trackId, trackInfo, paraObj, backendApi) => {
        if (!trackId || !backendApi) {
            return false;
        }
        // 组装埋点数据
        // paraObj:扩展参数、trackId:track_id、trackInfo:接口下发的基础参数
        let moreInfo = {
            screen_height: commonFun.ScreenHeight(),
            screen_width: commonFun.ScreenWidth(),
            device_type: commonFun.getDevice().device,
            os: commonFun.getOS().os,
            os_version: commonFun.getOS().os_version,
            browser: commonFun.getBrowse().browser,
            browser_version: commonFun.getBrowse().browser_version
        }
        let trackAll = Object.assign({}, moreInfo, trackInfo)
        let ex = {
            ini_params: trackAll
        }
        let trackExtr = ex
        if (paraObj) {
            trackExtr = Object.assign({}, paraObj, ex)
        }
        let trackData = {
            extrack_arr: trackExtr,
            track_id: trackId
        }
        // 请求埋点接口
        trackAxios.post(backendApi + '/send-data/index', trackData).then((res) => {
        }).catch((err) => {
            console.log(err)
        })
    },
    /*
     * 新的公共埋点方法，实时拿本地存储里面的基础字段
     * trackId：埋点ID
     * paraObj：扩展字段
     * coverObj：修改埋点字段，比如页面来源，有的埋点的fromPage是需要不定项的——程序自主判断，所以需要多传参数，用于给后台覆盖，例如{fromPage: 'p_saler_home',fromItemIndex: 0}
     * */
    setTrackNew: async (trackId, paraObj, coverObj) => {
        if (!trackId) {
            return false;
        }
        // 组装埋点数据
        // paraObj:扩展参数、trackId:track_id、trackInfo:接口下发的基础参数
        let moreInfo = {
            screen_height: commonFun.ScreenHeight(),
            screen_width: commonFun.ScreenWidth(),
            device_type: commonFun.getDevice().device,
            os: commonFun.getOS().os,
            os_version: commonFun.getOS().os_version,
            browser: commonFun.getBrowse().browser,
            browser_version: commonFun.getBrowse().browser_version
        };
        if (coverObj) {
            Object.assign(moreInfo, coverObj);
        }
        let trackLocal = store.state.trackCommon;
        let trackInfo = {};
        let backendApi = '';
        if (trackLocal.backendApi) {
            // 本地如果能拿到值
            trackInfo = trackLocal.info;
            backendApi = trackLocal.backendApi;
        } else {
            let result = await store.dispatch('getTrackCommon');
            if (result) {
                trackInfo = result.info;
                backendApi = result.backendApi;
            }
        }
        let trackAll = Object.assign({}, moreInfo, trackInfo)
        let ex = {
            ini_params: trackAll
        }
        let trackExtr = ex
        if (paraObj) {
            trackExtr = Object.assign({}, paraObj, ex)
        }
        let trackData = {
            extrack_arr: trackExtr,
            track_id: trackId
        }
        // 请求埋点接口
        trackAxios.post(backendApi + '/send-data/index', trackData).then((res) => {
        }).catch((err) => {
            console.log(err);
        })
    },
    /*
     * 公共埋点方法---有顶部导航的埋点方法，通用埋点信息从导航api获取
     * params（埋点ID，扩展字段（根据不同埋点的一些特殊字段))
     * */
    setTrackMenu: (trackId, paraObj) => {
        if (!trackId) {
            return false;
        }
        // 组装埋点数据
        // paraObj:扩展参数、trackId:track_id、trackInfo:接口下发的基础参数
        let moreInfo = {
            screen_height: commonFun.ScreenHeight(),
            screen_width: commonFun.ScreenWidth(),
            device_type: commonFun.getDevice().device,
            os: commonFun.getOS().os,
            os_version: commonFun.getOS().os_version,
            browser: commonFun.getBrowse().browser,
            browser_version: commonFun.getBrowse().browser_version
        }
        let trackAll = Object.assign({}, moreInfo, store.state.trackMessages)
        let ex = {
            ini_params: trackAll
        }
        let trackExtr = ex
        if (paraObj) {
            trackExtr = Object.assign({}, paraObj, ex)
        }
        let trackData = {
            extrack_arr: trackExtr,
            track_id: trackId
        }
        // 请求埋点接口
        trackAxios.post(store.state.backendApi, trackData).then((res) => {
        }).catch((err) => {
            console.log(err)
        })
    },
    /**
     * base64图片转为blob
     * @param {string} base 参数描述 base64串
     * return blob对象
     */
    base64ToBlob(base) {
        let parts = base.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {
            type: contentType
        });
    }
};

export {
    commonFun
};
