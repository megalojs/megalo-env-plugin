const EnvPlugin = require('../index.js')
const instance = new EnvPlugin()
console.log(instance, process.env.NODE_ENV)