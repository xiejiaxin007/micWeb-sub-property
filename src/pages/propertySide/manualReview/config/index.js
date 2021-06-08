/**
 * @description 当前模块本地数据抽离整合页面
 * @updateTime 2019.10。31
 * @author 解彬
 */

//  跳转页面下拉数据
const pagesSelect = [
    {
        url: '/dist/review/photoReview',
        text: '图片审核'
    },
    {
        url: '/index.php?r=bd-project-dongtai/index',
        text: '楼盘动态审核'
    },
    {
        url: '/index.php?r=bd-project-comment%2Findex',
        text: '用户评论审核'
    }
]
export default {
    pagesSelect
}