/**
 * @file 工具函数
 * @author yufeng04
 */
const fs = require('fs');
const path = require('path');

const utils = {

    /**
     * 判断一个对象是否是函数
     * @param {Object} fn 待判断对象
     * @return {boolean} 判断结果
     */
    isFunction(fn) {
        return typeof (fn) === 'function';
    },

    /**
     * 判断是否是字符串
     * @param {Object} obj 待判断对象
     * @return {boolean} 判断结果
     */
    isString(obj) {
        return toString.call(obj) === '[object String]';
    },

    /**
     * 判断是否是对象
     * @param {Object} obj 待判断对象
     * @return {boolean} 判断结果
     */
    isObject(obj) {
        return toString.call(obj) === '[object Object]';
    },

    /**
     * 判断数字
     * @param {Object} obj 待判断对象
     * @return {boolean} 判断结果
     */
    isNumber(obj) {
        return toString.call(obj) === '[object Number]';
    },

    /**
     * 判断布尔
     * @param {Object} obj 待判断对象
     * @return {boolean} 判断结果
     */
    isBoolean(obj) {
        return toString.call(obj) === '[object Boolean]';
    },

    /**
     * 判断数组
     * @param {Object} obj 待判断对象
     * @return {boolean} 判断结果
     */
    isArray(obj) {
        return Array.isArray(obj);
    },

    /**
     * 判断文件
     * @param {string} p 文件路径
     * @return {boolean} 判断结果
     */
    isFile(p) {
        p = (typeof (p) === 'object') ? path.join(p.dir, p.base) : p;
        if (!fs.existsSync(p)) {
            return false;
        }
        return fs.statSync(p).isFile();
    },

    /**
     * 判断目录
     * @param {string} p 路径
     * @return {boolean} 判断结果
     */
    isDir(p) {
        if (!fs.existsSync(p)) {
            return false;
        }
        return fs.statSync(p).isDirectory();
    },

    /**
     * 用于判断目录是否存在
     * @param {string} path 文件目录
     * @return {boolean} 判断结果
     */
    isExist(path) {
        return fs.existsSync(path);
    }
};

module.exports = utils;