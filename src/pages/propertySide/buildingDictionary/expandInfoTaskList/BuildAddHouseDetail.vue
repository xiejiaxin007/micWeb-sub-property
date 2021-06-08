<!--
    @file: 户型详情页
    @description: 户型详情页
    @author: xiebin
    @date: 2019-12-20
-->
<template>
    <div class="content-box"
        v-loading="pageLoading">
        <!--面包屑-->
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="bread-nav">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <a @click="goToListPage">{{breadText}}</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <a @click="gotoDymicInfo">动销信息</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>户型详情页</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header-title-box">
            <h2>{{ projectName + buildingType }} -- 户型详情</h2>
            <el-button
                v-if="getConfigList.current_role_source && getConfigList.current_role_source == 7"
                type="primary"
                @click="copeHouseType">
                复制已有户型
            </el-button>
        </div>
        <div class="content-list-box">
            <!-- 户型图集 -->
            <div class="photo-box-list">
                <div :class="{'house-photo-list': true, 'is-fixed': isFixed}">
                    <div class="header-contnet">
                        <h3>户型图集</h3>
                        <el-tooltip placement="top">
                            <div slot="content">
                                除以下7个元素外其他任意元素都要去掉（说明：户型图本身为必须有的部分，其余6个元素为可选项）
                                <br />
                                1、户型图本身+指南针+户型编号+户型厅室+户型的楼栋位置+户型描述+比例尺
                                <br />
                                · 户型图中绝对不能有的元素有：电话号码和二维码
                                <br />
                                · 户型图本身需在户型的中间或相对中间的位置
                                <br />
                                2、前端显示的户型图绝对不可以有贝壳自己画的户型图，一旦发现算高错，除户型图以外其他的户型字段可以参考贝壳
                            </div>
                            <i class="el-icon-warning" aria-hidden="true"></i>
                        </el-tooltip>
                    </div>
                    <div class="content-photo-list">
                        <jl-file-upload
                            ref="uploadTest"
                            :isCompress="isCompress"
                            fileMaxSize="10mb"
                            :compressSize="compressSize"
                            :limit="10"
                            @beforeUpdate="beforeUpdate"
                            upID="photo-upload"
                            :ossData="ossData"
                            @getFileURL="uploadSuccess"
                            class="photo-uploads"
                            :isMulti="true">
                            上传户型图
                        </jl-file-upload> 
                        <div
                            class="photo-box"
                            v-for="(item, index) in photoListArr"
                            :key="index">
                            <el-form
                                label-width="73px"
                                >
                                <el-form-item
                                    v-if="item.apart_img">
                                    <el-image
                                        style="width: 100%; height: 100%"
                                        :src="gethost + item.apart_img.field_value"
                                        fit="scale-down"
                                        :alt="item.name"
                                        @click="openPhotoViewer(gethost + item.apart_img.field_value)" />
                                </el-form-item>
                                <el-form-item
                                    label="楼层:"
                                    v-if="item.storey">
                                    <el-select
                                        v-model="item.storey.field_value"
                                        placeholder="请选择楼层">
                                        <el-option
                                            v-for="item in getConfigList.house_type_storey"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    label="展示顺序:"
                                    v-if="item.show_index">
                                    <jl-number-input
                                        v-model="item.show_index.field_value"
                                        minVal="0"
                                        maxVal="999"
                                        reg="parseInt">
                                    </jl-number-input>
                                    <el-tooltip placement="top">
                                        <div slot="content">
                                            1.楼层：
                                            <br />
                                            · 默认无层数；
                                            <br />
                                            · 当添加的户型有多张户型图的时候，需要对每张户型图填写楼层可选项
                                            <br />
                                            · 可选项：1层、2层、3层、4层、负1层、负2层、负3层
                                            <br />
                                            2.展示顺序（前端户型图展示顺序）填写规则：
                                            <br />
                                            （1）当添加的户型有多张户型图的时候，需要对每张户型图填写展示顺序，排列顺序为前端户型图展示顺序；
                                            <br />
                                            （2）户型图楼层填写，先地下，后地上，倒序展示地下层数户型图，正序展示地上层数户型；
                                            <br />
                                            · eg1：别墅是地上三层，有3张户型图，一层的户型顺序为1，二层的户型图顺序为2，三层的户型图顺序为3 
                                            <br />
                                            · eg2：别墅是地上三层，地下二层，有5张户型图，地下二层的户型顺序为1，地下一层的户型图顺序为2，一层的户型图顺序为3，二层层的顺序为4，三层的顺序为5
                                            <br />
                                            3.状态：默认显示
                                            <br />
                                            备注：如果可以获得该户型的样板间图片，也可以放到该户型图集中展示，展示顺序：户型图>该户型样板间图片（样板间图片几张均可，最好每个屋子一张）
                                        </div>
                                        <i class="el-icon-warning" aria-hidden="true"></i>
                                    </el-tooltip>
                                </el-form-item>
                                <el-form-item
                                    label="是否展示:"
                                    v-if="item.status">
                                    <el-select
                                        v-model="item.status.field_value"
                                        placeholder="请选择是否展示">
                                        <el-option
                                            v-for="item in getConfigList.img_is_show"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    label="信息来源:"
                                    v-if="item.apart_img && item.apart_img.is_show_belong_role == '1'">
                                    <info-origin
                                        :isBreak="true"
                                        v-model="item.apart_img.belong_role"
                                        :other-val.sync="item.apart_img.belong_other"
                                        :operate-msg="spliceInfoOrigin(item.apart_img)"
                                        :originArr="getConfigList.qd_source_list">
                                    </info-origin>
                                </el-form-item>
                                <el-form-item
                                    v-if="item.apart_img">
                                    <el-button
                                        class="btn-del"
                                        type="danger"
                                        @click="delPhotoModule(item.id.field_value, index, item.apart_img.field_value)">
                                        删除</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 户型信息 -->
            <div class="house-info-list">
                <div class="header-contnet clear-float-box">
                    <h3>户型基础信息</h3>
                    <p v-if="getConfigList.current_role_source && getConfigList.current_role_source == 7">信息来源</p>
                </div>
                <div class="form-list-box">
                    <el-form
                        :model="houseInitInfo"
                        label-width="90px"
                        ref="initInfoForm">
                        <el-form-item
                            label="户型编号:"
                            v-if="houseInitInfo.house_type_num"
                            :prop="'house_type_num.field_value'"
                            :rules="[ { required: true, message: '请输入户型编号', trigger: 'blur' } ]">
                            <div class="form-input-box">
                                <el-input
                                    class="hosue-num"
                                    maxlength="20"
                                    v-model.trim="houseInitInfo.house_type_num.field_value">
                                </el-input>
                                <el-tooltip placement="top">
                                    <div slot="content">
                                        1、普适情况：
                                        <br />
                                        · 户型有具体编号：填写户型编号（只要填写编号即可），可参考户型图上的编号或门户网站或开发商的户型编号
                                        <br />
                                        · 户型无具体编号：以户型建面命名即可，如108平
                                        <br />
                                        2、特殊情况：
                                        <br />
                                        ① 无具体编号&有多种户型类型：户型类型/建筑类型+户型建面，如：高层108平、洋房108平；上叠89平、下叠121平等
                                        <br />
                                        ② 无具体编号&同面积同建筑类型：  
                                        <br />
                                        · 对称户型：yy平对称，如：77平对称
                                        <br />
                                        · 非对称户型：yy平-N，如：77平-1、77平-2（N=非0的任意自然数）
                                        <br />
                                        ③ 不同期数、同编号/面积的户型且需要展示期数：
                                        <br />
                                        · 户型命名时可以加上期数，为期数+户型编号/面积，如：1期A
                                        <br />
                                        ④ 不同建筑类型的户型价格不一样时，户型可以命名为：建筑类型+编号，如：高层A
                                        <br />
                                        ⑤ 当户型为某个区间&确定是同一个户型时，户型编号为：户型区间+户型编号，如：88-90平A 或 88-90平
                                        <br />
                                        ⑥ 不同地块同编号/面积的户型且需要展示地块：户型命名时可以加上地块，具体为：地块+户型编号/面积，如：雅园地块A
                                    </div>
                                    <i class="el-icon-warning" aria-hidden="true"></i>
                                </el-tooltip>
                            </div>
                            <info-origin
                                v-if="houseInitInfo.house_type_num.is_show_belong_role == '1'"
                                v-model="houseInitInfo.house_type_num.belong_role"
                                :other-val.sync="houseInitInfo.house_type_num.belong_other"
                                :operate-msg="spliceInfoOrigin(houseInitInfo.house_type_num)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="户型类型:"
                            v-if="houseInitInfo.building_type && this.isShowHouseType">
                            <div class="form-input-box">
                                <el-select
                                    v-model="houseInitInfo.building_type.field_value"
                                    placeholder="请选择户型类型"
                                    clearable>
                                    <el-option
                                        v-for="item in getHosueTypeDataList"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <info-origin
                                v-if="houseInitInfo.building_type.is_show_belong_role == '1'"
                                v-model="houseInitInfo.building_type.belong_role"
                                :other-val.sync="houseInitInfo.building_type.belong_other"
                                :operate-msg="spliceInfoOrigin(houseInitInfo.building_type)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="户型居室:"
                            :prop="'room_type.field_value'"
                            :rules="[ { required: true, message: '请选择户型居室', trigger: 'change' } ]"
                            v-if="houseInitInfo.room_type">
                            <div class="form-input-box">
                                <el-select
                                    v-model="houseInitInfo.room_type.field_value"
                                    placeholder="请选择户型居室">
                                    <el-option
                                        v-for="item in getConfigList.room_type"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <info-origin
                                v-if="houseInitInfo.room_type.is_show_belong_role == '1'"
                                v-model="houseInitInfo.room_type.belong_role"
                                :other-val.sync="houseInitInfo.room_type.belong_other"
                                :operate-msg="spliceInfoOrigin(houseInitInfo.room_type)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="厅室描述:"
                            required
                            v-if="houseInitInfo.layout_shi && houseInitInfo.layout_ting && houseInitInfo.layout_chu && houseInitInfo.layout_wei">
                            <div class="form-input-box">
                                <el-col :span="5">
                                    <el-form-item
                                        :prop="'layout_shi.field_value'"
                                        :rules="[ { required: true, message: '请输入室', trigger: 'blur' } ]">
                                        <jl-number-input
                                            v-model="houseInitInfo.layout_shi.field_value"
                                            minVal="1"
                                            maxVal="20"
                                            class="shi-text"
                                            reg="int"
                                            @blur="houseRoomLinkage(houseInitInfo.layout_shi.field_value, houseInitInfo.room_type)">
                                        </jl-number-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1">
                                    室
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item>
                                        <jl-number-input
                                            v-model="houseInitInfo.layout_ting.field_value"
                                            reg="parseInt"
                                            minVal="0"
                                            maxVal="20">
                                        </jl-number-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1">
                                    厅
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item>
                                        <jl-number-input
                                            v-model="houseInitInfo.layout_chu.field_value"
                                            reg="parseInt"
                                            minVal="0"
                                            maxVal="20">
                                        </jl-number-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1">
                                    厨
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item>
                                        <jl-number-input
                                            v-model="houseInitInfo.layout_wei.field_value"
                                            reg="parseInt"
                                            minVal="0"
                                            maxVal="20">
                                        </jl-number-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1">
                                    卫
                                </el-col>
                            </div>
                            <info-origin
                                v-if="houseInitInfo.layout_shi.is_show_belong_role == '1'"
                                v-model="houseInitInfo.layout_shi.belong_role"
                                :other-val.sync="houseInitInfo.layout_shi.belong_other"
                                :operate-msg="spliceInfoOrigin(houseInitInfo.layout_shi)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="层高:"
                            v-if="houseInitInfo.floor_height">
                            <div class="form-input-box">
                                <jl-number-input
                                    v-model="houseInitInfo.floor_height.field_value"
                                    minVal="0.01"
                                    maxVal="99.99"
                                    reg="twoNum">
                                </jl-number-input> m
                            </div>
                            <info-origin
                                v-if="houseInitInfo.floor_height.is_show_belong_role == '1'"
                                v-model="houseInitInfo.floor_height.belong_role"
                                :other-val.sync="houseInitInfo.floor_height.belong_other"
                                :operate-msg="spliceInfoOrigin(houseInitInfo.floor_height)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="房屋朝向:"
                            v-if="houseInitInfo.orientation">
                            <div class="form-input-box">
                                <el-select
                                    v-model="houseInitInfo.orientation.field_value"
                                    placeholder="请选择房屋朝向">
                                    <el-option
                                        v-for="item in getConfigList.new_room_orientation"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-tooltip placement="top">
                                    <div slot="content">
                                        1、朝向：
                                        <br />
                                        · 以采光面积最大方向为朝向，有指北针的参考指北针的方向，没有指北针默认坐北朝向；
                                        <br />
                                        · 如果多个方向均有采光面且面积大致相同：
                                        <br />
                                        · 户型图上如果有比例尺，按照比例尺计算面积大小
                                        <br />
                                        · 如果没有比例尺，按朝向的优先级来选择朝向（朝向优先级：东南> 南 >西南>东 >西> 东北 >西北> 北）
                                        <br />
                                        2、多朝向：
                                        <br />
                                        · 住宅和别墅–如果户型图上有楼栋，显示一个户型位于不同的楼栋，各楼栋/同楼栋该户型朝向不同，选多朝向，其他情况按朝向优先级走，
                                        <br />
                                          但须注意当多朝向中的某个朝向的状态发生变更时须及时更新，否算不自洽
                                        <br />
                                        · 商办则可以选择多朝向，但须注意当多朝向中的某个朝向的状态发生变更时须及时更新，否算不自洽。
                                        <br />
                                        3、东南朝向：只有主采光面朝东南等才可以选，西南、东南、西北朝向同理。
                                    </div>
                                    <i class="el-icon-warning" aria-hidden="true"></i>
                                </el-tooltip>
                            </div>
                            <info-origin
                                v-if="houseInitInfo.orientation.is_show_belong_role == '1'"
                                v-model="houseInitInfo.orientation.belong_role"
                                :other-val.sync="houseInitInfo.orientation.belong_other"
                                :operate-msg="spliceInfoOrigin(houseInitInfo.orientation)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="户型总量:"
                            v-if="houseInitInfo.total_count">
                            <div class="form-input-box">
                                <jl-number-input
                                    v-model="houseInitInfo.total_count.field_value"
                                    minVal="0"
                                    maxVal="99999"
                                    reg="parseInt">
                                </jl-number-input> 户
                            </div>
                            <info-origin
                                v-if="houseInitInfo.total_count.is_show_belong_role == '1'"
                                v-model="houseInitInfo.total_count.belong_role"
                                :other-val.sync="houseInitInfo.total_count.belong_other"
                                :operate-msg="spliceInfoOrigin(houseInitInfo.total_count)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="排序:"
                            v-if="houseInitInfo.show_index">
                            <div class="form-input-box">
                                <jl-number-input
                                    v-model="houseInitInfo.show_index.field_value"
                                    minVal="0"
                                    maxVal="999"
                                    reg="parseInt">
                                </jl-number-input>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="是否显示:"
                            v-if="houseInitInfo.is_show_room_type">
                            <div class="form-input-box">
                                <el-select
                                    v-model="houseInitInfo.is_show_room_type.field_value"
                                    placeholder="请选择是否显示">
                                    <el-option
                                        v-for="item in getConfigList.house_type_is_show"
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 户型动销信息 -->
                <div class="header-contnet clear-float-box">
                    <h3>户型动销信息</h3>
                    <p v-if="getConfigList.current_role_source && getConfigList.current_role_source == 7">信息来源</p>
                </div>
                <div class="form-list-box">
                    <el-form
                        :model="houseDynameicInfo"
                        label-width="120px"
                        ref="dynamicInfoForm">
                        <el-form-item
                            label="户型销售状态:"
                            :prop="'status.field_value'"
                            :rules="[ { validator: validateStatus, message: '请选择销售状态', trigger: 'change' } ]"
                            v-if="houseDynameicInfo.status">
                            <div class="form-input-box">
                                <el-radio-group
                                    v-model="houseDynameicInfo.status.field_value">
                                    <el-radio
                                        v-for="item in getConfigList.sale_status"
                                        :key="item.id"
                                        :label="item.id">
                                        {{item.text}}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                            <info-origin
                                v-if="houseDynameicInfo.status.is_show_belong_role == '1'"
                                v-model="houseDynameicInfo.status.belong_role"
                                :other-val.sync="houseDynameicInfo.status.belong_other"
                                :operate-msg="spliceInfoOrigin(houseDynameicInfo.status)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="建筑面积:"
                            :prop="'acreage.field_value'"
                            :rules="[ { validator: validateAcreage, trigger: 'blur' } ]"
                            v-if="houseDynameicInfo.acreage">
                            <div class="form-input-box">
                                <jl-number-input
                                    v-model="houseDynameicInfo.acreage.field_value"
                                    minVal="1"
                                    maxVal="99999"
                                    reg="int"
                                    @input="calculationAllPrice(houseDynameicInfo)"
                                    @blur="calculationAllPrice(houseDynameicInfo)">
                                </jl-number-input> ㎡
                            </div>
                            <info-origin
                                v-if="houseDynameicInfo.acreage.is_show_belong_role == '1'"
                                v-model="houseDynameicInfo.acreage.belong_role"
                                :other-val.sync="houseDynameicInfo.acreage.belong_other"
                                :operate-msg="spliceInfoOrigin(houseDynameicInfo.acreage)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="套内面积:"
                            :prop="'ac_acreage.field_value'"
                            :rules="[ { validator: validateAcreage, trigger: 'blur' } ]"
                            v-if="houseDynameicInfo.ac_acreage">
                            <div class="form-input-box">
                                <jl-number-input
                                    v-model="houseDynameicInfo.ac_acreage.field_value"
                                    minVal="1"
                                    maxVal="99999.99"
                                    reg="twoNum"
                                    @input="calculationAllPrice(houseDynameicInfo)"
                                    @blur="calculationAllPrice(houseDynameicInfo)">
                                </jl-number-input> ㎡
                            </div>
                            <info-origin
                                v-if="houseDynameicInfo.ac_acreage.is_show_belong_role == '1'"
                                v-model="houseDynameicInfo.ac_acreage.belong_role"
                                :other-val.sync="houseDynameicInfo.ac_acreage.belong_other"
                                :operate-msg="spliceInfoOrigin(houseDynameicInfo.ac_acreage)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="单价:"
                            v-if="houseDynameicInfo.offer_price">
                            <div class="form-input-box">
                                <jl-number-input
                                    v-model="houseDynameicInfo.offer_price.field_value"
                                    minVal="0.0001"
                                    maxVal="99.9999"
                                    reg="fourNum"
                                    @input="calculationAllPrice(houseDynameicInfo)"
                                    @blur="calculationAllPrice(houseDynameicInfo)">
                                </jl-number-input> 万元
                            </div>
                            <info-origin
                                v-if="houseDynameicInfo.offer_price.is_show_belong_role == '1'"
                                v-model="houseDynameicInfo.offer_price.belong_role"
                                :other-val.sync="houseDynameicInfo.offer_price.belong_other"
                                :operate-msg="spliceInfoOrigin(houseDynameicInfo.offer_price)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="总价:"
                            v-if="houseDynameicInfo.price">
                            <div class="form-input-box">
                                <jl-number-input
                                    v-model="houseDynameicInfo.price.field_value"
                                    minVal="1"
                                    maxVal="99999.9999"
                                    reg="fourNum"
                                    @input="calculationAllPrice(houseDynameicInfo, 'priceAll')"
                                    @blur="calculationAllPrice(houseDynameicInfo, 'priceAll')">
                                </jl-number-input> 万元
                            </div>
                            <info-origin
                                v-if="houseDynameicInfo.price.is_show_belong_role == '1'"
                                v-model="houseDynameicInfo.price.belong_role"
                                :other-val.sync="houseDynameicInfo.price.belong_other"
                                :operate-msg="spliceInfoOrigin(houseDynameicInfo.price)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="首付比例:"
                            v-if="houseDynameicInfo.payment_ratio">
                            <div class="form-input-box">
                                <jl-number-input
                                    v-model="houseDynameicInfo.payment_ratio.field_value"
                                    minVal="0"
                                    maxVal="100"
                                    reg="twoNum"
                                    @input="calculationAllPrice(houseDynameicInfo, 'priceAll')">
                                </jl-number-input> %
                            </div>
                            <info-origin
                                v-if="houseDynameicInfo.payment_ratio.is_show_belong_role == '1'"
                                v-model="houseDynameicInfo.payment_ratio.belong_role"
                                :other-val.sync="houseDynameicInfo.payment_ratio.belong_other"
                                :operate-msg="spliceInfoOrigin(houseDynameicInfo.payment_ratio)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="首付:"
                            v-if="houseDynameicInfo.down_pay">
                            <div class="form-input-box">
                                <jl-number-input
                                    disabled
                                    v-model="houseDynameicInfo.down_pay.field_value"
                                    minVal="0">
                                </jl-number-input> 元
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="月供:"
                            v-if="houseDynameicInfo.month_pay">
                            <div class="form-input-box">
                                <jl-number-input
                                    disabled
                                    v-model="houseDynameicInfo.month_pay.field_value"
                                    minVal="0">
                                </jl-number-input> 元
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="户型在售余量:"
                            v-if="houseDynameicInfo.house_on_sale_num">
                            <div class="form-input-box">
                                <jl-number-input
                                    v-model="houseDynameicInfo.house_on_sale_num.field_value"
                                    minVal="0"
                                    maxVal="9999"
                                    reg="parseInt">
                                </jl-number-input> 套
                            </div>
                            <info-origin
                                v-if="houseDynameicInfo.house_on_sale_num.is_show_belong_role == '1'"
                                v-model="houseDynameicInfo.house_on_sale_num.belong_role"
                                :other-val.sync="houseDynameicInfo.house_on_sale_num.belong_other"
                                :operate-msg="spliceInfoOrigin(houseDynameicInfo.house_on_sale_num)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            label="关联楼栋:"
                            v-if="houseDynameicInfo.relation_buildings">
                            <div class="form-input-box">
                                <div>
                                    <el-select
                                        v-model="houseDynameicInfo.relation_buildings.field_value"
                                        placeholder="请选择楼栋"
                                        class="no-shake-select relative-building"
                                        multiple
                                        clearable
                                        @change="buildingChange"
                                        ref="relationBuilds"
                                        @focus="getRelatedBuildingSel">
                                        <el-option
                                            v-if="getRelatedBuildingOpiton && getRelatedBuildingOpiton.length > 0"
                                            label="全部"
                                            value="-1">
                                        </el-option>
                                        <el-option
                                            v-for="item in getRelatedBuildingOpiton"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <info-origin
                                v-if="houseDynameicInfo.relation_buildings.is_show_belong_role == '1'"
                                v-model="houseDynameicInfo.relation_buildings.belong_role"
                                :other-val.sync="houseDynameicInfo.relation_buildings.belong_other"
                                :operate-msg="spliceInfoOrigin(houseDynameicInfo.relation_buildings)"
                                :originArr="getConfigList.qd_source_list">
                            </info-origin>
                        </el-form-item>
                        <el-form-item
                            v-if="houseDynameicInfo.status">
                            <div class="form-input-box">
                                <el-button
                                    type="text"
                                    @click="addBuilding">
                                找不到楼栋，需要去新增
                                </el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 户型解析 -->
                <div
                    class="header-contnet clear-float-box"
                     v-if="getConfigList.current_role_source && getConfigList.current_role_source == 7">
                    <h3>户型解析</h3>
                </div>
                <div class="form-list-box">
                    <el-form
                        :model="houseParseInfo"
                        label-width="80px"
                        ref="subForm">
                        <el-form-item
                            label="户型标签:"
                            v-if="houseParseInfo.house_tag">
                            <div class="form-input-box">
                                <el-checkbox-group
                                    v-model="houseParseInfo.house_tag.field_value">
                                    <el-checkbox
                                        v-for="item in getConfigList.house_tag"
                                        :key="item.text"
                                        :label="item.text"
                                        :disabled="isCheckDisabled">
                                        {{item.text}}
                                    </el-checkbox>
                                </el-checkbox-group>
                                <el-tooltip placement="top">
                                    <div slot="content">
                                        户型方正：以整体户型为准，整体为长方形，有凹凸的部分，边角是直角即可算户型方正。
                                        <br />
                                        面宽充足：面宽/进深>=1/2，且采光面窗户长度和/面宽>=2/3。
                                        <br />
                                        复式空间：
                                        <br />
                                            · 跃层：占据2层，高度完整，内部有楼梯连接：完整的2层高度；
                                        <br />
                                            · 复式（住宅，产权70年）：占据2层，高度不完整，内部有楼梯连接：在一层里隔了2层，整个户型只有一层的高度；
                                        <br />
                                            · loft（商办，产权40年）：占据2层，最直观的特点就是有5米左右甚至更高的挑高
                                        <br />
                                        南北通透：南北两面可以直接采光和通风，中间没有任何建筑物阻挡（如客餐厅分南北，中间无隔挡；客厅正北连厨房，厨房窗对外面，客厅南接阳台/窗户）
                                        <br />
                                        动静分区：
                                        <br />
                                            · 平层：建面在120平以上(含)，默认紧凑实用型户型售面积不存在或很难存在动静分区
                                        <br />
                                            · 商办：带装修loft或者复式（如果可以明确获知是半封闭的复式则不算是动静分区）
                                        <br />
                                            · 别墅/住宅复式不做面积限制
                                    </div>
                                    <i class="el-icon-warning" aria-hidden="true"></i>
                                </el-tooltip>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="优势描述:"
                            v-if="houseParseInfo.good_desc">
                            <div class="form-input-box">
                                <el-input
                                    v-model="houseParseInfo.good_desc.field_value"
                                    type="textarea"
                                    maxlength="300">
                                </el-input>
                                <el-tooltip placement="top">
                                    <div slot="content">
                                        基于整个户型整体的优劣势
                                        <br />
                                            · 优势：根据户型图整体格局书写
                                        <br />
                                            · 劣势：有具体劣势就写具体劣势，无具体劣势就写“无劣势”或“无明显劣势”都可
                                        <br />
                                        注：
                                        <br />
                                            · 户型优劣势描述字段在填写时，以“；”分行，优劣势末尾不要加任何标点。（“；”的前后两句系统会自动生成序号，序号无需手动添加）
                                        <br />
                                            · 当详解和优劣势只有一句话时，句末不加任何标点
                                    </div>
                                    <i class="el-icon-warning" aria-hidden="true"></i>
                                </el-tooltip>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="劣势描述:"
                            v-if="houseParseInfo.bad_desc">
                            <div class="form-input-box">
                                <el-input
                                    type="textarea"
                                    maxlength="300"
                                    v-model="houseParseInfo.bad_desc.field_value">
                                </el-input>
                                <el-tooltip placement="top">
                                    <div slot="content">
                                        基于整个户型整体的优劣势
                                        <br />
                                            · 优势：根据户型图整体格局书写
                                        <br />
                                            · 劣势：有具体劣势就写具体劣势，无具体劣势就写“无劣势”或“无明显劣势”都可
                                        <br />
                                        注：
                                        <br />
                                            · 户型优劣势描述字段在填写时，以“；”分行，优劣势末尾不要加任何标点。（“；”的前后两句系统会自动生成序号，序号无需手动添加）
                                        <br />
                                            · 当详解和优劣势只有一句话时，句末不加任何标点
                                    </div>
                                    <i class="el-icon-warning" aria-hidden="true"></i>
                                </el-tooltip>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="居室详解:"
                            v-if="getConfigList.current_role_source && getConfigList.current_role_source == 7">
                            <el-tooltip placement="top">
                                <div slot="content">
                                    · 优先级：卧室、客厅、阳台、卫生间>厨房、餐厅>衣帽间、储藏室、活动室等
                                    <br />
                                    · 注意事项：
                                    <br />
                                        · 根据户型图准确填写各功能区的优势，不要随意使用不符合户型图的语句
                                    <br />
                                        · 卧室带卫、卧室带飘窗、干湿分离、动静分区、南北通透等常见的字段有严格的使用标准，需明确实际意义，再依据户型图确认是否使用
                                </div>
                                <i class="el-icon-warning" aria-hidden="true"></i>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item
                            label="卧室:"
                            v-if="houseParseInfo.master_bed_room">
                            <div class="form-input-box">
                                <el-input
                                    type="textarea"
                                    maxlength="100"
                                    v-model="houseParseInfo.master_bed_room.field_value">
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="卫生间:"
                            v-if="houseParseInfo.toilet">
                            <div class="form-input-box">
                                <el-input
                                    type="textarea"
                                    maxlength="100"
                                    v-model="houseParseInfo.toilet.field_value">
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="客厅:"
                            v-if="houseParseInfo.living_room">
                            <div class="form-input-box">
                                <el-input
                                    type="textarea"
                                    maxlength="100"
                                    v-model="houseParseInfo.living_room.field_value">
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="厨房:"
                            v-if="houseParseInfo.kitchen">
                            <div class="form-input-box">
                                <el-input
                                    type="textarea"
                                    maxlength="100"
                                    v-model="houseParseInfo.kitchen.field_value">
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="餐厅:"
                            v-if="houseParseInfo.restaurant">
                            <div class="form-input-box">
                                <el-input
                                    type="textarea"
                                    maxlength="100"
                                    v-model="houseParseInfo.restaurant.field_value">
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item
                            label="阳台:"
                            v-if="houseParseInfo.terrace">
                            <div class="form-input-box">
                                <el-input
                                    type="textarea"
                                    maxlength="100"
                                    v-model="houseParseInfo.terrace.field_value">
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="cancelDeatil">取消</el-button>
                            <el-button
                                type="primary"
                                @click="saveData()">
                                提交
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 楼盘户型自洽弹窗 -->
        <el-dialog
            :visible.sync="selfConsistentDialogvisible"
            title="系统提醒"
            width="30%"
            center>
            <span>{{selfConsistentMessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="editHouseTypeStatus">
                    修改户型销售状态
                </el-button>
                <el-button
                    type="primary"
                    @click="editHousePrejectStatus">
                    修改楼盘销售状态
                </el-button>
            </span>
        </el-dialog>
        <!--新增并复制户型弹窗-->
        <copy-house-type
            :house-type-id="$route.query.houseTypeId"
            :city-id="cityId"
            :project-name="projectName"
            :project-id="$route.query.projectId"
            :label-data="getConfigList.house_type_copy_field"
            :visible.sync="houseDialogVisible"
            @statusChange="reloadEditPage" />
        <!-- 图片预览查看器 -->
        <jl-image-preview v-if="PhotoIsShow"
            :showViewer="PhotoIsShow"
            :urlList="urlList"
            @closeViewer="closeViewer">
        </jl-image-preview>
    </div>
</template>

<script>
const configOption = [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 23, 24, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 46];
import moment from 'moment';
import { mapState } from "vuex";
import InfoOrigin from '../components/InfoOrigin';
import { isRequiredInfoOrigin, yuanToWan } from '../utils/index';
import { hosueRoomIsReg } from '../utils/checkHouseInfo';
import MsgDialog from '../components/MsgDialog';
import addHouseAPi from '../api/addHouseDetailApi';
import commonApi from '../api/common';
import reqApi from '@/api/commonApi';
import copyHouseType from '../components/CopyHouseTypeDialog';
import { commonFun } from "@/assets/js/utils/utils";
export default {
    name: 'BuildNamePoition',
    props: {       
    },
    watch: {
    },
    data() {
        const validateAcreage = (rule, value, callback) => {
            if (this.houseDynameicInfo.acreage.field_value === '' && this.houseDynameicInfo.ac_acreage.field_value === '') {
                callback(new Error('建筑面积和套内面积二必填一'));
            } else {
                callback();
            }
        };
        return {
            // 销售状态自洽弹窗
            selfConsistentDialogvisible: false,
            selfConsistentMessage: '',
            // 户型图集
            photoListArr: [],
            // 户型基础信息
            houseInitInfo: {},
            // 户型动销信息
            houseDynameicInfo: {},
            // 户型解析
            houseParseInfo: {},
            // 获取户型类型
            getHosueTypeDataList: [],
            // 是否使用固定定位
            isFixed: false,
            // 通用配置信息
            // getConfigList: {},
            // 图片url地址
            gethost: {},
            // 户型标签复选框是否禁用
            isCheckDisabled: false,
            // 关联楼栋下拉
            getRelatedBuildingOpiton: [],
            // 面积自定义校验赋值
            validateAcreage: validateAcreage,
            hosueDataArrConcat: [],
            // 初始化结构
            initStructureList: null,
            // 户型图片拷贝
            hosuePhotoCopy: [],
            // 复制已有户型是否显示
            houseDialogVisible: false,
            // 业态
            projectType: '',
            // 利率——计算月供
            lendRate: '',
            // 年限—计算月供
            lendYear: '',
            projectNameVal: '',
            // 总价计算错误是否校验
            allPriceIsSave: false,
            // 价格超出限制是否校验
            priceLimitIsSave:false,
            // 单价为空是否需要校验
            offPriceIsEmpty: false,
            // 面包屑文案
            breadText: '楼盘列表',
            // 预览效果是否显示
            PhotoIsShow: false,
            // 预览图片地址
            urlList: [],
            // 删除当前图片的路径
            delPhotoName: '',
            // 页面全局loading
            pageLoading: false,
            // oss签名
            ossData: {},
            isShowHouseType: true,
            // 重复图片数组
            repeatPhotoList: [],
            // copy初始化单价的值
            initOfferPriceCopy: '',
            // 涨跌是否继续校验
            exceedLimitIsSave: false,
            // 按键按下的键组成的数组
            arrKey: [],
            // 按键拼接字符串
            keydown: '',
            // 城市ID
            cityId: '',
            // 楼盘名
            projectName: '',
            // 业态名字
            buildingType: '',
            // 系统
            device: '',
            // 上传loading
            uploadLoading: '',
            // 压缩成功后文件数组
            baseList: [],
            // 是否进行压缩标志
            isCompress: true,
            // 压缩限制
            compressSize: '5120'
        }
    },
    computed: {
        ...mapState({
            // 获取通用配置信息
            getConfigList: state => state.buildingDictionary.projectConfiglist,
        })
    },
    mounted() {
        // 获取设备
        this.device = commonFun.getDevice();
        // 快捷键监听
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        // 页面滚动的监听回调
        window.addEventListener('scroll', this.photoIsFixed);
        // 获取楼盘信息，主要获取城市，楼盘名字，业态
        this.getProjectInfo();
        // 初始化数据
        // this.addHouseAPi();
        // 获取户型类型
        this.getHouseTypeList();
        // 获取图片host
        this.gethost = JSON.parse(localStorage.getItem('gethost'));
        // 将导入的方法绑定到实例上
        this.hosueRoomIsReg = hosueRoomIsReg;
        this.isRequiredInfoOrigin = isRequiredInfoOrigin;
        // 获取楼栋下拉
        this.getRelatedBuildingSel();
         // 获取初始化结构
        this.initStructure();
        // 获取楼盘基本信息
        this.getProjcetInitInfo();
        // 判断面包屑内容
        this.isOperation();
        this.getOssSign();
    },
    destroyed(){
        window.removeEventListener('scroll', this.photoIsFixed);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    },
    methods: {
        /**
         * @description: 压缩文件
         * @param {Array} files 要压缩的文件数组
         * @param {Object} up 上传插件对象
         */
        async compressStart(files, up) {
            try {
                let results = Promise.allSettled(files.map(async (item) => {
                    // 等待异步操作完成，返回执行结果
                    return new Promise((resolve, reject) => {
                        this.readAndPreview(item, resolve);
                    });
                }));
                results.then((res) => {
                    // 删除原文件
                    files.forEach((i) => {
                        up.removeFile(i.id)
                    });
                    // 判断如果有压缩成功的图片，则再次添加到上传队列中，如果没有压缩成功的图片，则手动调用上传方法
                    if (this.baseList.length > 0) {
                        up.addFile(this.baseList);
                    } else {
                        up.start();
                    }
                });
            } catch (error) {
                console.log(error)
                this.uploadLoading.close();
            }
        },
        /**
         * @description: 获取压缩后的文件
         * @param {Object} file 要压缩的文件
         * @param {Object} resolve promise的resolve
         * @param {Object} reject promise的reject
         */
        readAndPreview(file, resolve, reject) {
            try {
                var reader = new FileReader();
                reader.readAsDataURL(file.getNative());
                reader.onload = e => {
                    this.verificateBase64(e.target.result, base64 => {
                        if (!base64) {
                            resolve(true);
                            return;
                        }
                        let fileSource = this.dataURLtoFile(base64, file.name);
                        this.baseList.push(fileSource);
                        resolve(true);
                    });
                }
            } catch (error) {
                this.uploadLoading.close();
            }
        },
        /**
         * 计算图片大小
         * @param {String} base64 图片base64
         */
        computedImgSize(dataurl) {
            var str = dataurl.split(',')[1];
            var equalIndex = str.indexOf('=');
            if (str.indexOf('=') >= 0) {
                str = str.substring(0, equalIndex);
            }
            var strLength = str.length;
            var fileLength = parseInt(strLength - (strLength / 8) * 2);
            var kbLength = parseInt(fileLength / 1024).toFixed(0);
            return parseInt(kbLength);
        },
        /**
         * 校验(是否需要压缩，是否比例不符)
         * @param {String} base64 图片base64
         * @param {String} callback 回调函数
         */
        verificateBase64(base64, callback) {
            var that = this;
            var newImage = new Image();
            // 压缩系数0-1之间
            var quality = 1;
            // 图片base64
            newImage.src = base64;
            // url为外域时需要
            newImage.setAttribute('crossOrigin', 'Anonymous');
            var imgWidth, imgHeight;
            newImage.onload = function() {
                imgWidth = this.width;
                imgHeight = this.height;
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                // 压缩语句
                var newBase64 = canvas.toDataURL('image/jpeg', quality);
                // 计算裁剪后的图片大小
                let cropperSize = that.computedImgSize(newBase64);
                // 计算原图片大小
                let preSize = that.compressSize;
                // 如果需要压缩 且 压缩后图片变大 则压缩
                if (that.isCompress && preSize && cropperSize > preSize) {
                    let count = 0;
                    // 只进行三次压缩，如果三次之后还是大于要求大小，则提示用户压缩失败 
                    while (count < 3 && that.computedImgSize(newBase64) > preSize) {
                        quality -= 0.2;
                        newBase64 = canvas.toDataURL('image/jpeg', quality);
                        count++;
                    }
                    // 如果压缩三次后还是大于要求图片大小，则告知用户
                    if (that.computedImgSize(newBase64) > preSize) {
                        that.$message.warning('上传的图片经过压缩后仍大于5M，请重新上传符合大小要求的图片！');
                        callback('');
                        return;
                    }
                }
                // 必须通过回调函数返回，否则无法及时拿到该值
                callback(newBase64);
            };
        },
        /**
         * @description: 将base64转换为文件
         * @param {String} dataurl base64图片
         * @param {String} filename 图片名称
         * @return {Object} 文件
         */
        dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(',');
            var mime = arr[0].match(/:(.*?);/)[1];
            var bstr = atob(arr[1]);
            var n = bstr.length;
            var u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        },
        /**
         * @description: 上传之前暴露的回调
         * @param {Array} files 进入队列的文件
         */
        beforeUpdate(files) {
            this.uploadLoading = this.$loading({
                lock: true,
                text: '请求中，请稍后',
                spinner: 'el-icon-loading',
                customClass: 'loading-default-box',
                background: 'rgba(255, 255, 255, 0.8)'
            });
            // 默认这个方法是没有参数的，所以files为undefined
            if (!files) return false;
            // 进行压缩
            this.compressStart(files, this.$refs.uploadTest._data.uploader);
        },
        // 根据楼盘id获取楼盘基本信息接口，主要获取城市，楼盘名字，业态
        async getProjectInfo() {
            try {
                const {
                    data: { code, msg, data }
                } = await commonApi.getProjectInfoById({
                    project_id: this.$route.query.projectId,
                    fields: 'name,city_id,project_type_text'
                });
                if (code === 0) {
                    this.cityId = data.city_id;
                    this.projectName = data.name;
                    this.buildingType = data.project_type_text ? '(' + data.project_type_text + ')' : '';
                    // 调用vuexaction
                    this.getconfigDataList();
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {}
        },
        /**
         * @description: 按键按下的事件
         * @param {Object}  e
         * @return {type} 
         */
        handleKeyDown(e) {
            if (this.arrKey.length > 0) { 
                // a-z的按键 长按去重
                if (this.arrKey.indexOf(e.key.toLowerCase()) >= 0) {
                    return
                }
            }
            this.arrKey.push(e.key.toLowerCase())
            this.keydown = this.arrKey.join('+')
            if (this.device === 'mac') {
                if (this.keydown === 'meta+s') {
                    this.saveData();
                    // 取消浏览器原有的操作
                    e.preventDefault();
                }
            } else {
                if (this.keydown === 'control+s') {
                    this.saveData();
                    // 取消浏览器原有的操作
                    e.preventDefault();
                }
            }
        },
        /**
         * @description: 按键起来的事件
         * @param {Object}  e
         * @return {type} 
         */
        handleKeyUp(e) {
            this.keydown = '';
            this.arrKey = [];
            e.preventDefault();
        },
        // 校验销售状态
        validateStatus(rule, value, callback) {
            if (!value) {
                callback(new Error('请选择销售状态'));
            } else {
                callback();
            }
        },
        // 触发vuexaction函数调用配置信息
        getconfigDataList() {
            const options = {
                city_id: this.cityId || '',
                type: configOption,
                district_id: this.districtId || '',
                project_id: this.$route.query.projectId || '',
            };
            this.$store.dispatch('getProjectConfigList', options);
        },
        // 获取oss签名
        async getOssSign() {
            try {
                // 获取阿里云直传的图片上传获取签名
                const params = {
                    cate: 'Upload/project/house_type'
                };
                const { data: ossData } = await reqApi.getSign(params);
                this.ossData = ossData.data;
            }
            catch(error) {
                console.log(error)
            }
        },
        // 点击取消
        cancelDeatil() {
            if (this.$route.query.isViewJump) {
                this.$router.push({
                    path: '/building/BuildAddHouseView',
                    query: {
                        projectId: this.$route.query.projectId,
                        taskId: this.$route.query.taskId,
                        houseTypeId: this.$route.query.houseTypeId,
                        role: this.$route.query.role
                    }
                })
                return
            }
            this.gotoDymicInfo();
        },
        /**
         * 公共埋点方法
         * @param {string} trackid 埋点ID
         * @param {object}} para 埋点拓展字段
         */
        setTrack(trackId, para) {
            commonFun.setTrackMenu(trackId, para);
        },
        // 判断角色修改面包屑文案
        isOperation() {
            if (this.$route.query.role === 'operation') {
                this.breadText = '楼盘列表';
            } else if (this.$route.query.role === 'expand') {
                this.breadText = '楼盘任务列表';
            }
        },
        // 修改点击面包屑跳转
        goToListPage() {
            if (this.$route.query.role === 'operation') {
                window.location.href = '/index.php?r=yw-projects/index';
            } else if (this.$route.query.role === 'expand') {
                this.$router.push({
                    path: '/building/ExpandTaskList'
                });
            }
        },
        // 跳转到动销页面
        gotoDymicInfo(blankHref) {
            if (blankHref) {
                let { href } = this.$router.resolve({
                    path: '/building/tabToggleList',
                    query: {
                        projectId: this.$route.query.projectId,
                        taskId: this.$route.query.taskId,
                        cityId: this.cityId,
                        projectName: this.projectName,
                        role: this.$route.query.role,
                        positionTab: '2',
                        buildingType: this.buildingType
                    }
                })
                window.open(href, '_blank');
                return
            }
            this.$router.push({
                path: '/building/tabToggleList',
                query: {
                    projectId: this.$route.query.projectId,
                    taskId: this.$route.query.taskId,
                    cityId: this.cityId,
                    projectName: this.projectName,
                    role: this.$route.query.role,
                    positionTab: '2',
                    buildingType: this.buildingType
                }
            });
        },
        // 跳转到楼栋页面
        addBuilding() {
            let queryHref = this.$router.resolve({
                path: '/building/buildingDetailEdit',
                query: {
                    projectId: this.$route.query.projectId,
                    taskId: this.$route.query.taskId,
                    isEdit: '1',
                    role: this.$route.query.role
                }
            });
            window.open(queryHref.href);
        },
        // 点击复制已有户型
        copeHouseType() {
            this.houseDialogVisible = true;
        },
        /**
         * 复制户型保存成功后新标签页打开
         * @param {Boolean} status 是否复制成功
         * @param {String} houseID 回传得信息  成功时回传户型id
         */
        reloadEditPage(status, houseID) {
            if (!status) {
                return;
            }
            let queryHref = this.$router.resolve({
                path: '/building/BuildAddHouseDetail',
                query: {
                    projectId: this.$route.query.projectId,
                    taskId: this.$route.query.taskId,
                    houseTypeId: houseID,
                    role: this.$route.query.role,
                }
            });
            window.open(queryHref.href);
        },
        // 厅室描述信息来源赋值
        isChangeRadio() {
            let layoutShi = this.houseInitInfo.layout_shi;
            let layoutTing = this.houseInitInfo.layout_ting;
            let layoutChu = this.houseInitInfo.layout_chu;
            let layoutWei = this.houseInitInfo.layout_wei;
            let arrList = [];
            arrList.push(layoutShi, layoutTing, layoutChu, layoutWei);
            arrList.forEach(item => {
                item.belong_role = layoutShi.belong_role;
                item.belong_other = layoutShi.belong_other;
            })
        },
        /**
         * 提交数据
         * @param {Boolean} isSave 是否继续保存
         */
        saveData() {
            // 厅室描述信息来源赋值
            this.isChangeRadio();
            // 校验户型基础信息必填  
            const initInfoForm = new Promise(resolve => {
                this.$refs['initInfoForm'].validate(valid => {
                    if (valid) {
                        resolve(true);
                    } else {
                        return false;
                    }
                })
            });
            // 校验户型动销信息必填
            const dynamicInfoForm = new Promise(resolve => {
                this.$refs['dynamicInfoForm'].validate(valid => {
                    if (valid) {
                        resolve(true);
                    } else {
                        return false;
                    }
                })
            })
            // 敏感词校验
            let senSitivePromis = this.checkSensitiveWordsInfo();
            Promise.all([initInfoForm, dynamicInfoForm, senSitivePromis]).then( async result => {
                if(!result.includes(false)) {
                    // 户型居室联动校验
                    if (!this.hosueRoomIsReg(Number(this.houseInitInfo.layout_shi.field_value), this.houseInitInfo.room_type.field_value)) {
                        return false;
                    }
                    // 单价未填校验
                    if (this.houseDynameicInfo.offer_price.field_value === '' && this.houseDynameicInfo.status.field_value == 2 && !this.offPriceIsEmpty) {
                        this.addMessageDialog('在售户型的报价为空，系统不推荐保存，请确定是否添加报价信息！', '添加', '不添加', 'priceStatus');
                        return false;
                    }
                    // 户型显示没有户型图校验
                    if (!this.notPhotoList()) {
                        return false;
                    }
                    if (this.getConfigList.current_role_source == 7 && !this.photoSortIsRepeat()) {
                        return false;
                    }
                    // 价格超出限制校验
                    let priceFlag = this.priceBeyondLimit(this.houseDynameicInfo.offer_price.field_value, this.getConfigList.price_limit_list, this.priceLimitIsSave);
                    if (!priceFlag) {
                        return false;
                    }
                    // 价格超出限制校验
                    let priceLimitFlag = this.priceIsExceedLimit(this.houseDynameicInfo.offer_price.field_value, this.getConfigList.price_limit_list, this.exceedLimitIsSave);
                    if (!priceLimitFlag) {
                        return false;
                    }
                    // 总价计算错误校验
                    if (!this.checkAllPrice(this.houseDynameicInfo, this.allPriceIsSave)) {
                        return false;
                    }
                    // 户型在售余量自洽
                    if (!this.checkHouseMargin(this.houseDynameicInfo)) {
                        return false;
                    }
                    // 页面字段修改后 信息来源未标记
                    let photoFlag = this.isRequiredInfoOrigin(this.hosuePhotoCopy, this.photoListArr, true, '', false);
                    if (!photoFlag) {
                        return false;
                    }
                    let flag = this.isRequiredInfoOrigin(this.hosueDataArrConcat, this.saveFormConversionArr(), true, '', true);
                    if (!flag) {
                        return false;
                    }
                    // 开启loading，避免重复提交
                    this.pageLoading = true;
                    try {
                        let houseInfoData = {
                            // 户型基础信息
                            house_type_base_detail: {
                                module_name: this.houseInitModuleName,
                                data: this.houseInitInfo
                            },
                            // 户型动销信息
                            house_type_movable_pin_detail: {
                                module_name: this.houseDynameicModuleName,
                                data: this.houseDynameicInfo
                            },
                            // 户型解析
                            house_type_analysis: {
                                module_name: this.houseParseModuleName,
                                data: this.houseParseInfo
                            },
                            // 户型图集
                            house_type_detail_imgs: {
                                module_name: this.photoListModuleName,
                                data: this.photoListArr
                            },
                        }
                        let params = {
                            task_id: this.$route.query.taskId,
                            project_id: this.$route.query.projectId,
                            house_type_info: houseInfoData,
                        };
                        let { data } = await addHouseAPi.saveInfoData(params);
                        if (data.code === 0) {
                            this.pageLoading = false;
                            this.$message.success('保存成功');
                            setTimeout(() => {
                                this.$router.push({
                                    path: '/building/BuildAddHouseView',
                                    query: {
                                        projectId: this.$route.query.projectId,
                                        taskId: this.$route.query.taskId,
                                        houseTypeId: this.$route.query.houseTypeId ? this.$route.query.houseTypeId : data.data.house_id,
                                        role: this.$route.query.role
                                    }
                                });
                            },1000);
                        // 销售状态自洽
                        } else if (data.code === 20008) {
                            this.pageLoading = false;
                            this.selfConsistentDialogvisible = true;
                            this.selfConsistentMessage = data.msg;
                        } else if (data.code === 1) {
                            this.pageLoading = false;
                            this.$message(data.msg);
                        }
                         else {
                            this.pageLoading = false;
                        }
                    }
                    catch(error) {
                        this.pageLoading = false;
                        console.log(error);
                    }
                }
            })
        },
        // 点击弹窗修改楼盘销售状态处理
        editHousePrejectStatus() {
            // 关闭弹窗
            this.selfConsistentDialogvisible = false;
            // 埋点
            this.setTrack('6482', {
                error_type: '2',
                role: this.getConfigList.current_role_source == 7 ? '2' : '1',
                frompage: '2',
                topage: '1'
            });
            this.gotoDymicInfo(true);
        },
        // 点击弹窗修改户型销售状态处理
        editHouseTypeStatus() {
            // 关闭弹窗
            this.selfConsistentDialogvisible = false;
            // 户型销售状态自洽埋点
            this.setTrack('6483', {
                error_type: '2',
                role: this.getConfigList.current_role_source == 7 ? '2' : '1',
                frompage: '2',
                topage: '2'
            });
        },
        /**
         * 提交时将各表单数据整合成数组
         * @return {Array}
         */
        saveFormConversionArr() {
            let arr = [];
            arr.push(this.houseInitInfo, this.houseDynameicInfo, this.houseParseInfo)
            return arr;
        },
        /**
         * 校验没有为显示时户型图弹窗
         */
        notPhotoList() {
            let roleVal = this.getConfigList.current_role_source;
            let flag = true;
            if (roleVal == 7 && this.houseInitInfo.is_show_room_type && this.houseInitInfo.is_show_room_type.field_value == 2 && this.photoListArr.length === 0 && !this.photoIsSave) {
                this.addMessageDialog('该户型为显示，则需要存在展示的户型图！', '添加', '不添加并保存', 'photoIsSaveStatus');
                flag = false;
            }
            return flag;
        },
        // 校验户型图集展示顺序是否重复
        photoSortIsRepeat() {
            let flag = true;
            let arr = this.photoListArr;
            var hash = {};
            for(var i in arr) {
                if (arr[i].show_index.field_value != '' && hash[arr[i].show_index.field_value]) {
                    // console.log('---', hash[arr[i].show_index.field_value]);
                    this.$message('该户型图排序已存在，不可重复');
                    flag = false;
                    break;
                } else {
                    hash[arr[i].show_index.field_value] = true;
                }
            }
            return flag;
        },
        /**
         * 价格超出最大小值判断
         * @param {String} officePrice 单价
         * @return {Boolean} flag 是否通过
         */
        priceBeyondLimit(officePrice, limitPrice, priceLimitIsSave) {
            let {
                // 最小值
                price_min,
                // 最大值
                price_max
            } = limitPrice;
            let flag = true;
            if ((officePrice * 10000) != '' && ((officePrice * 10000) <= price_min || (officePrice * 10000) >= price_max) && !priceLimitIsSave) {
                this.addMessageDialog('本次修改的户型' + this.houseNumArcageConcat(this.houseInitInfo, this.houseDynameicInfo) + '单价为' + officePrice + '万元/㎡,系统判断价格可能存在异常，请确认是否正确录入！', '修改', '确认并保存', 'confimSave');
                flag = false;
            }
            return flag;
        },
        /**
         * @description 现在的单价是否超出限制
         * @param {type} 
         * @return: 
         */
        priceIsExceedLimit(officePrice, limitPrice, exceedLimitIsSave) {
            let {
                price_limit
            } = limitPrice;
            let flag = true;
            if (( Math.abs(Math.round((officePrice * 10000) - this.initOfferPriceCopy))) >= price_limit && !exceedLimitIsSave) {
                if (!(this.initOfferPriceCopy == '' || this.initOfferPriceCopy == '0')) {
                    flag = false;
                    this.addMessageDialog('本次修改的' + this.houseNumArcageConcat(this.houseInitInfo, this.houseDynameicInfo) + '单价涨跌超出' + price_limit + '元,请确认是否降价/涨价这么多！', '修改', '确认并保存', 'exceedLimit');
                }
            }
            return flag;
        },
        /**
         * 提示message框
         * @param {string} message 消息提示
         */
        addMessageDialog(message, cancel, confim, type) {
            this.$confirm(message, '提示', {
                confirmButtonText: confim,
                cancelButtonText: cancel,
                type: 'warning',
                center: true,
                }).then(() => {
                    // 单价未填写
                    if (type === 'priceStatus') {
                        this.offPriceIsEmpty = true;
                        this.saveData();
                    } else if (type === 'confimSave') {
                        // 价格超出上下限
                        this.priceLimitIsSave = true;
                        this.saveData();
                    } else if (type === 'allPriceCheck') {
                        // 总价计算校验
                        this.allPriceIsSave = true;
                        this.saveData();
                    } else if (type === 'photoIsSaveStatus') {
                        // 为显示时是否有户型图集
                        this.photoIsSave = true;
                        if (this.houseInitInfo.is_show_room_type) {
                            this.houseInitInfo.is_show_room_type.field_value = 1;
                        }
                        this.saveData();
                    } else if (type === 'exceedLimit') {
                        this.exceedLimitIsSave = true;
                        // 价格超出涨跌幅限制
                        this.saveData();
                    }
                }).catch(() => {
                    this.$message({
                        type: 'success',
                        message: '已确认'
                    });
                });
        },
        /**
         * 户型在售余量自洽
         * @param {object} itemVal 当前模块参数
         * @return {Boolean} flag 是否通过
         */
        checkHouseMargin(itemVal) {
            let {
                // 销售状态
                status,
                // 户型在售余量
                house_on_sale_num
            } = itemVal;
            let flag = true;
            // 当在售||待售时，在售余量不等于空并且小于0
            let check1 = (status.field_value == 2 || status.field_value == 4)  && house_on_sale_num.field_value !== '' && house_on_sale_num.field_value <= 0;
            let check2 = status.field_value == 3 && house_on_sale_num.field_value !== '' && house_on_sale_num.field_value > 0;
            if (check1 || check2) {
                this.$alert(this.houseNumArcageConcat(this.houseInitInfo, this.houseDynameicInfo) + '的销售状态和在售余量不自冾', '提示', {
                    confirmButtonText: '确定'
                });
                flag = false;
            }
            return flag;
        },
        /**
         * 户型编号面积拼接
         * @param {Object} initInfo 户型基础信息
         * @param {Object} dynamicInfo 户型动销信息
         * @return {String} str 户型拼接值
         */
        houseNumArcageConcat(initInfo, dynamicInfo) {
            let {
                // 户型编号
                house_type_num,
                // 厅室描述
                layout_shi,
                layout_ting,
                layout_chu,
                layout_wei
            } = initInfo;
            let {
                // 建筑面积
                acreage,
                // 套内面积
                ac_acreage
            } = dynamicInfo;
            let str = '';
            let layoutShi = '';
            let layoutTing = '';
            let layoutChu = '';
            let layoutWei = '';
            // 给厅室厨卫判断赋值
            layoutShi = layout_shi.field_value === '' || layout_shi.field_value == 0 ? '' : layout_shi.field_value + '室';
            layoutTing = layout_ting.field_value === '' || layout_ting.field_value == 0 ? '' : layout_ting.field_value + '厅';
            layoutChu = layout_chu.field_value === '' || layout_chu.field_value == 0 ? '' : layout_chu.field_value + '厨';
            layoutWei = layout_wei.field_value === '' || layout_wei.field_value == 0 ? '' : layout_wei.field_value + '卫';
            // 拼接户型信息
            if ((acreage.field_value !== '' && ac_acreage.field_value !== '') || (acreage.field_value !== '' && ac_acreage.field_value === '')) {
                str = house_type_num.field_value + '-' + acreage.field_value + '㎡' + '-' + layoutShi + layoutTing + layoutChu + layoutWei;
            } else if (acreage.field_value === '' && ac_acreage.field_value !== '') {
                str = house_type_num.field_value + '-(套内)' + ac_acreage.field_value + '㎡' + '-' + layoutShi + layoutTing + layoutChu + layoutWei;
            }
            return str;
        },
        /**
         * 总计自动计算校验  单价*面积优先建筑面积/重庆城市要反过来
         * @param {object} itemVal 当前模块参数
         * @param {object} allPriceIsSave 是否继续显示弹窗
         */
        checkAllPrice(itemVal, allPriceIsSave) {
            let flag = true;
            let {
                // 建筑面积
                acreage,
                // 套内面积
                ac_acreage,
                // 单价
                offer_price,
                // 总价
                price
            } = itemVal;
            // 套内面积总价
            let acAcreageAllPrice = (ac_acreage.field_value * offer_price.field_value).toFixed(4);
            // 建筑面积总价
            let acreageAllPrice = (acreage.field_value * offer_price.field_value).toFixed(4);
            if (!allPriceIsSave) {
                if ((acreage.field_value !== '' || ac_acreage.field_value !== '') && offer_price.field_value !== '') {
                    let checkPrice1 = acreage.field_value !== '' && ac_acreage.field_value !== '';
                    let checkPrice2 = acreage.field_value !== '' && ac_acreage.field_value == '' && price.field_value != acreageAllPrice;
                    let checkPrice3 = acreage.field_value == '' && ac_acreage.field_value !== '' && price.field_value != acAcreageAllPrice;
                    // 当城市为重庆的时候要反过来
                    let checkCQ1 = this.cityId === '20000050' && price.field_value != acAcreageAllPrice;
                    let checkCQ2 = this.cityId !== '20000050' && price.field_value != acreageAllPrice;
                    if ((checkPrice1 && (checkCQ1 || checkCQ2)) || checkPrice2 || checkPrice3) {
                        this.addMessageDialog(this.houseNumArcageConcat(this.houseInitInfo, this.houseDynameicInfo) + '的价格面积修改存在错误，请确认是否保存', '不保存', '保存', 'allPriceCheck');
                        flag = false;
                    }
                }
            }
            return flag;
        },
        /**
         * 总计自动计算  单价*面积优先建筑面积/重庆城市要反过来
         * @param {object} itemVal 当前模块参数
         * @param {object} priceAllInput 是否是在总价框输入
         */
        calculationAllPrice(itemVal, priceAllInput) {
            let {
                // 建筑面积
                acreage,
                // 套内面积
                ac_acreage,
                // 单价
                offer_price,
                // 总价
                price,
                // 月供
                month_pay,
                // 首付比例
                payment_ratio,
                // 首付金额
                down_pay
            } = itemVal;
            // 建筑面积和套内面积 或者 单价为空时， 清空总价
            if ((acreage.field_value === '' && ac_acreage.field_value === '') || offer_price.field_value === '' || price.field_value === '' ) {
                price.field_value = '';
                if (down_pay) {
                    down_pay.field_value = '';
                }
                if ((payment_ratio.field_value === '' || price.field_value === '') && (month_pay && month_pay.field_value)) {
                    month_pay.field_value = '';
                }
            }
            if (priceAllInput == 'priceAll') {
                this.downPaymentPlanning(price.field_value);
                // 调用计算月供
                this.calculationMonthPrice();
            } else {
                if ((acreage.field_value !== '' || ac_acreage.field_value !== '') && offer_price.field_value !== '') {
                    // cityId === '20000050'当城市为重庆的时候要反过来
                    if ((acreage.field_value !== '' && ac_acreage.field_value !== '' && this.cityId === '20000050') || (acreage.field_value === '' && ac_acreage.field_value !== '')) {
                        // 计算总价
                        price.field_value = (ac_acreage.field_value * offer_price.field_value).toFixed(4);
                    }
                    if ((acreage.field_value !== '' && ac_acreage.field_value !== '' && this.cityId !== '20000050') || (acreage.field_value !== '' && ac_acreage.field_value === '')) {
                        // 计算总价
                        price.field_value = (acreage.field_value * offer_price.field_value).toFixed(4);
                    }
                    // 调用计算月供
                    this.calculationMonthPrice();
                    // 首付金额计算
                    this.downPaymentPlanning(price.field_value);
                }
            }
        },
        // 月供计算
        calculationMonthPrice() {
            let {
                // 首付比例
                payment_ratio,
                // 总价
                price,
                // 月供
                month_pay
            } = this.houseDynameicInfo;
            if (month_pay) {
                // 根据业态修改利率
                let lendRate = this.lendRate;
                // 首付比例
                let payMentRateVal = payment_ratio.field_value / 100;
                // 贷款年限
                let lendYearVal = this.lendYear;

                // 月供 = (总价 * （1 - 首付比例) * 住宅/商住利率 * (1+住宅/商住利率)的月还款期数次方 /  (1+ 住宅/商住利率)的月还款期数次方 - 1) *10000
                month_pay.field_value = Math.round((price.field_value * (1 - payMentRateVal) * lendRate * (Math.pow(1 + lendRate, lendYearVal)) / (Math.pow(1 + lendRate, lendYearVal)- 1)) * 10000);
            }
        },
        /**
         * 首付金额计算
         * @param {object} itemVal 当前模块参数
         */
        downPaymentPlanning(itemVal) {
            let {
                // 总价
                price,
                // 首付比例
                payment_ratio,
                // 首付
                down_pay
            } = this.houseDynameicInfo;
            if (down_pay) {
                if (price.field_value !== '' && payment_ratio.field_value !== '') {
                    down_pay.field_value = Math.round((itemVal * (payment_ratio.field_value * 0.01)) * 10000);
                }
            }
        },
        /**
         * 户型图集删除
         * @param {Array} imgId 户型图ID
         * @param {Array} idx 当前模块的下标
         */
        delPhotoModule(imgId, idx, photoName) {
            this.$confirm('一旦删除则无法恢复确认是否删除！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                    if (imgId === '') {
                        // 删除编辑中数组的数据
                        this.photoListArr.splice(idx, 1);
                        // 删除源数组的数据
                        this.hosuePhotoCopy.splice(idx, 1);
                        // 将删除的图片名称传入图片组件中
                        this.delPhotoName = photoName
                        let repeatIndex = this.repeatPhotoList.findIndex(index => index == photoName)
                        this.repeatPhotoList.splice(repeatIndex, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        return;
                    }
                    try {
                        let params = {
                            img_id: imgId,
                            task_id: this.$route.query.taskId,
                            house_type_id: this.$route.query.houseTypeId
                        }
                        let result = await addHouseAPi.delHousePhotoData(params);
                        let { data } = result;
                        if (data.code === 0) {
                            // 删除编辑中数组的数据
                            this.photoListArr.splice(idx, 1);
                            // 删除源数组的数据
                            this.hosuePhotoCopy.splice(idx, 1);

                            this.delPhotoName = photoName
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            this.$message(data.msg);
                        }
                    }
                    catch(error) {
                        console.log(error);
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
            });
        },
        // 校验户型图是否重复
        getTheSame(attendUid, dataattendUid) {
            let newArr = [];
            attendUid.forEach(item => {
                newArr.push(item.originName);
            })
            this.result = new Array();
            let c = dataattendUid.toString();
            for (var i = 0; i < newArr.length; i++) {
                if (c.indexOf(newArr[i].toString()) > -1) {
                    for (var j = 0; j < dataattendUid.length; j++) {
                        if (newArr[i] == dataattendUid[j]) {
                            this.result.push(newArr[i]);
                            break;
                        }
                    }
                }
            }
            return this.result;
        },
        /**
         * 点击上传户型图
         * @param {Array} list 上传的图片集合
         */
        async uploadSuccess(list) {
            // 关闭加载loading
            this.uploadLoading.close();
            // 清空压缩后数组
            this.baseList = [];
            if (this.getTheSame(list, this.repeatPhotoList).length > 0) {
                this.$message('上传的文件重复，请重新选择');
                return
            }
            for (let i = 0; i < list.length; i++) {
                this.repeatPhotoList.push(list[i].originName);
                this.initStructureLists = JSON.parse(JSON.stringify(this.initStructureList));
                this.initStructureListCopy = JSON.parse(JSON.stringify(this.initStructureList));
                this.initStructureLists.apart_img.field_value = list[i].upURL;
                // 将数据push到新数组中
                this.photoListArr.push(this.initStructureLists);
                // 将数据push到源数组中，和新数组保持一致
                this.hosuePhotoCopy.push(this.initStructureListCopy);
            }
            this.errorScroll()
        },
        /**
         * 滚动条滚动
         * @param {string} element 元素
         */
        errorScroll() {
            let dom = document.querySelector('.photo-box');
            if (dom && dom.clientHeight) {
                let timer = null;
                let scrollTopNum = dom.clientHeight;
                clearInterval(timer);
                timer = setInterval(() => {
                    document.querySelector('.house-photo-list').scrollTop = scrollTopNum * this.photoListArr.length;
                    clearInterval(timer);
                }, 10);
            }
        },
        // 获取增加初始化结构
        async initStructure() {
            try {
                let params = {
                    page_id: 6,
                    task_id: this.$route.query.taskId || ''
                }
                let result = await commonApi.getPageModuleData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.initStructureList = data.data.house_type_detail_imgs.data;
                    this.addHouseAPi();
                } else {
                    this.$message(data.msg);
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 初始化数据
        async addHouseAPi() {
            let result;
            let params;
            try {
                if (!this.$route.query.houseTypeId) {
                    params = {
                        page_id: 6,
                        task_id: this.$route.query.taskId || ''
                    }
                    result = await commonApi.getPageModuleData(params);
                } else {
                    params = {
                        project_id: this.$route.query.projectId,
                        task_id: this.$route.query.taskId,
                        house_type_id: this.$route.query.houseTypeId
                    }
                    result = await addHouseAPi.initHouseDetailData(params);
                }
                let { data } = result
                if (data.code === 0) {
                    // 户型图集
                    if (!this.$route.query.houseTypeId) {
                        this.photoListArr = [];
                    } else {
                        this.photoListArr = data.data.house_type_detail_imgs.data;
                    }
                    this.photoListModuleName = data.data.house_type_detail_imgs.module_name;
                    // 户型基础信息
                    this.houseInitInfo = data.data.house_type_base_detail.data;
                    this.houseInitModuleName = data.data.house_type_base_detail.module_name;
                    // 户型动销信息
                    this.houseDynameicInfo = data.data.house_type_movable_pin_detail.data;
                    this.houseDynameicModuleName = data.data.house_type_movable_pin_detail.module_name;
                    if (!this.$route.query.houseTypeId || this.houseDynameicInfo.payment_ratio.field_value === '') {
                        this.houseDynameicInfo.payment_ratio.field_value = this.paymentRatio;
                    }
                    // 保存初始化单价
                    this.initOfferPriceCopy = JSON.parse(JSON.stringify(this.houseDynameicInfo.offer_price.field_value));
                    this.houseDynameicInfo.offer_price.field_value = yuanToWan(this.houseDynameicInfo.offer_price.field_value);
                    this.houseDynameicInfo.price.field_value = yuanToWan(this.houseDynameicInfo.price.field_value);
                    // 户型解析
                    if (data.data.house_type_analysis) {
                        this.houseParseInfo = data.data.house_type_analysis.data;
                        this.houseParseModuleName = data.data.house_type_analysis.module_name;
                    }
                    // 拷贝一份源数据
                    this.projectDataCopy = JSON.parse(JSON.stringify(data.data));
                    if (!this.$route.query.houseTypeId) {
                        this.hosuePhotoCopy = [];
                    } else {
                        this.hosuePhotoCopy = this.projectDataCopy.house_type_detail_imgs.data;
                    }
                    // 拼接成数组
                    this.hosueDataArrConcat.push(this.projectDataCopy.house_type_base_detail.data);
                    this.hosueDataArrConcat.push(this.projectDataCopy.house_type_movable_pin_detail.data);
                    this.hosueDataArrConcat.push(this.projectDataCopy.house_type_analysis.data);
                } else {
                    this.$message(data.msg);
                }
            }
            catch(error) {

            }
        },
        // 敏感词校验
        async checkSensitiveWordsInfo () {
            let str = '';
            //拷贝户型解析数据
            this.houseParseInfoCopy = JSON.parse(JSON.stringify(this.houseParseInfo));
            // 删除户型标签
            this.$delete(this.houseParseInfoCopy, 'house_tag');
            for(let i in this.houseParseInfoCopy) {
                str += this.houseParseInfoCopy[i].field_desc + '$' + this.houseParseInfoCopy[i].field_value + '|||';
            }
            str = str.substr(0, str.length - 3);
            try {
                let params = {
                    str,
                    is_create_project: 2,
                    city_id: this.cityId,
                    project_id: this.$route.query.projectId
                };
                let result = await addHouseAPi.checkSensitiveWordsData(params);
                let { data } = result;
                if (data.code === 200) {
                    Promise.resolve(true);
                } else {
                    this.$message(data.msg);
                    return false;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 获取关联楼栋下拉
        async getRelatedBuildingSel() {
            try {
                let params = {
                    project_id: this.$route.query.projectId,
                    task_id: this.$route.query.taskId
                };
                let result = await commonApi.getProjectBuildingListdata(params);
                let { data } = result;
                if (data.code === 0) {
                    this.getRelatedBuildingOpiton = data.data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * @description: 关联楼栋选择，全选操作
         * @param {Array} vals   选中的值 
         * @return {type} 
         */
        buildingChange(vals) {
            if (vals[vals.length - 1] === '-1') {
                // 如果选择的是全部则将其余全部数据赋值
                const options = this.getRelatedBuildingOpiton.map(ele => {
                    if (ele.id !== '-1') {
                        return ele.id;
                    }
                });
                this.houseDynameicInfo.relation_buildings.field_value = options;
                this.$refs['relationBuilds'].blur();
            }
        },
        // 获取户型类型
        async getHouseTypeList() {
            try {
                let params = {
                    project_id: this.$route.query.projectId
                };
                let result = await addHouseAPi.getHouseTypeData(params);
                let { data } = result;
                if (data.code === 0) {
                    this.getHosueTypeDataList = data.data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * 户型居室联动
         * @param {string} roomVal 室的val
         * @param {object} item 当前的户型所在的对象
         */
        houseRoomLinkage(roomVal, item) {
            if (roomVal <= 5 && roomVal > 1) {
                this.$set(item, 'field_value', Number(roomVal));
            } else if (roomVal > 5) {
                this.$set(item, 'field_value', 5);
            }
        },
        /**
         * 拼接信息来源信息
         * @param {object} originInfo 信息来源
         * @param {string} originInfo.belong_datetime 信息来源操作时间
         * @param {string} originInfo.belong_employee_name 信息来源操作人
         * @param {string} originInfo.belong_employee_id 信息来源操作人工号
         * @return {string} 信息来源操作信息
         */
        spliceInfoOrigin({ belong_datetime, belong_employee_name, belong_employee_id }) {
            return belong_datetime === '' ? '' : this.filterDate(belong_datetime) + ' ' + belong_employee_name + '-' + belong_employee_id;
        },
        /**
         * 时间戳转换为年月日格式
         * @param {string} para 时间、默认不取毫秒，即后三位毫秒为0
         * @param {string} type 要转换的格式 例如'YYYY-MM-DD HH:mm:ss'
         * @return 传入的时间格式
         */
        filterDate(para) {
            return para === '' ? '' : moment(para * 1000).format('YYYY-MM-DD HH:mm:ss');
        },
        // 户型图集滚动吸顶
        photoIsFixed() {
            let elOffSetTop = document.querySelector('.house-photo-list').offsetTop;
            // 得到页面滚动的距离
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            // 判断页面滚动的距离是否大于吸顶元素的位置
            this.isFixed = scrollTop > elOffSetTop;
        },
        // 获取楼盘基本信息
        async getProjcetInitInfo() {
            try {
                let params = {
                    project_id: this.$route.query.projectId,
                    task_id: this.$route.query.taskId
                };
                let result = await commonApi.getProjectBaseInfo(params);
                let { data } = result;
                if (data.code === 0) {
                    this.projectType = data.data.project_type;
                    this.lendRate = data.data.lend_rate;
                    this.lendYear = data.data.lend_year;
                    // 根据楼盘业态是否展示户型类型
                    if (this.projectType == 1 || this.projectType == 2 || this.projectType == 3) {
                        this.isShowHouseType = true;
                    } else {
                        this.isShowHouseType = false;
                    }
                    this.projectNameVal = data.data.name;
                    // 系统配置的首付比例
                    this.paymentRatio = data.data.payment_ratio;
                }                
            }
            catch(error) {
                console.log(error);
            }
        },
        /**
         * 点击图片打开预览
         * @param {string} imgurl 图片地址
         */
        openPhotoViewer(imgUrl) {
            this.urlList = [];
            this.urlList.push(imgUrl);
            this.PhotoIsShow = true;
        },
        /**
         * 点击model关闭预览
         * @param {boolean} val 关闭预览
         */
        closeViewer(val) {
            this.PhotoIsShow = val;
        }
    },
    components: {
        InfoOrigin,
        MsgDialog,
        copyHouseType
    }
}
</script>

<style lang="less" scoped>
.content-box {
    padding: 15px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 7px;
    .header-title-box {
        margin-top: 20px;
        h2 {
            font-size: 16px;
            margin-bottom: 20px;
        }
        
    }
    .content-list-box {
        display: flex;
        flex-direction: row;
        margin-top: 20px;
        // 户型图集
        .photo-box-list {
            width: 30%;
            margin-right: 20px;
            .house-photo-list{
                height: 400px;
                overflow-y: auto;
                overflow-x: hidden;
                .header-contnet {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    width: 89%;
                    border-bottom: 1px #ccc solid;
                    padding-bottom: 10px;
                    h3 {
                        box-sizing: border-box;
                        margin-top: 5px;
                    }
                }
                .content-photo-list {
                    width: 100%;
                    .number-input-box {
                        width: 86%;
                        display: inline-block;
                    }
                    .photo-uploads {
                        width: 80px;
                        height: 30px;
                        background: #409EFF;
                        color: #fff;
                        text-align: center;
                        line-height: 30px;
                        margin: 10px 0;
                        cursor: pointer;
                    }
                }
                
                /deep/ .btn-del {
                    float: right;
                    margin-right: 20px;
                }
                /deep/ .el-input__inner {
                    padding-left: 15px;
                }
            }
        }
        .is-fixed{
            position: fixed;
            top: 120px;
            width: 26%;
        }
        // 户型基础信息
        .house-info-list {
            flex: 1;
            .header-contnet {
                h3 {
                    float: left;
                    width: 40%;
                    border-bottom: 1px #ccc solid;
                    padding-bottom: 10px;
                    box-sizing: border-box;
                    margin-right: 20px;
                }
                p {
                    width: 50%;
                    float: left;
                    font-size: 14px;
                }
            }
            .form-list-box {
                margin-top: 15px;
                /deep/ .el-form-item__content {
                    display: flex;
                    flex-direction: row;
                }
                .form-input-box {
                    width: 37%;
                    display: flex;
                    flex-direction: row;
                    /deep/ .el-checkbox-group {
                        width: 90%;
                    }
                    /deep/ .el-checkbox {
                        margin-right: 15px;
                    }
                    /deep/ .el-radio-group {
                        line-height: 51px;
                    }
                    /deep/ .el-col-1 {
                        margin-right: 5px;
                    }
                    .number-input-box {
                        width: 85%;
                        margin-right: 4px;
                        /deep/ .el-input__inner {
                            padding: 0 0 0 10px;
                        }
                    }
                    /deep/ .hosue-num {
                        width: 80%;
                    }
                    /deep/ .el-textarea {
                        width: 80%;
                    }
                    /deep/ .el-textarea__inner {
                        min-height: 100px !important;
                    }
                }
            }
        }
        .el-icon-warning {
            color: #ff6e0e;
            font-size: 20px;
            margin-top: 10px;
            margin-left: 6px;
        }
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: #F5F5F5;
    }
    
    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
    }
    
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background: rgba(196, 195, 195, 0.7);
    }
    /* 清除浮动 */
    .clear-float-box:after {
        display:block;
        clear:both;
        content:"";
        visibility:hidden;
        height:0;
    }
    .relative-building {
        width: 250px;
    }
}
</style>