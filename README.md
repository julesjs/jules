![JULES - JavaScript JSON Schema Validator](https://dl.dropboxusercontent.com/u/2808807/img/jules-logo.png)
=====
**JULES - JavaScript JSON Schema Validator** (yes... another one...)   

* Easy to use
* Easy to extend
* Supports both JSON Schema draft-04 and draft-03

About
-----------
An easily extensible JavaScript JSON validator written in declarative style which enabled easy extending and pay as you go execution, minimizing the number of functions executed and conditions passed while traversing through schema.   
This way it is an open platform for experimenting with validation rules and enabling easier creation of a future scheme for all of us to benifit from.  
It supports both draft-04 and draft-03 keywords.  
One **Bad Motherfucker**...  
  
Note that this is a client side schema validator, and not a Node.js module. Well not yet... Made exclusively for validating form fields and JSON requests. (That explains the purely done object comparison and error reports for complex schemas)

Usage example
-------------
Simplest possible:
```javascript
alert(jules.validate(instance, schema)); 
//instance can be any instance od type null, boolean, integer, number, string, array, object
//schema argument can be a string url of a schema
```
  
A bit more complex:
```javascript
var a = 4, 
	b = 'you@example.com', 
	c = [1,2,3,4], 
	d = [1,2,'f', 4],
	e = {foo:1, bar: 'baz'},
	f = {foo:1, bar: 'baz', qux: true};

var schema1 = {
	"type": "integer",
	"minimum": 1,
	"maximum": 5,
	"exclusiveMaximum": true,
	"enum": [1,2,3,4]
},

schema2 = {
	"type": "string",
	"format": "email",
	"minLength" : 8,
	"maxLength" : 64
},

schema3 = {
	"type": ["integer","string"],
	"format": "email",
	"minLength" : 8,
	"maxLength" : 64,
	"minimum": 1,
	"maximum": 5,
	"multipleOf": 2,
	"exclusiveMaximum": true,
	"oneOf":[{"type":"integer", "enum": [1,2,3,4]},
		{"type":"string", "pattern": "\.com"}]
},

schema4 = {
	"definitions": {
		"someIntegers": {
			"type": "integer",
			"minimum": 1,
			"maximum": 5,
			"exclusiveMaximum": true,
			"enum": [1,2,3,4]
		}
	},
	"type": ["array"],
	"maxItems" : 16,
	"uniqueItems": true,
	"items":{
		"$ref":"#definitions/someIntegers"
	}
},

schema5 = {
	"type": ["array"],
	"maxItems" : 16,
	"uniqueItems": true,
	"items":[schema1, schema1, {
		"type": "string",
		"maxLength": 1,
		"pattern": "f"
	}, schema1],
	
	"additionalItems": false
},

schema6 = {
	"definitions": {
		"someIntegers": schema1
	},
	"type": "object",
	"maxProperties" : 2,
	"properties": {
		"foo": {
			"$ref":"#definitions/someIntegers"
		}
	},
	"patternProperties": {
		"^ba[a-z]+": {
			"type": "string",
			"maxLength": 3
		}
	},
	"dependencies": {
		"foo": ["bar"]
	},
	"additionalProperties": false
},

schema7 = JSON.parse(JSON.stringify(schema6)); //clone
schema7.maxProperties = 3;
schema7.additionalProperties = {"type": "boolean"};

//TEST
console.log('Validate `a` against `schema 1`');
console.log(jules.validate(a, schema1)); //true

console.log('Validate `b` against `schema 2`');
console.log(jules.validate(b, schema2)); //true

console.log('Validate `a` against `schema 3`');
console.log(jules.validate(a, schema3)); //true

console.log('Validate `b` against `schema 3`');
console.log(jules.validate(b, schema3)); //true

console.log('Validate `c` against `schema 4`');
console.log(jules.validate(c, schema4)); //true

console.log('Validate `d` against `schema 4`');
console.log(jules.validate(d, schema4)); //false

console.log('Validate `d` against `schema 5`');
console.log(jules.validate(d, schema5)); //true

console.log('Validate `e` against `schema 6`');
console.log(jules.validate(e, schema6)); //true

console.log('Validate `f` against `schema 6`');
console.log(jules.validate(f, schema6)); //false

console.log('Validate `f` against `schema 7`');
console.log(jules.validate(f, schema7)); //true

```

Extending example
-----------------
`soon to come`

Warnings
--------
* Objects are stringified and passed through CRC32 algorithm for faster search while doing enum or unique checks. Be warned that **{a:1,b:2} != {b:2, a:1}**. This is only a temporary solution.

* Be careful while using **$ref**, you can fall into an infinite loop.

Compatibility
-------------
The validator can validate schema defined by draft 04 and/or 03. That means that you will be able to mix different schemas, and you can extend the validator to support earlier or drafts yet to come, or even make custom keywords and rules for them or just renames. In a form of an experiment some custom keywords were added witch you might find unethical. But don't forget that you can easily chane the code to fit your liking.  
Schema for supported extension is yet to be written but you can start using the additional keywords described in the next chapter.

Supported schema keywords
-------------------------
*NOTE:* - non of the keywords are mandatory  
  
*LEGEND:*  
[d04] - only in official draft 04  
[d03] - only in official draft 03, depreciated  
[e]   - ivartech custom extension  
  
    
**[1] Meta keywords**  

Keywords used to describe the schema and not really used in validation, with some obvious exceptions.  

* **id** {string:uri} - Unique identificator of the schema, in URI format. Listen up maggots, this one is important for $ref resolving. It's usage is RECOMMENDED but if not provided the schema wil be identified by a CRC32 or $ref URI.

* **$schema** {string:uri} - If you want to check if your JSON schema is valid supply the meta-schema URI in this property and call `jules.validateSchema(your_json_schema)`. Guys who write JSON schema say it is RECOMMENDED to supply this property.

* **title** {string} - Give your schema a fancy title, this property is far from mandatory. Make sure your titles are short and meaningful.

* **description** {string} - Describe your schema here, of course this property is far from mandatory too. But if you are going to publish your schema, better put a description so others will have a notion of what is it for.

* **default** {any} - Defines a default value used if instance is undefined or validation  
  
**[2] Schema related keywords** - type independent

* **definitions** {object[object:schema]} -

* **$ref** {string:uri} - Instead of writting a schema again and again you can just reference already defined one. This keyword and it's value are used to reference self, local or external schema for validation of provided instance. If a schema doesnt have an **id** it will be assigned one via the refeference uri. The following example will give you a brief insight of how you can reference schemas:
	+ Referencing self `'$ref': '#'` - The scope becomes schema itself without a fragment so the instance is validated against the schema again. **Beware:** of the infinite loop.
	+ Referencing local schema `'$ref': '#/definitions/positiveInteger'` or for instance `'$ref': '#anyOf/0'` - The scope stays the same and the instance is validated against the schema which path is defined by a fragment. **Note:** fragments can be URL encoded.
	+ Referencing external schema `'$ref': 'http://example.com/schema'` or `'$ref': 'http://example.com/schema#definitions/positiveInteger'` - the reference can have a scope and/or a fragment. Rootschema is loaded via the scope and instance is validated depending on the fragment. If there is no fragment the instance is validated against the external schema.

* **extends** [n/a][d03] {string:uri} - *Not available in this version.* Similar as **$ref** but instead of validating instance againsts the schema, it extends the linked schema with properties of the container schema replacing the values of keywords if they match and then validates the instance against schema combined in such manner.
  
**[3] All types** - keywords that apply to all data types  

* **type** or **allow**[e] {string:type-enum | array[string:type-enum]} - Describes which data types are allowed. It can be a STRING or an ARRAY of strings that represent names of data types that can be passed. JSON data types are: 
	+ null
	+ boolean
	+ integer - integer only
	+ number - integer and float
	+ string
	+ array 
	+ object
	+ any | * | empty string  
	  
	If this property is not provided, it will be assumed that any/all data types are allowed.

* **disallow** [d03] {string:type-enum | array[string:type-enum]} - Describes which data types are NOT allowed. Can be a string or an array of strings, see **type**.

* **enum** or **only** [e] {array[any]} - Lists all allowed values in an array. Your instance MUST be equal to one of lisred values. Objects and array values are submited to CRC32 so the search could be performed faster (via hash tables). **NOTE:** That properties in object are stored without an order, so `{a:1,b:2} !== {b:2, a:1}`

* **forbidden** [e] {array[any]} - Lists all forbidden values of an instance. Your instance MUST NOT equal to any of forbidden values. See **enum**.

* **min** [e] {number | object:range-object | array[object:range-object]} - Represents a minimum for all data types. It can be just a number and in that form it limits the size of an array or string, number of properties in an object, or minimal value for a number or an integer. If we want the minimum to be exclusive we can write the 'min' keyword value as a range-object: `'min':{ 'value': 3, 'exclusive': true}`, so the instance value has to be more than 3, or to be longer than 3, or to have more than three properties. If we want to define minimum for each separate data type, that is if we validate more than one data type with one schema, we can write an array of range object adding a property 'type' to them. For example:  
```javascript
	'min':[{'type': 'object', 'value':5, 'exclusive': true},  /* requires the object 
	instance to have minimum of 6 properties */
		{'type':'string', 'value':3}, //only for string  
		{'value': 2} //for any other type  
	]
```
A special example would be if you define min like this: `min:{type:string, value:4}`, which would mean that this minimum will be applied only when a type is string, for other types this minimum will validate as true.  
**NOTE:** Float minimum values are only allowed for number type. In other cases they dont make sense.

* **max** [e] {number | object:range-object | array[object:range-object]} - Defines a maximum for all data types. Same as **min**, see it for usage details.

* **if** [e] {object:condition-object | array[object:condition-object]} - Used to make conditions inside a schema. That means if a schema that is presented as a condition passes then one schema must pass else if it fails some other schema must pass. The value of this keyword must be an object structured as a condition object, or an array of contiditon objects. Structure of a condition object looks like this:
```javascript
	'if': {
		'not': false,
		'condition': {condition_schema},
		'then': {then_schema},
		'else': {else_schema}
	}
```
	Properties of a condition object are as follows:
	+ not {boolean} - not mandatory, defines the negation of condition
	+ condition {object:schema} - mandatory, MUST be a valid schema
	+ then {object:schema} - mandatory, MUST be a valid schema
	+ else {object:schema} - not mandatory, MUST be a valid schema  
	  
	You can nest conditions of course.  
	Even though the same result can be achieved with oneOf, anyOf, allOf, not, one must argue that this approach to logic is more elegant.

* **required** {boolean[d03] | array[string][d04]} - Required keyword can be used in two ways. If it is a boolean then it can be used as defined in draft 03, which says that the instance validated must not be undefined. This can be used in more 'meta' manner, for example labeling that the instance is mandatory. If the keyword value is array of strings it behaves as described in draft 04, as a list of required/mandatory pattern names. If you desire, you can use the keyword as boolean and provide the required/mandatory properties under **requiredProperties**.

* **anyOf** [d04] {array[object:schema]} - One or more provided schemas in an array must validate the instance. Value of this keyword MUST be an array and it MUST have one or more valid schemas.

* **allOf** [d04] {array[object:schema]} - All of provided schemas in an array must validate the instance. Value of this keyword MUST be an array and it MUST have one or more valid schemas.

* **oneOf** [d04] {array[object:schema]} - One and only one of provided schemas in an array must validate the instance. Value of this keyword MUST be an array and it MUST have one or more valid schemas.

* **not** [d04] {array[object:schema]} - Any of provided schemas in an array MUST NOT validate the instance. Value of this keyword MUST be an array and it MUST have one or more valid schemas.  

**[4] Number**

* **minimum** {number} - Defines instance's minimum value if the instance is number. Non exclusive. It MUST be a number (integer or float).

* **exclusiveMinimum** {boolean} - If the minimum is exclusive or not. Default value is false. If this keyword is provided minimum value MUST also be provided, that is, it depends on minimum keyword.

* **maximum** {number} - Defines instance's maximum value if the instance is number. Non exclusive. It MUST be a number (integer or float).

* **exclusiveMaximum** {boolean} - If the maximum is exclusive or not. Default value is false. If this keyword is provided maximum value MUST also be provided, that is, it depends on maximum keyword.

* **numberPattern** [e] or **numberRegex** [e] {string:regex} - Validates a number against a Regular Expression built from a provided string writen in compilance to JavaScript's ECMA-262 standard. You can form the string in two ways `"ab+c"` or `"/ab+c/gi"`. It turns the number to string and tests the RegExp.

* **multipleOf** [d04] or **dividableBy** [d03] {number != 0} - If the number instance is dividable/multiple of provided number. Provided dividableBy number MUST NOT be 0.  

**[5] String**

* **pattern** or **regex** [e] {string:regex} - Validates a string instance against a Regular Expression built from a provided string writen in compilance to JavaScript's ECMA-262 standard. You can form the string in two ways `"ab+c"` or `"/ab+c/gi"`. Regex is just a self explanatory rename.

* **format** [d04] {string:available-format-names} - Values of this keyword are predifined names of common regular expressions. Currently you can use one of the available at the time: `uri, regex, time, email`. More expressions are soon to come, nevertheless you can extend the set yourself. For ways how to do it, see **Extending example** chapter.

* **minLength** {+integer=0} - Minimum number of characters. Must be a positive integer. Default value is 0.

* **maxLength** {+integer} - Maximum number of characters. Must be a positive integer.  

**[6] Array**

* **uniqueItems** or **unique** [e] {boolean=false} - Check if the contents of the array are unique. If the value repeats itself validation fails. Default value is false. **Remember** object comparison is performed by CRC32!

* **items** {object:schema | array[object:schema]} - Can be an object which is a valid schema or an array of valid schema objects. If it is a schema, each item in the array is validated against this schema. If it is an array of schemas, each array item is validated by a schema of the same index position.
 
* **additionalItems** {boolean=true} - If this motherfucker is false, and if an array instance has more items than specified in schema keyword items, this motherfucker fails the validation. We happy?

* **minItems** {+integer=0} - Defines minimum allowed items in an array instance. MUST be a positive integer. Default value is zero.

* **maxItems** {+integer} - Defines maximum allowed items in an array instance. MUST be a positive integer. Default value is zero.

**[7] Object**

* **required** [d04] or **requiredProperies** [e] {array[string:property-names]} - List of required property names in an array. This value MUST be an array. If you want to use required as noted in draft 03, to label the instance as mandatory, use requredProperties to note required properties of course.

* **properties** {object[object:schema]} - Object that contains schemas under properties named as expected properties of the instance object. Each property of the instance objet is validated against the correct schema. **NOTE:** You can use regular expressions as property names in this section of a schema, labeling them between '/' and adding the regex options at the end like `"/ab+c/gi"`. This might be removed, cause it might piss you off, if you use paths as a property name. But when i come to think of it, there is no reason it shouldn't work, except when you same your paths /something/gi, something/ig... :) **Be warned!**
 
* **patternProperties** {object[object:schema]} - Use regular expression strings to select properties of an object instance and test them against correct schemas. All properties of an instance that match one schema formed property under this keyword will be tested against the supplied schema. Regular expression properties can be written in two ways `"ab+c"` or with properties `"/ab+c/gi"`.

* **additionalProperties** {boolean=true | object:schema} - If this schema property is false then all of instance object's properties must be covered with schemas defined in properties and patternProperties segment of the schema. If there are any that are not covered the validation fails. In other words only properties defined in properties and patternProperties are allowed. The keyword can also be one schema for all other additional properies. Default value is true, which means that additional properties are allowed.

* **dependencies** {object[array[string:property-names]]} -  It is an object that hold arrays in properties labeled as expected properties of an instance object. Arrays contain strings of property names the labeled property name depends on. If there are no such propertis the validation fails.

* **minProperties** {+integer=0} - Minimal number of properties. MUST be a positive integer. Default value is zero.
* **maxProperties** {+integer} - Maximum number of properties. MUST be a positive integer.

More details
------------

JSON Schema draft 04: http://json-schema.org/latest/json-schema-validation.html  
JSON Schema draft 03: http://tools.ietf.org/html/draft-zyp-json-schema-03

To Do
-----
- [ ] Schema extends
- [ ] Refactor the code (this will enable all other tasks to be completed with ease)
- [ ] Better errors. Point out whitch part of the schema failed the validation.
- [ ] Better $ref resolving, forbid the infinite loop
- [ ] Comment the code! The thing you hate the most... but dont come back whining who's code is this after a year...
- [ ] Hyper Schema
- [ ] Node.js package

Authors
-------
![ivartech.com](https://dl.dropboxusercontent.com/u/2808807/img/ivartech-watermark.png)

* Sir Nikola Stamatovic Stamat of [IVARTECH][http://ivartech.com]

	In consultation about extensions with:  
* Sir Marko Maletic Kokos of [IVARTECH][http://ivartech.com]

Artwork: Silhouette taken from http://la-feuille-verte.tumblr.com/post/34228956696/pulp-fiction-silhouette and font from http://www.dafont.com/pulp-fiction-m54.font. Thanks!

Licence
-------
**Motherfuckin' MIT** protects our ass...

`
Copyright (C) 2013. ivartech.com - Nikola Stamatovic Stamat < stamat@ivartech.com >
  
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  
  
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  
  
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`  

Curiosities
-----------
Since all of the simple and selfexplanatory names were taken, like JSV or schema.js, or whatever... I wanted to name it JVlS, and then said to myself: "Chill that fuckin' bitch out!" So in that manner:   
  
Name comes from a Quentin Tarantino's movie "Pulp Finction" character named Jules Winnfield, portrayed by Samuel L. Jackson. The reason is the famous quote: *'There's a passage I got memorized. Ezekiel 25:17. "The path of the righteous man is beset on all sides by the inequities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of the darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who attempt to poison and destroy My brothers. And you will know I am the Lord when I lay My vengeance upon you."'*

*Vincent*: And you know what they call a... a... a Quarter Pounder with Cheese in Paris?  
*Jules*: They don't call it a Quarter Pounder with cheese?  
*Vincent*: No man, they got the metric system. They wouldn't know what the fuck a Quarter Pounder is.  
*Jules*: Then what do they call it?  
*Vincent*: They call it a Royale with cheese.  
