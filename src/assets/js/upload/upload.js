import moment from 'moment'
const OSS = require('ali-oss');
import api from '@/api/commonApi.js';
import { commonFun } from '@/assets/js/utils/utils';
class Methods {
    install(Vue, options) {
		this.installPrototype(Vue)
        this.filters(Vue)
	}
	installPrototype(Vue) {
        /**
         * 上传文件
         * @param {Object} option 文件具体 file 文件 needUrl 需要文件完整路径
         * @returns {Promise.<TResult>}
         */
		Vue.prototype.ossUploadFileFromOss = (option) => {
            return new Promise((resolve, reject) => {
				let file = option ? option.file : '';
				// 判断是否有要上传的文件
				if (!file) {
					reject('没有要上传的文件');
					return false;
				}
				// 执行上传
                Vue.prototype.createOssClient().then(async (params) => {
					try {
						const upResult = await Vue.prototype.ossUploadFile(params, option);
						resolve(upResult);
					} catch (error) {
						reject(error);
					}
                });
            })
		};
		/**
		* 上传文件--传入OSS实例化对象
		* @param {Object} params oss对象以及oss相关信息
		* @param {Object} option 文件具体 file 文件 needUrl 需要文件完整路径
		* @returns {Promise.<TResult>}
		*/
	   Vue.prototype.ossUploadFile = (params, option) => {
		   return new Promise((resolve, reject) => {
			   let file = option ? option.file : '';
			   // 判断是否有要上传的文件
			   if (!file) {
					reject('没有要上传的文件');
					return false;
			   }
			   let date = moment().format('YYYYMMDD') // 当前时间
			   let dateTime = moment().format('YYYYMMDDhhmmss') // 当前时间
			   let randomStr = commonFun.random_string(4); //  4位随机字符串
			   let extensionName = file.name.substr(file.name.lastIndexOf('.') + 1) // 文件扩展名
			   let fileName = '/' + date + '/' + dateTime + '_' + randomStr + '.' + extensionName // 文件名字（相对于根目录的路径 + 文件名）
			   // 执行上传
			   if (!params) {
					reject('参数传递错误');
					return false;
			   }
			   const { client, dir, host } = params;
			   if (!client) {
					reject('参数传递错误');
					return false;
			   }
				// 判断如果后台返回了目录
				fileName = dir ? ('/' + dir + fileName) : fileName;
				// 分片上传文件
				client.multipartUpload(fileName, file, {
					progress: function (p) {
						let e = {}
						e.percent = Math.floor(p * 100)
						if (option && option.onProgress) {
							option.onProgress(e)
						}
					}
				}).then((val) => {
					if (val.res.statusCode === 200) {
						if (val.res.requestUrls[0].indexOf('?') > -1) {
							val.res.requestUrls[0] = '/' + dir + val.res.requestUrls[0].split('?')[0].split('/' + dir)[1]
						} else {
							val.res.requestUrls[0] = '/' + dir + val.res.requestUrls[0].split('/' + dir)[1]
						}
						if (option && option.onSuccess) {
							option.onSuccess(val)
						}
						val.host = host;
						val.file = file;
						resolve(val);
					} else {
						reject('上传失败');
					}
				}, err => {
					reject(err);
				})
		   })
	   };
		/**
		 * @description: 文件下载并且重命名
		 * @param {Object} file
		 * @param {Object} file.url
		 * @param {Object} file.name
		 */
		Vue.prototype.downloadFileFromOss = async (fileName, fileExt, fileUrl) => {
			if (!fileUrl) return false;
			return new Promise((resolve, reject) => {
				Vue.prototype.createOssClient().then(res => {
					const url = Vue.prototype.downloadUrl(res.client, fileName, fileExt, fileUrl);
					resolve(url);
				});
			})
		}
		/**
		 * @description: 下载的公共方法
		 * @param {Object} client oss对象
		 * @param {String} fileName 文件重命名名字
		 * @param {String} fileExt 文件后缀
		 * @param {String} fileUrl 文件存放路径
		 * @return {String} 下载的url
		 */
		Vue.prototype.downloadUrl = (client, fileName, fileExt, fileUrl) => {
			// 判断是否传入了client或者是fileUrl
			if (!client || !fileUrl) return false;
			if (typeof client.signatureUrl !== 'function') return false;
			const response = {
					'content-disposition': `attachment;filename=${encodeURIComponent(fileName)}.${fileExt}`
			}
			// object-key表示从OSS下载文件时需要指定包含文件后缀在内的完整路径，例如abc/efg/123.jpg。
			const url = client.signatureUrl(fileUrl, { response });
			return url;
		}
		/**
		 * 创建阿里云oss 实例
		 */
		Vue.prototype.createOssClient = async () => {
            let client;
            try {
                const {
                    data: { code, data }
				} = await api.getOssSign();
                if (code === 0) {
                    let region = '';
					let bucket = '';
					// const reg = /^((https|http|):\/\/)+([\w-])*(\w)+[.]+([\w-.])*(\w|\w\/)+$/;
                    if (data.host) {
                        bucket = data.host.split('.')[0].split('//')[1];
                        region = data.host.split('.')[1];
						client = new OSS({
							region: region,
							accessKeyId: data.AccessKeyId,
							accessKeySecret: data.AccessKeySecret,
							bucket: bucket,
							stsToken: data.SecurityToken
						});
						let obj = {
							client: client,
							host: data.host,
							dir: data.dir
						}
						return obj;
					}
				}
				return false;
            } catch (error) {
				console.log(error);
				return false;
            }
		};
	}
    /* ------------------添加vue实例方法------------------ */
	filters(Vue) {
		/**
		 * @param {type} value 传入数字类型 例如 1000223
		 * @param {type} currency 金额前面符号 默认¥
		 * @param {type} decimals 保留小数位数 默认2位
		 * @description: 格式化金额
		 * @return 格式化后的 例如 ¥1,000,223.00
		 */
		Vue.filter('currency', function (value, currency, decimals) {
			const digitsRE = /(\d{3})(?=\d)/g
			currency = currency || '¥'
			decimals = decimals || 2
			value = parseFloat(value)
			if (!isFinite(value) || (!value && value !== 0)) {
				return ''
			}
			// 判断保留小数位数必须是整数
			if (!Number.isInteger(decimals)) return '';
			let stringified = Math.abs(value).toFixed(decimals)
			let _int = stringified.slice(0, -1 - decimals);
			let i = _int.length % 3
			let head = i > 0 ? (_int.slice(0, i) + (_int.length > 3 ? ',' : '')) : ''
			let _float = stringified.slice(-1 - decimals);
			let sign = value < 0 ? '-' : ''
			return sign + currency + head +
				_int.slice(i).replace(digitsRE, '$1,') +
				_float
		})
	}
}
export default new Methods()
