<template>
    <div class="el-row huilding-compare-box">
        <el-col
            :span="24"
            class="content-main"
        >
            <!--面包屑-->
            <el-breadcrumb
                class="bread-crumb-box"
                separator-class="el-icon-arrow-right"
            >
                <el-breadcrumb-item>
                    <a href="/">首页</a>
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    <a href="/index.php?r=cj-project-task/unfinished-task">任务列表页</a>
                </el-breadcrumb-item>
                <el-breadcrumb-item>户型信息对比</el-breadcrumb-item>
            </el-breadcrumb>
            <!--搜索区域-->
            <div class="v-box form-table-box">
                <div class="hd">
                    <h2>搜索条件</h2>
                    <!-- 展示隐藏按钮 -->
                    <el-button
                        type="text"
                        class="tap-toggle"
                        @click="searchsIsShow"
                    >
                        点击后可{{isShowText}}
                        搜索条件
                    </el-button>
                </div>
                <div
                    class="bd"
                    v-show="serchIsShow"
                >
                    <div class="order-search">
                        <ul class="s-query">
                            <li>
                                <div class="th">城市：</div>
                                <div class="td">
                                    <el-select
                                        v-model="cityId"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            v-for="(item, index) in cityList"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.id+''"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">区域：</div>
                                <div class="td">
                                    <el-select
                                        v-model="distriSele"
                                        multiple
                                        collapse-tags
                                        placeholder="请选择区域"
                                    >
                                        <el-option
                                            v-for="(item, index) in (distriOptions || [])"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">业态：</div>
                                <div class="td">
                                    <el-select
                                        v-model="houseTypeSele"
                                        multiple
                                        collapse-tags
                                        placeholder="请选择业态"
                                    >
                                        <el-option
                                            v-for="item in houseTypeOptions"
                                            :key="item.id"
                                            :label="item ? item.text : ''"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">销售状态：</div>
                                <div class="td">
                                    <el-select
                                        v-model="saleStatusSele"
                                        placeholder="请选择销售状态"
                                    >
                                        <el-option
                                            v-for="item in searchStatusOptions"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id+''"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">是否合作：</div>
                                <div class="td">
                                    <el-select v-model="isOporateSele">
                                        <el-option
                                            v-for="item in isOporateOptions"
                                            :key="item.id+''"
                                            :label="item.text"
                                            :value="item.id+''"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">楼盘名称：</div>
                                <div class="td">
                                    <el-autocomplete
                                        v-model="buildObj.text"
                                        :fetch-suggestions="searchHouse"
                                        placeholder="名称、别名模糊搜索"
                                        @select="affirmHouse"
                                    ></el-autocomplete>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="btn-area">
                        <el-button @click="resetBtn">重置</el-button>
                        <el-button
                            type="primary"
                            @click="searchData"
                        >搜索</el-button>
                    </div>
                </div>
            </div>
            <!--表格展示区域-->
            <div class="v-box form-table-box v-table">
                <div class="hd"></div>
                <div class="bd">
                    <div class="table-box-wrapper">
                        <!--表格汇总信息展示-->
                        <div class="el-row tab-info">
                            <div class="el-col-title">
                                当前符合条件{{projectInfo.total_num}}个楼盘，当前楼盘：{{projectInfo.project_name}}
                                <span
                                    class="next-project"
                                    @click="nextProject"
                                >下一个楼盘</span>
                            </div>
                            <div class="el-col-link">
                                <div class="col-link-th">该楼盘其余模块也存在任务：</div>
                                <ul class="col-link-td">
                                    <li
                                        :class="{'is-task': task.is_task, 'no-task': !task.is_task}"
                                        v-for="(task, taskIndex) in taskList"
                                        :key="'taskIndex-' + taskIndex"
                                        @click="skipTask(task)"
                                    >{{task.title}}</li>
                                    <li>
                                        <el-checkbox
                                            class="checkbox"
                                            v-model="sailChecked"
                                        >仅看非售罄户型组</el-checkbox>
                                    </li>
                                </ul>

                            </div>
                            <div class="el-col-type">
                                <ul ref="houseType">
                                    <li
                                        :class="{'active': task.is_checked ,'is-task': task.is_task, 'no-task': !task.is_task }"
                                        v-for="(task, taskIndex) in houseTypeList"
                                        :key="'taskHou-' + taskIndex"
                                        @click="changeHouId(task)"
                                    >{{task.title}}</li>
                                </ul>
                                <!-- houseType -->
                                <div v-if="houseTypeList.length>20">
                                    <span
                                        @click="editHouseType(1)"
                                        v-if="isShowOpen==true"
                                    >
                                        <i class="iconfont icon-xialajiantou" aria-hidden="true"></i> 展开
                                    </span>
                                    <span
                                        @click="editHouseType(2)"
                                        v-else
                                    >
                                        <i class="iconfont icontop-triangle" aria-hidden="true"></i>收起
                                    </span>
                                </div>
                            </div>
                            <div class="matchup">
                                <div>
                                    如需更换户型对应关系，请点击
                                    <span
                                        calss="skipUrl"
                                        @click="leaveChange"
                                    >此处前往更换</span>
                                </div>
                                <div
                                    @click="upDataTab"
                                    class="up-data"
                                >已经更换完毕后请点击此处刷新页面系统将重新计算</div>
                            </div>
                        </div>
                        <div class="table-box-row">
                            <!--表格-->
                            <el-table
                                height="600"
                                v-loading="tablebLoading"
                                :data="[1]"
                                :header-cell-style="{background:'#f4f6f9'}"
                            >
                                <el-table-column
                                    fixed
                                    min-width="438"
                                    label="居理"
                                    :resizable="false"
                                >
                                    <template slot-scope="scope">
                                        <ul
                                            class="tHead-box tFixed fixed-th"
                                            v-if="scope.$index === 0"
                                        >
                                            <li
                                                v-for="(itemval, itemKey, thIndex) in titleList"
                                                :key="'item-tit-' + thIndex"
                                            >
                                                <div
                                                    v-if="!upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="itemval.is_diff_julive==true ? 'add-tag' : ''"
                                                    >{{itemval.value}}</div>
                                                </div>
                                            </li>
                                            <li
                                                v-for="(itemval, itemKey, thIndex) in titleList"
                                                :key="'item-tit-height-' + thIndex"
                                            >
                                                <div
                                                    v-if="upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="itemval.is_diff_julive==true ? 'add-tag' : ''"
                                                    >{{itemval.value}}</div>
                                                </div>
                                            </li>
                                        </ul>
                                        <ul
                                            class="tHead-box tFixed fixed-td"
                                            v-if="scope.$index === 0"
                                        >
                                            <li
                                                v-for="(itemVal, itemKey, thIndex) in operationObj"
                                                :key="'item-op-' + thIndex"
                                            >
                                                <!--户型编号-->
                                                <div
                                                    v-if="itemKey === 'house_type_num' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner house_wrap"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-input
                                                            v-model="itemVal.value"
                                                            @change="edit(itemKey)"
                                                        ></el-input>
                                                        <span
                                                            class="skip"
                                                            @click="turnToPage"
                                                        >进入编辑页</span>
                                                    </div>
                                                </div>
                                                <!--户型居室-->
                                                <div
                                                    v-else-if="itemKey === 'room_type' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-select
                                                            v-model="itemVal.value"
                                                            placeholder="请选择"
                                                            @change="edit(itemKey)"
                                                            :popper-append-to-body="false"
                                                        >
                                                            <el-option
                                                                v-for="item in houseTypeRoom"
                                                                :key="item.id"
                                                                :label="item.text"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <!--销售类型-->
                                                <div
                                                    v-else-if="itemKey === 'status' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-select
                                                            v-model="itemVal.value"
                                                            placeholder="请选择"
                                                            @change="edit(itemKey)"
                                                            :popper-append-to-body="false"
                                                        >
                                                            <el-option
                                                                v-for="item in saleStatusOptions"
                                                                :key="item.id"
                                                                :label="item.text"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <!-- 户型总量 户型在售量 -->
                                                <div
                                                    v-else-if="(itemKey === 'total_count' || itemKey === 'house_on_sale_num' ) && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-input
                                                            v-model="itemVal.value"
                                                            oninput="value=value.replace(/[^0-9]/g,'')"
                                                            @change="edit(itemKey)"
                                                        ></el-input>
                                                    </div>
                                                </div>
                                                <!-- 报价 -->
                                                <div
                                                    v-else-if="itemKey === 'offer_price' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-input
                                                            v-model="itemVal.value"
                                                            @input="inputMatch(operationObj[itemKey].value, itemKey)"
                                                            @focus="countAllPrice"
                                                            @change="edit(itemKey)"
                                                            @blur="countAllPrice"
                                                        ></el-input>
                                                    </div>
                                                </div>
                                                <!-- 建筑面积 -->
                                                <div
                                                    v-else-if="itemKey === 'acreage' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <jl-number-input
                                                            v-model="itemVal.value"
                                                            reg="int"
                                                            @focus="countAllPrice"
                                                            @change="edit(itemKey)"
                                                            @blur="countAllPrice">
                                                        </jl-number-input>
                                                    </div>
                                                </div>
                                                <!-- 套面面积 -->
                                                <div
                                                    v-else-if="itemKey === 'ac_acreage' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <jl-number-input
                                                            v-model="itemVal.value"
                                                            @input="inputMatch(operationObj[itemKey].value, itemKey)"
                                                            @focus="countAllPrice"
                                                            @change="edit(itemKey)"
                                                            @blur="countAllPrice"
                                                            reg="twoNum">
                                                        </jl-number-input>
                                                    </div>
                                                </div>
                                                <!-- 层高 -->
                                                <div
                                                    v-else-if="itemKey === 'floor_height' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-input
                                                            v-model="itemVal.value"
                                                            @input="inputMatch(operationObj[itemKey].value, itemKey)"
                                                            @change="edit(itemKey)"
                                                            @blur="countAllPrice"
                                                        ></el-input>
                                                    </div>
                                                </div>
                                                <!-- 总价price -->
                                                <div
                                                    v-else-if="itemKey === 'price' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-input
                                                            v-model="countPrice"
                                                            @input="inputMatch(operationObj[itemKey].value, itemKey)"
                                                            max="999"
                                                            @change="edit(itemKey)"
                                                        ></el-input>
                                                    </div>
                                                </div>
                                                <!-- 优势劣势 -->
                                                <div
                                                    v-else-if="(itemKey === 'good_desc' || itemKey === 'bad_desc' ) && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive,'good-desc':itemKey === 'good_desc'}"
                                                    >
                                                        <el-input
                                                            type="textarea"
                                                            v-model="itemVal.value"
                                                            @change="edit(itemKey)"
                                                        ></el-input>
                                                    </div>
                                                </div>
                                                <!-- 厅室描述summary -->
                                                <div
                                                    v-else-if="itemKey === 'summary' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-input
                                                            v-model="itemVal.value"
                                                            @change="edit(itemKey)"
                                                            @blur="houseLinkage(itemVal.value)"
                                                        ></el-input>
                                                    </div>
                                                </div>
                                                <!-- 户型标签 -->
                                                <div
                                                    v-else-if="itemKey === 'house_tag' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-checkbox-group
                                                            v-model="operationObj[itemKey].value"
                                                            @change="edit(itemKey,operationObj[itemKey].value)"
                                                        >
                                                            <el-checkbox
                                                                v-for="tag in houseTag"
                                                                :label="tag.text"
                                                                :key="tag.id"
                                                            >{{tag.text}}</el-checkbox>
                                                        </el-checkbox-group>
                                                    </div>
                                                </div>
                                                <!-- 户型图 -->
                                                <div
                                                    v-else-if="itemKey === 'imgs' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <div
                                                            class="img-wrap"
                                                            v-for="(val,index) in itemVal.value"
                                                            :key="'img-'+index"
                                                        >
                                                            <span
                                                                class="delete"
                                                                @click="deleteHouImg(val,index,itemKey)"
                                                            >
                                                                <img src="../../../assets/images/delete-icon.png" alt="图片"/>
                                                            </span>
                                                            <img
                                                                :src="val.show_url"
                                                                alt="图片"
                                                                @click="openSwiper(itemVal.value)"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- 房屋朝向-->
                                                <div
                                                    v-else-if="itemKey === 'orientation' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-select
                                                            v-model="itemVal.value"
                                                            placeholder="请选择"
                                                            @change="edit(itemKey)"
                                                            :popper-append-to-body="false"
                                                        >
                                                            <el-option
                                                                v-for="item in orientationList"
                                                                :key="item.id"
                                                                :label="item.text"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <!-- 关联楼栋buildings -->
                                                <div
                                                    v-else-if="itemKey === 'buildings' && !upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-select
                                                            value-key="id"
                                                            @change="edit(itemKey)"
                                                            @focus="focusSelect"
                                                            v-model="value"
                                                            multiple
                                                            filterable
                                                            remote
                                                            reserve-keyword
                                                            placeholder="关联楼栋"
                                                            :remote-method="remoteMethod"
                                                            :loading="loading"
                                                        >
                                                            <el-option
                                                                v-for="(item,index) in options"
                                                                :key="index"
                                                                :label="item.text"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <div
                                                    v-else-if="!upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >{{operationObj[itemKey].value}}</div>
                                                </div>
                                            </li>
                                            <li
                                                v-for="(itemVal, itemKey, thIndex) in operationObj"
                                                :key="'item-op-height-' + thIndex"
                                            >
                                                <!--户型编号-->
                                                <div
                                                    v-if="itemKey === 'house_type_num' && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner house_wrap"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-input v-model="itemVal.val"></el-input>
                                                        <a
                                                            class="skip"
                                                            :href="itemVal.edit_url"
                                                        >进入编辑页</a>
                                                    </div>
                                                </div>
                                                <!--户型居室-->
                                                <div
                                                    v-else-if="itemKey === 'room_type' && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-select
                                                            v-model="itemVal.id"
                                                            placeholder="请选择"
                                                            :popper-append-to-body="false"
                                                        >
                                                            <el-option
                                                                v-for="item in houseTypeRoom"
                                                                :key="item.id"
                                                                :label="item.text"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <!--销售类型-->
                                                <div
                                                    v-else-if="itemKey === 'status' && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-select
                                                            v-model="itemVal.value"
                                                            placeholder="请选择"
                                                            :popper-append-to-body="false"
                                                        >
                                                            <el-option
                                                                v-for="item in saleStatusOptions"
                                                                :key="item.id"
                                                                :label="item.text"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <!-- 户型总量  户型在售量  -->
                                                <div
                                                    v-else-if="(itemKey === 'total_count' || itemKey === 'house_on_sale_num' ) && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-input
                                                            v-model="itemVal.value"
                                                            oninput="value=value.replace(/[^0-9]/g,'')"
                                                        ></el-input>
                                                    </div>
                                                </div>
                                                <!-- 报价  -->
                                                <div
                                                    v-else-if="itemKey === 'offer_price' && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-input
                                                            v-model="itemVal.value"
                                                            @input="inputMatch(operationObj[itemKey].value, itemKey)"
                                                            @focus="countAllPrice"
                                                            @change="edit(itemKey)"
                                                            @blur="countAllPrice"
                                                        ></el-input>
                                                    </div>
                                                </div>
                                                <!-- 建筑面积 -->
                                                <div
                                                    v-else-if="itemKey === 'acreage' && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <jl-number-input
                                                            v-model="itemVal.value"
                                                            reg="int"
                                                            @focus="countAllPrice"
                                                            @change="edit(itemKey)"
                                                            @blur="countAllPrice">
                                                        </jl-number-input>
                                                    </div>
                                                </div>
                                                <!-- 套面面积 层高 -->
                                                <div
                                                    v-else-if="(itemKey === 'ac_acreage' || itemKey === 'floor_height') && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <jl-number-input
                                                            v-model="itemVal.value"
                                                            @input="inputMatch(operationObj[itemKey].value, itemKey)"
                                                            @focus="countAllPrice"
                                                            @change="edit(itemKey)"
                                                            @blur="countAllPrice"
                                                            reg="twoNum">
                                                        </jl-number-input>
                                                    </div>
                                                </div>
                                                <!-- 总价price -->
                                                <div
                                                    v-else-if="itemKey === 'price' && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-input
                                                            v-model="countPrice"
                                                            @input="inputMatch(operationObj[itemKey].value, itemKey)"
                                                            max="999"
                                                        ></el-input>
                                                    </div>
                                                </div>
                                                <!-- 优势劣势 -->
                                                <div
                                                    v-else-if="(itemKey === 'good_desc' || itemKey === 'bad_desc' ) && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive,'good-desc':itemKey === 'good_desc'}"
                                                    >
                                                        <el-input
                                                            type="textarea"
                                                            v-model="itemVal.value"
                                                        ></el-input>
                                                    </div>
                                                </div>
                                                <!-- 厅室描述summary -->
                                                <div
                                                    v-else-if="itemKey === 'summary' && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-input v-model="itemVal.value"></el-input>
                                                    </div>
                                                </div>
                                                <!-- 户型标签 -->
                                                <div
                                                    v-else-if="itemKey === 'house_tag' && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-checkbox-group
                                                            v-model="operationObj[itemKey].value"
                                                        >
                                                            <el-checkbox
                                                                v-for="tag in houseTag"
                                                                :label="tag.text"
                                                                :key="tag.id"
                                                            >{{tag.text}}</el-checkbox>
                                                        </el-checkbox-group>
                                                    </div>
                                                </div>
                                                <!-- 户型图 -->
                                                <div
                                                    v-else-if="itemKey === 'imgs' && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <div
                                                            class="img-wrap"
                                                            v-for="(val,index) in itemVal.value"
                                                            :key="'img-'+index"
                                                        >
                                                            <span
                                                                class="delete"
                                                                @click="deleteHouImg(val,index,itemKey)"
                                                            >
                                                                <img src="../../../assets/images/delete-icon.png" alt="图片"/>
                                                            </span>
                                                            <img
                                                                :src="val.show_url"
                                                                alt="图片"
                                                                @click="openSwiper(itemVal.value)"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- 房屋朝向-->
                                                <div
                                                    v-else-if="itemKey === 'orientation' && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-select
                                                            v-model="itemVal.value"
                                                            placeholder="请选择"
                                                            :popper-append-to-body="false"
                                                        >
                                                            <el-option
                                                                v-for="item in orientationList"
                                                                :key="item.id"
                                                                :label="item.text"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <!-- 关联楼栋buildings -->
                                                <div
                                                    v-else-if="itemKey === 'buildings' && upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'is-diff' : itemVal.is_diff_julive}"
                                                    >
                                                        <el-select
                                                            value-key="id"
                                                            @focus="focusSelect"
                                                            v-model="value"
                                                            multiple
                                                            filterable
                                                            remote
                                                            reserve-keyword
                                                            placeholder="关联楼栋"
                                                            :remote-method="remoteMethod"
                                                            :loading="loading"
                                                        >
                                                            <el-option
                                                                v-for="(item,index) in options"
                                                                :key="index"
                                                                :label="item.text"
                                                                :value="item.id"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                </div>
                                                <div
                                                    v-else-if="upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div class="box-inner">{{operationObj[itemKey].is_diff_julive}}</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    v-for="(items, index) in data_source_list"
                                    :key="index"
                                    min-width="250"
                                    :label="items.source"
                                    :resizable="false"
                                >
                                    <template
                                        slot="header"
                                        v-if="items"
                                    >
                                        <div class="project-tit">
                                            {{items.source_name}}
                                            <span
                                                class="delete-info"
                                                @click="removeHouseInfo(items)"
                                            >移除</span>
                                        </div>
                                    </template>
                                    <template slot-scope="scope">
                                        <ul
                                            class="tHead-box"
                                            v-if="scope.$index === 0 && items"
                                        >
                                            <li
                                                v-for="(itemVal, itemKey, objIndex) in items.field_data"
                                                :key="'item-source-' + objIndex"
                                            >
                                                <!-- 户型编号-->
                                                <div
                                                    v-if="itemKey === 'house_type_num' && !upHeight"
                                                    :style="'height:'+ maxHeight[objIndex] + 'px'"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'error' : itemVal.is_diff_julive==true}"
                                                    >
                                                        <span @click="choosenItem(items.field_data[itemKey], itemKey, 'editUrl' ,items.source_name)">{{itemVal.value}}</span>
                                                    </div>
                                                </div>
                                                <!-- 户型朝向 户型居室 销售状态-->
                                                <div
                                                    v-else-if="(itemKey === 'orientation' || itemKey === 'room_type' || itemKey === 'status') && !upHeight"
                                                    :style="'height:'+ maxHeight[objIndex] + 'px'"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'error' : itemVal.is_diff_julive==true}"
                                                    >
                                                        <span @click="choosenItem(items.field_data[itemKey], itemKey, 'string' ,items.source_name)">{{itemVal.text}}</span>
                                                    </div>
                                                </div>
                                                <!-- 户型标签 -->
                                                <div
                                                    v-else-if="itemKey === 'house_tag' && !upHeight"
                                                    :style="'height:'+ maxHeight[objIndex] + 'px'"
                                                    :class="'mergeTd li-' + objIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'error' : itemVal.is_diff_julive==true}"
                                                    >
                                                        <span
                                                            v-for="(name,index) in itemVal.value"
                                                            :key="'house-'+index"
                                                            class="house-item"
                                                            @click="choosenItem(name, itemKey, 'tag')"
                                                        >{{name}}</span>
                                                    </div>
                                                </div>
                                                <!-- 户型图 -->
                                                <div
                                                    v-else-if="itemKey === 'imgs' && !upHeight"
                                                    :style="'height:'+ maxHeight[objIndex] + 'px'"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'error' : itemVal.is_diff_julive==true}"
                                                    >
                                                        <div class="img-container">
                                                            <div
                                                                class="img-wrap"
                                                                v-for="(val,index) in itemVal.value"
                                                                :key="'img-'+index"
                                                            >
                                                                <el-checkbox
                                                                    v-model="val.state"
                                                                    @change="statisState(itemVal,itemKey)"
                                                                ></el-checkbox>
                                                                <img
                                                                    :src="val.show_url"
                                                                    alt="图片"
                                                                    @click="openSwiper(itemVal.value)"
                                                                />
                                                            </div>
                                                        </div>
                                                        <span
                                                            class="add-img"
                                                            :class="{'edit' : itemVal.isEdit==true}"
                                                            @click="addJuliveImg(itemKey,itemVal.value ,items.source_name)"
                                                        >添加</span>
                                                    </div>
                                                </div>
                                                <!-- 关联楼栋 -->
                                                <div
                                                    v-else-if="itemKey === 'buildings' && !upHeight"
                                                    :style="'height:'+ maxHeight[objIndex] + 'px'"
                                                    :class="'mergeTd li-' + objIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'error' : itemVal.is_diff_julive==true}"
                                                    >
                                                        <span
                                                            class="build-name"
                                                            v-for="(val,index) in itemVal.value"
                                                            :key="'build-'+index"
                                                        >{{val.building_name}}</span>
                                                    </div>
                                                </div>
                                                <!-- 建面 套面 报价 -->
                                                <div
                                                    v-else-if="(itemKey === 'ac_acreage' || itemKey === 'acreage' || itemKey === 'offer_price') && !upHeight"
                                                    :style="'height:'+ maxHeight[objIndex] + 'px'"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'error' : itemVal.is_diff_julive==true}"
                                                    >
                                                        <span @click="choosenItem(items.field_data[itemKey], itemKey, 'editAllprice' ,items.source_name)">{{itemVal.value}}</span>
                                                    </div>
                                                </div>
                                                <!-- 总价 -->
                                                <div
                                                    v-else-if="itemKey === 'price' && !upHeight"
                                                    :style="'height:'+ maxHeight[objIndex] + 'px'"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'error' : itemVal.is_diff_julive==true}"
                                                    >
                                                        <span @click="choosenItem(items.field_data[itemKey], itemKey, 'allPrice' ,items.source_name)">{{itemVal.value}}</span>
                                                    </div>
                                                </div>
                                                <!-- 厅室描述 -->
                                                <div
                                                    v-else-if="itemKey === 'summary' && !upHeight"
                                                    :style="'height:'+ maxHeight[objIndex] + 'px'"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'error' : itemVal.is_diff_julive==true}"
                                                    >
                                                        <span @click="choosenItem(items.field_data[itemKey], itemKey, 'string' ,items.source_name ,'houseLink')">{{itemVal.value}}</span>
                                                    </div>
                                                </div>
                                                <!-- 户型在售余量 户型总量 层高 优势描述  劣势描述 -->
                                                <div
                                                    v-else-if="!upHeight"
                                                    :style="'height:'+ maxHeight[objIndex] + 'px'"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div
                                                        class="box-inner"
                                                        :class="{'error' : itemVal.is_diff_julive==true}"
                                                    >
                                                        <span @click="choosenItem(items.field_data[itemKey], itemKey, 'string' ,items.source_name)">{{itemVal.value}}</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li
                                                v-for="(itemVal, itemKey, objIndex) in items.field_data"
                                                :key="'item-source-height-' + objIndex"
                                                :class="'li-' + objIndex"
                                            >
                                                <div
                                                    v-if="(itemKey === 'orientation' || itemKey === 'room_type' || itemKey === 'status') && upHeight"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div class="box-inner">
                                                        <span @click="choosenItem(items.field_data[itemKey], itemKey, 'string' ,items.source_name)">{{itemVal.text}}</span>
                                                    </div>
                                                </div>
                                                <!-- 户型编号-->
                                                <div
                                                    v-else-if="itemKey === 'house_type_num' && upHeight"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div class="box-inner">
                                                        <span @click="choosenItem(items.field_data[itemKey], itemKey, 'editUrl' ,items.source_name)">{{itemVal.value}}</span>
                                                    </div>
                                                </div>
                                                <!-- 户型标签 -->
                                                <div
                                                    v-else-if="itemKey === 'house_tag' && upHeight"
                                                    :class="'mergeTd li-' + objIndex"
                                                >
                                                    <div class="box-inner">
                                                        <span
                                                            v-for="(name,index) in itemVal.value"
                                                            :key="'house-'+index"
                                                            class="house-item"
                                                            @click="choosenItem(name, itemKey, 'tag')"
                                                        >{{name}}</span>
                                                    </div>
                                                </div>
                                                <!-- 建面 套面 报价 -->
                                                <div
                                                    v-else-if="(itemKey === 'ac_acreage' || itemKey === 'acreage' || itemKey === 'offer_price') && upHeight"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div class="box-inner">
                                                        <span @click="choosenItem(items.field_data[itemKey], itemKey, 'editAllprice' ,items.source_name)">{{itemVal.value}}</span>
                                                    </div>
                                                </div>
                                                <!-- 户型图 -->
                                                <div
                                                    v-else-if="itemKey === 'imgs' && upHeight"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div class="box-inner">
                                                        <div class="img-container">
                                                            <div
                                                                class="img-wrap"
                                                                v-for="(val,index) in itemVal.value"
                                                                :key="'img-'+index"
                                                            >
                                                                <el-checkbox
                                                                    v-model="val.state"
                                                                    @change="statisState(itemVal,itemKey)"
                                                                ></el-checkbox>
                                                                <img
                                                                    :src="val.show_url"
                                                                    alt="图片"
                                                                    @click="openSwiper(itemVal.value)"
                                                                />
                                                            </div>
                                                        </div>
                                                        <span
                                                            class="add-img"
                                                            :class="{'edit' : itemVal.isEdit==true}"
                                                            @click="addJuliveImg(itemKey,itemVal.value,items.source_name)"
                                                        >添加</span>
                                                    </div>
                                                </div>
                                                <!-- 关联楼栋 -->
                                                <div
                                                    v-else-if="itemKey === 'buildings' && upHeight"
                                                    :class="'mergeTd li-' + objIndex"
                                                >
                                                    <div class="box-inner">
                                                        <span
                                                            class="build-name"
                                                            v-for="(val,index) in itemVal.value"
                                                            :key="'build-'+index"
                                                        >{{val.building_name}}</span>
                                                    </div>
                                                </div>
                                                <div
                                                    v-else-if="itemKey === 'price' && upHeight"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div class="box-inner">
                                                        <span @click="choosenItem(items.field_data[itemKey], itemKey, 'allPrice' ,items.source_name)">{{itemVal.value}}</span>
                                                    </div>
                                                </div>
                                                <div
                                                    v-else-if="upHeight"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div class="box-inner">
                                                        <span @click="choosenItem(items.field_data[itemKey], itemKey, 'string' ,items.source_name)">{{itemVal.value}}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                                <!-- 大数据列 -->
                                <el-table-column
                                    v-if="(bigData.ac_acreage && bigData.ac_acreage.length>0) || bigData.acreage && bigData.acreage.length>0"
                                    min-width="250"
                                    label="大数据"
                                    :resizable="false"
                                >
                                    <template slot-scope="scope">
                                        <ul
                                            class="tHead-box"
                                            v-if="scope.$index === 0"
                                        >
                                            <li
                                                v-for="(itemval, itemKey, thIndex) in titleList"
                                                :key="'item-source-' + thIndex"
                                            >
                                                <div
                                                    v-if="!upHeight && itemKey=='ac_acreage'"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div class="box-inner">
                                                        <span
                                                            v-for="(acr,ind) in bigData.ac_acreage"
                                                            :key="ind"
                                                        >
                                                            <a
                                                                :href="acr.location_url"
                                                                target="_blank"
                                                                @click="setTrack('4829')"
                                                            >{{acr.value}}</a>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    v-else-if="!upHeight && itemKey=='acreage'"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div class="box-inner">
                                                        <span
                                                            v-for="(acr,ind) in bigData.acreage"
                                                            :key="ind"
                                                        >
                                                            <a
                                                                :href="acr.location_url"
                                                                target="_blank"
                                                                @click="setTrack('4829')"
                                                            >{{acr.value}}</a>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    v-else-if="!upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div class="box-inner"></div>
                                                </div>
                                            </li>
                                            <li
                                                v-for="(itemval, itemKey, thIndex) in titleList"
                                                :key="'item-' + thIndex"
                                            >
                                                <div
                                                    v-if="upHeight && itemKey=='ac_acreage'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div class="box-inner">
                                                        <span
                                                            v-for="(acr,ind) in bigData.ac_acreage"
                                                            :key="ind"
                                                        >
                                                            <a
                                                                :href="acr.location_url"
                                                                target="_blank"
                                                            >{{acr.value}}</a>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    v-else-if="upHeight && itemKey=='acreage'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div class="box-inner">
                                                        <span
                                                            v-for="(acr,ind) in bigData.acreage"
                                                            :key="ind"
                                                        >
                                                            <a
                                                                :href="acr.location_url"
                                                                target="_blank"
                                                            >{{acr.value}}</a>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    v-else-if="upHeight"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div class="box-inner"></div>
                                                </div>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div
                            class="sign-wrap"
                            v-if="isShowSign"
                        >
                            <span>
                                <el-checkbox v-model="signFlag">标记为不是该楼盘业态的户型</el-checkbox>
                            </span>
                        </div>
                    </div>
                    <!-- 提交保存区域 -->
                    <div class="btn-wrap">
                        <el-button
                            class="show-gallary-btn"
                            @click="skipToTaskList"
                        >取消</el-button>
                        <el-button
                            class="show-gallary-btn"
                            type="primary"
                            @click="saveData()"
                        >保存</el-button>
                        <el-button
                            class="show-gallary-btn"
                            type="primary"
                            @click="saveData('nextTask')"
                        >保存并进行下一个任务</el-button>
                    </div>
                </div>
                <!-- 切换户型时 保存提醒 -->
                <el-dialog
                    :visible.sync="saveWarn"
                    title="保存提醒"
                    width="30%"
                    :center="true"
                >
                    <div class="dialog-content">
                        <p class="content-tex save-warn-tex">该页面信息已经被编辑了，是否保存当前内容！</p>
                    </div>
                    <div
                        slot="footer"
                        class="dialog-footer"
                    >
                        <el-button @click="notSaveSkip('house')">不保存进行跳转</el-button>
                        <el-button
                            type="primary"
                            @click="saveSkip('house')"
                        >保存进行跳转</el-button>
                    </div>
                </el-dialog>
                <!-- 点击任务时 保存提醒 -->
                <el-dialog
                    :visible.sync="saveTaskWarn"
                    title="保存提醒"
                    width="30%"
                    :center="true"
                >
                    <div class="dialog-content">
                        <p class="content-tex save-warn-tex">该页面信息已经被编辑了，是否保存当前内容！</p>
                    </div>
                    <div
                        slot="footer"
                        class="dialog-footer"
                    >
                        <el-button @click="notSaveSkip('task')">不保存进行跳转</el-button>
                        <el-button
                            type="primary"
                            @click="saveSkip('task')"
                        >保存进行跳转</el-button>
                    </div>
                </el-dialog>
                <!-- 下一个楼盘 保存提醒 -->
                <el-dialog
                    :visible.sync="saveNextWarn"
                    title="保存提醒"
                    width="30%"
                    :center="true"
                >
                    <div class="dialog-content">
                        <p class="content-tex save-warn-tex">该页面信息已经被编辑了，是否保存当前内容！</p>
                    </div>
                    <div
                        slot="footer"
                        class="dialog-footer"
                    >
                        <el-button @click="notSaveSkip('next')">不保存进行跳转</el-button>
                        <el-button
                            type="primary"
                            @click="saveSkip('next')"
                        >保存进行跳转</el-button>
                    </div>
                </el-dialog>
                <!--无任务通知弹窗-->
                <el-dialog
                    :visible.sync="dialogVisibleNoTask"
                    :title.sync="dialogTitleNoTask"
                    width="30%"
                    center
                >
                    <div class="dialog-content">
                        <p class="content-tex no-task-tex">{{dialogContentNoTask}}</p>
                    </div>
                    <div
                        slot="footer"
                        class="dialog-footer"
                    >
                        <el-button
                            type="primary"
                            class="single"
                            @click="skipToTaskList"
                        >点击前往任务列表页</el-button>
                    </div>
                </el-dialog>
                <!--移除异常提示-->
                <el-dialog
                    :visible.sync="dialogVisibleRemoveAbnormal"
                    :title.sync="dialogTitleRemoveAbnormal"
                    width="30%"
                    :center="true"
                >
                    <div class="dialog-content">
                        <p class="content-tex remove-abnormal-tex">{{dialogContentRemoveAbnormal}}</p>
                    </div>
                    <div
                        slot="footer"
                        class="dialog-footer"
                    >
                        <el-button
                            type="primary"
                            @click="dialogVisibleRemoveAbnormal=false"
                            class="single"
                        >知道了！</el-button>
                    </div>
                </el-dialog>
                <!-- 移除异常 源数据被移除完之后 -->
                <el-dialog
                    :visible.sync="isRemoveDialog"
                    title="移除异常提示"
                    width="30%"
                    :center="true"
                >
                    <div class="dialog-content">
                        <p class="content-tex save-warn-tex">啊哦！全部都被移除咯！好像没有什么可操作的啦，请在下方先点击去匹配下户型，再刷新页面进行操作</p>
                    </div>
                    <div
                        slot="footer"
                        class="dialog-footer"
                    >
                        <el-button
                            type="primary"
                            @click="isRemoveDialog=false"
                            class="single"
                        >知道了！</el-button>
                    </div>
                </el-dialog>
                <!-- 
          * 厅室联动对话框
          * @author xiebin
         -->
                <el-dialog
                    :visible.sync="linkageDialog"
                    title="户型居室录入提示"
                    width="30%"
                    :center="true"
                >
                    <div class="dialog-content">
                        <p class="content-tex house-type-font">厅室描述和户型居室字段不自洽，请修改信息后保存！</p>
                    </div>
                    <div
                        slot="footer"
                        class="dialog-footer"
                    >
                        <el-button
                            type="primary"
                            @click="linkageDialog=false"
                            class="single"
                        >
                            去修改信息
                        </el-button>
                    </div>
                </el-dialog>
                <!--价格信息系统判断弹窗-->
                <msg-dialog
                    title="价格涨跌提示"
                    :dialogShow="priceMsgDialogShow"
                    @closeDialog="priceMsgDialogShow=false"
                >
                    <p class="msg-content">
                        {{priceMsgInfo}}
                    </p>
                    <template v-slot:footer>
                        <el-button
                            type="primary"
                            @click="priceMsgConfirm"
                        >确认并保存</el-button>
                        <el-button
                            type="primary"
                            @click="priceMsgEdit"
                        >修改</el-button>
                    </template>
                </msg-dialog>
                <!--待售楼盘不能存在在售且显示的户型、在售且显示的楼栋 弹窗-->
                <msg-dialog
                    title="错误提示"
                    @confirm="floorConfirm"
                    @closeDialog="housedialogVisible=false"
                    :dialogShow="housedialogVisible"
                >
                    <div class="msg-content">
                        {{houseValidateStatus == '3' ? '该楼盘为售罄楼盘不存在非售罄的户型，请检查' : '该楼盘为待售，不能存在在售的户型，请检查'}}
                        <a
                            class="dialog-alink"
                            @mousedown="houseHrefHandle"
                            :href="houseLink"
                            target="_blank"
                        >
                            {{houseValidateName}}（{{houseValidateStatusName}}）
                        </a>
                    </div>
                </msg-dialog>
                <!--系统判断超出10万时或者低于1万的系统进行的单价录入提示-->
                <msg-dialog
                    title="单价录入提示"
                    :dialogShow="priceValitShow"
                    @closeDialog="closeDialog"
                >
                    <p class="msg-content">
                        {{priceLimitMsg}}
                    </p>
                    <template v-slot:footer>
                        <el-button
                            type="primary"
                            @click="priceValitConfirm"
                        >
                            确认并保存
                        </el-button>
                        <el-button
                            type="primary"
                            @click="priceValitClose"
                        >
                            修改
                        </el-button>
                    </template>
                </msg-dialog>
                <!--存在售罄户型的在售余量不能大于0，-->
                <msg-dialog
                    title="提示"
                    :dialogShow="houseSailedDialogShow"
                    @confirm="houseSailedDialogShow=false"
                    @closeDialog="houseSailedDialogShow=false">
                    <div class="msg-content">
                    存在售罄户型的在售余量大于0，请修改信息后保存！
                    </div>
                </msg-dialog>
                        <!--存在在售\待售户型的在售余量应该大于0，-->
                        <msg-dialog
                    title="提示"
                    :dialogShow="houseSailingDialogShow"
                    @confirm="houseSailingDialogShow=false"
                    @closeDialog="houseSailingDialogShow=false">
                    <div class="msg-content">
                    在售/待售户型 {{houseType}} 余量不能为0
                    </div>
                </msg-dialog>
                <!-- 轮播图 -->
                <div v-if="isShowSwiper">
                    <building-dictionary-swiper
                        :swiperList="swiperList"
                        :transferPicIndex="transferPicIndex"
                        @gallaryClose="handleGallaryClick"
                    />
                </div>
            </div>
        </el-col>
    </div>
</template>

<script>
    import merge from 'webpack-merge';
    import {
        BuildingDictionarySwiper,
        MsgDialog
    } from './components';
    import { setTimeout } from 'timers';
    import { commonFun } from '@/assets/js/utils/utils';
    import api from './api/common.js';
    import { getInfoByProjectId } from './utils/index.js';
    export default {
        name: 'building-houseContrast',
        data() {
            return {
                // 存储户型信息
                houseType: '',
                // 售罄户型存在的余量不能大于0弹窗
                houseSailedDialogShow: false,
                // 在售\待售户型存在的余量不能为0弹窗
                houseSailingDialogShow: false,
                // 价格限制判断
                priceLimitMsg: '',
                // 系统判断超出10万时或者低于1万的系统进行的单价录入提示弹窗显隐状态
                priceValitShow: false,
                // 楼盘校验不通过的楼盘名
                houseValidateName: '',
                // 楼盘校验不通过的楼盘状态
                houseValidateStatus: '',
                // 楼盘校验不通过的楼盘状态名字
                houseValidateStatusName: '',
                // 户型链接
                houseLink: '',
                // 待售楼盘不能存在在售且显示的户型、在售且显示的楼栋 弹窗显示隐藏
                housedialogVisible: false,
                // 价格信息提示数据
                priceMsgInfo: [],
                // 是否验证价格
                isValidatePrice: true,
                // 价格信息系统判断弹窗是否展示
                priceMsgDialogShow: false,
                // 是否仅看非售罄户型组
                sailChecked: false,
                // 搜索框是否隐藏
                serchIsShow: true,
                // 是否展示/隐藏文案
                isShowText: '隐藏',
                isShowSign: false, // 是否展示标记选项 新增报错时展示
                signFlag: false, // 是否标识为非该楼盘的
                isFirst: true, // 是否第一次请求
                flag: false, // 户型校验
                baseTaskInfo: {}, // 任务信息 切换时使用
                baseId: '', // 户型id 切换户型时使用
                isRemove: false, // 是否操作过移除
                isTask: true, // 默认是task纬度
                currentTurn: {},
                saveTaskWarn: false, // 切换任务时 保存弹窗
                saveNextWarn: false, // 点击下一个楼盘 保存弹窗
                bigData: {}, // 大数据
                isShowOpen: false, // 是否有展开
                tablebLoading: false, // 表格加载中
                isNext: '',
                nextProjectType: '', // 默认以任务为维度来查
                newImgUrl: [], // 新增户型的url
                delImgId: [], // 删除的户型id
                baseHouImg: [], // 居理户型图信息
                saveWarn: false, // 保存提醒
                isHasEdit: false, // 是否编辑过
                currentHouseId: '', // 户型id 第一次没有
                currProjectId: '', // 当前任务居理楼盘id
                taskId: '', // 任务id
                taskInfo: {}, // 任务信息
                tagFlag: false, // 标签是否大于3个
                isFir: true, //  第一次进入页面
                countPrice: '', // 总价
                isFirAdd: true, // 第一次点击源中添加楼栋
                swiperList: [], // 轮播图片列表
                transferPicIndex: null, // 轮播index
                isShowSwiper: false, // 是否展示swiper
                focusIndex: 0, // 关联楼栋是fouce否第一次触发
                value: [], // 左侧居理楼栋信息
                options: [], // 楼栋选项
                loading: false, // 关联楼栋
                buildObj: {}, // 搜索楼盘信息  id和text
                searchBuildObj: {}, // 点击搜索时记录楼盘信息
                projectInfo: {}, // 楼盘信息
                houseTag: [], //  户型标签
                tableData: [],
                upHeight: false, // 展示
                titleList: [], // 左侧表头
                operationObj: {}, // 左侧居理操作列
                data_source_list: [], // 数据源操作数组
                mutiInput: '',
                maxHeight: [], // 记录所有最大高度
                taskList: [], // 表头任务列表
                houseTypeList: [], // 表头户型任务列表
                cityId: '', // 城市id
                cityList: [{ id: '', text: '' }], // 城市下拉
                houseTypeSele: [], // 筛选的业态id
                houseTypeOptions: [{ id: '', text: '' }], // 业态下拉
                saleStatusSele: '', // 筛选的楼盘名称
                searchStatusOptions: [{ id: '', text: '' }], // 筛选中在售状态下拉
                saleStatusOptions: [{ id: '', text: '' }], // 在售状态下拉
                isOporateSele: '', // 是否合作
                isOporateOptions: [{ id: '', text: '' }], // 合作下拉
                distriSele: [], // 筛选的区域内容
                distriOptions: [{ id: '', text: '' }], // 区域下拉
                houseTypeRoom: [{ id: '', text: '' }], // 户型居室
                orientationList: [{ id: '', text: '' }], // 朝向信息
                paramArr: {},
                dialogVisibleNoTask: false, // 无任务状态弹窗展示
                dialogTitleNoTask: '无任务通知', // 弹窗标题
                dialogContentNoTask: '当前已经无相关任务，请返回到任务列表进行查看', // 弹窗内容
                dialogVisibleRemoveAbnormal: false,
                dialogTitleRemoveAbnormal: '移除异常提示',
                // dialogContentRemoveAbnormal: '啊哦！全部都被移除咯！好像没有什么可操作的啦，请在下方先点击去匹配下户型，再刷新页面进行操作',
                dialogContentRemoveAbnormal: '不存在居理的户型无法移除',
                isRemoveDialog: false, // 没有可操作数据
                // 厅室联动弹框
                linkageDialog: false,
                // 保存价格判断信息 price_floor，price_limit， price_top
                priceInfo: {},
                // 标识是否是初次进入页面
                isFirstLoad: true,
                // 来源
                source: {}
            };
        },
        mounted() {
            this.$nextTick(() => {
                // 筛选项
                this.getCondition();
            });
            // 是否是点击的下一个任务
            this.isSaveNext = false;
            // 是否校验价格大于10万或小于一万
            this.isVilidateLimit = true;
            // 查找展示状态是否有值
            if (localStorage.getItem('showStatus') === 'false') {
                this.serchIsShow = false;
                this.isShowText = '展开';
            } else if (localStorage.getItem('showStatus') === 'true') {
                this.serchIsShow = true;
                this.isShowText = '隐藏';
            }
        },
        methods: {
            // 根据任务ID获取当前任务是新增还是对比
            async getTaskTypeById() {
                try {
                    let params = {
                        id: this.taskId,
                        mode_type: '2'
                    }
                    let result = await api.getTaskType(params);
                    let { code, data } = result.data;
                    if (code === 0) {
                        this.taskType = data ? data[0].data_type : '1';
                        this.paramHouseTypeId = data ? data[0].house_type_id : '';
                    } else {
                        this.taskType = '1';
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 前往编辑页面跳转
            turnToPage() {
                getInfoByProjectId(this.projectInfo.project_id, 'project_type_text,city_id,name,project_id,project_type').then((data) => {
                    if (!data) {
                        return false;
                    }
                    let routeData = null;
                    if (this.taskType === '2') {
                        routeData = this.$router.resolve({
                            path: '/building/BuildAddHouseDetail',
                            query: {
                                projectId: data.project_id,
                                cityId: data.city_id,
                                projectName: data.name,
                                buildingType: `(${data.project_type_text})`,
                                houseTypeId: this.paramHouseTypeId,
                                role: 'operation'
                            }
                        });
                    } else {
                        routeData = this.$router.resolve({
                            path: '/building/BuildAddHouseDetail',
                            query: {
                                projectId: data.project_id,
                                cityId: data.city_id,
                                projectName: data.name,
                                buildingType: `(${data.project_type_text})`,
                                role: 'operation'
                            }
                        });
                    }
                    // 埋点
                    this.setTrack('4825');
                    let opener = window.open(routeData.href, "_blank");
                    opener.opener = null;
                });
            },
            // 点击确认关闭弹窗
            floorConfirm() {
                this.setTrack('5343', {
                    error_type: this.houseValidateStatus == '3' ? '2' : '4'
                });
                this.housedialogVisible = false;
            },
            // 点击楼盘跳转
            houseHrefHandle() {
                this.setTrack('5344', {
                    error_type: this.houseValidateStatus == '3' ? '2' : '4'
                });
                this.housedialogVisible = false;
            },
            // 系统判断超出10万时或者低于1万的系统进行的单价录入提示弹窗关闭
            priceValitClose() {
                this.setTrack('5352', {});
                this.priceValitShow = false;
                this.isSaveNext = false;
                this.isVilidateLimit = true;
            },
            // 点击确认并保存
            priceValitConfirm() {
                this.isVilidateLimit = false;
                this.setTrack('5351', {});
                // 关闭弹窗
                this.priceValitShow = false;
                if (this.isSaveNext) {
                    this.saveData('nextTask');
                    return;
                }
                this.saveData();
            },
            // 价格上下限判断弹窗 关闭更新弹窗显示值
            closeDialog() {
                this.priceValitShow = false;
            },
            // 关闭户型校验弹窗
            dialogConfirm() {
                this.housedialogVisible = false;
            },
            // 价格信息提示弹窗确认
            priceMsgConfirm() {
                //  埋点
                this.setTrack('5346', {});
                // 将是否验证价格置为fasle
                this.isValidatePrice = false;
                // 关闭弹窗
                this.priceMsgDialogShow = false;
                if (this.isSaveNext) {
                    this.saveData('nextTask');
                    return;
                }
                this.saveData();
            },
            // 价格信息提示弹窗 修改
            priceMsgEdit() {
                //  埋点
                this.setTrack('5345', {});
                // 关闭弹窗
                this.priceMsgDialogShow = false;
            },
            /**
             * 楼盘字典V3.2优化新增方法
             * author: 解彬
             * time: 2019.9.16
             */
            searchsIsShow() {
                this.serchIsShow = !this.serchIsShow;
                if (this.serchIsShow) {
                    this.isShowText = '隐藏';
                    this.setTrack('5064', { is_show_search: '1' });
                } else {
                    this.isShowText = '展开';
                    this.setTrack('5064', { is_show_search: '2' });
                }
                // 记录显示状态
                localStorage.setItem('showStatus', this.serchIsShow);
            },
            /**
             * 厅室描述和户型居室select联动
             * @params [String] inptVal 厅室描述输入的值
             * @params [String] source 来源，点击竞品联动要记录来源
             */
            houseLinkage(inptVal, source) {
                if (inptVal && inptVal.indexOf('室') >= 0) {
                    let houseVal = parseInt(
                        inptVal.substr(0, inptVal.indexOf('室'))
                    );
                    if (houseVal <= 5 && houseVal > 1) {
                        this.operationObj.room_type.value = houseVal;
                        this.$set(this.source, 'room_type__source', source || '运营');
                    } else if (houseVal > 5) {
                        this.operationObj.room_type.value = 5;
                        this.$set(this.source, 'room_type__source', source || '运营');
                    }
                }
            },
            /* END */
            /**
             * 公共埋点方法
             * @param {String} para 埋点ID
             * @param {Object} config 埋点扩展子字段
             */
            setTrack(para, config) {
                // 如果有扩展字段不为空 添加page相关参数
                if (config) {
                    Object.assign(config, {
                        frompage_id: 'p_house_type_task',
                        topage_id: 'p_house_type_task'
                    });
                }
                commonFun.setTrackMenu(para, config);
            },
            // 更换关联关系
            leaveChange() {
                // /index.php?r=bd-house-type/index&cityId=【当前选中城市id】&groupName=【当期楼盘名称】&projectGroupState=0
                let url = `/index.php?r=bd-house-type/index&cityId=${this.projectInfo.city_id}&group_project_id=${this.projectInfo.group_project_id}&selected_project_name=${this.projectInfo.selected_project_name}&projectGroupState=0`;
                window.open(url, '_blank');
            },
            upDataTab() {
                this.setTrack('5068');
                // 添加重新计算时 判断任务中有没有被关联的数据源户型 标识为 reCompute
                if (this.data_source_list.length == 0) {
                    // 清空task_id
                    this.getData(3, 'reCompute');
                } else {
                    this.getData('', 'reCompute');
                }
            },
            // 展开收起效果
            editHouseType(type) {
                if (type == 1) {
                    this.$refs.houseType.style.height = 'auto';
                    this.isShowOpen = false;
                } else {
                    this.$refs.houseType.style.height = '55px';
                    this.isShowOpen = true;
                }
            },
            // 跳转到任务列表
            skipToTaskList() {
                window.location.href =
                    '/index.php?r=cj-project-task/unfinished-task';
            },
            // 新页面打开任务
            skipTask(para) {
                // 保存跳转内容，在弹出框使用
                this.currentTurn = para;
                // 编辑过
                if (this.isHasEdit) {
                    this.saveTaskWarn = true;
                } else {
                    if (para.title === '楼盘信息' || para.title === '楼栋') {
                        this.$router.push({ path: para.url });
                    } else {
                        window.open(para.url, '_blank');
                    }
                }
            },
            // 校验小数点
            inputMatch (para, key, len) {
                if (key == 'ac_acreage' || key == 'floor_height') {
                    this.operationObj[key].value = para.replace(/[^\d.]/g, '');
                    this.operationObj[key].value = this.operationObj[
                        key
                    ].value.replace(/\.{2,}/g, '');
                    this.operationObj[key].value = this.operationObj[key].value
                        .replace('.', '$#$')
                        .replace(/\./g, '')
                        .replace('$#$', '.');
                    this.operationObj[key].value = this.operationObj[
                        key
                    ].value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                } else if (key == 'offer_price') {
                    this.operationObj[key].value = para.replace(/[^\d.]/g, '');
                    this.operationObj[key].value = this.operationObj[
                        key
                    ].value.replace(/\.{2,}/g, '');
                    this.operationObj[key].value = this.operationObj[key].value
                        .replace('.', '$#$')
                        .replace(/\./g, '')
                        .replace('$#$', '.');
                    this.operationObj[key].value = this.operationObj[
                        key
                    ].value.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3');
                } else if (key == 'price') {
                    this.countPrice = this.countPrice.replace(/[^\d.]/g, '');
                    this.countPrice = this.countPrice.replace(/\.{2,}/g, '');
                    this.countPrice = this.countPrice
                        .replace('.', '$#$')
                        .replace(/\./g, '')
                        .replace('$#$', '.');
                    this.countPrice = this.countPrice.replace(
                        /^(\-)*(\d+)\.(\d\d\d\d).*$/,
                        '$1$2.$3'
                    );
                }
            },
            // 保存并跳转
            saveSkip(para) {
                // saveWarn saveTaskWarn saveNextWarn
                // para  house切换户型  task切换任务  next下一个楼盘
                if (para === 'house') {
                    // 下一个楼盘
                    this.saveData('house');
                    this.saveWarn = false;
                } else if (para === 'task') {
                    this.saveData('task');
                    this.saveTaskWarn = false;
                } else if (para === 'next') {
                    this.saveData('next');
                    this.saveNextWarn = false;
                }
            },
            // 不保存
            notSaveSkip(para) {
                // saveWarn saveTaskWarn saveNextWarn
                // para  house切换户型  task切换任务  next下一个楼盘
                if (para == 'house') {
                    // house切换户型
                    this.currentHouseId = this.baseId;
                    this.taskInfo = this.deepCopy(this.baseTaskInfo);
                    this.saveWarn = false;
                    //  重新请求数据
                    this.getData();
                } else if (para == 'task') {
                    // task切换任务
                    this.saveTaskWarn = false;
                    if (
                        this.currentTurn.title === '楼盘信息' ||
                        this.currentTurn.title === '楼栋'
                    ) {
                        this.$router.push({ path: this.currentTurn.url });
                    } else {
                        window.open(this.currentTurn.url);
                    }
                    // 跳转任务详情
                } else if (para == 'next') {
                    // next下一个楼盘
                    this.getData(2);
                    this.saveNextWarn = false;
                }
                this.isHasEdit = false;
            },
            // 点击下一个楼盘
            nextProject() {
                if (this.isHasEdit) {
                    // 编辑过提示
                    this.saveNextWarn = true;
                } else {
                    // 为编辑过直接请求数据
                    this.getData(2);
                }
            },
            // 搜索
            searchData() {
                this.isTask = false;
                this.searchBuildObj = this.buildObj;
                this.getData(1);
                setTimeout(() => {
                    this.remoteMethod('');
                });
            },
            // 变化后添加颜色
            edit (para, val) {
                this.$set(this.source, para+'__source', '运营');
                // 单价改变影响总价来源，总价来源与单价来源保持一致
                if (para === 'offer_price') {
                    this.$set(this.source, 'price__source', '运营');
                }
                this.operationObj[para].is_diff_julive = true;
                // 编辑过标识
                this.isHasEdit = true;
            },
            // 区间值
            sectionData(para, num) {
                let number = parseFloat(num);
                let curr = parseFloat(para);
                return curr < number && curr >= 0;
            },
            // 保存
            saveData (para) {
                // 判断是否是下一步任务
                this.isSaveNext = para && para === 'nextTask';
                if (!this.signFlag) {
                    let houDesc = this.operationObj.summary.value;
                    // 校验-----开始
                    if (houDesc != '') {
                        let one =
                            houDesc.indexOf('室') == -1
                                ? ''
                                : houDesc.indexOf('室');
                        let two =
                            houDesc.indexOf('厅') == -1
                                ? ''
                                : houDesc.indexOf('厅');
                        let three =
                            houDesc.indexOf('厨') == -1
                                ? ''
                                : houDesc.indexOf('厨');
                        let four =
                            houDesc.indexOf('卫') == -1
                                ? ''
                                : houDesc.indexOf('卫');
                        if (one && two && three && four) {
                            if (one < two && two < three && three < four) {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (one && two && three) {
                            if (one < two && two < three) {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (one && two && four) {
                            if (one < two && two < four) {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (one && three && four) {
                            if (one < three && three < four) {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (one && two) {
                            if (one < two) {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (one && three) {
                            if (one < three) {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (one && four) {
                            if (one < four) {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (two && three && four) {
                            if (two < three && three < four) {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (two && three) {
                            if (two < three) {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (two && four) {
                            if (two < four) {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (three && four) {
                            if (three < four) {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (one && two == '' && three == '' && four == '') {
                            if (one !== '') {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (one == '' && two && three == '' && four == '') {
                            if (two !== '') {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (one == '' && two == '' && three && four == '') {
                            if (three !== '') {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        } else if (one == '' && two == '' && three == '' && four) {
                            if (four !== '') {
                                this.flag = true;
                            } else {
                                this.flag = false;
                            }
                        }

                        if (!this.flag) {
                            this.$message({
                                message:
                                    '厅室描述 必须满足“N室N厅N厨N卫”这样结构的内容',
                                type: 'warning',
                                duration: 3000
                            });
                            return false;
                        }
                        // 校验0室不能通过
                        if (one == '') {
                            this.$message({
                                message: '至少包含1室',
                                type: 'warning',
                                duration: 3000
                            });
                            return false;
                        }
                        var match = /^(\d+)室/.exec(houDesc);
                        var shi = 0;
                        if (match) {
                            shi = match[1];
                            if (!+shi) {
                                this.$message({
                                    message: '至少包含1室',
                                    type: 'warning',
                                    duration: 3000
                                });
                                return false;
                            }
                        }
                    }
                    if (houDesc == '') {
                        this.$message({
                            message: '厅室描述不能为空',
                            type: 'warning',
                            duration: 3000
                        });
                        return;
                    }
                    if (this.operationObj.room_type.value === '') {
                        this.$message({
                            message: '户型居室不能为空',
                            type: 'warning',
                            duration: 3000
                        });
                        return;
                    }
                    if (this.operationObj.status.value === '') {
                        this.$message({
                            message: '销售类型不能为空',
                            type: 'warning',
                            duration: 3000
                        });
                        return;
                    }
                    // 改为0 判断 ''和 '0'
                    if (
                        this.operationObj.acreage.value == 0 &&
                        this.operationObj.ac_acreage.value == 0
                    ) {
                        this.$message({
                            message: '建筑面积和套内面积必填一个',
                            type: 'warning',
                            duration: 3000
                        });
                        return;
                    }
                    // 户型总量
                    if (
                        this.operationObj.total_count.value != '' &&
                        !this.sectionData(
                            this.operationObj.total_count.value,
                            10000
                        )
                    ) {
                        this.$message({
                            message: '户型总量 必须在0-9999之间',
                            type: 'warning',
                            duration: 3000
                        });
                        return false;
                    }
                    // 建筑面积
                    if (
                        this.operationObj.acreage.value != '' &&
                        !this.sectionData(this.operationObj.acreage.value, 10000)
                    ) {
                        this.$message({
                            message: '建筑面积 必须在0-9999之间',
                            type: 'warning',
                            duration: 3000
                        });
                        return false;
                    }
                    // 套内面积
                    if (
                        this.operationObj.ac_acreage.value != '' &&
                        !this.sectionData(this.operationObj.ac_acreage.value, 10000)
                    ) {
                        this.$message({
                            message: '套内面积 必须在0-9999.99之间',
                            type: 'warning',
                            duration: 3000
                        });
                        return false;
                    }
                    // 系统判断超出10万时或者低于1万的系统进行的单价录入提示
                    if (
                        this.operationObj.offer_price.value !== '' &&
                        this.isVilidateLimit &&
                        (Number(this.operationObj.offer_price.value) >=
                            this.priceInfo.priceTop / 10000 ||
                            Number(this.operationObj.offer_price.value) <=
                                this.priceInfo.priceFloor / 10000)
                    ) {
                        const acreage = this.operationObj.acreage.value.toString();
                        const acAcreage = this.operationObj.ac_acreage.value.toString();
                        this.priceLimitMsg = `本次修改的户型${
                            this.operationObj.house_type_num.value
                        }
                    ${
                        acreage.trim() == 0 && acAcreage.trim() == 0
                            ? ''
                            : acreage.trim() != 0
                            ? '（' + acreage + '㎡）'
                            : '（套内' + acAcreage + '㎡）'
                    }单价为
                    ${
                        this.operationObj.offer_price.value
                    }万元/㎡系统判断价格可能存在异常，请确认是否正确录入！`;
                        this.priceValitShow = true;
                        return false;
                    }
                    // 总价
                    if (
                        this.countPrice != '' &&
                        !this.sectionData(this.countPrice, 1000000)
                    ) {
                        this.$message({
                            message: '总价 必须在0-999999.9999之间',
                            type: 'warning',
                            duration: 3000
                        });
                        return false;
                    }
                    // 户型在售量
                    if (
                        this.operationObj.house_on_sale_num.value != '' &&
                        !this.sectionData(
                            this.operationObj.house_on_sale_num.value,
                            10000
                        )
                    ) {
                        this.$message({
                            message: '户型在售量 必须在0-9999之间',
                            type: 'warning',
                            duration: 3000
                        });
                        return false;
                    }
                    // 售罄户型的在售余量不能大于0 status 3：售罄 4：待售 2：在售
                    if (this.operationObj.status.value == 3 && parseInt(this.operationObj.house_on_sale_num.value) > 0) {
                        // 弹窗提示
                        this.houseSailedDialogShow = true;
                        return false
                    }
                    // 在售\待售的户型在售余量不能为0 status 3：售罄 4：待售 2：在售
                    if (this.operationObj.status.value != 3 && parseInt(this.operationObj.house_on_sale_num.value) <= 0) {
                        // 弹窗提示
                        this.houseType = this.operationObj.house_type_num.value;
                        this.houseSailingDialogShow = true;
                        return false
                    }
                    // 层高
                    if (
                        this.operationObj.floor_height.value != '' &&
                        !this.sectionData(this.operationObj.floor_height.value, 100)
                    ) {
                        this.$message({
                            message: '层高 必须在0-99.99之间',
                            type: 'warning',
                            duration: 3000
                        });
                        return false;
                    }
                    /**
                     * 户型厅室联动保存校验
                     * @author xiebin
                     * @time 2019.9.25
                     */
                    let houseVal = parseInt(
                        this.operationObj.summary.value.substr(
                            0,
                            this.operationObj.summary.value.indexOf('室')
                        )
                    );
                    if (                        
                        (houseVal > 1 || (houseVal === 1 && (this.operationObj.room_type.value !== 0 && this.operationObj.room_type.value !== 7 ))) &&
                        houseVal <= 5 &&
                        houseVal !== this.operationObj.room_type.value
                    ) {
                        this.linkageDialog = true;
                        return false;
                    } else if (
                        houseVal > 1 &&
                        houseVal > 5 &&
                        this.operationObj.room_type.value !== 5
                    ) {
                        this.linkageDialog = true;
                        return false;
                    }

                    // 过滤删除户型的id
                    var ids = [];
                    this.delImgId.forEach(img => {
                        ids.push(img.id);
                    });

                    var newImg = [];
                    this.newImgUrl.forEach(img => {
                        newImg.push({
                            apart_img: img.apart_img,
                            apart_img__source: img.apart_img__source
                        });
                    });
                }

                let params = {
                    curr_project_id: this.projectInfo.project_id, // 当前居理楼盘id
                    house_type_id: this.currentHouseId, // 户型id
                    source: this.taskInfo.source, // 当前选中户型id的源
                    house_type_num: this.operationObj.house_type_num.value, // 户型编号
                    room_type: this.operationObj.room_type.value, // 户型编号
                    orientation: this.operationObj.orientation.value, // 房屋朝向
                    total_count: this.operationObj.total_count.value, // 户型总量
                    summary: this.operationObj.summary.value, // 厅室描述
                    house_tag: this.operationObj.house_tag.value && this.operationObj.house_tag.value.length > 0 ? this.operationObj.house_tag.value : '', // 户型标签
                    status: this.operationObj.status.value, // 销售类型
                    acreage: this.operationObj.acreage.value, // 建筑面积
                    ac_acreage: this.operationObj.ac_acreage.value, // 套内面积
                    offer_price: this.operationObj.offer_price.value, // 报价
                    price: this.countPrice, // 总价
                    house_on_sale_num: this.operationObj.house_on_sale_num.value, // 户型在售量
                    new_img_urls: newImg, // 新增户型图url
                    del_img_ids: ids, // 删除户型图id
                    floor_height: this.operationObj.floor_height.value, // 层高
                    good_desc: this.operationObj.good_desc.value, // 优势描述
                    bad_desc: this.operationObj.bad_desc.value, // 优势描述
                    buildings: this.value, // 关联楼栋
                    project_type_flag: this.signFlag ? 2 : 1,
                    is_validate_price: this.isValidatePrice ? 1 : 2
                };
                params = Object.assign(params, this.source);
                this.axios
                    .post('/backend-api/cj-house-type/save', params)
                    .then(res => {
                        // 保存成功后重置初始值
                        this.isSaveNext = false;
                        if (res.data.code == 0) {
                            // para  house切换户型  task切换任务  next下一个楼盘
                            if (para == 'nextTask') {
                                // 保存并进行下一个任务
                                // 更新两个值后在请求 house_type_id  task_id
                                this.currentHouseId = res.data.data.house_type_id;
                                this.taskId = res.data.data.next_task_id;
                                if (res.data.data.next_task_id !== '') {
                                    // 有id时 houseId 和source 置为空  无id时 执行下一个楼盘的
                                    this.getData(2, 'task');
                                } else {
                                    this.getData(2);
                                }
                                this.isHasEdit = false;
                            } else if (para == 'house') {
                                this.currentHouseId = this.baseId;
                                this.taskInfo = this.deepCopy(this.baseTaskInfo);
                                this.isHasEdit = false;
                                this.getData();
                            } else if (para == 'task') {
                                if (
                                    this.currentTurn.title === '楼盘信息' ||
                                    this.currentTurn.title === '楼栋'
                                ) {
                                    this.$router.push({
                                        path: this.currentTurn.url
                                    });
                                } else {
                                    window.open(this.currentTurn.url);
                                }
                                this.isHasEdit = false;
                            } else if (para == 'next') {
                                // 下一个楼盘
                                this.isHasEdit = false;
                                this.getData(2);
                            } else {
                                // 保存成功跳转任务列表页
                                this.skipToTaskList();
                            }
                            this.focusIndex = 0;
                            this.newImgUrl = [];
                            this.delImgId = [];
                        } else if (res.data.code === 20003) {
                            // 价钱是否合理， 不合理会给返回 20003 展示提示弹窗
                            const priceMsgInfo = res.data.data.warning_house_list;
                            const msgArr = priceMsgInfo.map(ele => {
                                return ele.text;
                            });
                            this.priceMsgInfo = `本次修改的户型${msgArr.join('、')}
                                单价涨跌超出${
                                    res.data.data.limit_price
                                }，请确认是否降价/涨价这么多！`;
                            this.priceMsgDialogShow = true;
                        } else if (res.data.code === 20002) {
                            // 待售楼盘不能存在在售且显示的户型、在售且显示的楼栋
                            this.houseValidateName = res.data.data.project_name;
                            this.houseValidateStatus = res.data.data.project_status;
                            this.houseValidateStatusName =
                                res.data.data.project_status_text;
                            this.houseLink = res.data.data.url;
                            // 展示弹窗
                            this.housedialogVisible = true;
                        } else if (res.data.code === 1) {
                            this.$message(res.data.data.summary ? res.data.data.summary : res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 计算总价
            countAllPrice() {
                // 建面  套面  报价 优先计算建面*报价
                let acr =
                    this.operationObj.acreage.value != ''
                        ? parseInt(this.operationObj.acreage.value)
                        : '';
                let acrT =
                    this.operationObj.ac_acreage.value != ''
                        ? parseFloat(this.operationObj.ac_acreage.value)
                        : '';
                let offPri =
                    this.operationObj.offer_price.value != ''
                        ? parseFloat(this.operationObj.offer_price.value)
                        : '';
                if (acr !== '' && offPri !== '') {
                    this.countPrice = this.numMulti(acr, offPri) + '';
                } else if (acrT !== '' && offPri !== '') {
                    this.countPrice = this.numMulti(acrT, offPri) + '';
                } else {
                    this.countPrice = '';
                }
                this.countPrice = this.countPrice.replace(/\.{2,}/g, '');
                this.countPrice = this.countPrice
                    .replace('.', '$#$')
                    .replace(/\./g, '')
                    .replace('$#$', '.');
                this.countPrice = this.countPrice.replace(
                    /^(\-)*(\d+)\.(\d\d\d\d).*$/,
                    '$1$2.$3'
                );
            },
            numMulti(num1, num2) {
                var baseNum = 0;
                try {
                    baseNum += num1.toString().split('.')[1].length;
                } catch (e) {}
                try {
                    baseNum += num2.toString().split('.')[1].length;
                } catch (e) {}
                return (
                    (Number(num1.toString().replace('.', '')) *
                        Number(num2.toString().replace('.', ''))) /
                    Math.pow(10, baseNum)
                );
            },
            // 打开轮播
            openSwiper(para) {
                this.transferPicIndex = 0;
                this.isShowSwiper = true;
                this.swiperList = para;
            },
            // 关闭轮播
            handleGallaryClick(para) {
                this.isShowSwiper = false;
            },
            // 切换居理户型id
            changeHouId(task) {
                this.baseId = task.house_type_id;
                this.taskId = task.task_id;
                this.baseTaskInfo = this.deepCopy(task);
                if (this.isHasEdit) {
                    // 保存提示
                    this.saveWarn = true;
                    return;
                } else {
                    this.currentHouseId = task.house_type_id;
                    this.taskInfo = task;
                }
                this.isRemove = false;
                //  重新请求数据
                this.getData();
            },
            // 删除关联户型接口
            removeHouseInfo(para) {
                let params = {
                    bd_house_type_id: para.house_type_id,
                    cj_house_type_id: this.currentHouseId
                };
                if (this.taskInfo.source != '99') {
                    // 删除异常
                    this.dialogVisibleRemoveAbnormal = true;
                    return;
                }
                this.axios
                    .post('/backend-api/cj-house-type/relation-del', params)
                    .then(res => {
                        if (res.data.code == 0) {
                            this.isRemove = true;
                            // 删除成功后重新请求表格数据
                            this.getData();
                        } else {
                            alert(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 楼栋获取焦点
            focusSelect() {
                if (this.focusIndex < 1) {
                    this.remoteMethod('');
                    this.focusIndex++;
                }
            },
            // 获取已经关联了的楼栋数组
            getContactBuild() {
                let builds = this.operationObj.buildings
                    ? this.operationObj.buildings.value
                    : [];
                this.value = [];
                if (builds.length < 1) {
                    return;
                }
                builds.forEach((item, index) => {
                    var obj = {
                        id: item.building_id,
                        text: item.building_name
                    };
                    this.value.push(item.building_id);
                    this.options.push(obj);
                });
            },
            // 搜索楼栋
            remoteMethod(para) {
                let params = {
                    q: para,
                    project_id: this.searchBuildObj.id
                        ? this.searchBuildObj.id
                        : this.currProjectId
                    // expecting_building_ids: this.value
                };
                this.axios
                    .post('/backend-api/common/get-relation-building', params)
                    .then(res => {
                        if (res.status == 200) {
                            if (res.data.code == 0) {
                                this.loading = true;
                                this.loading = false;
                                if (res.data.data.length <= 0 && query == '') {
                                    let arr = [
                                        { id: '', text: '没有更多数据了' }
                                    ];
                                    this.options = arr;
                                } else {
                                    this.options = res.data.data;
                                }
                                setTimeout(() => {
                                    this.value.splice(0, 0);
                                });
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 户型图多选 控制添加按钮
            statisState(val) {
                var arr = val.value.filter((item) => {
                    return item.state == true;
                });
                if (arr.length > 0) {
                    val.isEdit = true;
                } else {
                    val.isEdit = false;
                }
            },
            // 数组去重
            deteleObject(obj) {
                var uniques = [];
                var afterSum = [];
                var stringify = {};
                for (var i = 0; i < obj.length; i++) {
                    var keys = Object.keys(obj[i]);
                    keys.sort(function(a, b) {
                        return Number(a) - Number(b);
                    });
                    var str = '';
                    for (var j = 0; j < keys.length; j++) {
                        str += JSON.stringify(keys[j]);
                        str += JSON.stringify(obj[i][keys[j]]);
                    }
                    if (!stringify.hasOwnProperty(str)) {
                        uniques.push(obj[i]);
                        stringify[str] = true;
                    }
                }
                afterSum = uniques;
                return afterSum;
            },
            // 点击添加户型图
            addJuliveImg (key, val, source) {
                var check = val.filter((item) => {
                    return item.state == true;
                });
                check = check.map(item => {
                    item.apart_img__source = source;
                    return item;
                });
                // 如果左侧不存在则添加如果左侧不存在  则不添加
                var arr = this.operationObj[key].value.concat(check);
                // if (this.operationObj[key].value.length!=this.deteleObject(arr).length) {}
                this.newImgUrl = this.deteleObject(this.newImgUrl.concat(check));
                this.operationObj[key].is_diff_julive = true;
                this.operationObj[key].value = this.deteleObject(arr);
                this.isHasEdit = true;
                // 计算高度
                setTimeout(() => {
                    this.calculateHeigth();
                });
            },
            // 获取业态
            getProjectType() {
                let params = {
                    city_id: this.cityId
                };
                this.axios
                    .get('/backend-api/common/get-project-type-list', {
                        params: params
                    })
                    .then(res => {
                        if (res.data.code == 0) {
                            let result = res.data.data;
                            this.houseTypeOptions = result;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 获取区域
            getDistrict() {
                let params = {
                    city_id: this.cityId
                };
                this.axios
                    .get('/backend-api/common/get-district-list', {
                        params: params
                    })
                    .then(res => {
                        if (res.data.code == 0) {
                            let result = res.data.data;
                            this.distriOptions = result;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 获取城市
            getCity() {
                let params = {
                    type: 1
                };
                this.axios
                    .get('/backend-api/common/get-city-list', { params: params })
                    .then(res => {
                        if (res.data.code == 0) {
                            let result = res.data.data;
                            this.cityList = result;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 获取下拉选项
            getOptList() {
                let params = {
                    type: ['1', '2', '8', '9', '10'],
                    city_id: this.cityId // 城市id
                };
                this.axios
                    .post('/backend-api/common/get-project-config', params)
                    .then(res => {
                        if (res.data.code === 0) {
                            let result = res.data.data;
                            // 是否合作
                            this.isOporateOptions = result.cooperate_status;
                            // 户型标签
                            this.houseTag = result.house_tag;
                            // 朝向下拉
                            this.orientationList = result.room_orientation;
                            // 在售状态  表格中使用的
                            this.saleStatusOptions = result.sale_status;
                            // 居室类型
                            this.houseTypeRoom = result.room_type;
                            // 在售状态  搜索x
                            this.searchStatusOptions = result.sale_status;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 删除居理户型图
            deleteHouImg(val, index, key) {
                this.newImgUrl = this.newImgUrl.filter(img => {
                    return val.apart_img !== img.apart_img;
                });
                this.operationObj[key].is_diff_julive = true;
                this.operationObj[key].value.splice(index, 1);
                // 根据初始中户型图 来对比删除了哪个图片id
                let arr = this.baseHouImg.filter(item => {
                    return item.id == val.id;
                });
                let arr1 = this.delImgId.concat(arr);
                let arr2 = [...new Set(arr1)];

                this.delImgId = arr2;
                this.isHasEdit = true;
            },
            // 获取默认筛选项
            getCondition() {
                this.axios
                    .get('/backend-api/project/get-search-record')
                    .then(res => {
                        if (res.data.code == 0) {
                            let result = res.data.data;
                            // 楼盘信息
                            this.buildObj = result.project_info
                                ? result.project_info
                                : {};
                            this.searchBuildObj = result.project_info
                                ? result.project_info
                                : {};
                            // 城市id
                            this.cityId = result.city_id ? result.city_id : '';
                            // 销售状态
                            this.saleStatusSele = result.status
                                ? result.status
                                : '';
                            // 区域信息
                            this.distriSele = result.district_id
                                ? result.district_id
                                : [];
                            // 业态信息
                            this.houseTypeSele = result.project_type
                                ? result.project_type
                                : [];
                            // 是否合作
                            this.isOporateSele = result.is_cooperate
                                ? result.is_cooperate
                                : '';
                            // 是否勾选了非售罄户型
                            this.sailChecked = result.is_not_sell_out == '1';
                            // 从url进入
                            if (this.$route.query.nextProjectType) {
                                this.nextProjectType = this.$route.query.nextProjectType;
                            }
                            if (this.$route.query.isNext) {
                                this.isNext = this.$route.query.isNext;
                            }
                            if (this.$route.query.curr_project_id) {
                                this.currProjectId = this.$route.query.curr_project_id;
                            }
                            if (this.$route.query.house_type_id) {
                                this.currentHouseId = this.$route.query.house_type_id;
                            }
                            if (this.$route.query.task_id) {
                                this.taskId = this.$route.query.task_id;
                            }
                            if (this.$route.query.is_task) {
                                this.isTask = this.$route.query.is_task;
                            }
                            if (this.$route.query.sourc) {
                                this.taskInfo.source = this.$route.query.sourc;
                            }
                            if (this.$route.query.city_id) {
                                this.cityId = this.$route.query.city_id;
                            }
                            if (this.$route.query.district_id) {
                                this.distriSele = this.$route.query.district_id.split(
                                    ','
                                );
                            }
                            if (this.$route.query.project_id) {
                                this.searchBuildObj.id = this.$route.query.project_id;
                            }
                            if (this.$route.query.project_type) {
                                this.houseTypeSele = this.$route.query.project_type.split(
                                    ','
                                );
                            }
                            if (this.$route.query.status) {
                                this.saleStatusSele = this.$route.query.status;
                            }
                            if (this.$route.query.is_cooperate) {
                                this.isOporateSele = this.$route.query.is_cooperate;
                            }
                            // 请求详情初始化数据
                            if (
                                this.nextProjectType == 'task' &&
                                this.isNext == 1
                            ) {
                                // 按照下一个楼盘请求
                                this.getData(2);
                            } else if (
                                this.isNext == 0 &&
                                this.currProjectId == ''
                            ) {
                                // 按照搜索请求
                                this.getData(1);
                            } else {
                                this.getData();
                            }
                            // 下拉选项
                            this.getOptList();
                            // 城市
                            this.getCity();
                            // 获取区域
                            this.getDistrict();
                            // 获取业态
                            this.getProjectType();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 初始化详情数据
            getData (type, para) {
                this.tablebLoading = true;
                this.source = {};
                // 处理参数
                let district = this.distriSele.join(',');
                let proType = this.houseTypeSele.join(',');

                var sourc = '';
                var currId = '';
                var task = '';
                // type为1 时是搜索 为2是下一个楼盘
                if (type == 1) {
                    sourc = '';
                    currId = '';
                    task = '';
                    this.currentHouseId = '';
                    this.isNext = 0;
                } else if (type == 2) {
                    sourc = '';
                    currId = this.currProjectId;
                    task = this.taskId;
                    this.isNext = 1;
                    this.currentHouseId = '';
                } else if (type == 4) {
                    // 勾选非售罄户型时需要传楼盘id
                    sourc = this.taskInfo.source;
                    currId = this.currProjectId;
                    task = '';
                    this.isNext = 0;
                } else {
                    sourc = this.taskInfo.source;
                    currId = this.currProjectId;
                    task = this.taskId;
                    this.isNext = 0;
                }
                if (this.isTask) {
                    this.nextProjectType = 'task';
                } else {
                    this.nextProjectType = '';
                }

                if (para == 'task') {
                    this.isNext = 0;
                }
                if (type == 3) {
                    task = '';
                }

                let params = {
                    next_project: this.isNext, // 下一个楼盘
                    next_project_type: this.nextProjectType, // 是否点击过搜索
                    curr_project_id: currId,
                    task_id: task,
                    house_type_id: this.currentHouseId, // 第一次不用传
                    source: sourc, // 第一次不用传
                    city_id: this.cityId,
                    district_id: district,
                    project_id: this.searchBuildObj.id,
                    project_type: proType,
                    status: this.saleStatusSele,
                    is_cooperate: this.isOporateSele,
                    is_not_sell_out: this.sailChecked === true ? 1 : 2
                };
                // 需要验证任务中是否有被关联的数据源户型
                if (para === 'reCompute') {
                    const relations = this.data_source_list.map(ele => {
                        return {
                            house_type_id: ele.house_type_id,
                            source: ele.source
                        };
                    });
                    const specialOps = {
                        is_refresh: 1,
                        old_relations: relations
                    };
                    Object.assign(params, specialOps);
                }
                this.axios
                    .get('/backend-api/cj-house-type/detail', { params: params })
                    .then(res => {
                        if (res.data.code == 0) {
                            let result = res.data.data;
                            // 保存价格校验的信息
                            this.priceInfo.priceLimit = result.price_limit;
                            this.priceInfo.priceFloor = result.price_floor;
                            this.priceInfo.priceTop = result.price_top;
                            // 参数
                            this.$router.push({
                                query: merge(
                                    {},
                                    {
                                        nextProjectType: this.nextProjectType,
                                        isNext: this.isNext,
                                        curr_project_id: this.currProjectId,
                                        house_type_id: this.currentHouseId,
                                        task_id: this.taskId,
                                        is_task: this.isTask,
                                        sourc: this.taskInfo.source,
                                        city_id: this.cityId,
                                        district_id: this.distriSele,
                                        project_id: this.searchBuildObj.id,
                                        project_type: this.houseTypeSele.join(','),
                                        status: this.saleStatusSele,
                                        is_cooperate: this.isOporateSele
                                    }
                                )
                            });

                            this.taskList = result.task_module;
                            this.houseTypeList = result.house_type_info;
                            if (this.houseTypeList.length > 20) {
                                this.$refs.houseType.style.height = 55 + 'px';
                                this.isShowOpen = true;
                            }

                            this.projectInfo = this.deepCopy(result.project_info);
                            this.currProjectId = result.project_info.project_id;
                            // 给左侧表头赋值
                            this.titleList = this.deepCopy(
                                result.grid_info.field_info
                            );
                            // 给操作列赋值
                            this.operationObj = this.deepCopy(
                                result.grid_info.julive_info
                            );

                            // 备份户型图信息
                            this.baseHouImg = this.deepCopy(
                                result.grid_info.julive_info.imgs.value
                            );
                            // 给数据源赋值
                            this.data_source_list = this.deepCopy(
                                result.grid_info.source
                            );

                            // 大数据列
                            this.bigData = this.deepCopy(result.big_data);
                            // 总价
                            this.countPrice = this.operationObj.price.value;

                            setTimeout(() => {
                                this.calculateHeigth();
                            });
                            // 关联楼栋
                            // this.remoteMethod('')
                        } else if (res.data.code === 1007) {
                            // 没有任务  提示无任务弹窗
                            this.dialogVisibleNoTask = true;
                        } else {
                            alert(res.data.msg);
                        }
                    })
                    .then(() => {
                        // 获取数据完成后置为false
                        if (this.isFirstLoad) {
                            this.isFirstLoad = false;
                        }
                        // 将滚动条恢复到顶部
                        let tableWrapper = document.getElementsByClassName(
                            'el-table__body-wrapper'
                        )[0];
                        tableWrapper.scrollTo(0, 0);
                        // 修改标记楼盘的状态
                        this.signFlag = false;
                        // 第一次加载状态
                        this.isFirst = false;
                        // 提示移出异常
                        if (this.isRemove && this.data_source_list.length === 0) {
                            this.isRemoveDialog = true; // 无源数据移除异常
                        }

                        // 关闭弹窗
                        this.tablebLoading = false;
                        this.getContactBuild();

                        if (this.$route.query.task_id != '' && this.isFir) {
                            // 第一次进页面时从url上根据任务id匹配当前展示任务
                            // 根据task_id  过滤出对应的house_type_id

                            let tsId = this.$route.query.task_id;
                            let arr = this.houseTypeList.filter(it => {
                                return it.task_id == tsId;
                            });

                            this.taskInfo = arr.length > 0 ? arr[0] : {};
                            this.isFir = false;
                        }
                        this.currentHouseId =
                            this.$route.query.house_type_id != ''
                                ? this.$route.query.house_type_id
                                : '';
                        if (this.currentHouseId) {
                            let arr = this.houseTypeList.filter(it => {
                                return it.house_type_id == this.currentHouseId;
                            });
                            this.taskInfo = arr.length > 0 ? arr[0] : {};
                        }

                        // 默认选中第一个户型
                        if (
                            this.houseTypeList.length > 0 &&
                            this.currentHouseId == ''
                        ) {
                            this.currentHouseId = this.houseTypeList[0].house_type_id;
                            this.taskInfo = this.houseTypeList[0];
                            this.taskId = this.houseTypeList[0].task_id;
                        }
                        if (this.taskInfo.source == '99') {
                            this.isShowSign = false;
                        } else {
                            this.isShowSign = true;
                        }
                        // 计算高度
                        setTimeout(() => {
                            this.$forceUpdate();
                            this.calculateHeigth();
                        });
                        // 获取当前任务类型
                        this.getTaskTypeById();
                    })
                    .catch(err => {
                        this.tablebLoading = false;
                        console.log(err);
                    });
            },
            /**
             * @description: 点击来源的值进行赋值
             * @param {String} source 来源名 
             * @return: 
             */
            choosenItem (para, paraKey, paraType, source, houstType) {
                // 点击数据源厅室联动
                if (typeof para.value === 'string' && houstType === 'houseLink') {
                    this.$set(this.source, paraKey+'__source', source);
                    this.houseLinkage(para.value, source);
                }
                if (paraType === 'string') {
                    // 字符串覆盖
                    if (para.value !== '') {
                        this.operationObj[paraKey] = this.deepCopy(para);
                        this.operationObj[paraKey].is_diff_julive = true;
                        this.$set(this.source, paraKey+'__source', source);
                    }
                } else if (paraType == 'tag') {
                    // 户型标签
                    // 找一下这个数组中是否有当前选中的  如果有才push到数组中
                    var isHas = this.houseTag.filter((item, index, arr) => {
                        if (
                            item.text == para &&
                            this.operationObj[paraKey].value.indexOf(para) == -1
                        ) {
                            return item.text == para;
                        }
                    });
                    if ( isHas.length > 0 ) {
                        this.operationObj[paraKey].value.push(isHas[0].text);
                        this.operationObj[paraKey].is_diff_julive = true;
                    }
                } else if (paraType === 'allPrice') {
                    this.countPrice = para.value;
                    this.operationObj[paraKey].is_diff_julive = true;
                    this.$set(this.source, paraKey+'__source',  source);
                    setTimeout(() => {
                        this.calculateHeigth();
                    });
                } else if (paraType === 'editUrl') {
                    this.operationObj[paraKey].value = para.value;
                    this.operationObj[paraKey].is_diff_julive = true;
                    this.$set(this.source, paraKey+'__source', source);
                } else if (paraType === 'editAllprice') {
                    // 字符串覆盖
                    if (para.value != '') {
                        this.operationObj[paraKey] = this.deepCopy(para);
                        this.operationObj[paraKey].is_diff_julive = true;
                        this.$set(this.source, paraKey+'__source', source);
                        this.countAllPrice();
                    }
                }
                // 单价改变影响总价来源，总价来源与单价来源保持一致
                if (paraKey === 'offer_price') {
                    this.$set(this.source, 'price__source', source);
                }
                // 编辑过标识
                this.isHasEdit = true;
            },
            // 点击楼盘名
            affirmHouse(val) {
                // 更新楼盘信息
                this.buildObj.id = val.id;
                this.buildObj.text = val.text;
            },
            // 搜索楼盘
            searchHouse(val, cb) {
                var list = [{}];
                let params = {
                    q: val,
                    city_id: this.cityId,
                    search_alias: true
                };
                this.axios
                    .get('/backend-api/common/get-project-list', { params: params })
                    .then(res => {
                        let result = res.data;
                        if (result.code === 0) {
                            if (JSON.stringify(result.data) == '{}') {
                                list = [{ value: '暂无数据' }];
                            } else {
                                // 在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
                                for (let i of result.data) {
                                    i.value = i.text; // 将想要展示的数据作为value
                                }
                                list = result.data;
                            }
                            cb(list);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 深度克隆
            deepCopy(obj) {
                var result = Array.isArray(obj) ? [] : {};
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object') {
                            result[key] = this.deepCopy(obj[key]);
                        } else {
                            result[key] = obj[key];
                        }
                    }
                }
                return result;
            },
            change() {
                setTimeout(() => {
                    this.calculateHeigth();
                });
            },
            // 重置筛选项
            resetBtn() {
                this.cityId = '';
                this.distriSele = [];
                this.houseTypeSele = [];
                this.saleStatusSele = '';
                this.isOporateSele = '';
                this.buildObj = {};
                this.searchBuildObj = {};
                this.isTask = false;
                this.getData();
            },
            // 动态计算高度
            calculateHeigth() {
                this.upHeight = true;
                this.$nextTick(() => {
                    this.maxHeight = [];
                    let heightList = [];
                    new Promise((resolve, reject) => {
                        for (var index = 0; index < Object.keys(this.titleList).length; index++) {
                            let liBox = document.getElementsByClassName(
                                'li-' + index
                            );
                            let allHeight = [];
                            for (let i = 0; i < liBox.length; i++) {
                                allHeight.push(liBox[i].offsetHeight);
                            }
                            let max = Math.max(...allHeight);
                            heightList.push(max);
                            resolve(heightList);
                        }
                    }).then(() => {
                        this.upHeight = false;
                        this.maxHeight = heightList;
                    });
                });
            }
        },
        components: {
            BuildingDictionarySwiper,
            MsgDialog
        },
        watch: {
            // 是否选中仅看非售罄户型组
            sailChecked(val, oldval) {
                // 初次进入页面不买点
                if (!this.isFirstLoad) {
                    this.setTrack('5067', { is_nosaleout_house: val ? '1' : '2' });
                    // 值变化时重新请求数据
                    this.getData(4);
                }
            },
            cityId: {
                handler: function(val, oldval) {
                    if (!this.isFirst) {
                        // 重新请求业态  区域信息
                        this.getDistrict();
                        this.getProjectType();
                    }

                    // 清空区域
                    if (!this.isFir) {
                        this.distriSele = [];
                    }

                    // 处理业态
                    let arr = [];
                    var baseAr = [];
                    var filterArr = [];
                    setTimeout(() => {
                        this.houseTypeSele = this.houseTypeSele
                            ? this.houseTypeSele
                            : [];
                        this.houseTypeSele.forEach((house, index) => {
                            filterArr = this.houseTypeOptions.filter(
                                (value) => {
                                    return value.id == house;
                                }
                            );
                            arr = arr.concat(filterArr);
                        });
                        if (arr.length > 0) {
                            arr.forEach((it, ind) => {
                                baseAr.push(it.id);
                            });
                        }
                        if (baseAr.length > 0) {
                            this.houseTypeSele = baseAr;
                        }
                    }, 200);
                },
                deep: true
            }
        }
    };
</script>

<!--弹窗公共样式 始-->
<style lang="less" scoped>
/deep/ .el-dialog__header {
    border-bottom: 1px solid #eaeaea;
    padding: 20px;
}
/deep/ .el-dialog {
    margin-top: 30vh !important;
    .el-dialog__footer {
        .el-button {
            min-width: 140px;
            padding: 12px 20px;
        }
    }
    .content-tex {
        font-size: 18px;
        color: #666666;
    }
    .single {
        width: 100%;
    }
}
/*解决打包后样式覆盖*/
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
</style>
<!--弹窗公共样式 止-->
<style scoped>
.tHead-box > li > div {
    min-height: 50px;
    border-left: 1px solid #f4f6f9;
    border-bottom: 1px solid #f4f6f9;
    word-break: break-all;
    word-wrap: break-word;
    line-height: 22px;
}
.tHead-box > li > div.mergeTd {
    border-left: none;
}
.tHead-box.tFixed > li > div {
    border-left: none;
    border-right: 1px solid #f4f6f9;
}
.tFixed.fixed-th {
    width: 35%;
}
.tFixed.fixed-td {
    width: 65%;
}
.tHead-box > li > div .house_wrap >>> .el-input {
    width: 170px;
}
.tHead-box > li > div .skip {
    color: #33a1ff;
    font-size: 14px;
    margin-left: 10px;
}
.tHead-box .inside-box li > div {
    word-break: break-all;
    min-height: 50px;
}
.tHead-box .inside-box li:last-of-type > div {
    border-bottom: none;
}
.tHead-box >>> .el-input .el-input__inner {
    height: 34px;
    line-height: 34px;
}
.tHead-box >>> .el-select {
    width: 100%;
    height: 34px;
    line-height: 34px;
}
.tHead-box >>> .el-select .el-input__icon {
    line-height: 34px;
}
.tFixed {
    float: left;
    width: 50%;
}
.table-box-wrapper >>> .el-table__body tr.hover-row > td {
    background-color: #fff;
}
.table-box-wrapper >>> .el-table .cell,
.table-box-wrapper >>> .el-table th div {
    padding-right: 0;
    padding-left: 0;
}
.table-box-wrapper >>> .el-table th .cell {
    position: relative;
    text-align: center;
}
.table-box-wrapper >>> .el-table th .cell .delete-info {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: -2px;
    color: #ff5c47;
}
.table-box-wrapper >>> .el-table td,
.table-box-wrapper >>> .el-table th {
    padding: 0;
}
.table-box-wrapper >>> .el-table th {
    border-right: 1px solid #f4f6f9;
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
    padding: 0 10px;
}
.table-box-wrapper >>> .el-table td .box-inner {
    height: 100%;
    padding: 7px 10px;
    box-sizing: border-box;
    position: relative;
}
.table-box-wrapper >>> .el-table td .box-inner.add-tag {
    background-color: #ffd19a;
}
.table-box-wrapper >>> .el-table td .box-inner .add-img {
    pointer-events: none;
    position: absolute;
    right: 10px;
    top: 7px;
    cursor: pointer;
    color: #33a1ff;
    opacity: 0.4;
}
.table-box-wrapper >>> .el-table td .box-inner .add-img.edit {
    opacity: 1;
    pointer-events: auto;
}
.table-box-wrapper >>> .el-table th:last-child {
    border-right: 1px solid #f4f6f9;
}
.table-box-wrapper
    >>> .el-table
    .el-table__row
    td:nth-child(2)
    .tHead-box
    > li
    > div {
    border-left: none;
}
.table-box-wrapper >>> .el-table .el-table__header-wrapper tr th {
    border-right: none;
    border-left: 1px solid #f4f6f9;
}
.table-box-wrapper >>> .el-table .el-table__header-wrapper tr th:nth-child(2) {
    border-left: none;
}
/* 样式 */
.content-main {
    padding: 0 15px;
}
.form-table-box {
    background-color: #fff;
}
.order-search {
    overflow: hidden;
}
.order-search >>> .el-select {
    width: 100%;
}
.order-search >>> .el-autocomplete {
    width: 100%;
}
.huilding-compare-box .order-search >>> .el-select {
    height: 40px;
}
.form-table-box .batch-btn-area {
    text-align: right;
}
.batch-form-box >>> .el-form-item {
    margin-bottom: 0;
}
.center-link {
    text-align: center;
    line-height: 50px;
    color: #33a1ff;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
}
.center-link > span {
    display: inline-block;
}
.order-search >>> .el-select .el-select__tags {
    height: 24px;
    overflow: hidden;
    flex-wrap: nowrap;
}
.tap-toggle {
    float: right;
    margin-top: 10px;
}
.dialog-alink {
    color: #33a1ff;
    text-decoration-line: underline;
}
.house-type-font {
    font-size: 16px !important;
}
</style>
<style lang="less" scoped>
.content-main {
    .btn-wrap {
        margin-top: 50px;
        margin-bottom: 10px;
        text-align: center;
    }
}
.v-table {
    .hd {
        border-bottom: none;
        line-height: 50px;
    }
}
.table-box-wrapper {
    /deep/.el-table {
        .el-loading-mask {
            z-index: 12 !important;
        }
        .box-inner {
            &.error {
                color: #2846f5;
            }
            > span {
                a {
                    padding: 0 5px;
                }
            }
            &.is-diff {
                background-color: #fff8a6;
            }
            > span {
                cursor: pointer;
            }
            .build-name {
                padding-right: 5px;
                cursor: pointer;
            }
            .el-select__tags {
                overflow: hidden;
                flex-wrap: nowrap;
            }
            .house-item {
                cursor: pointer;
            }
            &.good-desc {
                /deep/.el-textarea {
                    height: 100%;
                    .el-textarea__inner {
                        min-height: 100px !important;
                    }
                }
            }
            .el-textarea {
                height: 100%;
                .el-textarea__inner {
                    height: 100%;
                }
            }
            .img-wrap {
                display: inline-block;
                position: relative;
                width: 100px;
                height: 100px;
                margin: 6px;
                .el-checkbox {
                    position: absolute;
                    right: -3px;
                    top: -6px;
                    margin-right: 0;
                }
                .delete {
                    display: inline-block;
                    position: absolute;
                    right: -3px;
                    top: -3px;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .img-container {
                box-sizing: border-box;
                padding-right: 30px;
            }
        }
        .house-item {
            padding: 3px 5px;
        }
    }
    .tab-info {
        position: relative;
        .matchup {
            position: absolute;
            right: 0;
            top: 0;
            > div {
                line-height: 20px;
                span {
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
            .up-data {
                color: #33a1ff;
                cursor: pointer;
            }
        }
    }
    .el-col-title {
        width: 100%;
        font-size: 14px;
        font-weight: bold;
        color: #000;
        .next-project {
            display: inline-block;
            color: #33a1ff;
            margin-left: 10px;
            cursor: pointer;
        }
    }
    .el-col-link {
        width: 100%;
        line-height: 34px;
        .col-link-th {
            float: left;
        }
        .col-link-td {
            overflow: hidden;
            padding-left: 10px;
            box-sizing: border-box;
            .checkbox .el-checkbox__label {
                font-size: 12px;
            }
            & > li {
                float: left;
                cursor: pointer;
                line-height: 34px;
                margin-right: 10px;
                &.is-task {
                    color: #33a1ff;
                    a {
                        color: #33a1ff;
                    }
                }
                &.no-task {
                    color: #aaa;
                    a {
                        color: #aaa;
                    }
                }
            }
        }
    }
    .el-col-type {
        width: 100%;
        line-height: 34px;
        min-height: 34px;
        > ul {
            overflow: hidden;
        }
        > div {
            text-align: right;
            span {
                cursor: pointer;
                display: inline-block;
                margin-right: 15px;
                font-size: 16px;
            }
        }
        li {
            float: left;
            cursor: pointer;
            line-height: 22px;
            height: 22px;
            min-width: 60px;
            padding: 0 5px;
            text-align: center;
            margin-right: 15px;
            border-radius: 6px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            margin-bottom: 5px;
            &.is-task {
                border: 1px solid #33a1ff;
                background-color: #fff;
                color: #33a1ff;
            }
            &.no-task {
                border: 1px solid #aaa;
                color: #aaa;
            }
            &.active {
                border: 1px solid #33a1ff;
                background-color: #33a1ff;
                color: #fff;
            }
        }
    }
    .table-box-row {
        margin-top: 10px;
        border-top: 1px solid #f4f6f9;
        border-left: 1px solid #f4f6f9;
    }
    .sign-wrap {
        padding: 10px 0;
        font-size: 14px;
    }
}
</style>
