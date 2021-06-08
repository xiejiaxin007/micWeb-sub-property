<!--
    @file: 物业公司表格
    @description: 物业公司表格
    @author: xiebin
    @date: 2020-01-02
-->
<template>
    <div class="property-box">
        <!-- 物业公司 -->
        <div class="years-property-box">
            <el-table
                :data="propertyCompanyInfo"
                border
                style="width: 100%">
                <el-table-column
                    label="物业公司"
                    align="center"
                    v-if="tableItemShows['property_company_id']">
                    <template slot-scope="scope">
                        <el-select
                            v-model="scope.row.property_company_id.field_value"
                            placeholder="请选择物业公司"
                            remote
                            filterable
                            @change="changeCompany(scope.row.property_company_id)"
                            @focus="focusGetCompany"
                            :remote-method="getPropertyCompanyInfo">
                            <el-option
                                v-for="item in getPropertyCompanyOptions"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    v-if="tableItemShows['property_company_id'] && tableColStatus['property_company_id'] == '1'">
                    <template
                        slot="header">
                        <info-source-dialog
                            v-model="projectPropertyYearSel.value"
                            @change="(val, otherVal) => changeAllSource('property_company_id', val, otherVal)"
                            :other-val.sync="projectPropertyYearSel.otherVal"
                            :origin-arr="getConfigList.qd_source_list" />
                    </template>
                    <template
                        slot-scope="scope"
                        v-if="scope.row.property_company_id">
                        <info-source-dialog
                            :other-val.sync="scope.row.property_company_id.belong_other"
                            :origin-arr="getConfigList.qd_source_list"
                            v-model="scope.row.property_company_id.belong_role" />
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
                新增物业公司
            </el-button>
            <el-button
                type="text"
                @click="goToCompany">
                找不到物业公司去添加
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
            // 物业公司
            propertyCompanyInfo: [],
            propertyCompanyInfoCopy: [],
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
        /**
         * 选中物业公司后 将物业名称也赋值到field_text
         * @param {object} rowData 表格所属行数据
         */
        changeCompany(rowData) {
            let index;
            this.getPropertyCompanyOptions.find((item, idx) => {
                if (item.id === rowData.field_value) {
                    index = idx;
                    return true;
                }
            })
            rowData.field_text = this.getPropertyCompanyOptions[index].text;
        },
        // 找不到物业公司
        goToCompany() {
            window.open('/index.php?r=yw-project-partner%2Fcreate');
        },
        // 保存时向父页面提交值
        pushDataToParents() {
            return {
                originData: this.propertyCompanyInfoCopy,
                newData: this.propertyCompanyInfo,
                isRepeat: this.notSelectCompany()
            }
        },
        // 物业公司不能重复选择
        notSelectCompany() {
            let arrList = [];
            let hashList = {};
            this.propertyCompanyInfo.forEach(item => {
                arrList.push(item.property_company_id.field_value);
            })
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
            // 物业公司初始化的时候没有数据就走初始结构
            if (this.tableDataInfo.project_property_company_info.data.length <= 0) {
                this.initStructureDataCopy = JSON.parse(JSON.stringify(this.initStructureData));
                this.propertyCompanyInfo.push(JSON.parse(JSON.stringify(this.initStructureData.project_property_company_info.data)));
                this.propertyCompanyInfoCopy.push(this.initStructureDataCopy.project_property_company_info.data);
            } else {
                this.propertyCompanyInfo = this.tableDataInfo.project_property_company_info.data;
                this.propertyCompanyInfoCopy = this.tableDataInfoCopy.project_property_company_info.data;
                // 返回的数据重新组装push到物业公司里面初始化
                this.propertyCompanyInfo.forEach(item => {
                    this.getPropertyCompanyOptions.push({
                        text: item.property_company_id.field_text,
                        id: item.property_company_id.field_value
                    })
                })
            }
            // 初始化的时候去重校验
            this.propertyCompanyInfo.forEach(item => {
                this.buildingSelVal.push(...item.relation_buildings.field_value);
            })
            this.getRelatedBuildingSel(this.buildingSelVal);
            this.initHouseInfo(this.propertyCompanyInfo);
        },
        /**
         * 表格新增
         * @param {string} type 表格类型
         */
        addTableLine() {
            this.initStructureDataCopy = JSON.parse(JSON.stringify(this.initStructureData));
            this.propertyCompanyInfo.push(JSON.parse(JSON.stringify(this.initStructureData.project_property_company_info.data)));
            this.propertyCompanyInfoCopy.push(this.initStructureDataCopy.project_property_company_info.data);
            this.initHouseInfo(this.propertyCompanyInfo);
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
                        this.propertyCompanyInfo.splice(index, 1);
                        this.initHouseInfo(this.propertyCompanyInfo);
                        // 删除源数组的数据
                        this.propertyCompanyInfoCopy.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        return;
                    }
                    try {
                        let params = {
                            project_id: this.$route.query.projectId,
                            property_company_id: selVal,
                            task_id: this.$route.query.taskId
                        }
                        let result = await propertyApi.delPropertyCompanyData(params);
                        let { data } = result;
                        if (data.code === 0) {
                            // 删除编辑中数组的数据
                            this.propertyCompanyInfo.splice(index, 1);
                            this.initHouseInfo(this.propertyCompanyInfo);
                            // 删除源数组的数据
                            this.propertyCompanyInfoCopy.splice(index, 1);
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
        focusGetCompany() {
            this.getPropertyCompanyInfo();
        },
        // 获取物业公司下拉
        async getPropertyCompanyInfo(query) {
            try {
                let result;
                if (!this.$route.query.taskId) {
                    let params = {
                        project_id: this.$route.query.projectId,
                        q: query
                    };
                    result = await propertyApi.getPropertyCompanyData(params);
                } else {
                    let params = {
                        project_id: this.$route.query.projectId,
                        q: query,
                        task_id: this.$route.query.taskId
                    };
                    result = await propertyApi.expandSelectData(params);
                }
                let { data } = result;
                if (data.code === 0) {
                    this.getPropertyCompanyOptions = data.data;
                        if (!Array.isArray(data.data)) {
                        this.getPropertyCompanyOptions = [];
                    }
                    this.propertyCompanyInfo.forEach(item => {
                        if (item.property_company_id.field_value && !this.getPropertyCompanyOptions.find(item2 => item2.id === item.property_company_id.field_value)) {
                            this.getPropertyCompanyOptions.push({
                                text: item.property_company_id.field_text,
                                id: item.property_company_id.field_value
                            })
                        }
                    })
                }
            }
            catch (error) {
                console.log(error);
            }
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
                        this.propertyCompanyInfo.forEach(item => {
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