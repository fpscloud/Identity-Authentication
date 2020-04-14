
# Usage

Please read all the instructions to make sure you can successfully embed our widget into your site.

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


