#!/usr/bin/env node
/**
 * @file <command>init
 * @author wangning
 */

const home = require('user-home');
const inquirer = require('inquirer');
const generator = require('../lib/generator.js');
const path = require('path');
const utils = require('../lib/util.js');
const consoleLog = require('../lib/log');
const download = require('../lib/download.js');
const rm = require('rimraf').sync;

/**
 * 初始化项目
 *
 * @param {string} projectName 初始化项目所在的文件夹名
 * @param {Object} program 命令行对象
 */
module.exports = function (projectName = 'dist', program) {
    if (!program) {
        program = projectName;
        projectName = null;
    }

    // 当前命令目录下，判断是否已存在projectName
    if (utils.isExist(`${process.cwd()}/${projectName}`)) {
        consoleLog(`创建失败：${projectName}已存在`, 'ERROR');
        return;
    }

    if (!program.template) {
        consoleLog('您未指定模板，将默认使用官方原生模板', 'WARNING');
    }

    const templateName = program.template || 'empty';
    const tempFilesPath = path.join(home, '.ma-templates');

    fetchTemplate(templateName, tempFilesPath)
        .then(() => inquirer.prompt([
            {
                name: 'appid',
                message: '请输入appid'
            }
        ]))
        .then(answers => {
            const metadata = {
                projectName,
                appid: answers.appid
            };

            return generator(
                metadata,
                path.join(tempFilesPath, templateName),
                `${process.cwd()}/${projectName}`
            );
        }).then(() => {
        consoleLog('创建成功', 'SUCCESS');
    }).catch(err => {
        consoleLog(`创建失败：${err}`, 'ERROR');
    });
};

function fetchTemplate(templateName, tempFilesPath) {
    if (utils.isExist(tempFilesPath)) {
        rm(tempFilesPath);
    }
    return download.downloadOfficialZip(templateName, tempFilesPath, {extract: true})
        .catch(e => {
            if (e && e.statusCode === 404) {
                throw new Error(`无法识别模板名称${templateName}`);
            }
            throw new Error(`无法下载模板${templateName}`);
        });

}