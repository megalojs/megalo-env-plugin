import { DefinePlugin } from 'webpack'
import minimist from 'minimist'
import utils from './utils'

/** Currently supported platform */
const defaultSupportPlatform = {
  'wechat': true,
  'alipay': true,
  'swan': true
}

class EnvPlugin {
  root
  /**
   * @param {Object} options - The parameters.
   * @param {String} [options.root=./] - The folder location of the environment variable.
   * @param {RegExp} [options.filter=/^VUE_APP_/] - The RegExp of env var
   * @returns {webpack.DefinePlugin}
   */
  constructor ({
    root = './',
    filter = /^VUE_APP_/
  } = {}) {
    this.root = root
    const argv = minimist(process.argv.slice(2))
    /** There are three default modes：development、production、test */
    const mode = argv.mode || 'development'

    /** There are three default platform：wechat、alipay、baidu */
    const platform = argv.platform || 'wechat'
    if (!defaultSupportPlatform[platform]) {
      utils.warn(`The Platform option maybe does not support setting the value "${platform}"`)
    }

    process.env.PLATFORM = platform

    // load mode .env
    if (mode) {
      this.loadEnv(mode)
    }
    // load base .env
    this.loadEnv()

    return new DefinePlugin(utils.resolveClientEnv(filter))
  }

  loadEnv (mode) {
    const basePath = utils.resolve(this.root, `.env${mode ? `.${mode}` : ``}`)

    const localPath = `${basePath}.local`

    const load = path => {
      try {
        utils.loadEnvConfig(path)
      } catch (err) {
      // only ignore error if file is not found
        if (err.toString().indexOf('ENOENT') < 0) {
          console.log(err)
        }
      }
    }

    load(localPath)
    load(basePath)

    // by default, NODE_ENV and BABEL_ENV are set to "development" unless mode
    // is production or test. However the value in .env files will take higher
    // priority.
    if (mode) {
    // always set NODE_ENV during tests
    // as that is necessary for tests to not be affected by each other
      const shouldForceDefaultEnv = (
        process.env.VUE_CLI_TEST &&
      !process.env.VUE_CLI_TEST_TESTING_ENV
      )
      const defaultNodeEnv = (mode === 'production' || mode === 'test')
        ? mode
        : 'development'
      // console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
      if (shouldForceDefaultEnv || process.env.NODE_ENV == null) {
        process.env.NODE_ENV = defaultNodeEnv
      }
      if (shouldForceDefaultEnv || process.env.BABEL_ENV == null) {
        process.env.BABEL_ENV = defaultNodeEnv
      }
    }
  }
}

export default EnvPlugin
