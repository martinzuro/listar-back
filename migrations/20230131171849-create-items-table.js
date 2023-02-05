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
  db.createTable('items', {
    id: { type: 'int', primaryKey: true, unsigned: true, notNull: true, autoIncrement: true, length: 10 },
    list_id: {
      type: 'int',
      unsigned: true,
      length: 10,
      notNull: true,
      foreignKey: {
        name: 'items_list_id_fk',
        table: 'lists',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      },
    },
    name: { type: 'string', notNull: true },
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('items', {ifExists: true}, callback);
};

exports._meta = {
  "version": 1
};
