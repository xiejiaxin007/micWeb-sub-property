<template>
  <div class="custom-search-input">
    <input type="text" :value="value" style="display: none;">
    <el-select v-model="selectModel" filterable remote multiple collapse-tags reserve-keyword placeholder="" :popper-append-to-body="false"
               :remote-method="remoteMethod"
                @change="changeOption"
               @visible-change="dropSelect"
               :loading="loading"
               @focus="focusSelect" ref="searchSelect">
      <el-option v-for="(item, index) in options" @click.native="optionClick(item)" :key="'index-' + item.id + index" :label="item.text" :value="item.id" :disabled="item.disabled"></el-option>
    </el-select>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "search-select",
  data () {
    return{
      options: [],   // 所有选项
      selectModel: [], //选中项
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
    // 默认选中项
    chosenObj: {
      type: Array,
      default: function () {
        return [{
          id: '',
          text: ''
        }]
      }
    },
    // 楼盘id
    projectId: {
      default: ''
    },
    // 当前数组，排除已经关联的楼栋
    currenArr: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  mounted(){
    this.selectModel = []
    this.selectModel = this.value
    this.thisIndex = this.currentIndex
    // 获取已经关联了的楼栋数组
    this.$nextTick(() => {
      this.getAssociaList()
      if(this.chosenObj.length > 0){
        this.options = [...this.chosenObj]
      }
      this.mountedFlag = false
    })
  },
  methods: {
    // 获取已经关联了的楼栋数组
    getAssociaList () {
      this.currenList = []
      this.currenArr.map((item) => {
        item.relation_building_ids.map((subItem) => {
          this.currenList.push(subItem)
        })
      })
    },
    // 下拉框被选中项的索引
    optionClick(para){
      this.chosenObj.push(para)
    },
    // 远程搜索
    remoteMethod(query) {
      let params = {}
      if (this.checkKey === 'staging' || this.checkKey === 'volume_date') {
        params = {
          q: query,
          project_id: this.projectId
        }
      } else {
        params = {
          q: query,
          project_id: this.projectId,
          expecting_building_ids: this.currenList
        }
      }
        this.axios.post('/backend-api/common/get-relation-building', params).then(res=>{
          if (res.status == 200) {
            if (res.data.code == 0) {
              if (Array.isArray(res.data.data)) {
                if(res.data.data.length <= 0 && query == ''){
                  let arr = [{id: '', text: '没有更多数据了', disabled: true}]
                  this.options = arr;
                  this.thisArr = res.data.data;
                }else {
                  if (this.chosenObj.length > 0) {
                    for (let i = 0; i < this.chosenObj.length; i++) {
                      let isHas = res.data.data.findIndex((v) => {
                        return v.id == this.chosenObj[i].id
                      })
                      if (isHas == -1) {
                        res.data.data.unshift(this.chosenObj[i])
                      }
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
      },
    // 切换下拉框
    changeOption(item){
      // 把当前选中项所在的对象key传出去
      this.$emit('seleChange', this.checkKey)
    },
    // 获取焦点
    focusSelect(para){
      this.remoteMethod('')
    },
    // 下拉框出现和消失
    dropSelect(para){
    }
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
    currenArr: {
      handler: function (val, oldval) {
        // 获取已经关联的楼栋
        this.getAssociaList()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
</style>
