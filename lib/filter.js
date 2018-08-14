/**
 * @file 用于metalsmith的过滤文件插件
 * @author wangning
 */
const path = require('path');

const nameSet = new Set([
    '.DS_Store',
    'template.config.json'
]);

function filter(fileName) {
    return nameSet.has(fileName);
}

module.exports = function (files, metalSmith, done) {
    Object.keys(files).forEach(fileName => {
        if(filter(path.basename(fileName))) {
            delete files[fileName];
        }
    });
    done();
};