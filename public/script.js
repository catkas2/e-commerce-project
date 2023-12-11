/* eslint-disable max-lines-per-function */
/* eslint-disable valid-jsdoc */
/* eslint-disable no-console */
/*
 * Name: Catalina Kashiwa and Liana Rosado
 * Date: December 10th, 2023
 * Section: CSE 154 AB/AE
 *
 * This is the JS used for client-side interactions. It allows users to browse through
 * our available items, filtering based on catergory, price, and has search functionality.
 * Users are able to login and out as well as create an acocunt. If a user is logged in,
 * they may view their previous transactions, make new transactions, and add feedback to items.
 */
"use strict";

(function() {
  window.addEventListener("load", init);
  let numOfEntry = 0;
  const MAX_ENTRIES = 5;
  const DATABASE_SIZE = 25;
  let NAME; // current name
  let USERNAME; // current username
  let USER_ID;
  let ITEM_ID;
  let checked;
  /*
   * ADD --> WHEN USER LOGS OUT, GO BACK TO HOME SCREEN& HIDE ALL OTHER VIEWS
   * ADD --> NEW USER POST REQUEST
   */

  /** Initializes page by making buttons work when loading in and adding all items to website */
  function init() {
    requestInitializeItems();
    getRecents();
    initalizeFilters();
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
    id("login-btn").addEventListener("click", event => {
      event.preventDefault();
      try {
        requestLogin();
      } catch (err) {
        console.log("login failed");
      }
    });
    qs("header div img").addEventListener("click", goHome);
    id("layout").addEventListener("change", changeLayout);
    id("cost").querySelectorAll("input").forEach(element => {
      element.addEventListener("click", filterPrice);
    });
    id("submit-search-btn").addEventListener("click", searchRequest)
    id("search-bar").addEventListener("input", enableSearch);
    qsa(".logout").forEach(element => {
      element.addEventListener("click", handleLogout);
    });
  }

  function searchRequest() {
    fetch("artifact/items?search=" + id("search-bar").value.trim())
      .then(statusCheck)
      .then(res => res.json())
      .then(filterSearch)
      .catch(handleError);
  }

  function filterSearch(res) {
    id("search-bar").value = "";
    let filteredItems = [];
    let allItems = qsa(".product-container");
    for (let i = 0; i < res.length; i++) {
      filteredItems.push(res[i].id);
    }
    for (let i = 0; i < DATABASE_SIZE; i++) {
      if (filteredItems.includes(parseInt(allItems[i].id))) {
        allItems[i].classList.remove("hidden");
      } else {
        allItems[i].classList.add("hidden");
      }
    }
  }

  function enableSearch(e) {
    if (!e.target.value.trim()) {
      id("submit-search-btn").disabled = true;
    } else {
      id("submit-search-btn").disabled = false;
    }
  }

  function initalizeFilters() {
    qsa("input[type='checkbox']").forEach(element => {
      element.checked = true;
    });
  }

  /** Filter products by their price */
  function filterPrice() {
    requestFilteredPrice(this.value);
    checked = this.checked;
  }

  /**
   * Fetches information requested from price point selected
   * @param {String} price - price point of item being asked for
   */
    function requestFilteredPrice(price) {
      fetch("artifact/items/" + price)
        .then(statusCheck)
        .then(res => res.json())
        .then(filteredPrice)
        .catch(handleError);
    }

    /** Filters through items on website by type */
    function filteredPrice(res) {
      let filteredItems = [];
      let allItems = qsa(".product-container");
      for (let i = 0; i < res.length; i++) {
        filteredItems.push(res[i].id);
      }
      for (let i = 0; i < DATABASE_SIZE; i++) {
        if (filteredItems.includes(parseInt(allItems[i].id))) {
          if (checked) {
            allItems[i].classList.remove("hidden");
            console.log("unhide");
          } else {
            allItems[i].classList.add("hidden");
            console.log("hide");
          }
        }
      }
    }

  /** Changes product layout from grid to list */
  function changeLayout() {
    if (id("layout").value === "grid") {
      id("all-products").classList.remove("list-view");
      id("all-products").classList.add("grid-view");
    } else {
      id("all-products").classList.add("list-view");
      id("all-products").classList.remove("grid-view");
    }
  }

  /** handles switching to home view  */
  function goHome() {
    id("all-products").classList.add("hidden");
    id("all-products").classList.remove("flex");
    id("product-view").classList.add("hidden");
    id("product-view").classList.remove("flex");
    id("search-filter-function").classList.add("hidden");
    id("cart").classList.add("hidden");
    id("browse-container").classList.remove("hidden");
    id("browse-container").classList.add("flex");
    id("main-view").classList.remove("hidden");
    id("main-view").classList.add("flex");
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
    let username = id("username").value;
    let password = id("psw").value;
    let params = new FormData();
    params.append("username", username);
    params.append("password", password);
    try {
      let response = await fetch("/artifact/login", {method: "POST", body: params});
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
    USER_ID = res.id;

    // update nav
    qsa(".login").forEach(element => {
      element.classList.add("hidden");
    });
    qsa(".logout").forEach(element => {
      element.classList.remove("hidden");
      element.addEventListener("click", handleLogout);
    });
    qsa(".purchases").forEach(element => {
      element.classList.remove("hidden");
      element.addEventListener('click', displayPurchases);
    });
    id("cart-container").classList.remove("hidden");

    // clears input boxes and closes login form
    id("username").value = "";
    id("psw").value = "";
    id("login-popup").classList.add("hidden");
    id("buy-now").classList.remove("hidden");
    id("buy-now").addEventListener("click", displayBuyView);
    id("login-purchase").classList.add("hidden");
  }

  /** handles displaying the purchase view for a given product */
  function displayBuyView() {
    id("purchase-view").classList.remove("hidden");
    id("buy-now").classList.add("hidden");
    id("name").textContent = NAME;
    id("user-username").textContent = "@" + USERNAME;
    id('next').classList.remove('hidden');
    id("next").addEventListener("click", confirmPurchase);
  }

  /** handles confirming a purchase for the user */
  function confirmPurchase() {
    console.log('inside confirm purchase');
    let cardNum = id("card-number").value;
    let regex = /^\d{13,18}$/;
    if (regex.test(cardNum)) {
      console.log('passed test');
      id("card-number").classList.add("hidden");
      let cardP = gen('p');
      cardP.id = 'card-p';
      cardP.textContent = 'Card Number: ' + cardNum;
      id('user-username').insertAdjacentElement('afterend', cardP);
      id('card-num-label').classList.add('hidden');
      id('confirm-purchase').classList.remove('hidden');
      id('cancel-purchase').classList.remove('hidden');
      id('next').classList.add('hidden');

      // ADD EVT LISTENER TO CANCEL PURCHASE --> GO BACK TO ORIGINAL PURCHASE-VIEW IF CANCELED

      id('confirm-purchase').addEventListener('click', addTransaction);
      /*
       * let sequence = generateSequence();
       * console.log(sequence);
       */
    } else {
      // display to user somehow
      console.log('invalid card number. input must be between 13 and 18 digits, with no spaces');
    }
  }

  /** request to add transaction to database  */
  async function addTransaction() {
    let sequence = generateSequence();
    let params = new FormData();
    params.append('userId', USER_ID);
    params.append('confirmationNum', sequence);
    params.append('itemId', ITEM_ID);
    try {
      let response = await fetch('/artifact/addtransaction', {method: "POST", body: params});
      await statusCheck(response);
      response = await response.text();
      let purchaseResponse = gen('p');
      purchaseResponse.textContent = response;
      id('confirm-purchase').classList.add('hidden');
      id('cancel-purchase').classList.add('hidden');
      id('purchase-view').appendChild(purchaseResponse);
      setTimeout(() => {
        id('purchase-view').removeChild(purchaseResponse);
        id('card-p').textContent = "";
        id('purchase-view').removeChild(id('card-p'));
        id('purchase-view').classList.add('hidden');
        id('card-num-label').classList.remove('hidden');
        id('card-number').classList.remove('hidden');
        id('buy-now').classList.remove('hidden');
        id('card-number').value = "";
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  }

  /** handles displaying purchases */
  async function displayPurchases() {
    let params = new FormData();
    params.append('userId', USER_ID);
    try {
      let response = await fetch('/artifact/gettransactions', {method: 'POST', body: params});
      await statusCheck(response);
      response = await response.json();
      // hide all views
      for (let i = 0; i < response.length; i++) {
        console.log(response[i]);
        id("history-heading").textContent = NAME + "'s Transaction History";
        let infoContainer = gen("div");
        infoContainer.classList.add("history-info-container");

        let itemImg = gen("img");
        itemImg.src = "img/" + response[i].shortname + "1.jpeg";
        itemImg.classList.add("history-img");
        infoContainer.appendChild(itemImg);

        let historyInfo = gen('div');
        historyInfo.classList.add("history-info");
        let datetime = gen("p");
        datetime.classList.add("datetime");
        datetime.textContent = response[i].date;
        historyInfo.appendChild(datetime);

        let historyName = gen("h4");
        historyName.classList.add("history-name");
        historyName.textContent = response[i].item_name;
        historyInfo.appendChild(historyName);

        let price = gen("p");
        price.classList.add("history-price");
        price.textContent = "$" + response[i].price;
        historyInfo.appendChild(price);

        let confirmation = gen("p");
        confirmation.classList.add("confirmation");
        confirmation.textContent = response[i].confirmation_code;
        historyInfo.appendChild(confirmation);

        infoContainer.appendChild(historyInfo);
        id("entry-container").appendChild(infoContainer);
      }
    } catch (err) {
      console.log(err);
    }
  }

  /** makes request to logout endpoint */
  async function handleLogout() {
    let params = new FormData();
    params.append("username", USERNAME);
    try {
      let response = await fetch("/artifact/logout", {method: "POST", body: params});
      await statusCheck(response);
      response = await response.text();
      logoutView(response);
    } catch (err) {
      console.log(err);
    }
  }

  /** updates nav for logout */
  function logoutView(res) {
    qsa(".login").forEach(element => {
      element.classList.remove("hidden");
    });
    qsa(".logout").forEach(element => {
      element.classList.add("hidden");
    });
    qsa(".purchases").forEach(element => {
      element.classList.add("hidden");
    });
    id("cart-container").classList.add("hidden");
    id("buy-now").classList.add("hidden");
    id("login-purchase").classList.remove("hidden");
    console.log(res);
  }

  /**
   * Changes view to see all products and closes all other views
   * @param {String} category - type of item being searched for
   */
  function openShopItems() {
    console.log("inside open shop");
    shopView();
    viewAllItems();
  }

  function viewAllItems() {
    let allItems = qsa(".product-container");
    for (let i = 0; i < allItems.length; i++) {
      allItems[i].classList.remove("hidden");
    }
  }

  function shopView() {
    initalizeFilters();
    id("browse-container").classList.remove("flex");
    id("browse-container").classList.add("hidden");
    id("login-popup").classList.add("hidden");
    id("main-view").classList.remove("flex");
    id("main-view").classList.add("hidden");
    id("product-view").classList.remove("flex");
    id("product-view").classList.add("hidden");
    id("cart").classList.add("hidden");
    id("user-info").classList.add("hidden");
    id("browse-container").classList.add("hidden");
    id("search-filter-function").classList.remove("hidden");
    id("all-products").classList.remove("hidden");
    id("all-products").classList.add("flex");
  }

  /**
   * Fetches information requested from search bar
   * @param {String} category - type of item being searched for
   */
  function requestFilteredDatabase(category) {
    fetch("artifact/collection/" + category)
      .then(statusCheck)
      .then(res => res.json())
      .then(filterItems)
      .catch(handleError);
  }

  /** Filters through items on website by type */
  function filterItems(res) {
    let filteredItems = [];
    let allItems = qsa(".product-container");
    for (let i = 0; i < res.length; i++) {
      filteredItems.push(res[i].id);
    }
    for (let i = 0; i < DATABASE_SIZE; i++) {
      if (filteredItems.includes(parseInt(allItems[i].id))) {
        allItems[i].classList.remove("hidden");
      } else {
        allItems[i].classList.add("hidden");
      }
    }
  }

  /** Fetches all items */
  function requestInitializeItems() {
    fetch("artifact/items")
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
    createItems(res, "product-container", "all-products");
  }

  /** this function gets the 5 most recent items  */
  async function getRecents() {
    try {
      let response = await fetch("artifact/collection/recents");
      await statusCheck(response);
      response = await response.json();
      console.log(response);
      displayRecents(response);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Displays first few items from the database on the website
   * @param {JSON} res - represents recent items being sold on website
   */
  function displayRecents(res) {
    createItems(res, "new-arrival-product-container", "new-arrivals-items");
  }

  function createItems(res, className, idName) {
    for (let i = 0; i < res.length + 1; i++) {
      let item = gen("section");
      let itemImg = gen("img");
      let itemPrice = gen("p");
      let itemName = gen("p");
      itemImg.src = "img/" + res[i].shortname + "1.jpeg";
      let hoverSrc = "img/" + res[i].shortname + "2.jpeg";
      item.classList.add(className);
      itemPrice.textContent = "$" + res[i].price;
      itemName.textContent = res[i].item_name;
      item.setAttribute("id", res[i].id);
      itemImg.addEventListener("mouseenter", () => {
        itemImg.src = hoverSrc;
      });
      itemImg.addEventListener("mouseleave", () => {
        itemImg.src = "img/" + res[i].shortname + "1.jpeg";
      });
      item.appendChild(itemImg);
      item.appendChild(itemPrice);
      item.appendChild(itemName);
      id(idName).appendChild(item);
      item.addEventListener("click", () => displayItemInfo(res[i]));
    }
  }

  /** displays detailed information about each item */
  function displayItemInfo(res) {
    console.log(res);
    ITEM_ID = res.id;
    id("login-popup").classList.add("hidden");
    id("main-view").classList.remove("flex");
    id("main-view").classList.add("hidden");
    id("cart").classList.add("hidden");
    id("user-info").classList.add("hidden");
    id("all-products").classList.remove("flex");
    id("all-products").classList.add("hidden");
    id("product-view").classList.remove("hidden");
    id("product-view").classList.add("flex");
    id("item-name").textContent = res.item_name;
    id("item-cost").textContent = "$" + res.price;
    qs("#product-view img").src = "img/" + res.shortname + "1.jpeg";
    let hoverSrc = "img/" + res.shortname + "2.jpeg";
    qs("#product-view img").addEventListener("mouseenter", () => {
      qs("#product-view img").src = hoverSrc;
    });
    qs("#product-view img").addEventListener("mouseleave", () => {
      qs("#product-view img").src = "img/" + res.shortname + "1.jpeg";
    });
    id("item-description").textContent = res.description;
  }

  /** th */
  function generateSequence() {
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = '0123456789';

    let randomSequence = '';
    for (let i = 0; i < 2; i++) {
      let randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
      randomSequence += randomLetter;
    }
    for (let i = 0; i < 2; i++) {
      let randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
      randomSequence += randomNumber;
    }
    randomSequence = randomSequence.split('').sort(() => Math.random() - 0.5)
      .join('');
    return randomSequence;
  }

  function openPlantItems() {
    shopView();
    requestFilteredDatabase("flora");
  }

  /** Helper function to sort items by rock type */
  function openRockItems() {
    shopView();
    requestFilteredDatabase("terra");
  }

  /** Helper function to sort items by water type */
  function openWaterItems() {
    shopView();
    requestFilteredDatabase("aqua");
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
    /*
    if(err === 500) {
      document.getElementsByTagName("button").forEach(button => {
        element.disable = true;
      });
      let errorMsg = gen("p");
      errorMsg.textContent = "An error has occured, please try again later"
      id("error").appendChild(errorMsg);
      id("error").classList.remove("hidden");
    } else {
      let errorMsg = gen("p");
      // insert error message here
      id("error").appendChild(errorMsg);
      id("error").classList.remove("hidden");
      setTimeout(() => {
        id("error").classList.add("hidden");
        id("error").removeChid(errorMsg);
      }, "5000");
    }
    */
  }

 /**
  * Helper function to return the response"s result text if successful, otherwise
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