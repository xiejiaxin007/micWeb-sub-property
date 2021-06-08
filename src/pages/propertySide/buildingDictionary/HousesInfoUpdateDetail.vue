<!--
    @name: 楼盘动态信息模块
    @description: 楼盘动态信息模块
    @author: 贺伟
    @date: 2019-11-16
-->
<template>
    <div class="info-update-detail">
        <!--面包屑开始-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item
                :to="{ path: '/building/BuildSalesInfoUpdate'}">
                楼盘分级任务列表
            </el-breadcrumb-item>
            <el-breadcrumb-item>楼盘信息更新详情页</el-breadcrumb-item>
        </el-breadcrumb>
        <!--主要部分开始-->
        <div class="houses-info">
            <h3 class="houses-info-title">{{housesInfo.name}}（{{housesInfo.belongCity}}·{{housesInfo.commercial}}）</h3>
            <div class="dynamic-info">
                <h4 class="table-title">楼盘动态信息</h4>
                <el-table
                    class="houses-table"
                    v-loading="loading"
                    :data="buildingDynamicData"
                    :span-method="buildingSpanMethod"
                    border
                    :cell-class-name="tableCellClassName"
                    style="width: 800px;">
                    <el-table-column
                        prop="field"
                        label="字段"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="value"
                        label="更新次数">
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template>
                            <el-button
                                type="text"
                                @click="toUpdate('1')">
                                去更新
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="dynamic-info">
                <h4 class="table-title">户型&amp;楼栋动态信息</h4>
                <el-table
                    v-loading="loading"
                    :data="housesDynamicData"
                    :span-method="housesSpanMethod"
                    border
                    style="width: 800px;">
                    <el-table-column
                        prop="house_type_num"
                        label="户型编号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="field"
                        label="字段"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="value"
                        label="更新次数">
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                @click="toUpdate('2', scope.row)">
                                去更新
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button
                    class="btn-load-more"
                    type="primary"
                    size="small"
                    v-show="isLast"
                    @click="loadMoreInfo">
                    加载更多户型
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import reqApi from '@/api/buildingDictionary/housesInfoUpdate';
    import { commonFun } from "@/assets/js/utils/utils";
    export default {
        name: 'HousesInfoUpdateDetail',
        created() {
            // 存储当前的楼盘id
            this.projectId = this.$route.query.projectId;
            // 获取楼盘、户型动态数据
            this.getInitData();
        },
        data() {
            return {
                // 数据加载loading
                loading: false,
                // 楼盘基本信息
                housesInfo: {
                    name: '',
                    // 所属城市
                    belongCity: '',
                    // 楼盘业态
                    commercial: ''
                },
                results: [],
                // 楼盘动态信息表格数据
                buildingDynamicData: [],
                // 户型楼栋动态信息表格数据
                housesDynamicData: [],
                // 分页
                page: {
                    curPage: 1,
                    // 初始化条数 15为户型数 5为每户型多少条
                    count: 15 * 5
                }
            };
        },
        computed: {
            // 是否是最后一页了或者无数据
            isLast() {
                return this.results.length > this.page.count && this.results.length > this.housesDynamicData.length;
            }
        },
        methods: {
            // 单元格的 className 的回调方法
            tableCellClassName({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 0 && row.value == 0) {
                    return 'warning-row';
                } else {
                    return '';
                }
            },
            // 获取初始化数据
            async getInitData() {
                try {
                    this.loading = true;
                    const {
                        data: {
                            code,
                            msg,
                            data
                        }
                    } = await reqApi.getProjectDetaiData(this.projectId);
                    this.loading = false;
                    if (code === 0) {
                        // 赋值标题信息
                        this.housesInfo.name = data.project_name;
                        this.housesInfo.belongCity = data.city_text;
                        this.housesInfo.commercial = data.project_text_type;
                        // 赋值楼盘表单数据
                        this.buildingDynamicData = data.project_notify_info;
                        // 获取组装好的户型表单数据
                        this.results = this.getUniformData(data.house_notify_info);
                        // 初次加载第一页数据 前端分页
                        this.housesDynamicData = this.results.slice(0, this.page.count);
                    } else {
                        this.$message(msg);
                    }
                } catch (error) {
                    this.loading = false;
                    console.log(error);
                }
            },
            /**
             * 重新组装户型数据，用来直接渲染表格
             * @param {Array} houseData 户型分类数据
             * @return {Array} 组装好的数据
             */
            getUniformData(houseData) {
                // 定义存放table数据的数组
                let results = [];
                houseData.forEach(ele => {
                    ele.info.forEach(item => {
                        // 为每一项追加当前的户型编号，户型id和单价
                        const trData = Object.assign({
                            house_type_num: ele.house_type_num,
                            house_type_id: ele.house_type_id,
                            offer_price: ele.offer_price
                        }, item);
                        results.push(trData);
                    });
                });
                return results;
            },
            /**
             * 公共埋点方法
             * @param {String} para 埋点ID
             * @param {Object} config 埋点扩展子字段
             */
            setTrack(para, config) {
                // 如果有扩展字段不为空 添加page相关参数
                if (config) {
                    Object.assign(config, {
                        fromPage: 'p_changelog_detail',
                        toPage: 'p_changelog_detail'
                    });
                }
                commonFun.setTrackMenu(para, config);
            },
            /**
             * 楼盘动态信息合并行或列的计算方法
             * @param {Object} row 当前行数据对象
             * @param {Object} column 当前列数据对象
             * @param {Object} rowIndex 当前行号
             * @param {Object} columnIndex 当前列号
             */
            buildingSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 2) {
                    if (rowIndex % 6 === 0) {
                        return {
                            rowspan: 6,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            /**
             * 户型或楼栋合并行或列的计算方法
             * @param {Object} row 当前行数据对象
             * @param {Object} column 当前列数据对象
             * @param {Object} rowIndex 当前行号
             * @param {Object} columnIndex 当前列号
             */
            housesSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0 || columnIndex === 3) {
                    if (rowIndex % 5 === 0) {
                        return {
                            rowspan: 5,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            /**
             * 去更新方法 跳转到变更通知更新页面中
             * @param {String} type 标识类型 是楼盘'1'还是户型'2'
             * @param {Object} item 表单数据对象
             */
            toUpdate(type, item) {
                // 埋点 如果是楼盘
                if (type === '1') {
                    this.setTrack(6029, {
                        update_cata: 'project',
                        project_id: this.projectId
                    });
                // 如果是户型
                } else if (type === '2') {
                    this.setTrack(6029, {
                        update_cata: 'house',
                        project_id: this.projectId,
                        house_type_id: item.house_type_id
                    });
                }
                let query = {
                    projectId: this.projectId,
                    from: 'detail'
                };
                // 如果是户型组装需要在url传递的数据
                if (type === '2' && item !== undefined) {
                    Object.assign(query, {
                        houseTypeId: item.house_type_id,
                        // 户型编号
                        houseTypeNum: item.house_type_num,
                        // 户型单价
                        houseTypePrice: item.offer_price
                    });
                }
                this.$router.push({
                    path: '/building/changeInfoEntering',
                    query
                });
            },
            // 加载更多信息
            loadMoreInfo() {
                this.page.curPage++;
                // 将当前页和下一页数据合并
                this.housesDynamicData = [...this.housesDynamicData, ...this.results.slice((this.page.curPage - 1) * this.page.count, this.page.curPage * this.page.count)];
            }
        }
    }
</script>

<style lang="less" scoped>
    .info-update-detail{
        font-size: 14px;
        padding: 10px 15px;
        .bread-nav{
            margin: 10px 0;
        }
        .houses-info{
            margin-top: 15px;
        }
        .houses-info-title{
            padding: 0 15px;
            font-weight: bold;
            line-height: 3;
            background-color: #fff;
        }
        .dynamic-info{
            background-color: #fff;
            padding: 10px 15px;
            .table-title{
                font-size: 15px;
                line-height: 2;
                font-weight: normal;
            }
            .btn-load-more{
                margin: 20px 0;
            }
        }
        .houses-table /deep/ .warning-row{
            background-color: #fc0;
        }
    }
</style>