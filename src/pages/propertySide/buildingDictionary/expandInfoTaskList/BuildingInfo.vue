<!--
 * @author: kangxue
 * @Date: 2020-06-03 16:20:17
 * @LastEditors: kangxue
 * @LastEditTime: 2020-08-18 18:27:53
 * @description: 审核详情页 -- 楼栋信息模块
-->
<template>
    <div class="house-type-wrap">
        <el-table :data="tableData"
            :span-method="objectSpanMethod"
            :header-cell-style="{'background': '#f8f8f8'}"
            border>
            <el-table-column align="left"
                prop="pageName"
                label="页面"
                width="100">
            </el-table-column>
            <el-table-column align="left"
                prop="moduleName"
                label="模块">
            </el-table-column>
            <el-table-column align="left"
                prop="fieldName"
                label="字段">
                <template slot-scope="scope">
                    {{scope.row.fieldName}}
                </template>
            </el-table-column>
            <el-table-column align="left"
                prop="value"
                label="变更后的值">
                <template slot-scope="scope">
                    {{scope.row.fieldText || scope.row.value | formatArr}}
                </template>
            </el-table-column>
            <el-table-column align="left"
                prop="oldValue"
                label="变更前的值">
            </el-table-column>
            <el-table-column align="left"
                label="操作"
                width="240">
                <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.operation.operation_type"
                        :disabled="$route.name === 'ShowAuditTaskDetail'"
                        @change="(value) => changeOperation(scope.row.pageKey, value, 'operation_type', scope.row.operation)">
                        <el-radio label="1">新增</el-radio>
                        <el-radio label="2">覆盖</el-radio>
                        <el-radio label="3">不入库</el-radio>
                    </el-radio-group>
                    <div v-if="scope.row.operation.operation_type === '2'">
                        <div>{{scope.row.operation.tips}}</div>
                        <!-- 审核页面 -->
                        <el-select v-model="scope.row.operation.target_id"
                            v-if="$route.name === 'ExpandAuditTaskDetail'"
                            @change="(value) => changeOperation(scope.row.pageKey, value, 'target_id')"
                            placeholder="请选择"
                            filterable
                            :disabled="$route.name === 'ShowAuditTaskDetail'"
                            @focus="getHouseOptions">
                            <el-option v-for="item in options"
                                @click.native="changeOperation(scope.row.pageKey, item.text, 'target_name')"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id"
                                :disabled="item.disabled">
                            </el-option>
                        </el-select>
                        <!-- 查看审核页面 -->
                        <el-select v-model="scope.row.operation.target_id"
                            v-if="$route.name === 'ShowAuditTaskDetail'"
                            disabled
                            placeholder="请选择">
                            <el-option :value="scope.row.operation.target_id"
                                :label="scope.row.operation.target_name"></el-option>
                        </el-select>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import commonApi from '../api/common';
import { commonFun } from '@/assets/js/utils/utils';
export default {
    name: 'BuildingInfo',
    props: {
        datas: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            // 渲染表格的数据
            tableData: [],
            // 操作数组，一个楼栋信息一个操作，单独设置字段在保存时比较好获取重组数据
            operation: [],
            // 初始楼栋下拉
            houseOptions: [],
            // 页面名
            pageName: ''
        };
    },
    computed: {
        // 获取所有选中的楼栋
        allSelectedHouseType() {
            let arr = [];
            this.operation.map(ele => {
                if (ele.target_id) {
                    arr.push(ele.target_id);
                }
            });
            return arr;
        },
        // 获取楼栋禁用的下拉
        options() {
            return this.houseOptions.map(ele => {
                let item = Object.assign({}, ele);
                if (this.allSelectedHouseType.includes(ele.id)) {
                    item.disabled = true;
                }
                return item;
            });
        }
    },
    created() {
        this.getHouseOptions();
    },
    watch: {
        datas: {
            handler: function(val) {
                this.formatData(val);
            }
        }
    },
    filters: {
        /**
         * @description: 过滤器，把数组的值展示成逗号间隔
         * @param {Array | String} 要过滤的值
         * @return: String
         */
        formatArr(data) {
            if (data && Array.isArray(data)) {
                return data.join('，');
            } else {
                return data || '';
            }
        }
    },
    methods: {
        // 获取楼栋下拉数据
        async getHouseOptions() {
            try {
                const options = {
                    project_id: this.$route.query.projectId
                };
                const {
                    data: { code, data }
                } = await commonApi.getProjectBuildingListdata(options);
                if (code === 0) {
                    this.houseOptions = data;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 拼接数据
        formatData(datas) {
            // 单独定义参数，因为楼栋信息可能为空
            this.pageName = datas.page_name;
            // 存储楼栋模块数据
            let infoData = [];
            datas.data.forEach((item, idx) => {
                // 页面->楼栋信息
                this.operation[idx] = item.task_audit_operation;
                // 记录每个大模块里面的字段数
                let pageRow = 0;
                // 循环页面的模块信息
                // console.log('页面', item, idx);
                Object.keys(item).forEach(ele => {
                    // console.log('模块', ele);
                    // 页面->模块->楼栋模块信息
                    if (ele !== 'task_audit_operation') {
                        // 页面->模块->字段->遍历模块下字段
                        const fieldKeys = item[ele].data;
                        let idInfo = fieldKeys.id ? fieldKeys.id : '';
                        if (fieldKeys.id) {
                            delete fieldKeys.id;
                        }
                        Object.keys(fieldKeys).forEach((field, index) => {
                            // console.log('字段', field);
                            pageRow++;
                            let rowObj = {
                                // 楼栋信息
                                pageName: datas.page_name,
                                // 楼栋信息的key值
                                pageKey: idx,
                                // 模块名
                                moduleName: item[ele].module_name,
                                moduleKey: ele,
                                fieldName: fieldKeys[field].field_desc || '',
                                value: fieldKeys[field].field_value || '',
                                fieldText: fieldKeys[field].field_text || '',
                                fieldKey: fieldKeys[field].field_name || '',
                                oldValue: fieldKeys[field].old_data || '',
                                operation: item.task_audit_operation,
                                // id在表格中不展示，提交时需要
                                id: idInfo,
                                // 获取子模块内字段数量作为合并单元格的rowspan
                                moduleRow: index === 0 ? Object.keys(fieldKeys).length : 0
                            };
                            rowObj.initData = fieldKeys[field];
                            infoData.push(rowObj);
                        });
                    }
                });
                // 每一个大模块内字段遍历完成，即可得到页面大模块合并单元格rowspan
                infoData[idx * pageRow].pageRow = pageRow;
            });
            this.tableData = infoData;
        },
        // 合并单元格方法
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0 || columnIndex === 5) {
                if (row.pageRow) {
                    return {
                        rowspan: row.pageRow,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            } else if (columnIndex === 1) {
                if (row.moduleRow) {
                    return {
                        rowspan: row.moduleRow,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
        /**
         * @description: 新增、覆盖、不入库切换；覆盖下拉
         * @param {int} key  当前是第几个楼栋信息的选择
         * @param {String} value  选中的信息
         * @param {String} field  operation中要覆盖的属性
         * @param {Object} info  当前项的operation
         * @return: null
         */
        changeOperation(key, value, field, info) {
            if (!this.operation[key]) {
                this.operation[key] = {};
            }
            this.operation[key][field] = value;
            // 切换新增、覆盖、不入库时，清空变更前的值，清空已选择的楼栋id
            if (field === 'operation_type') {
                this.tableData.forEach(item => {
                    if (item.pageKey === key) {
                        item.oldValue = '';
                        if (item.id) {
                            item.id.old_data = '';
                        }
                    }
                });
                this.operation[key].target_id = '';
                this.operation[key].target_name = '';
                info.target_id = '';
                info.target_name = '';
            }
            // 下拉切换时赋值到变更前
            if (field === 'target_id') {
                this.getSelectInfo(value)
                    .then(data => {
                        this.tableData.forEach(item => {
                            if (item.pageKey === key && data.hasOwnProperty(item.fieldKey)) {
                                if (data[item.fieldKey] && data[item.fieldKey].constructor === Object) {
                                    item.oldValue = data[item.fieldKey].name;
                                } else {
                                    item.oldValue = data[item.fieldKey];
                                }
                                // id在表格中不展示，单独放在字段中，在这单独赋值
                                if (item.id) {
                                    item.id.old_data = data.id;
                                }
                            }
                        });
                    })
                    .catch(msg => {
                        this.$message.error(msg);
                    });
            }
        },
        /**
         * @description: 获取楼栋下拉的详情数据
         * @param {string} id  楼栋id
         * @return: {}
         */
        getSelectInfo(id) {
            return new Promise(async (resolve, reject) => {
                try {
                    const options = {
                        building_id: id
                    };
                    const {
                        data: { code, data, msg }
                    } = await commonApi.getBuildingInfo(options);
                    if (code === 0) {
                        resolve(data);
                    } else {
                        reject(msg);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        },
        // 校验数据
        save() {
            for (var i = 0; i < this.operation.length; i++) {
                let item = this.operation[i];
                if (!item.operation_type || (item.operation_type === '2' && !item.target_id)) {
                    return false;
                }
            }
            return true;
        },
        // 获取保存数据
        getSaveData() {
            return this.reFormatData();
        },
        // 保存重组数据
        reFormatData() {
            const datas = this.tableData;
            let newdata = [];
            datas.forEach((item, idx) => {
                if (!newdata[item.pageKey]) {
                    newdata[item.pageKey] = {};
                }
                // 操作
                if (!newdata[item.pageKey].task_audit_operation) {
                    newdata[item.pageKey].task_audit_operation = this.operation[item.pageKey];
                }
                // 模块
                if (!newdata[item.pageKey][item.moduleKey]) {
                    newdata[item.pageKey][item.moduleKey] = {
                        module_name: item.moduleName,
                        data: {}
                    };
                }
                // 字段
                let fieldList = newdata[item.pageKey][item.moduleKey].data;
                // 将楼栋id再重组回来
                if (item.moduleKey === 'building_base_detail' && !fieldList.id) {
                    fieldList.id = item.id;
                }
                if (!fieldList[item.fieldKey]) {
                    fieldList[item.fieldKey] = commonFun.deepClone(item.initData);
                    fieldList[item.fieldKey].old_data = item.oldValue || '';
                }
            });
            let obj = {
                data: newdata,
                page_name: this.pageName
            };
            return obj;
        }
    }
};
</script>

<style lang="less" scoped>
.el-radio-group {
    margin-bottom: 10px;
}
.el-radio {
    margin-right: 10px;
}
</style>