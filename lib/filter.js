/**
 * @file 用于metalsmith的过滤文件插件
 * @author wangning
 */
const path = require('path');

// 白名单
const nameSet = new Set([
    'compo.css',
    'compo.js',
    'compo.json',
    'compo.swan',
    'index.css',
    'index.js',
    'index.json',
    'index.swan',
    'app.css',
    'app.less',
    'app.js',
    'app.json',
    'project.swan.json',
    'base.less',
    'config.js',
    '.gitignore',
    'gulpfile.js',
    'package.json',
    'README.md'
]);

function filter(fileName) {
    return nameSet.has(fileName);
}

module.exports = function (files, metalSmith, done) {
    Object.keys(files).forEach(fileName => {
        if(!filter(path.basename(fileName))) {
            delete files[fileName];
        }
    });
    done();
};