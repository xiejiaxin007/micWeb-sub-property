/*
 * 楼盘侧路由
* */
const BuildingCompare = () => import('./BuildingCompare');
const HouseContrast = () => import('./HouseContrast');
const BuildInfoContrast = () => import('./BuildInfoContrast');
const Changedetails = () => import('./Changedetails');
const BuildMessageAudit = () => import('./BuildMessageAudit');
// 变更通知录入页
const ChangeInfoEntering = () => import('./ChangeInfoEntering');
// 楼盘信息更新详情页
const HousesInfoUpdateDetail = () => import('./HousesInfoUpdateDetail');
// 楼盘动销更新列表
const BuildSalesInfoUpdate = () => import('./BuildSalesInfoUpdate');
// 楼盘任务列表
const ExpandTaskList = () => import('./expandInfoTaskList/ExpandTaskList');
// 拓展维护楼盘新增、编辑任务
const ExpandEditTask = () => import('./expandInfoTaskList/ExpandEditTask');
// tab切换
const TabToggleList = () => import(/* webpackChunkName: "TabToggleList" */'./expandInfoTaskList/TabToggleList');
// 户型详情
const BuildAddHouseDetail = () => import('./expandInfoTaskList/BuildAddHouseDetail');
// 户型详情查看
const BuildAddHouseView = () => import('./expandInfoTaskList/BuildAddHouseView');
// 放量计划详情
const CapacityPlan = () => import('./expandInfoTaskList/CapacityPlan');
// 楼栋详情
const BuildingDetailEdit = () => import('./expandInfoTaskList/BuildingDetailEdit');
// 审核任务详情
const ExpandAuditTaskDetail = () => import('./expandInfoTaskList/ExpandAuditTaskDetail');
// 高质量信息源配置列表
const QualityList = () => import('./automaticMaintenance/QualityList.vue');
// 新增编辑高质量信息源配置
const AddQualityInfo = () => import('./automaticMaintenance/AddQualityInfo');
// 资料库
const BuildingDataBank = () => import('./BuildingDataBank.vue');

export default [
    {
      path: '/buildingCompare',
      name: 'BuildingCompare',
      component: BuildingCompare,
      meta: {
        tit: '楼盘信息对比页'
      }
    },
    {
      path: '/houseContrast',
      name: 'HouseContrast',
      component: HouseContrast,
      meta: {
        tit: '户型信息对比页'
      }
    },
    {
      path: '/buildInfoContrast',
      name: 'BuildInfoContrast',
      component: BuildInfoContrast,
      meta: {
        tit: '楼栋信息对比页'
      }
    },
    /* 运营楼盘信息审核>>>变更详情页面 */
    {
      path: '/changedetails',
      name: 'Changedetails',
      component: Changedetails,
      meta: {
        tit: '变更详情'
      }
    },
    // 运营楼盘信息审核
    {
      path: '/buildMessageAudit',
      name: 'BuildMessageAudit',
      component: BuildMessageAudit,
      meta: {
        tit: '楼盘动销信息审核'
      }
    },
    // 商务变更信息录入页面
    {
        path: '/changeInfoEntering',
        name: 'ChangeInfoEntering',
        component: ChangeInfoEntering,
        meta: {
          tit: '信息录入'
        }
    },
    // 楼盘信息更新详情页
    {
        path: '/housesInfoUpdateDetail',
        name: 'HousesInfoUpdateDetail',
        component: HousesInfoUpdateDetail,
        meta: {
          tit: '楼盘信息更新详情'
        }
    },
    // 楼盘动销信息更新列表
    {
      path: '/buildSalesInfoUpdate',
      name: 'BuildSalesInfoUpdate',
      component: BuildSalesInfoUpdate,
      meta: {
        tit: '楼盘动销信息更新列表'
      }
    },
    // 拓展维护楼盘任务列表
    {
      path: '/expandTaskList',
      name: 'ExpandTaskList',
      component: ExpandTaskList,
      meta: {
        tit: '楼盘任务列表'
      }
    },
    // 拓展维护楼盘新增任务
    {
      path: '/expandEditTask',
      name: 'ExpandEditTask',
      component: ExpandEditTask,
      meta: {
        tit: '楼盘新增任务'
      }
    },
    // tab切换
    {
      path: '/tabToggleList',
      name: 'TabToggleList',
      component: TabToggleList,
      meta: {
        tit: '楼盘名称&位置'
      }
    },
    // 新增户型/编辑
    {
      path: '/buildAddHouseDetail',
      name: 'buildAddHouseDetail',
      component: BuildAddHouseDetail,
      meta: {
        tit: '户型详情编辑'
      }
    },
    // 新增户型查看页面
    {
      path: '/buildAddHouseView',
      name: 'buildAddHouseView',
      component: BuildAddHouseView,
      meta: {
        tit: '户型详情查看'
      }
    },
    // 放量计划详情
    {
        path: '/capacityPlan',
        name: 'CapacityPlan',
        component: CapacityPlan,
        meta: {
          tit: '放量计划详情'
        }
    },
    // 楼栋详情
    {
        path: '/buildingDetailEdit',
        name: 'BuildingDetailEdit',
        component: BuildingDetailEdit,
        meta: {
          tit: '楼栋详情'
        }
    },
    // 审核任务
    {
        path: '/expandAuditTaskDetail',
        name: 'ExpandAuditTaskDetail',
        component: ExpandAuditTaskDetail,
        meta: {
          tit: '审核任务'
        }
    },
    // 查看审核任务详情
    {
        path: '/showAuditTaskDetail',
        name: 'ShowAuditTaskDetail',
        component: ExpandAuditTaskDetail,
        meta: {
          tit: '审核任务详情'
        }
    },
    // 高质量信息源配置列表
    {
        path: '/qualityList',
        name: 'qualityList',
        component: QualityList,
        meta: {
          tit: '高质量信息源配置'
        }
    },
    // 新增高质量信息源配置
    {
        path: '/addQualityInfo',
        name: 'addQualityInfo',
        component: AddQualityInfo,
        meta: {
          tit: '新增高质量信息源配置'
        }
    },
    // 编辑高质量信息源配置
    {
        path: '/editQualityInfo',
        name: 'editQualityInfo',
        component: AddQualityInfo,
        meta: {
          tit: '编辑高质量信息源配置'
        }
    },
    // 楼盘资料库
    {
        path: '/buildingDataBank',
        name: 'buildingDataBank',
        component: BuildingDataBank,
        meta: {
          tit: '楼盘资料库'
        }
    }
  ];
