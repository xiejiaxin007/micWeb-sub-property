<!--
    @name: 放量计划模块
    @description: 放量和交房页面 - 放量计划子模块
    @author: 贺伟
    @date: 2019-12-25
-->
<template>
    <div class="capacity-info">
        <div class="modal-title-box">
            <h3 class="title-content">放量计划</h3>
        </div>
        <div class="table-wrap-box">
            <el-form :model=model ref="capacityForm">
                <el-table
                    v-if="model.tableData"
                    :data="model.tableData"
                    border>
                    <el-table-column
                        v-if="tableItemShows['volume_type']"
                        min-width="160">
                        <template slot="header">
                            放量时间类型
                        </template>
                        <template slot-scope="scope">
                            <el-form-item
                                :prop="'tableData.' + scope.$index + '.volume_type.field_value'"
                                :rules="planTypeRule(scope.row)">
                                <el-select
                                    v-model="scope.row.volume_type.field_value"
                                    clearable
                                    @change="clearType(scope.row)"
                                    @clear="clearType(scope.row)"
                                    placeholder="请选择">
                                    <el-option
                                        v-for="item in volumeType"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableColStatus['volume_type'] == '1'"
                        min-width="160">
                        <template slot="header" slot-scope="scope">
                            <info-source-dialog
                                :origin-arr="infoSource"
                                :other-val.sync="capacaityPlanSelect.otherVal"
                                @change="(val, otherVal) => changeAllSource('volume_type', val, otherVal)"
                                v-model="capacaityPlanSelect.value" />
                        </template>
                        <template slot-scope="scope">
                            <info-source-dialog
                                :other-val.sync="scope.row.volume_type.belong_other"
                                :origin-arr="infoSource"
                                v-model="scope.row.volume_type.belong_role" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableItemShows['volume_date_year']"
                        min-width="180">
                        <template slot="header" slot-scope="scope">
                            放量时间
                        </template>
                        <template slot-scope="scope">
                            <el-form-item
                                :prop="'tableData.' + scope.$index + '.volume_date_year.field_value'"
                                :rules="planTimeRule(scope.row)">
                                <date-picker-tenday
                                    type="1"
                                    v-model="scope.row.volume_date_year.tendayVal"
                                    @change="(dateObj) => tendayChange(dateObj, scope.row.volume_date_day)"
                                    :year.sync="scope.row.volume_date_year.field_value"
                                    :month.sync="scope.row.volume_date_month.field_value"
                                    :day.sync="scope.row.volume_date_day.field_value"
                                    :tenday.sync="scope.row.volume_date_ten.field_value"/>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableColStatus['volume_date_year'] == '1'"
                        min-width="160">
                        <template slot="header" slot-scope="scope">
                            <info-source-dialog
                                @change="(val, otherVal) => changeAllSource('volume_date_year', val, otherVal)"
                                :origin-arr="infoSource"
                                :other-val.sync="capacaityPlanSelect.otherVal"
                                v-model="capacaityPlanSelect.value" />
                        </template>
                        <template v-if="scope.row.relation_house_types.is_show_belong_role == 1" slot-scope="scope">
                            <info-source-dialog
                                :other-val.sync="scope.row.volume_date_year.belong_other"
                                :origin-arr="infoSource"
                                @change="(val, otherVal) => changeTenDate(val, otherVal, scope.row)"
                                v-model="scope.row.volume_date_year.belong_role" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableItemShows['relation_house_types']"
                        min-width="300">
                        <template slot="header">
                            关联户型
                        </template>
                        <template slot-scope="scope">
                            <el-select
                                class="mult-select"
                                multiple
                                v-model="scope.row.relation_house_types.field_value"
                                @change="(vals) => relatedListChange('1', vals)"
                                @remove-tag="(tag) => removeTag(tag, '1')"
                                placeholder="请选择">
                                <el-option
                                    v-for="(item, idx) in houseTypeRelative"
                                    :key="idx"
                                    :label="item.text"
                                    :disabled="item.disabled"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableColStatus['relation_house_types'] == '1'"
                        min-width="160">
                        <template slot="header" slot-scope="scope">
                            <info-source-dialog
                                @change="(val, otherVal) => changeAllSource('relation_house_types', val, otherVal)"
                                :other-val.sync="relativeHouseSelect.otherVal"
                                :origin-arr="infoSource"
                                v-model="relativeHouseSelect.value" />
                        </template>
                        <template
                            v-if="scope.row.relation_house_types.is_show_belong_role == 1"
                            slot-scope="scope">
                            <info-source-dialog
                                :other-val.sync="scope.row.relation_house_types.belong_other"
                                :origin-arr="infoSource"
                                v-model="scope.row.relation_house_types.belong_role" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableItemShows['relation_buildings']"
                        min-width="300">
                        <template slot="header">
                        关联楼栋
                        </template>
                        <template slot-scope="scope">
                            <select-building v-model="scope.row.relation_buildings.field_value"
                                class="mult-select"
                                :options="buildRelative"
                                @change="(vals) => relatedListChange('2', vals)"
                                @remove-tag="(tag) => removeTag(tag, '2')">
                            </select-building>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableColStatus['relation_buildings'] == '1'"
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
                        v-if="model.tableData.length > 0"
                        min-width="180">
                        <template slot="header">
                            操作
                        </template>
                        <template slot-scope="scope">
                            <el-button
                                @click="showGotoDialog({
                                    path: 'capacityPlan',
                                    id: scope.row.id.field_value,
                                    idName: 'volumeId'
                                })"
                                type="text">
                                查看
                            </el-button>
                            <el-button
                                @click="showGotoDialog({
                                    path: 'capacityPlan',
                                    id: scope.row.id.field_value,
                                    idName: 'volumeId',
                                    isEdit: 1
                                })"
                                type="text">
                                编辑
                            </el-button>
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
                <add-capacity-plan-btn @toUrl="showGotoDialog({
                    path: 'capacityPlan',
                    isEdit: 1
                })"></add-capacity-plan-btn>
                <el-button
                    v-if="allData.length > 2"
                    @click="showMoreInfo()"
                    type="text">
                    {{hasShowAllData ? '收起查看更多' : '查看更多放量'}}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import InfoSourceDialog from '../components/InfoSourceDialog';
    import { commonFun } from '@/assets/js/utils/utils';
    import apiObj from '../api/capacityHandRoom';
    import commonApi from '../api/common';
    import {
        confirmMsg,
        isRequiredInfoOrigin,
        getCurMonthDays
    } from '../utils/index';
    import DatePickerTenday from '../components/DatePickerTenday';
    import SelectBuilding from '../components/SelectBuilding';
    import AddCapacityPlanBtn from '../components/AddCapacityPlanBtn.vue';
    export default {
        name: 'ChildModuleCapacityPlan',
        components: {
            InfoSourceDialog,
            DatePickerTenday,
            SelectBuilding,
            AddCapacityPlanBtn
        },
        props: {
            // 放量时间类型
            volumeType: {
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
            // 获取户型下拉
            this.getHouseListById();
            // 获取楼栋下拉
            // this.getBuildList();
            // 获取放量计划信息
            this.initCapacityInfo();
            this.initEmptyStructureData();
        },
        data() {
            return {
                // 是否展示全部户型数据
                hasShowAllData: false,
                // 放量时间来源全选
                capacaityPlanSelect: {
                    value: '',
                    otherVal: ''
                },
                // 关联户型来源全选
                relativeHouseSelect: {
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
                // 关联户型下拉
                relatedHouseTypeList: [],
                // 关联楼栋下拉
                relatedBuildingCopy: [],
                // 存储所有关联的楼栋
                allRelationBuild: [],
                // 存储所有关联的户型
                allRelationHouse: []
            }
        },
        computed: {
            // 获取禁用的楼栋下拉
            buildRelative() {
                // return this.relatedBuildingCopy.map(ele => {
                //     let item = Object.assign({}, ele);
                //     item.disabled = false;
                //     if (this.allRelationBuild.includes(ele.id)) {
                //         item.disabled = true;
                //     }
                //     return item;
                // });
                return commonFun.deepClone(this.relatedBuilding);
            },
            // 户型下拉
            houseTypeRelative() {
                // return this.relatedHouseTypeList.map(ele => {
                //     let item = Object.assign({}, ele);
                //     if (this.allRelationHouse.includes(ele.id)) {
                //         item.disabled = true;
                //     } else {
                //         item.disabled = false;
                //     }
                //     return item;
                // });
                return this.relatedHouseTypeList;
            },
            // 放量计划类型验证
            planTypeRule() {
                return (item) => {
                    let {
                        // 放量计划类型
                        volume_type: {
                            field_value: volumeTypeVal
                        },
                        // 放量时间
                        volume_date_year: {
                            field_value: yearVal,
                            tendayVal: capacityTime
                        },
                        volume_date_month: {
                            field_value: monthVal
                        },
                        volume_date_day: {
                            field_value: dayVal
                        },
                        volume_date_ten: {
                            field_value: tenVal
                        }
                    } = item;
                    dayVal = dayVal || (tenVal == 3 ? getCurMonthDays(monthVal) : tenVal * 10);
                    // 如果放量计划时间不为空则需要校验放量计划和放量时间的匹配 已放量和已加推 放量时间需要小于等于当前日期 预计开盘和预计加推 反之
                    return capacityTime !== '' ? { validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请选择放量计划类型'));
                        } else {
                            // 定义选择的日期
                            const timeVal = dayVal ? new Date(yearVal, monthVal - 1, dayVal) : new Date(yearVal, monthVal, dayVal);
                            // 1 2分别对应 已开盘已加推   3 4 对应预计开盘和预计加推
                            if ([1, 2].includes(volumeTypeVal) && timeVal > new Date()) {
                                callback(new Error('当前放量时间与选择的放量计划类型不匹配'));
                                return;
                            }
                            if ([3, 4].includes(volumeTypeVal) && timeVal <= new Date()) {
                                callback(new Error('当前放量时间与选择的放量计划类型不匹配'));
                                return;
                            }
                            callback();
                        }
                    },
                    trigger: 'change' } : { required: false };
                }
            },
            // 放量时间验证
            planTimeRule() {
                return (item) => {
                    let {
                        // 放量计划类型
                        volume_type: {
                            field_value: volumeTypeVal
                        },
                        // 放量时间
                        volume_date_year: {
                            field_value: yearVal
                        },
                        volume_date_month: {
                            field_value: monthVal
                        },
                        volume_date_day: {
                            field_value: dayVal
                        },
                        volume_date_ten: {
                            field_value: tenVal
                        }
                    } = item;
                    dayVal = dayVal || (tenVal == 3 ? getCurMonthDays(monthVal) : tenVal * 10);
                    // 如果放量计划不为空 需要校验和计划类型匹配度 规则同放量计划类型
                    return volumeTypeVal !== '' ? { validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请输入放量时间'));
                        } else {
                            // 定义选择的日期
                            const timeVal = dayVal ? new Date(yearVal, monthVal - 1, dayVal) : new Date(yearVal, monthVal, dayVal);
                            if ([1, 2].includes(volumeTypeVal) && timeVal > new Date()) {
                                callback(new Error('当前放量计划类型下放量时间不得大于当前日期'));
                                return;
                            }
                            if ([3, 4].includes(volumeTypeVal) && timeVal <= new Date()) {
                                callback(new Error('当前放量计划类型下放量时间必须大于当前日期'));
                                return;
                            }
                            callback();
                        }
                    },
                    trigger: 'change' } : { required: false };
                }
            }
        },
        watch: {
            // 监听父组件传入的初始化数据
            initData(val) {
                this.initCapacityInfo();
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
            initCapacityInfo() {
                // 存储原始的数据
                this.originInitData = commonFun.deepClone(this.initData);
                const capacityData = commonFun.deepClone(this.initData);
                // 需要转换为数字的值 放量时间类型 年月日
                const numberFields = ['volume_type', 'volume_date_year', 'volume_date_month', 'volume_date_day'];
                // 遍历数据 进行一些特殊处理，之后返回形成新数组
                const newData = capacityData.map((ele, idx) => {
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
                            table_id: list.table_id,
                            is_show_belong_role: list.is_show_belong_role
                        };
                        // 存储放量时间 交房时间的值 额外添加后端不需要存储，只做前端年月日旬展示
                        if (item === 'volume_date_year') {
                            necessaryData[item].tendayVal = '';
                        }
                    });
                    // 存储全量的已关联的楼栋
                    this.allRelationBuild.push(...ele.relation_buildings.field_value);
                    // 存储全量的已关联的户型
                    this.allRelationHouse.push(...ele.relation_house_types.field_value);
                    return necessaryData;
                });
                this.model.tableData = newData.slice(0, 2);
                this.allData = newData;
            },
            /**
             * 根据楼盘id获取户型下拉数据
             */
            async getHouseListById() {
                try {
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId,
                        select_false: 0
                    };
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await commonApi.getHouseTypeListData(options);
                    if (code === 0) {
                        this.relatedHouseTypeList = data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 楼盘单价类型变化是清空已编辑的值
             * @param {Object} item 表格行数据
             */
            clearType(item) {
                // 重置放量计划时间
                item.volume_date_year.field_value = '';
                item.volume_date_month.field_value = '';
                item.volume_date_day.field_value = '';
                item.volume_date_ten.field_value = '';
                // 清空vmode绑定的值
                item.volume_date_year.tendayVal = '';
            },
            // 年的来源改变更新其他字段来源值
            changeTenDate(val, otherVal, item) {
                const {
                    // 放量时间
                    volume_date_year: year,
                    volume_date_month: month,
                    volume_date_day: day,
                    volume_date_ten: tenday
                } = item;
                year.belong_role = val;
                month.belong_role = val;
                day.belong_role = val;
                tenday.belong_role = val;

                year.belong_other = otherVal;
                month.belong_other = otherVal;
                day.belong_other = otherVal;
                tenday.belong_other = otherVal;
            },
            /**
             * 关联户型/楼栋下拉选中值变化事件处理
             * @param {String} type 是关联楼栋还是关联户型触发 '1': 关联户型， ’2‘ ：关联楼栋
             * @param {Array} vals 选中的值数组
             */
            relatedListChange(type, vals) {
                if (type === '1') {
                    vals.forEach(id => {
                        if (!this.allRelationHouse.includes(id)) {
                            this.allRelationHouse.push(id);
                        }
                    });
                } else if (type === '2') {
                    vals.forEach(id => {
                        if (!this.allRelationBuild.includes(id)) {
                            this.allRelationBuild.push(id);
                        }
                    });
                }
            },
            /**
             * 删除标签 清除禁用
             * @param {String} tag 被移除的值
             */
            removeTag(tag, type) {
                if (type === '1') {
                    const idx = this.allRelationHouse.findIndex(ele => ele === tag);
                    if (idx !== undefined) {
                        this.allRelationHouse.splice(idx, 1);
                    }
                } else if (type === '2') {
                    const idx = this.allRelationBuild.findIndex(ele => ele === tag);
                    if (idx !== undefined) {
                        this.allRelationBuild.splice(idx, 1);
                    }
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
            // 如果旬有值则清空对应的天数
            tendayChange(dateObj, day) {
                // 延迟 在表单验证之后再清空值
                setTimeout(() => {
                    if (dateObj.tenday) {
                        day.field_value = '';
                    }
                }, 200);
            },
            /**
             * 触发父组件跳转提示弹窗
             * @param {String} tag 跳转弹窗标识
             */
            showGotoDialog(tagMsg) {
                this.$emit('goToAlert', tagMsg);
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
                            if (name === 'volume_date_year') {
                                // 将年月日旬的来源值都变更和年一致
                                const arr = ['volume_date_month', 'volume_date_day', 'volume_date_ten'];
                                arr.forEach(key => {
                                    ele[key].belong_role = value;
                                    ele[key].belong_other = otherVal;
                                });
                            }
                            ele[item].belong_role = value;
                            ele[item].belong_other = otherVal;
                        }
                    });
                });
            },
            // 查看更多楼栋
            showMoreInfo() {
                if (this.hasShowAllData) {
                    this.$refs['capacityForm'].validate((valid) => {
                        if (valid) {
                            // 收起
                            this.model.tableData = this.allData.slice(0, 2);
                            this.hasShowAllData = !this.hasShowAllData;
                        }
                    });
                } else {
                    // 展开
                    this.model.tableData = this.allData;
                    this.hasShowAllData = !this.hasShowAllData;
                }
                
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
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId,
                        id: row.id.field_value
                    };
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await apiObj.deleteVolumeInfoById(options);
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
                        this.originInitData.splice(index, 1);
                        // 遍历删除对应的关联楼栋
                        row.relation_buildings.field_value.forEach(id => {
                            this.removeTag(id, '2');
                        });
                        // 遍历删除对应的关联户型
                        row.relation_house_types.field_value.forEach(id => {
                            this.removeTag(id, '1');
                        });
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
                // const len = this.orgLen;
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
    .btn-danger {
        color: #f56c6c;
    }
    .capacity-info {
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
        /* /deep/ .el-table .cell{
            overflow: inherit;
        } */
        /deep/ .el-form-item__error{
            position: relative;
        }
    }
    .btn-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 5px;
    }
</style>