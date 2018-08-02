#!/usr/bin/env node
/**
 * @file <command>init
 * @author wangning
 */

const inquirer = require('inquirer');
const generator = require('../lib/generator.js');
const path = require('path');
const utils = require('../lib/util.js');

/**
 * 初始化项目
 * @param {string} projectName 初始化项目所在的文件夹名
 * @param {Object} program 命令行对象
 */
module.exports = function (projectName, program) {

    // 当前命令目录下，判断是否已存在projectName
    if (utils.isExist(`${process.cwd()}/${projectName}`)) {
        utils.log(`创建失败：${projectName}已存在`, 'ERROR');
        return;
    }


    let prompter = inquirer.prompt([
        {
            name: 'appid',
            message: '请输入appid'
        }
    ]);

    init();

    function init() {
        prompter.then(answers => {
            const metadata = {
                projectName,
                appid: answers.appid
            };

            return generator(
                metadata,
                path.resolve(__dirname, '../template/project'),
                `${process.cwd()}/${projectName}`
            );
        }).then(() => {
            utils.log('创建成功', 'SUCCESS');
        }).catch(err => {
            console.error(`创建失败：${err}`, 'ERROR');
        });
    }
};
