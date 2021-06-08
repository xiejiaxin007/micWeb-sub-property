<!--
    @file: 装修情况表格
    @description: 装修情况表格
    @author: xiebin
    @date: 2020-01-02
-->
<template>
    <div class="property-box">
        <!-- 装修情况 -->
        <div class="years-property-box">
            <el-table
                :data="decorationStatusInfo"
                border
                style="width: 100%">
                <el-table-column
                    label="装修情况"
                    align="center"
                    v-if="tableItemShows['decorate_info']">
                    <template slot-scope="scope">
                        <el-select
                            v-model="scope.row.decorate_info.field_value"
                            placeholder="请选择装修情况"
                            @change="decorateChange($event, scope.row)"
                            @focus="focusSelect">
                            <el-option
                                :disabled="item.disabled"
                                v-for="item in getConfigList.decorate_info"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <p v-show="scope.row.decorate_info.field_value == 1">
                            <jl-number-input
                                class="ipt-val"
                                placeholder="装修费用"
                                v-model="scope.row.decorate_fee.field_value"
                                minVal="1"
                                maxVal="99999"
                                reg="int">
                            </jl-number-input> 元/㎡
                            <el-input
                                maxlength="50"
                                placeholder="请输入装修单位"
                                v-model="scope.row.decorate_unit.field_value">
                            </el-input>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    v-if="tableItemShows['decorate_info'] && tableColStatus['decorate_info'] == '1'">
                    <template
                        slot="header">
                        <info-source-dialog 
                            v-model="projectPropertyYearSel.value"
                            @change="(val, otherVal) => changeAllSource('decorate_info', val, otherVal)"
                            :other-val.sync="projectPropertyYearSel.otherVal"
                            :origin-arr="getConfigList.qd_source_list" />
                    </template>
                    <template
                        slot-scope="scope"
                        v-if="scope.row.decorate_info">
                        <info-source-dialog
                            :other-val.sync="scope.row.decorate_info.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            v-model="scope.row.decorate_info.belong_role" />
                    </template>
                </el-table-column>
                <el-table-column
                    label="关联楼栋"
                    align="center"
                    width="450"
                    v-if="tableItemShows['relation_buildings']">
                    <template slot-scope="scope">
                        <select-building v-model="scope.row.relation_buildings.field_value"
                            class="sel-style"
                            :options="buildRelative"
                            @change="buildingChange"
                            @remove-tag="removeTag">
                        </select-building>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    v-if="tableItemShows['relation_buildings'] && tableColStatus['relation_buildings'] == '1'">
                    <template
                        slot="header">
                        <info-source-dialog 
                            v-model="projectBuildingSel.value"
                            @change="(val, otherVal) => changeAllSource('relation_buildings', val, otherVal)"
                            :other-val.sync="projectBuildingSel.otherVal"
                            :origin-arr="getConfigList.qd_source_list" />
                    </template>
                    <template
                        slot-scope="scope"
                        v-if="scope.row.relation_buildings">
                        <info-source-dialog
                            :other-val.sync="scope.row.relation_buildings.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            v-model="scope.row.relation_buildings.belong_role" />
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="delTableLine(scope.row.id.field_value, scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button
                type="primary"
                class="btn-add-pro"
                @click="addTableLine()">
                新增装修情况
            </el-button>
        </div>
    </div>
</template>

<script>
import InfoSourceDialog from '../components/InfoSourceDialog';
import commonApi from '../api/common';
import propertyApi from '../api/propretyOverview';
import SelectBuilding from '../components/SelectBuilding';
export default {
    props: {
        // 表格数据
        tableDataInfo: {
            type: Object,
            default: () => {}
        },
        // 初始化结构
        initStructureData: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        // 信息来源弹出框
        InfoSourceDialog,
        SelectBuilding
    },
    data() {
        return {
            // 获取通用配置信息
            getConfigList: {},
            // 全部表格数据copy
            tableDataInfoCopy: {},
            // 表格列来源是否显示
            tableColStatus: {},
            // 此表格列是否显示
            tableItemShows: {},
            // 装修情况
            decorationStatusInfo: [],
            decorationStatusInfoCopy: [],
            // 装修情况来源全选
            projectPropertyYearSel: {
                value: '',
                otherVal: ''
            },
            // 关联楼栋来源全选
            projectBuildingSel: {
                value: '',
                otherVal: ''
            },
            // 物业公司下拉
            getPropertyCompanyOptions: [],
            // 关联楼栋下拉
            getRelatedBuildingOpiton: [],
            // 本地存储已选择的数据
            buildingSelVal: [],
            // 产权年限下拉一选择的数据
            propertySelVal: [],
            // 要过滤的下拉的值
            tableDa: []
        }
    },
    computed: {
        // 获取禁用后的楼栋下拉
        buildRelative() {
            return this.getRelatedBuildingOpiton.map(ele => {
                let item = Object.assign({}, ele);
                item.disabled = false;
                if (this.buildingSelVal.includes(ele.id)) {
                    item.disabled = true;
                }
                return item;
            });
        }
    },
    mounted() {
        // 获取通用配置的信息
        this.getConfigList = JSON.parse(localStorage.getItem('getConfigLists'));
        this.tableDa = JSON.parse(JSON.stringify(this.getConfigList.decorate_info));
        // 各个表格数据赋值
        this.copyTbaleData();
    },
    methods: {
        // 保存时向父页面提交值
        pushDataToParents() {
            this.otherBlongRoleInfo();
            return {
                originData: this.decorationStatusInfoCopy,
                newData: this.decorationStatusInfo,
                isRepeat: this.notSelectCompany()
            }
        },
        // 装修单位不能重复选择
        notSelectCompany() {
            let arrList = [];
            let hashList = {};
            // console.log(this.decorationStatusInfo)
            this.decorationStatusInfo.forEach(item => {
                // if (item.decorate_info.field_value == 1) {
                    arrList.push(item.decorate_info.field_value + item.decorate_unit.field_value + item.decorate_fee.field_value);
                // }
            })
            // console.log(arrList)
            for(let i in arrList) {
                if (hashList[arrList[i]]) {
                    return true;
                }
            }
            return false
        },
        // 来源统一
        otherBlongRoleInfo() {
            this.decorationStatusInfo.forEach(item => {
                item.decorate_unit.belong_role = item.decorate_info.belong_role;
                item.decorate_unit.belong_other = item.decorate_info.belong_other;
                item.decorate_fee.belong_role = item.decorate_info.belong_role;
                item.decorate_fee.belong_other = item.decorate_info.belong_other;
            })
        },
        // 遍历初始化数据
        initHouseInfo(initData) {
            const newData = initData.map((ele, idx) => {
                Object.keys(ele).forEach(item => {
                    // 保存返回的此列是否展示来源的值 来源是否展示室一致的，不存在某一行来源展示，另一行数据不展示的情况,直接去第一行数据
                    if (idx === 0) {
                        // 储存需要展示来源的字段
                        this.tableColStatus[item] = ele[item].is_show_belong_role;
                        // 储存需要展示的字段
                        this.tableItemShows[item] = true;
                    }
                })
                return ele;
            })
            this.allData = newData;
        },
        /**
         * 装修情况值发生变化的时候
         * @param {string} value 当前的值
         * @param {string} decoratePrice 装修情况输入框的值
         */
        decorateChange(value, decorate) {
            if (value != 1) {
                decorate.decorate_fee.field_value = '';
                decorate.decorate_unit.field_value = '';
            }
        },
        // 装修情况获取焦点的时候
        focusSelect() {
            this.propertySelVal = [];
            this.decorationStatusInfo.forEach(item => {
                if (item.decorate_info.field_value !== 1) {
                    this.propertySelVal.push(item.decorate_info.field_value);
                }
            })
            this.housesUnique();
        },
        /**
         * 过滤装修情况下拉的重复选项
         */
        housesUnique (){
            this.getConfigList.decorate_info = JSON.parse(JSON.stringify(this.tableDa));
            this.getConfigList.decorate_info = this.getConfigList.decorate_info.map((item, index) => {
                this.propertySelVal.forEach(ele => {
                    if (ele == item.id) {
                        item.disabled = true;
                    }
                })
                return item
            });
        },
        // 各个表格数据赋值
        copyTbaleData() {
            this.tableDataInfoCopy = JSON.parse(JSON.stringify(this.tableDataInfo));
            // 物业公司
            if (this.tableDataInfo.project_decorate_info.data.length <= 0) {
                this.initStructureDataCopy = JSON.parse(JSON.stringify(this.initStructureData));
                this.decorationStatusInfo.push(JSON.parse(JSON.stringify(this.initStructureData.project_decorate_info.data)));
                this.decorationStatusInfoCopy.push(this.initStructureDataCopy.project_decorate_info.data);
            } else {
                this.decorationStatusInfo = this.tableDataInfo.project_decorate_info.data;
                this.decorationStatusInfoCopy = this.tableDataInfoCopy.project_decorate_info.data;
            }
            // 初始化的时候去重校验
            this.decorationStatusInfo.forEach(item => {
                this.buildingSelVal.push(...item.relation_buildings.field_value);
                if (item.decorate_info.field_value !== 1) {
                    this.propertySelVal.push(item.decorate_info.field_value);
                }
            })
            this.getRelatedBuildingSel(this.buildingSelVal);
            this.initHouseInfo(this.decorationStatusInfo);
        },
        // 表格新增
        addTableLine() {
            this.initStructureDataCopy = JSON.parse(JSON.stringify(this.initStructureData));
            this.decorationStatusInfo.push(JSON.parse(JSON.stringify(this.initStructureData.project_decorate_info.data)));
            this.decorationStatusInfoCopy.push(this.initStructureDataCopy.project_decorate_info.data);
            this.initHouseInfo(this.decorationStatusInfo);
        },
        /**
         * 表格删除当前行
         * @param {string} selVal 当前的水电气val
         * @param {string} index 当前行的索引
         */
        delTableLine(selVal, index) {
            this.$confirm('一旦删除则无法恢复确认是否删除！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                    if (selVal === '') {
                        // 删除编辑中数组的数据
                        this.decorationStatusInfo.splice(index, 1);
                        this.initHouseInfo(this.decorationStatusInfo);
                        // 删除源数组的数据
                        this.decorationStatusInfoCopy.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        return;
                    }
                    try {
                        let params = {
                            project_id: this.$route.query.projectId,
                            id: selVal,
                            task_id: this.$route.query.taskId
                        }
                        let result = await propertyApi.delDecorationStatusData(params);
                        let { data } = result;
                        if (data.code === 0) {
                            // 删除编辑中数组的数据
                            this.decorationStatusInfo.splice(index, 1);
                            this.initHouseInfo(this.decorationStatusInfo);
                            // 删除源数组的数据
                            this.decorationStatusInfoCopy.splice(index, 1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            this.$message(data.msg);
                        }
                    }
                    catch(error) {
                        console.log(error);
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
            });
        },
        // 获取关联楼栋下拉
        async getRelatedBuildingSel(row) {
            try {
                let params = {
                    project_id: this.$route.query.projectId,
                    task_id: this.$route.query.taskId
                };
                let result = await commonApi.getProjectBuildingListdata(params);
                let { data } = result;
                if (data.code === 0) {
                    this.getRelatedBuildingOpiton = data.data;
                    if (row !== '') {
                        // 清空本地维护的数据重新将页面的数据push进去
                        this.buildingSelVal = [];
                        this.decorationStatusInfo.forEach(item => {
                            this.buildingSelVal.push(...item.relation_buildings.field_value);
                        })
                        let arr = new Set(this.buildingSelVal);
                        this.buildingSelVal = Array.from(arr);
                    }
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 多选框值放生变化的时候
        buildingChange(value) {
            this.buildingSelVal.push(...value);
            let arr = new Set(this.buildingSelVal);
            this.buildingSelVal = Array.from(arr);
        },
        // 关联楼栋删除项的时候
        removeTag(value) {
            let index = this.buildingSelVal.findIndex(idx => idx == value);
            this.buildingSelVal.splice(index, 1);
        },
        /**
         * 批量修改所在列来源
         * @param {String} name 此列对应的数据字段的key
         * @param {String} value 来源组件传回的值
         * @param {String} otherVal 来源组件传回的选择其他填写的值
         */
        changeAllSource(name, value, otherVal) {
            // 遍历数据 修改所在列的来源绑定的值
            this.allData.forEach(ele => {
                Object.keys(ele).forEach(item => {
                    if (name === item) {
                        ele[item].belong_role = value;
                        ele[item].belong_other = otherVal;
                    }
                });
            })
        },
    }
}
</script>

<style lang="less" scoped>
.property-box {
    .header-title-box {
        margin-top: 20px;
        h2 {
            width: 50%;
            border-bottom: 1px solid #ccc;
            /deep/ .el-button {
                margin-left: 20px;
            }
        }
    }
    // 表格样式
    .years-property-box {
        margin-top: 20px;
        .ipt-val {
            width: 65%;
            margin: 10px 0;
            display: inline-block;
        }
        .number-input-box {
            width: 73%;
        }
        .btn-add-pro {
            margin-top: 15px;
        }
        .sel-style {
            width: 100%;
        }
    }
    /* 清除浮动 */
    .clear-float-box:after {
        display:block;
        clear:both;
        content:"";
        visibility:hidden;
        height:0;
    }
}
</style>