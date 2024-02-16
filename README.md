# Final Project

## Intro
For our final project we were required to make a full stack assignment using HTML, CSS, client-side JavaScript, server-side JavaScript, and a SQL database. We choose
to make an Ecommerce website. Below are all the assignment requirements from the course (modified for brevity).

All identifying information has been removed.

## Outcome and Results
For this assignment we were able to allow a user to log in or create an account, filter through items based on toggle-able options and use a search bar, view transation history and make comments based on previously purchased items.

Our final submission was having issues with a user being able to purchase an item, so we were not able to demonstrate a working purchase, however, the code to do so is available.

## Future Improvements:
* Fixing the purchase errors
* Organize and optimize code (particularly the client-side js got messy in the end)
* Better formatting review boxes and transaction history
* Provide more pre-set filter options
* Present errors in a more noticable fashion


## Assignment Requirements

## Structural and Appearance Requirements
The following is a list of the _minimum_ appearance requirements that must be included in your CSS file(s):
* You must have at least 10 CSS rulesets and 10 unique CSS properties
* You must change at least 2 box model properties (border, padding, margin, height, width)
* You must use at least 2 flex properties
* You must import at least one [Google font](https://fonts.google.com/)

### Implementation Expectations
You are not allowed to use any external frameworks for any part of this project. You must use concepts demonstrated throughout the ten weeks of this course.

#### Database Requirements:
  * You are required to create a database to store data for your website
  * Your database must include at least 3 tables
  * You must include at least 1 foreign key to connect your tables
  * Each table must include a primary key
  * Each table must have at least 2 columns, although your tables will most likely have more
  * You must have at least 25 items in your database
  * A notion of capacity must exist for all items. Your database must also allow for the possibility of some items having an infinite capacity.

#### Feature 1: display the items on a “main view” page
Front End
  * A way for the user to be able to browse through all items
  * A way for the user to toggle between at least 2 layouts (e.g. list vs. grid, cozy vs. compact, etc.). The toggling should be accomplished via CSS classes.

Back End
  * Endpoint to retrieve all items

#### Feature 2: allow the user to login to their account
Front End
  * A way for the user to provide a valid username and password to gain access to account-required actions
  * A way for the user to allow the browser to save their username across browser sessions (i.e. the next time they try to login)

Back End
  * Endpoint to check if the username and password match an entry in the database
  * **Note**: You do not need to implement the "Create a New User" feature for this feature to work. You can manually add preset username/password combinations to your database and then use those credentials when logging in.

#### Feature 3: clicking on any individual item should bring the user to a view which provides more detailed information about said item
Front End
  * This can be implemented by using JS/DOM manipulation
  * This view must include at least 4 pieces of information about the item (i.e. name, image, description, price, dates, availability, tags, color, address, phone number, seller, professor, department, etc.)

Back End
  * Endpoint to retrieve detailed item information

#### Feature 4: users must be able to buy a product
Front End
  * Users must be logged in to make the purchase
  * The user can buy one product
  * A way for the user to confirm and submit the transaction (these are two separate actions)
    * The user should not be able to change their transaction after confirming it. If any changes are made to the transaction, the user must re-confirm their transaction before submitting it
  * Based on user input, there must be a possibility for the transaction to succeed or fail (it is up to you to determine what constitutes a success or failure)
  * After a successful transaction, the user must be given a confirmation number (hint: this could be useful in feature 6)
    * A confirmation number is a **unique** alphanumeric sequence of characters that identifies a transaction. It is up to you to decide how to generate confirmation numbers

Back End
  * Endpoint to check if transaction is successful or not
  * You should make sure the user is **logged in**
  * If the transaction is successful, update the database, and return a generated confirmation code
  * Users should not be able to buy products that are out of stock, enroll in full classes, or make reservations for services that are unavailable

#### Feature 5: users must be able to search and filter the available items
Front End
  * Must implement a search bar
    * Must be able to search multiple types of information
    * Must be able to type in the search bar
  * Must implement a way to filter items (e.g. displaying only pants)
    * Must be able to toggle filters on and off
      * This differs from the search bar because the filters should be preset and not user-generated. The users can select the filter they need from all possible filters.
    * This can be done by implementing categories/tags (i.e. furniture, clothing, food)
  * **Note**: You do not need to implement the ability to filter search results or search through filtered results. However, you are welcome to add these features if you would like

Back End
  * Endpoint to search database and return results
  * Must search at least 3 different columns in the database
    * The 3 column requirement is satisfied by searches performed through filtering and the search bar

#### Feature 6: users must be able to access all previous transactions
Front End
  * Users must be logged in
  * Users must be able to view information about their transaction including but not limited to the name of the item and the confirmation number for each transaction

Back End
  * Endpoint to retrieve transaction history for any given user
  * You should make sure the user is **logged in**

##### Additional Feature 1: Feedback on a Product
  * Logged-in users should be able to give feedback/rating/review on any given product
  * This should use a numerical rating scheme (e.g. 1-5, 1-10, etc.)
  * There should be an “average rating” visibly shown for any given product.
  * It may be useful to allow for users to explain their numerical ratings. As such, you should additionally allow for users to have the option to submit text reviews (e.g. comments) for any given product to accompany the numerical rating it received.

##### Additional Feature 2: Create a New User
  * Users are presented with a method in which to create an account for your e-commerce site.
  * The user provides at minimum a username, password, and e-mail.
  * The user information should be added to the database.
    * Optionally, feel free to use security methods such as hashing to make your website more “secure”.
  * This information should be captured by a Form HTML element.

# Internal Requirements

All patterns and practices defined as internal requirements in past assignments continue to apply here (e.g., following code quality guidelines, using the module pattern in front end JavaScript, proper use of `async`/`await` and promises, all errors handled appropriately, `statusCheck` used appropriately in fetch chains, minimizing the use of module-global variables, etc.).

## Front End Internal

* POST requests must send data using the `FormData` object/datatype through the body.

## Back End Internal

  * All POST endpoints must support all three data formats we've talked about (JSON, FormData, URL-Encoded)
  * The Node app must use the `express`, `multer`, and `sqlite` modules that we've shown in class.
  * All Node endpoints must return either JSON or text type (and not default HTML).
  * Your Node app should handle all possible errors.
  * `package.json` has the correct and complete list of dependencies for the project, and correctly points to `app.js` as the entry point.
  * Use sql joins to relate data between tables in your database
  * Similar to your client-side JS, decompose your Node.js/Express API by writing smaller, more generic functions that complete one task rather than a few larger "do-everything" functions. No function should be more than 30 lines of code, and your Node.js should have **at least three** helper functions defined and used (excluding `getDBConnection`). Consider factoring out important behavior for your different GET/POST requests into functions.

## Error Handling
You must handle errors appropriately throughout the project as outlined in our style guides and reinforced throughout lecture and section.
  * All possible errors need to be appropriately handled, returning the correct error codes and reasonable, descriptive messages.
  * All errors must be displayed to the client in a user-readable way.
    * You may not use `console.log`, `console.error`, or `alert` to display errors.
    * It must be displayed cleanly: no JSON objects appearing in the DOM.
    * It does not have to be the message returned from the server, but does have to indicate that an error occurred.
    * It must be visible on the webpage.