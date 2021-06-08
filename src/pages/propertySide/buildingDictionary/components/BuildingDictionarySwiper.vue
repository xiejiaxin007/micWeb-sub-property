<template>
  <div class="layer-box">
    <!--关闭按钮 始-->
    <span class="close-btn"  @click="handleGallaryClick">X</span>
    <!--关闭按钮 止-->
    <!--轮播图 始-->
    <div class="swiper-wraper">
      <!-- swiperTop -->
      <swiper :options="swiperOptionTop" class="gallery-top" ref="swiperTop" v-if="showSwiper">
        <swiper-slide
          v-for="item in swiperList"
          :key="item.id"
        >
          <img class="swiper-img" :src="item.show_url" alt=""/>
        </swiper-slide>
        <div class="swiper-button-next swiper-button-gray" slot="button-next"></div>
        <div class="swiper-button-prev swiper-button-gray" slot="button-prev"></div>
      </swiper>
      <!-- swiperThumbs -->
      <swiper :options="swiperOptionThumbs" class="gallery-thumbs" ref="swiperThumbs" v-if="showSwiper">
        <swiper-slide
          v-for="item in swiperList"
          :key="item.id"
        >
          <img class="swiper-img" :src="item.show_url" alt=""/>
        </swiper-slide>
      </swiper>
    </div>
    <!--轮播图 止-->
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'BuildingDictionarySwiper',
  props: {
    swiperList: Array,
    transferPicIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      swiperOptionTop: {
        grabCursor: true, // 小手掌抓取滑动图标
        loop: false, // 轮循模式关闭
        spaceBetween: 10, // 在slide之间设置距离（单位px）
        slidesPerView: 1, // 设置slider容器能够同时显示的slides数量
        loopedSlides: 1000, // looped slides should be the same
        // mousewheel: true, // 开启鼠标滚轮控制Swiper切换
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        slideToClickedSlide: true, // 设置为true则点击slide会过渡到这个slide
        // 当Swiper的父元素变化时，例如window.resize，Swiper更新
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true // 修改swiper的父元素时，自动初始化swiper
      },
      swiperOptionThumbs: {
        grabCursor: true, // 小手掌抓取滑动图标
        loop: false, // 轮循模式关闭
        spaceBetween: 10, // 在slide之间设置距离（单位px）
        slidesPerView: 3,
        centeredSlides: true,
        loopedSlides: 1000, // looped slides should be the same
        touchRatio: 0.5, // 触摸距离与slide滑动距离的比率
        slideToClickedSlide: true, // 设置为true则点击slide会过渡到这个slide
        // 当Swiper的父元素变化时，例如window.resize，Swiper更新
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true // 修改swiper的父元素时，自动初始化swiper
      }
    }
  },
  components: {swiper, swiperSlide},
  methods: {
    // 点击关闭按钮
    handleGallaryClick () {
      this.$emit('gallaryClose', this.swiperTop.activeIndex % this.swiperList.length)
    }
  },
  computed: {
    // 初始加载无数据轮播图不展示
    showSwiper () {
      return this.swiperList.length
    },
    swiperTop () {
      return this.$refs.swiperTop.swiper
    },
    swiperThumb () {
      return this.$refs.swiperThumbs.swiper
    }
  },
  updated () {
  },
  mounted () {
    if (this.swiperList.length) {
      this.$nextTick(() => {
        const swiperTop = this.$refs.swiperTop.swiper
        const swiperThumbs = this.$refs.swiperThumbs.swiper
        swiperTop.controller.control = swiperThumbs
        swiperThumbs.controller.control = swiperTop
      })
    }
  },
  watch: {
    transferPicIndex () {
      // 默认停到第几个
      let _index = this.transferPicIndex
      setTimeout(() => {
        this.swiperTop.slideTo(_index, 0, false)
        this.swiperThumb.slideTo(_index, 0, false)
      }, 1)
      alert('传输下角标为:' + _index + ' 可赋值')
    }
  }
}
</script>
<!--样式-->
<style lang="less" scoped>
  .close-btn{
    position: absolute;
    width: 40px;
    height: 40px;
    line-height: 42px;
    border-radius: 50%;
    border: 1px solid #fff;
    color: #fff;
    text-align: center;
    right: 145px;
    top: 65px;
    font-size: 20px;
    z-index: 101;
    cursor: pointer;
  }
  .layer-box{
    display:flex;
    flex-direction:column;
    justify-content:center;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.8);
    position: fixed;
    z-index: 100;
  }
  .swiper-wraper{
    height: 600px;
    width: 900px;
    margin: 0 auto;
    text-align: center;
    .swiper-container {
      background-color: #000;
    }
    .gallery-top {
      height: 80% !important;
      width: 100%;
      .swiper-slide {
        background-size: cover;
        background-position: center;
          .swiper-img {
            width: 100%;
            height: 100%;
          }
      }
    }
    .gallery-thumbs {
      height: 20% !important;
      box-sizing: border-box;
      padding: 10px 0;
      .swiper-slide {
        width: 25%;
        height: 100%;
        opacity: 0.4;
        .swiper-img {
          width: 100%;
          height: 100%;
        }
        &.swiper-slide-active {
          opacity: 1;
        }
      }
    }
  }
  .swiper-button-prev.swiper-button-disabled,
  .swiper-button-next.swiper-button-disabled {
    opacity: 0;
    cursor: auto;
    pointer-events: none;
  }
  .swiper-button-prev.swiper-button-gray,
  .swiper-container-rtl .swiper-button-next.swiper-button-gray {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%2340454e'%2F%3E%3C%2Fsvg%3E");
  }
  .swiper-button-next.swiper-button-gray,
  .swiper-container-rtl .swiper-button-prev.swiper-button-gray {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%2340454e'%2F%3E%3C%2Fsvg%3E");
  }
  .swiper-button-prev, .swiper-button-next{
    top: 48%;
    opacity: 0.5;
  }
</style>
