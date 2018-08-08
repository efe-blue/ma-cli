/**
 * @file 文件操作
 * @author yufeng04
 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const util = require('./util');
const path = require('path');

const operateFile = {
    
    /**
     * 读取文件
     * @param {string} p 文件路径
     * @return {string} 读取的数据
     */
    readFile(p) {
        let rst = '';
        p = (typeof (p) === 'object') ? path.join(p.dir, p.base) : p;
        try {
            rst = fs.readFileSync(p, 'utf-8');
        } catch (e) {
            rst = null;
        }
        return rst;
    },

    /**
     * 向文件中写入数据
     * @param {string} p 文件路径
     * @param {Object} data 写入文件的数据
     */
    writeFile(p, data) {
        let opath = (util.isString(p) ? path.parse(p) : p);
        if (!util.isDir(opath.dir)) {
            mkdirp.sync(opath.dir);
        }
        fs.writeFileSync(p, data);
    }
}

module.exports = operateFile;