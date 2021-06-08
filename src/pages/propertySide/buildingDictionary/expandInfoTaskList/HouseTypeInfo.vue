<!--
 * @author: kangxue
 * @Date: 2020-06-03 16:20:17
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2020-09-10 17:23:08
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
                    <div v-if="scope.row.fieldKey !== 'apart_img'">
                        {{scope.row.fieldText || scope.row.value | formatArr}}
                    </div>
                    <div v-else>
                        <ul class="apart-img-list">
                            <li v-for="(item, key) in scope.row.fieldText"
                                :key="key">
                                <img :src="host+item.apart_img.field_value"
                                    alt="户型图">
                                <div v-if="item.storey"
                                    class="img-storey">{{item.storey.field_text}}</div>
                            </li>
                        </ul>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="left"
                prop="oldValue"
                label="变更前的值">
                <template slot-scope="scope">
                    <div v-if="scope.row.fieldKey !== 'apart_img'">
                        {{scope.row.oldValue}}
                    </div>
                    <div v-else>
                        <ul class="apart-img-list">
                            <li v-for="(item, key) in scope.row.oldValue"
                                :key="key">
                                <img :src="host+item.apart_img"
                                    alt="户型图">
                                <div v-if="item.storey"
                                    class="img-storey">{{item.storey.name}}</div>
                            </li>
                        </ul>
                    </div>
                </template>
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
import { mapState } from 'vuex';
import commonApi from '../api/common';
import { commonFun } from '@/assets/js/utils/utils';
export default {
    name: 'HouseTypeInfo',
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
            // 操作数组，一个户型信息一个操作，单独设置字段在保存时比较好获取重组数据
            operation: [],
            // 初始户型下拉
            houseOptions: [],
            // 页面名
            pageName: ''
        };
    },
    computed: {
        ...mapState({
            // 获取图片host
            host: state => state.buildingDictionary.ossOriginHost
        }),
        // 获取所有选中的户型
        allSelectedHouseType() {
            let arr = [];
            this.operation.map(ele => {
                if (ele.target_id) {
                    arr.push(ele.target_id);
                }
            });
            return arr;
        },
        // 获取户型禁用的下拉
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
        // 监听传输来的户型信息并重组数据
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
        // 获取户型下拉数据
        async getHouseOptions() {
            try {
                const options = {
                    project_id: this.$route.query.projectId,
                    // 过滤假户型
                    select_false: 0
                };
                const {
                    data: { code, data }
                } = await commonApi.getHouseTypeListData(options);
                if (code === 0) {
                    this.houseOptions = data;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 拼接数据
        formatData(datas) {
            this.pageName = datas.page_name;
            // 存储户型模块数据
            let infoData = [];
            datas.data.forEach((item, idx) => {
                // 页面->户型信息
                this.operation[idx] = item.task_audit_operation;
                // 记录每个大模块里面的字段数
                let pageRow = 0;
                // 循环页面的模块信息
                // console.log('页面', item, idx);
                Object.keys(item).forEach(ele => {
                    // 页面->模块->户型模块信息
                    if (ele !== 'task_audit_operation') {
                        // console.log('模块', ele);
                        if (ele !== 'house_type_detail_imgs') {
                            // 页面->模块->字段->遍历模块下字段
                            const fieldKeys = item[ele].data;
                            let idInfo = fieldKeys.house_type_id ? fieldKeys.house_type_id : '';
                            if (fieldKeys.house_type_id) {
                                delete fieldKeys.house_type_id;
                            }
                            Object.keys(fieldKeys).forEach((field, index) => {
                                // console.log('字段', field);
                                pageRow++;
                                let rowObj = {
                                    // 户型信息
                                    pageName: datas.page_name,
                                    // 户型信息的key值
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
                                    // 获取子模块内字段数量作为合并单元格的rowspan
                                    moduleRow: index === 0 ? Object.keys(fieldKeys).length : 0
                                };
                                // house_type_id在表格中不展示，提交时需要
                                if (ele === 'house_type_base_detail') {
                                    rowObj.house_type_id = idInfo;
                                }
                                rowObj.initData = fieldKeys[field];
                                infoData.push(rowObj);
                            });
                        } else {
                            pageRow++;
                            infoData.push({
                                pageName: datas.page_name,
                                pageKey: idx,
                                moduleName: item[ele].module_name,
                                moduleKey: ele,
                                fieldName: item[ele].module_name,
                                value: item[ele].data.apart_img,
                                fieldText: item[ele].data.apart_img,
                                fieldKey: 'apart_img',
                                oldValue: item[ele].data.old_data,
                                operation: item.task_audit_operation,
                                moduleRow: 1,
                                initData: item[ele].data
                            });
                        }
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
         * @param {int} key  当前是第几个户型信息的选择
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
            // 切换新增、覆盖、不入库时，清空变更前的值，清空已选择的户型id
            if (field === 'operation_type') {
                this.tableData.forEach(item => {
                    if (item.pageKey === key) {
                        item.oldValue = '';
                        if (item.house_type_id) {
                            item.house_type_id.old_data = '';
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
                                if (item.house_type_id) {
                                    item.house_type_id.old_data = data.house_type_id;
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
         * @description: 获取户型下拉的详情数据
         * @param {string} id  户型id
         * @return: {}
         */
        getSelectInfo(id) {
            return new Promise(async (resolve, reject) => {
                try {
                    const options = {
                        house_type_id: id,
                        is_images: 1,
                        is_building: 1
                    };
                    const {
                        data: { code, data, msg }
                    } = await commonApi.getHouseTypeInfo(options);
                    if (code === 0) {
                        let buildName = [];
                        data.building_relation.forEach(item => {
                            buildName.push(item.building_name);
                        });
                        let newData = commonFun.deepClone(data.house_type);
                        newData.relation_buildings = buildName.join('，');
                        newData.apart_img = commonFun.deepClone(data.house_type_img);
                        resolve(newData);
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
                // 将户型id再重组回来
                if (item.moduleKey === 'house_type_base_detail' && !fieldList.house_type_id) {
                    fieldList.house_type_id = item.house_type_id;
                }
                if (!fieldList[item.fieldKey]) {
                    if (item.fieldKey !== 'apart_img') {
                        fieldList[item.fieldKey] = commonFun.deepClone(item.initData);
                        fieldList[item.fieldKey].old_data = item.oldValue || '';
                    } else {
                        fieldList[item.fieldKey] = commonFun.deepClone(item.initData.apart_img);
                        fieldList.old_data = item.oldValue || [];
                    }
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
.apart-img-list {
    li {
        float: left;
        position: relative;
        width: 100px;
        height: 100px;
        border: 1px solid #eee;
        margin: 4px;
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .img-storey {
            position: absolute;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            width: 100%;
            text-align: center;
        }
    }
}
</style>