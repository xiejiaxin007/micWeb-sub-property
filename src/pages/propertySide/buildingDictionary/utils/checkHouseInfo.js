/**
 * @description 户型信息相关校验方法
 * @author xiebin
 * @time 2019.12.25
 */


/**
 * 校验户型居室联动是否自洽
 * @param {string} houseVal 厅室描述 室的值 传入的时候需要转成Number类型
 * @param {string} houseRoomVal 下拉户型居室选中的值
 * @return {Boolean} flag 是否通过
 * @description 使用时需要在mounted里面将该方法绑定到实例上 eg: this.hosueRoomIsReg = hosueRoomIsReg
 */
export function hosueRoomIsReg(houseVal, houseRoomVal) {
    let flag = true;
    let checkOne = (houseVal > 1 || (houseVal === 1 && (houseRoomVal !== 0 && houseRoomVal !== 7))) && houseVal <= 5 && houseVal !== houseRoomVal;
    let checkTwo = houseVal > 1 && houseVal > 5 && houseRoomVal !== 5;
    if (checkOne || checkTwo) {
        this.$alert('厅室描述和户型居室不匹配，请确认检查信息！', '提示', {
            confirmButtonText: '确定'
        });
        flag = false;
    }
    return flag
}