# API DOCUUMENTATION: https://authservice.fpsinc.com/api/documentation
# ADMIN API's
**Tenant Admin User Create**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/tenant/user

**Description:** Create a new tenant admin user in the system, who can view and configure the Tenant Configuration Details.
  
* **Sample Input:**
 
   `{  "name":  "Testdata",  "email":  "test.data@fpsinc.com",  "password":  "yourpassword"  }`
* **Sample  Output:**
 
  **Code:**  200  
        **Response:** 
         `{
				   "status":"SUCCESS",
				   "message":"User created successfully",
				   "data":{
				      "first_name":"user",
				      "username":"user@email.com",
				      "email":"user@email.com",
				      "updated_at":"2020-03-24 10:21:14",
				      "created_at":"2020-03-24 10:21:14",
				      "id":3141
				   }
				}`
 
 * **Error Responses**
 
 
	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|
	|  400 	|    Bad / Not a valid request  	|`{  "errors":  {  "name":  [  "The name may not be greater than 100 characters.",  "The name format is invalid."  ],  "email":  [  "The email has already been taken."  ]  }  }`	|   	
	|   400	|     Bad / Not a valid request	|   	`{    "errors": {      "tenant_id": [        "The tenant id is invalid."     ]    }`|   	 


**Tenant Admin User Authentication**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/user/login

**Description:** The user must authenticate to generate a token to access Tenant Configuration API's.


* **Sample Input:**
 `{  "email":  "user@email.com",  "password":  "yourpassword"  }`
 
* **Sample Output:**
 
  **Code:** 200 
  
    **Response:** `{  "success":  true,  "token":''}`

* **Error Responses**


	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|
	|  401	|    Unauthorized 	|`{  "status":  "Failed",  "message":  "Invalid credentials"  }`|   	

**Create new tenant in the system**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/tenant

**Description:** Create new Tenant in the system. By Default, the Tenant will be set to Inactive status. Service provider will activate based on the request.

* **Sample Input:**
 
 `{  "tenant_name":  "FPS"  }`
 
* **Sample Output:**
 
  **Code:** 200 
  
    **Response:** 
    `{  "status":  "Success",  "message":  "Tenant created successfully",  "data":  {  "tenant_id":  "025041000001-6dbd-11ea-806b-025041000001",  "tenant_name":  "FPS"  }  }`

* **Error Responses**


	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|
	|  400|    Bad / Not a valid request|`{  "errors":  {  "tenant_name":  [  "The tenant name has already been taken."  ]  }  }`|   	

**Identity Service Passcode Configuration**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/{tenant_id}/identity/passcode/config

**Description:** Create new pass code configuration details for the Identity service , that includes Pass key expiry time and Pass Phrase mode, method & length. The Phrase can be set to system or manual. If set to system, auto-generated Pass Phrase will be returned while calling the Trust API.
  
* **Sample Input:**
 
	`{  "tenant_config_details":  {  "pass_key_expires":  60,  "pass_phrase":  "system",  "pass_phrase_method":  "numeric",  "pass_phrase_length":  5  }  }`

* **Sample Output:**
 
  **Code:** 200 
  
    **Response:** 
    `{  "status":  "Success",  "data":  {  "status":  "Success",  "message":  "Tenant Configuration created successfully",  "data":  {  "tenantDetails":  {  "tenant_id":  "3d598852-7280-11ea-9bd3-28d24448fe41",  "tenant_config_details":  {  "pass_key_expires":  60,  "pass_phrase":  "system",  "pass_phrase_method":  "numeric",  "pass_phrase_length":  5  },  "created_by":  1400,  "updated_at":  "2020-04-09 13:41:12",  "created_at":  "2020-04-09 13:41:12",  "id":  1  }  }  }  }`
    
 * **Error Responses**

	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	| 	
	|   400	|     Bad / Not a valid request	|   	`{  "errors":  {  "tenant_id":  [  "The tenant id has already been taken "  ],  "tenant_config_details.pass_phrase":  [  "The selected tenant config details.pass phrase is invalid."  ]  }  }`|   	

**Identity Service Passcode Configuration**

**Resource URL** - `#GET` - https://authservice.fpsinc.com/api/v2/{tenant_id}/identity/passcode/config

**Description:** Get Passcode Configuration details that includes Pass key expiry time and Pass Phrase mode, method & length.
  
* **Sample Input:**
 
	**Required:**
	
	`tenant_id=[string]`

* **Sample Output:**
 
  **Code:** 200 
  
    **Response:**
     `{  "id":  1,  "tenant_id":  "d70b4e8c-41000001",  "tenant_config_details":  {  "pass_key_expires":  60,  "pass_phrase":  "system",  "pass_phrase_method":  "numeric",  "pass_phrase_length":  5  },  "status":  1,  "created_by":  1400,  "updated_at":  "2020-04-09 13:41:12",  "created_at":  "2020-04-09 13:41:12"  }`
 * **Error Responses**

	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|
	|   400	|     Bad / Not a valid request	|   	`{  "errors":  {  "tenant_id":  [  "The selected tenant id is invalid."  ]  }  }`|   

**Tenant API key refresh**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/tenant/{tenant_id}/api_key/refresh

**Description:** Create new unique API key for tenant, that is required to access the Verify API, which verifies the trust created by Customer.

**Authorization:** 	Enter your bearer token in the format Bearer <token>
			Name: Authorization
			In: header

* **Sample Input:**
 
	**Required:**
	
	`tenant_id=[string]`

* **Sample Output:**
 
  **Code:** 200 
  
    **Response:** 
    `{  "status":  "Success",
      "api_key":  "7Sngey4k5F5e79ewDiyjGy70DGMVnNCXlwDiyjGyJJumpcT0PKZVjk2xeR"  }`
 * **Error Responses**

	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|
	|   400	|     Bad / Not a valid request	|   	`{    "errors": {      "tenant_id": [        "The tenant id is invalid."     ]    }`|   	

 ___
# CLIENT API's

**Customer Passcode Submission**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/{tenant_id}/identity/passcode

**Description:** Create new passcode in tenant system for customer verification
  
* **Sample Input:**
`{  "pass_key":  "23456",  "pass_phrase":  "chennai"  }`

* **Sample Output:**
 
  **Code:** 200 
  
    **Content:** 
    `{  "status":  "Success",  "data":  {  "pass_key":  "birth place",  "pass_phrase":  "chennai"  }  }`

* **Error Responses**

	|Error Code   |     Description	     |Error Response Sample|
	|---	|---	|---	|	
	|409 |  Conflict | `{"status": "Failed",   "message": "Key already taken by another user"  } `|
	| 400|  Not a Valid Request|   `{  "errors":  {  "pass_key":  [  "The pass key field is required."  ]  }` |

**Customer Trust Verification**

**Resource URL** - `#GET` - https://authservice.fpsinc.com/api/v2/{tenant_id}/identity/passcode/{key}

**Description:**  Verify the trust created by customer

 **URL Params**
 
 **Authorization:** 	Enter your API key the format x-api-key <API_KEY>
			In: header
 
**Required:**

	`tenant_id=[string]`
	`pass_key=[string]`

* **Sample Output:**
 
  **Code:** 200 
  
    **Response:**
     `{  "status":  "Success",  "pass_phrase":  "chennai"  }`

 
* **Error Response:** 
 
	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|  
	|  410 |  Gone 	|  ` {    "status": "Failed",    "message": "Pass Key Expired"  }`|   	
	|  400 |  Not a Valid Request|  `{  "status":  "Failed",  "message":  "The tenant id is invalid."  }`|   

**Common Error Responses:** 
 
|   Error Code	|   Description	| Error Response Sample|   	   	
|---	|---	|---	|
|  500 	|  Internal Server error 	|   	`{    "status": "Failed",   "message": "Some thing went wrong. Please contact Administrator"  }`|

 ___

## HTML & CSS

Copy & Insert the whole div with class named "widget__box" on index.html into your file.
```
<div class="widget__box">...</div>
```
The classes are named uniquely, so that it doesn't interfer with your other styles.

Please include our styles.css as a link in your head, or copy everthing in styles.css and place it in a style tag in your head.

## JS
You can choose to go with your own approach on handling the http requests. 
Here, we have handled it with [axios](https://github.com/axios/axios), delivered on CDN

You need to fill in your provided Credentials here to successfully send requests to the server.

```
const apiUrl = '.....';
const apiVer = '.....';
const tenantID = '.....';
```

If you decide to go your own approach on handling the http requests, you should place your code in this function

``
const sendData = () => { 
	// Your code here
}
``

**Salesforce Integration**

You can integrate with salesforce as a Lightning Web Component. 

Please see refernce implementation in salesforce folder.
