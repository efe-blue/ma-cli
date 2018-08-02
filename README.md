# ma-cli

小程序脚手架创建工具
cli for miniapp

### 安装
1. 克隆到本地
2. `cd` 到项目根目录
3. `npm install`
4. windows: `npm link`; mac: `sudo npm link`

### 使用
* 初始化命令
>`ma init <project-name>`
>
>**说明：**
>1. 参数：`project-name`--项目名

* 新增命令（确保运行环境处于项目根目录）
>`ma add [options]`
>
>**说明：**
>
>`ma add -p <page-name> [package-name]`
>1. 参数：`page-name`--新增页面名；`package-name`--分包文件名（可选）
>2. `package-name`未指定时，默认在`pages`文件下新增
>3. 当前指定的分包不存在时，会自动创建
>4. 新增页面会在`app.json`中写入
>
>`ma add -c <component-name>`
>1. 参数：`component-name`--新增组件名

### 自动测试说明
1. `npm install -g mocha` 全局安装mocha测试框架
2. 在项目根目录执行`mocha` ,即可自动运行test文件夹下的所有测试脚本