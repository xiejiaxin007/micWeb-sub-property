<!--
    @name: 年月日旬组件
    @description: 楼盘年月日旬选择组件
    @author: 贺伟
    @date: 2019-12-21
-->
<template>
    <div class="select-wrap-box">
        <!--输入框 始-->
        <el-input class="select-input"
            v-model="dateValue"
            placeholder="点击选择日期"
            @focus="handleOpenSelect"
            readonly>
        </el-input>
        <!--输入框 止-->
        <!--select弹窗 始-->
        <div class="dialog-wrap-select">
            <el-dialog :append-to-body='true'
                title="日期选择弹窗"
                :visible.sync="selectDialogVisible"
                width="744px"
                center>
                <!--select 始-->
                <div class="select-wrap">
                    <el-form :model="dateForm"
                        :inline="true"
                        ref="dateForm"
                        class="date-form">
                        <el-form-item :rules="[{ required: true, message: '请选择年份', trigger: 'change' }]"
                            prop="year">
                            <el-select class="year select"
                                v-model="dateForm.year"
                                clearable
                                @change='(year) => changeMonth(dateForm.month)'
                                placeholder="年">
                                <el-option v-for="item in yearList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :rules="monthRule"
                            prop="month">
                            <el-select class="month select"
                                v-model="dateForm.month"
                                @change='changeMonth'
                                clearable
                                placeholder="月">
                                <el-option v-for="item in monthList"
                                    :key="item"
                                    :label="String(item).length===1?String('0'+item):String(item)"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="day">
                            <el-select class="day select"
                                v-model="dateForm.day"
                                @change='changeDay'
                                clearable
                                placeholder="日">
                                <el-option v-for="item in dayList"
                                    :key="item"
                                    :label="String(item).length===1?String('0'+item):String(item)"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="tenday">
                            <el-select class="ten-day-period select"
                                v-model="dateForm.tenday"
                                @change='changeTenday'
                                clearable
                                placeholder="旬">
                                <el-option v-for="(item, index) in tendayList"
                                    :key="index"
                                    :label="item.text"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer"
                    class="dialog-footer">
                    <el-button @click="selectDialogVisible = false">取 消</el-button>
                    <el-button type="primary"
                        @click="submitDate">
                        确 定
                    </el-button>
                </div>
            </el-dialog>
        </div>
        <!--select弹窗 止-->
    </div>
</template>

<script>
/**
     * 年月日旬组件 不传值 默认选项为当前年。
     * prop对应的年月日旬绑定请添加.sync 请添加.sync 修饰符,以实现prop双向绑定 也可以直接绑定一包含年月日旬的对象
     * @date 2019.12.23
     * @author 贺伟
     * @prop {string} type 日期选择的类型 会根据传递的类型判断日期的必填校验
     * @prop {string} year 年份
     * @prop {Array} month 月份
     * @prop {Array} day 日
     * @prop {Array} tenday 旬
     * @example 调用示例:
     * <date-picker-tenday v-model="xxx" type="1"
            :year.sync="capacityForm.volume_date_year.field_value"
            :month.sync="capacityForm.volume_date_month.field_value"
            :day.sync="capacityForm.volume_date_day.field_value"
            :tenday.sync="capacityForm.volume_date_ten.field_value">
            </date-picker-tenday>
    */
import { tendayList } from '../config/tabToggleList';
// 获取当前日期年月日
const date = new Date();
const curYear = date.getFullYear();
export default {
    name: 'DatePickerTenday',
    props: {
        // 最小年
        minYear: {
            type: Number,
            default: 1970,
            validator: function(value) {
                return value >= 1970;
            }
        },
        // 最大年
        maxYear: {
            type: Number,
            default: 2050,
            validator: function(value) {
                return value >= 1970;
            }
        },
        // 绑定的日期类型室放量计划时间(1)还是交房时间(2)
        type: {
            type: String,
            default: '1'
        },
        value: {
            type: String,
            default: ''
        },
        // 年
        year: {
            type: [String, Number],
            default: ''
        },
        // 月
        month: {
            type: [String, Number],
            default: ''
        },
        // 日
        day: {
            type: [String, Number],
            default: ''
        },
        // 旬
        tenday: {
            type: [String, Number],
            default: ''
        }
    },
    created() {
        this.initDate();
    },
    computed: {
        // 月份校验规则 type为1 则需要必填月份 否则可以不填
        monthRule() {
            return this.type === '1' ? [{ required: true, message: '请选择月份', trigger: 'change' }] : { required: false };
        },
        // 年份不合格
        propYear() {
            let year = this.year;
            if (year) {
                if (Number(year) < 1970) {
                    this.$message.error('year年份需大于等于1970年');
                    return 1970;
                } else {
                    return year;
                }
            } else {
                return '';
            }
        },
        propMonth() {
            let month = this.month;
            if (month) {
                if (Number(month) < 1 || Number(month) > 12) {
                    this.$message.error('请传入有效的月份1-12月');
                    return '';
                } else {
                    return month;
                }
            } else {
                return '';
            }
        },
        propDay() {
            let day = this.day;
            if (day) {
                if (Number(day) < 1 || Number(day) > 31) {
                    this.$message.error('请传入有效的天数1-31天');
                    return '';
                } else {
                    return day;
                }
            } else {
                return '';
            }
        }
    },
    watch: {
        value(newVal) {
            this.dateValue = newVal;
        }
    },
    data() {
        return {
            // 日期选择框默认值
            dateValue: this.value,
            // 日期弹窗显示状态
            selectDialogVisible: false,
            // 输入框是否显示默认值
            // showDefaultVal: false,
            // 年下拉
            yearList: [],
            // 月下拉
            monthList: [],
            // 日下拉
            dayList: [],
            // 旬下拉
            tendayList,
            // 日期表单数据
            dateForm: {
                year: '',
                month: '',
                day: '',
                tenday: ''
            }
        };
    },
    methods: {
        // 初始化放啊
        initDate() {
            // 选中当前日期
            this.dateForm.year = this.propYear || '';
            this.dateForm.month = this.propMonth || '';
            this.dateForm.day = this.propDay || '';
            this.dateForm.tenday = Number(this.tenday) || '';
            // 显示日期
            this.joinDateStr(this.dateForm);
            this.dateForm.year = this.propYear || curYear;
            // 初始化下拉
            this.yearList = this.createYearList();
            this.monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            this.dayList = this.createDays(this.propMonth);
        },
        // 生成年下拉
        createYearList() {
            let min = Number(this.minYear) < 1970 ? 1970 : Number(this.minYear);
            let max = Number(this.maxYear) < 1970 ? 2050 : Number(this.maxYear);
            let years = [];
            for (let i = min; i <= max; i++) {
                years.push(i);
            }
            return years;
        },
        /**
         * 获取当前选中月总天数
         * @param {String} month 月份
         */
        getCurMonthDays(month) {
            if (!month) {
                return false;
            }
            // 获取下一个月前一天的时间来获取本月总天数
            const year = this.dateForm.year.toString();
            const totalDays = new Date(year, month.toString()).getTime() - 24 * 60 * 60 * 1000;
            // 将天返回
            return new Date(totalDays).getDate();
        },
        // 生成日下拉
        createDays(month) {
            let days = [];
            const totalDays = this.getCurMonthDays(month);
            if (!totalDays) {
                return [];
            }
            for (let i = 1; i <= totalDays; i++) {
                let today = i;
                days.push(today);
            }
            return days;
        },
        /**
         * 月份下拉改变处理
         * @param {String} value 选中的值
         */
        changeMonth(value) {
            this.dayList = this.createDays(value);
            this.dateForm.day = '';
        },
        /**
         * 日下拉改变处理
         * @param {String} value 选中的值
         */
        changeDay(value) {
            if (value === '') {
                return;
            }
            if (this.dateForm.month === '') {
                this.$message.warning('请先选择月份！');
                this.dateForm.day = '';
                return;
            }
            this.$refs.dateForm.clearValidate('tenday');
            this.dateForm.tenday = '';
        },
        /**
         * 旬下拉改变处理 清空日
         * @param {String} value 选中的值
         */
        changeTenday(value) {
            if (value === '') {
                return;
            }
            if (this.dateForm.month === '') {
                this.$message.warning('请先选择月份！');
                this.dateForm.tenday = '';
                return;
            }
            this.$refs.dateForm.clearValidate('day');
            this.dateForm.day = '';
        },
        // 打开select弹框
        handleOpenSelect() {
            // 每次打开日期弹窗 重新读取值
            this.dateForm.year = this.propYear || curYear;
            this.dateForm.month = this.propMonth || '';
            this.dateForm.day = this.propDay || '';
            this.dateForm.tenday = Number(this.tenday) || '';
            // 如果存在旬则清空日期 二者不同时显示
            if (this.dateForm.tenday) {
                this.dateForm.day = '';
            }
            this.selectDialogVisible = true;
        },
        /**
         * 拼接年月日展示字符串
         * @param {Object} item 年月日旬对象
         */
        joinDateStr(item) {
            const { year, month, day, tenday } = item;
            const yearText = year && `${year}年`;
            const monthText = month && `${month}月`;
            const dayText = Number(day) && `${day}日`;
            const tendayItem = this.tendayList.find(ele => ele.value == tenday);
            const tendayText = tenday && tendayItem && tendayItem.text;
            if (year) {
                this.dateValue = yearText + monthText + (dayText || tendayText);
                this.$emit('input', this.dateValue);
            }
        },
        // 点击确定按钮事件处理
        submitDate() {
            // this.showDefaultVal = true;
            this.$refs.dateForm.validate(valid => {
                if (valid) {
                    // 拼接年月日旬展示
                    this.joinDateStr(this.dateForm);
                    // 判断是否有旬  如果有则计算对应的日期并赋值
                    if (this.dateForm.tenday) {
                        if (this.dateForm.tenday !== 3) {
                            this.dateForm.day = this.dateForm.tenday * 10;
                        } else {
                            this.dateForm.day = this.getCurMonthDays(this.dateForm.month) || '';
                        }
                    }
                    this.$emit('input', this.dateValue);
                    // 更新父组件对应值
                    this.$emit('update:year', this.dateForm.year);
                    this.$emit('update:month', this.dateForm.month);
                    this.$emit('update:day', this.dateForm.day);
                    this.$emit('update:tenday', this.dateForm.tenday);
                    // 触发change方法 父组件可进行相关处理
                    this.$emit('change', this.dateForm);
                    // 关闭弹窗
                    this.selectDialogVisible = false;
                } else {
                    // this.$message.error('请检查日期必填项');
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.select {
    width: 160px;
}
</style>