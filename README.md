RESTful web service for two users (consumer and company agent) to be able to authenticate each other by using the company’s website and apps as the source of the underlying authentication/trust/validation between the two parties.

There are two parts of this service:
* “Post”: Setting the lookup code and the passphrase in a website or application owned by the company 
* “Get”: Looking up the code and passphrase in an application owned by the company that is behind an user authentication service 

Setup 
* Client can integrate the Post service in their website or application. 
* Client can integrate the Get service in their system that is behind user authentication/permissions. For example, agents can only lookup the codes once they are logged into the CRM app.  

# API DOCUMENTATION: https://authservice.fpsinc.com/api/documentation

* If you are an already regsitered user and having the valid Autherization token, Please procced to Step 2.
* If you are an already registered user and don't have a valid Auterization token, Please use our login API to generate a new token from Step 1
* If you'r tenant already is in Active status, Please proceed to Step 3 & Step 4

# ADMIN API's

**STEP 1:**
Regsiter yourself as a Tenant admin in our service
Use our login API to generate a authorization token with the regsitered email & password

**Tenant Admin User Create**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/tenant/user

**Description:** Create a new user in the system, the user will be assigned with Teant Admin role by default. This user have the privilege to create / manage Tenant and configure the passcode service in the system.
  
* **Sample Input:**
 
   `{  "name":  "Tenant Admin",  "email":  "tenantadmin@email.com",  "password":  "yourpassword"  }`
* **Sample  Output:**
 
  **HTTP Response Code:**  200  
        **Response:** 
         `{
				   "status":"SUCCESS",
				   "message":"User created successfully",
				   "data":{
				      "first_name":"Tenant Admin",
				      "username":"tenantadmin@email.com",
				      "email":"tenantadmin@email.com",
				      "updated_at":"2020-03-24 10:21:14",
				      "created_at":"2020-03-24 10:21:14"
				   }
				}`
 
 * **Error Responses**
 
 
	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|
	|  400 	|    Bad / Not a valid request  	|`{  "errors":  {  "name":  [  "The name may not be greater than 100 characters.",  "The name format is invalid."  ],  "email":  [  "The email has already been taken."  ]  }  }`	|   	
	 


**Tenant Admin User Authentication**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/login

**Description:** The user must authenticate in the system using the email and password to generate a token. Store the token in your secrets. Use this token to authorize yourself to access Tenant administration API's. The token will be expired after 30 days, use this API to generate a new token.

* **Sample Input:**
 `{  "email":  "tenantadmin@email.com",  "password":  "yourpassword"  }`
 
* **Sample Output:**
 
  **HTTP Response Code:** 200 
  
    **Response:** `{  "success":  true,  "token":''}`

* **Error Responses**


	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|
	|  401	|    Unauthorized 	|`{  "status":  "Failed",  "message":  "Invalid credentials"  }`|
	
**STEP 2**

**Create new tenant in the system**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/tenant

**Description:** Create new Tenant in the system. By Default, the Tenant will be set to Inactive status. After verifyig the tenat user details, Service admin will activate the tenant. Upon activation proceed to Step 3. 

* **Sample Input:**
 
 `{  "tenant_name":  "FPS"  }`
 
* **Sample Output:**
 
  **HTTP Response Code:** 200 
  
    **Response:** 
    `{  "status":  "Success",  "message":  "Tenant created successfully",  "data":  {  "tenant_id":  "025041000001-6dbd-11ea-806b-025041000001",  "tenant_name":  "FPS"  }  }`

* **Error Responses**


	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|
	|  400|    Bad / Not a valid request|`{  "errors":  {  "tenant_name":  [  "The tenant name has already been taken."  ]  }  }`|   	
**STEP 3:**

**Generate REST API key to access service API's**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/tenant/{tenant_id}/api_key/refresh

**Description:** Create new REST API key for tenant, Store the API key in your secrets. This API key is required to access the "Identity" service API's, which is in the Step 4.

**Authorization:** 	Enter your bearer token in the format Bearer <token>
			Name: Authorization
			In: header

* **Sample Input:**
 
	**Required:**
	
	`tenant_id=[string]`

* **Sample Output:**
 
  **HTTP Response Code:** 200 
  
    **Response:** 
    `{  "status":  "Success", "api_key":  "7Sngey4k5F5e79ewDiyjGy70DGMVnNCXlwDiyjGyJJumpcT0PKZVjk2xeR"  }`
 * **Error Responses**

	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|
	|   400	|     Bad / Not a valid request	|   	`{    "errors": {      "tenant_id": [        "The tenant id is invalid."     ]    }`|   	

**STEP 4:**

**Create New Passcode Configuration For Identity Service **

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/{tenant_id}/identity/passcode/config

**Description:** Create new pass code configuration which will be used in the client create and verify API's, User can configure the following parameters, Expiry time in Seconds, Pass Phrase mode (system / manual), Method (Numeric, Alphabets, Alphanumeric) & Character length. The Phrase can be set to system or manual. If set to system, auto-generated Pass Phrase will be returned while calling the Trust API.
  
* **Sample Input:**
 
	`{  "tenant_config_details":  {  "pass_key_expires":  60,  "pass_phrase":  "system",  "pass_phrase_method":  "numeric",  "pass_phrase_length":  5  }  }`

* **Sample Output:**
 
  **HTTP Response Code:** 200 
  
    **Response:** 
    `{  "status":  "Success",  "data":  {  "status":  "Success",  "message":  "Tenant Configuration created successfully",  "data":  {  "tenantDetails":  {  "tenant_id":  "3d598852-7280-11ea-9bd3-28d24448fe41",  "tenant_config_details":  {  "pass_key_expires":  60,  "pass_phrase":  "system",  "pass_phrase_method":  "numeric",  "pass_phrase_length":  5  },  "created_by":  1400,  "updated_at":  "2020-04-09 13:41:12",  "created_at":  "2020-04-09 13:41:12",  "id":  1  }  }  }  }`
    
 * **Error Responses**

	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	| 	
	|   400	|     Bad / Not a valid request	|   	`{  "errors":  {  "tenant_id":  [  "The tenant id has already been taken "  ],  "tenant_config_details.pass_phrase":  [  "The selected tenant config details.pass phrase is invalid."  ]  }  }`|   	

**Get Identity Service Passcode Configuration**

**Resource URL** - `#GET` - https://authservice.fpsinc.com/api/v2/{tenant_id}/identity/passcode/config

**Description:** Get Passcode Configuration details that includes Pass key expiry time and Pass Phrase mode, method & length.
  
* **Sample Input:**
 
	**Required:**
	
	`tenant_id=[string]`

* **Sample Output:**
 
  **HTTP Rsponse Code:** 200 
  
    **Response:**
     `{  "id":  1,  "tenant_id":  "d70b4e8c-41000001",  "tenant_config_details":  {  "pass_key_expires":  60,  "pass_phrase":  "system",  "pass_phrase_method":  "numeric",  "pass_phrase_length":  5  },  "status":  1,  "created_by":  1400,  "updated_at":  "2020-04-09 13:41:12",  "created_at":  "2020-04-09 13:41:12"  }`
 * **Error Responses**

	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|
	|   400	|     Bad / Not a valid request	|   	`{  "errors":  {  "tenant_id":  [  "The selected tenant id is invalid."  ]  }  }`|   

 ___
# CLIENT API's

**Customer Passcode Submission**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/{tenant_id}/identity/passcode

**Description:** Create new passcode in tenant system for customer verification. This API has to be integrated with customer facing application / website eg: corporate website to gain cusomter trust to share any personal information
  
* **Sample Input:**
`{  "pass_key":  "23456",  "pass_phrase":  "chennai"  }`

* **Sample Output:**
 
  **HTTP Response Code:** 200 
  
    **Content:** 
    `{  "status":  "Success",  "data":  {  "pass_key":  "birth place",  "pass_phrase":  "chennai"  }  }`

* **Error Responses**

	|Error Code   |     Description	     |Error Response Sample|
	|---	|---	|---	|	
	|409 |  Conflict | `{"status": "Failed",   "message": "Key already taken by another user"  } `|
	| 400|  Not a Valid Request|   `{  "errors":  {  "pass_key":  [  "The pass key field is required."  ]  }` |

**Customer Trust Verification**

**Resource URL** - `#GET` - https://authservice.fpsinc.com/api/v2/{tenant_id}/identity/passcode/{key}

**Description:**  Verify the trust created by customer by passing the pass key which was prompted / shared by customer. This API has to be integrated with CRM or Any other application used to store the customer's information.  

 **Authorization:** 	Enter your API key the format x-api-key <API_KEY>
			In: header
 
**Required:**

	`tenant_id=[string]`
	`pass_key=[string]`

* **Sample Output:**
 
  **HTTP Response Code:** 200 
  
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
