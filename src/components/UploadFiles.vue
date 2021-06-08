<!--
 * @author: xiejiaxin
 * @Date: 2020-11-19 14:49:46
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-02-22 15:11:22
 * @description: 上传组件（put上传方式）
-->
<template>
    <div class="uploader-wrapper"
        @click="triggerUpload">
        <slot></slot>
        <input type="file"
            v-show="false"
            ref="filElem"
            :accept="acceptStr"
            :multiple="multiple"
            @change="upload" />
    </div>
</template>
<script>
export default {
    name: 'upload-files',
    props: {
        // 
        // 上传个数限制
        limit: {
            type: Number,
            default: 10,
            validator: (value) => {
                // 必须是数字型字符串
                return value > 0;
            }
        },
        // 上传类型限制
        limitType: {
            type: Array,
            default: () => {
                return [];
            },
        },
        // 单个文件大小限制
        limitSize: {
            type: Number,
            default: 10,
            validator: (value) => {
                // 必须是数字型字符串
                return value > 0;
            }
        },
        // 是否自动上传
        autoUpload: {
            type: Boolean,
            default: true
        },
        // 是否多选
        multiple: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 上传的文件数组
            fileList: [],
        };
    },
    computed: {
        // 可接受的文件类型转化
        acceptStr() {
            let str = this.limitType.join(',');
            return str;
        }
    },
    methods: {
        // 触发input的点击事件
        triggerUpload() {
            // 清空input file值，否则无法上传同一个文件
            this.$refs.filElem.value = '';
            this.fileList = [];
            this.$refs.filElem.dispatchEvent(new MouseEvent('click'));
        },
        /**
         * @description: 开始文件上传函数
         * @param {Object} file 要上传的文件
         * @param {Object} client oss对象
         * @param {String} host 上传文件的域名
         * @param {String} dir 上传文件的目录
         * @return {Object} promise 
         */
        uploadFile(file, client, dir, host) {
            let option = {
                file: file
            };
            let params = {
                client: client,
                dir: dir,
                host: host
            };
            return this.ossUploadFile(params, option);
        },
        /**
         * @description: input的change事件
         * @param {Object} e 事件对象
         */
        async upload(e) {
            const ev = e || window.event;
            const files = ev.target.files;
            let limitArr = [];
            // 文件个数校验
            if (files.length > this.limit) {
                this.$message.warning(`最大上传${this.limit}个文件`);
                return false;
            }
            // 文件属性校验
            files.forEach(file => {
                limitArr.push(this.validateFile(file));
            });
            let flag = limitArr.every(v => {
                return v;
            });
            // 文件数组中有任意一个false，则不通过
            if (!flag) {
                return false;
            }
            // 添加loading
            this.$emit('beforeUpload', files);
            // 如果是自动上传，则直接调起上传方法
            if (this.autoUpload) {
                this.doUpload(files);
            }
        },
        async doUpload(files) {
            // 传入的数组为空，return
            if (!files || files.length === 0) {
                this.$emit('fail');
                return false;
            }
            let client;
            let host = '';
            let dir = '';
            let promiseArr = [];
            // 开始上传
            try {
                const result = await this.createOssClient();
                // 如果返回的是false，则说明oss对象实例化失败
                if (!result || !result.client) {
                    this.$emit('fail');
                    return false;
                }
                client = result.client;
                host = result.host;
                dir = result.dir;
            } catch (error) {
                // 失败
                this.$emit('fail');
                return false;
            }
            // 组装要上传的promise队列
            files.forEach(item => {
                promiseArr.push(this.uploadFile(item, client, dir, host));
            });
            Promise.allSettled(promiseArr).then((result) => {
                // 过滤掉失败的promise
                const fulfillRes = result.filter(item => item.status === 'fulfilled');
                fulfillRes.forEach(item => {
                    // 组装数据
                    if (item && item.value) {
                        const { name, res, file} = item.value;
                        let upFile = {
                            url: name,
                            fullUrl: `${host}${res.requestUrls[0]}`,
                            name: file.name,
                            size: file.size,
                            extension: file.name.substr(file.name.lastIndexOf('.') + 1)
                        };
                        this.fileList.push(upFile);
                    }
                });
                this.$emit('success', this.fileList);
                this.fileList = [];
            });
            //.catch(err => {
            //     console.log(err)
            //     // 失败
            //     this.$emit('fail');
            //     this.fileList = [];
            // });
        },
        /**
         * @description: 文件属性校验
         * @param {Array} file 上传的文件
         * @return {Boolean} flag 是否校验通过
         */
        validateFile(file) {
            const { name, size } = file;
            // 默认单位是字节
            const sizeErr = size / (1024 * 1024) < this.limitSize;
            const nameArr = name.split('.');
            // 后缀名
            const extensionName = nameArr[nameArr.length - 1].toLowerCase();
            
            const typeErr = this.limitType.length > 0 && !this.limitType.includes(`.${extensionName}`);
            // 限制文件大小
            if (!sizeErr) {
                this.$message(`上传的单个文件不能超过${this.limitSize}M，请重新上传！`);
                return false;
            }
            // 限制文件类型
            if (typeErr) {
                // 设置自定义类名，多行文本window电脑上出现文字上下有些重合
                this.$message({
                    message: `请上传文件类型为${this.limitType.join('，')}的文件`,
                    customClass: 'pop-msg-box'
                })
                return false;
            }
            return true;
        }
    },
};
</script>