/*
 * @author: kangxue
 * @Date: 2020-11-20 10:44:25
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2020-11-25 11:50:26
 * @description: 楼盘资料库api
 */
import { axios } from '@/assets/js/http/axios';
// 获取楼盘资料库列表
const getDataBankListApi = '/backend-api/project/cj-project-data-package/get-list';
// 楼盘资料包页面获取页面权限接口
const getPermissionApi = '/backend-api/project/cj-project-data-package/get-permission';
// 资料删除接口，可删除文件和目录，批量删除
const deleteFilesApi = '/backend-api/project/cj-project-data-package/del';
// 新建文件夹接口
const addFolderApi = '/backend-api/project/cj-project-data-package/new-folder';
// 重命名接口
const reNameFolderApi = '/backend-api/project/cj-project-data-package/rename';
// 上传文件API
const uploadFileApi = '/backend-api/project/cj-project-data-package/new-file';
// 上传文件名重复校验API
const checkFileNameApi = '/backend-api/project/cj-project-data-package/check-name';

/**
* 获取楼盘资料库列表
* @param {Object} option 参数描述
* @param {string} option.project_id	楼盘id
* @param {string} option.parent_id	父级id
* @param {string} option.file_name	文件名称，模糊查询
* @param {string} option.page	页码，默认1
* @param {string} option.page_size	页长，默认20
* @param {string} option.sort_field	排序字段：create_datetime：1，update_datetime：2   默认1
* @param {string} option.sort_type	排序类型：正序1，倒叙2，默认2    无序为空
*/
const getDataBankList = (params) => axios.get(getDataBankListApi, {params});
/**
* 楼盘资料包页面获取页面权限接口
* @param {Object} option 参数描述
*/
const getPermission = (params) => axios.get(getPermissionApi, {params});
/**
* 资料删除接口，可删除文件和目录，批量删除
* @param {Object} option 参数描述
* @param {Array} option.ids	要删除的文件或文件夹id
*/
const deleteFiles = (params) => axios.post(deleteFilesApi, params);
/**
* 新建文件夹接口
* @param {Object} option 参数描述
* @param {string} option.project_id	楼盘id
* @param {string} option.parent_id	父级id
* @param {string} option.name	文件夹名称
*/
const addFolder = (params) => axios.post(addFolderApi, params);
/**
* 重命名接口
* @param {Object} option 参数描述
* @param {string} option.id	文件id
* @param {string} option.name	文件名称
*/
const reNameFolder = (params) => axios.post(reNameFolderApi, params);
/**
* 上传文件接口
* @param {Object} option 参数描述
* @param {string} option.project_id	楼盘id
* @param {string} option.parent_id	父级目录id ，默认0
* @param {string} option.file	上传的文件数组
* @param {string} option.file.url	文件url
* @param {string} option.file.size	文件大小
* @param {string} option.file.name	文件名字
*/
const uploadFile = (params) => axios.post(uploadFileApi, params);
/**
* 上传文件名重复校验
* @param {Object} option 参数描述
* @param {string} option.project_id	楼盘id
* @param {string} option.parent_id	父级目录id，默认为首目录0
* @param {Array} option.name  文件名称
*/
const checkFileName = (params) => axios.post(checkFileNameApi, params);


export default {
    getDataBankList,
    getPermission,
    reNameFolder,
    uploadFile,
    deleteFiles,
    addFolder,
    checkFileName
};