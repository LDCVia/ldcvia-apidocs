---
title: LDC Via API Reference

language_tabs:
  - java
  - javascript

toc_footers:
  - <a href='http://ldcvia.com'>Find out more about LDC Via</a>

includes:
  - errors

search: true
---

# Introduction

Welcome to the LDC Via API! You can use our API to access LDC Via API endpoints, this allows you to access and modify documents within databases in your organisation.

We have language bindings in Java and JavaScript (jQuery)! You can view code examples in the dark area to the right, and you can switch the programming language of the examples with the tabs in the top right.

The video below shows how to get your API key:
<iframe src="//player.vimeo.com/video/113910972" width="500" height="281" frameborder="0" allowfullscreen=""></iframe>

# Authentication

> To authorize, always pass the 'apikey' HTTP header:

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get a list of databases that the current user has access to
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getDatabases() throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/databases");
	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

	return json.getAsArray("databases");
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
    dataType: 'json',
    type: 'GET',
    headers: { 'apikey': 'MYSECRETAPIKEY' },
    url: '/1.0/databases',
    success: function(data){
      //Do something
    }
  });
```

> Make sure to replace `MYSECRETAPIKEY` with your API key.

Each user in the application is assigned an API Key when they are registered. This key is unique and should be considered a secret (i.e. do not share your key with anyone else). Your API Key is required for all interactions with the API, without the key, or with an incorrect key you will not be able to access the API.

`apikey: INSERTYOURAPIKEYHERE`

<aside class="notice">
You must replace `INSERTYOURAPIKEYHERE` with your personal API key.
</aside>

## Login

We provide a simple login API to which you can pass a username and password, if they are valid then the matching API key will be returned with which you will be able to perform operations against the rest of the API.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get the API key for the user
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public String login(String username, String password) throws ClientProtocolException, IOException, JsonException{
	String responseBody = postURL("/1.0/login", "{\"username\": " + username + ", \"password\": " + password + "}");
	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

	return json.getString("apikey");
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPost httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
var data = {'username': "fred@bloggs.com", 'password': 'SuperSecretPassword'};
var root = 'https://ldcvia.com';
  $.ajax({
    dataType: 'json',
    type: 'POST',
    url: root + '/1.0/login',
    data: data,
    success: function(res) {
      console.log(res);
    }
  })
```
> The above command returns JSON structured like this:

```json
{
  "apikey":"d656cafda863458c78219760cb0ef4d1",
  "email":"fred@bloggs.com",
  "roles":{"account":"54be76b40f0f0ce80fe9b21e"},
  "notesnames":[],
  "databases":
    [
      {"database":"dev-londc-com-teamroom-nsf","_id":"54be770c0f0f0ce80fe9b220"},
      {"database":"dev-londc-com-teamroom-nsf","_id":"54be7ce40f0f0ce80fe9b221"},
      {"database":"dev-londc-com-teamroom-nsf","_id":"54c66b660f0f0ce80fe9b24b"},
      {"database":"dev-londc-com-teamroom-nsf","_id":"54d13776b8fcbdac0bee24f5"}
    ]
}
```

This endpoint retrieves all databases that you have access to.

### HTTP Request

`POST http://ldcvia.com/1.0/login`

# Databases

This is probably the simplest API method that we offer, it provides a simple list of databases that a user has access to.

## Get All Databases

```java
/**
 * Get a list of databases that the current user has access to
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getDatabases() throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/databases");
	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

	return json.getAsArray("databases");
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
var root = 'https://ldcvia.com';
  var apikey = 'MYSECRETAPIKEY';
  $.ajax({
    dataType: 'json',
    type: 'GET',
    url: root + '/1.0/databases',
    data: data,
    headers: {
      'apikey': apikey
    },
    success: function(res) {
      console.log(res);
    }
  })
```
> The above command returns JSON structured like this:

```json
{
  "databases":[
    {"name": "acme-com-discussion1", "title": "Discussion 1"},
    {"name": "acme-com-discussion2", "title": "Discussion 2"}
  ]
}
```

This endpoint retrieves all databases that you have access to.

### HTTP Request

`GET http://ldcvia.com/1.0/databases`

## Get Database Details

Use this method to get basic information about a database; its title and whether it is read only.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get a list of databases that the current user has access to
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public String getDatabaseTitle(String dbname) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/database/" + dbname);
	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

	return json.getAsString("title");
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: { 'apikey': apikey },
  url: '/1.0/database/' + database,
  success: function(res){
    //do something
  },
  error: function(xhr, status, error){
    if (xhr.status == 401){
      alert("You do not have the rights to access the database");
    }else{
      alert(status + '\n' + error);
    }
  }
});
```

> If you can delete the database you will see:

```json
{
  "db": "dev-londc-com-demos-fakenames-nsf",
  "readonly": false,
  "title": "NAB"
}
```

### HTTP Request
`GET https://ldcvia.com/1.0/database/:database`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service

## Set Database Details

Use this method to make a database read only or change its title

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get a list of databases that the current user has access to
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void setDatabaseTitle(String dbname, String title) throws ClientProtocolException, IOException, JsonException{
	String responseBody = postURL("/1.0/database/" + dbname, "{\"title\": " + title + "}");
	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPost httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
var data = "readonly=true&title=New Title";
$.ajax({
  dataType: 'json',
  type: 'POST',
  data: data,
  headers: { 'apikey': apikey },
  url: '/1.0/database/' + database,
  success: function(res){
    //do something
  },
  error: function(xhr, status, error){
    if (xhr.status == 401){
      alert("You do not have the rights to access the database");
    }else{
      alert(status + '\n' + error);
    }
  }
});
```

> If you can delete the database you will see:

```json
{
  "result": "ok"
}
```

### HTTP Request
`GET https://ldcvia.com/1.0/database/:database`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service

## Delete Entire Database

Use this method to delete a database. You must be a super user to perform this operation, otherwise you will receive a 401 error.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get a list of databases that the current user has access to
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void deleteDatabase(String dbname) throws ClientProtocolException, IOException, JsonException{
	deleteURL("/1.0/database/" + dbname);
}

/**
 * Helper method to delete a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String deleteURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpDelete httpdelete = new HttpDelete(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'DELETE',
  headers: { 'apikey': apikey },
  url: '/1.0/database/' + database,
  success: function(res){
    //do something
  },
  error: function(xhr, status, error){
    if (xhr.status == 401){
      alert("You do not have the rights to delete the database");
    }else{
      alert(status + '\n' + error);
    }
  }
});
```

> If you can delete the database you will see:

```json
{
  "result": "ok"
}
```

### HTTP Request
`DELETE https://ldcvia.com/1.0/database/:database`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service


# Collections

A collection in LDC Via is a group of documents that are all of the same type. In Notes and Domino terms it's very similar to a view. As an example, if we were to migrate a Discussion database from Notes to LDC Via, you would end up with three collections: MainTopic, Response and ResponseToResponse. There is nothing to stop documents in the same collection having different fields on them, but when we maintain meta data at a collection level we assume that all documents in the same collection could have the same fields on them.

## Get All Collections in a Database
Given a database name, this method will return a list of all collections in the database along with a count of documents in each collection.

The counts of the documents have document level security applied to them, so if there are 100 documents in the collection but the user can see only 10, then the count will be 10.

```java
/**
 * Gets a list of collections for the given database
 * Each element contains two properties: collection and count. Count is relative to the api key used to get the collection list
 * @param dbname
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
@SuppressWarnings("unchecked")
public ArrayList getCollections(String dbname) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/collections/" + dbname);

	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	ArrayList list = (ArrayList) JsonParser.fromJson(factory, responseBody);
	Collections.sort(list, new CollectionComparator());
	return list;
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
var root = 'https://ldcvia.com';
var apikey = 'MYSECRETAPIKEY';
$.ajax({
  dataType: 'json',
  type: 'GET',
  url: root + '/1.0/collections/' + dbname,
  headers: {
    'apikey': apikey
  },
  success: function(res) {
    console.log(res);
  }
})
```
> The above command returns JSON structured like this:

```json
[
  {
    "collection":"Response",
    "count":5
  },
  {
    "collection":"ResponseToResponse",
    "count":7  
  },
  {
    "collection":"MainTopic",
    "count":1
  }
]
```

### HTTP Request

`GET http://ldcvia.com/1.0/collections/:database`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service

## Get All Documents In a Collection

Description

```java
/**
 * Get a list of documents from a collection
 * Document level security applies
 * @param dbname
 * @param collection
 * @param position
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getDocuments(String dbname, String collection, int position) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/collections/" + dbname + "/" + collection + "?start=" + position);

	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);
	return json.getAsArray("data");
}
```

```javascript
var root = 'https://ldcvia.com';
var apikey = 'MYSECRETAPIKEY';
$.ajax({
  dataType: 'json',
  type: 'GET',
  url: root + '/1.0/collections/' + dbname + '/' + collectionname,
  headers: {
    'apikey': apikey
  },
  success: function(res) {
    console.log(res);
  }
})
```

> The above returns JSON structured like this:

```json
{
  "count":1,
  "data":[
    {
      "_id":"53c8cf7983217c4dd0a5580b",
      "Title":"This is the title",
      "Body":"LDC Via frees your Domino data to be used in other applications or to\r\nallow the sunsetting of your Domino infrastructure without losing the data\r\nand security that you have grown used to.\r\n\r\n(See attached file: API.xlsx)",
      "Body__parsed":"LDC Via frees your Domino data to be used in other applications or to\r\nallow the sunsetting of your Domino infrastructure without losing the data\r\nand security that you have grown used to.\r\n\r\n(See attached file: API.xlsx)",
      "readers":[ "CN=Matt White/O=Exhilarate", "CN=Fred Bloggs/O=FCL" ],
      "__unid":"C56DB3F14258431380257D190026303A",
      "__noteid":"10F2",
      "__created":"2014-07-18T06:57:07Z",
      "__modified":"2014-07-18T07:21:31Z",
      "__authors":"CN=Matt White/O=Exhilarate",
      "__form":"MainTopic",
      "_files":[ "API.xlsx" ]
    }
  ]
}
```

### HTTP Request
`GET https://ldcvia.com/1.0/collections/:database/:collectionname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service
:collectionname | The name of the collection to get documents from

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
count | 30 | The number of documents to get data for.
start | 0 | The starting position in the view, use this to page through documents

### Response JSON

Property | Description
-------- | -----------
count | the total count of documents in the collection that the current user can see
data | an array of document objects. the size of this array will not exceed the count URL parameter even if there are more documents in the collection. You will need to page through the data to get it all.
_id | internal unique reference id
rich text fields | when accessed via a collection all formatting is removed and a plain text representation of the content is returned. For full access to the rich text load the relevant document. Rich Text fields always have a second "__parsed" version of the field that can be used for searching purposes, this allows binary data to be stored in the primary rich text field
system fields | fields prefixed with __ are system fields that relate to your original Domino data. If the document has file attachments associated with it, the names of the files can be found in the field _files


## Delete entire collection

To delete a collection, use this method. You must be a super user to perform this operation, or you will receive a 401 error.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get a list of databases that the current user has access to
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void deleteCollection(String dbname, String collection) throws ClientProtocolException, IOException, JsonException{
	deleteURL("/1.0/document/" + dbname + "/" + collection);
}

/**
 * Helper method to delete a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String deleteURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpDelete httpdelete = new HttpDelete(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'DELETE',
  headers: { 'apikey': apikey },
  url: '/1.0/collections/' + database + '/' + collection,
  success: function(res){
    getDBCollections(database);
  },
  error: function(xhr, status, error){
    if (xhr.status == 401){
      alert("You do not have the rights to delete the collection");
    }else{
      alert(status + '\n' + error);
    }
  }
})

```

> The above returns JSON structured like this:

```json
{
  "result": "ok"
}
```

### HTTP Request
`DELETE https://ldcvia.com/1.0/collections/:database/:collectionname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service
:collectionname | The name of the collection to delete

## Search in a collection

```
/*
Example queries
Search for documents where the field Body contains test OR the field From equals fred@ldcvia.com
*/
```
```json
{
  "filters": [{
    "operator": "contains",
    "field": "Body",
    "value": "test"
  },
  {
    "operator": "equals",
    "field": "From",
    "value": "fred@ldcvia.com"
  }]
}
```
```
/*
Search for documents created on or after 1st Jan 2015 and on or before 31st Jan 2015 (remember to set ...&join=and on the URL)
*/
```
```
{
  "filters": [
  {
    "operator": "$gte",
    "field": "__created",
    "value": "2015-01-01T00:00:00"
  },
  {
    "operator": "$lte",
    "field": "__created",
    "value": "2015-01-31T23:59:59"
  }
  ]
}
```

To perform a search against a collection, you can submit queries to be run against one or more fields.

Search queries are built up using an array of JSON objects. You can search for exact matches in a field, fields that contain text, or date and number ranges. You can add as many parameters to a search as are required to get the set of documents that you need, and then use the URL parameters count and start to page through the results. In this way you can effectively create the equivalent of Notes views of data.

Keywords that you can use to search for data include:

Operator | Function
------- | --------
contains | used to search a field to see if it contains the value being searched for
equals | used to find a field that is an exact match for the value being searched for
$gte | used when searching for dates and numbers greater than or equal to the value entered. For dates the full [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) should be used
$lte | used when searching for dates and numbers less than or equal to the value entered. For dates the full [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) should be used

Examples of different search JSON objects can be seen to the right of this page.

When you enter multiple criteria, they are applied together with an OR style join by default, change this to AND using the URL parameter "...&join=and".

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Search against a field
 *  
 * @param dbname
 * @param collection
 * @param fieldname
 * @param query
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray searchField(String dbname, String collection, String fieldname, String query) throws ClientProtocolException, IOException, JsonException{
	String responseBody = postURL("/1.0/search/" + dbname + "/" + collection, "{\"filters\": [{\"operator\": \"contains\", \"field\": \"" + fieldname + "\", \"value\": \"" + query + "\"}]}");
	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

	return json.getAsArray("data");
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPost httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'POST',
  headers: {
    'apikey': apikey
  },
  data: {
    "filters": [{
      "operator": "contains",
      "field": "FieldToSearch",
      "value": query
    },
    {
      "operator": "equals",
      "field": "From",
      "value": query
    }]
  },
  url: '/1.0/search/' + dbname + "/" + collectionname + "?count=10&start=" + start,
  success: function(res) {
    //Do something
  }
})
```

> The above returns JSON structured like this:

```json
{
  "count":1,
  "data":[
    {
      "_id":"53c8cf7983217c4dd0a5580b",
      "Title":"This is the title",
      "Body":"NSF2MongoDB frees your Domino data to be used in other applications or to\r\nallow the sunsetting of your Domino infrastructure without losing the data\r\nand security that you have grown used to.\r\n\r\n(See attached file: API.xlsx)",
      "readers":[
        "CN=Matt White/O=Exhilarate",
        "CN=Fred Bloggs/O=FCL"
      ],
      "__unid":"C56DB3F14258431380257D190026303A",
      "__noteid":"10F2",
      "__created":"2014-07-18T06:57:07Z",
      "__modified":"2014-07-18T07:21:31Z",
      "__authors":"CN=Matt White/O=Exhilarate",
      "__form":"MainTopic",
      "_files":[
        "API.xlsx"
      ]
    }
  ]
}
```

### HTTP Request
`POST https://ldcvia.com/1.0/search/:database/:collectionname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service
:collectionname | The name of the collection to search in

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
count | 30 | The number of documents to get data for.
start | 0 | The starting position in the view, use this to page through documents
join | or | If you are applying multiple queries in a single search, the default will be to join them with an OR operator. Use this parameter to change the join to AND by setting &join=and in the URL

### Response JSON

Property | Description
-------- | -----------
count | the total count of documents in the collection that the current user can see and that match the search criteria
data | an array of document objects. the size of this array will not exceed the count URL parameter even if there are more documents in the collection. You will need to page through the data to get it all.
_id | internal unique reference id
rich text fields | when accessed via a collection all formatting is removed and a plain text representation of the content is returned. For full access to the rich text load the relevant document. Rich Text fields always have a second "__parsed" version of the field that can be used for searching purposes, this allows binary data to be stored in the primary rich text field
system fields | fields prefixed with __ are system fields that relate to your original Domino data. If the document has file attachments associated with it, the names of the files can be found in the field _files




# Views

A view is a saved filter that can be used to provide a quick way of accessing a subset of data. Think of it as a saved search. The query property of a view can be used to search in a collection

## Get all views in a database
Given a database name, this method will return a list of all views in the database.

```java
/**
 * Gets a list of views for the given database
 *
 * @param dbname
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
@SuppressWarnings("unchecked")
public ArrayList getViews(String dbname) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/views/" + dbname);

	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	ArrayList list = (ArrayList) JsonParser.fromJson(factory, responseBody);
	Collections.sort(list, new CollectionComparator());
	return list;
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
var root = 'https://ldcvia.com';
var apikey = 'MYSECRETAPIKEY';
$.ajax({
  dataType: 'json',
  type: 'GET',
  url: root + '/1.0/views/' + dbname,
  headers: {
    'apikey': apikey
  },
  success: function(res) {
    console.log(res);
  }
})
```
> The above command returns JSON structured like this:

```json
[
  {
    "query" : "{\"filters\":[{\"operator\":\"contains\",\"field\":\"Categories\",\"value\":\"API\"}]}",
    "title" : "API Documents",
    "collname" : "MainTopic",
    "name" : "API-Documents",
    "dbname" : "dev-londc-com-demos-discussion-nsf",
    "createdAt" : "2015-06-03T10:34:46.037Z",
    "style" : "or",
    "__v" : 0
  }
]
```

### HTTP Request

`GET http://ldcvia.com/1.0/views/:database`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service

## Get a view in a database
Given a database name and a view, this method will return the details of the view.

```java
/**
 * Gets a view for the given database
 *
 * @param dbname
 * @param viewname
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
@SuppressWarnings("unchecked")
public ArrayList getViews(String dbname, String viewname) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/views/" + dbname + "/" + viewname);

	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	ArrayList list = (ArrayList) JsonParser.fromJson(factory, responseBody);
	Collections.sort(list, new CollectionComparator());
	return list;
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
var root = 'https://ldcvia.com';
var apikey = 'MYSECRETAPIKEY';
$.ajax({
  dataType: 'json',
  type: 'GET',
  url: root + '/1.0/views/' + dbname + '/' + viewname,
  headers: {
    'apikey': apikey
  },
  success: function(res) {
    console.log(res);
  }
})
```
> The above command returns JSON structured like this:

```json
{
  "query" : "{\"filters\":[{\"operator\":\"contains\",\"field\":\"Categories\",\"value\":\"API\"}]}",
  "title" : "API Documents",
  "collname" : "MainTopic",
  "name" : "API-Documents",
  "dbname" : "dev-londc-com-demos-discussion-nsf",
  "createdAt" : "2015-06-03T10:34:46.037Z",
  "style" : "or",
  "__v" : 0
}
```

### HTTP Request

`GET http://ldcvia.com/1.0/views/:database/:view`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service
:view | This is the unique name of the view to read configuration from


## Add or update a view
Store the configuration of a view

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;
import java.util.Date;

/**
 * Create a new view
 *  
 * @param dbname
 * @param collection
 * @param viewname
 * @param title
 * @param style
 * @param query
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void createNewDocument(String dbname, String collection, String viewname, String title, String style, String query) throws ClientProtocolException, IOException, JsonException{
  Date date = new Date();
	putURL("/1.0/views/" + dbname + "/" + viewname "{\"title\": \"" + title + "\", \"style\": \"" + style + "\", \"query\": \"" + query + "\"}");
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String putURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPut httpput = new HttpPust(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
var saveNewView = function() {
  //Start building the document data
  var data = {};
  data.collname = $("#collname").val();
  data.title = viewtitle;
  data.style = $("#querystyle").val();
  var query = {"filters": []};

  var rows = $("#viewtable tbody tr");
  for (var i=0; i<rows.length; i++){
    var fieldname = $("#viewtable_fieldname_" + (i + 1)).val();
    var comparetype = $("#viewtable_comparetype_" + (i + 1)).val();
    var comparevalue = $("#viewtable_comparevalue_" + (i + 1)).val();
    query.filters.push({'operator': comparetype, 'field': fieldname, 'value': comparevalue});
  }
  data.query = JSON.stringify(query);

  $.ajax({
    dataType: 'json',
    type: 'POST',
    headers: {
      'apikey': apikey
    },
    data: data,
    url: '/1.0/views/' + dbname + "/" + viewname,
    complete: function(res) {
      //Do something
    }
  });

}
```

> If the view is inserted correctly, the above returns a 200 success code, otherwise you will receive an error

### HTTP Request
`POST https://ldcvia.com/1.0/views/:database/:viewname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service
:viewname | The name of the view to store

## Delete a view

To delete a view, use this method.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Delete a view from a database
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void deleteDocument(String dbname, String viewname) throws ClientProtocolException, IOException, JsonException{
	deleteURL("/1.0/document/" + dbname + "/" + viewname);
}

/**
 * Helper method to delete a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String deleteURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpDelete httpdelete = new HttpDelete(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'DELETE',
  headers: { 'apikey': apikey },
  url: '/1.0/document/' + database + '/' + viewname,
  success: function(res){
    //Do something
  },
  error: function(xhr, status, error){
    if (xhr.status == 401){
      alert("You do not have the rights to delete the view");
    }else{
      alert(status + '\n' + error);
    }
  }
})

```

> The above returns JSON structured like this:

```json
'ok'
```

### HTTP Request
`DELETE https://ldcvia.com/1.0/views/:database/:viewname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service
:viewname | The name of the view to delete




# Documents

A document is a group of fields that are related to each other. Not all documents the same, but it is a fair assumption that all documents in the same collection will have the same group of fields on them.

## Get a document

To get the full detail for a document, use this method.

```java
/**
 * Get full detail for an individual document
 * @param dbname
 * @param collection
 * @param unid
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaObject getDocument(String dbname, String collection, String unid) throws ClientProtocolException, IOException, JsonException {
	String responseBody = loadURL("/1.0/document/" + dbname + "/" + collection + "/" + unid);

	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);
	return json;
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/document/' + dbname + "/" + collectionname + "/" + unid,
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
  "_id":"53c8cf7783217c4dd0a557f6",
  "Formname":"Response",
  "ThreadSort":" 201218/062011:17:20 771AB2C8B80E229980257A210038850A",
  "ThreadIndent":". . ",
  "From":"CN=Matt White/O=Exhilarate",
  "ParentForm":"Response",
  "ParentSubject":"Response",
  "Categories":"Sales",
  "Body":{
    "type":"multipart",
    "content":[
      {
        "contentType":"multipart/alternative; Boundary=\"0__=0FBBF78ADFB9AAF98f9e8a93df938690918c0FBBF78ADFB9AAF9\"",
"contentDisposition":"inline"
      },
      {
        "contentType":"text/plain; charset=US-ASCII",
        "data":"This looks good to me - we need to make sure that the right Project Manager\r\nis assigned to this project",
        "boundary":"--0__=0FBBF78ADFB9AAF98f9e8a93df938690918c0FBBF78ADFB9AAF9"
      },
      {
        "contentType":"text/html; charset=US-ASCII",
        "contentDisposition":"inline",
        "data":"<html><body><font size=\"1\" face=\"sans-serif\">This looks good to me - we need to make sure that the right Project Manager is assigned to this project </font></body></html>",
        "boundary":"--0__=0FBBF78ADFB9AAF98f9e8a93df938690918c0FBBF78ADFB9AAF9"
      }
    ]
  },
  "Body__parsed":"<html><body><font size=\"1\" face=\"sans-serif\">This looks good to me - we need to make sure that the right Project Manager is assigned to this project </font></body></html>",
  "Subject":"Looks good to me",
  "__href":"http://dev.londc.com:80/demos/Discussion.nsf/api/data/documents/unid/FC7D00934676A6B580257D1900278BAA",
  "__unid":"FC7D00934676A6B580257D1900278BAA",
  "__noteid":"114E",
  "__parentid":"E2445C89357BB15080257D1900278BA9",
  "__created":"2014-07-18T07:11:56Z",
  "__modified":"2014-07-18T07:13:19Z",
  "__authors":  [ "CN=Matt White/O=Exhilarate", "CN=Matt White/O=Exhilarate" ],
  "__form":"Response",
  "_files": [ "api.xls" ]
}
```

### HTTP Request
`GET https://ldcvia.com/1.0/document/:database/:collectionname/:unid`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | The name of the collection that contains the document
:unid | The unique ID of the document to get (this maps to the __unid field, not the _id field)

## Insert a new document

To insert a new document, use the PUT method and send JSON data to the service. If a document with the :unid already exists in the collection, an error will be returned. Use the POST method to update existing documents.

If the collection name (or database name) do not currently exist then they will automatically be created. By this process you can effectively create a brand new database by simply inserting a new document. Bear in mind that you will need to set up security for the database once it has been created.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;
import java.util.Date;

/**
 * Create a new document
 *  
 * @param dbname
 * @param collection
 * @param subject
 * @param body
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void createNewDocument(String dbname, String collection, String subject, String body) throws ClientProtocolException, IOException, JsonException{
  Date date = new Date();
	putURL("/1.0/document/" + dbname + "/" + collection + "/" + date.getTime(), "{\"subject\": " + subject + ", \"body\": " + body + "}");
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String putURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPut httpput = new HttpPust(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
//Taken from our Discussion template
disc.saveNewMainTopic = function() {
  var fileInput = $("#fileupload");
  var file = fileInput[0].files[0];
  var reader = new FileReader();
  //Start building the document data
  var data = {};
  data.FormName = "MainTopic";
  data.__form = "MainTopic";
  data.Categories = $("#categories option:selected").val();
  data.From = username;
  data.AbbreviateFrom = username;
  data.Body = {
    "type": "multipart",
    "content": [{
      "contentType": "text/plain; charset=UTF-8",
      "data": CKEDITOR.instances.body.getData()
    }]
  };
  data.Subject = $("#subject").val();
  data.__created = new Date().toISOString();
  data.__modified = new Date().toISOString();

  if (file) {
    //Convert the file attachment to BASE64 string
    reader.onload = function(e) {
      data.Body.content.push({
        "contentType": file.type + "; name=\"" + file.name + "\"",
        "contentDisposition": "attachment; filename=\"" + file.name + "\"",
        "contentTransferEncoding": "base64",
        "data": reader.result.match(/,(.*)$/)[1]
      });
      disc.sendNewMainTopic(data);
    }
    reader.readAsDataURL(file);
  } else {
    disc.sendNewMainTopic(data);
  }
}
disc.sendNewMainTopic = function(data) {
  var unid = new Date().getTime();

  $.ajax({
    dataType: 'json',
    type: 'PUT',
    headers: {
      'apikey': apikey
    },
    data: data,
    url: '/1.0/document/' + dbname + "/" + data.FormName + "/" + unid,
    complete: function(res) {
      //Do something
    }
  });

}
```

> If the document is inserted correctly, the above returns a 200 success code, otherwise you will receive an error

### HTTP Request
`PUT https://ldcvia.com/1.0/document/:database/:collectionname/:unid`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | The name of the collection into which the document will be inserted
:unid | The unique identifier of the document to be inserted

## Update an existing document

When you want to update a document use this method. You only need to post the fields that you want to update. Those fields will overwrite matching fields in the document, or add them if they don't already exist. To remove a field set its value to null.

If the document does not exist then an error will be returned, in this case you should use the PUT method instead.


```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Update a document
 *
 * @param dbname
 * @param collection
 * @param unid
 * @param subject
 * @param body
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void updateDocument(String dbname, String collection, String unid, String subject, String body) throws ClientProtocolException, IOException, JsonException{
	postURL("/1.0/document/" + dbname + "/" + collection + "/" + unid, "{\"subject\": " + subject + ", \"body\": " + body + "}");
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPut httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
//Taken from our Discussion template
disc.saveMainTopic = function(unid) {
  var fileInput = $("#fileupload");
  var file = fileInput[0].files[0];
  var reader = new FileReader();
  //Start building the document data
  var data = {};
  data.FormName = "MainTopic";
  data.__form = "MainTopic";
  data.Categories = $("#categories option:selected").val();
  data.From = username;
  data.AbbreviateFrom = username;
  data.Body = {
    "type": "multipart",
    "content": [{
      "contentType": "text/plain; charset=UTF-8",
      "data": CKEDITOR.instances.body.getData()
    }]
  };
  data.Subject = $("#subject").val();

  if (file) {
    //Convert the file attachment to BASE64 string
    reader.onload = function(e) {
      data.Body.content.push({
        "contentType": file.type + "; name=\"" + file.name + "\"",
        "contentDisposition": "attachment; filename=\"" + file.name + "\"",
        "contentTransferEncoding": "base64",
        "data": reader.result.match(/,(.*)$/)[1]
      });
      disc.sendNewMainTopic(unid, data);
    }
    reader.readAsDataURL(file);
  } else {
    disc.sendMainTopic(unid, data);
  }
}
disc.sendMainTopic = function(unid, data) {

  $.ajax({
    dataType: 'json',
    type: 'POST',
    headers: {
      'apikey': apikey
    },
    data: data,
    url: '/1.0/document/' + dbname + "/" + data.FormName + "/" + unid,
    complete: function(res) {
      //Do something
    }
  });

}
```

> If the document is updated correctly, the above returns a 200 success code, otherwise you will receive an error

### HTTP Request
`POST https://ldcvia.com/1.0/document/:database/:collectionname/:unid`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | The name of the collection in which the document will be updated
:unid | The unique identifier of the document to be updated

## Delete a document

To delete a document, use this method. You must have the rights to update the document

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get a list of databases that the current user has access to
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void deleteDocument(String dbname, String collection, String unid) throws ClientProtocolException, IOException, JsonException{
	deleteURL("/1.0/document/" + dbname + "/" + collection + "/" + unid);
}

/**
 * Helper method to delete a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String deleteURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpDelete httpdelete = new HttpDelete(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'DELETE',
  headers: { 'apikey': apikey },
  url: '/1.0/document/' + database + '/' + collection + "/" + unid,
  success: function(res){
    //Do something
  },
  error: function(xhr, status, error){
    if (xhr.status == 401){
      alert("You do not have the rights to delete the document");
    }else{
      alert(status + '\n' + error);
    }
  }
})

```

> The above returns JSON structured like this:

```json
{
  "result": "ok"
}
```

### HTTP Request
`DELETE https://ldcvia.com/1.0/document/:database/:collectionname/:unid`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service
:collectionname | The name of the collection to delete
:unid | The unid of the document to delete

## Reserved Field Names

We do have several reserved field names in LDC Via that you should avoid modifying (your changes will be ignored), though the fields can be useful when reading data (__unid in particular):

* __heirarchy
* __unid
* __form
* __created
* __modified
* _files
* fieldnames appended with the value '__parsed'
* __role
* __readerrole
* __authorrole
* __deleted
* _id

The field __parentid is a field with a specific meaning. If it exists on a document then it makes that document a response to another document within the same database. The only valid value for this field is the __unid of the immediate parent of this document.

# File Attachments

Given a database name, collection name, document id and attachment name, you can either download the attachment or delete it from the database. To insert new attachments, use the document PUT or POST methods.

## Get a File Attachment

```java
//TODO: We need sample code here
```

```javascript
window.open("https://ldcvia.com/1.0/attachment/:database/:collectionname/:unid/:filename");
```

> If the file exists (and you are allowed to access it), then the file will be sent as a binary stream to the requestor. If the file does not exists (or you are not allowed to access it) then an error will be returned.

### HTTP Request
`GET https://ldcvia.com/1.0/attachment/:database/:collectionname/:unid/:filename`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service
:collectionname | The name of the collection to delete
:unid | The unid of the document to delete
:filename | The name of the file to access (can be retrieved from _files field on any document)

## Delete a file attachment

To delete a file attachment, use this method. You must have the rights to update the document to which the file is associated

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get a list of databases that the current user has access to
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void deleteAttachment(String dbname, String collection, String unid, String filename) throws ClientProtocolException, IOException, JsonException{
	deleteURL("/1.0/document/" + dbname + "/" + collection + "/" + unid + "/" + filename);
}

/**
 * Helper method to delete a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String deleteURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpDelete httpdelete = new HttpDelete(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'DELETE',
  headers: { 'apikey': apikey },
  url: '/1.0/collections/' + database + '/' + collection + "/" + unid + "/" + filename,
  success: function(res){
    //Do something
  },
  error: function(xhr, status, error){
    if (xhr.status == 401){
      alert("You do not have the rights to delete the filename");
    }else{
      alert(status + '\n' + error);
    }
  }
})

```

> The above returns JSON structured like this:

```json
{
  "result": "ok"
}
```

### HTTP Request
`DELETE https://ldcvia.com/1.0/attachment/:database/:collectionname/:unid/:filename`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service
:collectionname | The name of the collection to delete
:unid | The unid of the document to delete
:filename | The name of the file to delete (can be retrieved from _files field on any document)

# Meta Data

When data is added to the database, we maintain a description of the fields and data types in each collection.

You have the ability to read and update certain metadata details. An example of when you might want to do this is to update security: to mark a field as being readers or authors.

## Get Meta Data for a collection

To get a list of all fields that are in a collection, use this method.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get a list of databases that the current user has access to
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getMetaData(String dbname, String collection) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/metadata/" + dbname + "/" + collection);
	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

	return json.getAsArray("fields");
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/metadata/' + dbname + "/" + collectionname,
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
   "_id":"53c8cc790e76eee06aed49ba",
   "dbname":"dev-londc-com-demos-discussion-nsf",
   "collectionname":"MainTopic",
   "__v":1,
   "lastimported":"2014-07-18T07:40:49.632Z",
   "fields":[
      {
         "fieldname":"From",
         "_id":"53c8cf810e76eee06aed4ad7",
         "fieldtype":"Names"
      },
      {
         "fieldname":"AbbreviateFrom",
         "_id":"53c8cf810e76eee06aed4ad6",
         "fieldtype":"String"
      },
      {
         "fieldname":"Current_Status",
         "_id":"53c8cf810e76eee06aed4ac8",
         "fieldtype":"Number"
      },
      {
         "fieldname":"FilebyDate",
         "_id":"53c8cf810e76eee06aed4ac6",
         "fieldtype":"Date"
      },
      {
         "fieldname":"Editors",
         "_id":"53c8cf810e76eee06aed4abf",
         "fieldtype":"Authors"
      },
      {
         "fieldname":"readers",
         "_id":"53c8cf810e76eee06aed4aa2",
         "fieldtype":"Readers"
      }
   ]
}
```

### HTTP Request
`GET https://ldcvia.com/1.0/metadata/:database/:collectionname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | The name of the collection to get meta data for

## Update Meta Data for a Collection

You can update meta data for a collection with this method. The most common use for this will be to enable and disable readers and authors fields, thus controlling document level security.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Update Meta Data Field
 *  
 * @param dbname
 * @dbname collection
 * @param fieldname
 * @param fieldtype
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void updateMetaDataField(String dbname, String collection, String fieldname, String fieldtype) throws ClientProtocolException, IOException, JsonException{
	String responseBody = postURL("/1.0/metdata/" + dbname + "/" + collection + ", "{\"fields\": [{\"fieldname\": \"" + fieldname + "\", \"fieldtype\": \"" + fieldtype + "\"}]}");
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPost httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
var data = {
  "fields":[
    {
      "fieldname":"From",
      "fieldtype":"Names"
    }
  ]
};
$.ajax({
  dataType: 'json',
  type: 'POST',
  data: data,
  headers: {
    'apikey': apikey
  },
  url: '/1.0/metadata/' + dbname + "/" + collectionname,
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{"result": "ok"}
```

### HTTP Request
`POST https://ldcvia.com/1.0/metadata/:database/:collectionname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | The name of the collection to update meta data for

## Reset Meta Data for a Collection

When data is added to the database, we maintain a description of the fields and data types in each collection. It is possible for this meta data to get out of sync with the data or become corrupt. This method will reset the meta data.

Be aware that if you have set any readers and authors fields in the meta data that these will be reset and thus all document security will be disabled.

Because of this potential, you must be a super user or administrator to run this method.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Reset the meta data for a collection
 *  
 * @param dbname
 * @param collection
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void resetMetaData(String dbname, String collection) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/resetmetadata/" + dbname + "/" + collection);
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/resetmetadata/' + dbname + "/" + collectionname,
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{"result": "ok"}
```

### HTTP Request
`GET https://ldcvia.com/1.0/resetmetadata/:database/:collectionname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | The name of the collection that you want to reset meta data for. By default the meta data will be built using a sampling of the first 100 documents in the collection. If all documents have exactly the same fields on them, then this number can be reduced to improve performance. To change the number of documents sampled, add a URL parameter: "&count=n". Likewise, if all documents do not have the same fields on them, then you can increase the sample size using the same technique. Be aware that the larger the sample size, the longer the response will take.

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
count | 100 | The number of documents to sample for field names

# User Details

You can get either your own details of the details of a different user within your organisation. To get you own details omit the :useremail url parameter.

## Get your own user details

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get the current user's details
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public String getUserEmail() throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/userdetails");
	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

	return json.getAsString("email");
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/userdetails',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
  "notesnames":[
    {
      "notesname":"CN=Fred Bloggs/O=FCL"
    },
    {
      "notesname":"Fred Bloggs"
    },
    {
      "notesname":"DocEditors",
      "group": true
    }
  ],
  "apikey":"hwxsftXnd88KFq",
  "username":"Fred Bloggs",
  "email":"fred@fclonline.com",
  "admin":false,
  "superuser":false,
  "databases":[
    {
      "database":"dev-londc-com-demos-discussion-nsf",
      "_id":"53c8cc6e0e76eee06aed497b"
    },
    {
      "database":"dev-londc-com-demos-journal-nsf",
      "_id":"53cecd0819a5ac73b57964e5"
    }
  ]
}
```

### HTTP Request
`GET https://ldcvia.com/1.0/userdetails`

## Get other user's details

The get another user's details, use this method. If you are a super user or the same user as the email address, you will be able to get the API Key, otherwise that will not be returned.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get list of databases visible to another user
 *  
 * @param email
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getUserDatabases(String email) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/userdetails/" + email);
	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

	return json.getAsArray("databases");
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/userdetails/fred@bloggs.com',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
  "notesnames":[
    {
      "notesname":"CN=Fred Bloggs/O=FCL"
    },
    {
      "notesname":"Fred Bloggs"
    },
    {
      "notesname":"DocEditors",
      "group": true
    }
  ],
  "apikey":"hwxsftXnd88KFq",
  "username":"Fred Bloggs",
  "email":"fred@bloggs.com",
  "admin":false,
  "superuser":false,
  "databases":[
    {
      "database":"dev-londc-com-demos-discussion-nsf",
      "_id":"53c8cc6e0e76eee06aed497b"
    },
    {
      "database":"dev-londc-com-demos-journal-nsf",
      "_id":"53cecd0819a5ac73b57964e5"
    }
  ]
}
```

### HTTP Request
`GET https://ldcvia.com/1.0/userdetails/:email`

### URL Parameters

Parameter | Description
--------- | -----------
:email | The email address of the person to get

## Add New User

In addition to retrieving user details, you can also create users via the API. A POST to create users involves sending an organisation ID, and a collection of user objects.

Once the API has validated the request, for each user two objects will be created: a User and an Account (the two elements maintain a 1:1 relationship, with the Account controlling a user's ability to log in). In addition, all users created will be linked to the passed-in organisation.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Create a new user
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void createNewUser() throws ClientProtocolException, IOException, JsonException{
  String data = "{" +
   "\"organisation\": \"548598c6b283ccf00e5edf43\"," +
   "\"users\": [" +
   "{" +
   "\"email\": \"fbloggs@acme.com\"," +
   "\"firstname\": \"Fred\"," +
   "\"lastname\": \"Bloggs\"," +
   "\"notesnames\": [" +
   "{" +
   "\"notesname\": \"test01/acme\"" +
   "}," +
   "{" +
   "\"notesname\": \"user01/acme\"" +
   "}" +
   "]" +
   "}," +
   "{" +
   "\"email\": \"jh@acme.com\"," +
   "\"firstname\": \"Jeremy\"," +
   "\"lastname\": \"Hardy\"" +
   "}" +
   "]" +
  "}";
	postURL("/1.0/users", data);
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPut httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
var data = {
 "organisation": "548598c6b283ccf00e5edf43",
 "users": [
 {
 "email": "fbloggs@acme.com",
 "firstname": "Fred",
 "lastname": "Bloggs",
 "notesnames": [
 {
 "notesname": "test01/acme"
 },
 {
 "notesname": "user01/acme"
 }
 ]
 },
 {
 "email": "jh@acme.com",
 "firstname": "Jeremy",
 "lastname": "Hardy"
 }
 ]
};
$.ajax({
  dataType: 'json',
  type: 'POST',
  data: data,
  headers: {
    'apikey': apikey
  },
  url: '/1.0/users',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
  "result": "ok"
}
```

### HTTP Request
`POST https://ldcvia.com/1.0/users`


## Update Users details

The update another user's details, use this method. You must be a super user to use this method.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Update a user
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void updateUser(String email) throws ClientProtocolException, IOException, JsonException{
  String data = "{\r\n  \"notesnames\":\r\n    [\r\n      {\"notesname\": \"CN=Fred Blogs/O=Londc\"},\r\n      {\"notesname\": \"Fred Blogs/Londc\"},\r\n      {\"notesname\": \"Fred Blogs\"},\r\n      {\"notesname\": \"*/Londc\"},\r\n    ]\r\n}";
	postURL("/1.0/userdetails/" + email, data);
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPut httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
var data = {
  "notesnames":
    [
      {"notesname": "CN=Fred Blogs/O=Londc"},
      {"notesname": "Fred Blogs/Londc"},
      {"notesname": "Fred Blogs"},
      {"notesname": "*/Londc"},
    ]
};
$.ajax({
  dataType: 'json',
  type: 'POST',
  data: data,
  headers: {
    'apikey': apikey
  },
  url: '/1.0/userdetails/fred@bloggs.com',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
  "result": "ok"
}
```

### HTTP Request
`POST https://ldcvia.com/1.0/userdetails/:email`

### URL Parameters

Parameter | Description
--------- | -----------
:email | The email address of the person to update

## Delete User

This method is available for super users to remove another user (you cannot delete yourself!)

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Delete a user
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void deleteUser(String email) throws ClientProtocolException, IOException, JsonException{
	deleteURL("/1.0/userdetails/" + email);
}

/**
 * Helper method to delete a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String deleteURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpDelete httpdelete = new HttpDelete(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'DELETE',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/userdetails/fred@bloggs.com',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{"result": "ok"}
```

### HTTP Request
`DELETE https://ldcvia.com/1.0/userdetails/:email`

### URL Parameters

Parameter | Description
--------- | -----------
:email | the email of the person to delete

# Access Control

## Get list of groups in organisation
```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get list of groups in organisation
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getGroups() throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/groups");
	JsonJavaFactory factory = JsonJavaFactory.instanceEx;
	JsonJavaArray json = (JsonJavaArray) JsonParser.fromJson(factory, responseBody);

	return json;
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/groups',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
["Group 1", "Group 2"]
```

### HTTP Request
`GET https://ldcvia.com/1.0/groups`


## Add multiple users to group
```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Add multiple users to a group
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void addUsersToGroup(String group, String[] users) throws ClientProtocolException, IOException, JsonException{
  var data = "{\"groupname\": \"" + group"\", \"emails\": [";
  for (int i=0; i<users.length; i++){
    if (i > 0){
      data += ", ";
    }
    data += "\"" + users[i] + "\"";
  }
  data += "]}"
	postURL("/1.0/groups", data);
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPut httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
var data = {
"groupname":"TestGroup",
"emails": ["fred@bloggs.com", "joe@blow.com"]
};
$.ajax({
  dataType: 'json',
  type: 'POST',
  data: data,
  headers: {
    'apikey': apikey
  },
  url: '/1.0/groups',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{"result": "ok"}
```

### HTTP Request
`POST https://ldcvia.com/1.0/groups`

## Add single user to group
```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Add user to a group
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void addUserToGroup(String group, String user) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/groups/" + user + "/" + group);
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/groups/fred@bloggs.com/Group1',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns 200 Success if the action worked

### HTTP Request
`GET https://ldcvia.com/1.0/groups/:email/:groupname`

### URL Parameters

Parameter | Description
--------- | -----------
:email | the email of the user to add to the group
:groupname | the groupname to add the user to

## Remove user from group
```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Remove user from a group
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void removeUserFromGroup(String group, String user) throws ClientProtocolException, IOException, JsonException{
	deleteURL("/1.0/groups/" + user + "/" + group);
}

/**
 * Helper method to delete a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String deleteURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpDelete httpdelete = new HttpDelete(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'DELETE',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/groups/fred@bloggs.com/Group1',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns 200 Success if the action worked

### HTTP Request
`DELETE https://ldcvia.com/1.0/groups/:email/:groupname`

### URL Parameters

Parameter | Description
--------- | -----------
:email | the email of the user to remove from the group
:groupname | the groupname to remove the user from

## Get Members of Group
```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get Members Of a Group
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getGroupMembers(String group) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/groups/" + group);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaArray json = (JsonJavaArray) JsonParser.fromJson(factory, responseBody);

  return json;
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/groups/Group1',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns an array of user emails

```json
["fred@bloggs.com", "joe@smith.com"]
```

### HTTP Request
`GET https://ldcvia.com/1.0/groups/:groupname`

### URL Parameters

Parameter | Description
--------- | -----------
:groupname | the groupname to get member list of

## Remove Group
```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Remove a group
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void removeGroup(String group) throws ClientProtocolException, IOException, JsonException{
	deleteURL("/1.0/groups/" + group);
}

/**
 * Helper method to delete a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String deleteURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpDelete httpdelete = new HttpDelete(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'DELETE',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/groups/Group1',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns 200 Success if the action worked

### HTTP Request
`DELETE https://ldcvia.com/1.0/groups/:groupname`

### URL Parameters

Parameter | Description
--------- | -----------
:groupname | the groupname to delete

## List all users in organisation
```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get A List of All Users in Organisation
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getAllUsers() throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/users");
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaArray json = (JsonJavaArray) JsonParser.fromJson(factory, responseBody);

  return json;
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/users',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns an array of emails

```json
["fred@bloggs.com", "joe@smith.com"]
```

### HTTP Request
`GET https://ldcvia.com/1.0/users`

## Add user to database
```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Add User To Database
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray addUserToDatabase(String email, String dbname) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/userdetails/" + email + "/" + dbname);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaArray json = (JsonJavaArray) JsonParser.fromJson(factory, responseBody);

  return json;
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/userdetails/joe@bloggs.com/dev-londc-demos-discussion-nsf',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns 200 Success if the operation completed successfully

### HTTP Request
`GET https://ldcvia.com/1.0/userdetails/:email/:database`

### URL Parameters

Parameter | Description
--------- | -----------
:email | the email of the user to give access to the database
:database | the database to give the user access to

## Remove user from database
```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Remove user from database
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public void removeUserFromDatabase(String dbname, String email) throws ClientProtocolException, IOException, JsonException{
	deleteURL("/1.0/userdetails/" + email + "/" + dbname);
}

/**
 * Helper method to delete a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String deleteURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpDelete httpdelete = new HttpDelete(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'DELETE',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/userdetails/joe@bloggs.com/dev-londc-demos-discussion-nsf',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns 200 Success if the operation completed successfully

### HTTP Request
`DELETE https://ldcvia.com/1.0/userdetails/:email/:database`

### URL Parameters

Parameter | Description
--------- | -----------
:email | the email of the user to remove access to the database
:database | the database to remove the user access to

# Utilities

We provide several extra services that act as utilities to make developing applications easier.

## Get List of Distinct Values

Similar in concept to an @DBColumn in Notes, this will return a unique list of values from a field in a collection

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get A List of Distinct values from a field in a collection
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getList(String dbname, String collection, String fieldname) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/list/" + dbname + "/" + collection + "/" + fieldname);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaArray json = (JsonJavaArray) JsonParser.fromJson(factory, responseBody);

  return json;
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/list/dev-londc-com-demos-discussion-nsf/MainTopic/Subject',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns an array of items

```json
["value one", "value two"]
```

### HTTP Request
`GET https://ldcvia.com/1.0/list/:database/:collectionname/:fieldname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | the database to get the value list from
:collectionname | the collection to get the value list from
:fieldname | the field to get value list from

## Responses

Given a database, collection name and document id, this method will return to you a list of collection names and document ids that are responses to this document.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get A List of Response Documents to a Document
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getResponses(String dbname, String collection, String unid) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/responses/" + dbname + "/" + collection + "/" + unid);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaArray json = (JsonJavaArray) JsonParser.fromJson(factory, responseBody);

  return json;
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/responses/dev-londc-com-demos-discussion-nsf/MainTopic/12345678',
  success: function(res) {
    //Do Something
  }
})
```

> The response object is similar to the standard collections response

```json
[
  {
    "_id": "5411514d8c1fd625dc2ab8c9",
    "__unid": "A4D2533D7A91573E80257D1900276F8D",
    "__parentid": "BAB78224CA0B0FEC80257D1900276F91",
    "__form": "Response"
  },
  {
    "_id": "5411514e8c1fd625dc2ab8d3",
    "__unid": "3411614A3E45C7FB80257D1900276F92",
    "__parentid": "BAB78224CA0B0FEC80257D1900276F91",
    "__form": "ResponseToResponse"
  },
  {
    "_id": "5411514d8c1fd625dc2ab8c3",
    "__unid": "8D58E7A1EFD6899C80257D1900276F8E",
    "__parentid": "A4D2533D7A91573E80257D1900276F8D",
    "__form": "ResponseToResponse"
  }
]
```

### HTTP Request
`GET https://ldcvia.com/1.0/responses/:database/:collectionname/:unid`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | the name of the collection that contains the document
:unid | the document to get a list of responses for

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
:expand | false | If set to true you will be returned an array of documents instead of an array of UNIDs. This can affect performance

### Response Properties
Property | Description
-------- | -----------
_id | the internal reference for the document
__unid | the unid of the response document
__parentid | the parentid of the document, this may not be the same as the :unid parameter as this method returns response to responses
__form | the collection of the response document

## Export to PDF
Given a database, collection name and document id, this method will return PDF with all fields on the document.

```java
//TODO: Add Sample
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/pdf/dev-londc-com-demos-discussion-nsf/MainTopic/12345678',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns a binary stream of the PDF document

### HTTP Request
`GET https://ldcvia.com/1.0/pdf/:database/:collectionname/:unid`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | the name of the collection to get the document from
:unid | the unid of the document to export to PDF

## Export to Excel
Given a database and collection name, this method will return an Excel spreadsheet list of documents in the collection. The response will contain a list of documents from the collection, you can control how many documents and where in the collection to get them from using URL parameters.

The count of the documents have document level security applied to them, so if there are 100 documents in the collection but the user can see only 10, then the count will be 10.

```java
//TODO: Add Sample
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/excel/dev-londc-com-demos-discussion-nsf/MainTopic',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns a binary stream of the PDF document

### HTTP Request
`GET https://ldcvia.com/1.0/excel/:database/:collectionname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | the name of the collection to export

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
count | 500 | The number of documents to get data for.
start | 0 | The starting position in the view


## DocLinks
Given a database, collection, document and field name, this service will parse the field (it must be a rich text field) and return details of any doclinks that are contained within.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get the details of any doclinks in a rich text field migrated from Domino
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getDocLinks(String dbname, String collection, String unid, String fieldname) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/doclink/" + dbname + "/" + collection + "/" + unid + "/" + fieldname);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaArray json = (JsonJavaArray) JsonParser.fromJson(factory, responseBody);

  return json;
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/doclink/dev-londc-com-demos-discussion-nsf/MainTopic/12345678012345456',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns a JSON object with the parsed doc links (or an empty array if no doc links were found). There are three possible formats, for database links, view links and document links. If the document link is linking to a document in the same database the object will contain the notes:// url and also the apiurl to get the related document. If the document is in a different database then the object will just contain the notes url.

```json
[
  {
    "notesurl": "Notes://Mixed2/80257AC50035BEE2/9B03730C11B24C94852565E20060BED0/BC9F435105F5F9A880257C3100401F50",
    "type": "doclink",
    "documentid": "BC9F435105F5F9A880257C3100401F50",
    "apiurl": "/1.0/document/dev-londc-com-teamstudio-widgets-teamroom-nsf/Response/BC9F435105F5F9A880257C3100401F50"
  },
  {
    "notesurl": "Notes://Mixed2/80257AC50035BEE2/9B03730C11B24C94852565E20060BED0",
    "type": "viewlink"
  },
  {
    "notesurl": "Notes://Mixed2/80257AC50035BEE2",
    "type": "dblink"
  }
]
```

### HTTP Request
`GET https://ldcvia.com/1.0/doclink/:database/:collectionname/:unid/:fieldname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | the name of the collection to export
:unid | The unid of the document
:fieldname | The fieldname to parse for doclinks


# Audit Trail
Every single operation against our API is recorded in our logs. We provide a set of APIs to access those logs for further analysis.

## Get All Logs
When you want to get a count of activity for your entire environment, use the /activity service. If you want to get detailed logs of activity, then you will need to provide either a database, a database and collection or a database, collection and document id. In all cases, if you issue a GET request then you will be returned all records for that scope.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get A List of Response Documents to a Document
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public int getDBActivity(String dbname) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/activity");
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

  return json.getInt(dbname);
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/activity',
  success: function(res) {
    //Do Something
  }
})
```

> The response object is an object with of counts of logs per database

```json
{
"testdb":1196,
"192-168-0-13-unpsampler-nsf":39,
"dev-londc-com-demos-journal-nsf":43
}
```

### HTTP Request
`GET https://ldcvia.com/1.0/activity`

## Search Logs
If you want to further filter the logs to a specific date range or only contain certain messages, for example, then all of the above methods can also be used with POST requests. The responses will be the same format as above. To restrict the logs you can add all of some of the following criteria in a JSON post.

When you want to get a count of activity for your entire environment, use the /activity service. If you want to get detailed logs of activity, then you will need to provide either a database, a database and collection or a database, collection and document id. In all cases, if you issue a GET request then you will be returned all records for that scope.

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Search Activity Logs
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public int searchLogs(String dbname) throws ClientProtocolException, IOException, JsonException{
  String data = "{" +
    "\"startdate\": {\"year\": 2014, \"month\": 6, \"day\": 1}," +
    "\"enddate\": {\"year\": 2014, \"month\": 7, \"day\": 1}," +
    "\"filters\": [" +
    "  {\"operator\": \"equals\", \"field\": \"level\", \"value\": \"info\"}" +
    "]" +
  "}";
	postURL("/1.0/activity", data);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

  return json.getInt(dbname);
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPut httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
var data = {
  "startdate": {"year": 2014, "month": 6, "day": 1},
  "enddate": {"year": 2014, "month": 7, "day": 1},
  "filters": [
    {"operator": "equals", "field": "level", "value": "info"}
  ]
}
$.ajax({
  dataType: 'json',
  type: 'POST',
  data: data,
  headers: {
    'apikey': apikey
  },
  url: '/1.0/activity',
  success: function(res) {
    //Do Something
  }
})
```

> The response object is an object with of counts of logs per database

```json
{
"testdb":200,
"192-168-0-13-unpsampler-nsf":10,
"dev-londc-com-demos-journal-nsf":0
}
```

### HTTP Request
`POST https://ldcvia.com/1.0/activity`

## Get Single Database Logs

To filter logs at a database level, add the database name to the URL structure

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get The most recent 30 logs for a database
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getDBActivity(String dbname) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/activity/" + dbname);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

  return json.getArray(docs);
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/activity/dev-londc-com-demos-discussion-nsf?start=0&count=2',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
"count":3901,
"docs":[
{
"_id":"53f22101edf3aa08da052184",
"source":"api.v1.js",
"db":"dev-londc-com-demos-discussion-nsf",
"collection":"MainTopic",
"timestamp":"2014-08-18T15:51:29.205Z",
"level":"info",
"message":"Get Collection",
"user":"support@londc.com"
},
{
"_id":"53f22101edf3aa08da052189",
"source":"api.v1.js",
"db":"dev-londc-com-demos-discussion-nsf",
"collection":"MainTopic",
"timestamp":"2014-08-18T15:51:29.307Z",
"level":"info",
"message":"Get Collection",
"user":"support@londc.com"
}
]}
```

### HTTP Request
`GET https://ldcvia.com/1.0/activity/:database`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
count | 30 | The number of documents to get data for.
start | 0 | the position in the results to start at


## Search Single Database Logs

To further filter logs at a database level, add the database name to the URL structure and then POST whatever filters are required

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Search Activity Logs
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray searchLogs(String dbname) throws ClientProtocolException, IOException, JsonException{
  String data = "{" +
    "\"startdate\": {\"year\": 2014, \"month\": 6, \"day\": 1}," +
    "\"enddate\": {\"year\": 2014, \"month\": 7, \"day\": 1}," +
    "\"filters\": [" +
    "  {\"operator\": \"equals\", \"field\": \"level\", \"value\": \"info\"}" +
    "]" +
  "}";
	postURL("/1.0/activity/" + dbname, data);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

  return json.getArray("docs");
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPut httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
var data = {
  "startdate": {"year": 2014, "month": 6, "day": 1},
  "enddate": {"year": 2014, "month": 7, "day": 1},
  "filters": [
    {"operator": "equals", "field": "level", "value": "info"}
  ]
}
$.ajax({
  dataType: 'json',
  type: 'POST',
  data: data,
  headers: {
    'apikey': apikey
  },
  url: '/1.0/activity',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
"count":205,
"docs":[
{
"_id":"53f22101edf3aa08da052184",
"source":"api.v1.js",
"db":"dev-londc-com-demos-discussion-nsf",
"collection":"MainTopic",
"timestamp":"2014-06-18T15:51:29.205Z",
"level":"info",
"message":"Get Collection",
"user":"support@londc.com"
},
{
"_id":"53f22101edf3aa08da052189",
"source":"api.v1.js",
"db":"dev-londc-com-demos-discussion-nsf",
"collection":"MainTopic",
"timestamp":"2014-06-18T15:51:29.307Z",
"level":"info",
"message":"Get Collection",
"user":"support@londc.com"
}
]}
```

### HTTP Request
`GET https://ldcvia.com/1.0/activity/:database`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
count | 30 | The number of documents to get data for.
start | 0 | the position in the results to start at

## Get Single Collection logs

To filter logs at a collection level, add the database name and collection name to the URL structure

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get The most recent 30 logs for a collection
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getCollectionActivity(String dbname, String collection) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/activity/" + dbname + "/" + collection);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

  return json.getArray(docs);
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/activity/dev-londc-com-demos-discussion-nsf/MainTopic?start=0&count=2',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
"count":3901,
"docs":[
{
"_id":"53f22101edf3aa08da052184",
"source":"api.v1.js",
"db":"dev-londc-com-demos-discussion-nsf",
"collection":"MainTopic",
"timestamp":"2014-08-18T15:51:29.205Z",
"level":"info",
"message":"Get Collection",
"user":"support@londc.com"
},
{
"_id":"53f22101edf3aa08da052189",
"source":"api.v1.js",
"db":"dev-londc-com-demos-discussion-nsf",
"collection":"MainTopic",
"timestamp":"2014-08-18T15:51:29.307Z",
"level":"info",
"message":"Get Collection",
"user":"support@londc.com"
}
]}
```

### HTTP Request
`GET https://ldcvia.com/1.0/activity/:database/:collectionname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | The name of the collection to get data for

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
count | 30 | The number of documents to get data for.
start | 0 | the position in the results to start at

## Search Single Collection Logs

To further filter logs at a collection level, add the database name and collection name to the URL structure and then POST whatever filters are required

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Search Collection Activity Logs
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray searchCollectionLogs(String dbname, String collection) throws ClientProtocolException, IOException, JsonException{
  String data = "{" +
    "\"startdate\": {\"year\": 2014, \"month\": 6, \"day\": 1}," +
    "\"enddate\": {\"year\": 2014, \"month\": 7, \"day\": 1}," +
    "\"filters\": [" +
    "  {\"operator\": \"equals\", \"field\": \"level\", \"value\": \"info\"}" +
    "]" +
  "}";
	postURL("/1.0/activity/" + dbname + "/" + collection, data);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

  return json.getArray("docs");
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPut httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
var data = {
  "startdate": {"year": 2014, "month": 6, "day": 1},
  "enddate": {"year": 2014, "month": 7, "day": 1},
  "filters": [
    {"operator": "equals", "field": "level", "value": "info"}
  ]
}
$.ajax({
  dataType: 'json',
  type: 'POST',
  data: data,
  headers: {
    'apikey': apikey
  },
  url: '/1.0/activity/dev-londc-com-demos-discussion-nsf/MainTopic?start=0&count=2',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
"count":205,
"docs":[
{
"_id":"53f22101edf3aa08da052184",
"source":"api.v1.js",
"db":"dev-londc-com-demos-discussion-nsf",
"collection":"MainTopic",
"timestamp":"2014-06-18T15:51:29.205Z",
"level":"info",
"message":"Get Collection",
"user":"support@londc.com"
},
{
"_id":"53f22101edf3aa08da052189",
"source":"api.v1.js",
"db":"dev-londc-com-demos-discussion-nsf",
"collection":"MainTopic",
"timestamp":"2014-06-18T15:51:29.307Z",
"level":"info",
"message":"Get Collection",
"user":"support@londc.com"
}
]}
```

### HTTP Request
`GET https://ldcvia.com/1.0/activity/:database/:collectionname`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | The name of the collection to look for logs of

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
count | 30 | The number of documents to get data for.
start | 0 | the position in the results to start at

## Get Single Document Logs
To filter logs at a document level, add the database name, collection name and document unid to the URL structure

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Get The most recent 30 logs for a document
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray getDocActivity(String dbname, String collection, String unid) throws ClientProtocolException, IOException, JsonException{
	String responseBody = loadURL("/1.0/activity/" + dbname + "/" + collection + "/" + unid);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

  return json.getArray(docs);
}

/**
 * Helper method to request a URL from the LDC Via service
 * @param url
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String loadURL(String url) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet(this.baseurl + url);

	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
	httpget.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httpget, responseHandler);
}
```

```javascript
$.ajax({
  dataType: 'json',
  type: 'GET',
  headers: {
    'apikey': apikey
  },
  url: '/1.0/activity/dev-londc-com-demos-discussion-nsf/MainTopic/CBF71C6B10257F5C80257D1900261D7A?start=0&count=2',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
  "count": 308,
  "data": [
    {
      "_id": "54e59614a969c4da7049c85d",
      "collection": "MainTopic",
      "document": "CBF71C6B10257F5C80257D1900261D7A",
      "timestamp": "2015-02-19T07:51:48.826Z",
      "level": "info",
      "message": "Get Response Heirarchy",
      "user": "fred@ldcvia.com"
    },
    {
      "_id": "54e59614a969c4da7049c85c",
      "collection": "MainTopic",
      "document": "CBF71C6B10257F5C80257D1900261D7A",
      "timestamp": "2015-02-19T07:51:48.807Z",
      "level": "info",
      "message": "Get Document",
      "user": "fred@ldcvia.com"
    }
  ]
}
```

### HTTP Request
`GET https://ldcvia.com/1.0/activity/:database/:collectionname/:unid`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | The name of the collection to get the document from
:unid | The unid of the document to get logs for

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
count | 30 | The number of documents to get data for.
start | 0 | the position in the results to start at

## Search Single Document Logs

To further filter logs at a document level, add the database name, collection name and document unid to the URL structure and then POST whatever filters are required

```java
package com.ldcvia.rest;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.xsp.extlib.util.ExtLibUtil;

/**
 * Search Document Activity Logs
 *  
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 * @throws JsonException
 */
public JsonJavaArray searchDocumentLogs(String dbname, String collection, String unid) throws ClientProtocolException, IOException, JsonException{
  String data = "{" +
    "\"startdate\": {\"year\": 2014, \"month\": 6, \"day\": 1}," +
    "\"enddate\": {\"year\": 2014, \"month\": 7, \"day\": 1}," +
    "\"filters\": [" +
    "  {\"operator\": \"equals\", \"field\": \"level\", \"value\": \"info\"}" +
    "]" +
  "}";
	postURL("/1.0/activity/" + dbname + "/" + collection + "/" + unid, data);
  JsonJavaFactory factory = JsonJavaFactory.instanceEx;
  JsonJavaObject json = (JsonJavaObject) JsonParser.fromJson(factory, responseBody);

  return json.getArray("docs");
}

/**
 * Helper method to post data to a URL from the LDC Via service
 * @param url
 * @param data
 * @return
 * @throws ClientProtocolException
 * @throws IOException
 */
private String postURL(String url, String data) throws ClientProtocolException, IOException {
	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpPut httppost = new HttpPost(this.baseurl + url);
  StringEntity input = new StringEntity(data);
	input.setContentType("application/json");
	httppost.setEntity(input);
	// Create a custom response handler
	ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

		public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
			int status = response.getStatusLine().getStatusCode();
			if (status >= 200 && status < 300) {
				HttpEntity entity = response.getEntity();
				return entity != null ? EntityUtils.toString(entity) : null;
			} else {
				throw new ClientProtocolException("Unexpected response status: " + status);
			}
		}

	};
  httppost.addHeader("apikey", "MYSECRETAPIKEY");
	return httpclient.execute(httppost, responseHandler);
}
```

```javascript
var data = {
  "startdate": {"year": 2015, "month": 2, "day": 1},
  "enddate": {"year": 2014, "month": 3, "day": 1},
  "filters": [
    {"operator": "equals", "field": "level", "value": "info"}
  ]
}
$.ajax({
  dataType: 'json',
  type: 'POST',
  data: data,
  headers: {
    'apikey': apikey
  },
  url: '/1.0/activity/dev-londc-com-demos-discussion-nsf/MainTopic/CBF71C6B10257F5C80257D1900261D7A?start=0&count=2',
  success: function(res) {
    //Do Something
  }
})
```

> The above returns JSON structured like this:

```json
{
  "count": 308,
  "data": [
    {
      "_id": "54e59614a969c4da7049c85d",
      "collection": "MainTopic",
      "document": "CBF71C6B10257F5C80257D1900261D7A",
      "timestamp": "2015-02-19T07:51:48.826Z",
      "level": "info",
      "message": "Get Response Heirarchy",
      "user": "fred@ldcvia.com"
    },
    {
      "_id": "54e59614a969c4da7049c85c",
      "collection": "MainTopic",
      "document": "CBF71C6B10257F5C80257D1900261D7A",
      "timestamp": "2015-02-19T07:51:48.807Z",
      "level": "info",
      "message": "Get Document",
      "user": "fred@ldcvia.com"
    }
  ]
}
```

### HTTP Request
`GET https://ldcvia.com/1.0/activity/:database/:collectionname/:unid`

### URL Parameters

Parameter | Description
--------- | -----------
:database | This is the unique name of the database which can be accessed using the databases service.
:collectionname | The name of the collection containing the document to look for logs of
:unid | The unid of the document to look for logs of

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
count | 30 | The number of documents to get data for.
start | 0 | the position in the results to start at
