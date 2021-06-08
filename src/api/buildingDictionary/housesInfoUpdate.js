/**
 * @name: 楼盘信息更新详情APi
 * @description: 楼盘信息更新详情APi
 * @author: 贺伟
 * @date: 2019-11-19
 */
import { axios } from '@/assets/js/http/axios';

// 楼盘信息更新详情接口接口
const projectDetailApi = '/backend-api/project/cj-project-level/detail';

/**
 * 获取楼盘信息更新详情
 * @param {String} id 楼盘id
 * @return {Promise} promise对象
 */
const getProjectDetaiData = (id) => axios.get(projectDetailApi, {params: {project_id: id}});

export default {
    getProjectDetaiData
}