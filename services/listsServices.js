const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT uuid, title 
    FROM lists LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function getOne(uuid){
  const lists = await db.query(
    `SELECT * 
    FROM lists 
    WHERE uuid='${uuid}'`
  );

  let message = `Couldn't find list ${uuid}`;
  if (lists.length == 0) {
    return { message, error: true };
  }
  const list = lists[0];

  const items = await db.query(
    `SELECT * 
    FROM items 
    WHERE list_id='${list.id}'`
  );

  const data = {
    uuid: list.uuid,
    title: list.title,
    items
  }

  return {
    data
  }
}

async function create(list){
  const result = await db.query(
      `INSERT INTO lists 
      (title, uuid) 
      VALUES 
      ('${list.title}', UUID())`
  );

  let message = 'Error in creating list';
  let data = {};

  if (result.affectedRows) {
    const rows = await db.query(`SELECT * FROM lists WHERE id=${result.insertId}`);
    data = rows[0];
    message = 'List created successfully';
  }

  return {message, data};
}

async function update(uuid, list){
  const result = await db.query(
    `UPDATE lists 
    SET title="${list.title}"
    WHERE uuid='${uuid}'` 
  );

  let message = 'Error in updating list';

  if (result.affectedRows) {
    message = 'List updated successfully';
  }

  return {message};
}

async function remove(uuid){
  const result = await db.query(
    `DELETE FROM lists WHERE uuid='${uuid}'`
  );

  let message = 'Error in deleting list';

  if (result.affectedRows) {
    message = 'List deleted successfully';
  }

  return {message};
}

async function addItem(uuid, item){
  const result = await db.query(
    `INSERT INTO items 
     SET name = '${item.name}',
         list_id = (
         SELECT id
           FROM lists
          WHERE uuid = '${uuid}')`
  );

  let message = 'Error in creating list item';
  let data = {};

  if (result.affectedRows) {
    message = 'List updated successfully';
    data = {
      id: result.insertId,
      name: item.name,
    };
  }

  return {message, data};
}

async function removeItem(uuid, itemId){
  const result = await db.query(
    `DELETE FROM items WHERE id='${itemId}'`
  );

  let message = 'Error in deleting list item';

  if (result.affectedRows) {
    message = 'List updated successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  getOne,
  create,
  update,
  remove,
  addItem,
  removeItem,
}