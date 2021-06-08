<!--
 * @author: kangxue
 * @Date: 2020-11-20 10:04:17
 * @LastEditors: kangxue
 * @LastEditTime: 2021-03-18 10:44:38
 * @description: 楼盘资料库
-->
<template>
    <div class="el-row">
        <el-col :span="24"
            class="content-main">
            <el-breadcrumb class="bread-crumb-box"
                separator-class="el-icon-arrow-right">
                <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
                <el-breadcrumb-item><a :href="projectListUrl">楼盘列表</a></el-breadcrumb-item>
                <el-breadcrumb-item>楼盘资料库</el-breadcrumb-item>
            </el-breadcrumb>
            <!--搜索区域-->
            <div class="v-box form-table-box">
                <div class="hd">
                    <h2>楼盘资料库</h2>
                </div>
                <el-breadcrumb class="bread-crumb-box"
                    separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ name: 'buildingDataBank', query: { projectId: $route.query.projectId, pId: item.id }}"
                        v-for="item in dirNav"
                        :key="item.id">{{item.name}}</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="search-box">
                    <span>文件名称：</span>
                    <el-input v-model.trim="fileName"
                        placeholder="搜索楼盘资料"
                        maxLength="20"
                        clearable
                        @clear="search">
                    </el-input>
                    <el-button type="primary"
                        @click="search">搜索</el-button>
                </div>
                <!--表格展示区域-->
                <table-pagination :total="totalNum"
                    :page="currentPage"
                    :pageSize="pageSize"
                    @pageChange="doSearch">
                    <template v-slot:btns>
                        <el-button type="danger"
                            v-if="isEdit"
                            @click="batchDeleteFile">批量删除</el-button>
                        <down-load :file="multipleSelection"
                            v-if="isEdit || isView"
                            class="download-wrapper"
                            ref="downloadAll"
                            :multiple="true">
                            <!-- slot不为trigger表示点击的时候不主动下载 -->
                            <el-button class="btn-info"
                                @click="batchDownLoad">批量下载</el-button>
                        </down-load>
                        <el-button type="primary"
                            v-if="isEdit"
                            @click="addFolder">新建文件夹</el-button>
                        <upload-files v-if="isEdit"
                            @beforeUpload="beforeUpload"
                            @success="successUpload"
                            @fail="failUpload"
                            ref="uploadMul"
                            class="up-wrapper"
                            :limitType="limitType"
                            :limit="10"
                            :limitSize="300"
                            :multiple="true"
                            :auto-upload="false">
                            <el-button class="btn-info"
                                @click="uploadFile">上传</el-button>
                        </upload-files>
                    </template>
                    <template v-slot:table>
                        <el-table ref="multipleTable"
                            border
                            :data="tableList"
                            v-loading="loading"
                            size="small"
                            @sort-change="sortChange"
                            :highlight-current-row="true"
                            :header-cell-style="tableHeaderColor"
                            @selection-change="handleSelectionChange">
                            <el-table-column type="selection"
                                v-if="isEdit || isView"
                                :selectable="selectable">
                            </el-table-column>
                            <el-table-column prop="name"
                                label="文件名称"
                                align="center">
                                <template slot-scope="scope">
                                    <div class="flex-box"
                                        @click="handleClickFile(scope.row, scope.$index)">
                                        <div class="img-icon">
                                            <img :src="require('@/assets/images/fileIcon/icon-' + getIconName(scope.row.ext) +'.png')"
                                                alt="文件类型图">
                                        </div>
                                        <!-- type文件类型 1文件，2文件夹 -->
                                        <div class="file-name">{{scope.row.type === '2' ? scope.row.name : scope.row.name + '.' + scope.row.ext}}</div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="size"
                                label="文件大小"
                                align="center">
                                <template slot-scope="scope">
                                    {{scope.row.size | transferSize}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="creator"
                                label="创建人"
                                align="center">
                            </el-table-column>
                            <el-table-column prop="create_datetime"
                                label="创建时间"
                                sortable="custom"
                                align="center">
                            </el-table-column>
                            <el-table-column prop="updator"
                                label="更新人"
                                align="center">
                            </el-table-column>
                            <el-table-column prop="update_datetime"
                                label="更新时间"
                                sortable="custom"
                                align="center">
                            </el-table-column>
                            <el-table-column label="操作"
                                align="center">
                                <template slot-scope="scope">
                                    <div class="btn-list">
                                        <el-button type="text"
                                            size="small"
                                            v-if="isEdit"
                                            @click="deleteFile(scope.row.id, scope.row.ext, scope.$index)">删除</el-button>
                                        <!-- slot为trigger表示点击的时候主动下载 -->
                                        <!-- 文件夹不能下载 -->
                                        <el-button v-if="(isEdit || isView ) && scope.row.type === '1'"
                                            type="text"
                                            size="small"
                                            slot="trigger"
                                            @click="downlodFile(scope.row, scope.$index)">下载</el-button>
                                        <el-button type="text"
                                            size="small"
                                            v-if="isEdit"
                                            @click="reNameFile(scope.row.id, scope.row.name, scope.row.ext, scope.$index)">重命名</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </table-pagination>
            </div>
        </el-col>
        <!-- 二次确认弹层 ，删除确认 -->
        <confirm-dialog title="提示"
            content="您确定要删除此楼盘资料吗？删除后数据无法恢复，请谨慎操作！"
            :visible="confirmVisible"
            width="460px"
            @cancel="confirmVisible = false"
            @confirm="confirmDelete"></confirm-dialog>
        <!-- 新建文件夹弹窗 -->
        <el-dialog :title="addFolderTitle"
            :visible.sync="folderVisble"
            @close="cancelAddFolder"
            :close-on-click-modal="false"
            width="500px"
            center>
            <el-form :model="folderForm"
                ref="folderForm"
                label-width="100px">
                <el-form-item :label="folderForm.lable + '名称'"
                    prop="name"
                    :rules="[{ required: true, message: folderForm.lable + '名称不能为空', trigger: 'blur' }]">
                    <el-input v-model.trim="folderForm.name"
                        maxLength="20"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="cancelAddFolder">取消</el-button>
                <el-button type="primary"
                    @click="confirmAddFolder">确定</el-button>
            </span>
        </el-dialog>
        <!-- 文件名重复信息弹窗 -->
        <alert-dialog title="提示"
            :visible.sync="fileNameVisible"
            width="600px">
            <div class="file-name-box">
                该位置已存在同名文件{{repeateFileStr}}，请更换其他文件名称
            </div>
        </alert-dialog>
        <!-- 图片预览查看器 -->
        <jl-image-preview v-if="photoIsShow"
            :showViewer="photoIsShow"
            :urlList="previewUrl"
            :currentIndex="previewIndex"
            @closeViewer="closeViewer">
        </jl-image-preview>
    </div>
</template>

<script>
import { ConfirmDialog, TablePagination, AlertDialog } from '@/components';
import UploadFiles from '@/components/UploadFiles.vue';
import DownLoad from '@/components/DownLoad.vue';
import api from './api/dataBankApi.js';
import { fileTypeList } from './config/tabToggleList';
import { commonFun } from '@/assets/js/utils/utils';
export default {
    name: 'building-data-bank',
    components: {
        ConfirmDialog,
        TablePagination,
        UploadFiles,
        DownLoad,
        AlertDialog
    },
    data() {
        return {
            // 重复的文件展示文案
            repeateFileStr: '',
            // 文件名重复弹窗标志
            fileNameVisible: false,
            // 上传文件限制
            limitType: [],
            // 楼盘列表链接
            projectListUrl: '',
            // 编辑权限
            isEdit: false,
            // 查看权限
            isView: false,
            // 楼盘ID
            projectId: this.$route.query.projectId,
            // 父级ID
            pId: this.$route.query.pId || '',
            // 搜索的文件名
            fileName: '',
            // 当前页面
            currentPage: 1,
            // 数据总数
            totalNum: 0,
            // 表格数据
            tableList: [],
            // 表格loading
            loading: false,
            // 每页显示数据
            pageSize: 20,
            // 防止重复提交
            flag: true,
            // 排序类型，默认按照创建时间倒序排列
            sortField: '1',
            // 排序 为空不排序、1-正序、2-倒序
            sort: '2',
            // 表格选中的
            multipleSelection: [],
            // 新建文件夹弹窗标题
            addFolderTitle: '新建文件夹',
            // 新建文件夹弹窗
            folderVisble: false,
            // 新建文件夹表单
            folderForm: {
                // 文件id
                id: '',
                // 文件名
                name: '',
                // 文件夹 || 文件
                lable: '文件夹',
                // 是新建还是重命名
                isAdd: true
            },
            // 文件夹面包屑数组
            dirNav: [],
            // 二次确认弹层信息----是否删除
            confirmVisible: false,
            // 要删除的ID
            deleteId: [],
            // 图片预览
            photoIsShow: false,
            // 图片预览的url
            previewUrl: [],
            // 当前放大图片的索引
            previewIndex: 0,
            // 上传loading
            uploadLoading: null,
            // 上传成功的文件列表
            fileList: [],
            // 是否正在提交
            isSubmit: false,
            // 文件域名
            domain: ''
        };
    },
    mounted() {
        this.getPowerAndUrl();
        this.doSearch(1);
        // 获取能上传的文件格式化类型
        this.limitType = Object.keys(fileTypeList).map(item => {
            return `.${item}`;
        });
        Object.freeze(this.limitType);
        commonFun.setTrackNew(9881);
    },
    filters: {
        /**
         * @description: 过滤器，把文件字节数转为M为单位的数据
         * @param {String} 要过滤的值
         * @return {String}
         */
        transferSize(data) {
            if (data) {
                let size = Number(data) / 1024 / 1024;
                return size.toFixed(2) + 'M';
            } else {
                return '0M';
            }
        }
    },
    watch: {
        /**
         * @description: 监听路由，文件夹面包屑点击时重新获取列表
         * @param {Object} val  路由信息
         */
        $route: function(val) {
            this.projectId = val.query.projectId;
            this.pId = val.query.pId || '';
            this.fileName = '';
            this.doSearch(1);
        }
    },
    methods: {
        // 搜索，埋点
        search() {
            commonFun.setTrackNew(9882);
            this.doSearch(1);
        },
        /**
         * @description: 单文件下载
         * @param {Object} val  文件数据，主要需要name 和 url
         * @param {String} index  第几行
         */
        downlodFile(val, index) {
            commonFun.setTrackNew(9890, { file_type: val.ext }, { fromItemIndex: index });
            this.downloadFileFromOss(val.name, val.ext, val.url).then(url => {
                window.location.href = url;
            });
        },
        // 上传埋点
        uploadFile() {
            commonFun.setTrackNew(9886);
        },
        /**
         * @description: 上传成功函数
         * @param {Array} files 新上传的文件数组
         */
        successUpload(files) {
            this.uploadLoading && this.uploadLoading.close();
            this.fileList = files;
            this.uploadSuccess(this.fileList);
        },
        // 上传失败，关闭loading
        failUpload() {
            this.uploadLoading && this.uploadLoading.close();
        },
        // 请求oss令牌
        beforeUpload(files) {
            this.uploadLoading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.repeateFileStr = '';
            // 检查文件是否重复命名
            this.checkFileName(files)
                .then(res => {
                    // 检查不合格的文件
                    const {
                        data: { code, msg, data }
                    } = res;
                    if (code === 0) {
                        this.$refs.uploadMul.doUpload(files);
                    } else if (code === 1) {
                        this.uploadLoading.close();
                        this.fileNameVisible = true;
                        const repeatName = data ? data.repeat_name : [];
                        if (Array.isArray(repeatName)) {
                            repeatName.forEach(name => {
                                this.repeateFileStr += `【${name}】`;
                            });
                        }
                    } else {
                        this.$message.error(msg);
                        this.uploadLoading.close();
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.uploadLoading.close();
                });
        },
        /**
         * @description: 上报已经上传的文件
         * @param {Array} files 要上传的文件列表
         */
        async uploadSuccess(files) {
            if (this.isSubmit) return false;
            // 组装数据
            let fileArr = [];
            files.forEach(v => {
                let obj = {
                    url: v.url,
                    size: v.size,
                    name: v.name
                };
                fileArr.push(obj);
            });
            try {
                let params = {
                    project_id: this.projectId,
                    parent_id: this.pId || 0,
                    file: fileArr
                };
                this.isSubmit = true;
                const {
                    data: { code, msg }
                } = await api.uploadFile(params);
                if (code === 0) {
                    this.doSearch(1);
                } else {
                    this.$message.error(msg);
                }
                this.uploadLoading = false;
                this.isSubmit = false;
            } catch (err) {
                console.log(err);
                this.uploadLoading = false;
                this.isSubmit = false;
            }
        },
        /**
         * @description: 检查文件名是否重复
         * @param {Array} files 要检查的图片名称
         */
        async checkFileName(files) {
            if (this.isSubmit) return false;
            const fileArr = [];
            files.forEach(file => {
                fileArr.push(file.name);
            });
            try {
                let params = {
                    project_id: this.projectId,
                    parent_id: this.pId || 0,
                    name: fileArr
                };
                this.isSubmit = true;
                const res = await api.checkFileName(params);
                this.isSubmit = false;
                // 暴露出去
                return res;
            } catch (err) {
                console.log(err);
                this.isSubmit = false;
            }
        },
        /**
         * @description: 获取要展示的图标的名字
         * @param {String} suffix   文件后缀名
         * @return {String}  返回后缀对应的图标名字
         */
        getIconName(suffix) {
            if (suffix) {
                suffix = suffix.toLowerCase();
                return fileTypeList[suffix] || 'undefined';
            } else {
                return 'folder';
            }
        },
        /**
         * @description: 表格哪一项能选，文件夹不能被选择
         * @param {Object} row  表格行的内容
         * @param {Number} index  当前是第几行
         * @return {Boolean} 返回当前行是否能被选择
         */
        selectable(row, index) {
            return row.ext;
        },
        /**
         * @description: 表格排序变化
         * @param {String} val ascending--升序，descending--降序，null--没有排序
         */
        sortChange(val) {
            let sort = val.order;
            switch (sort) {
                case null:
                    this.sort = '';
                    break;
                case 'ascending':
                    this.sort = '1';
                    break;
                case 'descending':
                    this.sort = '2';
                    break;
                default:
                    this.sort = '';
            }
            this.sortField = val.column.property === 'create_datetime' ? 1 : 2;
            // 无排序，回到列表默认排序，按照创建时间倒序排列
            if (!sort) {
                this.sortField = 1;
                this.sort = '2';
            }
            this.doSearch(this.currentPage);
        },
        // 获取按钮权限和链接
        async getPowerAndUrl() {
            try {
                const {
                    data: { code, msg, data }
                } = await api.getPermission();
                if (code === 0) {
                    this.projectListUrl = data.project_list_url;
                    this.isEdit = data.edit_right;
                    this.isView = data.view_right;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 点击搜索
         * @param {string} page 页码
         */
        async doSearch(page) {
            // 请求接口数据返回结果
            // 防止重复提交
            if (!this.flag) return;
            if (page) {
                this.currentPage = page;
            }
            this.flag = false;
            try {
                this.loading = true;
                let params = {
                    project_id: this.projectId,
                    parent_id: this.pId,
                    file_name: this.fileName,
                    page: this.currentPage,
                    page_size: this.pageSize,
                    sort_field: this.sortField,
                    sort_type: this.sort
                };
                const {
                    data: { code, msg, data }
                } = await api.getDataBankList(params);
                if (code === 0) {
                    this.tableList = data.list;
                    this.totalNum = data.total ? parseInt(data.total) : 0;
                    this.dirNav = data.dir_nav;
                    this.domain = data.img_domain;
                } else {
                    this.$message.error(msg);
                }
                this.flag = true;
                this.loading = false;
            } catch (err) {
                this.loading = false;
                this.flag = true;
                console.log(err);
            }
        },
        // 获取表格选中值
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 新建文件夹
        addFolder() {
            commonFun.setTrackNew(9885);
            this.addFolderTitle = '新建文件夹';
            this.folderForm.lable = '文件夹';
            this.folderForm.name = '新建文件夹';
            this.folderForm.isAdd = true;
            this.folderVisble = true;
        },
        // 取消新建文件夹
        cancelAddFolder() {
            this.$refs.folderForm.resetFields();
            this.folderForm.id = '';
            this.folderForm.name = '';
            this.folderVisble = false;
        },
        // 确定新建文件夹
        confirmAddFolder() {
            this.$refs.folderForm.validate(async valid => {
                if (valid) {
                    if (!this.flag) return;
                    try {
                        this.flag = false;
                        let result;
                        let message;
                        if (this.folderForm.isAdd) {
                            // 新建文件夹
                            let params = {
                                project_id: this.projectId,
                                parent_id: this.pId,
                                name: this.folderForm.name
                            };
                            result = await api.addFolder(params);
                            message = '新建文件夹成功，新增一条创建成功的文件夹数据';
                        } else {
                            // 重命名
                            let params = {
                                id: this.folderForm.id,
                                name: this.folderForm.name
                            };
                            result = await api.reNameFolder(params);
                            message = '重命名成功，更新' + this.folderForm.lable + '名称';
                        }
                        const {
                            data: { code, msg }
                        } = result;
                        if (code === 0) {
                            this.folderVisble = false;
                            this.flag = true;
                            this.$message({
                                type: 'success',
                                message: message
                            });
                            this.doSearch(1);
                        } else {
                            this.flag = true;
                            this.$message.error(msg);
                        }
                    } catch (err) {
                        this.flag = true;
                        console.log(err);
                    }
                } else {
                    return false;
                }
            });
        },
        /**
         * @description: 重命名
         * @param {String} id  文件id
         * @param {String} name  文件名
         * @param {String} ext  后缀
         * @param {String} index  第几行
         */
        reNameFile(id, name, ext, index) {
            commonFun.setTrackNew(9891, { file_type: ext }, { fromItemIndex: index });
            this.addFolderTitle = '重命名';
            this.folderForm.name = name;
            this.folderForm.id = id;
            this.folderForm.lable = ext ? '文件' : '文件夹';
            this.folderForm.isAdd = false;
            this.folderVisble = true;
        },
        // 批量删除
        batchDeleteFile() {
            commonFun.setTrackNew(9883);
            if (this.multipleSelection.length <= 0) {
                this.$message.error('请勾选需要删除的内容！');
                return false;
            } else {
                this.deleteId = this.multipleSelection.map(item => {
                    return item.id;
                });
                this.confirmVisible = true;
            }
        },
        /**
         * @description: 删除文件或文件夹
         * @param {String} id 当前文件ID
         * @param {String} ext  后缀
         * @param {String} index  第几行
         */
        deleteFile(id, ext, index) {
            commonFun.setTrackNew(9889, { file_type: ext }, { fromItemIndex: index });
            this.deleteId = [id];
            this.confirmVisible = true;
        },
        // 确定删除
        async confirmDelete() {
            if (!this.flag) return;
            let params = {
                ids: this.deleteId
            };
            this.flag = false;
            try {
                const {
                    data: { code, msg }
                } = await api.deleteFiles(params);
                if (code === 0) {
                    this.confirmVisible = false;
                    this.$message.success('删除成功！');
                    this.flag = true;
                    this.doSearch(this.currentPage);
                } else {
                    this.flag = true;
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
                this.flag = true;
            }
        },
        // 批量下载
        batchDownLoad() {
            commonFun.setTrackNew(9884);
            if (this.multipleSelection.length <= 0) {
                this.$message.error('请勾选需要下载的内容！');
                return false;
            } else {
                this.$refs.downloadAll.ossDownloadFile();
            }
        },
        /**
         * @description: 点击文件名，文件夹点击进入下一级，压缩包点击就下载，其他文件点击365预览，图片点击需要预览当前级别所有的图片
         * @param {Object} info  当前文件信息
         * @param {String} index  第几行
         */
        handleClickFile(info, index) {
            // 根据后缀获取文件类型
            let type = this.getIconName(info.ext);
            switch (type) {
                case 'folder':
                    this.$router.push({
                        name: 'buildingDataBank',
                        query: {
                            projectId: this.$route.query.projectId,
                            pId: info.id
                        }
                    });
                    break;
                // 预览图片
                case 'image':
                    this.showImage(info.url);
                    break;
                // 压缩包直接下载
                case 'zip':
                    this.downlodFile(info);
                    break;
                // 音频和视频预览
                case 'audio':
                case 'video':
                    let toLink = window.open(this.domain + info.url, '_target');
                    toLink.opener = null;
                    break;
                // 其他pdf，ppt文件直接365预览
                default:
                    let preview = window.open(this.OSSView + this.domain + info.url, '_target');
                    preview.opener = null;
                    break;
            }
            if (type === 'folder') {
                commonFun.setTrackNew(9888, {}, { fromItemIndex: index });
            } else {
                commonFun.setTrackNew(9887, { file_type: info.ext }, { fromItemIndex: index });
            }
        },
        /**
         * @description: 预览当前页所有图
         * @param {String} url 当前点击的图片的链接
         */
        showImage(url) {
            let imgList = [];
            for (var i = 0; i < this.tableList.length; i++) {
                let item = this.tableList[i];
                if (this.getIconName(item.ext) === 'image') {
                    imgList.push(this.domain + item.url);
                }
            }
            this.previewUrl = imgList;
            this.previewIndex = imgList.indexOf(this.domain + url);
            this.photoIsShow = true;
        },
        // 关闭大图预览
        closeViewer() {
            this.photoIsShow = false;
            this.previewUrl = [];
        },
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f9f9f9;color: #333;';
            }
        }
    }
};
</script>

<style lang="less" scoped>
.content-main {
    padding: 0 15px;
    .form-table-box {
        background-color: #fff;
    }
    .search-box {
        font-size: 14px;
        margin-bottom: 10px;
        .el-input {
            width: 300px;
            margin-right: 20px;
        }
    }
}
.btn-info {
    color: #fff;
    background-color: #20becc;
    border-color: #20becc;
}
.flex-box {
    display: flex;
    align-items: center;
    .img-icon {
        width: 40px;
        img {
            max-width: 100%;
            max-height: 100%;
        }
    }
    .file-name {
        flex: 1;
        padding-left: 10px;
        text-align: left;
        cursor: pointer;
    }
}
.download-wrapper {
    display: inline-block;
    margin: 0 10px;
}
.up-wrapper {
    display: inline-block;
    margin-left: 10px;
}
.file-name-box {
    max-height: 200px;
    overflow: auto;
}
</style>