/**
 * @file
 * @author
 */

Component({
    properties: {
        // 定义了name属性，可以在使用组件时，由外部传入。此变量可以直接在组件模板中使用
        name: {
            type: String,
            value: 'swan',
        }
    },
    data: {
        age: 1
    },
    methods: {
        tap: function(){}
    }
});