// 引入各个模块的路由
// 楼盘侧，楼盘对比和报错页面展示
const Login = () => import('@/pages/Login')
const Main = () => import('@/pages/Main')

import buildingSige from '@/pages/propertySide/buildingDictionary/route';

const routes = [
    ...buildingSige
]

export default routes;