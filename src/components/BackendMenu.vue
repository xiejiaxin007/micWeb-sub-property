<template>
    <!--1、无限循环导航，需要引用sub-menu-item组件
  2、导航内容直接在本组件内进行请求
  3、currenIndex根据后台返回进行动态设置，防止刷新时候丢失当前导航选种样式
  4、导航结构是ul和li结构，由于新封装了一个子组件，所以ul下面不再是紧跟li，设置的mode为无效的，
  使用el-container组件进行横向排列，同时给一个属性让导航自动换行 flex-flow: row wrap;-->
    <div
        v-if="userAgent !== 'ipad'"
        ref="bkMenu"
        :class="{'menu-wrapper mount-menu-wrapper': mounting, 'menu-wrapper': !mounting}"
    >
        <div style="position: relative;">
            <el-menu
                ref="elMenu"
                :default-active="currenIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="selectMenu"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
            >
                <el-container>
                    <sub-menu-item
                        v-for="(menu, index) in menuList"
                        :key="index + ''"
                        :item="menu"
                        v-bind:menuLevel= '2'
                    ></sub-menu-item>
                </el-container>
            </el-menu>
        </div>
    </div>
</template>

<script>
    import SubMenuItem from './SubMenuItem';
    import { commonFun } from '../assets/js/utils/utils';
    import { mapState } from 'vuex';
    export default {
        name: 'backend-menu',
        data() {
            return {
                menuList: [], // 导航数组
                trackInfo: {}, // 埋点信息
                mounting: true, // 是否正在加载中
                activeIndex: '', // 导航当前选中项
                // 获取当前的user-angent
                userAgent: ''
            };
        },
        components: { SubMenuItem },
        mounted() {
            // 获取当前请求头的userAgent，如果是ipad，则说明项目包壳放到了pad中，需要把顶部和菜单都隐藏掉
            this.userAgent = navigator.userAgent;
            this.getData();
        },
        computed: {
            ...mapState({
                trackInfos: state => state.trackInfos,
                backendApi: state => state.backendApi
            }),
            currenIndex() {
                return this.activeIndex;
            }
        },
        methods: {
            // 页面初始化
            getData() {
                // 接口 /backend-api/api-user/menu  http://menu.cn
                this.axios.post('/backend-api/api-user/menu').then(res => {
                        if (res.data.code === 0) {
                            // 获取导航信息
                            this.menuList = res.data.data.menu;
                            // 获取埋点信息
                            this.trackInfo = res.data.data.track_common_property;
                            // 放入vuex
                            this.$store.dispatch('getTrackInfo', this.trackInfo);
                            this.$store.dispatch('get_trackmessages', this.trackInfo);
                            this.$store.dispatch('get_backend_api', res.data.data.track_url);
                            this.$nextTick(() => {
                                // 计算导航栏的高度，传给父组件，用于动态赋值center的paddingTop值
                                this.$emit('getHeight', this.$refs.bkMenu.offsetHeight);
                                // 导航当前选中项
                                this.activeIndex = res.data.data.active;
                                this.mounting = false;
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 点击导航事件
            selectMenu(index) {
                // 埋点
                commonFun.setTrackMenu(JSON.parse(this.$refs.elMenu.activeIndex).track_id, {});
                // 拿到选中项的菜单中的is_out_url字段，判断跳转方式
                let menuObj = JSON.parse(index);
                let isOut = menuObj ? menuObj.is_out_url : 2;
                if (isOut.toString() === '1') {
                    window.location.href = menuObj.menu_url;
                } else if (isOut.toString() === '2') {
                    // 如果为2，则在本页面跳转
                    this.$router.push({ path: menuObj.menu_url });
                }
            }
        }
    };
</script>
<style scoped>
.menu-wrapper {
    min-height: 57px;
}
.menu-wrapper >>> .el-menu {
    padding: 0 10px;
}
.mount-menu-wrapper {
    min-height: 113px;
    background-color: rgb(84, 92, 100);
}
.menu-wrapper >>> .el-container {
    flex-flow: row wrap;
}
.menu-wrapper >>> .el-container {
    outline: 0;
}
</style>
