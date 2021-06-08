<!--
    /**
     * @file 经营城市管理
     * @author  XieBin
     * @date 2019.9.20
     */
 -->
<template>
    <div class="opear-city-box">
        <!-- 复制一个老城的字段常量配置到新城 -->
        <div class="opear-city-setting">
            <div class="search-title">
                <h2>经营城市配置</h2>
            </div>
            <div class="search-box">
                <el-form
                    inline
                    label-width="96px">
                    <el-form-item
                        label="地理城市:">
                        <el-select
                            v-model="geoCityVal"
                            filterable
                            placeholder="请输入地理城市">
                            <el-option
                                v-for="item in geoCityOptions"
                                :key="item.id"
                                :label="item.name_cn"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="经营城市:">
                        <el-select
                            v-model="operaCityVal"
                            filterable
                            placeholder="请输入经营城市">
                            <el-option
                                v-for="item in operaCityOptions"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div class="divider"></div>
                    <el-form-item class="form-item-center">
                        <el-button @click="resetSearchData">重置</el-button>
                        <el-button
                            type="primary"
                            @click="serachTableInfo">
                            搜索
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 表格数据 -->
            <div class="table-box">
                <p>共{{totalSize}}条，第{{startNum}}-{{endNum}}条数据</p>
                <el-table
                    :data="opearCityData"
                    border
                    highlight-current-row
                    @cell-click="columoClick"
                    style="width: 100%">
                    <el-table-column
                        prop="city_name"
                        :resizable="false"
                        align="center"
                        label="地理城市"
                        width="400">
                    </el-table-column>
                    <el-table-column
                        ref="elTd"
                        :resizable="false"
                        align="left"
                        label="经营城市">
                        <template slot-scope="scope">
                            <div
                                v-for="(item, index) in scope.row.master"
                                :key="index">
                                <el-select
                                    v-model="item.city_name"
                                    value-key="id"
                                    filterable
                                    placeholder="请输入经营城市"
                                    @change="val => selectChange(val, index, scope.row.master)"
                                    @focus="selFocus(item, index, $event)"
                                    >
                                    <el-option
                                        v-for="item in operaCityOptions"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item">
                                    </el-option>
                                </el-select>
                                <el-button
                                    type="text"
                                    size="mini"
                                    @click="deleteInput(scope.row.master, index)">
                                    删除
                                </el-button>
                            </div>
                            <div class="add-btn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="addInput(scope.row.master)">
                                    +
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    :total="totalSize"
                    @current-change="currentPageChange">
                </el-pagination>
                <div 
                    class="submit-btn"
                    v-show="saveBtnIsShow">
                    <el-button @click="cance">取消</el-button>
                    <el-button
                        type="primary" 
                        @click="saveInfoRules">
                        保存
                    </el-button>
                </div>
            </div>
            <!-- 删除提示框 -->
            <el-dialog
                title="提示"
                :visible.sync="delDialog"
                width="30%">
                <span>是否确认删除，一旦删除数据将无法恢复</span>
                <span
                    slot="footer"
                    class="dialog-footer">
                    <el-button @click="delDialog = false">取 消</el-button>
                    <el-button
                        type="primary" 
                        @click="delEdit">
                        确 定
                    </el-button>
                </span>
            </el-dialog>
            <!-- 地理城市不存在对应关系提示框 -->
            <el-dialog
                title="提示"
                :visible.sync="errDialog"
                :close-on-click-modal="false"
                :show-close="false"
                width="30%">
                <span>地理城市：{{notOperaRelationText}}等城市的对应关系中不存在本城市，请确认是否继续保存！</span>
                <span
                    slot="footer" 
                    class="dialog-footer">
                    <el-button @click="canc">取 消</el-button>
                    <el-button
                        type="primary" 
                        @click="confimSave">
                        确 定
                    </el-button>
                </span>
            </el-dialog>
        </div>
    </div>
    
</template>

<script>
import moreCityApi from '../../../api/citySettingApi/OperaCityManageApi';
import { setTimeout } from 'timers';
export default {
    props: {
        isProps: {
            type: Boolean,
            default: false
        },
        isClearData: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            // 是否启用监听
            isDeepWatch: false,
            // 地理城市
            geoCityVal: '',
            geoCityOptions: [],
            // 经营城市
            operaCityVal: '',
            operaCityOptions: [],
            // 表格城市对应关系数据
            opearCityData: [],
            // 分页
            pageSize: 10,
            totalSize: 0,
            currentPage: 1,
            // 删除提示框
            delDialog: false,
            // 错误提示框
            errDialog: false,
            // 不在对应城市错误文案
            notOperaRelationText: '',
            // 重复性关系弹框
            repeatDialog: false,
            // 保存按钮是否显示
            saveBtnIsShow: false,
            // 初始值条数
            startNum: 1,
            // 最后一条数
            endNum: 10,
            // 父组件是否传递props
            parentProps: false,
            // 对应关系id
            relationId: '',
            oldCurrentPage: 1,
            // 分页页码是否需要改变
            isJumpPage: false
        }
    },
    watch: {
        // 监听表格数组
        opearCityData: {
            handler(old, newVal) {
                if (this.isDeepWatch) {
                    this.saveBtnIsShow = true;
                    this.$emit('needSave', 'true');
                } else {
                    this.saveBtnIsShow = false;
                }
            },
            deep: true
        },
        // 监听props
        isProps: function(newVal, oldVal) {
            if (newVal || !newVal) {
            this.saveInfoRules();
            this.parentProps = true;
            }
        },
        // 是否重置数据
        isClearData: function(newVal) {
            if (newVal || !newVal) {
                this.isDeepWatch = false;
                this.resetSearchData();
            }
        },
        // 监听分页
        currentPage: function(newVal, oldVal) {
            if (this.isJumpPage) {
                this.oldCurrentPage = newVal;
            } else {
                this.oldCurrentPage = oldVal;
            }
        }
    },
    mounted() {
        // 调用地理城市接口方法
        this.getGeoCityData();
        // 调用经营城市接口方法
        this.getOperCityDatas();
        // 获取列表页地理城市和经营城市对应关系
        this.getTableCityDatas();
    },
    methods: {
        // 错误提示框取消按钮
        canc() {
            this.errDialog = false;
            this.currentPage = this.oldCurrentPage;
        },
        // 获取地理城市接口数据
        async getGeoCityData() {
            let result = await moreCityApi.getMultiCityData(this.geoCityVal);
            let { data } = result;
            if (data.code === 0) {
                this.geoCityOptions = data.data;
            }
        },
        // 获取经营城市接口数据
        async getOperCityDatas() {
            let result = await moreCityApi.getOperaCityData(this.operaCityVal);
            let { data } = result;
            if (data.code === 0) {
                this.operaCityOptions = data.data;
            }
        },
        /**
         * 获取列表页地理城市和经营城市对应关系
         * @params [number] citySubID 地理城市ID
         * @params [number] cityDesID 经营城市ID
         */
        async getTableCityDatas(citySubID, cityDesID) {
            let result = await moreCityApi.getCityTableData(citySubID, cityDesID, this.currentPage, this.pageSize);
            let { data } = result;
            if (data.code === 0) {
                this.opearCityData = data.data.maps;
                // 总条数
                this.totalSize = data.data.total;
                setTimeout(()=>{
                    this.isDeepWatch = true;
                }, 2000);
            }
        },
        // 搜索获取对应表格数据
        serachTableInfo() {
            this.currentPage = 1;
            this.getTableCityDatas(this.geoCityVal, this.operaCityVal);
            this.isDeepWatch = false;
        },
        // 取消按钮
        cance() {
            this.currentPage = 1;
            this.isDeepWatch = false;
            this.getTableCityDatas();
        },
        // 重置搜索条件
        resetSearchData() {
            this.geoCityVal = '';
            this.operaCityVal = '';
            this.currentPage = 1;
            // 调用表格数据
            this.getTableCityDatas();
            this.isDeepWatch = false;
        },
        /**
         * 点击删除按钮触发
         * @params row [array] 当前单元格的数据
         * @params index [array] 当前input的数据
         */
        deleteInput(row, index) {
            this.rowArr = row;
            this.rowIndex = index;
            this.delDialog = true;
        },
        // 点击删除弹出框的确定触发
        async delEdit() {
            if(this.rowIndex !== -1) {
                if (this.rowArr[this.rowIndex].relation_id) {
                    let result = await moreCityApi.deleteSelIptData(this.rowArr[this.rowIndex].relation_id);
                    let { data } = result;
                    if (data.code === 0) {
                        this.rowArr.splice(this.rowIndex, 1);
                        this.delDialog = false;
                    }else {
                        this.$message.error('删除失败');
                    }
                } else {
                    this.rowArr.splice(this.rowIndex, 1);
                    this.delDialog = false;
                }
            }
        },
        /**
         * 点击添加按钮触发
         * @params cope [array] 当前单元格的数据
         */
        addInput(scope) {
            scope.push({
                city_name: '',
                city_id: '',
                relation_id: ''
            });
        },
        /**
         * 表格中的下拉框值发生改变
         * @params [object] val 当前选中的值
         * @params [number] index 当前选中的下标
         * @params [array] row 当前选中的单元格数据
         */
        selectChange(val, index, row) {
            let obj;
            if (this.relationId === '') {
                obj = {
                    city_name: val.text,
                    city_id: val.id,
                    relation_id: ''
                };
            } else {
                obj = {
                    city_name: val.text,
                    city_id: val.id,
                    relation_id: this.relationId
                };
            }
            this.$set(row, index, obj);
        },
        /**
         * 页码改变时触发
         * @params [number] currentPage 改变后的页码
         */
        currentPageChange(currentPage) {
            // 换页执行保存操作
            this.saveInfoRules();
            this.currentPage = currentPage;
            // 从第几条到第几条数据计算
            this.startNum = (currentPage - 1) * 10 + 1;
            this.endNum = currentPage * 10;
        },
        //保存数据校验
        saveInfoRules() {
            let arr = [];
            this.opearCityData.map((val, index) => {
                let flag = false;
                val.master.filter((item) => {
                    if((item.city_name !== '' && item.city_name === val.city_name) || item.city_name === val.city_name) {
                        flag = true;
                    }
                });
                if (!flag) {
                    arr.push(val);
                }
            })
            if (arr.length > 0) {
                let arrList = new Set(arr);
                let arrSta = Array.from(arrList);
                let str = '';
                for(var i = 0; i < arrSta.length; i++) {
                    str += arrSta[i].city_name+ '、';
                }
                this.notOperaRelationText = str.substr(0, str.length - 1);
                this.errDialog = true;
                // 给父组件传值关闭弹框
                this.$emit('needSave', 'false');
                // 分页页码是否需要改变
                this.isJumpPage = false;
            } else {
                this.confimSave();
            }
        },
        // 保存数据
        async confimSave() {
            let params = {
                maps: this.opearCityData
            };
            let result = await moreCityApi.saveTableInfoData(params);
            let { data } = result;
            if (data.code === 0) {
                // 关闭错误提示框
                this.errDialog = false;
                // 刷新接口
                if (this.geoCityVal || this.operaCityVal) {
                    this.getTableCityDatas(this.geoCityVal, this.operaCityVal);
                }else {
                    this.getTableCityDatas();
                }
                // 分页页码是否需要改变
                this.isJumpPage = true;
                // 提示信息
                this.$message({
                    showClose: true,
                    message: '保存成功!',
                    type: 'success'
                });
                this.isDeepWatch = false;
                // 给父组件传值关闭弹框,并跳转
                if (this.parentProps) {
                    setTimeout(() => {this.$emit('needSave', 'undefined')}, 300);
                }
            } else if (data.code === 1) {
                // 关闭错误提示框
                this.errDialog = false;
                this.$message({
                    showClose: true,
                    message: data.msg,
                    type: 'error'
                });
                // 给父组件传值关闭弹框
                this.$emit('needSave','false');
            }
        },
        /**
         * 获取当前元素的其他兄弟元素
         * @params [Object] elem 选择的当前元素
         */
        siblingElems(elem){
            var nodes = [];
            var _elem = elem;
            while((elem = elem.previousSibling)){
                if(elem.nodeType == 1){
                    nodes.push(elem);
                }
            }
            var elems = _elem;
            while((elems = elems.nextSibling)){
                if(elems.nodeType == 1){
                    nodes.push(elems);
                }
            }
            return nodes;
        },
         /**
         * 点击当前单元格
         * @params {array} row 当前行的数据
         * @params {array} column 当前列的数据
         * @params {array} cell 当前的dom
         */
        columoClick (row, column, cell, event) {
            // 点击当前的单元格
            let cellDiv = cell.childNodes[0];
            let addDiv = cellDiv.querySelector('.add-btn');
            if(addDiv) {
                addDiv.style.display = 'block';
            }
            let allCell = this.siblingElems(cell);
            allCell.map(e => {
                if(e.childNodes[0].querySelector('.add-btn')){
                    e.childNodes[0].querySelector('.add-btn').style.display = 'none';
                }
            });
            cell.style.background = 'rgb(190,210,253)';
            this.siblingElems(cell).map(e => {
                e.style.background = 'rgb(245,249,253)';
            });
            // 其他行的全部隐藏
            let trRow = this.siblingElems(cell.parentNode);
            for(let i = 0;i < trRow.length; i++) {
                for(let j= 0; j < trRow[i].children.length; j++){
                    trRow[i].children[j].style.background = '#fff';
                    if(trRow[i].children[j].querySelector('.add-btn')){
                        trRow[i].children[j].querySelector('.add-btn').style.display = 'none';
                    }
                }
            }
        },
        /**
         * select获取焦点改变颜色
         * @params e [object] event事件
         */
        selFocus(item, index, e) {
            this.relationId = item.relation_id;
            let cell = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
            this.columoClick(0, 0, cell);
        },
    }
}
</script>

<style lang="less" scoped>
.opear-city-box {
    width: 100%;
    padding: 20px 30px 0;
    margin: 0 auto;
    box-sizing: border-box;
    .opear-city-setting {
        width: 100%;
        background: #fff;
        margin-top: 20px;
        padding: 20px 20px 20px 30px;
        box-sizing: border-box;
        .search-title {
            width: 200px;
            height: 40px;
            border-bottom: 1px solid #ccc;
        }
        .search-box {
            margin-top: 30px;
            .divider {
                width: 98%;
                height: 0;
                margin: 24px 0;
                border-bottom: 1px solid #dcdfe6;
            }
            .form-item-center {
                width: 100%;
                text-align: center;
                /deep/ .el-button {
                    width: 150px;
                    margin-right: 30px;
                }
            }
        }
        .table-box {
            .add-btn {
                width: 200px;
                display: none;
            }
            /deep/ .el-select {
                width: 400px;
                margin: 0 15px 20px 0;
            }
            /deep/ .el-pagination {
                text-align: center;
                margin: 30px auto;
            }
            /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
                background: transparent;
            }
            /deep/ .el-table--enable-row-hover .el-table__body tr.hover-row>td{
                background: transparent;
            }
            .submit-btn {
                text-align: center;
                /deep/ .el-button {
                    width: 150px;
                }
            }
        }
    }
}
</style>