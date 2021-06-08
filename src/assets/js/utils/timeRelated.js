import moment from 'moment';
export default {
    /**
     * 时间戳转换为年月日格式
     * @param {string} para 时间、默认不取毫秒，即后三位毫秒为0
     * @param {string} type 要转换的格式 例如'YYYY-MM-DD HH:mm:ss'
     * return 传入的时间格式
     */
    filterDate(para, type) {
        if (!para) {
            return;
        }
        let time = parseInt(para);
        return moment(time).format(type);
    }
}
