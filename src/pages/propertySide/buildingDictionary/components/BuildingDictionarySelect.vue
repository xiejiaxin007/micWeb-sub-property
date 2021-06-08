<template>
  <div class="select-wrap-box">
    <!--输入框 始-->
    <el-input
      :title="input"
      class="select-input"
      v-model="input"
      placeholder="点击选择日期"
      @focus="handleOpenSelect"
      readonly
    >
    </el-input>
    <!--输入框 止-->
    <!--select弹窗 始-->
    <div class="dialog-wrap-select">
      <el-dialog
        :append-to-body='true'
        title="日期选择弹窗"
        :visible.sync="selectDialogVisible"
        width="50%"
        center
      >
        <!--select 始-->
        <div class="select-wrap">
          <el-select
            class="year select"
            :class="{'error':hasErrorYear}"
            v-model="currentDate.year"
            @change='judgeTime'
            clearable
            placeholder="年">
            <el-option
              v-for="item in years"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select
            class="month select"
            :class="{'error':hasErrorMonth}"
            v-model="currentDate.month"
            @change='judgeTime'
            clearable
            placeholder="月">
            <el-option
              v-for="item in months"
              :key="item"
              :label="String(item).length===1?String('0'+item):String(item)"
              :value="item">
            </el-option>
          </el-select>
          <el-select
            class="day select"
            :class="{'error':hasErrorDay}"
            v-model="currentDate.day"
            @change='judgeDay'
            clearable
            placeholder="日">
            <el-option
              v-for="item in days"
              :key="item"
              :label="String(item).length===1?String('0'+item):String(item)"
              :value="item">
            </el-option>
          </el-select>
          <el-select
            class="ten-day-period select"
            :class="{'error':hasErrorPeriod}"
            v-model="currentDate.tenDayPeriod"
            @change='judgePeriod'
            clearable
            placeholder="旬">
            <el-option
              v-for="(item,index) in tenDayPeriods"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <!--select 止-->
        <p :class="{'hint hint-show':hintIsShow,'hint':!hintIsShow}" ref="hint"><label class="hint-star">*</label>{{hint}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="selectDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitDate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!--select弹窗 止-->
  </div>
</template>
<script>
import { commonFun } from '@/assets/js/utils/utils'
export default {
  name: 'BuildingDictionarySelect',
  props: {
    sourceDate: {
      type: Object,
      default: function () {
        return {}
      }
    },
    value: {
        type: String,
        default: ''
    },
    // 是否需要带入默认值 如果初始化需要输入框为空又需要弹窗展示默认值，请传false
    needDefault: {
        type: Boolean,
        default: true
    }
  },
  data () {
    return {
      input: this.value, // select的input框默认无值
      hint: '', // 默认提示信息
      hintIsShow: false, // 默认提示信息隐藏
      selectDialogVisible: false, // select弹窗默认隐藏
      // 初始化年月日为空
      currentDate: {
        year: '',
        month: '',
        day: '',
        tenDayPeriod: ''
      },
      maxYear: 2050, // option最大年份
      minYear: 1970, // option最小年份
      // 所选择月份最大天数
      normalMaxDays: {
        type: [Number]
      },
      // 年数组
      years: [],
      // 月数组
      months: [],
      // 旬数组
      tenDayPeriods: [],
      // 日数组
      days: [],
      // 必填年份红框提示样式
      hasErrorYear: false,
      // 必填月份红框提示样式
      hasErrorMonth: false,
      // 必填日红框提示样式
      hasErrorDay: false,
      // 必填旬红框提示样式
      hasErrorPeriod: false
    }
  },
  methods: {
    // 后端年月日字符串处理
    Trim (str) {
      str = str || ''
      str = str + ''
      str = commonFun.trim(str) // 去掉空格
      str = str.replace(/\b(0+)/gi, '') // 去掉前面0
      if (str) {
        str = parseInt(str)
      }
      return str
    },
    objectToTime (timeobject) {
      let year = timeobject.year ? this.Trim(timeobject.year) : ''
      let month = timeobject.month ? this.Trim(timeobject.month) : ''
      let day = timeobject.day ? this.Trim(timeobject.day) : ''
      let Period = timeobject.Period ? this.Trim(timeobject.Period) : ''
      switch (Period) {
        case 1:
          Period = '上旬'
          break
        case 2:
          Period = '中旬'
          break
        case 3:
          Period = '下旬'
          break
        default:
          Period = ''
      }
      // 初始化赋值select框
      this.currentDate.year = year
      this.currentDate.month = month
      this.currentDate.day = day
      this.currentDate.tenDayPeriod = Period
      // 取得数据后判断时间格式
      this.judgeTime()
      // 初始化赋值input框
      let dateInit = '' // input框值
      if (year) {
        dateInit += year + '年'
      }
      if (month) {
        dateInit += month + '月'
      }
      if (day) {
        dateInit += day + '日'
      }
      if (Period) {
        dateInit += Period
      }
      this.input = dateInit
    },
    // 打开select弹框
    handleOpenSelect () {
      this.selectDialogVisible = true
    },
    // 点击确定处理
    submitDate () {
      let year = this.currentDate.year || ''
      let month = this.currentDate.month || ''
      let day = this.currentDate.day || ''
      let Period = this.currentDate.tenDayPeriod || '' // 上中下旬取值
      if (year) {
        let flag = false // 是否向父组件传值
        if (this.sourceDate.type === 1) { // 1代表放量计划
          if (month) {
            if (day || Period) {
              if (year && month && day && !Period) {
                flag = true
                this.input = year + '年' + month + '月' + day + '日'
                // 关闭弹窗
                this.selectDialogVisible = false
              } else if (year && month && Period && !day) {
                flag = true
                this.input = year + '年' + month + '月' + Period
                // 关闭弹窗
                this.selectDialogVisible = false
              } else {
                flag = false
                this.hintIsShow = true
                this.hint = '格式输入错误，请务必保证结构为N年N月N日或N年N月N旬结构'
              }
            } else {
              this.hasErrorDay = true
              this.hasErrorPeriod = true
              this.hintIsShow = true
              this.hint = '日旬必选一项'
            }
          } else {
            this.hasErrorMonth = true
            this.hintIsShow = true
            this.hint = '请选择月份'
          }
        } else if (this.sourceDate.type === 2) { // 2代表交房时间
          if (year && month && day && !Period) {
            flag = true
            this.input = year + '年' + month + '月' + day + '日'
            // 关闭弹窗
            this.selectDialogVisible = false
          } else if (year && month && Period && !day) {
            flag = true
            this.input = year + '年' + month + '月' + Period
            // 关闭弹窗
            this.selectDialogVisible = false
          } else if (year && month && !day && !Period) {
            flag = true
            this.input = year + '年' + month + '月'
            // 关闭弹窗
            this.selectDialogVisible = false
          } else if (year) {
            flag = true
            this.input = year + '年'
            // 关闭弹窗
            this.selectDialogVisible = false
          } else {
            flag = false
            this.hintIsShow = true
            this.hint = '格式输入错误，年份必填，日旬二者选一'
          }
        } else {
          console.log('未传入放量计划或交房时间类型：' + this.sourceDate.type)
        }
        if (flag) {
          // 子组件向父组件传递日期
          switch (Period) {
            case '上旬':
              Period = 1
              break
            case '中旬':
              Period = 2
              break
            case '下旬':
              Period = 3
              break
            default:
              Period = ''
          }
          // 定义回传父组件对象
          let getCallbackDate = {}
          this.$set(getCallbackDate, 'year', this.Trim(year))
          this.$set(getCallbackDate, 'month', this.Trim(month))
          this.$set(getCallbackDate, 'day', this.Trim(day))
          this.$set(getCallbackDate, 'Period', this.Trim(Period))
          this.$set(getCallbackDate, 'index', this.sourceDate.index)
          this.$set(getCallbackDate, 'type', this.sourceDate.type)
          this.$emit('getCallbackDate', getCallbackDate)
          this.$emit('input', this.input)
        }
      } else {
        this.hasErrorYear = true
        this.hintIsShow = true
        this.hint = '请选择年份'
      }
    },
    // 填入年份数组
    getFullYears () {
      for (let i = this.minYear; i <= this.maxYear; i++) {
        this.years.push(i)
      }
    },
    // 填入日数组
    getFullDays () {
      this.days = []
      for (let i = 1; i <= this.normalMaxDays; i++) {
        this.days.push(i)
      }
    },
    // 初始赋值函数判断
    judgeTime () {
      this.normalMaxDays = '' // 重置最大天数
      this.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      if (this.currentDate.year) {
        this.hasErrorYear = false // 判断若有年份红框消失
        this.hintIsShow = false
        this.hint = ''
        this.currentDate.month = this.Trim(this.currentDate.month)
        if (this.currentDate.month) {
          this.hasErrorMonth = false // 判断若有月份红框消失
          this.hintIsShow = false
          this.hint = ''
          this.tenDayPeriods = ['上旬', '中旬', '下旬']
          if ([4, 6, 9, 11].indexOf(this.currentDate.month) !== -1) {
            this.normalMaxDays = 30 // 小月30天
            if (this.currentDate.day && this.currentDate.day === 31) {
              this.currentDate.day = ''
            }
          } else if (this.currentDate.month === 2) {
            if (this.currentDate.year) {
              if (
                (this.currentDate.year % 4 === 0 &&
                  this.currentDate.year % 100 !== 0) ||
                this.currentDate.year % 400 === 0
              ) {
                this.normalMaxDays = 29 // 闰年2月29天
              } else {
                this.normalMaxDays = 28 // 平年2月28天
              }
            } else {
              this.normalMaxDays = 28// 平年2月28天
            }
          } else {
            this.normalMaxDays = 31// 大月31天
          }
          // 新增放量计划判断 始
          if (this.currentDate.day || this.currentDate.tenDayPeriod) {
            this.hasErrorDay = false // 判断若有日红框消失
            this.hasErrorPeriod = false // 判断若有旬红框消失
            this.hintIsShow = false
            this.hint = ''
          }
          // 新增放量计划判断 止
        } else {
          this.days = []
          this.tenDayPeriods = []
          if (this.currentDate.day) {
            if (this.currentDate.day.toString().length === 1) {
              this.currentDate.day = '0' + this.currentDate.day
            }
          }
        }
      } else {
        this.days = []
        if (this.currentDate.month) {
          if (this.currentDate.month.toString().length === 1) {
            this.currentDate.month = '0' + this.currentDate.month
          }
          this.hasErrorMonth = false // 判断若有月份红框消失
          this.tenDayPeriods = ['上旬', '中旬', '下旬']
          if (this.currentDate.day) {
            if (this.currentDate.day.toString().length === 1) {
              this.currentDate.day = '0' + this.currentDate.day
            }
          }
        } else {
          this.days = []
          this.tenDayPeriods = []
          if (this.currentDate.day) {
            if (this.currentDate.day.toString().length === 1) {
              this.currentDate.day = '0' + this.currentDate.day
            }
          }
        }
      }
    },
    // 旬值改变逻辑
    judgePeriod () {
      this.judgeTime()
      if (this.currentDate.tenDayPeriod) {
        this.currentDate.day = ''
      }
    },
    // 日值改变逻辑
    judgeDay () {
      this.judgeTime()
      if (this.currentDate.day) {
        this.currentDate.tenDayPeriod = ''
      }
    }
  },
  watch: {
    // 监听父组件传递过来的日期并赋值currentDate
    sourceDate: {
      handler: function (val, oldval) {
        this.objectToTime(this.sourceDate)
      },
      deep: true
    },
    // 监听当月最大天数，若改变，重新遍历days[]
    normalMaxDays () {
      this.getFullDays()
      if (this.normalMaxDays) {
        if (this.currentDate.day > this.normalMaxDays) {
          this.currentDate.day = ''
        }
      }
    },
    // 监听prop value值赋值给本地的表单
    value(val, oldval) {
        this.input = val;
    }
  },
  mounted () {
    // 页面初加载年份数组添值
    this.getFullYears()
    this.objectToTime(this.sourceDate);
    // 如果不需要显示默认值初次进入置为空
    setTimeout(() => {
        if (!this.needDefault) {
            this.input = '';
        }
    });
  }
}
</script>
<!--样式-->
<style lang="less" scoped>
  .el-dialog__wrapper {
    .el-select{
      width: 23%;
      margin-left: 8px;
      /deep/ .el-input__validateIcon{
          display: none;
      }
    }
    .error {
      /deep/ .el-input__inner {
        border: 1px solid #f1403c;
        border-radius: 4px;
      }
    }
    /deep/ .el-dialog--center{
      .el-dialog__body{
        padding-bottom: 0;
      }
    }
    .hint{
      height: 30px;
      line-height: 30px;
      width: 100%;
      text-align: left;
      color: #ff0000;
      margin: 0 auto;
      font-size: 8px;
      padding-left: 10px;
      vertical-align: middle;
      visibility: hidden;
      .hint-star{
        position: relative;
        top:3px;
      }
    }
    .hint-show{
      visibility: visible;
    }
  }
</style>
