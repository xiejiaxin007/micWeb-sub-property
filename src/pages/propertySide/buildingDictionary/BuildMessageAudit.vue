<template>
  <div class="el-row build-message-box">
    <el-col :span="24" class="content-main">
      <!--面包屑-->
      <el-breadcrumb class="bread-crumb-box" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item>楼盘动销信息审核</el-breadcrumb-item>
      </el-breadcrumb>
      <!--搜索区域-->
      <div class="v-box form-table-box">
        <div class="hd">
          <h2>搜索条件</h2>
        </div>
        <div class="bd">
          <div class="order-search">
            <ul class="s-query">
              <li>
                <div class="th">核对id：</div>
                <div class="td">
                  <el-input v-model="checkId" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
                </div>
              </li>
              <li>
                <div class="th">城市：</div>
                <div class="td">
                  <el-select v-model="cityId"
                    filterable
                    placeholder="请选择">
                    <el-option
                      v-for="(item, index) in cityList"
                      :key="index"
                      :label="item.text"
                      :value="item.id+''">
                    </el-option>
                  </el-select>
                </div>
              </li>
              <li>
                <div class="th">楼盘名称：</div>
                <div class="td">
                  <el-autocomplete
                    v-model="buildObj.text"
                    :fetch-suggestions="searchHouse"
                    @select="affirmHouse">
                  </el-autocomplete>
                </div>
              </li>
              <li>
                <div class="th">变更人：</div>
                <div class="td">
                  <el-autocomplete
                    v-model="perInfo.text"
                    :fetch-suggestions="searchPerson"
                    @select="affirmPerson">
                  </el-autocomplete>
                </div>
              </li>
              <li>
                <div class="th">反馈内容：</div>
                <div class="td">
                  <el-select v-model="feedBack" placeholder="全部">
                    <el-option
                      v-for="(item, index) in feedBackList"
                      :key="index"
                      :label="item.text"
                      :value="item.id+''">
                    </el-option>
                  </el-select>
                </div>
              </li>
              <li>
                <div class="th">反馈结果：</div>
                <div class="td">
                  <el-select v-model="feedBackRes" placeholder="全部">
                    <el-option
                      v-for="(item, index) in feedBackResult"
                      :key="index"
                      :label="item.text"
                      :value="item.id+''">
                    </el-option>
                  </el-select>
                </div>
              </li>
              <li>
                <div class="th">变更时间：</div>
                <div class="td">
                  <el-date-picker
                    v-model="changeTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-area">
            <el-button @click="resetBtn">重置</el-button>
            <el-button type="primary" @click="searchData('search')">搜索</el-button>
          </div>
        </div>
      </div>
      <!--表格展示区域-->
      <div class="v-box form-table-box v-table">
        <div class="bd">
          <div class="table-box-wrapper">
            <div class="el-row tab-info">
              <div class="el-col-title">第<span>{{currentStart}}</span> - <span>{{currentEnd}}</span>条，共 <span>{{totalSum}}</span> 条数据</div>
            </div>
            <div class="table-box-row">
              <!--表格-->
              <el-table
                border
                :key="Math.random()"
                v-loading="tablebLoading"
                :data="tableData"
              >
                <el-table-column
                  prop="id"
                  min-width="100">
                  <template slot="header">
                    <span class="inverted" @click="editOrder">核对ID <i :class=" isInverted==true ? 'iconfont iconxiajiantou-' : 'iconfont iconshangjiantou-'" aria-hidden="true"></i> </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="city_name"
                  label="城市"
                  min-width="100">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="楼盘"
                  min-width="150">
                </el-table-column>
                <el-table-column
                  prop="creator"
                  label="反馈人"
                  min-width="150">
                </el-table-column>
                <el-table-column
                  prop="module"
                  label="反馈内容"
                  min-width="130">
                  <template slot-scope="scope">
                    <span>{{scope.row.module.text}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="create_datetime"
                  label="变更时间"
                  min-width="200">
                </el-table-column>
                <el-table-column
                  prop="status"
                  label="反馈结果"
                  min-width="150">
                  <template slot-scope="scope">
                    <span>{{scope.row.status.text}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  min-width="130">
                  <template slot-scope="scope">
                    <span class="href" @click="clickDetail(scope.row.id)">查看详情</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                  background
                  :page-size="pageSize"
                  layout="prev, pager, next"
                  :current-page.sync="currentPage"
                  @current-change="pageChange"
                  :total="totalSum">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'build-message-audit',
  data () {
    return {
      isInverted: true, // 倒序
      tablebLoading: false, // 表格加载标识
      buildObj: {}, // 搜索楼盘信息  id和text
      perInfo: {}, // 变更人  id和text
      checkId: '', // 核对id
      cityId: '', // 城市id
      cityList: [{id: '', text: ''}], // 城市下拉
      feedBack: '', // 反馈内容
      feedBackList: [],
      feedBackRes: '', // 反馈结果
      feedBackResult: [],
      changeTime: [], // 变更时间
      currentPage: 1, // 当前页
      totalSum: 0, // 总条数
      leftPage: '',
      currentStart: '',
      currentEnd: '',
      pageNum: '',
      pageSize: 20,
      tableData: []
    }
  },
  mounted () {
    this.buildObj.id = this.$route.query.id ? this.$route.query.id : ''
    this.buildObj.text = this.$route.query.projectName ? this.$route.query.projectName : ''
    this.feedBack = this.$route.query.projectModule ? this.$route.query.projectModule + '' : ''
    this.$nextTick(() => {
      this.searchData()
      this.getCity()
    })
  },
  methods: {
    clickDetail (id) {
      let path = this.$router.resolve({path: `changedetails?id=${id}`})
      window.open(path.href, '_blank')
    },
    compareUp (property) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    },
    compareDown (property) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value2 - value1
      }
    },
    editOrder () {
      if (!this.isInverted) {
        this.tableData.sort(this.compareDown('id'))
        this.isInverted = !this.isInverted
      } else {
        this.tableData.sort(this.compareUp('id'))
        this.isInverted = !this.isInverted
      }
    },
    // 表格条数计算
    editTable () {
      if (this.totalSum !== 0) {
        this.pageNum = Math.ceil(this.totalSum / this.pageSize) // 计算一共多少页
        this.leftPage = parseInt(this.totalSum % this.pageSize) // 计算最后一页剩余多少条数据，可能为0，也可能为其他值
        if (this.pageNum === 1) {
          // 如果只有一页的数据
          this.currentStart = 1
          this.currentEnd = this.totalSum
        } else {
          if (this.currentPage === 1) {
            // 多页数据时，第一页显示
            this.currentStart = 1
            this.currentEnd = this.pageSize
          }
        }
      } else {
        this.totalSum = 0 // 总数据条数为0
        this.currentStart = 0 // 从第几条开始为0
        this.currentEnd = 0 // 到第几条为0
        this.currentPage = 1 // 重置默认值
        this.isPage = false // 没有数据，隐藏分页
      }
    },
    // 表格翻页
    pageChange (page) {
      this.currentPage = page
      if (this.leftPage === 0) {
        this.currentStart = (this.currentPage - 1) * this.pageSize + 1
        this.currentEnd = this.currentPage * this.pageSize
      } else {
        if (this.currentPage === this.pageNum) {
          // 最后一页
          this.currentStart = (this.currentPage - 1) * this.pageSize + 1
          this.currentEnd = (this.currentStart - 1) + this.leftPage
        } else {
          // 不是最后一页
          this.currentStart = (this.currentPage - 1) * this.pageSize + 1
          this.currentEnd = this.currentPage * this.pageSize
        }
      }
      this.searchData()
    },
    // 重置
    resetBtn () {
      this.checkId = ''
      this.cityId = ''
      this.perInfo = {}
      this.buildObj = {}
      this.feedBack = ''
      this.feedBackRes = ''
      this.changeTime = []
      this.searchData('search')
    },
    // 搜索
    searchData (para) {
      if (para == 'search') {
        this.currentPage = 1
      }
      let params = {
        id: this.checkId,
        project_id: this.buildObj.id,
        city_id: this.cityId,
        creator: this.perInfo.id,
        module: this.feedBack,
        status: this.feedBackRes,
        start_time: this.changeTime.length > 0 ? moment(this.changeTime[0]).format('YYYY-MM-DD') : '',
        end_time: this.changeTime.length > 0 ? moment(this.changeTime[1]).format('YYYY-MM-DD') : '',
        page: this.currentPage
      }
      this.axios.get('/backend-api/project-audit/list', {params: params})
        .then((res) => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data
            this.totalSum = parseInt(res.data.data.page.total_count)
            // 恢复排序标识
            this.isInverted = true
            if (this.isInverted) {
              this.tableData.sort(this.compareDown('id'))
            }
          }
        }).then(() => {
          this.editTable()
          this.getOptList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 数组去重
    deteleObject (obj) {
      var uniques = []
      var stringify = {}
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i])
        keys.sort(function (a, b) {
          return (Number(a) - Number(b))
        })
        var str = ''
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j])
          str += JSON.stringify(obj[i][keys[j]])
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i])
          stringify[str] = true
        }
      }
      return uniques
    },
    // 获取城市
    getCity () {
      let params = {
        type: 1
      }
      this.axios.get('/backend-api/common/get-city-list', { params: params })
        .then((res) => {
          if (res.data.code == 0) {
            let result = res.data.data
            this.cityList = result
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 点击楼盘名
    affirmHouse (val) {
      // 更新楼盘信息
      this.buildObj.id = val.id
      this.buildObj.text = val.text
    },
    // 点击变更人
    affirmPerson (val) {
      this.perInfo.id = val.id
      this.perInfo.text = val.text
    },
    // 搜索楼盘
    searchHouse (val, cb) {
      if (val === '') {
        this.buildObj = {}
      }
      var list = [{}]
      let params = {
        q: val,
        city_id: this.cityId,
        search_alias: true
      }
      this.axios.get('/backend-api/common/get-project-list', { params: params })
        .then((res) => {
          let result = res.data
          if (result.code === 0) {
            if (JSON.stringify(result.data) == '{}') {
              list = [{value: '暂无数据'}]
            } else {
              for (let i of result.data) {
                i.value = i.text
              }
              list = result.data
            }
            cb(list)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 变更人
    searchPerson (val, cb) {
      if (val === '') {
        this.perInfo = {}
      }
      var list = [{}]
      let params = {
        q: val
      }
      this.axios.get('/backend-api/employee/get-employee-dropdown-list', { params: params })
        .then((res) => {
          let result = res.data
          if (result.code === 0) {
            if (JSON.stringify(result.data) == '{}') {
              list = [{value: '暂无数据'}]
            } else {
              for (let i of result.data) {
                i.value = i.text
              }
              list = result.data
            }
            cb(list)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取下拉选项
    getOptList () {
      let params = {
        type: ['15', '16'],
        city_id: this.cityId // 城市id
      }
      this.axios.post('/backend-api/common/get-project-config', params)
        .then((res) => {
          if (res.data.code === 0) {
            let result = res.data.data
            this.feedBackList = result.audit_content_type
            this.feedBackResult = result.audit_result_type
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 深度克隆
    deepCopy (obj) {
      var result = Array.isArray(obj) ? [] : {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            result[key] = this.deepCopy(obj[key])
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    }
  },
  components: {
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>
 .content-main{
    padding: 0 15px;
 }
 .build-message-box{
   .href{
     color:#33a1ff;
     text-decoration:underline;
     cursor:default;
   }
   .order-search{
     overflow: hidden;
     .s-query{
      >li:last-child{
        width: auto;
      }
      /deep/.el-autocomplete{
        width: 100%
      }
      /deep/.el-select{
        width: 100%
      }
     }
   }
   .table-box-wrapper{
     .tab-info{
       margin-bottom: 5px;
       span{
         font-weight: bold
       }
     }
     .inverted{
       color: #33a1ff
     }
   }
   .pagination{
      text-align: center;
      padding: 20px 0;
      background: #fff;
    }
 }
</style>

