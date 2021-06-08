/**
 * 楼盘管理路由
 */
const HouseManage = () => import('./HouseManageIndex')
const LandCrawl = () => import('./LandCrawl')
export default {
  path: 'houseManage',
  name: 'HouseManage',
  component: HouseManage,
  children: [
    {
      path: 'landCrawl',
      name: 'LandCrawl',
      component: LandCrawl,
      meta: {
        tit: '土地爬取信息'
      }
    }
  ]
}
