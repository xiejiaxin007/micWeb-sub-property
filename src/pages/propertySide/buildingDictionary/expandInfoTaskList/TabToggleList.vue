<!--
    @file: tab切换列表
    @description: tab切换列表
    @author: xiebin
    @date: 2019-12-10
-->
<template>
    <div class="tab-list-box">
        <el-tabs
            tab-position="left"
            style="min-height: 100vh;"
            :before-leave="beforeLeaveTab"
            @tab-click="goToOldPage"
            v-model="tabNameVal">
            <el-tab-pane
                v-for="item in authPageList"
                :key="item.page_id"
                :name="item.page_id"
                :label="item.page_name">
                <!-- 楼盘名称&位置 -->
                <build-name-poition
                    v-if="item.page_id === '1' && showComponents('1', true)"
                    ref="projectTab"
                    :pageId="item.page_id"
                    :qdSourceList="getConfigList.qd_source_list"
                    :tradeArea="getConfigList.district_trade_area"
                    :loopLine="getConfigList.ring_road"
                    :projectIsShow="getConfigList.project_is_show"
                    :currentRoleSource="getConfigList.current_role_source"
                    @changeStatus="changeTabStatus"
                    @changeVal="changeVal" />
                <!-- 楼盘名称&位置详情页 -->
                <build-name-poition-detail
                    v-else-if="item.page_id === '1' && showComponents('1', false)"
                    ref="projectTab"
                    :pageId="item.page_id"
                    :currentRoleSource="getConfigList.current_role_source"
                    @changeStatus="changeTabStatus" />
                <!-- 动销信息编辑页 -->
                <dynamic-sale-info-edit v-if="item.page_id === '2' && tabNameVal === '2' && hasRender(item.page_id)" 
                    ref="projectTab"
                    @changeStatus="changeTabStatus"/>
                <!-- 优惠折扣特价编辑页面 -->
                <build-special-price-info
                    v-if="showComponents('5', true) && item.page_id === '5'"
                    ref="projectTab"
                    @specialChangeStatus="changeTabStatus" />
                <!-- 优惠折扣特价详情页面 -->
                <build-special-price-info-detail
                    v-else-if="showComponents('5', false) && item.page_id === '5'"
                    ref="projectTab"
                    @specialChangeStatus="changeTabStatus" />
                <!-- 楼盘概况编辑页面 -->
                <property-overview
                    v-if="showComponents('4', true) && item.page_id === '4'"
                    ref="projectTab"
                    :qdSourceList="getConfigList.qd_source_list"
                    :currentRoleSource="getConfigList.current_role_source"
                    @propertyChangeStatus="changeTabStatus" />
                <property-overview-detail
                    v-else-if="showComponents('4', false) && item.page_id === '4'"
                    ref="projectTab"
                    :qdSourceList="getConfigList.qd_source_list"
                    :currentRoleSource="getConfigList.current_role_source"
                    @propertyChangeStatus="changeTabStatus" />
                <!--放量计划-->
                <capacity-hand-room-edit v-if="item.page_id === '3' && tabNameVal === '3' && hasRender(item.page_id)" 
                    ref="projectTab"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState } from "vuex";
const BuildNamePoition = () => import(/* webpackChunkName: "BuildNamePoition" */'./BuildNamePoition');
const BuildNamePoitionDetail = () => import(/* webpackChunkName: "BuildNamePoition" */'./BuildNamePoitionDetail');
const DynamicSaleInfoEdit = () => import(/* webpackChunkName: "DynamicSaleInfoEdit" */'./DynamicSaleInfoEdit');
const BuildSpecialPriceInfo = () => import(/* webpackChunkName: "BuildSpecialPriceInfo" */'./BuildSpecialPriceInfo');
const BuildSpecialPriceInfoDetail = () => import(/* webpackChunkName: "BuildSpecialPriceInfo" */'./BuildSpecialPriceInfoDetail');
const PropertyOverview = () => import(/* webpackChunkName: "PropertyOverview" */'./PropertyOverview');
const PropertyOverviewDetail = () => import(/* webpackChunkName: "PropertyOverview" */'./PropertyOverviewDetail');
const CapacityHandRoomEdit = () => import(/* webpackChunkName: "CapacityHandRoomEdit" */'./CapacityHandRoomEdit');

import expandApi from '@/api/buildingDictionary/expandTagList';
import { toRouterLink } from '../utils/index';
import { commonFun } from "@/assets/js/utils/utils";
/**
 * 当前页面需要获取的配置参数
 * 1楼盘/户型/分期销售状态 3放量计划类型  5建设阶段类型  6单价类型 7总价类型 8户型居室 9房屋朝向 10 户型标签
 * 11装修情况 12环线情况 13区域板块 14交房时间类型 15审核反馈内容类型 16审核反馈内容结果 17 楼盘组审核状态 18 图片审核状态 19 图片类型
 * 20 数据源类 21是否合作楼盘	22获取变更通知标签 23获取变更通知页面单价类型 24获取变更通知页面总价类型 25合作外联状态类型
 * 26楼盘等级类型 27获取带看状态 28获取户型余量标签 30户型是否显示下拉（显示，隐藏）31楼盘是否显示下拉  32获取来源列表
 * 34 复制户型功能字段配置 35 动销页面楼盘单价类型【更换成6】  36 动销页面楼盘总价类型 37价格限制 38获取区域下有效板块  40有无排号接口 41排号状态接口
 * 42户型图集是否显示 43 楼层下拉 44 新交房时间类型 46新的房屋朝向下拉带不限   52楼栋是否显示下拉
 */
const configOption = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 23, 24, 30, 31, 32, 34, 36, 37, 38, 39, 40, 41, 42, 43, 44, 46, 52];

export default {
    name: 'TabToggleList',
    data() {
        return {
            // 权限页面列表
            authPageList: [],
            // 区域板块
            tradeArea: [],
            // 环线
            loopLine: [],
            // 楼盘是否显示radio
            projectIsShow: [],
            // 复制户型功能字段
            houseTypeCopyField: {},
            // 是否展示
            pageIshow: false,
            // 区域id
            districtId: '',
            // tab model值
            tabNameVal: '1',
            // 记录已经渲染的tab-id
            hasRenderArr: ['1'],
            // 设备
            device: '',
            // 按键按下的键组成的数组
            arrKey: [],
            // 按键拼接字符串
            keydown: ''
        }
    },
    computed: {
        ...mapState({
            // 获取通用配置信息
            getConfigList: state => state.buildingDictionary.projectConfiglist,
            // 获取角色信息
            getRoleList: state => state.commonStore.roleList,
            // 获取员工ID
            getUid: state => state.uid,
            // 获取图片host
            host: state => state.buildingDictionary.ossOriginHost
        }),
        /**
         * @description: 楼盘名称&位置，楼盘概况，优惠特价页面编辑与查看是否展示的判断
         * @return {string} tab   当前页面的pageid 
         * @return {boolean} isEdit   当前是否是编辑页面
         * @param {string} 
         */
        showComponents: function() {
            return function(tab, isEdit) {
                if(isEdit) {
                    return this.$route.query.isEdit === '1' && this.tabNameVal === tab && this.hasRender(tab);
                } else {
                    return !this.$route.query.isEdit && this.tabNameVal === tab && this.hasRender(tab);
                }
            };
        }
    },
    components: {
        // 楼盘名称
        BuildNamePoition,
        DynamicSaleInfoEdit,
        BuildNamePoitionDetail,
        // 折扣优惠页面
        BuildSpecialPriceInfo,
        BuildSpecialPriceInfoDetail,
        // 楼盘概况
        PropertyOverview,
        PropertyOverviewDetail,
        CapacityHandRoomEdit
    },
    created() {
        this.toRouterLink = toRouterLink;
        // 获取权限列表
        this.getAuthListData();
        // 触发vuexaction函数调用配置信息
        this.getconfigDataList();
        this.isOtherToPage();
        this.getisEditAuth('1')
    },
    beforeRouteLeave (to, from, next) {
        // 增加路由跳转前确认
        const answer = window.confirm('你所做的更改可能还未保存,确认离开吗？');
        if (answer) {
            next();
        } else {
            next(false);
        }
    },
    mounted() {
        // 获取设备
        this.device = commonFun.getDevice();
        window.addEventListener("beforeunload", this.handleUnload);
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    },
    beforeDestroy() {
        window.removeEventListener('beforeunload', this.handleUnload);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    },
    methods: {
        /**
         * @description: 按键按下的事件
         * @param {Object}  e
         * @return {type} 
         */
        handleKeyDown(e) {
            if (this.arrKey.length > 0) { 
                // a-z的按键 长按去重
                if (this.arrKey.indexOf(e.key.toLowerCase()) >= 0) {
                    return
                }
            }
            this.arrKey.push(e.key.toLowerCase());
            this.keydown = this.arrKey.join('+');
            let word = this.$route.query.isEdit && this.$route.query.isEdit === '1' ? 's' : 'e';
            if (this.device === 'mac') {
                if (this.keydown === 'meta+' + word) {
                    // 保存和编辑实际操作都在每个组件里面进行，因为不同组件调用的保存方法不同，编辑则是因为不同组件写的编辑权限不一样
                    this.$refs.projectTab[0].handleShortCut();
                    // 取消浏览器原有的操作
                    e.preventDefault();
                }
            } else {
                if (this.keydown === 'control+' + word) {
                    this.$refs.projectTab[0].handleShortCut();
                    // 取消浏览器原有的操作
                    e.preventDefault();
                }
            }
        },
        /**
         * @description: 按键起来的事件
         * @param {Object}  e
         * @return {type} 
         */
        handleKeyUp(e) {
            this.keydown = '';
            this.arrKey = [];
            e.preventDefault();
        },
        hasRender(id) {
            return this.hasRenderArr.includes(id);
        },
        // 监听关闭函数
        handleUnload (e) {
            const confirmationMessage = "你所做的更改可能还未保存，确认离开吗？";
            // 编辑页才提示，查看页不提示
            if (this.$route.query.isEdit === '1') {
                (e || window.event).returnValue = confirmationMessage;
            }
            return confirmationMessage;
        },
        // 检测是否是从其他页面跳转回来
        isOtherToPage() {
            if (this.$route.query.positionTab) {
                this.tabNameVal = this.$route.query.positionTab;
                this.pageIshow = true;
                // 记录已渲染组件
                if (!this.hasRenderArr.includes(this.tabNameVal)) {
                    this.hasRenderArr.push(this.tabNameVal);
                }
            }
        },
        /**
         * @description: 判断是否要切换tab，如果是编辑页跳转到别的tab，要进行提示
         * @param {String}  activeName  要去的tab的编号
         * @param {String}  oldActiveName  离开前tab的编号
         * @return {Boolean} 是否离开tab
         */
        beforeLeaveTab(activeName, oldActiveName) {
            if (oldActiveName !== '9' && oldActiveName !== '10' ) {
                if (this.$route.query.isEdit === '1') {
                    const answer = window.confirm('你所做的更改可能还未保存,确认离开吗？');
                    return answer;
                } else {
                    return true;
                }
            }
        },
        /**
         * 跳转到老页面
         * @param {Boolean} infoType 页面类型
         */
        goToOldPage(infoType) {
            if (infoType.paneName == '9') {
                window.open(`/index.php?r=cj-project-dynamic-info%2Findex&project_id=${this.$route.query.projectId}&page_tag=dynamic-info&show=1`);
            } else if (infoType.paneName == '10') {
                window.open(`/index.php?r=yw-project-img-new%2Findex&project_id=${this.$route.query.projectId}&page_tag=img-index&show=1`);
            } else {
                this.pageIshow = true;
                // 刷新还停留在当前页，点击就要带上positionTab参数
                // 看beforeLeaveTab方法是否允许跳转
                if (infoType.active) {
                    if (this.$route.query.isEdit === '1' && this.$route.query.positionTab === infoType.paneName) {
                        // 切换自己的时候，不触发beforeLeaveTab，要单独判断
                        const answer = window.confirm('你所做的更改可能还未保存,确认离开吗？');
                        if (answer) {
                            this.toRouterLink(infoType.paneName);
                        } else {
                            return false;
                        }
                    } else {
                        this.toRouterLink(infoType.paneName);
                    }
                } else {
                    return false;
                }
            }
            // 调用页面权限接口
            this.getisEditAuth(infoType.paneName);
            // 记录已渲染组件
            if (!this.hasRenderArr.includes(infoType.paneName)) {
                this.hasRenderArr.push(infoType.paneName);
            }
        },
        getisEditAuth(pageId) {
            let params = {
                task_id: this.$route.query.taskId,
                page_id: pageId
            };
            this.$store.dispatch('isEditAuth', params);
        },
        // 触发vuexaction函数调用配置信息
        getconfigDataList() {
            const options = {
                city_id: this.$route.query.cityId || '',
                type: configOption,
                district_id: this.districtId || '',
                project_id: this.$route.query.projectId || ''
            };
            this.$store.dispatch('getProjectConfigList', options);
            // 获取hots
            const params = {
                cate: 'Upload/project/house_type'
            };
            this.$store.dispatch('getOssOriginHost', params);
        },
        /**
         * 楼盘名称，优惠折扣特价，楼盘概况页面 跳转到编辑|查看页面
         * @param {Boolean} e 是否显示详情页
         */
        changeTabStatus(e) {
            let isEdit = e ? '1' : '';
            this.toRouterLink(this.tabNameVal, isEdit);
        },
        // 获取权限列表
        async getAuthListData() {
            try {
                let result = await expandApi.getPageAuthListData(this.$route.query.taskId || '');
                let { data } = result;
                if (data.code === 0) {
                    this.authPageList = data.data;
                } else if (data.code === 1) {
                    this.$alert(data.msg);
                }
            } catch (error) {
                console.log(error)
            }
        },
        /**
         * 当区域ID改变的时候
         * @param {Boolean} value 区域ID
         */
        changeVal(value) {
            this.districtId = value;
            this.getconfigDataList();
        }
    }
}
</script>

<style lang="less" scoped>
.tab-list-box {
    padding: 10px 15px;
    box-sizing: border-box;
    background: #57626f;
    min-height: 100vh;
    /deep/ .el-tabs__item {
        padding: 0;
    }
    /deep/ .el-tabs__item.is-active {
        width: 117px;
        height: 40px;
        color: #fff;
        background: #3f9af7;
        border-radius: 6px;
        margin-right: 7px;
    }
    /deep/ .el-tabs--left .el-tabs__item.is-left {
        text-align: center;
        color: #fff;
    }
}
</style>
<style lang="less">
// 模块间隔样式
.modal-title-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    min-height: 40px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 4px solid #50bfff;
    .title-content{
        font-size: 15px;
        font-weight: bold;
    }
}
</style>