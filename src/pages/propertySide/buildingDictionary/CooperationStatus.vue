<!--
    @name: 合作及带看状态
    @description: 合作及带看状态模块
    @author: 贺伟
    @date: 2019-11-13
-->
<template>
    <div class="coopration-status">
        <div class="info-title">
            <h3 class="title">合作及带看状态</h3>
        </div>
        <!--表单部分开始-->
        <el-form
            ref="cooperationForm"
            :model="cooperationForm"
            :label-width="labelWidth">
            <el-form-item label="合作状态：">
                <el-radio-group
                    v-model="cooperationForm.cooperateStatus">
                    <el-radio
                        v-for="ele in cooperationStatus"
                        :key="ele.id"
                        :label="ele.id">
                        {{ele.text}}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="带看状态：">
                <el-radio-group
                    v-model="cooperationForm.bandStatus">
                    <el-radio
                        v-for="ele in bandStatus"
                        :key="ele.id"
                        :label="ele.id">
                        {{ele.text}}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="近期可带看时间：">
                <el-col :span="8">
                    <el-date-picker
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        v-model="cooperationForm.startTime"
                        style="width: 100%;">
                    </el-date-picker>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="8">
                    <el-date-picker
                        placeholder="选择日期"
                        v-model="cooperationForm.endTime"
                        value-format="yyyy-MM-dd"
                        style="width: 100%;">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="可售房源数量：">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="cooperationForm.onSaleCount">
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'CooperationStatus',
        props: {
            // 合作状态
            cooperationStatus: {
                type: Array,
                default: () => []
            },
            // 带看状态
            bandStatus: {
                type: Array,
                default: () => []
            },
            // 楼盘信息字段
            housesInfo: {
                type: Object,
                default: () => {}
            },
            // 当前选中标签
            labelId: {
                type: String | Number,
                default: ''
            }
        },
        created() {
            this.initFormInfo();
        },
        data() {
            return {
                // 表单label宽度
                labelWidth: '126px',
                // 合作及带看状态表单信息
                cooperationForm: {
                    // 合作状态
                    cooperateStatus: '',
                    // 带看状态
                    bandStatus: '',
                    // 近期带看时间
                    startTime: '',
                    endTime: '',
                    // 可售房源数量
                    onSaleCount: ''
                },
                // 带看状态radio数据
                cooprationSts: []
            }
        },
        watch: {
            housesInfo: {
                // 数据变化时将最新的数据赋值到表单中
                handler: () => this.initFormInfo,
                deep: true
            },
            // 监听标签ID
            labelId(newVal) {
                this.chooseDeault(newVal);
            }
        },
        methods: {
            /**
             * @description: 根据标签判断选中
             * @param {Number} val 标签选中值
             */
            chooseDeault(val) {
                // 获取默认值
                const result = this.getCooperateStatusByLabel(val);
                if (JSON.stringify(result) === '{}') {
                    return false;
                }
                // 合作状态也要实时变化
                this.cooperationForm.cooperateStatus = result.cooperate;
                this.cooperationForm.bandStatus = result.bandStatus;
            },
            // 初始化表单信息
            initFormInfo() {
                // 判断如果当前选中标签如果是注意事项(9)，则走历史逻辑，如果是合作和外联相关，走新的默认赋值方法
                let cooRe = '';
                let isAttention = this.labelId === 9;
                if (isAttention) {
                    cooRe = this.getCooperateStatus(this.housesInfo.cooperateStatus, this.housesInfo.outReachStatus);
                } else {
                    cooRe = this.getCooperateStatusByLabel(this.labelId);
                }
                // 需要处理的对象
                const deals = {
                    // 对事件处理成date 转成毫秒时间戳
                    startTime: this.housesInfo.startTime == '' ? '' : new Date(this.housesInfo.startTime * 1000),
                    endTime: this.housesInfo.endTime === '' ? '' : new Date(this.housesInfo.endTime * 1000),
                    cooperateStatus: isAttention ? cooRe : cooRe.cooperate
                };
                // 赋值
                this.cooperationForm = Object.assign({}, this.cooperationForm, this.housesInfo, deals);
                if (!isAttention) {
                    this.cooperationForm.bandStatus = cooRe.bandStatus;
                }
            },
            /**
             * 获取合作状态 页面中显示的状态是连个状态合成的状态，保存给后端时是真是的状态
             * 合作状态返回1：是  2：否
             * 外联状态返回1：是  0：否
             * @param {String} cooperate 数据库合作状态
             * @param {String} outReach 数据库外联状态
             */
            getCooperateStatus(cooperate, outReach) {
                /**
                 * 合作 外联 合成值 合作状态值
                 * ------------------------
                 * 否	是	外联      3
                 * 否	否	非合作    2
                 * 是	是	合作      1
                 * 是	否	合作      1
                 */
                const match = {
                    1: ['10', '11'],
                    2: ['20'],
                    3: ['21']
                };
                let status = '';
                Object.keys(match).forEach(ele => {
                    if (match[ele].includes(cooperate + '' + outReach)) {
                        status = Number(ele);
                    }
                });
                return status;
            },
            /**
             * @description: 根据标签id来判断合作状态默认值
             * @param {Number} val 标签id
             * 标签          合作状态    带看状态
             * 1-新增合作     1-合作     2-正常带看
             * 2-停止合作     2-非合作    3-暂停带看
             * 15-新增外联    3-外联     2-正常带看
             * 181-停止外联   2-非合作    3-暂停带看
             * @return {Object} cooperate-合作状态，bindStatus-带看状态
             */
            getCooperateStatusByLabel(val) {
                let result = {};
                switch(val) {
                    case 1: 
                        {
                            result.cooperate = 1;
                            result.bandStatus = 2;
                        }
                        break;
                    case 2: 
                    case 181:
                        {
                            result.cooperate = 2;
                            result.bandStatus = 3;
                        }
                        break;
                    case 15: 
                        {
                            result.cooperate = 3;
                            result.bandStatus = 2;
                        }
                        break;
                }
                return result;
            },
            // 获取表单信息
            validForm() {
                // 判断开始时间小于结束时间
                if (this.cooperationForm.startTime && this.cooperationForm.end_time && new Date(this.cooperationForm.startTime) > new Date(this.cooperationForm.endTime)) {
                    this.$message('开始时间不得大于结束时间');
                    return {
                        successful: false,
                        formInfo: ''
                    };
                }
                return {
                    successful: true,
                    formInfo: {
                        cooperate_band: {
                            status: this.cooperationForm.cooperateStatus,
                            band_status: this.cooperationForm.bandStatus,
                            start_time: this.cooperationForm.startTime,
                            end_time: this.cooperationForm.endTime,
                            sale_house_num: this.cooperationForm.onSaleCount
                        }
                    }
                };
            }
        }
    }
</script>

<style lang="less" scoped>
    .coopration-status{
        padding: 0 15px;
        .info-title{
            border-bottom: 1px solid #dcdfe6;
            padding: 5px 0 15px;
            margin-bottom: 15px;
        }
        .line{
            text-align: center;
        }
    }
</style>