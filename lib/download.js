/**
 * @file 下载功能模块
 * @author wangning
 */

const download = require('download');
const downloadGitRepo = require('download-git-repo');

module.exports.downloadOfficialZip = function(templateName, dist, options) {
    return download(`https://raw.githubusercontent.com/efe-blue/ma-templates/master/zips/${templateName}.zip`, dist, options);
};

module.exports.downloadRepo = function(...arg) {
    return downloadGitRepo(...arg);
};