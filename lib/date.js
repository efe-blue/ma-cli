/**
 * @file 日期格式化
 * @author yufeng04
 */

const util = require('./util');

const date = {

    /**
     * 格式化时间
     * @param {Object} date 时间对象
     * @param {string} format 时间格式
     * @return {string} 对应格式的时间
     */
    formateDate(date = new Date(), format = 'HH:mm:ss') {
        let fn = d => {
            return ('0' + d).slice(-2);
        };
        if (date && util.isString(date)) {
            date = new Date(Date.parse(date));
        }
        const formats = {
            YYYY: date.getFullYear(),
            MM: fn(date.getMonth() + 1),
            DD: fn(date.getDate()),
            HH: fn(date.getHours()),
            mm: fn(date.getMinutes()),
            ss: fn(date.getSeconds())
        };
        return format.replace(/([a-z])\1+/ig, function (a) {
            return formats[a] || a;
        });
    }
}

module.exports = date.formateDate