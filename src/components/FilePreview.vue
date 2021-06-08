<!--
 * @author: hewei
 * @Date: 2021-05-13 10:18:00
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-26 11:01:36
 * @description: 文件预览组件，可以展示，预览图片和文档 图片使用的element预览组件，文档是365打开
-->
<template>
    <div class="file-list-view">
        <div class="file-show-box">
            <!-- 文件展示 -->
            <ul
                class="file-list"
                v-if="docFileArr.length > 0"
            >
                <li
                    v-for="(item, index) in docFileArr"
                    :key="index"
                >
                    <a
                        :href="OSSView + item.file_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="preview-file"
                    >
                        <span>{{item.file_name}}</span></a>
                    <el-button
                        v-if="canEdit"
                        type="text"
                        class="color-error"
                        @click="delFile('file', index)"
                    >删除</el-button>
                </li>
            </ul>
            <!-- 图片展示 -->
            <ul
                class="img-list clearfix"
                v-if="imgFileArr.length > 0"
            >
                <li
                    v-for="(item, index) in imgFileArr"
                    :key="index"
                >
                    <div class="img-item-box">
                        <img
                            :src="item.file_url"
                            alt="图片凭证"
                            @click="showPreview(index)"
                        >
                    </div>
                    <i
                        v-if="canEdit"
                        aria-hidden="true"
                        class="ico-close el-icon-error"
                        @click="delFile('img', index)"
                    ></i>
                </li>
            </ul>
        </div>
        <!-- 图片预览查看器 -->
        <jl-image-preview
            v-if="photoIsShow"
            :showViewer="photoIsShow"
            :urlList="previewUrl"
            :currentIndex="curIndex"
            @closeViewer="closeViewer"
        >
        </jl-image-preview>
    </div>
</template>

<script>
    export default {
        name: 'FilePreview',
        props: {
            // 文件列表
            // 文件列表为对象数组  内对象格式为{file_name: 'xxx', file_type: '1', file_file_url} file_url为全链接
            fileList: {
                type: Array,
                default: () => [],
            },
            // 类型 是否可删除
            canEdit: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                // 文件数组
                docFileArr: [],
                // 图片数组
                imgFileArr: [],
                // 图片预览是否展示
                photoIsShow: false,
                // 要图片预览的url数组
                previewUrl: [],
                // 要预览的图片索引
                curIndex: 0,
            };
        },
        watch: {
            fileList(newArr) {
                this.handleFileList(newArr);
            },
        },
        methods: {
            /**
             * @description 处理文件数组 将其分为图片好文档文件
             */
            handleFileList(fileList) {
                this.docFileArr = [];
                this.imgFileArr = [];
                fileList.forEach(ele => {
                    if (ele.file_type === '1') {
                        this.imgFileArr.push(ele);
                    } else if (ele.file_type === '2') {
                        this.docFileArr.push(ele);
                    }
                });
            },
            /**
             * 删除文件
             * @param {String} type 文件类型
             * @param {String} index 文件下标
             * @return
             */
            delFile(type, index) {
                let idx;
                if (type === 'file') {
                    idx = this.fileList.findIndex(ele => ele.file_url === this.docFileArr[index].file_url);
                    this.docFileArr.splice(index, 1);
                } else if (type === 'img') {
                    idx = this.fileList.findIndex(ele => ele.file_url === this.imgFileArr[index].file_url);
                    this.imgFileArr.splice(index, 1);
                }

                this.$emit('delFile', idx);
            },
            // 获取所有文件
            // getFileList() {
            //     return [...this.docFileArr, ...this.imgFileArr];
            // },
            /**
             * 图片预览
             * @param {String} previewUrl 预览图片url
             * @return
             */
            showPreview(index) {
                this.photoIsShow = true;
                this.curIndex = index;
                this.previewUrl = this.imgFileArr.map(ele => ele.file_url);
            },
            // 关闭大图预览
            closeViewer() {
                this.photoIsShow = false;
                // 清空预览url
                this.previewUrl = [];
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
    .ico-close {
        position: absolute;
        display: block;
        font-size: 18px;
        top: -9px;
        right: -10px;
        color: #f56c6c;
        cursor: pointer;
    }
}
</style>