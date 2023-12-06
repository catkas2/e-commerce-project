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

  /** Initializes page by making buttons work when loading in and adding all items to website */
  function init() {
    requestInitializeItems();
    id("browse-btn").addEventListener("click", scrollToCategories);

    //id("feedback-btn").addEventListener("click", addFeedback);

    qsa(".login").forEach(element => {
      element.addEventListener("click", handleLogin);
    });
    qs(".cancel").addEventListener("click", () => {
      id("login-popup").classList.add("hidden");
    });
    qs(".shop").addEventListener("click", openShopItems);
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
      let response = await fetch ('/artifact/login', {method: 'POST', body: params});
      await statusCheck(response);
      response = await response.json();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  /** Changes view to see all products and closes all other views */
  function openShopItems(category) {
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
    for (let i = 0; i < res.length; i++) {
      let item = gen('section');
      let itemImg = gen('img');
      let itemName = gen('p');
      itemImg.src = "img/plant8.jpg";
      item.classList.add("product-container");
      itemName.textContent = res[i].item_name;
      item.setAttribute("id",res[i].item_name);
      item.appendChild(itemImg);
      item.appendChild(itemName);
      id("all-products").appendChild(item);
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
    //everything reguarding creating an account must happen here
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