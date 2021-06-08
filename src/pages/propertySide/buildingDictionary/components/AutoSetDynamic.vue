<!--
 * @author: kangxue
 * @Date: 2020-10-10 10:40:16
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-04-08 14:56:39
 * @description: 自动生成动态组件，增加获取楼盘信息接口判断，和编辑按钮权限一致，再加上楼盘显示的条件，与没有task_id条件
-->
<template>
    <el-button v-if="isProjectShow && isProjectShow === '1' && !$route.query.taskId"
        type="warning"
        @click="autoSetDynamic">
        自动生成动态
    </el-button>
</template>

<script>
import commonApi from '../api/common';
export default {
    data() {
        return {
            // 楼盘是否显示
            isProjectShow: '',
            // 重复提交
            isSubmiting: false
        };
    },
    mounted() {
        this.getProjectInfo();
    },
    methods: {
        // 获取楼盘信息
        async getProjectInfo() {
            try {
                const {
                    data: { code, msg, data }
                } = await commonApi.getProjectInfoById({
                    project_id: this.$route.query.projectId,
                    fields: 'is_show'
                });
                if (code === 0) {
                    this.isProjectShow = data.is_show;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 自动生成动态操作
        async autoSetDynamic() {
            try {
                if (this.isSubmiting) {
                    return;
                }
                this.isSubmiting = true;
                const {
                    data: { code, msg }
                } = await commonApi.autoCreat({
                    project_id: this.$route.query.projectId
                });
                if (code === 0) {
                    this.isSubmiting = false;
                    this.$message({
                        type: 'success',
                        message: msg
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: msg
                    });
                    this.isSubmiting = false;
                }
            } catch (err) {
                this.isSubmiting = false;
                console.log(err);
            }
        }
    }
};
</script>

<style scoped lang="less">
</style>