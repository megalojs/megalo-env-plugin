# megalojs-env-plugin
为megalo-cli创建的工程提供模式设置、环境变量

## 使用指南

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

## 文档

点击[这里查看](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F),功效和vue-cli3的环境变量和模式一致
