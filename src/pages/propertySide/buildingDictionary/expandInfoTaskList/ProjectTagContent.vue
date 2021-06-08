<template>
<div class="property-box">
        <div class="modal-title-box header-title-box">
            <h3 class="title-content">
                楼盘标签内容
                <el-button
                    class="tag-btn"
                    type="text"
                    @click="gotoProjectTag('manageTag')">
                    管理楼盘标签
                </el-button>
            </h3>
            <p>
                <el-tooltip placement="top">
                    <div slot="content">
                        1、建筑形式或业态：
                        <br />
                        · 楼盘便签中关于建筑类型或业态的标签只要有非售罄的建筑类型和业态满足即可选择，目前定义为相对静态字段户型：户型标签的选取规则(大户精品、改善宜居、紧凑实用、小户型)：见各城市个性化内容
                        <br />
                        2、社区特色：
                        <br />
                        （1）学校、幼儿园、商场、医院、高尔夫、公园、高校：3公里内。
                        <br />
                        （2）部分标签的定义
                        <br />
                        · 高绿化率：依据不同物业类型的值确定是否选择：别墅≥40%，住宅≥35%，商办类≥30%（深圳：住宅>30%，商办>30%，天津：别墅≥50%，住宅≥45%，商办>30%）
                        <br />
                        · 低密社区：依据不同物业类型的容积率的值确定是否选择：别墅≤1，住宅≤3 (天津≤1.5)，商办类不选低密社区
                        <br />
                        · 带装修：项目有带装修或是非毛坯的房源时选择
                        <br />
                        · 品牌地产：当开发商为全国或当地的知名开发商时选择(不确定当地某开发商是否是品牌地产时可咨询线下）
                        <br />
                        · 准现房：房屋主体已基本封顶完工，工程正处在内外墙装修和进行配套施工阶段的房屋
                        <br />
                        · 河景/海景地产/江景地产/ 湖景地产/公园地产：项目与江、河、湖、海和公园的距离在1公里范围内
                    </div>
                    <i class="el-icon-warning"
                        aria-hidden="true"></i>
                </el-tooltip>
            </p>
        </div>
        <div class="content-box">
            <p>
                <el-button
                    type="text"
                    @click="gotoProjectTag('pepleEnter')">
                    人工录入标签和系统计算标签管理
                </el-button>
            </p>
            <div>
                <el-form
                    label-width="120px"
                    ref="subForm">
                    <el-form-item
                        v-for="tag in allTagsList"
                        :key="tag.type_id"
                        :label="tag.type_name">
                        <el-checkbox-group
                            v-if="tag.checked"
                            v-model="tagsChosen[tag.type_id].value">
                            <el-checkbox
                                v-for="data in tag.tags"
                                :key="data.id"
                                :label="data.id">
                                {{data.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                        <el-radio-group
                            v-else
                            v-model="tagsChosen[tag.type_id].value">
                            <el-radio
                                v-for="data in tag.tags"
                                :key="data.id"
                                :label="data.id">
                                {{data.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
        </div>
  </div>
</template>

<script>
import propertyApi from '../api/propretyOverview';
export default {
    props:{
        projectTagContentList: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            // 保存时的数据
            checkList: [],
            // tags
            allTagsList: [],
            // 默认选中值
            tagsChosenObj: {},
            // 组装的默认选中值
            tagsChosen: {}
        }
    },
    mounted() {
        this.projectTagData();
        this.tagsChosenObj = this.projectTagContentList.field_value;

    },
    methods: {
        // 保存时向父页面提交值
        pushDataToParent() {
            this.checkList = [];
            // 组装选中tag项
            Object.keys(this.tagsChosen).forEach(key => {
                if (!this.tagsChosen[key].checked && this.tagsChosen[key].value) {
                    // 单选项
                    this.checkList.push(this.tagsChosen[key].value);
                } else if (this.tagsChosen[key].checked) {
                    // 多选项
                    this.checkList = this.checkList.concat(this.tagsChosen[key].value)
                }
            });
            let arrList = new Set(this.checkList);
            this.checkList = Array.from(arrList);
            this.checkList.forEach((item,index) => {
                if (item == -999) {
                    this.checkList.splice(index, 1);
                }
            })
            return {
                newData: this.checkList
            }
        },
        /**
         * 跳转到管理楼盘标签
         * @param {string} type 跳转类型
         */
        gotoProjectTag(type) {
            if (type === 'manageTag') {
                window.open('/index.php?r=cj-tag%2Findex');
            } else {
                window.open(`/index.php?r=yw-projects%2Fview-others&project_id=${this.$route.query.projectId}`);
            }
        },
        // 组装选中标签
        matchChosen() {
            const list = this.tagsChosenObj;
            this.allTagsList.forEach(taglist => {
                let checked = taglist.checked;
                let tagObj = list[taglist.type_id] ? list[taglist.type_id].values : '';
                if (checked) {
                    // 多选
                    let values = [];
                    // 判断是否是数组
                    if (Array.isArray(tagObj)) {
                        values = tagObj.map(tag => {
                            return tag.value;
                        });
                    }
                    this.$set(this.tagsChosen, taglist.type_id, {
                        value: values,
                        obj: tagObj || [],
                        checked: checked
                    });
                } else {
                    // 单选
                    this.$set(this.tagsChosen, taglist.type_id, {
                        value: tagObj ? tagObj.value : '',
                        obj: tagObj || {},
                        checked: checked
                    });
                }
            });
        },
        // 获取复选/单选数据
        async projectTagData() {
            try {
                let params = { project_id: this.$route.query.projectId };
                let result = await propertyApi.projectTagData(params);
                let { data } = result;
                if (data.code === 0) {
                    // 获取标签选项
                    this.allTagsList = data.data;
                    // 组装默认选中项
                    this.matchChosen();
                }
            }
            catch(error) {
                console.log(error);
            }
        }
    }
}
</script>

<style lang="less" scoped>
.property-box {
    .header-title-box {
        margin-top: 20px;
        justify-content: start;
        .tag-btn {
            margin-left: 20px;
        }
        .el-icon-warning {
            color: #ff6e0e;
            font-size: 20px;
            margin-left: 6px;
        }
    }
    /deep/ .el-radio {
        height: 30px;
        line-height: 30px;
    }
}
</style>