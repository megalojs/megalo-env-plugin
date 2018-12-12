import fs from 'fs'
import path from 'path'

function resolve (root, ...args) {
  return path.resolve(__dirname, root, ...args)
}

/**
 * 读取.env文件配置
 * @param {String} path
 */
function loadEnv (path = '.env') {
  const config = parse(fs.readFileSync(path, 'utf-8'))
  Object.keys(config).forEach(key => {
    if (typeof process.env[key] === 'undefined') {
      process.env[key] = config[key]
    }
  })
  return config
}

function parse (src) {
  const res = {}
  src.split('\n').forEach(line => {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      let value = keyValueArr[2] || ''

      // expand newlines in quoted values
      const len = value ? value.length : 0
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n')
      }

      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim()

      res[key] = value
    }
  })
  return res
}

const prefixRE = /^VUE_APP_/
/**
 * 过滤出VUE_APP_前缀的环境变量
 * @param {Boolean} raw
 */
function resolveClientEnv (raw) {
  const env = {}
  Object.keys(process.env).forEach(key => {
    if (prefixRE.test(key) || key === 'NODE_ENV') {
      env[key] = process.env[key]
    }
  })

  if (raw) {
    return env
  }

  for (const key in env) {
    env[key] = JSON.stringify(env[key])
  }
  return {
    'process.env': env
  }
}

export default {
  resolve,
  loadEnv,
  resolveClientEnv
}
