/*
 * @author: hewei
 * @Date: 2021-04-14 09:42:00
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-06-09 07:28:33
 * @description: file content
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import './public-path';
import {
    axios
} from './assets/js/http/axios'
import store from './store'
import upload from './assets/js/upload/upload.js' // 挂载到vue上面的公共方法

// 引入第三方npm包组件
import './assets/js/utils/npmLib';
// 引入样式初始化文件
import './assets/css/reset.css'
import './assets/fonts/iconfont/iconfont.css'
import './assets/fonts/iconfontNew/fonts/font.css'
import './assets/css/common.css'
// 公共弹窗样式
import './assets/css/dialog.less'
// 引入svg文件
import './assets/fonts/iconSvg';
// 覆盖element样式
import './assets/css/override.less';

Vue.use(upload)
Vue.config.productionTip = false;

// 365预览的域名配置
let host = window.location.host;
if (host === 'backend.julive.com') {
    Vue.prototype.OSSView = '//vip.ow365.cn/?i=20811&ssl=1&furl=';
} else {
    Vue.prototype.OSSView = '//ow365.cn/?i=21495&ssl=1&furl=';
}
// 设置为全局的axios
Vue.prototype.axios = axios

import routes from './router';
import VueRouter from 'vue-router'
Vue.use(VueRouter);
// 声明变量管理
let instance = null
// 导出子应用生命周期 挂载前 挂载后
// 注意，实例化路由时，判断当运行在qiankun环境时，路由要添加前缀，前缀与主应用注册子应用函数genActiveRule("/aaa")内的参数一致**
export async function render(props = {}) {
	const {
		container,
		routerBase
	} = props;
	const router = new VueRouter({
		base: window.__POWERED_BY_QIANKUN__ ? routerBase : '/building',
		mode: 'history',
		routes
	})
	instance = new Vue({
		router,
		store,
		render: (h) => h(App)
	}).$mount(container ? container.querySelector('#app') : '#app');
}
if (!window.__POWERED_BY_QIANKUN__) {
	render()
}
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) {
        return originalPush.call(this, location, onResolve, onReject)
    }
    return originalPush.call(this, location).catch(err => err)
}
export async function bootstrap() {
	console.log('[子应用] vue app bootstraped')
}
export async function mount(props) {
	console.log('[子应用] props from main framework', props)
	render(props)
}
export async function unmount() {
	instance.$destroy()
	instance.$el.innerHTML = ''
	instance = null
}