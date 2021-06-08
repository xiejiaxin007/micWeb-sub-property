<template>
    <div class="crawl-wrap">
        <!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-d-arrow-right"
            class="bread-nav"
        >
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>中指数据数据抓取</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main-wrap">
            <!--form表单-->
            <el-form
                :model="crawlForm"
                ref="crawlForm"
                :rules="rules"
                class="crawl-form"
            >
                <h2 class="headline">抓取内容</h2>
                <el-form-item
                    prop="bandChecked"
                    class="one-level"
                >
                    <el-checkbox v-model="crawlForm.bandChecked">土地信息</el-checkbox>
                </el-form-item>
                <el-form-item
                    v-show="crawlForm.bandChecked"
                    label-width="66px"
                    label="城市"
                    prop="bandCity"
                    class="two-level"
                >
                    <el-select
                        v-model="crawlForm.bandCity"
                        multiple
                        clearable
                        @change="cityChange($event,'bandSlt')"
                        ref="bandSlt"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in bandCityOps"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="dealChecked"
                    class="one-level"
                >
                    <el-checkbox v-model="crawlForm.dealChecked">成交数据</el-checkbox>
                </el-form-item>
                <el-form-item
                    v-show="crawlForm.dealChecked"
                    label-width="66px"
                    label="城市"
                    prop="dealCity"
                    class="two-level"
                >
                    <el-select
                        v-model="crawlForm.dealCity"
                        multiple
                        clearable
                        @change="cityChange($event,'dealSlt')"
                        ref="dealSlt"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in dealCityOps"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <div
                    v-if="showRequireInfo"
                    class="msg-require"
                >{{requireCont}}</div>
                <div :class="`code-login-title ${isLogin !== '1' ? 'add-bottom' : ''}`">
                    <h2 class="headline">登录</h2>
                    <span class="title">登录中指APP，进行扫码登录</span>
                    <span
                        @click="getCode"
                        class="btn btn-get-code">获取登录二维码</span>
                </div>
                <div
                    v-if="isLogin === '1'"
                    class="login-success-box">
                    <span class="iconfont iconcode_success"></span>
                    <div class="title">登录成功</div>
                </div>
            </el-form>
            <!--抓取记录-->
            <div class="crawl-record">
                <p
                    class="record-item"
                    v-for="(item, index) in reverseLogMsg"
                    :key="index"
                >
                    <span class="record-time">{{item.create_datetime}}：</span>
                    <span class="record-detail">{{item.content}}</span>
                </p>
            </div>
        </div>
        <el-dialog
            title="扫码登录"
            :visible.sync="codeDialogFlag"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="closeCodeDialog"
            custom-class="info-dialog"
            width="30%"
            center>
            <div class="code-box">
                <div
                    v-loading="imgLoading"
                    class="code-wrapper">
                    <img
                        :src="codeImgUrl"
                        @error="error($event)"
                        alt="二维码图片">
                    <div
                        v-show="isValid === '0'"
                        class="mask">
                        <div class="mask-tip-box">
                            <div class="tip">二维码无效或超时</div>
                            <div
                                @click="refreshCode"
                                class="btn btn-fresh">刷新</div>
                        </div>
                    </div>
                </div>
                <div :class="`title ${isScan === '1' ? 'red-title' : ''}`">{{codeTitle}}</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from './api/houseManageApi.js';
    import dataStorage from '@/assets/js/utils/dataStorage';
    import errorImg from "@/assets/images/img-small-default.png";
    export default {
        name: 'LandCrawl',
        data() {
            return {
                // 二维码是否失效标识，1--未失效，0--失效
                isValid: '1',
                // 是否登录标识，1--登录成功，0--未登录
                isLogin: '0',
                // 是否扫码哦标识，1--扫码成功，0--未扫码
                isScan: '0',
                // 二维码弹窗提示文案
                codeTitle: '登录中指APP，进行扫码登录',
                // 二维码请求loading
                imgLoading: false,
                // 获取二维码弹窗
                codeDialogFlag: false,
                // 登录二维码图片路径
                codeImgUrl: '',
                crawlForm: {
                    // 表单form对象
                    bandChecked: true, // 土地信息checkbox
                    dealChecked: true, // 成交数据checkbox
                    bandCity: [], // 土地信息城市选择值
                    dealCity: [], // 成交数据城市选择值
                    account: '', // 账号
                    psw: '' // 密码
                },
                requireCont: '上述信息为二选一', // 土地和成交城市提示信息
                rules: {
                    // 校验规则
                    bandCity: [{ type: 'array', required: true, message: '此项为必填', trigger: 'change' }],
                    dealCity: [{ type: 'array', required: true, message: '此项为必填', trigger: 'change' }],
                    account: [{ required: true, message: '此项为必填', trigger: 'blur' }],
                    psw: [{ required: true, message: '此项为必填', trigger: 'blur' }]
                },
                bandCityOps: [], // 土地城市数据
                dealCityOps: [], // 成交信息城市数据
                logMsg: [] // 日志信息
            };
        },
        computed: {
            // 是否展示土地和成交数据二选一提示
            showRequireInfo() {
                return !(this.crawlForm.bandChecked || this.crawlForm.dealChecked);
            },
            reverseLogMsg() {
                return this.logMsg.slice().reverse();
            }
        },
        watch: {
            'crawlForm.bandChecked': function(val, old) {
                if (!val) {
                    this.getCityData(1); // 重新选中时展示全部
                }
            },
            'crawlForm.dealChecked': function(val, old) {
                if (!val) {
                    this.getCityData(2); // 重新选中时展示全部
                }
            }
        },
        created() {
            this.queryErrCount = 0; // 初始化轮询错误数量
            this.logId = 0; // 初始化logid
            this.havePoll = false; // 是否已经开始轮询
            this.bandCityStg = null; // 土地城市存储
            this.dealCityStg = null; // 交易信息城市存储
            this.getCityData(1); // 初始化获取土地城市信息
            this.getCityData(2); // 初始化获取交易信息城市信息
            this.getLogOnce(0); // 初始化获取最新的爬取日志
        },
        methods: {
            // 刷新二维码
            refreshCode() {
                // 恢复弹窗标识
                this.isValid = '1';
                this.isLogin = '0';
                this.isScan = '0';
                this.codeTitle = '登录中指APP，进行扫码登录';
                this.getCodeUrl();
            },
            /**
             * 关闭二维码弹窗回调
             * @param {Function} done 关闭函数
             */
            closeCodeDialog(done) {
                // 恢复弹窗标识
                this.isValid = '1';
                this.isLogin = '0';
                this.isScan = '0';
                this.codeTitle = '登录中指APP，进行扫码登录';
                // 关闭循环
                if (this.loginStatusTimer) {
                    clearInterval(this.loginStatusTimer);
                }
                done();
            },
            /**
             * 图片加载失败
             * @param {Object} el dom节点对象
             */
            error (el) {
                el.target.src = errorImg;
                el.target.error = null;
            },
            // 打开获取二维码弹窗
            getCode() {
                // 表单校验
                this.$refs['crawlForm'].validate((valid, obj) => {
                    if (this.showRequireInfo) {
                        this.$message({
                            message: '抓取内容至少选择一项！',
                            type: 'warning'
                        });
                        return false;
                    }
                    if (valid) {
                        // 请求二维码弹窗
                        this.refreshCode();
                        this.codeDialogFlag = true;
                    } else {
                        this.$message({
                            message: '请检查必填项是否填写完毕',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            },
            // 获取二维码请求方法
            async getCodeUrl() {
                try {
                    // 打开loading
                    this.imgLoading = true;
                    const { bandCity, dealCity } = this.crawlForm;
                    const params = {
                        land_city_ids: this.crawlForm.bandChecked ? bandCity : [],
                        deal_city_ids: this.crawlForm.dealChecked ? dealCity : []
                    }
                    const {
                        data: { code, data }
                    } = await api.getQrCode(params);
                    if (code === 0) {
                        this.codeImgUrl = data ? data.qrCodeUrl : '';
                        this.crawlKey = data ? data.key : '';
                        // 开始轮询
                        if (this.loginStatusTimer) {
                            clearInterval(this.loginStatusTimer);
                        }
                        if (this.codeImgUrl) {
                            // key不为空的时候开始轮询请求登录成功状态接口
                            this.loginStatusTimer = setInterval(this.doPoll, 2000);
                        }
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'error'
                        });
                    }
                    // 关闭loading
                    this.imgLoading = false;
                } catch (error) {
                    console.log(error);
                    // 关闭loading
                    this.imgLoading = false;
                }
            },
            // 轮询获取登录状态
            async doPoll() {
                try {
                    const params = {
                        key: this.crawlKey
                    };
                    const {
                        data: { code, data }
                    } = await api.getLoginStatus(params);
                    if (code === 0) {
                        // 赋值用于渲染页面
                        this.isValid = data ? data.isValid : '';
                        this.isLogin = data ? data.isConfirmLogin : '';
                        this.isScan = data ? data.isScanSuccess : '';
                        if (data.isScanSuccess === '1' && data.isConfirmLogin === '0' && data.isValid === '1') {
                            // 已经扫码了
                            this.codeTitle = '请在中指APP上完成登录确认';
                        } else if (data.isValid === '0') {
                            // 失效
                            clearInterval(this.loginStatusTimer);
                            // 失效标识
                            this.isValid = '0';
                            this.codeTitle = '登录中指APP，进行扫码登录';
                        } else if (data.isScanSuccess === '1' && data.isConfirmLogin === '1') {
                            // 登录成功
                            clearInterval(this.loginStatusTimer);
                            // 关闭二维码弹窗
                            this.codeDialogFlag = false;
                            // 请求日志
                            setTimeout(() => {
                                this.logId = 0;
                                this.getLogOnce(this.logId); // 每次提交后主动查询一次日志
                            }, 5000);
                            // 提交成功后开始轮询抓取日志 当logid大于0表示已经有轮询在跑，不再重复轮询
                            if (!this.havePoll) {
                                this.queryCrawlLog();
                            }
                        }
                    } else if (code === 1) {
                        // code=1表示上一次抓取任务还没有完成，给出提示
                        this.catchMethod({
                            tip: '上一次抓取任务未完成，请稍后再试！',
                            type: 'warning'
                        });
                    } else {
                        this.catchMethod({
                            tip: '登录失败，请稍后再试！',
                            type: 'error'
                        });
                    }
                } catch (error) {
                    console.log(error);
                    // 异常处理一下，减少重复代码
                    this.catchMethod({
                        tip: '登录失败，请稍后再试！',
                        type: 'error'
                    });
                }
            },
            // 异常处理
            catchMethod(errTip) {
                // 变量重置
                this.isValid = '1';
                this.isLogin = '0';
                this.isScan = '0';
                this.codeTitle = '登录中指APP，进行扫码登录';
                this.$message({
                    message: errTip.tip,
                    type: errTip.type
                });
                // 关闭弹窗
                this.codeDialogFlag = false;
                if (this.loginStatusTimer) {
                    clearInterval(this.loginStatusTimer);
                }
            },
            // 获取土地城市信息和成交数据城市信息
            getCityData(type) {
                const typeRelation = {
                    // 定义类型和数据对应关系 数组第一项未this上城市信息key 第二项为本地存储key
                    '1': ['bandCityOps', 'bandCityStg'],
                    '2': ['dealCityOps', 'dealCityStg']
                };
                // 如果本地存在以及你个存储的值且为超过过期时间则用本地缓存 否则重新请求数据并保存
                if (dataStorage.getStorage([typeRelation[type][1]]) && dataStorage.isFresh([typeRelation[type][1]])) {
                    const cacheData = dataStorage.getStorage([typeRelation[type][1]]).oData; // 获取缓存信息
                    this[typeRelation[type][0]] = cacheData;
                    const newData = cacheData.slice();
                    newData.shift(); // 删除第一项为全部的值
                    this.setCityDefaultData(newData, type); // 设置选中默认值
                } else {
                    const _this = this;
                    // 获取城市信息
                    api.getLandCity(type)
                        .then(({ data }) => {
                            if (data.code === 0) {
                                let datas = data.data;
                                this.setCityDefaultData(datas, type);
                                if (datas[1].id !== 0) {
                                    // 如果为0则表示为全部 没有就推进去
                                    datas.unshift({ id: 0, text: '全部' });
                                }
                                _this[typeRelation[type][1]] = dataStorage.setStorage([typeRelation[type][1]], datas); // 存进本地
                                _this[typeRelation[type][0]] = datas;
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            },
            // 赋值选中城市信息
            setCityDefaultData(oriData, type) {
                if (type === 1) {
                    this.crawlForm.bandCity = oriData.map(ele => ele.id);
                } else if (type === 2) {
                    this.crawlForm.dealCity = oriData.map(ele => ele.id);
                }
            },
            // change筛选全部
            cityChange(vals, ref) {
                const relation = {
                    // 定义ref和对应数据的对应关系
                    bandSlt: ['bandCityOps', 'bandCity'],
                    dealSlt: ['dealCityOps', 'dealCity']
                };
                if (vals[vals.length - 1] === 0) {
                    // 如果选择的是全部则将其余全部数据赋值
                    const options = this[relation[ref][0]].map(ele => {
                        if (ele.id !== 0) {
                            return ele.id;
                        }
                    });
                    this.crawlForm[relation[ref][1]] = options;
                    this.$refs[ref].blur();
                }
            },
            // form 表单提交
            onSubmit(formName) {
                this.$refs[formName].validate((valid, obj) => {
                    if (this.showRequireInfo) {
                        this.$message({
                            message: '抓取内容至少选择一项！',
                            type: 'warning'
                        });
                        return false;
                    }
                    if (valid) {
                        // 更换logid 取当前最大值
                        this.postDataAndCrawlInfo(); // 验证通过进行登录
                    } else {
                        this.$message({
                            message: '请检查必填项是否填写完毕',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            },
            // 提交表单数据开始抓取
            postDataAndCrawlInfo() {
                const _this = this;
                const { bandCity, dealCity, account, psw } = this.crawlForm;
                const options = {
                    land_city_ids: _this.crawlForm.bandChecked ? bandCity : [],
                    deal_city_ids: _this.crawlForm.dealChecked ? dealCity : [],
                    username: account,
                    password: psw
                };
                api.loginCreis(options)
                    .then(({ data }) => {
                        // 无论成功失败都需要调取日志接口
                        setTimeout(() => {
                            this.logId = 0;
                            this.getLogOnce(this.logId); // 每次提交后主动查询一次日志
                        }, 5000);
                        // 提交成功后开始轮询抓取日志 当logid大于0表示已经有轮询在跑，不再重复轮询
                        if (!_this.havePoll) {
                            _this.queryCrawlLog();
                        }
                        _this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 轮询抓取日志
            queryCrawlLog() {
                this.havePoll = true;
                setTimeout(() => {
                    if (this.queryErrCount < 10) {
                        const _this = this;
                        api.getCrawlLog(this.logId)
                            .then(({ data }) => {
                                if (data.code === 0) {
                                    // 如果状态为0 则需要覆盖之前已有数据
                                    // 执行操作
                                    const datas = data.data;
                                    if (JSON.stringify(datas) !== '{}') {
                                        _this.logMsg.push(...datas);
                                        _this.logId = datas[datas.length - 1].id; // 将id最大值赋值
                                    }
                                    _this.queryCrawlLog(_this.logId);
                                }
                            })
                            .catch(err => {
                                _this.queryErrCount++;
                                _this.queryCrawlLog(_this.logId);
                                console.log(err);
                            });
                    } else {
                        this.logId = 0;
                        this.$message({
                            message: '获取登录状态失败，请稍后再试',
                            type: 'error'
                        });
                    }
                }, 1000 * 30);
            },
            // 单次初次日志获取
            getLogOnce(id) {
                const _this = this;
                api.getCrawlLog(id)
                    .then(({ data }) => {
                        if (data.code === 0) {
                            // 执行操作
                            const datas = data.data;
                            _this.logMsg = [];
                            if (JSON.stringify(datas) !== '{}') {
                                _this.logMsg = datas;
                                _this.logId = datas[datas.length - 1].id; // 将id最大值赋值
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
.crawl-wrap {
    padding: 20px 30px 0;
    .info-dialog {
        .code-box {
            text-align: center;
            .title {
                margin-top: 10px;
            }
            .red-title {
                color: #ff0000;
                font-weight: 500;
            }
            .code-wrapper {
                position: relative;
                width: 200px;
                height: 200px;
                margin: 0 auto;
                & > img {
                    width: 100%;
                    height: 100%;
                }
                .mask {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background:rgba(0, 0, 0, 0.6);
                    z-index: 1;
                    .mask-tip-box {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        width: 100%;
                        transform: translate(-50%, -50%);
                    }
                    .tip {
                        color: #fff;
                    }
                    .btn-fresh {
                        margin-top: 20px;
                        padding: 4px 14px;
                        color: #fff;
                        background-color: #ab2f2f;
                        border-radius: 2px;
                    }
                }
            }
        }
    }
    .main-wrap {
        display: flex;
        justify-content: space-between;
        .crawl-form {
            margin: 15px 0;
            background-color: #fff;
            flex: 1;
            padding: 6px 15px;
            .headline {
                font-weight: bold;
            }
            .code-login-title {
                display: flex;
                align-items: center;
                .title {
                    margin-left: 20px;
                }
                .btn-get-code {
                    margin-left: auto;
                    color: #409eff;
                }
            }
            .add-bottom {
                padding: 20px;
                box-sizing: border-box;
            }
            .login-success-box {
                margin-left: 70px;
                .iconcode_success {
                    font-size: 68px;
                    color: #3abc98;
                }
                .title {
                    margin-top: 10px;
                    font-weight: 600;
                    text-indent: 10px;
                }
            }
            .msg-require {
                color: #f56c6c;
                font-size: 12px;
                line-height: 1;
                margin-bottom: 10px;
                padding-left: 20px;
            }
            .el-form-item {
                margin: 5px auto 15px;
                /deep/ .el-form-item__content {
                    overflow: visible;
                }
                .el-select {
                    width: 400px;
                }
            }
            .one-level {
                padding-left: 15px;
                /deep/ .el-checkbox__label {
                    font-size: 16px;
                    font-weight: bold;
                }
            }
            .fix-width {
                margin-top: 20px;
                .el-input {
                    width: 400px;
                }
            }
            .two-level {
                padding-left: 40px;
            }
            .btn-submit {
                margin-left: 200px;
                margin-top: 25px;
            }
        }
        .crawl-record {
            padding: 10px 15px;
            margin: 15px 0 10px;
            background-color: #fff;
            flex: 1;
            max-height: 533px;
            overflow-y: auto;
            margin-left: 15px;
            .record-item {
                line-height: 2;
            }
        }
    }
}
</style>
