# Natural Artifacts API Documentation
The API’s purpose is to handle functionality regarding the items being sold on the website, user creation, login, logout, and feedback on products.
The API can return filtered results from search functionality or when given a specific category, it can check if a user exists and will log them in and out, it allows a user to be added, and saves information regarding feedback from a user.


## Retrieve Items
**Request Format:** /artifact/items

**Query Parameters:** Search (optional)

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** If search is not included, this request will return all the items on the database with all of the information (id, category, description, price, rating, inventory, shortname). If search is included, only items that include the search term in the title will be listed.

**Example Request 1:** /artifact/items

**Example Response 1:**
```json
[
	{
		"id": 1,
			"item_name": "Aqua sample - Five Flower Lake, China (8 oz.)",
			"category": "aqua",
			"description": "Five Flower Lake, the gem of the Jiuzhaigou National Park in China, is revered for its gorgeous alpine colors - from amber yellow, to emerald green, dark jade, and light turquoise. The depth reaches only 16 feet, and our 8 oz. samples are carefully drawn from the bottom of the crystal-clear lake and poured into painted porcelain Chinese snuff bottles for display or a thoughtful gift.",
			"price": 19,
			"rating": 4.2,
			"inventory": 100,
			"shortname": "fiveflowerlake"
	},
	... // abbreviated response
]
```
**Example Request 2:** /artifact/items?search=rock

**Example Response 2:**
```json
[
  {
    "id": 16,
    "item_name": "Volcanic Rock (Hawai'i)",
    "category": "terra",
    "description": "Volcanic rock from the vibrant lands of Hawaii embodies the fiery spirit of Pele, the goddess of volcanoes. Carved by molten forces, these sacred stones bear the raw energy of creation and renewal. Hold these rocks in your hands to feel the pulse of Earth's ancient rhythms, inviting grounding and strength while connecting you to the island's volcanic legacy.",
    "price": 15,
    "rating": 5,
    "inventory": 6,
    "shortname": "volcanicrock"
  }
]
```

## Retrieve Items Based on Price
**Request Format:** /artifact/items/:price

**Path Params:** Price

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This request will return items on the database that are between the price from the given price or $10 under. For example, if 20 is passed as a path parameter, this endpoint returns all items between $10 and $20.

**Example Request:** /artifact/items/30

**Example Response:**
```json
[
  {
    "id": 13,
    "item_name": "Iris Agate (Indonesia)",
    "category": "terra",
    "description": "The Indonesian Iris Agate, forged deep within the earth's embrace on the vibrant islands of Indonesia, embodies a kaleidoscope of mesmerizing colors and intricate patterns. Its swirling hues and mesmerizing iridescence evoke the mystical landscapes and cultural richness of the region.",
    "price": 30,
    "rating": 3,
    "inventory": 6,
    "shortname": "irisagate"
  },
  {
    "id": 14,
    "item_name": "Sunstone (Oregon, US)",
    "category": "terra",
    "description": "Sunstone, born in the fiery heart of Oregon, radiates a mesmerizing warmth with its golden hues and iridescent flashes. This gem, native to the volcanic landscapes of the United States, embodies the sun's vitality and carries the energy of joyous abundance. ",
    "price": 20,
    "rating": 2,
    "inventory": 5,
    "shortname": "sunstone"
  },
  ... // abbreviated response
]
```

## Retrieve Items based on Category
**Request Format:** /artifact/collection/:collection

**Path Params:** Collection (flora, aqua, terra, or recents).

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This request will return items on the database that have the collection/type requested (one of flora, aqua, or terra). If "recents" is passed in as the path param, will return the five most recent items added to the collection.

**Example Request:** /artifact/items/terra

**Example Response:**
```json
[
  {
    "id": 5,
    "item_name": "Bohemian Moldevite",
    "category": "terra",
    "description": "Moldevite is known to be a catalyst of spiritual transformation, often linked to the heart chakra and connection to the divine. Manifest your own spiritual healing with moldevite right from the stone mines of Bohemia. ",
    "price": 33,
    "rating": 2.3,
    "inventory": 45,
    "shortname": "moldevite"
  },
	... // abbreviated response
]
```

## Retrieve Feedback for an item
**Request Format:** /artifact/feedback/:item

**Path Params:** itemId (the id of the item being reviewed).

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This request will return all feedback on the item requested, with the username of the person who submitted feedback, the rating, feedback text, and date of entry.

**Example Request:** /artifact/feedback/17

**Example Response:**
```json
[
  {
    "rating": 5,
    "date": "2023-12-11 22:48:37",
    "feedback": "Incredible. Looks beautiful in my garden.",
    "username": "rossgell"
  },
  {
    "rating": 5,
    "date": "2023-12-11 22:50:36",
    "feedback": "Best prarie seeds I have ever purchased! No complaints here!!",
    "username": "catk2"
  },
  {
    "rating": 5,
    "date": "2023-12-11 22:51:17",
    "feedback": "Only complaint is that I didn't buy more! hahaha",
    "username": "monica_geller"
  }
]
```

## Add a New User
**Request Format:** /artifact/newuser

**Body Parameters:** name, email, username, password

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** This endpoint returns all of the credential information for the user that has just been created. The status is always set to "active", so the user is automatically logged in once an account is created.

**Example Request:** /artifact/newuser

**Example Response:**
```json
[
  {
  "id": 7,
  "username": "chan",
  "password": "dler",
  "name": "Chandler Bing",
  "email": "bingbing@gmail.com",
  "status": "active"
  }
]
```

## Log In to Account
**Request Format:** /artifact/login

**Body Parameters:** username and password

**Request Type:** POST

**Returned Data Format**:

**Description:** This endpoint returns the credential information of a user that has successfully logged into their account.

**Example Request:** /artifact/login

**Example Response:**
```json
{
  "id": 4,
  "username": "rach",
  "password": "nordstrom",
  "name": "Rachel Green",
  "email": "rachel@gmail.com",
  "status": "active"
}
```

## Log Out of Account
**Request Format:** /artifact/logout

**Body Parameters:** username

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** This request will return a success message upon the user logging out.

**Example Request:** /artifact/logout

**Example Response:**
```
Sucessfully logged out. Thank you for visiting.
```

## Add Feedback to a Product
**Request Format:** /artifact/feedback

**Body Parameters:** userId, itemId, rating, feedback

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Returns a plain text success message thanking the user for reviewing the product.

**Example Request:** /artifact/feedback

**Example Response:**
```
Thank you for reviewing this product! We take your feedback to heart at Aurea Vita : )
```

## Complete Transaction
**Request Format:** /artifact/addtransaction

**Body Paramaters:** userId, confirmationNum, itemId

**Request Type:** POST

**Returned Data Format:** Plain Text

**Description:** This endpoint returns an endpoint with confirming the purchase and the randomly generated confirmation number that was passed in.

**Example Request:** /artifact/addtransaction

**Example Response:**
```
Purchase succesful! This confirmation number has been sent to your email:Z6K8
```

## Get Transaction History
**Request Format:** /artifact/gettransactions

**Body Parameters:** userId

**Request Type:** POST

**Returned Data Format:** JSON

**Description:** This endpoint returns all of the transactions (the user id, date of transaction, item id, confirmation code, item name, price, and shortname) of a specified user.

**Example Request:** /artifact/gettransactions

**Example Response:**
```json
[
  {
    "user_id": 2,
    "date": "2023-12-10 05:28:09",
    "item_id": 8,
    "confirmation_code": "5BN6",
    "item_name": "Serpentine (Machu Picchu, Peru)",
    "price": 40,
    "shortname": "serpentine"
  },
  {
    "user_id": 2,
    "date": "2023-12-10 05:38:21",
    "item_id": 2,
    "confirmation_code": "C03Z",
    "item_name": "Aqua sample - Mt. Everest, Tibet (5 oz.)",
    "price": 30,
    "shortname": "mteverest"
  },
  ... // abbreviated response
]
```

## Error Handling

**All Error Response Types:** Plain Text

*Server-Side Errors*

**Status Code:** 500

**Response:** Oops! It seems our cosmic vibes got tangled. Our team is aligning the stars to restore the harmonious flow of Aurea Vita. Stay zen!

*Client-Side Errors*

1. Attempt to Create New Account With Existing Credentials

**Status Code:** 400

**Response:** Email or username already registered with an account.

2. Missing Information When Creating Account

**Status Code:** 400

**Response:** Missing one or more pieces of information.

3. Attempt to Log In With Nonexistent Username

**Status Code:** 400

**Response:** Username does not exist. please create an account with us.

4. Incorrect Password at Login

**Status Code:** 400

**Response:** Incorrect password entered. Try again.

5. Missing Credentials at Login

**Status Code:** 400

**Response:** Missing username or password.

5. Generated Confirmation Number is Non-Unique

**Status Code:** 409

**Response:** This confirmation number already exists in our database. Please try the purchase again.

6. Item is Out of Stock

**Status Code:** 404

**Response:** Sorry, this item is currently out of stock. Please try again at a later date.