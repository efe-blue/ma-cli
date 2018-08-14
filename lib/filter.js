/**
 * @file 用于metalsmith的过滤文件插件
 * @author wangning
 */
const path = require('path');

// 不需要被屏蔽的隐藏类型文件的白名单
const whiteList = new Set([
    '.gitignore'
]);

// 其他需要屏蔽的黑名单
const blackList = new Set([
    'template.config.json'
]);

module.exports = function (files, metalSmith, done) {
    const reg = /^\..*$/g;
    Object.keys(files).forEach(fileName => {
        const basename = path.basename(fileName);
        // 对隐藏文件进行白名单形式过滤,普通文件进行黑名单形式过滤
        if (reg.test(basename) && !whiteList.has(basename)) {
            delete files[fileName];
        } else if (blackList.has(basename)) {
            delete files[fileName];
        }
    });
    done();
};