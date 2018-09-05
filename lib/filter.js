/**
 * @file 用于metalsmith的过滤文件插件
 * @author wangning
 */
const path = require('path');

// 不需要被屏蔽的隐藏类型文件的白名单
const whiteList = new Set([
    '.gitignore',
    '.macli.config.json'
]);

/**
 * 从根目录开始递归判断，只判断第一次出现的.开头的命名.
 *
 * @param {string} fileName
 * @return {boolean} false过滤  true不过滤
 */
function filter(fileName) {
    const reg = /^\..*$/g;
    let splitArr = fileName.split(path.sep);
    for (let i = 0, len = splitArr.length; i < len; i++) {
        let item = splitArr[i];
        if (reg.test(item)) {
            return whiteList.has(item);
        }
    }
    return true;
}

module.exports = function (files, metalSmith, done) {
    Object.keys(files).forEach(fileName => {
        // 对隐藏文件进行白名单形式过滤
        if (!filter(fileName)) {
            delete files[fileName];
        }
    });
    done();
};