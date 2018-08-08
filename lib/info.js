/**
 * @file 提示及交互信息
 * @author yufeng04
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const util = require('./util');

const info = {
    
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
    },

    /**
     * 输出
     * @param {string} msg 输出信息
     * @param {string} type 输出信息类型
     * @param {boolean} showTime 是否显示时间
     */
    log(msg, type, showTime = false) {
        let dateTime = showTime ? chalk.gray(`[${this.datetime()}] `) : '';
        if (util.isObject(msg) || util.isArray(msg)) {
            msg = JSON.stringify(msg);
        }
        if (type && util.isString(type)) {
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
}

module.exports = info;