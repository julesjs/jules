JULES
=====
**JavaScript JSON Schema Validator** (yes... another one...)   

* [JSON Schema draft 04][http://json-schema.org/latest/json-schema-core.html] (compatible) - [(schema^)][http://json-schema.org/draft-04/schema]
* [JSON Schema draft 03][http://tools.ietf.org/html/draft-zyp-json-schema-03] (partially compatible, extends is an exception) - [(schema^)][http://json-schema.org/draft-03/schema]

* JSON Schema 04+03+extensions hybrid - [(schema^)][]

Short about
-----------
Yeah...

Usage example
-------------

Compatibility
-------------
`soon to come`

Supported schema keywords
-------------------------
**[1] Meta keywords**

Keywords used to describe the schema and not really used in validation, with some obvious exceptions.

* **id** - Unique identificator of the schema, in URI format. Listen up maggots, this one is important for $ref resolving. It's usage is RECOMMENDED but if not provided the schema wil be identified by a CRC32 or $ref URI.

* **$schema** - If you want to check if your JSON schema is valid supply the meta-schema URI in this property and call `jules.validateSchema(your_json_schema)`. Guys who write JSON schema say it is RECOMMENDED to supply this property.

* **title** - Give your schema a fancy title, this property is far from mandatory. Make sure your titles are short and meaningful.

* **description** - Describe your schema here, of course this property is far from mandatory too. But if you are going to publish your schema, better put a description so others will have a notion of what is it for.

**[2] All types ** - keywords that apply for all data types

* **type** or ^**allow** - Which datatypes are allowed. It can be a string or an array of strings that represent names of data types that can be passed. JSON data types are: 
	+ null
	+ boolean
	+ integer 
	+ number
	+ string
	+ array 
	+ object
	+ any


Author
------
Sir Nikola Stamatovic Stamat of [IVARTECH][http://ivartech.com]

Other
-----
Name comes from a Quentin Tarantino's movie "Pulp Finction" character named Jules, portrayed by Samuel L. Jackson. The reason is the famous quote: *'There's a passage I got memorized. Ezekiel 25:17. "The path of the righteous man is beset on all sides by the inequities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of the darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who attempt to poison and destroy My brothers. And you will know I am the Lord when I lay My vengeance upon you."'*
