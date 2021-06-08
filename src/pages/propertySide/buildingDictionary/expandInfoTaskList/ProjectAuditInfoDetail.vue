<!--
    @file: 楼盘信息审核表格页面
    @description: 楼盘信息审核表格页面
    @author: xiebin
    @date: 2020-01-08
-->
<template>
    <div class="expand-list-box">
        <el-table :data="tableData"
            :span-method="objectSpanMethod"
            :header-cell-style="{'background': '#f8f8f8'}"
            border>
            <el-table-column align="left"
                prop="pageName"
                label="页面"
                width="160">
            </el-table-column>
            <el-table-column align="left"
                prop="moduleName"
                label="模块">
            </el-table-column>
            <el-table-column align="left"
                prop="fieldName"
                label="字段">
            </el-table-column>
            <el-table-column align="left"
                prop="value"
                label="变更后的值">
                <template slot-scope="scope">
                    <div v-if="scope.row.fieldKey === 'coordinate' || scope.row.fieldKey === 'lat_lng'">
                        <span @click="showLatLng(scope.row.fieldName, scope.row.value)"
                            class="router-link">{{scope.row.fieldText || scope.row.value}}</span>
                    </div>
                    <div v-else>
                        {{scope.row.fieldText || scope.row.value | formatArr}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="left"
                prop="oldValue"
                label="变更前的值">
                <template slot-scope="scope">
                    <div v-if="scope.row.fieldKey === 'coordinate' || scope.row.fieldKey === 'lat_lng'">
                        <span @click="showLatLng(scope.row.fieldName, scope.row.oldValue)"
                            class="router-link">{{scope.row.oldValue}}</span>
                    </div>
                    <div v-else>
                        {{scope.row.oldValue | formatArr}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="left"
                label="操作"
                width="240">
                <template slot-scope="scope">
                    <div v-if="!scope.row.operation || !scope.row.operation.is_have_add">
                        <el-radio-group v-model="scope.row.operation"
                            :disabled="$route.name === 'ShowAuditTaskDetail'">
                            <el-radio label="2"
                                v-if="scope.row.fieldKey !== 'project_type' && scope.row.fieldKey !== 'name'">覆盖</el-radio>
                            <el-radio label="3">不入库</el-radio>
                        </el-radio-group>
                    </div>
                    <div v-else>
                        <el-radio-group v-model="scope.row.operation.operation_type"
                            @change="(value) => changeRadio(scope.row.operation.module, value, scope.row.operation)"
                            :disabled="$route.name === 'ShowAuditTaskDetail'">
                            <el-radio label="1">新增</el-radio>
                            <el-radio label="2">覆盖</el-radio>
                            <el-radio label="3">不入库</el-radio>
                        </el-radio-group>
                        <div v-show="scope.row.operation.operation_type === '2'"
                            class="operation-type-box">
                            <div>{{scope.row.operation.tips}}</div>
                            <!-- 审核页面 -->
                            <el-select v-model="scope.row.operation.target_id"
                                v-if="$route.name === 'ExpandAuditTaskDetail'"
                                @change="(value) => changeOperation(scope.row.operation.module, value, scope.row.operation)"
                                placeholder="请选择">
                                <el-option v-for="item in allOptions[scope.row.operation.module]"
                                    @click.native="handleOption(item.name, scope.row.operation)"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
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
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 经纬度访问百度地址 -->
        <el-dialog :title="latLngTitle"
            :visible.sync="latLngDialog"
            class="lat-lng-dialog"
            width="550px"
            center>
            <el-form class="my-form">
                <building-map class="map-content"
                    :warpWeptVal="warpWeptVal"
                    :isShow="latLngDialog"
                    type="salesOffPosition"
                    :inputIsShow="false"
                    mapId="mapContanerOne"
                    inputId="suggestIdOne">
                </building-map>
            </el-form>
            <div slot="footer"
                class="dialog-footer">
                <el-button type="primary"
                    @click="latLngDialog = false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { commonFun } from '@/assets/js/utils/utils';
import commonApi from '../api/common';
import BuildingMap from '../components/BuildingMap';
export default {
    name: 'ExpandAuditTaskDetail',
    props: {
        datas: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    components: {
        BuildingMap
    },
    data() {
        return {
            // 渲染表格的数据
            tableData: [],
            // 经纬度弹窗名字
            latLngTitle: '',
            // 经纬度值
            warpWeptVal: {},
            // 是否展示经纬度弹窗
            latLngDialog: false,
            // 下拉框组合
            options: {},
            // 模块内字段长度组合，合并单元格使用
            moduleRowList: {}
        };
    },
    watch: {
        // 监听传输来的户型信息并重组数据
        datas: {
            handler: function(val) {
                this.formatData(val);
            }
        }
    },
    computed: {
        // 所有下拉选中的集合
        allSelectedVal() {
            let obj = {};
            this.tableData.forEach(item => {
                if (item.operation.constructor === Object) {
                    if (item.operation.target_id) {
                        if (!obj[item.operation.module]) {
                            obj[item.operation.module] = [];
                        }
                        obj[item.operation.module].push(item.operation.target_id);
                    }
                }
            });
            return obj;
        },
        // 获取禁用的下拉
        allOptions() {
            let obj = {};
            for (var i in this.options) {
                obj[i] = this.options[i].map(ele => {
                    let item = Object.assign({}, ele);
                    if (this.allSelectedVal[i] && this.allSelectedVal[i].includes(ele.value)) {
                        item.disabled = true;
                    }
                    return item;
                });
            }
            return obj;
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
        // 拼接数据
        formatData(dataInfo) {
            if (!dataInfo) {
                return false;
            }
            // 楼盘信息模块的数据
            let datas = {};
            // 去除与楼盘信息无关的数据
            Object.keys(dataInfo).forEach(key => {
                if (key !== 'house_type_detail_page' && key !== 'building_detail_page') {
                    datas[key] = dataInfo[key];
                }
            });
            // 重组数据
            let infoData = [];
            // 解决页面在哪一行合并单元格定义的数组
            let pageRowData = [];
            Object.keys(datas).forEach((idx, key) => {
                // 记录每个大页面里面的字段数
                let pageRow = 0;
                // 每个模块的信息
                const houseItem = datas[idx].data;
                Object.keys(houseItem).forEach((ele, eleKey) => {
                    if (!Array.isArray(houseItem[ele].data)) {
                        let arr = [];
                        arr.push(commonFun.deepClone(houseItem[ele].data));
                        houseItem[ele].data = arr;
                    }
                    // 子模块信息合并单元格长度
                    let moduleRow = 0;
                    houseItem[ele].data.forEach((fields, fieldsIndex) => {
                        // 遍历每个字段
                        // console.log('----子模块', fieldsIndex, fields);
                        // 不展示id
                        let idInfo = fields.id ? fields.id : '';
                        if (fields.id) {
                            delete fields.id;
                        }
                        // 不展示模块的task_audit_operation
                        let mdOperation = fields.task_audit_operation ? fields.task_audit_operation : '';
                        if (fields.task_audit_operation) {
                            delete fields.task_audit_operation;
                        }
                        // 字段长度
                        let fieldsLen = Object.keys(Object.assign(fields)).length;
                        if (fieldsLen > 0) {
                            moduleRow += fieldsLen;
                            this.moduleRowList[ele] = moduleRow;
                            // console.log('--------字段长度', fieldsLen - 1, '合并模块', fieldsIndex, moduleRow);
                            Object.keys(fields).forEach((field, index) => {
                                // console.log('--------字段', field, index);
                                pageRow++;
                                // 操作列合并
                                let fieldRow;
                                if (mdOperation) {
                                    fieldRow = index === 0 ? fieldsLen : 0;
                                } else {
                                    fieldRow = 1;
                                }
                                let rowObj = {
                                    pageName: datas[idx].page_name,
                                    // 页面的key值
                                    pageKey: idx,
                                    // 模块名
                                    moduleName: houseItem[ele].module_name,
                                    moduleKey: ele,
                                    subModuleIndex: fieldsIndex,
                                    fieldName: fields[field].field_desc || '',
                                    fieldText: fields[field].field_text || '',
                                    fieldKey: fields[field].field_name || '',
                                    value: fields[field].field_value || '',
                                    oldValue: fields[field].old_data || '',
                                    operation: mdOperation || fields[field].task_audit_operation || '',
                                    // id在表格中不展示，提交时需要
                                    id: idInfo,
                                    // 字段操作合并的rowspan
                                    fieldRow: fieldRow,
                                    // 模块合并的rowspan，最后在合并单元格使用moduleRowList中的值
                                    moduleRow: fieldsIndex === 0 && index === 0 ? houseItem[ele].data.length * fieldsLen : 0
                                };
                                rowObj.initData = fields[field];
                                infoData.push(rowObj);
                            });
                        }
                    });
                });
                // 设定在表格多少行的时候进行单元格合并
                let pageRowKey = 0;
                pageRowData[key] = {
                    pageRow: pageRow
                };
                if (key !== 0) {
                    pageRowKey = this.getPageKey(pageRowData);
                }
                if (pageRow > 0) {
                    infoData[pageRowKey].pageRow = pageRow;
                }
            });
            this.tableData = infoData;
        },
        /**
         * @description: 获取页面再第几行合并
         * @param {Array}  pageRowData   数组
         * @return: number
         */
        getPageKey(pageRowData) {
            let res = 0;
            let len = pageRowData.length - 1;
            for (let i = 0; i < len; i++) {
                res += pageRowData[i].pageRow;
            }
            return res;
        },
        // 合并单元格方法
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
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
                        rowspan: this.moduleRowList[row.moduleKey],
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            } else if (columnIndex === 5) {
                if (row.fieldRow) {
                    return {
                        rowspan: row.fieldRow,
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
         * @description: 新增、覆盖、不入库切换
         * @param {int} key  子模块key
         * @param {String} value  选中的信息
         * @param {Object} info  当前项的operation
         * @return: null
         */
        changeRadio(key, value, info) {
            // 切换新增、覆盖、不入库时，清空变更前的值，清空operation中已选择的值
            this.tableData.forEach(item => {
                if (item.operation.constructor === Object) {
                    if (item.operation.target_id === info.target_id) {
                        item.oldValue = '';
                        item.id.old_data = '';
                    }
                }
            });
            info.target_id = '';
            info.target_name = '';
            if (value === '2' && !this.options[key]) {
                this.getOptions(key);
            }
        },
        /**
         * @description: 选择下拉获取下拉详情，覆盖变更前的值
         * @param {int} key  当前是第几个户型信息的选择
         * @param {String} value  选中的信息
         * @param {Object} info  当前项的operation
         * @return: null
         */
        changeOperation(key, value, info) {
            // 下拉切换时赋值到变更前
            this.getOptionsInfo(key, value)
                .then(data => {
                    this.tableData.forEach(item => {
                        if (item.operation.constructor === Object) {
                            if (item.operation.target_id === value) {
                                // id在表格中不展示，单独放在字段中，在这单独赋值
                                item.id.old_data = data.id;
                                if (data.hasOwnProperty(item.fieldKey)) {
                                    if (item.fieldKey === 'relation_buildings') {
                                        let arr = data[item.fieldKey].map(x => x.building_name);
                                        item.oldValue = arr.join('，');
                                    } else if (item.fieldKey === 'relation_house_types') {
                                        let arr = data[item.fieldKey].map(x => x.house_type_num);
                                        item.oldValue = arr.join('，');
                                    } else {
                                        if (data[item.fieldKey] && data[item.fieldKey].constructor === Object) {
                                            item.oldValue = data[item.fieldKey].name;
                                        } else {
                                            item.oldValue = data[item.fieldKey];
                                        }
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(msg => {
                    this.$message.error(msg);
                });
        },
        /**
         * @description: 点击下拉框文本赋值
         * @param {String} value  选中的下拉框文本
         * @param {Object} info  当前项的operation
         * @return: null
         */
        handleOption(value, info) {
            info.target_name = value;
        },
        /**
         * @description: 获取下拉，楼盘里都是静态下拉，如果存在值就不重新请求
         * @param {String} mkey  模块id
         * @return: null
         */
        async getOptions(mkey) {
            try {
                const options = {
                    project_id: this.$route.query.projectId
                };
                const {
                    data: { code, data, msg }
                } = await commonApi.getAuditListData(options, mkey);
                if (code === 0) {
                    this.$set(this.options, mkey, data.list);
                } else {
                    this.$message.error(msg);
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: 获取下拉详情
         * @param {String} mkey  模块id
         * @param {String} id  请求详情的id
         * @return: null
         */
        getOptionsInfo(mkey, id) {
            return new Promise(async (resolve, reject) => {
                try {
                    // 放量详情
                    const options = {
                        id: id,
                        extend_data: mkey === 'volume_living_volume_info' ? 'relation_building,relation_house_type' : 'relation_building'
                    };
                    const {
                        data: { code, data, msg }
                    } = await commonApi.getAuditDetailData(options, mkey);
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
            for (var i = 0; i < this.tableData.length; i++) {
                let operation = this.tableData[i].operation;
                if (operation.constructor === Object) {
                    if (!operation.operation_type || (operation.operation_type === '2' && !operation.target_id)) {
                        return false;
                    }
                } else {
                    if (!operation) {
                        return false;
                    }
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
            let newdata = {};
            datas.forEach((item, idx) => {
                // 页面
                if (!newdata[item.pageKey]) {
                    newdata[item.pageKey] = {
                        data: {},
                        page_name: item.pageName
                    };
                }
                // 模块
                if (!newdata[item.pageKey].data[item.moduleKey]) {
                    newdata[item.pageKey].data[item.moduleKey] = {
                        module_name: item.moduleName,
                        data: item.operation.constructor === Object ? [] : {}
                    };
                }
                // 字段
                let fieldList = newdata[item.pageKey].data[item.moduleKey].data;
                if (item.operation.constructor === Object) {
                    // 有新增，覆盖，不入库三种操作的
                    if (!fieldList[item.subModuleIndex]) {
                        fieldList[item.subModuleIndex] = {
                            id: item.id,
                            task_audit_operation: item.operation
                        };
                    }
                    if (!fieldList[item.subModuleIndex][item.fieldKey]) {
                        fieldList[item.subModuleIndex][item.fieldKey] = commonFun.deepClone(item.initData);
                        fieldList[item.subModuleIndex][item.fieldKey].old_data = item.oldValue || '';
                    }
                } else {
                    // 只有覆盖与不入库这种单条操作的
                    if (!fieldList[item.fieldKey]) {
                        fieldList[item.fieldKey] = commonFun.deepClone(item.initData);
                        fieldList[item.fieldKey].task_audit_operation = item.operation;
                    }
                }
            });
            return newdata;
        },
        /**
         * @description: 经纬度弹窗展示百度地图
         * @param {String} name  经纬度弹窗名字
         * @param {String} value  经纬度
         * @return: null
         */
        showLatLng(name, value) {
            this.latLngTitle = name;
            this.latLngDialog = true;
            let arr = value.split(',');
            this.warpWeptVal = {
                lngVal: arr[0],
                latVal: arr[1]
            };
        }
    }
};
</script>

<style lang="less" scoped>
.operation-type-box {
    margin-top: 10px;
}
.el-radio {
    margin-right: 10px;
}
.router-link {
    color: #0088cc;
    text-decoration: underline;
    cursor: pointer;
}
.lat-lng-dialog /deep/ .el-dialog__body {
    padding: 10px 25px 0px;
}
.map-content.item-list-box {
    /deep/ .form-input-box {
        width: 100%;
        .map-style {
            width: 100%;
        }
    }
}
</style>