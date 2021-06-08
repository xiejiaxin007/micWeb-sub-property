/**
 * @name: svg配置文件
 * @description: svg入口文件
 * @author: wangshuaixue
 * @date: 2019-12-24
 */

// 引入svg文件夹下相应的所有svg文件
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)