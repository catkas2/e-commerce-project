"use strict";

const express = require('express');
const app = express();

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const multer = require('multer');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const PORT_NUM = 8000;
const SERVER_ERR_CODE = 500;

// get either all items, or items that match a search query param
app.get('/artifact/items', async (req, res) => {
  try {
    let query;
    let data;
    let db = await getDBConnection();
    if (req.query.search) {
      let search = `%${req.query.search}%`;
      query = 'SELECT * FROM items WHERE item_name LIKE ? ORDER BY id';
      data = await db.all(query, search);
    } else {
      query = 'SELECT * FROM items';
      data = await db.all(query);
    }
    await db.close();
    res.json(data);
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type('text')
      .send('didnt work :<');
  }
});

// get all items in a specified category
app.get('/artifact/collection/:collection', async (req, res) => {
  try {
    let collection = req.params.collection;
    let query;
    let data;
    let db = await getDBConnection();
    if (collection === 'recents') {
      query = 'SELECT * FROM items ORDER BY id DESC LIMIT 5';
      data = await db.all(query);
    } else {
      query = 'SELECT * FROM items WHERE category = ?';
      data = await db.all(query, collection);
    }
    await db.close();
    res.json(data);
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type('text')
      .send('didnt work :<');
  }
});

// add feedback to a specific item
app.get('/artifact/feedback/:item', async (req, res) => {
  try {
    let item = req.params.item;
    let query = 'SELECT * FROM feedback WHERE item_id=? ORDER BY DATETIME(date) DESC';
    let db = await getDBConnection();
    let data = await db.all(query, item);
    await db.close();
    res.json(data);
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type('text')
      .send('didnt work :<');
  }
});

// get feedback from specific item
app.get('/artifact/feedback', async (req, res) => {
  try {
    let query = 'INSERT INTO feedback(id, user_id, item_id, feedback, date) VAUES(?, ?, ?, ?, ?)';
    let addedValues = [];
    let db = await getDBConnection();
    await db.run(query, addedValues);
    await db.close();
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type('text')
      .send('didnt work :<');
  }
});

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'artifact.db',
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);