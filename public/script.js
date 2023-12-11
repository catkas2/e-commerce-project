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
   * ADD --> RATING SYSTEM TO FEEDBACK
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
    id("create-btn").addEventListener("click", event => {
      event.preventDefault();
      createNewUser();
    });
  }

  /** Requests the data regarding the search term entered in the search bar */
  function searchRequest() {
    fetch("artifact/items?search=" + id("search-bar").value.trim())
      .then(statusCheck)
      .then(res => res.json())
      .then(filterSearch)
      .catch(handleError);
  }

  /**
   * Filters through items on website by search term
   * @param {JSON} res - The data of the filtered products
   */
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

  /**
   * Allows search button to be clicked when a valid search term is put in the search bar
   * @param {String} e - The value put into the search bar
   */
  function enableSearch(e) {
    if (!e.target.value.trim()) {
      id("submit-search-btn").disabled = true;
    } else {
      id("submit-search-btn").disabled = false;
    }
  }

  /** Makes all toggle-able filters on so all products are visible on screen */
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

    /**
     * Filters through items on website by type
     * @param {JSON} res - The data of the filtered products
     */
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
    id("purchase-history").classList.add("hidden");
    id("all-products").classList.add("hidden");
    id("all-products").classList.remove("flex");
    id("product-view").classList.add("hidden");
    id("product-view").classList.remove("flex");
    id("search-filter-function").classList.add("hidden");
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
   * DELETE LATER Gives the user the ability to write feedback and submit it.
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

  /** Handles user login */
  function handleLogin() {
    id("create-text").classList.remove("hidden");
    id("create-account-text").classList.add("hidden");
    id("login-text").textContent = "Login";
    id("login-btn").classList.remove("hidden");
    id("create-btn").classList.add("hidden");
    id("login-popup").classList.toggle("hidden");
  }

  /** logs user in */
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

  /**
   * Updates information on page to reflect that of the current user logged in
   * @param {JSON} res - The data of the user logged in
   */
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
      unhidePurchases();
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
        userFeedbackArea(infoContainer, response[i].item_id);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function userFeedbackArea(infoContainer, productID) {
    let feedbackDiv = gen("div");
    feedbackDiv.classList.add("feedback-div")
    let feedbackInfo = gen("p");
    let feedbackArea = gen("textarea");
    let reviewNumber = gen("select");
    let submitReviewBtn = gen("button");
    submitReviewBtn.textContent = "Submit Review";
    submitReviewBtn.classList.add(".submit-btn")
    feedbackArea.setAttribute("id", productID + "feedback");
    reviewNumber.setAttribute("id", productID + "rating");
    for (let i = 1; i < 6; i++) {
      let selectNum = gen("option");
      selectNum.setAttribute("value", i);
      selectNum.textContent = i;
      reviewNumber.appendChild(selectNum);
    }

    feedbackInfo.textContent = "Leave a review here!"
    feedbackDiv.appendChild(feedbackInfo);
    feedbackDiv.appendChild(feedbackArea);
    feedbackDiv.appendChild(reviewNumber);
    feedbackDiv.appendChild(submitReviewBtn);
    infoContainer.appendChild(feedbackDiv);
    submitReviewBtn.addEventListener("click", () => {
      submitReviewBtn.disabled = true;
      saveFeedback(productID);
    });
  }

  async function saveFeedback(productID) {
    let params = new FormData();
    let rating = id(productID + "rating").value;
    let feedback = id(productID + "feedback").value;
    params.append("itemId", productID);
    params.append("userId", USER_ID);
    params.append("feedback", feedback);
    params.append("rating", rating);

    try {
      let response = await fetch("/artifact/feedback", {method: "POST", body: params});
      await statusCheck(response);
      response = await response.text();
      updateRating();
    } catch (err) {
      console.log(err);
    }
  }

  function unhidePurchases() {
    id("purchase-history").classList.remove("hidden");
    id("main-view").classList.add("hidden");
    id("browse-container").classList.add("hidden");
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

  /**
   * Displays page for users not logged in, removing the function to purchase,
   * and view transaction histroy
   * @param {JSON} res - The data of the logged out user
   */
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
    id("buy-now").classList.add("hidden");
    id("login-purchase").classList.remove("hidden");
    goHome();
    console.log(res);
  }

  /**
   * Changes view to see all products and closes all other views
   */
  function openShopItems() {
    console.log("inside open shop");
    shopView();
    viewAllItems();
  }

  /** Removes all filters effects allowing all products to be visible */
  function viewAllItems() {
    let allItems = qsa(".product-container");
    for (let i = 0; i < allItems.length; i++) {
      allItems[i].classList.remove("hidden");
    }
  }

  /** Makes it so only the products are visible */
  function shopView() {
    initalizeFilters();
    id("browse-container").classList.remove("flex");
    id("browse-container").classList.add("hidden");
    id("login-popup").classList.add("hidden");
    id("main-view").classList.remove("flex");
    id("main-view").classList.add("hidden");
    id("product-view").classList.remove("flex");
    id("product-view").classList.add("hidden");
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

  /**
   * Filters through items on website by type
   * @param {JSON} res - The data of the filtered products
   */
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
    for (let i = 1; i < res.length; i++) {
      let item = gen("section");
      let itemImg = gen("img");
      let itemPrice = gen("p");
      let itemName = gen("p");
      itemImg.src = "img/" + res[i].shortname + "1.jpeg";
      let hoverSrc = "img/" + res[i].shortname + "2.jpeg";
      item.classList.add("product-container");
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
      id("all-products").appendChild(item);
      item.addEventListener("click", () => displayItemInfo(res[i]));
    }
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

  /**
   * Helper function to creating all items on webpage
   * @param {JSON} res - represents the data of all items available on website
   * @param {String} className - Configures layout based on if item is a recent arrival
   * @param {String} idName - Configures location based on if item is a recent arrival
   */
  function createItems(res, className, idName) {
    for (let i = 0; i < res.length; i++) {
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

  /** displays detailed information about each item
   * @param {JSON} res - represents the data of the item selected
   */
  function displayItemInfo(res) {
    console.log(res);
    hideViewForItem();
    ITEM_ID = res.id;
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
    requestItemFeedback();
    id("all-reviews").classList.remove("hidden");
  }

  /** Requests all feedback for an item from database */
  async function requestItemFeedback() {
    try {
      let response = await fetch("/artifact/feedback/" + ITEM_ID);
      await statusCheck(response);
      response = await response.json();
      console.log(response);
      displayFeedback(response);
    } catch (err) {
      handleError();
    }
  }

  /** Displays feedback on website */
  function displayFeedback(res) {
    calculateAverageFeedback(res);
    for (let i = 0; i < res.length; i++) {
      let user = gen("p");
      let feedback = gen("p");
      let feedbackContainer = gen("div");
      user = res[i].user_id;
      feedback = res[i].feedback;
      feedbackContainer.classList.add("review-box");

      feedbackContainer.appendChild(user);
      feedbackContainer.appendChild(feedback);
      id("all-reviews").appendChild(feedbackContainer);
    }
  }

  /**
   * Using the information from previous feedback data, determine the average rating
   * @param {JSON} res - data represeting all the previous feedbacks
   */
  function calculateAverageFeedback(res) {
    console.log("help");
    let totalRating;
    let allFeedbackRatings = [];
    let avgFeedback = totalRating/res.length;
    for (let i = 0; i < res.length; i++) {
      allFeedbackRatings.push(res[i].rating);
      totalRating += res[i].rating;
    }
    id("item-rating").textContent = avgFeedback + "/5";
    console.log(avgFeedback + "/5");
  }

  /** Hides all other views except that for a specific item */
  function hideViewForItem() {
    id("login-popup").classList.add("hidden");
    id("main-view").classList.remove("flex");
    id("main-view").classList.add("hidden");
    id("purchase-view").classList.add("hidden");
    id("all-products").classList.remove("flex");
    id("all-products").classList.add("hidden");
    id("product-view").classList.remove("hidden");
    id("product-view").classList.add("flex");
  }

  /** Generates a random mix of 2 numbers and 2 letters */
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

  /** Helper function to sort items by flower type */
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
    id("create-btn").classList.remove("hidden");
    id("login-btn").classList.add("hidden");
    // everything reguarding creating an account must happen here --> make request to backend

  }

  /** Creates a new user given the data filled out on the website */
  async function createNewUser() {
    console.log('inside create new user');
    let data = new FormData();
    data.append("username", id("username").value);
    data.append("password", id("psw").value);
    data.append("name", id("first-name").value);
    data.append("email", id("email").value);
    try {
      let response = await fetch("/artifact/newuser", {method: "POST", body: data});
      await statusCheck(response);
      response = await response.json();
      console.log(response);
      id("username").value = "";
      id("psw").value = "";
      id("first-name").value = "";
      id("email").value = "";
      displayLoginView(response);
    } catch (err) {
      console.log(err);
    }
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