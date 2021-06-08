<!--
 * @author: kangxue
 * @Date: 2019-07-17 17:55:48
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-22 14:43:23
 * @description: 年月日三级联动，value必须是年月日的格式，可以没有月和日
-->
<template>
    <div>
        <el-col :span="5">
            <el-select
                v-model="yearVal"
                placeholder="选择年"
                clearable
                @change="getyearVal">
                <el-option
                    v-for="(item, index) in yearOptions"
                    :key="index"
                    :value="item"
                    :label="item">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="1">
            年
        </el-col>
        <el-col :span="5">
            <el-select
                v-model="monthVal"
                placeholder="选择月"
                clearable
                @change="getMonthVal"
                @focus="focusMonth">
                <el-option
                    v-for="(item, index) in monthOptions"
                    :key="index"
                    :value="item"
                    :label="item">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="1">
            月
        </el-col>
        <el-col :span="5">
            <el-select
                v-model="dayVal"
                clearable
                placeholder="选择日"
                @change="getDayVal"
                @focus="focusDay">
                <el-option
                    v-for="(item, index) in dayOptions"
                    :key="index"
                    :value="item"
                    :label="item">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="1">
            日
        </el-col>
    </div>
</template>

<script>
import { getCurMonthDays } from '../utils/index';
export default {
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // 页面的年月日的值
            currentPropDate: '',
            // 年的val
            yearVal: '',
            yearOptions: [],
            // 月的val
            monthVal: '',
            monthOptions: [],
            // 日的val
            dayVal: '',
            dayOptions: [],
        }
    },
    mounted() {
        // 包含年，或者有月，日的数据
        let reg = /^\d{4}年(([1-9]|10|11|12)月)?(([1-9]|[1-2][0-9]|3[0-1])日)?$/;
        if(this.value && !reg.test(this.value)) {
            return false;
        }
        // 填充年的数据
        this.pushYearInfo();
        this.currentPropDate = this.value;
        this.checkDateVal();
    },
    methods: {
        // 变换传入的年月日格式
        checkDateVal() {
            if (this.currentPropDate === '') {
                return;
            }
            let dateStr = this.currentPropDate;
            // 将年月日时间转换成可以解析的时间
            dateStr = dateStr.replace('年', '-');
            dateStr = dateStr.replace('月', '-');
            dateStr = dateStr.replace('日', '');
            let date =  new Date(dateStr);
            let yearVal = date.getFullYear();
            let monthVal = date.getMonth() + 1;
            let dayVal = date.getDate();
            // 只有的年的时候 只赋值年的数据
            if (!this.currentPropDate.includes('月') && !this.currentPropDate.includes('日')) {
                this.yearVal = yearVal;
            } else if (!this.currentPropDate.includes('日')) {
                this.yearVal = yearVal;
                this.monthVal = monthVal;
            } else {
                // 给年月日赋值
                this.yearVal = yearVal;
                this.monthVal = monthVal;
                this.dayVal = dayVal;
            }
        },
        /**
         * 当年发val发生改变的时候
         * @param {srting} value 当前选中的年份
         */
        getyearVal(value) {
            if (value) {
                this.dayVal = "";
                this.currentPropDate = this.yearVal + '年' + (this.monthVal !== '' ? this.monthVal + '月' : '') + (this.dayVal !== '' ? this.dayVal + '日' : '');
            } else {
                // 清空月的数据
                this.monthOptions = [];
                this.monthVal = '';
                // 清空日的数据
                this.dayOptions = [];
                this.dayVal = '';
                this.currentPropDate = '';
            }
            this.$emit('getTime', this.currentPropDate);
        },
        /**
         * 当月获取焦点时候
         */
        focusMonth() {
            if (this.yearVal !== '') {
                // 调用月的数据
                this.monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            }
        },
        /**
         * 当月val发生改变到时候
         * @param {srting} value 当前选中的年份
         */
        getMonthVal(value) {
            if (value) {
                this.dayVal = "";
                // 给年月日赋值
                this.currentPropDate = this.yearVal + '年' + this.monthVal + '月';
            } else {
                // 清空日的数据
                this.dayOptions = [];
                this.dayVal = '';
                this.currentPropDate = this.yearVal + '年';
            }
            this.$emit('getTime', this.currentPropDate);
        },
        /**
         * 当日获取焦点时候
         */
        focusDay() {
            if (this.monthVal !== '') {
                // 调用天的数据
                this.pushDayInfo(getCurMonthDays(this.monthVal, this.yearVal));
            }
        },
        /**
         * 当年日val发生改变到时候
         * @param {srting} value 当前选中的年份
         */
        getDayVal(value) {
            if (value) {
                // 调用天的数据
                this.pushDayInfo(getCurMonthDays(this.monthVal, this.yearVal));
                // 给年月日赋值
                this.currentPropDate = this.yearVal + '年' + this.monthVal + '月' + this.dayVal + '日';
            } else {
                this.currentPropDate = this.yearVal + '年' + this.monthVal + '月';
            }
            this.$emit('getTime', this.currentPropDate);
        },
        // 填充年的数据
        pushYearInfo() {
            this.yearOptions = [];
            let currentYear = new Date().getFullYear();
            for(let i = 1990; i <= currentYear; i++) {
                this.yearOptions.push(i);
            }
        },
        // 填充日的数据
        pushDayInfo(dayNum) {
            this.dayOptions = [];
            for(let i = 1; i <= dayNum; i++) {
                this.dayOptions.push(i);
            }
        }
    }
}
</script>

<style>

</style>