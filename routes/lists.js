const express = require('express');
const router = express.Router();
const listsServices = require('../services/listsServices');

router.get('/', async function(req, res, next) {
  try {
    res.json(await listsServices.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting lists `, err.message);
    next(err);
  }
});

router.get('/:uuid', async function(req, res, next) {
  try {
    res.json(await listsServices.getOne(req.params.uuid));
  } catch (err) {
    console.error(`Error while getting list `, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    res.json(await listsServices.create(req.body));
  } catch (err) {
    console.error(`Error while creating list `, err.message);
    next(err);
  }
});

router.put('/:uuid', async function(req, res, next) {
  try {
    res.json(await listsServices.update(req.params.uuid, req.body));
  } catch (err) {
    console.error(`Error while updating list `, err.message);
    next(err);
  }
});

router.delete('/:uuid', async function(req, res, next) {
  try {
    res.json(await listsServices.remove(req.params.uuid));
  } catch (err) {
    console.error(`Error while deleting list`, err.message);
    next(err);
  }
});

router.post('/:uuid/items', async function(req, res, next) {
  try {
    res.json(await listsServices.addItem(req.params.uuid, req.body));
  } catch (err) {
    console.error(`Error while updating list `, err.message);
    next(err);
  }
});

router.delete('/:uuid/items/:item_id', async function(req, res, next) {
  try {
    res.json(await listsServices.removeItem(req.params.uuid, req.params.item_id));
  } catch (err) {
    console.error(`Error while updating list `, err.message);
    next(err);
  }
});

module.exports = router;