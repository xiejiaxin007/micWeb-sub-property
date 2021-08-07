<!--
 * @author: xiejiaxin
 * @Date: 2021-07-10 10:06:39
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-07-10 14:34:26
 * @description: 自定义表格
-->
<template>
    <div class="wrapper">
        <div class="table-wrapper">
            <div class="jl-table-thead">
                <ul class="jl-tr jl-th">
                    <li v-for="item in tableTitle"
                        class="jl-td"
                        :key="item.prop">{{item.name}}</li>
                </ul>
            </div>
            <div class="jl-table-body">
                <ul v-for="item in tableData"
                    class="jl-tr"
                    :key="item.id">
                    <li v-for="(subItem, index) in item"
                        class="jl-td"
                        :key="index">{{subItem}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import list from './data.js';
export default {
    name: 'JlTable',
    data() {
        return {
            tableTitle: [
                {
                    name: 'ID',
                    prop: 'id',
                },
                {
                    name: '日期',
                    prop: 'date',
                },
                {
                    name: '姓名',
                    prop: 'name',
                },
                {
                    name: '地址',
                    prop: 'address',
                },
            ],
            tableData: list,
        };
    },
    methods: {},
};
</script>

<style lang="less" scoped>
.wrapper {
    width: 500px;
    margin: 50px auto;
}
.table-wrapper {
    position: relative;
    background-color: #fff;
}
.jl-table-thead {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}
.jl-table-body {
    padding-top: 40px;
    box-sizing: border-box;
    height: 200px;
    overflow-y: auto;
}
.jl-tr {
    display: flex;
    width: 100%;
    color: #606266;
    .jl-td {
        flex: 1;
        padding: 12px 20px;
        box-sizing: border-box;
        border-right: 1px solid #ebeef5;
        border-bottom: 1px solid #ebeef5;
    }
}
.jl-th {
    height: 40px;
    background-color: #eee;
    font-weight: bold;
}
</style>