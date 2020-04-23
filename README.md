# BACKGROUND
Customers are being bombarded every day by bad actors (over phone calls) who want to steal their identities and their money. How can a customer know if the person they are speaking to is a genuine company representative or a fraud? Identity Authentication solves this problem 

# SOLUTION
Identity Authentication was developed to help companies build trust with their customers in the simplest way. Identity Authentication is a backend service that companies can integrate into their existing CRM/web applications and will help their customers authenticate the company representative (agent).Think of this as the reverse of two-factor authentication where instead of companies validating their customer, the customer validates the company.

When a company agent calls a customer, the typical trust flow between the agent and the customer will look like this:-

* The Agent will direct the customer to go to the company's public website (assumed trusted site). On the website, the customer will initiate the trust flow by submitting their phone number (which the agent already knows) and the system will then generate a ONE TIME PASSCODE (it is a secret code and customer will not share this with the agent).
* The Agent will then use the back office system (such as CRM, Dialer, etc behind the company's firewall in the trusted zone) to retrieve the PASSCODE associated with the phone number and will say it back to the customer (verbally) to establish trust.


# IMPLEMENTATION
This service consists of various REST API endpoints (refer below sections for details) and integrating your applications with the API will involve the below implementation steps -
* Tenant Registration
	* Register yourself (typically IT admin in your company) as a Tenant admin by providing your profile & credential information.
	* Using your Tenant admin credentials, register your company as a "Tenant" in the FPS system. The system will generate and assign a "Tenant ID" to uniquely identify your company.
	* Obtain API key, required to call the service APIs. It will be the company's responsibility to keep this information secure and not share it with anyone. In case of compromise, the API key can be refreshed on-demand (via refresh API). As a best practice, we recommend you to refresh the API key periodically.
* Identity Auth Configuration
	* Set up the passcode configuration. The system allows two passcode modes - manual setup or system generated (default). 
	* In case of system generated mode, the desired length of the passcode can be setup
	* In case of manual mode, the system relies on the Customer (via the customer facing application) to supply the passcode in the API to establish the trust flow.
* Customer facing UI Implementation *(Please refer to the below sections for the sample reference code.)*
	* Implement the customer facing screen (company's website or app) and integrate it with the "post" API to retrieve the generated (system generated mode) the one time passcode. 
	* In case of manual setup, provide a text box to allow the customer to input the passcode (secret)
* Agent facing UI  Implementation  *(Please refer to the below sections for the sample reference code.)*
	* Implement agent facing screen (back office application such as CRM, Dialer, etc) and integrate it with the "get" API to retrieve the passcode associated with the phone number.


# API DOCUMENTATION: https://authservice.fpsinc.com/api/documentation

* If you are a registered user and have the valid Authorization token, please proceed to Step 2.
* If you are a registered user and don't have a valid Authorization token, please use our login API to generate a new token from Step 1
* If you are a tenant that already is in Active status, please proceed to Step 3 & Step 4

# ADMIN API's

**STEP 1:**
Register yourself as a Tenant admin in our service.
Use our login API to generate an authorization token with the registered email & password

**Tenant Admin User Create**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/tenant/user

**Description:** Create a new user in the system, the user will be assigned the Tenant Admin role by default. This user will have the privilege to create/manage Tenant and configure the passcode service in the system.
  
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

**Description:** The user must be authenticate in the system using the email and password to generate a token. Please store the token securely. Use this token to authorize yourself to access Tenant administration APIs. The token will expire after 30 days, use this API to generate a new token.

* **Sample Input:**
 `{  "email":  "tenantadmin@email.com",  "password":  "yourpassword"  }`
 
* **Sample Output:**
 
  **HTTP Response Code:** 200 
  
    **Response:** `{  "success":  true,  "token":''}`

* **Error Responses**


	|   Error Code	|   Description	|   	Error Response Sample|   	   	
	|---	|---	|---	|
	|  401	|    Unauthorized 	|`{  "status":  "Failed",  "message":  "Invalid credentials"  }`|
	
**STEP 2:**

**Create a new Tenant in the system**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/tenant

**Description:** Create a new Tenant in the system. By Default, the Tenant will be set to Inactive status. After verifying the Tenant user details, the Service admin will activate the Tenant. Upon activation proceed to Step 3. 

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

**Description:** Create a new REST API key for the Tenant, please store the token securely. This API key is required to access the "Identity" service APIs, which is in Step 4.

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

**Create New Passcode Configuration For Identity Service**

**Resource URL** - `#POST` - https://authservice.fpsinc.com/api/v2/{tenant_id}/identity/passcode/config

**Description:** Create a new passcode configuration which will be used in the client create and verify APIs, the User can configure the following parameters, Expiry time in Seconds, Pass Phrase mode (system/manual), Allowed characters (Numeric, Alphabets, Alphanumeric) & Character length. The Phrase can be set to system or manual. If set to system, auto-generated Pass Phrase will be returned while calling the Trust API.
  
* **Sample Input:**
 
	`{  "tenant_config_details":  {  "pass_key_expires":  60,  "pass_phrase":  "system",  "pass_pharse_allowed_characters":  "numeric",  "pass_phrase_length":  5  }  }`

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

**Description:** Get Passcode Configuration details that include Pass key expiry time and Pass Phrase mode, method & length.
  
* **Sample Input:**
 
	**Required:**
	
	`tenant_id=[string]`

* **Sample Output:**
 
  **HTTP Response Code:** 200 
  
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

**Description:** Create a new passcode in the Tenant system for customer verification. This API has to be integrated with customer facing application/website.
  
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

**Description:**  Verify the trust created by the customer by using the pass key. This API has to be integrated with CRM or any other application used to store the customer's information.  

 **Authorization:** 	Enter your API key the format x-api-key <API_KEY>
			in: header
 
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
|  500 	|  Internal Server error 	|   	`{    "status": "Failed",   "message": "Something went wrong. Please contact Administrator"  }`|

 ___
# UI Integration

You can find Reference implementation for both Customer & Agent UI in this repository. Please follow the below instructions to successfully integrate the widget into your UI. We have handled the HTTP requests with [Axios](https://github.com/axios/axios). CSS classes are named uniquely so that it doesn't interfere with your other styles.

# Customer view
## HTML & CSS

Copy & Embed the below div with all its contents into your web page.

```
<div class="widget__box">...</div>
```

Please include our `style.css` as a link in your HTML `head` tag , or copy everything in `styles.css` and place it in a style tag in the HTML `<head>` tag of your HTML page.

## JS

Please include our `script.js` as a link in your HTML `body` tag, or copy everything in `script.js` and place it in a script tag inside your `body` tag of your HTML page. 

You need to fill in your `apiUrl, apiVer, tenantID` in the JS, to successfully send requests to the server.

```
const apiUrl = '.....';
const apiVer = '.....';
const tenantID = '.....';
```

# Agent view
## HTML & CSS

Copy & Embed the below div with all its contents into your web page.

```
<div class="widget__box">...</div>
```

Please include our `style.css` as a link in your HTML `head` tag , or copy everything in `styles.css` and place it in a style tag in the HTML `<head>` tag of your HTML page.

## JS

Please include our `script.js` as a link in your HTML `body` tag, or copy everything in `script.js` and place it in a script tag inside your `body` tag of your HTML page. 

You need to fill in your `apiUrl, apiVer, tenantID, apiKey` in the JS, to successfully send requests to the server.

```
const apiUrl = '.....';
const apiVer = '.....';
const tenantID = '.....';
const apiKey = '.....';
```

**Salesforce Integration**

Please see the reference implementation in the `salesForceImpl.js` file, to integrate with salesforce as a Lightning Web Component.
