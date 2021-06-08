<template>
    <div class="el-row huilding-compare-box">
        <el-col :span="24" class="content-main">
            <!--面包屑-->
            <el-breadcrumb class="bread-crumb-box" separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>
                    <a href="/">首页</a>
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    <a href="/index.php?r=cj-project-task/unfinished-task">任务列表页</a>
                </el-breadcrumb-item>
                <el-breadcrumb-item>楼盘信息对比</el-breadcrumb-item>
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
                    点击后可{{isShowText}}搜索条件
                    </el-button>
                </div>
                <div class="bd" v-show="serchIsShow">
                    <div class="order-search">
                        <ul class="s-query">
                            <li>
                                <div class="th">城市：</div>
                                <div class="td">
                                    <el-select v-model="cityId" placeholder="请选择" filterable>
                                        <el-option
                                            v-for="item in cityList"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id + ''"
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
                                            v-for="item in distriOptions"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">楼盘名称：</div>
                                <div class="td">
                                    <search-radio-select
                                        v-model="houseNameSele"
                                        :chosenObj="houseName"
                                        :api="'project-list'"
                                        :cityId="cityId"
                                        :isAppend="true"
                                        @getOption="getOption"
                                    ></search-radio-select>
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
                                            :label="item.text"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">销售状态：</div>
                                <div class="td">
                                    <el-select v-model="saleStatusSele" placeholder="请选择销售状态">
                                        <el-option
                                            v-for="item in saleStatusOptions"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id + ''"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li>
                                <div class="th">是否合作：</div>
                                <div class="td">
                                    <el-select v-model="isOporateSele" placeholder>
                                        <el-option
                                            v-for="item in isOporateOptions"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id + ''"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="btn-area">
                        <el-button @click="resetBtn">重置</el-button>
                        <el-button type="primary" @click="searchTb">搜索</el-button>
                    </div>
                </div>                
            </div>
            <!--表格展示区域-->
            <div class="v-box form-table-box v-table">
                <div class="bd">
                    <div class="table-box-wrapper">
                        <!--表格汇总信息展示-->
                        <div class="el-row">
                            <div class="el-col-title">
                                当前符合条件{{projectInfo.total_num}}个楼盘，当前楼盘：{{projectInfo.project_name}}
                                <span class="change-box td-operate-box" @click="chooseNext">下一个楼盘</span>
                            </div>
                            <div class="el-col-link">
                                <div class="col-link-th">该楼盘其余模块也存在任务：</div>
                                <ul class="col-link-td">
                                    <li
                                        :class="{'is-task': task.is_task, 'no-task': !task.is_task}"
                                        @click="turnPage(task)"
                                        v-for="(task, taskIndex) in taskList"
                                        :key="'taskIndex-' + taskIndex"
                                    >{{task.title}}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="table-box-row">
                            <!--表格-->
                            <el-table height="500" v-loading="tbLoading" :data="[0]">
                                <el-table-column
                                    fixed
                                    min-width="438"
                                    label="居理"
                                    :resizable="false"
                                >
                                    <template slot-scope="scope">
                                        <!--表头数据-->
                                        <ul class="tHead-box tFixed" v-if="scope.$index === 0">
                                            <li
                                                v-for="(itemVal, itemKey, thIndex) in titleList"
                                                :key="'item-tit-' + thIndex"
                                            >
                                                <div
                                                    v-if="!upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div
                                                        :class="{'title-wrap-box bg-red': itemVal.is_diff_julive, 'title-wrap-box': !itemVal.is_diff_julive}"
                                                    >
                                                        <div class="tb-box">{{itemVal.value}}</div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li
                                                v-for="(itemVal, itemKey, thIndex) in titleList"
                                                :key="'item-tit-height-' + thIndex"
                                            >
                                                <div v-if="upHeight" :class="'li-' + thIndex">
                                                    <div
                                                        :class="{'title-wrap-box bg-red': itemVal.is_diff_julive, 'title-wrap-box': !itemVal.is_diff_julive}"
                                                    >
                                                        <div class="tb-box">{{itemVal.value}}</div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <!--第一列对比数据-->
                                        <ul
                                            class="tHead-box tFixed tOperate"
                                            v-if="scope.$index === 0"
                                        >
                                            <li
                                                v-for="(itemVal, itemKey, thIndex) in operationObj"
                                                :key="'item-op-' + thIndex"
                                            >
                                                <div
                                                    v-if="!upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div class="operate-area">
                                                        <!--销售状态-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-if="itemKey === 'status'"
                                                        >
                                                            <el-select
                                                                v-model="itemVal.value"
                                                                placeholder
                                                                @change="changeColor(itemKey)"
                                                                :popper-append-to-body="false"
                                                            >
                                                                <el-option
                                                                    v-for="item in itemVal.options"
                                                                    :key="item.id"
                                                                    :label="item.text"
                                                                    :value="item.id + ''"
                                                                ></el-option>
                                                            </el-select>
                                                        </div>
                                                        <!--业态-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'type'"
                                                        >
                                                            <el-select
                                                                v-model="itemVal.value"
                                                                placeholder
                                                                @change="changeColor(itemKey)"
                                                                :popper-append-to-body="false"
                                                            >
                                                                <el-option
                                                                    v-for="item in itemVal.options"
                                                                    :key="item.id"
                                                                    :label="item.text"
                                                                    :value="parseInt(item.id)"
                                                                ></el-option>
                                                            </el-select>
                                                        </div>
                                                        <!--区域-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'district_id'"
                                                        >
                                                            <el-select
                                                                v-model="itemVal.value"
                                                                placeholder
                                                                @change="changeColor(itemKey)"
                                                                :disabled="!titleList[itemKey].is_allow_modify"
                                                                :popper-append-to-body="false"
                                                            >
                                                                <el-option
                                                                    v-for="item in itemVal.options"
                                                                    :key="item.id"
                                                                    :label="item.text"
                                                                    :value="parseInt(item.id)"
                                                                ></el-option>
                                                            </el-select>
                                                        </div>
                                                        <!--楼盘名称-->
                                                        <div
                                                            class="info-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'name'"
                                                        >
                                                            <div class="name-box-link">
                                                                <span
                                                                    class="like-a"
                                                                    @click="turnToPage('edit')"
                                                                >前往编辑页</span>
                                                            </div>
                                                            <div class="name-box">
                                                                <el-input
                                                                    v-model.trim="itemVal.value"
                                                                    @change="changeColor(itemKey)"
                                                                ></el-input>
                                                            </div>
                                                        </div>
                                                        <!--单价-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'project_price'"
                                                        >
                                                            <div class="all-price-box">
                                                                <div
                                                                    class="float-item float-item-long"
                                                                >
                                                                    <el-select
                                                                        v-model="operationObj[itemKey].type"
                                                                        placeholder
                                                                        @change="changePrice(operationObj[itemKey])"
                                                                        :popper-append-to-body="false"
                                                                    >
                                                                        <el-option
                                                                            :key="priceItem.id"
                                                                            :label="priceItem.text"
                                                                            :value="priceItem.id"
                                                                            :disabled="priceItem.id === 4"
                                                                            v-for="priceItem in operationObj[itemKey].options"
                                                                        ></el-option>
                                                                    </el-select>
                                                                </div>
                                                                <div class="float-item">
                                                                    <jl-number-input v-model="operationObj[itemKey].min_value"
                                                                        reg="fourNum"
                                                                        class="float-item-number"
                                                                        :disabled="operationObj[itemKey].input"
                                                                        @input="checkSource('unitPrice')"
                                                                        minVal="0.0001"
                                                                        maxVal="99.9999"></jl-number-input>
                                                                </div>
                                                                <!-- 为单价区间的时候展示 -->
                                                                <div class="float-item"
                                                                    v-if="operationObj[itemKey].type === 4">
                                                                    <jl-number-input v-model="operationObj[itemKey].max_value"
                                                                        @input="checkSource('unitPrice')"
                                                                        reg="fourNum"
                                                                        class="float-item-number"
                                                                        minVal="0.0001"
                                                                        maxVal="99.9999"></jl-number-input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--总价-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'total_price'"
                                                        >
                                                            <div class="all-price-box">
                                                                <div class="float-item">
                                                                    <el-select
                                                                        v-model="operationObj[itemKey].type"
                                                                        placeholder
                                                                        @change="allPriceChange(operationObj[itemKey], itemKey)"
                                                                        :popper-append-to-body="false"
                                                                    >
                                                                        <el-option
                                                                            v-for="item in itemVal.options"
                                                                            :key="item.id"
                                                                            :label="item.text"
                                                                            :value="item.id"
                                                                        ></el-option>
                                                                    </el-select>
                                                                </div>
                                                                <div class="float-item">
                                                                    <jl-number-input v-model="operationObj[itemKey].min_value"
                                                                        reg="fourNum"
                                                                        class="float-item-number"
                                                                        :disabled="operationObj[itemKey].minInput"
                                                                        @input="checkSource('totalPrice')"
                                                                        minVal="1"
                                                                        maxVal="99999.9999"></jl-number-input>
                                                                </div>
                                                                <div class="float-item"
                                                                    v-if="operationObj[itemKey].type == 1 || operationObj[itemKey].type == 4">
                                                                    <jl-number-input v-model="operationObj[itemKey].max_value"
                                                                        reg="fourNum"
                                                                        class="float-item-number"
                                                                        :disabled="operationObj[itemKey].maxInput"
                                                                        @input="checkSource('totalPrice')"
                                                                        minVal="1"
                                                                        maxVal="99999.9999"></jl-number-input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--别名-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'alias'"
                                                        >
                                                            <el-input
                                                                v-model="operationObj[itemKey].value"
                                                                @change="changeColor(itemKey)"
                                                            ></el-input>
                                                        </div>
                                                        <!--楼盘经纬度-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'lat_lng'"
                                                        >
                                                            <div class="item-box-wrapper">
                                                                <div class="float-item">
                                                                    <el-input
                                                                        v-model.trim="operationObj[itemKey].lng"
                                                                        @input="inputMatch(operationObj[itemKey].lng, 'lat_lng', 'lng')"
                                                                    ></el-input>
                                                                </div>
                                                                <div class="float-item">
                                                                    <el-input
                                                                        v-model.trim="operationObj[itemKey].lat"
                                                                        @input="inputMatch(operationObj[itemKey].lat, 'lat_lng', 'lat')"
                                                                    ></el-input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--位置描述、绿化率、车位比、开发商、供暖-->
                                                        <div
                                                            class="tb-box full-height"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'address' || itemKey === 'car_space' || itemKey === 'developer' || itemKey === 'heating'"
                                                        >
                                                            <el-input
                                                                v-model="operationObj[itemKey].value"
                                                                @change="changeColor(itemKey)"
                                                            ></el-input>
                                                        </div>
                                                        <!-- 绿化率 -->
                                                        <div
                                                            class="tb-box full-height greening-style"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'greening'"
                                                        >
                                                            <jl-number-input
                                                                :value="operationObj[itemKey].value"
                                                                reg="twoNum"
                                                                @input.native="changeColor(itemKey, $event)" /> %
                                                        </div>
                                                        <!--容积率-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'far'"
                                                        >
                                                            <el-input
                                                                v-model.trim="operationObj[itemKey].value"
                                                                @input="inputMatch(operationObj[itemKey].value, 'far', 'value')"
                                                            ></el-input>
                                                        </div>
                                                        <!--分期-->
                                                        <div
                                                            class="float-item-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'staging'"
                                                        >
                                                            <div class="tb-box-wrapper">
                                                                <!--分期数组-->
                                                                <div
                                                                    class="associated-building-box"
                                                                    v-for="(install, installIndex) in itemVal.value"
                                                                    :key="'installment-' + installIndex"
                                                                >
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteItem(installIndex, install, 'stage', itemKey)"
                                                                    ></span>
                                                                    <div class="input-area">
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="installIndex === 0"
                                                                            >分期名称</div>
                                                                            <el-input
                                                                                v-model="install.staging_name"
                                                                                @change="changeColor(itemKey, installIndex, 'stageName')"
                                                                            ></el-input>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="installIndex === 0"
                                                                            >销售状态</div>
                                                                            <el-select
                                                                                v-model="install.sale_status"
                                                                                placeholder
                                                                                @change="changeColor(itemKey, installIndex, 'stageStatus')"
                                                                                :popper-append-to-body="false"
                                                                            >
                                                                                <el-option
                                                                                    v-for="item in itemVal.options"
                                                                                    :key="item.id"
                                                                                    :label="item.text"
                                                                                    :value="item.id + ''"
                                                                                ></el-option>
                                                                            </el-select>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="installIndex === 0"
                                                                            >关联楼栋</div>
                                                                            <search-select
                                                                                v-model="install.relation_building_ids"
                                                                                @seleChange="changeHouseName($event,installIndex)"
                                                                                :chosenObj="install.relation_buildings"
                                                                                :currenArr="itemVal.value"
                                                                                :checkKey="itemKey"
                                                                                :currentIndex="installIndex"
                                                                                :projectId="projectInfo.project_id"
                                                                            ></search-select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!--新增楼栋-->
                                                            <div
                                                                :class="{'associated-building-link': itemVal.value.length > 0, 'associated-building-link no-border': itemVal.value.length == 0}"
                                                            >
                                                                <span
                                                                    class="like-a"
                                                                    @click="turnToPage('house')"
                                                                >新增楼栋</span>
                                                            </div>
                                                        </div>
                                                        <!--交房时间-->
                                                        <div
                                                            class="float-item-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'live_date'"
                                                        >
                                                            <div class="tb-box-wrapper">
                                                                <div
                                                                    class="associated-building-box receive_room-box"
                                                                    v-for="(room, roomIndex) in itemVal.value"
                                                                    :key="'roomIndex-' + roomIndex"
                                                                >
                                                                    <div class="input-area">
                                                                        <span
                                                                            class="iconfont iconguanbi"
                                                                            @click="deleteItem(roomIndex, room, 'time', itemKey)"
                                                                        ></span>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="roomIndex === 0"
                                                                            >类型</div>
                                                                            <el-select
                                                                                v-model="room.type"
                                                                                placeholder
                                                                                @change="changeColor(itemKey)"
                                                                                :popper-append-to-body="false"
                                                                            >
                                                                                <el-option
                                                                                    v-for="item in itemVal.options"
                                                                                    :key="item.id"
                                                                                    :label="item.text"
                                                                                    :value="item.id +''"
                                                                                ></el-option>
                                                                            </el-select>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="roomIndex === 0"
                                                                            >时间</div>
                                                                            <div
                                                                                class="date-box-cancat"
                                                                            >
                                                                                <building-dictionary-select
                                                                                    :sourceDate="matchObj(room, roomIndex, 'time')"
                                                                                    @getCallbackDate="getSeleRoomTime"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="roomIndex === 0"
                                                                            >关联楼栋</div>
                                                                            <search-select
                                                                                v-model="room.relation_building_ids"
                                                                                @seleChange="changeHouseName($event,roomIndex)"
                                                                                :chosenObj="room.relation_buildings"
                                                                                :currenArr="itemVal.value"
                                                                                :checkKey="itemKey"
                                                                                :currentIndex="roomIndex"
                                                                                :projectId="projectInfo.project_id"
                                                                            ></search-select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!--占位-->
                                                            <div
                                                                :class="{'associated-building-link': itemVal.value.length > 0, 'associated-building-link no-border': itemVal.value.length == 0}"
                                                            ></div>
                                                        </div>
                                                        <!--放量计划-->
                                                        <div
                                                            class="float-item-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'volume_date'"
                                                        >
                                                            <div class="tb-box-wrapper">
                                                                <div
                                                                    class="associated-building-box receive_room-box"
                                                                    v-for="(plan, planIndex) in itemVal.value"
                                                                    :key="'planIndex-' + planIndex"
                                                                >
                                                                    <div class="input-area">
                                                                        <span
                                                                            class="iconfont iconguanbi"
                                                                            @click="deleteItem(planIndex, plan, 'plan', itemKey)"
                                                                        ></span>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="planIndex === 0"
                                                                            >类型</div>
                                                                            <el-select
                                                                                v-model="plan.type"
                                                                                placeholder
                                                                                @change="changeColor(itemKey, planIndex)"
                                                                                :popper-append-to-body="false"
                                                                            >
                                                                                <el-option
                                                                                    v-for="item in itemVal.options"
                                                                                    :key="item.id"
                                                                                    :label="item.text"
                                                                                    :value="item.id + ''"
                                                                                ></el-option>
                                                                            </el-select>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="planIndex === 0"
                                                                            >时间</div>
                                                                            <div
                                                                                class="date-box-cancat"
                                                                            >
                                                                                <!--年月日旬组件-->
                                                                                <building-dictionary-select
                                                                                    :sourceDate="matchObj(plan, planIndex, 'plan')"
                                                                                    @getCallbackDate="getSeleTime"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="planIndex === 0"
                                                                            >关联楼栋</div>
                                                                            <search-select
                                                                                v-model="plan.relation_building_ids"
                                                                                @seleChange="changeHouseName($event,planIndex)"
                                                                                :chosenObj="plan.relation_buildings"
                                                                                :currenArr="itemVal.value"
                                                                                :checkKey="itemKey"
                                                                                :currentIndex="planIndex"
                                                                                :projectId="projectInfo.project_id"
                                                                            ></search-select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!--占位-->
                                                            <div
                                                                :class="{'associated-building-link': itemVal.value.length > 0, 'associated-building-link no-border': itemVal.value.length == 0}"
                                                            ></div>
                                                        </div>
                                                        <!--产权年限-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'property_year'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper"
                                                                v-for="(own, ownIndex) in itemVal.value"
                                                                :key="'ownIndex-' + ownIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, ownIndex)"
                                                                    ></span>
                                                                    <div
                                                                        class="float-item float-item-long"
                                                                    >
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="ownIndex === 0"
                                                                        >年限</div>
                                                                        <el-select
                                                                            v-model="own.type"
                                                                            placeholder
                                                                            @change="changeColor(itemKey, ownIndex)"
                                                                            :popper-append-to-body="false"
                                                                        >
                                                                            <el-option
                                                                                v-for="item in itemVal.options"
                                                                                :key="item.id"
                                                                                :label="item.text"
                                                                                :value="item.id + ''"
                                                                            ></el-option>
                                                                        </el-select>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="ownIndex === 0"
                                                                        >其他</div>
                                                                        <el-input
                                                                            v-model="own.other_note"
                                                                            v-if="own.type == -1"
                                                                            @change="changeColor(itemKey, ownIndex, 'isYear')"
                                                                        ></el-input>
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="own.type != -1"
                                                                        ></div>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="ownIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="own.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,ownIndex)"
                                                                            :chosenObj="own.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="ownIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'year')"
                                                                >新增产权年限</span>
                                                            </div>
                                                        </div>
                                                        <!--建设阶段-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'construction_stage'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper phase-box-wrapper"
                                                                v-for="(phase, phaseIndex) in itemVal.value"
                                                                :key="'phaseIndex-' + phaseIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, phaseIndex)"
                                                                    ></span>
                                                                    <div
                                                                        class="float-item float-item-long"
                                                                    >
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="phaseIndex === 0"
                                                                        >类型</div>
                                                                        <el-select
                                                                            v-model="phase.type"
                                                                            placeholder
                                                                            @change="changeColor(itemKey, phaseIndex)"
                                                                            :popper-append-to-body="false"
                                                                        >
                                                                            <el-option
                                                                                v-for="item in itemVal.options"
                                                                                :key="item.id"
                                                                                :label="item.text"
                                                                                :value="item.id + ''"
                                                                            ></el-option>
                                                                        </el-select>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="phaseIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="phase.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,phaseIndex)"
                                                                            :chosenObj="phase.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="phaseIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'phase')"
                                                                >新增建设阶段</span>
                                                            </div>
                                                        </div>
                                                        <!--建筑类型-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'business_layout'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper phase-box-wrapper"
                                                                v-for="(constType, constTypeIndex) in itemVal.value"
                                                                :key="'constTypeIndex-' + constTypeIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, constTypeIndex)"
                                                                    ></span>
                                                                    <div
                                                                        class="float-item float-item-long"
                                                                    >
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="constTypeIndex === 0"
                                                                        >类型</div>
                                                                        <el-select
                                                                            v-model="constType.type"
                                                                            placeholder
                                                                            @change="changeColor(itemKey, constTypeIndex)"
                                                                            :popper-append-to-body="false"
                                                                        >
                                                                            <el-option
                                                                                v-for="item in itemVal.options"
                                                                                :key="item.id"
                                                                                :label="item.text"
                                                                                :value="item.id + ''"
                                                                            ></el-option>
                                                                        </el-select>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="constTypeIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="constType.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,constTypeIndex)"
                                                                            :chosenObj="constType.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="constTypeIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'phase')"
                                                                >新增建筑类型</span>
                                                            </div>
                                                        </div>
                                                        <!--物业公司-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'property_company_id'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper property-box-wrapper"
                                                                v-for="(company, companyIndex) in itemVal.value"
                                                                :key="'companyIndex-' + companyIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, companyIndex)"
                                                                    ></span>
                                                                    <div
                                                                        class="float-item float-item-long"
                                                                    >
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="companyIndex === 0"
                                                                        >名称</div>
                                                                        <search-radio-select
                                                                            v-model="company.value.id"
                                                                            :chosenObj="company.value"
                                                                            :currentIndex="companyIndex"
                                                                            :isAppend="false"
                                                                            :projectId="projectInfo.project_id"
                                                                            @getOption="getCompanyOption"
                                                                            :api="'company'"
                                                                        ></search-radio-select>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="companyIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="company.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,companyIndex)"
                                                                            :chosenObj="company.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="companyIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'company')"
                                                                >新增物业公司</span>
                                                            </div>
                                                        </div>
                                                        <!--物业费-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'property_fee'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper property-box-wrapper"
                                                                v-for="(company, companyIndex) in itemVal.value"
                                                                :key="'companyIndex-' + companyIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, companyIndex)"
                                                                    ></span>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="companyIndex === 0"
                                                                        >名称</div>
                                                                        <el-input
                                                                            v-model.trim="company.value"
                                                                            @input="feeInput(company.value, companyIndex, itemKey)"
                                                                        ></el-input>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="companyIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="company.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,companyIndex)"
                                                                            :chosenObj="company.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="companyIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'fee')"
                                                                >新增物业费</span>
                                                            </div>
                                                        </div>
                                                        <!--水电气-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'water_electy'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper property-box-wrapper"
                                                                v-for="(water, waterIndex) in itemVal.value"
                                                                :key="'waterIndex-' + waterIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, waterIndex)"
                                                                    ></span>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="waterIndex === 0"
                                                                        >名称</div>
                                                                        <el-input
                                                                            v-model="water.value"
                                                                            @change="changeColor(itemKey, waterIndex)"
                                                                        ></el-input>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="waterIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="water.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,waterIndex)"
                                                                            :chosenObj="water.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="waterIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'fee')"
                                                                >新增水电气</span>
                                                            </div>
                                                        </div>
                                                        <!--装修情况-->
                                                        <div
                                                            class="float-item-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'decorate_info'"
                                                        >
                                                            <div
                                                                class="tb-box"
                                                                v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                            >
                                                                <div
                                                                    class="same-box-wrapper decorate-box-wrapper"
                                                                    v-for="(decorate, decorateIndex) in itemVal.value"
                                                                    :key="'decorateIndex-' + decorateIndex"
                                                                >
                                                                    <div class="input-area">
                                                                        <span
                                                                            class="iconfont iconguanbi"
                                                                            @click="deleteOperate(itemKey, decorateIndex)"
                                                                        ></span>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                            >名称</div>
                                                                            <el-select
                                                                                v-model="decorate.type"
                                                                                placeholder
                                                                                @change="change(itemKey, decorateIndex)"
                                                                                :popper-append-to-body="false"
                                                                            >
                                                                                <el-option
                                                                                    v-for="item in itemVal.options"
                                                                                    :key="item.id"
                                                                                    :label="item.text"
                                                                                    :value="item.id + ''"
                                                                                ></el-option>
                                                                            </el-select>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                            >关联楼栋</div>
                                                                            <search-select
                                                                                v-model="decorate.relation_building_ids"
                                                                                @seleChange="changeHouseName($event,decorateIndex)"
                                                                                :chosenObj="decorate.relation_buildings"
                                                                                :currenArr="itemVal.value"
                                                                                :checkKey="itemKey"
                                                                                :currentIndex="decorateIndex"
                                                                                :projectId="projectInfo.project_id"
                                                                            ></search-select>
                                                                        </div>
                                                                        <div
                                                                            class="float-item"
                                                                            v-if="decorate.type == 1"
                                                                        >
                                                                            <div
                                                                                class="float-item-tit"
                                                                            >费用</div>
                                                                            <el-input
                                                                                type="number"
                                                                                v-model="decorate.fee"
                                                                                @change="changeColor(itemKey,decorateIndex, 'isFee')"
                                                                            ></el-input>
                                                                        </div>
                                                                        <div
                                                                            class="float-item"
                                                                            v-if="decorate.type == 1"
                                                                        >
                                                                            <div
                                                                                class="float-item-tit"
                                                                            >装修单位</div>
                                                                            <el-input
                                                                                v-model="decorate.unit"
                                                                                @change="changeColor(itemKey, decorateIndex, 'isUnit')"
                                                                            ></el-input>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!--新增装修情况-->
                                                            <div
                                                                :class="{'associated-building-link': (itemVal.value ? itemVal.value.length > 0 : false), 'associated-building-link no-border': !(itemVal.value ? itemVal.value.length > 0 : false)}"
                                                            >
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'decorate')"
                                                                >新增装修情况</span>
                                                            </div>
                                                        </div>
                                                        <!--板块-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'area'"
                                                        >
                                                            <el-select
                                                                v-model="itemVal.value"
                                                                filterable
                                                                placeholder
                                                                @change="changeColor(itemKey)"
                                                                :popper-append-to-body="false"
                                                            >
                                                                <el-option
                                                                    v-for="item in itemVal.options"
                                                                    :key="item.id"
                                                                    :label="item.text"
                                                                    :value="item.id + ''"
                                                                ></el-option>
                                                            </el-select>
                                                        </div>
                                                        <!--环线-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'ring_road'"
                                                        >
                                                            <el-select
                                                                v-model="itemVal.value"
                                                                placeholder
                                                                @change="changeColor(itemKey)"
                                                                :popper-append-to-body="false"
                                                            >
                                                                <el-option
                                                                    v-for="item in itemVal.options"
                                                                    :key="item.id"
                                                                    :label="item.text"
                                                                    :value="item.id + ''"
                                                                ></el-option>
                                                            </el-select>
                                                        </div>
                                                        <!--楼盘标签-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'tags'"
                                                        >
                                                            <div class="label-box-wrapper">
                                                                <div
                                                                    class="label-radio-box"
                                                                    v-for="(tagVal, tagIndex) in itemVal"
                                                                    :key="'tagIndex-' + tagIndex"
                                                                >
                                                                    <div
                                                                        class="choose-box-tit"
                                                                    >{{tagVal.type_name}}</div>
                                                                    <div
                                                                        class="choose-box"
                                                                        v-if="!tagVal.checked"
                                                                    >
                                                                        <el-radio-group
                                                                            v-model="tagVal.model"
                                                                            @change="changeColor(itemKey)"
                                                                        >
                                                                            <el-radio
                                                                                :label="constrLabel.id + ''"
                                                                                v-for="(constrLabel, constrIndex) in tagVal.tags"
                                                                                :key="'constrIndex-' + constrIndex"
                                                                            >{{constrLabel.name}}</el-radio>
                                                                        </el-radio-group>
                                                                    </div>
                                                                    <div
                                                                        class="choose-box"
                                                                        v-if="tagVal.checked"
                                                                        @change="changeColor(itemKey)"
                                                                    >
                                                                        <el-checkbox-group
                                                                            v-model="tagVal.model"
                                                                            v-if="tagVal.checked"
                                                                        >
                                                                            <el-checkbox
                                                                                :label="commLabel.id + ''"
                                                                                v-for="(commLabel, commIndex) in tagVal.tags"
                                                                                :key="'commIndex-' + commIndex"
                                                                            >{{commLabel.name}}</el-checkbox>
                                                                        </el-checkbox-group>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            class="tb-box full-height"
                                                            v-else
                                                        >{{operationObj[itemKey].value}}</div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li
                                                v-for="(itemVal, itemKey, thIndex) in operationObj"
                                                :key="'item-op-height-' + thIndex"
                                            >
                                                <div v-if="upHeight" :class="'li-' + thIndex">
                                                    <div class="operate-area">
                                                        <!--销售状态-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-if="itemKey === 'status'"
                                                        >
                                                            <el-select
                                                                v-model="itemVal.value"
                                                                placeholder
                                                                @change="changeColor(itemKey)"
                                                                :popper-append-to-body="false"
                                                            >
                                                                <el-option
                                                                    v-for="item in itemVal.options"
                                                                    :key="item.id"
                                                                    :label="item.text"
                                                                    :value="item.id + ''"
                                                                ></el-option>
                                                            </el-select>
                                                        </div>
                                                        <!--业态-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'type'"
                                                        >
                                                            <el-select
                                                                v-model="itemVal.value"
                                                                placeholder
                                                                @change="changeColor(itemKey)"
                                                                :popper-append-to-body="false"
                                                            >
                                                                <el-option
                                                                    v-for="item in itemVal.options"
                                                                    :key="item.id"
                                                                    :label="item.text"
                                                                    :value="parseInt(item.id)"
                                                                ></el-option>
                                                            </el-select>
                                                        </div>
                                                        <!--区域-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'district_id'"
                                                        >
                                                            <el-select
                                                                v-model="itemVal.value"
                                                                placeholder
                                                                @change="changeColor(itemKey)"
                                                                :disabled="!titleList[itemKey].is_allow_modify"
                                                                :popper-append-to-body="false"
                                                            >
                                                                <el-option
                                                                    v-for="item in itemVal.options"
                                                                    :key="item.id"
                                                                    :label="item.text"
                                                                    :value="parseInt(item.id)"
                                                                ></el-option>
                                                            </el-select>
                                                        </div>
                                                        <!--楼盘名称-->
                                                        <div
                                                            class="info-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'name'"
                                                        >
                                                            <div class="name-box-link">
                                                                <span class="like-a">前往编辑页</span>
                                                            </div>
                                                            <div class="name-box">
                                                                <el-input
                                                                    v-model.trim="itemVal.value"
                                                                    @change="changeColor(itemKey)"
                                                                ></el-input>
                                                            </div>
                                                        </div>
                                                        <!--单价-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'project_price'"
                                                        >
                                                            <div class="all-price-box">
                                                                <div
                                                                    class="float-item float-item-long"
                                                                >
                                                                    <el-select
                                                                        v-model="operationObj[itemKey].type"
                                                                        placeholder
                                                                        @change="changePrice(operationObj[itemKey])"
                                                                        :popper-append-to-body="false"
                                                                    >
                                                                        <el-option
                                                                            :key="priceItem.id"
                                                                            :label="priceItem.text"
                                                                            :value="priceItem.id"
                                                                            v-for="priceItem in operationObj[itemKey].options"
                                                                        ></el-option>
                                                                    </el-select>
                                                                </div>
                                                                <div class="float-item">
                                                                    <jl-number-input v-model="operationObj[itemKey].min_value"
                                                                        reg="fourNum"
                                                                        class="float-item-number"
                                                                        :disabled="operationObj[itemKey].input"
                                                                        @input="checkSource"
                                                                        minVal="0.0001"
                                                                        maxVal="99.9999"></jl-number-input>
                                                                </div>
                                                                <!-- 为单价区间的时候展示 -->
                                                                <div class="float-item">
                                                                    <jl-number-input v-model="operationObj[itemKey].max_value"
                                                                        v-if="operationObj[itemKey].type === 4"
                                                                        @input="checkSource"
                                                                        reg="fourNum"
                                                                        class="float-item-number"
                                                                        minVal="0.0001"
                                                                        maxVal="99.9999"></jl-number-input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--总价-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'total_price'"
                                                        >
                                                            <div class="all-price-box">
                                                                <div class="float-item">
                                                                    <el-select
                                                                        v-model="operationObj[itemKey].type"
                                                                        placeholder
                                                                        @change="allPriceChange(operationObj[itemKey], itemKey)"
                                                                        :popper-append-to-body="false"
                                                                    >
                                                                        <el-option
                                                                            v-for="item in itemVal.options"
                                                                            :key="item.id"
                                                                            :label="item.text"
                                                                            :value="item.id"
                                                                        ></el-option>
                                                                    </el-select>
                                                                </div>
                                                                <div class="float-item">
                                                                    <jl-number-input v-model="operationObj[itemKey].min_value"
                                                                        reg="fourNum"
                                                                        class="float-item-number"
                                                                        :disabled="operationObj[itemKey].minInput"
                                                                        @input="checkSource('totalPrice')"
                                                                        minVal="1"
                                                                        maxVal="99999.9999"></jl-number-input>
                                                                </div>
                                                                <div class="float-item">
                                                                    <jl-number-input v-model="operationObj[itemKey].max_value"
                                                                        reg="fourNum"
                                                                        class="float-item-number"
                                                                        :disabled="operationObj[itemKey].maxInput"
                                                                        @input="checkSource('totalPrice')"
                                                                        v-if="operationObj[itemKey].type == 1 || operationObj[itemKey].type == 4"
                                                                        minVal="1"
                                                                        maxVal="99999.9999"></jl-number-input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--别名-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'alias'"
                                                        >
                                                            <el-input
                                                                v-model="operationObj[itemKey].value"
                                                                @change="changeColor(itemKey)"
                                                            ></el-input>
                                                        </div>
                                                        <!--楼盘经纬度-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'lat_lng'"
                                                        >
                                                            <div class="item-box-wrapper">
                                                                <div class="float-item">
                                                                    <el-input
                                                                        v-model.trim="operationObj[itemKey].lng"
                                                                        @input="inputMatch(operationObj[itemKey].lng, 'lat_lng', 'lng')"
                                                                    ></el-input>
                                                                </div>
                                                                <div class="float-item">
                                                                    <el-input
                                                                        v-model.trim="operationObj[itemKey].lat"
                                                                        @input="inputMatch(operationObj[itemKey].lat, 'lat_lng', 'lat')"
                                                                    ></el-input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--位置描述、绿化率、车位比、开发商、供暖-->
                                                        <div
                                                            class="tb-box full-height"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'address' || itemKey === 'car_space' || itemKey === 'developer' || itemKey === 'heating'"
                                                        >
                                                            <el-input
                                                                v-model="operationObj[itemKey].value"
                                                                @change="changeColor(itemKey)"
                                                            ></el-input>
                                                        </div>
                                                        <!-- 绿化率 -->
                                                        <div
                                                            class="tb-box full-height greening-style"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'greening'"
                                                        >
                                                        <jl-number-input
                                                            :value="operationObj[itemKey].value"
                                                            reg="twoNum"
                                                            @input.native="changeColor(itemKey, $event)" /> %
                                                        </div>
                                                        <!--容积率-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'far'"
                                                        >
                                                            <el-input
                                                                v-model.trim="operationObj[itemKey].value"
                                                                @input="inputMatch(operationObj[itemKey].value, 'far', 'value')"
                                                            ></el-input>
                                                        </div>
                                                        <!--分期-->
                                                        <div
                                                            class="float-item-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'staging'"
                                                        >
                                                            <div class="tb-box-wrapper">
                                                                <!--分期数组-->
                                                                <div
                                                                    class="associated-building-box"
                                                                    v-for="(install, installIndex) in itemVal.value"
                                                                    :key="'installment-' + installIndex"
                                                                >
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteItem(installIndex, install, 'stage', itemKey)"
                                                                    ></span>
                                                                    <div class="input-area">
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="installIndex === 0"
                                                                            >分期名称</div>
                                                                            <el-input
                                                                                v-model="install.staging_name"
                                                                                @change="changeColor(itemKey)"
                                                                            ></el-input>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="installIndex === 0"
                                                                            >销售状态</div>
                                                                            <el-select
                                                                                v-model="install.sale_status"
                                                                                placeholder
                                                                                @change="changeColor(itemKey)"
                                                                                :popper-append-to-body="false"
                                                                            >
                                                                                <el-option
                                                                                    v-for="item in itemVal.options"
                                                                                    :key="item.id"
                                                                                    :label="item.text"
                                                                                    :value="item.id + ''"
                                                                                ></el-option>
                                                                            </el-select>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="installIndex === 0"
                                                                            >关联楼栋</div>
                                                                            <search-select
                                                                                v-model="install.relation_building_ids"
                                                                                @seleChange="changeHouseName($event,installIndex)"
                                                                                :chosenObj="install.relation_buildings"
                                                                                :currenArr="itemVal.value"
                                                                                :checkKey="itemKey"
                                                                                :currentIndex="installIndex"
                                                                                :projectId="projectInfo.project_id"
                                                                            ></search-select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!--新增楼栋-->
                                                            <div
                                                                :class="{'associated-building-link': itemVal.value.length > 0, 'associated-building-link no-border': itemVal.value.length == 0}"
                                                            >
                                                                <a
                                                                    :href="itemVal.url"
                                                                    target="_blank"
                                                                >新增楼栋</a>
                                                            </div>
                                                        </div>
                                                        <!--交房时间-->
                                                        <div
                                                            class="float-item-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'live_date'"
                                                        >
                                                            <div class="tb-box-wrapper">
                                                                <div
                                                                    class="associated-building-box receive_room-box"
                                                                    v-for="(room, roomIndex) in itemVal.value"
                                                                    :key="'roomIndex-' + roomIndex"
                                                                >
                                                                    <div class="input-area">
                                                                        <span
                                                                            class="iconfont iconguanbi"
                                                                            @click="deleteItem(roomIndex, room, 'time', itemKey)"
                                                                        ></span>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="roomIndex === 0"
                                                                            >类型</div>
                                                                            <el-select
                                                                                v-model="room.type"
                                                                                placeholder
                                                                                @change="changeColor(itemKey)"
                                                                                :popper-append-to-body="false"
                                                                            >
                                                                                <el-option
                                                                                    v-for="item in itemVal.options"
                                                                                    :key="item.id"
                                                                                    :label="item.text"
                                                                                    :value="item.id +''"
                                                                                ></el-option>
                                                                            </el-select>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="roomIndex === 0"
                                                                            >时间</div>
                                                                            <div
                                                                                class="date-box-cancat"
                                                                            >
                                                                                <building-dictionary-select
                                                                                    
                                                                                    :sourceDate="matchObj(room, roomIndex, 'time')"
                                                                                    @getCallbackDate="getSeleRoomTime"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="roomIndex === 0"
                                                                            >关联楼栋</div>
                                                                            <search-select
                                                                                v-model="room.relation_building_ids"
                                                                                @seleChange="changeHouseName($event,roomIndex)"
                                                                                :chosenObj="room.relation_buildings"
                                                                                :currenArr="itemVal.value"
                                                                                :checkKey="itemKey"
                                                                                :currentIndex="roomIndex"
                                                                                :projectId="projectInfo.project_id"
                                                                            ></search-select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!--占位-->
                                                            <div
                                                                :class="{'associated-building-link': itemVal.value.length > 0, 'associated-building-link no-border': itemVal.value.length == 0}"
                                                            ></div>
                                                        </div>
                                                        <!--放量计划-->
                                                        <div
                                                            class="float-item-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'volume_date'"
                                                        >
                                                            <div class="tb-box-wrapper">
                                                                <div
                                                                    class="associated-building-box receive_room-box"
                                                                    v-for="(plan, planIndex) in itemVal.value"
                                                                    :key="'planIndex-' + planIndex"
                                                                >
                                                                    <div class="input-area">
                                                                        <span
                                                                            class="iconfont iconguanbi"
                                                                            @click="deleteItem(planIndex, plan, 'plan', itemKey)"
                                                                        ></span>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="planIndex === 0"
                                                                            >类型</div>
                                                                            <el-select
                                                                                v-model="plan.type"
                                                                                placeholder
                                                                                @change="changeColor(itemKey)"
                                                                                :popper-append-to-body="false"
                                                                            >
                                                                                <el-option
                                                                                    v-for="item in itemVal.options"
                                                                                    :key="item.id"
                                                                                    :label="item.text"
                                                                                    :value="item.id + ''"
                                                                                ></el-option>
                                                                            </el-select>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="planIndex === 0"
                                                                            >时间</div>
                                                                            <div
                                                                                class="date-box-cancat"
                                                                            >
                                                                                <!--年月日旬组件-->
                                                                                <building-dictionary-select
                                                                                    :sourceDate="matchObj(plan, planIndex, 'plan')"
                                                                                    @getCallbackDate="getSeleTime"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                                v-if="planIndex === 0"
                                                                            >关联楼栋</div>
                                                                            <search-select
                                                                                v-model="plan.relation_building_ids"
                                                                                @seleChange="changeHouseName($event,planIndex)"
                                                                                :chosenObj="plan.relation_buildings"
                                                                                :currenArr="itemVal.value"
                                                                                :checkKey="itemKey"
                                                                                :currentIndex="planIndex"
                                                                                :projectId="projectInfo.project_id"
                                                                            ></search-select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!--占位-->
                                                            <div
                                                                :class="{'associated-building-link': itemVal.value.length > 0, 'associated-building-link no-border': itemVal.value.length == 0}"
                                                            ></div>
                                                        </div>
                                                        <!--产权年限-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'property_year'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper"
                                                                v-for="(own, ownIndex) in itemVal.value"
                                                                :key="'ownIndex-' + ownIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, ownIndex)"
                                                                    ></span>
                                                                    <div
                                                                        class="float-item float-item-long"
                                                                    >
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="ownIndex === 0"
                                                                        >年限</div>
                                                                        <el-select
                                                                            v-model="own.type"
                                                                            placeholder
                                                                            @change="changeColor(itemKey, ownIndex)"
                                                                            :popper-append-to-body="false"
                                                                        >
                                                                            <el-option
                                                                                v-for="item in itemVal.options"
                                                                                :key="item.id"
                                                                                :label="item.text"
                                                                                :value="item.id + ''"
                                                                            ></el-option>
                                                                        </el-select>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="ownIndex === 0"
                                                                        >其他</div>
                                                                        <el-input
                                                                            v-model="own.other_note"
                                                                            v-if="own.type == -1"
                                                                            @change="changeColor(itemKey, ownIndex, 'isYear')"
                                                                        ></el-input>
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="own.type != -1"
                                                                        ></div>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="ownIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="own.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,ownIndex)"
                                                                            :chosenObj="own.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="ownIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'year')"
                                                                >新增产权年限</span>
                                                            </div>
                                                        </div>
                                                        <!--建设阶段-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'construction_stage'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper phase-box-wrapper"
                                                                v-for="(phase, phaseIndex) in itemVal.value"
                                                                :key="'phaseIndex-' + phaseIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, phaseIndex)"
                                                                    ></span>
                                                                    <div
                                                                        class="float-item float-item-long"
                                                                    >
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="phaseIndex === 0"
                                                                        >类型</div>
                                                                        <el-select
                                                                            v-model="phase.type"
                                                                            placeholder
                                                                            @change="changeColor(itemKey, phaseIndex)"
                                                                            :popper-append-to-body="false"
                                                                        >
                                                                            <el-option
                                                                                v-for="item in itemVal.options"
                                                                                :key="item.id"
                                                                                :label="item.text"
                                                                                :value="item.id + ''"
                                                                            ></el-option>
                                                                        </el-select>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="phaseIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="phase.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,phaseIndex)"
                                                                            :chosenObj="phase.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="phaseIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'phase')"
                                                                >新增建设阶段</span>
                                                            </div>
                                                        </div>
                                                        <!--建筑类型-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'business_layout'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper phase-box-wrapper"
                                                                v-for="(constType, constTypeIndex) in itemVal.value"
                                                                :key="'constTypeIndex-' + constTypeIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, constTypeIndex)"
                                                                    ></span>
                                                                    <div
                                                                        class="float-item float-item-long"
                                                                    >
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="constTypeIndex === 0"
                                                                        >类型</div>
                                                                        <el-select
                                                                            v-model="constType.type"
                                                                            placeholder
                                                                            @change="changeColor(itemKey, constTypeIndex)"
                                                                            :popper-append-to-body="false"
                                                                        >
                                                                            <el-option
                                                                                v-for="item in itemVal.options"
                                                                                :key="item.id"
                                                                                :label="item.text"
                                                                                :value="item.id + ''"
                                                                            ></el-option>
                                                                        </el-select>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="constTypeIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="constType.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,constTypeIndex)"
                                                                            :chosenObj="constType.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="constTypeIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'phase')"
                                                                >新增建筑类型</span>
                                                            </div>
                                                        </div>
                                                        <!--物业公司-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'property_company_id'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper property-box-wrapper"
                                                                v-for="(company, companyIndex) in itemVal.value"
                                                                :key="'companyIndex-' + companyIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, companyIndex)"
                                                                    ></span>
                                                                    <div
                                                                        class="float-item float-item-long"
                                                                    >
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="companyIndex === 0"
                                                                        >名称</div>
                                                                        <search-radio-select
                                                                            v-model="company.value.id"
                                                                            :chosenObj="company.value"
                                                                            :isAppend="false"
                                                                            :currentIndex="companyIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                            @getOption="getCompanyOption"
                                                                            :api="'company'"
                                                                        ></search-radio-select>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="companyIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="company.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,companyIndex)"
                                                                            :chosenObj="company.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="companyIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'company')"
                                                                >新增物业公司</span>
                                                            </div>
                                                        </div>
                                                        <!--物业费-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'property_fee'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper property-box-wrapper"
                                                                v-for="(company, companyIndex) in itemVal.value"
                                                                :key="'companyIndex-' + companyIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, companyIndex)"
                                                                    ></span>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="companyIndex === 0"
                                                                        >名称</div>
                                                                        <el-input
                                                                            v-model.trim="company.value"
                                                                            @input="feeInput(company.value, companyIndex, itemKey)"
                                                                        ></el-input>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="companyIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="company.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,companyIndex)"
                                                                            :chosenObj="company.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="companyIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'fee')"
                                                                >新增物业费</span>
                                                            </div>
                                                        </div>
                                                        <!--水电气-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'water_electy'"
                                                        >
                                                            <div
                                                                class="same-box-wrapper property-box-wrapper"
                                                                v-for="(water, waterIndex) in itemVal.value"
                                                                :key="'waterIndex-' + waterIndex"
                                                            >
                                                                <div class="input-area">
                                                                    <span
                                                                        class="iconfont iconguanbi"
                                                                        @click="deleteOperate(itemKey, waterIndex)"
                                                                    ></span>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="waterIndex === 0"
                                                                        >名称</div>
                                                                        <el-input
                                                                            v-model="water.value"
                                                                            @change="changeColor(itemKey, waterIndex)"
                                                                        ></el-input>
                                                                    </div>
                                                                    <div class="float-item">
                                                                        <div
                                                                            class="float-item-tit"
                                                                            v-if="waterIndex === 0"
                                                                        >关联楼栋</div>
                                                                        <search-select
                                                                            v-model="water.relation_building_ids"
                                                                            @seleChange="changeHouseName($event,waterIndex)"
                                                                            :chosenObj="water.relation_buildings"
                                                                            :currenArr="itemVal.value"
                                                                            :checkKey="itemKey"
                                                                            :currentIndex="waterIndex"
                                                                            :projectId="projectInfo.project_id"
                                                                        ></search-select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="add-info-link">
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'fee')"
                                                                >新增水电气</span>
                                                            </div>
                                                        </div>
                                                        <!--装修情况-->
                                                        <div
                                                            class="float-item-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'decorate_info'"
                                                        >
                                                            <div
                                                                class="tb-box"
                                                                v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                            >
                                                                <div
                                                                    class="same-box-wrapper decorate-box-wrapper"
                                                                    v-for="(decorate, decorateIndex) in itemVal.value"
                                                                    :key="'decorateIndex-' + decorateIndex"
                                                                >
                                                                    <div class="input-area">
                                                                        <span
                                                                            class="iconfont iconguanbi"
                                                                            @click="deleteOperate(itemKey, decorateIndex)"
                                                                        ></span>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                            >名称</div>
                                                                            <el-select
                                                                                v-model="decorate.type"
                                                                                placeholder
                                                                                @change="change(itemKey, decorateIndex)"
                                                                                :popper-append-to-body="false"
                                                                            >
                                                                                <el-option
                                                                                    v-for="item in itemVal.options"
                                                                                    :key="item.id"
                                                                                    :label="item.text"
                                                                                    :value="item.id + ''"
                                                                                ></el-option>
                                                                            </el-select>
                                                                        </div>
                                                                        <div class="float-item">
                                                                            <div
                                                                                class="float-item-tit"
                                                                            >关联楼栋</div>
                                                                            <search-select
                                                                                v-model="decorate.relation_building_ids"
                                                                                @seleChange="changeHouseName($event,decorateIndex)"
                                                                                :chosenObj="decorate.relation_buildings"
                                                                                :currenArr="itemVal.value"
                                                                                :checkKey="itemKey"
                                                                                :currentIndex="decorateIndex"
                                                                                :projectId="projectInfo.project_id"
                                                                            ></search-select>
                                                                        </div>
                                                                        <div
                                                                            class="float-item"
                                                                            v-if="decorate.type == 1"
                                                                        >
                                                                            <div
                                                                                class="float-item-tit"
                                                                            >费用</div>
                                                                            <el-input
                                                                                type="number"
                                                                                v-model="decorate.fee"
                                                                                @change="changeColor(itemKey, decorateIndex, 'isFee')"
                                                                            ></el-input>
                                                                        </div>
                                                                        <div
                                                                            class="float-item"
                                                                            v-if="decorate.type == 1"
                                                                        >
                                                                            <div
                                                                                class="float-item-tit"
                                                                            >装修单位</div>
                                                                            <el-input
                                                                                v-model="decorate.unit"
                                                                                @change="changeColor(itemKey, decorateIndex, 'isUnit')"
                                                                            ></el-input>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!--新增装修情况-->
                                                            <div
                                                                :class="{'associated-building-link': (itemVal.value ? itemVal.value.length > 0 : false), 'associated-building-link no-border': !(itemVal.value ? itemVal.value.length > 0 : false)}"
                                                            >
                                                                <span
                                                                    class="change-box"
                                                                    @click="addNewItem(itemKey, 'decorate')"
                                                                >新增装修情况</span>
                                                            </div>
                                                        </div>
                                                        <!--板块-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'area'"
                                                        >
                                                            <el-select
                                                                v-model="itemVal.value"
                                                                filterable
                                                                placeholder
                                                                @change="changeColor(itemKey)"
                                                                :popper-append-to-body="false"
                                                            >
                                                                <el-option
                                                                    v-for="item in itemVal.options"
                                                                    :key="item.id"
                                                                    :label="item.text"
                                                                    :value="item.id + ''"
                                                                ></el-option>
                                                            </el-select>
                                                        </div>
                                                        <!--环线-->
                                                        <div
                                                            class="tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'ring_road'"
                                                        >
                                                            <el-select
                                                                v-model="itemVal.value"
                                                                placeholder
                                                                @change="changeColor(itemKey)"
                                                                :popper-append-to-body="false"
                                                            >
                                                                <el-option
                                                                    v-for="item in itemVal.options"
                                                                    :key="item.id"
                                                                    :label="item.text"
                                                                    :value="item.id + ''"
                                                                ></el-option>
                                                            </el-select>
                                                        </div>
                                                        <!--楼盘标签-->
                                                        <div
                                                            class="float-item-box tb-box"
                                                            :class="{'bg-yellow': itemVal.isChange}"
                                                            v-else-if="itemKey === 'tags'"
                                                        >
                                                            <div class="label-box-wrapper">
                                                                <div
                                                                    class="label-radio-box"
                                                                    v-for="(tagVal, tagIndex) in itemVal"
                                                                    :key="'tagIndex-' + tagIndex"
                                                                >
                                                                    <div
                                                                        class="choose-box-tit"
                                                                    >{{tagVal.type_name}}</div>
                                                                    <div
                                                                        class="choose-box"
                                                                        v-if="!tagVal.checked"
                                                                    >
                                                                        <el-radio-group
                                                                            v-model="tagVal.model"
                                                                            @change="changeColor(itemKey)"
                                                                        >
                                                                            <el-radio
                                                                                :label="constrLabel.id + ''"
                                                                                v-for="(constrLabel, constrIndex) in tagVal.tags"
                                                                                :key="'constrIndex-' + constrIndex"
                                                                            >{{constrLabel.name}}</el-radio>
                                                                        </el-radio-group>
                                                                    </div>
                                                                    <div
                                                                        class="choose-box"
                                                                        v-if="tagVal.checked"
                                                                        @change="changeColor(itemKey)"
                                                                    >
                                                                        <el-checkbox-group
                                                                            v-model="tagVal.model"
                                                                            v-if="tagVal.checked"
                                                                        >
                                                                            <el-checkbox
                                                                                :label="commLabel.id + ''"
                                                                                v-for="(commLabel, commIndex) in tagVal.tags"
                                                                                :key="'commIndex-' + commIndex"
                                                                            >{{commLabel.name}}</el-checkbox>
                                                                        </el-checkbox-group>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            class="tb-box full-height"
                                                            v-else
                                                        >{{operationObj[itemKey].value}}</div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    v-for="(items, index) in data_source_list"
                                    :key="index"
                                    min-width="250"
                                    :label="items.source_name"
                                    :resizable="false"
                                >
                                    <template slot-scope="scope">
                                        <ul class="tHead-box" v-if="scope.$index === 0">
                                            <li
                                                v-for="(itemVal, itemKey, objIndex) in items.field_data"
                                                :key="'item-source-' + objIndex"
                                            >
                                                <div
                                                    v-if="!upHeight"
                                                    :style="'height:'+ maxHeight[objIndex] + 'px'"
                                                    :class="'li-' + objIndex"
                                                >
                                                    <div class="tb-box-wrapper">
                                                        <!--楼盘名称-->
                                                        <div
                                                            class="tb-box"
                                                            v-if="itemKey === 'name'"
                                                        >
                                                            <span
                                                                :class="{'change-box color-blue': itemVal.isTask, 'change-box': !itemVal.isTask}"
                                                                @click="changeName(itemKey, itemVal.value, items.source_name)"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                        <!--城市，不可以点击-->
                                                        <div
                                                            :class="{'tb-box color-blue': itemVal.is_diff_julive, 'tb-box': !itemVal.is_diff_julive}"
                                                            v-else-if="itemKey === 'city'"
                                                        >{{itemVal.value}}</div>
                                                        <!--单价-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'project_price'"
                                                        >
                                                            <span
                                                                :class="{'color-blue': itemVal.is_diff_julive}"
                                                                v-if="itemVal.value"
                                                            >
                                                                <span
                                                                    class="concant-box"
                                                                >{{itemVal.value}}</span>
                                                            </span>
                                                        </div>
                                                        <!--总价-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'total_price'"
                                                        >
                                                            <span
                                                                :class="{'color-blue': itemVal.is_diff_julive}"
                                                                v-if="itemVal.value"
                                                            >
                                                                <span
                                                                    class="concant-box"
                                                                >{{itemVal.value}}</span>
                                                            </span>
                                                        </div>
                                                        <!--别名，点击会进行叠加-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'alias'"
                                                        >
                                                            <span
                                                                :class="{'change-box concant-box color-blue': aliasItem.isTask, 'change-box concant-box': !aliasItem.isTask}"
                                                                v-for="(aliasItem, aliasIndex) in itemVal.value"
                                                                :key="'aliasIndex-' + aliasIndex"
                                                                @click="changeItem(aliasItem, itemKey, 'alias')"
                                                                v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                            >{{aliasItem.value}}</span>
                                                        </div>
                                                        <!--楼盘经纬度-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'lat_lng'"
                                                        >
                                                            <span
                                                                :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                @click="changeItem(itemVal, itemKey, 'lng_lat', items.source_name)"
                                                                v-if="itemVal.lng && itemVal.lat"
                                                            >
                                                                <span
                                                                    class="concant-box"
                                                                >{{itemVal.lng}}</span>
                                                                <span
                                                                    class="concant-box"
                                                                >{{itemVal.lat}}</span>
                                                            </span>
                                                        </div>
                                                        <!--区域、业态-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'district_id' || itemKey === 'type'"
                                                        >
                                                            <span
                                                                :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                @click="changeItem(itemVal, itemKey, 'select', items.source_name)"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                        <!--销售状态、板块、环线-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'status' || itemKey === 'area' || itemKey === 'ring_road'"
                                                        >
                                                            <span
                                                                :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                @click="changeItem(itemVal, itemKey, 'select-string', items.source_name)"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                        <!--分期，前端手动比对-->
                                                        <div v-else-if="itemKey === 'staging'">
                                                            <!--跟左侧操作栏进行比对-->
                                                            <div class="tb-wrapper muti-box">
                                                                <div
                                                                    class="stage-box"
                                                                    v-if="operationObj[itemKey].value ? operationObj[itemKey].value.length > 0 : false"
                                                                >
                                                                    <div
                                                                        class="array-box"
                                                                        :class="{'no-border-bottom': ((stageItemIndex == operationObj[itemKey].value.length - 1) && !checkBorder(itemKey))}"
                                                                        v-for="(stageItem, stageItemIndex) in operationObj[itemKey].value"
                                                                        :key="'stageItemIndex' + stageItemIndex"
                                                                    >
                                                                        <div class="item-cont-box">
                                                                            <div
                                                                                v-for="(stageItems, stageItemIndexs) in itemVal.value"
                                                                                :key="'stageItemIndexs' + stageItemIndexs"
                                                                            >
                                                                                <div
                                                                                    class="item-height"
                                                                                    v-if="stageItems.staging_name_num == stageItem.staging_name_num"
                                                                                >
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                                    >{{stageItems.staging_name}}</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                                    >{{stageItems.staging_sale_status_name}}</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                                        v-for="(building, buildIndex) in stageItems.relation_buildings"
                                                                                        :key="'buildIndex-' + buildIndex"
                                                                                    >{{building.text}}</span>
                                                                                    <span
                                                                                        class="add-link"
                                                                                        @click="changeAdd(itemKey, stageItems, stageItemIndex, 'stage', items.source_name)"
                                                                                    >添加</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                :class="{'other-box': itemVal.otherArr ? itemVal.otherArr.length > 0 : false, 'other-box no-border': !(itemVal.otherArr ? itemVal.otherArr.length > 0 : false)}"
                                                            >
                                                                <div
                                                                    class="array-box"
                                                                    v-for="(stageItem, stageItemIndex) in itemVal.otherArr"
                                                                    :key="'stageItemIndex-' + stageItemIndex"
                                                                >
                                                                    <div class="item-cont-box">
                                                                        <span
                                                                            :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                        >{{stageItem.staging_name}}</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                        >{{stageItem.staging_sale_status_name}}</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                            v-for="(building, buildIndex) in stageItem.relation_buildings"
                                                                            :key="'buildIndex-' + buildIndex"
                                                                        >{{building.text}}</span>
                                                                        <span
                                                                            class="concant-box add-link"
                                                                            @click="addArr(stageItem, operationObj[itemKey].value, 'stage', itemKey, stageItemIndex, itemVal.otherArr, items.source_name)"
                                                                        >添加</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--交房时间，前端手动比对-->
                                                        <div v-else-if="itemKey === 'live_date'">
                                                            <!--跟左侧操作栏进行比对-->
                                                            <div class="tb-wrapper muti-box">
                                                                <div
                                                                    class="stage-box time-box"
                                                                    v-if="operationObj[itemKey].value ? operationObj[itemKey].value.length > 0 : false"
                                                                >
                                                                    <div
                                                                        class="array-box"
                                                                        :class="{'no-border-bottom': ((stageItemIndex == operationObj[itemKey].value.length - 1) && !checkBorder(itemKey))}"
                                                                        v-for="(stageItem, stageItemIndex) in operationObj[itemKey].value"
                                                                        :key="'stageItemIndex-time' + stageItemIndex"
                                                                    >
                                                                        <div class="item-cont-box">
                                                                            <div
                                                                                v-for="(stageItems, stageItemIndexs) in itemVal.value"
                                                                                :key="'stageItemIndexs-time' + stageItemIndexs"
                                                                            >
                                                                                <div
                                                                                    class="item-height"
                                                                                    v-if="stageItems.year == stageItem.origin.year && stageItems.month == stageItem.origin.month && stageItems.day == stageItem.origin.day && stageItems.ten == stageItem.origin.ten"
                                                                                >
                                                                                    <span
                                                                                        :class="{'concant-box date-box color-blue': stageItem.is_diff_julive, 'concant-box date-box': !stageItem.is_diff_julive}"
                                                                                        v-if="stageItems.year && stageItems.year != '0'"
                                                                                    >{{stageItems.year}}年</span>
                                                                                    <span
                                                                                        :class="{'concant-box date-box color-blue': stageItem.is_diff_julive, 'concant-box date-box': !stageItem.is_diff_julive}"
                                                                                        v-if="stageItems.month && stageItems.month != '0'"
                                                                                    >{{stageItems.month}}月</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                                        v-if="stageItems.day && stageItems.day != '0'"
                                                                                    >{{stageItems.day}}日</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                                        v-if="stageItems.ten && stageItems.ten != '0'"
                                                                                    >{{matchTen(stageItems.ten)}}旬</span>
                                                                                    <span
                                                                                        class="house-concant-box"
                                                                                        v-if="!(stageItems.day && stageItems.day != '0') && !(stageItems.ten && stageItems.ten != '0')"
                                                                                    ></span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                                        v-for="(building, buildIndex) in stageItems.relation_buildings"
                                                                                        :key="'buildIndex-' + buildIndex"
                                                                                    >{{building.text}}</span>
                                                                                    <span
                                                                                        class="concant-box add-link"
                                                                                        @click="changeAdd(itemKey, stageItems, stageItemIndex, 'time', items.source_name)"
                                                                                    >添加</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                :class="{'other-box time-box': itemVal.otherArr ? itemVal.otherArr.length > 0 : false, 'other-box time-box no-border': !(itemVal.otherArr ? itemVal.otherArr.length > 0 : false)}"
                                                            >
                                                                <div
                                                                    class="array-box"
                                                                    v-for="(stageItem, stageItemIndex) in itemVal.otherArr"
                                                                    :key="'stageItemIndex-plan' + stageItemIndex"
                                                                >
                                                                    <div class="item-cont-box">
                                                                        <span
                                                                            :class="{'concant-box date-box color-blue': stageItem.is_diff_julive, 'concant-box date-box': !stageItem.is_diff_julive}"
                                                                            v-if="stageItem.year && stageItem.year != '0'"
                                                                        >{{stageItem.year}}年</span>
                                                                        <span
                                                                            :class="{'concant-box date-box color-blue': stageItem.is_diff_julive, 'concant-box date-box': !stageItem.is_diff_julive}"
                                                                            v-if="stageItem.month && stageItem.month != '0'"
                                                                        >{{stageItem.month}}月</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                            v-if="stageItem.day && stageItem.day != '0'"
                                                                        >{{stageItem.day}}日</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                            v-if="stageItem.ten && stageItem.ten != '0'"
                                                                        >{{matchTen(stageItem.ten)}}旬</span>
                                                                        <span
                                                                            class="house-concant-box"
                                                                            v-if="!(stageItem.day && stageItem.day != '0') && !(stageItem.ten && stageItem.ten != '0')"
                                                                        ></span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                            v-for="(building, buildIndex) in stageItem.relation_buildings"
                                                                            :key="'buildIndex-time' + buildIndex"
                                                                        >{{building.text}}</span>
                                                                        <span
                                                                            class="concant-box add-link"
                                                                            @click="addArr(stageItem, operationObj[itemKey].value, 'time', itemKey, stageItemIndex, itemVal.otherArr, items.source_name)"
                                                                        >添加</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--放量计划，前端手动比对-->
                                                        <div v-else-if="itemKey === 'volume_date'">
                                                            <!--跟左侧操作栏进行比对-->
                                                            <div class="tb-wrapper muti-box">
                                                                <div
                                                                    class="stage-box time-box"
                                                                    v-if="operationObj[itemKey].value ? operationObj[itemKey].value.length > 0 : false"
                                                                >
                                                                    <div
                                                                        class="array-box"
                                                                        :class="{'no-border-bottom': ((stageItemIndex == operationObj[itemKey].value.length - 1) && !checkBorder(itemKey))}"
                                                                        v-for="(stageItem, stageItemIndex) in operationObj[itemKey].value"
                                                                        :key="'stageItemIndex-plan' + stageItemIndex"
                                                                    >
                                                                        <div class="item-cont-box">
                                                                            <div
                                                                                v-for="(stageItems, stageItemIndexs) in itemVal.value"
                                                                                :key="'stageItemIndexs-plan' + stageItemIndexs"
                                                                            >
                                                                                <div
                                                                                    class="item-height"
                                                                                    v-if="stageItems.year == stageItem.origin.year && stageItems.month == stageItem.origin.month && stageItems.day == stageItem.origin.day && stageItems.ten == stageItem.origin.ten"
                                                                                >
                                                                                    <span
                                                                                        :class="{'concant-box date-box color-blue': stageItems.is_diff_julive, 'concant-box date-box': !stageItem.is_diff_julive}"
                                                                                        v-if="stageItems.year && stageItems.year != '0'"
                                                                                    >{{stageItems.year}}年</span>
                                                                                    <span
                                                                                        :class="{'concant-box date-box color-blue': stageItems.is_diff_julive, 'concant-box date-box': !stageItem.is_diff_julive}"
                                                                                        v-if="stageItems.month && stageItems.month != '0'"
                                                                                    >{{stageItems.month}}月</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': stageItems.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                                        v-if="stageItems.day && stageItems.day != '0'"
                                                                                    >{{stageItems.day}}日</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': stageItems.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                                        v-if="stageItems.ten && stageItems.ten != '0'"
                                                                                    >{{matchTen(stageItems.ten)}}旬</span>
                                                                                    <span
                                                                                        class="house-concant-box"
                                                                                        v-if="!(stageItems.day && stageItems.day != '0') && !(stageItems.ten && stageItems.ten != '0')"
                                                                                    ></span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': stageItems.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                                        v-for="(building, buildIndex) in stageItems.relation_buildings"
                                                                                        :key="'buildIndex-' + buildIndex"
                                                                                    >{{building.text}}</span>
                                                                                    <span
                                                                                        class="concant-box add-link"
                                                                                        @click="changeAdd(itemKey, stageItems, stageItemIndex, 'time', items.source_name)"
                                                                                    >添加</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                :class="{'other-box time-box': itemVal.otherArr ? itemVal.otherArr.length > 0 : false, 'other-box time-box no-border': !(itemVal.otherArr ? itemVal.otherArr.length > 0 : false)}"
                                                            >
                                                                <div
                                                                    class="array-box"
                                                                    v-for="(stageItem, stageItemIndex) in itemVal.otherArr"
                                                                    :key="'stageItemIndex-plan' + stageItemIndex"
                                                                >
                                                                    <div class="item-cont-box">
                                                                        <span
                                                                            :class="{'concant-box date-box color-blue': stageItem.is_diff_julive, 'concant-box date-box': !stageItem.is_diff_julive}"
                                                                            v-if="stageItem.year && stageItem.year != '0'"
                                                                        >{{stageItem.year}}年</span>
                                                                        <span
                                                                            :class="{'concant-box date-box color-blue': stageItem.is_diff_julive, 'concant-box date-box': !stageItem.is_diff_julive}"
                                                                            v-if="stageItem.month && stageItem.month != '0'"
                                                                        >{{stageItem.month}}月</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                            v-if="stageItem.day && stageItem.day != '0'"
                                                                        >{{stageItem.day}}日</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                            v-if="stageItem.ten && stageItem.ten != '0'"
                                                                        >{{matchTen(stageItem.ten)}}旬</span>
                                                                        <span
                                                                            class="house-concant-box"
                                                                            v-if="!(stageItem.day && stageItem.day != '0') && !(stageItem.ten && stageItem.ten != '0')"
                                                                        ></span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': stageItem.is_diff_julive, 'concant-box': !stageItem.is_diff_julive}"
                                                                            v-for="(building, buildIndex) in stageItem.relation_buildings"
                                                                            :key="'buildIndex-' + buildIndex"
                                                                        >{{building.text}}</span>
                                                                        <span
                                                                            class="concant-box add-link"
                                                                            @click="addArr(stageItem, operationObj[itemKey].value, 'plan', itemKey, stageItemIndex, itemVal.otherArr, items.source_name)"
                                                                        >添加</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--年限-->
                                                        <div v-else-if="itemKey === 'property_year'">
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                            @click="changeItemBuild(itemVal, itemKey, 'year', items.source_name)"
                                                                            v-if="itemVal.value"
                                                                        >
                                                                            <span
                                                                                class="concant-box"
                                                                            >{{itemVal.value}}年</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--建设阶段-->
                                                        <div v-else-if="itemKey === 'construction_stage'">
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                            @click="changeItemBuild(itemVal, itemKey, 'phase', items.source_name)"
                                                                            v-if="itemVal.value"
                                                                        >
                                                                            <span
                                                                                class="concant-box"
                                                                            >{{itemVal.value}}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--建筑类型-->
                                                        <div v-else-if="itemKey === 'business_layout'">
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            class="change-box"
                                                                            v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                                        >
                                                                            <span
                                                                                :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                                @click="changeItemBuild(constraItem, itemKey, 'phase', items.source_name)"
                                                                                v-for="(constraItem, constraIdex) in itemVal.value"
                                                                                :key="'constraIdex' + constraIdex"
                                                                            >{{constraItem.name}}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--物业公司-->
                                                        <div v-else-if="itemKey === 'property_company_id'">
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                            v-if="itemVal.value"
                                                                        >
                                                                            <span
                                                                                class="concant-box"
                                                                                @click="changeItemBuild(itemVal, itemKey, 'company', items.source_name)"
                                                                            >{{itemVal.value}}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--物业费-->
                                                        <div v-else-if="itemKey === 'property_fee'">
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                            v-if="itemVal.value"
                                                                        >
                                                                            <span
                                                                                class="concant-box"
                                                                                @click="changeItemBuild(itemVal, itemKey, 'fee', items.source_name)"
                                                                            >{{itemVal.value}}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--水电气-->
                                                        <div v-else-if="itemKey === 'water_electy'">
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                            v-if="itemVal.value"
                                                                        >
                                                                            <span
                                                                                class="concant-box"
                                                                                @click="changeItemBuild(itemVal, itemKey, 'fee', items.source_name)"
                                                                            >{{itemVal.value}}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--装修情况-->
                                                        <div v-else-if="itemKey === 'decorate_info'">
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            v-for="(decorateItem, decoreateIndex) in itemVal.value"
                                                                            :class="{'color-blue': itemVal.is_diff_julive}"
                                                                            :key="'decoreateIndex' + decoreateIndex"
                                                                        >
                                                                            <span
                                                                                class="change-box"
                                                                                v-if="decorateItem.type_name"
                                                                                @click="changeItemBuild(decorateItem, itemKey, 'decorate_info', items.source_name)"
                                                                            >
                                                                                <span
                                                                                    class="concant-box"
                                                                                >{{decorateItem.type_name}}</span>
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--楼盘标签-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'tags'"
                                                        >
                                                            <span
                                                                :class="{'change-box concant-box color-blue': tagsItem.is_diff_julive, 'change-box concant-box': !tagsItem.is_diff_julive}"
                                                                v-for="(tagsItem, tagsIndex) in itemVal.value"
                                                                :key="'tagsIndex-' + tagsIndex"
                                                                @click="changeItem(tagsItem, itemKey, 'tags')"
                                                                v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                            >{{tagsItem.name}}</span>
                                                        </div>
                                                        <div class="tb-box" v-else>
                                                            <span
                                                                :class="{'td-operate-box color-blue': itemVal.is_diff_julive, 'td-operate-box': !itemVal.is_diff_julive}"
                                                                @click="changeName(itemKey, itemVal.value,items.source_name)"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li
                                                v-for="(itemVal, itemKey, objIndex) in items.field_data"
                                                :key="'item-source-height-' + objIndex"
                                            >
                                                <div v-if="upHeight" :class="'li-' + objIndex">
                                                    <div class="tb-box-wrapper">
                                                        <!--楼盘名称-->
                                                        <div
                                                            class="tb-box"
                                                            v-if="itemKey === 'name'"
                                                        >
                                                            <span
                                                                :class="{'change-box color-blue': itemVal.isTask, 'change-box': !itemVal.isTask}"
                                                                @click="changeName(itemKey, itemVal.value,items.source_name)"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                        <!--城市，不可以点击-->
                                                        <div
                                                            :class="{'tb-box color-blue': itemVal.is_diff_julive, 'tb-box': !itemVal.is_diff_julive}"
                                                            v-else-if="itemKey === 'city'"
                                                        >{{itemVal.value}}</div>
                                                        <!--单价-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'project_price'"
                                                        >
                                                            <span
                                                                :class="{'color-blue': itemVal.is_diff_julive}"
                                                                v-if="itemVal.value"
                                                            >
                                                                <span
                                                                    class="concant-box"
                                                                >{{itemVal.value}}</span>
                                                            </span>
                                                        </div>
                                                        <!--总价-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'total_price'"
                                                        >
                                                            <span
                                                                :class="{'color-blue': itemVal.is_diff_julive}"
                                                                v-if="itemVal.value"
                                                            >
                                                                <span
                                                                    class="concant-box"
                                                                >{{itemVal.value}}</span>
                                                            </span>
                                                        </div>
                                                        <!--别名，点击会进行叠加-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'alias'"
                                                        >
                                                            <span
                                                                :class="{'change-box concant-box color-blue': aliasItem.isTask, 'change-box concant-box': !aliasItem.isTask}"
                                                                v-for="(aliasItem, aliasIndex) in itemVal.value"
                                                                :key="'aliasIndex-' + aliasIndex"
                                                                @click="changeItem(aliasItem, itemKey, 'alias')"
                                                                v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                            >{{aliasItem.value}}</span>
                                                        </div>
                                                        <!--楼盘经纬度-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'lat_lng'"
                                                        >
                                                            <span
                                                                :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                @click="changeItem(itemVal, itemKey, 'lng_lat',items.source_name)"
                                                                v-if="itemVal.lng && itemVal.lat"
                                                            >
                                                                <span
                                                                    class="concant-box"
                                                                >{{itemVal.lng}}</span>
                                                                <span
                                                                    class="concant-box"
                                                                >{{itemVal.lat}}</span>
                                                            </span>
                                                        </div>
                                                        <!--区域、业态-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'district_id' || itemKey === 'type'"
                                                        >
                                                            <span
                                                                :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                @click="changeItem(itemVal, itemKey, 'select', items.source_name)"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                        <!--销售状态、板块、环线-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'status' || itemKey === 'area' || itemKey === 'ring_road'"
                                                        >
                                                            <span
                                                                :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                @click="changeItem(itemVal, itemKey, 'select-string', items.source_name)"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                        <!--分期，前端手动比对-->
                                                        <div v-else-if="itemKey === 'staging'">
                                                            <!--跟左侧操作栏进行比对-->
                                                            <div class="tb-wrapper muti-box">
                                                                <div
                                                                    class="stage-box"
                                                                    v-if="operationObj[itemKey].value ? operationObj[itemKey].value.length > 0 : false"
                                                                >
                                                                    <div
                                                                        class="array-box"
                                                                        :class="{'no-border-bottom': ((stageItemIndex == operationObj[itemKey].value.length - 1) && !checkBorder(itemKey))}"
                                                                        v-for="(stageItem, stageItemIndex) in operationObj[itemKey].value"
                                                                        :key="'stageItemIndex' + stageItemIndex"
                                                                    >
                                                                        <div class="item-cont-box">
                                                                            <div
                                                                                v-for="(stageItems, stageItemIndexs) in itemVal.value"
                                                                                :key="'stageItemIndexs' + stageItemIndexs"
                                                                            >
                                                                                <div
                                                                                    class="item-height"
                                                                                    v-if="stageItems.staging_name_num == stageItem.staging_name_num"
                                                                                >
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                                    >{{stageItems.staging_name}}</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                                    >{{stageItems.staging_sale_status_name}}</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                                        v-for="(building, buildIndex) in stageItems.relation_buildings"
                                                                                        :key="'buildIndex-' + buildIndex"
                                                                                    >{{building.text}}</span>
                                                                                    <span
                                                                                        class="add-link"
                                                                                        @click="changeAdd(itemKey, stageItems, stageItemIndex, 'stage', items.source_name)"
                                                                                    >添加</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                :class="{'other-box': itemVal.otherArr ? itemVal.otherArr.length > 0 : false, 'other-box no-border': !(itemVal.otherArr ? itemVal.otherArr.length > 0 : false)}"
                                                            >
                                                                <div
                                                                    class="array-box"
                                                                    v-for="(stageItem, stageItemIndex) in itemVal.otherArr"
                                                                    :key="'stageItemIndex-' + stageItemIndex"
                                                                >
                                                                    <div class="item-cont-box">
                                                                        <span
                                                                            :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                        >{{stageItem.staging_name}}</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                        >{{stageItem.staging_sale_status_name}}</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                            v-for="(building, buildIndex) in stageItem.relation_buildings"
                                                                            :key="'buildIndex-' + buildIndex"
                                                                        >{{building.text}}</span>
                                                                        <span
                                                                            class="concant-box add-link"
                                                                            @click="addArr(stageItem, operationObj[itemKey].value, 'stage', itemKey, stageItemIndex, itemVal.otherArr, items.source_name)"
                                                                        >添加</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--交房时间，前端手动比对-->
                                                        <div v-else-if="itemKey === 'live_date'">
                                                            <!--跟左侧操作栏进行比对-->
                                                            <div class="tb-wrapper muti-box">
                                                                <div
                                                                    class="stage-box time-box"
                                                                    v-if="operationObj[itemKey].value ? operationObj[itemKey].value.length > 0 : false"
                                                                >
                                                                    <div
                                                                        class="array-box"
                                                                        :class="{'no-border-bottom': ((stageItemIndex == operationObj[itemKey].value.length - 1) && !checkBorder(itemKey))}"
                                                                        v-for="(stageItem, stageItemIndex) in operationObj[itemKey].value"
                                                                        :key="'stageItemIndex-time' + stageItemIndex"
                                                                    >
                                                                        <div class="item-cont-box">
                                                                            <div
                                                                                v-for="(stageItems, stageItemIndexs) in itemVal.value"
                                                                                :key="'stageItemIndexs-time' + stageItemIndexs"
                                                                            >
                                                                                <div
                                                                                    class="item-height"
                                                                                    v-if="stageItems.year == stageItem.origin.year && stageItems.month == stageItem.origin.month && stageItems.day == stageItem.origin.day && stageItems.ten == stageItem.origin.ten"
                                                                                >
                                                                                    <span
                                                                                        :class="{'concant-box date-box color-blue': itemVal.is_diff_julive, 'concant-box date-box': !itemVal.is_diff_julive}"
                                                                                        v-if="stageItems.year && stageItems.year != '0'"
                                                                                    >{{stageItems.year}}年</span>
                                                                                    <span
                                                                                        :class="{'concant-box date-box color-blue': itemVal.is_diff_julive, 'concant-box date-box': !itemVal.is_diff_julive}"
                                                                                        v-if="stageItems.month && stageItems.month != '0'"
                                                                                    >{{stageItems.month}}月</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                                        v-if="stageItems.day && stageItems.day != '0'"
                                                                                    >{{stageItems.day}}日</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                                        v-if="stageItems.ten && stageItems.ten != '0'"
                                                                                    >{{matchTen(stageItems.ten)}}旬</span>
                                                                                    <span
                                                                                        class="house-concant-box"
                                                                                        v-if="!(stageItems.day && stageItems.day != '0') && !(stageItems.ten && stageItems.ten != '0')"
                                                                                    ></span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                                        v-for="(building, buildIndex) in stageItems.relation_buildings"
                                                                                        :key="'buildIndex-' + buildIndex"
                                                                                    >{{building.text}}</span>
                                                                                    <span
                                                                                        class="concant-box add-link"
                                                                                        @click="changeAdd(itemKey, stageItems, stageItemIndex, 'time', items.source_name)"
                                                                                    >添加</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                :class="{'other-box time-box': itemVal.otherArr ? itemVal.otherArr.length > 0 : false, 'other-box time-box no-border': !(itemVal.otherArr ? itemVal.otherArr.length > 0 : false)}"
                                                            >
                                                                <div
                                                                    class="array-box"
                                                                    v-for="(stageItem, stageItemIndex) in itemVal.otherArr"
                                                                    :key="'stageItemIndex-plan' + stageItemIndex"
                                                                >
                                                                    <div class="item-cont-box">
                                                                        <span
                                                                            :class="{'concant-box date-box color-blue': itemVal.is_diff_julive, 'concant-box date-box': !itemVal.is_diff_julive}"
                                                                            v-if="stageItem.year && stageItem.year != '0'"
                                                                        >{{stageItem.year}}年</span>
                                                                        <span
                                                                            :class="{'concant-box date-box color-blue': itemVal.is_diff_julive, 'concant-box date-box': !itemVal.is_diff_julive}"
                                                                            v-if="stageItem.month && stageItem.month != '0'"
                                                                        >{{stageItem.month}}月</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                            v-if="stageItem.day && stageItem.day != '0'"
                                                                        >{{stageItem.day}}日</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                            v-if="stageItem.ten && stageItem.ten != '0'"
                                                                        >{{matchTen(stageItem.ten)}}旬</span>
                                                                        <span
                                                                            class="house-concant-box"
                                                                            v-if="!(stageItem.day && stageItem.day != '0') && !(stageItem.ten && stageItem.ten != '0')"
                                                                        ></span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                            v-for="(building, buildIndex) in stageItem.relation_buildings"
                                                                            :key="'buildIndex-time' + buildIndex"
                                                                        >{{building.text}}</span>
                                                                        <span
                                                                            class="concant-box add-link"
                                                                            @click="addArr(stageItem, operationObj[itemKey].value, 'time', itemKey, stageItemIndex, itemVal.otherArr, items.source_name)"
                                                                        >添加</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--放量计划，前端手动比对-->
                                                        <div v-else-if="itemKey === 'volume_date'">
                                                            <!--跟左侧操作栏进行比对-->
                                                            <div class="tb-wrapper muti-box">
                                                                <div
                                                                    class="stage-box time-box"
                                                                    v-if="operationObj[itemKey].value ? operationObj[itemKey].value.length > 0 : false"
                                                                >
                                                                    <div
                                                                        class="array-box"
                                                                        :class="{'no-border-bottom': ((stageItemIndex == operationObj[itemKey].value.length - 1) && !checkBorder(itemKey))}"
                                                                        v-for="(stageItem, stageItemIndex) in operationObj[itemKey].value"
                                                                        :key="'stageItemIndex-plan' + stageItemIndex"
                                                                    >
                                                                        <div class="item-cont-box">
                                                                            <div
                                                                                v-for="(stageItems, stageItemIndexs) in itemVal.value"
                                                                                :key="'stageItemIndexs-plan' + stageItemIndexs"
                                                                            >
                                                                                <div
                                                                                    class="item-height"
                                                                                    v-if="stageItems.year == stageItem.origin.year && stageItems.month == stageItem.origin.month && stageItems.day == stageItem.origin.day && stageItems.ten == stageItem.origin.ten"
                                                                                >
                                                                                    <span
                                                                                        :class="{'concant-box date-box color-blue': itemVal.is_diff_julive, 'concant-box date-box': !itemVal.is_diff_julive}"
                                                                                        v-if="stageItems.year && stageItems.year != '0'"
                                                                                    >{{stageItems.year}}年</span>
                                                                                    <span
                                                                                        :class="{'concant-box date-box color-blue': itemVal.is_diff_julive, 'concant-box date-box': !itemVal.is_diff_julive}"
                                                                                        v-if="stageItems.month && stageItems.month != '0'"
                                                                                    >{{stageItems.month}}月</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                                        v-if="stageItems.day && stageItems.day != '0'"
                                                                                    >{{stageItems.day}}日</span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                                        v-if="stageItems.ten && stageItems.ten != '0'"
                                                                                    >{{matchTen(stageItems.ten)}}旬</span>
                                                                                    <span
                                                                                        class="house-concant-box"
                                                                                        v-if="!(stageItems.day && stageItems.day != '0') && !(stageItems.ten && stageItems.ten != '0')"
                                                                                    ></span>
                                                                                    <span
                                                                                        :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                                        v-for="(building, buildIndex) in stageItems.relation_buildings"
                                                                                        :key="'buildIndex-' + buildIndex"
                                                                                    >{{building.text}}</span>
                                                                                    <span
                                                                                        class="concant-box add-link"
                                                                                        @click="changeAdd(itemKey, stageItems, stageItemIndex, 'time', items.source_name)"
                                                                                    >添加</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                :class="{'other-box time-box': itemVal.otherArr ? itemVal.otherArr.length > 0 : false, 'other-box time-box no-border': !(itemVal.otherArr ? itemVal.otherArr.length > 0 : false)}"
                                                            >
                                                                <div
                                                                    class="array-box"
                                                                    v-for="(stageItem, stageItemIndex) in itemVal.otherArr"
                                                                    :key="'stageItemIndex-plan' + stageItemIndex"
                                                                >
                                                                    <div class="item-cont-box">
                                                                        <span
                                                                            :class="{'concant-box date-box color-blue': itemVal.is_diff_julive, 'concant-box date-box': !itemVal.is_diff_julive}"
                                                                            v-if="stageItem.year && stageItem.year != '0'"
                                                                        >{{stageItem.year}}年</span>
                                                                        <span
                                                                            :class="{'concant-box date-box color-blue': itemVal.is_diff_julive, 'concant-box date-box': !itemVal.is_diff_julive}"
                                                                            v-if="stageItem.month && stageItem.month != '0'"
                                                                        >{{stageItem.month}}月</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                            v-if="stageItem.day && stageItem.day != '0'"
                                                                        >{{stageItem.day}}日</span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                            v-if="stageItem.ten && stageItem.ten != '0'"
                                                                        >{{matchTen(stageItem.ten)}}旬</span>
                                                                        <span
                                                                            class="house-concant-box"
                                                                            v-if="!(stageItem.day && stageItem.day != '0') && !(stageItem.ten && stageItem.ten != '0')"
                                                                        ></span>
                                                                        <span
                                                                            :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                            v-for="(building, buildIndex) in stageItem.relation_buildings"
                                                                            :key="'buildIndex-' + buildIndex"
                                                                        >{{building.text}}</span>
                                                                        <span
                                                                            class="concant-box add-link"
                                                                            @click="addArr(stageItem, operationObj[itemKey].value, 'plan', itemKey, stageItemIndex, itemVal.otherArr, items.source_name)"
                                                                        >添加</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--年限-->
                                                        <div
                                                            v-else-if="itemKey === 'property_year'"
                                                        >
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                            @click="changeItemBuild(itemVal, itemKey, 'year', items.source_name)"
                                                                            v-if="itemVal.value"
                                                                        >
                                                                            <span
                                                                                class="concant-box"
                                                                            >{{itemVal.value}}年</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--建设阶段-->
                                                        <div
                                                            v-else-if="itemKey === 'construction_stage'"
                                                        >
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                            @click="changeItemBuild(itemVal, itemKey, 'phase', items.source_name)"
                                                                            v-if="itemVal.value"
                                                                        >
                                                                            <span
                                                                                class="concant-box"
                                                                            >{{itemVal.value}}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--建筑类型-->
                                                        <div
                                                            v-else-if="itemKey === 'business_layout'"
                                                        >
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            class="change-box"
                                                                            v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                                        >
                                                                            <span
                                                                                :class="{'concant-box color-blue': itemVal.is_diff_julive, 'concant-box': !itemVal.is_diff_julive}"
                                                                                @click="changeItemBuild(constraItem, itemKey, 'phase', items.source_name)"
                                                                                v-for="(constraItem, constraIdex) in itemVal.value"
                                                                                :key="'constraIdex' + constraIdex"
                                                                            >{{constraItem.name}}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--物业公司-->
                                                        <div
                                                            v-else-if="itemKey === 'property_company_id'"
                                                        >
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                            v-if="itemVal.value"
                                                                        >
                                                                            <span
                                                                                class="concant-box"
                                                                                @click="changeItemBuild(itemVal, itemKey, 'company', items.source_name)"
                                                                            >{{itemVal.value}}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--物业费-->
                                                        <div v-else-if="itemKey === 'property_fee'">
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                            v-if="itemVal.value"
                                                                        >
                                                                            <span
                                                                                class="concant-box"
                                                                                @click="changeItemBuild(itemVal, itemKey, 'fee', items.source_name)"
                                                                            >{{itemVal.value}}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--水电气-->
                                                        <div v-else-if="itemKey === 'water_electy'">
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            :class="{'change-box color-blue': itemVal.is_diff_julive, 'change-box': !itemVal.is_diff_julive}"
                                                                            v-if="itemVal.value"
                                                                        >
                                                                            <span
                                                                                class="concant-box"
                                                                                @click="changeItemBuild(itemVal, itemKey, 'fee', items.source_name)"
                                                                            >{{itemVal.value}}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--装修情况-->
                                                        <div
                                                            v-else-if="itemKey === 'decorate_info'"
                                                        >
                                                            <div class="tb-box">
                                                                <div class="stage-box">
                                                                    <div class="array-box">
                                                                        <span
                                                                            v-for="(decorateItem, decoreateIndex) in itemVal.value"
                                                                            :class="{'color-blue': itemVal.is_diff_julive}"
                                                                            :key="'decoreateIndex' + decoreateIndex"
                                                                        >
                                                                            <span
                                                                                class="change-box"
                                                                                v-if="decorateItem.type_name"
                                                                                @click="changeItemBuild(decorateItem, itemKey, 'decorate_info', items.source_name)"
                                                                            >
                                                                                <span
                                                                                    class="concant-box"
                                                                                >{{decorateItem.type_name}}</span>
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--楼盘标签-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'tags'"
                                                        >
                                                            <span
                                                                :class="{'change-box concant-box color-blue': tagsItem.is_diff_julive, 'change-box concant-box': !tagsItem.is_diff_julive}"
                                                                v-for="(tagsItem, tagsIndex) in itemVal.value"
                                                                :key="'tagsIndex-' + tagsIndex"
                                                                @click="changeItem(tagsItem, itemKey, 'tags')"
                                                                v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                            >{{tagsItem.name}}</span>
                                                        </div>
                                                        <div class="tb-box" v-else>
                                                            <span
                                                                :class="{'td-operate-box color-blue': itemVal.is_diff_julive, 'td-operate-box': !itemVal.is_diff_julive}"
                                                                @click="changeName(itemKey, itemVal.value,items.source_name)"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    v-if="bigData !== null"
                                    min-width="250"
                                    label="大数据"
                                >
                                    <template slot-scope="scope">
                                        <ul
                                            class="tHead-box big-data-box"
                                            v-if="scope.$index === 0"
                                        >
                                            <li
                                                v-for="(itemVal, itemKey, thIndex) in bigData"
                                                :key="'item-op-' + thIndex"
                                            >
                                                <div
                                                    v-if="!upHeight"
                                                    :style="'height:'+ maxHeight[thIndex] + 'px'"
                                                    :class="'li-' + thIndex"
                                                >
                                                    <div class="tb-box-wrapper">
                                                        <!--单价-->
                                                        <div
                                                            class="tb-box"
                                                            v-if="itemKey === 'project_price'"
                                                        >
                                                            <span
                                                                :class="{'change-box concant-box color-blue': unitPrice.is_diff_julive, 'change-box concant-box': !unitPrice.is_diff_julive}"
                                                                @click="bigTurn(unitPrice)"
                                                                v-for="(unitPrice, unitPriceIndex) in itemVal.value"
                                                                :key="'unitPriceIndex-' + unitPriceIndex"
                                                                v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                            >
                                                                <span
                                                                    class="change-box concant-box"
                                                                    v-for="(subPrice, subPriceIndex) in unitPrice.value"
                                                                    :key="'subPriceIndex-' + subPriceIndex"
                                                                >
                                                                    <span
                                                                        v-if="subPrice.min_value"
                                                                    >{{subPrice.min_value}}</span>
                                                                    <span
                                                                        v-if="subPrice.type == 'range'"
                                                                    >-</span>
                                                                    <span
                                                                        v-if="subPrice.max_value"
                                                                    >{{subPrice.max_value}}</span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <!--总价-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'total_price'"
                                                        >
                                                            <span
                                                                :class="{'change-box concant-box color-blue': unitPrice.is_diff_julive, 'change-box concant-box': !unitPrice.is_diff_julive}"
                                                                @click="bigTurn(unitPrice)"
                                                                v-for="(unitPrice, totalPriceIndex) in itemVal.value"
                                                                :key="'totalPriceIndex-' + totalPriceIndex"
                                                                v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                            >
                                                                <span
                                                                    class="change-box concant-box"
                                                                    v-for="(subPrice, subTotalPriceIndex) in unitPrice.value"
                                                                    :key="'subTotalPriceIndex-' + subTotalPriceIndex"
                                                                >
                                                                    <span
                                                                        v-if="subPrice.min_value"
                                                                    >{{subPrice.min_value}}</span>
                                                                    <span
                                                                        v-if="subPrice.type == 'range'"
                                                                    >-</span>
                                                                    <span
                                                                        v-if="subPrice.max_value"
                                                                    >{{subPrice.max_value}}</span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="Array.isArray(itemVal.value) ? itemVal.value.length > 0 : false"
                                                        >
                                                            <span
                                                                class="change-box"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="!Array.isArray(itemVal.value) ? itemVal.value : false"
                                                        >
                                                            <span
                                                                class="change-box"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li
                                                v-for="(itemVal, itemKey, objIndex) in bigData"
                                                :key="'item-source-height-' + objIndex"
                                            >
                                                <div v-if="upHeight" :class="'li-' + objIndex">
                                                    <div class="tb-box-wrapper">
                                                        <!--单价-->
                                                        <div
                                                            class="tb-box"
                                                            v-if="itemKey === 'project_price'"
                                                        >
                                                            <span
                                                                :class="{'change-box concant-box color-blue': unitPrice.is_diff_julive, 'change-box concant-box': !unitPrice.is_diff_julive}"
                                                                @click="bigTurn(unitPrice)"
                                                                v-for="(unitPrice, unitPriceIndex) in itemVal.value"
                                                                :key="'unitPriceIndex-' + unitPriceIndex"
                                                                v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                            >
                                                                <span
                                                                    class="change-box concant-box"
                                                                    v-for="(subPrice, subPriceIndex) in unitPrice.value"
                                                                    :key="'subPriceIndex-' + subPriceIndex"
                                                                >
                                                                    <span
                                                                        v-if="subPrice.min_value"
                                                                    >{{subPrice.min_value}}</span>
                                                                    <span
                                                                        v-if="subPrice.type == 'range'"
                                                                    >-</span>
                                                                    <span
                                                                        v-if="subPrice.max_value"
                                                                    >{{subPrice.max_value}}</span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <!--总价-->
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="itemKey === 'total_price'"
                                                        >
                                                            <span
                                                                :class="{'change-box concant-box color-blue': unitPrice.is_diff_julive, 'change-box concant-box': !unitPrice.is_diff_julive}"
                                                                @click="bigTurn(unitPrice)"
                                                                v-for="(unitPrice, totalPriceIndex) in itemVal.value"
                                                                :key="'totalPriceIndex-' + totalPriceIndex"
                                                                v-if="itemVal.value ? itemVal.value.length > 0 : false"
                                                            >
                                                                <span
                                                                    class="change-box concant-box"
                                                                    v-for="(subPrice, subTotalPriceIndex) in unitPrice.value"
                                                                    :key="'subTotalPriceIndex-' + subTotalPriceIndex"
                                                                >
                                                                    <span
                                                                        v-if="subPrice.min_value"
                                                                    >{{subPrice.min_value}}</span>
                                                                    <span
                                                                        v-if="subPrice.type == 'range'"
                                                                    >-</span>
                                                                    <span
                                                                        v-if="subPrice.max_value"
                                                                    >{{subPrice.max_value}}</span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="Array.isArray(itemVal.value) ? itemVal.value.length > 0 : false"
                                                        >
                                                            <span
                                                                class="change-box"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                        <div
                                                            class="tb-box"
                                                            v-else-if="!Array.isArray(itemVal.value) ? itemVal.value : false"
                                                        >
                                                            <span
                                                                class="change-box"
                                                                v-if="itemVal.value"
                                                            >{{itemVal.value}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div class="btn-area">
                        <el-button @click="skipToTaskList">取消</el-button>
                        <el-button type="primary" @click="save">保存</el-button>
                        <el-button type="primary" @click="save('next')">保存并进行下一个任务</el-button>
                    </div>
                </div>
            </div>
        </el-col>
        <!--无任务通知弹窗-->
        <el-dialog :visible.sync="dialogVisibleNoTask" title="无任务通知" width="30%" center>
            <div class="dialog-content">
                <p class="content-tex no-task-tex">{{dialogContentNoTask}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="single" @click="skipToTaskList">点击前往任务列表页</el-button>
            </div>
        </el-dialog>
        <!--保存提醒--切换楼盘 始-->
        <el-dialog :visible.sync="dialogVisibleSaveWarn" title="保存提醒" width="30%" :center="true">
            <div class="dialog-content">
                <p class="content-tex save-warn-tex">该页面信息已经被编辑了，是否保存当前内容！</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="turnNoSave('next')">不保存进行跳转</el-button>
                <el-button type="primary" @click="turnToSave('next')">保存进行跳转</el-button>
            </div>
        </el-dialog>
        <!--保存提醒 止-->
        <!--切换页面-->
        <el-dialog :visible.sync="dialogVisibleSave" title="保存提醒" width="30%" :center="true">
            <div class="dialog-content">
                <p class="content-tex save-warn-tex">该页面信息已经被编辑了，是否保存当前内容！</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="turnNoSave('turn')">不保存进行跳转</el-button>
                <el-button type="primary" @click="turnToSave('turn')">保存进行跳转</el-button>
            </div>
        </el-dialog>
         <!-- 楼盘重复性判断弹窗 -->
        <el-dialog
            :visible.sync="repeatDialog"
            title="楼盘重复提示"
            width="30%"
            :center="true">
            <div class="dialog-content">
                <p class="content-tex save-warn-tex">
                    该楼盘在居理已经存在，现规则暂不允许添加同城市同业态且名称相同的楼盘
                    <el-button
                        type="text"
                        @click="jumpPage">
                        点击可查看居理楼盘
                    </el-button>
                </p>
            </div>
            <div
                slot="footer"
                class="dialog-footer">
                <el-button
                    type="primary"
                    @click="repeatDialog = false">
                    确认</el-button>
            </div>
        </el-dialog>
        <!-- 价格升降限制判断弹窗 -->
        <el-dialog
            :visible.sync="liftingDialog"
            title="价格涨跌提示"
            width="30%"
            :center="true">
            <div class="dialog-content">
                <p class="content-tex save-warn-tex">
                    本次修改的楼盘单价涨跌超出{{ liftingPrice }}, 请确认是否降价/涨价这么多！
                </p>
            </div>
            <div
                slot="footer"
                class="dialog-footer">
                <el-button
                    type="primary"
                    @click="confimSave">
                    确认并保存
                </el-button>
                <el-button
                    type="primary"
                    @click="closeDiaLog">
                    修改
                </el-button>
            </div>
        </el-dialog>
        <!-- 楼盘销售状态自洽 -->
        <el-dialog
            :visible.sync="sellStatus"
            title="错误提示"
            width="30%"
            :center="true">
            <div class="dialog-content sell-content ">
                <p class="content-tex save-warn-tex">
                    {{buildCompareText}}
                    <h3 v-if="houseTypeData.length > 0">
                        户型：
                        <el-button
                            v-for="(item, index) in houseTypeData"
                            :key="index"
                            type="text"
                            @click="houseJump(item.url, 'houseType')">
                            {{item.text}}
                        </el-button>
                    </h3>
                    <h3 v-if="buildTypeData.length > 0">
                        楼栋：
                        <el-button
                            v-for="(item, index) in buildTypeData"
                            :key="index"
                            type="text"
                            @click="houseJump(item.url, 'buildType')">
                            {{item.text}}
                        </el-button>
                    </h3>
                </p>
            </div>
            <div
                slot="footer"
                class="dialog-footer">
                <el-button
                    type="primary"
                    @click="confimClose">
                    确认</el-button>
            </div>
        </el-dialog>

        <!--系统判断超出10万时或者低于1万的系统进行的单价录入提示-->
        <msg-dialog
            :dialogShow="priceValitShow"
            @closeDialog="priceValitShow = false">
            <p class="msg-content">
                {{priceLimitMsg}}
            </p>
            <template v-slot:footer>
                <el-button
                    type="primary"
                    @click="priceValitConfirm">
                    确认并保存
                </el-button>
                <el-button
                    type="primary"
                    @click="priceValitClose">
                    修改
                </el-button>
            </template>
        </msg-dialog>
    </div>
</template>

<script>
import SearchSelect from "./components/SearchSelect";
import SearchRadioSelect from "./components/SearchRadioSelect";
import BuildingDictionarySelect from "./components/BuildingDictionarySelect";
import { MsgDialog } from './components'
import { commonFun } from "@/assets/js/utils/utils";
import { getInfoByProjectId } from './utils/index.js';
import moment from "moment";
import merge from "webpack-merge";
export default {
    name: "building-compare",
    data() {
        return {
            // 价格限制判断
            priceLimitMsg: '',
            // 系统判断超出10万时或者低于1万的系统进行的单价录入提示弹窗显隐状态
            priceValitShow: false,
            // 搜索框是否隐藏
            serchIsShow: true,
            // 是否展示/隐藏文案
            isShowText: "隐藏",
            // 楼盘销售状态自洽弹框
            sellStatus: false,
            // 楼盘销售状态自洽户型数据
            houseTypeData: [],
            // 楼盘销售状态自洽楼栋数据
            buildTypeData: [],
            // 初始化单价的值
            initPrice: {
                minVal: 0,
                maxVal: 0
            },
            // 价格升降限制
            liftingPrice: 0,
            // 价格升降限制弹框
            liftingDialog: false,
            // 是否需要价格涨跌校验
            isCheck: true,
            // 楼盘销售状态自洽文案
            buildCompareText: '',
            tableData: [],
            soptions: [],
            trList: [],
            trListTit: {},
            upHeight: true,
            titleList: [], // 左侧表头
            operationObj: null, // 左侧居理操作列
            data_source_list: [], // 数据源操作数组
            options: [],
            optionsName: [],
            mutiInput: "",
            relation_buildings: [], // 关联楼栋
            maxHeight: [], // 记录所有最大高度
            taskList: [], // 表头任务列表
            cityId: "", // 筛选的城市ID
            cityList: [], // 城市下拉
            houseSaveType: "", // 业态保存
            houseNameSele: "", // 筛选的楼盘名称
            houseList: [], // 默认下拉选中项内容
            houseNameOptions: [], // 楼盘名称下拉
            houseTypeSele: [], // 筛选的业态名称
            houseTypeOptions: [], // 业态下拉
            saleStatusSele: "", // 筛选的销售状态
            saleStatusOptions: [], // 销售状态下拉
            isOporateSele: "", // 是否合作
            isOporateOptions: [], // 是否合作下拉
            distriSele: [], // 筛选的区域内容
            distriOptions: [], // 区域下拉
            projectInfo: {}, // 楼盘对比信息
            houseId: "", // 初次渲染楼盘名称id
            houseIdChange: false, // 渲染楼盘名称还未修改过
            operationSave: {}, // 保存操作项
            timeout: null,
            taskId: this.$route.query.task_id, // 任务ID
            houseTags: {}, // 楼盘标签
            bigData: {}, // 大数据
            houseName: {}, // 楼盘名称
            cityTbId: "", // 表格里面的城市ID
            tbSelect: {
                houseNameTb: [], // 楼盘名称
                houseTypeTb: [],
                saleTb: [],
                isOpTb: [],
                distriTb: []
            }, // 表格内使用的下拉
            project_id: "",
            mountdFlag: false, // 是否渲染成功
            currentTurn: {}, // 当前选择要跳转的内容
            tbLoading: false, // 表格loading
            dialogVisibleNoTask: false, // 无任务状态弹窗展示
            dialogVisibleSaveWarn: false, // 是否保存弹窗展示--切换楼盘
            dialogVisibleSave: false, // 是否保存弹窗展示---切换页面
            dialogContentNoTask: "当前已经无相关任务，请返回到任务列表进行查看", // 弹窗内容
            // 楼盘重复性弹窗
            repeatDialog: false,
            // 重复跳转URl
            repeatJumpUrl: '',
            // 来源标记
            source: {}
        };
    },
    components: {
        SearchSelect,
        SearchRadioSelect,
        BuildingDictionarySelect,
        MsgDialog
    },
    mounted() {
        // 数据请求
        this.getSearchInfo();
        // 存储价格上限
        this.priceTop = 100000;
        // 存储价格下限
        this.priceFloor = 10000;
        // 是否是点击的下一个任务
        this.isSaveNext = false;
        // 是否校验价格大于10万或小于一万
        this.isVilidateLimit = true;
        /**
         * 楼盘字典V3.2优化
         * author: 解彬
         * time: 2019.9.16
         */
        // 查找展示状态是否有值
        if (localStorage.getItem("showStatus") === "false") {
            // 修改展示隐藏按钮文案
            this.serchIsShow = false;
            this.isShowText = "展开";
        } else if (localStorage.getItem("showStatus") === "true") {
            this.serchIsShow = true;
            this.isShowText = "隐藏";
        }
        /** END */
        document.addEventListener('visibilitychange', () => {
            console.log(document.visibilityState + '---' + new Date().getTime())
        });
    },
    methods: {
        /**
         * 前往编辑页面跳转、新增楼栋
         * @param {string} val type--house(新增楼栋)、edit(楼盘编辑页面)
         */
        turnToPage(val) {
            getInfoByProjectId(this.projectInfo.project_id, 'project_type_text,city_id,name,project_id').then((data) => {
                if (!data) {
                    return false;
                }
                let routeData = null;
                if (val === 'edit') {
                    routeData = this.$router.resolve({
                        path: '/building/tabToggleList',
                        query: {
                            isEdit: '1',
                            projectId: data.project_id,
                            cityId: data.city_id,
                            projectName: data.name,
                            buildingType: `(${data.project_type_text})`,
                            role: 'operation'
                        }
                    });
                    // 埋点
                    this.setTrack('4827');
                } else if (val === 'house') {
                    routeData = this.$router.resolve({
                        path: '/building/tabToggleList',
                        query: {
                            projectId: data.project_id,
                            cityId: data.city_id,
                            projectName: data.name,
                            buildingType: `(${data.project_type_text})`,
                            positionTab: '2',
                            role: 'operation'
                        }
                    });
                }
                if (routeData) {
                    let opener = window.open(routeData.href, "_blank");
                    opener.opener = null;
                }
            });
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
                this.save('nextTask');
                return;
            }
            this.save();
        },
        /**
         * 楼盘字典V3.2优化新增方法
         * author: 解彬
         * time: 2019.9.16
         */
        //跳转页面
        jumpPage() {
            window.open(this.repeatJumpUrl);
        },
        /**
         * 销售状态自洽
         * @params url [string] 跳转地址
         * @params text [string] 点击条件是户型还是楼栋
         */
        houseJump(url,text) {
            window.open(url);
            if (text === 'buildType') {
                this.setTrack('5342', {error_type: '1'});
            } else if (text === 'houseType') {
                this.setTrack('5341', {error_type: '1'});
            }
        },
        // 销售状态自洽弹窗关闭
        confimClose() {
            this.sellStatus = false;
            this.setTrack('5343', {error_type: '1'});
        },
        // 价格涨跌弹框继续保存
        confimSave() {
            // 不需要校验价格
            this.isCheck = false;
            this.liftingDialog = false;
            this.setTrack('5346', {});
            this.save();
        },
        // 价格涨跌弹框关闭
        closeDiaLog() {
            this.setTrack('5345', {});
            this.liftingDialog = false;
        },
        // 搜索条件是否显示以及埋点
        searchsIsShow() {
            this.serchIsShow = !this.serchIsShow;
            if (this.serchIsShow) {
                this.isShowText = "隐藏";
                // 楼盘任务埋点
                this.setTrack('5065', {is_show_search: '1'});
            } else {
                this.isShowText = "展开";
                // 楼盘任务埋点
                this.setTrack('5065', {is_show_search: '2'});
            }
            // 记录显示状态
            localStorage.setItem("showStatus", this.serchIsShow);
        },
        /* END */
        // 公共埋点方法
        setTrack(trackId, para) {
            // 如果有扩展字段不为空 添加page相关参数
            if (para) {
                Object.assign(para, {
                    frompage_id: 'p_project_task',
                    topage_id: 'p_project_task'
                });
            }
            commonFun.setTrackMenu(trackId, para);
        },
        // 转换为旬
        matchTen(para) {
            let rel;
            if (para == 1) {
                rel = "上";
            } else if (para == 2) {
                rel = "中";
            } else if (para == 3) {
                rel = "下";
            }
            return rel;
        },
        // 检查分期、交房、放量的不一致数组是否存在
        checkBorder(paraKey) {
            let rel = this.checkOther(paraKey);
            return rel;
        },
        checkOther(paraKey) {
            let result = false;
            let arr = this.data_source_list ? this.data_source_list : [];
            for (let i = 0; i < arr.length; i++) {
                let other = arr[i].field_data[paraKey].otherArr
                    ? arr[i].field_data[paraKey].otherArr.length
                    : [];
                if (other > 0) {
                    result = true;
                    break;
                }
            }
            return result;
        },
        // 大数据跳转
        bigTurn(para) {
            // 埋点
            this.setTrack("4828");
            window.open(para.url);
        },
        // 计算时间戳
        getTimeSpan(key, year, month, day, ten) {
            let date = null;
            if (key === "plan") {
                // 放量计划年、月必填，日和旬必填其一
                if (
                    year &&
                    year != 0 &&
                    (month && month != 0) &&
                    (!day || day == 0) &&
                    (!ten || ten == 0)
                ) {
                    // 只有年和月的情况，目前不会走这儿
                    let str = year + "-" + month + "-15 00:00:00";
                    date = new Date(str);
                } else if (
                    year &&
                    year != 0 &&
                    (month && month != 0) &&
                    (day && day != 0) &&
                    (!ten || ten == 0)
                ) {
                    let str = year + "-" + month + "-" + day + " 00:00:00";
                    date = new Date(str);
                } else if (
                    year &&
                    year != 0 &&
                    (month && month != 0) &&
                    (!day || day == 0) &&
                    (ten && ten != 0)
                ) {
                    let changeDay = "";
                    if (ten === 1) {
                        changeDay = 5;
                    } else if (ten === 2) {
                        changeDay = 15;
                    } else if (ten === 3) {
                        changeDay = 25;
                    }
                    let str =
                        year + "-" + month + "-" + changeDay + " 00:00:00";
                    date = new Date(str);
                }
            } else if (key === "time") {
                // 交房时间年必填
                if (month) {
                    if (
                        year &&
                        year != 0 &&
                        (!month || month == 0) &&
                        (!day || day == 0) &&
                        (!ten || ten == 0)
                    ) {
                        let str = year + "/12/31 23:59:59";
                        date = new Date(str);
                    } else if (
                        year &&
                        year != 0 &&
                        (month && month != 0) &&
                        (!day || day == 0) &&
                        (!ten || ten == 0)
                    ) {
                        // 只有年和月的情况
                        let str =
                            year +
                            "/" +
                            month +
                            "/" +
                            this.getDayByMonth(year, month) +
                            " 23:59:59";
                        date = new Date(str);
                    } else if (
                        year &&
                        year != 0 &&
                        (month && month != 0) &&
                        (day && day != 0)
                    ) {
                        let str = year + "/" + month + "/" + day + " 23:59:59";
                        date = new Date(str);
                    } else if (
                        year &&
                        year != 0 &&
                        (month && month != 0) &&
                        (!day || day == 0) &&
                        (ten && ten != 0)
                    ) {
                        let changeDay = "";
                        if (ten === 1) {
                            changeDay = 10;
                        } else if (ten === 2) {
                            changeDay = 20;
                        } else if (ten === 3) {
                            changeDay = this.getDayByMonth(year, month);
                        }
                        let str =
                            year + "/" + month + "/" + changeDay + " 23:59:59";
                        date = new Date(str);
                    }
                } else {
                    let str = year + "/12/31 23:59:59";
                    date = new Date(str);
                }
            }
            let stamp = moment(date).valueOf() / 1000;
            return stamp;
        },
        // 获取每个月最后一天
        getDayByMonth(paraYear, paraMonth) {
            let lastDay = 31;
            let cond1 = paraYear % 4 == 0; // 条件1：年份必须要能被4整除
            let cond2 = paraYear % 100 != 0; // 条件2：年份不能是整百数
            let cond3 = paraYear % 400 == 0; // 条件3：年份是400的倍数
            if (paraMonth == 2) {
                if (cond1 && cond2 && cond3) {
                    // 闰年
                    lastDay = 29;
                } else {
                    lastDay = 28;
                }
            } else if ([4, 6, 9, 11].includes(paraMonth)) {
                lastDay = 30;
            } else {
                lastDay = 31;
            }
            return lastDay;
        },
        // 给年月日旬组件组装参数
        matchObj (para, index, paraType) {
            let sourceDate = {};
            this.$set(sourceDate, "year", para.year);
            this.$set(sourceDate, "month", para.month);
            this.$set(sourceDate, "day", para.day);
            this.$set(sourceDate, "Period", para.ten);
            this.$set(sourceDate, "index", index);
            if (paraType === "time") {
                // 交房时间
                this.$set(sourceDate, "type", 2);
            } else if (paraType === "plan") {
                this.$set(sourceDate, "type", 1);
            }
            return sourceDate;
        },
        // 获取放量计划时间
        getSeleTime(para) {
            this.operationObj.volume_date.value[para.index].year = para.year;
            this.operationObj.volume_date.value[para.index].month = para.month;
            this.operationObj.volume_date.value[para.index].day = para.day;
            this.operationObj.volume_date.value[para.index].ten = para.Period;
            this.operationObj.volume_date.value[para.index].year__source = '运营';
            this.operationObj.volume_date.value[para.index].month__source = '运营';
            this.operationObj.volume_date.value[para.index].day__source = '运营';
            this.operationObj.volume_date.value[para.index].ten__source = '运营';
            // 计算时间戳
            this.operationObj.volume_date.value[
                para.index
            ].timestamp = this.getTimeSpan(
                "plan",
                para.year,
                para.month,
                para.day,
                para.Period
            );
        },
        // 交房时间获取时间
        getSeleRoomTime(para) {
            this.operationObj.live_date.value[para.index].year = para.year;
            this.operationObj.live_date.value[para.index].month = para.month;
            this.operationObj.live_date.value[para.index].day = para.day;
            this.operationObj.live_date.value[para.index].ten = para.Period;
            this.operationObj.live_date.value[para.index].year__source = '运营';
            this.operationObj.live_date.value[para.index].month__source = '运营';
            this.operationObj.live_date.value[para.index].day__source = '运营';
            this.operationObj.live_date.value[para.index].ten__source = '运营';
            // 计算时间戳
            this.operationObj.live_date.value[
                para.index
            ].timestamp = this.getTimeSpan(
                "time",
                para.year,
                para.month,
                para.day,
                para.Period
            );
        },
        // 物流公司改变
        changeSelect (parakey) {
            this.operationObj[parakey].isChange = true;
        },
        // 点击变黄   e=绿化率的$event  e=建设阶段的index   type=isYear 产权年限的其他操作
        changeColor (paraKey, e, type) {
            if (paraKey === "type") {
                this.getBusinessType(
                    this.operationObj[paraKey].value,
                    "change"
                );
            }
            if (e && e.target) {
                this.operationObj[paraKey].value = e.target.value;
            }
            // 分期放量等数组中的下拉选择不用标记来源，因为这些多条数据都得单独每条标记
            let arr = ['volume_date', 'staging', 'live_date', 'construction_stage', 'property_year', 'business_layout', 'water_electy', 'decorate_info'];
            if (arr.indexOf(paraKey) == -1) {
                this.$set(this.source, paraKey+'__source', '运营');
            }
            let arr1 = [ 'volume_date', 'construction_stage', 'business_layout', 'water_electy', 'property_year', 'decorate_info'];
            // 建设阶段 建筑类型，水电气，产权年限，装修情况
            if (arr1.indexOf(paraKey) !== -1) {
                this.operationObj[paraKey].value[e].source = "运营";
            }
            // 分期的名字和状态分开计算来源
            if (paraKey === 'staging') {
                if (type === 'stageStatus') {
                    // 状态来源
                    this.operationObj[paraKey].value[e].status__source = "运营";
                } else if(type === 'stageName'){
                    // 名字来源
                    this.operationObj[paraKey].value[e].source = "运营";
                }
            }
            // 一些联动的特殊处理
            if (type) {
                // 产权年限选择其他
                if (type === 'isYear') {
                    this.operationObj.property_year.value[e].other__source = "运营";
                } else if(type === 'isFee' || type === 'isUnit'){
                    // 装修情况和装修单位 三个来源一起改变
                    this.operationObj.decorate_info.value[e].fee__source = "运营";
                    this.operationObj.decorate_info.value[e].unit__source = "运营";
                }
            }
            this.operationObj[paraKey].isChange = true;
        },
        // 判断当前是否修改过
        checkUpdate() {
            let result = false;
            for (let key in this.operationObj) {
                if (this.operationObj[key].isChange) {
                    result = true;
                    break;
                }
            }
            return result;
        },
        // 不保存并跳转
        turnNoSave(para) {
            if (para === "next") {
                // 下一个楼盘
                this.getData(true);
                this.dialogVisibleSaveWarn = false;
            } else if (para === "turn") {
                if (
                    this.currentTurn.title === "户型" ||
                    this.currentTurn.title === "楼栋"
                ) {
                    this.$router.push({ path: this.currentTurn.url });
                } else {
                    window.open(this.currentTurn.url);
                }
                this.dialogVisibleSave = false;
            }
            this.dialogVisibleSaveWarn = false;
        },
        // 保存并跳转
        turnToSave(para) {
            if (para === "next") {
                // 下一个楼盘
                this.save("next");
                this.dialogVisibleSaveWarn = false;
            } else if (para === "turn") {
                this.save("turn");
                this.dialogVisibleSave = false;
            }
        },
        // 点击下一个楼盘
        chooseNext() {
            // 提示是否保存
            if (this.checkUpdate()) {
                this.dialogVisibleSaveWarn = true;
            } else {
                // 下一个楼盘
                this.getData(true);
            }
        },
        // 跳转到任务列表
        skipToTaskList() {
            window.location.href =
                "/index.php?r=cj-project-task/unfinished-task";
        },
        // 校验放量计划跟当前时间的对比
        validateTime(arr, key) {
            let msg = {
                vali: true,
                tip: ""
            };
            let nowTime = moment().format("X");
            if (key === "volume") {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].timestamp) {
                        // 有时间戳，源数据那边
                        if (
                            Number(nowTime) < Number(arr[i].timestamp) &&
                            !(Number(arr[i].type) == 3 || Number(arr[i].type == 4))
                        ) {
                            msg.vali = false;
                            msg.tip =
                                "放量时间大于当前时间，放量类型需要为预计开盘或预计加推";
                            break;
                        } else if (
                            Number(nowTime) >= Number(arr[i].timestamp) &&
                            !(Number(arr[i].type) == 1 || Number(arr[i].type) == 2)
                        ) {
                            msg.vali = false;
                            msg.tip =
                                "放量时间小于等于当前时间，放量类型需要为开盘或加推";
                            break;
                        }
                    }
                }
            } else if (key === "time") {
                for (let i = 0; i < arr.length; i++) {
                    if (Number(nowTime) < Number(arr[i].timestamp) && arr[i].type != '1') {
                        msg.vali = false;
                        msg.tip =
                            "交房时间大于当前时间时。类型必须为预计交房时间";
                        break;
                    } else if (
                        Number(nowTime) >= Number(arr[i].timestamp) &&
                        arr[i].type != '2'
                    ) {
                        msg.vali = false;
                        msg.tip =
                            "交房时间小于等于当前时间时。类型必须为交房时间";
                        break;
                    }
                }
            }
            return msg;
        },
        // 判断数组中每一个都在范围内
        numberBetween(arr, key, min, max) {
            let msg = {
                vali: true,
                tip: ""
            };
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value <= min || arr[i].value >= max) {
                    // min-max
                    msg.vali = false;
                    msg.tip = "物业费范围是" + min + "-" + max;
                    break;
                }
            }
            return msg;
        },
        // 业态和建筑类型对应检查
        typeMatchPhase(typePara, phaseArr) {
            let msg = {
                vali: true,
                tip: ""
            };
            // 住宅 1／限价房 100：洋房 114、小高层 115、高层 116、超高层 117
            // 别墅 2：独栋 105、叠拼 102、双拼 104、联排 103、类独栋 106、合院 107
            // 商业 55、商办 3、写字楼 58、商务型公寓 59、：低层建筑 119、小高层建筑 120、中高层建筑 121、高层建筑 122、超高层建筑 123
            for (let i = 0; i < phaseArr.length; i++) {
                if (
                    (typePara == 1 || typePara == 100) &&
                    phaseArr[i].type &&
                    (phaseArr[i].type != 114 &&
                        phaseArr[i].type != 115 &&
                        phaseArr[i].type != 116 &&
                        phaseArr[i].type != 117)
                ) {
                    msg.vali = false;
                    msg.tip =
                        "业态和建筑类型无法匹配，请修改建筑类型或业态后保存！";
                    break;
                } else if (
                    typePara == 2 &&
                    phaseArr[i].type &&
                    (phaseArr[i].type != 105 &&
                        phaseArr[i].type != 102 &&
                        phaseArr[i].type != 104 &&
                        phaseArr[i].type != 103 &&
                        phaseArr[i].type != 106 &&
                        phaseArr[i].type != 107)
                ) {
                    msg.vali = false;
                    msg.tip =
                        "业态和建筑类型无法匹配，请修改建筑类型或业态后保存！";
                    break;
                } else if (
                    (typePara == 55 ||
                        typePara == 3 ||
                        typePara == 58 ||
                        typePara == 59) &&
                    phaseArr[i].type &&
                    (phaseArr[i].type != 119 &&
                        phaseArr[i].type != 120 &&
                        phaseArr[i].type != 121 &&
                        phaseArr[i].type != 122 &&
                        phaseArr[i].type != 123)
                ) {
                    msg.vali = false;
                    msg.tip =
                        "业态和建筑类型无法匹配，请修改建筑类型或业态后保存！";
                    break;
                }
            }
            return msg;
        },
        // 判断放量计划和交房时间填写是否正确
        checkTime(paraKey, paraType) {
            let msg = {
                vali: true,
                tip: ""
            };
            if (paraType === "time") {
                // 交房时间，年必填
                for (
                    let i = 0;
                    i < this.operationObj[paraKey].value.length;
                    i++
                ) {
                    if (
                        !this.operationObj[paraKey].value[i].year ||
                        this.operationObj[paraKey].value[i].year == 0
                    ) {
                        msg.vali = false;
                        msg.tip = "交房时间填写错误";
                        break;
                    }
                }
            } else if (paraType === "plan") {
                for (
                    let i = 0;
                    i < this.operationObj[paraKey].value.length;
                    i++
                ) {
                    if (
                        !this.operationObj[paraKey].value[i].year ||
                        this.operationObj[paraKey].value[i].year == 0 ||
                        !this.operationObj[paraKey].value[i].month ||
                        this.operationObj[paraKey].value[i].month == 0
                    ) {
                        msg.vali = false;
                        msg.tip =
                            "放量计划格式输入错误，请务必保证结构为N年N月N日上/中/下旬的结构";
                        break;
                    } else if (
                        (!this.operationObj[paraKey].value[i].day ||
                            this.operationObj[paraKey].value[i].day == 0) &&
                        (!this.operationObj[paraKey].value[i].ten ||
                            this.operationObj[paraKey].value[i].ten == 0)
                    ) {
                        msg.vali = false;
                        msg.tip =
                            "放量计划格式输入错误，请务必保证结构为N年N月N日上/中/下旬的结构";
                        break;
                    }
                }
            }
            return msg;
        },
        /**
         * @description: 判断价格范围
         * @param {Object} val 判断数据
         * @return {String} name 判断内容名称
         */        
        checkPriceLimit(val, name) {
            let flag = true;
            const minValFlag = val.min_value;
            const maxValFlag = val.max_value;
            const type = val.type === 4;
            if (type && (minValFlag && !maxValFlag || !minValFlag && maxValFlag)) {
                // 如果只填写了最大值或者是最小值
                flag = false;
                this.$message.info('请检查必填信息是否填写完整！');
            } else if (type && minValFlag && maxValFlag && parseFloat(maxValFlag) <= parseFloat(minValFlag)) {
                // 最大值和最小值都填写了
                flag = false;
                this.$message.error(`${name}的最大值必须大于最小值`);
            }
            return flag;
        },
        /**
         * @description: 判断单价是否大于十万小于一万
         * @param {Number} type 单价类型
         * @param {String} minVal 最小值
         * @param {String} maxVal 最大值
         */
        checkPriceFixLimit(type, minVal, maxVal) {
            let flag = true;
            const currentType = type === 4;
            let currentMinVal = minVal;
            // 如果不是区间值，则将最大比较值也赋值为最小值（最小值是当前展示的input框）
            let currentMaxVal = currentType ? maxVal : minVal;
            if ((Number(currentMaxVal) >= this.priceTop / 10000 || Number(currentMinVal) <= this.priceFloor / 10000)) {
                // 如果是区间
                let limit = `${minVal} - ${maxVal}`;
                this.priceLimitMsg = `本次修改的楼盘单价为${currentType ? limit : minVal}万元/㎡
                    系统判断价格可能存在异常，请确认是否正确录入！`;
                this.priceValitShow = true;
                flag = false;
            }
            return flag;
        },
        /**
         * @description: 单价涨跌提示判断方法
         * @param {Number} type 单价类型
         * @param {String} minVal 最小值
         * @param {String} maxVal 最大值
         */
        checkUpDownLimit(type, minVal, maxVal) {
            const currentType = type === 4;
            const priceMin = this.initPrice.minVal;
            const priceMax = this.initPrice.maxVal;
            const initFlag = priceMin > 0 && priceMax > 0;
            // 如果涨跌限制！==-1并且不是系统单价，并且最大值和最小值有值，并且需要做涨跌校验
            const checkFlag = this.liftingPrice !== -1 && type !== 1 && initFlag && this.isCheck;
            if (this.liftingPrice === 0 && type === 1) {
                // 系统单价并且涨跌范围不为0
                return false;
            }
            if (checkFlag && currentType && (Math.abs(minVal * 10000 - priceMin) >= this.liftingPrice || Math.abs(maxVal * 10000 - priceMax) >= this.liftingPrice)) {
                // 是区间值
                return false;
            }
            if (checkFlag && !currentType && Math.abs(minVal * 10000 - priceMin) >= this.liftingPrice) {
                // 是非区间值
                return false;
            }
            return true;
        },
        // 保存信息
        save (para) {
            // 判断是否是下一步任务
            this.isSaveNext = para === 'nextTask';
            // 校验
            // 必填项==城市、区域、楼盘名称、业态、销售状态、楼盘经纬度
            if (this.operationObj.district_id.value == "") {
                this.$message.error("区域未填写");
            } else if (this.operationObj.name.value == "") {
                this.$message.error("楼盘名称未填写");
            } else if (this.operationObj.type.value == "") {
                this.$message.error("业态未填写");
            } else if (this.operationObj.status.value == "") {
                this.$message.error("销售状态未填写");
            } else if (
                this.operationObj.lat_lng.lat == "" ||
                this.operationObj.lat_lng.lng == ""
            ) {
                this.$message.error("楼盘经纬度未填写");
            } else if (!this.checkTime("live_date", "time").vali) {
                // 交房时间填写
                this.$message.error(this.checkTime("live_date", "time").tip);
            } else if (!this.checkTime("volume_date", "plan").vali) {
                // 放量时间填写
                this.$message.error(this.checkTime("volume_date", "plan").tip);
            } else {
                // 保存单价最大值和最小值
                const minVal = this.operationObj.project_price.min_value;
                const maxVal = this.operationObj.project_price.max_value;
                const priceType = this.operationObj.project_price.type;
                // 价格范围，最大值必须大于最小值
                if (!this.checkPriceLimit(this.operationObj.project_price, '单价') ||!this.checkPriceLimit(this.operationObj.total_price, '总价')) {
                    return false;
                }
                if (
                    !this.validateTime(
                        this.operationObj.volume_date.value,
                        "volume"
                    ).vali
                ) {
                    // 放量计划类型选择
                    this.$message.error(
                        this.validateTime(
                            this.operationObj.volume_date.value,
                            "volume"
                        ).tip
                    );
                } else if (
                    !this.validateTime(
                        this.operationObj.live_date.value,
                        "time"
                    ).vali
                ) {
                    // 交房时间类型选择
                    this.$message.error(
                        this.validateTime(
                            this.operationObj.live_date.value,
                            "time"
                        ).tip
                    );
                } else if (
                    !this.numberBetween(
                        this.operationObj.property_fee.value,
                        "fee",
                        0,
                        9999
                    ).vali
                ) {
                    // 物业费价格为0-9999
                    this.$message.error(
                        this.numberBetween(
                            this.operationObj.property_fee.value,
                            "fee",
                            0,
                            9999
                        ).tip
                    );
                } else if (
                    !this.typeMatchPhase(
                        this.operationObj.type.value,
                        this.operationObj.business_layout.value
                    ).vali
                ) {
                    // 业态于建筑类型不匹配
                    this.$message.error(
                        this.typeMatchPhase(
                            this.operationObj.type.value,
                            this.operationObj.business_layout.value
                        ).tip
                    );
                } else if (this.isVilidateLimit && !this.checkPriceFixLimit(priceType, minVal, maxVal)) {
                    return false;
                } else if (!this.checkUpDownLimit(priceType, minVal, maxVal)) {
                    this.liftingDialog = true;
                    return false;
                } else if (this.operationObj.greening.value === '0' || Number(this.operationObj.greening.value) >= '100') {
                    alert('绿化录入错误，请录入0-100的数字！')
                } else {
                    let reg = /[\（]/g;
                    let reg2 = /[\）]/g;
                    // 楼盘名称将中文（）匹配为英文()
                    this.operationObj.name.value = this.operationObj.name.value
                        .replace(reg, "(")
                        .replace(reg2, ")");
                    // 组装保存信息
                    let params = {
                        Project: {},
                        Staging: [],
                        LiveDate: [],
                        ProjectVolume: [],
                        ProjectBuildingInfo: {
                            property_year: [],
                            construction_stage: [],
                            business_layout: [],
                            property_company_id: [],
                            property_fee: [],
                            water_electy: [],
                            decorate_info: []
                        }
                    };
                    params.Project.name = this.operationObj.name.value;
                    params.Project.district_id = this.operationObj.district_id.value;
                    params.Project.district_name = this.operationObj.district_id.name;
                    params.Project.type = this.operationObj.type.value;
                    params.Project.price_type = this.operationObj.total_price.type;
                    // 总价选择只有一个输入框的时候
                    if (
                        this.operationObj.total_price.type == 1 ||
                        this.operationObj.total_price.type == 4
                    ) {
                        params.Project.price_max = this.operationObj.total_price.max_value;
                    }
                    params.Project.price_min = this.operationObj.total_price.min_value;
                    // 组装单价
                    let priceMinVal = this.operationObj.project_price.min_value;
                    let priceMaxVal = this.operationObj.project_price.max_value;
                    const priceTypes = this.operationObj.project_price.type;
                    if (priceTypes !== 4) {
                        // 如果当前单价选项不是区间值，则需要把最大值赋值为最小值的内容
                        priceMaxVal = priceMinVal;
                    }
                    params.Project.current_price_type = priceTypes;
                    params.Project.current_rate = priceMinVal;
                    params.Project.current_rate_max = priceMaxVal;
                    
                    params.Project.alias = this.operationObj.alias.value;
                    params.Project.status = this.operationObj.status.value;
                    params.Project.lat = this.operationObj.lat_lng.lat;
                    params.Project.lng = this.operationObj.lat_lng.lng;
                    params.Project.address = this.operationObj.address.value;
                    params.Project.far = this.operationObj.far.value;
                    params.Project.greening = this.operationObj.greening.value;
                    params.Project.car_space = this.operationObj.car_space.value;
                    params.Project.developer = this.operationObj.developer.value;
                    params.Project.heating = this.operationObj.heating.value;
                    params.Project.area = this.operationObj.area.value;
                    params.Project.ring_road = this.operationObj.ring_road.value;
                    // 组装tag
                    let tagList = [];
                    for (let i = 0; i < this.operationObj.tags.length; i++) {
                        if (this.operationObj.tags[i].checked) {
                            tagList = tagList.concat(
                                this.operationObj.tags[i].model
                            );
                        } else {
                            tagList.push(this.operationObj.tags[i].model);
                        }
                    }
                    params.Project.tags = tagList.join(",");
                    // 标记来源
                    params.Project = Object.assign(params.Project, this.source);
                    // 分期拼接保存数据
                    for (
                        let i = 0;
                        i < this.operationObj.staging.value.length;
                        i++
                    ) {
                        let obj = {
                            staging_name: this.operationObj.staging.value[i]
                                .staging_name,
                            staging_sale_status: this.operationObj.staging
                                .value[i].sale_status,
                            building_id: this.operationObj.staging.value[
                                i
                            ].relation_building_ids.join(","),
                            staging_name__source: this.operationObj.staging.value[i].source || '',
                            staging_sale_status__source: this.operationObj.staging.value[i].status__source || '',
                            building_id__source: this.operationObj.staging.value[i].building_id__source || ''
                        };
                        params.Staging.push(obj);
                    }
                    // 交房时间保存数据拼接
                    for (
                        let i = 0;
                        i < this.operationObj.live_date.value.length;
                        i++
                    ) {
                        let obj = {
                            live_date_type: this.operationObj.live_date.value[i]
                                .type,
                            live_date_year: this.operationObj.live_date.value[i]
                                .year,
                            live_date_month: this.operationObj.live_date.value[
                                i
                            ].month,
                            live_date_day: this.operationObj.live_date.value[i]
                                .day,
                            live_date_ten: this.operationObj.live_date.value[i]
                                .ten,
                            builds: [
                                this.operationObj.live_date.value[
                                    i
                                ].relation_building_ids.join(",")
                            ],
                            live_date_type__source: this.operationObj.live_date.value[i].source || '',
                            live_date_year__source: this.operationObj.live_date.value[i].year__source || '',
                            live_date_month__source: this.operationObj.live_date.value[i].month__source || '',
                            live_date_day__source: this.operationObj.live_date.value[i].day__source || '',
                            live_date_ten__source: this.operationObj.live_date.value[i].ten__source || '',
                            builds__source: this.operationObj.live_date.value[i].building_id__source || ''
                        };
                        params.LiveDate.push(obj);
                    }
                    // 放量计划保存数据拼接
                    for (
                        let i = 0;
                        i < this.operationObj.volume_date.value.length;
                        i++
                    ) {
                        let obj = {
                            volume_id: this.operationObj.volume_date.value[i]
                                .volume_id,
                            volume_type: this.operationObj.volume_date.value[i]
                                .type,
                            volume_date_year: this.operationObj.volume_date
                                .value[i].year,
                            volume_date_month: this.operationObj.volume_date
                                .value[i].month,
                            volume_date_day: this.operationObj.volume_date
                                .value[i].day,
                            volume_date_ten: this.operationObj.volume_date
                                .value[i].ten,
                            building_id: this.operationObj.volume_date.value[
                                i
                            ].relation_building_ids.join(","),
                            volume_type__source: this.operationObj.volume_date.value[i].source || '',
                            volume_date_year__source: this.operationObj.volume_date.value[i].year__source || '',
                            volume_date_month__source: this.operationObj.volume_date.value[i].month__source || '',
                            volume_date_day__source: this.operationObj.volume_date.value[i].day__source || '',
                            volume_date_ten__source: this.operationObj.volume_date.value[i].ten__source || '',
                            building_id__source: this.operationObj.volume_date.value[i].building_id__source || ''
                        };
                        params.ProjectVolume.push(obj);
                    }
                    // 楼盘相关信息
                    // 产权年限保存数据拼接
                    for (
                        let i = 0;
                        i < this.operationObj.property_year.value.length;
                        i++
                    ) {
                        let obj = {
                            property_year: this.operationObj.property_year
                                .value[i].type,
                            property_year_other: this.operationObj.property_year
                                .value[i].other_note,
                            building_id: this.operationObj.property_year.value[
                                i
                            ].relation_building_ids.join(","),
                            property_year__source: this.operationObj.property_year.value[i].source || '',
                            property_year_other__source: this.operationObj.property_year.value[i].other__source || '',
                            building_id__source: this.operationObj.property_year.value[i].building_id__source || ''
                        };
                        params.ProjectBuildingInfo.property_year.push(obj);
                    }
                    // 建设阶段保存数据拼接
                    for (
                        let i = 0;
                        i < this.operationObj.construction_stage.value.length;
                        i++
                    ) {
                        let obj = {
                            construction_stage: this.operationObj
                                .construction_stage.value[i].type,
                            building_id: this.operationObj.construction_stage.value[
                                i
                            ].relation_building_ids.join(","),
                            construction_stage__source: this.operationObj.construction_stage.value[i].source || '',
                            building_id__source: this.operationObj.construction_stage.value[i].building_id__source || ''
                        };
                        params.ProjectBuildingInfo.construction_stage.push(obj);
                    }
                    // 建筑类型保存数据拼接
                    for (
                        let i = 0;
                        i < this.operationObj.business_layout.value.length;
                        i++
                    ) {
                        let obj = {
                            business_layout: this.operationObj.business_layout
                                .value[i].type,
                            building_id: this.operationObj.business_layout.value[
                                i
                            ].relation_building_ids.join(","),
                            business_layout__source: this.operationObj.business_layout.value[i].source || '',
                            building_id__source: this.operationObj.business_layout.value[i].building_id__source || ''
                        };
                        params.ProjectBuildingInfo.business_layout.push(obj);
                    }
                    // 物业公司保存数据拼接
                    for (
                        let i = 0;
                        i < this.operationObj.property_company_id.value.length;
                        i++
                    ) {
                        let obj = {
                            property_company_id: this.operationObj
                                .property_company_id.value[i].value.id,
                            building_id: this.operationObj.property_company_id.value[
                                i
                            ].relation_building_ids.join(","),
                            property_company_id__source: this.operationObj.property_company_id.value[i].source || '',
                            building_id__source: this.operationObj.property_company_id.value[i].building_id__source || ''
                        };
                        params.ProjectBuildingInfo.property_company_id.push(
                            obj
                        );
                    }
                    // 物业费保存数据拼接
                    for (
                        let i = 0;
                        i < this.operationObj.property_fee.value.length;
                        i++
                    ) {
                        let obj = {
                            property_fee: this.operationObj.property_fee.value[
                                i
                            ].value,
                            building_id: this.operationObj.property_fee.value[
                                i
                            ].relation_building_ids.join(","),
                            property_fee__source: this.operationObj.property_fee.value[i].source || '',
                            building_id__source: this.operationObj.property_fee.value[i].building_id__source || ''
                        };
                        params.ProjectBuildingInfo.property_fee.push(obj);
                    }
                    // 水电费保存数据拼接
                    for (
                        let i = 0;
                        i < this.operationObj.water_electy.value.length;
                        i++
                    ) {
                        let obj = {
                            water_electy: this.operationObj.water_electy.value[
                                i
                            ].value,
                            building_id: this.operationObj.water_electy.value[
                                i
                            ].relation_building_ids.join(","),
                            water_electy__source: this.operationObj.water_electy.value[i].source || '',
                            building_id__source: this.operationObj.water_electy.value[i].building_id__source || ''
                        };
                        params.ProjectBuildingInfo.water_electy.push(obj);
                    }
                    // 装修情况保存数据拼接
                    for (
                        let i = 0;
                        i < this.operationObj.decorate_info.value.length;
                        i++
                    ) {
                        let obj = {
                            decorate_info: this.operationObj.decorate_info
                                .value[i].type,
                            decorate_unit: this.operationObj.decorate_info
                                .value[i].unit,
                            decorate_fee: this.operationObj.decorate_info.value[
                                i
                            ].fee,
                            building_id: this.operationObj.decorate_info.value[
                                i
                            ].relation_building_ids.join(","),
                            decorate_info__source: this.operationObj.decorate_info.value[i].source || '',
                            decorate_fee__source: this.operationObj.decorate_info.value[i].fee__source || '',
                            decorate_unit__source: this.operationObj.decorate_info.value[i].unit__source || '',
                            building_id__source: this.operationObj.decorate_info.value[i].building_id__source || ''
                        };
                        params.ProjectBuildingInfo.decorate_info.push(obj);
                    }
                    this.tbLoading = true;
                    // 保存数据接口
                    this.axios
                        .post(
                            "/backend-api/project/save-project?project_id=" +
                                this.projectInfo.project_id,
                            params
                        )
                        .then(res => {
                            if (res.data.code === 0) {
                                // 保存成功后重置初始值
                                this.isSaveNext = false;
                                if (para === "next") {
                                    // 进入下一个
                                    this.getData(true);
                                    this.tbLoading = false;
                                } else if (para === "turn") {
                                    if (
                                        this.currentTurn.title === "户型" ||
                                        this.currentTurn.title === "楼栋"
                                    ) {
                                        this.$router.push({
                                            path: this.currentTurn.url
                                        });
                                        // this.tbLoading = false;
                                    } else {
                                        window.open(this.currentTurn.url);
                                        this.tbLoading = false;
                                    }
                                } else {
                                    // 跳转到任务列表
                                    window.location.href =
                                        "/index.php?r=cj-project-task/unfinished-task";
                                    // this.tbLoading = false;
                                }
                            } else if (res.data.code === 20004) {
                                this.repeatDialog = true;
                                this.repeatJumpUrl = res.data.data.url;
                                this.tbLoading = false;
                            } else if (res.data.code === 20006) {
                                this.sellStatus = true;
                                this.houseTypeData = res.data.data.house_type;
                                this.buildTypeData = res.data.data.building_data;
                                this.buildCompareText = res.data.msg;
                                this.tbLoading = false;
                            } else {
                                // 保存不成功，弹窗后台错误弹窗
                                this.tbLoading = false;
                                this.$message.error(res.data.msg);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            this.tbLoading = false;
                        });
                }
            }
        },
        // 物业费只能输入数字
        feeInput(para, paraIndex, paraKey) {
            this.operationObj[paraKey].isChange = true;
            this.operationObj.property_fee.value[paraIndex].source = "运营";
            this.operationObj.property_fee.value[
                paraIndex
            ].value = para.replace(/[^\d.]/g, "");
            this.operationObj.property_fee.value[
                paraIndex
            ].value = this.operationObj.property_fee.value[
                paraIndex
            ].value.replace(/\.{2,}/g, "");
            this.operationObj.property_fee.value[
                paraIndex
            ].value = this.operationObj.property_fee.value[paraIndex].value
                .replace(".", "$#$")
                .replace(/\./g, "")
                .replace("$#$", ".");
            this.operationObj.property_fee.value[
                paraIndex
            ].value = this.operationObj.property_fee.value[
                paraIndex
            ].value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
        },
        /**
         * @description: 标记来源
         * @param {String} val unitPrice-单价，totalPrice-总价
         */
        checkSource(val) {
            if (val === 'unitPrice') {
                this.$set(this.source, 'current_rate__source', '运营');
                this.$set(this.source, 'current_rate_max__source', '运营');
            } else {
                this.$set(this.source, 'price_min__source', '运营');
                this.$set(this.source, 'price_max__source', '运营');
            }
        },
        inputMatch (para, key, subKey) {
            if (key === "lat_lng") {
                this.operationObj[key][subKey] = para.replace(/[^\d.]/g, "");
                this.operationObj[key][subKey] = this.operationObj[key][
                    subKey
                ].replace(/\.{2,}/g, "");
                this.operationObj[key][subKey] = this.operationObj[key][subKey]
                    .replace(".", "$#$")
                    .replace(/\./g, "")
                    .replace("$#$", ".");
                this.$set(this.source, 'lng__source', '运营');
                this.$set(this.source, 'lat__source', '运营');
            } else if (key === "far") {
                this.operationObj[key][subKey] = para.replace(/[^\d.]/g, "");
                this.operationObj[key][subKey] = this.operationObj[key][
                    subKey
                ].replace(/\.{2,}/g, "");
                this.operationObj[key][subKey] = this.operationObj[key][subKey]
                    .replace(".", "$#$")
                    .replace(/\./g, "")
                    .replace("$#$", ".");
                this.$set(this.source, 'far__source', '运营');
            }
            // 修改底色变黄
            this.operationObj[key].isChange = true;
        },
        changeHouseName (para, index) {
            this.operationObj[para].isChange = true;
            this.operationObj[para].value[index].building_id__source = '运营';
        },
        // 获取楼盘的下拉对象
        getOption(para) {
            this.houseName = para.item;
        },
        // 物业公司修改，动态修改传进来的值
        getCompanyOption(para) {
            this.operationObj.property_company_id.value[para.index].value =
                para.item;
            this.operationObj.property_company_id.value[para.index].source = '运营';
        },
        // 单独获取销售状态和是否合作
        getSaleOperate() {
            let params = {
                type: [1, 2],
                city_id: this.cityTbId
            };
            this.axios
                .post("/backend-api/common/get-project-config", params)
                .then(res => {
                    if (res.data.code === 0) {
                        // 给搜索区域下拉赋值
                        this.saleStatusOptions = res.data.data.sale_status;
                        this.isOporateOptions = res.data.data.cooperate_status;
                    }
                })
                .catch(err => {
                    this.tbLoading = false;
                    console.log(err);
                });
        },
        // 根据业态获取建筑类型
        getBusinessType(para, key) {
            let params = {
                project_type: para
            };
            this.axios
                .get("/backend-api/common/get-business-layout", {
                    params: params
                })
                .then(res => {
                    if (res.data.code === 0) {
                        if (key === "change") {
                            // 如果不是第一次加载，则需要没次清空已经选中的建筑类型
                            this.operationObj.business_layout.value.map(
                                item => {
                                    item.type = "";
                                }
                            );
                        }
                        // 给建筑类型下拉赋值
                        this.operationObj.business_layout.options =
                            res.data.data;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 表格操作项匹配
        getOperate() {
            // 区域
            let getDistri = new Promise((resolve, reject) => {
                let params = {
                    q: "",
                    city_id: this.cityTbId
                };
                this.axios
                    .get("/backend-api/common/get-district-list", {
                        params: params
                    })
                    .then(res => {
                        if (res.data.code === 0) {
                            this.distriOptions = res.data.data;
                            resolve(res.data.data);
                        } else {
                            resolve([]);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
            // 业态
            let getType = new Promise((resolve, reject) => {
                let params = {
                    q: "",
                    city_id: this.cityTbId
                };
                this.axios
                    .get("/backend-api/common/get-project-type-list", {
                        params: params
                    })
                    .then(res => {
                        if (res.data.code === 0) {
                            this.houseTypeOptions = res.data.data;
                            resolve(res.data.data);
                        } else {
                            resolve([]);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
            // 楼盘标签
            let getTags = new Promise((resolve, reject) => {
                let params = { project_id: this.projectInfo.project_id };
                this.axios
                    .get("/backend-api/project/tags", {params})
                    .then(res => {
                        if (res.data.code === 0) {
                            resolve(res.data.data);
                        } else {
                            resolve([]);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
            // 表格通用
            let getTbInfo = new Promise((resolve, reject) => {
                let params = {
                    type: [1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14],
                    city_id: this.cityTbId
                };
                this.axios
                    .post("/backend-api/common/get-project-config", params)
                    .then(res => {
                        if (res.data.code === 0) {
                            // 给搜索区域下拉赋值
                            this.saleStatusOptions = res.data.data.sale_status;
                            this.isOporateOptions =
                                res.data.data.cooperate_status;
                            resolve(res.data.data);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
            Promise.all([getDistri, getType, getTbInfo, getTags])
                .then(result => {
                    // 区域
                    this.operationObj.district_id.options = result[0];
                    // 业态
                    this.operationObj.type.options = result[1];
                    // 销售状态
                    this.operationObj.status.options = result[2].sale_status;
                    // 放量计划
                    this.operationObj.volume_date.options =
                        result[2].volume_type;
                    // 产权年限
                    this.operationObj.property_year.options =
                        result[2].property_year;
                    // 建设阶段
                    this.operationObj.construction_stage.options =
                        result[2].construct_stage;
                    // 单价
                    this.operationObj.project_price.options =
                        result[2].unit_price_type;
                    // 总价
                    this.operationObj.total_price.options =
                        result[2].total_price_type;
                    // 装修情况
                    this.operationObj.decorate_info.options =
                        result[2].decorate_info;
                    // 环线
                    this.operationObj.ring_road.options = result[2].ring_road;
                    // 板块
                    this.operationObj.area.options = result[2].trade_area;
                    // 楼盘标签
                    // 楼盘标签绑定值
                    for (let j = 0; j < result[3].length; j++) {
                        if (result[3][j].checked) {
                            result[3][j].model = [];
                        } else {
                            result[3][j].model = "";
                        }
                        // 楼盘标签默认选择项组装
                        for (
                            let i = 0;
                            i < this.operationObj.tags.value.length;
                            i++
                        ) {
                            if (
                                this.operationObj.tags.value[i].type_id ==
                                result[3][j].type_id
                            ) {
                                if (result[3][j].checked) {
                                    for (
                                        let k = 0;
                                        k <
                                        this.operationObj.tags.value[i].tags
                                            .length;
                                        k++
                                    ) {
                                        result[3][j].model.push(
                                            this.operationObj.tags.value[i]
                                                .tags[k] + ""
                                        );
                                    }
                                } else {
                                    result[3][j].model =
                                        this.operationObj.tags.value[i]
                                            .tags[0] + "";
                                }
                            }
                        }
                    }
                    this.operationObj.tags = result[3];
                    // 单价，默认根据选项来展示，3代表系统单价
                    if (this.operationObj.project_price.type == 1) {
                        this.operationObj.project_price.input = true;
                    } else {
                        this.operationObj.project_price.input = false;
                    }
                    // 总价，
                    if (this.operationObj.total_price.type == 1) {
                        // 系统总价，两个输入框，但是都不可选
                        this.operationObj.total_price.maxInput = true;
                        this.operationObj.total_price.minInput = true;
                        // this.operationObj.total_price.min_value = ''
                        // this.operationObj.total_price.max_value = ''
                    } else if (this.operationObj.total_price.type == 4) {
                        // 总价区间，两个输入框
                        this.operationObj.total_price.maxInput = false;
                        this.operationObj.total_price.minInput = false;
                    }
                    // 分期--销售状态进行单独赋值
                    this.operationObj.staging.options = result[2].sale_status;
                    // 交房时间--状态进行单独赋值
                    this.operationObj.live_date.options =
                        result[2].live_date_type;
                    // 动态计算高度
                    this.$nextTick(() => {
                        this.calculateHeigth();
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.tbLoading = false;
                });
        },
        // 楼盘名称和别名匹配规则方法
        nameMatch(para) {
            // 替换掉·    ・     •
            let nextTr = "";
            try {
                let matchTr = para
                    .replace(/·/g, "")
                    .replace(/・/g, "")
                    .replace(/•/g, "");
                // 匹配中文括号为英文括号，然后去除括号以及内容
                nextTr = matchTr
                    .replace(/\（/g, "(")
                    .replace(/\）/g, ")")
                    .replace(/\(.*\)/u, "");
            } catch (error) {
                console.log(error);
            }
            return nextTr;
        },
        // 数据初始化
        getData(nextFlag, key) {
            let params = {};
            params = {
                project_id: this.houseNameSele,
                city_id: this.cityId,
                status: this.saleStatusSele,
                is_cooperate: this.isOporateSele,
                district_id: this.distriSele.join(","),
                project_type: this.houseTypeSele.join(","),
                task_id: this.taskId
            };
            if (nextFlag) {
                // 点击下一个
                params.next_task_id = this.projectInfo.task_id;
                params.next_project_id = this.projectInfo.project_id;
            }
            if (key === "reset") {
                params.reset = 1;
            }
            this.axios
                .get("/backend-api/project/detail", { params: params })
                .then(res => {
                    if (res.data.code === 0) {
                        let resData = res.data.data;
                        if (JSON.stringify(resData) == "{}") {
                            // 没有数据，则需要弹窗
                            this.dialogVisibleNoTask = true;
                        } else {
                            // 将滚动条恢复到顶部
                            let tableWrapper = document.getElementsByClassName(
                                "el-table__body-wrapper"
                            )[0];
                            tableWrapper.scrollTo(0, 0);
                            // let resData = tableData.data
                            this.titleList = resData.grid_info.filed_info;
                            this.operationObj = resData.grid_info.julive_info ? resData.grid_info.julive_info : {};
                            // 根据表格内的业态来联动表格内的建筑类型
                            this.getBusinessType(this.operationObj.type.value);
                            // 给销售状态转换为字符串格式
                            this.operationObj.status.value =
                                this.operationObj.status.value + "";
                            // 给环线转换为字符串
                            this.operationObj.ring_road.value =
                                this.operationObj.ring_road.value + "";
                            // 给板块转换为字符串
                            this.operationObj.area.value =
                                this.operationObj.area.value + "";
                            this.operationSave = JSON.parse(
                                JSON.stringify(this.operationObj)
                            );
                            this.data_source_list = resData.grid_info.source;
                            // 给源数据的别名和楼盘名称添加是否变蓝的字段
                            let aliasArr = this.operationObj.alias.value.split(
                                ","
                            );
                            let houseNameStr =
                                this.operationObj.name.value + "";
                            // 组成名称组
                            aliasArr.push(this.nameMatch(houseNameStr));
                            this.data_source_list.map(item => {
                                // 楼盘名称标蓝
                                let nameHas = aliasArr.findIndex(v => {
                                    return (
                                        this.nameMatch(v) ==
                                        this.nameMatch(
                                            item.field_data.name.value
                                        )
                                    );
                                });
                                let nameObj = {
                                    value: item.field_data.name.value,
                                    isTask: false
                                };
                                item.field_data.name = nameObj;
                                // 楼盘名称
                                if (this.titleList.name.is_diff_julive) {
                                    // 如果不报错，则不需要标蓝
                                    if (nameHas == -1) {
                                        item.field_data.name.isTask = true;
                                    } else {
                                        item.field_data.name.isTask = false;
                                    }
                                } else {
                                    item.field_data.name.isTask = false;
                                }
                                // 别名标蓝
                                for (
                                    let i = 0;
                                    i < item.field_data.alias.value.length;
                                    i++
                                ) {
                                    // 别名标蓝
                                    let isHas = aliasArr.findIndex(v => {
                                        return (
                                            this.nameMatch(v) ==
                                            this.nameMatch(
                                                item.field_data.alias.value[i]
                                            )
                                        );
                                    });
                                    let obj = {
                                        value: item.field_data.alias.value[i],
                                        isTask: false
                                    };
                                    item.field_data.alias.value[i] = obj;
                                    if (this.titleList.alias.is_diff_julive) {
                                        // 如果不报错，则不需要标蓝
                                        if (isHas == -1) {
                                            item.field_data.alias.value[
                                                i
                                            ].isTask = true;
                                        } else {
                                            item.field_data.alias.value[
                                                i
                                            ].isTask = false;
                                        }
                                    } else {
                                        item.field_data.alias.value[
                                            i
                                        ].isTask = false;
                                    }
                                }
                            });
                            this.taskList = resData.task_module;
                            this.projectInfo = resData.project_info;
                            // 保存一份业态
                            this.houseSaveType = this.operationObj.type.value;
                            this.bigData = resData.grid_info.big_data;
                            // 保存表格里面的城市
                            this.cityTbId = this.operationObj.city.id;
                            let project = {
                                id: this.projectInfo.project_id + "",
                                text: this.projectInfo.project_name
                            };
                            // 将搜索项保存到sessionStorage
                            let searchParams = {
                                project_id: this.projectInfo.project_id,
                                city_id: this.cityId,
                                status: this.saleStatusSele,
                                is_cooperate: this.isOporateSele,
                                district_id: this.distriSele.join(","),
                                project_type: this.houseTypeSele.join(","),
                                task_id: this.taskId,
                                next_task_id: this.projectInfo.task_id,
                                next_project_id: this.projectInfo.project_id,
                                houseName: project
                            };
                            // 保存单价值
                            this.initPrice.minVal = resData.grid_info.julive_info.project_price.min_value * 10000;
                            this.initPrice.maxVal = resData.grid_info.julive_info.project_price.max_value * 10000;
                            // 获取城市升降价限制
                            this.liftingPrice = resData.price_limit;
                            // 存储价格上限
                            this.priceTop = resData.price_top;
                            // 存储价格下限
                            this.priceFloor = resData.price_floor;
                            this.$router.push({
                                query: merge(this.$route.query, {
                                    searchParams: JSON.stringify(searchParams)
                                })
                            });
                        }
                    } else if (res.data.code === 1007) {
                        // 没有数据，则需要弹窗
                        this.dialogVisibleNoTask = true;
                    }
                })
                .then(() => {
                    // 表格操作项匹配
                    this.getOperate();
                })
                .then(() => {
                    // 源数据匹配
                    this.sourceStage();
                })
                .then(() => {
                    this.$nextTick(() => {
                        this.calculateHeigth();
                        this.tbLoading = false;
                        this.mountdFlag = true;
                    });
                })
                .catch(err => {
                    this.tbLoading = false;
                    console.log(err);
                });
        },
        // 获取城市信息
        getInfo() {
            let params = {
                q: "",
                type: 1
            };
            this.axios
                .get("/backend-api/common/get-city-list", { params: params })
                .then(res => {
                    if (res.data.code === 0) {
                        this.cityList = res.data.data;
                        // 渲染页面时候更新其他联动下拉，切换联动下拉默认不选中任何下拉
                        this.getDistrict();
                        // 获取业态
                        this.getType();
                    }
                })
                .catch(err => {
                    this.tbLoading = false;
                    console.log(err);
                });
        },
        // 获取区域下拉
        getDistrict(paraKey) {
            let params = {
                q: "",
                city_id: this.cityId
            };
            this.axios
                .get("/backend-api/common/get-district-list", {
                    params: params
                })
                .then(res => {
                    if (res.data.code === 0) {
                        // 给表格里面下拉赋值，防止搜索项改变后，表格内下拉发生改变
                        this.tbSelect.distriTb = res.data.data;
                        this.distriOptions = res.data.data;
                        if (paraKey === "clear") {
                            // 清空已经选择的项
                            this.distriSele = [];
                        }
                    }
                })
                .catch(err => {
                    this.tbLoading = false;
                    console.log(err);
                });
        },
        // 获取业态下拉
        getType() {
            let params = {
                q: "",
                city_id: this.cityId
            };
            this.axios
                .get("/backend-api/common/get-project-type-list", {
                    params: params
                })
                .then(res => {
                    if (res.data.code === 0) {
                        // 给表格里面下拉赋值，防止搜索项改变后，表格内下拉发生改变
                        this.tbSelect.houseTypeTb = res.data.data;
                        this.houseTypeOptions = res.data.data;
                        // 切换的已经选中的业态要保存
                        let arr = [];
                        if (this.houseTypeSele.length > 0) {
                            for (
                                let i = 0;
                                i < this.houseTypeSele.length;
                                i++
                            ) {
                                let isHas = this.houseTypeOptions.findIndex(
                                    v => {
                                        return v.id == this.houseTypeSele[i];
                                    }
                                );
                                if (isHas != -1) {
                                    arr.push(this.houseTypeSele[i]);
                                }
                            }
                        }
                        this.houseTypeSele = arr;
                    }
                })
                .catch(err => {
                    this.tbLoading = false;
                    console.log(err);
                });
        },
        // 获取搜索项默认选择
        getSearchInfo() {
            // 添加loading
            this.tbLoading = true;
            this.axios
                .get("/backend-api/project/get-search-record")
                .then(res => {
                    if (res.data.code === 0) {
                        let resData = res.data.data;
                        this.cityId = resData.city_id
                            ? resData.city_id + ""
                            : "";
                        this.distriSele = resData.district_id
                            ? resData.district_id
                            : [];
                        this.saleStatusSele = resData.status
                            ? resData.status + ""
                            : "";
                        this.isOporateSele = resData.is_cooperate
                            ? resData.is_cooperate + ""
                            : "";
                        this.houseNameSele = resData.project_info
                            ? resData.project_info.id
                            : "";
                        this.houseName = resData.project_info
                            ? resData.project_info
                            : {};
                        this.houseId = resData.project_info
                            ? resData.project_info.id
                            : "";
                        this.houseTypeSele = resData.project_type
                            ? resData.project_type
                            : [];
                        // 判断url上是否有搜索参数
                        let search = {};
                        if (this.$route.query.searchParams) {
                            search = JSON.parse(this.$route.query.searchParams);
                            this.houseNameSele = search.project_id
                                ? search.project_id
                                : "";
                            this.cityId = search.city_id ? search.city_id : "";
                            this.saleStatusSele = search.status
                                ? search.status
                                : "";
                            this.isOporateSele = search.is_cooperate
                                ? search.is_cooperate
                                : "";
                            this.distriSele = search.district_id
                                ? search.district_id.split(",")
                                : [];
                            this.houseTypeSele = search.project_type
                                ? search.project_type.split(",")
                                : [];
                            this.taskId = search.task_id ? search.task_id : "";
                            this.projectInfo.task_id = search.next_task_id
                                ? search.next_task_id
                                : "";
                            this.projectInfo.project_id = search.next_project_id
                                ? search.next_project_id
                                : "";
                            this.houseName = search.houseName
                                ? search.houseName
                                : {};
                        }
                    }
                })
                .then(() => {
                    // 数据初始化
                    this.getData();
                    // 获取城市下拉
                    this.getInfo();
                    // 获取销售状态和是否合作下拉
                    this.getSaleOperate();
                })
                .catch(err => {
                    this.tbLoading = false;
                    console.log(err);
                });
        },
        // 任务点击匹配跳转方式
        turnPage(para) {
            // 保存跳转内容，在弹出框使用
            this.currentTurn = para;
            // 提示是否保存
            if (this.checkUpdate()) {
                this.dialogVisibleSave = true;
            } else {
                if (para.title === "户型" || para.title === "楼栋") {
                    this.$router.push({ path: para.url });
                } else {
                    window.open(para.url);
                }
            }
        },
        // 楼盘名称选中
        houseSelect(para) {
            // 记录楼盘修改选项，搜索时不用传houseId
            this.houseIdChange = true;
            this.houseId = para;
        },
        // 点击楼盘名称更新
        changeName (paraKey, para, source) {
            if (paraKey === 'greening' && para.indexOf('%') > 0) {
                para = para.substr(0, para.indexOf('%'));
            }
            this.$set(this.source, paraKey+'__source', source);
            this.operationObj[paraKey].value = para;
            this.operationObj[paraKey].isChange = true;
        },
        // 单价选项切换
        changePrice(para) {
            if (para.type == 1) {
                para.input = true;
            } else {
                para.input = false;
            }
            this.operationObj.project_price.isChange = true;
            // 每次切换都需要给来源赋值
            this.$set(this.source, 'current_rate__source', '运营');
            this.$set(this.source, 'current_rate_max__source', '运营');
        },
        // 总价选项切换
        allPriceChange(para, paraKey) {
            if (para.type == 1) {
                // 系统总价
                para.maxInput = true;
                para.minInput = true;
            } else {
                para.maxInput = false;
                para.minInput = false;
            }
            this.operationObj[paraKey].isChange = true;
            this.$set(this.source, 'price_min__source', '运营');
            this.$set(this.source, 'price_max__source', '运营');
        },
        // 新增操作项
        addNewItem(paraKey, paraType) {
            let obj = {};
            if (paraType === "year") {
                // 产权年限
                obj = {
                    type: "",
                    other_note: "",
                    relation_buildings: [],
                    relation_building_ids: []
                };
            } else if (paraType === "phase") {
                // 建设阶段
                obj = {
                    type: "",
                    relation_buildings: [],
                    relation_building_ids: []
                };
            } else if (paraType === "company") {
                // 物业公司
                obj = {
                    value: {
                        id: "",
                        text: ""
                    },
                    relation_buildings: [],
                    relation_building_ids: []
                };
            } else if (paraType === "fee") {
                // 物业费
                obj = {
                    value: "",
                    relation_buildings: [],
                    relation_building_ids: []
                };
            } else if (paraType === "decorate") {
                // 装修情况
                obj = {
                    name: "",
                    price: "",
                    company: "",
                    relation_buildings: [],
                    relation_building_ids: []
                };
            }
            this.operationObj[paraKey].value.push(obj);
            this.operationObj[paraKey].isChange = true;
            this.$nextTick(() => {
                this.calculateHeigth();
            });
        },
        // 删除操作项
        deleteOperate(paraKey, paraIndex) {
            this.operationObj[paraKey].value.splice(paraIndex, 1);
            this.operationObj[paraKey].isChange = true;
            this.$nextTick(() => {
                this.calculateHeigth();
            });
        },
        // 匹配其他不一致数组
        matchOtherArr(opArr, conArr, key) {
            let arr = [];
            if (key === "stage") {
                // 分期不一致数组
                for (let i = 0; i < conArr.length; i++) {
                    let flag = null;
                    for (let j = 0; j < opArr.length; j++) {
                        // 根据比较规则来进行判断是否一致
                        if (
                            opArr[j].staging_name_num ==
                            conArr[i].staging_name_num
                        ) {
                            flag = j;
                            break;
                        }
                    }
                    if (flag === null) {
                        // 没有匹配值，则可以返回
                        arr.push(conArr[i]);
                    }
                }
            } else if (key === "time" || key === "plan") {
                // 交房时间不一致数组
                for (let i = 0; i < conArr.length; i++) {
                    let flag = null;
                    for (let j = 0; j < opArr.length; j++) {
                        // 根据比较规则来进行判断是否一致
                        if (
                            opArr[j].origin.year == conArr[i].year &&
                            opArr[j].origin.month == conArr[i].month &&
                            opArr[j].origin.day == conArr[i].day &&
                            opArr[j].origin.ten == conArr[i].ten
                        ) {
                            flag = j;
                            break;
                        }
                    }
                    if (flag === null) {
                        // 没有匹配值，则可以返回
                        arr.push(conArr[i]);
                    }
                }
            }
            return arr;
        },
        // 给源数据的分期、交房时间、放量计划匹配数据
        sourceStage() {
            // 手动进行匹配
            this.data_source_list.map(item => {
                // 给每一个数据源都匹配不一致数组
                item.field_data.staging.otherArr = this.matchOtherArr(
                    this.operationObj.staging.value,
                    item.field_data.staging.value,
                    "stage"
                );
                item.field_data.live_date.otherArr = this.matchOtherArr(
                    this.operationObj.live_date.value,
                    item.field_data.live_date.value,
                    "time"
                );
                item.field_data.volume_date.otherArr = this.matchOtherArr(
                    this.operationObj.volume_date.value,
                    item.field_data.volume_date.value,
                    "plan"
                );
            });
            setTimeout(() => {
                this.calculateHeigth();
            });
        },
        // 分期添加一行
        addArr (para, opArr, key, paraKey, paraIndex, paraArr, source) {
            this.tbLoading = true;
            // 深拷贝对象
            let copyPara = JSON.parse(JSON.stringify(para));
            copyPara.sale_status = copyPara.staging_sale_status + "";
            this.tbLoading = true;
            if (key === "time" || key === "plan") {
                let nowTime = moment().format("X");
                // 跟当前时间做对比，比当前时间大时把类型更新为预计交房，否则为交房
                if (nowTime < para.timestamp) {
                    if (paraKey === "live_date") {
                        copyPara.type = "1";
                    } else if (paraKey === "volume_date") {
                        copyPara.type = "3";
                    }
                } else {
                    if (paraKey === "live_date") {
                        copyPara.type = "2";
                    } else if (paraKey === "volume_date") {
                        copyPara.type = "1";
                    }
                }
                copyPara.timestamp = para.timestamp;
                copyPara.origin = {
                    year: para.year,
                    month: para.month,
                    day: para.day,
                    ten: para.ten
                };
                copyPara.source = source;
                copyPara.year__source = source;
                copyPara.month__source = source;
                copyPara.day__source = source;
                copyPara.ten__source = source;
            } else {
                copyPara.source = source;
                copyPara.status__source = source;
            }
            copyPara.relation_buildings = [];
            copyPara.relation_building_ids = [];
            // 一致添加一行
            opArr.push(copyPara);
            // 删除不一致的那一行数据
            paraArr.splice(paraIndex, 1);
            // 重新计算高度
            this.$nextTick(() => {
                this.calculateHeigth();
                this.tbLoading = false;
            });
            this.operationObj[paraKey].isChange = true;
        },
        // 一致数组添加
        changeAdd (paraKey, para, paraIndex, paraType, source) {
            this.tbLoading = true;
            // 根据参数来判断当前是哪个操作项
            if (paraType === "stage") {
                // 判断左侧下拉中是否有当前选中项
                if (
                    this.matchItem(
                        para.staging_sale_status,
                        this.operationObj[paraKey].options
                    ) !== -1
                ) {
                    this.operationObj[paraKey].value[paraIndex].sale_status =
                        para.staging_sale_status + "";
                    this.operationObj[paraKey].value[paraIndex].staging_name =
                        para.staging_name;
                    this.operationObj[paraKey].value[paraIndex].source = source;
                    this.operationObj[paraKey].value[paraIndex].status__source = source;
                    this.tbLoading = false;
                }
            } else if (paraType === "time") {
                let nowTime = moment().format("X");
                // 跟当前时间做对比，比当前时间大时把类型更新为预计交房，否则为交房
                if (nowTime < para.timestamp) {
                    if (paraKey === "live_date") {
                        this.operationObj[paraKey].value[paraIndex].type = "1";
                    } else if (paraKey === "volume_date") {
                        this.operationObj[paraKey].value[paraIndex].type = "3";
                    }
                } else {
                    if (paraKey === "live_date") {
                        this.operationObj[paraKey].value[paraIndex].type = "2";
                    } else if (paraKey === "volume_date") {
                        this.operationObj[paraKey].value[paraIndex].type = "1";
                    }
                }
                let date = {
                    year: para.year,
                    month: para.month,
                    day: para.day,
                    ten: para.ten
                };
                this.operationObj[paraKey].value[paraIndex].year = para.year;
                this.operationObj[paraKey].value[paraIndex].month = para.month;
                this.operationObj[paraKey].value[paraIndex].day = para.day;
                this.operationObj[paraKey].value[paraIndex].ten = para.ten;
                this.operationObj[paraKey].value[paraIndex].timestamp =
                    para.timestamp;
                this.operationObj[paraKey].value[paraIndex].origin = date;
                this.operationObj[paraKey].value[paraIndex].source = source;
                this.operationObj[paraKey].value[paraIndex].year__source = source;
                this.operationObj[paraKey].value[paraIndex].month__source = source;
                this.operationObj[paraKey].value[paraIndex].day__source = source;
                this.operationObj[paraKey].value[paraIndex].ten__source = source;
                this.tbLoading = false;
            }
            this.operationObj[paraKey].isChange = true;
        },
        // 删除分期、交房时间、放量计划一行
        deleteItem(paraIndex, para, key, paraKey) {
            // 添加loading
            this.tbLoading = true;
            new Promise((resolve, reject) => {
                // 先找到要删除的项属于哪一个源里面，并且添加到不一致数组里面
                if (key === "stage") {
                    this.data_source_list.map((item, index) => {
                        let itemIndex = null;
                        let arrIndex;
                        for (
                            let i = 0;
                            i < item.field_data.staging.value.length;
                            i++
                        ) {
                            if (
                                item.field_data.staging.value[i]
                                    .staging_name_num == para.staging_name_num
                            ) {
                                itemIndex = index;
                                arrIndex = i;
                                break;
                            }
                        }
                        // 在当前循环对象中，有删除的这个项，则添加到这个不一致数组中
                        if (itemIndex !== null) {
                            // 检查不一致数组中是否已经存在该项
                            let isHas = item.field_data.staging.otherArr.findIndex(
                                v => {
                                    return (
                                        v.staging_name_num ==
                                        para.staging_name_num
                                    );
                                }
                            );
                            if (isHas == -1) {
                                item.field_data.staging.otherArr.push(
                                    item.field_data.staging.value[arrIndex]
                                );
                            }
                        }
                    });
                    resolve();
                } else if (key === "time") {
                    this.data_source_list.map((item, index) => {
                        let itemIndex = null;
                        let arrIndex;
                        for (
                            let i = 0;
                            i < item.field_data.live_date.value.length;
                            i++
                        ) {
                            if (
                                item.field_data.live_date.value[i].year ==
                                    para.origin.year &&
                                item.field_data.live_date.value[i].month ==
                                    para.origin.month &&
                                item.field_data.live_date.value[i].day ==
                                    para.origin.day &&
                                item.field_data.live_date.value[i].ten ==
                                    para.origin.ten
                            ) {
                                arrIndex = i;
                                itemIndex = index;
                                break;
                            }
                        }
                        // 在当前循环对象中，有删除的这个项，则添加到这个不一致数组中
                        if (itemIndex !== null) {
                            // 检查不一致数组中是否已经存在该项
                            let isHas = item.field_data.live_date.otherArr.findIndex(
                                v => {
                                    return (
                                        v.year == para.origin.year &&
                                        v.month == para.origin.month &&
                                        v.day == para.origin.day &&
                                        v.ten == para.origin.ten
                                    );
                                }
                            );
                            if (isHas == -1) {
                                item.field_data.live_date.otherArr.push(
                                    item.field_data.live_date.value[arrIndex]
                                );
                            }
                        }
                    });
                    resolve();
                } else if (key === "plan") {
                    this.data_source_list.map((item, index) => {
                        let itemIndex = null;
                        let arrIndex;
                        for (
                            let i = 0;
                            i < item.field_data.volume_date.value.length;
                            i++
                        ) {
                            if (
                                item.field_data.volume_date.value[i].year ==
                                    para.origin.year &&
                                item.field_data.volume_date.value[i].month ==
                                    para.origin.month &&
                                item.field_data.volume_date.value[i].day ==
                                    para.origin.day &&
                                item.field_data.volume_date.value[i].ten ==
                                    para.origin.ten
                            ) {
                                arrIndex = i;
                                itemIndex = index;
                                break;
                            }
                        }
                        // 在当前循环对象中，有删除的这个项，则添加到这个不一致数组中
                        if (itemIndex !== null) {
                            // 检查不一致数组中是否已经存在该项
                            let isHas = item.field_data.volume_date.otherArr.findIndex(
                                v => {
                                    return (
                                        v.year == para.origin.year &&
                                        v.month == para.origin.month &&
                                        v.day == para.origin.day &&
                                        v.ten == para.origin.ten
                                    );
                                }
                            );
                            if (isHas == -1) {
                                item.field_data.volume_date.otherArr.push(
                                    item.field_data.volume_date.value[arrIndex]
                                );
                            }
                        }
                    });
                    resolve();
                }
            }).then(() => {
                if (key === "stage") {
                    // 分期不一致数组赋值
                    this.operationObj.staging.value.splice(paraIndex, 1);
                } else if (key === "time") {
                    // 交房时间不一致数组赋值
                    this.operationObj.live_date.value.splice(paraIndex, 1);
                } else if (key === "plan") {
                    // 交房时间不一致数组赋值
                    this.operationObj.volume_date.value.splice(paraIndex, 1);
                }
                this.operationObj[paraKey].isChange = true;
                // 重新计算高度
                this.$nextTick(() => {
                    this.calculateHeigth();
                });
                this.tbLoading = false;
            });
        },
        // 右侧更新左侧下拉项
        changeItem (para, paraKey, paraType, source) {
            if (paraType === "select") {
                // 业态、区域
                if (
                    paraKey == "district_id" &&
                    !this.titleList.district_id.is_allow_modify
                ) {
                    // 如果区域不能切换，则点击源也不能覆盖操作列
                    return;
                }
                if (
                    this.matchItem(
                        para.id,
                        this.operationObj[paraKey].options
                    ) !== -1
                ) {
                    // 检查左侧下拉中是否存在选中项
                    this.operationObj[paraKey].value = para.id;
                    this.operationObj[paraKey].name = para.value;
                    this.$set(this.source, paraKey+'__source', source);
                }
            } else if (paraType === "select-string") {
                if (
                    this.matchItem(
                        para.id,
                        this.operationObj[paraKey].options
                    ) !== -1
                ) {
                    // 检查左侧下拉中是否存在选中项
                    this.operationObj[paraKey].value = para.id + "";
                    this.operationObj[paraKey].name = para.value;
                    this.$set(this.source, paraKey+'__source', source);
                }
            } else if (paraType === "alias") {
                // 别名更新
                if (!this.operationObj[paraKey].value) {
                    this.operationObj[paraKey].value = para.value;
                } else {
                    this.operationObj[paraKey].value += "," + para.value;
                }
            } else if (paraType === "lng_lat") {
                // 更新楼盘经纬度
                this.operationObj[paraKey].lng = para.lng;
                this.operationObj[paraKey].lat = para.lat;
                this.$set(this.source, 'lng__source', source);
                this.$set(this.source, 'lat__source', source);
            } else if (paraType === "tags") {
                for (let i = 0; i < this.operationObj.tags.length; i++) {
                    if (this.operationObj.tags[i].type_id == para.type_id) {
                        if (Array.isArray(this.operationObj.tags[i].model)) {
                            let isHas = this.operationObj.tags[
                                i
                            ].model.findIndex(v => {
                                return v == para.id;
                            });
                            if (isHas == -1) {
                                this.operationObj.tags[i].model.push(
                                    para.id + ""
                                );
                            }
                        } else {
                            this.operationObj.tags[i].model = para.id + "";
                        }
                    }
                }
            }
            this.operationObj[paraKey].isChange = true;
        },
        // 有关联楼栋的更新左侧
        changeItemBuild (para, paraKey, paraType, source) {
            console.log(para, paraType);
            let obj = {};
            if (paraType === "year") {
                // 更新产权年限
                let itemLength = this.operationObj[paraKey].value.length;
                if (itemLength > 0) {
                    let other = "";
                    let itemType = para.value;
                    if (
                        para.value != 70 &&
                        para.value != 40 &&
                        para.value != 20 &&
                        para.value != 50
                    ) {
                        itemType = "-1";
                        other = para.value;
                    }
                    this.operationObj[paraKey].value[itemLength - 1].type =
                        itemType + "";
                    this.operationObj[paraKey].value[
                        itemLength - 1
                    ].other_note = other;
                    this.operationObj[paraKey].value[itemLength - 1].source = source;
                    this.operationObj[paraKey].value[itemLength - 1].other__source = other ? source : '';
                } else {
                    let other = "";
                    let type = para.value;
                    if (
                        para.value != 70 &&
                        para.value != 40 &&
                        para.value != 20 &&
                        para.value != 50
                    ) {
                        type = "-1";
                        other = para.value;
                    }
                    obj = {
                        type: type + "",
                        other_note: other,
                        relation_building_ids: [],
                        relation_buildings: []
                    };
                }
            } else if (paraType === "phase") {
                // 更新建设阶段
                if (
                    this.matchItem(
                        para.id,
                        this.operationObj[paraKey].options
                    ) !== -1
                ) {
                    let itemLength = this.operationObj[paraKey].value.length;
                    if (itemLength > 0) {
                        this.operationObj[paraKey].value[itemLength - 1].type =
                            para.id + "";
                        this.operationObj[paraKey].value[itemLength - 1].source = source;
                    } else {
                        obj = {
                            type: para.id + "",
                            relation_building_ids: [],
                            relation_buildings: [],
                            source: source
                        };
                    }
                }
            } else if (paraType === "company") {
                let itemLength = this.operationObj[paraKey].value.length;
                if (itemLength > 0) {
                    this.operationObj[paraKey].value[itemLength - 1].value.id =
                        para.id + "";
                    this.operationObj[paraKey].value[itemLength - 1].value = {
                        id: para.id + "",
                        text: para.value
                    };
                    this.operationObj[paraKey].value[
                        itemLength - 1
                    ].value.value = para.value;
                    this.operationObj[paraKey].value[itemLength - 1].source = source;
                } else {
                    obj = {
                        value: {
                            id: para.id + "",
                            text: para.value
                        },
                        relation_building_ids: [],
                        relation_buildings: [],
                        source: source
                    };
                }
            } else if (paraType === "fee") {
                // 物业费，水电气
                let itemLength = this.operationObj[paraKey].value.length;
                if (itemLength > 0) {
                    this.operationObj[paraKey].value[itemLength - 1].value =
                        para.value;
                    this.operationObj[paraKey].value[itemLength - 1].source = source;
                } else {
                    obj = {
                        value: para.value,
                        relation_building_ids: [],
                        relation_buildings: [],
                        source: source
                    };
                }
            } else if (paraType === "decorate_info") {
                // 装修情况
                let itemLength = this.operationObj[paraKey].value.length;
                let otherSource = para.type === '1' ? source : '';
                if (itemLength > 0) {
                    this.operationObj[paraKey].value[itemLength - 1].type =
                        para.type + "";
                    this.operationObj[paraKey].value[itemLength - 1].unit =
                        para.unit;
                    this.operationObj[paraKey].value[itemLength - 1].source = source;
                    this.operationObj[paraKey].value[itemLength - 1].fee__source = otherSource;
                    this.operationObj[paraKey].value[itemLength - 1].unit__source = otherSource;
                } else {
                    obj = {
                        fee: "",
                        type: para.type + "",
                        unit: para.unit,
                        relation_building_ids: [],
                        relation_buildings: [],
                        source: source,
                        fee__source: otherSource,
                        unit__source: otherSource
                    };
                }
            }
            // 如果有关联楼栋
            if (para.relation_buildings) {
                // 更新楼栋需要请求接口
                let params = {
                    building_id: para.relation_building_ids
                };
                this.axios
                    .post("/backend-api/project/convert-building", params)
                    .then(res => {
                        if (res.data.code === 0) {
                            let resData = res.data.data;
                            // 组装选中项
                            let arr = [];
                            for (let i = 0; i < resData.length; i++) {
                                arr.push(resData[i].id);
                            }
                            let paraLength = this.operationObj[paraKey].value
                                .length;
                            // 给操作列赋值
                            if (paraLength > 0) {
                                this.operationObj[paraKey].value[
                                    paraLength - 1
                                ].relation_buildings = resData;
                                this.operationObj[paraKey].value[
                                    paraLength - 1
                                ].relation_building_ids = arr;
                            } else {
                                obj.relation_buildings = resData;
                                obj.relation_building_ids = arr;
                                this.operationObj[paraKey].value.push(obj);
                            }
                        } else {
                            if (paraLength > 0) {
                                this.operationObj[paraKey].value[
                                    paraLength - 1
                                ].relation_buildings = [];
                                this.operationObj[paraKey].value[
                                    paraLength - 1
                                ].relation_building_ids = [];
                            } else {
                                obj.relation_buildings = [];
                                obj.relation_building_ids = [];
                                this.operationObj[paraKey].value.push(obj);
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                let paraLength = this.operationObj[paraKey].value.length;
                // 给操作列赋值
                if (paraLength <= 0) {
                    this.operationObj[paraKey].value.push(obj);
                }
            }
            this.operationObj[paraKey].isChange = true;
            this.$nextTick(() => {
                this.calculateHeigth();
            });
        },
        // 检查下拉框中是否有选中值
        matchItem(para, paraArr) {
            let index = paraArr.findIndex(v => {
                return v.id == para;
            });
            return index;
        },
        // 切换选项引起的高度变化监听
        change(paraKey, index) {
            this.operationObj[paraKey].isChange = true;
            // 装修类型切换
            this.operationObj[paraKey].value[index].source = "运营";
            if (this.operationObj[paraKey].value[index].type === '1') {
                this.operationObj[paraKey].value[index].fee__source = "运营";
                this.operationObj[paraKey].value[index].unit__source = "运营";
            }
            this.$nextTick(() => {
                this.calculateHeigth();
            });
        },
        // 重置筛选项
        resetBtn() {
            this.cityId = "";
            this.distriSele = [];
            this.houseTypeSele = [];
            this.saleStatusSele = "";
            this.isOporateSele = "";
            this.houseNameSele = "";
            this.getData(false, "reset");
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
                            "li-" + index
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
        },
        // 搜索表格
        searchTb() {
            // 只要点击过搜索，则没次请求的taskId都是0
            this.taskId = 0;
            this.getData();
            // this.getInfo()
        }
    },
    watch: {
        // 监听搜索城市，实时切换其他联动下拉
        cityId: {
            handler: function(val, oldval) {
                if (this.mountdFlag) {
                    // 切换其他联动下拉
                    this.getDistrict("clear");
                    // 获取业态，修改的时候，默认选中项要保存，除非下拉里面没有当前项
                    this.getType();
                }
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
.el-dialog {
    margin-top: 30vh !important;
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
    min-height: 40px;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    word-break: break-all;
}
.tHead-box .inside-box li > div {
    word-break: break-all;
    min-height: 40px;
}
.tHead-box .inside-box li:last-of-type > div {
    border-bottom: none;
}
.tFixed {
    float: left;
    width: 22%;
}
.tOperate {
    width: 78%;
}
.table-box-wrapper >>> .el-table__fixed-body-wrapper {
    top: 60px !important;
    height: 440px !important;
}
.table-box-wrapper >>> .el-table__body tr.hover-row > td {
    background-color: #fff;
}
.table-box-wrapper >>> .el-table .cell,
.table-box-wrapper >>> .el-table th div {
    padding-right: 0;
    padding-left: 0;
}
.table-box-wrapper >>> .el-table td,
.table-box-wrapper >>> .el-table th {
    padding: 0;
}
.table-box-wrapper >>> .el-table th {
    /*border-right: 1px solid #ebeef5;*/
    height: 60px;
    padding: 10px;
    box-sizing: border-box;
}
/* 样式 */
.content-main {
    padding: 0 15px;
}
.form-table-box {
    background-color: #fff;
}
.form-table-box
    >>> .table-box-wrapper
    .el-table
    .el-table__header-wrapper
    thead
    th {
    /*min-width: 244px !important;*/
}
.form-table-box >>> .el-table th {
    background-color: #f4f6f9;
}
.form-table-box
    >>> .table-box-wrapper
    .el-table
    .el-table__header-wrapper
    thead
    th:first-of-type {
    min-width: 438px !important;
}
.form-table-box .btn-area {
    margin-top: 20px;
}
.order-search {
    overflow: hidden;
}
.order-search >>> .el-select {
    width: 100%;
}
.huilding-compare-box .order-search >>> .el-select {
    height: 40px;
}
.huilding-compare-box .order-search >>> .el-select .el-select__tags {
    height: 24px;
    overflow: hidden;
    flex-wrap: nowrap;
}
.huilding-compare-box .order-search >>> .el-select .el-tag {
    margin: 0 0 0 3px;
}
.huilding-compare-box .order-search .s-query .td {
    height: 40px;
}
.order-search >>> .el-select .el-input__inner {
    height: 40px !important; /*在safari有用*/
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
}
.tb-box {
    padding: 10px;
    box-sizing: border-box;
}
.full-height {
    height: 100%;
}
.number-input-box {
    display: inline-block;
     width: 90%;
}
.color-blue {
    color: #2846f5;
}
.tb-box .change-box {
    cursor: pointer;
}
.tb-box .color-blue {
    color: #2846f5;
}
.bg-yellow {
    background-color: #fff8a6;
}
.td-operate-box {
    cursor: pointer;
}
.bg-red {
    background-color: #ffd19a;
}
.title-wrap-box {
    height: 100%;
}
.tap-toggle {
    float: right;
    margin-top: 10px;
}
.sell-content {
    height: 150px !important;
    overflow-y: auto;
}
.sell-content h3 {
    color: #666;
}
</style>
<style lang="less" scoped>
.v-table {
    .hd {
        border-bottom: none;
        line-height: 50px;
        margin-bottom: 0;
    }
}
.table-box-wrapper {
    /deep/ .el-row {
        padding: 0 10px;
        .el-col-title {
            width: 100%;
            font-size: 15px;
            font-weight: bold;
            color: #000;
            margin-top: 10px;
            .td-operate-box {
                color: #33a1ff;
                margin-left: 20px;
                font-weight: bold;
            }
        }
        .el-col-link {
            width: 100%;
            line-height: 34px;
            font-size: 14px;
            .col-link-th {
                float: left;
            }
            .col-link-td {
                overflow: hidden;
                padding-left: 10px;
                box-sizing: border-box;
                & > li {
                    float: left;
                    cursor: pointer;
                    line-height: 34px;
                    margin-right: 10px;
                    &.is-task {
                        color: #33a1ff;
                    }
                    &.no-task {
                        color: #aaa;
                    }
                }
            }
        }
    }
    .table-box-row {
        margin: 10px 10px 0 10px;
        border-top: 1px solid #ebeef5;
        border-left: 1px solid #ebeef5;
        .tHead-box {
            .operate-area {
                height: 100%;
            }
            .concant-box {
                margin-right: 8px;
            }
            .add-link {
                color: #33a1ff;
                cursor: pointer;
            }
            /deep/ .el-input__inner {
                height: 34px;
                line-height: 34px;
            }
            /deep/ .el-select {
                height: 34px;
                width: 100%;
                .el-select__tags {
                    height: 24px;
                    overflow: hidden;
                }
                .el-tag {
                    margin: 0 0 0 3px;
                }
                .el-input__inner {
                    height: 34px;
                    line-height: 34px;
                }
                .el-input__icon {
                    line-height: 34px;
                }
            }
            .float-item {
                .float-item-number {
                    width: 100%;
                }
            }
            .float-item-box {
                & > div {
                    &:after {
                        content: ".";
                        clear: both;
                        height: 0;
                        overflow: hidden;
                        visibility: hidden;
                        display: block;
                    }
                    /*overflow: hidden;*/
                    &.item-box-wrapper {
                        .float-item {
                            float: left;
                            margin-right: 6px;
                            width: 47%;
                            &:last-of-type {
                                margin-right: 0;
                            }
                        }
                    }
                    &.all-price-box {
                        .float-item {
                            float: left;
                            margin-right: 6px;
                            width: 30%;
                            &:first-of-type {
                                width: 34%;
                            }
                            &:last-of-type {
                                margin-right: 0;
                            }
                        }
                    }
                    .associated-building-box {
                        margin-bottom: 10px;
                        padding: 0 10px 10px 10px;
                        border-bottom: 1px solid #ebeef5;
                        height: 101px;
                        &:last-of-type {
                            margin-bottom: 0;
                            border-bottom: none;
                            height: 100px;
                        }
                        &:first-of-type {
                            height: 136px;
                            .iconguanbi {
                                margin-top: 35px;
                            }
                        }
                        .iconguanbi {
                            float: right;
                            font-size: 14px;
                            color: #ff0000;
                            line-height: 34px;
                            cursor: pointer;
                        }
                        .input-area {
                            &:after {
                                content: ".";
                                clear: both;
                                height: 0;
                                overflow: hidden;
                                visibility: hidden;
                                display: block;
                            }
                            .float-item {
                                float: left;
                                margin-right: 6px;
                                width: 23%;
                                &:last-of-type {
                                    width: 48%;
                                    margin-right: 0;
                                }
                                &:first-of-type {
                                    width: 20%;
                                }
                                .float-item-tit {
                                    color: #999;
                                    font-size: 12px;
                                    line-height: 30px;
                                    margin-bottom: 5px;
                                }
                                /deep/ .el-select {
                                    height: 34px;
                                    width: 100%;
                                    .el-select__tags {
                                        height: 24px;
                                        overflow: hidden;
                                        flex-wrap: nowrap;
                                    }
                                    .el-tag {
                                        margin: 0 0 0 3px;
                                    }
                                    .el-input__inner {
                                        padding: 0 5px;
                                    }
                                }
                            }
                        }
                    }
                    &.associated-building-link {
                        border-top: 1px solid #ebeef5;
                        padding: 0 10px;
                        color: #33a1ff;
                        a {
                            color: #33a1ff;
                        }
                        .like-a {
                            color: #33a1ff;
                            cursor: pointer;
                        }
                        .change-box {
                            cursor: pointer;
                            margin-right: 8px;
                        }
                    }
                    &.no-border {
                        border-top: none;
                    }
                    .receive_room-box {
                        .input-area {
                            &:after {
                                content: ".";
                                clear: both;
                                height: 0;
                                overflow: hidden;
                                visibility: hidden;
                                display: block;
                            }
                            .float-item {
                                float: left;
                                margin-right: 6px;
                                width: 30%;
                                &:last-of-type {
                                    width: 38%;
                                    margin-right: 0;
                                }
                                &:first-of-type {
                                    width: 22%;
                                }
                                /deep/.el-input__inner {
                                    padding: 0 5px;
                                }
                                .date-box-cancat {
                                    overflow: hidden;
                                    cursor: pointer;
                                    color: #33a1ff;
                                    /deep/.wrap-box {
                                        padding-top: 0;
                                        .select-input {
                                            width: 100%;
                                        }
                                    }
                                    .date-box-item {
                                        float: left;
                                        font-size: 12px;
                                        font-weight: bold;
                                        line-height: 34px;
                                    }
                                }
                            }
                        }
                    }
                    &.same-box-wrapper {
                        margin-bottom: 10px;
                        &:last-of-type {
                            margin-bottom: 0;
                        }
                        &:first-of-type {
                            .iconguanbi {
                                margin-top: 35px;
                            }
                        }
                        .iconguanbi {
                            float: right;
                            font-size: 14px;
                            color: #ff0000;
                            line-height: 34px;
                            cursor: pointer;
                        }
                        .input-area {
                            &:after {
                                content: ".";
                                clear: both;
                                height: 0;
                                overflow: hidden;
                                visibility: hidden;
                                display: block;
                            }
                            .float-item {
                                float: left;
                                margin-right: 6px;
                                width: 23%;
                                &:last-of-type {
                                    width: 48%;
                                    margin-right: 0;
                                }
                                &:first-of-type {
                                    width: 18%;
                                }
                                .float-item-tit {
                                    color: #999;
                                    font-size: 12px;
                                    line-height: 30px;
                                    margin-bottom: 5px;
                                }
                                /deep/ .el-select {
                                    height: 34px;
                                    width: 100%;
                                    .el-select__tags {
                                        height: 24px;
                                        overflow: hidden;
                                        flex-wrap: nowrap;
                                    }
                                    .el-tag {
                                        margin: 0 0 0 3px;
                                    }
                                    .el-input__inner {
                                        padding: 0 5px;
                                    }
                                }
                            }
                        }
                    }
                    &.add-info-link {
                        color: #33a1ff;
                    }
                    &.phase-box-wrapper {
                        .input-area {
                            &:after {
                                content: ".";
                                clear: both;
                                height: 0;
                                overflow: hidden;
                                visibility: hidden;
                                display: block;
                            }
                            .float-item {
                                float: left;
                                margin-right: 6px;
                                &:last-of-type {
                                    width: 70%;
                                    margin-right: 0;
                                }
                                &:first-of-type {
                                    width: 20%;
                                }
                            }
                        }
                    }
                    .decorate-box-wrapper {
                        margin-bottom: 10px;
                        &:last-of-type {
                            margin-bottom: 0;
                        }
                        .iconguanbi {
                            float: right;
                            font-size: 14px;
                            color: #ff0000;
                            line-height: 34px;
                            cursor: pointer;
                            margin-top: 35px;
                        }
                        .input-area {
                            &:after {
                                content: ".";
                                clear: both;
                                height: 0;
                                overflow: hidden;
                                visibility: hidden;
                                display: block;
                            }
                            .float-item {
                                float: left;
                                margin-right: 6px;
                                width: 45%;
                                &:last-of-type {
                                    width: 45%;
                                    margin-right: 0;
                                }
                                &:first-of-type {
                                    width: 45%;
                                }
                            }
                        }
                        .float-item-tit {
                            color: #999;
                            font-size: 12px;
                            line-height: 30px;
                            margin-bottom: 5px;
                        }
                        /deep/ .el-select {
                            height: 34px;
                            width: 100%;
                            .el-select__tags {
                                height: 24px;
                                overflow: hidden;
                                flex-wrap: nowrap;
                            }
                            .el-tag {
                                margin: 0 0 0 3px;
                            }
                            .el-input__inner {
                                padding: 0 5px;
                            }
                        }
                    }
                    &.property-box-wrapper {
                        .input-area {
                            &:after {
                                content: ".";
                                clear: both;
                                height: 0;
                                overflow: hidden;
                                visibility: hidden;
                                display: block;
                            }
                            .float-item {
                                float: left;
                                margin-right: 6px;
                                &:last-of-type {
                                    width: 51%;
                                    margin-right: 0;
                                }
                                &:first-of-type {
                                    width: 40%;
                                }
                                /deep/.el-input__inner {
                                    padding: 0 5px;
                                }
                            }
                        }
                    }
                    &.label-box-wrapper {
                        .label-radio-box {
                            /deep/.el-radio {
                                margin: 0 10px 10px 0;
                                .el-radio__label {
                                    padding-left: 4px;
                                    color: #888;
                                }
                            }
                            /deep/.el-checkbox {
                                margin: 0 10px 10px 0;
                                .el-checkbox__label {
                                    padding-left: 4px;
                                    color: #888;
                                }
                            }
                            .choose-box-tit {
                                color: #999;
                                font-size: 12px;
                                line-height: 30px;
                                margin-bottom: 5px;
                            }
                        }
                    }
                }
            }
            .info-box {
                .name-box-link {
                    float: right;
                    margin-left: 10px;
                    line-height: 34px;
                    a {
                        color: #33a1ff;
                        cursor: pointer;
                    }
                    .like-a {
                        color: #33a1ff;
                        cursor: pointer;
                    }
                }
                .name-box {
                    overflow: hidden;
                }
            }
        }
        .tHead-box {
            .stage-box {
                padding-top: 35px;
                box-sizing: border-box;
                .array-box {
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ebeef5;
                    padding: 0 10px 10px 10px;
                    &:last-of-type {
                        margin-bottom: 0;
                        border-bottom: none;
                    }
                    .item-cont-box {
                        .item-height {
                            height: 90px;
                            overflow-y: auto;
                        }
                    }
                }
            }
            .other-box {
                .array-box {
                    margin-bottom: 10px;
                    &:last-of-type {
                        margin-bottom: 0;
                    }
                }
            }
            .muti-box {
                .array-box {
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ebeef5;
                    padding: 0 10px 10px 10px;
                    &:last-of-type {
                        margin-bottom: 0;
                        border-bottom: 1px solid #ebeef5;
                    }
                }
                .stage-box {
                    .no-border-bottom {
                        border-bottom: none;
                    }
                }
            }
            .item-cont-box {
                height: 90px;
                overflow-y: auto;
            }
            .time-box {
                font-size: 0;
                .concant-box {
                    font-size: 14px;
                }
                .house-concant-box {
                    margin-left: 8px;
                }
                .date-box {
                    margin-right: 0;
                }
            }
            .other-box {
                padding: 0 10px;
                box-sizing: border-box;
            }
            .no-border {
                border-top: none;
            }
        }
        .big-data-box {
            .tb-box {
                overflow: hidden;
            }
            .concant-box {
                float: left;
            }
        }
    }
}
</style>
