<!--
    @file: 拓展维护楼盘新增任务
    @description: 拓展维护楼盘新增任务
    @author: xiebin
    @date: 2020-01-08
-->
<template>
    <div class="expand-list-box">
        <div class="content-box">
            <!--面包屑-->
            <el-breadcrumb separator-class="el-icon-arrow-right"
                class="bread-nav">
                <el-breadcrumb-item>
                    <a href="/">首页</a>
                </el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/building/ExpandTaskList'}">楼盘任务列表</el-breadcrumb-item>
                <el-breadcrumb-item>审核详情页</el-breadcrumb-item>
            </el-breadcrumb>
            <h2>{{projectTitle}}</h2>
            <div class="content-text"
                v-loading="loading">
                <el-steps :active="active"
                    align-center
                    finish-status="success">
                    <el-step title="楼盘信息"
                        @click.native="toStep(0)"></el-step>
                    <el-step title="户型信息"
                        @click.native="toStep(1)"></el-step>
                    <el-step title="楼栋信息"
                        @click.native="toStep(2)"></el-step>
                </el-steps>
                <!--楼盘信息-->
                <project-audit-info-detail v-show="active === 0"
                    :datas="initData"
                    ref="childInfo0" />
                <!--户型信息-->
                <house-type-info v-show="active === 1"
                    :datas="initHouseInfo"
                    ref="childInfo1" />
                <!--楼栋信息-->
                <building-info v-show="active === 2"
                    :datas="initBuildingInfo"
                    ref="childInfo2" />
                <!-- 操作 -->
                <div class="footer-box"
                    v-if="$route.name === 'ExpandAuditTaskDetail'">
                    <el-button type="danger"
                        @click="reject">驳回</el-button>
                    <el-button v-if="active > 0"
                        type="primary"
                        @click="prev">上一步</el-button>
                    <el-button v-if="active < 2"
                        type="primary"
                        @click="next">下一步</el-button>
                    <el-button v-if="active === 2"
                        type="success"
                        @click="save">任务通过</el-button>
                </div>
            </div>
        </div>
        <!-- 任务审核驳回弹窗 -->
        <reject-dialog title="任务审核驳回"
            :visible="rejectDialog"
            @close="rejectDialog = false"
            @confirm="confirmReject"></reject-dialog>
        <!-- 下一步信息校验提示弹窗 -->
        <confirm-dialog title="温馨提示"
            content="您还没有完成当前页面的审核，请先完成再进行下一步！"
            :visible="confirmDialog"
            width="300px"
            confirmBtn="去完成"
            @cancel="confirmDialog = false"
            @confirm="confirmFinish"></confirm-dialog>
        <!-- 任务通过提示 -->
        <alert-dialog title="保存成功"
            :visible.sync="dialogVisible"
            width="300px"
            @confirm="toList">
            <div>信息审核入库需要时间，请耐心等待！</div>
        </alert-dialog>
    </div>
</template>

<script>
import api from '../api/auditTask';
import commonApi from '../api/common';
// 楼盘信息
import ProjectAuditInfoDetail from './ProjectAuditInfoDetail';
import HouseTypeInfo from './HouseTypeInfo';
import BuildingInfo from './BuildingInfo';
import { RejectDialog, ConfirmDialog, AlertDialog } from '@/components';
/**
 * 当前页面需要获取的配置参数
 * 45 楼盘/户型/分期销售状态
 */
const configOption = [45];
export default {
    name: 'ExpandAuditTaskDetail',
    components: {
        ProjectAuditInfoDetail,
        HouseTypeInfo,
        BuildingInfo,
        RejectDialog,
        ConfirmDialog,
        AlertDialog
    },
    data() {
        return {
            // 楼盘信息
            projectTitle: '',
            // 步骤
            active: 0,
            loading: false,
            // 初始信息
            initData: null,
            // 户型初始信息
            initHouseInfo: null,
            // 楼栋初始信息
            initBuildingInfo: null,
            // 驳回弹窗
            rejectDialog: false,
            // 下一步校验不通过的提示弹窗
            confirmDialog: false,
            // 保存结果
            saveInfo: {},
            // 楼盘基本信息
            projectInfo: {},
            // 户型信息
            houseInfo: {},
            // 楼栋信息
            buildingInfo: {},
            // 通过提示的弹窗
            dialogVisible: false
        };
    },
    created() {
        this.getProjectInfo();
        this.getInitDataInfo();
        this.getconfigDataList();
    },
    methods: {
        // 触发vuexaction函数调用配置信息
        getconfigDataList() {
            // 获取hots
            const params = {
                cate: 'Upload/project/house_type'
            };
            this.$store.dispatch('getOssOriginHost', params);
        },
        // 获取审核初始数据
        async getInitDataInfo() {
            try {
                this.loading = true;
                const options = {
                    task_id: this.$route.query.taskId
                };
                let result;
                if (this.$route.name === 'ShowAuditTaskDetail') {
                    result = await api.getAuditResult(options);
                } else {
                    result = await api.getTaskInfo(options);
                }
                const {
                    data: { code, data, msg }
                } = result;
                if (code === 0) {
                    this.initData = data;
                    this.initHouseInfo = data.house_type_detail_page;
                    this.initBuildingInfo = data.building_detail_page;
                    this.loading = false;
                } else {
                    this.$message.error(msg);
                    this.loading = false;
                    this.toList();
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 获取楼盘信息展示标题
        async getProjectInfo() {
            try {
                const options = {
                    project_id: this.$route.query.projectId
                };
                const {
                    data: { code, data, msg }
                } = await commonApi.getProjectInfoById(options);
                if (code === 0) {
                    let typeText = data.project_type_text ? '（' + data.project_type_text + '）' : '';
                    let city = data.city_id_text ? data.city_id_text + '   ' : '';
                    this.projectTitle = city + data.name + typeText;
                } else {
                    this.$message.error(msg);
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 上一步
        prev() {
            this.active--;
        },
        // 下一步
        next() {
            let ref = 'childInfo' + this.active;
            let result = this.$refs[ref].save();
            if (result) {
                this.active++;
            } else {
                this.confirmDialog = true;
            }
        },
        // 下一步校验不通过点击去完成的操作，停留在当前页面第一个未选择完成审核入库方式的字段或模块，进行定位（暂时不做）
        confirmFinish() {
            this.confirmDialog = false;
        },
        // 任务通过
        save() {
            let result = this.$refs.childInfo2.save();
            if (result) {
                this.projectInfo = this.$refs.childInfo0.getSaveData();
                this.houseInfo.house_type_detail_page = this.$refs.childInfo1.getSaveData();
                this.buildingInfo.building_detail_page = this.$refs.childInfo2.getSaveData();
                this.saveInfo = Object.assign({}, this.projectInfo, this.houseInfo, this.buildingInfo);
                this.passAudit();
            } else {
                this.confirmDialog = true;
            }
        },
        // 审核通过请求
        async passAudit() {
            try {
                const options = {
                    task_id: this.$route.query.taskId,
                    project_id: this.$route.query.projectId
                };
                let params = Object.assign({}, options, this.saveInfo);
                const {
                    data: { code, msg }
                } = await api.approveAudit({ data: JSON.stringify(params) });
                if (code === 0) {
                    this.dialogVisible = true;
                } else {
                    this.$message.error(msg);
                }
            } catch (error) {
                console.log(error);
                this.rejectDialog = false;
            }
        },
        // 任务通过跳转到列表
        toList() {
            this.$router.push({
                path: '/building/expandTaskList'
            });
        },
        // 驳回任务
        reject() {
            this.rejectDialog = true;
        },
        // 确认驳回
        async confirmReject(reason) {
            try {
                const options = {
                    id: this.$route.query.taskId,
                    remark: reason
                };
                const {
                    data: { code, msg }
                } = await api.rejectAudit(options);
                if (code === 0) {
                    this.rejectDialog = false;
                    this.toList();
                } else {
                    this.rejectDialog = false;
                    this.$message.error(msg);
                }
            } catch (error) {
                console.log(error);
                this.rejectDialog = false;
            }
        },
        /**
         * @description: 查看页面才可点击，查看步骤条点击事件
         * @param {int}  步骤条当前key值
         */
        toStep(active) {
            if (this.$route.name === 'ShowAuditTaskDetail') {
                this.active = active;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.expand-list-box {
    padding: 10px 15px;
    box-sizing: border-box;
    .content-box {
        margin-top: 30px;
        padding: 20px 15px;
        box-sizing: border-box;
        background-color: #fff;
        h2 {
            margin: 20px 0;
        }
        .content-text {
            margin-top: 20px;
            .el-steps {
                margin-bottom: 10px;
            }
            /deep/ .el-step__head.is-success {
                color: #2f9ef5;
                border-color: #2f9ef5;
                .el-step__line {
                    background-color: #2f9ef5;
                }
            }
            /deep/ .el-step__title.is-success {
                color: #2f9ef5;
            }
            /deep/ .el-step__title.is-process {
                color: #2f9ef5;
            }
            /deep/ .el-step__head.is-process {
                border-color: #2f9ef5;
                .is-text {
                    background-color: #2f9ef5;
                    color: #fff;
                }
            }
        }
        .footer-box {
            text-align: center;
            margin-top: 20px;
            /deep/ .el-button {
                width: 100px;
            }
        }
    }
}
</style>