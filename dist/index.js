'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webpack = require('webpack');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Currently supported platform */
var defaultSupportPlatform = {
  'wechat': true,
  'alipay': true,
  'swan': true
};

var EnvPlugin = function () {
  /**
   * @param {Object} options - The parameters.
   * @param {String} [options.root=./] - The folder location of the environment variable.
   * @param {RegExp} [options.filter=/^VUE_APP_/] - The RegExp of env var
   * @returns {webpack.DefinePlugin}
   */
  function EnvPlugin() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$root = _ref.root,
        root = _ref$root === undefined ? './' : _ref$root,
        _ref$filter = _ref.filter,
        filter = _ref$filter === undefined ? /^VUE_APP_/ : _ref$filter;

    _classCallCheck(this, EnvPlugin);

    this.root = root;
    var argv = (0, _minimist2.default)(process.argv.slice(2));
    /** There are three default modes：development、production、test */
    var mode = argv.mode || 'development';

    /** There are three default platform：wechat、alipay、baidu */
    var platform = argv.platform || 'wechat';
    if (!defaultSupportPlatform[platform]) {
      _utils2.default.warn('The Platform option maybe does not support setting the value "' + platform + '"');
    }

    process.env.PLATFORM = platform;

    // load mode .env
    if (mode) {
      this.loadEnv(mode);
    }
    // load base .env
    this.loadEnv();

    return new _webpack.DefinePlugin(_utils2.default.resolveClientEnv(filter));
  }

  _createClass(EnvPlugin, [{
    key: 'loadEnv',
    value: function loadEnv(mode) {
      var basePath = _utils2.default.resolve(this.root, '.env' + (mode ? '.' + mode : ''));

      var localPath = basePath + '.local';

      var load = function load(path) {
        try {
          _utils2.default.loadEnvConfig(path);
        } catch (err) {
          // only ignore error if file is not found
          if (err.toString().indexOf('ENOENT') < 0) {
            console.log(err);
          }
        }
      };

      load(localPath);
      load(basePath);

      // by default, NODE_ENV and BABEL_ENV are set to "development" unless mode
      // is production or test. However the value in .env files will take higher
      // priority.
      if (mode) {
        // always set NODE_ENV during tests
        // as that is necessary for tests to not be affected by each other
        var shouldForceDefaultEnv = process.env.VUE_CLI_TEST && !process.env.VUE_CLI_TEST_TESTING_ENV;
        var defaultNodeEnv = mode === 'production' || mode === 'test' ? mode : 'development';
        // console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
        if (shouldForceDefaultEnv || process.env.NODE_ENV == null) {
          process.env.NODE_ENV = defaultNodeEnv;
        }
        if (shouldForceDefaultEnv || process.env.BABEL_ENV == null) {
          process.env.BABEL_ENV = defaultNodeEnv;
        }
      }
    }
  }]);

  return EnvPlugin;
}();

exports.default = EnvPlugin;