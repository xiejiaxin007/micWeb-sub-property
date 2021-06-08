<template>
  <div class="el-row huilding-compare-box">
    <el-col :span="24" class="content-main">
      <!--面包屑-->
      <el-breadcrumb class="bread-crumb-box" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="/index.php?r=cj-project-task/unfinished-task">任务列表页</a></el-breadcrumb-item>
        <el-breadcrumb-item>楼栋信息对比</el-breadcrumb-item>
      </el-breadcrumb>
      <!--搜索区域-->
      <div class="v-box form-table-box">
        <div class="hd">
          <h2>搜索条件</h2>
          <!-- 展示隐藏按钮 -->
          <el-button
            type="text"
            class="tap-toggle"
            @click="searchsIsShow">
            点击后可{{isShowText}}搜索条件
          </el-button>
        </div>
        <div class="bd" v-show="serchIsShow">
          <div class="order-search">
            <ul class="s-query">
              <li>
                <div class="th">城市：</div>
                <div class="td">
                  <el-select v-model="cityId" placeholder="请选择">
                    <el-option
                      v-for="item in cityList"
                      :key="item.id"
                      :label="item.text"
                      :value="item.id+''">
                    </el-option>
                  </el-select>
                </div>
              </li>
              <li>
                <div class="th">区域：</div>
                <div class="td">
                  <el-select v-model="distriSele"  multiple collapse-tags placeholder="请选择区域">
                    <el-option
                      v-for="item in distriOptions"
                      :key="item.id"
                      :label="item.text"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </li>
              <li>
                <div class="th">业态：</div>
                <div class="td">
                  <el-select v-model="houseTypeSele"  multiple collapse-tags placeholder="请选择业态" >
                    <el-option
                      v-for="item in houseTypeOptions"
                      :key="item.id"
                      :label="item.text"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </li>
              <li>
                <div class="th">销售状态：</div>
                <div class="td">
                  <el-select v-model="saleStatusSele" placeholder="请选择销售状态">
                    <el-option
                      v-for="item in searchStatusOptions"
                      :key="item.id"
                      :label="item.text"
                      :value="item.id+''">
                    </el-option>
                  </el-select>
                </div>
              </li>
              <li>
                <div class="th">是否合作：</div>
                <div class="td">
                  <el-select v-model="isOporateSele" >
                    <el-option
                      v-for="item in isOporateOptions"
                      :key="item.id"
                      :label="item.text"
                      :value="item.id+''">
                    </el-option>
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
                    @select="affirmHouse">
                  </el-autocomplete>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-area">
            <el-button @click="resetBtn">重置</el-button>
            <el-button type="primary" @click="searchData">搜索</el-button>
          </div>
        </div>
      </div>
      <!--表格展示区域-->
      <div class="v-box form-table-box v-table">
        <div class="hd">
        </div>
        <div class="bd">
          <div class="table-box-wrapper">
            <!--表格汇总信息展示-->
            <div class="el-row tab-info">
              <div class="el-col-title">当前符合条件{{projectInfo.total_num}}个楼盘，当前楼盘：{{projectInfo.project_name}} <span class="next-project" @click="nextProject">下一个楼盘</span></div>
              <div class="el-col-link">
                <div class="col-link-th">该楼盘其余模块也存在任务：</div>
                <ul class="col-link-td">
                  <li :class="{'is-task': task.is_task, 'no-task': !task.is_task}" v-for="(task, taskIndex) in taskList" :key="'taskIndex-' + taskIndex"  @click="skipTask(task)">{{task.title}}</li>
                </ul>
              </div>
              <div class='el-col-type'>
                 <ul ref='houseType'>
                  <li :class="{'active': currentHouseId==task.building_id ,'is-task': task.is_task, 'no-task': !task.is_task }" v-for="(task, taskIndex) in houseTypeList" :key="'taskIndex-' + taskIndex" @click="changeHouId(task)">{{task.title}}</li>
                </ul>
                <div v-if="houseTypeList.length>20">
                  <span @click="editHouseType(1)" v-if="isShowOpen==true"> <i class="iconfont icon-xialajiantou" aria-hidden="true"></i> 展开</span>
                  <span @click="editHouseType(2)" v-else><i class="iconfont icontop-triangle" aria-hidden="true"></i>收起</span>
                </div>
              </div>
              <div class="matchup">
                <div>如需更换楼栋对应关系，请点击<span calss="skipUrl" @click="leaveChange">此处前往更换</span></div>
                <div @click="upDataTab" class='up-data'>已经更换完毕后请点击此处刷新页面系统将重新计算</div>
              </div>
            </div>
            <div class="table-box-row">
              <!--表格-->
              <el-table
                v-loading="tablebLoading"
                :data="[1]"
                :header-cell-style="{background:'#f4f6f9'}"
              >
                <el-table-column fixed min-width="438" label="居理" :resizable="false">
                  <template slot-scope="scope">
                    <ul class="tHead-box tFixed fixed-th" v-if="scope.$index === 0">
                      <li v-for="(itemval, itemKey, thIndex) in titleList" :key="'item-tit-' + thIndex">
                        <div v-if="!upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class='box-inner' :class="itemval.is_diff_julive==true ? 'add-tag' : ''">
                            {{itemval.value}}
                          </div>
                        </div>
                      </li>
                      <li v-for="(itemval, itemKey, thIndex) in titleList" :key="'item-tit-height-' + thIndex">
                        <div v-if="upHeight" :class="'li-' + thIndex">
                          <div class='box-inner' :class="itemval.is_diff_julive==true ? 'add-tag' : ''">
                            {{itemval.value}}
                          </div>
                        </div>
                      </li>
                    </ul>
                    <ul class="tHead-box tFixed fixed-td" v-if="scope.$index === 0">
                      <li v-for="(itemVal, itemKey, thIndex) in operationObj" :key="'item-op-' + thIndex">
                        <!--楼栋名称-->
                        <div v-if="itemKey === 'building_name' && !upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class="box-inner house_wrap" :class="{'is-diff' : itemVal.is_diff_julive}">
                            <el-input v-model="itemVal.value"  @change="edit(itemKey)" maxlength="10"></el-input>
                            <span
                              class="skip"
                              @click="turnToPage"
                            >进入编辑页</span>
                          </div>
                        </div>
                        <!-- 销售状态 -->
                        <div v-else-if="itemKey === 'saling_status' && !upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class='box-inner' :class="{'is-diff' : itemVal.is_diff_julive}"  >
                            <el-select v-model="itemVal.value" placeholder="请选择" @change="edit(itemKey)" :popper-append-to-body='false'>
                              <el-option
                                v-for="item in saleStatusOptions"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                        <!-- 建筑类型-->
                        <div v-else-if="itemKey === 'building_type' && !upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class='box-inner' :class="{'is-diff' : itemVal.is_diff_julive}">
                            <el-select v-model="itemVal.value" placeholder="请选择" @change="edit(itemKey)" :popper-append-to-body='false'>
                              <el-option
                                v-for="item in buildType"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                        <!-- 地上层数 总户数 单元数-->
                        <div v-else-if="(itemKey === 'above_floor_num' || itemKey === 'total_house_num' || itemKey === 'unit_num') && !upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class="box-inner" :class="{'is-diff' : itemVal.is_diff_julive}">
                            <el-input v-model="itemVal.value" oninput="value=value.replace(/[^0-9]/g,'')"  @change="edit(itemKey)"></el-input>
                          </div>
                        </div>
                        <!-- 梯户比 -->
                        <div v-else-if="itemKey === 'ladder_ratio' && !upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class="box-inner" :class="{'is-diff' : itemVal.is_diff_julive}">
                            <el-input v-model="itemVal.value" @change="edit(itemKey)" maxlength="20"></el-input>
                          </div>
                        </div>
                        <!-- 关联户型-->
                        <div v-else-if="itemKey === 'relation_houses' && !upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class="box-inner" :class="{'is-diff' : itemVal.is_diff_julive}">
                            <el-select
                              value-key="id"
                              @change="edit(itemKey)"
                              @focus="focusSelect"
                              v-model="value"
                              multiple
                              filterable
                              remote
                              reserve-keyword
                              placeholder="关联户型"
                              :remote-method="remoteMethod"
                              :loading="loading">
                              <el-option
                                v-for="(item,index) in options"
                                :key="index"
                                :label="item.text"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                        <!-- 楼座图-->
                        <div v-else-if="itemKey === 'building_img' && !upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class="box-inner" :class="{'is-diff' : itemVal.is_diff_julive}">
                            <div class="img-wrap" v-if="itemVal.value.show_url!='' && !(itemVal.value instanceof Array)">
                              <img :src="itemVal.value.show_url" @click="openImg(itemVal.value)" alt="图片">
                            </div>
                            <span class="add-dot" v-if="(JSON.stringify(itemVal.value) !== '[]') && itemVal.value.point_count !== '' ">存在{{itemVal.value.point_count}}个打点信息</span>
                          </div>
                        </div>
                        <div v-else-if="!upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class="box-inner" :class="{'is-diff' : itemVal.is_diff_julive}">
                            {{operationObj[itemKey].value}}
                          </div>
                        </div>
                      </li>
                      <li v-for="(itemVal, itemKey, thIndex) in operationObj" :key="'item-op-height-' + thIndex">
                        <!--楼栋名称-->
                        <div v-if="itemKey === 'building_name' && upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class="box-inner" :class="{'is-diff' : itemVal.is_diff_julive}">
                            <el-input v-model="itemVal.value"></el-input>
                          </div>
                        </div>
                        <!-- 销售状态 -->
                        <div v-else-if="itemKey === 'saling_status' && upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class='box-inner' :class="{'is-diff' : itemVal.is_diff_julive}">
                            <el-select v-model="itemVal.value" placeholder="请选择" :popper-append-to-body='false'>
                              <el-option
                                v-for="item in saleStatusOptions"
                                :key="item ? item.id : ''"
                                :label="item ? item.text : ''"
                                :value="item ? item.id+'' : ''">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                        <!-- 建筑类型 -->
                        <div v-else-if="itemKey === 'building_type' && upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class='box-inner' :class="{'is-diff' : itemVal.is_diff_julive}">
                            <el-select v-model="itemVal.value" placeholder="请选择" :popper-append-to-body='false'>
                              <el-option
                                v-for="item in buildType"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                        <!-- 地上层数 总户数 单元数 -->
                        <div v-else-if="(itemKey === 'above_floor_num' || itemKey === 'total_house_num' || itemKey === 'unit_num') && upHeight" :class="'li-' + thIndex">
                          <div class="box-inner" :class="{'is-diff' : itemVal.is_diff_julive}">
                            <el-input v-model="itemVal.value" oninput="value=value.replace(/[^0-9]/g,'')" max='999'></el-input>
                          </div>
                        </div>
                        <!-- 梯户比 -->
                        <div v-else-if="itemKey === 'ladder_ratio' && upHeight" :class="'li-' + thIndex">
                          <div class="box-inner" :class="{'is-diff' : itemVal.is_diff_julive}">
                            <el-input v-model="itemVal.value" maxlength="20"></el-input>
                          </div>
                        </div>
                        <!-- 关联户型 relation_houses -->
                        <div v-else-if="itemKey === 'relation_houses' && upHeight" :class="'li-' + thIndex">
                          <div class="box-inner" :class="{'is-diff' : itemVal.is_diff_julive}">
                            <el-select
                              value-key="id"
                              @focus="focusSelect"
                              v-model="value"
                              multiple
                              filterable
                              remote
                              reserve-keyword
                              placeholder="关联户型"
                              :remote-method="remoteMethod"
                              :loading="loading">
                              <el-option
                                v-for="(item,index) in options"
                                :key="index"
                                :label="item.text"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                        <!-- 楼座图-->
                        <div v-else-if="itemKey === 'building_img' && upHeight" :class="'li-' + thIndex">
                          <div class="box-inner" :class="{'is-diff' : itemVal.is_diff_julive}">
                            <div class="img-wrap" v-if="itemVal.value.show_url!=''">
                              <img :src="itemVal.value.show_url" @click="openImg(itemVal.value)" alt="图片">
                            </div>
                            <span class="add-dot" v-if="(JSON.stringify(itemVal.value) !== '[]') && itemVal.value.point_count !== '' ">存在{{itemVal.value.point_count}}个打点信息</span>
                          </div>
                        </div>
                        <div v-else-if="upHeight" :class="'li-' + thIndex">
                          <div class="box-inner" :class="{'is-diff' : itemVal.is_diff_julive}">
                            {{operationObj[itemKey].value}}
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
                  :label="items.source"
                  :resizable="false">
                  <template slot="header" v-if="items">
                    <div class="project-tit">
                      {{items.source_name}} <span class='delete-info' @click="removeHouseInfo(items)">移除</span>
                    </div>
                  </template>
                  <template slot-scope="scope"  v-if="items">
                    <ul class="tHead-box" v-if="scope.$index === 0">
                      <li v-for="(itemVal, itemKey, objIndex) in items.field_data" :key="'item-source-' + objIndex" >
                        <!-- 楼栋名称 -->
                        <div v-if="itemKey === 'building_name' && !upHeight" :style="'height:'+ maxHeight[objIndex] + 'px'" :class="'li-' + objIndex">
                          <div class="box-inner" :class="{'error' : itemVal.is_diff_julive==true}">
                            <span class="build-name"  @click="choosenItem(items.field_data[itemKey], itemKey, 'editUrl', items.source_name)">
                              {{itemVal.value}}
                            </span>
                          </div>
                        </div>
                        <!-- 关联户型 -->
                        <div v-else-if="itemKey === 'relation_houses' && !upHeight" :style="'height:'+ maxHeight[objIndex] + 'px'" :class="'mergeTd li-' + objIndex">
                          <div class="box-inner" :class="{'error' : itemVal.is_diff_julive==true}">
                            <span class="build-name" v-for="(val,index) in itemVal.value" :key="'build-'+index">
                              {{val.house_type_num}}
                            </span>
                          </div>
                        </div>
                        <!-- 销售状态 建筑类型-->
                        <div v-else-if="(itemKey === 'saling_status' || itemKey === 'building_type') && !upHeight" :style="'height:'+ maxHeight[objIndex] + 'px'" :class="'li-' + objIndex">
                          <div class="box-inner" :class="{'error' : itemVal.is_diff_julive==true}">
                            <span @click="choosenItem(items.field_data[itemKey], itemKey, 'string', items.source_name)">
                              {{itemVal.text}}
                            </span>
                          </div>
                        </div>
                        <!-- 楼座图 -->
                        <div v-else-if="itemKey === 'building_img' && !upHeight" :style="'height:'+ maxHeight[objIndex] + 'px'" :class="'li-' + objIndex">
                          <div class="box-inner" :class="{'error' : itemVal.is_diff_julive==true}">
                            <div class="img-wrap" v-if="itemVal.value.show_url!=''"  @click="choosenItem(items.field_data[itemKey], itemKey, 'buildImg', items.source_name)">
                              <img :src="itemVal.value.show_url" alt="图片">
                            </div>
                          </div>
                        </div>
                        <div v-else-if="!upHeight" :style="'height:'+ maxHeight[objIndex] + 'px'" :class="'li-' + objIndex" >
                          <div class='box-inner' :class="{'error' : itemVal.is_diff_julive==true}">
                            <span  @click="choosenItem(items.field_data[itemKey], itemKey, 'string', items.source_name)" :class="{'build-name': itemKey== 'unit_num'}">{{itemVal.value}}</span>
                          </div>
                        </div>
                      </li>
                      <li v-for="(itemVal, itemKey, objIndex) in items.field_data" :key="'item-source-height-' + objIndex" :class="'li-' + objIndex">
                        <!-- 楼栋名称 -->
                        <div v-if="itemKey === 'building_name' && upHeight" :class="'li-' + objIndex">
                          <div class="box-inner">
                            <span class="build-name">
                              {{itemVal.value}}
                            </span>
                          </div>
                        </div>
                        <!-- 关联户型 -->
                        <div v-else-if="itemKey === 'relation_houses' && upHeight" :class="'mergeTd li-' + objIndex">
                          <div class="box-inner">
                            <span class="build-name" v-for="(val,index) in itemVal.value" :key="'build-'+index">
                              {{val.house_type_num}}
                            </span>
                          </div>
                        </div>
                        <!-- 销售状态 -->
                        <div v-else-if="(itemKey === 'saling_status' || itemKey === 'building_type') && upHeight" :class="'li-' + objIndex">
                          <div class="box-inner">
                            <span @click="choosenItem(items.field_data[itemKey], itemKey, 'string', items.source_name)">
                              {{itemVal.text}}
                            </span>
                          </div>
                        </div>
                        <!-- 楼座图 -->
                        <div v-else-if="itemKey === 'building_img' && upHeight" :class="'li-' + objIndex">
                          <div class="box-inner">
                            <div class="img-wrap" v-if="itemVal.value.show_url!=''"   @click="choosenItem(items.field_data[itemKey], itemKey, 'buildImg', items.source_name)">
                              <img :src="itemVal.value.show_url" alt="图片">
                            </div>
                          </div>
                        </div>
                        <div v-else-if="upHeight" :class="'li-' + objIndex">
                          <div class='box-inner'>
                            <span @click="choosenItem(items.field_data[itemKey], itemKey, 'string', items.source_name)" :class="{'build-name': itemKey== 'unit_num'}">{{itemVal.value}}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </template>
                </el-table-column>
                <!-- 大数据列 -->
                <el-table-column
                  v-if="bigData.building_name && bigData.building_name.length>0"
                  min-width="250"
                  label="大数据"
                  :resizable="false">
                  <template slot-scope="scope">
                    <ul class="tHead-box" v-if="scope.$index === 0">
                      <li v-for="(itemval, itemKey, thIndex) in titleList" :key="'item-source-' + thIndex" >
                        <div v-if="!upHeight && itemKey=='building_name'" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex">
                          <div class='box-inner'>
                            <span v-for="(acr,ind) in bigData.building_name" :key="ind">
                              <a :href="acr.location_url" target="_blank" @click="setTrack('4830')">{{acr.value}}</a>
                            </span>
                          </div>
                        </div>
                        <div v-else-if="!upHeight" :style="'height:'+ maxHeight[thIndex] + 'px'" :class="'li-' + thIndex"><div class='box-inner'></div></div>
                      </li>
                      <li v-for="(itemval, itemKey, thIndex) in titleList" :key="'item-' + thIndex" >
                        <div v-if="upHeight && itemKey=='building_name'" :class="'li-' + thIndex">
                          <div class='box-inner'>
                            <span v-for="(acr,ind) in bigData.building_name" :key="ind">
                              <a :href="acr.location_url" target="_blank">{{acr.value}}</a>
                            </span>
                          </div>
                        </div>
                        <div v-else-if="upHeight" :class="'li-' + thIndex"><div class='box-inner'></div></div>
                      </li>
                    </ul>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="sign-wrap" v-if="isShowSign">
              <span><el-checkbox v-model="signFlag">标记为不是该楼盘业态的楼栋</el-checkbox></span>
            </div>
          </div>
          <!-- 提交保存区域 -->
          <div class="btn-wrap">
            <el-button class="show-gallary-btn" @click="skipToTaskList">取消</el-button>
            <el-button class="show-gallary-btn" type="primary" @click="saveData()">保存</el-button>
            <el-button class="show-gallary-btn" type="primary" @click="saveData('nextTask')">保存并进行下一个任务</el-button>
          </div>
          <!-- 切换户型时 保存提醒 -->
          <el-dialog
            :visible.sync="saveWarn"
            title="保存提醒"
            width="30%"
            :center=true
          >
            <div class="dialog-content">
              <p class="content-tex save-warn-tex">该页面信息已经被编辑了，是否保存当前内容！</p>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="notSaveSkip('house')">不保存进行跳转</el-button>
              <el-button type="primary" @click="saveSkip('house')">保存进行跳转</el-button>
            </div>
          </el-dialog>
          <!-- 点击任务时 保存提醒 -->
          <el-dialog
            :visible.sync="saveTaskWarn"
            title="保存提醒"
            width="30%"
            :center=true
          >
            <div class="dialog-content">
              <p class="content-tex save-warn-tex">该页面信息已经被编辑了，是否保存当前内容！</p>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="notSaveSkip('task')">不保存进行跳转</el-button>
              <el-button type="primary" @click="saveSkip('task')">保存进行跳转</el-button>
            </div>
          </el-dialog>
        <!-- 下一个楼盘 保存提醒 -->
        <el-dialog
          :visible.sync="saveNextWarn"
          title="保存提醒"
          width="30%"
          :center=true
        >
          <div class="dialog-content">
            <p class="content-tex save-warn-tex">该页面信息已经被编辑了，是否保存当前内容！</p>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="notSaveSkip('next')">不保存进行跳转</el-button>
            <el-button type="primary" @click="saveSkip('next')">保存进行跳转</el-button>
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
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" class="single" @click="skipToTaskList">点击前往任务列表页</el-button>
            </div>
          </el-dialog>
          <!--移除异常提示-->
          <el-dialog
            :visible.sync="dialogVisibleRemoveAbnormal"
            :title.sync="dialogTitleRemoveAbnormal"
            width="30%"
            :center=true
          >
            <div class="dialog-content">
              <p class="content-tex remove-abnormal-tex">{{dialogContentRemoveAbnormal}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisibleRemoveAbnormal=false"  class="single">知道了！</el-button>
            </div>
          </el-dialog>
          <!--更换楼座图提示 始-->
          <el-dialog
            :visible.sync="dialogVisibleChangeBalcony"
            :title.sync="dialogTitleChangeBalcony"
            width="30%"
            :center=true
          >
            <div class="dialog-content">
              <p class="content-tex change-balcony-tex">{{dialogContentChangeBalcony}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisibleChangeBalcony = false">不更换</el-button>
              <el-button type="primary" @click="changeBalcony">更换</el-button>
            </div>
          </el-dialog>
          <!-- 移除异常 源数据被移除完之后 -->
          
          <el-dialog
            :visible.sync="isRemoveDialog"
            title="移除异常提示"
            width="30%"
            :center=true
          >
            <div class="dialog-content">
              <p class="content-tex save-warn-tex">啊哦！全部都被移除咯！好像没有什么可操作的啦，请在下方先点击去匹配下楼栋，再刷新页面进行操作</p>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="isRemoveDialog=false"  class="single">知道了！</el-button>
            </div>
          </el-dialog>
          <!--售罄\待售楼盘错误提示 始-->
            <el-dialog
                :visible.sync="dialogVisibleSellOut"
                :title.sync="dialogTitleSellOut"
                width="30%"
                :center="true"
                :show-close = "false"
            >
                <div class="dialog-content">
                    <p class="content-tex on-sale-tex">{{dialogContentSellOut}}<span v-if="sellOutBuildingName">，</span>
                        <a
                            class="click-see"
                            target="_blank"
                            @click="clickBuildName"
                        >{{sellOutBuildingName}}</a>
                    </p>
                </div>
                <div
                    slot="footer"
                    class="dialog-footer"
                >
                    <el-button
                        type="primary"
                        @click="closeDialogSellOut"
                        class="single"
                    >确认</el-button>
                </div>
            </el-dialog>
            <!--售罄\待售楼盘错误提示 止-->
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
import merge from 'webpack-merge'
import { setTimeout } from 'timers'
import { commonFun } from '@/assets/js/utils/utils'
import { getInfoByProjectId } from './utils/index.js';
import api from './api/common.js';
export default {
  name: 'building-houseInfoContrast',
  data () {
    return {
      // 搜索框是否隐藏
      serchIsShow: true,
      // 是否展示/隐藏文案
      isShowText: '隐藏',
      isShowSign: false, // 是否展示标记选项 新增报错时展示
      signFlag: false, // 是否标识为非该楼盘的
      isFirst: true, // 是否第一次请求
      baseTaskInfo: {}, // 任务信息 切换时使用
      baseId: '', // 楼栋id 切换楼栋时使用
      isRemove: false, // 是否操作过移除
      proType: '', // 楼盘中的业态
      isTask: true, // 默认是task纬度
      buildImg: {}, // 楼座图信息
      currentTurn: {},
      saveTaskWarn: false, // 切换任务时 保存弹窗
      saveNextWarn: false, // 点击下一个楼盘 保存弹窗
      bigData: {}, // 大数据
      isShowOpen: false, // 是否有展开
      tablebLoading: false, // 表格加载中
      buildUrl: '', // 楼座图url
      isNext: '',
      paramArr: {}, // 参数信息
      nextProjectType: '', // 是否点击过搜索
      saveWarn: false, // 保存提醒
      isHasEdit: false, // 是否编辑过
      isFir: true, //  第一次进入页面
      currProjectId: '', // 当前任务居理楼盘id
      taskId: '', // 任务id
      taskInfo: {}, // 任务信息
      isFirAdd: true, // 第一次点击源中户型
      focusIndex: 0, // 关联楼栋是fouce否第一次触发
      value: [], // 左侧居理户型信息
      options: [], // 楼栋选项
      loading: false, // 关联楼栋
      buildObj: {}, // 搜索楼盘信息  id和text
      searchBuildObj: {}, // 点击搜索后楼盘信息
      projectInfo: {}, // 楼盘信息
      currentHouseId: '', // 楼栋id 第一次没有
      houseTag: [], //  户型标签
      upHeight: false, // 展示
      titleList: [], // 左侧表头
      operationObj: {}, // 左侧居理操作列
      data_source_list: [], // 数据源操作数组
      mutiInput: '',
      maxHeight: [], // 记录所有最大高度
      taskList: [], // 表头任务列表
      houseTypeList: [], // 表头户型任务列表
      cityId: '', // 城市id
      cityList: [{id: '', text: ''}], // 城市下拉
      houseTypeSele: [], // 筛选的业态id
      houseTypeOptions: [{id: '', text: ''}], // 业态下拉
      saleStatusSele: '', // 筛选销售状态
      searchStatusOptions: [{id: '', text: ''}], // 筛选中在售状态下拉
      saleStatusOptions: [{id: '', text: ''}], // 在售状态下拉
      isOporateSele: '', // 是否合作
      isOporateOptions: [{id: '', text: ''}], // 合作下拉
      distriSele: [], // 筛选的区域内容
      distriOptions: [{id: '', text: ''}], // 区域下拉
      houseTypeRoom: [], // 户型居室
      orientationList: [], // 朝向信息
      buildType: [], // 建筑类型下拉
      dialogVisibleNoTask: false, // 无任务状态弹窗展示
      dialogTitleNoTask: '无任务通知', // 弹窗标题
      dialogContentNoTask: '当前已经无相关任务，请返回到任务列表进行查看', // 弹窗内容
      dialogVisibleRemoveAbnormal: false,
      dialogTitleRemoveAbnormal: '移除异常提示',
      // dialogContentRemoveAbnormal: '啊哦！全部都被移除咯！好像没有什么可操作的啦，请在下方先点击去匹配下户型，再刷新页面进行操作',
      dialogContentRemoveAbnormal: '不存在居理的楼栋无法移除',
      dialogVisibleChangeBalcony: false,
      dialogTitleChangeBalcony: '更换楼座图提醒',
      dialogContentChangeBalcony: '原图中存在楼座图信息，更换楼座图后，原打点信息将消失！请确定是否更换',
      isRemoveDialog: false, // 没有可操作数据
      dialogVisibleSellOut: false, // 待售\售罄楼盘错误提示信息弹窗是否展示,默认隐藏
      dialogContentSellOut: '该楼盘为售罄楼盘不存在非售罄的户型或楼栋，请检查', // 待售\售罄楼盘错误提示信息内容
      dialogTitleSellOut: '错误提示', // 待售\售罄楼盘错误提示信息标题
      sellOutBuildingName: '', // 待售\售罄楼盘错误提示信息标题
      sellOutBuildingUrl: '', // 待售\售罄楼盘状态
      onSellOrsellOut: '', // 标识待售or售罄
      // 来源
      source: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 筛选项
      this.getCondition()
    })
    // 查找展示状态是否有值
	if (localStorage.getItem('showStatus') === 'false') {
    this.serchIsShow = false;
    this.isShowText = '展开';
	} else if(localStorage.getItem('showStatus') === 'true') {
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
                mode_type: '3'
            }
            let result = await api.getTaskType(params);
            let { code, data } = result.data;
            if (code === 0) {
              this.taskType = data ? data[0].data_type : '1';
              this.paramBuildingId = data ? data[0].building_id : '';
            } else {
              this.taskType = '1';
            }
        } catch (error) {
            console.log(error);
        }
    },
    // 前往编辑页面跳转
    turnToPage() {
        getInfoByProjectId(this.projectInfo.project_id).then((data) => {
			if (!data) {
				return false;
			}
			let routeData = null;
			if (this.taskType === '2') {
				routeData = this.$router.resolve({
					path: '/building/buildingDetailEdit',
					query: {
            projectId: data.project_id,
            projectName: data.name,
            buildingType: `(${data.project_type_text})`,
            buildingId: this.paramBuildingId,
            isEdit: '1',
            role: 'operation'
					}
				});
			} else {
				routeData = this.$router.resolve({
					path: '/building/tabToggleList',
					query: {
						projectId: data.project_id,
            projectName: data.name,
            cityId: data.city_id,
            buildingType: `(${data.project_type_text})`,
            positionTab: '2',
						role: 'operation'
					}
				});
			}
            // 埋点
            this.setTrack('4826');
            let opener = window.open(routeData.href, "_blank");
            opener.opener = null;
        });
    },
	/**
     * 楼盘字典V3.2优化新增方法
     * author: 解彬
     * time: 2019.9.16
     */
    searchsIsShow () {
		this.serchIsShow = !this.serchIsShow;
		if(this.serchIsShow) {
      this.isShowText = '隐藏';
      // 楼栋页面埋点
      this.setTrack('5066', {is_show_search: '1'});
		} else {
      this.isShowText = '展开';
      // 楼栋页面埋点
      this.setTrack('5066', {is_show_search: '2'});
		}
		// 记录显示状态
		localStorage.setItem('showStatus',this.serchIsShow);
	},
    /**
     * 公共埋点方法(优化方式)
     * @params frompage_id [string] 来源页面id
     * @params topage_id [string] 前往页面id
    */
    setTrack (trackId, para) {
        if (para) {
            Object.assign(para, {
                frompage_id: 'p_building_task',
                topage_id: 'p_building_task'
            });
        }
        commonFun.setTrackMenu(trackId, para);
    },
    openImg (para) {
      window.open(para.show_url, '_blank')
    },
    // 更换关联关系
    leaveChange () {
      // /index.php?r=bd-building-info/index&city_id=[城市id]&group_name=【楼盘名称】&project_status=-1
      let url = `/index.php?r=bd-building-info/index&city_id=${this.projectInfo.city_id}&group_project_id=${this.projectInfo.group_project_id}&selected_project_name=${this.projectInfo.selected_project_name}&project_status=-1`
      window.open(url, '_blank')
    },
    upDataTab () {
      if (this.data_source_list.length == 0) {
        // 清空task_id
        this.getData(3)
      } else {
        this.getData()
      }
    },
    editHouseType (type) {
      if (type == 1) {
        this.$refs.houseType.style.height = 'auto'
        this.isShowOpen = false
      } else {
        this.$refs.houseType.style.height = '55px'
        this.isShowOpen = true
      }
    },
    // 保存楼座图
    changeBalcony () {
      this.operationObj.building_img.value = this.buildImg.value
      this.buildUrl = this.buildImg.value.url
      this.operationObj.building_img.value.point_count = 0
      this.operationObj.building_img.is_diff_julive = true
      this.dialogVisibleChangeBalcony = false
      // 计算高度
      setTimeout(() => {
        this.calculateHeigth()
      })
    },
    // 跳转到任务列表
    skipToTaskList () {
      window.location.href = '/index.php?r=cj-project-task/unfinished-task'
    },
    // 保存并跳转
    saveSkip (para) {
      // saveWarn saveTaskWarn saveNextWarn
      // para  house切换户型  task切换任务  next下一个楼盘
      if (para === 'house') {
        // 下一个楼盘
        this.saveData('house')
        this.saveWarn = false
      } else if (para === 'task') {
        this.saveData('task')
        this.saveTaskWarn = false
      } else if (para === 'next') {
        this.saveData('next')
        this.saveNextWarn = false
      }
    },
    // 不保存
    notSaveSkip (para) {
      // saveWarn saveTaskWarn saveNextWarn
      // para  house切换户型  task切换任务  next下一个楼盘
      if (para == 'house') { // house切换户型
        this.currentHouseId = this.baseId
        this.taskInfo = this.deepCopy(this.baseTaskInfo)
        this.saveWarn = false
        //  重新请求数据
        this.getData()
      } else if (para == 'task') { // task切换任务
        this.saveTaskWarn = false
        if (this.currentTurn.title === '楼盘信息' || this.currentTurn.title === '楼栋') {
          this.$router.push({path: this.currentTurn.url})
        } else {
          window.open(this.currentTurn.url)
        }
        // 跳转任务详情
      } else if (para == 'next') { // next下一个楼盘
        this.getData(2)
        this.saveNextWarn = false
      }
      this.isHasEdit = false
    },
    // 点击下一个楼盘
    nextProject () {
      if (this.isHasEdit) {
        // 编辑过提示
        this.saveNextWarn = true
      } else {
        // 为编辑过直接请求数据
        this.getData(2)
      }
    },
    // 点击搜索
    searchData () {
      this.isTask = false
      this.searchBuildObj = this.buildObj
      this.getData(1)
      setTimeout(() => {
        this.remoteMethod('')
      })
    },
    /**
     * @description: 变化后添加颜色 来源
     * @param {String} para  字段key值
     * @return: 
     */
    edit (para) {
      this.$set(this.source, para+'__source', '运营');
      this.operationObj[para].is_diff_julive = true
      // 编辑过标识
      this.isHasEdit = true
    },
    // 区间值
    sectionData (para, num) {
      let number = parseFloat(num);
      let curr = parseFloat(para);
      return curr < number && curr >= 0;
    },
    // 保存
    saveData (para) {
      if (!this.signFlag) {
        // 提交校验
        // 楼栋名称
        if (this.operationObj.building_name && this.operationObj.building_name.value == '') {
          this.$message({
            message: '楼栋名称为必填',
            type: 'warning',
            duration: 3000
          })
          return false
        }
        // 建筑类型
        if (this.operationObj.building_type && this.operationObj.building_type.value == '') {
          this.$message({
            message: '建筑类型为必选',
            type: 'warning',
            duration: 3000
          })
          return false
        }
        // 地上层数
        if (this.operationObj.above_floor_num && this.operationObj.above_floor_num.value !== '' && !this.sectionData(this.operationObj.above_floor_num.value, 10000)) {
          this.$message({
            message: '地上层数 必须在0-9999之间',
            type: 'warning',
            duration: 3000
          })
          return false
        }
        // 总户型
        if (this.operationObj.total_house_num && this.operationObj.total_house_num.value !== '' && !this.sectionData(this.operationObj.total_house_num.value, 10000)) {
          this.$message({
            message: '总户型 必须在0-9999之间',
            type: 'warning',
            duration: 3000
          })
          return false
        }
        // 单元数
        if (this.operationObj.unit_num && this.operationObj.unit_num.value !== '' && !this.sectionData(this.operationObj.unit_num.value, 10000)) {
          this.$message({
            message: '单元数 必须在0-9999之间',
            type: 'warning',
            duration: 3000
          })
          return false
        }
      }

      let params = {
        curr_project_id: this.currProjectId, // 当前居理楼盘id
        building_id: this.currentHouseId, // 当前查看详情的楼栋id
        source: this.taskInfo.source, // 源
        building_name: this.operationObj.building_name.value, // 楼栋名称
        saling_status: this.operationObj.saling_status ? this.operationObj.saling_status.value : '', // 销售状态
        building_type: this.operationObj.building_type.value, // 建筑类型
        relation_house_types: this.value, // 关联户型
        above_floor_num: this.operationObj.above_floor_num.value, // 地上层数
        unit_num: this.operationObj.unit_num.value, // 单元数
        total_house_num: this.operationObj.total_house_num.value, // 总户数
        building_img: this.operationObj.building_img ? this.operationObj.building_img.value.url : '', // 楼座图url
        ladder_ratio: this.operationObj.ladder_ratio ? this.operationObj.ladder_ratio.value.replace(/\s+/g, "") : '',
        project_type_flag: this.signFlag ? 2 : 1
      }
      params = Object.assign(params, this.source);
      this.axios.post('/backend-api/cj-building-info/save', params)
        .then(res => {
          if (res.data.code == 0) {
            if (para == 'nextTask') {
              // 请求详情接口
              // 更新两个值后在请求 building_id  task_id
              this.currentHouseId = res.data.data.building_id
              this.taskId = res.data.data.next_task_id
              if (res.data.data.next_task_id !== '') {
                this.getData(2, 'task')
              } else {
                this.getData(2)
              }
              this.isHasEdit = false
            } else if (para == 'house') {
              this.currentHouseId = this.baseId
              this.taskInfo = this.deepCopy(this.baseTaskInfo)
              this.isHasEdit = false
              this.getData()
            } else if (para == 'task') {
              if (this.currentTurn.title === '楼盘信息' || this.currentTurn.title === '楼栋') {
                this.$router.push({path: this.currentTurn.url})
              } else {
                window.open(this.currentTurn.url)
              }
              this.isHasEdit = false
            } else if (para == 'next') { // 下一个楼盘
              this.isHasEdit = false
              this.getData(2)
            } else { // 保存成功跳转任务列表页
              this.skipToTaskList()
            }
          } else if (res.data.code == 20005) {
              // 楼盘名称
              this.sellOutBuildingName = res.data.data.project_name;
              // 点击楼盘名称跳转
              this.sellOutBuildingUrl = res.data.data.url;
              // 弹窗展示
              this.dialogVisibleSellOut = true;
              // 弹窗内容
              this.dialogContentSellOut = res.data.msg;
              // 待售or售罄
              this.onSellOrsellOut = res.data.data.status; 
          } else {
            alert(res.data.data.building_name)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取建筑类型
    getBusinessType () {
      let params = {
        project_type: this.proType
      }
      this.axios.get('/backend-api/common/get-business-layout', { params: params })
        .then((res) => {
          if (res.data.code == 0) {
            let result = res.data.data
            this.buildType = result
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 新页面打开任务
    skipTask (para) {
      // 保存跳转内容，在弹出框使用
      this.currentTurn = para

      if (this.isHasEdit) {
        this.saveTaskWarn = true
      } else {
        if (para.title === '楼盘信息' || para.title === '户型') {
          this.$router.push({path: para.url})
        } else {
          window.open(para.url, '_blank')
        }
      }
    },
    // 切换居理户型id
    changeHouId (task) {
      this.baseId = task.building_id
      this.taskId = task.task_id
      this.baseTaskInfo = this.deepCopy(task)
      if (this.isHasEdit) {
        // 保存提示
        this.saveWarn = true
        return
      } else {
        this.currentHouseId = task.building_id
        this.taskInfo = task
      }
      this.isRemove = false
      //  重新请求数据
      this.getData()
    },
    // 删除关联户型接口
    removeHouseInfo (para) {
      let params = {
        // 抓取的
        bd_building_id: para.building_id,
        // 居理的
        cj_building_id: this.currentHouseId
      }
      if (this.taskInfo.source != '99') {
        // 删除异常
        this.dialogVisibleRemoveAbnormal = true
        return
      }
      this.axios.post('/backend-api/cj-building-info/relation-del', params)
        .then(res => {
          if (res.data.code == 0) {
            this.isRemove = true
            // 删除成功后重新请求表格数据
            this.getData()
          } else {
            alert(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 楼栋获取焦点
    focusSelect () {
      if (this.focusIndex < 1) {
        this.remoteMethod('')
        this.focusIndex++
      }
    },
    // 获取已经关联了的户型
    getContactBuild () {
      let builds = this.operationObj.relation_houses ? this.operationObj.relation_houses.value : []
      this.value = []
      if (builds.length == 0) {
        return
      }
      builds.forEach((item, index) => {
        var obj = {
          id: item.house_type_id,
          text: item.house_type_num
        }
        this.value.push(item.house_type_id)
        this.options.push(obj)
      })
    },
    // 关联户型
    remoteMethod (para) {
      var builds = this.operationObj.relation_houses ? this.operationObj.relation_houses.value : []
      let params = {
        q: para,
        project_id: this.searchBuildObj.id ? this.searchBuildObj.id : this.currProjectId
      }
      // 请求 关联户型
      this.axios.post('/backend-api/common/get-house-type-list', params)
        .then(res => {
          if (res.status == 200) {
            if (res.data.code == 0) {
              this.loading = true
              setTimeout(() => {
                this.loading = false
                if (res.data.data.length <= 0 && query == '') {
                  let arr = [{text: '没有更多数据了'}]
                  this.options = arr
                } else {
                  if (builds.length > 0) {
                    for (let i = 0; i < builds.length; i++) {
                      if (res.data.data.length > 0) {
                        let isHas = res.data.data.findIndex((v) => {
                          return v.id == builds[i].house_type_id
                        })
                        if (isHas == -1) {
                          res.data.data.push({id: builds[i].house_type_id, text: builds[i].house_type_num})
                        }
                      }
                    }
                  }
                  this.options = res.data.data
                }
              }, 200)
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 户型图多选 控制添加按钮
    statisState (val) {
      var arr = val.value.filter((item) => {
        return item.state == true
      })
      if (arr.length > 0) {
        val.isEdit = true
      } else {
        val.isEdit = false
      }
    },
    // 数组去重
    deteleObject (obj) {
      var uniques = []
      var arrBase = []
      var stringify = {}
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i])
        keys.sort(function (a, b) {
          return (Number(a) - Number(b))
        })
        var str = ''
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j])
          str += JSON.stringify(obj[i][keys[j]])
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i])
          stringify[str] = true
        }
      }
      arrBase = uniques
      return arrBase
    },
    // 点击添加户型图
    addJuliveImg (key, val) {
      var check = val.filter((item) => {
        return item.state == true
      })
      // 如果左侧不存在则添加如果左侧不存在  则不添加
      var arr = this.operationObj[key].value.concat(check)
      this.operationObj[key].value = this.deteleObject(arr)
    },
    // 获取业态
    getProjectType () {
      let params = {
        city_id: this.cityId
      }
      this.axios.get('/backend-api/common/get-project-type-list', { params: params })
        .then((res) => {
          if (res.data.code == 0) {
            let result = res.data.data
            this.houseTypeOptions = result
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取区域
    getDistrict () {
      let params = {
        city_id: this.cityId
      }
      this.axios.get('/backend-api/common/get-district-list', { params: params })
        .then((res) => {
          if (res.data.code == 0) {
            let result = res.data.data
            this.distriOptions = result
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取城市
    getCity () {
      let params = {
        type: 1
      }
      this.axios.get('/backend-api/common/get-city-list', { params: params })
        .then((res) => {
          if (res.data.code == 0) {
            let result = res.data.data
            this.cityList = result
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取下拉选项
    getOptList () {
      let params = {
        type: ['1', '2', '8', '9', '10'],
        city_id: this.cityId // 城市id
      }
      this.axios.post('/backend-api/common/get-project-config', params).then((res) => {
        if (res.data.code === 0) {
          let result = res.data.data
          // 是否合作
          this.isOporateOptions = result.cooperate_status
          // 户型标签
          this.houseTag = result.house_tag
          // 朝向下拉
          this.orientationList = result.room_orientation
          // 在售状态
          this.saleStatusOptions = result.sale_status
          // 居室类型
          this.houseTypeRoom = result.room_type
          // 在售状态 搜索项中使用
          this.searchStatusOptions = result.sale_status
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 删除居理户型图
    deleteHouImg (val, index, key) {
      this.operationObj[key].value.splice(index, 1)
    },
    // 获取默认筛选项
    getCondition () {
      this.axios.get('/backend-api/project/get-search-record')
        .then((res) => {
          if (res.data.code == 0) {
            let result = res.data.data
            // 楼盘信息
            this.buildObj = result.project_info ? result.project_info : {}
            this.searchBuildObj = result.project_info ? result.project_info : {}
            // 城市id
            this.cityId = result.city_id ? result.city_id : ''
            // 销售状态
            this.saleStatusSele = result.status ? result.status : ''
            // 区域信息
            this.distriSele = result.district_id ? result.district_id : []
            // 业态信息
            this.houseTypeSele = result.project_type ? result.project_type : []
            // 是否合作
            this.isOporateSele = result.is_cooperate ? result.is_cooperate : ''

            // 从url进入
            if (this.$route.query.nextProjectType) {
              this.nextProjectType = this.$route.query.nextProjectType
            }
            if (this.$route.query.isNext) {
              this.isNext = this.$route.query.isNext
            }
            if (this.$route.query.curr_project_id) {
              this.currProjectId = this.$route.query.curr_project_id
            }
            if (this.$route.query.is_task) {
              this.isTask = this.$route.query.is_task
            }
            if (this.$route.query.building_id) {
              this.currentHouseId = this.$route.query.building_id
            }
            if (this.$route.query.task_id) {
              this.taskId = this.$route.query.task_id
            }
            if (this.$route.query.sourc) {
              this.taskInfo.source = this.$route.query.sourc
            }
            if (this.$route.query.city_id) {
              this.cityId = this.$route.query.city_id
            }
            if (this.$route.query.district_id) {
              this.distriSele = this.$route.query.district_id.split(',')
            }
            if (this.$route.query.project_id) {
              this.searchBuildObj.id = this.$route.query.project_id
            }
            if (this.$route.query.project_type) {
              this.houseTypeSele = this.$route.query.project_type.split(',')
            }
            if (this.$route.query.status) {
              this.saleStatusSele = this.$route.query.status
            }
            if (this.$route.query.is_cooperate) {
              this.isOporateSele = this.$route.query.is_cooperate
            }

            // 请求详情初始化数据
            if (this.nextProjectType == 'task' && this.isNext == 1) { // 按照下一个楼盘请求
              this.getData(2)
            } else if (this.isNext == 0 && this.currProjectId == '') { // 按照搜索请求
              this.getData(1)
            } else {
              this.getData()
            }
            // 下拉选项
            this.getOptList()
            // 城市
            this.getCity()
            // 获取区域
            this.getDistrict()
            // 获取业态
            this.getProjectType()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 初始化详情数据
    getData (type, para) {
      this.tablebLoading = true
      this.source = {};
      let district = this.distriSele.join(',')
      let proType = this.houseTypeSele.join(',')
      var sourc = ''
      var currId = ''
      var task = ''
      // type为1 时是搜索 为2是下一个楼盘
      if (type == 1) {
        this.isNext = 0
        this.currentHouseId = ''
      } else if (type == 2) {
        currId = this.currProjectId
        task = this.taskId
        this.currentHouseId = ''
        this.isNext = 1
      } else {
        sourc = this.taskInfo.source
        currId = this.currProjectId
        task = this.taskId
        this.isNext = 0
      }
      if (this.isTask) {
        this.nextProjectType = 'task'
      } else {
        this.nextProjectType = ''
      }

      if (para == 'task') {
        this.isNext = 0
      }
      if (type == 3) {
        task = ''
      }

      let params = {
        next_project: this.isNext, // 下一个楼盘
        next_project_type: this.nextProjectType, // 是否点击过搜索
        curr_project_id: currId,
        task_id: task,
        building_id: this.currentHouseId, // 第一次不用传
        source: sourc, // 第一次不用传
        city_id: this.cityId,
        district_id: district,
        project_id: this.searchBuildObj.id,
        project_type: proType,
        status: this.saleStatusSele,
        is_cooperate: this.isOporateSele
      }
      this.axios.get('/backend-api/cj-building-info/detail', { params: params })
        .then((res) => {
          if (res.data.code == 0) {
            let result = res.data.data
            // 参数
            this.$router.push({
              query: merge({}, {
                nextProjectType: this.nextProjectType,
                isNext: this.isNext,
                curr_project_id: this.currProjectId,
                building_id: this.currentHouseId,
                task_id: this.taskId,
                is_task: this.isTask,
                sourc: this.taskInfo.source,
                city_id: this.cityId,
                district_id: this.distriSele.join(','),
                project_id: this.searchBuildObj.id,
                project_type: this.houseTypeSele.join(','),
                status: this.saleStatusSele,
                is_cooperate: this.isOporateSele
              })
            })

            this.taskList = result.task_module
            // 户型任务列表
            this.houseTypeList = result.building_info
            if (this.houseTypeList.length > 20) {
              this.$refs.houseType.style.height = 55 + 'px'
              this.isShowOpen = true
            }
            // 楼盘信息
            this.projectInfo = this.deepCopy(result.project_info)
            this.currProjectId = result.project_info.project_id
            // 给左侧表头赋值
            this.titleList = this.deepCopy(result.grid_info.field_info)
            // 给操作列赋值
            this.operationObj = this.deepCopy(result.grid_info.julive_info)
            // 备份左侧数据操作列数据
            this.operationObjBase = this.deepCopy(result.grid_info.julive_info)
            // 给数据源赋值
            this.data_source_list = this.deepCopy(result.grid_info.source)
            // 大数据列
            this.bigData = this.deepCopy(result.big_data)
            // 楼盘中业态信息
            this.proType = result.project_info.project_type


            setTimeout(() => {
              this.calculateHeigth()
            })
          } else if (res.data.code === 1007) {
            // 没有任务  提示无任务弹窗
            this.dialogVisibleNoTask = true
          } else {
            alert(res.data.msg)
          }
        }).then(() => {
          // 将滚动条恢复到顶部
          let tableWrapper = document.getElementsByClassName('el-table__body-wrapper')[0]
          tableWrapper.scrollTo(0, 0)
          // 修改标记楼盘的状态
          this.signFlag = false
          // 第一次加载状态
          this.isFirst = false
          // 提示移出异常
          if (this.isRemove && this.data_source_list.length === 0) {
            this.isRemoveDialog = true // 无源数据移除异常
          }
          // 关闭loading
          this.tablebLoading = false
          this.getContactBuild()
          // 获取户型
          this.remoteMethod('')

          if (this.$route.query.task_id != '' && this.isFir) { // 第一次进页面时从url上根据任务id匹配当前展示任务
            // 根据task_id  过滤出对应的building_id

            let tsId = this.$route.query.task_id
            let arr = this.houseTypeList.filter((it) => {
              return it.task_id == tsId
            })

            this.taskInfo = arr.length > 0 ? arr[0] : {}
            this.isFir = false
          }
          this.currentHouseId = this.$route.query.building_id != '' ? this.$route.query.building_id : ''
          if (this.currentHouseId) {
            let arr = this.houseTypeList.filter((it) => {
              return it.building_id == this.currentHouseId
            })
            this.taskInfo = arr.length > 0 ? arr[0] : {}
          }

          // 默认选中第一个楼栋
          if (this.houseTypeList.length > 0 && this.currentHouseId == '') {
            this.currentHouseId = this.houseTypeList[0].building_id
            this.taskInfo = this.houseTypeList[0]
            this.taskId = this.houseTypeList[0].task_id
          }
          if (this.taskInfo.source == '99') {
            this.isShowSign = false
          } else {
            this.isShowSign = true
          }
          // 获取建筑类型
          this.getBusinessType()
          // 计算高度
          setTimeout(() => {
            this.$forceUpdate()
            this.calculateHeigth()
		  })
		  // 获取任务类型
      this.getTaskTypeById();
      this.getTaskType();
        })
        .catch((err) => {
          console.log(err)
          // 关闭loading
          this.tablebLoading = false
        })
    },
    /**
     * @description: 点击来源的值进行赋值
     * @param {String} source 来源名 
     * @return: 
     */
    choosenItem (para, paraKey, paraType, source) {
      if (paraType === 'string') {
        // 字符串覆盖
        if (para.value != '') {
          this.operationObj[paraKey] = this.deepCopy(para)
          this.operationObj[paraKey].is_diff_julive = true
          this.$set(this.source, paraKey+'__source', source);
        }
      } else if (paraType === 'editUrl') {
        this.operationObj[paraKey].value = para.value
        this.operationObj[paraKey].is_diff_julive = true
        this.$set(this.source, paraKey+'__source', source);
      } else if (paraType === 'buildImg') {
        this.buildImg = para
        if ((JSON.stringify(this.operationObj.building_img.value) !== '[]') && this.operationObj.building_img.value.point_count != 0 && this.operationObj.building_img.value.point_count !== '') {
          // 有打点信息的时候 弹窗提示
          this.dialogVisibleChangeBalcony = true
        } else {
          this.buildUrl = para.value.url
          this.operationObj.building_img.value = para.value
          this.operationObj.building_img.value.point_count = 0
          this.operationObj.building_img.is_diff_julive = true
        }
      }
      // 编辑过标识
      this.isHasEdit = true
      setTimeout(() => {
        this.calculateHeigth()
      })
    },
    // 点击楼盘名
    affirmHouse (val) {
      // 更新楼盘信息
      this.buildObj.id = val.id
      this.buildObj.text = val.text
    },
    // 搜索楼盘
    searchHouse (val, cb) {
      var list = [{}]
      let params = {
        q: val,
        city_id: this.cityId,
        search_alias: true
      }
      this.axios.get('/backend-api/common/get-project-list', { params: params })
        .then((res) => {
          let result = res.data
          if (result.code === 0) {
            if (JSON.stringify(result.data) == '{}') {
              list = [{value: '暂无数据'}]
            } else {
              // 在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
              for (let i of result.data) {
                i.value = i.text // 将想要展示的数据作为value
              }
              list = result.data
            }
            cb(list)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 深度克隆
    deepCopy (obj) {
      var result = Array.isArray(obj) ? [] : {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            result[key] = this.deepCopy(obj[key])
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    },
    change () {
      setTimeout(() => {
        this.calculateHeigth()
      })
    },
    // 重置筛选项
    resetBtn () {
      this.cityId = ''
      this.distriSele = []
      this.houseTypeSele = []
      this.saleStatusSele = ''
      this.isOporateSele = ''
      this.buildObj = {}
      this.searchBuildObj = {}
      this.isTask = false
      this.getData()
    },
    // 动态计算高度
    calculateHeigth () {
      this.upHeight = true
      this.$nextTick(() => {
        this.maxHeight = []
        let heightList = []
        new Promise((resolve, reject) => {
          for (var index = 0; index < Object.keys(this.titleList).length; index++) {
            let liBox = document.getElementsByClassName('li-' + index)
            let allHeight = []
            for (let i = 0; i < liBox.length; i++) {
              allHeight.push(liBox[i].offsetHeight)
            }
            let max = Math.max(...allHeight)
            heightList.push(max)
            resolve(heightList)
          }
        }).then(() => {
          this.upHeight = false
          this.maxHeight = heightList
        })
      })
    },
    // 点击确定关闭售罄、待售楼盘错误提示
    closeDialogSellOut () {
        let errorType = '';
        if (this.onSellOrsellOut == 3) { // 售罄
            errorType = '2';
        } else if (this.onSellOrsellOut == 4) { // 待售
            errorType = '4';
        }
        // 埋点
        this.setTrack('5343', {error_type: errorType})
        this.dialogVisibleSellOut = false
    },
    // 点击售罄、待售楼盘名称
    clickBuildName () {
        // 埋点
        this.setTrack('5344', {})
        this.dialogVisibleSellOut = false
        window.open(this.sellOutBuildingUrl, '_blank')
    }
  },
  watch: {
    cityId: {
      handler: function (val, oldval) {
        if (!this.isFirst) {
          // 重新请求业态  区域信息
          this.getDistrict()
          this.getProjectType()
        }

        // 清空区域
        if (!this.isFir) {
          this.distriSele = []
        }

        // 处理业态
        let arr = []
        var baseAr = []
        var filterArr = []
        setTimeout(() => {
          this.houseTypeSele.forEach((house, index) => {
            filterArr = this.houseTypeOptions.filter((value) => {
              return value.id == house
            })
            arr = arr.concat(filterArr)
          })
          if (arr.length > 0) {
            arr.forEach((it, ind) => {
              baseAr.push(it.id)
            })
          }
          if (baseAr.length > 0) {
            this.houseTypeSele = baseAr
          }
        }, 300)
      },
      deep: true
    }
  }
}
</script>

<!--弹窗公共样式 始-->
<style lang="less" scoped>
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #eaeaea;
    padding: 20px;
  }
  /deep/.el-dialog {
    margin-top: 30vh !important;
    .el-dialog__footer{
      .el-button{
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
  /deep/ .dialog-footer .el-button{
    padding: 10px 30px;
    height: 38px;
    width: auto;
  }
  /deep/ .dialog-footer .el-button--default {
    background-color: #fff;
    &:link{
      background-color: #fff;
      color: #77808a;
      border: 1px solid #e6e6e6;
    }
    &:visited{
      background-color: #fff;
      color: #77808a;
      border: 1px solid #e6e6e6;
    }
    &:hover{
      background-color: #ecf5ff;
      color: #409eff;
      border: 1px solid #c6e2ff;
    }
    &:active{
      background-color: #ecf5ff;
      color: #409eff;
      border: 1px solid #c6e2ff;
    }
  }
</style>
<!--弹窗公共样式 止-->
<style scoped>
  .tHead-box > li > div{
    min-height: 50px;
    border-left: 1px solid #f4f6f9;
    border-bottom: 1px solid #f4f6f9;
    word-break: break-all;
    word-wrap:break-word;
    line-height: 22px;
  }
  .tHead-box > li > div.mergeTd{
    border-left: none;
  }
  .tHead-box.tFixed > li > div{
    border-left: none;
    border-right: 1px solid #f4f6f9;
  }
  .tFixed.fixed-th{
    width: 35%;
  }
  .tFixed.fixed-td{
    width: 65%;
  }
  .tHead-box > li > div .house_wrap >>> .el-input{
    width: 170px;
  }
  .tHead-box > li > div .skip{
    color: #33a1ff;
    font-size: 14px;
    margin-left: 10px
  }
  .tHead-box .inside-box li > div{
    word-break: break-all;
    min-height: 50px;
  }
  .tHead-box .inside-box li:last-of-type > div{
    border-bottom: none;
  }
  .tHead-box >>> .el-input .el-input__inner{
    height: 34px;
    line-height: 34px;
  }
  .tHead-box >>> .el-select{
    width: 100%;
    height: 34px;
    line-height: 34px;
  }
  .tHead-box >>> .el-select .el-input__icon{
    line-height: 34px;
  }
  .tFixed{
    float: left;
    width: 50%;
  }
  .table-box-wrapper >>> .el-table__body tr.hover-row > td{
    background-color: #fff;
  }
  .table-box-wrapper >>> .el-table .cell, .table-box-wrapper >>> .el-table th div{
    padding-right: 0;
    padding-left: 0;
  }
  .table-box-wrapper >>> .el-table th .cell{
    position: relative;
    text-align: center
  }
  .table-box-wrapper >>> .el-table th .cell .delete-info{
    cursor: pointer;
    position: absolute;
    right:0;
    top:-2px;
    color: #ff5c47
  }
  .table-box-wrapper >>> .el-table td, .table-box-wrapper >>> .el-table th{
    padding: 0;
  }
  .table-box-wrapper >>> .el-table th{
    border-right: 1px solid #f4f6f9;
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
    padding:0 10px;
  }
  .table-box-wrapper >>> .el-table td .box-inner{
    height: 100%;
    padding: 7px 10px;
    box-sizing: border-box;
    position: relative;
  }
  .table-box-wrapper >>> .el-table td .box-inner.add-tag{
    background-color: #FFD19A;
  }
  .table-box-wrapper >>> .el-table td .box-inner .add-img{
    pointer-events: none;
    position: absolute;
    right: 10px;
    top: 7px;
    cursor: pointer;
    color: #33a1ff;
    opacity: 0.4;
  }
  .table-box-wrapper >>> .el-table td .box-inner .add-img.edit{
    opacity: 1;
    pointer-events: auto;
  }
  .table-box-wrapper >>> .el-table th:last-child{
    border-right: 1px solid #f4f6f9;
  }
  .table-box-wrapper >>> .el-table .el-table__row td:nth-child(2) .tHead-box > li > div{
    border-left: none;
  }
  .table-box-wrapper >>> .el-table .el-table__header-wrapper tr th{
    border-right: none;
    border-left: 1px solid #f4f6f9;
  }
  .table-box-wrapper >>> .el-table .el-table__header-wrapper tr th:nth-child(2){
    border-left: none;
  }
  /* 样式 */
  .content-main{
    padding: 0 15px;
  }
  .form-table-box{
    background-color: #fff;
  }
  .order-search{
    overflow: hidden;
  }
  .order-search >>> .el-select{
    width: 100%;
  }
  .order-search >>> .el-autocomplete{
    width: 100%;
  }
  .huilding-compare-box .order-search >>> .el-select{
    height: 40px;
  }
  .form-table-box .batch-btn-area{
    text-align: right;
  }
  .batch-form-box >>> .el-form-item{
    margin-bottom: 0;
  }
  .order-search >>> .el-select .el-select__tags{
    height: 24px;
    overflow: hidden;
    flex-wrap: nowrap;
  }
  .tap-toggle {
	float: right;
	margin-top: 10px;
  }
</style>
<style lang="less" scoped>
  .content-main{
    .btn-wrap{
      margin-top: 50px;
      margin-bottom: 10px;
      text-align: center
    }
  }
  .v-table{
    .hd{
      border-bottom: none;
      line-height: 50px;
    }
  }
  .table-box-wrapper{
    /deep/.el-table{
      .el-loading-mask{
         z-index: 12!important;
       }
       .box-inner{
         &.error{
           color: #2846f5;
         }
         >span{
           a{
             padding: 0 5px;
           }
         }
         &.is-diff{
           background-color: #FFF8A6
         }
         >span{
           cursor: pointer;
         }
         .build-name{
           cursor: pointer;
           padding-right:5px;
         }
         .el-select__tags{
            overflow: hidden;
            flex-wrap: nowrap;
         }
         .house-item{
           cursor: pointer;
         }
         .el-textarea{
              height: 100%;
              .el-textarea__inner{
                height: 100%;
              }
            }
         .img-wrap{
            display: inline-block;
            position: relative;
            width: 100px;
            height: 100px;
            margin:6px;
            .el-checkbox{
              position: absolute;
              right: -3px;
              top: -6px;
              margin-right:0;
            }
            .delete{
              display: inline-block;
              position: absolute;
              right: -3px;
              top: -3px;
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
            img{
              width: 100%;
              height: 100%;
            }
         }
         .add-dot{
          position: absolute;
          bottom: 5px;
          right: 5px;
         }
        .img-container{
           box-sizing: border-box;
           padding-right: 30px;
          }
       }
       .house-item{
         padding: 3px 5px;
       }
    }
    .tab-info{
      position: relative;
      .matchup{
        position: absolute;
        right:0;
        top: 0;
        >div{
          line-height: 20px;
          span{
            cursor: pointer;
            text-decoration: underline
          }
        }
        .up-data{
          color: #33a1ff;
          cursor: pointer;
        }
      }
    }
    .el-col-title{
      width: 100%;
      font-size: 14px;
      font-weight: bold;
      color: #000;
      .next-project{
        display: inline-block;
        color: #33a1ff;
        margin-left:10px;
        cursor: pointer;
      }
    }
    .el-col-link{
      width: 100%;
      line-height: 34px;
      .col-link-th{
        float: left;
      }
      .col-link-td{
        overflow: hidden;
        padding-left: 10px;
        box-sizing: border-box;
        & > li{
          float: left;
          cursor: pointer;
          line-height: 34px;
          margin-right: 10px;
          &.is-task{
            color: #33a1ff;
          }
          &.no-task{
            color: #aaa;
          }
        }
      }
    }
    .el-col-type{
      width: 100%;
      line-height: 34px;
      min-height: 34px;
      >ul{
        overflow: hidden;
      }
      >div{
        text-align: right;
        span{
          cursor: pointer;
          display: inline-block;
          margin-right: 15px;
          font-size: 16px
        }
      }
      li{
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
        &.is-task{
          border: 1px solid #33a1ff;
          background-color: #fff;
          color: #33a1ff;
        }
        &.no-task{
          border: 1px solid #aaa;
          color: #aaa;
        }
        &.active{
          border: 1px solid #33a1ff;
          background-color: #33a1ff;
          color: #fff;
        }
      }
    }
    .table-box-row{
      margin-top: 10px;
      border-top: 1px solid #f4f6f9;
      border-left: 1px solid #f4f6f9;
    }
    .sign-wrap{
      padding: 10px 0;
      font-size: 14px;
    }
  }
  // 新增售罄楼盘错误提示弹窗样式
  .on-sale-tex .click-see {
    color: #409eff;
  }
</style>
