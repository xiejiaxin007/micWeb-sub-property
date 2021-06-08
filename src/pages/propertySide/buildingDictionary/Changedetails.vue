<template>
  <div class="parentDetail">
    <div class="detailPath">
      <!--面包屑-->
      <el-breadcrumb class="bread-crumb-box" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item><a @click="hrefAuditor">楼盘动销信息审核</a></el-breadcrumb-item>
        <el-breadcrumb-item>变更详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detailBg">
      <div class="detailCity">
        <h2>{{ cityArr.city_name }}</h2>
        <h2>{{ cityArr.project_name }}</h2>
      </div>
      <div class="changeInfo">
        <h3>变更基本信息</h3>
        <p>变更记录: {{ changeRecord.creator }} {{ momentDate(changeRecord.create_datetime) }}</p>
      </div>
      <div class="changeContent">
        <h3>变更内容</h3>
        <!-- 表格组件 -->
        <Combined-form v-if="tableData" :tableData="tableData" :changeRecord="changeRecord"></Combined-form>
      </div>
      <div class="feedback">
        <h3>系统报错信息</h3>
        <p v-if="errMesInfo.length > 0">以下信息可能存在误差，请核对信息！
            <el-button @click="toInfoEditPage" type="text">前往修改</el-button>
        </p>
        <p  
            v-for="item in errMesInfo"
            :key="item.house_type_id">
          <span>户型: {{item.house_type_text}}</span>
          <span :class="{isError: item.status_text.is_wrong == 1}">销售状态：{{item.status_text.value}}</span>
          <span :class="{isError: item.price.is_wrong == 1}">单价：{{item.price.value}}</span>
          <span :class="{isError: item.total_price.is_wrong == 1}">总价：{{item.total_price.value}}</span>
        </p>
        <p v-show="notPass">不通过理由: {{ feedBack.remark }} </p>
      </div>
      <div class="primaryInformation">
        <h3>主要信息来源</h3>
        <p class="origin" v-show="this.mainInfoSource.info_source !== ''">来源: {{ this.mainInfoSource.info_source }}</p>
        <p v-show="this.mainInfoSource.info_name !== ''">其他网站名称: {{ this.mainInfoSource.info_name }}</p>
        <p v-show="this.mainInfoSource.img_list ? this.mainInfoSource.img_list.length !== 0 : false">
          <img v-for="(imgSrc, index) in mainInfoSource.img_list" :key="index" :src="imgSrc.show_path" @click="openBigPhoto(imgSrc.show_path)" alt="图片"/>
        </p>
        <span class="fileDownload" v-show="this.mainInfoSource.file_list ? this.mainInfoSource.file_list.length !== 0 : false">
          <p v-for="(fileSrc, index) in this.mainInfoSource.file_list" :key="index">
            <a class="fileHover" :href="fileSrc.show_path" :download="fileSrc.name">{{fileSrc.name}}</a>
          </p>
        </span>
      </div>
      <div class="feedback">
        <h3>反馈结果</h3>
        <p>审核人: {{ feedBack.auditor }}</p>
        <p v-show="unaudited">操作记录: {{ feedBack.operator }} {{ momentDate(feedBack.time) }} {{ feedBack.status_str }}</p>
        <p v-show="notPass">不通过理由: {{ feedBack.remark }} </p>
      </div>
      <div class="passButton" v-show="buttonIsShow">
        <el-button type="danger" @click="messageBox">不通过</el-button>
        <el-button type="success" @click="nextPass(false)">通过</el-button>
        <el-button type="primary" @click="nextPass(true)">通过并编辑信息</el-button>
      </div>
    </div>
    <!-- 对话框组件 -->
    <el-dialog :title="passVal" :visible.sync="dialogFormVisible" width="500px">
      <div v-if="isPass">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc" maxlength="300"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer textFooter">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitNotPass('ruleForm')">确 定</el-button>
        </div>
      </div>
      <div v-else>
        <p class="textVal">该次放量计划中存在未审核通过的楼栋信息，请先去审核相关的楼栋信息，再审核放量计划，否则本次放量计划关联的放量楼栋将无法被关联到居理的放量计划中！</p>
        <div slot="footer" class="dialog-footer textFooter">
          <el-button @click="goAuditorInfo">去审核楼栋信息</el-button>
          <el-button type="primary" @click="giveupPass">放弃楼栋继续通过</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CombinedForm from "./components/CombinedForm"
import moment from "moment"
import { setTimeout } from 'timers'
import { getInfoByProjectId } from './utils/index.js';
export default {
  name: "Change-details",
  components: { CombinedForm },
  data () {
    // 自定义校验 检测是否全是空格
    let isAllTrim = (rule, value, callback) => {
      let spaceReg = /\s\S+|S+\s|\S/
      if (spaceReg.test(value) === false) {
        return callback(new Error('请完善必填后提交'))
      } else {
        callback()
      }
    }
    return {
      // 报错信息数据
      errMesInfo: [],
      // 变更信息
      changeRecord: {},
      // 表格数据
      tableData: null,
      // 主要来源信息
      mainInfoSource: {},
      // 反馈结果
      feedBack: {},
      // 不通过
      notPass: false,
      // 是否审核
      unaudited: true,
      // dialog
      dialogFormVisible: false,
      // 审核人Id
      auditId: '',
      // 楼栋名称
      projectName: '',
      // 楼栋信息
      projectModule: '',
      // 楼盘Id
      projectId: '',
      // 城市
      cityArr: {},
      // title
      passVal: '',
      // 是否点击通过
      isPass: true,
      // 按钮是否显示
      buttonIsShow: true,
      // 记录点击的是通过按钮还是通过并编辑
      isPassBtn: false,
      // 表单
      ruleForm: {
        name: '',
        desc: ''
      },
      // 校验规则
      rules: {
        desc: [
          { required: true, message: '请完善必填后提交!', trigger: 'blur' },
          { validator: isAllTrim, trigger: 'blur' }
        ]
      },
      // 是否标红
      singlePriceIsError: true,
      allPriceIsError: true
    }
  },
  mounted () {
    this.getDetailInfo()
  },
  methods: {
    /**
     * 不通过对话框
     */
    messageBox () {
      this.dialogFormVisible = true
      this.ruleForm.desc = ''
      this.isPass = true
      this.passVal = '不通过理由'
    },
    // 获取户型下拉数据
    async getHouseOptions() {
        try {
            const options = {
                project_id: this.$route.query.projectId
            };
            const {
                data: { code, data }
            } = await commonApi.getHouseTypeListData(options);
            if (code === 0) {
                this.houseOptions = data;
            }
        } catch (error) {
            console.log(error);
        }
    },
    // 跳转常用信息编辑页面
    toInfoEditPage() {
      getInfoByProjectId(this.projectId, 'project_type_text,city_id,name,project_id').then((data) => {
        let routeData = null;
        if (!data) {
          return false;
        }
          routeData = this.$router.resolve({
              path: '/building/tabToggleList',
              query: {
                  isEdit: 1,
                  projectId: data.project_id,
                  cityId: data.city_id,
                  projectName: data.name,
                  buildingType: `(${data.project_type_text})`,
                  positionTab: '2',
                  role: 'operation'
              }
          });
          let opener = window.open(routeData.href, "_blank");
          opener.opener = null;
      });
        // window.open(`/index.php?r=yw-projects%2Fupdate&project_id=${this.projectId}&page_tag=view-common-info`);
    },
    /**
     * 提交不通过理由
     */
    submitNotPass (formName) {
      console.log(formName)
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          let params = {
            reason: this.ruleForm.desc,
            audit_id: this.auditId
          }
          let result = await this.axios.post('/backend-api/project-audit/refuse', params)
          let { data } = result
          if (data.code === 0) {
            this.dialogFormVisible = false
            this.buttonIsShow = false
            window.location.reload()
          } else {
            alert(data.msg)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 通过
     */
    PassAudited () {
      this.dialogFormVisible = true
      this.isPass = false
      this.passVal = '审核提示'
    },
    // 如果是放量计划，传第二个参数checkVal
    async nextPass (isJump, checkVal) {
      // 如果是通过
      if (!isJump) {
        this.isPassBtn = true
      } else {
        this.isPassBtn = false
      }
      let params = {
        audit_id: this.auditId,
        check: checkVal
      }
      let result = await this.axios.get('/backend-api/project-audit/pass', {params: params})
      let { data } = result
      if (data.code === 0) {
        this.dialogFormVisible = false
        this.buttonIsShow = false
        if (isJump) {
          setTimeout(() => {
            window.location.reload()
          }, 2000)
          window.open(data.data.edit_url)
        } else if (isJump === false) {
          window.location.reload()
        } else if (isJump === undefined && checkVal === false) {
          // 放弃审核继续通过
          window.open(data.data.edit_url)
          window.location.reload()
        }
      } else if (data.code === 1601) {
        this.PassAudited()
      } else if (data.code === 1007) {
        alert(data.msg)
      }
    },
    /**
     * 放弃继续通过
     */
    giveupPass () {
      // this.$router.push({path: '/building/buildMessageAudit'})
      if (this.isPassBtn) {
        // 如果是通过按钮
        this.nextPass(false, false)
      } else {
        this.nextPass(undefined, false)
      }
    },
    /**
     * 去列表审核楼栋
     */
    goAuditorInfo () {
      // 去审核列表，默认选中楼栋
      let path = this.$router.resolve({path: `buildMessageAudit?id=${this.projectId}&projectName=${this.projectName}&projectModule=3`})
      window.open(path.href)
      this.dialogFormVisible = false
    },
    /**
     * 获取当前页面所有信息
     */
    async getDetailInfo () {
      let params = { id: this.$route.query.id }
      let result = await this.axios.get('/backend-api/project-audit/change-detail', {params: params})
      let { data } = result
      if (data) {
        this.cityArr = data.data
        // 获取审核人Id
        this.auditId = data.data.audit_id
        // 获取表格数据
        this.tableData = data.data.change_content
        // 获取变更信息数据
        this.changeRecord = data.data.change_record
        // 获取主要来源信息数据
        this.mainInfoSource = data.data.main_info_source
        // 获取反馈结果数据
        this.feedBack = data.data.feedback
        // 获取楼栋信息
        this.projectName = data.data.project_name
        // 获取楼盘信息
        this.projectModule = data.data.change_content.module_id
        // 获取楼盘Id
        this.projectId = data.data.project_id
        // 赋值楼盘报错信息
        this.errMesInfo = data.data.house_type_warn;
        if (this.feedBack.status_str === '未审核') {
          this.unaudited = false
          this.buttonIsShow = true
        } else if (this.feedBack.status_str === '审核驳回') {
          this.notPass = true
          this.buttonIsShow = false
        } else {
          this.buttonIsShow = false
        }
      }
    },
    /**
     * 时间戳转换
     */
    momentDate (date) {
      return moment(date * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    /**
     * 新窗口打开图片
     */
    openBigPhoto (imgRc) {
      window.open(imgRc)
    },
    /**
     * 面包屑跳转
     */
    hrefAuditor () {
      this.$router.push({path: '/building/buildMessageAudit'})
    }
  }
}
</script>

<style scoped>
.parentDetail {
  width: 100%;
  padding: 30px 0 50px 20px;
  box-sizing: border-box;
}
.detailBg {
  width: 100%;
  background: #fff;
  padding: 20px 20px 20px 20px;
  box-sizing: border-box;
}
.detailPath p {
  font-size: 14px;
  margin-bottom: 20px;
}
.detailPath p span {
  font-weight: bold;
}
.detailPath p span:hover {
  color: rgb(93, 151, 236);
  cursor: pointer;
}
/* 城市/楼盘名称 */
.detailCity h2 {
  font-size: 20px;
  font-weight: bold;
}
.detailCity h2 {
  display: inline-block;
}
/* 变更信息 */
.changeContent {
  width: 100%;
}
.changeInfo h3,
.changeContent h3,
.primaryInformation h3,
.feedback h3 {
  width: 120px;
  height: 20px;
  border-bottom: 1px solid #333;
  padding: 10px 0;
  box-sizing: content-box;
  margin-bottom: 18px;
  font-size: 18px;
  font-weight: bold;
}
.changeInfo p {
  margin-bottom: 26px;
  font-size: 15px;
}
/* 变更内容 */
.changeContent {
  margin-bottom: 26px;
}
/* 主要信息来源 */
.primaryInformation {
  margin-bottom: 26px;
}
.primaryInformation p {
  font-size: 14px;
  font-weight: 560;
  margin-bottom: 14px;
  width: 400px;
  word-break: break-word;
}
.primaryInformation .fileDownload {
  font-size: 14px;
  font-weight: 560;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
}
.primaryInformation p img {
  width: 120px;
  height: 60px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.primaryInformation .fileDownload a {
  margin: 10px 10px 0 0;
}
/* 反馈结果 */
.feedback p {
  font-size: 14px;
  margin-bottom: 10px;
}
/* 操作按钮 */
.passButton {
  margin: 26px 0 0 40%;
}
/* dialog */
.parentDetail >>> .el-form-item__content {
  margin-left: 0px !important;
}
.parentDetail >>> .el-textarea__inner {
  min-height: 120px !important;
}
.parentDetail >>> .el-dialog__body {
  overflow-y: hidden;
}
.parentDetail >>> .dialog-footer {
  text-align: right;
}
.parentDetail >>> .el-dialog__header {
  text-align: center;
}
.textVal {
  width: 470px;
  word-wrap:break-word;
}
.textFooter {
  margin-top: 20px;
  text-align: center !important;
}
.textFooter >>> .el-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    width: auto;
}
.textFooter >>> .el-button--primary {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    margin-left: 10px;
}
.fileHover:hover {
  color: rgb(99, 156, 241);
}
.parentDetail >>> .el-form-item__content {
  overflow: inherit;
}
/* 报错信息标红 */
.isError {
  color: #fd0a0a;
}
</style>
