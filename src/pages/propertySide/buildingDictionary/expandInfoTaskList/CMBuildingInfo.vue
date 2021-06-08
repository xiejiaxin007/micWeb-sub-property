<!--
    @name: 楼栋信息模块
    @description: 楼盘动销信息页面 - 楼栋信息子模块
    @author: 贺伟
    @date: 2019-12-09
-->
<template>
    <build-module-warp
        @goToAlert="(data) => $emit('goToAlert', data)"
        :build-data="allData"
        :has-auth="getEditAuth"
        :is-edit="true">
        <div class="table-wrap-box">
            <el-form :model=model ref="buildingForm">
            <el-table
                :data="model.tableData"
                border>
                <!-- 拓展不展示 -->
                <el-table-column
                    label="楼栋ID"
                    v-if="!$route.query.taskId">
                    <template v-if="scope.row.id" slot-scope="scope">
                        {{scope.row.id.field_value}}
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="160">
                    <template slot="header">
                        楼栋名称
                        <el-tooltip class="warn-msg" placement="top">
                            <div slot="content">
                                楼栋名称要求：
                                <br />
                                · 和开发商保持一致：商务/拓展提供的楼栋名称或者开发商提供的楼栋图
                                <br />
                                · 获取不到开发商口径的楼栋名称时，对标参考的竞品的楼栋名称
                            </div>
                            <i class="el-icon-warning"
                                aria-hidden="true"></i>
                        </el-tooltip>
                    </template>
                    <template v-if="scope.row.building_name" slot-scope="scope">
                        <el-form-item
                            align="center"
                            :prop="'tableData.' + scope.$index + '.building_name.field_value'"
                            :rules="[ { required: true, message: '楼栋名称不可为空', trigger: 'blur' } ]">
                            <el-input
                                v-model.trim="scope.row.building_name.field_value"
                                :maxlength="10"
                                placeholder="请输入内容">
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    v-if="tableColStatus['building_name'] == '1'"
                    width="200">
                    <template slot="header" slot-scope="scope">
                        <info-source-dialog
                            @change="(val, otherVal) => changeAllSource('building_name', val, otherVal)"
                            :origin-arr="infoSource"
                            :other-val.sync="buildingName.otherVal"
                            v-model="buildingName.value" />
                    </template>
                    <template v-if="scope.row.building_name" slot-scope="scope">
                        <info-source-dialog
                            :other-val.sync="scope.row.building_name.belong_other"
                            :origin-arr="infoSource"
                            v-model="scope.row.building_name.belong_role" />
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    min-width="200">
                    <template slot="header">
                        楼栋销售状态
                    </template>
                    <template v-if="scope.row.saling_status" slot-scope="scope">
                        <el-select v-model="scope.row.saling_status.field_value" placeholder="请选择">
                            <el-option
                                v-for="item in saleStatus"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    v-if="tableColStatus['saling_status'] == '1'"
                    width="200">
                    <template slot="header" slot-scope="scope">
                        <info-source-dialog
                            @change="(val, otherVal) => changeAllSource('saling_status', val, otherVal)"
                            :other-val.sync="salingStatus.otherVal"
                            :origin-arr="infoSource"
                            v-model="salingStatus.value" />
                    </template>
                    <template v-if="scope.row.saling_status && scope.row.saling_status.is_show_belong_role == 1" slot-scope="scope">
                        <info-source-dialog
                            :other-val.sync="scope.row.saling_status.belong_other"
                            :origin-arr="infoSource"
                            v-model="scope.row.saling_status.belong_role" />
                    </template>
                </el-table-column>
                <!-- 是否展示 拓展不展示 -->
                <el-table-column
                    label="是否显示"
                    min-width="100"
                    v-if="!$route.query.taskId">
                    <template v-if="scope.row.is_show" slot-scope="scope">
                        <el-form-item
                            :prop="'tableData.' + scope.$index + '.is_show.field_value'"
                            :rules="[ { required: true, message: '是否显示必填', trigger: 'change' } ]">
                            <el-select
                                v-model="scope.row.is_show.field_value"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in isShow"
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    min-width="200">
                    <template slot="header">
                        操作
                    </template>
                    <template slot-scope="scope">
                        <el-button
                            @click="showGotoDialog({
                                path: 'buildingDetailEdit',
                                id: scope.row.id.field_value,
                                idName: 'buildingId'
                            })"
                            type="text">
                            查看
                        </el-button>
                        <el-button
                            @click="showGotoDialog({
                                path: 'buildingDetailEdit',
                                id: scope.row.id.field_value,
                                idName: 'buildingId',
                                isEdit: 1
                            })"
                            type="text">
                            编辑
                        </el-button>
                        <el-button
                            class="btn-danger"
                            @click="delectBuilding(scope.row.id.field_value, scope.$index)"
                            type="text">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            </el-form>
            <div
                 v-if="showExpandBtn"
                class="btn-box">
                <el-button
                    @click="showMoreInfo()"
                    type="text">
                    {{showAll ? '收起查看楼栋' : '查看更多楼栋'}}
                </el-button>
            </div>
        </div>
    </build-module-warp>
</template>

<script>
    import InfoSourceDialog from '../components/InfoSourceDialog';
    import BuildModuleWarp from './BuildModuleWarp';
    import { commonFun } from '@/assets/js/utils/utils';
    import apiObj from '@/api/buildingDictionary/expandTagList.js';
    import {
        confirmMsg,
        isRequiredInfoOrigin
    } from '../utils/index';
    import {buildingConf} from '../config/tabToggleList';
    import { mapState } from "vuex";
    export default {
        name: 'ChildModulebuildingInfo',
        components: {
            InfoSourceDialog,
            BuildModuleWarp
        },
        props: {
            // 楼盘销售状态
            saleStatus: {
                type: Array,
                default: () => []
            },
            // 渲染表单的数据
            initData: {
                type: Object,
                default: () => {}
            },
            // 信息来源列表
            infoSource: {
                type: Array,
                default: () => []
            },
            // 是否展示下拉数据
            isShow: {
                type: Array,
                default: () => []
            }
        },
        created () {
            // 初始化楼盘id
            this.projectId = this.$route.query.projectId;
            // 初始化户型id
            this.taskId = this.$route.query.taskId;
            // 初始化导入的方法，挂载到this
            this.confirmMsg = confirmMsg;
            this.isRequiredInfoOrigin = isRequiredInfoOrigin;
            this.exportOps = {
                project_id: this.projectId,
                task_id: this.taskId
            };
            // 挂载到this
            this.buildingConf = buildingConf;
            this.accept = buildingConf.fileType.join(',');
            this.initbuildInfo();
        },
        computed: {
            showAll() {
                return this.model.tableData.length === this.allData.length;
            },
            // 是否展示展开全部按钮
            showExpandBtn() {
                return this.allData.length > 2;
            },
            ...mapState({
                // 获取页面权限信息
                getEditAuth: state => state.buildingDictionary.isAuditorAuth
            })
        },
        data() {
            return {
                // 导出的配置信息
                exportOps: {},
                // 是否展示全部户型数据
                hasShowAllData: false,
                // 楼栋编号来源全选
                buildingName: {
                    value: '',
                    otherVal: ''
                },
                // 楼栋销售状态来源全选 室为必填
                salingStatus: {
                    value: '',
                    otherVal: ''
                },
                // 楼栋名称表单
                buildingNameVal: '',
                model: {
                    tableData: []
                },
                // 表格渲染的数据
                // tableData: [],
                // 表格列是否显示
                tableColStatus: {},
                allData: []
            }
        },
        watch: {
            initData(val) {
                this.initbuildInfo();
            }
        },
        methods: {
            // 初始化楼栋信息
            initbuildInfo() {
                const buildingData = commonFun.deepClone(this.initData.data) || [];
                // 需要转换为数字的值 销售状态、单价类型 总价类型
                const numberFields = ['saling_status'];
                buildingData.forEach((ele, idx) => {
                    Object.keys(ele).forEach(item => {
                        // 保存返回的此列是否展示来源的值 来源是否展示室一致的，不存在某一行来源展示，另一行数据不展示的情况,直接去第一行数据
                        if (idx === 0) {
                            this.tableColStatus[item] = ele[item].is_show_belong_role;
                        }
                        // 来源id为0不展示
                        if (ele[item].is_show_belong_role == '1') {
                            ele[item].belong_role = ele[item].belong_role || '';
                        }
                        // 下拉字段转换为数字
                        if (numberFields.includes(item)) {
                            ele[item].field_value = !ele[item].field_value ? '' : Number(ele[item].field_value);
                        }
                    })
                });
                this.model.tableData = buildingData.slice(0, 2);
                this.allData = buildingData;
            },
            /**
             * 触发父组件跳转提示弹窗
             * @param {String} tagMsg 跳转弹窗 对象标识 要跳转的页面信息
             */
            showGotoDialog(tagMsg) {
                this.$emit('goToAlert', tagMsg)
            },
            // 导出楼栋
            exportBuilding() {
                window.open(`/backend-api/project/dynamic-sales/export-build-info?export=1&project_id=${this.projectId}&task_id=${this.taskId}`);
            },
            /**
             * 文件上传成功后回调
             */
            exportSuccess(response, file, fileList) {
                const {
                    msg
                } = response;
                this.$message(msg);
            },
            /**
             * 上传之前的回调  若返回 false 或者返回 Promise 且被 reject，则停止上传。
             * @param {File} file file文件
             */
            beforeExport(file) {
                const { name, size } = file;
                // 默认单位是字节
                const sizeM = size / (1024 * 1024);
                const nameArr = name.split('.');
                // 后缀名
                const extensionName = nameArr[nameArr.length - 1];
                // 限制文件大小
                if (sizeM > this.buildingConf.sizeLimit) {
                    this.$message(`上传的文件不可大于${this.buildingConf.sizeLimit}M哦~`);
                    return false;
                }
                // 限制文件类型
                if (!this.buildingConf.fileType.includes(`.${extensionName}`)) {
                    this.$message(`请上传文件类型为${this.buildingConf.fileType.join()}的文件`);
                    return false;
                }
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
                    })
                })
            },
            // 新增楼栋方法
            addBuilding() {
                if (this.buildingNameVal === '') {
                    this.$alert('请先录入楼栋名称，再新增楼栋！', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                // 判断是否新增楼栋名称已存在 遍历数据保存楼栋名称
                if (this.checkBuildNameRepeat(this.buildingNameVal.trim())) {
                    this.$alert(`“${this.buildingNameVal}” 已经在楼盘下已存在，请重新录入`, {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                // 以上都通过后进入保存数据并跳转到楼栋新增页面
                this.$emit('goToAlert', {
                    path: 'buildingDetailEdit',
                    idName: 'buildingId',
                    buildingName: this.buildingNameVal,
                    isEdit: 1
                });
            },
            /**
             * 判断楼栋名称重复方法
             * @param {Sting} name 楼栋名称
             * @return {Boolean} 是否重复  重复返回true
             */
            checkBuildNameRepeat(name) {
                // 判断是否新增楼栋名称已存在 遍历数据保存楼栋名称到数组中
                const isRepeat = this.allData.find(ele => {
                    let buildName = '';
                    Object.keys(ele).forEach(item => {
                        if (item === 'building_name') {
                            buildName = ele[item].field_value
                        }
                    });
                    return buildName === name;
                });
                return !!isRepeat;
            },
            // 查看更多楼栋
            showMoreInfo() {
                // 防止重复点击
                if (this.tableLoading) {
                    return;
                }
                this.tableLoading = true;
                // 添加超时，是为了让loading先于表格数据渲染，不让其整合到一起渲染，解决loading无效问题
                setTimeout(() => {
                    if (this.showAll) {
                        this.$refs['buildingForm'].validate((valid) => {
                            if (valid) {
                                // 收起
                                this.model.tableData = this.allData.slice(0, 2);
                            }
                        });
                    } else {
                        this.model.tableData = [...this.allData];
                    }
                    this.$nextTick(() => {
                        this.tableLoading = false;
                    });
                }, 100);
            },
            /**
             * 删除单个户型
             * @param {String} houseId 户型id
             * @param {Number} index 数据所在索引
             */
            async delectBuilding(buildingId, index) {
                try {
                    // 判断是否点了确定按钮
                    const res = await this.confirmMsg('一旦删除则数据无法恢复，请确认是否删除！');
                    if (!res) {
                        return;
                    }
                    const options = {
                        project_id: this.projectId,
                        task_id: this.taskId,
                        building_id: buildingId
                    };
                    const {
                        data: {
                            code,
                            msg
                        }
                    } = await apiObj.delBuildingData(options);
                    this.$message(msg);
                    if (code === 0) {
                        // 删除此条数据
                        // this.model.tableData.splice(index, 1);
                        this.allData.splice(index, 1);
                        // 同步删除源数据里的数据
                        this.initData.data.splice(index, 1);
                        if (this.showAll) {
                            this.model.tableData = this.allData.slice(0, 2);
                        } else {
                            this.model.tableData = [...this.allData];
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取模块的数据
            getEditData() {
                // 校验必填
                let validStatus = false;
                this.$refs.buildingForm.validate((valid) => {
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
                let BuildingNames = this.allData.map(ele => {
                    let buildName = '';
                    Object.keys(ele).forEach(item => {
                        if (item === 'building_name') {
                            buildName = ele[item].field_value;
                        }
                    });
                    return buildName;
                });

                let isRepeat = false;
                let repeatName = '';
                for (let i = 0; i < BuildingNames.length; i++) {
                    for (let j = i + 1; j < BuildingNames.length; j++) {
                        if (BuildingNames[i] === BuildingNames[j]) {
                            isRepeat = true;
                            repeatName = BuildingNames[i];
                            continue;
                        }
                    }
                    if (isRepeat) {
                        continue;
                    }
                }
                // 校验漏洞名称是否重复
                if (isRepeat) {
                    this.$alert(`楼栋名称 “${repeatName}” 在楼盘下已重复，请重检查`, {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                // 校验来源必填
                if (!this.isRequiredInfoOrigin(this.initData.data, this.allData, true, '楼栋信息模块：')) {
                    return;
                }
                // 将本地的值进行返回
                return this.allData;
            }
        }
    }
</script>

<style lang="less" scoped>
    .flex-box {
        display: flex;
        align-items: center
    }
    /* .btn-danger{
        color: #f56c6c;
    } */
    .build-info {
        padding: 0 10px;
        margin-top: 50px;
    }
    .build-info-title {
        position: relative;
        padding: 0 10px 10px;
        border-bottom: 1px solid #dcdfe6;
        justify-content: space-between;
        .title-content {
            font-size: 15px;
            font-weight: bold;
        }
        .origin-title {
            position: absolute;
            left: 600px;
            top: 0;
        }
        .building-name {
            width: 150px;
        }
    }
    .table-wrap-box {
        padding: 15px 0;
        /deep/ .el-form-item{
            margin-bottom: 0;
        }
        .warn-msg {
            color: #f78f0f;
        }
    }
    .btn-box {
        text-align: right;
    }
    .btn-export{
        display: inline-block;
    }
</style>