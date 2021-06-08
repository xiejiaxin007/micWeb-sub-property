<!--
    @file: 产权年限表格
    @description: 产权年限表格
    @author: xiebin
    @date: 2020-01-02
-->
<template>
    <div class="property-box">
        <!-- 产权年限 -->
        <div class="years-property-box">
            <el-table
                :data="projectPropertyYearInfo"
                border
                style="width: 100%">
                <el-table-column
                    label="产权年限"
                    align="center"
                    v-if="tableItemShows['property_year']">
                    <template slot-scope="scope">
                        <el-select
                            v-model="scope.row.property_year.field_value"
                            placeholder="请选择产权年限"
                            @change="yearChange($event, scope.row)"
                            @focus="focusSelect">
                            <el-option
                                :disabled="item.disabled"
                                v-for="item in getConfigList.property_year"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <el-input
                            class="ipt-val"
                            @input="blurIpt(scope.row)"
                            @blur="iptBlur(scope.row)"
                            v-model="scope.row.property_year_other.field_value"
                            v-show="scope.row.property_year.field_value == -1">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    v-if="tableItemShows['property_year'] && tableColStatus['property_year'] == '1'">
                    <template
                        slot="header">
                        <info-source-dialog 
                            v-model="projectPropertyYearSel.value"
                            @change="(val, otherVal) => changeAllSource('property_year', val, otherVal)"
                            :other-val.sync="projectPropertyYearSel.otherVal"
                            :origin-arr="getConfigList.qd_source_list" />
                    </template>
                    <template
                        slot-scope="scope"
                        v-if="scope.row.property_year">
                        <info-source-dialog
                            :other-val.sync="scope.row.property_year.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            v-model="scope.row.property_year.belong_role" />
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
                @click="addTableLine">
                新增产权年限
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
            // 产权年限
            projectPropertyYearInfo: [],
            projectPropertyYearInfoCopy: [],
            // 产权年限来源全选
            projectPropertyYearSel: {
                value: '',
                otherVal: ''
            },
            // 关联楼栋来源全选
            projectBuildingSel: {
                value: '',
                otherVal: ''
            },
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
        },
    },
    mounted() {
        // 获取通用配置的信息
        this.getConfigList = JSON.parse(localStorage.getItem('getConfigLists'));
        this.tableDa = JSON.parse(JSON.stringify(this.getConfigList.property_year));
        // 各个表格数据赋值
        this.copyTbaleData();
    },
    methods: {
        // 保存时向父页面提交值
        pushDataToParents() {
            this.otherBlongRoleInfo()
            return {
                originData: this.projectPropertyYearInfoCopy,
                newData: this.projectPropertyYearInfo,
                isEmpty: this.projectPropertyYearInfo.length <= 0 ? true : false,
                isRepeat: this.notSelectCompany()
            }
        },
        // 产权年限其他的值不能重复填写
        notSelectCompany() {
            let arrList = [];
            let hashList = {};
            this.projectPropertyYearInfo.forEach(item => {
                if (item.property_year.field_value == -1) {
                    arrList.push(item.property_year_other.field_value);
                }
            })
            for(let i in arrList) {
                if (hashList[arrList[i]]) {
                    return true;
                }
            }
            return false
        },
        // 给产权年限的其他输入框的信息来源赋值
        otherBlongRoleInfo() {
            this.projectPropertyYearInfo.forEach(item => {
                item.property_year_other.belong_role = item.property_year.belong_role;
                item.property_year_other.belong_other = item.property_year.belong_other;
            })
        },
        /**
         * 遍历初始化数据
         * @param {array} initData 初始化数组
         */
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
         * 产权年限其他输入框
         * @param {object} iptval 当前行的数据
         */
        blurIpt(iptVal) {
            iptVal.property_year_other.field_value = iptVal.property_year_other.field_value.replace(/[^\d]/g, '')
            iptVal.property_year_other.field_value = iptVal.property_year_other.field_value.replace(/(?:20|40|70|50)/g, '');
        },
        /**
         * 产权年限其他输入框失去焦点
         * @param {object} iptval 当前行的数据
         */
        iptBlur(iptVal) {
            // 最大值是999
            if (iptVal.property_year_other.field_value > 999) {
                iptVal.property_year_other.field_value = 999;
            } else if (iptVal.property_year_other.field_value < 1) {
                iptVal.property_year_other.field_value = 1;
            }
        },
        /**
         * 产权年限值发生变化的时候
         * @param {string} value 当前的值
         * @param {string} iptVal 其他输入框的值
         */
        yearChange(value, iptVal) {
            this.propertySelVal = [];
            if (value != -1) {
                iptVal.property_year_other.field_value = '';
                iptVal.property_year_other.is_show_belong_role = '2';
                this.projectPropertyYearInfo.forEach(item => {
                    if (item.property_year.field_value !== -1) {
                        this.propertySelVal.push(item.property_year.field_value);
                    }
                })
            }
            else if (this.getConfigList.current_role_source == 7) {
                iptVal.property_year_other.is_show_belong_role = '1';
            }
            this.housesUnique();
        },
        // 产权年限获取焦点的时候
        focusSelect() {
            this.propertySelVal = [];
            this.projectPropertyYearInfo.forEach(item => {
                if (item.property_year.field_value !== -1) {
                    this.propertySelVal.push(item.property_year.field_value);
                }
            })
            this.housesUnique();
        },
        /**
         * 过滤产权年限下拉的重复选项
         */
        housesUnique (){
            this.getConfigList.property_year = JSON.parse(JSON.stringify(this.tableDa));
            this.getConfigList.property_year = this.getConfigList.property_year.map((item, index) => {
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
            // 产权年限
            if (this.tableDataInfo.project_property_year_info.data.length <= 0) {
                this.initStructureDataCopy = JSON.parse(JSON.stringify(this.initStructureData));
                this.projectPropertyYearInfo.push(JSON.parse(JSON.stringify(this.initStructureData.project_property_year_info.data)));
                this.projectPropertyYearInfoCopy.push(this.initStructureDataCopy.project_property_year_info.data);
            } else {
                this.projectPropertyYearInfo = this.tableDataInfo.project_property_year_info.data;
                this.projectPropertyYearInfoCopy = this.tableDataInfoCopy.project_property_year_info.data;
            }
            // 初始化的时候去重校验
            this.projectPropertyYearInfo.forEach(item => {
                this.buildingSelVal.push(...item.relation_buildings.field_value);
                if (item.property_year.field_value !== -1) {
                    this.propertySelVal.push(item.property_year.field_value);
                }
            })
            this.getRelatedBuildingSel(this.buildingSelVal);
            this.initHouseInfo(this.projectPropertyYearInfo);
        },
        /**
         * 表格新增
         * @param {string} type 表格类型
         */
        addTableLine() {
                this.initStructureDataCopy = JSON.parse(JSON.stringify(this.initStructureData));
                this.projectPropertyYearInfo.push(JSON.parse(JSON.stringify(this.initStructureData.project_property_year_info.data)));
                this.projectPropertyYearInfoCopy.push(this.initStructureDataCopy.project_property_year_info.data);
                this.initHouseInfo(this.projectPropertyYearInfo);
        },
        /**
         * 表格删除当前行
         * @param {string} selVal 当前选择的产权年限
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
                        this.projectPropertyYearInfo.splice(index, 1);
                        this.initHouseInfo(this.projectPropertyYearInfo);
                        // 删除源数组的数据
                        this.projectPropertyYearInfoCopy.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        return;
                    }
                    try {
                        let params = {
                            project_id: this.$route.query.projectId,
                            property_year: selVal,
                            task_id: this.$route.query.taskId
                        }
                        let result = await propertyApi.delPropertyYearData(params);
                        let { data } = result;
                        if (data.code === 0) {
                            // 删除编辑中数组的数据
                            this.projectPropertyYearInfo.splice(index, 1);
                            this.initHouseInfo(this.projectPropertyYearInfo);
                            // 删除源数组的数据
                            this.projectPropertyYearInfoCopy.splice(index, 1);
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
                    this.buildingSelVal = [];
                    this.projectPropertyYearInfo.forEach(item => {
                        this.buildingSelVal.push(...item.relation_buildings.field_value);
                    })
                    let arr = new Set(this.buildingSelVal);
                    this.buildingSelVal = Array.from(arr);
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
        }
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
            margin-top: 10px;
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