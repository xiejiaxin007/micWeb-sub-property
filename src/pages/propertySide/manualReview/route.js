/*
 * 人工审核路由配置
 * @author xiebin
 * @date 2019.10.31
* */
const ReviewIndex = () => import('./ReviewIndex')
const PhotoReview = () => import('./PhotoReview')

export default {
  path: 'Review',
  name: 'reviewIndex',
  component: ReviewIndex,
  children: [
    {
      path: 'photoReview',
      name: 'photoReview',
      component: PhotoReview,
      meta: {
        tit: '人工审核'
      }
    }
  ]
}

