'use strict'

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function (db) {
  return db.createTable('watchlists', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    token: { type: 'string' },
    stock_symbol: { type: 'string' },
    added_at: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP'),
    },
  })
}

exports.down = function (db) {
  return db.dropTable('watchlists')
}

exports._meta = {
  version: 1,
}
