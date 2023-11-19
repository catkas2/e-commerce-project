# Natural Artifacts API Documentation
The API’s purpose would be to store names of our products with additional details regarding description, price, and other product information.


## *Product Names*
**Request Format:** products.php?products=all


**Request Type:** GET


**Returned Data Format**: Plain Text


**Description:** This request takes the parameter all and returns a text response of all products in our inventory, with the product name and lowercase name with no spaces (used to fetch images), separated by a colon.


**Example Request:** BASE_URL + “products.php?products=all”


**Example Response:**
```
. . .
Ginkgo Leaf: ginkgoleaf
Venus Fly Trap: venusflytrap
Volcanic Rock: volcanicrock
Dead Sea Sample: deadseasample
. . .
```


**Error Handling:**
Return “Error: resource not found. Please enter a valid request.”


## *Natural Artifact Data*
**Request Format:** products.php?products={name}


**Request Type:** GET


**Returned Data Format**: JSON


**Description:** This request takes in any product name and returns a detailed JSON object containing data surrounding product description, price, and other relevant information for purchase. The returned data will be used to populate the product page.


**Example Request:** BASE_URL + “products.php?products={name}”


**Example Response:**


```json
{
“product-name”: ”Volcanic Rock”,
“description”: “A rock with holes formed from an island”,
“price”: 15,
“images”: {
	“image1”: img/rock.jpg
	“image2”: img/rock2.jpg
},
“inventory”: 20,
“type”: “rock”
}


```


**Error Handling:**
json
{
“error”: {
	“Type”: 400,
	“Message”: “The requested artifact was not found. Make sure you have entered a valid parameter.”
	}
}


