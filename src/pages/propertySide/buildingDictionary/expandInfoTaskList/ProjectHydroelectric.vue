<!--
    @file: 水电气表格
    @description: 水电气表格
    @author: xiebin
    @date: 2020-01-02
-->
<template>
    <div class="property-box">
        <!-- 水电气 -->
        <div class="years-property-box">
            <el-table
                :data="HydroelectricInfo"
                border
                style="width: 100%">
                <el-table-column
                    label="水电气"
                    align="center"
                    v-if="tableItemShows['water_electy']">
                    <template slot-scope="scope">
                        <el-input
                            maxlength="50"
                            v-model="scope.row.water_electy.field_value"
                            placeholder="请输入水电气">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    v-if="tableItemShows['water_electy'] && tableColStatus['water_electy'] == '1'">
                    <template
                        slot="header">
                        <info-source-dialog 
                            v-model="projectPropertyYearSel.value"
                            @change="(val, otherVal) => changeAllSource('water_electy', val, otherVal)"
                            :other-val.sync="projectPropertyYearSel.otherVal"
                            :origin-arr="getConfigList.qd_source_list" />
                    </template>
                    <template
                        slot-scope="scope"
                        v-if="scope.row.water_electy">
                        <info-source-dialog
                            :other-val.sync="scope.row.water_electy.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            v-model="scope.row.water_electy.belong_role" />
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
                @click="addTableLine('yearProperty')">
                新增水电气
            </el-button>
            <el-tooltip placement="top">
                <div slot="content">
                    住宅：有燃气：民水民电燃气；无燃气：民水民电；
                    <br />
                    商住：商水商电；如果是民水民电的话，写市政供水供电（避免风险）。
                </div>
                <i class="el-icon-warning"
                    aria-hidden="true"></i>
            </el-tooltip>
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
            // 水电气
            HydroelectricInfo: [],
            HydroelectricInfoCopy: [],
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
            // 物业公司下拉
            getPropertyCompanyOptions: [],
            // 关联楼栋下拉
            getRelatedBuildingOpiton: [],
            // 本地存储已选择的数据
            buildingSelVal: []
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
        // 各个表格数据赋值
        this.copyTbaleData();
    },
    methods: {
        // 保存时向父页面提交值
        pushDataToParents() {
            return {
                originData: this.HydroelectricInfoCopy,
                newData: this.HydroelectricInfo,
                isRepeat: this.notSelectCompany()
            }
        },
        // 水电气不能重复选择
        notSelectCompany() {
            let arrList = [];
            let hashList = {};
            let flag = false;
            this.HydroelectricInfo.forEach(item => {
                arrList.push(item.water_electy.field_value);
                if (item.water_electy.field_value == '') {
                    flag = false;
                }
            })
            if (!flag) {
                return false
            }
            for(let i in arrList) {
                if (hashList[arrList[i]]) {
                    return true;
                }
            }
            return false
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
        // 各个表格数据赋值
        copyTbaleData() {
            this.tableDataInfoCopy = JSON.parse(JSON.stringify(this.tableDataInfo));
            // 水电气
            if (this.tableDataInfo.project_water_electy_info.data.length <= 0) {
                this.initStructureDataCopy = JSON.parse(JSON.stringify(this.initStructureData));
                this.HydroelectricInfo.push(JSON.parse(JSON.stringify(this.initStructureData.project_water_electy_info.data)));
                this.HydroelectricInfoCopy.push(this.initStructureDataCopy.project_water_electy_info.data);
            } else {
                this.HydroelectricInfo = this.tableDataInfo.project_water_electy_info.data;
                this.HydroelectricInfoCopy = this.tableDataInfoCopy.project_water_electy_info.data;
            }
            // 初始化的时候去重校验
            this.HydroelectricInfo.forEach(item => {
                this.buildingSelVal.push(...item.relation_buildings.field_value);
            })
            this.getRelatedBuildingSel(this.buildingSelVal);
            this.initHouseInfo(this.HydroelectricInfo);
        },
        // 表格新增
        addTableLine() {
            this.initStructureDataCopy = JSON.parse(JSON.stringify(this.initStructureData));
            this.HydroelectricInfo.push(JSON.parse(JSON.stringify(this.initStructureData.project_water_electy_info.data)));
            this.HydroelectricInfoCopy.push(this.initStructureDataCopy.project_water_electy_info.data);
            this.initHouseInfo(this.HydroelectricInfo);
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
                        this.HydroelectricInfo.splice(index, 1);
                        this.initHouseInfo(this.HydroelectricInfo);
                        // 删除源数组的数据
                        this.HydroelectricInfoCopy.splice(index, 1);
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
                        let result = await propertyApi.delHydroelectricData(params);
                        let { data } = result;
                        if (data.code === 0) {
                            // 删除编辑中数组的数据
                            this.HydroelectricInfo.splice(index, 1);
                            this.initHouseInfo(this.HydroelectricInfo);
                            // 删除源数组的数据
                            this.HydroelectricInfoCopy.splice(index, 1);
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
                        this.HydroelectricInfo.forEach(item => {
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
            margin-top: 10px;
        }
        .btn-add-pro {
            margin-top: 15px;
        }
        .sel-style {
            width: 100%;
        }
        .el-icon-warning {
            color: #ff6e0e;
            font-size: 20px;
            margin-top: 10px;
            margin-left: 6px;
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