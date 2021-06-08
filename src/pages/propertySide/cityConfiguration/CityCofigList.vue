<template>
    <div class="collocationwrap">
        <!-- 搜索表单 -->
        <div class="collocation-form-wrap">
            <el-form
                :inline="true"
                :model="collocationForm"
                ref="collocationForm"
                :label-position="labelPosition"
                label-width="96px"
                class="collocation-form"
            >
                <el-form-item
                    prop="city_id"
                    label="城市："
                >
                    <el-select
                        v-model="collocationForm.city_id"
                        filterable
                        placeholder="请选择城市"
                    >
                        <el-option
                            v-for="item in cityData"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <div class="divider"></div>
                <el-form-item class="form-item-center">
                    <el-button @click="resetForm('collocationForm')">重置</el-button>
                    <el-button
                        @click="searchCityList"
                        type="primary"
                    >搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--城市列表-->
        <div class="collocation-list">
            <div class="collocation-list-topbar">
                <p class="flex-start">共{{pages.pageTotalNum}}条数据</p>
                <el-button
                    @click="addCity"
                    class="btn-right"
                    type="success"
                >新增城市</el-button>
            </div>
            <div class="collocation-list-table">
                <el-table
                    :data="collocationTableData"
                    border
                    style="width: 100%"
                >
                    <el-table-column
                        prop="text"
                        label="城市"
                        align="center"
                        min-width="50"
                    ></el-table-column>
                    <el-table-column
                        prop="city_collaction"
                        label="城市级配置-运营"
                        align="center"
                        min-width="140"
                    >
                        <template slot-scope="scope">
                            <div v-if="scope.row.finish_status == '1'">{{scope.row.finish_status_text}}&nbsp;&nbsp;{{scope.row.finish_employee_text}}&nbsp;&nbsp;{{scope.row.update_datetime}}</div>
                            <div v-else>{{scope.row.finish_status_text}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="isInTo"
                        label="批量灌入"
                        align="center"
                        min-width="140"
                    >
                        <template slot-scope="scope">
                            <div v-if="scope.row.poured_status == '1'">{{scope.row.poured_status_text}}({{scope.row.poured_source_text}},&nbsp;{{scope.row.poured_employee_text}}&nbsp;&nbsp;{{scope.row.poured_datetime}})</div>
                            <div v-else>{{scope.row.poured_status_text}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        align="center"
                        label="操作"
                        min-width="180"
                    >
                        <template slot-scope="scope">
                            <div>
                                <el-button
                                    v-if="scope.row.edit_config_button_show"
                                    type="text"
                                    size="medium"
                                    @click="editorCity(scope.row.id,scope.row.text)"
                                >编辑城市级配置</el-button>
                                <el-button
                                    v-if="scope.row.poured_button_show"
                                    type="text"
                                    size="medium"
                                    @click="editCollocation(scope.row.id)"
                                >开始灌入到居理</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="pages"
                    background
                    :hide-on-single-page="true"
                    layout="prev, pager, next"
                    :page-size="pages.pageSize"
                    :page-count="pages.pageCount"
                    :current-page="pages.currentPage"
                    @prev-click="curPageChange(0)"
                    @next-click="curPageChange(1)"
                    @current-change="curPageclick"
                ></el-pagination>
            </div>
        </div>
        <!-- 开始灌入到居理弹框 -->
        <div class="injectDialog">
            <el-dialog
                title="请选择灌入到居理的数据源："
                :visible.sync="startInjectDialog"
                width="30%"
                :show-close="false"
            >
                <el-select
                    @change="changeOption"
                    v-model="dialogSelectValue"
                    placeholder="请选择"
                    :class="{'error':popEmpty}"
                >
                    <el-option
                        v-for="item in DataOptions"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <span
                    slot="footer"
                    class="dialog-footer"
                >
                    <el-button @click="cancleConfirm">放弃确认</el-button>
                    <el-button
                        type="primary"
                        @click="tapConfimBtn"
                    >{{confimText}}</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {
    getConfigListData,
    getSoureListData,
    tapConfimBtnData,
    getCity
} from '@/api/citySettingApi/cityConfigListApi.js';
export default {
    name: 'cityConfigList',
    data () {
        return {
            // 表单右对齐
            labelPosition: 'right',
            collocationForm: {
                // 表单城市id
                city_id: ''
            },
            // 开始灌入居理弹框默认隐藏
            startInjectDialog: false,
            // 弹框下拉选择框
            DataOptions: [],
            // 灌入弹框下拉value
            dialogSelectValue: '',
            // 弹窗对应城市id
            popCityId: '',
            // 弹框点击确认按钮文字变换
            confimText: '确认',
            // 城市option数据
            cityData: [],
            // 列表数据
            collocationTableData: [],
            pages: {
                // 传值从1开始
                currentPage: 1,
                // 每页条数
                pageSize: 10,
                // 页数
                pageCount: 1,
                // 默认总条数
                pageTotalNum: ''
            },
            // 弹窗不为空提示
            popEmpty: false,
            // 新增城市链接
            addCityUrl: ''
        };
    },
    created () {
        // 页面加载获取城市选择列表
        this.getCityList();
        // 获取数据列表信息
        this.getConfigList();
        // 获取竞对源列表
        this.getSoureList();
    },
    methods: {
        // 获取竞对源列表
        async getSoureList () {
            try {
                let res = await getSoureListData();
                let result = res.data;
                if (result.code === 0) {
                    this.DataOptions = result.data;
                } else {
                    console.log(result.msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 点击新增城市
        addCity () {
            window.location.href = this.addCityUrl;
        },
        // 点击搜索
        searchCityList () {
            this.pages.currentPage = 1;
            this.getConfigList();
        },
        // 获取数据列表信息
        async getConfigList () {
            try {
                let res = await getConfigListData(
                    this.pages.currentPage,
                    this.collocationForm.city_id
                );
                let result = res.data;
                if (result.code === 0) {
                    // 赋值新增城市链接
                    this.addCityUrl = result.data.add_city_url;
                    // 列表信息赋值
                    this.collocationTableData = result.data.info;
                    // 总页数赋值
                    this.pages.pageCount = result.data.total_page;
                    // 总条数赋值
                    this.pages.pageTotalNum = result.data.total_count;
                } else {
                    console.log(result.msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 翻页点击
         *@param {string} val 当前页码
         */
        curPageclick (val) {
            this.pages.currentPage = val;
            this.getConfigList();
        },
        /**
         * 向前向后翻页
         *@param {string} val 当前页码
        */
        curPageChange (curNum) {
            if (curNum === 0) {
                if (this.pages.currentPage > 1) {
                    this.pages.currentPage -= 1;
                } else {
                    this.pages.currentPage = 1;
                }
            } else if (curNum === 1) {
                if (this.pages.currentPage < this.pages.pageCount) {
                    this.pages.currentPage += 1;
                } else {
                    this.pages.currentPage = this.pages.pageCount;
                }
            }
            this.getConfigList();
        },
        // 请求城市接口信息
        async getCityList () {
            try {
                let res = await getCity();
                if (res.data.code === 0) {
                    this.cityData = res.data.data;
                } else {
                    console.log(res.data.msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 重置表单
         *@param {string} formName 表单名称
         */
        resetForm (formName) {
            // 清空表单
            this.$refs[formName].resetFields();
            // 重置后重新获取列表数据
            this.pages.currentPage = 1;
            this.collocationForm.city_id = '';
            this.getConfigList();
        },
        /**
         * 开始灌入到居理
         *@param {string} cityId 城市id
         */
        editCollocation (cityId) {
            // 赋值当前弹窗城市
            this.popCityId = cityId;
            // 初始化确认按钮文案
            this.confimText = '确认';
            // 弹框展示
            this.startInjectDialog = true;
        },
        // 点击确定按钮
        async tapConfimBtn () {
            if (this.dialogSelectValue) {
                if (this.confimText === '确认') {
                    this.confimText = '二次确认';
                } else if (this.confimText === '二次确认') {
                    this.confimText = '最终确认';
                } else if (this.confimText === '最终确认') {
                    try {
                        let res = await tapConfimBtnData(
                            this.popCityId,
                            this.dialogSelectValue
                        );
                        let result = res.data;
                        if (result.code === 0) {
                            this.$message.success('操作成功');
                            this.pages.currentPage = 1;
                            this.collocationForm.city_id = '';
                            this.getConfigList();
                        } else {
                            this.$message.error(result.msg);
                        }
                    } catch (err) {
                        this.$message.error(result.msg);
                    }
                    // 弹框关闭
                    this.startInjectDialog = false;
                    this.dialogSelectValue = '';
                    this.popCityId = '';
                }
            } else {
                this.popEmpty = true;
            }
        },
        // 点击弹窗的放弃确认
        cancleConfirm () {
            this.startInjectDialog = false;
            this.popEmpty = false;
            this.dialogSelectValue = '';
            this.popCityId = '';
        },
        /**
         * 编辑城市级配置跳转
         *@param {cityId} formName 当前城市id
         *@param {cityName} formName 当前城市名称
        */
        editorCity (cityId, cityName) {
            this.$router.push({
                path: 'editorCitySetting',
                query: { id: cityId, cityName: cityName }
            });
        },
        // 取消错误提示
        changeOption () {
            this.popEmpty = false;
        }
    }
};
</script>

<style lang="less" scoped>
.error {
    /deep/ .el-input__inner {
        border: 1px solid #f1403c;
        border-radius: 4px;
    }
}
.collocationwrap {
    .bread-nav {
        padding: 20px 0;
    }
    .el-dialog__wrapper {
        background-color: inherit;
    }
    .collocation-form-wrap {
        background-color: #fff;
        padding: 30px 0 0 0;
        .divider {
            width: 98%;
            height: 0;
            margin: 24px auto;
            border-bottom: 1px solid #dcdfe6;
        }
        /deep/ .el-form-item {
            margin-right: 28px;
            &.form-item-center {
                text-align: center;
                width: 100%;
                margin-bottom: 0;
            }
            .el-form-item__label {
                color: #333;
                padding: 0 8px 0 0;
            }
            .el-input,
            .el-range-editor {
                width: 320px;
                height: 40px;
            }
            .el-range-input {
                background-color: #fff;
            }
            .el-button {
                width: 96px;
                height: 40px;
            }
        }
    }
    .collocation-list {
        margin-bottom: 20px;
        .collocation-list-topbar {
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            margin-top: 20px;
            margin-bottom: 19px;
            .flex-start {
                margin-top: 20px;
                font-size: 14px;
            }
            .table-describe {
                color: #666;
                .btn-add {
                    margin-left: 19px;
                }
            }
            .el-button.btn-right {
                width: 128px;
                height: 36px;
                padding: 8px 15px;
                font-size: 14px;
            }
        }
        .collocation-list-table {
            background-color: #fff;
            padding: 21px;
            .split-ico {
                color: #ddd;
            }
            .pages {
                margin: 20px auto 0;
                text-align: center;
            }
            /deep/ .el-table th.gutter {
                // 解决某些电脑缩放导致的表头错位
                display: table-cell !important;
            }
        }
    }
    .injectDialog {
        .choose-source-tit {
            line-height: 24px;
            font-size: 16px;
            padding-bottom: 16px;
        }
        /deep/ .el-dialog__body {
            padding: 20px 20px 10px 20px;
            .el-select {
                display: block;
                margin: 0 auto;
                width: 90%;
            }
        }
        /deep/ .el-dialog__header {
            text-align: center;
            border-bottom: 1px solid #eee;
        }
        /deep/ .el-dialog__footer {
            text-align: center;
        }
        /deep/ .dialog-footer {
            .el-button {
                width: 100px;
            }
        }
    }
}
</style>
