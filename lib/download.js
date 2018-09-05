/**
 * @file 下载功能模块
 * @author wangning
 */

const download = require('download');
const downloadGitRepo = require('download-git-repo');

// const offcialGitUrl = 'https://raw.githubusercontent.com/efe-blue/ma-templates/master/zips/';
const offcialGitUrl = 'https://github.com/YUFENG00/ma-templates/raw/master/zips/';

module.exports.downloadOfficialZip
    = (templateName, dist, options) => download(`${offcialGitUrl}${templateName}.zip`, dist, options);

module.exports.downloadRepo = (...arg) => downloadGitRepo(...arg);
