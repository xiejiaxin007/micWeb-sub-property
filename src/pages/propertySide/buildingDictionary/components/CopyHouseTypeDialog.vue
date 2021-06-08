<!--
    @name: 复制户型组件
    @description: 楼盘动销信息页面 - 复制户型信息组件弹窗
    @author: 贺伟
    @date: 2019-12-10
-->
<template>
    <el-dialog
        class="copy-house-dialog"
        title="复制户型"
        center
        width="700px"
        @open="dialogOpen"
        @close="closeDialog"
        :visible.sync="dialogVisible">
        <el-form
            :model="copyForm"
            ref="copyForm"
            :inline="true">
            <el-form-item
                label="您要复制的是：">
            </el-form-item>
            <el-form-item
                label="城市">
                <el-select
                    disabled
                    class="select-city"
                    v-model="copyForm.city"
                    @change="changeCity"
                    placeholder="请选择">
                        <el-option
                            v-for="item in cityList"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="楼盘">
                <el-select
                    class="select-project"
                    v-model="copyForm.project"
                    filterable
                    remote
                    disabled
                    placeholder="请输入关键词"
                    @change="changeProject"
                    :remote-method="getProjectList"
                    :loading="loading">
                        <el-option
                            v-for="item in projectList"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                prop="houseType"
                :rules="[{ required: true, message: '该项为必填项'}]"
                label="户型">
                <el-select
                    class="select-house-type"
                    filterable
                    clearable
                    v-model="copyForm.houseType"
                    placeholder="请选择">
                    <el-option
                        v-for="item in houseTypeList"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                class="checkbox-wrap"
                v-for="(values, name, idx) in labelData"
                :key="name">
                <div class="info-header">
                    <el-checkbox
                        v-model="checkAll[idx]"
                        @change="(val) => handleCheckAllChange(name, val, idx)">
                        {{name}}
                    </el-checkbox>
                </div>
                <div class="info-body">
                    <el-checkbox-group
                        v-model="checkedArr[idx]"
                        @change="(val) => handleCheckedChange(name, val, idx)">
                        <el-checkbox
                            v-for="item in values"
                            :label="item.key"
                            :key="item.id">{{item.text}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </el-form-item>
            <el-form-item
                label="您要新增的户型信息：">
            </el-form-item>
            <el-form-item
                prop="number"
                :rules="[{ required: true, message: '该项为必填项'}]"
                label="户型编号">
                <el-input
                    v-model="copyForm.number"
                    placeholder="请输入户型编号">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button
                @click="closeDialog">
                取消
            </el-button>
            <el-button
                type="primary"
                @click="submitForm('copyForm')">
                保存
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import commonApi from '@/api/buildingDictionary/common.js';
    import apiObj from '@/api/buildingDictionary/expandTagList.js';
    export default {
        name: 'CopyHouseTypeDialog',
        props: {
            // 渲染复制户型下checkbox的数据对象
            labelData: {
                type: Object,
                default: () => {}
            },
            // 弹窗的显示隐藏
            visible: {
                type: Boolean,
                default: false
            },
            // 户型id
            houseTypeId: {
                type: [String, Number],
                default: ''
            },
            // 城市id
            cityId: {
                type: [String, Number],
                default: ''
            },
            // 楼盘name
            projectName: {
                type: String,
                default: ''
            },
            // 楼盘id
            projectId: {
                type: String,
                default: ''
            }
        },
        created() {
            this.labelInfo = this.labelData;
            this.projectId = this.$route.query.projectId;
            // 获取城市下拉数据
            this.getCityList();
            // 获取户型下拉数据
            this.getHouseListById();
        },
        data() {
            return {
                // 搜索下拉loading
                loading: false,
                // 弹窗显示隐藏
                dialogVisible: this.visible,
                // 标签全选数组
                checkAll: [true, true, true, true],
                // 标签选项值数组
                checkedArr: [
                    [], [], [], []
                ],
                // 城市下拉
                cityList: [],
                // 楼盘下拉
                projectList: [],
                // 户型下拉
                houseTypeList: [],
                // 表单绑定的字段
                copyForm: {
                    city: Number(this.cityId),
                    project: this.projectName,
                    houseType: this.houseTypeId,
                    number: ''
                }
            }
        },
        watch: {
            // 监听弹窗的显示隐藏状态
            visible(newVal) {
                this.dialogVisible = newVal;
            },
            // 监听户型id进行赋值下拉
            houseTypeId(newVal) {
                this.copyForm.houseType = newVal;
            },
            // 监听父组件异步获取的城市ID
            cityId(newVal) {
                this.copyForm.city = Number(newVal);
            },
            // 监听父组件异步获取的城市名字
            projectName(newVal) {
                this.copyForm.project = newVal;
            },
        },
        methods: {
            // 获取城市下拉数据
            async getCityList() {
                try {
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await commonApi.getCityListData();
                    if (code === 0) {
                        this.cityList = data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 切换城市处理
             * @param {String} val 下拉选中的值
             */
            changeCity(val) {
                // 清空楼盘和户型
                this.copyForm.project = '';
                this.copyForm.houseType = '';
            },
            /**
             * 切换楼盘处理
             * @param {String} val 下拉选中的值
             */
            changeProject(val) {
                this.copyForm.houseType = '';
                this.getHouseListById();
            },
            /**
             * 获取楼盘下拉
             * @param {String} query 查询关键字
             */
            async getProjectList(query) {
                try {
                    this.loading = true;
                    const options = {
                        city_id: this.copyForm.city,
                        q: query
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await commonApi.getProjectListData(options);
                    this.loading = false;
                    if (code === 0) {
                        this.projectList = data;
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    console.log(error);
                    this.loading = false;
                }
            },
            /**
             * 根据楼盘id获取户型下拉数据
             */
            async getHouseListById() {
                try {
                    const options = {
                        project_id: this.projectId,
                        task_id: this.$route.query.taskId,
                        select_false: '0'
                    };
                    const {
                        data: {
                            code,
                            data
                        }
                    } = await apiObj.getHouseTypeListData(options);
                    if (code === 0) {
                        this.houseTypeList = data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 弹窗打开事件处理
            dialogOpen() {
                // 选中全选按钮
                this.checkAll.fill(true);
                // 选中全部子标签
                this.checkedAllLabel();
            },
            /**
             * 标签勾中全选事件处理
             * @param {String} name 所属标签模块的名称（数据的key)
             * @param {String} val 变化的值
             * @param {String} idx 索引值
             */
            handleCheckAllChange(name, val, idx) {
                // const labelArr = this.labelData[name].map(ele => ele.id);
                const labelArr = this.labelData[name].map(ele => ele.key);
                this.checkedArr[idx] = val ? labelArr : [];
            },
            /**
             * 单个标签勾中事件处理
             * @param {String} name 所属标签模块的名称（数据的key)
             * @param {String} val 变化的值
             * @param {String} idx 索引值
             */
            handleCheckedChange(name, val, idx) {
                let checkedCount = val.length;
                this.checkAll[idx] = checkedCount === this.labelData[name].length;
                this.checkAll.splice(0, 0);
            },
            // 将选项默认全选
            checkedAllLabel() {
                // 定义排序字段所在第几组
                let groupIndex = -1;
                Object.keys(this.labelData).forEach((ele, index) => {
                    // 记录排序字段所在的索引值 将 排序 默认不勾选
                    let orderIndex = -1;
                    this.checkedArr[index] = this.labelData[ele].map((item, idx) => {
                        // return item.id;
                        if (item.key === 'show_index') {
                            orderIndex = idx;
                        }
                        return item.key;
                    });
                    // 如果排序字段所在索引为非初始值，则将改数据删除
                    if (orderIndex !== -1) {
                        groupIndex = index;
                        this.checkedArr[index].splice(orderIndex, 1);
                    }
                });
                this.checkedArr.splice(0, 0);
                // 更新组选中状态
                if (groupIndex !== -1) {
                    this.checkAll[groupIndex] = false;
                }
            },
            // 弹窗关闭回调
            closeDialog() {
                this.dialogVisible = false;
                this.$emit('update:visible', false);
            },
            // 保存信息
            async saveCopyInfo() {
                try {
                    const getSelectLabelVal = () => {
                        const selectArr = [];
                        this.checkedArr.forEach(ele => {
                            selectArr.push(...ele);
                        });
                        return selectArr;
                    };
                    const checkArr = getSelectLabelVal();
                    console.log(checkArr);
                    const checkedLabels = {};
                    checkArr.forEach(ele => {
                        checkedLabels[ele] = '1';
                    })
                    if (checkArr.length === 0) {
                        this.$message.warning('至少选中一个复制的项');
                        return;
                    }
                    const options = {
                        project_id: this.projectId,
                        source_house_type: checkedLabels,
                        house_type_num: this.copyForm.number,
                        house_type_id: this.copyForm.houseType
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await apiObj.saveCoyyHouseType(options);
                    if (code === 0) {
                        this.$message('复制户型信息保存成功');
                        this.closeDialog();
                        // 标识复制户型保存成功或失败状态 如果成功将返回得户型id数据传递给父组件
                        this.$emit('statusChange', true, data);
                    } else {
                        this.$emit('statusChange', false, msg);
                        this.$message(msg);
                    }
                } catch (error) {
                    this.$emit('statusChange', false, error);
                    console.log(error);
                }
            },
            // 表单提交保存
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.saveCopyInfo();
                    } else {
                        this.$message('请检查必填项是否填写完整');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .copy-house-dialog {
        .checkbox-wrap {
            display: block;
            border: 2px dotted #ccc;
            border-radius: 4px;
            padding: 5px 10px;
            /deep/ .el-form-item__content{
                width: 100%;
            }
        }
        .info-header{
            border-bottom: 1px solid #ccc;
        }
        .select-city {
            width: 100px;
        }
        .select-project {
            width: 230px;
        }
        .select-house-type {
            width: 500px;
        }
        /deep/ .el-dialog--center .el-dialog__body{
            padding: 15px 25px 0;
            height: 550px;
            overflow-y: auto;
        }
    }
</style>