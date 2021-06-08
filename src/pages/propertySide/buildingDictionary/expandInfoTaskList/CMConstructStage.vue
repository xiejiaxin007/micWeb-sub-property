<!--
    @name: 建设阶段模块
    @description: 放量和交房页面 -建设阶段子模块
    @author: 贺伟
    @date: 2019-12-25
-->
<template>
    <div class="construct-info">
        <div class="modal-title-box">
            <h3 class="title-content">建设阶段</h3>
        </div>
        <div class="table-wrap-box">
            <el-form :model=model ref="constructForm">
                <el-table
                    v-if="model.tableData"
                    :data="model.tableData"
                    border>
                    <el-table-column
                        v-if="model.tableData.length === 0 || tableItemShows['construction_stage']"
                        min-width="180">
                        <template slot="header">
                            建设阶段
                        </template>
                        <template slot-scope="scope">
                            <el-form-item>
                                <el-select
                                    v-model="scope.row.construction_stage.field_value"
                                    placeholder="请选择">
                                    <el-option
                                        v-for="item in constructStage"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="model.tableData.length === 0 || tableColStatus['construction_stage'] == '1'"
                        min-width="160">
                        <template slot="header" slot-scope="scope">
                            <info-source-dialog
                                @change="(val, otherVal) => changeAllSource('construction_stage', val, otherVal)"
                                :origin-arr="infoSource"
                                :other-val.sync="stageStatusSelect.otherVal"
                                v-model="stageStatusSelect.value" />
                        </template>
                        <template v-if="scope.row.construction_stage.is_show_belong_role == 1" slot-scope="scope">
                            <info-source-dialog
                                :other-val.sync="scope.row.construction_stage.belong_other"
                                :origin-arr="infoSource"
                                v-model="scope.row.construction_stage.belong_role" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="model.tableData.length === 0 || tableItemShows['relation_buildings']"
                        min-width="300">
                        <template slot="header">
                            关联楼栋
                        </template>
                        <template slot-scope="scope">
                            <select-building v-model="scope.row.relation_buildings.field_value"
                                class="mult-select"
                                :options="buildRelative"
                                @change="relatedListChange"
                                @remove-tag="removeTag">
                            </select-building>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="model.tableData.length === 0 || tableColStatus['relation_buildings'] == '1'"
                        min-width="160">
                        <template slot="header" slot-scope="scope">
                            <info-source-dialog
                                @change="(val, otherVal) => changeAllSource('relation_buildings', val, otherVal)"
                                :other-val.sync="relatedBuildingSelect.otherVal"
                                :origin-arr="infoSource"
                                v-model="relatedBuildingSelect.value" />
                        </template>
                        <template
                            v-if="scope.row.relation_buildings.is_show_belong_role == 1"
                            slot-scope="scope">
                            <info-source-dialog
                                :other-val.sync="scope.row.relation_buildings.belong_other"
                                :origin-arr="infoSource"
                                v-model="scope.row.relation_buildings.belong_role" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        key="last"
                        v-if="allData.length > 0"
                        min-width="200">
                        <template slot="header">
                            操作
                        </template>
                        <template slot-scope="scope">
                            <el-button
                                class="btn-danger"
                                @click="delectBuilding(scope.row, scope.$index)"
                                type="text">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div class="btn-box">
                <el-button
                    size="mini"
                    @click="addStageing"
                    type="primary">
                    新增建设阶段
                </el-button>
                <el-button
                    v-if="allData.length > 2"
                    @click="showMoreInfo()"
                    type="text">
                    {{hasShowAllData ? '收起查看更多' : '查看更多建设阶段'}}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import InfoSourceDialog from '../components/InfoSourceDialog';
    import { commonFun } from '@/assets/js/utils/utils';
    import apiObj from '../api/capacityHandRoom';
    import {
        confirmMsg,
        isRequiredInfoOrigin,
        getNecessaryData
    } from '../utils/index';
    import SelectBuilding from '../components/SelectBuilding';
    export default {
        name: 'ChildModuleConstructSituation',
        components: {
            InfoSourceDialog,
            SelectBuilding
        },
        props: {
            // 建设阶段
            constructStage: {
                type: Array,
                default: () => []
            },
            // 渲染表单的数据
            initData: {
                type: Array,
                default: () => []
            },
            // 信息来源列表
            infoSource: {
                type: Array,
                default: () => []
            },
            // 关联楼栋下拉
            relatedBuilding: {
                type: Array,
                default: () => []
            },
            // 当前模块对应的单条数据空数据结构
            emptyStructureData: {
                type: Object,
                default: () => {}
            }
        },
        created () {
            this.initNecessayData();
            // 获取放量计划信息
            this.initConstructInfo();
            this.initEmptyStructureData();
            // 初始化楼栋下拉信息
            this.relatedBuildingCopy = commonFun.deepClone(this.relatedBuilding);
        },
        data() {
            return {
                // 是否展示全部户型数据
                hasShowAllData: false,
                // 分期名称来源全选
                stageNameSelect: {
                    value: '',
                    otherVal: ''
                },
                // 分期销售状态来源全选
                stageStatusSelect: {
                    value: '',
                    otherVal: ''
                },
                // 关联楼栋来源全选
                relatedBuildingSelect: {
                    value: '',
                    otherVal: ''
                },
                // 表单数据
                model: {
                    tableData: []
                },
                // 表格列来源是否显示
                tableColStatus: {},
                // 此表格列是否显示
                tableItemShows: {},
                // 关联楼栋下拉
                relatedBuildingCopy: [],
                // 存储所有关联的楼栋
                allRelationBuild: []
            }
        },
        computed: {
            // 获取禁用的下拉
            buildRelative() {
                return this.relatedBuildingCopy.map(ele => {
                    let item = Object.assign({}, ele);
                    if (this.allRelationBuild.includes(ele.id)) {
                        item.disabled = true;
                    }
                    return item;
                });
            }
        },
        watch: {
            initData(val) {
                this.initConstructInfo();
            },
            // 关联楼栋下拉赋值
            relatedBuilding(newVal) {
                this.relatedBuildingCopy = commonFun.deepClone(newVal);
            },
            // 使用空结构来判断是否有此字段
            emptyStructureData(newVal) {
                const data = commonFun.deepClone(newVal);
                Object.keys(data).forEach(name => {
                    this.tableColStatus[name] = data[name].is_show_belong_role;
                    // 储存需要展示的字段
                    this.tableItemShows[name] = true;
                });
            }
        },
        methods: {
            // 初始化必要数据
            initNecessayData() {
                // 初始化楼盘id
                this.projectId = this.$route.query.projectId;
                // 初始化户型id
                this.taskId = this.$route.query.taskId;
                // 初始化导入的方法，挂载到this
                this.confirmMsg = confirmMsg;
                // 是否填写来源
                this.isRequiredInfoOrigin = isRequiredInfoOrigin;
                // 记录接口下发的数据在页面中的索引
                this.orgLen = 0;
            },
            // 使用空结构来判断是否有此字段
            initEmptyStructureData() {
                const data = commonFun.deepClone(this.emptyStructureData);
                Object.keys(data).forEach(name => {
                    this.tableColStatus[name] = data[name].is_show_belong_role;
                    // 储存需要展示的字段
                    this.tableItemShows[name] = true;
                });
            },
            // 初始化放量信息
            initConstructInfo() {
                // 存储原始的数据
                this.originInitData = commonFun.deepClone(this.initData);
                const constructData = commonFun.deepClone(this.initData);
                // 需要转换为数字的值 建设阶段
                const numberFields = ['construction_stage'];
                // 遍历数据 进行一些特殊处理，之后返回形成新数组
                const newData = constructData.map((ele, idx) => {
                    let necessaryData = {};
                    Object.keys(ele).forEach(item => {
                        // 保存返回的此列是否展示来源的值 来源是否展示室一致的，不存在某一行来源展示，另一行数据不展示的情况,直接去第一行数据
                        if (idx === 0) {
                            this.tableColStatus[item] = ele[item].is_show_belong_role;
                            // 储存需要展示的字段
                            this.tableItemShows[item] = true;
                        }
                        // 来源id为0不展示
                        if (ele[item].is_show_belong_role == '1') {
                            ele[item].belong_role = ele[item].belong_role || '';
                        }
                        // 下拉字段转换为数字
                        if (numberFields.includes(item)) {
                            ele[item].field_value = Number(ele[item].field_value) ? Number(ele[item].field_value) : '';
                        }
                        // 获取对应字段的数据 保存一份轻量必要数据来渲染页面
                        const list = ele[item];
                        necessaryData[item] = {
                            field_id: list.field_id,
                            field_name: list.field_name,
                            field_value: list.field_value,
                            field_desc: list.field_desc,
                            belong_role: list.belong_role,
                            belong_other: list.belong_other,
                            is_show_belong_role: list.is_show_belong_role,
                            table_id: list.table_id
                        };
                    });
                    // 存储全量的已关联的楼栋
                    this.allRelationBuild.push(...ele.relation_buildings.field_value);
                    return necessaryData;
                });
                this.model.tableData = newData.slice(0, 2);
                this.allData = newData;
            },
            /**
             * 关联楼栋下拉选中值变化事件处理
             * @param {Array} vals 选中的值数组
             */
            relatedListChange(vals) {
                vals.forEach(id => {
                    if (!this.allRelationBuild.includes(id)) {
                        this.allRelationBuild.push(id);
                    }
                });
            },
            /**
             * 删除标签 清除禁用
             * @param {String} tag 被移除的值
             */
            removeTag(tag) {
                const idx = this.allRelationBuild.findIndex(ele => ele === tag);
                if (idx !== undefined) {
                    this.allRelationBuild.splice(idx, 1);
                }
            },
            /**
             * 禁用下拉选项的值
             * @param {Array} list 需要处理的数组
             * @param {Array} idArr 需要禁用的值集合
             */
            disableList(list, idArr) {
                list.forEach(ele => {
                    ele.disabled = false;
                    if (idArr.includes(ele.id)) {
                        ele.disabled = true;
                    }
                });
            },
            // 新增交房
            addStageing() {
                // 获取必要的空数据结构
                const emptyData = getNecessaryData(this.emptyStructureData);
                this.allData.splice(0, 0, emptyData);
                this.orgLen++;
                this.model.tableData = this.allData;
                this.hasShowAllData = true;
                // 展开全部
                /* if (!this.hasShowAllData) {
                    this.model.tableData = this.allData;
                    this.hasShowAllData = true;
                } */
            },
            // 增加建设阶段
            addConstruct(data) {
                this.orgLen++;
                this.model.tableData = this.allData;
                this.hasShowAllData = true;
            },
            /**
             * 获取必要的结构数据
             * @param {Object} origin 原数据
             * @return {Object} 过滤后的必要数据
             */
            /* getNecessaryData(origin) {
                let necessaryData = {};
                // 遍历数据 保存必要的字段 并返回
                Object.keys(origin).forEach(name => {
                    const item = origin[name];
                    necessaryData[name] = {
                        field_id: item.field_id,
                        field_name: item.field_name,
                        field_value: item.field_value,
                        field_desc: item.field_desc,
                        belong_role: item.belong_role,
                        belong_other: item.belong_other,
                        is_show_belong_role: item.is_show_belong_role,
                        isNew: true
                    };
                });
                return necessaryData;
            }, */
            /**
             * 触发父组件跳转提示弹窗
             * @param {String} tag 跳转弹窗标识
             */
            showGotoDialog(tag) {
                this.$emit('goToAlert', tag)
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
                });
            },
            // 查看更多楼栋
            showMoreInfo() {
                if (this.hasShowAllData) {
                    this.model.tableData = this.allData.slice(0, 2);
                } else {
                    // 展开
                    this.model.tableData = this.allData;
                }
                this.hasShowAllData = !this.hasShowAllData;
            },
            /**
             * 删除单个户型
             * @param {String} houseId 户型id
             * @param {Number} index 数据所在索引
             */
            async delectBuilding(row, index) {
                try {
                    // 判断是否点了确定按钮
                    const res = await this.confirmMsg('一旦删除则数据无法恢复，请确认是否删除！');
                    if (!res) {
                        return;
                    }
                    if (row.id.isNew) {
                        this.allData.splice(index, 1);
                        // 遍历删除对应的关联楼栋
                        row.relation_buildings.field_value.forEach(id => {
                            this.removeTag(id);
                        });
                        // 本地删除新增的数据 更新索引
                        this.orgLen--;
                        if (this.hasShowAllData) {
                            // 收起
                            this.model.tableData = this.allData;
                        } else {
                            // 显示全部
                            this.model.tableData = this.allData.slice(0, 2);
                        }
                        return;
                    }
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId,
                        construction_phase_id: row.id.field_value
                    };
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await apiObj.delectConstructInfoById(options);
                    this.$message(msg);
                    if (code === 0) {
                        // 删除此条数据
                        this.allData.splice(index, 1);
                        if (this.hasShowAllData) {
                            // 收起
                            this.model.tableData = this.allData;
                        } else {
                            // 显示全部
                            this.model.tableData = this.allData.slice(0, 2);
                        }
                        // 同步更新源数据
                        // 获取源数据所在索引
                        const idx = index - this.orgLen;
                        if (idx >= 0) {
                            // 删除源数据对应的这条数据
                            this.originInitData.splice(idx, 1);
                            // 遍历删除对应的关联楼栋
                            row.relation_buildings.field_value.forEach(id => {
                                this.removeTag(id);
                            });
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 获取模块数据
             * @param {String} refName ref名称
             * @param {String} moduleName 模块名称
             */
            getData(refName, moduleName) {
                // 定义表单校验通过状态
                let validStatus = false;
                this.$refs[refName].validate((valid) => {
                    if (valid) {
                        validStatus = true;
                    } else {
                        validStatus = false;
                    }
                });
                if (!validStatus) {
                    this.$message('请检查必填信息是否填写完整!');
                    return;
                }
                // 校验是否通过
                const allLen = this.allData.length;
                const initLen = this.originInitData.length;
                // 获取必要的空数据结构
                const emptyData = getNecessaryData(this.emptyStructureData);
                for (let i = 0; i < allLen - initLen; i++) {
                    this.originInitData.splice(0, 0, emptyData);
                }
                if (!this.isRequiredInfoOrigin(this.originInitData, this.allData, true, moduleName)) {
                    return;
                }
                // 将本地的值进行返回
                return this.allData;
            }
        }
    }
</script>

<style lang="less" scoped>
    .btn-danger{
        color: #f56c6c;
    }
    .construct-info {
        padding: 0 10px;
    }
    .table-wrap-box {
        padding: 15px 0;
        /deep/ .el-form-item{
            margin-bottom: 0;
        }
        .mult-select{
            width: 278px;
            // 抖动问题，继承高度
            /deep/ .el-select__tags {
                position: relative;
                transform: translateY(0);
                z-index: 11;
                min-height: 40px;
                padding: 3px 0;
            }
            /deep/ .el-input {
                position: absolute;
                z-index: 10;
                top: 0;
                height: 100%;
                .el-input__inner {
                    height: 100%!important;
                }
            }
        }
    }
    .btn-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 5px;
    }
</style>