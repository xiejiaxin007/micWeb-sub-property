<template>
  <div class="custom-search-input">
    <input type="text" :value="value" style="display: none;">
    <el-select v-model="selectModel" clearable @change="changeOption" filterable placeholder="">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.text"
      :value="item.id">
    </el-option>
  </el-select>
  </div>
</template>

<script>
export default {
  name: 'select-to',
  data () {
    return {
      options: [], // 所有选项
      selectModel: ''// 选中项，如果是多选，需要定义成为数组
    }
  },
  props: {
    // 这个比较特殊，v-model的绑定，不限制输入类型
    value: {
      default: ''
    },
    role: {
      default: 0
    },
    // 当前角色
    curRole: {
      default: ''
    },
    // 当前角色id
    uid: {
      default: 0
    }
  },
  mounted () {
    this.selectModel = this.value
    setTimeout(() => {
      this.getData()
    }, 500)
  },
  methods: {
    // 选中事件
    changeOption (para) {
      this.$emit('seleChange', para)
    },
    // 下拉请求数据
    getData () {
      let params = {}
      if (this.role.toString() === '1') {
        // 当前登录人为咨询师主管
        if (this.curRole === 'header_manager') {
          params = {
            header_manager_id: this.uid
          }
        }
        this.axios.get('/backend-api/select2/select2/get-employee-list-select2', {params: params}).then((res) => {
          if (res.data.code === 0) {
            this.options = res.data.data
          }
        }).catch((err) => {
          console.log(err)
        })
      } else if (this.role.toString() === '2') {
        this.axios.get('/backend-api/select2/select2/get-team-leader-name-list-select2').then((res) => {
          if (res.data.code === 0) {
            this.options = res.data.data
          }
        }).catch((err) => {
          console.log(err)
        })
      }
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
    }
  }
}
</script>

<style scoped>

</style>
