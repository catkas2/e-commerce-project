# Natural Artifacts API Documentation
The API’s purpose is to handle functionality regarding the items being sold on the website, user creation, login, logout, and feedback on products.
The API can return filtered results from search functionality or when given a specific category, it can check if a user exists and will log them in and out, it allows a user to be added, and saves information regarding feedback from a user.


## Retrieve Items
**Request Format:** /artifact/items

**Query Parameters:** Search (optional)

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** If search is not included, this request will return all the items on the database with 4+ types of information. Some items returned include the item's name, product description, price, and images. If search is included, only items that include the search term in the title will be listed.

**Example Request:** /artifact/items?search=five

**Example Response:**
```
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
	...
]
```

**Error Handling:**



## Retrieve Items based on Price
**Request Format:** /artifact/items/:price

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This request will return items on the database that are between the price from the given price or $10 under.

**Example Request:** /artifact/items/10

**Example Response:**
```
[
  {
    "id": 22,
    "item_name": "Hanging Lobster Claw (South America)",
    "category": "flora",
    "description": "The Hanging Lobster Claw plant, a tropical gem hailing from the lush rainforests of Central and South America, unfurls its vivid, pendulous blooms like nature's living chandeliers. Its vibrant red bracts and cascading form evoke the fiery dance of passion amidst emerald canopies. Invite this botanical masterpiece into your space, and be enchanted by its exotic allure, a living tapestry weaving tales of wild beauty and tropical splendor.",
    "price": 10,
    "rating": 0.7,
    "inventory": 42,
    "shortname": "hanginglobsterclaw"
  }
]
```

**Error Handling:**



## Retrieve Items based on Category
**Request Format:** /artifact/collection/:collection

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This request will return items on the database that have the collection/type requested

**Example Request:** /artifact/items/terra

**Example Response:**
```
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
	...
]
```

**Error Handling:**



## Retrieve Feedback for an item
**Request Format:** /artifact/feedback/:item

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This request will return all feedback on the item requested.

**Example Request:** /artifact/feedback/8

**Example Response:**
```
[
  {
    "id": 5,
    "user_id": "catk2",
    "item_id": 0,
    "feedback": "I didn't like it",
    "date": 2023-11-11
  },
	...
]
```

**Error Handling:**



## Add a new user
**Request Format:** /artifact/newuser

**Query Parameters:**

**Request Type:** POST

**Returned Data Format**:

**Description:**

**Example Request:** /artifact/newuser

**Example Response:**
```
```

**Error Handling:**
Possible 400 error if parameter is missing.


## Login to account
**Request Format:** /artifact/login

**Request Type:** POST

**Returned Data Format**:

**Description:**

**Example Request:** /artifact/login

**Example Response:**
```

```

**Error Handling:**
Possible 400 error if a parameter is missing or the password is incorrect.


## Logout of account
**Request Format:** /artifact/logout

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This request will return items on the database that have the collection/type requested

**Example Request:** /artifact/logout

**Example Response:**
```
```

**Error Handling:**



## Add Feedback to a product
**Request Format:** /artifact/feedback

**Request Type:** GET

**Returned Data Format**:

**Description:**

**Example Request:**

**Example Response:**
```
```

**Error Handling:**