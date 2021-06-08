<template>
  <h1>Main</h1>
</template>
<script>
export default {
  name: 'main-page',
  data () {
    return {
      headHeight: '60', // 头部高度，由于长期不变化，不用动态获取
      isFixed: false, // 是否固定导航标志位初始化
      fixedPadding: 0, // 导航固定时候动态获取的导航高度
      msg: '',
    }
  },
  mounted () {
    console.log('我是Main页面')
  }
}
</script>
