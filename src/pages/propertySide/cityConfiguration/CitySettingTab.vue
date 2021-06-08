<template>
    <div class="collocation-wrap">
        <!--面包屑导航-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav"
        >
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{tabName}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="tabBox">
            <el-tabs
                v-model="activeName"
                :before-leave="beforeLeave"
                @tab-click="handleTabClick"
            >
                <el-tab-pane
                    label="城市开站抓取配置"
                    name="first"
                >
                    <city-cofig-list></city-cofig-list>
                </el-tab-pane>
                <el-tab-pane
                    label="其余信息抓取配置"
                    name="second"
                >
                    <city-residue-setting @skipFirst="skipFirst"></city-residue-setting>
                </el-tab-pane>
                <el-tab-pane
                    label="经营城市管理"
                    name="third"
                >
                    <opera-city-manage :isClearData="isClearData" :isProps="isProp" @needSave="saveDialog"></opera-city-manage>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 删除提示框 -->
        <el-dialog
            title="提示"
            :visible.sync="saveInFoDiaLog"
            width="30%">
            <span>当前内容没有保存，请确定是否保存！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="notSave">取 消</el-button>
                <el-button type="primary" @click="isProp=!isProp">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import CityCofigList from './CityCofigList';
import CityResidueSetting from './CityResidueSetting';
import OperaCityManage from './OperaCityManage';
import { setTimeout } from 'timers';
export default {
    data () {
        return {
            activeName: 'first',
            tabName: '城市开站配置',
            saveInFoDiaLog: false,
            isTab: '',
            isProp: false,
            newActiveName: '',
            isClearData: false
        };
    },
    components: {
        CityCofigList,
        CityResidueSetting,
        OperaCityManage
    },
    methods: {
        /**
         * 点击tab切换前
         * @params newActive [string] 跳转名
         */
        beforeLeave(newActive) {
            this.newActiveName = newActive;
            if (this.isTab === 'true') {
                this.saveInFoDiaLog = true;
                return false
            } else if (this.isTab === 'undefined') {
                this.saveInFoDiaLog = false;
                this.activeName = newActive;
            }
        },
        // 切换表头
        handleTabClick (tab, event) {
            this.tabName = tab.label;
            
        },
        skipFirst (data) {
            this.activeName = data.activeName;
            this.tabName = data.tabName;
        },
        /**
         * 接受子级传递方法
         * @params val [string] 子级传递参数
         */
        saveDialog(val) {
            this.isTab = val;
            if (val === 'false') {
                this.saveInFoDiaLog = false;
            } else if (val === 'undefined') {
                this.beforeLeave(this.newActiveName);
            }
        },
        // 点击取消按钮
        notSave() {
            this.saveInFoDiaLog = false;
            this.isTab = 'undefined';
            this.isClearData = !this.isClearData;
            setTimeout(()=>{
                this.beforeLeave(this.newActiveName);
            },200)
        }
    }
};
</script>

<style lang="less" scoped>
.collocation-wrap {
    width: 100%;
    padding: 0 30px;
    margin: 0 auto;
    box-sizing: border-box;
    .bread-nav {
        padding: 20px 0;
    }
    .tabBox {
        background: #fff;
        /deep/ .el-tabs__nav {
            left: 45px;
            bottom: 0;
        }
        /deep/ .el-tabs__item {
            font-size: 16px;
        }
        /deep/ .el-tabs__header {
            margin: 0;
            padding-top: 15px;
        }
        /deep/ .el-tabs__nav-wrap::after {
            background: #fff;
        }
    }
}
</style>
