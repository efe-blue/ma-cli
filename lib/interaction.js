/**
 * @file 交互信息
 * @author yufeng04
 */

const inquirer = require('inquirer');

const interaction = {
    /**
     * 交互操作
     * @param {string} msg 交互信息
     * @param {string} type 交互类型
     * @return {Promise<mixed>} promise
     */
    interact(msg, type, defaultVal = 'no') {
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
                    default: defaultVal,
                    message: msg,
                    name: 'ans'
                }]);
        }
    }
}

module.exports = interaction.interact