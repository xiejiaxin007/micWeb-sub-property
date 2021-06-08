<template>
    <div
        class="collocationWrap"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        v-loading.fullscreen.lock="fullscreenLoading"
    >
        <div class="citySettingBox">
            <!-- 复制一个老城的字段常量配置到新城 -->
            <div class="shortCurtEditor">
                <h2>复制一个老城的字段常量配置到新城</h2>
                <div class="selectCityBox">
                    <span>新城市：</span>
                    <el-select
                        @change="filterItem('new')"
                        filterable
                        v-model="newCityId"
                        placeholder="请选择新城市"
                        :class="{'error':isNewCityEmpty}"
                    >
                        <el-option
                            v-for="item in newCityOption"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                    <span>老城市：</span>
                    <el-select
                        @change="filterItem('old')"
                        filterable
                        v-model="oldCityId"
                        placeholder="请选择老城市"
                        :class="{'error':isOldCityEmpty}"
                    >
                        <el-option
                            v-for="item in oldCityOption"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                    <el-button
                        @click="addCopy"
                        type="primary"
                    >添加复制</el-button>
                    <span class="confimText oldHint">{{oldEmptyHint}}</span>
                    <span class="confimText newHint">{{newEmptyHint}}</span>
                </div>
            </div>
            <!-- 地铁信息导入 -->
            <div class="staionTableBox">
                <h2>地铁信息导入</h2>
                <div class="staionTable">
                    <!-- 普通表格 -->
                    <table class="subwayTable">
                        <tr>
                            <th>ID</th>
                            <th>城市ID</th>
                            <th>地铁线路</th>
                            <th>地铁站点</th>
                            <th>站点经度</th>
                            <th>站点纬度</th>
                            <th>建成状态</th>
                        </tr>
                    </table>
                    <p class="confimText">请下载表头信息后，将对应需灌入地铁信息填写完毕后，最后将点击“导入地铁信息”选中文件灌入到居理的数据库中，新增的地铁站点没有ID给空，需要更新数据的站点信息ID写对应的地铁站点ID</p>
                    <div class="downBtn clearfix">
                        <el-button
                            class="fl"
                            @click="downloadThead"
                            type="primary"
                        >下载表头</el-button>
                        <el-upload
                            action
                            class="fl"
                            ref="upload"
                            accept=".csv"
                            :show-file-list="false"
                            :http-request="httpRequest"
                        >
                            <el-button type="primary">导入地铁信息</el-button>
                        </el-upload>
                    </div>
                    <el-upload
                        action="/backend-api/subway/delete"
                        ref="delUpload"
                        accept=".csv"
                        :show-file-list="false"
                        :on-success="onSuccess"
                        :on-error="onError"
                    >
                        <el-button type="primary">导入需要删除的地铁站点ID</el-button>
                    </el-upload>
                </div>
            </div>
            <!-- 品牌开发商映射关系 -->
            <div class="staionTableBox">
                <h2>品牌开发商映射关系</h2>
                <div class="brandMapBox">
                    <p class="confimText">操作提示：输入框中输入搜狐焦点的品牌开发商信息，对应选中与之对应居理的开发商信息，如果需要添加更多对应关系，请在下方点击添加更多对应关系即可</p>
                    <p class="confimText marb20">【注意开发商信息为全国通用信息，更改前需要和各城市运营做好同步】</p>
                    <div class="mapingForm">
                        <div
                            class="inputBox"
                            v-for="(item, index) in brandMap.brand_developer_map"
                            :key="index"
                        >
                            <el-select
                                v-model="item.julive_brand_developer"
                                filterable
                                placeholder="选择居理品牌开发商"
                            >
                                <el-option
                                    v-for="item in brandOption"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.name"
                                ></el-option>
                            </el-select>
                            <span>&lt;--&gt;</span>
                            <el-input
                                v-model="item.source_brand_developer"
                                type="text"
                                :class="{'error':item.hasError}"
                                placeholder="请输入竞对开发商信息"
                                @focus="recoverNormal(index)"
                            ></el-input>
                            <el-button
                                @click="delMap(index)"
                                size="mini"
                                type="danger"
                            >-</el-button>
                        </div>
                        <div class="addBtnbox">
                            <el-button
                                @click="addMap"
                                type="primary"
                            >添加更多对应关系</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 搜房城市拼音对应关系 -->
            <div class="staionTableBox searchSpellWrap">
                <h2>搜房城市拼音对应关系</h2>
                <ul class="searchSpellBox clearfix">
                    <li
                        class="fl"
                        v-for="(item, index) in brandMap.city_py_map"
                        :key="index"
                    >
                        <span>{{item.julive_city_name}}：</span>
                        <el-input
                            type="text"
                            placeholder="请输入"
                            v-model="item.source_city_py"
                            @input="verifyLowerCase(item.source_city_py,index)"
                        ></el-input>
                    </li>
                </ul>
                <p :class="{errorText:true, 'showOrHide':showOrHide}">竞对品牌开发商信息不能为空，且不能存在一个对应居理多个品牌开发商信息的情况，请检查！</p>
            </div>
            <div class="footer">
                <el-button @click="showDialog">取消</el-button>
                <el-button
                    @click="saveMap"
                    type="primary"
                >保存</el-button>
            </div>
        </div>
        <!--保存提醒 始-->
        <el-dialog
            :visible.sync="dialogVisibleCancleWarn"
            title="取消编辑提醒"
            width="30%"
            :center="true"
        >
            <div class="dialog-content">
                <p class="content-tex cancle-warn-tex">是否放弃编辑？</p>
            </div>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="closeDialog">我再想想</el-button>
                <el-button
                    type="primary"
                    @click="handleCancle"
                >是的</el-button>
            </div>
        </el-dialog>
        <!--保存提醒 止-->
    </div>
</template>

<script>
import {
    addCopyData,
    getBrandData,
    getBrandEditData,
    importSubwayData,
    saveData
} from '@/api/citySettingApi/cityResidueSettingApi.js';
import { getCity } from '@/api/citySettingApi/cityConfigListApi.js';
export default {
    name: 'CityResidueSetting',
    components: {},
    data () {
        return {
            // 导入loading弹窗
            fullscreenLoading: false,
            loadingText: '',
            // 复制选中新城市ID
            newCityId: '',
            // 复制选中老城市ID
            oldCityId: '',
            // 新老城公用下拉选项
            selectCityOption: [],
            // 老城市下拉选项
            oldCityOption: [],
            // 新城市下拉选项
            newCityOption: [],
            // 判断新城市是否为空
            isNewCityEmpty: false,
            // 判断老城市是否为空
            isOldCityEmpty: false,
            // 新城为空提示内容
            newEmptyHint: '',
            // 老城为空提示内容
            oldEmptyHint: '',
            // 品牌开发商下拉选项
            brandOption: [],
            // 品牌开发商映射关系
            brandMap: {},
            // 取消弹窗默认隐藏
            dialogVisibleCancleWarn: false,
            // 保存提示信息默认隐藏
            showOrHide: true,
            // 搜房城市拼音提示信息
            spellHintHide: true
        };
    },
    created () {
        // 页面加载获取新老城市选择列表
        this.getCityList();
        // 页面加载获取品牌开发商选择列表
        this.getBrandList();
        // 获取品牌开发商编辑初始列表
        this.getBrandEditList();
    },
    methods: {
        // 搜索城市拼音关系输入框验证小写字母
        verifyLowerCase (source_city_py, index) {
            this.brandMap.city_py_map[
                index
            ].source_city_py = source_city_py.replace(/[^\a-\z]/g, '');
        },
        // 去掉错误提醒
        recoverNormal (index) {
            this.brandMap.brand_developer_map[index].hasError = false;
        },
        // 保存映射接口
        async saveMap () {
            // 标识是否有不合法输入，若有不能提交检测是否有空元素
            let submitFlag = true;
            this.brandMap.brand_developer_map.forEach((val, index) => {
                if (!val.source_brand_developer) {
                    val.hasError = true;
                } else {
                    val.hasError = false;
                }
            });
            // 检测是否有重复元素
            let checkRepeatElem = [];
            this.brandMap.brand_developer_map.forEach((val, index) => {
                checkRepeatElem.push(
                    val.source_brand_developer.replace(/(^\s*)|(\s*$)/g, '')
                );
            });
            checkRepeatElem.forEach((elem, index) => {
                if (
                    checkRepeatElem.indexOf(elem) !==
                    checkRepeatElem.lastIndexOf(elem)
                ) {
                    this.brandMap.brand_developer_map[index].hasError = true;
                }
            });
            // 若存在不合法元素则不能提交
            this.brandMap.brand_developer_map.forEach((val, index) => {
                if (val.hasError) {
                    this.showOrHide = false;
                    submitFlag = false;
                }
            });
            // 否则可提交
            if (submitFlag) {
                // 展示loading
                this.fullscreenLoading = true;
                this.loadingText = '保存中...';
                this.showOrHide = true;
                // 删除自增属性
                for (
                    let i = 0, len = this.brandMap.brand_developer_map.length;
                    i < len;
                    i++
                ) {
                    delete this.brandMap.brand_developer_map[i].hasError;
                }
                try {
                    let res = await saveData(this.brandMap);
                    let result = res.data;
                    if (result.code === 0) {
                        // 保存成功重新赋值列表
                        this.getBrandEditList();
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        // 保存后跳转
                        this.$emit('skipFirst', {
                            activeName: 'first',
                            tabName: '城市开站配置'
                        });
                    } else {
                        this.$message.error(result.msg);
                    }
                    // 隐藏loading
                    this.fullscreenLoading = false;
                    this.loadingText = '';
                } catch (err) {
                    console.log(err);
                    // 展示loading
                    this.fullscreenLoading = false;
                    this.loadingText = '';
                }
            }
        },
        // 确认取消编辑
        handleCancle () {
            // 获取品牌开发商编辑初始列表
            this.getBrandEditList();
            // 关闭弹窗
            this.dialogVisibleCancleWarn = false;
        },
        // 展示取消编辑确认框
        showDialog () {
            this.dialogVisibleCancleWarn = true;
        },
        // 关闭取消编辑弹窗
        closeDialog () {
            this.dialogVisibleCancleWarn = false;
        },
        // 删除映射关系
        delMap (index) {
            this.brandMap.brand_developer_map.splice(index, 1);
        },
        // 增加映射关系
        addMap () {
            let item = {
                julive_brand_developer: '',
                source_brand_developer: '',
                hasError: false
            };
            this.brandMap.brand_developer_map.push(item);
        },
        // 导入需要删除的地铁站点ID成功回调
        onSuccess (response, file, fileList) {
            if (response.code === 0) {
                this.$message.success(response.msg);
            } else {
                this.$message.error(response.msg);
            }
        },
        // 导入需要删除的地铁站点ID失败回调
        onError () {
            this.$message.error(response.msg);
        },
        // 导入地铁信息
        async httpRequest (param) {
            // 文件大小限制
            let isLt100M = param.file.size / 1024 / 1024 <= 100;
            if (!isLt100M) {
                this.$message.error('文件大小最多100M！');
                return false;
            }
            let formData = new FormData();
            formData.append('file', param.file);
            // 展示弹窗
            this.fullscreenLoading = true;
            this.loadingText = '导入中...';
            try {
                let res = await importSubwayData(formData);
                let result = res.data;
                if (result.code === 0) {
                    this.$message({
                        message: '导入成功',
                        type: 'success'
                    });
                } else {
                    this.$message.error(result.msg);
                }
                // 隐藏弹窗
                this.fullscreenLoading = false;
                this.loadingText = '';
            } catch (err) {
                // 隐藏弹窗
                this.fullscreenLoading = false;
                this.loadingText = '';
                console.log(err);
            }
        },
        // 下载表头信息
        downloadThead () {
            window.location.href =
                'https://comjia-img.oss-cn-beijing.aliyuncs.com/Upload/subway/%E5%9C%B0%E9%93%81%E4%BF%A1%E6%81%AF%E6%A8%A1%E6%9D%BF.csv';
        },
        // 获取品牌开发商编辑初始列表
        async getBrandEditList () {
            try {
                let res = await getBrandEditData();
                let result = res.data;
                if (result.code === 0) {
                    for (
                        let i = 0, len = result.data.brand_developer.length;
                        i < len;
                        i++
                    ) {
                        result.data.brand_developer[i].hasError = false;
                    }
                    // 赋值品牌开发商映射关系
                    this.$set(
                        this.brandMap,
                        'brand_developer_map',
                        result.data.brand_developer
                    );
                    // 赋值搜索拼音城市对应关系
                    this.$set(
                        this.brandMap,
                        'city_py_map',
                        result.data.city_py
                    );
                } else {
                    console.log(result.msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 获取居理品牌开发商option列表
        async getBrandList () {
            try {
                let res = await getBrandData();
                let result = res.data;
                if (result.code === 0) {
                    this.brandOption = result.data;
                } else {
                    console.log(result.msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 请求城市接口信息
        async getCityList () {
            try {
                let res = await getCity();
                let result = res.data;
                if (result.code === 0) {
                    this.selectCityOption = result.data;
                    this.oldCityOption = JSON.parse(
                        JSON.stringify(result.data)
                    );
                    this.newCityOption = JSON.parse(
                        JSON.stringify(result.data)
                    );
                } else {
                    console.log(result.msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 过滤新老城市互斥选项
        filterItem (cityType) {
            if (cityType === 'new') {
                // 隐藏错误提示
                this.isNewCityEmpty = false;
                this.newEmptyHint = '';
                // 新城市选择旧城市排除
                this.oldCityOption = this.selectCityOption.filter(
                    item => item.id !== this.newCityId
                );
            } else if (cityType === 'old') {
                // 隐藏错误提示
                this.isOldCityEmpty = false;
                this.oldEmptyHint = '';
                // 老城市选择新城市排除
                this.newCityOption = this.selectCityOption.filter(
                    item => item.id !== this.oldCityId
                );
            }
        },
        // 点击添加复制
        async addCopy () {
            if (this.oldCityId && this.newCityId) {
                let res = await addCopyData(
                    this.oldCityId + '',
                    this.newCityId + ''
                );
                try {
                    let result = res.data;
                    if (result.code === 0) {
                        this.$message.success(result.msg);
                    } else {
                        this.$message.error(result.msg);
                    }
                } catch (err) {
                    this.$message.error(err);
                }
            } else if (!this.oldCityId && this.newCityId) {
                this.oldEmptyHint = '请选择老城市';
                this.isOldCityEmpty = true;
                setTimeout(() => {
                    this.oldEmptyHint = '';
                    this.isOldCityEmpty = false;
                }, 2000);
            } else if (this.oldCityId && !this.newCityId) {
                this.isNewCityEmpty = true;
                this.newEmptyHint = '请选择新城市';
                setTimeout(() => {
                    this.newEmptyHint = '';
                    this.isNewCityEmpty = false;
                }, 2000);
            } else {
                this.isNewCityEmpty = true;
                this.isOldCityEmpty = true;
                this.newEmptyHint = '请选择新城市';
                this.oldEmptyHint = '请选择老城市';
                setTimeout(() => {
                    this.newEmptyHint = '';
                    this.isNewCityEmpty = false;
                    this.oldEmptyHint = '';
                    this.isOldCityEmpty = false;
                }, 2000);
            }
        }
    }
};
</script>

<style lang="less" scoped>
.subwayTable {
    width: 100%;
    margin-bottom: 20px;
    table-layout: fixed;
    border-collapse: collapse;
    th {
        border: 1px solid #ebeef5;
        height: 48px;
        word-wrap: normal;
        text-overflow: ellipsis;
        vertical-align: middle;
        color: #909399;
        font-size: 14px;
    }
}
.searchSpellWrap {
    position: relative;
}
.spellHintHide {
    display: none;
}
.searchSpellBox {
    margin-bottom: 20px;
    li {
        width: 40%;
        margin: 0 20px 15px 0;
        span {
            float: left;
            height: 40px;
            line-height: 40px;
            color: #606266;
            font-size: 16px;
        }
        .el-input {
            overflow: hidden;
            display: block;
            width: auto;
        }
    }
}
.footer {
    text-align: center;
    /deep/ .el-button {
        width: 120px;
    }
}
.showOrHide {
    display: none;
}
.errorText {
    color: #f1403c;
    clear: both;
    position: absolute;
    bottom: -20px;
    left: 0;
    font-size: 14px;
}
// 弹窗公共样式 始
/deep/ .el-dialog__header {
    border-bottom: 1px solid #eaeaea;
    padding: 20px;
}
/deep/ .el-dialog--center .el-dialog__body {
    text-align: center;
}
.el-dialog {
    .content-tex {
        font-size: 18px;
        color: #666;
    }
    .single {
        width: 100%;
    }
}
/deep/ .dialog-footer .el-button {
    padding: 10px 30px;
    height: 38px;
    width: auto;
}
/deep/ .dialog-footer .el-button--default {
    background-color: #fff;
    &:link {
        background-color: #fff;
        color: #77808a;
        border: 1px solid #e6e6e6;
    }
    &:visited {
        background-color: #fff;
        color: #77808a;
        border: 1px solid #e6e6e6;
    }
    &:hover {
        background-color: #ecf5ff;
        color: #409eff;
        border: 1px solid #c6e2ff;
    }
    &:active {
        background-color: #ecf5ff;
        color: #409eff;
        border: 1px solid #c6e2ff;
    }
}
// 弹窗公共样式 止
.error {
    /deep/ .el-input__inner {
        border: 1px solid #f1403c;
        border-radius: 4px;
        color: #f1403c;
    }
}
.marb20 {
    margin-bottom: 20px;
}
.selectCityBox {
    position: relative;
    span {
        font-size: 14px;
    }
    .el-select {
        margin-right: 15px;
    }
    .newHint,
    .oldHint {
        padding-top: 7px;
        position: absolute;
        bottom: -20px;
        left: 335px;
        display: inline-block;
    }
    .newHint {
        left: 60px;
    }
}
.collocationWrap {
    width: 100%;
    padding: 20px 30px 0;
    margin: 0 auto;
    box-sizing: border-box;
    .citySettingBox {
        width: 100%;
        background: #fff;
        padding: 0 0 20px 30px;
        box-sizing: border-box;
        .confimText {
            color: red;
            font-size: 14px;
        }
        .shortCurtEditor,
        .staionTableBox {
            margin-bottom: 42px;
            & > h2 {
                width: 296px;
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #ccc;
                margin-bottom: 30px;
            }
            /deep/ .el-button--primary {
                margin: 0 10px 0 20px;
            }
        }
        .staionTableBox {
            .staionTable {
                /deep/ .el-button--primary {
                    margin-left: 0px;
                }
                .downBtn {
                    margin: 20px 0;
                }
                /deep/ .cell {
                    text-align: center;
                }
            }
            .mapingForm {
                width: 1000px;
                .inputBox {
                    float: left;
                    margin: 0 25px 30px 0;
                }
                /deep/ .el-input {
                    width: 200px;
                }
            }
            .addBtnbox {
                clear: both;
                /deep/ .el-button {
                    margin-left: 0px;
                }
            }
        }
    }
}
</style>
