<!--
 * @author: xiejiaxin
 * @Date: 2020-09-22 14:33:54
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-04-27 09:52:37
 * @description: 远程搜索下拉框
-->
<template>
    <div class="custom-search-input">
        <el-select
            v-model="selectModel"
            filterable
            remote
            :multiple="multiple"
            reserve-keyword
            :disabled="isDisabled"
            :placeholder="placeholder"
            :popper-append-to-body="isAppend"
            :remote-method="remoteMethod"
            :clearable="clearable"
            @change="changeOption"
            :loading="loading"
            @visible-change="visibleChangeSelect"
            :class="{'has-icon': JSON.stringify(isSlot) !== '{}'}"
            ref="searchRadioSelect">
            <i
                aria-hidden="true"
                v-if="JSON.stringify(isSlot) !== '{}'"
                slot="prefix"
                class="custion-prefix-slot">
                    <jl-icon-svg :icon-class="isSlot.icon"></jl-icon-svg>
                </i>
            <el-option
                v-for="item in options"
                @click.native="selectChange(item)"
                :key="item[listKey.key]"
                :label="item[listKey.keyWord]"
                :value="item[listKey.key]"
                :disabled="item.disabled"
            ></el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    name: "search-select-radio",
    data () {
        return {
            // 所有选项
            options: [],
            // 选中项
            selectModel: '',
            // 当前所在行的索引
            thisIndex: 0,
            // 是否在渲染
            mountedFlag: true,
            // 当前选中项
            thisObj: {},
            // loading动画开关
            loading: false,
            // focus触发次数
            focusIndex: 0,
            // 已经选中的数组
            hasChosenList: []
        }
    },
    props: {
        // 这个比较特殊，v-model的绑定，不限制输入
        value: {
            type: [String, Array],
            required: true
        },
        // 已经选中的下拉项数组
        chosenList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        // 是否将下拉嵌入html的body中
        isAppend: {
            type: Boolean,
            default: true
        },
        // 当前所在操作项
        checkKey: {
            type: String,
            default: ''
        },
        // 当前选中的index
        currentIndex: {
            type: Number,
            default: 0
        },
        // 请求的api类型
        apiInfo: {
            type: Object,
            required: true
        },
        // 默认选中项
        chosenObj: [Object, Array],
        // 默认提示语
        placeholder: {
           type: String,
           default: ''
        },
        // 是否被禁用
        isDisabled: {
            type: Boolean,
            default: false
        },
        // 是否添加删除按钮
        clearable: {
            type: Boolean,
            default: false
        },
        // 是否有自定义icon
        isSlot: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 作为一个标志位，如果这个值改变，代表需要让下拉框失去焦点
        isBlurByChange: {
            type: Boolean,
            default: false
        },
        // 自定义下拉对象关键字，例如id和text
        listKey: {
            type: Object,
            default: () => {
                return {
                    key: 'value',
                    keyWord: 'name'
                }
            }
        },
        // 是否多选
        multiple: {
            type: Boolean,
            default: false
        }
    },
    mounted () {
        this.selectModel = this.value
        this.thisIndex = this.currentIndex
        // 如果是单选，需要复制key
        if (!this.multiple) {
            // 给默认选中项给定key值
            if (JSON.stringify(this.chosenObj) === '{}') {
                this.chosenObj[this.listKey.key] = '';
                this.chosenObj[this.listKey.keyWord] = '';
            }
        }
        // 获取已经关联了的楼栋数组
        this.$nextTick(() => {
            if (!this.multiple) {
                if (this.chosenObj && this.chosenObj[this.listKey.key]) {
                    this.options.unshift(this.chosenObj)
                }
            } else {
                if(Array.isArray(this.chosenObj) && this.chosenObj.length > 0){
                    this.hasChosenList = this.chosenObj;
                    this.options = [...this.chosenObj]
                }
            }
            this.mountedFlag = false
        });
    },
    methods: {
        /**
         * 远程搜索
         * @param {String} query 关键字
         * @return {Promise}
         */
        async remoteMethod (query) {
            // 修改关键字
            if (JSON.stringify(this.apiInfo) === '{}') {
                return false;
            }
            this.apiInfo.params.q = query;
            let chosenArr = [];
            let len = this.chosenList.length;
            for (let i = 0; i < len; i++) {
                if (this.chosenList[i][this.listKey.key]) {
                    chosenArr.push(this.chosenList[i][this.listKey.key]);
                }
            }
            this.apiInfo.params.exclude = chosenArr;
            let api = this.apiInfo.api;
            try {
                const {
                    data: { code, data }
                } = await api(this.apiInfo.params);
                if (code === 0) {
                    if (Array.isArray(data.list)) {
                        if (data.list.length <= 0 && query == '') {
                            let arr = [{ disabled: true }];
                            arr[0][this.listKey.key] = 999;
                            arr[0][this.listKey.keyWord] = '没有更多数据了';
                            this.options = arr;
                        } else {
                            // 如果是多选
                            if (this.multiple) {
                                // 已经选中后，再次搜索，搜索的列表里面没有已经选中的值，需要再次填充到下拉中，否则会出现只展示ID的情况
                                if (Array.isArray(this.hasChosenList) && this.hasChosenList.length > 0) {
                                    this.hasChosenList.forEach(item => {
                                        let isHas = data.list.findIndex((v) => {
                                            return v[this.listKey.key] === item[this.listKey.key];
                                        })
                                        if (isHas === -1) {
                                            data.list.unshift(item);
                                        }
                                    });
                                }
                            } else {
                                if (this.chosenObj && this.chosenObj[this.listKey.key]) {
                                    let isHas = data.list.findIndex((v) => {
                                        return v[this.listKey.key] == this.chosenObj[this.listKey.key]
                                    })
                                    if (isHas == -1) {
                                        data.list.unshift(this.chosenObj)
                                    }
                                }
                            }
                            this.options = data.list
                        }
                    } else {
                        let arr = [{ disabled: true }];
                        arr[0][this.listKey.key] = 999;
                        arr[0][this.listKey.keyWord] = '没有更多数据了';
                        this.options = arr;
                    }
                } else {
                    this.options = [];
                }
                this.loading = false;
            } catch (error) {
                console.log(error);
                this.loading = false;
            }
        },
        /**
         * 下拉框选中事件
         * @param {String} item 选中的下拉对象
         * @return {Promise}
         */
        changeOption (item) {
            this.$emit('changeSelect', item);
        },
        // 下拉框展示时请求远程数据，不用focus是因为下拉多选的时候会一直触发focus方法
        visibleChangeSelect(val) {
            if(val) {
                this.remoteMethod('');
                this.$emit('selectFocus');
            }
        },
        // 切换下拉框点击item事件
        selectChange (item) {
            if (this.multiple) {
                this.hasChosenList.push(item);
                this.$emit('getOption', this.hasChosenList);
            } else {
                this.$emit('getOption', item);
            }
        },
        /**
         * @description: 通过value删除数组中的元素
         * @param {String|Number} val value值 
         * @param {Array} arr 操作的数组
         */    
        delByIndex(val, arr) {
            if (!Array.isArray(arr)) return false;
            let index = arr.findIndex(v => {
                return val === v.value;
            });
            if (index !== -1) {
                arr.splice(index, 1);
            }
        }
    },
    watch: {
        selectModel: {
            handler: function (val, oldval) {
                // 对比正在减少选项
                if (this.multiple && val.length < oldval.length) {
                    // 获取删除的值
                    let delVal = val.concat(oldval).filter(function(v, i, arr) {
                        return arr.indexOf(v) === arr.lastIndexOf(v);
                    })[0];
                    // 删除选中数组中的元素
                    this.delByIndex(delVal, this.hasChosenList);
                    // 删除已经在下拉中的元素（删除tag不会引起重新渲染下拉，所以需要手动清除）
                    // 需要判断如果当前删除项在搜索范围内，则不删除，如果不在范围内，则需要删除
                    let obj = this.options.find(v => v.value === delVal);
                    if (this.apiInfo.params.q) {
                        let isContain = obj.name.toLowerCase().indexOf(this.apiInfo.params.q.toLowerCase()) === -1;
                        if (isContain) this.delByIndex(delVal, this.options);
                    }
                    // this.delByIndex(delVal, this.options);
                }
                this.$emit('input', this.selectModel)
            },
            deep: true
        },
        value: {
            handler: function () {
                this.selectModel = this.value
            },
            deep: true
        },
        chosenObj: {
            handler: function () {
                if (this.multiple && Array.isArray(this.chosenObj) && this.chosenObj.length > 0) {
                    this.hasChosenList = this.chosenObj;
                }
                if (!this.mountedFlag) {
                    // 给默认选中项给定key值
                    if (!this.multiple) {
                        if (JSON.stringify(this.chosenObj) === '{}') {
                            this.chosenObj[this.listKey.key] = '';
                            this.chosenObj[this.listKey.keyWord] = '';
                        }
                        if (this.chosenObj && this.chosenObj[this.listKey.key]) {
                            let isHas = this.options.findIndex((v) => {
                                return v[this.listKey.key] == this.chosenObj[this.listKey.key]
                            })
                            if (isHas == -1) {
                                this.options.unshift(this.chosenObj)
                            }
                        }
                    } else {
                        // 查找是否下拉里面已经有默认选中项，没有则加入
                        if (Array.isArray(this.chosenObj) && this.chosenObj.length > 0) {
                            this.chosenObj.forEach(item => {
                                let isHas = this.options.findIndex((v) => {
                                    return v[this.listKey.key] === item[this.listKey.key];
                                })
                                if (isHas === -1) {
                                    this.options.unshift(item);
                                }
                            });
                            
                        }
                    }
                }
            },
            deep: true
        },
        // 监听到变化就让下拉框失去焦点
        isBlurByChange: {
            handler: function () {
                this.$refs.searchRadioSelect.blur()
            },
            deep: true
        }
    }
}
</script>

<style lang="less" scoped>
    .custom-search-input{
        /deep/.el-select{
            width: 100%;
        }
    }
    .custion-prefix-slot {
        margin-left: 12px;
        font-size: 16px;
        line-height: 38px;
    }
    .has-icon {
        /deep/.el-input {
            .el-input__inner{
                padding-left: 38px;
            }
        }
        /deep/.el-input__prefix {
            left: 0;
        }
    }
</style>
