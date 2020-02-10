'use strict'

let HOST = process.argv.splice(2)[0] || 'inner';
module.exports = {
  NODE_ENV: '"production"',
  HOST: '"'+HOST+'"'
}
