<!--
 * @author: kangxue
 * @Date: 2020-09-16 14:09:17
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-22 14:37:43
 * @description: 新增高质量信息源
-->
<template>
    <div class="edit-box">
        <!--面包屑导航-->
        <el-breadcrumb class="bread-crumb-box"
            separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/building/QualityList' }">高质量信息源配置</el-breadcrumb-item>
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="form-box">
            <div class="main-title">{{title}}高质量信息源配置</div>
            <el-form ref="form"
                :model="form"
                :rules="rules"
                v-loading="loading"
                label-width="200px">
                <el-form-item label="城市"
                    prop="cityId">
                    <search-select-radio v-model="form.cityId"
                        :isDisabled="isEdit"
                        class="input-width"
                        placeholder="请选择"
                        :chosenObj="chosenCity"
                        :apiInfo="cityApi">
                    </search-select-radio>
                </el-form-item>
                <el-form-item label="字段所属页面"
                    prop="pageId">
                    <el-select v-model="form.pageId"
                        placeholder="请选择"
                        :disabled="isEdit"
                        class="input-width">
                        <el-option v-for="item in pageList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段名称"
                    prop="fieldId"
                    v-if="form.cityId && form.pageId">
                    <el-select v-model="form.fieldId"
                        placeholder="请选择"
                        filterable
                        :disabled="isEdit"
                        class="input-width">
                        <el-option v-for="item in fieldList"
                            @click.native="changefield(item)"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段属性"
                    v-if="form.pageId && form.fieldId">
                    {{attribute}}
                </el-form-item>
                <el-form-item label="高质量信息源"
                    prop="sourceRelation">
                    <search-select-radio v-model="form.sourceRelation"
                        class="input-width no-shake-select"
                        placeholder="请选择"
                        multiple
                        :chosenObj="chosenSource"
                        :apiInfo="sourceApi">
                    </search-select-radio>
                </el-form-item>
                <el-form-item label="竞对准确率阀值"
                    prop="accuracy">
                    <el-input-number v-model="form.accuracy"
                        :min="1"
                        :max="100"
                        :precision="0"></el-input-number>
                    <span class="unit">%</span>
                    <div class="big-data"
                        v-if="isEdit && bigData.accuracy_threshold">
                        <div class="info">
                            <span v-for="(item, key) in bigData.accuracy_threshold.info"
                                :key="key">{{item}}</span>
                        </div>
                        <div class="time">{{bigData.accuracy_threshold.big_datetime}}</div>
                    </div>
                </el-form-item>
                <el-form-item label="居理高质量源字段底线值"
                    prop="baseLine">
                    <el-input-number v-model="form.baseLine"
                        :min="1"
                        :max="99999999"
                        :precision="0"></el-input-number>
                    <div class="big-data left-padding"
                        v-if="isEdit && bigData.baseline_value">
                        <div class="info">
                            <span v-for="(item, key) in bigData.baseline_value.info"
                                :key="key">{{item}}</span>
                        </div>
                        <div class="time">{{bigData.baseline_value.big_datetime}}</div>
                    </div>
                </el-form-item>
                <el-form-item label="居理高质量源字段占比"
                    prop="fieldScale">
                    <el-input-number v-model="form.fieldScale"
                        :min="1"
                        :max="100"
                        :precision="0"></el-input-number>
                    <span class="unit">%</span>
                    <div class="big-data"
                        v-if="isEdit && bigData.field_scale">
                        <div class="info">
                            <span v-for="(item, key) in bigData.field_scale.info"
                                :key="key">{{item}}</span>
                        </div>
                        <div class="time">{{bigData.field_scale.big_datetime}}</div>
                    </div>
                </el-form-item>
                <el-form-item label="高质量源匹配竞对字段底线值"
                    prop="fieldBaseLine">
                    <el-input-number v-model="form.fieldBaseLine"
                        :min="1"
                        :max="99999999"
                        :precision="0"></el-input-number>
                    <div class="big-data left-padding"
                        v-if="isEdit && bigData.field_baseline_value">
                        <div class="info">
                            <span v-for="(item, key) in bigData.field_baseline_value.info"
                                :key="key">{{item}}</span>
                        </div>
                        <div class="time">{{bigData.field_baseline_value.big_datetime}}</div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <router-link class="router-link"
                        :to="{path: '/building/QualityList'}">
                        <el-button>取消</el-button>
                    </router-link>
                    <el-button type="primary"
                        @click="save">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { SearchSelectRadio } from '@/components';
import api from '../api/autoMaintenance';
import commonApi from '../api/common';
export default {
    components: {
        SearchSelectRadio
    },
    data() {
        return {
            // 编辑ID，创建无id
            id: this.$route.query.id,
            // 标题展示
            title: this.$route.name === 'addQualityInfo' ? '新增' : '编辑',
            // 是否是编辑状态
            isEdit: this.$route.name === 'editQualityInfo',
            // 编辑初始化加载，保存加载
            loading: false,
            // 表单
            form: {
                // 城市ID
                cityId: '',
                // 页面ID
                pageId: '',
                // 字段ID
                fieldId: '',
                // 高质量信息源
                sourceRelation: [],
                // 竞对准确率阀值，定义为undefined，数字输入框才会展示未空
                accuracy: undefined,
                // 居理高质量源字段底线值
                baseLine: undefined,
                // 居理高质量源字段占比
                fieldScale: undefined,
                // 高质量源匹配竞对字段底线值
                fieldBaseLine: undefined
            },
            // 表单校验规则
            rules: {
                cityId: [{ required: true, message: '城市不能为空', trigger: 'change' }],
                pageId: [{ required: true, message: '字段所属页面不能为空', trigger: 'change' }],
                fieldId: [{ required: true, message: '字段名称不能为空', trigger: 'change' }],
                sourceRelation: [{ required: true, message: '高质量信息源不能为空', trigger: 'blur' }],
                accuracy: [{ required: true, message: '竞对准确率阀值不能为空', trigger: 'change' }]
            },
            // 城市远程下拉
            cityApi: {
                api: commonApi.getBusinessCity,
                params: {
                    q: ''
                }
            },
            // 字段所属页面下拉
            pageList: [],
            // 字段名称下拉
            fieldList: [],
            // 字段属性
            attribute: '',
            // 高质量信息源api
            sourceApi: {
                api: api.getQualityList,
                params: {
                    q: ''
                }
            },
            // 大数据展示
            bigData: {},
            // 是否重复提交
            isSubmit: false,
            // 编辑初始化城市数据
            chosenCity: {},
            // 编辑初始化高质量信息源数据
            chosenSource: []
        };
    },
    computed: {
        // 获取字段下拉参数
        params: function() {
            return {
                page_id: this.form.pageId,
                city_id: this.form.cityId
            };
        }
    },
    watch: {
        // 参数变化影响下拉
        'params': {
            handler: function(newVal, oldVal) {
                this.getFieldList();
            },
            deep: true
        },
    },
    mounted() {
        this.getConfig();
        this.getFieldList();
        if (this.id) {
            this.initData();
        }
    },
    methods: {
        // 获取配置下拉
        async getConfig() {
            let params = {
                type: [48]
            };
            try {
                const {
                    data: { code, data }
                } = await commonApi.getProjectConfigData(params);
                if (code === 0) {
                    this.pageList = data.page_list ? data.page_list : [];
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 获取字段名称下拉
        async getFieldList() {
            if (!this.isEdit) {
                this.form.fieldId = '';
                this.attribute = '';
            }
            if (!this.form.pageId || !this.form.cityId) {
                return;
            }
            let params = {
                page_id: this.form.pageId,
                city_id: this.form.cityId
            };
            if (this.isEdit) {
                params.field_config_id = this.id;
            }
            try {
                const {
                    data: { code, msg, data }
                } = await api.getWordName(params);
                if (code === 0) {
                    this.fieldList = data.list || [];
                } else {
                    // 请求错误置为空数组，不要展示上一次请求数据
                    this.fieldList = [];
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
                this.fieldList = [];
            }
        },
        /**
         * @description: 切换字段时，获取字段属性
         * @param {object} item  字段数据
         * @return {type}
         */
        changefield(item) {
            this.attribute = item.attribute_type;
        },
        // 编辑初始化数据
        async initData() {
            try {
                this.loading = true;
                const {
                    data: { code, msg, data }
                } = await api.initSourceConfig({
                    field_config_id: this.id
                });
                if (code === 0) {
                    let fieldData = data.field_data;
                    let source_config_id = fieldData.source_config_id.map(function(item) {
                        return item.value;
                    });
                    this.form = {
                        cityId: fieldData.city_id,
                        pageId: fieldData.page_id,
                        fieldId: fieldData.field_id,
                        sourceRelation: source_config_id,
                        accuracy: fieldData.accuracy_threshold,
                        baseLine: Number(fieldData.baseline_value) ? Number(fieldData.baseline_value) : undefined,
                        fieldScale: Number(fieldData.field_scale) ? Number(fieldData.field_scale) : undefined,
                        fieldBaseLine: Number(fieldData.field_baseline_value) ? Number(fieldData.field_baseline_value) : undefined
                    };
                    this.attribute = fieldData.attribute_type;
                    this.chosenCity = fieldData.city_arr;
                    this.chosenSource = fieldData.source_config_id;
                    this.bigData = data.big_data;
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.$message.error(msg);
                }
            } catch (err) {
                this.loading = false;
            }
        },
        // 保存配置
        save() {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    if (this.isSubmit) {
                        return false;
                    }
                    this.isSubmit = true;
                    try {
                        let params = {
                            city_id: this.form.cityId,
                            page_id: this.form.pageId,
                            field_id: this.form.fieldId,
                            source_config_id: this.form.sourceRelation,
                            accuracy_threshold: this.form.accuracy,
                            baseline_value: this.form.baseLine,
                            field_scale: this.form.fieldScale,
                            field_baseline_value: this.form.fieldBaseLine
                        };
                        if (this.id) {
                            params.field_config_id = this.id;
                        }
                        const {
                            data: { code, msg }
                        } = await api.saveSourceConfig(params);
                        if (code === 0) {
                            this.$message({
                                message: '高质量源配置' + this.title + '成功',
                                type: 'success'
                            });
                            this.$router.push({
                                path: '/building/QualityList'
                            });
                            this.isSubmit = false;
                        } else {
                            this.$message.error(msg);
                            this.isSubmit = false;
                        }
                    } catch (err) {
                        this.isSubmit = false;
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.edit-box {
    padding: 0 30px;
}
.form-box {
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 7px;
    box-sizing: border-box;
    .input-width {
        width: 350px;
    }
}
.main-title {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
}
.unit {
    display: inline-block;
    width: 40px;
    padding-left: 10px;
    box-sizing: border-box;
}
.big-data {
    display: inline-block;
    padding-left: 20px;
    color: red;
    &.left-padding {
        padding-left: 60px;
    }
    .info {
        display: inline-block;
        min-width: 500px;
        span {
            padding-right: 30px;
        }
    }
    .time {
        display: inline;
    }
}
.router-link {
    display: inline-block;
    margin-right: 30px;
}
</style>