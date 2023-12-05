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

  /** Initializes page by making feedback button work when loading in */
  function init() {
    id('browse-btn').addEventListener('click', scrollToCategories);
    //id("feedback-btn").addEventListener("click", addFeedback);
    id("login").addEventListener("click", handleLogin);
    qs('.cancel').addEventListener('click', () => {
      id('login-popup').classList.add('hidden');
    });
    id("shop").addEventListener("click", openAllItems);
  }

  /** scrolls webpage to show collections cards */
  function scrollToCategories() {
    let target = document.getElementById('scroll-to-collections');
    target.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
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
    id("login-popup").classList.toggle('hidden');
  }

  function openAllItems() {

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