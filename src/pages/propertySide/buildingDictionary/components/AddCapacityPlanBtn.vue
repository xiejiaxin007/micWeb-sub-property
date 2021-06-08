<!--
 * @author: kangxue
 * @Date: 2021-04-01 18:24:02
 * @LastEditors: kangxue
 * @LastEditTime: 2021-04-01 19:24:17
 * @description: 新增放量计划按钮+介绍
--> 
<template>
    <div class="capacity-box">
        <el-button size="mini"
            @click="toPlan"
            type="primary">
            新增放量计划
        </el-button>
        <el-tooltip class="item"
            effect="dark"
            placement="right-start">
            <ul slot="content">
                <li class="msg-list">
                    <p class="focus">· 同一个开盘/加推时间：</p>
                    <p>从预计开盘变为已开盘，或从预计加推变为已加推，直接在原有的放量计划上更改，不另加新的放量计划</p>
                </li>
                <li class="msg-list">
                    <p class="focus">· 不同的开盘/加推时间：</p>
                    <p>
                        <span>有多少个开盘/加推时间就有多少个放量计划</span>
                    </p>
                    <p class="focus">· 排号字段：</p>
                    <p>
                        <span>放量计划有排号且有排号时间的，需要更新排号相关信息，可以关联户型和楼栋的需要关联户型和楼栋</span>
                    </p>
                    <p class="focus">· 放量计划补充：</p>
                    <p>
                        <span>对于缺失放量计划的非售罄楼盘在维护到的时候要做相应的补充， 补充时只新增一条最新的放量时间即可(加推时间和开盘时间有其一即可)</span>
                    </p>
                    <p class="focus">· 销售状态变更的影响：</p>
                    <p>
                        <span>无论是在售变为待售，在售变为售罄，还是待售变为售罄，楼盘的放量计划保留不删</span>
                    </p>
                </li>
            </ul>
            <div class="msg-box">
                <i class="el-icon-warning"
                    aria-hidden="true"></i>
            </div>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    methods: {
        // 跳转链接
        toPlan() {
            if (this.$route.query.isEdit === '1') {
                // 编辑页有是否离开页面的提示，需要返回父级
                this.$emit('toUrl');
            } else {
                const {
                    projectId = '',
                    taskId = '',
                    projectName = '',
                    buildingType = '',
                    role = ''
                } = this.$route.query;
                const baseUrl = `/dist/building/capacityPlan?projectId=${projectId}&taskId=${taskId}&projectName=${projectName}&buildingType=${buildingType}&isEdit=1&role=${role}`;
                window.open(baseUrl);
            }
        }
    }
};
</script>

<style scoped lang="less">
.capacity-box {
    display: flex;
    align-items: center;
    .msg-box {
        color: #f78f0f;
        margin-left: 10px;
    }
}
</style>