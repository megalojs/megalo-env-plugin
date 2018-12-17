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
