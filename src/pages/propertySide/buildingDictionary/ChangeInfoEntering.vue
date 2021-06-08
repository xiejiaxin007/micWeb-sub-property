<!--
    @name: 录入页
    @description: 变更信息录入主页面
    @author: 贺伟、解彬
    @date: 2019-11-13
-->
<template>
    <div class="info-entering">
        <!--面包屑开始-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="/index.php?r=project-change-notify%2Findex_new">变更通知列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>录入页</el-breadcrumb-item>
        </el-breadcrumb>
        <!--楼盘名称部分开始-->
        <div
            class="house-info"
            v-loading="pageLoading">
            <div class="info-headline">
                <h3 class="title">{{housesInfo.name}}</h3>
                <span class="house-type">（{{housesInfo.belongCity}}·{{housesInfo.commercial}}）</span>
                <div class="btn-box">
                    <el-button
                        @click="handleCancle">
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="submitForm">
                        提交
                    </el-button>
                </div>
            </div>
            <div class="info-show">
                <el-form
                    ref="baseInfo"
                    :model="housesInfo"
                    label-width="80px"
                    size="mini">
                    <el-form-item
                        class="auto-item"
                        label="区域：">
                        {{housesInfo.area}}
                    </el-form-item>
                    <el-form-item
                        class="auto-item"
                        label="地址：">
                        {{housesInfo.address}}
                    </el-form-item>
                    <el-form-item
                        required
                        :rules="baseInfoRules"
                        prop="labelVal"
                        label="标签：">
                        <div class="label-options">
                            <div
                                class="cooperation-category"
                                v-for="(item, idx) in baseConfig.categoryList"
                                :key="idx">
                                <el-radio-group
                                    v-model="housesInfo.labelVal"
                                    @change="(val) => labelChange(val, idx)">
                                    <el-radio
                                        v-for="ele in item"
                                        :key="ele.id"
                                        :label="ele.id">
                                        {{ele.text}}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!--表单部分开始-->
        <div class="form-wrap">
            <!-- 变更通知 -->
            <div class="form-right">
                <div class="form-right-wrap">
                    <div class="info-headline">
                        <h3 class="title">变更通知内容</h3>
                        <span class="vice-title">将你准备发送的消息内容填写在这里，更新后自动同步给咨询师以及相关人员</span>
                    </div>
                    <!-- 变更通知内容 -->
                    <change-notice-content
                        :ossData="ossData"
                        :ossConf="ossCon"
                        :content="defaultContent"
                        @lookOver="lookOver"
                        ref="noticeContent" />
                </div>
                <!-- 图片预览查看器 -->
                <jl-image-preview
                    v-if="isShow"
                    :showViewer="isShow"
                    :urlList="previewUrl"
                    @closeViewer="closeViewer">
                </jl-image-preview>
            </div>
            <div class="form-left">
                <div class="info-headline">
                    <h3 class="title">重要通知细节信息</h3>
                    <span class="vice-title">将你可以转化为标准字段的内容更新在这里，请仔细填写！</span>
                </div>
                <div v-show="housesInfo.labelVal !== ''">
                    <!-- 合作带看模块 -->
                    <cooperation-status
                        ref="cooperateBand"
                        v-if="labelIdx === 0 || labelIdx === 2 && housesInfo.labelVal == 9"
                        :houses-info="changeNotice"
                        :label-id="housesInfo.labelVal"
                        :cooperation-status="baseConfig.cooperateOutreachList"
                        :band-status="baseConfig.bandStatusList" />
                </div>
            </div>
        </div>
        <!-- 提交校验信息弹窗 -->
        <el-dialog
            :visible.sync="saveVailInfoDialogVal"
            title="系统提醒"
            width="30%"
            center>
            <span>嘿！你是不是忘记更新了一些标准字段哦！听说更新一些标准字段会被加鸡腿，先录入一些标准字段再提交吧！</span>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="text"
                    @click="notValidate">
                    残忍拒绝
                </el-button>
                <el-button
                    type="primary"
                    @click="saveVailInfoDialogVal = false">
                    录入标准字段再提交
                </el-button>
            </span>
        </el-dialog>
        <!-- 楼盘户型自洽弹窗 -->
        <el-dialog
            :visible.sync="porjectStatusDialogVal"
            title="系统提醒"
            width="30%"
            center>
            <span>{{selfConsistentMessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="editHouseTypeStatus">
                    修改户型销售状态
                </el-button>
                <el-button
                    type="primary"
                    @click="editHousePrejectStatus">
                    修改楼盘销售状态
                </el-button>
            </span>
        </el-dialog>
        <!-- 更新度弹窗 -->
        <el-dialog
            :visible.sync="saveUpdateProgressDialogVal"
            title="系统提醒"
            width="30%"
            center>
            <span>{{updateConsistentMessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="saveUpdateProgressDialogVal = false">
                    无情规则,我只能接受
                </el-button>
            </span>
        </el-dialog>
        <!-- 价格涨跌限制弹窗 -->
        <el-dialog
            :visible.sync="priceLimitDialog"
            title="系统提醒"
            width="30%"
            center>
            <span v-html="priceLimitMessage"></span>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="confirmSubmit">
                    确认无误正常提交
                </el-button>
                <el-button
                    type="primary"
                    @click="confirmToEdit">
                    填写错误正常修改
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ossCon from '@/config/config';
    import ChangeNoticeContent from './ChangeNoticeContent';
    import CooperationStatus from './CooperationStatus'
    import reqApi from '@/api/buildingDictionary/changeInfoEnter';
    import commonApi from "@/api/commonApi";
    import { commonFun } from "@/assets/js/utils/utils";
    const {
        getProjectBaseInfoData,
        getProjectConfigData,
        getProjectBuildingListdata,
        getRelatedHouseTypeData,
        saveFormInfoData
    } = reqApi;
    /**
     * 当前页面需要获取的配置参数
     * 1楼盘/户型/分期销售状态 2是否合作 3放量计划类型 4产权年限 5建设阶段类型 6单价类型 7总价类型 8户型居室 9房屋朝向 10户型标签
     * 11装修情况 12环线情况 13区域板块 14交房时间类型 15审核反馈内容类型 16审核反馈内容结果 17 楼盘组审核状态 18 图片审核状态 19 图片类型
     * 20 数据源类 21是否合作楼盘	22获取变更通知标签 23获取变更通知页面单价类型 24获取变更通知页面总价类型 25合作外联状态类型
     * 26楼盘等级类型 27获取带看状态 28获取户型余量标签
     */
    const configOption = [1, 2, 3, 6, 7, 8, 14, 21, 22, 23, 24, 25, 26, 27, 28];
    // 标签都不选状态
    const noStatus = {
        id: -1,
        text: '暂不清楚'
    };
    export default {
        name: 'ChangeInfoEntering',
        components: {
            // 变更通知内容组件
            ChangeNoticeContent,
            // 合作带看模块
            CooperationStatus
        },
        data() {
            return {
                // 预览图片url
                previewUrl: [],
                // 是否展示图片预览
                isShow: false,
                // 图片信息
                imgList: [],
                // oss信息
                ossCon: ossCon,
                ossData: {},
                // 当前户型校验标识
                houseId: '',
                // 标识是否在提交中，防止重复提交
                isSubmiting: false,
                // 价格涨跌限制弹窗
                priceLimitDialog: false,
                // 价格涨跌限制弹窗信息
                priceLimitMessage: '',
                // 提交校验信息弹窗Val
                saveVailInfoDialogVal: false,
                // 残忍拒绝后下次不再校验val
                notValidateValue: true,
                // 提交更新度信息弹窗Val
                saveUpdateProgressDialogVal: false,
                // 提交更新度信息弹窗Val
                updateConsistentMessage: '',
                // 页面loading
                pageLoading: false,
                // 楼盘销售状态自洽弹窗
                porjectStatusDialogVal: false,
                // 楼盘自洽提示信息
                selfConsistentMessage: '',
                // 楼盘模块key
                housesKey: 1,
                // 楼盘基本信息
                housesInfo: {
                    name: '',
                    // 所属城市
                    belongCity: '',
                    // 楼盘业态
                    commercial: '',
                    area: '',
                    address: '',
                    labelVal: '',
                    priceLimit: '',
                    price: ''
                },
                // 变更通知楼盘相关字段默认值
                changeNotice: {},
                // 标签绑定的值
                labelVal: '',
                // 标签当前所在索引
                labelIdx: '',
                // 标签数组
                labels: [],
                // 关联楼栋下拉数据
                projectBuildingOpations: [],
                // 关联户型下拉
                relatedHouseTypeList: [],
                // 点击弹窗编辑户型时的信息
                editorHouseInfolist: [],
                // 配置信息数据
                baseConfig: {
                    // 楼盘变更通知标签
                    categoryList: [],
                    // 楼盘销售状态
                    saleStatus: [],
                    // 户型销售状态
                    houseSaleStatus: [],
                    // 楼盘单价类型
                    changePriceTypeList: [],
                    // 楼盘总价类型
                    changeTotalPriceTypeList: [],
                    // 放量计划类型
                    volumeType: [],
                    // 户型类型
                    houseTag: [],
                    // 交房时间类型
                    liveDateType: [],
                    // 合作外联状态类型
                    houseTypeSaleNumList: [],
                    // 是否合作外联
                    cooperateOutreachList: [],
                    // 带看状态
                    bandStatusList: [],
                    // 余量标签
                    marginTagList: [],
                    // 户型居室
                    roomType: []
                },
                baseInfoRules: { required: true, message: '请选择一个标签', trigger: 'change' },
                // 变更通知内容的默认值
                defaultContent: ''
            }
        },
        created() {
            // 页面初始化
            this.pageInit();
            this.getSigns();
        },
        methods: {
            /**
             * 查看大图
             * @param {string} url 预览图片的url
             */
            lookOver(url, bool) {
                this.previewUrl[0] = url;
                this.isShow = true;
            },
            // 关闭预览
            closeViewer() {
                this.isShow = false;
            },
            // 获取oss信息
            async getSigns() {
                const params = {
                        cate: 'Upload/project/house_type'
                    };
                    const { data } = await commonApi.getSign(params);
                    if (data.code === 0) {
                        this.ossData = data.data;
                    }
            },
            // 点击弹窗残忍拒绝
            notValidate() {
                this.saveVailInfoDialogVal = false;
                this.notValidateValue = false;
                this.submitForm()
            },
            // 页面初始化方法
            pageInit() {
                // 如果是从楼盘信息详情页跳过来的则默认选中在售房源，展示模块中将楼盘动态信息
                if (this.$route.query.from === 'detail') {
                    this.housesInfo.labelVal = 182;
                    this.labelIdx = 1;
                }
                // 获取路由参数中楼盘id
                this.projectId = this.$route.query.projectId;
                // 初始化埋点对象
                this.tracks = {
                    // 户型埋点id
                    houseId: '',
                    // 楼盘埋点id
                    projectId: '',
                    // 埋点errortype
                    errorType: ''
                };
                // 获取楼盘信息变更页的基础配置数据
                this.getConfigBaseInfo();
                // 获取楼盘基本信息进行展示
                this.getProjectBaseInfo();
                // 获取关联楼栋信息
                this.getProjectBuildingList();
                // 获取关联户型下拉
                this.getRelatedHouseTypeList();
            },
            // 户型楼栋模块关联楼栋获取焦点的时候
            buildFocus() {
               this.getProjectBuildingList();
            },
            // 获取关联楼栋方法
            async getProjectBuildingList() {
                let params = {
                    project_id: this.projectId
                }
                try {
                    let result = await getProjectBuildingListdata(params);
                    let { data } = result;
                    if (data.code === 0) {
                        this.projectBuildingOpations = data.data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 当子组件重新获取户型时
            resetPush() {
                this.getRelatedHouseTypeList();
            },
            // 获取关联户型下拉
            async getRelatedHouseTypeList() {
                try {
                    let {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await getRelatedHouseTypeData(this.$route.query.projectId);
                    if (code === 0) {
                        this.relatedHouseTypeList = data;
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 切换标签方法
            labelChange(val, index) {
                this.labelIdx = index;
                this.housesKey++;
            },
            // 获取楼盘信息变更配置数据
            async getConfigBaseInfo() {
                try {
                    const options = {
                        city_id: this.cityId || '',
                        type: configOption
                    };
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await getProjectConfigData(options);
                    if (code === 0) {
                        // 赋值基本配置信息
                        // 楼盘变更通知标签
                        this.baseConfig.categoryList = data.category_list;
                        // 楼盘销售状态
                        this.baseConfig.saleStatus = data.sale_status;
                        // 户型销售状态
                        this.baseConfig.houseSaleStatus = data.sale_status;
                        // 楼盘单价类型
                        this.baseConfig.changePriceTypeList = data.change_price_type_list;
                        this.baseConfig.changePriceTypeList.push(noStatus);
                        // 楼盘总价类型
                        this.baseConfig.changeTotalPriceTypeList = data.change_total_price_type_list;
                        this.baseConfig.changeTotalPriceTypeList.push(noStatus);
                        // 放量计划类型
                        this.baseConfig.volumeType = data.volume_type;
                        // 交房时间类型
                        this.baseConfig.liveDateType = data.live_date_type;
                        // 合作外联状态类型
                        this.baseConfig.houseTypeSaleNumList = data.house_type_sale_num_list;
                        // 是否合作外联
                        this.baseConfig.cooperateOutreachList = data.cooperate_outreach_list;
                        // 带看状态
                        this.baseConfig.bandStatusList = data.band_status_list;
                        // 余量标签
                        this.baseConfig.marginTagList = data.house_type_sale_num_list;
                        this.baseConfig.marginTagList.push(noStatus);
                        // 户型居室
                        this.baseConfig.roomType = data.room_type;
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 获取楼盘基本信息数据
            async getProjectBaseInfo() {
                try {
                    this.pageLoading = true;
                    let isInfo = this.$route.query.have_default_notify_content ? 1 : 2;
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await getProjectBaseInfoData(this.projectId, isInfo);
                    this.pageLoading = false;
                    if (code === 0) {
                        // 赋值基本信息
                        this.housesInfo.name = data.name;
                        this.housesInfo.belongCity = data.city_name;
                        this.housesInfo.commercial = data.project_type_name;
                        this.housesInfo.area = data.district_name;
                        this.housesInfo.address = data.address;
                        this.cityId = data.city_id;
                        // 元转万
                        this.housesInfo.priceLimit = this.unitTransform(data.price_limit);
                        // 元转万
                        this.housesInfo.price = this.unitTransform(data.price);
                        // 户型类型
                        this.baseConfig.houseTag = data.building_type;
                        this.baseConfig.houseTag.push(noStatus);
                        // 赋值需要传递给带看信息
                        this.changeNotice = {
                            // 数据库中合作状态
                            cooperateStatus: data.is_cooperate,
                            // 数据库中外联状态
                            outReachStatus: data.is_outreach,
                            bandStatus: Number(data.band_status),
                            startTime: data.start_time,
                            endTime: data.end_time,
                            onSaleCount: data.on_sale_num
                        };
                        this.defaultContent = data.default_notify_content || '';
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    console.log(error);
                    this.pageLoading = false;
                }
            },
            // 取消事件 跳转
            handleCancle() {
                this.$confirm('是否放弃编辑?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    window.location.href = '/index.php?r=project-change-notify%2Findex_new';
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            // 标签校验
            validLabel() {
                let valids = false;
                this.$refs['baseInfo'].validate((valid) => {
                    valids = valid;
                });
                return valids;
            },
            // 确认价格涨跌无误提交
            confirmSubmit() {
                // 标识是否可以跳过价格涨跌限制
                this.confirmLimitSts = true;
                // 关闭弹窗
                this.priceLimitDialog = false;
                // 提交表单
                this.submitForm();
            },
            // 确认价格涨跌错误
            confirmToEdit() {
                // 标识是否可以跳过价格涨跌限制
                this.confirmLimitSts = false;
                this.priceLimitDialog = false;
            },
            /**
             * 价格涨跌限制检查
             * @param {Object} projectInfo 楼盘表单信息
             * @param {Object} houseInfo 户型表单信息
             * @return {Boolean} 是否通过校验
             */
            checkPriceLimit(projectInfo, houseInfo) {
                // 判断楼盘价格涨跌是否超出限制
                // 输入的单价
                const projectPrice = Number(projectInfo.project_min_price);
                const baseContent = '本次修改价格信息涨跌略高，请确认信息是否有误！';
                // 楼盘提示信息
                let projectMsg = '';
                // 户型提示信息
                let houseMsgArr = [];
                // 判断楼盘价格是否超出限制
                if (projectPrice !== 0 && Number(this.housesInfo.price) !== 0 && Math.abs(projectPrice - Number(this.housesInfo.price)) >= Number(this.housesInfo.priceLimit)) {
                    projectMsg = `楼盘单价${projectPrice}万,原价${this.housesInfo.price}万`
                }
                // 判断户型价格限制
                houseInfo.house_type.forEach(ele => {
                    // 如果原价不为空且超出限制再提示
                    const oldPrice = this.unitTransform(ele.oldPrice);
                    if (Number(ele.oldPrice) !== 0 && Math.abs(Number(ele.price) - oldPrice) >= Number(this.housesInfo.priceLimit)) {
                        houseMsgArr.push(`户型${ele.house_type_num}单价${ele.price}万,原价${oldPrice}万`);
                    }
                });
                // 如果存在超出限制的item项且原价不为0 则提示
                if (projectMsg !== '' || houseMsgArr.length > 0) {
                    this.priceLimitMessage = `${baseContent} <br/> ${projectMsg} <br/> ${houseMsgArr.join('<br/>')}`
                    this.priceLimitDialog = true;
                    return false;
                }
                return true;
            },
            /**
             * 元转万
             * @param {String，Array} 需要转为万元的值
             */
            unitTransform(origin) {
                if (isNaN(Number(origin))) {
                    throw new Error(`${origin}无法转成数字`);
                }
                return Number(origin) / 10000;
            },
            // 大表达单各模块校验
            async submitForm() {
                // 标签校验
                const validRes = this.validLabel();
                if (!validRes) {
                    this.$message('请选择一个标签！');
                    return;
                }
                // 保存是需要传给后端的对象
                const options = {
                    project_id: this.projectId,
                    notify_type: this.housesInfo.labelVal
                };
                // 获取变更通知内容校验状态
                const noticeContentRes = this.$refs['noticeContent'].validForm();
                if (!noticeContentRes.successful) {
                    if (noticeContentRes.formInfo.notify_content.length > 0) {
                        this.$message('变更内容不可超出5000字！');
                        return;
                    }
                    this.$message('变更内容不可为空！');
                    return;
                }
                // 变更通知内容校验通过后将变更通知内容的值进行合并到options
                Object.assign(options, noticeContentRes.formInfo);

                // 0 校验带看信息
                if (this.labelIdx === 0) {
                    const cooperateBandRes = this.$refs['cooperateBand'].validForm();
                    if (cooperateBandRes.successful) {
                        this.saveFormInfo(Object.assign(options, cooperateBandRes.formInfo));
                    } else {
                        // 定位到未校验通过的地方
                        this.errorScroll(this.$refs['cooperateBand'].$el);
                    }
                // 1 校验楼盘动态、户型楼栋动态信息以及特价房源信息
                } else if (this.labelIdx === 1) {
                    this.saveFormInfo(Object.assign(options));
                } else if (this.labelIdx === 2) {
                    if(this.housesInfo.labelVal == 9) {
                        const cooperateBandRes = this.$refs['cooperateBand'].validForm();
                        if (cooperateBandRes.successful) {
                            this.saveFormInfo(Object.assign(options, cooperateBandRes.formInfo));
                        } else {
                            // 定位到未校验通过的地方
                            this.errorScroll(this.$refs['cooperateBand'].$el);
                        }
                        return;
                    }
                    this.saveFormInfo(Object.assign(options));
                }
            },
            /**
             * 滚动条滚动
             * @param {string} element 元素
             */
            errorScroll(element) {
                let timer = null;
                clearInterval(timer);
                timer = setInterval(() => {
                    document.documentElement.scrollTop = element.offsetTop - 112;
                    clearInterval(timer);
                }, 10);
            },
            /**
             * 公共埋点方法
             * @param {string} trackid 埋点ID
             * @param {object}} para 埋点拓展字段
             */
            setTrack(trackId, para) {
                commonFun.setTrackMenu(trackId, para);
            },
            // 点击弹窗修改户型销售状态处理
            editHouseTypeStatus() {
                // 埋点
                this.setTrack(this.tracks.houseId, {
                    errortype: this.tracks.errorType
                })
                // 关闭弹窗
                this.porjectStatusDialogVal = false;
                this.editorHouseInfolist = this.editorHouseInfolists;
            },
            // 点击弹窗修改楼盘销售状态处理
            editHousePrejectStatus() {
                // 埋点
                this.setTrack(this.tracks.projectId, {
                    errortype: this.tracks.errorType
                })
                // 关闭弹窗
                this.porjectStatusDialogVal = false;
            },
            /**
             * 楼盘售罄弹窗报错处理
             * @param {data} 后台返回的数据
             */
            showErrorMsgDialog(data, code) {
                this.porjectStatusDialogVal = true;
                let str = '';
                this.editorHouseInfolists = [];
                data.forEach(item => {
                    str += `${item.house_type_text}(${item.status === '2' ? '在售' : '待售'})、`;
                    // 给点击户型时传入的值做处理
                    this.editorHouseInfolists.push({
                        id: item.house_type_id,
                        text: item.house_type_text,
                        price: item.offer_price,
                        houseId: item.house_id
                    });
                });
                str = str.substring(0, str.lastIndexOf('、'));
                if (code === 20007) {
                    this.selfConsistentMessage = `
                        该楼盘存在${str},不能将楼盘的销售状态修改为售罄，请选择维护以上户型销售状态还是修改楼盘销售状态
                    `;
                } else if (code === 20011) {
                    this.selfConsistentMessage = `
                        该楼盘为售罄，不能存在待售/在售的户型信息${str}，请选择维护以上户型销售状态还是修改楼盘销售状态
                    `;
                }
                // 户型埋点
                this.tracks.houseId = '5916';
                // 楼盘埋点
                this.tracks.projectId = '5917';
                // errtype
                this.tracks.errorType = 2;
            },
            /**
             * 楼盘待售弹窗报错处理
             * @param {data} 后台返回的数据
             */
            waitShowErrorMsgDialog(data, code) {
                this.porjectStatusDialogVal = true;
                let str = ''
                this.editorHouseInfolists = [];
                data.forEach(item => {
                    str += `${item.house_type_text}(${item.status === '2' ? '在售' : '待售'})、`;
                    // 给点击户型时传入的值做处理
                    this.editorHouseInfolists.push({
                        id: item.house_type_id,
                        text: item.house_type_text,
                        price: item.offer_price,
                        houseId: item.house_id
                    });
                });
                str = str.substring(0, str.lastIndexOf('、'));
                if (code === 20008) {
                    this.selfConsistentMessage = `
                        该楼盘存在${str},不能将楼盘的销售状态修改为待售，请选择维护以上户型销售状态还是修改楼盘销售状态
                    `;
                } else if (code === 20012) {
                    this.selfConsistentMessage = `
                        该楼盘为待售，不能存在在售的户型信息${str}，请选择维护以上户型销售状态还是修改楼盘销售状态
                    `;
                }
                // 户型埋点
                this.tracks.houseId = '5916';
                // 楼盘埋点
                this.tracks.projectId = '5917';
                // errtype
                this.tracks.errorType = 4;
            },
            /**
             * 价格面积自洽
             * @param {object} data 返回的id参数
             * @param {object} option 保存的参数列表
             */
            houseBanninessError(data, option) {
                let houseList = option.house_type.filter(item => item.house_id == Number(data.house_id));
                let houseIdVal;
                houseList.forEach(item => {
                    houseIdVal = item.house_type_num;
                })
                if (houseIdVal) {
                    this.$confirm(houseIdVal + '的总价不等于单价*面积，请确认是否保存', '提示', {
                        confirmButtonText: '保存',
                        cancelButtonText: '不保存',
                        type: 'warning'
                        }).then(() => {
                            this.houseId = data.house_id;
                            this.submitForm();
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消保存'
                        });
                    });
                }
            },
            /**
             * 提交保存
             * @param {Object} option 要提交的表单对象
             */
            async saveFormInfo(option) {
                try {
                    // 如果数据在提交中 则不进行提交
                    if (this.isSubmiting) {
                        return;
                    }
                    this.isSubmiting = true;
                    const {
                        data: {
                            code,
                            data,
                            msg
                        }
                    } = await saveFormInfoData(option);
                    this.isSubmiting = false;
                    if (code === 0) {
                        // 提交成功后把残忍拒绝的值还原成true,下次进来还会继续校验
                        this.notValidateValue = true;
                        this.$message({
                            message: '提交成功！',
                            type: 'success'
                        });
                        window.location.href = '/index.php?r=project-change-notify%2Findex_new';
                    } else if (code === 20007) {
                        // 楼盘售罄弹窗报错
                        this.showErrorMsgDialog(data.house_type, code);
                    } else if (code === 20008) {
                        // 楼盘待售弹窗报错
                        this.waitShowErrorMsgDialog(data.house_type, code);
                    } else if (code === 20009) {
                        // 更新度报错
                        this.saveUpdateProgressDialogVal = true;
                        this.updateConsistentMessage = msg;
                    } else if (code === 20010) {
                        this.houseBanninessError(data, option);
                    } else if (code === 20011) {
                        // 楼盘售罄不能存在待售在售户型
                        this.showErrorMsgDialog(data.house_type, code);
                    } else if (code === 20012) {
                        // 楼盘待售，不能存在在售户型
                        this.waitShowErrorMsgDialog(data.house_type, code);
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    this.isSubmiting = false;
                    console.log(error);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .white-box{
        padding: 10px 15px;
        background-color: #fff;
    }
    .info-entering{
        font-size: 14px;
        padding: 20px 20px 0;
        .bread-nav{
            margin-bottom: 10px;
        }
        .info-headline{
            border-bottom: 1px solid #dcdfe6;
            padding: 15px 0;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            > .title{
                display: inline-block;
                max-width: 260px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: bold;
            }
            .house-type{
                vertical-align: top;
                font-weight: bold;
                font-size: 15px;
            }
            > .vice-title{
                font-size: 12px;
                margin-left: 12px;
            }
        }
        .house-info{
            padding: 0 15px;
            background-color: #fff;
        }
        .form-right-wrap{
            position: sticky;
            top: 130px;
        }
        .info-show{
            line-height: 2;
            .lables{
                display: flex;
            }
            .auto-item {
                display: inline-block;
                margin-right: 40px;
            }
            .cooperation-category {
                float: left;
                margin-right: 30px;
                &:last-of-type {
                    margin-right: 0;
                }
            }
            &::after{
                display: block;
                clear: both;
                content: "";
                visibility: hidden;
                height: 0;
            }
        }
        .form-wrap{
            margin-top: 15px;
        }
        .form-left,.form-right{
            .white-box
        }
        .form-left,.form-right{
            margin-bottom: 20px;
        }
        .form-left{
            margin-right: 20px;
        }
        .btn-box{
            text-align: center;
            margin-left: auto;
        }
    }
</style>