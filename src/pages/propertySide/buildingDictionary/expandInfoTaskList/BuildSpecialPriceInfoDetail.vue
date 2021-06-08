<!--
    @file: 优惠折扣特价页面
    @description: 优惠折扣特价页面
    @author: xiebin
    @date: 2019-12-19
-->
<template>
    <div class="special-price-box"
        v-loading="loading">
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
        </el-breadcrumb>
        <div class="head-line">
            <h4>{{$route.query.projectName + $route.query.buildingType}} -- 优惠折扣特价</h4>
            <div v-if="getEditAuth && getEditAuth == 2">
                <auto-set-dynamic></auto-set-dynamic>
                <el-button
                    v-if="isEdit"
                    @click="editPageInfo"
                    type="primary">
                    编辑
                </el-button>
            </div>
        </div>
        <div class="modal-title-box">
            <h3 class="title-content">优惠信息</h3>
        </div>
        <div class="form-content-box">
            <el-form
                :model="projectDiscountInfo"
                label-width="100px">
                <el-form-item
                    label="优惠概述:"
                    v-if="projectDiscountInfo.pay_title">
                    <p>{{projectDiscountInfo.pay_title.field_value}}</p>
                </el-form-item>
                <el-form-item
                    label="当期折扣概述:"
                    v-if="projectDiscountInfo.pay_info">
                    <p>{{projectDiscountInfo.pay_info.field_value}}</p>
                </el-form-item>
                <el-form-item
                    label="往期折扣描述:"
                    v-if="projectDiscountInfo.old_pay_info">
                    <p class="special-text">{{projectDiscountInfo.old_pay_info.field_value}}</p>
                </el-form-item>
                <el-form-item
                    label="优惠结束时间:"
                    v-if="projectDiscountInfo.discount_end_datetime">
                    <p>{{projectDiscountInfo.discount_end_datetime.field_value ? projectDiscountInfo.discount_end_datetime.field_value + ' 23 : 59 : 59' : ''}}</p>
                </el-form-item>
            </el-form>
        </div>
        <div class="modal-title-box">
            <h3 class="title-content">特价房信息</h3>
        </div>
        <div class="form-content-box">
            <el-form
                label-width="100px"
                ref="formList"
                :model="projectDiscountInfo">
                <el-form-item
                    v-if="projectDiscountInfo.special_price_house_desc"
                    label="特价房概述:">
                    <p>{{projectDiscountInfo.special_price_house_desc.field_value}}</p>
                </el-form-item>
                <el-form-item
                    label="结束时间:"
                    v-if="projectDiscountInfo.end_datetime">
                    <p>{{projectDiscountInfo.end_datetime.field_value ? projectDiscountInfo.end_datetime.field_value + ' 23 : 59 : 59' : ''}}</p>
                </el-form-item>
            </el-form>
        </div>
        <div class="modal-title-box">
            <h3 class="title-content">特价房信息</h3>
            <el-button type="danger"
                 v-if="getEditAuth && getEditAuth == 2"
                @click="delAllHide">一键删除隐藏特价房</el-button>
        </div>
        <div class="special-room-info form-content-box">
            <el-table
                :data="modle.projectDiscountSpecialHouse"
                style="width: 100%">
                <el-table-column
                    label="房号"
                    v-if="modle.projectDiscountSpecialHouse[0] && modle.projectDiscountSpecialHouse[0].house_num">
                    <template slot-scope="scope">                               
                        <p>{{scope.row.house_num.field_value}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="面积(㎡)"
                    v-if="modle.projectDiscountSpecialHouse[0] && modle.projectDiscountSpecialHouse[0].acreage">
                    <template slot-scope="scope">
                        <p>{{scope.row.acreage.field_value}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="原总价(万元)"
                    v-if="modle.projectDiscountSpecialHouse[0] && modle.projectDiscountSpecialHouse[0].price">
                    <template slot-scope="scope">
                        <p>{{scope.row.price.field_value}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="特价(万元)"
                    v-if="modle.projectDiscountSpecialHouse[0] && modle.projectDiscountSpecialHouse[0].special_price">
                    <template slot-scope="scope">
                        <p>{{scope.row.special_price.field_value}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="modle.projectDiscountSpecialHouse[0] && modle.projectDiscountSpecialHouse[0].is_show"
                    label="是否显示">
                    <template slot-scope="scope">
                        <p>{{scope.row.is_show.field_value === 2 ? '隐藏' : '显示'}}</p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 二次确认弹层——删除弹层 -->
        <confirm-dialog title="提示"
            content="您确定要批量删除所有隐藏特价房吗？删除后数据无法恢复，请谨慎操作！"
            confirmBtn="确定"
            :visible="confirmVisible"
            width="350px"
            @cancel="confirmVisible = false"
            @confirm="confirmAlert"></confirm-dialog>
    </div>
</template>

<script>
import { ConfirmDialog } from '@/components';
import specialHouseApi from '../api/specialHouseInfo';
import AutoSetDynamic from '../components/AutoSetDynamic';
import { filterDate } from '../utils/index';
import { mapState } from "vuex";
export default {
    name: 'BuildSpecialPriceInfo',
    components: {
        AutoSetDynamic,
        ConfirmDialog
    },
    data() {
        return {
            // 优惠信息
            projectDiscountInfo: {},
            // 特价房信息
            modle: {
                projectDiscountSpecialHouse: []
            },
            breadText: '楼盘列表',
            // 二次确认弹层信息
            confirmVisible: false,
            // 防止重复提交
            flag: true,
            // 加载loading
            loading: false,
            // 是否可以编辑
            isEdit: false
        }
    },
    computed: {
        ...mapState({
            // 获取通用配置信息
            getEditAuth: state => state.buildingDictionary.isAuditorAuth,
        })
    },
    mounted() {
        // 判断优惠信息是否可编辑
        this.specialInfoIsEdit();
        this.initSpecialInfoList();
        // 判断角色修改面包屑文案
        this.isOperation();
    },
    methods: {
        // 判断优惠信息是否可编辑
        async specialInfoIsEdit() {
            try {
                let params = {
                    project_id: this.$route.query.projectId
                };
                const {
                    data: { code, msg, data }
                } = await specialHouseApi.isEdit(params);
                if (code === 0) {
                    this.isEdit = data && data.is_edit === '1' ? true : false;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 删除所有隐藏的特价房信息
        delAllHide() {
            this.confirmVisible = true;
        },
        // 确定删除
        async confirmAlert() {
            // 防止重复提交
            if (!this.flag) return;
            this.flag = false;
            try {
                this.loading = true;
                let params = {
                    project_id: this.$route.query.projectId
                };
                const {
                    data: { code, msg }
                } = await specialHouseApi.delHideSpecialHouse(params);
                if (code === 0) {
                    this.$message.success('该楼盘下所有的隐藏特价房已删除');
                    this.confirmVisible = false;
                    this.initSpecialInfoList();
                } else if (code === 4001) {
                    // 没有可以隐藏的特价房
                    this.$message.warning(msg);
                    this.confirmVisible = false;
                } else {
                    this.$message.error(msg);
                }
                this.loading = false;
                this.flag = true;
            } catch (err) {
                this.loading = false;
                this.flag = true;
                console.log(err);
            }
        },
        // 【父组件调用】快捷键编辑操作
        handleShortCut() {
            if (this.getEditAuth && this.getEditAuth == 2) {
                this.editPageInfo();
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
         // 跳转到编辑页
        editPageInfo() {
            this.$emit('specialChangeStatus', true);
        }
    }
}
</script>

<style lang="less" scoped>
.special-price-box {
    padding: 15px 15px;
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
    }
    .form-content-box {
        width: 1050px;
        padding-left: 30px;
        margin-top: 10px;
        .special-text {
            width: 400px;
            word-break: break-all;
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
    }
    .footer {
        text-align: center;
        margin-top: 30px;
        /deep/ .el-button {
            width: 100px;
        }
    }
    /* 清除浮动 */
    .clear-float-box:after {
        display:block;
        clear:both;
        content:"";
        visibility:hidden;
        height:0;
    }
}
</style>