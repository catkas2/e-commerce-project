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

  // maybe initalize by getting database items all setup, then filtering based on button click
  // instead of initalize by clicking buttons

  /** Initializes page by making feedback button work when loading in */
  function init() {
    //requestDatabaseInfo();
    id("browse-btn").addEventListener("click", scrollToCategories);
    //id("feedback-btn").addEventListener("click", addFeedback);
    id("login").addEventListener("click", handleLogin);
    qs(".cancel").addEventListener("click", () => {
      id("login-popup").classList.add("hidden");
    });
    id("shop").addEventListener("click", openShopItems);
    id("plant-btn").addEventListener("click", openPlantItems);
    id("water-btn").addEventListener("click", openWaterItems);
    id("rock-btn").addEventListener("click", openRockItems);
    id("create-account").addEventListener("click", createAccount);
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

  /** Changes view to see all products and closes all other views */
  function openShopItems(category) {
    id("login-popup").classList.add("hidden");
    id("browse-container").classList.add("hidden");
    id("main-view").classList.add("hidden");
    id("product-view").classList.add("hidden");
    id("cart").classList.add("hidden");
    id("user-info").classList.add("hidden");
    //requestDatabaseInfo(category);
  }

  function requestDatabaseInfo(category) {
    fetch('artifact/items?search=' + category)
      .then(statusCheck)
      .then(res => res.json())
      .then(getItems)
      .catch(handleError);
    // if blank, filter for all data otherwise only get category data
    // when creating each icon for item, make event listener
  }

  function getItems(res) {
    for (let i = 0; i < res.id.length; i++) {
      let item = gen('section');
      let itemImg = gen('img');
      let itemName = gen('p');
      item.classList.add("product-container");
      itemName.textContent = res.item_name;
      item.appendChild(itemImg);
      item.appendChild(itemName);
      id("all-products").appendChild(item);
    }
  }

  function openPlantItems() {
    openShopItems("plant");
  }

  function openRockItems() {
    openShopItems("rock");
  }

  function openWaterItems() {
    openShopItems("water");
  }

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