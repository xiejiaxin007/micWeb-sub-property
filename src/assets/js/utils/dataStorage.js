// 本地存储数据
const dataStorage =  {
    // 设置数据存储 （暂时使用实例化中的数据）
    setStorage(storageKey, data) {
        if (data === '' || data === null || data === undefined) {
            return false;
        }
        const storageVal = {
            createTime: new Date().getTime(), // 创建时间
            oData: data
        };
        const storageStr = JSON.stringify(storageVal);
        localStorage.setItem(storageKey, storageStr);
    },
    // 简单设置本地存储
    setStorSimple(storageKey, data) {
        if (data === '' || data === null || data === undefined) {
            return false;
        }
        const storageStr = JSON.stringify(data);
        localStorage.setItem(storageKey, storageStr);
    },
    // 获取的数据
    getStorage(storageKey) {
        if (!localStorage.getItem(storageKey)) return false;
        const storageStr = localStorage.getItem(storageKey);
        return JSON.parse(storageStr);
    },
    // 是否已经过期 ，false=已过期
    isFresh(storageKey, outtime) {
        const createTime = this.getStorage(storageKey).createTime;
        if (!createTime) {
            return true;
        }
        const outtimes = outtime || 86400000; // 默认过期时间24*60*60*1000; 1天时间
        const newTime = new Date().getTime();
        return newTime - createTime < outtimes;
    },
    setCookie(key, val) {
        let cdata = key + '=' + val;
        let d = new Date();
        d.setHours(d.getHours() + 1);
        cdata += '; expires=' + d.toGMTString() + 'path=/';
        document.cookie = cdata;
    },
    getCookie(key) {
        let arr,
            reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    delCookie(key) {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = dataStorage.getCookie(key);
        if (cval != null) {
            document.cookie = key + '=' + cval + ';expires=' + exp.toGMTString();
        }
    }
    
};
export default dataStorage;