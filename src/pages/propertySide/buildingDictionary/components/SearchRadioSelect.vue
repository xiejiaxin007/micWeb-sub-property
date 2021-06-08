<template>
  <div class="custom-search-input">
    <input type="text" :value="value" style="display: none;">
    <el-select v-model="selectModel" filterable remote reserve-keyword placeholder="" :popper-append-to-body="isAppend"
               :remote-method="remoteMethod"
                @change="changeOption"
               @visible-change="dropSelect"
               :loading="loading"
               @focus="focusSelect" ref="searchRadioSelect">
      <el-option v-for="(item, index) in options" @click.native="selectChange(item)" :key="'sear-' + index" :label="item.text" :value="item.id + ''" :disabled="item.disabled"></el-option>
    </el-select>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "search-radio-select",
  data () {
    return{
      options: [],   // 所有选项
      selectModel: '', //选中项
      thisIndex: 0,   // 当前所在行的索引
      thisArr: [],   // 当前请求的list
      mountedFlag: true,  // 是否在渲染
      thisObj: {},  // 当前选中项
      loading: false,  // loading动画开关
      focusIndex: 0, // focus触发次数
      currenList: [], // 当前已经关联的楼栋
    }
  },
  props: {
    // 这个比较特殊，v-model的绑定，不限制输入类型
    value: {
      default: () => {
        return []
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
    // 默认选中id
    chosenId: {
      default: ''
    },
    // 当前选中的index
    currentIndex: {
      type: Number,
      default: 0
    },
    // 城市id
    cityId: {
      default: ''
    },
    // 楼盘id
    projectId: {
      default: ''
    },
    // 请求的api类型
    api: {
      type: String,
      default: ''
    },
    // 默认选中项
    chosenObj: {
      type: Object,
      default: function () {
        return {
          id: '',
          text: ''
        }
      }
    }
  },
  mounted(){
    this.selectModel = ''
    this.selectModel = this.value
    this.thisIndex = this.currentIndex
    // 获取已经关联了的楼栋数组
    this.$nextTick(() => {
      if(this.chosenObj.id){
        this.options.unshift(this.chosenObj)
      }
      this.mountedFlag = false
    })
  },
  methods: {
    // 远程搜索
    remoteMethod(query) {
      if (this.api === 'project-list') {
        let params = {
          q: query,
          city_id: this.cityId,
          search_alias: true
        }
        this.axios.get('/backend-api/common/get-project-list', {params: params}).then(res=>{
          if (res.status == 200) {
            if (res.data.code == 0) {
              this.loading = false
              if (Array.isArray(res.data.data)) {
                if(res.data.data.length <= 0 && query == ''){
                  let arr = [{id: '', text: '没有更多数据了', disabled: true}]
                  this.options = arr
                  this.thisArr = res.data.data
                }else {
                  if (this.chosenObj.id) {
                    let isHas = res.data.data.findIndex((v) => {
                      return v.id == this.chosenObj.id
                    })
                    if (isHas == -1) {
                      res.data.data.unshift(this.chosenObj)
                    }
                  }
                  this.options = res.data.data
                  this.thisArr = res.data.data
                }
              } else {
                let arr = [{id: '', text: '没有更多数据了', disabled: true}]
                this.options = arr
                this.thisArr = res.data.data
              }
            }
          }
        }).catch(err=>{
          console.log(err);
        })
      } else if (this.api === 'company') {
        let params = {
          q: query,
          project_id: this.projectId
        }
        this.axios.post('/backend-api/common/get-property-company', params).then(res=>{
          if (res.status == 200) {
            if (res.data.code == 0) {
              setTimeout(() => {
                this.loading = false
                if(res.data.data.length <= 0 && query == ''){
                  let arr = [{id: '', text: '没有更多数据了', disabled: true}]
                  this.options = arr
                  this.thisArr = res.data.data
                }else {
                  if (this.chosenObj.id) {
                    let isHas = res.data.data.findIndex((v) => {
                      return v.id == this.chosenObj.id
                    })
                    if (isHas == -1) {
                      res.data.data.unshift(this.chosenObj)
                    }
                  }
                  this.options = res.data.data
                  this.thisArr = res.data.data
                }
              }, 200);
            }
          }
        }).catch(err=>{
          console.log(err);
        })
      }
    },
    // 切换下拉框
    changeOption(item){
      this.$emit('changeSelect', this.checkKey)
    },
    // 获取焦点
    focusSelect(para){
      this.remoteMethod('')
    },
    // 切换下拉框点击item事件
    selectChange (item) {
      let obj = {
        item: item,
        index: this.currentIndex
      }
      this.$emit('getOption', obj)
    },
    // 下拉框出现和消失
    dropSelect(para){}
  },
  watch: {
    selectModel: {
      handler: function (val, oldval) {
        this.$emit('input', this.selectModel)
      },
      deep: true
    },
    value: {
      handler: function (val, oldval) {
        this.selectModel = this.value
      },
      deep: true
    },
    chosenObj: {
      handler: function (val, oldval) {
        if(!this.mountedFlag){
          if(this.chosenObj.id){
            let isHas = this.options.findIndex((v) => {
              return v.id == this.chosenObj.id
            })
            if (isHas == -1) {
              this.options.unshift(this.chosenObj)
            }
          }
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
</style>
