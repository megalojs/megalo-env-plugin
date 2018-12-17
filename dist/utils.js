'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolve(root) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _path2.default.resolve.apply(_path2.default, [root].concat(args));
}

/**
 * 读取.env文件配置
 * @param {String} path
 */
function loadEnvConfig() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.env';

  var config = parse(_fs2.default.readFileSync(path, 'utf-8'));
  Object.keys(config).forEach(function (key) {
    if (typeof process.env[key] === 'undefined') {
      process.env[key] = config[key];
    }
  });
  return config;
}

function parse(src) {
  var res = {};
  src.split('\n').forEach(function (line) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    var keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    // matched?
    if (keyValueArr != null) {
      var key = keyValueArr[1];
      var value = keyValueArr[2] || '';

      // expand newlines in quoted values
      var len = value ? value.length : 0;
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n');
      }

      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim();

      res[key] = value;
    }
  });
  return res;
}

/**
 * 默认过滤出VUE_APP_前缀的环境变量
 * @param {Boolean} raw
 */
function resolveClientEnv(filter, raw) {
  var env = {};
  Object.keys(process.env).forEach(function (key) {
    if (filter.test(key) || key === 'NODE_ENV' || key === 'PLATFORM') {
      env[key] = process.env[key];
    }
  });

  if (raw) {
    return env;
  }

  for (var key in env) {
    env[key] = JSON.stringify(env[key]);
  }
  return {
    'process.env': env
  };
}

function warn() {
  var _console;

  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  (_console = console).warn.apply(_console, ['[Warn]: '].concat(args));
}

exports.default = {
  resolve: resolve,
  loadEnvConfig: loadEnvConfig,
  resolveClientEnv: resolveClientEnv,
  warn: warn
};