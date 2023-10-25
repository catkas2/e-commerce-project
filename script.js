"use strict";
(function() {
  window.addEventListener("load", init);

  function init() {
    id("feedback-btn").addEventListener("click", addFeedback);
  }

  function addFeedback() {
    let entry = id("entry").value;
    let container = document.createElement("section");
    container.classList.add("post");
    let contents = document.createElement("p");
    contents.textContent = "Entry:" + entry;
    container.appendChild(contents);
    id("posts").appendChild(container);
    //feedback.addEventListener("click", removePost);
    id("entry").value = "";
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
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
})();