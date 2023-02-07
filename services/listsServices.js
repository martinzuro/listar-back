const pool = require('./pool');
const helper = require('../helper');
const config = require('../config');
const ably = require('./ably');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const result = await pool.query(
    `SELECT uuid, title 
    FROM lists LIMIT $1,$2`,
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(result.rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function getOne(uuid){
  const result = await pool.query(
    `SELECT * 
    FROM lists 
    WHERE uuid = $1`,
    [uuid]
  );

  let message = `Couldn't find list ${uuid}`;
  if (result.rowCount == 0) {
    return { message, error: true };
  }
  const list = result.rows[0];

  const itemsResult = await pool.query(
    `SELECT * 
    FROM items 
    WHERE list_id = $1`,
    [list.id]
  );

  const data = {
    uuid: list.uuid,
    title: list.title,
    items: itemsResult.rows
  }

  return {
    data
  }
}

async function create(list){
  const result = await pool.query(
      `INSERT INTO lists 
      (title, uuid) 
      VALUES 
      ($1, gen_random_uuid())
      RETURNING *`,
      [list.title]
  );

  let message = 'Error in creating list';
  let data = {};
  
  if (result.rowCount) {
    data = result.rows[0];
    message = 'List created successfully';
  }

  return {message, data};
}

async function update(uuid, list){
  const result = await pool.query(
    `UPDATE lists 
    SET title = $1
    WHERE uuid = $2`,
    [list.title, uuid]
  );

  let message = 'Error in updating list';

  if (result.rowCount) {
    message = 'List updated successfully';
  }

  return {message};
}

async function remove(uuid){
  const result = await pool.query(
    `DELETE FROM lists WHERE uuid = $1`,
    [uuid]
  );

  let message = 'Error in deleting list';

  if (result.rowCount) {
    message = 'List deleted successfully';
  }

  return {message};
}

async function addItem(uuid, item){
  const result = await pool.query(
    `INSERT INTO items (name, list_id) VALUES ($1,(SELECT id FROM lists WHERE uuid = $2)) RETURNING *`,
    [item.name, uuid]
  );

  let message = 'Error in creating list item';
  let data = {};

  if (result.rowCount) {
    message = 'List updated successfully';
    data = {
      id: result.rows[0].id,
      name: item.name,
    };
    const channel = ably.channels.get(`channel-${uuid}`);
    await channel.publish('add-item', { item: data });
  }

  return {message, data};
}

async function removeItem(uuid, itemId){
  const result = await pool.query(
    `DELETE FROM items WHERE id = $1`,
    [itemId]
  );

  let message = 'Error in deleting list item';

  if (result.rowCount) {
    message = 'List updated successfully';
    const channel = ably.channels.get(`channel-${uuid}`);
    await channel.publish('remove-item', { item: {id: itemId} });
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