'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('lists', {
    columns: {
      id: { type: 'int', primaryKey: true, unsigned: true, notNull: true, autoIncrement: true, length: 10 },
      uuid: { type: 'string', unique: true, notNull: true, length: 100 },
      title: { type: 'string', notNull: true },
    },
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('lists', {ifExists: true}, callback);
};

exports._meta = {
  "version": 1
};
