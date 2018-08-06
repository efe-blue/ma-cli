/**
 * @file 添加page 或 component文件
 * @author yufeng04
 */

const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars');
const rm = require('rimraf').sync;
const util = require('../lib/util');
// node path模块
const path = require('path');
const home = require('user-home');

function add(isPage, appJsonPath, fileName, src, dest, subPackage) {
    try {
        isPage && addAppConf(appJsonPath, fileName, subPackage);
        addFile(src, dest, fileName).then(() => {
            util.log(`${isPage ? '页面' : '组件'} ${fileName} 创建成功`, 'success');
        });
    }
    catch (err) {
        console.log(err);
    }
}

function addAppConf(appJsonPath, fileName, subPackage) {
    let appJsonData = JSON.parse(util.readFile(appJsonPath));
    let routerPath = `pages/${fileName}/${fileName}`;

    // 主包配置写入
    if (!subPackage) {
        if (inArray(appJsonData.pages, routerPath)) {
            return;
        }

        appJsonData.pages = appJsonData.pages || [];
        appJsonData.pages.push(routerPath);
    }
    // 分包配置写入
    else {
        let conf = appJsonData.subPackages || [];
        let subPackageIndex = getSubpackageIndex(conf, subPackage);

        if (subPackageIndex !== false
            && conf[subPackageIndex]
            && Object.keys(conf[subPackageIndex]).length
        ) {
            conf[subPackageIndex] = conf[subPackageIndex] || {};
            conf[subPackageIndex].pages = conf[subPackageIndex].pages || [];
            if (inArray(conf[subPackageIndex].pages, routerPath)) {
                return;
            }

            conf[subPackageIndex].pages.push(routerPath);
        }
        else {
            conf.push(
                {
                    root: subPackage,
                    pages: [
                        routerPath
                    ]
                }
            );
        }
        appJsonData.subPackages = conf;
    }

    util.writeFile(appJsonPath, JSON.stringify(appJsonData, null, 4));
}

function inArray(arr = [], item) {
    return arr.includes(item);
}

function getSubpackageIndex(conf, subPackage) {
    for (let i = 0, len = conf.length; i < len; i++) {
        if (conf[i].root === subPackage) {
            return i;
        }
    }
    return false;
}

/**
 * 添加文件 page or component
 *
 * @param {string} src 源文件路径
 * @param {string} dest 目标文件路径
 * @param {string} fileName 新文件前缀
 * @return {Promise<mixed>} promise
 */
function addFile(src, dest, fileName) {
    return new Promise((resolve, reject) => {
        Metalsmith(process.cwd())
            .metadata({})
            .clean(false)
            .source(src)
            .destination(dest)
            .use((files, metalsmith, done) => {
                const meta = metalsmith.metadata();
                Object.keys(files).forEach(oldName => {
                    // 使用自定义文件名
                    let newName = rename(oldName, fileName);
                    // 修改 键名
                    files[newName] = files[oldName];
                    // 删除 原键名 及 值
                    delete files[oldName];
                    // 添加内容
                    const text = files[newName].contents.toString();
                    files[newName].contents = Buffer.from(Handlebars.compile(text)(meta));
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
}

/**
 * 模板文件名 更改为自定义文件名
 *
 * @param {string} oldName 原文件名
 * @param {string} newName 新文件前缀
 * @return {string} 新文件名
 */
function rename(oldName, newName) {
    // 文件类型
    let nameArr = oldName.split('.');
    nameArr[0] = newName;
    return nameArr.join('.');
}

/**
 * 执行添加命令
 *
 * @param {string=} subPackage 分包名称
 * @param {Object} program 命令行对象
 */
exports = module.exports = (subPackage, program) => {
    if (!program) {
        program = subPackage;
        subPackage = null;
    }

    // 未输入options时 弹出 help
    if (!program.page && !program.component) {
        program.help();
        return;
    }

    // 获取配置文件路径
    let appJsonPath = path.resolve(process.cwd(), 'app.json');

    if (!util.isExist(appJsonPath)) {
        util.log('请切换到工程根目录执行', 'info');
        return;
    }

    let isPage = !!program.page;
    // 模板路径
    let tempFilesPath = path.join(home, '.ma-templates');
    let src = path.resolve(tempFilesPath,
        `empty/${isPage ? 'pages' : 'components'}/${isPage ? 'index' : 'compo'}`);

    let dirName = isPage ? (subPackage || 'pages') : 'components';
    let fileName = program.page || program.component;
    // 目标路径
    let dest = path.resolve(process.cwd(), `${dirName}/${fileName}`);

    if (!util.isExist(dest)) {
        add(isPage, appJsonPath, fileName, src, dest, subPackage);
        return;
    }

    util.interactive('文件已存在，是否覆盖？', 'confirm')
        .then(answer => {
            answer.ans && add(isPage, appJsonPath, fileName, src, dest, subPackage);
        });

};
