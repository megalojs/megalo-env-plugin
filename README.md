# megalojs-env-plugin
为megalo-cli创建的工程提供模式设置、环境变量

## 使用指南

安装:
```bash
$ npm i @megalo/env-plugin
```

webpack 配置:
```js
const EnvPlugin = require('@megalo/env-plugin')
const EnvPluginInstance = new EnvPlugin()

...

// The webpack 'plugins' options
module.exports = {
    // ...
    plugins: [
        EnvPluginInstance
    ]
}
```

在项目根目录下新建 `.env.模式名` 文件，在 `package.json` 的 `scripts` 里加入一条cli命令:
```json
"dev:wechat": "node ./build/megalo-cli.js --mode development --platform wechat",
```

然后执行:
```bash
$ npm run dev:wechat
```

## 控制台参数

`--mode` 

默认值是 `development` , 本库内置了三个模式 `development、test、production` ,其中 `development` 模式下 `process.env.NODE_ENV` 的值是 `development` ,webpack将启用`开发模式`，监听你的项目文件修改，每次保存都会重新编译代码，自动刷新

三个内置的模式 `development、test、production` 对应的 `process.env.NODE_ENV` 值是和模式的名字一模一样，但只有 `development` 模式会启动webpack的`开发模式`

你可以自定义模式名，但 `process.env.NODE_ENV` 的值都将是 `production` ,webpack将启用`生产模式`,除了编译代码外，还会压缩混淆你的代码

如果你希望其它模式也能启用webpack的开发模式，你可以在你的 `.env.模式` 文件中设置如下值：
```js
// 注意：NODE_ENV的值不可随意更改，只能是 `development、test、production` 中的任一个
NODE_ENV=development
```

`--platform`

默认值是 `wechat` , 目前在 `megalo` 工程中支持三个平台的值: `wechat、alipay、swan` ,你可以在nodejs中或者项目中通过 `process.env.PLATFORM` 访问到它

配合 `@megalo/target` 插件， 将根据你传的 `--platform` 参数来编译成不同平台的小程序代码


## 详细文档

点击[这里查看](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F),功效和vue-cli3的环境变量和模式一致

## 原理说明
根据用户执行cli命令时，传递的 `mode` 参数，读取指定目录下（默认项目根目录）的 `.env` 文件内的键值对，注入到Nodejs的环境变量对象 `process.env` 身上,然后通过 `webpack.DefinePlugin` 插件，替换项目中写的 `process.env.xxx` 为  `.env` 文件配置的值

以[megalo-demo](https://github.com/bigmeow/megalo-demo)举例：
```json
// cli 命令
"dev:wechat": "node ./build/megalo-cli.js --mode development --platform wechat"
```
这条cli命令的 `mode` 参数值是 `development`，我们将读取项目根目录下的 `.env.development` 文件

假设你的 `.env.development` 文件里配置了如下内容：
```config
VUE_APP_API=http://dev.api.com
API2=http://dev.api2.com
```

程序默认将读取其中以 `VUE_APP_` 开头的键名（可修改过滤规则），将其注入到Node环境变量中，你可以在项目中使用 `process.env.VUE_APP_API` 来访问你配置的值

打开编译后代码，你会发现程序已经将你写的 `process.env.VUE_APP_API` 替换成了 `'http://dev.api.com'`

本库并不限于 `megalo` 专用, webpack4的脚手架均可使用