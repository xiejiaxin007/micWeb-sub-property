<!--
 * @author: kangxue
 * @Date: 2020-09-29 10:18:30
 * @LastEditors: kangxue
 * @LastEditTime: 2021-03-18 10:43:35
 * @description: 表格分页组件，表格插槽展示
-->
<!--
    使用方法
<table-pagination :total="totalNum"
    :page="currentPage"
    :pageSize="pageSize"
    @pageChange="pageChange">
    <template v-slot:btns></template>
    <template v-slot:table></template>
</table-pagination>

pageChange(page) {
    this.currentPage = page;
    this.getTableData();
}
-->
<template>
    <div class="search-result">
        <div class="data-stat">
            <el-row>
                <el-col :span="12">
                    <p class="total-num"><span v-if="total > 0">第{{countRange}}条，</span>共{{total}}条数据</p>
                </el-col>
                <el-col :span="12">
                    <div class="operation-area">
                        <slot name="btns"/>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="table-wrap">
            <slot name="table"/>
            <div class="pagination">
                <el-pagination
                    hide-on-single-page
                    background
                    :page-size="pageSize"
                    layout="prev, pager, next"
                    :current-page.sync="currentPage"
                    @current-change="pageChange"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'table-pagination',
    props: {
        // 总数
        total: {
            type: Number,
            default: 0
        },
        // 当前页
        page: {
            type: Number,
            default: 1
        },
        // 每页多少条
        pageSize: {
            type: Number,
            default: 20
        }
    },
    data() {
        return {
            // 当前页面
            currentPage: 1,
        };
    },
    watch: {
        // 监听当前页
        page: {
            handler: function(newVal, oldVal) {
                this.currentPage = this.page;
            },
            immediate: true,
        }
    },
    computed: {
        // 第多少条
        countRange: function() {
            let prev = this.currentPage > 1 ? (this.currentPage - 1) * this.pageSize + 1 : 1;
            let next = prev + this.pageSize - 1;
            next = next < this.total ? next : this.total;
            return prev + '-' + next;
        }
    },
    methods: {
        pageChange() {
            this.$emit('pageChange', this.currentPage);
        }
    }
};
</script>

<style lang="less" scoped>
.data-stat {
    margin-bottom: 10px;
    .total-num {
        line-height: 40px;
        font-size: 14px;
    }
    .operation-area {
        text-align: right;
        .upload-file {
            display: inline-block;
            margin-right: 20px;
        }
    }
}
.pagination {
    text-align: center;
    padding-top: 10px;
}
</style>