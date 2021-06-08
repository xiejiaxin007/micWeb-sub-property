<!--
    @file: 优惠折扣特价页面
    @description: 优惠折扣特价页面
    @author: xiebin
    @date: 2019-12-19
-->
<template>
    <div
        v-loading="pageLoading"
        class="special-price-box">
        <!--面包屑-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <a @click="goToListPage">{{breadText}}</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>优惠折扣特价</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="head-line">
            <h4>{{$route.query.projectName + $route.query.buildingType}} -- 优惠折扣特价</h4>
        </div>
        <div class="modal-title-box">
            <h3 class="title-content">优惠信息</h3>
        </div>
        <div class="form-content-box">
            <el-form
                :model="projectDiscountInfo"
                label-width="120px">
                <el-form-item
                    label="优惠概述:"
                    v-if="projectDiscountInfo.pay_title">
                    <el-input
                        v-model="projectDiscountInfo.pay_title.field_value"
                        maxlength="8"
                        placeholder="请输入优惠概述">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="当期折扣概述:"
                    v-if="projectDiscountInfo.pay_info">
                    <el-input
                        type="textarea"
                        maxlength="50"
                        v-model="projectDiscountInfo.pay_info.field_value"
                        placeholder="请输入当期折扣概述">
                    </el-input>
                    <el-tooltip placement="top">
                        <div slot="content">
                            1.无优惠不要填写，空格也要删除
                            <br />
                            2.具体填写规则本着降低用户阅读成本为基础，例如5万抵10万，可直接写优惠5万（当有具体其他规则时，补充完整）
                            <br />
                            3. 当出现不同的限制条件时，由于字数限制或其他原因无法全部展示时，选择出现较多的情况填写
                            <br />
                            4.优惠信息过时后将该条优惠信息加到【往期优惠】字段里
                        </div>
                        <i class="el-icon-warning" 
                            aria-hidden="true"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item
                    label="往期折扣描述:"
                    v-if="projectDiscountInfo.old_pay_info">
                    <el-input
                        type="textarea"
                        maxlength="255"
                        v-model="projectDiscountInfo.old_pay_info.field_value"
                        placeholder="请输入往期折扣描述">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="优惠结束时间:"
                    v-if="projectDiscountInfo.discount_end_datetime">
                    <el-date-picker
                        v-model="projectDiscountInfo.discount_end_datetime.field_value"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="expireTimeOption">
                    </el-date-picker> 23 : 59 : 59
                </el-form-item>
            </el-form>
        </div>
        <div class="modal-title-box">
            <h3 class="title-content">特价房信息</h3>
        </div>
        <div class="form-content-box">
            <el-form
                label-width="120px"
                ref="formList"
                :model="projectDiscountInfo">
                <el-form-item
                    v-if="projectDiscountInfo.special_price_house_desc"
                    label="特价房概述:"
                    :class="isRequired ? 'is-required' : ''"
                    :prop="'special_price_house_desc.'+ 'field_value'"
                    :rules="[ { validator: (rule, value, callback) => descIsRequired(rule, value, callback), message: '请输入特价房描述', trigger: 'blur' } ]">
                    <el-input
                        v-model="projectDiscountInfo.special_price_house_desc.field_value"
                        maxlength="20"
                        placeholder="请输入特价房概述">
                    </el-input>
                    <el-tooltip placement="top">
                        <div slot="content">
                            总规则：注意不要违反广告法，这是最重要的基础原则，然后在内容上简洁明了，突出重点。
                        </div>
                        <i class="el-icon-warning"
                            aria-hidden="true"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item
                    label="结束时间:"
                    v-if="projectDiscountInfo.end_datetime">
                    <el-date-picker
                        v-model="projectDiscountInfo.end_datetime.field_value"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="expireTimeOption">
                    </el-date-picker> 23 : 59 : 59
                </el-form-item>
            </el-form>
        </div>
        <div class="modal-title-box header-title-box">
            <h3 class="title-content">特价房信息</h3>
            <el-tooltip placement="top">
                <div slot="content">
                    录入规则：
                    <br />
                    · 若获取到特价房的完整信息（包括房间号、户型建面、原总价、现特价总价、结束时间），正确录入即可。
                    <br />
                    · 若只获取到部分信息，如：房间号、户型建面、优惠单价，则需要自行计算总价（户型建面x优惠单价），再进行录入。
                    <br />
                    · 若始终获取不全信息，无法录入特价房，则录入到优惠信息中，类似这种，与商务沟通后，依然拿不到房间号，就录入到优惠当中。
                    <br />
                    注意点！！！ 
                    <br />
                    · 在录入总价时，特别注意总价的单位是万元，一定记住加小数点，默认小数点后四位。
                    <br />
                    · 特价房到期后会自动隐藏，再次进行特价房录入时，建议不要删除之前的特价房，因为你不知道是否会在后期再用到，教训深刻。
                    <br />
                    · 在特价房录入房间号时，如果需要展示楼栋和单元号时，参考开发商的格式，中间用“-”连接。
                </div>
                <i class="el-icon-warning title-tip"
                    aria-hidden="true"></i>
            </el-tooltip>
        </div>
        <div class="special-room-info form-content-box">
            <el-form
                :model="modle"
                ref="formListRules"
                :validate-on-rule-change="false">
                <el-table
                    :data="modle.projectDiscountSpecialHouse"
                    style="width: 100%">
                    <el-table-column
                        label="房号"
                        v-if="modle.projectDiscountSpecialHouse[0] && modle.projectDiscountSpecialHouse[0].house_num">
                        <template slot-scope="scope">
                            <el-form-item
                                :prop="'projectDiscountSpecialHouse.' + scope.$index + '.house_num.field_value'"
                                :rules="[ { required: true, message: '请输入房号', trigger: 'blur' } ]">
                                <el-input
                                    v-model="scope.row.house_num.field_value"
                                    minlength="1"
                                    size="medium"
                                    maxlength="15"
                                    @input="inputVal(scope.row)">
                                </el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="面积(㎡)"
                        v-if="modle.projectDiscountSpecialHouse[0] && modle.projectDiscountSpecialHouse[0].acreage">
                        <template slot-scope="scope">
                            <el-form-item
                                :prop="'projectDiscountSpecialHouse.' + scope.$index + '.acreage.field_value'"
                                :rules="[ { required: true, message: '请输入面积', trigger: 'blur' } ]">
                                <jl-number-input
                                    v-model="scope.row.acreage.field_value"
                                    minVal="1"
                                    maxVal="99999.99"
                                    reg="twoNum">
                                </jl-number-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="原总价(万元)"
                        v-if="modle.projectDiscountSpecialHouse[0] && modle.projectDiscountSpecialHouse[0].price">
                        <template slot-scope="scope">
                            <el-form-item>
                                <jl-number-input
                                    v-model="scope.row.price.field_value"
                                    minVal="1"
                                    maxVal="99999.9999"
                                    reg="fourNum">
                                </jl-number-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="特价(万元)"
                        v-if="modle.projectDiscountSpecialHouse[0] && modle.projectDiscountSpecialHouse[0].special_price">
                        <template slot-scope="scope">
                            <el-form-item
                                :prop="'projectDiscountSpecialHouse.' + scope.$index + '.special_price.field_value'"
                                :rules="[ { required: true, message: '请输入特价', trigger: 'blur' } ]">
                                <jl-number-input
                                    v-model="scope.row.special_price.field_value"
                                    minVal="1"
                                    maxVal="99999.9999"
                                    reg="fourNum">
                                </jl-number-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="是否显示"
                        width="200"
                        v-if="modle.projectDiscountSpecialHouse[0] && modle.projectDiscountSpecialHouse[0].is_show">
                        <template slot-scope="scope">
                            <el-form-item>
                                <el-radio-group
                                    v-model="scope.row.is_show.field_value"
                                    @change="isValidate">
                                    <el-radio
                                        :label="1">
                                        显示
                                    </el-radio>
                                    <el-radio
                                        :label="2">
                                        隐藏
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        v-if="modle.projectDiscountSpecialHouse[0]">
                        <template slot-scope="scope">
                            <el-form-item>
                                <el-button
                                    type="text"
                                    @click="removeLine(scope.row, scope.$index, modle.projectDiscountSpecialHouse)">
                                    删除
                                </el-button>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <el-button
                type="primary"
                class="btn-add-speical-room"
                @click="addSpeicalRoom">
                增加特价房
            </el-button>
        </div>
        <div class="footer">
            <el-button @click="cancel">取消</el-button>
            <el-button
                type="primary"
                @click="saveDataList('formList', 'formListRules')">
                提交
            </el-button>
        </div>
    </div>
</template>

<script>
import specialHouseApi from '../api/specialHouseInfo';
import commonApi from '../api/common';
import { filterDate, toRouterLink } from '../utils/index';
export default {
    name: 'BuildSpecialPriceInfo',
    data() {
        return {
            // 优惠信息
            projectDiscountInfo: {},
            // 特价房信息
            modle: {
                projectDiscountSpecialHouse: []
            },
            expireTimeOption: {
                disabledDate(date) {
			          	//disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
						return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
				}
            },
            // 页面loading
            pageLoading: false,
            breadText: '楼盘列表'
        }
    },
    mounted() {
        this.toRouterLink = toRouterLink;
        this.specialInfoIsEdit();
        this.initSpecialInfoList();
        this.isOperation();
    },
    computed: {
        isRequired: function() {
            let list = this.modle.projectDiscountSpecialHouse;
                let len = list.length;
                let isRequired = false;
                if (len > 0) {
                    for (var i = 0; i< len;i ++) {
                        if (list[i].is_show.field_value === 1) {
                            isRequired = true;
                        }
                    }
                }
            return isRequired;
        }
    },
    methods: {
        // 判断优惠信息是否可编辑，不可编辑跳回查看页面
        async specialInfoIsEdit() {
            try {
                let params = {
                    project_id: this.$route.query.projectId
                };
                const {
                    data: { code, msg, data }
                } = await specialHouseApi.isEdit(params);
                if (code === 0) {
                    if (data && data.is_edit === '2') {
                        this.$message({
                            type: 'warning',
                            message: '活动期间不允许编辑优惠和特价房信息！'
                        });
                        this.toRouterLink(5);
                    }
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 【父组件调用】快捷键保存操作
        handleShortCut() {
            this.saveDataList('formList', 'formListRules');
        },
        // 特价房描述是否必填
        /**
         * @description: 特价房描述是否必填的校验，用validator不用required是因为用required重新触发校验时错误信息不能清除
         * @param {Object} rule 验证规则
         * @param {String}  value  校验表单项的值
         * @param {Function}  callback 错误返回
         * @return: 
         */
        descIsRequired(rule, value, callback) {
            if (this.isRequired && !value) {
                callback(new Error());
            } else {
                callback();
            }
        },
        // 切换显示与隐藏 | 新增 | 删除来决定特价房描述是否必填
        isValidate() {
            this.$refs.formList.validateField('special_price_house_desc.field_value');
        },
        // 房号输入框输入的时候
        inputVal(scope) {
            if (scope.house_num.field_value == '0') {
                this.$set(scope.house_num, 'field_value', '1');
            }
        },
        // 修改点击面包屑跳转
        goToListPage() {
            if (this.$route.query.role === 'operation') {
                window.location.href = '/index.php?r=yw-projects/index';
            } else if (this.$route.query.role === 'expand') {
                this.$router.push({
                    path: '/building/ExpandTaskList'
                });
            }
        },
        // 判断角色修改面包屑文案
        isOperation() {
            if (this.$route.query.role === 'operation') {
                this.breadText = '楼盘列表';
            } else if (this.$route.query.role === 'expand') {
                this.breadText = '楼盘任务列表';
            }
        },
        // 初始化数据接口
        async initSpecialInfoList() {
            try {
                let params = {
                    project_id: this.$route.query.projectId,
                    task_id: this.$route.query.taskId
                }
                let result = await specialHouseApi.initSpecialInfoData(params);
                let { data } = result;
                if(data.code === 0) {
                    this.projectDiscountInfo = data.data.project_discount_info.data;
                    this.modle.projectDiscountSpecialHouse = data.data.project_discount_special_house.data;
                    if (this.projectDiscountInfo.end_datetime) {
                        this.projectDiscountInfo.end_datetime.field_value = filterDate(this.projectDiscountInfo.end_datetime.field_value, 'YYYY-MM-DD');
                    }
                    if (this.projectDiscountInfo.discount_end_datetime) {
                        this.projectDiscountInfo.discount_end_datetime.field_value = filterDate(this.projectDiscountInfo.discount_end_datetime.field_value, 'YYYY-MM-DD');
                    }
               } else {
                    this.$message(data.msg);
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * 点击实时删除当前行
         * @params index [number] 当前点击行的index
         * @params deleteName [number] 要操作的数组
         */
        removeLine (row, index, deleteName) {            
            this.$refs['formListRules'].clearValidate();
            this.$confirm('一旦删除则无法恢复确认是否删除！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                    if (!row.id.field_value) {
                        deleteName.splice(index, 1);
                        this.isValidate();
                        return;
                    }
                    try {
                        let queryList = this.$route.query;
                        let params = {
                            project_id: queryList.projectId,
                            task_id: queryList.taskId,
                            id: row.id.field_value
                        }
                        let result = await specialHouseApi.delSpecialHouseData(params);
                        let { data } = result;
                        if (data.code === 0) {
                            if (index !== -1) {
                                deleteName.splice(index, 1)
                            }
                            this.isValidate();
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
        // 添加
        async addSpeicalRoom() {
            try {
                let params = {
                    page_id: 5,
                    task_id: this.$route.query.taskId || ''
                }
                let result = await commonApi.getPageModuleData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.modle.projectDiscountSpecialHouse.push(data.data.project_discount_special_house.data);
                    this.isValidate();
                } else {
                    this.$message(data.msg);
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 返回
        cancel() {
            this.$emit('specialChangeStatus', false);
        },
        // 敏感词校验
        async checkSensitiveWordsInfo () {
            let str = '';
            //拷贝优惠特价数据
            this.projectDiscountInfoCopy = JSON.parse(JSON.stringify(this.projectDiscountInfo));
            for(let i in this.projectDiscountInfoCopy) {
                if (i !== 'discount_end_datetime' && i !== 'end_datetime') {
                    str += this.projectDiscountInfoCopy[i].field_desc + '$' + this.projectDiscountInfoCopy[i].field_value + '|||';
                }
            }
            str = str.substr(0, str.length - 3);
            try {
                let params = {
                    str,
                    project_id: this.$route.query.projectId,
                    // 是不是新建楼盘，直接传2=不是新建楼盘
                    is_create_project: 2
                };
                let result = await specialHouseApi.checkSensitiveWordsData(params);
                let { data } = result;
                if (data.code === 200) {
                    Promise.resolve(true);
                } else {
                    this.$message(data.msg);
                    return false;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 提交数据
        saveDataList(formName,formListName) {
            let formOne = new Promise((resolve, reject) => {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        resolve(true);
                    } else {
                        return false;
                    }
                })
            })
            let formTwo = new Promise((resolve, reject) => {
                this.$refs[formListName].validate(async (valid) => {
                    if (valid) {
                        resolve(true);
                    } else {
                        return false;
                    }
                })
            })
            // 敏感词校验
            let senSitivePromis = this.checkSensitiveWordsInfo();
            Promise.all([formOne, formTwo, senSitivePromis]).then(async (result)=>{
                if(!result.includes(false)) {
                    if ((this.projectDiscountInfo.pay_title.field_value === '' && this.projectDiscountInfo.pay_info.field_value !== '') || (this.projectDiscountInfo.pay_title.field_value !== '' && this.projectDiscountInfo.pay_info.field_value === '')) {
                        this.$alert('优惠概述和当期折扣概述需要同时有值或者同时为空！', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                return false;
                            }
                        });
                    } else {
                        // 开启loading
                        this.pageLoading = true;
                        try {
                            let queryList = this.$route.query;
                            // 组合data数据
                            let dataList = {
                                project_discount_info: {
                                    data: this.projectDiscountInfo,
                                    module_name: '优惠信息'
                                },
                                project_discount_special_house: {
                                    module_name: "特价房信息",
                                    data: this.modle.projectDiscountSpecialHouse
                                    }
                            }
                            let params = {
                                project_id: queryList.projectId,
                                task_id: queryList.taskId,
                                data: dataList
                            }
                            let { data } = await specialHouseApi.saveSpecialHouseData({params: JSON.stringify(params)});
                            if (data.code === 0) {
                                this.pageLoading = false;
                                this.$message({
                                    type: 'success',
                                    message: '提交成功'
                                });
                                // 切换到详情查看页面
                                this.$emit('specialChangeStatus', false);
                            } else {
                                this.pageLoading = false;
                                this.$message(data.msg);
                            }
                        }
                        catch(error) {
                            this.pageLoading = false;
                            console.log(error);
                        }
                    }
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
.el-icon-warning {
    color: #ff6e0e;
    font-size: 20px;
    margin-top: 10px;
    margin-left: 6px;
    &.title-tip {
        margin-top: 0;
    }
}
.header-title-box {
    justify-content: start;
}
.special-price-box {
    padding: 20px 15px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 7px;
    .head-line{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;
        padding-bottom: 15px;
        font-size: 16px;
        min-height: 40px;
    }
    .form-content-box {
        width: 1050px;
        margin-top: 20px;
        .el-input, .el-textarea {
            width: 85%;
        }
        .el-date-editor.el-input {
            width: 330px;
        }
        /deep/ .btn-add-speical-room {
            margin-top: 20px;
        }
        .specia-photo-box {
            margin-top: 30px;
        }
        .photo-text {
            display: flex;
            flex-direction: row;
            h4 {
                margin-right: 20px;
            }
            span {
                font-size: 12px;
                margin-top: 2px;
            }
        }
        /deep/ .el-radio {
            margin-bottom: 5px;
        }
    }
    .footer {
        text-align: center;
        margin-top: 30px;
        /deep/ .el-button {
            width: 100px;
        }
    }
}
</style>