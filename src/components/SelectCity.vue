<!--
 * @author: kangxue
 * @Date: 2021-02-19 10:12:48
 * @LastEditors: kangxue
 * @LastEditTime: 2021-02-23 11:28:29
 * @description: 选择城市组件，增加了全部，选择后会选中所有城市
-->
<template>
    <el-select v-model="city"
        placeholder="请选择城市"
        class="no-shake-select"
        multiple
        :collapse-tags="!showMore"
        clearable
        :filterable="filterable"
        @change="cityChange"
        ref="selectCity">
        <el-option v-if="cityList && cityList.length > 0"
            label="全部"
            value="-1">
        </el-option>
        <el-option v-for="item in cityList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
        </el-option>
    </el-select>
</template>

<script>
import commonApi from '@/api/commonApi';
export default {
    props: {
        // 子组件v-model的绑定，不限制输入
        value: {
            default: () => {
                return []
            }
        },
        // 是否展示所有标签
        showMore: {
            type: Boolean,
            default: false
        },
        // 是否可以搜索
        filterable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 城市
            city: [],
            // 城市下拉
            cityList: []
        };
    },
    watch: {
        city: {
            handler: function (val) {
                this.$emit('input', val)
            },
            deep: true
        },
        value: {
            handler: function (val) {
                this.city = val
            },
            deep: true,
            immediate: true
        },
    },
    mounted() {
        this.getCityList();
    },
    methods: {
        // 获取城市列表
        async getCityList() {
            try {
                let params = {
                    type: 2,
                    param: 'withAll,noAll'
                };
                const {
                    data: { code, msg, data }
                } = await commonApi.getDetailCityListData(params);
                if (code === 0) {
                    this.cityList = data.list;
                } else {
                    this.$message.error(msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description: 城市下拉选择，全选操作
         * @param {Array} vals   选中的值
         * @return {type}
         */
        cityChange(vals) {
            if (vals[vals.length - 1] === '-1') {
                // 如果选择的是全部则将其余全部数据赋值
                const options = this.cityList.map(ele => {
                    if (ele.value !== '-1') {
                        return ele.value;
                    }
                });
                this.city = options;
                this.$refs['selectCity'].blur();
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>