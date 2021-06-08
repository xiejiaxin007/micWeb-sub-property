/*
 * 城市开站路由配置
* */
const CityIndex = () => import('./CityIndex')
const CitySettingTab = () => import('./CitySettingTab')
const EditorCitySetting = () => import('./EditorCitySetting')

export default {
  path: 'city',
  name: 'cityIndex',
  component: CityIndex,
  children: [
    {
      path: 'citySettingTab',
      name: 'citySettingTab',
      component: CitySettingTab,
      meta: {
        tit: '开站配置列表'
      }
    },
    {
      path: 'editorCitySetting',
      name: 'editorCitySetting',
      component: EditorCitySetting,
      meta: {
        tit: '城市级配置'
      }
    }
  ]
}

