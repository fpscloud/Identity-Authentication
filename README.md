# BACKGROUND
Customers are becoming increasingly aware of their privacy and getting bombarded by bad actors who want to dupe them into giving their personal info (and ultimately money).  When receiving calls from companies trying to reach out to them, customers are often weary of whether the communication is actually coming from the company or is it a fraud. Thus, companies want a simple but foolproof way to validating/authenticating their identity to the customer when contacting them. 

# SOLUTION
Identity Authentication is the backend service that companies can integrate in their applications to be able to authenticate agent to the customer. One can think of this as the reverse of two-factor authentication where companies are trying to validate that the customer is who they say they are.  In this case, the customer wants to validate that the company agent is who they say they are. 

During the call, the typical trust flow between the agent and the customer will look like as below -
* Agent will direct the customer to go to the companies public website (assumed trusted site). In the website, the customer will initiate the trust flow by submitting the phone number (agent already knows this) and the system will then generate a ONE  TIME PASS CODE (it is a secret code and customer will not share this with agent).
* Agent will use the backoffice system (CRM, Dialer etc behind companies firewall in the trusted zone) to retrieve the pass code associated with the phone number and will prompt it back to the customer to establish the trust.


# IMPLEMENTATION
This service consists of various rest api end points (refer below sections for details) and the api integration will involve the below implementation steps -
* Tenant Registeration
	* Register your self (typically IT admin) as a tenant admin by supplying your profile & credential information.
	* Using your tenant admin credentials register your company as a "tenant" in the FPS system. The system will generate and assign a unique id "Tenand Id" to uniquely identify your company.
	* Obtain api key, required to call the service APIs. It will be the responsibility of the company to keep this information secured and not share with anyone. In case of compromise, the api key can be refreshed on demand (via refresh api). As a best practice, we recommend you to refresh the api key periodically.
* Indentity Auth Configuration
	* Set up the pass code configuration. The system allows two passcode modes - manual setup or system generated (default). 
	* In case of system generated mode, the desired length of the passcode can be setup
	* In case of manual mode, the system relies on the user (customer facing application) to supply the passcode in the api to establish the trust flow.
* Customer facing UI Implementation *(Please refer to the below sections for the sample reference code.)*
	* Implement the customer facing screen (companies website or app) and integrate it with the "post" api to retrieve the generated (system generated mode) the one time pass code. 
	* In case of manual setup, provide a text box to allow customer to provided the pass code (secret)
* Agent facing UI  Implemementation  *(Please refer to the below sections for the sample reference code.)*
	* Implement agent facing screen (backoffice application such as CRM, Dialer etc) and integrate it with the "get" api to retrieve the pass code associated with the phone number.


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
	
**STEP 2:**

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

**Create New Passcode Configuration For Identity Service**

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

Please see reference implementation in salesforce folder.
