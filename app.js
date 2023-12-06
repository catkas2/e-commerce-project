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
    let db = await getDBConnection();
    let query;
    let data;
    if (req.query.search) {
      let search = `%${req.query.search}%`;
      query = 'SELECT * FROM items WHERE item_name LIKE ? ORDER BY id';
      data = await db.all(query, search);
    } else {
      query = 'SELECT * FROM items';
      data = await db.all(query);
    }
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
    let db = await getDBConnection();
    let collection = req.params.collection;
    let query;
    let data;
    if (collection === 'recents') {
      query = 'SELECT * FROM items ORDER BY id DESC LIMIT 5';
      data = await db.all(query);
    } else {
      query = 'SELECT * FROM items WHERE category = ?';
      data = await db.all(query, collection);
    }
    res.json(data);
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type('text')
      .send('didnt work :<');
  }
});

// too many lines in this function --> will fix later, just trying to get it to work.
app.post('/artifact/newuser', async (req, res) => {
  try {
    let db = await getDBConnection();
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    if (name && email && username && password) {
      let emailQuery = 'SELECT COUNT(*) AS count FROM credentials WHERE email LIKE ?';
      let emailExists = await db.get(emailQuery, email);
      let usernameQuery = 'SELECT COUNT(*) AS count FROM credentials WHERE username LIKE ?';
      let userExists = await db.get(usernameQuery, username);
      if (emailExists.count > 0 || userExists.count > 0) {
        res.status(400)
          .type('text')
          .send('email or username already registered with an account');
      } else {
        let query = `INSERT INTO credentials (name, email, username, password, status)
        VALUES (?, ?, ?, ?, ?)
        `;
        let result = await db.run(query, [name, email, username, password, 'inactive']);
        let response = await db.get('SELECT * FROM credentials WHERE id = ?', result.lastID);
        res.json(response);
      }
    } else {
      res.status(400)
        .type('text')
        .send('Missing one or more params');
    }
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