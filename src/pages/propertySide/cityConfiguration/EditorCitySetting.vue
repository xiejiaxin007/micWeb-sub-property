<!--
    /**
     * @file 城市配置详情页
     * @author  XieBin
     * @date 2019.10.22
     */
 -->
<template>
    <div class="collocationWrap">
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-nav">
        <el-breadcrumb-item>
            <a href="/">首页</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/city/citySettingTab'}">城市开站配置</el-breadcrumb-item>
        <el-breadcrumb-item>城市级配置</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="citySettingBox">
            <h1><span>{{$route.query.cityName}}</span>-城市级配置</h1>
            <!-- 快捷操作 -->
            <div class="shortCurtEditor">
                <h2>快捷操作</h2>
                <div class="selectCityBox">
                    <el-select v-model="getCityvalue" placeholder="选择某个城市配置">
                        <el-option
                            v-for="item in getCityListOption"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="primary" :disabled="!getCityvalue" @click="copyOriginCity">粘贴到该城市</el-button>
                    <span class="eritorConfim">操作提示：该项操作一旦粘贴之前编辑的信息将无法恢复，请谨慎操作！</span>
                </div>
            </div>
            <!-- 抓取城市的URL地址 -->
            <div class="carpTureUrl">
                <h2>抓取城市的URL地址</h2>
                <p class="regColor">【请将各个源楼盘列表的地址参照下面的举例中的格式进行给出】</p>
                <p class="regColor">房天下地址举例：https://sh.newhouse.fang.com/house/s/</p>
                <p class="regColor">安居客地址举例：https://tj.fang.anjuke.com/loupan/all/、https://bj.xinfang.anjuke.com/lou/all/</p>
                <p class="regColor">搜狐焦点地址举例：https://gz.focus.cn/</p>
                <p class="regColor lastIpt">贝壳新房地址举例：https://bj.fang.ke.com/loupan/</p>
                <div class="carpTureUrlBox">
                    <el-form label-position="right" label-width="80px" :model="formLabelAlign">
                        <el-form-item label="房天下:">
                            <el-input v-model="formLabelAlign.houseVal"
                            @focus="cancelRules(formLabelAlign.houseVal, '1')"
                            @blur="confimUrl(formLabelAlign.houseVal, '1')">
                            </el-input>
                            <p v-show="newHouseMatchUrl" class="regColor">地址链接输入有误</p>
                        </el-form-item>
                        <el-form-item label="安居客:">
                            <el-input
                            v-model="formLabelAlign.anjuVal"
                            @focus="cancelRules(formLabelAlign.anjuVal, '2')"
                            @blur="confimUrl(formLabelAlign.anjuVal, '2')">
                            </el-input>
                            <p v-show="anjukeMatchUrl" class="regColor">地址链接输入有误</p>
                        </el-form-item>
                        <el-form-item label="搜狐焦点:">
                            <el-input
                            v-model="formLabelAlign.sohuVal"
                            @focus="cancelRules(formLabelAlign.sohuVal, '3')"
                            @blur="confimUrl(formLabelAlign.sohuVal, '3')">
                            </el-input>
                            <p v-show="sohuMatchUrl" class="regColor">地址链接输入有误</p>
                        </el-form-item>
                        <el-form-item label="贝壳新房:">
                            <el-input
                            v-model="formLabelAlign.beikeVal"
                            @focus="cancelRules(formLabelAlign.beikeVal, '5')"
                            @blur="confimUrl(formLabelAlign.beikeVal, '5')"></el-input>
                            <p v-show="beikeMatchUrl" class="regColor">地址链接输入有误</p>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- 区域映射关系 -->
            <div class="areaMaping">
                <h2>区域映射关系</h2>
                <p class="regColor lastIpt">操作提示：请在下面各竞对的区域输入框中，输入对应竞对的区域名称，当竞对多个区域对应居理一个区域的时候，请选中后添加多个。如果竞对无该区域，请在输入或在下拉中选中竞对无该区域</p>
                <div class="areaMapingBox">
                    <el-table
                    :data="areaMapData"
                    border
                    highlight-current-row
                    @cell-click="columoClick"
                    style="width: 100%">
                    <el-table-column
                        prop="julive_district_text"
                        label="居理"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column align="center">
                        <!-- 自定义表头 -->
                        <template
                            slot="header"
                            slot-scope="scope">
                            <span>房天下</span>
                            <el-button
                                type="text"
                                @click="copyClick1('1')">
                                复制
                            </el-button>
                            <el-button
                                type="text"
                                @click="copyClick(scope, '1', allData.district_map)">
                                粘贴
                            </el-button>
                        </template>
                        <!-- 列数据 -->
                        <template slot-scope="scope">
                            <div
                                v-for="(item, index) in scope.row.data['1']"
                                :key="index">
                                <div
                                    v-if="districtTextContIsShow(scope.row.data['1'])"
                                    :class="{'update-area-style': classIsReduce(item.trade_area_name, item.url)}">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['1'][index].district_name">
                                    </el-input>
                                    <span v-if="item.trade_area_name !== undefined || item.url !== undefined">
                                        <el-input
                                            type="text"
                                            v-model="scope.row.data['1'][index].trade_area_name">
                                        </el-input>
                                        <el-input
                                            type="text"
                                            v-model="scope.row.data['1'][index].url"
                                            @blur="blurRegUrl(scope.row.data['1'][index].url, '1')">
                                        </el-input>
                                    </span>
                                    <el-button
                                        v-if="item.trade_area_name !== undefined || item.url !== undefined"
                                        type="text"
                                        size="mini"
                                        @click="removeAreaIpt(scope.row.data['1'], index)">
                                    -板块</el-button>
                                    <el-button
                                        v-else
                                        type="text"
                                        size="mini"
                                        @click="addAreaIpt(scope.row.data['1'], index)">
                                    +板块</el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['1'], index)">
                                    删除</el-button>
                                </div>
                                <div v-else>
                                    该竞对无此区域
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="updateAddInput(scope.row.data['1'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['1']"
                                    :disabled="isDisabled(scope.row.data['1'])"
                                    @change="areaHandleChange(scope.row, '1', scope.row.index)">
                                    该竞对无此区域
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center">
                        <!-- 自定义表头 -->
                        <template
                            slot="header"
                            slot-scope="scope">
                            <span>安居客</span>
                            <el-button
                                type="text"
                                @click="copyClick1('2')">
                                复制
                            </el-button>
                            <el-button
                                type="text"
                                @click="copyClick(scope, '2', allData.district_map)">
                                粘贴
                            </el-button>
                        </template>
                        <template slot-scope="scope">
                            <div
                                v-for="(item, index) in scope.row.data['2']"
                                :key="index">
                                <div
                                    v-if="districtTextContIsShow(scope.row.data['2'])"
                                    :class="{'update-area-style': classIsReduce(item.trade_area_name, item.url)}">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['2'][index].district_name">
                                    </el-input>
                                    <span
                                        v-if="item.trade_area_name !== undefined || item.url !== undefined"
                                        :class="{'update-area-style': classIsReduce(item.trade_area_name, item.url)}">
                                        <el-input
                                            type="text"
                                            v-model="scope.row.data['2'][index].trade_area_name">
                                        </el-input>
                                        <el-input
                                            type="text"
                                            v-model="scope.row.data['2'][index].url"
                                            @blur="blurRegUrl(scope.row.data['2'][index].url, '2')">
                                        </el-input>
                                    </span>
                                    <el-button
                                        v-if="item.trade_area_name !== undefined || item.url !== undefined"
                                        type="text"
                                        size="mini"
                                        @click="removeAreaIpt(scope.row.data['2'], index)">
                                    -板块</el-button>
                                    <el-button
                                        v-else
                                        type="text"
                                        size="mini"
                                        @click="addAreaIpt(scope.row.data['2'], index)">
                                    +板块</el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['2'], index)">
                                    删除</el-button>
                                </div>
                                <div v-else>
                                    该竞对无此区域
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="updateAddInput(scope.row.data['2'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['2']"
                                    :disabled="isDisabled(scope.row.data['2'])"
                                    @change="areaHandleChange(scope.row, '2', scope.row.index)">
                                    该竞对无此区域
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>搜狐焦点</span>
                            <el-button
                                type="text"
                                @click="copyClick1('3')">
                                复制
                            </el-button>
                            <el-button
                                type="text"
                                @click="copyClick(scope, '3', allData.district_map)">
                                粘贴
                            </el-button>
                        </template>
                        <template slot-scope="scope">
                            <div
                                v-for="(item, index) in scope.row.data['3']"
                                :key="index">
                                <div
                                    v-if="districtTextContIsShow(scope.row.data['3'])"
                                    :class="{'update-area-style': classIsReduce(item.trade_area_name, item.url)}">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['3'][index].district_name">
                                    </el-input>
                                    <span v-if="item.trade_area_name !== undefined || item.url !== undefined">
                                        <el-input
                                            type="text"
                                            v-model="scope.row.data['3'][index].trade_area_name">
                                        </el-input>
                                        <el-input
                                            type="text"
                                            v-model="scope.row.data['3'][index].url"
                                            @blur="blurRegUrl(scope.row.data['3'][index].url, '3')">
                                        </el-input>
                                    </span>
                                    <el-button
                                        v-if="item.trade_area_name !== undefined || item.url !== undefined"
                                        type="text"
                                        size="mini"
                                        @click="removeAreaIpt(scope.row.data['3'], index)">
                                    -板块</el-button>
                                    <el-button
                                        v-else
                                        type="text"
                                        size="mini"
                                        @click="addAreaIpt(scope.row.data['3'], index)">
                                    +板块</el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['3'], index)">
                                    删除</el-button>
                                </div>
                                <div v-else>
                                    该竞对无此区域
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="updateAddInput(scope.row.data['3'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['3']"
                                    :disabled="isDisabled(scope.row.data['3'])"
                                    @change="areaHandleChange(scope.row, '3', scope.row.index)">
                                    该竞对无此区域
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center">
                        <!-- 自定义表头 -->
                        <template
                            slot="header"
                            slot-scope="scope">
                            <span>贝壳新房</span>
                            <el-button
                                type="text"
                                @click="copyClick1('5')">
                                复制
                            </el-button>
                            <el-button
                                type="text"
                                @click="copyClick(scope,'5', allData.district_map)">
                                粘贴
                            </el-button>
                        </template>
                        <template slot-scope="scope">
                            <div
                                v-for="(item, index) in scope.row.data['5']"
                                :key="index">
                                <div
                                    v-if="districtTextContIsShow(scope.row.data['5'])"
                                    :class="{'update-area-style': classIsReduce(item.trade_area_name, item.url)}">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['5'][index].district_name">
                                    </el-input>
                                    <span v-if="item.trade_area_name !== undefined || item.url !== undefined">
                                        <el-input
                                            type="text"
                                            v-model="scope.row.data['5'][index].trade_area_name">
                                        </el-input>
                                        <el-input
                                            type="text"
                                            v-model="scope.row.data['5'][index].url"
                                            @blur="blurRegUrl(scope.row.data['5'][index].url, '5')">
                                        </el-input>
                                    </span>
                                    <el-button
                                        v-if="item.trade_area_name !== undefined || item.url !== undefined"
                                        type="text"
                                        size="mini"
                                        @click="removeAreaIpt(scope.row.data['5'], index)">
                                    -板块</el-button>
                                    <el-button
                                        v-else
                                        type="text"
                                        size="mini"
                                        @click="addAreaIpt(scope.row.data['5'], index)">
                                    +板块</el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['5'], index)">
                                    删除</el-button>
                                </div>
                                <div v-else>
                                    该竞对无此区域
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="updateAddInput(scope.row.data['5'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['5']"
                                    :disabled="isDisabled(scope.row.data['5'])"
                                    @change="areaHandleChange(scope.row, '5', scope.row.index)">
                                    该竞对无此区域
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    </el-table>
                </div>
            </div>
            <!-- 业态映射关系 -->
            <div class="areaMaping">
                <h2>业态映射关系</h2>
                <p class="regColor lastIpt">操作提示：请在下面各竞对的业态输入框中，输入对应竞对的业态名称，当竞对多个业态对应居理一个业态的时候，请选中后添加多个。如果竞对无该业态，请在输入或在下拉中选中竞对无该业态</p>
                <div class="areaMapingBox">
                    <el-table
                    id="areaTable"
                    :data="commercialMapData"
                    border
                    highlight-current-row
                    @cell-click="columoClick"
                    style="width: 100%">
                    <el-table-column prop="julive_project_type_text" label="居理" align="center" width="140">
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>房天下</span>
                            <el-button type="text" @click="copyClick1('1')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '1', allData.project_type_map)">粘贴</el-button>
                        </template>
                        <!-- 列数据 -->
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['1']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['1'])">
                                    <el-input type="text" v-model="scope.row.data['1'][index]"></el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['1'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此业态
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button type="primary" size="mini" @click="addInput(scope.row.data['1'])">+</el-button>
                                <el-checkbox
                                    v-model="scope.row.data['1']"
                                    :disabled="isDisabled(scope.row.data['1'])"
                                    @change="handleChange(scope.row, '1', scope.row.index)">
                                    该竞对无此业态
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>安居客</span>
                            <el-button type="text" @click="copyClick1('2')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '2', allData.project_type_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['2']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['2'])">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['2'][index]">
                                    </el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['2'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此业态
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="addInput(scope.row.data['2'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['2']"
                                    :disabled="isDisabled(scope.row.data['2'])"
                                    @change="handleChange(scope.row, '2', scope.row.index)">
                                    该竞对无此业态
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>搜狐焦点</span>
                            <el-button type="text" @click="copyClick1('3')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '3', allData.project_type_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['3']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['3'])">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['3'][index]">
                                    </el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['3'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此业态
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="addInput(scope.row.data['3'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['3']"
                                    :disabled="isDisabled(scope.row.data['3'])"
                                    @change="handleChange(scope.row, '3', scope.row.index)">
                                    该竞对无此业态
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="贝壳新房" :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>贝壳新房</span>
                            <el-button type="text" @click="copyClick1('5')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope,'5', allData.project_type_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['5']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['5'])">
                                    <el-input type="text" v-model="scope.row.data['5'][index]"></el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['5'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此业态
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button type="primary" size="mini" @click="addInput(scope.row.data['5'])">+</el-button>
                                <el-checkbox
                                    v-model="scope.row.data['5']"
                                    :disabled="isDisabled(scope.row.data['5'])"
                                    @change="handleChange(scope.row, '5', scope.row.index)">该竞对无此业态</el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    </el-table>
                </div>
            </div>
            <!-- 城市环线映射关系 -->
            <div class="areaMaping">
                <h2>城市环线映射关系</h2>
                <p class="regColor lastIpt">操作提示：请在下面各竞对的环线输入框中，输入对应竞对的环线名称，当竞对多个环线对应居理一个环线的时候，请选中后添加多个。如果竞对无该环线，请在输入或在下拉中选中竞对无该环线</p>
                <div class="areaMapingBox">
                    <el-table
                    id="areaTable"
                    :data="cityLoopLineMapData"
                    border
                    highlight-current-row
                    @cell-click="columoClick"
                    style="width: 100%">
                    <el-table-column prop="julive_ring_road_text" label="居理" align="center" width="140">
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>房天下</span>
                            <el-button type="text" @click="copyClick1('1')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '1', allData.ring_road_map)">粘贴</el-button>
                        </template>
                        <!-- 列数据 -->
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['1']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['1'])">
                                    <el-input type="text" v-model="scope.row.data['1'][index]"></el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['1'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无该环线
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button type="primary" size="mini" @click="addInput(scope.row.data['1'])">+</el-button>
                                <el-checkbox
                                    v-model="scope.row.data['1']"
                                    :disabled="isDisabled(scope.row.data['1'])"
                                    @change="handleChange(scope.row, '1', scope.row.index)">
                                    该竞对无该环线
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>安居客</span>
                            <el-button type="text" @click="copyClick1('2')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '2', allData.ring_road_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['2']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['2'])">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['2'][index]">
                                    </el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['2'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无该环线
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="addInput(scope.row.data['2'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['2']"
                                    :disabled="isDisabled(scope.row.data['2'])"
                                    @change="handleChange(scope.row, '2', scope.row.index)">
                                    该竞对无该环线
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>搜狐焦点</span>
                            <el-button type="text" @click="copyClick1('3')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '3', allData.ring_road_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['3']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['3'])">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['3'][index]">
                                    </el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['3'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无该环线
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="addInput(scope.row.data['3'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['3']"
                                    :disabled="isDisabled(scope.row.data['3'])"
                                    @change="handleChange(scope.row, '3', scope.row.index)">
                                    该竞对无该环线
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="贝壳新房" :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>贝壳新房</span>
                            <el-button type="text" @click="copyClick1('5')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope,'5', allData.ring_road_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['5']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['5'])">
                                    <el-input type="text" v-model="scope.row.data['5'][index]"></el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['5'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无该环线
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button type="primary" size="mini" @click="addInput(scope.row.data['5'])">+</el-button>
                                <el-checkbox
                                    v-model="scope.row.data['5']"
                                    :disabled="isDisabled(scope.row.data['5'])"
                                    @change="handleChange(scope.row, '5', scope.row.index)">该竞对无该环线</el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    </el-table>
                </div>
            </div>
            <!-- 城市板块对灌入 -->
            <div class="carpTureUrl">
                <h2>城市板块灌入</h2>
                <div class="carpTureUrlBox">
                    <span class="isTraedArea">居理板块信息是否参照安居客并精确匹配一致时可灌入到居理中:</span>
                    <el-radio v-model="cityRadio" label="1">参照，灌入到居理</el-radio>
                    <el-radio v-model="cityRadio" label="0">不参照</el-radio>
                </div>
            </div>
            <!-- 南方城市 -->
            <div class="carpTureUrl">
                <h2>供暖城市</h2>
                <div class="carpTureUrlBox">
                    <span class="isTraedArea">该城市是否为供暖城市:</span>
                    <el-radio v-model="nothCityRadio" label="1">是</el-radio>
                    <el-radio v-model="nothCityRadio" label="0">否</el-radio>
                </div>
            </div>
            <!-- 楼盘标签映射关系 -->
            <div class="areaMaping">
                <h2>楼盘标签映射关系</h2>
                <p class="regColor lastIpt">操作提示：请在下面各竞对的楼盘标签输入框中，输入对应竞对的楼盘标签名称，当竞对多个楼盘标签对应居理一个楼盘标签的时候，请选中后添加多个。如果需添加更多的楼盘标签对应关系，请在下方选择对应的标签后点击增加按钮，对应已经废弃的标签可以选择移除对应关系。</p>
                <div class="areaMapingBox">
                    <el-table
                    id="areaTable"
                    :data="cityhousesMapData"
                    border
                    highlight-current-row
                    @cell-click="columoClick"
                    style="width: 100%">
                    <el-table-column prop="julive_project_tag_text" label="居理" align="center" width="140">
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>房天下</span>
                            <el-button type="text" @click="copyClick1('1')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '1', allData.project_tags_map)">粘贴</el-button>
                        </template>
                        <!-- 列数据 -->
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['1']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['1'])">
                                    <el-input type="text" v-model="scope.row.data['1'][index]"></el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['1'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此楼盘标签
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button type="primary" size="mini" @click="addInput(scope.row.data['1'])">+</el-button>
                                <el-checkbox
                                    v-model="scope.row.data['1']"
                                    :disabled="isDisabled(scope.row.data['1'])"
                                    @change="handleChange(scope.row, '1', scope.row.index)">
                                    该竞对无此楼盘标签
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>安居客</span>
                            <el-button type="text" @click="copyClick1('2')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '2', allData.project_tags_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['2']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['2'])">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['2'][index]">
                                    </el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['2'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此楼盘标签
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="addInput(scope.row.data['2'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['2']"
                                    :disabled="isDisabled(scope.row.data['2'])"
                                    @change="handleChange(scope.row, '2', scope.row.index)">
                                    该竞对无此楼盘标签
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>搜狐焦点</span>
                            <el-button type="text" @click="copyClick1('3')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '3', allData.project_tags_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['3']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['3'])">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['3'][index]">
                                    </el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['3'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此楼盘标签
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="addInput(scope.row.data['3'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['3']"
                                    :disabled="isDisabled(scope.row.data['3'])"
                                    @change="handleChange(scope.row, '3', scope.row.index)">
                                    该竞对无此楼盘标签
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="贝壳新房" :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>贝壳新房</span>
                            <el-button type="text" @click="copyClick1('5')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope,'5', allData.project_tags_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['5']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['5'])">
                                    <el-input type="text" v-model="scope.row.data['5'][index]"></el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['5'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此楼盘标签
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button type="primary" size="mini" @click="addInput(scope.row.data['5'])">+</el-button>
                                <el-checkbox
                                    v-model="scope.row.data['5']"
                                    :disabled="isDisabled(scope.row.data['5'])"
                                    @change="handleChange(scope.row, '5', scope.row.index)">该竞对无此楼盘标签</el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" :resizable="false" width="100" align="center">
                        <template slot-scope="scope">
                            <div>
                                <el-button type="text" @click="removeLine(scope.row, scope.$index, allData.project_tags_map)">移除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                    </el-table>
                    <!-- 增加居理楼盘便签 -->
                    <div class="selectBox">
                        <el-select
                            v-model="houseTagVal"
                            placeholder="选择居理楼盘标签"
                            value-key="name"
                            @focus="getHouseTags">
                            <el-option
                                v-for="item in houseSelectData"
                                :key="item.id"
                                :label="item.name"
                                :value="item">
                            </el-option>
                        </el-select>
                        <el-button
                            type="primary"
                            :disabled="!houseTagVal.name"
                            @click="addJuliveHousesTags">
                            增加居理楼盘标签
                        </el-button>
                    </div>
                </div>
            </div>
            <!-- 户型标签映射关系 -->
            <div class="areaMaping">
                <h2>户型标签映射关系</h2>
                <p class="regColor lastIpt">操作提示：请在下面各竞对的户型标签输入框中，输入对应竞对的户型标签名称，当竞对多个户型标签对应居理一个户型标签的时候，请选中后添加多个。如果需添加更多的户型标签对应关系，请在下方选择对应的标签后点击增加按钮，对应已经废弃的标签可以选择移除对应关系。</p>
                <div class="areaMapingBox">
                    <el-table
                    id="areaTable"
                    :data="cityhousTypeMapData"
                    border
                    highlight-current-row
                    @cell-click="columoClick"
                    style="width: 100%">
                    <el-table-column prop="julive_house_tag_text" label="居理" align="center" width="140">
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>房天下</span>
                            <el-button type="text" @click="copyClick1('1')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '1', allData.house_tags_map)">粘贴</el-button>
                        </template>
                        <!-- 列数据 -->
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['1']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['1'])">
                                    <el-input type="text" v-model="scope.row.data['1'][index]"></el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['1'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此户型标签
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button type="primary" size="mini" @click="addInput(scope.row.data['1'])">+</el-button>
                                <el-checkbox
                                    v-model="scope.row.data['1']"
                                    :disabled="isDisabled(scope.row.data['1'])"
                                    @change="handleChange(scope.row, '1', scope.row.index)">
                                    该竞对无此户型标签
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>安居客</span>
                            <el-button type="text" @click="copyClick1('2')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '2', allData.house_tags_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['2']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['2'])">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['2'][index]">
                                    </el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['2'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此户型标签
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="addInput(scope.row.data['2'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['2']"
                                    :disabled="isDisabled(scope.row.data['2'])"
                                    @change="handleChange(scope.row, '2', scope.row.index)">
                                    该竞对无此户型标签
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>搜狐焦点</span>
                            <el-button type="text" @click="copyClick1('3')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope, '3', allData.house_tags_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['3']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['3'])">
                                    <el-input
                                        type="text"
                                        v-model="scope.row.data['3'][index]">
                                    </el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['3'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此户型标签
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="addInput(scope.row.data['3'])">
                                    +
                                </el-button>
                                <el-checkbox
                                    v-model="scope.row.data['3']"
                                    :disabled="isDisabled(scope.row.data['3'])"
                                    @change="handleChange(scope.row, '3', scope.row.index)">
                                    该竞对无此户型标签
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="贝壳新房" :resizable="false" align="center">
                        <!-- 自定义表头 -->
                        <template slot="header" slot-scope="scope">
                            <span>贝壳新房</span>
                            <el-button type="text" @click="copyClick1('5')">复制</el-button>
                            <el-button type="text" @click="copyClick(scope,'5', allData.house_tags_map)">粘贴</el-button>
                        </template>
                        <template slot-scope="scope">
                            <div v-for="(item, index) in scope.row.data['5']" :key="index">
                                <p v-if="textContIsShow(scope.row.data['5'])">
                                    <el-input type="text" v-model="scope.row.data['5'][index]"></el-input>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="deleteInput(scope.row.data['5'],index)">
                                    删除</el-button>
                                </p>
                                <div v-else>
                                    该竞对无此户型标签
                                </div>
                            </div>
                            <div class="addBtn">
                                <el-button type="primary" size="mini" @click="addInput(scope.row.data['5'])">+</el-button>
                                <el-checkbox
                                    v-model="scope.row.data['5']"
                                    :disabled="isDisabled(scope.row.data['5'])"
                                    @change="handleChange(scope.row, '5', scope.row.index)">该竞对无此户型标签</el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" :resizable="false" width="100" align="center">
                        <template slot-scope="scope">
                            <div>
                                <el-button type="text" @click="removeLine(scope.row, scope.$index, allData.house_tags_map)">移除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                    </el-table>
                    <!-- 增加居理户型便签 -->
                    <div class="selectBox">
                        <el-select
                            v-model="houseTypeTagVal"
                            placeholder="选择居理户型标签"
                            @focus="getHouseTypeTags">
                            <el-option
                                v-for="(item,index) in houseTypeSelectData"
                                :key="index"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                        <el-button type="primary" :disabled="!houseTypeTagVal" @click="addJuliveHousTypeTags">增加居理户型标签</el-button>
                    </div>
                </div>
            </div>
            <!-- 提交按钮 -->
            <div class="footer">
                <el-button @click="cancelDialog=true">取消</el-button>
                <el-button type="primary" @click="submitInfo">保存</el-button>
            </div>
        </div>
        <div class="dialog">
        <!-- 取消提示框 -->
        <el-dialog
            title="提示"
            :visible.sync="cancelDialog"
            width="30%">
            <span>是否取消本次编辑！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDialog = false">取 消</el-button>
                <el-button type="primary" @click="cancelEdit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="delDialog"
            width="30%">
            <span>是否确认删除！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialog = false">取 消</el-button>
                <el-button type="primary" @click="delEdit">确 定</el-button>
            </span>
        </el-dialog>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import {
    getCitySettingData,
    getHouseTagsData,
    getHouseTypeTagsData,
    getCityListData,
    copyOriginCityData,
    saveCityInfoData
    } from '../../../api/citySettingApi/editorCitySettingApi'
export default {
    name: 'editorCitySetting',
    data () {
      return {
        // 板块输入框样式是否显示
        isAreaShow: true,
        // 删除提示框
        delDialog: false,
        // 取消编辑提示框
        cancelDialog: false,
        // 获取城市下拉框
        getCityListOption: [],
        getCityvalue: '',
        // URL输入框
        formLabelAlign: {
          houseVal: '',
          anjuVal: '',
          sohuVal: '',
          beikeVal: ''
        },
        // 获取全部数据
        allData: {},
        // 复制table列的index
        copyIndex: null,
        // 抓取URL地址正则验证
        newHouseMatchUrl: false,
        anjukeMatchUrl: false,
        sohuMatchUrl: false,
        beikeMatchUrl: false,
        // 区域映射关系表格数据
        areaMapData: [],
        // 业态映射关系表格数据
        commercialMapData: [],
        // 城市环线关系表格数据
        cityLoopLineMapData: [],
        // 楼盘标签映射关系表格数据
        cityhousesMapData: [],
        // 户型标签映射关系表格数据
        cityhousTypeMapData: [],
        // 城市板块对灌入单选框
        cityRadio: '',
        // 南方城市单选框
        nothCityRadio: '',
        // 楼盘便签下拉数据
        houseSelectData: [],
        // 楼盘标签下拉val
        houseTagVal: {
            id: '',
            name: ''
        },
        // 户型便签下拉数据
        houseTypeSelectData: [],
        // 户型标签下拉val
        houseTypeTagVal: '',
      }
    },
    mounted () {
        // 获取城市配置信息详情
        this.getCitySettingInfo()
        // 获取已完成城市列表请求
        this.getCityList()
    },
    methods: {
        /**
         * 西安城市信息转移需求开发
         * @updatetime 2019.10.23
         * @author xiebin
         */
        /**
         * 输入框class变换
         * @param {string} areaName 区域名
         * @param {string} areaUrl 区域url
         */
        classIsReduce(areaName, areaUrl) {
            return (areaName !== undefined || areaUrl !== undefined) ? this.isAreaShow = true : this.isAreaShow = false;
        },
        /**
         * 区域映射点击添加按钮触发
         * @param {array} scope 当前单元格的数据
         */
        updateAddInput (scope) {
            if((scope[0] && scope[0].district_name == '-99') || scope[0] === true){
                scope.length = 0
            }
            scope.push({
                district_name: ''
            });
        },
        /**
         * 添加板块
         * @param {array} scope 当前单元格数据 
         * @param {number} index 当前输入框的index 
         */
        addAreaIpt(scope, index) {
            let obj = {
                district_name: scope[index].district_name,
                trade_area_name: '',
                url: ''
            }
            this.$set(scope, index, obj);
        },
        /**
         * 删除板块
         * @param {array} scope 当前单元格数据 
         * @param {number} index 当前输入框的index 
         */
        removeAreaIpt(scope, index) {
            let obj = {
                district_name: scope[index].district_name,
            }
            this.$set(scope, index, obj);
        },
        /**
         * 区域映射该竞对无区域是否展示
         * @param {string || Number} item 表格下input的val
         */
        districtTextContIsShow (item) {
            if(item[0].district_name && item[0].district_name === '-99') {
                return false;
            } else if (item[0] === true) {
                return false;
            } else {
                return true;
            }
        },
        /**
         * 点击区域表格checkbox触发
         * @param {boolean} allrow  当前行的内容
         * @param {array} colIndex 当前列的索引
         * @param {number} index 当前的行的索引
         */
        areaHandleChange (allrow, colIndex,index) {
            let obj = {
                district_name: '-99'
            }
            this.$set(allrow.data[colIndex], 0 , obj);
        },
        /**
         * 板块URL失去焦点校验
         * @param {string} url 当前输入框的url
         * @param {string} originName 当前点击的源区域
         */
        blurRegUrl(url, originName) {
            // 搜房正则
            let newHouseReg = /^https?:\/\/(\w+\.)?newhouse\.fang\.com\/house\/s\/\w+\/$/;
            // 安居客正则
            let anjukeReg = /^https:\/\/\w+\.fang\.anjuke\.com\/loupan\/\w+\_\d+\//;
            // 安居客正则
            let anjukeRegSecond = /^https:\/\/\w+\.xinfang\.anjuke\.com\/lou\/\w+\_\d+\//;
            // 搜狐正则
            let searchRelaReg = /^https?:\/\/(\w+\.)?focus\.cn\/baseApi\/searchRelatedProject/;
            // 贝壳
            let beikeReg = /^https?:\/\/(\w+\.)?fang\.ke\.com\/loupan\/\w+\/co51/;
            if (url !== '' && originName === '1') {
                if(!newHouseReg.test(url)) {
                    alert('搜房区域对应填写的板块URL地址不符合正则关系，请重新填写!');
                    return;
                }
            } else if (url !== '' && originName === '2') {
                if(!(anjukeReg.test(url) || anjukeRegSecond.test(url))) {
                    alert('安居客区域对应填写的板块URL地址不符合正则关系，请重新填写!');
                    return;
                }
            } else if (url !== '' && originName === '3') {
                if(!searchRelaReg.test(url)) {
                    alert('搜狐区域对应填写的板块URL地址不符合正则关系，请重新填写!');
                    return;
                }
            } else if (url !== '' && originName === '5') {
                if(!beikeReg.test(url)) {
                    alert('贝壳区域对应填写的板块URL地址不符合正则关系，请重新填写!');
                    return;
                }
            }
        },
        /** END */
        // 获取已完成城市列表
        async getCityList () {
            try {
                let result = await getCityListData()
                let {data} = result
                if (data.code === 0) {
                    this.getCityListOption = data.data
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        // 点击粘贴到该城市
        async copyOriginCity () {
            let params = {
                from_city_id: this.getCityvalue,
                target_city_id: this.$route.query.id
            }
            try {
                let result = await copyOriginCityData(params)
                let { data } = result
                if (data.code === 0) {
                    // 获取全部数据
                    this.allData = data.data
                    // 获取业态映射关系数据
                    this.commercialMapData = this.allData.project_type_map
                    // 获取城市环线映射关系数据
                    this.cityLoopLineMapData = this.allData.ring_road_map
                    // 城市板块对灌入
                    this.cityRadio = this.allData.is_inject_trade_area
                    // 是否是南方城市
                    this.nothCityRadio = this.allData.is_heating_city
                    // 楼盘标签映射关系数据
                    this.cityhousesMapData = this.allData.project_tags_map
                    // 户型标签映射关系数据
                    this.cityhousTypeMapData = this.allData.house_tags_map
                    // 清空下拉框val
                    this.getCityvalue = ''
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        // 获取城市配置信息详情
        async getCitySettingInfo () {
            // 获取城市Id
            let cityID = this.$route.query.id
            try {
                let result = await getCitySettingData(cityID)
                let { data } = result
                if(data.code === 0) {
                    // 获取全部数据
                    this.allData = data.data
                    // 获取URL地址数据
                    this.formLabelAlign.houseVal = this.allData.spider_url['1']
                    this.formLabelAlign.anjuVal = this.allData.spider_url['2']
                    this.formLabelAlign.sohuVal = this.allData.spider_url['3']
                    this.formLabelAlign.beikeVal = this.allData.spider_url['5']
                    // 获取区域映射关系数据
                    this.areaMapData = this.allData.district_map
                    // 获取业态映射关系数据
                    this.commercialMapData = this.allData.project_type_map
                    // 获取城市环线映射关系数据
                    this.cityLoopLineMapData = this.allData.ring_road_map
                    // 城市板块对灌入
                    this.cityRadio = this.allData.is_inject_trade_area
                    // 是否是南方城市
                    this.nothCityRadio = this.allData.is_heating_city
                    // 楼盘标签映射关系数据
                    this.cityhousesMapData = this.allData.project_tags_map
                    // 户型标签映射关系数据
                    this.cityhousTypeMapData = this.allData.house_tags_map
                } else {
                    console.log(data.msg)
                }
            }
            catch(error) {
                console.log(error)
            }
            
        },
        /**
         * 抓取城市URL地址正则验证
         * @params {string} cityUrl 抓取城市URL
         * @params {string} inputNum 点击源
         */
        confimUrl (cityUrl,inputNum) {
            let newHouseReg = /^http[s]?:\/\/[a-z]{1,10}\.newhouse\.fang\.com\/house\/s/
            let newHouseRegBj = /^http[s]?:\/\/newhouse\.fang\.com\/house\/s/
            let anjukeReg = /^http[s]?:\/\/[a-z]{1,10}\.fang\.anjuke\.com\/loupan\/all/
            let anjukeRegSecond = /^http[s]?:\/\/[a-z]{1,10}\.xinfang\.anjuke\.com\/lou\/all/
            let souhuRegBj = /^http[s]?:\/\/house\.focus\.cn/
            let souhuRegsz = /^http[s]?:\/\/[a-z]{1,10}\.focus\.cn/
            let beikeReg = /^http[s]?:\/\/[a-z]{1,10}\.fang\.ke\.com\/loupan/
            if (inputNum === '1') {
                (newHouseReg.test(cityUrl) || newHouseRegBj.test(cityUrl)) ? this.newHouseMatchUrl = false : this.newHouseMatchUrl = true
                return
            } else if (inputNum === '2') {
                (anjukeReg.test(cityUrl) || anjukeRegSecond.test(cityUrl)) ? this.anjukeMatchUrl = false : this.anjukeMatchUrl = true
                return
            } else if (inputNum === '3') {
                (souhuRegBj.test(cityUrl) || souhuRegsz.test(cityUrl)) ? this.sohuMatchUrl = false : this.sohuMatchUrl = true
                return
            } else if (inputNum === '5') {
                beikeReg.test(cityUrl) ? this.beikeMatchUrl = false : this.beikeMatchUrl = true
                return
            }
        },
        /**
         * 抓取城市URL地址正则验证
         * @params {string} **Url 抓取城市URL
         */
        saveRluesUrl (houseUrl,anjukeUrl,sohuUrl,beikeUrl) {
            let newHouseReg = /^http[s]?:\/\/[a-z]{1,10}\.newhouse\.fang\.com\/house\/s/
            let newHouseRegBj = /^http[s]?:\/\/newhouse\.fang\.com\/house\/s/
            let anjukeReg = /^http[s]?:\/\/[a-z]{1,10}\.fang\.anjuke\.com\/loupan\/all/
            let anjukeRegSecond = /^http[s]?:\/\/[a-z]{1,10}\.xinfang\.anjuke\.com\/lou\/all/
            let souhuRegBj = /^http[s]?:\/\/house\.focus\.cn/
            let souhuRegsz = /^http[s]?:\/\/[a-z]{1,10}\.focus\.cn/
            let beikeReg = /^http[s]?:\/\/[a-z]{1,10}\.fang\.ke\.com\/loupan/
            let flag = true
            if (!(newHouseReg.test(houseUrl) || newHouseRegBj.test(houseUrl))) {
                this.newHouseMatchUrl = true
                flag = false
            } else if (!(anjukeReg.test(anjukeUrl) || anjukeRegSecond.test(anjukeUrl))) {
                this.anjukeMatchUrl = true
                flag = false
            } else if (!(souhuRegsz.test(sohuUrl) || souhuRegBj.test(sohuUrl))) {
                this.sohuMatchUrl = true
                flag = false
            } else if (!beikeReg.test(beikeUrl)) {
                this.beikeMatchUrl = true
                flag = false
            }
            return flag
        },
        // 获取焦点之后重置校验显示
        cancelRules (cityUrl,inputNum) {
            this.confimUrl(cityUrl,inputNum)
        },
        /**
         * 获取当前元素的其他兄弟元素
         * @params [Object] elem 选择的当前元素
         */
        siblingElems(elem){
            var nodes=[ ];
            var _elem=elem;
            while((elem=elem.previousSibling)){
                if(elem.nodeType==1){
                    nodes.push(elem);
                }
            }
            var elems = _elem;
            while((elems = elems.nextSibling)){
                if(elems.nodeType == 1){
                    nodes.push(elems);
                }
            }
            return nodes
        },
        /**
         * 点击当前单元格
         * @params {array} row 当前行的数据
         * @params {array} column 当前列的数据
         * @params {array} cell 当前的dom
         */
        columoClick (row, column, cell, event) {
            // 点击当前的单元格
            let cellDiv = cell.childNodes[0]
            let addDiv = cellDiv.querySelector('.addBtn')
            if(addDiv) {
                addDiv.style.display = 'block'
            }
            let allCell = this.siblingElems(cell)
            allCell.map(e=>{
                if(e.childNodes[0].querySelector('.addBtn')){
                    e.childNodes[0].querySelector('.addBtn').style.display = 'none'
                }
            })
            cell.style.background = 'rgb(190,210,253)'
            this.siblingElems(cell).map(e=>{
                e.style.background = 'rgb(245,249,253)'
            })
            // 其他行的全部隐藏
            let trRow = this.siblingElems(cell.parentNode)
            for(let i = 0;i < trRow.length; i++) {
                for(let j= 0;j<trRow[i].children.length;j++){
                    trRow[i].children[j].style.background = '#fff'
                    if(trRow[i].children[j].querySelector('.addBtn')){
                        trRow[i].children[j].querySelector('.addBtn').style.display = 'none'
                    }
                }
            }
            // 其他表格的样式全部隐藏
            let parentNode = this.siblingElems(cell.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode)
            for(let w = 0; w < parentNode.length; w++) {
                if (parentNode[w].querySelector('.addBtn')) {
                    for(let k = 0; k < parentNode[w].querySelectorAll('.addBtn').length; k++) {
                        parentNode[w].querySelectorAll('.addBtn')[k].style.display = 'none'
                        parentNode[w].querySelectorAll('.addBtn')[k].parentNode.parentNode.style.background = '#fff'
                    }
                    parentNode[w].querySelector('.el-table').querySelector('.el-table__row').style.background = '#fff'
                }
            }
        },
        /**
         * 点击添加按钮触发
         * @param {array} scope 当前单元格的数据
         */
        addInput (scope) {
            if(scope[0] == '-99'){
                scope.length = 0
            }
            scope.push('')
        },
        /**
         * 点击删除按钮触发
         * @params row [array] 当前单元格的数据
         * @params index [array] 当前input的数据
         */
        deleteInput (row,index) {
            this.rowArr = row
            this.rowIndex = index
            this.delDialog = true
        },
        delEdit () {
            if(this.rowIndex !== -1) {
                this.rowArr.splice(this.rowIndex, 1)
            }
            this.delDialog = false
        },
        /**
         * 复制当前列的内容
         * @params num [number] 当前列的下标
         */
        copyClick1(num) {
            this.copyIndex = num
        },
        /**
         * 粘贴当前列的内容
         * @params copy [number] 当前列的内容
         * @params num [number] 当前列的下标
         */
        copyClick(cope,num,copyArr) {
            console.log(cope)
            // 对数组进行深拷贝，规避引用
            var deepCopyArr=[];  
                deepCopyArr=JSON.parse(JSON.stringify(copyArr)) 
            let inputData = cope.store.table.tableData
            for(let i = 0; i < inputData.length;i++) {
                inputData[i].data[num] = deepCopyArr[i].data[this.copyIndex]
            }
        },
        /**
         * 该竞对无区域是否展示
         * @params item [string|Number] 表格下input的val
         */
        textContIsShow (item) {
            if(item[0] === '-99') {
                return false
            } else if(item.indexOf('-99') === -1) {
                return true
            }else {
                return false
            }
        },
        /**
         * 点击checkbox触发
         * @params allrow [boolean] 当前行的内容
         * @params colIndex [array] 当前列的索引
         * @params index [number] 当前的行的索引
         */
        handleChange (allrow,colIndex,index) {
            this.$set(allrow.data[colIndex], 0, '-99');
        },
        /**
         * 获取楼盘下拉便签
         */
        async getHouseTags () {
            try {
                let result = await getHouseTagsData()
                let { data } = result
                if(data.code === 0) {
                    this.houseSelectData = data.data
                    this.unique(this.houseSelectData, this.allData.project_tags_map, 'houseTags')
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        /**
         * 获取户型下拉便签
         */
        async getHouseTypeTags () {
            try {
                let result = await getHouseTypeTagsData()
                let { data } = result

                if(data.code === 0) {
                    this.houseTypeSelectData = data.data
                    this.unique(this.houseTypeSelectData, this.allData.house_tags_map, 'houseTypeTags')
                }
            }
            catch (error) {
                console.log(error)
            }
        },
        /**
         * 点击增加楼盘标签
         */
        addJuliveHousesTags () {
            if(this.houseTagVal.name === '') {
                return
            }
            let obj = {
                julive_project_tag_id: this.houseTagVal.id,
                julive_project_tag_text: this.houseTagVal.name,
                data: {
                    '1': [],
                    '2': [],
                    '3': [],
                    '5': []
                }
            }
            this.allData.project_tags_map.push(obj)
            this.houseTagVal = {
                id: '',
                name: ''
            }
        },
        /**
         * 点击增加户型标签
         */
        addJuliveHousTypeTags () {
            if(this.houseTypeTagVal === '') {
                return
            }
            let obj = {
                julive_house_tag_text: this.houseTypeTagVal,
                data: {
                    '1': [],
                    '2': [],
                    '3': [],
                    '5': []
                }
            }
            this.allData.house_tags_map.push(obj)
            this.houseTypeTagVal = ''
        },
        /**
         * 过滤表格和下拉选项标签的重复项
         */
        unique (obj, ary, selectName){
             if (selectName === 'houseTags') {
                 obj = obj.filter(item => !ary.some(ele=>ele.julive_project_tag_text===item.name))
                 this.houseSelectData = obj
             } else {
                 obj = obj.filter(item => !ary.some(ele=>ele.julive_house_tag_text===item.name))
                 this.houseTypeSelectData = obj
             }
        },
        /**
         * 点击删除当前行
         * @params index [number] 当前点击行的index
         * @params deleteName [number] 要操作的数组
         */
        removeLine (row, index, deleteName) {
            if (index !== -1) {
                deleteName.splice(index, 1)
            }
        },
        // 复选框是否可以勾选
        isDisabled(row) {
            return row.length !== 0;
        },
        // 保存信息
        async submitInfo () {
            let flag = this.saveRluesUrl(this.formLabelAlign.houseVal, this.formLabelAlign.anjuVal, this.formLabelAlign.sohuVal, this.formLabelAlign.beikeVal);
            if (flag) {
                if(this.cityRadio === '' || this.nothCityRadio === '') {
                    this.$message.error('城市板块灌入和供暖城市必须有值!')
                    return
                }
                console.log(this.areaMapData)
                let params = {
                    city_id: this.$route.query.id,
                    district_map: this.areaMapData,
                    project_type_map: this.commercialMapData,
                    ring_road_map: this.cityLoopLineMapData,
                    project_tags_map: this.cityhousesMapData,
                    house_tags_map: this.cityhousTypeMapData,
                    spider_url: {
                        "1": this.formLabelAlign.houseVal,
                        "2": this.formLabelAlign.anjuVal,
                        "3": this.formLabelAlign.sohuVal,
                        "5": this.formLabelAlign.beikeVal,
                    },
                    is_inject_trade_area: this.cityRadio,
                    is_heating_city: this.nothCityRadio
                }
                try {
                    let result = await saveCityInfoData(params)
                    let { data } = result
                    if (data.code === 0) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        })
                        setTimeout(()=>{
                            this.$router.push({path: '/city/citySettingTab'})
                        },2000)
                    }else {
                        this.$message({
                            duration: 5000,
                            showClose: true,
                            message: data.msg,
                            type: 'error'
                        });
                    }
                }
                catch(error) {
                    console.log(error)
                }
            } else {
                this.$message.error('竞对URL地址输入有误，请按照提示文字进行输入！')
            }
        },
        // 取消按钮
        cancelEdit () {
            this.cancelDialog = false
            this.$router.push({path: '/city/citySettingTab'})
        },
    }
}
</script>

<style lang="less" scoped>
.collocationWrap {
    width: 100%;
    padding: 20px 30px 0;
    margin: 0 auto;
    box-sizing: border-box;
    .citySettingBox {
        width: 100%;
        background: #fff;
        margin-top: 20px;
        padding: 20px 20px 20px 30px;
        box-sizing: border-box;
        .eritorConfim {
            color: red;
            font-size: 14px;
        }
        .shortCurtEditor, .carpTureUrl, .areaMaping {
            margin: 20px 0 0;
            & > h2 {
                width: 170px;
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #ccc;
                margin-bottom: 10px;
            }
            /deep/ .el-button--primary {
                margin: 0 10px 0 20px;
            }
        }
        .carpTureUrl {
            width: 1180px;
            &:after {
                clear:both;
                content:'';
                display:block;
                width:0;
                height:0;
                visibility:hidden;
            }
            .isTraedArea {
                font-size: 14px;
                margin-right: 10px;
            }
            .regColor {
                color: red;
                font-size: 14px;
            }
            /deep/ .el-form-item {
                float: left;
                margin-right: 50px;
            }
            /deep/ .el-input {
                width: 450px;
            }
            /deep/ .el-form-item {
                height: 60px;
            }
        }
        .lastIpt {
            margin-bottom: 20px;
        }
        .update-area-style {
            /deep/ .el-input {
                width: 22% !important;
            }
        }
        .areaMaping {
            /deep/ .el-select {
                width: 210px;
            }
            /deep/ .el-input {
                width: 69%;
                font-size: 10px;
                margin-bottom: 10px;
            }
            /deep/ .el-input__inner {
                padding: 0 4px;
            }
            /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
                background: transparent;
            }
            /deep/ .el-table--enable-row-hover .el-table__body tr.hover-row>td{
                background: transparent;
            }
            .addBtn {
                display: none;
                text-align: left;
                margin-left: 22px;
                /deep/ .el-button--primary {
                    margin-left: 0px;
                }
            }
            .regColor {
                color: red;
                font-size: 14px;
            }
            .selectBox {
                margin-top: 20px;
            }
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            /deep/ .el-button {
                width: 150px;
            }
        }
    }
    .dialog {
            /deep/ .el-dialog__footer {
                text-align: center;
            }
    }
}
</style>