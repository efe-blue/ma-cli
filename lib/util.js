/**
 * @file 工具函数
 * @author yufeng04
 */
const fs = require('fs');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const path = require('path');
const inquirer = require('inquirer');

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
    },

    /**
     * 读取文件
     * @param {string} p 文件路径
     * @return {string} 读取的数据
     */
    readFile(p) {
        let rst = '';
        p = (typeof (p) === 'object') ? path.join(p.dir, p.base) : p;
        try {
            rst = fs.readFileSync(p, 'utf-8');
        } catch (e) {
            rst = null;
        }
        return rst;
    },

    /**
     * 向文件中写入数据
     * @param {string} p 文件路径
     * @param {Object} data 写入文件的数据
     */
    writeFile(p, data) {
        let opath = (this.isString(p) ? path.parse(p) : p);
        if (!this.isDir(opath.dir)) {
            mkdirp.sync(opath.dir);
        }
        fs.writeFileSync(p, data);
    },

    /**
     * 格式化时间
     * @param {Object} date 时间对象
     * @param {string} format 时间格式
     * @return {string} 对应格式的时间
     */
    datetime(date = new Date(), format = 'HH:mm:ss') {
        let fn = d => {
            return ('0' + d).slice(-2);
        };
        if (date && this.isString(date)) {
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
    },

    /**
     * 输出
     * @param {string} msg 输出信息
     * @param {string} type 输出信息类型
     * @param {boolean} showTime 是否显示时间
     */
    log(msg, type, showTime = false) {
        let dateTime = showTime ? chalk.gray(`[${this.datetime()}] `) : '';
        if (this.isObject(msg) || this.isArray(msg)) {
            msg = JSON.stringify(msg);
        }
        if (type && this.isString(type)) {
            type = type.toUpperCase();
            if (type === 'ERROR') {
                if (msg instanceof Error) {
                    console.error(chalk.red(msg.stack));
                } else {
                    console.error(chalk.red('[Error] ' + msg));
                }
            } else if (type === 'WARNING') {
                console.error(chalk.yellow('[Warning] ' + msg));
            } else if (type === 'SUCCESS') {
                console.log(dateTime + chalk.green('[Success] ' + msg));
            } else {
                console.log(dateTime + chalk.gray('[Info] ' + msg));
            }
        } else {
            console.log(dateTime + msg);
        }
    },

    /**
     * 交互操作
     * @param {string} msg 交互信息
     * @param {string} type 交互类型
     * @return {Promise<mixed>} promise
     */
    interactive(msg, type) {
        type = type.toLowerCase();
        switch (type) {
            case 'confirm':
                return inquirer.prompt([{
                    type: 'confirm',
                    message: msg,
                    name: 'ans'
                }]);
            case 'default':
                return inquirer.prompt([{
                    default: 'no',
                    message: msg,
                    name: 'ans'
                }]);
        }
    }
};

module.exports = utils;