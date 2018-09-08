/**
 * @file 创建ast节点
 * @author yufeng04
 */

module.exports = {

    /**
     * Literal 节点
     * @param {string} start 节点起始位置
     * @param {string} end 节点结束位置
     * @param {string} value 节点值
     */
    createLiteral(start, end, value) {
        let literal = {
            type: 'Literal',
            start: '',
            end: '',
            value: '',
            raw: '' 
        };
        literal.start = start;
        literal.end = end;
        literal.value = value;
        literal.raw = value;
        return literal;
    },

    /**
     * Identifier 节点
     * @param {string} start 节点起始位置
     * @param {string} end 节点结束位置
     * @param {string} name 节点名
     */
    createIdentifier(start, end, name) {
        let identifier = {
            type: 'Identifier',
            start: '',
            end: '',
            name: '' 
        };
        identifier.start = start;
        identifier.end = end;
        identifier.name = name;
        return identifier;
    },

    /**
     * Property 节点
     * @param {string} start 节点起始位置
     * @param {string} end 节点结束位置
     * @param {Object} key 属性节点key值 identifier节点
     * @param {Object} value 属性节点value值 literal节点
     */
    createProp(start, end, key, value) {
        let properties = {
            type: 'Property',
            start: '',
            end: '',
            method: false,
            shorthand: false,
            computed: false,
            key: '',
            value: '',
            kind: 'init' 
        };
        properties.start = start;
        properties.end = end;
        properties.key = key;
        properties.value = value;
        return properties;
    },

    /**
     * Identifier 节点
     * @param {string} start 节点起始位置
     * @param {string} end 节点结束位置
     * @param {Object} prop 属性节点
     */
    createObj(start, end, prop) {
        let obj = {
            type: 'ObjectExpression',
            start: '',
            end: '',
            properties:[]
        };
        obj.start = start;
        obj.end = end;
        obj.properties.push(prop);
        return obj;
    },

    /**
     * ArrayExpression 节点
     * @param {string} start 节点起始位置
     * @param {string} end 节点结束位置
     * @param {Object} element 数组节点的元素
     */
    createArr(start, end, element) {
        let arr = {
            type: 'ArrayExpression',
            start: '',
            end: '',
            elements: [] 
        };
        arr.start = start;
        arr.end = end;
        arr.elements.push(element);
        return arr;
    },

    /**
     * 创建一个分包
     * @param {string} start 节点起始位置
     * @param {string} end 节点结束位置
     * @param {string} subPackage 分包名
     * @param {string} newSubPage 分包中的页面
     */
    createSubPkg(start, end, subPackage, newSubPage) {
        let newObjNode = this.createObj(start, end, '');
        let newPropNode1 = this.createProp(newObjNode.start + 18, newObjNode.end - 41, '');
        let newPropNode2 = this.createProp(newPropNode1.start + 26, newPropNode1.end + 27, '');
        let newKeyNode1 = this.createIdentifier(newPropNode1.start, newPropNode1.end - 4, 'root');
        let newValNode1 = this.createLiteral(newKeyNode1.start + 6, newKeyNode1.start + 6, subPackage);

        let newKeyNode2 = this.createIdentifier(newKeyNode1.start + 26, newKeyNode1.start + 31, 'pages');
        let newArrNode1 = this.createArr(newKeyNode2.start + 7, newKeyNode2.start + 9, '');

        let newPageNode = this.createLiteral(newArrNode1.start + 1, newArrNode1.end + 1, newSubPage);

        newArrNode1.elements[0] = newPageNode;
        newPropNode2.value = newArrNode1;
        newPropNode2.key = newKeyNode2;
        newPropNode1.value = newValNode1;
        newPropNode1.key = newKeyNode1;
        newObjNode.properties = [newPropNode1, newPropNode2];

        return newObjNode;
    }
}