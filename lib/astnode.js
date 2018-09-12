/**
 * @file ast空节点
 * @author yufeng04
 */

module.exports = {

    /**
     * Literal 节点
     * @param {string} start 节点起始位置
     * @param {string} end 节点结束位置
     * @param {string} value 节点值
     */
    createLiteral(start = '', end = '', value) {
        let literal = {
            type: 'Literal',
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
    createIdentifier(start = '', end = '', name) {
        let identifier = {
            type: 'Identifier' 
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
    createProp(start = '', end = '', key = '', value = '') {
        let properties = {
            type: 'Property',
            method: false,
            shorthand: false,
            computed: false,
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
    createObj(start = '', end = '', prop) {
        let obj = {
            type: 'ObjectExpression',
            properties: []
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
    createArr(start = '', end = '', element) {
        let arr = {
            type: 'ArrayExpression',
            elements: []
        };
        arr.start = start;
        arr.end = end;
        arr.elements.push(element);
        return arr;
    }
}