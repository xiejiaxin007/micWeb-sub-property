<!--
    @file: 检索地图获取经纬度
    @description: 检索地图获取经纬度
    @author: xiebin
    @date: 2019-12-11
-->
<template>
    <div class="item-list-box">
        <el-form-item :label="labelName" v-show="inputIsShow">
                <div class="form-input-box">
                    <el-input
                        v-model="projectPosValue"
                        placeholder="请输入"
                        :id="inputId"
                        @focus="getValue">
                    </el-input>
                </div>
        </el-form-item>
        <el-form-item>
            <div class="form-input-box">
                <div
                    :id="mapId"
                    class="map-style">
                </div>
            </div>
        </el-form-item>
    </div>
</template>

<script>
import loadMap from '@/assets/js/utils/map.js';
export default {
    name: 'BuildingMap',
    props: {
        // 地图容器ID
        mapId: {
            type: String,
            default: ''
        },
        // formItem label名字
        labelName: {
            type: String,
            default: ''
        },
        // input是否显示输入框
        inputIsShow: {
            type: Boolean,
            default: true
        },
        // input的id
        inputId: {
            type: String,
            default: ''
        },
        // 传来父组件绑定的值
        value: {
            type: String,
            default: ''
        },
        // 经纬度的类型
        type: {
            type: String,
            default: ''
        },
        // 售楼处经纬度的值
        warpWeptVal: {
            type: Object,
            default: () => {}
        },
        // 楼盘经纬度的值
        warpWeptValone: {
            type: Object,
            default: () => {}
        },
        isShow: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value: {
            handler: function (val, oldval) {
                this.projectPosValue = this.value;
            }
        },
        warpWeptVal: {
            handler: function(val) {
                this.setPositionLays();
            }
        },
        warpWeptValone: {
            handler: function(val) {
                this.setPositionLays();
            }
        },
        isShow: {
            handler: function(val) {
                if (val) {
                    this.resizeMapPosition();
                }
            }
        }
    },
    data () {
        return {
        projectPosValue: '',
        setProjectMap: null
        }
    },
    mounted() {
        this.projectPosValue = this.value;
        // 初始化地图
        this.$nextTick(()=>{
            loadMap.loadMap().then((BMap) => {
                this.init(BMap)
            })
        })
    },
    methods: {
        init(BMap) {
            this.setProjectMap = new BMap.Map(this.mapId);
             let autoCom = new BMap.Autocomplete({
               'input': this.inputId
             });
            if (this.type === 'salesOffPosition') {
                this.setProjectMap.centerAndZoom(new BMap.Point(this.warpWeptVal.lngVal, this.warpWeptVal.latVal), 15);
                let initMarker = new BMap.Marker(new BMap.Point(this.warpWeptVal.lngVal, this.warpWeptVal.latVal));
                this.setProjectMap.addOverlay(initMarker);
                this.setProjectMap.panTo(new BMap.Point(this.warpWeptVal.lngVal, this.warpWeptVal.latVal));
            } else if (this.type === 'project') {
                this.setProjectMap.centerAndZoom(new BMap.Point(this.warpWeptValone.lngVal, this.warpWeptValone.latVal), 15);
                let initMarker = new BMap.Marker(new BMap.Point(this.warpWeptValone.lngVal, this.warpWeptValone.latVal));
                this.setProjectMap.addOverlay(initMarker);
                this.setProjectMap.panTo(new BMap.Point(this.warpWeptValone.lngVal, this.warpWeptValone.latVal));
            }
            // 开启滚轮缩放
            this.setProjectMap.enableScrollWheelZoom();
                this.setProjectMap.addEventListener('click', this.showInfo);
            autoCom.setInputValue(this.projectPosValue);
        },
        // 重新定位中心点，因为弹窗隐藏后地图容器宽度是0，所以重新显示弹窗时，中心点会偏移到左上角
        resizeMapPosition() {
            var that = this;
            var time = 1;
            this.setProjectMap.addEventListener("tilesloaded", function() {
                if (time === 1) {
                    that.setProjectMap.setCenter(new BMap.Point(that.warpWeptVal.lngVal, that.warpWeptVal.latVal));
                    time++;
                }
            })
        },
        // 获取当前搜索的名称
        getValue() {
            // 建立一个自动完成的对象
            let autoCom = new BMap.Autocomplete({
               'input': this.inputId,
            //    'location': this.setProjectMap
             });
            autoCom.setInputValue(this.projectPosValue);
            autoCom.addEventListener('onconfirm', (e)=> {
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    let valueObj = e.item.value;
                    let myValue =
                            valueObj.province +
                            valueObj.city +
                            valueObj.district +
                            valueObj.street +
                            valueObj.business;
                    this.projectPosValue = myValue;
                    this.$emit('input', this.projectPosValue)
                    this.setPlace(myValue);
                }
            })
        },
        /** 匹配经纬度
         * @param {string} para 要逆解析的地理名称 
        */
        setPlace(para) {
            let myFun = () => {
                let obj = {};
                let poi = local.getResults().getPoi(0).point;
                obj.lngVal = poi;
                if (this.type === 'salesOffPosition') {
                    obj.type = 'salesOffPosition';
                    this.$emit('getLngVal', obj);
                } else if (this.type === 'project') {
                    obj.type = 'project';
                    this.$emit('getLngVal', obj);
                }
            }
            let local = new BMap.LocalSearch(this.setProjectMap, {
                onSearchComplete: myFun,
                renderOptions: {
                    map: this.setProjectMap
                }
            });
            local.search(para);
        },
        /** 添加地图标注
         * @param {string} e 当前在地图点击的参数集合
        */
        showInfo(e) {
            if (this.inputIsShow) {
            let obj = {};
            this.setProjectMap.clearOverlays();
            let pointPosition = new BMap.Point(e.point.lng, e.point.lat);
            let markerPosition = new BMap.Marker(pointPosition);
            this.setProjectMap.addOverlay(markerPosition);
            this.setProjectMap.panTo(pointPosition);
            obj.lngVal = e.point;
            if (this.type === 'salesOffPosition') {
                obj.type = 'salesOffPosition';
                this.$emit('getLngVal', obj);
            } else if (this.type === 'project') {
                obj.type = 'project';
                this.$emit('getLngVal', obj);
            }
            }
        },
        // 点击父页面定位的时候添加标注
        setPositionLays() {
            let pointPosition
            this.setProjectMap.clearOverlays();
            if (this.type === 'salesOffPosition') {
                pointPosition = new BMap.Point(this.warpWeptVal.lngVal, this.warpWeptVal.latVal);
            } else if (this.type === 'project') {
                pointPosition = new BMap.Point(this.warpWeptValone.lngVal, this.warpWeptValone.latVal);
            }
            let markerPosition = new BMap.Marker(pointPosition);
            this.setProjectMap.addOverlay(markerPosition);
            this.setProjectMap.panTo(pointPosition);
        }
    }
}
</script>

<style lang="less" scoped>
.item-list-box {
    width: 100%;
    .form-input-box {
         width: 47%;
        /deep/ .el-input {
            width: 90%;
        }
        .map-style {
            width: 90%;
            height: 400px;
        }
    }
}
</style>