<!--
    @name: 楼盘信息模块
    @description: 楼盘动销信息页面 - 楼盘信息子模块
    @author: 贺伟
    @date: 2019-12-09
-->
<template>
    <div class="project-info">
        <div class="modal-title-box project-info-title">
            <h3 class="title-content">楼盘信息</h3>
            <p class="origin-title"
                v-if="roleNumber == ROLENUMBER">信息来源：</p>
        </div>
        <!--表单部分开始-->
        <el-form
            ref="projectForm"
            :model="projectForm"
            label-width="130px">
            <el-form-item
                v-if="projectForm.status"
                class="form-item-wrap"
                :prop="'status.field_value'"
                :rules="[ { required: true, message: '请选择一个销售状态', trigger: 'change' } ]"
                label="楼盘销售状态：">
                <div class="form-left-box flex-box">
                    <el-radio-group
                        v-model="projectForm.status.field_value"
                        @change="changeSaleStatus">
                        <el-radio
                            v-for="(ele, idx) in saleStatus"
                            :key="idx"
                            :label="ele.id">
                            {{ele.text}}
                        </el-radio>
                    </el-radio-group>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        placement="right-start">
                        <ul slot="content">
                            <li class="msg-list">
                                <span class="focus">合作、外联项目：</span>
                                @变更通知 > @商务助理
                            </li>
                            <li class="msg-list">
                                <span class="focus">非合作项目：</span>
                                门户网站的动态中没有最新的动态信息（比如上次看动态时间是2019/3/6，周期内再维护时，发现该项目的动态还是3/6时），<br>
                                询问咨询师或打市调电话确认最新的项目动态，再经历了3个周期后，动态仍未更新&市调电话打不通，项目变更销售状态：在售变更为待售；<br>
                                待售变更为售罄。后期如果有明确的信息再根据信息的内容做相应的变更。
                            </li>
                        </ul>
                        <div class="msg-box">
                            <i class="el-icon-warning"
                                aria-hidden="true"></i>
                        </div>
                    </el-tooltip>
                </div>
                <info-origin
                    class="msg-origin"
                    v-if="projectForm.status.is_show_belong_role == 1"
                    v-model="projectForm.status.belong_role"
                    :other-val.sync="projectForm.status.belong_other"
                    :origin-arr="infoSource"
                    :operate-msg="getOriginOperateInfo(projectForm.status, false)" />
            </el-form-item>
            <el-form-item
                v-if="projectForm.current_price_type"
                class="form-item-wrap"
                :prop="'current_price_type.field_value'"
                :rules="[ { required: true, message: '请选择一个单价类型', trigger: 'change' } ]"
                label="楼盘单价类型：">
                <div class="form-left-box flex-box">
                    <el-radio-group
                        @change="(val) => typeChange(val, ['current_rate', 'current_rate_max'], 'unit')"
                        v-model="projectForm.current_price_type.field_value">
                        <el-radio
                            v-for="ele in priceType"
                            :key="ele.id"
                            :label="ele.id"
                            :disabled="ele.id === 4"
                            >
                            {{ele.text}}
                        </el-radio>
                    </el-radio-group>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        placement="right-start">
                        <ul slot="content">
                            <li class="msg-list">
                                <span class="focus">· 必填</span>
                                ，没有价格时，选择系统默认
                            </li>
                            <li class="msg-list">
                                <span class="focus">· 优先级：</span>
                                单价区间>均价>底价，即当同时获取到楼盘的单价区间和均价时，优先选择楼盘的区间价格
                            </li>
                        </ul>
                        <div class="msg-box">
                            <i class="el-icon-warning"
                                aria-hidden="true"></i>
                        </div>
                    </el-tooltip>
                </div>
                <info-origin
                    class="msg-origin"
                    v-if="projectForm.current_price_type.is_show_belong_role == 1"
                    v-model="projectForm.current_price_type.belong_role"
                    :other-val.sync="projectForm.current_price_type.belong_other"
                    :origin-arr="infoSource"
                    :operate-msg="getOriginOperateInfo(projectForm.current_price_type, false)" />
            </el-form-item>
            <el-form-item
                class="form-item-wrap"
                v-if="projectForm.current_rate && projectForm.current_price_type.field_value !== ''"
                label="单价：">
                <div class="form-left-box">
                    <!-- 系统单价 -->
                    <div
                        class="flex-box"
                        :key="1"
                        v-if="projectForm.current_price_type.field_value == 1">
                        <el-form-item
                            :prop="'current_rate.field_value'">
                            <el-input
                                class="single-ipt"
                                disabled
                                size="medium"
                                v-model="projectForm.current_rate.field_value">
                            </el-input>
                            <span class="unit">万元</span>
                            -- &nbsp;
                            <el-input
                                class="single-ipt"
                                disabled
                                size="medium"
                                v-model="projectForm.current_rate_max.field_value">
                            </el-input>
                            <span class="unit">万元</span>
                        </el-form-item>
                    </div>
                    <!-- 底价 -->
                    <div
                        class="flex-box"
                        :key="3"
                        v-if="projectForm.current_price_type.field_value == 3">
                        <el-form-item
                            :prop="'current_rate.field_value'"
                            :rules="[ { validator: (rule, value, callback) => validateUnitPrice(rule, value, callback, 'min'), message: '单价不可为空', trigger: 'blur' } ]">
                            <jl-number-input
                                class="num-input"
                                v-model.trim="projectForm.current_rate.field_value"
                                :minVal="0.0001"
                                :maxVal="99.9999"
                                reg="fourNum"
                            ></jl-number-input>
                        </el-form-item>
                        <span class="unit">万元起</span>
                    </div>
                    <!-- 当前报价|均价 -->
                    <div
                        class="flex-box"
                        :key="2"
                        v-if="projectForm.current_price_type.field_value == 2">
                        <el-form-item
                            :prop="'current_rate.field_value'"
                            :rules="[ { validator: (rule, value, callback) => validateUnitPrice(rule, value, callback, 'min'), message: '单价不可为空', trigger: 'blur' } ]">
                            <jl-number-input
                                class="num-input"
                                v-model.trim="projectForm.current_rate.field_value"
                                :minVal="0.0001"
                                :maxVal="99.9999"
                                reg="fourNum"
                            ></jl-number-input>
                        </el-form-item>
                        <span class="unit">万元</span>
                    </div>
                    <!-- 单价区间 -->
                    <div
                        class="flex-box"
                        :key="4"
                        v-if="projectForm.current_price_type.field_value == 4">
                        <el-form-item
                            :rules="[ { validator: (rule, value, callback) => validateUnitPrice(rule, value, callback, 'min'), message: '单价不可为空', trigger: 'blur' } ]"
                            :prop="'current_rate.field_value'">
                            <jl-number-input
                                class="num-input"
                                v-model="projectForm.current_rate.field_value"
                                :minVal="0.0001"
                                :maxVal="99.9999"
                                reg="fourNum"
                                @blur="changeSaleStatus"
                            ></jl-number-input>
                        </el-form-item>
                        <span class="unit">万元</span>
                            -- &nbsp;
                        <el-form-item
                            :rules="[ { validator: (rule, value, callback) => validateUnitPrice(rule, value, callback, 'max'), message: '单价不可为空', trigger: 'blur' } ]"
                            :prop="'current_rate_max.field_value'">
                            <jl-number-input
                                class="num-input"
                                v-model="projectForm.current_rate_max.field_value"
                                :minVal="0.0001"
                                :maxVal="99.9999"
                                reg="fourNum"
                                @blur="changeSaleStatus"
                            ></jl-number-input>
                        </el-form-item>
                        <span class="unit">万元</span>
                    </div>
                </div>
                <info-origin
                    class="msg-origin"
                    v-if="projectForm.current_rate.is_show_belong_role == 1"
                    v-model="projectForm.current_rate.belong_role"
                    :other-val.sync="projectForm.current_rate.belong_other"
                    :origin-arr="infoSource"
                    @change="(val, otherVal) => changePrice('current_rate_max', val, otherVal)"
                    :operate-msg="getOriginOperateInfo(projectForm.current_rate, false)" />
            </el-form-item>
            <el-form-item
                v-if="projectForm.price_type"
                class="form-item-wrap"
                :prop="'price_type.field_value'"
                :rules="[ { required: true, message: '请选择一个总价类型', trigger: 'change' } ]"
                label="楼盘总价类型：">
                <div class="form-left-box flex-box">
                    <el-radio-group
                        @change="(val) => typeChange(val, ['price_min', 'price_max'])"
                        v-model="projectForm.price_type.field_value">
                        <el-radio
                            v-for="ele in totalPriceType"
                            :key="ele.id"
                            :label="ele.id">
                            {{ele.text}}
                        </el-radio>
                    </el-radio-group>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        placement="right-start">
                        <ul slot="content">
                            <li class="msg-list">
                                <span class="focus">· 必填</span>
                                ，没有价格时，选择系统默认
                            </li>
                            <li class="msg-list">
                                <span class="focus">· 优先级：</span>
                                总价区间>底价>系统总价>总价，即当这些价格同时出现时，按照这个优先级填写楼盘总价区间
                            </li>
                        </ul>
                        <div class="msg-box">
                            <i class="el-icon-warning"
                                aria-hidden="true"></i>
                        </div>
                    </el-tooltip>
                </div>
                <info-origin
                    class="msg-origin"
                    v-if="projectForm.price_type.is_show_belong_role == 1"
                    v-model="projectForm.price_type.belong_role"
                    :other-val.sync="projectForm.price_type.belong_other"
                    :origin-arr="infoSource"
                    :operate-msg="getOriginOperateInfo(projectForm.price_type, false)" />
            </el-form-item>
            <el-form-item
                v-if="projectForm.price_min && projectForm.totalPriceTypeStatus !== ''"
                class="form-item-wrap"
                label="总价：">
                <div class="form-left-box">
                    <div
                        v-if="projectForm.price_type.field_value == 1">
                        <el-input
                            class="single-ipt"
                            disabled
                            size="medium"
                            v-model="projectForm.price_min.field_value">
                        </el-input>
                        <span class="unit">万元</span>
                        -- &nbsp;
                        <el-input
                            class="single-ipt"
                            disabled
                            size="medium"
                            v-model="projectForm.price_max.field_value">
                        </el-input>
                        <span class="unit">万元</span>
                    </div>
                    <div
                        v-if="projectForm.price_type.field_value == 2"
                        class="flex-box">
                        <el-form-item
                            :rules="[ { required: true, message: '总价不可为空', trigger: 'blur' } ]"
                            :prop="'price_min.field_value'">
                            <jl-number-input
                                class="num-input"
                                v-model="projectForm.price_min.field_value"
                                :minVal="1"
                                :maxVal="99999.9999"
                                reg="fourNum"
                            ></jl-number-input>
                        </el-form-item>
                        <span class="unit">万元起</span>
                    </div>
                    <div
                        v-if="projectForm.price_type.field_value == 3"
                        class="flex-box">
                        <el-form-item
                            :rules="[ { required: true, message: '总价不可为空', trigger: 'blur' } ]"
                            :prop="'price_min.field_value'">
                            <jl-number-input
                                class="num-input"
                                v-model="projectForm.price_min.field_value"
                                :minVal="1"
                                :maxVal="99999.9999"
                                reg="fourNum"
                            ></jl-number-input>
                        </el-form-item>
                        <span class="unit">万元</span>
                    </div>
                    <div
                        v-if="projectForm.price_type.field_value == 4"
                        class="flex-box">
                        <el-form-item
                            :rules="[ { required: true, message: '总价不可为空', trigger: 'blur' } ]"
                            :prop="'price_min.field_value'">
                            <jl-number-input
                                class="num-input"
                                v-model="projectForm.price_min.field_value"
                                :minVal="1"
                                :maxVal="99999.9999"
                                reg="fourNum"
                            ></jl-number-input>
                        </el-form-item>
                        <span class="unit">万元</span>
                            -- &nbsp;
                        <el-form-item
                            :rules="[ { required: true, message: '总价不可为空', trigger: 'blur' } ]"
                            :prop="'price_max.field_value'">
                            <jl-number-input
                                class="num-input"
                                v-model="projectForm.price_max.field_value"
                                :minVal="1"
                                :maxVal="99999.9999"
                                reg="fourNum"
                            ></jl-number-input>
                        </el-form-item>
                        <span class="unit">万元</span>
                    </div>
                </div>
                <info-origin
                    v-if="projectForm.price_min.is_show_belong_role == 1"
                    class="msg-origin"
                    v-model="projectForm.price_min.belong_role"
                    :other-val.sync="projectForm.price_min.belong_other"
                    :origin-arr="infoSource"
                    @change="(val, otherVal) => changePrice('price_max', val, otherVal)"
                    :operate-msg="getOriginOperateInfo(projectForm.price_min, false)" />
            </el-form-item>
            <el-form-item
                v-if="projectForm.price_desc"
                :rules="(projectForm.price_type.field_value != 2 && projectForm.current_price_type.field_value != 3) ? {} : [ { required: true, message: '价格说明不可为空', trigger: 'blur' } ]"
                :prop="'price_desc.field_value'"
                label="价格说明：">
                <div class="form-left-box price-flex-box flex-box">
                    <el-input
                        type="textarea"
                        :rows="5"
                        :maxlength="255"
                        placeholder="请输入价格说明"
                        v-model="projectForm.price_desc.field_value">
                    </el-input>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        placement="right-start">
                        <ul slot="content">
                            <li class="msg-list">
                                · 当单价为区间楼盘报价选择均价时，必须填写价格说明备注项目的区间范围
                            </li>
                            <li class="msg-list">
                                · 当各户型单价为底价时，需填写价格说明户型单价/总价为底价
                            </li>
                            <li class="msg-list">
                                · 当获取到楼盘的价格是均价，各户型填写的价格和楼盘不一致时，需填写价格说明
                            </li>
                        </ul>
                        <div class="msg-box">
                            <i class="el-icon-warning"
                                aria-hidden="true"></i>
                        </div>
                    </el-tooltip>
                    <info-origin
                        class="msg-origin"
                        v-if="projectForm.price_desc.is_show_belong_role == 1"
                        v-model="projectForm.price_desc.belong_role"
                        :other-val.sync="projectForm.price_desc.belong_other"
                        :origin-arr="infoSource"
                        :operate-msg="getOriginOperateInfo(projectForm.price_desc, false)" />
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import InfoOrigin from '../components/InfoOrigin';
    import { commonFun } from '@/assets/js/utils/utils';
    import {
        isRequiredInfoOrigin,
        yuanToWan,
        getOriginOperateInfo
    } from '../utils/index';
    import {
        roleNumList
    } from '../config/tabToggleList';
    export default {
        name: 'ChildModuleProjectInfo',
        components: {
            InfoOrigin
        },
        props: {
            // 信息来源列表
            infoSource: {
                type: Array,
                default: () => []
            },
            // 楼盘销售状态
            saleStatus: {
                type: Array,
                default: () => []
            },
            // 楼盘单价类型
            priceType: {
                type: Array,
                default: () => []
            },
            // 楼盘总价类型
            totalPriceType: {
                type: Array,
                default: () => []
            },
            // 渲染表单的数据
            initData: {
                type: Object,
                default: () => {}
            },
            // 当前角色值 7为运营
            roleNumber: {
                type: [String, Number],
                default: ''
            }
        },
        data() {
            return {
                // 楼盘表单信息
                projectForm: {},
                getOriginOperateInfo,
                // 获取运营角色值
                ROLENUMBER: roleNumList.yunYing
            }
        },
        computed: {
            priceDescRule() {
                const priceType = this.projectForm.current_price_type.field_value;
                const totalPriceType = this.projectForm.price_type.field_value;
                if (priceType == 3 || totalPriceType == 2) {
                    return [ { required: true, message: '价格说明不可为空', trigger: 'blur' } ]
                }
                return [];
            }
        },
        watch: {
            initData(val) {
                this.initProjectInfo();
            }
        },
        created() {
            this.isRequiredInfoOrigin = isRequiredInfoOrigin;
            this.initProjectInfo();
        },
        methods: {
            /**
             * @description: 校验单价最大值规则，楼盘销售状态为待售和售罄的时候，单价为非必填项​
             * @param {Object} rule 校验规则 
             * @param {String} value  单价值 
             * @param {Function} callback  返回方法
             * @param {String} type  min=校验最小值   max=校验最大值
             * @return {type} 
             */
            validateUnitPrice(rule, value, callback, type) {
                // 单价类型  1=系统 2=均价  3=底价  4=单价区间
                let priceType = this.projectForm.current_price_type.field_value;
                // 销售状态  2=在售    4=待售    3=售罄
                let status = this.projectForm.status.field_value;
                if (status === 2 && priceType !== 1 && !value) {
                    // 在售且不是系统单价时
                    callback(new Error());
                }
                if (priceType == 4) {
                    if (type === 'min') {
                        // 单价区间时，不管是什么销售状态，只要最大单价有值，最小单价也必填
                        let max = this.projectForm.current_rate_max.field_value;
                        if (max && !value) {
                            callback(new Error());
                        }
                    } else if (type === 'max') {
                        // 单价区间时，不管是什么销售状态，只要最小单价有值，最大单价也必填
                        let min = this.projectForm.current_rate.field_value;
                        if (min && !value) {
                            callback(new Error());
                        }
                    }
                }
                callback();
            },
            /**
             * @description: 切换销售状态时触发单价校验
             * @param {Number} val   销售状态 
             * @return {type} 
             */
            changeSaleStatus(val) {
                this.$refs.projectForm.validateField('current_rate.field_value');
                if (this.projectForm.current_price_type.field_value == 4) {
                    this.$refs.projectForm.validateField('current_rate_max.field_value');
                }
            },
            // 初始化信息
            initProjectInfo() {
                const initData = commonFun.deepClone(this.initData.data);
                // 存储系统单价和系统总价 这两项的值无法修改
                /* this.sysPrice = initData.current_rate.field_value;
                this.sysTotalPrice = initData.price_min.field_value; */
                // 需要转换为数字的值 单价类型 总价类型
                const numberFields = ['price_type', 'current_price_type'];
                // 需要转换为万元的字段
                const unitYuans = ['current_rate', 'current_rate_max', 'price_min', 'price_max'];
                Object.keys(initData).forEach(ele => {
                    // 来源转数字
                    if (initData[ele].is_show_belong_role == '1') {
                        initData[ele].belong_role = Number(initData[ele].belong_role);
                    }
                    // 将元转为万元展示
                    if (unitYuans.includes(ele)) {
                        initData[ele].field_value = yuanToWan(initData[ele].field_value);
                        this.initData.data[ele].field_value = yuanToWan(this.initData.data[ele].field_value);
                    }
                    // 下拉字段转换为数字
                    if (numberFields.includes(ele)) {
                        initData[ele].field_value = initData[ele].field_value === '' ? '' : Number(initData[ele].field_value);
                    }
                    // 销售状态默认值0应该计为空，且要转为数字
                    if (ele === 'status') {
                        initData[ele].field_value = initData[ele].field_value === '' || initData[ele].field_value === '0' ? '' : Number(initData[ele].field_value);
                    }
                });
                this.projectForm = initData;
            },
            /**
             * @description: 单价|总价类型切换清除数据
             * @param {Number}  val    单价|总价类型值
             * @param {Array}   arr   要清除数据的字段
             * @param {String}  type   unit=单价
             * @return {*}
             */
            typeChange(val, arr, type) {
                // 单价，系统单价时清空单价校验，其他类型触发校验
                if (type === 'unit') {
                    if (val == 1) {
                        this.$refs.projectForm.clearValidate('current_rate.field_value');
                        this.$refs.projectForm.clearValidate('current_rate_max.field_value');
                    } else {
                        this.$refs.projectForm.validateField('current_rate.field_value');
                        this.$refs.projectForm.validateField('current_rate_max.field_value');
                    }
                }
                arr.forEach(ele => {
                    this.projectForm[ele].field_value = '';
                });
            },
            // 改变价格对
            changePrice(key, val, otherVal) {
                this.projectForm[key].belong_role = val;
                this.projectForm[key].belong_other = otherVal;
            },
            // 获取模块的数据
            getEditData() {
                // 校验区间值
                let {
                    // 单价类型
                    current_price_type: {field_value: curPriceType},
                    // 起始单价
                    current_rate: {field_value: unitPriceMin},
                    // 结束单价
                    current_rate_max: {field_value: unitPriceMax},
                    // 总价类型
                    price_type: {field_value: priceType},
                    // 起始总价
                    price_min: {field_value: toatalPriceMin},
                    // 结束总价
                    price_max: {field_value: toatalPriceMax}
                } = this.projectForm;
                // 如果系统单价类型不为区间和系统单价 则将最小值得值赋值给最大值一份
                if (curPriceType != 4 && curPriceType != 1) {
                    this.projectForm.current_rate_max.field_value = unitPriceMin;
                }
                // 如果系统总价类型不为区间和系统总价 则将最小值得值赋值给最大值一份
                if (priceType != 4 && priceType != 1) {
                    this.projectForm.price_max.field_value = toatalPriceMin;
                }
                // 如果起始值和结束值均不为'' 再进行前后值比较
                if (curPriceType == 4 && (unitPriceMin !== '' && unitPriceMax !== '' && Number(unitPriceMin) >= Number(unitPriceMax))) {
                    this.$message.error('单价的最大值必须大于最小值！');
                    return;
                }
                // 如果起始值和结束值均不为'' 再进行前后值比较
                if (priceType == 4 && toatalPriceMin !== '' && toatalPriceMax !== '' && Number(toatalPriceMin) >= Number(toatalPriceMax)) {
                    this.$message.error('起始总价应小于结束总价！');
                    return;
                }
                let validStatus = false;
                this.$refs.projectForm.validate((valid) => {
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
                if (!this.isRequiredInfoOrigin(this.initData.data, this.projectForm, false, '楼盘模块：')) {
                    return;
                }
                // this.clearSysPrice();
                // 将本地的值进行返回
                return this.projectForm;
            }
        }
    }
</script>

<style lang="less" scoped>
    .flex-box{
        display: flex;
        align-items: center
    }
    .project-info{
        padding: 0 10px;
    }
    .project-info-title{
        justify-content: start;
        .title-content{
            flex: 1;
            max-width: 720px;
        }
        .origin-title{
            font-size: 15px;
            font-weight: bold;
            width: 500px;
        }
    }
    .form-left-box{
        flex: 1;
        max-width: 600px;
        &.price-flex-box {
            max-width: 100%;
        }
        .item{
            margin-left: 25px;
            color: #f78f0f;
            font-size: 16px;
            cursor: pointer;
            .focus{
                font-weight: bold;
            }
        }
        .single-ipt{
            width: 180px;
        }
    }
    .info-origin {
        width: 520px;
    }
    .form-item-wrap {
        /deep/ .el-form-item__content{
            display: flex;
        }
    }
</style>