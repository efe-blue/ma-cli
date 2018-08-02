/**
 * @file util.js测试用例
 * @author wangning24
 */
const expect = require('chai').expect;

const utils = require('../lib/util.js');

describe('utils.isFunction -判断变量是否是函数', function () {
    it('传非函数变量应返回false', function () {
        expect(utils.isFunction('')).to.be.false;
        expect(utils.isFunction([])).to.be.false;
        expect(utils.isFunction({})).to.be.false;
        expect(utils.isFunction(true)).to.be.false;
        expect(utils.isFunction(1)).to.be.false;
    });

    it('传函数变量应该返回true', function () {
        expect(utils.isFunction(new Function())).to.be.true;
    });

});

describe('utils.isString -判断变量是否是字符串', function () {
    it('传非字符串变量应返回false', function () {
        expect(utils.isString(new Function())).to.be.false;
        expect(utils.isString([])).to.be.false;
        expect(utils.isString([])).to.be.false;
        expect(utils.isString(true)).to.be.false;
        expect(utils.isString(1)).to.be.false;
    });

    it('传字符串变量应返回true', function () {
        expect(utils.isString('')).to.be.true;
    });
});

describe('utils.isObject -判断变量是否是对象', function () {
    it('传非对象类型变量应返回false', function () {
        expect(utils.isObject(new Function())).to.be.false;
        expect(utils.isObject([])).to.be.false;
        expect(utils.isObject('')).to.be.false;
        expect(utils.isObject(true)).to.be.false;
        expect(utils.isObject(1)).to.be.false;
    });

    it('传对象变量应返回true', function () {
        expect(utils.isObject([])).to.be.true;
    });
});

describe('utils.isNumber -判断变量是否是数字', function () {
    it('传非数字类型变量应返回false', function () {
        expect(utils.isNumber(new Function())).to.be.false;
        expect(utils.isNumber([])).to.be.false;
        expect(utils.isNumber('')).to.be.false;
        expect(utils.isNumber(true)).to.be.false;
        expect(utils.isNumber([])).to.be.false;
    });

    it('传数字变量应返回true', function () {
        expect(utils.isNumber(1)).to.be.true;
    });
});

describe('utils.isBoolean -判断变量是否是布尔类型', function () {
    it('传非布尔类型变量应返回false', function () {
        expect(utils.isBoolean(new Function())).to.be.false;
        expect(utils.isBoolean([])).to.be.false;
        expect(utils.isBoolean('')).to.be.false;
        expect(utils.isBoolean(1)).to.be.false;
        expect(utils.isBoolean([])).to.be.false;
    });

    it('传布尔类型变量应返回true', function () {
        expect(utils.isBoolean(true)).to.be.true;
    });
});

describe('utils.isArray -判断变量是否是数组类型', function () {
    it('传非数组类型变量应返回false', function () {
        expect(utils.isArray(new Function())).to.be.false;
        expect(utils.isArray(true)).to.be.false;
        expect(utils.isArray('')).to.be.false;
        expect(utils.isArray(1)).to.be.false;
        expect(utils.isArray([])).to.be.false;
    });

    it('传数组类型变量应返回true', function () {
        expect(utils.isArray([])).to.be.true;
    });
});

describe('utils.isFile -判断路径是否指向文件', function () {
    it('传目录路径，应返回false', function () {
        expect(utils.isFile(`${__dirname}/example`)).to.be.false;
    });

    it('传文件路径，应返回true', function () {
        expect(utils.isFile(`${__dirname}/example/text`)).to.be.true;
    });
});

describe('utils.isDir -判断路径是否为目录', function () {
    it('传文件路径，应返回false', function () {
        expect(utils.isDir(`${__dirname}/example/text`)).to.be.false;
    });

    it('传目录路径，应返回true', function () {
        expect(utils.isDir(`${__dirname}/example`)).to.be.true;
    });
});

describe('utils.isExist -判断路径是否存在', function () {

    it('传错误路径，应返回false', function () {
        expect(utils.isExist(`${__dirname}/wrong-name`)).to.be.false;
    });

    it('传正确路径，应返回true', function () {
        expect(utils.isExist(`${__dirname}/example/text`)).to.be.true;
    });
});


describe('utils.readFile -读文件', function () {

    it('传正确路径和数据，应返回stirng或buffer类型', function () {
        expect(utils.readFile(`${__dirname}/example/text`)).to.satisfy(res => {
            return typeof res === 'string' || res instanceof Buffer;
        });
    });


    it('传错误路径参数，应返回null', function () {
        expect(utils.readFile('')).to.be.a('null');
        expect(utils.readFile(null)).to.be.a('null');
        expect(utils.readFile(undefined)).to.be.a('null');
        expect(utils.readFile([])).to.be.a('null');
        expect(utils.readFile({})).to.be.a('null');
        expect(utils.readFile(1)).to.be.a('null');
    });


});


describe('utils.writeFile -向文件写数据', function () {

    it('传正确路径和数据，不应报错', function () {
        expect(() => {
            utils.writeFile(`${__dirname}/example/text`, 'abc');
        }).to.not.throw();
    });


    it('传错误路径参数，应报错', function () {

        expect(() => {
            utils.writeFile('', '');
        }).to.throw();

        expect(() => {
            utils.writeFile(null, '');
        }).to.throw();

        expect(() => {
            utils.writeFile(undefined, '');
        }).to.throw();
        expect(() => {
            utils.writeFile(NaN, '');
        }).to.throw();

        expect(() => {
            utils.writeFile({}, '');
        }).to.throw();

        expect(() => {
            utils.writeFile([], '');
        }).to.throw();

        expect(() => {
            utils.writeFile('?', '');
        }).to.throw();
    });

});

describe('utils.datetime -格式化时间', function () {

    it('传正确参数，不应报错', function () {
        expect(() => {
            utils.datetime(new Date(), 'YYYY:MM:DD:HH:mm:ss');
        }).to.not.throw();
    });

    it('传正确参数，返回string', function () {
        expect(utils.datetime(new Date(), 'YYYY:MM:DD:HH:mm:ss')).to.be.a('string');
    });


});


describe('utils.log -输出', function () {

    it('传正确参数，不应报错', function () {
        expect(() => {
            utils.log('message', 'ERROR', false);
        }).to.not.throw();
        expect(() => {
            utils.log('message', 'WARNING', false);
        }).to.not.throw();
        expect(() => {
            utils.log('message', 'SUCCESS', false);
        }).to.not.throw();
        expect(() => {
            utils.log('message', '', false);
        }).to.not.throw();
    });

});

describe('utils.interactive -交互操作', function () {

    it('传正确参数，不应报错', function () {
        expect(() => {
            utils.interactive('message', 'ERROR');
        }).to.not.throw();
    });

    it('type传非string类型，不应报错', function () {
        expect(() => {
            utils.interactive('message', []);
        }).to.not.throw();
        expect(() => {
            utils.interactive('message', {});
        }).to.not.throw();
        expect(() => {
            utils.interactive('message', null);
        }).to.not.throw();
        expect(() => {
            utils.interactive('message', undefined);
        }).to.not.throw();
    });
});
