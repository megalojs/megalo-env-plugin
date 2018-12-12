'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EnvPlugin =

/**
 * @param {Object} options - The parameters.
 * @param {String} [options.root=./] - The folder location of the environment variable.
 * @returns {webpack.DefinePlugin}
 */
function EnvPlugin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$root = _ref.root,
      root = _ref$root === undefined ? './' : _ref$root,
      systemvars = _ref.systemvars;

  _classCallCheck(this, EnvPlugin);

  var argv = (0, _minimist2.default)(process.argv.slice(2));
  var mode = argv.mode;
  var basePath = util.resolve('.env' + (mode ? '.' + mode : ''));
  return new _webpack.DefinePlugin({});
}
/** 默认有三个模式：development、production、test */
;

exports.default = EnvPlugin;