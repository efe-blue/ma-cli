/**
 * @file 添加page 或 component文件
 * @author yufeng04
 */

const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars');
const rm = require('rimraf').sync;
const util = require('../lib/util');
const fo = require('../lib/file');
const log = require('../lib/log');
const interact = require('../lib/interaction');
// node path模块
const path = require('path');
const home = require('user-home');
const acorn = require('acorn');
const escodegen = require('escodegen');
const rider = require('rider');
const handleAstNode = require('../lib/handleastnode');

function add(tmlName, isPage, appJsonPath, fileNameArr, src, dest, subPackage, extname='') {
    try {
        isPage && addAppConf(tmlName, appJsonPath, fileNameArr, subPackage);
        addFile(src, dest, fileNameArr, extname).then(() => {
            log(`${isPage ? '页面' : '组件'} ${fileNameArr.join('/')} 创建成功`, 'success');
        });
    }
    catch (err) {
        console.log(err);
    }
}

function addAppConf(tmlName, appJsonPath, fileNameArr, subPackage) {
    // okam配置写入
    if (tmlName === 'okam') {
        addOkamAppConf(appJsonPath, fileNameArr, subPackage);
        return;
    }

    let appJsonData = JSON.parse(fo.readFile(appJsonPath));
    let routerPath = `pages/${fileNameArr.join('/')}`;

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

    fo.writeFile(appJsonPath, JSON.stringify(appJsonData, null, 4));
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
function addFile(src, dest, fileNameArr, extname) {
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
                    newName = rename(oldName, fileNameArr[1],extname);
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
 * @param {string} extname 扩展名
 * @return {string} 新文件名
 */
function rename(oldName, newName, extname) {
    // 文件类型
    let nameArr = oldName.split('.');
    nameArr[0] = newName;
    extname && (nameArr[1] = extname);
    return nameArr.join('.');
}

/**
 * 适配okam
 * @param {Boolean} isPage 是否创建页面
 * @param {string} appJsonPath app.js路径
 * @param {Array} subPackage 目录和文件名
 * @param {string} src 源文件路径
 * @param {string} dest 目标路径
 * @param {string} subPackage 是否分包
 */
function handleOkam(tmlName, isPage, appJsonPath, fileNameArr, src, dest, subPackage) {
    src = src.indexOf('index') !== -1 ? src.replace('index', 'home') : src.replace('components/compo', 'components');
    if(fileNameArr[1] === fileNameArr[0] && !isPage) {
        dest = dest.replace('/' + fileNameArr[0], '');
        fileNameArr[0] = 'components';
    }
    fileNameArr[1] === fileNameArr[0] && (fileNameArr[1] = 'hello')
    let swanConfPath = path.resolve(process.cwd(), 'scripts/swan.config')
    let extname = require(swanConfPath).component.extname;
    if (!util.isExist(dest + '/' + fileNameArr[1] + '.' + extname)) {
        add(tmlName, isPage, appJsonPath, fileNameArr, src, dest, subPackage, extname);
        return;
    }

    interact('文件已存在，是否覆盖？', 'confirm')
        .then(answer => {
            answer.ans && add(tmlName, isPage, appJsonPath, fileNameArr, src, dest, subPackage, extname);
        });

}

function addOkamAppConf (appJsonPath, fileNameArr, subPackage) {
    let code = fo.readFile(appJsonPath);
    let comments = [], tokens = [];
    let ast = acorn.parse(code, {
        sourceType: 'module',
        ranges: true,
        onComment: comments,
        onToken: tokens
    });
    // 查找config
    let configVal;
    let bodyProp = ast.body[1].declaration.properties;
    for(let i = 0, len = bodyProp.length; i < len; i++) {
        if(bodyProp[i].key.name === 'config') {
            configVal = bodyProp[0].value.properties;
            break;
        }
    }
    if(!configVal) {
        log('请检查配置文件', 'error');
        return;
    }
    let newPage = 'pages/' + fileNameArr.join('/');
    let pagesNode = handleAstNode.getNode(configVal, 'pages');
    
    // main package
    if (!subPackage) {
        let newPageNode = handleAstNode.createPageNode(newPage, pagesNode);
        handleAstNode.addPageNode(pagesNode, newPageNode);
        writeToAppjs(ast, comments, tokens, appJsonPath);
        return;
    }

    // subPackage
    let subPkgNode = handleAstNode.getNode(configVal, 'subPackages');

    // subPackages 字段不存在
    if (!subPkgNode) {
        let subPkgArr = handleAstNode.createSubPkgArr(pagesNode, subPackage, newPage);
        configVal.push(subPkgArr);
    }
    // subPackages 字段存在
    else {
        let subPkgNodeInnerArr = subPkgNode.value.elements;
        let subPkgExist = handleAstNode.isSubPkgExist(subPkgNodeInnerArr, subPackage);
        // 分包是否存在
        if(!subPkgExist) {
            let subPkgProp = handleAstNode.createSubPkg(subPkgNode, subPackage, newPage);
            subPkgNodeInnerArr.push(subPkgProp);
        }
        else {
            let newSubPkgPageNode = handleAstNode.createPageNode(newPage);
            let subPkgIndex = handleAstNode.getAstSubPkgIndex(subPkgNode, subPackage);
            let subPkgNodeValueInnerArr = subPkgNodeInnerArr[subPkgIndex].properties[1].value.elements;
            let subPkgPageExist = handleAstNode.isNodeExist(subPkgNodeValueInnerArr, newSubPkgPageNode);
            // 页面是否存在
            if(!subPkgPageExist) {
                let len = subPkgNodeValueInnerArr.length;
                newSubPkgPageNode.start = subPkgNodeValueInnerArr[len - 1].start + 40;
                newSubPkgPageNode.end = subPkgNodeValueInnerArr[len - 1].end + 40;
                subPkgNodeValueInnerArr.push(newSubPkgPageNode);
            }
        }
    }

    writeToAppjs(ast, comments, tokens, appJsonPath);
}

/**
 * ast ==> code
 * @param {Object} ast ast对象 
 * @param {Object} comments 注释
 * @param {Object} tokens
 * @param {string} appJsonPath appjs路径
 */
function writeToAppjs(ast, comments, tokens, appJsonPath) {
    escodegen.attachComments(ast, comments, tokens);
    let newCode = escodegen.generate(ast, { comment: true });
    fo.writeFile(appJsonPath, newCode);
}

/**
 * 执行添加命令
 *
 * @param {string} subPackage 分包名称
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

    // 模板配置项
    let templateConfPath = path.join(process.cwd(), '.macli.config.json');
    if (!util.isExist(templateConfPath)) {
        log('请切换到工程根目录执行', 'info');
        return;
    }
    let tmlConf = {};
    try {
        let tmlInfo = JSON.parse(fo.readFile(templateConfPath));
        if (!tmlInfo.name) {
            throw new Error();
        }
        tmlConf.name = tmlInfo.name;
        tmlConf.pagesPath = tmlInfo.pagesPath || 'pages';
        tmlConf.compoPath = tmlInfo.compoPath || 'components';
        tmlConf.appJsonPath = tmlInfo.appJsonPath || 'app.json';
    }
    catch (err) {
        log('模板配置文件错误', 'error');
        return;
    }
    // 获取配置文件路径
    let appJsonPath = path.resolve(process.cwd(), tmlConf.appJsonPath);
    // 模板路径
    let tempFilesPath = path.join(home, `.ma-templates/${tmlConf.name}`);

    if (!util.isExist(appJsonPath)) {
        log('请切换到工程根目录执行', 'info');
        return;
    }

    let isPage = !!program.page;

    let src = path.resolve(tempFilesPath,
        `${isPage ? tmlConf.pagesPath : tmlConf.compoPath}/${isPage ? 'index' : 'compo'}`);

    let subPackageDir = subPackage ? tmlConf.pagesPath.replace('pages', subPackage) : '';
    let dirName = isPage ? (subPackageDir || tmlConf.pagesPath) : tmlConf.compoPath;
    let fileName = program.page || program.component;
    // 目标路径
    let fileNameArr = fileName.split('/');
    fileNameArr[1] || fileNameArr.push(fileNameArr[0]);
    let dest = path.resolve(process.cwd(), `${dirName}/${fileNameArr[0]}`);

    if (tmlConf.name === 'okam') {
        handleOkam(tmlConf.name, isPage, appJsonPath, fileNameArr, src, dest, subPackage);
        return;
    }

    if (!util.isExist(dest + '/' + fileNameArr[1] + '.swan')) {
        add(tmlConf.name, isPage, appJsonPath, fileNameArr, src, dest, subPackage);
        return;
    }

    interact('文件已存在，是否覆盖？', 'confirm')
        .then(answer => {
            answer.ans && add(tmlConf.name, isPage, appJsonPath, fileNameArr, src, dest, subPackage);
        });

};