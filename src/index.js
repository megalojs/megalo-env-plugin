import { DefinePlugin } from 'webpack'
import minimist from 'minimist'
import utils from './utils'

export default class EnvPlugin {
  /** 默认有三个模式：development、production、test */
  mode

  /**
   * @param {Object} options - The parameters.
   * @param {String} [options.root=./] - The folder location of the environment variable.
   * @returns {webpack.DefinePlugin}
   */
  constructor ({
    root = './',
    systemvars
  } = {}) {
    const argv = minimist(process.argv.slice(2))
    const mode = argv.mode
    const basePath = util.resolve(`.env${mode ? `.${mode}` : ``}`)
    return new DefinePlugin({})
  }
}
