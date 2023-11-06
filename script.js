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
    id("feedback-btn").addEventListener("click", addFeedback);
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
      contents.textContent = "Entry:" + entry;
      container.appendChild(contents);
      id("posts").appendChild(container);
      id("entry").value = "";
      numOfEntry++;
    }
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }
})();