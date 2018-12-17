const EnvPlugin = require('../index.js')
const instance = new EnvPlugin({
    root: './env'
})
console.log(instance, process.env.NODE_ENV)