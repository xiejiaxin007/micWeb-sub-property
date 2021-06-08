<!--
 * @author: xiejiaxin
 * @Date: 2020-09-22 14:33:54
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-22 14:39:00
 * @description: 高质量信息源配置列表
-->
<template>
    <div class="el-row">
        <el-col :span="24"
            class="content-main">
            <el-breadcrumb class="bread-crumb-box"
                separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>
                    <a href="/">首页</a>
                </el-breadcrumb-item>
                <el-breadcrumb-item>高质量信息源配置</el-breadcrumb-item>
            </el-breadcrumb>
            <!--搜索区域-->
            <div class="v-box form-table-box">
                <div class="hd">
                    <h2>高质量信息源配置</h2>
                </div>
                <div class="bd">
                    <div class="order-search">
                        <!--查询需求-->
                        <ul class="s-query">
                            <li>
                                <div class="th">城市：</div>
                                <div class="td">
                                    <el-select v-model="cityId"
                                        filterable
                                        remote
                                        placeholder="请选择"
                                        @focus="focusCity"
                                        :remote-method="remoteCity"
                                        :loading="loadingSelect">
                                        <el-option v-for="item in cityList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">字段所属页面：</div>
                                <div class="td">
                                    <el-select v-model="wordPage"
                                        placeholder="请选择"
                                        @change="(val) => wordPageChange(val, 'page')"
                                        clearable>
                                        <el-option v-for="item in wordPageList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">字段名称：</div>
                                <div class="td">
                                    <el-select v-model="wordName"
                                        filterable
                                        @change="(val) => wordPageChange(val, 'name')"
                                        placeholder="请选择"
                                        clearable>
                                        <el-option v-for="item in wordNameList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">字段属性：</div>
                                <div class="td">
                                    <el-select v-model="wordAttr"
                                        placeholder="请选择"
                                        clearable>
                                        <el-option v-for="item in wordAttrList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">高质量信息源：</div>
                                <div class="td">
                                    <search-select-radio v-model="msgSource"
                                        clearable
                                        placeholder="请选择"
                                        :apiInfo="sourceApi">
                                    </search-select-radio>
                                </div>
                            </li>
                            <li>
                                <div class="th">状态：</div>
                                <div class="td">
                                    <el-select v-model="status"
                                        placeholder="请选择">
                                        <el-option v-for="item in statusList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">预警状态：</div>
                                <div class="td">
                                    <el-select v-model="warnStatus"
                                        placeholder="请选择">
                                        <el-option v-for="item in warnStatusList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="btn-area">
                        <el-button @click="resetSearch">重置</el-button>
                        <el-button type="primary"
                            @click="doSearch(1)">搜索</el-button>
                    </div>
                </div>
            </div>
            <!--表格展示区域-->
            <div class="v-box form-table-box">
                <div class="bd">
                    <div class="search-result">
                        <div class="data-stat">
                            <el-row>
                                <el-col :span="12">
                                    <p class="total-num"><span v-if="totalNum > 0">第{{countRange}}条，</span>共{{totalNum}}条数据</p>
                                </el-col>
                                <el-col :span="12">
                                    <div class="title-btn-area">
                                        <el-button type="primary"
                                            @click="exportData"
                                            class="btn-add">导出自动维护数据</el-button>
                                        <router-link :to="{ path: '/building/addQualityInfo'}"
                                            target="_blank"
                                            class="btn-add">
                                            <el-button type="primary">新增高质量信息源配置</el-button>
                                        </router-link>
                                        <el-upload ref="uploadBtn"
                                            class="upload-file"
                                            action="/backend-api/project/field-config/import-source-field-config"
                                            :show-file-list="false"
                                            :accept="accept"
                                            :before-upload="beforeExport"
                                            :on-success="exportSuccess">
                                            <el-button type="primary">导入高质量信息源配置</el-button>
                                        </el-upload>
                                        <el-button type="primary"
                                            @click="downLoad">下载导入模板</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="table-wrap">
                            <el-table ref="tableFixedWrap"
                                border
                                :data="tableList"
                                v-loading="loading"
                                size="small"
                                @sort-change="sortChange"
                                row-class-name="row"
                                cell-class-name="column"
                                :highlight-current-row="true"
                                :header-cell-style="tableHeaderColor">
                                <el-table-column min-width="60"
                                    prop="id"
                                    label="ID"
                                    align="center">
                                </el-table-column>
                                <el-table-column min-width="100"
                                    prop="city_name"
                                    label="城市"
                                    align="center">
                                </el-table-column>
                                <el-table-column min-width="100"
                                    prop="page_name"
                                    label="字段所属页面"
                                    align="center">
                                </el-table-column>
                                <el-table-column min-width="100"
                                    prop="field_name"
                                    label="字段名称"
                                    align="center">
                                    <template slot-scope="scope">
                                        <span :class="`${scope.row.is_warning === '1' ? 'font-red' : ''}`">{{scope.row.field_name}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="80"
                                    prop="attribute_type"
                                    label="字段属性"
                                    align="center">
                                </el-table-column>
                                <el-table-column min-width="100"
                                    prop="field_source"
                                    label="高质量信息源"
                                    align="center">
                                    <template slot-scope="scope">
                                        <el-popover placement="top"
                                            popper-class="tb-popper"
                                            trigger="hover"
                                            :content="scope.row.field_source">
                                            <div class="tooltip-text"
                                                slot="reference">{{scope.row.field_source}}</div>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="80"
                                    prop="accuracy_threshold"
                                    label="竞对准确率阀值"
                                    align="center">
                                </el-table-column>
                                <el-table-column min-width="80"
                                    prop="alarm_times"
                                    label="累计预警次数"
                                    sortable="custom"
                                    align="center">
                                </el-table-column>
                                <el-table-column min-width="80"
                                    prop="status"
                                    label="状态"
                                    align="center">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.status === '1' ? '启用' : '禁用'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="80"
                                    label="操作"
                                    align="center">
                                    <template slot-scope="scope">
                                        <div class="btn-list">
                                            <router-link class="btn-update"
                                                target="_blank"
                                                :to="{ path: '/building/editQualityInfo', query: { id: scope.row.id }}">
                                                <el-button type="text"
                                                    size="small">编辑</el-button>
                                            </router-link>
                                            <el-button type="text"
                                                size="small"
                                                @click="popDialog(scope.row.id, scope.row.status)">{{scope.row.status === '1' ? '禁用' : '启用'}}</el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination">
                                <el-pagination v-if="totalNum - pageSize > 0"
                                    background
                                    :page-size="pageSize"
                                    layout="prev, pager, next"
                                    :current-page.sync="currentPage"
                                    @current-change="doSearch"
                                    :total="totalNum">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <!-- 二次确认弹层 -->
        <confirm-dialog :title="confirm.title"
            :content="confirm.content"
            :confirmBtn="confirm.confirmBtn"
            :visible="confirm.visible"
            :width="confirm.width"
            @cancel="confirm.visible = false"
            @confirm="changeStatus"></confirm-dialog>
        <!-- 提示信息弹窗 -->
        <alert-dialog :title="alert.title"
            :visible.sync="alert.visible"
            width="600px">
            {{alert.content}}
        </alert-dialog>
        <!-- 导出自动维护数据弹窗 -->
        <el-dialog title="选择自动维护数据"
            :visible.sync="exportVisble"
            @close="cancelExport"
            width="500px"
            center>
            <el-form :model="exportForm"
                class="form-wrappper"
                ref="exportForm"
                label-width="80px">
                <el-form-item label="城市"
                    prop="city"
                    :rules="[{ required: true, message: '城市不能为空！', trigger: 'change' }]">
                    <search-select-radio v-model="exportForm.city"
                        placeholder="请选择"
                        :apiInfo="cityApi">
                    </search-select-radio>
                </el-form-item>
                <el-form-item label="时间"
                    prop="date"
                    :rules="[{ required: true, message: '请选择日期', trigger: 'change' }]">
                    <el-date-picker type="date"
                        placeholder="请选择"
                        :picker-options="pickerOptionsBefore"
                        value-format="yyyy-MM-dd"
                        v-model="exportForm.date"></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="cancelExport">取消</el-button>
                <el-button type="primary"
                    @click="confirmExport">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { ConfirmDialog, SearchSelectRadio, AlertDialog } from '@/components';
import api from '../api/common.js';
import qualityApi from '../api/autoMaintenance.js';
import commonApi from '@/api/commonApi';
import { buildingConf } from '../config/tabToggleList';
import timeRelated from '@/assets/js/utils/timeRelated';
export default {
    name: 'quality-list',
    components: {
        ConfirmDialog,
        SearchSelectRadio,
        AlertDialog
    },
    data() {
        return {
            // 提示信息
            alert: {
                // 标题
                title: '提示',
                // 弹窗是否展示
                visible: false,
                // 信息内容
                content: ''
            },
            // 城市下拉loading
            loadingSelect: false,
            // 二次确认弹层信息
            confirm: {
                // 识别是启用是禁用 start-启用 stop-禁用
                id: '',
                // 弹窗标题
                title: '',
                // 弹窗内容
                content: '',
                // 弹窗确认按钮的文本值
                confirmBtn: '',
                // 弹窗是否展示
                visible: false,
                // 弹窗宽度
                width: '350px'
            },
            // 城市
            cityId: '',
            // 城市下拉
            cityList: [],
            // 字段所属页面
            wordPage: '',
            // 字段所属页面列表
            wordPageList: [],
            // 字段名称
            wordName: '',
            // 字段名称下拉
            wordNameList: [],
            // 字段属性
            wordAttr: '',
            // 字段属性列表
            wordAttrList: [],
            // 高质量信息源
            msgSource: '',
            // 高质量信息源下拉API
            sourceApi: {
                api: qualityApi.getQualityList,
                params: {
                    q: ''
                }
            },
            // 状态
            status: '',
            // 状态下拉
            statusList: [],
            // 预警状态
            warnStatus: '',
            // 预警状态下拉
            warnStatusList: [],
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
            // 排序 为空不排序、1-正序、2-倒序
            sort: '',
            // 导入文件限制
            accept: '',
            // 导出弹窗
            exportVisble: false,
            // 导出数据表单
            exportForm: {
                date: timeRelated.filterDate(new Date().getTime(), 'YYYY-MM-DD'),
                // 城市选择
                city: ''
            },
            // 城市下拉获取
            cityApi: {
                api: commonApi.getOwnerCity,
                params: {
                    q: ''
                }
            },
            // 可选择今天及之前的日期
            pickerOptionsBefore: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            }
        };
    },
    created() {
        // 默认请求
        this.getStaticConfig();
        // 默认请求配置下拉
        this.getConfig();
        this.accept = buildingConf.fileType.join(',');
    },
    computed: {
        // 第多少条
        countRange: function() {
            let prev = this.currentPage > 1 ? (this.currentPage - 1) * this.pageSize : 1;
            let next = prev + this.pageSize - 1;
            next = next < this.totalNum ? next : this.totalNum;
            return prev + '-' + next;
        }
    },
    methods: {
        /**
         * @description: 文件上传成功后回调
         * @param {Object} response 上传后相应对象
         */
        exportSuccess(response) {
            const { msg, code } = response;
            if (code === 0) {
                this.$message.success('导入成功');
            } else if (code === 3001) {
                // 重复提示弹窗
                this.alert.visible = true;
                this.alert.content = msg;
            } else {
                this.$message(msg);
            }
        },
        /**
         * 上传之前的回调  若返回 false 或者返回 Promise 且被 reject，则停止上传。
         * @param {File} file file文件
         */
        beforeExport(file) {
            const { name } = file;
            const nameArr = name.split('.');
            // 后缀名
            const extensionName = nameArr[nameArr.length - 1];
            // 限制文件类型
            if (!buildingConf.fileType.includes(`.${extensionName}`)) {
                this.$message(`请上传文件类型为${buildingConf.fileType.join()}的文件`);
                return false;
            }
        },
        // 下载模板
        downLoad() {
            if (!this.downloadUrl) return;
            window.location.href = this.downloadUrl;
        },
        // 导出自动维护数据
        exportData() {
            this.exportVisble = true;
        },
        // 取消导出
        cancelExport() {
            this.$refs.exportForm.resetFields();
            this.exportVisble = false;
        },
        // 确定导出
        confirmExport() {
            this.$refs.exportForm.validate(async valid => {
                if (valid) {
                    if (!this.flag) return false;
                    this.flag = false;
                    try {
                        const {
                            data: { code, msg, data }
                        } = await qualityApi.exportAutoData({
                            date: this.exportForm.date,
                            city_id: this.exportForm.city
                        });
                        if (code === 0) {
                            this.exportVisble = false;
                            window.location.href = data.excel_url;
                        } else {
                            this.$message.error(msg);
                        }
                        this.flag = true;
                    } catch (err) {
                        console.log(err);
                        this.flag = true;
                    }
                } else {
                    return false;
                }
            });
        },
        // 获取静态下拉
        async getStaticConfig() {
            this.getWordList();
            await this.remoteCity('', 'first');
            this.doSearch(1);
        },
        // 城市下拉获取焦点
        focusCity() {
            this.remoteCity('');
        },
        /**
         * @description: 城市下拉搜索
         * @param {String} query  搜索词
         */
        async remoteCity(query, type) {
            try {
                this.loadingSelect = true;
                const {
                    data: { code, msg, data }
                } = await api.getBusinessCity({
                    q: query
                });
                if (code === 0) {
                    this.loadingSelect = false;
                    this.cityList = data.list;
                    if (type === 'first') {
                        this.cityId = this.cityList[0].value;
                    }
                } else {
                    this.loadingSelect = false;
                    this.$message.error(msg);
                }
            } catch (err) {
                this.loadingSelect = false;
            }
        },
        // 确定启用/禁用
        async changeStatus() {
            if (!this.flag) return;
            let params = {
                id: this.currentId,
                status: this.confirm.id
            };
            this.flag = false;
            try {
                const {
                    data: { code, msg }
                } = await qualityApi.updateStatus(params);
                if (code === 0) {
                    this.confirm.visible = false;
                    this.$message.success('修改成功');
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
        /**
         * @description: 点击表格禁用或者启用按钮
         * @param {String} id 当前配置ID
         * @param {String} type 类型 1-当前是启用，相当于点击的是禁用  2-当前是禁用，相当于点击的是启用
         */
        popDialog(id, type) {
            this.currentId = id;
            let content = '';
            if (type === '2') {
                content = '确定要启用该字段配置的高质量信息源吗，启用后，该字段所有配置的高质量源，将参与竞对的打对错流程。';
            } else {
                content = '确定要禁用该字段配置的高质量信息源吗，禁用后，该字段所有配置的高质量源，将不再参与竞对的打对错流程。';
            }
            this.confirm = {
                id: type === '2' ? '1' : '2',
                title: '提示',
                content: content,
                confirmBtn: '确定',
                visible: true
            };
        },
        /**
         * @description: 切换字段所属页面
         * @param {String} val 字段所属页面选中字段
         * @param {String} type page-当前选的是所属页面，name-当前选的是所属字段
         */
        wordPageChange(val, type) {
            // 所属页面修改，需要同时把字段名称和字段属性清空
            if (type === 'page') {
                this.wordName = '';
                this.wordAttr = '';
                // 重新请求字段名称
                this.getWordList();
            } else {
                this.wordAttr = '';
            }
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
            this.doSearch(this.currentPage);
        },
        // 获取字段名称下拉
        async getWordList() {
            let params = {
                page_id: this.wordPage
            };
            try {
                const {
                    data: { code, data }
                } = await qualityApi.getWordName(params);
                if (code === 0) {
                    this.wordNameList = data.list ? data.list : [];
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取配置下拉
        async getConfig() {
            let params = {
                type: [47, 48, 49, 50, 51]
            };
            try {
                const {
                    data: { code, data }
                } = await api.getProjectConfigData(params);
                if (code === 0) {
                    this.wordPageList = data.page_list ? data.page_list : [];
                    this.wordAttrList = data.attribute_type ? data.attribute_type : [];
                    this.statusList = data.automation_field_config_status ? data.automation_field_config_status : [];
                    this.warnStatusList = data.is_warning ? data.is_warning : [];
                    this.downloadUrl = data.automation_import_template_url ? data.automation_import_template_url.url : '';
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 重置搜索项
        resetSearch() {
            // 重置form表单
            this.cityId = '';
            this.wordPage = '';
            this.wordName = '';
            this.wordAttr = '';
            this.status = '';
            this.warnStatus = '';
            this.sort = '';
            this.msgSource = '';
            // 城市下拉选择第一个
            this.remoteCity('', 'first');
            // 重新请求
            this.doSearch(1);
            // 重新请求字段名称下拉
            this.getWordList();
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
                    page: this.currentPage,
                    city_id: this.cityId,
                    page_id: this.wordPage,
                    field_id: this.wordName,
                    attribute_type: this.wordAttr,
                    status: this.status,
                    warning_status: this.warnStatus,
                    source_id: this.msgSource,
                    alarm_sort: this.sort,
                    page_size: this.pageSize
                };
                const {
                    data: { code, msg, data }
                } = await qualityApi.getQualityTbList(params);
                if (code === 0) {
                    this.tableList = data.list;
                    this.totalNum = data.total_count ? parseInt(data.total_count) : 0;
                    this.pageSize = data.page_size;
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
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #f9f9f9;color: #333;';
            }
        }
    }
};
</script>


<style scoped>
.content-main {
    padding: 0 15px;
}
.form-table-box {
    background-color: #fff;
}
.order-search {
    overflow: hidden;
}
.order-search >>> .el-date-editor,
.order-search >>> .el-select {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
}
.order-search >>> .el-select >>> .el-input {
    height: 40px;
}
.order-search >>> .el-range-input {
    background-color: #fff;
    font-size: 12px;
    line-height: 32px;
}
.order-search >>> .el-date-editor .el-range-separator {
    font-size: 12px;
}
.order-search .fixHeight {
    height: 40px;
}
.order-search >>> .el-date-editor .date-tip-logo {
    display: none;
}
.form-table-box .filter-link-more {
    float: right;
    padding: 9px 20px;
    margin-top: 6px;
}
.order-search > .s-query > li .td {
    height: 40px;
}
.s-query > li.long-column {
    width: 360px;
}
.s-query > li.margin-next {
    margin-left: 20px;
}
.form-tip-box {
    color: #999;
}
.form-table-box .batch-btn-area {
    text-align: right;
}
.batch-form-box >>> .el-form-item {
    margin-bottom: 0;
}
.data-stat {
    overflow: hidden;
    padding: 10px 0 20px;
    font-size: 14px;
}
.projects {
    text-align: left;
}
</style>
<style lang="less" scoped>
.title-btn-area {
    text-align: right;
}
.btn-add {
    margin-right: 10px;
}
.pagination {
    margin-top: 20px;
    text-align: center;
}
.font-red {
    color: #ff0000;
}
.tooltip-text {
    white-space: nowrap;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
}
.btn-update {
    margin-right: 10px;
}
.upload-file {
    display: inline-block;
    margin-right: 10px;
}
.form-wrappper {
    /deep/.el-date-editor {
        width: 100%;
    }
}
</style>
