/**
 * @name: 拓展维护楼盘信息&信息标记来源 页面配置文件
 * @description: 拓展维护楼盘信息&信息标记来源 配置项文件
 * @author: 贺伟
 * @date: 2019-12-14
 */

export const herfLinks = {
    // 新增户型页面链接
    addHouse: ''
};

// 楼栋导入文件配置项
export const buildingConf = {
    // 导入的文件类型
    fileType: ['.xls', '.xlsx'],
    // 导入的文件大小限制 单位M
    sizeLimit: 10
};

// 旬配置数据
export const tendayList = [
    {text: '上旬', value: 1},
    {text: '中旬', value: 2},
    {text: '下旬', value: 3}
];

// 角色数据
export const roleNumList = {
    // 运营
    yunYing: 7,
    // 拓展
    tuoZhan: 1
};

// 销售状态按钮 埋点ID数据
export const trackIdList = {
    // 楼盘
    project: 6482,
    // 户型
    houseType: 6483,
    // 楼栋
    building: 6484,
    // 分期
    stageing: 6485
};

// 文件后缀与icon类型对应关系
export const fileTypeList = {
    // word
    'doc': 'doc',
    'docx': 'doc',
    // 文本
    'txt': 'txt',
    // 图片
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    // excel
    'xls': 'excel',
    'xlsx': 'excel',
    'csv': 'excel',
    // pdf
    'pdf': 'pdf',
    // PPT
    'ppt': 'ppt',
    'pptx': 'ppt',
    // 压缩包
    'zip': 'zip',
    'rar': 'zip',
    // 音频
    'mp3': 'audio',
    'mp4': 'audio',
    // 视频
    'wmv': 'video',
    'avi': 'video',
    'mpeg': 'video',
    'mpg': 'video',
    'rm': 'video',
    'rmvb': 'video',
    'flv': 'video',
    '3gp': 'video',
    'mov': 'video',
    'mkv': 'video'
}