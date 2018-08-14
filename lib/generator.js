/**
 * @file 模板生成器
 * @author wangning
 */

const metalsmith = require('metalsmith');
const handlebars = require('handlebars');
const rm = require('rimraf').sync;
const filter = require('./filter.js');

module.exports = function (metadata = {}, src, dest = './dist') {
    if (!src) {
        return Promise.reject(new Error(`无效的source:${src}`));
    }

    return new Promise((resolve, reject) => {
        metalsmith(process.cwd())
            .metadata(metadata)
            .clean(false)
            .source(src)
            .destination(dest)
            .use(filter)
            .use((files, metalSmith, done) => {
                const meta = metalSmith.metadata();
                Object.keys(files).forEach(fileName => {
                    const t = files[fileName].contents.toString();
                    files[fileName].contents = Buffer.from(handlebars.compile(t)(meta));
                });
                done();
            })
            .build(err => {
                if (err) {
                    rm(dest);
                    reject(err);
                    return;
                }
                resolve();
            });
    });
};
