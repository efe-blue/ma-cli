# ma-cli

小程序脚手架创建工具
cli for miniapp

### 安装
`npm install -g mapp-cli`

### 使用
* 初始化命令
>`ma init <project-name> -t <template-name>`
>
>**说明：**
>1. 参数：`project-name`--项目名  `template-name`--模板名

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

* 模板列表命令
>`ma list|l [options]`
>
>**说明**
>
>`ma list|l`
>1. 默认列出官方模板和可用 github 模版
>
>`ma list|l --github`
>1. 仅列出 github 模板

* 更行命令
>`ma upgrade [options]`
>
>**说明**
>
>`ma upgrade --ma`
>1. 更新脚手架工具
>
>`ma upgrade --cli`
>1. 更新模板

### `.ma-cli`文件说明
1. 此文件在初始化模板时自动创建
2. 其中的`template.config.json`用于说明当前模板的有关配置信息

### 自动测试说明
1. `npm install -g mocha` 全局安装mocha测试框架
2. 在项目根目录执行`mocha` ,即可自动运行test文件夹下的所有测试脚本