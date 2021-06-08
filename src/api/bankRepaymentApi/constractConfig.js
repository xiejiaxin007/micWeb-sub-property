import { axios } from '@/assets/js/http/axios';

// 受否关联合同api接口
const relationContractApi = '/backend-api/expand/ex-contract-custom-cate-condition/get-is-relation-contract';

// 合同分类条件列表接口
const constractListApi = '/backend-api/expand/ex-contract-custom-cate-condition/index';

// 获取get/保存post合同分类条件设置数据接口
const conditionCategoryApi = '/backend-api/expand/ex-contract-custom-cate-condition/edit';

// 合同分类条件删除
const constractCategoryDelApi = '/backend-api/expand/ex-contract-custom-cate-condition/delete';

// 获取城市接口
const cityApi = '/backend-api/select2/select2/get-all-city-code';



/**
 * 获取合同分类条件名称接口
 * @param {String} query 查询条件
 * @return {Object<promis>} promise对象
 */
const getCategorNamesData = (query) => axios.post(searchNameApi, query);

/**
 * 获取是否关联合同数据
 * @return {Object<promise>} promise对象
 */
const getIsrelationContractData = (options) => axios.get(relationContractApi, {params: options});

/**
 * 获取合同分类条件列表页数据
 * @param {Object} options 保存的数据对象
 * @param {String} options.id 分类条件id 新数据值为空,必须有该字段
 * @param {String} options.city_id 适用城市
 * @param {String} options.is_relation_contract 是否关联合同
 * @param {String} options.pageIndex 当前页码下标
 * @return {Object<promise>} promise对象
 */
const getConstractList = (options) => axios.get(constractListApi, {params: options});

/**
 * 设置合同分类条件设置保存数据
 * @param {Object} options 保存的数据对象
 * @param {String} options.id 分类条件id 新数据值为空,必须有该字段
 * @param {String} options.category_name 分类名称
 * @param {String} options.suitCityArr 适用城市数组
 * @param {String} options.conditionOptionsArr 分类选项数组
 * @return {Object<promise>} promise对象
 */
const setConditionCategoryData = (options) => axios.post(conditionCategoryApi, options);

/**
 * 获取合同分类条件设置数据
 * @param {String} id 分类条件id
 * @return {Object<promise>} promise对象
 */
const getConditionCategoryData = (id) => axios.get(conditionCategoryApi, {params: {id}});

/**
 * 删除合同分类条件
 * @param {String} id 分类条件id
 * @return {Object<promise>} promise对象
 */
const deleteConstractCategory = (id) => axios.get(constractCategoryDelApi, {params: {id}});


/**
 * 获取城市接口
 * @param {String} q 关键字
 * @return {Object<promise>} promise对象
 */
const getCitys = (q) => axios.get(cityApi, {params: {q}});


export default {
    getIsrelationContractData,
    getConstractList,
    setConditionCategoryData,
    getConditionCategoryData,
    deleteConstractCategory,
    getCitys
};