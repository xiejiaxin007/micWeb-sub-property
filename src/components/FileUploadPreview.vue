<!--
 * @author: hewei
 * @Date: 2021-05-12 09:41:49
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-26 11:01:26
 * @description: 文件上传预览组件 由上传组件和预览组件组合而成
-->
<template>
    <div class="file-upload-preview">
        <jl-file-upload
            class="upload-btn"
            ref="fileUpload"
            v-bind="$attrs"
            :limit="limit"
            :ossData="ossData"
            @beforeUpdate='beforeUpdate'
            @getFileURL='getFileURL'
        >
            <el-button
                type="primary"
                size="small"
                :disabled="limit<=0"
            >
                {{uploadText}}
            </el-button>
            <div
                class="btn-shade"
                @click.stop="()=>{}"
                v-show="limit<=0"
            >
            </div>
        </jl-file-upload>

        <span
            v-if="!$slots.fileNotice"
            class="upload-tips"
        >支持格式{{$attrs.fileType}}，每个附件不超过{{parseInt($attrs.fileMaxSize)}}M，不超过{{maxUpCount}}个附件</span>
        <slot name="fileNotice" />
        <file-preview
            :file-list="fileListPrev"
            can-edit
            @delFile="delFile"
        />
    </div>
</template>

<script>
    import { getSign } from '@/api/commonApi';
    import FilePreview from './FilePreview';
    export default {
        name: 'FileUploadPreview',
        components: {
            FilePreview,
        },
        inheritAttrs: false,
        props: {
            // 上传按钮文案
            uploadText: {
                type: String,
                default: '上传附件',
            },
            // 最大上传数量
            maxUpCount: {
                type: Number,
                default: 10,
            },
            // 已有的文件数据
            /**
             * 数据格式：{file_name: "0.jpg", file_url: "contract/DdDjBEJ6GG.jpg", file_type: "1",file_domain: "https://comjia-1.oss-cn-beijing.aliyuncs.com"}
             */
            fileList: {
                type: Array,
                default: () => [],
            },
            // 上传文件的路径
            uploadUrl: {
                type: String,
                default: 'followUp',
            },
        },

        data() {
            return {
                // 上传数据
                fileArr: [],
                // oss配置
                ossData: {},
                // 文件限制数量 根据已上传数量会变化,上传一个会减少1直到为0不可上传
                limit: this.maxUpCount,
            };
        },
        computed: {
            fileListPrev() {
                return this.fileArr.map(ele => {
                    return {
                        ...ele,
                        // 半链接
                        file_url: ele.file_domain ? `${ele.file_domain}${ele.file_url.startsWith('/') ? ele.file_url : '/' + ele.file_url}` : ele.file_url_full,
                    };
                });
            },
        },
        watch: {
            // 监听文件数量改变
            limit() {
                this.$emit('fileChange', this.fileArr);
            },
            // 文件列表集合
            fileList(newVal) {
                this.fileArr = [...newVal];
                this.limit = this.maxUpCount;
                this.limit -= newVal.length;
            },
        },
        mounted() {
            // 获取阿里云签名
            this.getSignCode();
        },
        methods: {
            // 获取阿里云上传签名
            async getSignCode() {
                let params = {
                    cate: this.uploadUrl,
                };
                try {
                    let { data } = await getSign(params);
                    if (data.code === 0) {
                        this.ossData = Object.freeze(data.data);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 上传之前
            beforeUpdate() {
                this.loading = this.$loading({
                    lock: true,
                    text: '请求中，请稍后',
                    spinner: 'el-icon-loading',
                    customClass: 'loading-default-box',
                    background: 'rgba(255, 255, 255, 0.8)',
                });
            },
            /**
             * 获取文件
             * @param {String} fileList 文件列表
             * @return
             */
            getFileURL(fileList) {
                // 关闭加载loading
                this.loading.close();
                // 如果返回文件列表长度为0
                if (fileList.length === 0) {
                    this.$message('上传失败,请重新上传');
                    return;
                }
                let imgType = 'jpg,png,jpeg,gif';
                fileList.forEach(file => {
                    // 获取文件后缀
                    const suffix = file.originName.substr(file.originName.lastIndexOf('.') + 1).toLowerCase();
                    let obj = {
                        // 文件名
                        file_name: file.originName,
                        // 半链接
                        file_url: file.upURL,
                        // 全链接 eg:/followUp/2021524/2021524144632_ttcq.jpeg"
                        file_url_full: file.fileURL,
                        // 文件全路径
                        file_type: imgType.indexOf(suffix) !== -1 ? '1' : '2',
                    };
                    // 判断是否已经存在重复的文件
                    const fileHasRepeat = arr => {
                        return arr.some(item => item.file_name === file.originName);
                    };
                    if (fileHasRepeat(this.fileArr)) {
                        this.$message('上传文件重复，请检查！');
                        return;
                    }
                    this.fileArr.push(obj);
                    this.limit--;
                });
            },
            /**
             * 删除文件
             * @param {String} type 文件类型
             * @param {String} index 文件下标
             * @return
             */
            delFile(idx) {
                this.fileArr.splice(idx, 1);
                this.limit++;
            },
        },
    };
</script>

<style lang="less" scoped>
.color-error {
    color: #f56c6c;
}
.file-show-box {
    .file-list {
        .preview-file {
            color: #00f;
            text-decoration: underline;
            margin: 0 10px;
        }
    }
    .img-list {
        margin-top: 16px;
        li {
            position: relative;
            float: left;
            width: 100px;
            height: 100px;
            text-align: center;
            margin-right: 12px;
            .img-item-box {
                width: 100%;
                height: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #eee;
                img {
                    max-width: 100%;
                    max-height: 100%;
                }
            }
        }
    }
}
/deep/.input-text-box {
    .el-form-item__content {
        width: 500px;
    }
}
.upload-btn {
    display: inline-block;
    margin-right: 20px;
}
.upload-tips {
    color: #888;
}

.btn-shade {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 2;
    cursor: pointer;
}
</style>