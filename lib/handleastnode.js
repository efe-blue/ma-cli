/**
 * @file 创建ast节点
 * @author yufeng04
 */

const astNode = require('./astnode');

module.exports = {

    /**
     * 获取特定ast节点
     * @param {Object} configVal config ast对象
     * @param {string} node 节点字段名
     * @return {Object} ast节点 
     */
    getNode(configVal, node) {
        for (let i = 0, len = configVal.length; i < len; i++) {
            let keyName = configVal[i].key.name
            if (keyName === node) {
                return configVal[i];
            }
        }
    },
    
    /**
     * 创建一个页面字段的ast
     * @param {Object | string} pagesNode 页面字段ast节点,或空串
     * @param {string} page
     * @return {Object} ast节点 
     */
    createPageNode(page, pagesNode) {
        let len;
        let start;
        let end;
        if (pagesNode) {
            let innerArr = pagesNode.value.elements; 
            len = innerArr.length;
            start = innerArr[len - 1].start + 32;
            end = innerArr[len - 1].end + 32;
        }
        return astNode.createLiteral(start, end, page);
    },
    
    /**
     * 创建一个分包
     * @param {string} start 节点起始位置
     * @param {string} end 节点结束位置
     * @param {string} subPackage 分包名
     * @param {string} newSubPage 分包中的页面
     */
    createSubPkg(subPkgNode, subPackage, newSubPage) {
        let start = subPkgNode.start;
        let end = subPkgNode.end;
        let newObjNode = astNode.createObj(start, end, '');
        let newPropNode1 = astNode.createProp(newObjNode.start + 18, newObjNode.end - 41, '');
        let newPropNode2 = astNode.createProp(newPropNode1.start + 26, newPropNode1.end + 27, '');
        let newKeyNode1 = astNode.createIdentifier(newPropNode1.start, newPropNode1.end - 4, 'root');
        let newValNode1 = astNode.createLiteral(newKeyNode1.start + 6, newKeyNode1.start + 6, subPackage);
    
        let newKeyNode2 = astNode.createIdentifier(newKeyNode1.start + 26, newKeyNode1.start + 31, 'pages');
        let newArrNode1 = astNode.createArr(newKeyNode2.start + 7, newKeyNode2.start + 9, '');
    
        let newPageNode = astNode.createLiteral(newArrNode1.start + 1, newArrNode1.end + 1, newSubPage);
    
        newArrNode1.elements[0] = newPageNode;
        newPropNode2.value = newArrNode1;
        newPropNode2.key = newKeyNode2;
        newPropNode1.value = newValNode1;
        newPropNode1.key = newKeyNode1;
        newObjNode.properties = [newPropNode1, newPropNode2];
    
        return newObjNode;
    },
    
    /**
     * 创建 subPackages数组
     * @param {Object} pagesNode 页面字段ast节点
     */
    createSubPkgArr(pagesNode, subPackage, newPage) {
        let propNode = astNode.createProp(pagesNode.start + 37, pagesNode.end + 21);
        let identiNode = astNode.createIdentifier(propNode.start, propNode.start + 11, 'subPackages');
        let subPkgArrNode = astNode.createArr(identiNode.end + 2, identiNode + 4, '');
        let subPkgProp = this.createSubPkg(subPkgArrNode, subPackage, newPage);
        propNode.key = identiNode;
        subPkgArrNode.elements[0] = subPkgProp;
        propNode.value = subPkgArrNode;
        return propNode;
    },

    addPageNode(pageArrNode, pageNode) {
        let innerArr = pageArrNode.value.elements;
        !this.isNodeInArrNode(innerArr, pageNode) && innerArr.push(pageNode);
    },

    isNodeInArrNode(arrNode, node) {
        if (!arrNode || !arrNode.length) {
            return false;
        }
        for (let i = 0; i < arrNode.length; i++) {
            if (arrNode[i].value === node.value) {
                return true;
            }
        }
        return false;
    },

    /**
     * 新页面是否已在包中
     * @param {Array} tree ast nodes
     * @param {string} node 新节点
     */
    isNodeExist(tree, node) {
        if (!tree || !tree.length) {
            return false;
        }
        for(let i = 0; i < tree.length; i++) {
            if(tree[i].value === node.value) {
                return true;
            }
        }
        return false;
    },

    /**
     * 新页面是否已在分包
     * @param {Array} subPkgNode 分包节点
     * @param {string} subPackage 分包名
     * @param {Object} newSubNode 新节点
     */
    isSubPkgExist(subPkgNode, subPackage, newSubNode) {
        if(!subPkgNode.length) {
            // 没有分包
            return false;
        }
        for(let i = 0, len = subPkgNode.length; i < len; i++) {
            for(let j = 0, len = subPkgNode[i].properties.length; j < len; j++) {
                if (subPkgNode[i].properties[0].value.value === subPackage) {
                    return true;
                }
            }

        }
        return false;
    },

    /**
     * 获取分包的索引
     * @param {Object} subPkgNode 分包节点
     * @param {string} subPackage 分包名
     */
    getAstSubPkgIndex(subPkgNode, subPackage) {
        let innerArr = subPkgNode.value.elements;
        let len = innerArr.length;
        for(let i = 0; i < len; i++) {
            for(let j = 0, len = innerArr[i].properties.length; j < len; j++) {
                if (innerArr[i].properties[0].value.value === subPackage) {
                    return i;
                }
            }

        }
    }
}