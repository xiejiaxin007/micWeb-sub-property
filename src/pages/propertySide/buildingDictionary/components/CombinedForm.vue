<template>
  <div>
    <div class="el-card box-card table_container">
      <div class="el-card__header">
        <table class="gridtable" border>
          <thead>
            <tr>
              <th>变更类型</th>
              <th>内容分类</th>
              <th>楼栋名称</th>
              <th>户型名称</th>
              <th>字段名称</th>
              <th>变更后内容</th>
              <th>变更前内容</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td :rowspan="rowspanLength(tableData.change_detail)">{{tableData.op_type}}</td>
              <td :rowspan="rowspanLength(tableData.change_detail)">{{tableData.module}}</td>
              <td :rowspan="rowspanLength(tableData.change_detail)"><a :href="tableData.building_url === '' ? 'javascript:void(0);' : tableData.building_url" target="_blank">{{tableData.building_name}}</a></td>
              <td :rowspan="rowspanLength(tableData.change_detail)"><a :href="tableData.house_type_url === '' ? 'javascript:void(0);' : tableData.house_type_url" target="_blank">{{tableData.house_type_name}}</a></td>
              <td v-show="isTdShow"></td>
              <td v-show="isTdShow"></td>
              <td v-show="isTdShow"></td>
            </tr>
            <tr v-for="(item,index) in tableData.change_detail" :key="index">
              <td>{{item.field_name}}</td>
              <td class="a">
                <!-- data_type >>> 1为图片 2为文件 3为文字 -->
                <div v-if="item.data_type === 1 && item.new_value">
                  <span v-for="(imgRc,index) in item.new_value" :key="index" @click="openBigPhoto(imgRc.show_path)">
                    <img :src="imgRc.show_path" alt="图片" />
                  </span>
                </div>
                <div v-else-if="item.data_type === 2 && item.new_value">
                  <span>
                     <a v-for="(fileSrc, index) in item.new_value" :key="index" :href="fileSrc.show_path"  :download="fileSrc.name">{{fileSrc.name}}</a>
                  </span>
                </div>
                <span v-else-if="item.data_type === 3">{{item.new_value}}</span>
              </td>
              <td class="a">
                <!-- data_type >>> 1为图片 2为文件 3为文字 -->
                <div v-if="item.data_type === 1 && item.old_value">
                  <span v-for="(imgRc,index) in item.old_value" :key="index" @click="openBigPhoto(imgRc)">
                    <img :src="imgRc.show_path" alt="图片" />
                  </span>
                </div>
                <div v-else-if="item.data_type === 2 && item.old_value">
                  <span>
                    <a v-for="(fileSrc, index) in item.old_value" :key="index" :href="fileSrc.show_path"  :download="fileSrc.name">{{fileSrc.name}}</a>
                  </span>
                </div>
                <span v-else-if="item.data_type === 3">{{item.old_value}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['tableData'],
  data () {
    return {
      isClick: false
    }
  },
  methods: {
    /**
     * 新窗口打开图片链接
     */
    openBigPhoto (imgRc) {
      window.open(imgRc)
    },
    /**
     * 合并的行数
     */
    rowspanLength (rowLength) {
      return rowLength ? rowLength.length + 1 : 1
    },
    isTdShow () {
      return tableData.building_name === '居理暂无该楼栋'
    },
    /**
     * 变更内容条件过滤
     */
    splitChangeContent (newVal) {
      let newDetailval;
      if (newVal) {
        if (newVal != undefined && newVal.substr(newVal.length - 2, 1) === '-') {
          newDetailval = newVal.substr(0, newVal.length - 2)
        } else if (parseFloat(newVal) == 0) {
          // 为0或者0.000时候置空
          newDetailval = ''
        } else if (newVal != undefined && newVal.indexOf('(0套)') !== -1) {
          newDetailval = newVal.substr(0, newVal.indexOf('(0套)'))
        } else if (newVal != undefined && newVal.indexOf('.00') !== -1) {
          newDetailval = newVal.split('.')[0] + newVal.split('.')[1].split(' ')[1]
        } else {
          newDetailval = newVal
        }
      }
      return newDetailval
    }
  },
  mounted () {
    if (this.tableData.building_name === '居理暂无该楼栋') {
      this.isClick = true
    } else {
      this.isClick = false
    }
  }
}
</script>

<style lang="less" scoped>

.gridtable {
  border-collapse: collapse;
  width: 100%;
  thead > tr {
    background: #dfe6ec;
    height: 40px;
    line-height: 40px;
  }
  th,
  td {
    border: 1px solid #dfe6ec;
    font-size: 14px;
    font-weight: normal;
    text-align: center;
  }
  tbody > tr:nth-child(1) {
    height: 0px;
  }
  .isClick {
    color: #333;
    cursor: inherit;
  }
  tbody > tr {
    height: 40px;
    line-height: 40px;
    td {
      padding: 0 10px;
      max-width: 500px;
      a {
        color:rgb(83, 171, 243);
      }
      span {
        display: inline-block;
        img {
          width: 150px;
          height: 90px;
          margin: 10px 0 10px 10px;
          cursor: pointer;
        }
      }
    }
  }
}

</style>
