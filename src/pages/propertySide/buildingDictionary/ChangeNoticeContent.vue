<!--
    @name: 变更通知内容
    @description: 变更通知内容模块
    @author: 贺伟
    @date: 2019-11-14
-->
<template>
    <div class="notice-wrap">
        <div class="textarea">
            <el-input
                type="textarea"
                :autosize="{ minRows: 15, maxRows: 18}"
                placeholder="请输入内容"
                v-model="noticeVal">
            </el-input>
            <div
                class="el-form-item__error"
                v-show="showMsg">
                最多可输入5000字
            </div>
        </div>
        <div class="notice-msg">
            <h5 class="title">注意事项：</h5>
            <span>1.系统会记录发布时间，但是信息的获取时间和信息的有效时间需要强调的一定要说明</span>
        </div>
        <div
            class="image-list"
            v-if="imgList.length > 0">
            <div
                class="image-box"
                v-for="(item, index) in imgList"
                @click="showPreview(index)"
                :key="index">
                <i
                    @click="delImage(index)"
                    class="iconfont iconicon-delete"
                    aria-hidden="true"></i>
                <div>
                    <img
                        :src="item.fileURL"
                        alt="效果图">
                </div>
            </div>
        </div>
        <!-- 图片上传 -->
        <div class="upload-wrap">
            <jl-file-upload
                ref="uploadImg"
                upID="noticeUploadImg"
                :ossData="ossData"
                :isMulti="true"
                :limit="10 - imgList.length"
                @getFileURL="getFileURL">
                <el-button type="primary" class="btn-upload-box">点击上传</el-button>
            </jl-file-upload>
            <div class="img-hint">
                还可以上传{{10 - imgList.length}}张图片、图片类型必须为gif,png,jpg,jpeg,大小在10M以内
            </div>
        </div>
        <!-- 上传 -->
    </div>
</template>

<script>
    export default {
        name: 'ChangeNoticeContent',
        props: {
            // 请求阿里地址返回的数据
            ossData: {
                type: Object,
                default: () => {}
            },
            // oss信息包含OSS_ACCESS_ID，OSS_ACCESS_KEY
            ossConf: {
                type: Object,
                default: () => {}
            },
            // 默认展示内容
            content: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                // 模块loading
                loading: false,
                // 图片信息
                imgList: [],
                // 通知信息值
                noticeVal: '',
                // 文件信息
                fileList: [],
                // 动态限制数量
                limit: 10,
                // 固定限制数量
                fixLimit: 10
            }
        },
        watch: {
            // 默认值改变赋值到文本框
            content(newVal) {
                this.noticeVal = newVal;
            }
        },
        computed: {
            // 是否展示超出5000提示框
            showMsg() {
                return this.noticeVal.trim().length > 5000;
            }
        },
        methods: {
            /**
             * 获取文件
             * @param {String} fileList 文件列表
             * @return
             */
            getFileURL (fileList) {
                fileList.forEach(imgItem => {
                    if (this.imgList.find(ele => ele.originName === imgItem.originName)) {
                        this.$message('已过滤掉重复图片');
                    } else {
                        this.imgList.push(imgItem);
                    }
                })
            },
            /**
             * 获取文件
             * @param {String} fileList 文件列表
             * @param {String} type 文件类型
             * @return
             */
            getFileURLCopy (fileList, type) {
                // 关闭加载loading
                this.loading = false;
                // 如果返回文件列表长度为0
                if (fileList.length === 0) {
                    this.$message('上传失败,请重新上传');
                    return;
                }
                // 是否有重复文件标志
                let isReapteFlag = false;
                if (type === 'img') {
                    fileList.forEach(imgItem => {
                        if (this.imgList.find(ele => ele.originName === imgItem.originName)) {
                            isReapteFlag = true;
                        } else {
                            this.imgList.push(imgItem);
                        }
                    });
                } else if (type === 'file') {
                    fileList.forEach(imgItem => {
                        if (this.fileList.find(ele => ele.originName === imgItem.originName)) {
                            isReapteFlag = true;
                        } else {
                            this.fileList.push(imgItem);
                        }
                    });
                }
                // 判断是否有重复文件
                if (isReapteFlag) {
                    this.$message('已过滤掉重复文件');
                }
                // 判断上传限制变量
                let listNum = this.imgList.length + this.fileList.length;
                if (listNum >= this.fixLimit) {
                    this.limit = 0;
                    // 截取
                } else  {
                    this.limit = this.fixLimit - listNum;
                }
            },
            /**
             * 预览大图
             * @param {number} index 当前点击图片的索引
             */
            showPreview(index) {
                this.$emit('lookOver', this.imgList[index].fileURL)
            },
            /**
             * 删除图片或者文件
             * @param {number} index 删除图片的索引
             * @param {String} type img-图片，file-文件
             */
            delImage(index, type) {
                this.imgList.splice(index, 1);
                // if (type === 'file') {
                //     this.fileList.splice(index, 1);
                // } else {
                //     this.imgList.splice(index, 1);
                // }
                // this.limit++;
                event.stopPropagation();
            },
            // 表单验证
            validForm() {
                // 图片和文件放一个字段里面
                // notify_imgs: lists.map(ele => ele.upURL)
                this.imgList.concat(this.fileList);
                return {
                    successful: this.noticeVal.trim().length > 0 && !this.showMsg,
                    formInfo: {
                        notify_content: this.noticeVal.trim(),
                        notify_imgs: this.imgList.map(ele => ele.upURL)
                    }
                };
            }
        }
    }
</script>

<style lang="less" scoped>
    .notice-wrap{
        padding-left: 20px;
        position: relative;
        &::before{
            content: '*';
            position: absolute;
            top: 0;
            left: 5px;
            z-index: 1;
            color: #ff0000;
        }
        .textarea{
            display: flex;
            position: relative;
            .required-icon{
                color: #ff0000;
                width: 20px;
            }
        }
        .notice-msg{
            margin-top: 10px;
            padding: 15px 0;
            >.title{
                font-size: 14px;
                line-height: 26px;
            }
            .upload-tip-box {
                margin-top: 10px;
            }
        }
    }
    .image-list{
        padding: 15px 10px;
        overflow: hidden;
        .file-box {
            margin-right: 30px;
            color: #000;
            &:last-of-type {
                margin-right: 0;
            }
            .btn-delete {
                margin-left: 10px;
                color: #409eff;
                cursor: pointer;
            }
        }
        .image-box{
            width: 150px;
            height: 100px;
            border: 2px solid #eee;
            position: relative;
            float: left;
            margin: 5px;
            img {
                max-width: 100%;
                max-height: 100%;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
            }
            i {
                position: absolute;
                top: -6px;
                right: -8px;
                font-size: 16px;
                cursor: pointer;
                z-index:1;
            }
        }
    }
    .file-list {
        display: flex;
    }
    /deep/.upload-wrap{
        display: inline-block;
        margin-right: 20px;
        overflow: hidden;
        &:last-of-type {
            margin-right: 0;
        }
        .upload-box {
            width: 80px;
        }
        .img-hint{
            margin-left: 5px;
            line-height: 32px;
        }
    }
    .btn-upload-box {
        font-size: 12px;
        padding: 9px 15px;
    }
</style>