#!/usr/bin/env node
/**
 * @file 命令行定义
 * @author yufeng04
 */
'use strict';

const program = require('commander');
// 处理命令行字体
const chalk = require('chalk');

// 版本信息
program
    .version(require('../package').version, '-v, --version')
    .usage('<command> [options]');

// 初始化命令 新建项目 action可拿到的参数为 project-name 和 program
program
    .command('init [project-name]')
    .description('generate a new project')
    .action(require('./ma-init'))
    .usage('[options] <project-name>')
    .option('-t,--template <template-name> [project-name]', 'generate a new project from a template')
    .on('--help', () => {
        console.log();
        console.log('  Example:');
        console.log();
        console.log(chalk.gray('   # create a new project with an origin template'));
        console.log('  $ ma init myproject');
        console.log();
        console.log(chalk.gray('   # create a new project with an other template'));
        console.log('  $ ma init --template template-name myproject');
        console.log();
    });

// 增加空page or component文件 action 可拿到的参数为 program
program
    .command('add')
    .description('add a new file')
    .action(require('./ma-add'))
    .usage('[options] <file-name>')
    .option('-p, --page <page-name> [package-name]', 'generate a new page')
    .option('-c, --component <component-name>', 'generate a new component')
    .on('--help', () => {
        console.log();
        console.log('  Example:');
        console.log();
        console.log(chalk.gray('   # generate a new page'));
        console.log('  $ ma add -p mypage');
        console.log();
        console.log(chalk.gray('   # generate a new page'));
        console.log('  $ ma add -p mypage packageA');
        console.log();
        console.log(chalk.gray('   # create a new component'));
        console.log('  $ ma add -c mycomponent');
        console.log();
    });


// 升级脚手架工具
program
    .command('upgrade')
    .description('upgrade to the latest version')
    .action(require('./ma-upgrade'))
    .option('--ma', 'upgrade ma')
    .option('--cli', 'upgrade cli')
    .on('--help', () => {
        console.log();
        console.log('  Example:');
        console.log();
        console.log(chalk.gray('   # upgrade ma'));
        console.log('  $ ma upgrade --ma');
        console.log();
        console.log(chalk.gray('   # upgrade cli'));
        console.log('  $ ma upgrade --cli');
        console.log();
    });

program
	.command('list')
	.description('List all the templates')
	.alias('l')
    .action(require('./ma-list'))
    .option('-g, --github', 'list all registered github projects');


// 参数处理
program.parse(process.argv);


// todo: 统一处理不合法命令
if (!program.args.length) {
    program.help();
}
