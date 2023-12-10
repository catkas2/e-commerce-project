/* eslint-disable max-len */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */
"use strict";

const express = require("express");
const app = express();

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const multer = require("multer");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const PORT_NUM = 8000;
const SERVER_ERR_CODE = 500;

// get either all items, or items that match a search query param
app.get("/artifact/items", async (req, res) => {
  try {
    let query;
    let data;
    let db = await getDBConnection();
    if (req.query.search) {
      let search = `%${req.query.search}%`;
      query = "SELECT * FROM items WHERE item_name LIKE ? OR description LIKE ? ORDER BY id";
      data = await db.all(query, search, search);
    } else {
      query = "SELECT * FROM items";
      data = await db.all(query);
    }
    await db.close();
    res.json(data);
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type("text")
      .send("didnt work :<");
  }
});

// gets items with specific price points
app.get("/artifact/items/:price", async (req, res) => {
  try {
    let price = req.params.price;
    let query;
    let data;
    let db = await getDBConnection();
    query = "SELECT * FROM items WHERE price BETWEEN ? and ?";
    data = await db.all(query, price - 10, price);
    await db.close();
    res.json(data);
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type("text")
      .send("didnt work :<");
  }
});

// get all items in a specified category OR get 5 most recently added items
app.get("/artifact/collection/:collection", async (req, res) => {
  try {
    let collection = req.params.collection;
    let query;
    let data;
    let db = await getDBConnection();
    if (collection === "recents") {
      query = "SELECT * FROM items ORDER BY id DESC LIMIT 6";
      data = await db.all(query);
    } else {
      query = "SELECT * FROM items WHERE category = ?";
      data = await db.all(query, collection);
    }
    await db.close();
    res.json(data);
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type("text")
      .send("didnt work :<");
  }
});

// get feedback from a specific item
app.get("/artifact/feedback/:item", async (req, res) => {
  try {
    let item = req.params.item;
    let query = "SELECT * FROM feedback WHERE item_id=? ORDER BY DATETIME(date) DESC";
    let db = await getDBConnection();
    let data = await db.all(query, item);
    await db.close();
    res.json(data);
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type("text")
      .send("didnt work :<");
  }
});

// too many lines in this function --> will fix later, just trying to get it to work.
app.post("/artifact/newuser", async (req, res) => {
  try {
    let db = await getDBConnection();
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    if (name && email && username && password) {
      let emailQuery = "SELECT COUNT(*) AS count FROM credentials WHERE email LIKE ?";
      let emailExists = await db.get(emailQuery, email);
      let usernameQuery = "SELECT COUNT(*) AS count FROM credentials WHERE username LIKE ?";
      let userExists = await db.get(usernameQuery, username);
      if (emailExists.count > 0 || userExists.count > 0) {
        res.status(400)
          .type("text")
          .send("email or username already registered with an account");
      } else {
        let query = `INSERT INTO credentials (name, email, username, password, status)
        VALUES (?, ?, ?, ?, ?)
        `;
        let result = await db.run(query, [name, email, username, password, "inactive"]);
        let response = await db.get("SELECT * FROM credentials WHERE id = ?", result.lastID);
        res.json(response);
      }
    } else {
      res.status(400)
        .type("text")
        .send("Missing one or more params");
    }
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type("text")
      .send("didnt work :<");
  }
});

app.post("/artifact/login", async (req, res) => {
  try {
    let db = await getDBConnection();
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
      let userQuery = "SELECT COUNT(*) AS count FROM credentials WHERE username LIKE ?";
      let userExists = await db.get(userQuery, username);
      if (userExists.count === 0) {
        res.status(404)
          .type("text")
          .send("username does not exist. please create an account with us.");
      } else {
        let pswQuery = "SELECT password FROM credentials WHERE username LIKE ?";
        let correctPsw = await db.get(pswQuery, username);
        console.log(correctPsw.password);
        console.log(password);
        if (correctPsw.password === password) {
          console.log("works");
          await db.run("UPDATE credentials SET status = ? WHERE username = ?", ["active", username]);
          console.log("Status updated for user:", username);
          let response = await db.get("SELECT * FROM credentials WHERE username = ?", username);
          db.close();
          res.json(response);
        } else {
          res.status(400)
            .type("text")
            .send("Incorrect password entered. Try again.");
        }
      }
    } else {
      res.status(400)
        .type("text")
        .send("Missing one or more params");
    }
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type("text")
      .send("Error logging in user. Please try again later.");
  }
});

app.post("/artifact/logout", async (req, res) => {
  try {
    let db = await getDBConnection();
    let username = req.body.username;
    await db.run("UPDATE credentials SET status = ? WHERE username = ?", ["inactive", username]);
    console.log("user successfully logged out");
    res.type("text").send("Sucessfully logged out. Thank you for visiting.");
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type("text")
      .send("Error logging out. Please try again later");
  }
});

// add feedback to specific item
app.get("/artifact/feedback", async (req, res) => {
  try {
    let query = "INSERT INTO feedback(id, user_id, item_id, feedback, date) VAUES(?, ?, ?, ?, ?)";
    let addedValues = [];
    let db = await getDBConnection();
    await db.run(query, addedValues);
    await db.close();
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type("text")
      .send("didnt work :<");
  }
});

// POST endpoint to add a transaction to the database
app.post("/artifact/addtransaction", async (req, res) => {
  try {
    let db = await getDBConnection();
    let user = req.body.userId;
    let confirmation = req.body.confirmationNum;
    let item = req.body.itemId;
    let confirmationQuery = "SELECT COUNT(*) AS count FROM transactions WHERE confirmation_code LIKE ?";
    let confirmationExists = await db.get(confirmationQuery, confirmation);

    // check if the generated confirmation number exists already
    if (confirmationExists.count > 0) {
      res.status(409)
        .type("text")
        .send("This confirmation number already exists in our database. Please try the purchase again.");

    } else {
      // check if the current inventory of the item is 0
      let result = await db.get("SELECT inventory FROM items WHERE id = ?", item);
      if (result.inventory === 0) {
        res.status(404)
          .type('text')
          .send('Sorry, this item is currently out of stock. Please try again at a later date');

      } else {
        // update inventory in database if not out of stock
        let update = result.inventory - 1;
        await db.run("UPDATE items SET inventory = ? WHERE id = ?", [update, item]);
        // insert transaction into database
        let query = `INSERT INTO transactions (user_id, confirmation_code, item_id, date)
        VALUES (?, ?, ?, datetime())
        `;
        await db.run(query, [user, confirmation, item]);
        db.close();
        res.type('text').send('Purchase succesful! This confirmation number has been sent to your email: ' + confirmation);
      }
    }
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type('text')
      .send(`Oops! It seems our cosmic vibes got tangled. Our team is aligning the stars to restore
        the harmonious flow of Aurea Vita. Stay zen!`);
  }
});

// fetches the transactions for a given user
app.post("/artifact/gettransactions", async (req, res) => {
  try {
    let db = await getDBConnection();
    let user = req.body.userId;
    let query = `SELECT
      transactions.user_id,
      transactions.date,
      transactions.item_id,
      transactions.confirmation_code,
      items.item_name,
      items.price
      FROM transactions
      INNER JOIN items ON  transactions.item_id = items.id
      WHERE transactions.user_id = ?
      `;
    let result = await db.all(query, user);
    res.json(result);
  } catch (err) {
    res.status(SERVER_ERR_CODE)
      .type('text')
      .send(`Oops! It seems our cosmic vibes got tangled. Our team is aligning the stars to restore
        the harmonious flow of Aurea Vita. Stay zen!`);
  }
});

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: "artifact.db",
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static("public"));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);