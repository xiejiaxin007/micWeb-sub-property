<template>
  <div class="no-permission">
    <div class="logo-box">
      <img src="../assets/images/logo.png"
        alt="logo">
    </div>
    <h3>北京居理科技有限公司</h3>
    <div class="user-box">
      <ul class="user-oporate">
        <li>
          <div>● <span class="turn-out" @click="logOut">退出登录</span></div>
        </li>
      </ul>
    </div>
    <h3>当前角色无菜单权限，请联系管理员！</h3>
  </div>
</template>

<script>
export default {
  name: 'no-permissions',
  data () {
    return {
      mountingFlag: true// 是否正在加载中
    }
  },
  computed: {},
  mounted () {
    this.$nextTick(res => {
      this.mountingFlag = false
    })
  },
  methods: {
    logOut () {
      window.location.href = '/site/logout'
    }
  }
}
</script>

<style scoped>
  .no-permission{
    padding: 20px 0 0 20px;
  }
  .no-permission h3{
    font-weight: normal;
    font-size: 16px;
  }
  .user-box{
    margin-bottom: 10px;
  }
  .logo-box{
    width: 102px;
    height: 45px;
    margin-bottom: 20px;
  }
  .user-oporate{
    padding-left: 20px;
  }
  .user-oporate > li{
    margin-bottom: 10px;
    font-size: 14px;
  }
  .user-oporate > li .turn-out{
    width: 60px;
    color: #1c84d2;
    cursor: pointer;
  }
</style>
