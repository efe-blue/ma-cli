/**
 * @file 提示
 * @author yufeng04
 */

const chalk = require('chalk');
const util = require('./util');
const formateDate = require('./date');

const log = {
    /**
     * 输出
     * @param {string} msg 输出信息
     * @param {string} type 输出信息类型
     * @param {boolean} showTime 是否显示时间
     */
    consoleLog(msg, type, showTime = false) {
        let dateTime = showTime ? chalk.gray(`[${formateDate()}] `) : '';
        if (util.isObject(msg) || util.isArray(msg)) {
            msg = JSON.stringify(msg);
        }
        if (type && util.isString(type)) {
            type = type.toLowerCase();
            switch (type) {
                case 'error':
                    msg instanceof Error ? console.error(chalk.red(msg.stack)) : console.error(chalk.red('[Error] ' + msg));
                    break;
                case 'warning':
                    console.error(chalk.yellow('[Warning] ' + msg));
                    break;
                case 'success':
                    console.log(dateTime + chalk.green('[Success] ' + msg));
                    break;
                default:
                    console.log(dateTime + chalk.gray('[Info] ' + msg));
            }
        } else {
            console.log(dateTime + msg);
        }
    }
}

module.exports = log.consoleLog;