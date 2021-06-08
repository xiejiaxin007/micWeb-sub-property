<!--
 * @author: kangxue
 * @Date: 2020-09-18 10:04:11
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-05 11:12:42
 * @description: 选择关联楼栋组件，可以选择全部；
-->
<template>
    <el-select class="no-shake-select"
        ref="relationBuilds"
        multiple
        v-model="buildings"
        @change="changeBuildings"
        @remove-tag="removeBuildings"
        placeholder="请选择">
        <el-option v-if="buildingOptions && buildingOptions.length > 0"
            label="全部"
            value="-1">
        </el-option>
        <el-option v-for="(item, idx) in buildingOptions"
            :key="idx"
            :label="item.text"
            :disabled="item.disabled"
            :value="item.id">
        </el-option>
    </el-select>
</template>

<script>
import { commonFun } from '@/assets/js/utils/utils';
export default {
    name: 'select-building',
    props: {
        // v-model
        value: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 下拉数组
        options: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    watch: {
        // v-model的绑定
        value: {
            handler: function(val, oldval) {
                this.buildings = this.value;
            },
            immediate: true
        },
        // 选择楼栋的值改变父组件的v-model能获取到值
        buildings: {
            handler: function (val, oldval) {
                this.$emit('input', this.buildings);
            }
        },
        // 监听下拉
        options: {
            handler: function(val, oldval) {
                this.buildingOptions = commonFun.deepClone(val);
            },
            deep: true,
            immediate: true
        },
        
    },
    data() {
        return {
            // 楼栋
            buildings: [],
            // 楼栋下拉
            buildingOptions: []
        };
    },
    methods: {
        /**
         * @description: 切换楼栋
         * @param {type} vals  选中楼栋的值
         * @return {type}
         */
        changeBuildings(vals) {
            if (vals[vals.length - 1] === '-1') {
                // 如果选择的是全部则将其余全部数据赋值
                let allBuildings = [];
                for (var i = 0; i < this.buildingOptions.length; i++) {
                    let ele = this.buildingOptions[i];
                    // 虽然禁用但是是本身就有的值（放量计划与楼盘概况中互斥选择楼栋的下拉，被选中的值也是被禁用的，所以要把这些被选中的值也加进去）
                    if (ele.disabled && this.buildings.indexOf(ele.id) !== -1) {
                        allBuildings.push(ele.id);
                    }
                    if (!ele.disabled) {
                        allBuildings.push(ele.id);
                    }
                }
                this.buildings = allBuildings;
                this.$emit('change', allBuildings);
                this.$refs['relationBuilds'].blur();
            } else {
                this.$emit('change', vals);
            }
        },
        /**
         * @description: 删除选择的楼栋标签
         * @param {String} val  要删除的楼栋的值
         * @return {type}
         */
        removeBuildings(val) {
            this.$emit('remove-tag', val);
        }
    }
};
</script>

<style>
</style>