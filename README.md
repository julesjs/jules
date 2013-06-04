JULES
=====
**JavaScript JSON Schema Validator** (yes... another one...)   

* [d04] [JSON Schema draft 04][http://json-schema.org/latest/json-schema-core.html] (compatible) - [(schema^)][http://json-schema.org/draft-04/schema]
* [d03] [JSON Schema draft 03][http://tools.ietf.org/html/draft-zyp-json-schema-03] (partially compatible, extends is an exception) - [(schema^)][http://json-schema.org/draft-03/schema]

* [e] JSON Schema 04+03+extensions hybrid - [(schema^)][]

About
-----------
An easily extensible JavaScript JSON validator written in declarative style which enabled easy extending and pay as you go execution, minimizing the number of functions executed and conditions passed while traversing through schema.   
This way it is an open platform for experimenting with validation rules and enabling easier creation of a future scheme for all of us to benifit from.

Usage example
-------------
`soon to come`

Extending example
-----------------
`soon to come`

Warnings
--------
* Objects are stringified and passed through CRC32 algorithm for faster search while doing enum or unique checks. Be warned that **{a:1,b:2} != {b:2, a:1}**. This is only a temporary solution.

* Be careful while using **$ref**, you can fall into an infinite loop.

Compatibility
-------------
The validator can validate schema defined by draft 04 and/or 03. That means that you will be able to mix different schemas, and you can extend the validator to support earlier or drafts yet to come, or even make custom keywords and rules for them or just renames. In a form of an experiment some custom keywords were added in order to improve validation flexibility.  
You might find them unethical, and I am very well aware that we should support the draft in it's transition to a standard but fresh ideas in an early stadium are good too. I am also aware that conditions can be done using oneOf, anyOf, allOf and/or not, but I found it more elegant this way. Schema for supported extension is yet to be written but you can start using the additional keywords described in the next chapter.

Supported schema keywords
-------------------------
*!note* - non of the keywords are mandatory  
  
*Legend*:  
[d04] - only in official draft 04  
[d03] - only in official draft 03, depreciated  
[e]   - ivartech custom extension  
  
    
**[1] Meta keywords**  

Keywords used to describe the schema and not really used in validation, with some obvious exceptions.  

* **id** {string:uri} - Unique identificator of the schema, in URI format. Listen up maggots, this one is important for $ref resolving. It's usage is RECOMMENDED but if not provided the schema wil be identified by a CRC32 or $ref URI.

* **$schema** {string:uri} - If you want to check if your JSON schema is valid supply the meta-schema URI in this property and call `jules.validateSchema(your_json_schema)`. Guys who write JSON schema say it is RECOMMENDED to supply this property.

* **title** {string} - Give your schema a fancy title, this property is far from mandatory. Make sure your titles are short and meaningful.

* **description** {string} - Describe your schema here, of course this property is far from mandatory too. But if you are going to publish your schema, better put a description so others will have a notion of what is it for.
  
**[2] All types** - keywords that apply for all data types
  
* **type** or **allow**[e] {string:type-enum | array[string:type-enum]}- Describes which data types are allowed. It can be a STRING or an ARRAY of strings that represent names of data types that can be passed. JSON data types are: 
	+ null
	+ boolean
	+ integer - integer only
	+ number - integer and float
	+ string
	+ array 
	+ object
	+ any | * | empty string  
  
If this property is not provided, it will be assumed that any/all data types are allowed.

* **disallow**[d03] {string:type-enum | array[string:type-enum]} - Describes which data types are NOT allowed. Can be a string or an array of strings, see **type**.

* **enum** or **only**[e] {array[any]} - Lists all allowed values in an array. Your instance MUST be equal to one of lisred values. Objects and array values are submited to CRC32 so the search could be performed faster (via hash tables). **NOTE:** That properties in object are stored without an order, so `{a:1,b:2} !== {b:2, a:1}`

* **forbidden**[e] {array[any]} - Lists all forbidden values of an instance. Your instance MUST NOT equal to any of forbidden values. See **enum**.

* **min**[e] {number | object:range-object | array[object:range-object]} - Represents a minimum for all types. It can be just a number and in that form it limits the size of an array or string, number of properties in an object, or minimal value for a number or an integer. If we want the minimum to be exclusive we can write the 'min' keyword value as a range-object: `min:{ value: 3, exclusive: true}`, so the instance value has to be more than 3, or to be longer than 3, or to have more than three properties. If we want to define minimum for each separate type, that is if we validate more than one data type with one schema, we can write an array of range object adding a property 'type'. For example:  
```javascript
	min:[{type: 'object', value:5, exclusive: true},  
		{type:'string', value:3}, //only for string  
		{value: 2} //for any other type
	]```

Authors
-------
Sir Nikola Stamatovic Stamat of [IVARTECH][http://ivartech.com]

Other
-----
Name comes from a Quentin Tarantino's movie "Pulp Finction" character named Jules, portrayed by Samuel L. Jackson. The reason is the famous quote: *'There's a passage I got memorized. Ezekiel 25:17. "The path of the righteous man is beset on all sides by the inequities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of the darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who attempt to poison and destroy My brothers. And you will know I am the Lord when I lay My vengeance upon you."'*
