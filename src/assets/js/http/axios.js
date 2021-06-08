import axiosApi from 'axios'
import qs from 'qs'
import Vue from 'vue'
import router from '../../../router'
import store from '../../../store';
// axios.defaults.withCredentials = true
window.axios = axiosApi;
// 响应时间
let axios = axiosApi.create({
    baseURL: ''
})
axios.defaults.timeout = 30000;
//在main.js设置全局的请求次数，请求的间隙
const retry = 3;
const retryDelay = 1000;
// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 新建一个axios请求，可用于上传图片等请求，需要时可以将instance输出
var instance = axiosApi.create({
    baseURL: '',
    timeout: 5000,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
// 新建埋点请求
let trackAxios = axiosApi.create({
    baseURL: '',
    timeout: 5000
})
trackAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// post请求参数序列化
trackAxios.interceptors.request.use((config) => {
    // 在发送请求之前做某件事
    if (config.method === 'post') {
        config.data = qs.stringify(config.data)
    }
    return config
}, (error) => {
    console.log('错误的传参', 'fail')
    return Promise.reject(error)
})
// 新建超时请求
let TimeAxios = axiosApi.create({
    baseURL: '',
    timeout: 10000
})
TimeAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// post请求参数序列化
TimeAxios.interceptors.request.use((config) => {
    // 在发送请求之前做某件事
    if (config.method === 'post') {
        config.data = qs.stringify(config.data)
    }
    return config
}, (error) => {
    console.log('错误的传参', 'fail')
    return Promise.reject(error)
})
// 配置接口地址
var dataUrl = window.location.host;
let environment = process.env.NODE_ENV
if (environment === 'production') {
    // 根据环境来设置baseUrl   api_url
    axios.defaults.baseURL = '//' + dataUrl
    // 设置baseURL
    trackAxios.defaults.baseURL = ''
} else {
    // 根据实际情况修改
    axios.defaults.baseURL = ''
    // 设置baseURL
    trackAxios.defaults.baseURL = ''
}

// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    // 在发送请求之前做某件事
    // 如果设置了请求头为json，则不需要进行qs转化
    if (config.method === 'post' && config.headers['Content-Type'] !== 'application/json') {
        config.data = qs.stringify(config.data)
    }
    /* else if (config.method === 'get') {
       config.params = {
         redirect_url: window.location.href.split('#')[1],
         ...config.params
       }
     } */
    return config
}, (error) => {
    console.log('错误的传参', 'fail')
    return Promise.reject(error)
})

// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use(response => {
    if (response.data.code === 1107) {
        // 未登录
        if (process.env.NODE_ENV === "development") {
            router.push({
                path: '/login'
            })
            return
        }
        if (response.data.data.type === 1) {
            router.push({
                path: '/login',
                query: {
                    errorInfo: 'login'
                }
            })
        } else if (response.data.data.type === 2) {
            let currentUrl = window.location.pathname + '' + window.location.search
            window.location.href = response.data.data.url + '&redirect_url=' + encodeURIComponent(currentUrl);
        }
    } else if (response.data.code === 1429) {
        // 接口请求次数过多的限制(1分钟300-400次)，后台动态配置
        store.dispatch('get_xhr_timeout', {
            time: new Date().getTime(),
            msg: response.data.msg
        });
        
    } else if (response.data.code === 1118 || response.data.code === 20001) {
        // 安全密码校验和vpn验证
        window.location.href = response.data.data.url
    } else if (response.data.code === 1012) {
        // alert(response.data.msg)
        Vue.prototype.$message.error(response.data.msg);

    } else if (response.data.code === 1014 || response.data.code === 1015) {
        // 没有权限进入系统,1014为菜单为空，1015为未知角色
        router.push({
            path: '/noPermissions'
        })
    } else {
        // router.push({path: '/errorDev', query: {errMsg: response.data.errMsg}})
    }
    return response
}, error => {
    // Do something with response error
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        let config = error.config;
        // 没有config则reject
        if(!config || !retry) return Promise.reject(error);
        config.__retryCount = config.__retryCount || 0;
        // 判断是否已经超过重新请求次数
        if(config.__retryCount >= retry) {
            store.dispatch('net_timeout', true);
            return Promise.reject(error);
        }
        config.__retryCount += 1;
        // 设置重新请求promise
        let backOff = new Promise(function(resolve) {
            setTimeout(function() {
                resolve();
            }, retryDelay || 1);
        });
        return backOff.then(function() {
            return axios(config);
        });
    } else {
        store.dispatch('net_timeout', false)
        console.warn('axios response error')
        return Promise.reject(error)
    }
})

export {
    axios,
    trackAxios,
    TimeAxios,
    instance
}
