/* eslint-disable valid-jsdoc */
/* eslint-disable no-console */
/*
 * Name: Catalina Kashiwa and Liana Rosado
 * Date: November 5th, 2023
 * Section: CSE 154 AB/AE
 *
 * This is the JS to implement the feedback option of our final project. This gives
 * the user the ability to add feedback with later implementation of a rating system as well.
 */
"use strict";

(function() {
  window.addEventListener("load", init);
  let numOfEntry = 0;
  const MAX_ENTRIES = 5;
  const DATABASE_SIZE = 25;
  let NAME; // current name
  let USERNAME; // current username
  let CART; // an array of item ids

  /** Initializes page by making buttons work when loading in and adding all items to website */
  function init() {
    requestInitializeItems();
    getRecents();
    id("browse-btn").addEventListener("click", scrollToCategories);
    //id("feedback-btn").addEventListener("click", addFeedback);
    qsa(".login").forEach(element => {
      element.addEventListener("click", handleLogin);
    });
    qs(".cancel").addEventListener("click", () => {
      id("login-popup").classList.add("hidden");
    });
    qsa(".shop").forEach(element => {
      element.addEventListener("click", openShopItems);
    });
    id("plant-btn").addEventListener("click", openPlantItems);
    id("water-btn").addEventListener("click", openWaterItems);
    id("rock-btn").addEventListener("click", openRockItems);
    id("create-account").addEventListener("click", createAccount);
    id('login-btn').addEventListener("click", event => {
      event.preventDefault();
      try {
        requestLogin();
      } catch (err) {
        console.log('login failed');
      }
    });
    qs("header div img").addEventListener("click", goHome);
  }

  /** handles switching to home view  */
  function goHome() {
    id("all-products").classList.add("hidden");
    id("product-view").classList.add("hidden");
    id("cart").classList.add("hidden");
    id("browse-container").classList.remove("hidden");
    id("main-view").classList.remove("hidden");
  }

  /** scrolls webpage to show collections cards */
  function scrollToCategories() {
    let target = document.getElementById("scroll-to-collections");
    target.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  /**
   * Gives the user the ability to write feedback and submit it.
   * Limited to the first 5 entries due to space.
   */
  function addFeedback() {
    if (numOfEntry < MAX_ENTRIES) { // place holder for later; only display 5 reviews at a time
      let entry = id("entry").value;
      let container = document.createElement("section");
      container.classList.add("post");
      let contents = document.createElement("p");
      contents.textContent = "Feedback: " + entry;
      container.appendChild(contents);
      id("posts").appendChild(container);
      id("entry").value = "";
      numOfEntry++;
    }
  }

  /**
   * Handles user login
   */
  function handleLogin() {
    id("create-text").classList.remove("hidden");
    id("create-account-text").classList.add("hidden");
    id("login-text").textContent = "Login";
    id("login-btn").textContent = "Login";
    id("login-popup").classList.toggle("hidden");
  }

  /**
   * logs user in
   */
   async function requestLogin() {
    let username = id('username').value;
    let password = id('psw').value;
    let params = new FormData();
    params.append('username', username);
    params.append('password', password);
    try {
      let response = await fetch('/artifact/login', {method: 'POST', body: params});
      await statusCheck(response);
      response = await response.json();
      displayLoginView(response);
    } catch (err) {
      console.log(err);
    }
  }

  /** updates the dom view to have user information */
  function displayLoginView(res) {
    console.log(res);

    // set initial login conditions
    NAME = res.name;
    USERNAME = res.username;
    CART = 0;

    // update nav
    qsa('.login').forEach(element => {
      element.classList.add('hidden');
    });
    qsa('.logout').forEach(element => {
      element.classList.remove('hidden');
      element.addEventListener('click', handleLogout);
    });
    qsa('.purchases').forEach(element => {
      element.classList.remove('hidden');
    });
    id('cart-container').classList.remove('hidden');

    // clears input boxes and closes login form
    id('username').value = '';
    id('psw').value = '';
    id('login-popup').classList.add('hidden');
  }

  /** makes request to logout endpoint */
  async function handleLogout() {
    let params = new FormData();
    params.append('username', USERNAME);
    try {
      let response = await fetch('/artifact/logout', {method: 'POST', body: params});
      await statusCheck(response);
      response = await response.text();
      logoutView(response);
    } catch (err) {
      console.log(err);
    }
  }

  /** updates nav for logout */
  function logoutView(res) {
    qsa('.login').forEach(element => {
      element.classList.remove('hidden');
    });
    qsa('.logout').forEach(element => {
      element.classList.add('hidden');
    });
    qsa('.purchases').forEach(element => {
      element.classList.add('hidden');
    });
    id('cart-container').classList.add('hidden');
    console.log(res);
  }

  /** Changes view to see all products and closes all other views */
  function openShopItems() {
    console.log('inside open shop');
    id('browse-container').classList.add('hidden');
    id("login-popup").classList.add("hidden");
    id("main-view").classList.add("hidden");
    id("product-view").classList.add("hidden");
    id("cart").classList.add("hidden");
    id("user-info").classList.add("hidden");
    id("all-products").classList.remove("hidden");
    //requestFilteredDatabase(category);
  }

  /**
   * Fetches information requested from search bar
   * @param {String} category - type of item being searched for
   */
  function requestFilteredDatabase(category) {
    fetch('artifact/items=?' + category)
      .then(statusCheck)
      .then(res => res.json())
      .then(filterItems)
      .catch(handleError);
  }

  /** Filters through items on website by type */
  function filterItems(res) {
    let filteredItems = [];
    for (let i = 0; i < res.length; i++) {
      filteredItems.push(res[i].item_name);
    }
    for (let i = 0; i < DATABASE_SIZE; i++) {
      // go through all products, if the item is in the database add view
      // otherwise remove from view
      // !! Might need to make product container for recent
      // items different from the container used to shop all items
    }
  }

  /** Fetches all items */
  function requestInitializeItems() {
    fetch('artifact/items')
      .then(statusCheck)
      .then(res => res.json())
      .then(getItems)
      .catch(handleError);
  }

  /**
   * Uses all items obtained through database and adds them to website
   * @param {JSON} res - represents all items being sold on website
   */
  function getItems(res) {
    for (let i = 1; i < res.length; i++) {
      let item = gen('section');
      let itemImg = gen('img');
      let itemPrice = gen('p');
      let itemName = gen('p');
      itemImg.src = "img/" + res[i].shortname + "1.jpeg";
      let hoverSrc = "img/" + res[i].shortname + "2.jpeg";
      item.classList.add("product-container");
      itemPrice.textContent = "$" + res[i].price;
      itemName.textContent = res[i].item_name;
      item.setAttribute("id", res[i].item_name);
      itemImg.addEventListener('mouseenter', () => {
        itemImg.src = hoverSrc;
      });
      itemImg.addEventListener('mouseleave', () => {
        itemImg.src = "img/" + res[i].shortname + "1.jpeg";
      });
      item.appendChild(itemImg);
      item.appendChild(itemPrice);
      item.appendChild(itemName);
      id("all-products").appendChild(item);
    }
  }

  /** this function gets the 5 most recent items  */
  async function getRecents() {
    try {
      let response = await fetch('artifact/collection/recents');
      await statusCheck(response);
      response = await response.json();
      console.log(response);
      displayRecents(response);
    } catch (err) {
      console.log(err);
    }
  }

  /** display recently added items --> extremely similar to getItems (FIGURE OUT
   * A WAY TO REDUCE REDUNDANCY
  */
  function displayRecents(res) {
    for (let i = 1; i < res.length; i++) {
      let item = gen('section');
      let itemImg = gen('img');
      let itemPrice = gen('p');
      let itemName = gen('p');
      itemImg.src = "img/" + res[i].shortname + "1.jpeg";
      let hoverSrc = "img/" + res[i].shortname + "2.jpeg";
      item.classList.add("product-container");
      itemPrice.textContent = "$" + res[i].price;
      itemName.textContent = res[i].item_name;
      item.setAttribute("id", res[i].item_name);
      itemImg.addEventListener('mouseenter', () => {
        itemImg.src = hoverSrc;
      });
      itemImg.addEventListener('mouseleave', () => {
        itemImg.src = "img/" + res[i].shortname + "1.jpeg";
      });
      item.appendChild(itemImg);
      item.appendChild(itemPrice);
      item.appendChild(itemName);
      id("new-arrivals-items").appendChild(item);
    }
  }

  /** Helper function to sort items by plant type */
  function openPlantItems() {
    openShopItems("plant");
  }

    /** Helper function to sort items by rock type */
  function openRockItems() {
    openShopItems("rock");
  }

  /** Helper function to sort items by water type */
  function openWaterItems() {
    openShopItems("water");
  }

  /** Allows user to create an account */
  function createAccount() {
    id("create-text").classList.add("hidden");
    id("create-account-text").classList.remove("hidden");
    id("login-text").textContent = "Create an Account";
    id("login-btn").textContent = "Create an Account";

    // everything reguarding creating an account must happen here --> make request to backend
  }




  /** Disables functionality of page and displays error for user */
  function handleError() {
    //disable everything and provide error message for user
  }

 /**
  * Helper function to return the response's result text if successful, otherwise
  * returns the rejected Promise result with an error status and corresponding text
  * @param {object} res - response to check for success/error
  * @return {object} - valid response if response was successful, otherwise rejected
  *                    Promise result
  */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Generate an element with a specified tag name.
   * @param {string} tag - The HTML tag name for the element to be created.
   * @returns {HTMLElement} - The created HTML element.
   */
  function gen(tag) {
    return document.createElement(tag);
  }
})();