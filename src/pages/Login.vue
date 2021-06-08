<template>
  <div class="login-contianer">
    <h1>Login</h1>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        name: '25',
        pass: 'Julive@888'
      },
      loginRules: {
        name: [
          // 对输入内容进行验证
          {required: true, message: '用户名不能为空！'}
        ],
        pass: [
          {required: true, message: '密码不能为空！'}
        ]
      }
    }
  },
  mounted () {
    console.log('我是login页面')
  }
}
