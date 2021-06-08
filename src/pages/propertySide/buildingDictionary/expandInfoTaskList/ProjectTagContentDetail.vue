<template>
  <div class="property-box">
        <div class="modal-title-box">
            <h3 class="title-content">楼盘标签内容</h3>
        </div>
        <div class="content-box">
            <div>
                <el-form
                    label-width="120px"
                    ref="subForm">
                    <el-form-item
                        v-for="tag in allTagsList"
                        :key="tag.type_id"
                        :label="`${tag.type_name}:`">
                        <p>{{ tag.tagName.join('，') }}</p>
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
            tagsChosenObj: {}
        }
    },
    mounted() {
        this.projectTagData();
        this.tagsChosenObj = this.projectTagContentList.field_value;
    },
    methods: {
        // 组装选中数据
        initTagData() {
            this.allTagsList.forEach(tagList => {
                let valArr = [];
                let tag = this.tagsChosenObj[tagList.type_id];
                if (tagList.checked) {
                    // 多选
                    if (tag && Array.isArray(tag.values)) {
                        valArr = tag.values.map(item => {
                            return item.name;
                        });
                    }
                    this.$set(tagList, 'tagName', valArr);
                } else {
                    // 单选
                    let val = tag && tag.values ? tag.values.name : '';
                    valArr.push(val);
                    this.$set(tagList, 'tagName', valArr);
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
                    this.initTagData();
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
    .modal-title-box {
        margin-top: 20px;
    }
}
</style>